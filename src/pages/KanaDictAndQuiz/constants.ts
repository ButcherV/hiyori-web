// src/pages/KanaDictionary/constants.ts

// ==========================================
// 1. 通用列头定义 (Column Headers)
// ==========================================

// 清音/浊音 的列头 (a, i, u, e, o)
export const SEION_COL_HEADERS = ['a', 'i', 'u', 'e', 'o'];

// 拗音 的列头 (ya, yu, yo) - 中间不留空。五列改三列
export const YOON_COL_HEADERS = ['ya', 'yu', 'yo'];

// ==========================================
// 2. 数据定义 (Rows & Row Headers)
// ==========================================

// --- A. 清音 (Seion) 修正版 ---
// ⚠️ 顺序：A -> K -> S -> T -> N -> H -> M -> Y -> R -> W -> N
export const SEION_ROW_HEADERS = [
  'A', // あ行
  'K', // か行
  'S', // さ行
  'T', // た行
  'N', // な行
  'H', // は行 (Ha)
  'M', // ま行 (Ma)
  'Y', // や行 (Ya) - 之前漏了这行
  'R', // ら行 (Ra)
  'W', // わ行 (Wa)
  'N', // ん (N)
];

export const SEION_ROWS = [
  ['a', 'i', 'u', 'e', 'o'],
  ['ka', 'ki', 'ku', 'ke', 'ko'],
  ['sa', 'shi', 'su', 'se', 'so'],
  ['ta', 'chi', 'tsu', 'te', 'to'],
  ['na', 'ni', 'nu', 'ne', 'no'],

  // 6. Ha 行
  ['ha', 'hi', 'fu', 'he', 'ho'],

  // 7. Ma 行
  ['ma', 'mi', 'mu', 'me', 'mo'],

  // 8. Ya 行 (注意：中间有 null，因为 Yi 和 Ye 现代日语没有)
  ['ya', null, 'yu', null, 'yo'],

  // 9. Ra 行
  ['ra', 'ri', 'ru', 're', 'ro'],

  // 10. Wa 行 (Wi, Wu, We 现代已废弃或合并)
  ['wa', null, null, null, 'wo'],

  // 11. N (拨音)
  ['n', null, null, null, null],
];

// --- B. 浊音 (Dakuon) ---
export const DAKUON_ROW_HEADERS = ['G', 'Z', 'D', 'B', 'P'];

export const DAKUON_ROWS = [
  ['ga', 'gi', 'gu', 'ge', 'go'],
  ['za', 'ji', 'zu', 'ze', 'zo'],
  ['da', 'di', 'du', 'de', 'do'],
  ['ba', 'bi', 'bu', 'be', 'bo'],
  ['pa', 'pi', 'pu', 'pe', 'po'],
];

// --- C. 拗音 (Yoon) ---
export const YOON_ROW_HEADERS = [
  'K',
  'S',
  'T',
  'N',
  'H',
  'M',
  'R',
  'G',
  'J',
  'B',
  'P',
];

export const YOON_ROWS = [
  ['kya', 'kyu', 'kyo'],
  ['sha', 'shu', 'sho'],
  ['cha', 'chu', 'cho'],
  ['nya', 'nyu', 'nyo'],
  ['hya', 'hyu', 'hyo'],
  ['mya', 'myu', 'myo'],
  ['rya', 'ryu', 'ryo'],
  ['gya', 'gyu', 'gyo'],
  ['ja', 'ju', 'jo'],
  ['bya', 'byu', 'byo'],
  ['pya', 'pyu', 'pyo'],
];
