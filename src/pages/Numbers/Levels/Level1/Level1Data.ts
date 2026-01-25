// 1. 定义一个通用的多语言类型
export interface LocalizedText {
  zh: string;
  en: string;
}

export interface NumberLevel1Item {
  num: number;
  kanji: string;
  readings: {
    romaji: string;
    kana: string;
    // 2. 将 usage 从 string 改为 LocalizedText
    usage?: LocalizedText;
    isMain?: boolean;
  }[];
}

export const LEVEL_1_DATA: Record<number, NumberLevel1Item> = {
  0: {
    num: 0,
    kanji: '零',
    readings: [
      {
        romaji: 'ze·ro',
        kana: 'ゼロ',
        usage: {
          zh: '通用读法（源自英语）。用于日常数数、电话号码。',
          en: 'Common reading (from English). Used for counting and phone numbers.',
        },
        isMain: true,
      },
      {
        romaji: 're·i',
        kana: 'れい',
        usage: {
          zh: '正式读法。常用于新闻播报（如降水概率、温度）。',
          en: 'Formal reading. Often used in news (e.g., probability of rain, temperature).',
        },
      },
    ],
  },
  1: {
    num: 1,
    kanji: '一',
    readings: [{ romaji: 'i·chi', kana: 'いち', isMain: true }],
  },
  2: {
    num: 2,
    kanji: '二',
    readings: [{ romaji: 'ni', kana: 'に', isMain: true }],
  },
  3: {
    num: 3,
    kanji: '三',
    readings: [{ romaji: 'sa·n', kana: 'さん', isMain: true }],
  },
  4: {
    num: 4,
    kanji: '四',
    readings: [
      {
        romaji: 'yo·n',
        kana: 'よん',
        usage: {
          zh: '通用读法。单独数数或接量词时的首选。',
          en: 'General reading. Preferred when counting alone or with counters.',
        },
        isMain: true,
      },
      {
        romaji: 'shi',
        kana: 'し',
        usage: {
          zh: '特定读法。主要用于：4月 (shigatsu) 等固定词汇。',
          en: 'Specific reading. Mainly for fixed terms like April (shigatsu).',
        },
      },
    ],
  },
  5: {
    num: 5,
    kanji: '五',
    readings: [{ romaji: 'go', kana: 'ご', isMain: true }],
  },
  6: {
    num: 6,
    kanji: '六',
    readings: [{ romaji: 'ro·ku', kana: 'ろく', isMain: true }],
  },
  7: {
    num: 7,
    kanji: '七',
    readings: [
      {
        romaji: 'na·na',
        kana: 'なな',
        usage: {
          zh: '通用读法。发音清晰，报电话号码或数数时首选。',
          en: 'General reading. Clearer sound, preferred for phone numbers or counting.',
        },
        isMain: true,
      },
      {
        romaji: 'shi·chi',
        kana: 'しち',
        usage: {
          zh: '特定读法。主要用于：7月 (shichigatsu)、7点 (shichiji)。',
          en: "Specific reading. Mainly for: July (shichigatsu), 7 o'clock (shichiji).",
        },
      },
    ],
  },
  8: {
    num: 8,
    kanji: '八',
    readings: [{ romaji: 'ha·chi', kana: 'はち', isMain: true }],
  },
  9: {
    num: 9,
    kanji: '九',
    readings: [
      {
        romaji: 'kyu·u',
        kana: 'きゅう',
        usage: {
          zh: '通用读法。用于日常数数及大多数场合。',
          en: 'General reading. Used for counting and most situations.',
        },
        isMain: true,
      },
      {
        romaji: 'ku',
        kana: 'く',
        usage: {
          zh: '特定读法。主要用于：9月 (kugatsu)、9点 (kuji)。',
          en: "Specific reading. Mainly for: September (kugatsu), 9 o'clock (kuji).",
        },
      },
    ],
  },
  10: {
    num: 10,
    kanji: '十',
    readings: [{ romaji: 'ju·u', kana: 'じゅう', isMain: true }],
  },
};
