import { useState } from 'react'
import { Copy, Check, Mic } from 'lucide-react'
import { getSpeechRecognition, parseSpeechToMath } from '../utils/speech'

export default function Display({ history, currentValue, onSpeechInput }) {
  const [copied, setCopied] = useState(false)
  const [listening, setListening] = useState(false)
  const [unsupported, setUnsupported] = useState(false)
  
  const formula = history.join(' ')

  const handleCopy = () => {
    navigator.clipboard.writeText(currentValue)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleMic = () => {
    const recognition = getSpeechRecognition()
    if (!recognition) {
       setUnsupported(true)
       setTimeout(() => setUnsupported(false), 3000)
       return
    }
    
    recognition.onstart = () => setListening(true)
    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)
    
    recognition.onresult = (e) => {
       const transcript = e.results[0][0].transcript
       const tokens = parseSpeechToMath(transcript)
       if (tokens.length > 0 && onSpeechInput) {
           onSpeechInput(tokens)
       }
    }
    
    recognition.start()
  }

  const isError = currentValue === 'Error' || currentValue === 'Div by zero' || currentValue === 'NaN' || currentValue === 'Overflow'

  return (
    <div className="group w-full h-[132px] bg-white/50 dark:bg-screen rounded-2xl p-5 flex flex-col items-end justify-between shadow-inner border border-black/5 dark:border-white/5 relative overflow-hidden transition-colors duration-500">
      
      <div className="absolute inset-0 bg-gradient-to-tr from-white/20 dark:from-white/0 via-white/40 dark:via-white/5 to-white/20 dark:to-white/0 pointer-events-none"></div>
      
      {/* Utilities Array Overlay */}
      <div className="absolute left-3 bottom-3 flex gap-1 z-10 w-fit">
         <button 
           onClick={handleMic}
           className={`p-2 rounded-lg focus:outline-none transition-all duration-300 ${listening ? 'text-primary bg-primary/10 animate-pulse opacity-100' : unsupported ? 'text-amber-500 opacity-100' : 'text-slate-400 hover:text-primary hover:bg-black/5 dark:hover:bg-white/10 opacity-0 group-hover:opacity-100'}`}
           title={unsupported ? 'Speech API not supported globally natively in this specific browser window.' : 'Voice Math Commands'}
         >
           {unsupported ? <span className="text-[0.65rem] font-bold px-1 bg-amber-500/20 rounded">NO MIC</span> : <Mic size={16} />}
         </button>
         
         <button 
           onClick={handleCopy}
           className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg focus:outline-none"
           title="Copy Result"
         >
           {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
         </button>
      </div>

      <div 
        className="text-slate-500 dark:text-slate-400 text-sm font-medium tracking-wider h-6 w-full text-right overflow-hidden whitespace-nowrap text-ellipsis px-1"
        title={formula}
      >
        {formula}
      </div>
      
      <div className={`font-light tracking-tight w-full text-right overflow-hidden break-words px-1 z-10 ${isError ? 'text-rose-500 text-3xl' : 'text-slate-800 dark:text-white text-5xl'} ${currentValue.length > 12 && !isError ? 'text-4xl' : ''}`}>
        {currentValue}
      </div>
    </div>
  )
}
