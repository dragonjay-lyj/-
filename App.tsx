import React, { useState, useEffect, useRef } from 'react';
import { generateChart } from './utils/qimenEngine';
import { QimenChart, Language } from './types';
import { PalaceCell } from './components/PalaceCell';
import { ControlPanel } from './components/ControlPanel';
import { BackgroundCompass } from './components/BackgroundCompass';
import { translate, translateInfo } from './utils/translations';

const App: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [birthYear, setBirthYear] = useState<string>('1990');
  const [chartData, setChartData] = useState<QimenChart | null>(null);
  const [viewMode, setViewMode] = useState<'compass' | 'chart'>('compass');
  const [selectedPalace, setSelectedPalace] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [scale, setScale] = useState(1);
  const [language, setLanguage] = useState<Language>('zh');

  const chartRef = useRef<HTMLDivElement>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Responsive Scaling Hook
  useEffect(() => {
    const handleResize = () => {
      if (viewMode === 'chart') {
        const targetHeight = 900;
        const availableHeight = window.innerHeight;
        const newScale = Math.min(1, availableHeight / targetHeight);
        setScale(newScale);
      } else {
        setScale(1);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial calculation

    return () => window.removeEventListener('resize', handleResize);
  }, [viewMode]);

  const calculate = () => {
    const data = generateChart(currentDate, birthYear);
    setChartData(data);
    setViewMode('chart');
  };

  const reset = () => {
    setViewMode('compass');
    setTimeout(() => {
        setChartData(null);
        setSelectedPalace(null);
    }, 800);
  };

  const visualOrder = [4, 9, 2, 3, 5, 7, 8, 1, 6];

  const handleSave = async () => {
    if (!chartRef.current || isSaving) return;
    setIsSaving(true);

    setTimeout(async () => {
        try {
            const canvas = await window.html2canvas(chartRef.current!, {
                backgroundColor: '#050505',
                scale: 2,
                useCORS: true,
                logging: false,
                ignoreElements: (element) => element.classList.contains('no-print')
            });
            
            const link = document.createElement('a');
            link.download = `QiMen_Chart_${currentDate.toISOString().slice(0,10)}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (err) {
            console.error("Screenshot failed", err);
        } finally {
            setIsSaving(false);
        }
    }, 100);
  };

  return (
    <div className="h-screen w-screen bg-void-dark text-gray-200 font-sans overflow-hidden relative flex flex-col selection:bg-amber-900 selection:text-white">
       {/* Global Ambient Effects */}
       <div className="fixed inset-0 pointer-events-none opacity-20 bg-noise z-0"></div>
       <div className="fixed top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-indigo-900/10 rounded-full blur-[120px] z-0"></div>
       <div className="fixed bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-amber-900/10 rounded-full blur-[120px] z-0"></div>
       
       <div className={`fixed inset-0 flex items-center justify-center transition-all duration-1000 pointer-events-none z-0 ${viewMode === 'chart' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
          <BackgroundCompass language={language} />
       </div>

       {/* Language Toggle - Fixed Top Right */}
       <div className="absolute top-4 right-4 z-50">
           <button 
             onClick={() => setLanguage(prev => prev === 'zh' ? 'en' : 'zh')}
             className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-black/30 hover:bg-white/10 hover:border-amber-500/50 transition-all text-xs font-serif text-slate-400"
           >
             <span className={language === 'zh' ? 'text-amber-400 font-bold' : ''}>中</span>
             <span className="w-px h-3 bg-white/20"></span>
             <span className={language === 'en' ? 'text-amber-400 font-bold' : ''}>EN</span>
           </button>
       </div>

       {/* Main Content Wrapper */}
       <div className="relative z-10 w-full h-full flex flex-col items-center">
          
          {/* Header */}
          <header className={`text-center transition-all duration-1000 z-30 relative shrink-0 ${viewMode === 'chart' ? 'mt-2 mb-2 scale-75 origin-bottom' : 'mt-[10vh] mb-8'}`}>
              <h1 onClick={reset} className="cursor-pointer text-5xl md:text-6xl font-calligraphy text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-700 mb-2 drop-shadow-lg hover:scale-105 transition-transform">
                  {translate('奇门遁甲', 'ui', language)}
              </h1>
              <p className="text-slate-500 font-serif tracking-[0.6em] text-xs uppercase flex justify-center gap-4">
                  <span>Cyber-Cultivation</span>
                  <span className="text-amber-700">•</span>
                  <span>System</span>
              </p>
          </header>

          {/* Center Stage */}
          <div className="flex-1 w-full relative flex flex-col items-center justify-center">
            
            {/* Control Panel */}
            <ControlPanel 
                date={currentDate} 
                setDate={setCurrentDate} 
                birthYear={birthYear} 
                setBirthYear={setBirthYear}
                onGenerate={calculate}
                viewMode={viewMode}
                language={language}
            />

            {/* Chart Container */}
            <div 
                className={`w-full flex flex-col items-center transition-all duration-1000 ease-out absolute top-0 left-0 right-0 ${viewMode === 'chart' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-20 pointer-events-none'}`}
                style={{ 
                    transform: `scale(${scale})`,
                    transformOrigin: 'top center',
                    marginTop: viewMode === 'chart' ? '10px' : '0px'
                }}
                ref={chartContainerRef}
            >
                {chartData && (
                    <div className="w-full max-w-[95vw] md:max-w-4xl flex flex-col items-center"> 
                        {/* Actions */}
                        <div className="flex justify-between items-center mb-2 px-2 w-[600px] max-w-full mx-auto">
                            <button onClick={reset} className="no-print text-xs font-serif text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors border border-white/10 px-3 py-0.5 rounded-full bg-black/40 backdrop-blur-sm hover:border-amber-500/50">
                                ← {translate('重置', 'ui', language)}
                            </button>
                            <div className="text-[10px] font-serif text-amber-500/80">
                                ※ {translate('点击宫位详情', 'ui', language)}
                            </div>
                        </div>

                        {/* Capture Target */}
                        <div ref={chartRef} className="relative bg-slate-950 border-y-4 border-amber-900/50 p-4 shadow-2xl overflow-hidden w-[600px] max-w-full mx-auto rounded-xl ring-1 ring-white/10">
                            <div className="absolute inset-0 pointer-events-none bg-rice-paper opacity-10 z-0"></div>
                            
                            <div className="absolute top-2 right-2 text-[9px] text-slate-600 font-serif tracking-widest border border-slate-800 px-1.5 py-0.5 rounded opacity-50">
                                {translate('时家拆补转盘', 'ui', language)}
                            </div>

                            <div className="relative z-10 flex justify-between items-end mb-4 border-b border-amber-900/30 pb-2">
                                <div className="flex gap-4 text-center font-serif text-amber-100/90">
                                    {[
                                        { label: translate('年', 'ui', language), val: chartData.pillars.year },
                                        { label: translate('月', 'ui', language), val: chartData.pillars.month },
                                        { label: translate('日', 'ui', language), val: chartData.pillars.day },
                                        { label: translate('时', 'ui', language), val: chartData.pillars.hour },
                                    ].map((p, i) => (
                                        <div key={i} className="flex flex-col items-center">
                                            <span className="text-[9px] text-slate-500 mb-0.5">{p.label}</span>
                                            <span className="font-bold text-lg font-calligraphy text-amber-400 drop-shadow-sm">
                                                {translate(p.val.gan, 'stems', language)}
                                                {translate(p.val.zhi, 'branches', language)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="text-right">
                                    <div className="text-xl font-calligraphy text-slate-200 drop-shadow-md">
                                        {translateInfo(chartData.jieqi, language)} <span className="text-amber-600 mx-1">·</span> {translateInfo(chartData.juName, language)}
                                    </div>
                                    <div className="text-[10px] font-mono text-slate-400 tracking-wider">
                                        {translate('值符', 'ui', language)} <span className="text-amber-500">{translate(chartData.xunShou.replace(/[^甲乙丙丁戊己庚辛壬癸子丑寅卯辰巳午未申酉戌亥]/g, ''), 'stems', language) || chartData.xunShou}</span>
                                    </div>
                                </div>
                            </div>

                            {/* 3x3 Grid */}
                            <div className="relative z-10 grid grid-cols-3 gap-0.5 bg-slate-900 p-0.5 rounded-sm border border-amber-500/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                                {visualOrder.map(id => {
                                    const palace = chartData.palaces.find(p => p.id === id);
                                    if (!palace) return null;
                                    return (
                                        <PalaceCell 
                                            key={id} 
                                            data={palace} 
                                            isSelected={selectedPalace === id}
                                            onSelect={(pid) => setSelectedPalace(selectedPalace === pid ? null : pid)}
                                            isDimmed={selectedPalace !== null}
                                            language={language}
                                        />
                                    );
                                })}
                            </div>

                            {/* Footer */}
                            <div className="mt-3 flex justify-between items-center opacity-50">
                                <div className="text-[8px] text-slate-500 font-mono">
                                    AI CELESTIAL GATE SYSTEM
                                </div>
                                <div className="font-calligraphy text-lg text-slate-600 rotate-[-5deg] mix-blend-overlay">
                                    天机不可泄露
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

          </div>

       </div>

       {/* Floating Seal Button */}
       <button 
        onClick={handleSave}
        disabled={isSaving || viewMode !== 'chart'}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-cinnabar rounded-full shadow-[0_0_30px_rgba(185,28,28,0.6)] border-2 border-red-900 hover:bg-red-700 active:scale-90 transition-all duration-500 z-50 flex items-center justify-center group ${viewMode === 'chart' ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}
        title={translate('印', 'ui', language)}
       >
           <div className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center">
             {isSaving ? (
                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
             ) : (
                 <span className="font-calligraphy text-white text-xl drop-shadow-md">{translate('印', 'ui', language)}</span>
             )}
           </div>
           <div className="absolute inset-0 rounded-full border border-red-500 animate-ping opacity-30"></div>
       </button>

    </div>
  );
};

export default App;