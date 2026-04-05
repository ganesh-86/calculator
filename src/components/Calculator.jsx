import { useState } from 'react'
import Display from './Display'
import Keypad from './Keypad'

export default function Calculator() {
  const [currentValue, setCurrentValue] = useState('0')
  const [previousValue, setPreviousValue] = useState(null)
  const [operator, setOperator] = useState(null)
  const [waitingForNewValue, setWaitingForNewValue] = useState(false)

  const handleNumber = (num) => {
    if (waitingForNewValue) {
      setCurrentValue(num)
      setWaitingForNewValue(false)
    } else if (currentValue === '0' && num !== '.') {
      setCurrentValue(num)
    } else if (num === '.' && currentValue.includes('.')) {
      return
    } else {
      setCurrentValue(currentValue + num)
    }
  }

  const calculateResult = (prevStr, currentStr, op) => {
    const prev = parseFloat(prevStr)
    const current = parseFloat(currentStr)
    if (isNaN(prev) || isNaN(current)) return current

    let computation = 0
    switch (op) {
      case '+': computation = prev + current; break
      case '-': computation = prev - current; break
      case '×': computation = prev * current; break
      case '÷': 
        if (current === 0) return 'Error'
        computation = prev / current
        break
      default: return current
    }
    // Handle floating point precision to avoid e.g. 0.1 + 0.2 = 0.30000000000000004
    return parseFloat(computation.toPrecision(12)).toString()
  }

  const handleOperator = (op) => {
    if (operator && !waitingForNewValue) {
      const result = calculateResult(previousValue, currentValue, operator)
      setCurrentValue(result)
      setPreviousValue(result)
    } else {
      setPreviousValue(currentValue)
    }
    setOperator(op)
    setWaitingForNewValue(true)
  }

  const calculate = () => {
    if (!operator || !previousValue || waitingForNewValue) return
    const result = calculateResult(previousValue, currentValue, operator)
    setCurrentValue(result)
    setPreviousValue(null)
    setOperator(null)
    setWaitingForNewValue(true)
  }

  const handleClear = () => {
    setCurrentValue('0')
    setPreviousValue(null)
    setOperator(null)
    setWaitingForNewValue(false)
  }

  const handleDelete = () => {
    if (waitingForNewValue) return
    if (currentValue === 'Error') {
      handleClear()
      return
    }
    if (currentValue.length === 1 || (currentValue.length === 2 && currentValue.startsWith('-'))) {
      setCurrentValue('0')
    } else {
      setCurrentValue(currentValue.slice(0, -1))
    }
  }

  const handleAction = (type, value) => {
    if (currentValue === 'Error' && type !== 'clear') {
      handleClear()
    }
    
    switch (type) {
      case 'number': handleNumber(value); break
      case 'operator': handleOperator(value); break
      case 'calculate': calculate(); break
      case 'clear': handleClear(); break
      case 'delete': handleDelete(); break
      default: break
    }
  }

  return (
    <div className="w-[340px] glass-panel rounded-3xl p-6 flex flex-col gap-6">
      <Display currentValue={currentValue} previousValue={previousValue} operator={operator} />
      <Keypad onAction={handleAction} />
    </div>
  )
}
