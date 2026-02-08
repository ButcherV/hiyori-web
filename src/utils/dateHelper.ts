import JapaneseHolidays from 'japanese-holidays';

/**
 * 1. 获取日语问候语 (Morning/Afternoon/Evening)
 */
export const getJapaneseGreeting = (date: Date = new Date()): string => {
  const hour = date.getHours();
  if (hour >= 5 && hour < 11) return 'おはよう';
  if (hour >= 11 && hour < 18) return 'こんにちは';
  return 'こんばんは';
};

/**
 * 2. 获取日期字符串 (例如: "12月18日")
 */
export const getJapaneseDateStr = (date: Date = new Date()): string => {
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

/**
 * 3. 获取星期几字符串 (例如: "木曜日")
 */
export const getJapaneseWeekday = (date: Date = new Date()): string => {
  const weekdays = [
    '日曜日',
    '月曜日',
    '火曜日',
    '水曜日',
    '木曜日',
    '金曜日',
    '土曜日',
  ];
  return weekdays[date.getDay()];
};

/**
 * 4. 获取节日名称 (如果是平日返回 null，如果是节日返回 "元日" 等)
 */
export const getJapaneseHoliday = (date: Date = new Date()): string | null => {
  // isHoliday 返回节日名称 string 或 undefined
  return JapaneseHolidays.isHoliday(date) || null;
};

/**
 * 5. 判断是否是 "红日子" (周日 或 节日)
 * 用于 UI 变色逻辑
 */
export const isRedDay = (date: Date = new Date()): boolean => {
  const isSunday = date.getDay() === 0;
  const isHoliday = !!JapaneseHolidays.isHoliday(date);
  return isSunday || isHoliday;
};

export const getRelativeLabel = (targetDate: Date): string | null => {
  const now = new Date();
  // 只比较日期部分，忽略时间
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate()
  );

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '今日';
  if (diffDays === 1) return '明日';
  if (diffDays === -1) return '昨日';
  return null;
};

// 🟢 新增：数字转汉字 (用于月份 1-12)
export const toKanjiNum = (num: number): string => {
  const kanji = [
    '〇',
    '一',
    '二',
    '三',
    '四',
    '五',
    '六',
    '七',
    '八',
    '九',
    '十',
  ];
  if (num <= 10) return kanji[num];
  if (num < 20) {
    return '十' + (num % 10 === 0 ? '' : kanji[num % 10]);
  }
  // 简单处理到 99 (满足年号和月份需求)
  return (
    kanji[Math.floor(num / 10)] + '十' + (num % 10 === 0 ? '' : kanji[num % 10])
  );
};

// 🟢 新增：获取汉字年号数字 (特殊处理元年)
export const getKanjiEraYear = (yearNum: number): string => {
  if (yearNum === 1) return '元年';
  return toKanjiNum(yearNum) + '年';
};

// 🟢 新增：和风月名常量
export const WAFU_GETSUMEI = [
  '睦月', // 1月
  '如月', // 2月
  '弥生', // 3月
  '卯月', // 4月
  '皐月', // 5月
  '水無月', // 6月
  '文月', // 7月
  '葉月', // 8月
  '長月', // 9月
  '神無月', // 10月
  '霜月', // 11月
  '師走', // 12月
];

/**
 * 获取月份的和风雅称
 * @param monthIndex 0-11 (Date.getMonth() 的返回值)
 */
export const getWafuMonth = (monthIndex: number): string => {
  return WAFU_GETSUMEI[monthIndex] || '';
};
