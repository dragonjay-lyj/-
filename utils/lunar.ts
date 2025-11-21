import { Ganzhi } from '../types';

export const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
export const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

export const getGanZhi = (offset: number): Ganzhi => {
  return {
    gan: HEAVENLY_STEMS[offset % 10],
    zhi: EARTHLY_BRANCHES[offset % 12],
  };
};

// Helper: Get 0-59 index from Gan and Zhi
export const getGanzhiIndex = (gan: string, zhi: string): number => {
    const ganIdx = HEAVENLY_STEMS.indexOf(gan);
    const zhiIdx = EARTHLY_BRANCHES.indexOf(zhi);
    // Formula: (6*gan - 5*zhi + 60) % 60
    return (6 * ganIdx - 5 * zhiIdx + 60) % 60;
};

// Solar Terms Order
const SOLAR_TERMS = [
  '小寒', '大寒', '立春', '雨水', '惊蛰', '春分',
  '清明', '谷雨', '立夏', '小满', '芒种', '夏至',
  '小暑', '大暑', '立秋', '处暑', '白露', '秋分',
  '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'
];

// Qimen Ju Numbers Map (Upper, Middle, Lower)
const SOLAR_TERM_INFO: Record<string, { type: 'yang' | 'yin', ju: [number, number, number] }> = {
  '冬至': { type: 'yang', ju: [1, 7, 4] },
  '小寒': { type: 'yang', ju: [2, 8, 5] },
  '大寒': { type: 'yang', ju: [3, 9, 6] },
  '立春': { type: 'yang', ju: [8, 5, 2] },
  '雨水': { type: 'yang', ju: [9, 6, 3] },
  '惊蛰': { type: 'yang', ju: [1, 7, 4] },
  '春分': { type: 'yang', ju: [3, 9, 6] },
  '清明': { type: 'yang', ju: [4, 1, 7] },
  '谷雨': { type: 'yang', ju: [5, 2, 8] },
  '立夏': { type: 'yang', ju: [4, 1, 7] },
  '小满': { type: 'yang', ju: [5, 2, 8] },
  '芒种': { type: 'yang', ju: [6, 3, 9] },
  
  '夏至': { type: 'yin', ju: [9, 3, 6] },
  '小暑': { type: 'yin', ju: [8, 2, 5] },
  '大暑': { type: 'yin', ju: [7, 1, 4] },
  '立秋': { type: 'yin', ju: [2, 5, 8] },
  '处暑': { type: 'yin', ju: [1, 4, 7] },
  '白露': { type: 'yin', ju: [9, 3, 6] },
  '秋分': { type: 'yin', ju: [7, 1, 4] },
  '寒露': { type: 'yin', ju: [6, 9, 3] },
  '霜降': { type: 'yin', ju: [5, 8, 2] },
  '立冬': { type: 'yin', ju: [6, 9, 3] },
  '小雪': { type: 'yin', ju: [5, 8, 2] },
  '大雪': { type: 'yin', ju: [4, 7, 1] },
};

export const getSolarTerm = (date: Date): string => {
  const day = date.getDate();
  const month = date.getMonth(); // 0-11
  
  // Simplified term dates
  const terms = [
      { m: 0, d: 6, t: '小寒' }, { m: 0, d: 20, t: '大寒' },
      { m: 1, d: 4, t: '立春' }, { m: 1, d: 19, t: '雨水' },
      { m: 2, d: 6, t: '惊蛰' }, { m: 2, d: 21, t: '春分' },
      { m: 3, d: 5, t: '清明' }, { m: 3, d: 20, t: '谷雨' },
      { m: 4, d: 6, t: '立夏' }, { m: 4, d: 21, t: '小满' },
      { m: 5, d: 6, t: '芒种' }, { m: 5, d: 21, t: '夏至' },
      { m: 6, d: 7, t: '小暑' }, { m: 6, d: 23, t: '大暑' },
      { m: 7, d: 8, t: '立秋' }, { m: 7, d: 23, t: '处暑' },
      { m: 8, d: 8, t: '白露' }, { m: 8, d: 23, t: '秋分' },
      { m: 9, d: 8, t: '寒露' }, { m: 9, d: 24, t: '霜降' },
      { m: 10, d: 8, t: '立冬' }, { m: 10, d: 22, t: '小雪' },
      { m: 11, d: 7, t: '大雪' }, { m: 11, d: 22, t: '冬至' }
  ];

  let currentTerm = terms[terms.length - 1].t;
  for (const term of terms) {
      if (month < term.m || (month === term.m && day < term.d)) {
          break;
      }
      currentTerm = term.t;
  }
  return currentTerm;
};

