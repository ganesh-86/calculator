export default function Display({ currentValue, previousValue, operator }) {
  return (
    <div className="w-full h-32 bg-screen rounded-2xl p-5 flex flex-col items-end justify-between shadow-inner border border-white/5 relative overflow-hidden">
      {/* Subtle glint effect on screen */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none"></div>
      
      {/* Previous Calculation Equation */}
      <div className="text-slate-400 text-sm font-medium tracking-wider h-6 w-full text-right overflow-hidden break-all">
        {previousValue != null && operator ? `${previousValue} ${operator}` : ''}
      </div>
      
      {/* Current Input */}
      <div className={`text-5xl font-light tracking-tight w-full text-right overflow-hidden break-all ${currentValue === 'Error' ? 'text-rose-500' : 'text-white'}`}>
        {currentValue}
      </div>
    </div>
  )
}
