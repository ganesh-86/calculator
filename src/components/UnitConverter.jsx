import { useState } from 'react';
import { X } from 'lucide-react';

export default function UnitConverter({ onClose }) {
  const [category, setCategory] = useState('Length');
  const [inputVal, setInputVal] = useState('1');
  const [fromUnit, setFromUnit] = useState('meters');
  const [toUnit, setToUnit] = useState('feet');

  const categories = {
    Length: ['meters', 'feet', 'kilometers', 'miles', 'centimeters'],
    Weight: ['kilograms', 'pounds', 'grams', 'ounces'],
    Temperature: ['celsius', 'fahrenheit', 'kelvin']
  };

  const conversions = {
    Length: {
      meters: 1, feet: 3.28084, kilometers: 0.001, miles: 0.000621371, centimeters: 100
    },
    Weight: {
      kilograms: 1, pounds: 2.20462, grams: 1000, ounces: 35.274
    }
  };

  let result = '0';
  const val = parseFloat(inputVal);
  if (!isNaN(val)) {
    if (category === 'Temperature') {
      let baseC = val;
      if (fromUnit === 'fahrenheit') baseC = (val - 32) * 5/9;
      if (fromUnit === 'kelvin') baseC = val - 273.15;
      
      let final = baseC;
      if (toUnit === 'fahrenheit') final = (baseC * 9/5) + 32;
      if (toUnit === 'kelvin') final = baseC + 273.15;
      result = parseFloat(final.toPrecision(8)).toString();
    } else {
      const base = val / conversions[category][fromUnit];
      const final = base * conversions[category][toUnit];
      result = parseFloat(final.toPrecision(8)).toString();
    }
  }

  const handleCategoryChange = (e) => {
     const c = e.target.value;
     setCategory(c);
     setFromUnit(categories[c][0]);
     setToUnit(categories[c][1]);
  }

  return (
    <div className="absolute inset-0 z-50 bg-slate-50/95 dark:bg-[#020617]/95 backdrop-blur-md flex flex-col p-8 transition-all animate-in fade-in zoom-in-95 duration-200">
      <div className="flex justify-between items-center mb-6">
         <h2 className="text-slate-800 dark:text-white font-semibold flex items-center gap-2">🔄 Unit Converter</h2>
         <button onClick={onClose} className="p-2 bg-black/5 dark:bg-white/5 hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 dark:text-white/40 dark:hover:text-rose-400 rounded-full transition-colors focus:outline-none">
            <X size={16}/>
         </button>
      </div>
      
      <div className="flex flex-col gap-6 max-w-sm mx-auto w-full mt-4">
        <select value={category} onChange={handleCategoryChange} className="p-3 font-semibold rounded-xl bg-black/5 dark:bg-white/5 text-slate-800 dark:text-white border-none focus:outline-none focus:ring-2 focus:ring-primary">
           {Object.keys(categories).map(c => <option key={c} value={c} className="bg-white dark:bg-background">{c}</option>)}
        </select>
        
        <div className="flex flex-col gap-2 p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 focus-within:ring-1 focus-within:ring-primary transition-all">
           <input type="number" value={inputVal} onChange={(e) => setInputVal(e.target.value)} className="bg-transparent text-right text-4xl font-light text-slate-800 dark:text-white outline-none w-full" />
           <select value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="self-end bg-transparent font-medium text-slate-500 dark:text-white/40 text-sm outline-none">
              {categories[category].map(u => <option key={u} value={u} className="bg-white dark:bg-background">{u}</option>)}
           </select>
        </div>

        <div className="flex justify-center my-[-16px] z-10">
           <div className="bg-primary text-white p-1 rounded-full shadow-lg shadow-primary/20 text-xs">▼</div>
        </div>

        <div className="flex flex-col gap-2 p-5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
           <div className="text-right text-4xl font-light text-primary w-full overflow-hidden text-ellipsis">{result}</div>
           <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="self-end bg-transparent font-medium text-slate-500 dark:text-white/40 text-sm outline-none">
              {categories[category].map(u => <option key={u} value={u} className="bg-white dark:bg-background">{u}</option>)}
           </select>
        </div>
      </div>
    </div>
  )
}
