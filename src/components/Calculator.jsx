import { useState } from 'react'
import { FlaskConical } from 'lucide-react'
import Display from './Display'
import Keypad from './Keypad'
import ScientificKeypad from './ScientificKeypad'
import { evaluateExpression } from '../utils/evaluate'

export default function Calculator() {
  const [history, setHistory] = useState([])
  const [currentValue, setCurrentValue] = useState('0')
  const [waitingForNewValue, setWaitingForNewValue] = useState(false)
  const [hasEvaluated, setHasEvaluated] = useState(false)
  const [isScientific, setIsScientific] = useState(false)

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

  const calculate = () => {
    if (currentValue === 'Error' || hasEvaluated) return

    const tokens = [...history]
    if (!waitingForNewValue) {
      tokens.push(currentValue)
    }

    const result = evaluateExpression(tokens)
    
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
      case 'calculate': calculate(); break;
      case 'clear': handleClear(); break;
      case 'delete': handleDelete(); break;
      default: break;
    }
  }

  return (
    <div className={`glass-panel rounded-3xl p-6 flex flex-col gap-5 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden ${isScientific ? 'w-[540px]' : 'w-[340px]'}`}>
      
      {/* Mode Toggle Header */}
      <div className="w-full flex justify-between items-center mb-[-8px]">
         <div className="text-white/40 text-xs font-bold tracking-widest uppercase ml-1">
            {isScientific ? 'Scientific' : 'Standard'}
         </div>
         <button 
           onClick={() => setIsScientific(!isScientific)}
           className={`h-8 px-3 rounded-full flex items-center justify-center gap-2 text-sm font-medium transition-all ${isScientific ? 'bg-indigo-500/20 text-indigo-300' : 'bg-white/5 hover:bg-white/10 text-white/70'}`}
           title="Toggle Scientific Mode"
         >
           <FlaskConical size={14} />
           {isScientific ? 'ON' : 'OFF'}
         </button>
      </div>

      <Display history={history} currentValue={currentValue} />
      
      <div className="flex gap-4 items-end">
         <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex-shrink-0 ${isScientific ? 'w-[160px] opacity-100' : 'w-0 opacity-0'}`}>
            <ScientificKeypad onAction={handleAction} />
         </div>
         <div className="flex-1 flex-shrink-0 min-w-[292px]">
            <Keypad onAction={handleAction} />
         </div>
      </div>
    </div>
  )
}
