import React from 'react';
import { Language } from '../types';
import { translate } from '../utils/translations';

interface Props {
  date: Date;
  setDate: (d: Date) => void;
  birthYear: string;
  setBirthYear: (y: string) => void;
  onGenerate: () => void;
  viewMode: 'compass' | 'chart';
  language: Language;
}

export const ControlPanel: React.FC<Props> = ({ date, setDate, birthYear, setBirthYear, onGenerate, viewMode, language }) => {
  const years = Array.from({ length: 60 }, (_, i) => (2024 - i).toString());
  
  const layoutClass = viewMode === 'compass' 
    ? "relative opacity-100 scale-100 translate-y-0 pointer-events-auto" 
    : "absolute top-0 left-0 right-0 opacity-0 scale-50 translate-y-[-100px] pointer-events-none";

  const toLocalISOString = (d: Date) => {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    setDate(new Date(e.target.value));
  };

  const baguaRing = ['乾','兑','离','震','巽','坎','艮','坤'];

  return (
    <div className={`transition-all duration-1000 ease-in-out flex flex-col items-center justify-center min-h-[60vh] z-20 ${layoutClass}`}>
        
        <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
            
            <div className="absolute inset-0 rounded-full border border-slate-700 border-dashed animate-spin-slow opacity-30"></div>
            <div className="absolute inset-4 rounded-full border border-amber-900/40 animate-spin-reverse opacity-40 flex items-center justify-center">
                <div className="w-[98%] h-[98%] border border-amber-500/10 rounded-full"></div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center animate-spin-slow">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="absolute top-2 text-slate-600 text-xs font-serif transform origin-bottom h-[50%] w-4 text-center pt-2" style={{ transform: `rotate(${i * 45}deg)` }}>
                        {translate(baguaRing[i], 'bagua', language)}
                    </div>
                ))}
            </div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-slate-950/80 backdrop-blur-md rounded-full border border-amber-500/30 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center p-6 z-10">
                
                <h2 className="text-2xl font-calligraphy text-amber-500 mb-6 tracking-widest glow-text">{translate('天圆地方', 'ui', language)}</h2>

                <div className="w-full mb-4 relative group">
                    <label className="block text-[10px] text-slate-500 text-center mb-1 font-serif uppercase tracking-widest group-hover:text-amber-400 transition-colors">{translate('起局时间', 'ui', language)}</label>
                    <input 
                        type="datetime-local" 
                        value={toLocalISOString(date)}
                        onChange={handleDateChange}
                        className="w-full bg-transparent text-center text-amber-100 font-mono border-b border-slate-700 focus:border-amber-500 outline-none py-1 transition-colors"
                    />
                </div>

                <div className="w-full mb-8 relative group">
                    <label className="block text-[10px] text-slate-500 text-center mb-1 font-serif uppercase tracking-widest group-hover:text-amber-400 transition-colors">{translate('年命 (定位用神)', 'ui', language)}</label>
                    <select 
                        value={birthYear}
                        onChange={(e) => setBirthYear(e.target.value)}
                        className="w-full bg-transparent text-center text-amber-100 font-mono border-b border-slate-700 focus:border-amber-500 outline-none py-1 appearance-none cursor-pointer"
                    >
                        {years.map(y => (
                            <option key={y} value={y} className="bg-slate-900">{y}</option>
                        ))}
                    </select>
                </div>

                <button 
                    onClick={onGenerate}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-slate-800 to-black border-2 border-amber-600 shadow-[0_0_15px_rgba(245,158,11,0.4)] hover:scale-110 hover:shadow-[0_0_25px_rgba(245,158,11,0.6)] transition-all duration-300 flex items-center justify-center group"
                >
                    <span className="font-calligraphy text-xl text-amber-100 group-hover:text-amber-400">{translate('起', 'ui', language)}</span>
                </button>

            </div>
        </div>
        
        <p className="mt-12 text-slate-500 font-serif text-xs tracking-[0.5em] opacity-60 text-center px-4">{translate('设定时间与年命 · 演化奇门局', 'ui', language)}</p>
    </div>
  );
};