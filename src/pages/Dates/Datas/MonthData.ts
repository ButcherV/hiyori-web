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
  wafuMeaning: string; // 🟢 新增：文化意译

  // 视觉层
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  themeColor: string;
  icon: string;

  // 逻辑层
  trapDetail?: {
    wrongKana: string;
    wrongRomaji: string;
    // correctKana/Romaji 其实就是上面的 kana/romaji，这里主要存错的即可
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
    wafuMeaning: 'Month of Harmony', // 亲友和睦
    season: 'winter',
    themeColor: '#C0392B', // 紅 crimson
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
    wafuMeaning: 'Month of Changing Clothes', // 更衣（穿更多）
    season: 'winter',
    themeColor: '#4A6FA5', // 藍鼠 slate blue
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
    themeColor: '#C2185B', // 桜色 cherry blossom
    icon: 'Flower2',
    wafuMeaning: 'Month of Growth', // 草木新生
  },
  // 🟢 4月 (陷阱)
  {
    id: 4,
    kanji: '四月',
    kana: 'しがつ', // ✅ 这里是完整的正确读音
    romaji: 'shi·ga·tsu',
    wafuName: '卯月',
    wafuKana: 'うづき',
    wafuRomaji: 'u·du·ki',
    wafuMeaning: 'Month of U-Flowers', // 卯花盛开
    season: 'spring',
    themeColor: '#7C3AED', // 藤色 wisteria
    icon: 'Sprout',
    trapDetail: {
      wrongKana: 'よんがつ', // ❌ 完整的错误读法
      wrongRomaji: 'yon·ga·tsu',
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
    wafuMeaning: 'Month of Rice Sprouts', // 插秧
    season: 'spring',
    themeColor: '#2F6E3B', // 若草色 fresh green
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
    wafuMeaning: 'Month of Water', // 这里的"无"其实是"之"的意思
    season: 'summer',
    themeColor: '#0D7377', // 浅葱色 teal
    icon: 'Droplets',
  },
  // 🟢 7月 (陷阱)
  {
    id: 7,
    kanji: '七月',
    kana: 'しちがつ', // ✅ 正确
    romaji: 'shi·chi·ga·tsu',
    wafuName: '文月',
    wafuKana: 'ふみづき',
    wafuRomaji: 'fu·mi·du·ki',
    wafuMeaning: 'Month of Letters', // 七夕写诗
    season: 'summer',
    themeColor: '#1E3A8A', // 瑠璃色 lapis blue
    icon: 'Star',
    trapDetail: {
      wrongKana: 'なながつ',
      wrongRomaji: 'nana·ga·tsu',
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
    wafuMeaning: 'Month of Leaves', // 旧历叶落
    season: 'summer',
    themeColor: '#B45309', // 向日葵 amber
    icon: 'Sun',
  },
  // 🟢 9月 (陷阱)
  {
    id: 9,
    kanji: '九月',
    kana: 'くがつ', // ✅ 正确
    romaji: 'ku·ga·tsu',
    wafuName: '長月',
    wafuKana: 'ながつき',
    wafuRomaji: 'na·ga·tsu·ki',
    wafuMeaning: 'Month of Long Nights', // 夜长
    season: 'autumn',
    themeColor: '#9A3412', // 柿色 persimmon
    icon: 'Moon',
    trapDetail: {
      wrongKana: 'きゅうがつ',
      wrongRomaji: 'kyuu·ga·tsu',
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
    wafuMeaning: 'Month of No Gods', // 众神去出云了
    season: 'autumn',
    themeColor: '#9F1239', // 茜色 madder red
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
    wafuMeaning: 'Month of Frost',
    season: 'autumn',
    themeColor: '#4B5563', // 利休鼠 sage grey
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
    wafuMeaning: 'Priests Running', // 忙碌的年末
    season: 'winter',
    themeColor: '#3730A3', // 藍 deep indigo
    icon: 'Timer',
  },
];
