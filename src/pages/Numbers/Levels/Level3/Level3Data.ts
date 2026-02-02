export interface NumberLevel3Item {
  num: number;
  // 🟢 规律状态 (Regular State)
  // 这里存的是“理想拼接”的结果，用于第一阶段展示
  parts: {
    kanji: [string, string];
    kana: [string, string]; // e.g. 300 -> ['さん', 'ひゃく']
  };
  romaji: string; // e.g. 300 -> 'sa·n·hya·ku'

  // 🔴 变异增量 (Mutation Increment)
  // 只有不规律的部分才会有值
  mutation?: {
    multiplier?: string; // 左侧假名变体 (如 600 -> 'ろっ')
    unit?: string; // 右侧假名变体 (如 300 -> 'びゃく')
    romaji?: string; // 整体 Romaji 变体 (如 300 -> 'sa·n·bya·ku')
  };
  note?: {
    zh: string;
    en: string;
  };
}

// 辅助常量：1-9 的规律假名序列
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

export const LEVEL_3_DATA: Record<number, NumberLevel3Item> = {
  100: {
    num: 100,
    parts: { kanji: ['', '百'], kana: ['', 'ひゃく'] },
    romaji: 'hya·ku',
    note: {
      zh: '注意：100 读作 Hyaku，不读 Ichi-hyaku',
      en: "Note: 100 is 'Hyaku', not 'Ichi-hyaku'",
    },
  },
  200: {
    num: 200,
    parts: { kanji: ['二', '百'], kana: ['に', 'ひゃく'] },
    romaji: 'ni·hya·ku',
    // 规则：无 mutation
  },
  300: {
    num: 300,
    // 🟢 规律：San-Hyaku
    parts: { kanji: ['三', '百'], kana: ['さん', 'ひゃく'] },
    romaji: 'sa·n·hya·ku',
    // 🔴 变异：右边浊音化
    mutation: {
      unit: 'びゃく',
      romaji: 'sa·n·bya·ku',
    },
    note: {
      zh: '发生连浊 (Sequential Voicing): h → b',
      en: 'Rendaku occurs: h → b',
    },
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
    // 🟢 规律：Roku-Hyaku
    parts: { kanji: ['六', '百'], kana: ['ろく', 'ひゃく'] },
    romaji: 'ro·ku·hya·ku',
    // 🔴 变异：双侧音便
    mutation: {
      multiplier: 'ろっ',
      unit: 'ぴゃく',
      romaji: 'ro·p·pya·ku',
    },
    note: {
      zh: '发生促音变 (っ) 和半浊音变 (h → p)',
      en: 'Sokuon (っ) and Semi-voicing (h → p) occur',
    },
  },
  700: {
    num: 700,
    parts: { kanji: ['七', '百'], kana: ['なな', 'ひゃく'] },
    romaji: 'na·na·hya·ku',
  },
  800: {
    num: 800,
    // 🟢 规律：Hachi-Hyaku
    parts: { kanji: ['八', '百'], kana: ['はち', 'ひゃく'] },
    romaji: 'ha·chi·hya·ku',
    // 🔴 变异：双侧音便
    mutation: {
      multiplier: 'はっ',
      unit: 'ぴゃく',
      romaji: 'ha·p·pya·ku',
    },
    note: {
      zh: '发生促音变 (っ) 和半浊音变 (h → p)',
      en: 'Sokuon (っ) and Semi-voicing (h → p) occur',
    },
  },
  900: {
    num: 900,
    parts: { kanji: ['九', '百'], kana: ['きゅう', 'ひゃく'] },
    romaji: 'kyu·u·hya·ku',
  },
};
