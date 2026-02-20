// 星期数据
export const WEEKDAY_DATA = [
  { kana: 'にちようび', romaji: 'ni·chi·yo·u·bi', en: 'Sunday',    zh: '周日' },
  { kana: 'げつようび', romaji: 'ge·tsu·yo·u·bi', en: 'Monday',    zh: '周一' },
  { kana: 'かようび',   romaji: 'ka·yo·u·bi',     en: 'Tuesday',   zh: '周二' },
  { kana: 'すいようび', romaji: 'su·i·yo·u·bi',   en: 'Wednesday', zh: '周三' },
  { kana: 'もくようび', romaji: 'mo·ku·yo·u·bi',  en: 'Thursday',  zh: '周四' },
  { kana: 'きんようび', romaji: 'ki·n·yo·u·bi',   en: 'Friday',    zh: '周五' },
  { kana: 'どようび',   romaji: 'do·yo·u·bi',     en: 'Saturday',  zh: '周六' },
];

// 月份数据
export const MONTH_DATA = [
  { kana: 'いちがつ',       romaji: 'i·chi·ga·tsu',       en: 'January',   zh: '一月' },
  { kana: 'にがつ',         romaji: 'ni·ga·tsu',           en: 'February',  zh: '二月' },
  { kana: 'さんがつ',       romaji: 'sa·n·ga·tsu',         en: 'March',     zh: '三月' },
  { kana: 'しがつ',         romaji: 'shi·ga·tsu',          en: 'April',     zh: '四月' },
  { kana: 'ごがつ',         romaji: 'go·ga·tsu',           en: 'May',       zh: '五月' },
  { kana: 'ろくがつ',       romaji: 'ro·ku·ga·tsu',        en: 'June',      zh: '六月' },
  { kana: 'しちがつ',       romaji: 'shi·chi·ga·tsu',      en: 'July',      zh: '七月' },
  { kana: 'はちがつ',       romaji: 'ha·chi·ga·tsu',       en: 'August',    zh: '八月' },
  { kana: 'くがつ',         romaji: 'ku·ga·tsu',           en: 'September', zh: '九月' },
  { kana: 'じゅうがつ',     romaji: 'ju·u·ga·tsu',         en: 'October',   zh: '十月' },
  { kana: 'じゅういちがつ', romaji: 'ju·u·i·chi·ga·tsu',  en: 'November',  zh: '十一月' },
  { kana: 'じゅうにがつ',   romaji: 'ju·u·ni·ga·tsu',     en: 'December',  zh: '十二月' },
];

// 年号数据
export const ERA_DATA_MAP: Record<string, { kana: string; romaji: string }> = {
  reiwa:  { kana: 'れいわ',     romaji: 're·i·wa'    },
  heisei: { kana: 'へいせい',   romaji: 'he·i·se·i'  },
  showa:  { kana: 'しょうわ',   romaji: 'sho·u·wa'   },
  taisho: { kana: 'たいしょう', romaji: 'ta·i·sho·u' },
  meiji:  { kana: 'めいじ',     romaji: 'me·i·ji'    },
};

// 相对时间映射
export const RELATIVE_MAP: Record<
  string,
  { kana: string; romaji: string; en: string; zh: string }
> = {
  今日: { kana: 'きょう',   romaji: 'kyo·u',      en: 'Today',     zh: '今天' },
  明日: { kana: 'あした',   romaji: 'a·shi·ta',   en: 'Tomorrow',  zh: '明天' },
  昨日: { kana: 'きのう',   romaji: 'ki·no·u',    en: 'Yesterday', zh: '昨天' },
};
