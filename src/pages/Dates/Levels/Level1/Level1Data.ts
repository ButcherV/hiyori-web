// src/pages/Dates/Levels/Level1/Level1Data.ts

export type DateType = 'regular' | 'trap' | 'mutant' | 'rune';

export interface DateItem {
  id: number;
  kanji: string;
  kana: string;
  romaji: string;
  type: DateType;
  // 🟢 修改点：description 变为支持多语言的对象
  description?: {
    zh: string;
    en: string;
  };
}

export const datesData: DateItem[] = [
  // 1-10: Rune (符文 - 特殊读法)
  {
    id: 1,
    kanji: '一日',
    kana: 'ついたち',
    romaji: 'tsu·i·ta·chi',
    type: 'rune',
    description: {
      zh: '特殊读法：语源为“月立 (Tsuki Tachi)”，意为新月出现。',
      en: "Special reading: Derived from 'Tsuki Tachi', meaning the rising moon.",
    },
  },
  {
    id: 2,
    kanji: '二日',
    kana: 'ふつか',
    romaji: 'fu·tsu·ka',
    type: 'rune',
    description: {
      zh: '固有训读：源自通用计数法“ふたつ (2个)”。',
      en: "Native reading: Derived from the general counter 'Futatsu' (2 items).",
    },
  },
  {
    id: 3,
    kanji: '三日',
    kana: 'みっか',
    romaji: 'mi·k·ka',
    type: 'rune',
    description: {
      zh: '固有训读：源自通用计数法“みっつ (3个)”。',
      en: "Native reading: Derived from the general counter 'Mittsu' (3 items).",
    },
  },
  {
    id: 4,
    kanji: '四日',
    kana: 'よっか',
    romaji: 'yo·k·ka',
    type: 'rune',
    description: {
      zh: '固有训读：源自通用计数法“よっつ (4个)”。',
      en: "Native reading: Derived from the general counter 'Yottsu' (4 items).",
    },
  },
  {
    id: 5,
    kanji: '五日',
    kana: 'いつか',
    romaji: 'i·tsu·ka',
    type: 'rune',
    description: {
      zh: '固有训读：源自通用计数法“いつつ (5个)”。',
      en: "Native reading: Derived from the general counter 'Itsutsu' (5 items).",
    },
  },
  {
    id: 6,
    kanji: '六日',
    kana: 'むいか',
    romaji: 'mu·i·ka',
    type: 'rune',
    description: {
      zh: '固有训读：源自通用计数法“むっつ (6个)”。',
      en: "Native reading: Derived from the general counter 'Muttsu' (6 items).",
    },
  },
  {
    id: 7,
    kanji: '七日',
    kana: 'なのか',
    romaji: 'na·no·ka',
    type: 'rune',
    description: {
      zh: '固有训读：源自通用计数法“ななつ (7个)”。',
      en: "Native reading: Derived from the general counter 'Nanatsu' (7 items).",
    },
  },
  {
    id: 8,
    kanji: '八日',
    kana: 'ようか',
    romaji: 'yo·u·ka',
    type: 'rune',
    description: {
      zh: '固有训读：源自通用计数法“やっつ (8个)”。',
      en: "Native reading: Derived from the general counter 'Yattsu' (8 items).",
    },
  },
  {
    id: 9,
    kanji: '九日',
    kana: 'ここのか',
    romaji: 'ko·ko·no·ka',
    type: 'rune',
    description: {
      zh: '固有训读：源自通用计数法“ここのつ (9个)”。',
      en: "Native reading: Derived from the general counter 'Kokonotsu' (9 items).",
    },
  },
  {
    id: 10,
    kanji: '十日',
    kana: 'とおか',
    romaji: 'to·o·ka',
    type: 'rune',
    description: {
      zh: '固有训读：源自通用计数法“とお (10个)”。',
      en: "Native reading: Derived from the general counter 'Too' (10 items).",
    },
  },

  // 11-13: Regular
  {
    id: 11,
    kanji: '十一日',
    kana: 'じゅういちにち',
    romaji: 'ju·u·i·chi·ni·chi',
    type: 'regular',
  },
  {
    id: 12,
    kanji: '十二日',
    kana: 'じゅうににち',
    romaji: 'ju·u·ni·ni·chi',
    type: 'regular',
  },
  {
    id: 13,
    kanji: '十三日',
    kana: 'じゅうさんにち',
    romaji: 'ju·u·sa·n·ni·chi',
    type: 'regular',
  },

  // 14: Mutant (变异 - 4的特殊读法)
  {
    id: 14,
    kanji: '十四日',
    kana: 'じゅうよっか',
    romaji: 'ju·u·yo·k·ka',
    type: 'mutant',
    description: {
      zh: '音变现象：数字 4 需读作“よっか (yokka)”。',
      en: "Sound change: The number 4 must be read as 'yokka'.",
    },
  },

  // 15-16: Regular
  {
    id: 15,
    kanji: '十五日',
    kana: 'じゅうごにち',
    romaji: 'ju·u·go·ni·chi',
    type: 'regular',
  },
  {
    id: 16,
    kanji: '十六日',
    kana: 'じゅうろくにち',
    romaji: 'ju·u·ro·ku·ni·chi',
    type: 'regular',
  },

  // 17: Trap (陷阱 - 7的读音)
  {
    id: 17,
    kanji: '十七日',
    kana: 'じゅうしちにち',
    romaji: 'ju·u·shi·chi·ni·chi',
    type: 'trap',
    description: {
      zh: '发音注意：7 必须读作“しち (shichi)”，不能读“なな (nana)”。',
      en: "Warning: 7 must be read as 'shichi', not 'nana'.",
    },
  },

  // 18: Regular
  {
    id: 18,
    kanji: '十八日',
    kana: 'じゅうはちにち',
    romaji: 'ju·u·ha·chi·ni·chi',
    type: 'regular',
  },

  // 19: Trap (陷阱 - 9的读音)
  {
    id: 19,
    kanji: '十九日',
    kana: 'じゅうくにち',
    romaji: 'ju·u·ku·ni·chi',
    type: 'trap',
    description: {
      zh: '发音注意：9 必须读作“く (ku)”，不能读“きゅう (kyuu)”。',
      en: "Warning: 9 must be read as 'ku', not 'kyuu'.",
    },
  },

  // 20: Rune (大Boss)
  {
    id: 20,
    kanji: '二十日',
    kana: 'はつか',
    romaji: 'ha·tsu·ka',
    type: 'rune',
    description: {
      zh: '特殊读法：完全独立的单词，不遵循数字拼接规律。',
      en: 'Special reading: A unique word that does not follow number rules.',
    },
  },

  // 21-23: Regular
  {
    id: 21,
    kanji: '二十一日',
    kana: 'にじゅういちにち',
    romaji: 'ni·ju·u·i·chi·ni·chi',
    type: 'regular',
  },
  {
    id: 22,
    kanji: '二十二日',
    kana: 'にじゅうににち',
    romaji: 'ni·ju·u·ni·ni·chi',
    type: 'regular',
  },
  {
    id: 23,
    kanji: '二十三日',
    kana: 'にじゅうさんにち',
    romaji: 'ni·ju·u·sa·n·ni·chi',
    type: 'regular',
  },

  // 24: Mutant
  {
    id: 24,
    kanji: '二十四日',
    kana: 'にじゅうよっか',
    romaji: 'ni·ju·u·yo·k·ka',
    type: 'mutant',
    description: {
      zh: '音变现象：数字 4 需读作“よっか (yokka)”。',
      en: "Sound change: The number 4 must be read as 'yokka'.",
    },
  },

  // 25-26: Regular
  {
    id: 25,
    kanji: '二十五日',
    kana: 'にじゅうごにち',
    romaji: 'ni·ju·u·go·ni·chi',
    type: 'regular',
  },
  {
    id: 26,
    kanji: '二十六日',
    kana: 'にじゅうろくにち',
    romaji: 'ni·ju·u·ro·ku·ni·chi',
    type: 'regular',
  },

  // 27: Trap
  {
    id: 27,
    kanji: '二十七日',
    kana: 'にじゅうしちにち',
    romaji: 'ni·ju·u·shi·chi·ni·chi',
    type: 'trap',
    description: {
      zh: '发音注意：7 必须读作“しち (shichi)”，不能读“なな (nana)”。',
      en: "Warning: 7 must be read as 'shichi', not 'nana'.",
    },
  },

  // 28: Regular
  {
    id: 28,
    kanji: '二十八日',
    kana: 'にじゅうはちにち',
    romaji: 'ni·ju·u·ha·chi·ni·chi',
    type: 'regular',
  },

  // 29: Trap
  {
    id: 29,
    kanji: '二十九日',
    kana: 'にじゅうくにち',
    romaji: 'ni·ju·u·ku·ni·chi',
    type: 'trap',
    description: {
      zh: '发音注意：9 必须读作“く (ku)”，不能读“きゅう (kyuu)”。',
      en: "Warning: 9 must be read as 'ku', not 'kyuu'.",
    },
  },

  // 30-31: Regular
  {
    id: 30,
    kanji: '三十日',
    kana: 'さんじゅうにち',
    romaji: 'sa·n·ju·u·ni·chi',
    type: 'regular',
  },
  {
    id: 31,
    kanji: '三十一日',
    kana: 'さんじゅういちにち',
    romaji: 'sa·n·ju·u·i·chi·ni·chi',
    type: 'regular',
  },
];
