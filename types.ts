export enum ElementType {
  WOOD = '木',
  FIRE = '火',
  EARTH = '土',
  METAL = '金',
  WATER = '水'
}

export type Language = 'zh' | 'en';

export interface Ganzhi {
  gan: string;
  zhi: string;
}

export interface FourPillars {
  year: Ganzhi;
  month: Ganzhi;
  day: Ganzhi;
  hour: Ganzhi;
}

export interface PalaceData {
  id: number; // 1-9 (Luo Shu index)
  name: string; // e.g., 坎一宫
  bagua: string; // e.g., 坎
  element: ElementType;
  position: [number, number]; // Grid position [row, col]
  
  // Dynamic Qimen Data
  god: string; // Shen (Deity)
  star: string; // Xing (Star)
  door: string; // Men (Door)
  heavenStems: string[]; // Tian Pan (Array to support Parasitic [Parasitic, Host])
  earthStems: string[]; // Di Pan (Array to support Parasitic [Parasitic, Host])
  hiddenStem: string; // An Gan (Hidden Stem)
  
  // Markers
  isKongWang: boolean; // Empty/Void
  isMaXing: boolean; // Horse Star
  isNianMing: boolean; // Life Stem
  
  // Analysis
  auspiciousness: '吉' | '凶' | '平';
  analysis: string;
}

export interface QimenChart {
  pillars: FourPillars;
  jieqi: string; // Solar Term
  juName: string; // e.g., 阳遁一局
  xunShou: string; // Leader of the 10-hour block
  palaces: PalaceData[];
}

// Add support for html2canvas global
declare global {
  interface Window {
    html2canvas: (element: HTMLElement, options?: any) => Promise<HTMLCanvasElement>;
  }
}