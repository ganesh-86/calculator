import { Trash2 } from 'lucide-react'

export default function HistorySidebar({ historyList, onClear }) {
  return (
    <div className="flex flex-col h-[546px] w-[240px] border-l border-white/10 pl-5 pr-1 relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white/60 font-semibold text-sm tracking-wide">History Cache</h3>
        <button 
          onClick={onClear} 
          className="w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:bg-rose-500/20 hover:text-rose-400 transition-all focus:outline-none" 
          title="Clear History"
        >
          <Trash2 size={15} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto w-full flex flex-col gap-3 pr-[4px] custom-scrollbar">
        {historyList.length === 0 ? (
          <div className="text-white/20 text-xs text-center mt-20">No recent calculations</div>
        ) : (
          historyList.map((item, id) => (
            <div key={id} className="flex flex-col items-end gap-[4px] p-4 rounded-[1.2rem] bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-default">
              <span className="text-slate-400 text-[0.75rem] font-medium whitespace-nowrap text-ellipsis overflow-hidden w-full text-right">{item.formula}</span>
              <span className="text-white font-medium text-lg text-ellipsis overflow-hidden w-full text-right">{item.result}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
