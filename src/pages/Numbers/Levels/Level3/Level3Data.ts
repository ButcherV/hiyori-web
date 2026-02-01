export interface NumberLevel3Item {
  num: number;
  // 存储“理想规律”状态
  parts: {
    kanji: [string, string];
    kana: [string, string];
  };
  romaji: string;
}

export const KANA_MULTIPLIERS = [
  '', // 0 (100)
  '', // 1 (100 不读 ichi)
  'に', // 2
  'さん', // 3
  'よん', // 4
  'ご', // 5
  'ろく', // 6
  'なな', // 7
  'はち', // 8
  'きゅう', // 9
];

export const LEVEL_3_DATA: Record<number, NumberLevel3Item> = {
  100: {
    num: 100,
    // 100 是唯一的特例：没有“一”
    parts: { kanji: ['', '百'], kana: ['', 'ひゃく'] },
    romaji: 'hya·ku',
  },
  200: {
    num: 200,
    parts: { kanji: ['二', '百'], kana: ['に', 'ひゃく'] },
    romaji: 'ni·hya·ku',
  },
  300: {
    num: 300,
    // 强制规律化：San + Hyaku
    parts: { kanji: ['三', '百'], kana: ['さん', 'ひゃく'] },
    romaji: 'sa·n·bya·ku',
  },
  400: {
    num: 400,
    parts: { kanji: ['四', '百'], kana: ['よん', 'ひゃく'] },
    romaji: 'yo·n·hya·ku',
  },
  500: {
    num: 500,
    parts: { kanji: ['五', '百'], kana: ['ご', 'ひゃく'] },
    romaji: 'go·hya·ku',
  },
  600: {
    num: 600,
    // 强制规律化：Roku + Hyaku
    parts: { kanji: ['六', '百'], kana: ['ろく', 'ひゃく'] },
    romaji: 'ro·p·pya·ku',
  },
  700: {
    num: 700,
    parts: { kanji: ['七', '百'], kana: ['なな', 'ひゃく'] },
    romaji: 'na·na·hya·ku',
  },
  800: {
    num: 800,
    // 强制规律化：Hachi + Hyaku
    parts: { kanji: ['八', '百'], kana: ['はち', 'ひゃく'] },
    romaji: 'ha·p·pya·ku',
  },
  900: {
    num: 900,
    parts: { kanji: ['九', '百'], kana: ['きゅう', 'ひゃく'] },
    romaji: 'kyu·u·hya·ku',
  },
};
