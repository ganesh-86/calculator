export default function MemoryBar({ onAction, memoryValue }) {
  const btnStyles = "flex-1 h-9 rounded-xl border border-white/5 text-sm font-semibold tracking-wider transition-all hover:bg-white/10 active:scale-95 focus:outline-none"
  
  return (
    <div className="flex w-full gap-2 items-center text-slate-300 mt-[-4px]">
      <div className={`text-[0.65rem] w-4 ml-1 font-bold transition-colors ${memoryValue !== 0 ? 'text-rose-400' : 'text-transparent'}`}>M</div>
      <button className={btnStyles} onClick={() => onAction('memory', 'MC')}>MC</button>
      <button className={btnStyles} onClick={() => onAction('memory', 'MR')}>MR</button>
      <button className={btnStyles} onClick={() => onAction('memory', 'M+')}>M+</button>
      <button className={btnStyles} onClick={() => onAction('memory', 'M-')}>M-</button>
    </div>
  )
}
