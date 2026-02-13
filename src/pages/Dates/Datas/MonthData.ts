export interface MonthItem {
  id: number; // 1-12
  kanji: string; // 1月
  kana: string; // いちがつ
  romaji: string; // i·chi·ga·tsu
  wafuName: string; // 睦月
  wafuKana: string; // むつき
  wafuRomaji: string; // mu·tsu·ki
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  themeColor: string; // 季节主色
  icon: string; // 装饰图标名 (Lucide)
}

export const monthData: MonthItem[] = [
  // Winter (12, 1, 2)
  {
    id: 1,
    kanji: '一月',
    kana: 'いちがつ',
    romaji: 'i·chi·ga·tsu',
    wafuName: '睦月',
    wafuKana: 'むつき',
    wafuRomaji: 'mu·tsu·ki',
    season: 'winter',
    themeColor: '#cbd5e1', // Slate-300
    icon: 'Snowflake',
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
    themeColor: '#94a3b8', // Slate-400
    icon: 'Wind',
  },
  // Spring (3, 4, 5)
  {
    id: 3,
    kanji: '三月',
    kana: 'さんがつ',
    romaji: 'sa·n·ga·tsu',
    wafuName: '弥生',
    wafuKana: 'やよい',
    wafuRomaji: 'ya·yo·i',
    season: 'spring',
    themeColor: '#f9a8d4', // Pink-300
    icon: 'Flower',
  },
  {
    id: 4,
    kanji: '四月',
    kana: 'しがつ',
    romaji: 'shi·ga·tsu',
    wafuName: '卯月',
    wafuKana: 'うづき',
    wafuRomaji: 'u·du·ki',
    season: 'spring',
    themeColor: '#f472b6', // Pink-400
    icon: 'Cherry', // 需要找个类似樱花的
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
    themeColor: '#86efac', // Green-300
    icon: 'Sprout',
  },
  // Summer (6, 7, 8)
  {
    id: 6,
    kanji: '六月',
    kana: 'ろくがつ',
    romaji: 'ro·ku·ga·tsu',
    wafuName: '水無月',
    wafuKana: 'みなづき',
    wafuRomaji: 'mi·na·du·ki',
    season: 'summer',
    themeColor: '#7dd3fc', // Sky-300
    icon: 'Droplets',
  },
  {
    id: 7,
    kanji: '七月',
    kana: 'しちがつ',
    romaji: 'shi·chi·ga·tsu',
    wafuName: '文月',
    wafuKana: 'ふみづき',
    wafuRomaji: 'fu·mi·du·ki',
    season: 'summer',
    themeColor: '#38bdf8', // Sky-400
    icon: 'Sun',
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
    themeColor: '#4ade80', // Green-400 (深夏)
    icon: 'Trees',
  },
  // Autumn (9, 10, 11)
  {
    id: 9,
    kanji: '九月',
    kana: 'くがつ',
    romaji: 'ku·ga·tsu',
    wafuName: '長月',
    wafuKana: 'ながつき',
    wafuRomaji: 'na·ga·tsu·ki',
    season: 'autumn',
    themeColor: '#fdba74', // Orange-300
    icon: 'Moon',
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
    themeColor: '#fb923c', // Orange-400
    icon: 'Cloud', // 暂代
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
    themeColor: '#94a3b8', // Slate-400 (初冬感)
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
    themeColor: '#64748b', // Slate-500
    icon: 'Timer', // 忙碌感
  },
];
