export interface NumberLevel4Item {
  num: number;
  parts: {
    kanji: [string, string];
    kana: [string, string];
  };
  romaji: string;
  mutation?: {
    multiplier?: string;
    unit?: string;
    romaji?: string;
  };
  note?: {
    zh: string;
    en: string;
  };
}

// 1-9 的假名序列 (通用)
export const KANA_MULTIPLIERS = [
  '',
  'いち',
  'に',
  'さん',
  'よん',
  'ご',
  'ろく',
  'なな',
  'はち',
  'きゅう',
];

export const LEVEL_4_DATA: Record<number, NumberLevel4Item> = {
  1000: {
    num: 1000,
    parts: { kanji: ['', '千'], kana: ['', 'せん'] },
    romaji: 'se·n',
    note: {
      zh: '注意：1000 读作 Sen，不读 Ichi-sen',
      en: "Note: 1000 is 'Sen', not 'Ichi-sen'",
    },
  },
  2000: {
    num: 2000,
    parts: { kanji: ['二', '千'], kana: ['に', 'せん'] },
    romaji: 'ni·se·n',
  },
  3000: {
    num: 3000,
    parts: { kanji: ['三', '千'], kana: ['さん', 'せん'] },
    romaji: 'sa·n·ze·n',
    // 🔴 变异：右侧浊音化 (s -> z)
    mutation: {
      unit: 'ぜん',
      romaji: 'sa·n·ze·n',
    },
    note: {
      zh: '发生连浊 (s → z)',
      en: 'Rendaku occurs: s → z',
    },
  },
  4000: {
    num: 4000,
    parts: { kanji: ['四', '千'], kana: ['よん', 'せん'] },
    romaji: 'yo·n·se·n',
  },
  5000: {
    num: 5000,
    parts: { kanji: ['五', '千'], kana: ['ご', 'せん'] },
    romaji: 'go·se·n',
  },
  6000: {
    num: 6000,
    parts: { kanji: ['六', '千'], kana: ['ろく', 'せん'] },
    romaji: 'ro·ku·se·n',
    // 注意：6000 通常是规则读音，不发生音便
  },
  7000: {
    num: 7000,
    parts: { kanji: ['七', '千'], kana: ['なな', 'せん'] },
    romaji: 'na·na·se·n',
  },
  8000: {
    num: 8000,
    parts: { kanji: ['八', '千'], kana: ['はち', 'せん'] },
    romaji: 'ha·s·se·n',
    // 🔴 变异：左侧促音化 (chi -> small tsu)
    mutation: {
      multiplier: 'はっ',
      // unit 保持 'せん'
      romaji: 'ha·s·se·n',
    },
    note: {
      zh: '发生促音变 (っ)',
      en: 'Sokuon (っ) occurs',
    },
  },
  9000: {
    num: 9000,
    parts: { kanji: ['九', '千'], kana: ['きゅう', 'せん'] },
    romaji: 'kyu·u·se·n',
  },
};
