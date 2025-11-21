import { Language } from '../types';

export const DICTIONARY = {
  stems: {
    '甲': 'Jia', '乙': 'Yi', '丙': 'Bing', '丁': 'Ding', '戊': 'Wu',
    '己': 'Ji', '庚': 'Geng', '辛': 'Xin', '壬': 'Ren', '癸': 'Gui'
  },
  branches: {
    '子': 'Zi', '丑': 'Chou', '寅': 'Yin', '卯': 'Mao', '辰': 'Chen', '巳': 'Si',
    '午': 'Wu', '未': 'Wei', '申': 'Shen', '酉': 'You', '戌': 'Xu', '亥': 'Hai'
  },
  stars: {
    '天蓬': 'Peng', '天芮': 'Rui', '天冲': 'Chong', '天辅': 'Fu', '天禽': 'Qin',
    '天心': 'Xin', '天柱': 'Zhu', '天任': 'Ren', '天英': 'Ying', '': ''
  },
  doors: {
    '休门': 'Rest', '死门': 'Death', '伤门': 'Harm', '杜门': 'Delusion',
    '开门': 'Open', '惊门': 'Fear', '生门': 'Life', '景门': 'Scenery', '': ''
  },
  gods: {
    '值符': 'Chief', '腾蛇': 'Snake', '太阴': 'Moon', '六合': 'Union',
    '白虎': 'Tiger', '玄武': 'Tortoise', '九地': 'Earth', '九天': 'Heaven', '': ''
  },
  bagua: {
    '坎': 'Kan', '坤': 'Kun', '震': 'Zhen', '巽': 'Xun', '中': 'Mid',
    '乾': 'Qian', '兑': 'Dui', '艮': 'Gen', '离': 'Li'
  },
  palaceNames: {
    '坎一宫': 'Kan 1', '坤二宫': 'Kun 2', '震三宫': 'Zhen 3', '巽四宫': 'Xun 4',
    '中五宫': 'Mid 5', '乾六宫': 'Qian 6', '兑七宫': 'Dui 7', '艮八宫': 'Gen 8', '离九宫': 'Li 9'
  },
  elements: {
    '木': 'Wood', '火': 'Fire', '土': 'Earth', '金': 'Metal', '水': 'Water'
  },
  solarTerms: {
    '小寒': 'Minor Cold', '大寒': 'Major Cold', '立春': 'Start Spring', '雨水': 'Rain Water',
    '惊蛰': 'Insects Awaken', '春分': 'Spring Equinox', '清明': 'Clear Bright', '谷雨': 'Grain Rain',
    '立夏': 'Start Summer', '小满': 'Grain Buds', '芒种': 'Grain Ear', '夏至': 'Summer Solstice',
    '小暑': 'Minor Heat', '大暑': 'Major Heat', '立秋': 'Start Autumn', '处暑': 'End Heat',
    '白露': 'White Dew', '秋分': 'Autumn Equinox', '寒露': 'Cold Dew', '霜降': 'Frost',
    '立冬': 'Start Winter', '小雪': 'Minor Snow', '大雪': 'Major Snow', '冬至': 'Winter Solstice'
  },
  ui: {
    '起局时间': { zh: '起局时间', en: 'Chart Time' },
    '年命 (定位用神)': { zh: '年命 (定位用神)', en: 'Year Pillar (Focus)' },
    '起': { zh: '起', en: 'Go' },
    '设定时间与年命 · 演化奇门局': { zh: '设定时间与年命 · 演化奇门局', en: 'Set Time & Destiny • Evolve Chart' },
    '天圆地方': { zh: '天圆地方', en: 'Cosmic Round' },
    '重置': { zh: '重置', en: 'Reset' },
    '点击宫位详情': { zh: '点击宫位详情', en: 'Click Palace for Details' },
    '时家拆补转盘': { zh: '时家拆补转盘', en: 'Time ChaiBu ZhuanPan' },
    '值符': { zh: '值符', en: 'Lead' },
    '上吉': { zh: '上吉', en: 'Great' },
    '凶格': { zh: '凶格', en: 'Bad' },
    '平局': { zh: '平局', en: 'Avg' },
    '吉': { zh: '吉', en: 'Lucky' },
    '凶': { zh: '凶', en: 'Ominous' },
    '平': { zh: '平', en: 'Average' },
    '年': { zh: '年', en: 'Y' },
    '月': { zh: '月', en: 'M' },
    '日': { zh: '日', en: 'D' },
    '时': { zh: '时', en: 'H' },
    '道': { zh: '道', en: 'DAO' },
    'Cyber-Cultivation': { zh: 'Cyber-Cultivation', en: 'Cyber-Cultivation' },
    'System': { zh: 'System', en: 'System' },
    '奇门遁甲': { zh: '奇门遁甲', en: 'QI MEN DUN JIA' },
    '印': { zh: '印', en: 'Save' }
  },
  analysis: {
    '三吉门临宫，利于行动。': { zh: '三吉门临宫，利于行动。', en: 'Auspicious Door. Good for action.' },
    '凶门迫宫，诸事不利。': { zh: '凶门迫宫，诸事不利。', en: 'Ominous Door. Avoid action.' },
    '格局平稳，待时而动': { zh: '格局平稳，待时而动', en: 'Stable chart. Wait for timing.' },
    ' 逢空亡，吉凶减半。': { zh: ' 逢空亡，吉凶减半。', en: ' (Void: Effect halved)' }
  }
};

export const translate = (text: string, type: keyof typeof DICTIONARY | 'auto', lang: Language): string => {
  if (lang === 'zh') return text;
  if (!text) return '';

  if (type === 'auto') {
     for (const cat in DICTIONARY) {
       if (cat === 'ui' || cat === 'analysis') continue;
       const map = DICTIONARY[cat as keyof typeof DICTIONARY] as Record<string, string>;
       if (map[text]) return map[text];
     }
     return text;
  }

  if (type === 'ui') {
      const map = DICTIONARY.ui as Record<string, {zh: string, en: string}>;
      return map[text] ? map[text].en : text;
  }

  const map = DICTIONARY[type] as Record<string, string>;
  return map[text] || text;
};

// Translate Chart Info Strings
export const translateInfo = (text: string, lang: Language) => {
    if (lang === 'zh') return text;
    
    let res = text;

    // Solar Terms
    for (const [k, v] of Object.entries(DICTIONARY.solarTerms)) {
        res = res.replace(k, v);
    }

    // Yuan
    res = res.replace('上元', ' Upper Yuan').replace('中元', ' Middle Yuan').replace('下元', ' Lower Yuan');
    
    // Ju
    res = res.replace('阳遁', 'Yang ').replace('阴遁', 'Yin ').replace('局', ' Ju');
    const nums = ['一','二','三','四','五','六','七','八','九'];
    nums.forEach((n, i) => {
        res = res.replace(n, (i+1).toString());
    });

    return res;
};

export const translateAnalysis = (text: string, lang: Language) => {
    if (lang === 'zh') return text;
    let res = text;
    const map = DICTIONARY.analysis as Record<string, {zh: string, en: string}>;
    for (const key in map) {
        res = res.replace(key, map[key].en);
    }
    return res;
};