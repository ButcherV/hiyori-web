export interface WeekDayItem {
  id: number; // 0 (Sun) - 6 (Sat)
  kanji: string;
  kana: string;
  romaji: string;
  english: string;
  element: string; // 中文意象
  icon: string; // Lucide icon name
  colorVar: string; // 对应的 CSS 变量名或颜色值
}

export const weekData: WeekDayItem[] = [
  {
    id: 0,
    kanji: '日曜日',
    kana: 'にちようび',
    romaji: 'ni·chi·yo·u·bi',
    english: 'Sunday',
    element: '日 (Sun)',
    icon: 'Sun',
    colorVar: '--color-date-sun-text', // 红色
  },
  {
    id: 1,
    kanji: '月曜日',
    kana: 'げつようび',
    romaji: 'ge·tsu·yo·u·bi',
    english: 'Monday',
    element: '月 (Moon)',
    icon: 'Moon',
    colorVar: '#475569', // 深灰
  },
  {
    id: 2,
    kanji: '火曜日',
    kana: 'かようび',
    romaji: 'ka·yo·u·bi',
    english: 'Tuesday',
    element: '火 (Fire)',
    icon: 'Flame',
    colorVar: '#ea580c', // 橙红
  },
  {
    id: 3,
    kanji: '水曜日',
    kana: 'すいようび',
    romaji: 'su·i·yo·u·bi',
    english: 'Wednesday',
    element: '水 (Water)',
    icon: 'Droplets',
    colorVar: '#0ea5e9', // 亮蓝
  },
  {
    id: 4,
    kanji: '木曜日',
    kana: 'もくようび',
    romaji: 'mo·ku·yo·u·bi',
    english: 'Thursday',
    element: '木 (Wood)',
    icon: 'Trees',
    colorVar: '#16a34a', // 绿色
  },
  {
    id: 5,
    kanji: '金曜日',
    kana: 'きんようび',
    romaji: 'ki·n·yo·u·bi',
    english: 'Friday',
    element: '金 (Gold)',
    icon: 'Gem', // 宝石/金币
    colorVar: '#ca8a04', // 金色
  },
  {
    id: 6,
    kanji: '土曜日',
    kana: 'どようび',
    romaji: 'do·yo·u·bi',
    english: 'Saturday',
    element: '土 (Earth)',
    icon: 'Mountain', // 大地/山
    colorVar: '--color-date-sat-text', // 蓝色
  },
];
