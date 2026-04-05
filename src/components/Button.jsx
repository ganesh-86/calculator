export default function Button({ children, variant = 'default', className = '', onClick }) {
  const baseStyles = "relative flex items-center justify-center text-2xl font-medium rounded-2xl select-none transition-all duration-200 active:scale-95 overflow-hidden focus:outline-none"
  
  const variants = {
    default: "bg-white/5 text-slate-200 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] border border-white/5",
    primary: "bg-primary text-white hover:bg-primary-light shadow-[0_0_20px_rgba(225,29,72,0.3)] hover:shadow-[0_0_25px_rgba(244,63,94,0.4)] border border-primary-light/50",
    secondary: "bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 hover:shadow-[0_0_15px_rgba(99,102,241,0.15)]",
    danger: "bg-white/5 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 border border-white/5 hover:border-rose-500/30"
  }

  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {/* Subtle shine effect on top edge */}
      <span className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"></span>
      {children}
    </button>
  )
}
