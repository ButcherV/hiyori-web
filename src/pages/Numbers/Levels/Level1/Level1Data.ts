export interface NumberLevel1Item {
  num: number;
  kanji: string;
  readings: {
    romaji: string;
    kana: string;
    usage?: string; // 详细用法说明
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
        usage: '源自英语 Zero，最常用的读法，用于数数、电话号码。',
        isMain: true,
      },
      {
        romaji: 're·i',
        kana: 'れい',
        usage: '较正式的读法。常用于新闻播报，如降水概率、温度。',
      },
    ],
  },
  1: {
    num: 1,
    kanji: '一',
    readings: [
      {
        romaji: 'i·chi',
        kana: 'いち',
        isMain: true,
      },
    ],
  },
  2: {
    num: 2,
    kanji: '二',
    readings: [
      {
        romaji: 'ni',
        kana: 'に',
        isMain: true,
      },
    ],
  },
  3: {
    num: 3,
    kanji: '三',
    readings: [
      {
        romaji: 'sa·n',
        kana: 'さん',
        isMain: true,
      },
    ],
  },
  4: {
    num: 4,
    kanji: '四',
    readings: [
      {
        romaji: 'yo·n',
        kana: 'よん',
        usage: '最通用的读法。单独数数或跟量词时多用这个。',
        isMain: true,
      },
      {
        romaji: 'shi',
        kana: 'し',
        usage: '专用于：4月 (shigatsu) 等固定词汇。',
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
    readings: [
      {
        romaji: 'ro·ku',
        kana: 'ろく',
        isMain: true,
      },
    ],
  },
  7: {
    num: 7,
    kanji: '七',
    readings: [
      {
        romaji: 'na·na',
        kana: 'なな',
        usage: '数数、报电话号码时首选，避免听错。',
        isMain: true,
      },
      {
        romaji: 'shi·chi',
        kana: 'しち',
        usage: '专用于：7月 (shichigatsu)、7点 (shichiji) 以及倒计时。',
      },
    ],
  },
  8: {
    num: 8,
    kanji: '八',
    readings: [
      {
        romaji: 'ha·chi',
        kana: 'はち',
        isMain: true,
      },
    ],
  },
  9: {
    num: 9,
    kanji: '九',
    readings: [
      {
        romaji: 'kyu·u',
        kana: 'きゅう',
        usage: '最通用的读法。',
        isMain: true,
      },
      {
        romaji: 'ku',
        kana: 'く',
        usage: '专用于：9月 (kugatsu)、9点 (kuji)。',
      },
    ],
  },
  10: {
    num: 10,
    kanji: '十',
    readings: [
      {
        romaji: 'ju·u',
        kana: 'じゅう',
        isMain: true,
      },
    ],
  },
};
