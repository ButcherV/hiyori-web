// src/pages/Dates/Datas/MonthData.ts

export interface MonthItem {
  id: number;
  kanji: string;
  kana: string;
  romaji: string;

  // 文化层
  wafuName: string;
  wafuKana: string;
  wafuRomaji: string;

  // 视觉层
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  themeColor: string;
  icon: string;

  // 🟢 核心升级：不再是冷冰冰的 true/false，而是详细的纠错指南
  trapDetail?: {
    wrongKana: string; // 错误的假名 (よん)
    wrongRomaji: string; // 错误的罗马音 (yon)
    correctKana: string; // 正确的假名 (し)
    correctRomaji: string; // 正确的罗马音 (shi)
  };
}

export const monthData: MonthItem[] = [
  {
    id: 1,
    kanji: '一月',
    kana: 'いちがつ',
    romaji: 'i·chi·ga·tsu',
    wafuName: '睦月',
    wafuKana: 'むつき',
    wafuRomaji: 'mu·tsu·ki',
    season: 'winter',
    themeColor: '#ef4444',
    icon: 'Trees',
  },
  {
    id: 2,
    kanji: '二月',
    kana: 'にがつ',
    romaji: 'ni·ga·tsu',
    wafuName: '如月',
    wafuKana: 'きさらぎ',
    wafuRomaji: 'ki·sa·ra·gi',
    season: 'winter',
    themeColor: '#94a3b8',
    icon: 'Snowflake',
  },
  {
    id: 3,
    kanji: '三月',
    kana: 'さんがつ',
    romaji: 'sa·n·ga·tsu',
    wafuName: '弥生',
    wafuKana: 'やよい',
    wafuRomaji: 'ya·yo·i',
    season: 'spring',
    themeColor: '#f9a8d4',
    icon: 'Flower',
  },
  // 🟢 4月：这是重灾区
  {
    id: 4,
    kanji: '四月',
    kana: 'しがつ',
    romaji: 'shi·ga·tsu',
    wafuName: '卯月',
    wafuKana: 'うづき',
    wafuRomaji: 'u·du·ki',
    season: 'spring',
    themeColor: '#c084fc',
    icon: 'Sprout',
    trapDetail: {
      wrongKana: 'よん',
      wrongRomaji: 'yon',
      correctKana: 'し',
      correctRomaji: 'shi',
    },
  },
  {
    id: 5,
    kanji: '五月',
    kana: 'ごがつ',
    romaji: 'go·ga·tsu',
    wafuName: '皐月',
    wafuKana: 'さつき',
    wafuRomaji: 'sa·tsu·ki',
    season: 'spring',
    themeColor: '#4ade80',
    icon: 'Leaf',
  },
  {
    id: 6,
    kanji: '六月',
    kana: 'ろくがつ',
    romaji: 'ro·ku·ga·tsu',
    wafuName: '水無月',
    wafuKana: 'みなづき',
    wafuRomaji: 'mi·na·du·ki',
    season: 'summer',
    themeColor: '#38bdf8',
    icon: 'Droplets',
  },
  // 🟢 7月：另一个陷阱
  {
    id: 7,
    kanji: '七月',
    kana: 'しちがつ',
    romaji: 'shi·chi·ga·tsu',
    wafuName: '文月',
    wafuKana: 'ふみづき',
    wafuRomaji: 'fu·mi·du·ki',
    season: 'summer',
    themeColor: '#60a5fa',
    icon: 'Star',
    trapDetail: {
      wrongKana: 'なな',
      wrongRomaji: 'nana',
      correctKana: 'しち',
      correctRomaji: 'shichi',
    },
  },
  {
    id: 8,
    kanji: '八月',
    kana: 'はちがつ',
    romaji: 'ha·chi·ga·tsu',
    wafuName: '葉月',
    wafuKana: 'はづき',
    wafuRomaji: 'ha·du·ki',
    season: 'summer',
    themeColor: '#facc15',
    icon: 'Sun',
  },
  // 🟢 9月：最后的陷阱
  {
    id: 9,
    kanji: '九月',
    kana: 'くがつ',
    romaji: 'ku·ga·tsu',
    wafuName: '長月',
    wafuKana: 'ながつき',
    wafuRomaji: 'na·ga·tsu·ki',
    season: 'autumn',
    themeColor: '#fb923c',
    icon: 'Moon',
    trapDetail: {
      wrongKana: 'きゅう',
      wrongRomaji: 'kyuu',
      correctKana: 'く',
      correctRomaji: 'ku',
    },
  },
  {
    id: 10,
    kanji: '十月',
    kana: 'じゅうがつ',
    romaji: 'ju·u·ga·tsu',
    wafuName: '神無月',
    wafuKana: 'かんなづき',
    wafuRomaji: 'ka·n·na·du·ki',
    season: 'autumn',
    themeColor: '#f87171',
    icon: 'Wind',
  },
  {
    id: 11,
    kanji: '十一月',
    kana: 'じゅういちがつ',
    romaji: 'ju·u·i·chi·ga·tsu',
    wafuName: '霜月',
    wafuKana: 'しもつき',
    wafuRomaji: 'shi·mo·tsu·ki',
    season: 'autumn',
    themeColor: '#94a3b8',
    icon: 'CloudSnow',
  },
  {
    id: 12,
    kanji: '十二月',
    kana: 'じゅうにがつ',
    romaji: 'ju·u·ni·ga·tsu',
    wafuName: '師走',
    wafuKana: 'しわす',
    wafuRomaji: 'shi·wa·su',
    season: 'winter',
    themeColor: '#475569',
    icon: 'Timer',
  },
];
