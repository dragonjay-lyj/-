import { ElementType, PalaceData, QimenChart } from '../types';
import { calculateFourPillars, getSolarTerm, getXunShou, getChaiBuJu, EARTHLY_BRANCHES, HEAVENLY_STEMS } from './lunar';

const PALACE_INFO = {
  1: { name: '坎一宫', bagua: '坎', element: ElementType.WATER, row: 2, col: 1 },
  2: { name: '坤二宫', bagua: '坤', element: ElementType.EARTH, row: 0, col: 2 },
  3: { name: '震三宫', bagua: '震', element: ElementType.WOOD, row: 1, col: 0 },
  4: { name: '巽四宫', bagua: '巽', element: ElementType.WOOD, row: 0, col: 0 },
  5: { name: '中五宫', bagua: '中', element: ElementType.EARTH, row: 1, col: 1 },
  6: { name: '乾六宫', bagua: '乾', element: ElementType.METAL, row: 2, col: 2 },
  7: { name: '兑七宫', bagua: '兑', element: ElementType.METAL, row: 1, col: 2 },
  8: { name: '艮八宫', bagua: '艮', element: ElementType.EARTH, row: 2, col: 0 },
  9: { name: '离九宫', bagua: '离', element: ElementType.FIRE, row: 0, col: 1 },
};

const LO_SHU_ORDER = [1, 2, 3, 4, 5, 6, 7, 8, 9];
// Standard Qi Men sequence for Flying/Rotating
const EARTH_STEMS_ORDER = ['戊', '己', '庚', '辛', '壬', '癸', '丁', '丙', '乙']; 

const ORIGINAL_STARS: Record<number, string> = {
    1: '天蓬', 2: '天芮', 3: '天冲', 4: '天辅', 5: '天禽', 
    6: '天心', 7: '天柱', 8: '天任', 9: '天英'
};
const ORIGINAL_DOORS: Record<number, string> = {
    1: '休门', 2: '死门', 3: '伤门', 4: '杜门', 5: '', 
    6: '开门', 7: '惊门', 8: '生门', 9: '景门'
};
const GODS_ORDER = ['值符', '腾蛇', '太阴', '六合', '白虎', '玄武', '九地', '九天'];

const wrapIdx = (idx: number, len: number) => (idx % len + len) % len;

