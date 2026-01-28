// 复用或重新定义通用多语言类型
export interface LocalizedText {
  zh: string;
  en: string;
}

export interface NumberLevel3Item {
  num: number;
  parts: {
    kanji: [string, string?];
    kana: [string, string];
  };
  romaji: string;
  evolution?: {
    multiplier: { from: string; to: string };
    unit: { from: string; to: string };
  };
  // 🔴 回归内联模式：直接包含中英文
  reason?: LocalizedText;
}

export const LEVEL_3_DATA: Record<number, NumberLevel3Item> = {
  100: {
    num: 100,
    parts: { kanji: ['', '百'], kana: ['', 'ひゃく'] },
    romaji: 'hya·ku',
    // 🔴 100 特殊提示
    reason: {
      zh: '注意：100 直接读 Hyaku，不需要加“一” (Ichi)。',
      en: "Note: 100 is just 'Hyaku'. No 'Ichi' added.",
    },
  },
  200: {
    num: 200,
    parts: { kanji: ['二', '百'], kana: ['に', 'ひゃく'] },
    romaji: 'ni·hya·ku',
  },
  300: {
    num: 300,
    parts: { kanji: ['三', '百'], kana: ['さん', 'びゃく'] },
    romaji: 'sa·n·bya·ku',
    evolution: {
      multiplier: { from: 'さん', to: 'さん' },
      unit: { from: 'ひゃく', to: 'びゃく' },
    },
    // 🔴 300 浊音化
    reason: {
      zh: '“三” (n) 结尾诱发了“百”的【浊音化】 (h → b)',
      en: "'San' causes Rendaku (Sequential Voicing): h → b.",
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
    parts: { kanji: ['六', '百'], kana: ['ろっ', 'ぴゃく'] },
    romaji: 'ro·p·pya·ku',
    evolution: {
      multiplier: { from: 'ろく', to: 'ろっ' },
      unit: { from: 'ひゃく', to: 'ぴゃく' },
    },
    // 🔴 600 促音+半浊音
    reason: {
      zh: '为了发音流利，产生了【促音化】(っ) 与【半浊音化】(h → p)',
      en: 'Sokuon + Semi-voicing occur for easier pronunciation: h → p.',
    },
  },
  700: {
    num: 700,
    parts: { kanji: ['七', '百'], kana: ['なな', 'ひゃく'] },
    romaji: 'na·na·hya·ku',
  },
  800: {
    num: 800,
    parts: { kanji: ['八', '百'], kana: ['はっ', 'ぴゃく'] },
    romaji: 'ha·p·pya·ku',
    evolution: {
      multiplier: { from: 'はち', to: 'はっ' },
      unit: { from: 'ひゃく', to: 'ぴゃく' },
    },
    // 🔴 800 同 600
    reason: {
      zh: '为了发音流利，产生了【促音化】(っ) 与【半浊音化】(h → p)',
      en: 'Sokuon + Semi-voicing occur for easier pronunciation: h → p.',
    },
  },
  900: {
    num: 900,
    parts: { kanji: ['九', '百'], kana: ['きゅう', 'ひゃく'] },
    romaji: 'kyu·u·hya·ku',
  },
};
