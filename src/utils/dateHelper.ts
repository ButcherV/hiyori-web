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
