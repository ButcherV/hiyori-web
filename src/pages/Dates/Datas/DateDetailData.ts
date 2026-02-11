// 星期数据
export const WEEKDAY_DATA = [
  { kana: 'にちようび', romaji: 'ni·chi·yo·u·bi', en: 'Sunday' },
  { kana: 'げつようび', romaji: 'ge·tsu·yo·u·bi', en: 'Monday' },
  { kana: 'かようび', romaji: 'ka·yo·u·bi', en: 'Tuesday' },
  { kana: 'すいようび', romaji: 'su·i·yo·u·bi', en: 'Wednesday' },
  { kana: 'もくようび', romaji: 'mo·ku·yo·u·bi', en: 'Thursday' },
  { kana: 'きんようび', romaji: 'ki·n·yo·u·bi', en: 'Friday' },
  { kana: 'どようび', romaji: 'do·yo·u·bi', en: 'Saturday' },
];

// 月份数据
export const MONTH_DATA = [
  { kana: 'いちがつ', romaji: 'i·chi·ga·tsu', en: 'January' },
  { kana: 'にがつ', romaji: 'ni·ga·tsu', en: 'February' },
  { kana: 'さんがつ', romaji: 'sa·n·ga·tsu', en: 'March' },
  { kana: 'しがつ', romaji: 'shi·ga·tsu', en: 'April' },
  { kana: 'ごがつ', romaji: 'go·ga·tsu', en: 'May' },
  { kana: 'ろくがつ', romaji: 'ro·ku·ga·tsu', en: 'June' },
  { kana: 'しちがつ', romaji: 'shi·chi·ga·tsu', en: 'July' },
  { kana: 'はちがつ', romaji: 'ha·chi·ga·tsu', en: 'August' },
  { kana: 'くがつ', romaji: 'ku·ga·tsu', en: 'September' },
  { kana: 'じゅうがつ', romaji: 'ju·u·ga·tsu', en: 'October' },
  { kana: 'じゅういちがつ', romaji: 'ju·u·i·chi·ga·tsu', en: 'November' },
  { kana: 'じゅうにがつ', romaji: 'ju·u·ni·ga·tsu', en: 'December' },
];

// 年号数据 (升级为对象，包含罗马音)
export const ERA_DATA_MAP: Record<string, { kana: string; romaji: string }> = {
  reiwa: { kana: 'れいわ', romaji: 're·i·wa' },
  heisei: { kana: 'へいせい', romaji: 'he·i·se·i' },
  showa: { kana: 'しょうわ', romaji: 'sho·u·wa' },
  taisho: { kana: 'たいしょう', romaji: 'ta·i·sho·u' },
  meiji: { kana: 'めいじ', romaji: 'me·i·ji' },
};

// 相对时间映射
export const RELATIVE_MAP: Record<
  string,
  { kana: string; romaji: string; en: string }
> = {
  今日: { kana: 'きょう', romaji: 'kyo·u', en: 'Today' },
  明日: { kana: 'あした', romaji: 'a·shi·ta', en: 'Tomorrow' },
  昨日: { kana: 'きのう', romaji: 'ki·no·u', en: 'Yesterday' },
};