export const calculateFourPillars = (date: Date): { year: Ganzhi, month: Ganzhi, day: Ganzhi, hour: Ganzhi } => {
    // 1. Day Pillar
    // Anchor: 2024-01-01 12:00:00 is Jia Zi (0)
    // Use strict day difference logic
    const anchor = new Date(2024, 0, 1, 12, 0, 0);
    const target = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
    const diffTime = target.getTime() - anchor.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    // 2024-01-01 was Jia Zi (0).
    let dayOffset = diffDays % 60;
    if (dayOffset < 0) dayOffset += 60;
    
    // 2. Year and Month Pillar (Wu Hu Dun & Solar Term)
    const year = date.getFullYear();
    const currentTerm = getSolarTerm(date);
    
    const termMap: Record<string, number> = {
      '立春': 2, '雨水': 2, // Yin (2)
      '惊蛰': 3, '春分': 3, // Mao (3)
      '清明': 4, '谷雨': 4, // Chen (4)
      '立夏': 5, '小满': 5, // Si (5)
      '芒种': 6, '夏至': 6, // Wu (6)
      '小暑': 7, '大暑': 7, // Wei (7)
      '立秋': 8, '处暑': 8, // Shen (8)
      '白露': 9, '秋分': 9, // You (9)
      '寒露': 10, '霜降': 10, // Xu (10)
      '立冬': 11, '小雪': 11, // Hai (11)
      '大雪': 0, '冬至': 0, // Zi (0)
      '小寒': 1, '大寒': 1 // Chou (1)
    };
    
    const monthBranchIdx = termMap[currentTerm];
    
    // Determine Solar Year
    // Usually changes at Li Chun (Feb 4)
    const liChun = new Date(year, 1, 4); // Approx Li Chun
    let solarYear = year;
    if (date < liChun) {
        solarYear = year - 1;
    }

    // Calculate Year GanZhi (1984 = 0)
    const yearOffset = (solarYear - 1984 + 6000) % 60;
    const yearGanIdx = yearOffset % 10;
    
    // Calculate Month GanZhi (Wu Hu Dun)
    // Base: Year Gan -> Tiger Month Gan
    // Formula: (YearGanIdx % 5) * 2 + 2
    const tigerMonthGanBase = (yearGanIdx % 5) * 2 + 2;
    
    // Month Branch Index: Yin(2)...Zi(0), Chou(1)
    // Calculate step from Tiger(2)
    let monthStepFromTiger = monthBranchIdx - 2;
    if (monthStepFromTiger < 0) monthStepFromTiger += 12;
    
    const monthGanIdx = (tigerMonthGanBase + monthStepFromTiger) % 10;
    const monthOffset = monthGanIdx; // Only stem matters for display usually, but we construct Ganzhi

    // 3. Hour Pillar
    const hour = date.getHours();
    const hourBranchIndex = Math.floor((hour + 1) / 2) % 12;
    
    // Wan Zi Suan Dang Tian: Day Pillar is based on Calendar Day (calculated above)
    // But Hour Stem is based on Next Day if 23:00+
    let dayGanForHour = dayOffset % 10;
    if (hour === 23) {
        dayGanForHour = (dayGanForHour + 1) % 10;
    }

    const hourGanIndex = ((dayGanForHour % 5) * 2 + hourBranchIndex) % 10;
    
    return {
        year: getGanZhi(yearOffset),
        month: { gan: HEAVENLY_STEMS[monthGanIdx], zhi: EARTHLY_BRANCHES[monthBranchIdx] },
        day: getGanZhi(dayOffset), 
        hour: {
            gan: HEAVENLY_STEMS[hourGanIndex],
            zhi: EARTHLY_BRANCHES[hourBranchIndex]
        }
    };
};

export const getXunShou = (hour: Ganzhi): { gan: string, zhi: string, head: string } => {
    const ganIdx = HEAVENLY_STEMS.indexOf(hour.gan);
    const zhiIdx = EARTHLY_BRANCHES.indexOf(hour.zhi);
    const diff = (zhiIdx - ganIdx + 12) % 12;
    
    const map: Record<number, string> = {
        0: '戊', 10: '己', 8: '庚', 6: '辛', 4: '壬', 2: '癸'
    };
    
    const headGan = map[diff] || '戊';
    return { gan: '甲', zhi: EARTHLY_BRANCHES[diff], head: headGan };
};

// Implement Fu Tou (Leader) Method for Yuan determination
// Fu Tou is the nearest preceding Jia(0) or Ji(5) day.
export const getFuTouYuan = (dayGan: string, dayZhi: string): '上元' | '中元' | '下元' => {
    const idx = getGanzhiIndex(dayGan, dayZhi);
    
    // Fu Tou is DayIndex - (DayIndex % 5)
    const offset = idx % 5;
    const fuTouIdx = idx - offset;
    
    // We need the Branch of the Fu Tou
    const fuTouZhiIdx = fuTouIdx % 12;
    
    // Mapping:
    // Zi(0), Wu(6), Mao(3), You(9) -> Upper Yuan
    if ([0, 6, 3, 9].includes(fuTouZhiIdx)) return '上元';
    
    // Yin(2), Shen(8), Si(5), Hai(11) -> Middle Yuan
    if ([2, 8, 5, 11].includes(fuTouZhiIdx)) return '中元';
    
    // Chen(4), Xu(10), Chou(1), Wei(7) -> Lower Yuan
    return '下元';
};

export const getChaiBuJu = (solarTerm: string, dayGan: string, dayZhi: string): { name: string, num: number, isYang: boolean, yuan: string } => {
    const info = SOLAR_TERM_INFO[solarTerm] || SOLAR_TERM_INFO['冬至'];
    
    // Use Fu Tou method to get Yuan
    const yuan = getFuTouYuan(dayGan, dayZhi);
    
    let yuanIdx = 0; // Default Upper
    if (yuan === '中元') yuanIdx = 1;
    if (yuan === '下元') yuanIdx = 2;

    const juNum = info.ju[yuanIdx];
    const isYang = info.type === 'yang';
    
    return {
        name: `${isYang ? '阳' : '阴'}遁${['一','二','三','四','五','六','七','八','九'][juNum-1]}局`,
        num: juNum,
        isYang,
        yuan
    };
};