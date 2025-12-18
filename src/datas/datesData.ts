export interface DateItem {
  id: number;
  kanji: string;
  kana: string;
  romaji: string;
  isIrregular: boolean; // 是否是不规则读音 (难点)
}

export const datesData: DateItem[] = [
  { id: 1, kanji: '一日', kana: 'ついたち', romaji: 'tsuitachi', isIrregular: true },
  { id: 2, kanji: '二日', kana: 'ふつか', romaji: 'futsuka', isIrregular: true },
  { id: 3, kanji: '三日', kana: 'みっか', romaji: 'mikka', isIrregular: true },
  { id: 4, kanji: '四日', kana: 'よっか', romaji: 'yokka', isIrregular: true },
  { id: 5, kanji: '五日', kana: 'いつか', romaji: 'itsuka', isIrregular: true },
  { id: 6, kanji: '六日', kana: 'むいか', romaji: 'muika', isIrregular: true },
  { id: 7, kanji: '七日', kana: 'なのか', romaji: 'nanoka', isIrregular: true },
  { id: 8, kanji: '八日', kana: 'ようか', romaji: 'youka', isIrregular: true },
  { id: 9, kanji: '九日', kana: 'ここのか', romaji: 'kokonoka', isIrregular: true },
  { id: 10, kanji: '十日', kana: 'とおか', romaji: 'tooka', isIrregular: true },
  { id: 11, kanji: '十一日', kana: 'じゅういちにち', romaji: 'juuichi-nichi', isIrregular: false },
  { id: 12, kanji: '十二日', kana: 'じゅうににち', romaji: 'juuni-nichi', isIrregular: false },
  { id: 13, kanji: '十三日', kana: 'じゅうさんにち', romaji: 'juusan-nichi', isIrregular: false },
  { id: 14, kanji: '十四日', kana: 'じゅうよっか', romaji: 'juuyokka', isIrregular: true }, // Irregular
  { id: 15, kanji: '十五日', kana: 'じゅうごにち', romaji: 'juugo-nichi', isIrregular: false },
  { id: 16, kanji: '十六日', kana: 'じゅうろくにち', romaji: 'juuroku-nichi', isIrregular: false },
  { id: 17, kanji: '十七日', kana: 'じゅうしちにち', romaji: 'juushichi-nichi', isIrregular: false },
  { id: 18, kanji: '十八日', kana: 'じゅうはちにち', romaji: 'juuhachi-nichi', isIrregular: false },
  { id: 19, kanji: '十九日', kana: 'じゅうくにち', romaji: 'juuku-nichi', isIrregular: false },
  { id: 20, kanji: '二十日', kana: 'はつか', romaji: 'hatsuka', isIrregular: true }, // Super Irregular
  { id: 21, kanji: '二十一日', kana: 'にじゅういちにち', romaji: 'nijuuichi-nichi', isIrregular: false },
  { id: 22, kanji: '二十二日', kana: 'にじゅうににち', romaji: 'nijuuni-nichi', isIrregular: false },
  { id: 23, kanji: '二十三日', kana: 'にじゅうさんにち', romaji: 'nijuusan-nichi', isIrregular: false },
  { id: 24, kanji: '二十四日', kana: 'にじゅうよっか', romaji: 'nijuuyokka', isIrregular: true }, // Irregular
  { id: 25, kanji: '二十五日', kana: 'にじゅうごにち', romaji: 'nijuugo-nichi', isIrregular: false },
  { id: 26, kanji: '二十六日', kana: 'にじゅうろくにち', romaji: 'nijuuroku-nichi', isIrregular: false },
  { id: 27, kanji: '二十七日', kana: 'にじゅうしちにち', romaji: 'nijuushichi-nichi', isIrregular: false },
  { id: 28, kanji: '二十八日', kana: 'にじゅうはちにち', romaji: 'nijuuhachi-nichi', isIrregular: false },
  { id: 29, kanji: '二十九日', kana: 'にじゅうくにち', romaji: 'nijuuku-nichi', isIrregular: false },
  { id: 30, kanji: '三十日', kana: 'さんじゅうにち', romaji: 'sanjuu-nichi', isIrregular: false },
  { id: 31, kanji: '三十一日', kana: 'さんじゅういちにち', romaji: 'sanjuuichi-nichi', isIrregular: false },
];