import React from 'react';

export const BackgroundCompass: React.FC = () => {
  // Data for rings
  const stars = ['天蓬', '天芮', '天冲', '天辅', '天禽', '天心', '天柱', '天任', '天英'];
  const doors = ['休门', '死门', '伤门', '杜门', '景门', '死门', '惊门', '开门'];
  const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[140vw] h-[140vw] max-w-[1000px] max-h-[1000px] pointer-events-none z-0 select-none overflow-hidden mix-blend-screen opacity-40">
      
      {/* Outer Ring: 10 Stems - Amber/Gold */}
      <div className="absolute inset-0 animate-spin-very-slow">
        <div className="w-full h-full rounded-full border-2 border-amber-800/40 relative flex items-center justify-center bg-amber-900/5">
           {/* Texture Lines */}
           <div className="absolute inset-3 border border-dashed border-amber-600/40 rounded-full"></div>
           <div className="absolute inset-16 border border-dotted border-amber-600/20 rounded-full"></div>
           
           {stems.map((item, i) => (
             <div 
                key={i} 
                className="absolute top-0 left-1/2 -translate-x-1/2 h-1/2 origin-bottom pt-4 text-amber-500 font-serif text-3xl font-bold opacity-80 shadow-black drop-shadow-sm"
                style={{ transform: `rotate(${i * 36}deg)` }}
             >
                {item}
             </div>
           ))}
        </div>
      </div>

      {/* Middle Ring: 9 Stars - Slate/Cyan */}
      <div className="absolute inset-[18%] animate-spin-reverse-slower">
        <div className="w-full h-full rounded-full border-2 border-slate-600/40 relative bg-slate-800/5">
            <div className="absolute inset-3 border border-dotted border-slate-400/30 rounded-full"></div>
            {stars.map((item, i) => (
             <div 
                key={i} 
                className="absolute top-0 left-1/2 -translate-x-1/2 h-1/2 origin-bottom pt-4 text-slate-400 font-serif text-2xl font-bold opacity-70"
                style={{ transform: `rotate(${i * 40}deg)` }}
             >
                {item}
             </div>
           ))}
        </div>
      </div>

      {/* Inner Ring: 8 Doors - Red/Cinnabar */}
      <div className="absolute inset-[36%] animate-spin-slower">
         <div className="w-full h-full rounded-full border-2 border-red-900/40 relative bg-red-900/5">
            <div className="absolute inset-3 border border-double border-red-500/30 rounded-full"></div>
            {doors.map((item, i) => (
             <div 
                key={i} 
                className="absolute top-0 left-1/2 -translate-x-1/2 h-1/2 origin-bottom pt-4 text-red-600 font-serif text-xl font-bold opacity-70"
                style={{ transform: `rotate(${i * 45}deg)` }}
             >
                {item}
             </div>
           ))}
         </div>
      </div>

      {/* Center Decoration */}
      <div className="absolute inset-[54%] rounded-full border-2 border-amber-600/20 flex items-center justify-center bg-gradient-to-br from-slate-900 via-black to-slate-900 shadow-2xl">
         <div className="w-2/3 h-2/3 border border-amber-500/10 rounded-full animate-pulse-slow"></div>
         <div className="absolute text-8xl font-calligraphy text-amber-800/30 select-none">道</div>
      </div>

    </div>
  );
};