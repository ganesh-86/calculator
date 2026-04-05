import { useState, useEffect } from 'react'
import { FlaskConical, History, Moon, Sun, Palette, Ruler } from 'lucide-react'
import Display from './Display'
import Keypad from './Keypad'
import ScientificKeypad from './ScientificKeypad'
import MemoryBar from './MemoryBar'
import HistorySidebar from './HistorySidebar'
import UnitConverter from './UnitConverter'
import { evaluateExpression } from '../utils/evaluate'

export default function Calculator() {
  const [history, setHistory] = useState([])
  const [currentValue, setCurrentValue] = useState('0')
  const [waitingForNewValue, setWaitingForNewValue] = useState(false)
  const [hasEvaluated, setHasEvaluated] = useState(false)
  
  // UI States
  const [isScientific, setIsScientific] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isConverterOpen, setIsConverterOpen] = useState(false)

  // Memory State
  const [memoryValue, setMemoryValue] = useState(0)

  // System Sync Hooks
  const [calculationHistory, setCalculationHistory] = useState(() => {
    const saved = localStorage.getItem('calcHistory');
    return saved ? JSON.parse(saved) : [];
  })

  // Theme Sync
  const themes = ['rose', 'emerald', 'amber', 'ocean', 'purple'];
  const [themeIndex, setThemeIndex] = useState(() => {
     const stored = localStorage.getItem('calcTheme');
     return stored !== null ? parseInt(stored) : 0;
  });

  useEffect(() => {
    localStorage.setItem('calcHistory', JSON.stringify(calculationHistory));
  }, [calculationHistory]);

  useEffect(() => {
     document.documentElement.setAttribute('data-theme', themes[themeIndex]);
     localStorage.setItem('calcTheme', themeIndex);
  }, [themeIndex]);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
  }

  const cycleTheme = () => {
     setThemeIndex((prev) => (prev + 1) % themes.length);
  }

  const isErrorState = (val) => ['Error', 'Div by zero', 'NaN', 'Overflow'].includes(val);

  const handleNumber = (num, isConstant = false) => {
    if (isErrorState(currentValue)) handleClear()

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
    if (isErrorState(currentValue)) return

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
    if (isErrorState(currentValue)) return;

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
    if (isErrorState(currentValue) || hasEvaluated) return

    const tokens = [...history]
    if (!waitingForNewValue) {
      tokens.push(currentValue)
    }

    const result = evaluateExpression(tokens)
    
    if (!isErrorState(result) && tokens.length > 1) {
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

  const handleSpeechTokens = (tokens) => {
     const result = evaluateExpression(tokens);
     const hasEquals = tokens[tokens.length-1] === '=';
     let calcTokens = [...tokens];
     if (hasEquals) calcTokens.pop();

     if (!isErrorState(result)) {
       if (calcTokens.length > 1) {
          setCalculationHistory(prev => [
            { formula: calcTokens.join(' ') + ' =', result },
            ...prev
          ]);
       }
       setHistory([...calcTokens, '=']);
       setCurrentValue(result);
       setHasEvaluated(true);
       setWaitingForNewValue(true);
     } else {
       setHistory(calcTokens);
       setCurrentValue(result);
       setHasEvaluated(false);
       setWaitingForNewValue(false);
     }
  }

  const handleClear = () => {
    setHistory([])
    setCurrentValue('0')
    setWaitingForNewValue(false)
    setHasEvaluated(false)
  }

  const handleDelete = () => {
    if (hasEvaluated || waitingForNewValue) return
    if (isErrorState(currentValue)) {
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
    if (isErrorState(currentValue) && type !== 'clear') {
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

  // Keyboard Event Configuration
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isConverterOpen) return; // Prevent mapping inside converter modal
      const key = e.key;
      if (/[0-9]/.test(key)) handleAction('number', key);
      else if (key === '.') handleAction('number', '.');
      else if (key === '+') handleAction('operator', '+');
      else if (key === '-') handleAction('operator', '-');
      else if (key === '*') handleAction('operator', '×');
      else if (key === '/') { e.preventDefault(); handleAction('operator', '÷'); }
      else if (key === '^') handleAction('operator', '^');
      else if (key === 'Enter' || key === '=') { e.preventDefault(); handleAction('calculate'); }
      else if (key === 'Backspace') handleAction('delete');
      else if (key === 'Escape') handleAction('clear');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [history, currentValue, waitingForNewValue, hasEvaluated, memoryValue, isConverterOpen]);

  // Smooth UI Transition Controller
  const getContainerWidth = () => {
     if (isScientific && isHistoryOpen) return 'w-[800px]'
     if (isScientific) return 'w-[540px]'
     if (isHistoryOpen) return 'w-[608px]'
     return 'w-[340px]'
  }

  return (
    <div className={`glass-panel relative rounded-3xl p-6 flex transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden ${getContainerWidth()}`}>
      
      {isConverterOpen && <UnitConverter onClose={() => setIsConverterOpen(false)} />}

      {/* 1. LEFT PANE: Scientific Keypad */}
      <div className={`flex items-end overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] flex-shrink-0 ${isScientific ? 'w-[160px] opacity-100 mr-5' : 'w-0 opacity-0 mr-0'}`}>
         <ScientificKeypad onAction={handleAction} />
      </div>

      {/* 2. CENTER PANE: Core Calculator */}
      <div className="flex flex-col gap-4 flex-1 flex-shrink-0 min-w-[292px]">
          {/* Header toggles */}
          <div className="w-full flex justify-between items-center mb-[-6px]">
             
             <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pr-1">
                <button 
                  onClick={() => setIsScientific(!isScientific)}
                  className={`h-8 px-2 rounded-full flex items-center justify-center gap-1 text-[0.65rem] font-bold tracking-wider uppercase transition-all flex-shrink-0 ${isScientific ? 'bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-300' : 'bg-black/5 hover:bg-black/10 text-slate-500 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white/50'}`}
                  title="Toggle Scientific Mode"
                >
                  <FlaskConical size={12} /> {isScientific ? 'ON' : 'OFF'}
                </button>
                <button 
                  onClick={() => setIsConverterOpen(true)}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-black/5 hover:bg-black/10 text-slate-500 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white/50 transition-colors flex-shrink-0"
                  title="Unit Converter"
                >
                  <Ruler size={13} />
                </button>
                <button 
                  onClick={cycleTheme}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-primary bg-primary/10 hover:bg-primary/20 dark:text-primary-light dark:bg-primary/20 hover:dark:bg-primary/30 transition-colors flex-shrink-0"
                  title="Cycle Theme Color"
                >
                  <Palette size={13} />
                </button>
                <button 
                  onClick={toggleTheme}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-black/5 hover:bg-black/10 text-slate-500 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white/50 transition-colors flex-shrink-0"
                  title="Dark Mode Toggle"
                >
                  <Sun size={13} className="hidden dark:block" />
                  <Moon size={13} className="block dark:hidden" />
                </button>
             </div>

             <button 
               onClick={() => setIsHistoryOpen(!isHistoryOpen)}
               className={`h-8 px-2 rounded-full flex items-center justify-center gap-1 text-xs font-semibold tracking-wider flex-shrink-0 transition-all ${isHistoryOpen ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light' : 'bg-black/5 hover:bg-black/10 text-slate-500 dark:bg-white/5 dark:hover:bg-white/10 dark:text-white/50'}`}
               title="Toggle History"
             >
               Logs <History size={13} />
             </button>
          </div>

          <Display history={history} currentValue={currentValue} onSpeechInput={handleSpeechTokens} />
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
