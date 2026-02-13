// src/pages/Dates/components/WeekLearning/WeekData.tsx

export interface WeekDayItem {
  id: number;
  kanji: string;
  kana: string;
  romaji: string;
  english: string;
  element: string;
  icon: string;
  // 🟢 新增：专属渐变背景
  gradient: string;
  // 🟢 新增：阴影色
  shadowColor: string;
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
    // 太阳：热烈的橙红渐变
    gradient: 'linear-gradient(135deg, #ef4444 0%, #f97316 100%)',
    shadowColor: 'rgba(239, 68, 68, 0.4)',
  },
  {
    id: 1,
    kanji: '月曜日',
    kana: 'げつようび',
    romaji: 'ge·tsu·yo·u·bi',
    english: 'Monday',
    element: '月 (Moon)',
    icon: 'Moon',
    // 月亮：静谧的岩石灰蓝
    gradient: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
    shadowColor: 'rgba(71, 85, 105, 0.4)',
  },
  {
    id: 2,
    kanji: '火曜日',
    kana: 'かようび',
    romaji: 'ka·yo·u·bi',
    english: 'Tuesday',
    element: '火 (Fire)',
    icon: 'Flame',
    // 火：明亮的橘红
    gradient: 'linear-gradient(135deg, #ea580c 0%, #dc2626 100%)',
    shadowColor: 'rgba(234, 88, 12, 0.4)',
  },
  {
    id: 3,
    kanji: '水曜日',
    kana: 'すいようび',
    romaji: 'su·i·yo·u·bi',
    english: 'Wednesday',
    element: '水 (Water)',
    icon: 'Droplets',
    // 水：清澈的青蓝
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
    shadowColor: 'rgba(14, 165, 233, 0.4)',
  },
  {
    id: 4,
    kanji: '木曜日',
    kana: 'もくようび',
    romaji: 'mo·ku·yo·u·bi',
    english: 'Thursday',
    element: '木 (Wood)',
    icon: 'Trees',
    // 木：自然的翠绿
    gradient: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
    shadowColor: 'rgba(22, 163, 74, 0.4)',
  },
  {
    id: 5,
    kanji: '金曜日',
    kana: 'きんようび',
    romaji: 'ki·n·yo·u·bi',
    english: 'Friday',
    element: '金 (Gold)',
    icon: 'Gem',
    // 金：富贵的金黄
    gradient: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
    shadowColor: 'rgba(234, 179, 8, 0.4)',
  },
  {
    id: 6,
    kanji: '土曜日',
    kana: 'どようび',
    romaji: 'do·yo·u·bi',
    english: 'Saturday',
    element: '土 (Earth)',
    icon: 'Mountain',
    // 土：深沉的靛蓝/大地色 (此处遵循日历习惯用蓝色系，或者你可以改为褐色)
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    shadowColor: 'rgba(59, 130, 246, 0.4)',
  },
];
