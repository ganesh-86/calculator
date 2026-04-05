import { useState, useEffect } from 'react'
import { FlaskConical, History } from 'lucide-react'
import Display from './Display'
import Keypad from './Keypad'
import ScientificKeypad from './ScientificKeypad'
import MemoryBar from './MemoryBar'
import HistorySidebar from './HistorySidebar'
import { evaluateExpression } from '../utils/evaluate'

export default function Calculator() {
  const [history, setHistory] = useState([])
  const [currentValue, setCurrentValue] = useState('0')
  const [waitingForNewValue, setWaitingForNewValue] = useState(false)
  const [hasEvaluated, setHasEvaluated] = useState(false)
  
  // UI States
  const [isScientific, setIsScientific] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  // Memory State
  const [memoryValue, setMemoryValue] = useState(0)

  // Local Storage Hook Simulation
  const [calculationHistory, setCalculationHistory] = useState(() => {
    const saved = localStorage.getItem('calcHistory');
    return saved ? JSON.parse(saved) : [];
  })

  // Synchronize history logs into local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('calcHistory', JSON.stringify(calculationHistory));
  }, [calculationHistory]);

  const handleNumber = (num, isConstant = false) => {
    if (currentValue === 'Error') handleClear()

    if (hasEvaluated) {
      setCurrentValue(isConstant ? num : (num === '.' ? '0.' : num))
      setHistory([])
      setHasEvaluated(false)
      setWaitingForNewValue(false)
    } else if (waitingForNewValue) {
      setCurrentValue(isConstant ? num : (num === '.' ? '0.' : num))
      setWaitingForNewValue(false)
    } else if (currentValue === '0' && num !== '.') {
      setCurrentValue(num)
    } else if (num === '.' && currentValue.includes('.')) {
      return
    } else if (isConstant) {
      setCurrentValue(num)
    } else {
      if (currentValue === 'π' || currentValue === 'e') {
        setCurrentValue(num)
      } else {
        setCurrentValue(currentValue + num)
      }
    }
  }

  const handleOperator = (op) => {
    if (currentValue === 'Error') return

    if (hasEvaluated) {
      setHistory([currentValue, op])
      setHasEvaluated(false)
      setWaitingForNewValue(true)
    } else if (waitingForNewValue && history.length > 0) {
      const lastOp = history[history.length - 1];
      if (['+', '-', '×', '÷', '^'].includes(lastOp)) {
         const newHistory = [...history]
         newHistory[newHistory.length - 1] = op
         setHistory(newHistory)
      } else {
         setHistory([...history, op])
      }
    } else {
      setHistory([...history, currentValue, op])
      setWaitingForNewValue(true)
    }
  }

  const handleUnary = (op) => {
    if (currentValue === 'Error') return;

    if (hasEvaluated) {
      if (op === '²') {
         setHistory([currentValue, op]);
         setHasEvaluated(false);
         setWaitingForNewValue(true);
      } else {
         setHistory([op]);
         setCurrentValue('0');
         setHasEvaluated(false);
         setWaitingForNewValue(true);
      }
    } else {
      if (op === '²') {
         if (!waitingForNewValue) {
            setHistory([...history, currentValue, op]);
            setWaitingForNewValue(true);
         }
      } else {
         if (!waitingForNewValue) {
            setHistory([...history, currentValue, '×', op]);
         } else {
            setHistory([...history, op]);
         }
         setCurrentValue('0');
         setWaitingForNewValue(true);
      }
    }
  }

  const handleMemory = (op) => {
    const currentNum = parseFloat(currentValue);
    if (isNaN(currentNum)) return;

    if (op === 'MC') setMemoryValue(0);
    else if (op === 'MR') {
       if (hasEvaluated) {
          setHistory([]);
          setHasEvaluated(false);
          setWaitingForNewValue(false);
       } else if (waitingForNewValue) {
          setWaitingForNewValue(false);
       }
       setCurrentValue(memoryValue.toString());
    }
    else if (op === 'M+') setMemoryValue(memoryValue + currentNum);
    else if (op === 'M-') setMemoryValue(memoryValue - currentNum);
  }

  const calculate = () => {
    if (currentValue === 'Error' || hasEvaluated) return

    const tokens = [...history]
    if (!waitingForNewValue) {
      tokens.push(currentValue)
    }

    const result = evaluateExpression(tokens)
    
    // Add robust operations to the sidebar LocalStorage cache
    if (result !== 'Error' && tokens.length > 1) {
       setCalculationHistory(prev => [
         { formula: tokens.join(' ') + ' =', result },
         ...prev
       ])
    }

    setHistory([...tokens, '='])
    setCurrentValue(result)
    setHasEvaluated(true)
    setWaitingForNewValue(true)
  }

  const handleClear = () => {
    setHistory([])
    setCurrentValue('0')
    setWaitingForNewValue(false)
    setHasEvaluated(false)
  }

  const handleDelete = () => {
    if (hasEvaluated || waitingForNewValue) return
    if (currentValue === 'Error') {
      handleClear()
      return
    }
    if (currentValue.length === 1 || (currentValue.length === 2 && currentValue.startsWith('-')) || currentValue === 'π' || currentValue === 'e') {
      setCurrentValue('0')
    } else {
      setCurrentValue(currentValue.slice(0, -1))
    }
  }

  const handleAction = (type, value) => {
    if (currentValue === 'Error' && type !== 'clear') {
       handleClear();
    }
    switch (type) {
      case 'number': handleNumber(value); break;
      case 'constant': handleNumber(value, true); break;
      case 'unary': handleUnary(value); break;
      case 'operator': handleOperator(value); break;
      case 'memory': handleMemory(value); break;
      case 'calculate': calculate(); break;
      case 'clear': handleClear(); break;
      case 'delete': handleDelete(); break;
      default: break;
    }
  }

  // Smooth UI Transition Controller
  const getContainerWidth = () => {
     if (isScientific && isHistoryOpen) return 'w-[800px]'
     if (isScientific) return 'w-[540px]'
     if (isHistoryOpen) return 'w-[608px]'
     return 'w-[340px]'
  }

  return (
    <div className={`glass-panel rounded-3xl p-6 flex transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden ${getContainerWidth()}`}>
      
      {/* 1. LEFT PANE: Scientific Keypad */}
      <div className={`flex items-end overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex-shrink-0 ${isScientific ? 'w-[160px] opacity-100 mr-5' : 'w-0 opacity-0 mr-0'}`}>
         <ScientificKeypad onAction={handleAction} />
      </div>

      {/* 2. CENTER PANE: Core Calculator */}
      <div className="flex flex-col gap-4 flex-1 flex-shrink-0 min-w-[292px]">
          {/* Header toggles */}
          <div className="w-full flex justify-between items-center mb-[-6px]">
             <button 
               onClick={() => setIsScientific(!isScientific)}
               className={`h-8 px-3 rounded-full flex items-center justify-center gap-2 text-xs font-semibold tracking-wider uppercase transition-all ${isScientific ? 'bg-indigo-500/20 text-indigo-300' : 'bg-white/5 hover:bg-white/10 text-white/50'}`}
               title="Toggle Scientific Mode"
             >
               <FlaskConical size={14} /> {isScientific ? 'ON' : 'OFF'}
             </button>
             <button 
               onClick={() => setIsHistoryOpen(!isHistoryOpen)}
               className={`h-8 px-3 rounded-full flex items-center justify-center gap-2 text-xs font-semibold tracking-wider transition-all ${isHistoryOpen ? 'bg-rose-500/20 text-rose-300' : 'bg-white/5 hover:bg-white/10 text-white/50'}`}
               title="Toggle History"
             >
               Logs <History size={14} />
             </button>
          </div>

          <Display history={history} currentValue={currentValue} />
          <MemoryBar onAction={handleAction} memoryValue={memoryValue} />
          <Keypad onAction={handleAction} />
      </div>

      {/* 3. RIGHT PANE: History Sidebar */}
      <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex-shrink-0 ${isHistoryOpen ? 'w-[240px] opacity-100 ml-5' : 'w-0 opacity-0 ml-0'}`}>
         <HistorySidebar historyList={calculationHistory} onClear={() => setCalculationHistory([])} />
      </div>
      
    </div>
  )
}
