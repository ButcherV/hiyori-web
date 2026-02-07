export type DateType = 'regular' | 'trap' | 'mutant' | 'rune';

export interface DateItem {
  id: number;
  kanji: string;
  kana: string;
  romaji: string;
  type: DateType;
  description?: string;
}

export const datesData: DateItem[] = [
  // 1-10: Rune (符文 - 特殊读法)
  {
    id: 1,
    kanji: '一日',
    kana: 'ついたち',
    romaji: 'tsu·i·ta·chi',
    type: 'rune',
    description: '特殊读法：语源是“月立”，代表新月出现',
  },
  {
    id: 2,
    kanji: '二日',
    kana: 'ふつか',
    romaji: 'fu·tsu·ka',
    type: 'rune',
    description: '固有训读：对应的计数是“ふたつ (2个)”',
  },
  {
    id: 3,
    kanji: '三日',
    kana: 'みっか',
    romaji: 'mi·k·ka',
    type: 'rune',
    description: '固有训读：对应的计数是“みっつ (3个)”',
  },
  {
    id: 4,
    kanji: '四日',
    kana: 'よっか',
    romaji: 'yo·k·ka',
    type: 'rune',
    description: '固有训读：对应的计数是“よっつ (4个)”',
  },
  {
    id: 5,
    kanji: '五日',
    kana: 'いつか',
    romaji: 'i·tsu·ka',
    type: 'rune',
    description: '固有训读：对应的计数是“いつつ (5个)”',
  },
  {
    id: 6,
    kanji: '六日',
    kana: 'むいか',
    romaji: 'mu·i·ka',
    type: 'rune',
    description: '固有训读：对应的计数是“むっつ (6个)”',
  },
  {
    id: 7,
    kanji: '七日',
    kana: 'なのか',
    romaji: 'na·no·ka',
    type: 'rune',
    description: '固有训读：对应的计数是“ななつ (7个)”',
  },
  {
    id: 8,
    kanji: '八日',
    kana: 'ようか',
    romaji: 'yo·u·ka',
    type: 'rune',
    description: '固有训读：对应的计数是“やっつ (8个)”',
  },
  {
    id: 9,
    kanji: '九日',
    kana: 'ここのか',
    romaji: 'ko·ko·no·ka',
    type: 'rune',
    description: '固有训读：对应的计数是“ここのつ (9个)”',
  },
  {
    id: 10,
    kanji: '十日',
    kana: 'とおか',
    romaji: 'to·o·ka',
    type: 'rune',
    description: '固有训读：对应的计数是“とお (10个)”',
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
    description: '音变：4 读作“よっか”，而不是“よん”',
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
    description: '注意：7 读作“しち” (shichi)，不是“なな”',
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
    description: '注意：9 读作“く” (ku)，不是“きゅう”',
  },

  // 20: Rune (大Boss)
  {
    id: 20,
    kanji: '二十日',
    kana: 'はつか',
    romaji: 'ha·tsu·ka',
    type: 'rune',
    description: '特殊单词：完全独立的读法，不仅是数字',
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
    description: '音变：4 依然读作“よっか”',
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
    description: '注意：7 读作“しち”',
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
    description: '注意：9 读作“く”',
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