export const generateChart = (rawDate: Date, birthYearStr: string): QimenChart => {
  // The engine trusts rawDate is the Local Time intended by the user.
  // calculateFourPillars handles the "Late Rat" (23:00-00:00) logic internally
  // returning the correct Hour Stem (Next Day's Stem) while keeping Day Branch (Current Day).
  const date = rawDate;

  // 1. Pillars & Solar Term
  const pillars = calculateFourPillars(date);
  const solarTerm = getSolarTerm(date);
  
  // 2. Ding Ju (Fu Tou Method via dayGan + dayZhi)
  const { name: juName, num: juNum, isYang, yuan } = getChaiBuJu(solarTerm, pillars.day.gan, pillars.day.zhi);
  
  // 3. Di Pan (Earth Plate)
  const diPanMap = new Map<number, string>();
  const stems = EARTH_STEMS_ORDER;
  
  if (isYang) {
      for (let i = 0; i < 9; i++) {
          const palaceId = LO_SHU_ORDER[(wrapIdx(juNum - 1 + i, 9))]; 
          diPanMap.set(palaceId, stems[i]);
      }
  } else {
      for (let i = 0; i < 9; i++) {
         let idx = wrapIdx(juNum - 1 - i, 9);
         const palaceId = LO_SHU_ORDER[idx];
         diPanMap.set(palaceId, stems[i]);
      }
  }

  // 4. Find Xun Shou (Leader)
  const xunInfo = getXunShou(pillars.hour);
  const leaderStem = xunInfo.head;
  
  let leaderPalaceId = 5; 
  diPanMap.forEach((stem, pid) => {
      if (stem === leaderStem) leaderPalaceId = pid;
  });

  // 5. Move Tian Pan (Stars)
  // Value Star (Zhi Fu) moves to Hour Stem Palace
  let hourStem = pillars.hour.gan;
  // Rule: If Hour Stem is Jia (Hidden), it uses the Leader Stem
  if (hourStem === '甲') hourStem = leaderStem;

  let hourStemPalaceId = 1;
  diPanMap.forEach((stem, pid) => {
      if (stem === hourStem) hourStemPalaceId = pid;
  });
  
  // Ring Sequence (Clockwise Spatial)
  const STAR_RING = [1, 8, 3, 4, 9, 2, 7, 6];
  
  // Determine rotation offset
  // If leader is in 5 (Tian Qin), it moves with Tian Rui (2)
  const startStarPid = leaderPalaceId === 5 ? 2 : leaderPalaceId;
  const targetStarPid = hourStemPalaceId === 5 ? 2 : hourStemPalaceId;

  const startStarIdx = STAR_RING.indexOf(startStarPid);
  const endStarIdx = STAR_RING.indexOf(targetStarPid);
  const starOffset = wrapIdx(endStarIdx - startStarIdx, 8);

  const palaceStars = new Map<number, string>();
  const palaceHeavenStems = new Map<number, string[]>(); // Change to array to hold parasitic stems
  
  STAR_RING.forEach((pid, idx) => {
      const originalPid = STAR_RING[wrapIdx(idx - starOffset, 8)];
      const starName = ORIGINAL_STARS[originalPid];
      palaceStars.set(pid, starName);
      
      // Move Earth Stem to Heaven Plate
      // Logic: If the star originally came from Palace 2 (Tian Rui), 
      // it carries the stem from Palace 5 (Tian Qin) as Parasitic.
      // Array Order: [Parasitic, Host] => [StemFrom5, StemFrom2]
      if (originalPid === 2) {
          palaceHeavenStems.set(pid, [diPanMap.get(5) || '', diPanMap.get(2) || '']);
      } else {
          palaceHeavenStems.set(pid, [diPanMap.get(originalPid) || '']);
      }
  });

  // 6. Move Ren Pan (Doors)
  // Zhi Shi (Value Door) flies along the Lo Shu path (1-9)
  // Calculate steps from Xun Shou to Current Hour
  const hourZhiIdx = EARTHLY_BRANCHES.indexOf(pillars.hour.zhi);
  const xunShouZhiIdx = EARTHLY_BRANCHES.indexOf(xunInfo.zhi);
  const diff = wrapIdx(hourZhiIdx - xunShouZhiIdx, 12); // Hours passed since Xun Head
  
  let zhiShiPalaceId = leaderPalaceId; // Start at Leader Palace
  
  // Simulate Flying Step by Step
  for(let i = 0; i < diff; i++) {
      if (isYang) {
          // Forward: 1->2->3...->9->1
          zhiShiPalaceId = zhiShiPalaceId === 9 ? 1 : zhiShiPalaceId + 1;
      } else {
          // Backward: 9->8->7...->1->9
          zhiShiPalaceId = zhiShiPalaceId === 1 ? 9 : zhiShiPalaceId - 1;
      }
  }
  
  // Rule: If Zhi Shi lands on 5, it maps to 2 (Kun) for the Door Ring reference
  let doorTargetId = zhiShiPalaceId;
  if (doorTargetId === 5) doorTargetId = 2;

  // Rotate the Door Ring to place the Leader Door at doorTargetId
  const DOOR_RING = [1, 8, 3, 4, 9, 2, 7, 6];
  const startDoorPid = leaderPalaceId === 5 ? 2 : leaderPalaceId;
  
  const startDoorRingIdx = DOOR_RING.indexOf(startDoorPid);
  const targetDoorRingIdx = DOOR_RING.indexOf(doorTargetId);
  
  const doorOffset = wrapIdx(targetDoorRingIdx - startDoorRingIdx, 8);
  
  const palaceDoors = new Map<number, string>();
  DOOR_RING.forEach((pid, idx) => {
      const originalPid = DOOR_RING[wrapIdx(idx - doorOffset, 8)];
      palaceDoors.set(pid, ORIGINAL_DOORS[originalPid]);
  });

  // 7. Move Shen Pan (Gods)
  // Gods follow the Stars in Zhuan Pan.
  // Rotation: Yang Dun = Clockwise, Yin Dun = Counter-Clockwise (Common rule).
  // Start: Zhi Fu God aligns with Zhi Fu Star.
  const godTargetPid = hourStemPalaceId === 5 ? 2 : hourStemPalaceId; 
  const godRingStartIdx = STAR_RING.indexOf(godTargetPid);
  const palaceGods = new Map<number, string>();
  
  STAR_RING.forEach((pid, idx) => {
      const relIdx = wrapIdx(idx - godRingStartIdx, 8);
      // Yang Dun: Clockwise; Yin Dun: Counter-Clockwise
      let godName = isYang ? GODS_ORDER[relIdx] : GODS_ORDER[wrapIdx(-relIdx, 8)];
      palaceGods.set(pid, godName);
  });

  // 8. Hidden Stem (An Gan) Calculation
  // Method: Shi Gan Jia Zhi Shi (时干加值使)
  // The Hour Stem (Shi Gan) flies to the Palace of the Zhi Shi Door.
  // Then following the Yang/Yin sequence.
  // SPECIAL RULE: If the Earth Stem at the Zhi Shi Palace is the same as the Hour Stem,
  // the starting point moves to the Center Palace (5).
  
  const stemSeq = EARTH_STEMS_ORDER; // Wu Ji Geng Xin Ren Gui Ding Bing Yi
  const hourStemIdx = stemSeq.indexOf(hourStem);
  
  const palaceHiddenStems = new Map<number, string>();
  
  // Determine Start Palace for Hidden Stem
  const earthStemAtZhiShi = diPanMap.get(zhiShiPalaceId);
  let anGanStartPalaceId = zhiShiPalaceId;
  
  // Check for overlap/trap (Fu Yin of Stem) at the starting palace
  if (earthStemAtZhiShi === hourStem) {
      anGanStartPalaceId = 5; // Enter Center
  }

  for (let i = 0; i < 9; i++) {
      const currentStem = stemSeq[wrapIdx(hourStemIdx + i, 9)];
      let targetPid;
      
      // Get Lo Shu index of start position
      const startLoShuIdx = LO_SHU_ORDER.indexOf(anGanStartPalaceId);
      
      if (isYang) {
          // Yang: Fly forward
          targetPid = LO_SHU_ORDER[wrapIdx(startLoShuIdx + i, 9)];
      } else {
          // Yin: Fly backward
          targetPid = LO_SHU_ORDER[wrapIdx(startLoShuIdx - i, 9)];
      }
      palaceHiddenStems.set(targetPid, currentStem);
  }

  // 9. Construct Data
  const bYear = parseInt(birthYearStr || "1990");
  const yearOffset = (bYear - 1984 + 6000) % 60;
  const birthGan = HEAVENLY_STEMS[yearOffset % 10];

  const palaces: PalaceData[] = [];

  for (let i = 1; i <= 9; i++) {
      const info = PALACE_INFO[i as keyof typeof PALACE_INFO];
      
      // Construct Earth Stems array
      // If this is Palace 2 (Kun), it has Palace 5 (Center) parasitic on it.
      // Order: [Parasitic (5), Host (2)]
      let earthStems: string[] = [];
      if (i === 2) {
          earthStems = [diPanMap.get(5) || '', diPanMap.get(2) || ''];
      } else {
          earthStems = [diPanMap.get(i) || ''];
      }

      // Get Heaven Stems array (already computed)
      let heavenStems = palaceHeavenStems.get(i) || [];
      
      let star = palaceStars.get(i) || '';
      let door = palaceDoors.get(i) || '';
      let god = palaceGods.get(i) || '';
      const hiddenStem = palaceHiddenStems.get(i) || '';

      // Center Palace 5 Display Rules
      // Usually empty except for Earth Stem (which is technically moved to 2, but traditionally shown as empty or earth)
      // In Zhuan Pan, Center often displays nothing or just reference.
      if (i === 5) { star = ''; door = ''; god = ''; heavenStems = []; }

      const hZhi = pillars.hour.zhi;
      let maXingPos = -1;
      if (['寅','午','戌'].includes(hZhi)) maXingPos = 2; 
      if (['申','子','辰'].includes(hZhi)) maXingPos = 8; 
      if (['亥','卯','未'].includes(hZhi)) maXingPos = 4; 
      if (['巳','酉','丑'].includes(hZhi)) maXingPos = 6; 
      const isMaXing = (i === maXingPos);

      const emptyMap: Record<string, number[]> = {
          '甲': [], 
          '戊': [6], '己': [2, 7], '庚': [9, 2], '辛': [4], '壬': [8, 3], '癸': [1, 8]
      };
      
      const voids = emptyMap[leaderStem] || [];
      const isKongWang = voids.includes(i);

      const isNianMing = earthStems.includes(birthGan) || heavenStems.includes(birthGan);

      let auspiciousness: '吉' | '凶' | '平' = '平';
      let analysisText = "格局平稳，待时而动";
      if (['开门', '休门', '生门'].includes(door)) {
          auspiciousness = '吉';
          analysisText = "三吉门临宫，利于行动。";
      }
      if (['死门', '惊门', '伤门'].includes(door)) {
          auspiciousness = '凶';
          analysisText = "凶门迫宫，诸事不利。";
      }
      if (isKongWang) {
          analysisText += " 逢空亡，吉凶减半。";
      }

      palaces.push({
          id: i,
          name: info.name,
          bagua: info.bagua,
          element: info.element,
          position: [info.row, info.col],
          god, star, door, heavenStems, earthStems, hiddenStem,
          isKongWang, isMaXing, isNianMing,
          auspiciousness, analysis: analysisText
      });
  }

  return {
    pillars,
    jieqi: `${solarTerm} ${yuan}`,
    juName,
    xunShou: `甲${xunInfo.zhi}${xunInfo.head}`,
    palaces
  };
};