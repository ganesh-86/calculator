import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function Display({ history, currentValue }) {
  const [copied, setCopied] = useState(false)
  const formula = history.join(' ')

  const handleCopy = () => {
    navigator.clipboard.writeText(currentValue)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const isError = currentValue === 'Error' || currentValue === 'Div by zero' || currentValue === 'NaN' || currentValue === 'Overflow'

  return (
    <div className="group w-full h-[132px] bg-white/50 dark:bg-screen rounded-2xl p-5 flex flex-col items-end justify-between shadow-inner border border-black/5 dark:border-white/5 relative overflow-hidden transition-colors duration-500">
      
      {/* Subtle glint effect on screen */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 dark:from-white/0 via-white/40 dark:via-white/5 to-white/20 dark:to-white/0 pointer-events-none"></div>
      
      {/* Universal Copy Button */}
      <button 
        onClick={handleCopy}
        className="absolute left-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg focus:outline-none z-10"
        title="Copy Result"
      >
        {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
      </button>

      {/* Complete Math Expression */}
      <div 
        className="text-slate-500 dark:text-slate-400 text-sm font-medium tracking-wider h-6 w-full text-right overflow-hidden whitespace-nowrap text-ellipsis px-1"
        title={formula}
      >
        {formula}
      </div>
      
      {/* Current Input / Result */}
      <div className={`font-light tracking-tight w-full text-right overflow-hidden break-words px-1 z-10 ${isError ? 'text-rose-500 text-3xl' : 'text-slate-800 dark:text-white text-5xl'} ${currentValue.length > 12 && !isError ? 'text-4xl' : ''}`}>
        {currentValue}
      </div>
    </div>
  )
}
