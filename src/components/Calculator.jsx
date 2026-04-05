import { useState } from 'react'
import Display from './Display'
import Keypad from './Keypad'
import { evaluateExpression } from '../utils/evaluate'

export default function Calculator() {
  const [history, setHistory] = useState([])
  const [currentValue, setCurrentValue] = useState('0')
  const [waitingForNewValue, setWaitingForNewValue] = useState(false)
  const [hasEvaluated, setHasEvaluated] = useState(false)

  const handleNumber = (num) => {
    if (currentValue === 'Error') handleClear()

    if (hasEvaluated) {
      setCurrentValue(num === '.' ? '0.' : num)
      setHistory([])
      setHasEvaluated(false)
      setWaitingForNewValue(false)
    } else if (waitingForNewValue) {
      setCurrentValue(num === '.' ? '0.' : num)
      setWaitingForNewValue(false)
    } else if (currentValue === '0' && num !== '.') {
      setCurrentValue(num)
    } else if (num === '.' && currentValue.includes('.')) {
      return
    } else {
      setCurrentValue(currentValue + num)
    }
  }

  const handleOperator = (op) => {
    if (currentValue === 'Error') return

    if (hasEvaluated) {
      setHistory([currentValue, op])
      setHasEvaluated(false)
      setWaitingForNewValue(true)
    } else if (waitingForNewValue && history.length > 0) {
      // User typed an operator right after another, just swap it
      const newHistory = [...history]
      newHistory[newHistory.length - 1] = op
      setHistory(newHistory)
    } else {
      setHistory([...history, currentValue, op])
      setWaitingForNewValue(true)
    }
  }

  const calculate = () => {
    if (currentValue === 'Error' || hasEvaluated) return

    // Collect all tokens for the final calculation
    const tokens = [...history]
    if (!waitingForNewValue) {
      tokens.push(currentValue)
    }

    const result = evaluateExpression(tokens)
    
    // Append '=' for display purposes
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
    if (currentValue.length === 1 || (currentValue.length === 2 && currentValue.startsWith('-'))) {
      setCurrentValue('0')
    } else {
      setCurrentValue(currentValue.slice(0, -1))
    }
  }

  const handleAction = (type, value) => {
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
      <Display history={history} currentValue={currentValue} />
      <Keypad onAction={handleAction} />
    </div>
  )
}
