import React from 'react';
import { PalaceData, ElementType } from '../types';

interface Props {
  data: PalaceData;
  isSelected: boolean;
  onSelect: (id: number) => void;
  isDimmed: boolean;
}

const ElementStyles: Record<ElementType, { bg: string, text: string }> = {
  [ElementType.WOOD]: { 
    bg: 'bg-emerald-900/30', 
    text: 'text-emerald-400' 
  },
  [ElementType.FIRE]: { 
    bg: 'bg-red-900/30', 
    text: 'text-red-400' 
  },
  [ElementType.EARTH]: { 
    bg: 'bg-amber-900/30', 
    text: 'text-amber-500' 
  },
  [ElementType.METAL]: { 
    bg: 'bg-slate-700/30', 
    text: 'text-slate-200' 
  },
  [ElementType.WATER]: { 
    bg: 'bg-cyan-900/30', 
    text: 'text-cyan-400' 
  },
};

export const PalaceCell: React.FC<Props> = ({ data, isSelected, onSelect, isDimmed }) => {
  const { 
    id, name, bagua, element, god, star, door, 
    heavenStems, earthStems, hiddenStem,
    isKongWang, isMaXing, isNianMing,
    auspiciousness, analysis 
  } = data;

  const styles = ElementStyles[element];
  
  const containerClasses = `
    relative w-full aspect-square transition-all duration-500 cursor-pointer overflow-hidden
    border backdrop-blur-sm group
    ${styles.bg}
    ${isSelected 
        ? 'scale-105 z-20 border-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.4)] bg-slate-900' 
        : 'border-white/10 hover:border-amber-500/50 hover:bg-white/5'
    }
    ${isDimmed && !isSelected ? 'opacity-30 scale-95 blur-[1px] grayscale-[80%]' : 'opacity-100'}
  `;

  // Base font size
  const mainFontClass = "text-base md:text-xl font-serif font-bold leading-tight";

  const renderStem = (stem: string | undefined | null, colorClass: string) => {
    if (!stem || typeof stem !== 'string') return <div className="w-4 md:w-5"></div>;
    return (
      <div className={`flex flex-col items-center justify-center leading-none ${colorClass} ${mainFontClass}`}>
        {stem.split('').map((char, i) => (
          <span key={i} className="block -my-0.5">{char}</span>
        ))}
      </div>
    );
  };

  const mainHeaven = heavenStems && heavenStems.length > 0 ? heavenStems[heavenStems.length - 1] : '';
  const mainEarth = earthStems && earthStems.length > 0 ? earthStems[earthStems.length - 1] : '';
  const parasiticHeaven = heavenStems && heavenStems.length > 1 ? heavenStems[0] : null;
  const parasiticEarth = earthStems && earthStems.length > 1 ? earthStems[0] : null;
  const hasParasitic = parasiticHeaven !== null || parasiticEarth !== null;

  return (
    <div 
        onClick={() => onSelect(id)}
        className={containerClasses}
    >
      {/* Effects */}
      {element === ElementType.FIRE && !isDimmed && (
         <div className="absolute inset-0 bg-gradient-to-t from-red-600/10 to-transparent animate-flicker pointer-events-none mix-blend-screen opacity-30"></div>
      )}
      {element === ElementType.WATER && !isDimmed && (
         <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/shattered-island.png')] animate-flow pointer-events-none mix-blend-overlay"></div>
      )}
      {isNianMing && (
          <div className="absolute inset-0 border-2 border-gold-light/60 shadow-[inset_0_0_25px_rgba(252,211,77,0.4)] animate-pulse-slow z-0 pointer-events-none"></div>
      )}

      {/* Background Symbol */}
      <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl md:text-7xl opacity-10 pointer-events-none font-calligraphy ${styles.text}`}>
        {bagua}
      </div>

      {/* --- CORNER LAYOUT (Compact) --- */}

      {/* TOP LEFT: Hidden Stem */}
      <div className="absolute top-1 left-1 md:top-1.5 md:left-2 z-10">
           <div className="text-xl md:text-3xl text-slate-500 font-serif font-bold opacity-80 drop-shadow-sm">
               {hiddenStem}
           </div>
      </div>

      {/* TOP RIGHT: Star */}
      <div className="absolute top-1 right-1 md:top-1.5 md:right-2 z-10">
          <div className={`${mainFontClass} text-amber-500/90 drop-shadow-md`}>
              {star}
          </div>
      </div>

      {/* TOP CENTER: Markers */}
      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 flex gap-0.5 md:gap-1 z-10">
        {isKongWang && <span className="text-[10px] md:text-xs font-bold text-slate-400 border border-slate-500 px-0.5 rounded bg-black/60">空</span>}
        {isMaXing && <span className="text-[10px] md:text-xs font-bold text-amber-500 border border-amber-600 px-0.5 rounded bg-black/60">马</span>}
        {isNianMing && <span className="text-[10px] md:text-xs font-bold text-red-100 bg-red-900/80 px-0.5 rounded border border-red-500">命</span>}
      </div>

      {/* BOTTOM LEFT: God & Door */}
      <div className="absolute bottom-1 left-1 md:bottom-1.5 md:left-2 z-10 flex flex-col items-start gap-0">
          <div className={`${mainFontClass} text-amber-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]`}>
              {god}
          </div>
          <div className={`${mainFontClass} ${['生门','开门','休门'].includes(door) ? 'text-red-400' : 'text-slate-300'} drop-shadow-md`}>
              {door}
          </div>
      </div>

      {/* BOTTOM RIGHT: Stems */}
      <div className="absolute bottom-1 right-1 md:bottom-1.5 md:right-2 z-10 flex flex-row gap-1">
          {hasParasitic && (
             <div className="flex flex-col items-center gap-0">
                 {renderStem(parasiticHeaven || '', isNianMing ? 'text-gold-light' : 'text-slate-400')}
                 {renderStem(parasiticEarth || '', isNianMing ? 'text-gold-light' : 'text-amber-800')}
             </div>
          )}
          <div className="flex flex-col items-center gap-0">
               {renderStem(mainHeaven, isNianMing ? 'text-gold-light text-shadow-gold' : 'text-slate-100')}
               {renderStem(mainEarth, isNianMing ? 'text-gold-light text-shadow-gold' : 'text-amber-600')}
          </div>
      </div>

      {/* BOTTOM CENTER: Name */}
      <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 text-[9px] md:text-[10px] text-slate-400 font-mono whitespace-nowrap pointer-events-none z-0 opacity-60">
          {name}
      </div>

      {/* Analysis Overlay */}
      <div className={`absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col justify-center items-center p-2 text-center z-30 transition-all duration-300 ${isSelected ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <h3 className={`text-xl md:text-2xl font-calligraphy mb-1 ${auspiciousness === '吉' ? 'text-red-500' : auspiciousness === '凶' ? 'text-slate-400' : 'text-amber-500'}`}>
          {auspiciousness === '吉' ? '上吉' : auspiciousness === '凶' ? '凶格' : '平局'}
        </h3>
        <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-serif mb-2 px-1">{analysis}</p>
        <div className="text-[10px] text-amber-700 border-t border-amber-900/30 pt-1 w-2/3">{bagua}宫 · {element}</div>
      </div>
    </div>
  );
};