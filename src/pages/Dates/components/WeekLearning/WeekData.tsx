// src/pages/Dates/components/WeekLearning/WeekData.tsx

export interface WeekDayItem {
  id: number;       // 0=Sunday … 6=Saturday
  kanji: string;    // 日曜日
  kana: string;     // にちようび
  romaji: string;   // ni·chi·yo·u·bi
  icon: string;     // lucide-react icon name
  gradient: string; // active 渐变（供 WeekCanvas 使用）
  shadowColor: string;
}

export const weekData: WeekDayItem[] = [
  {
    id: 0,
    kanji: '日曜日',
    kana: 'にちようび',
    romaji: 'ni·chi·yo·u·bi',
    icon: 'Sun',
    gradient: 'linear-gradient(145deg, #ef4444, #f97316)',
    shadowColor: 'rgba(239,68,68,0.3)',
  },
  {
    id: 1,
    kanji: '月曜日',
    kana: 'げつようび',
    romaji: 'ge·tsu·yo·u·bi',
    icon: 'Moon',
    gradient: 'linear-gradient(145deg, #64748b, #475569)',
    shadowColor: 'rgba(71,85,105,0.3)',
  },
  {
    id: 2,
    kanji: '火曜日',
    kana: 'かようび',
    romaji: 'ka·yo·u·bi',
    icon: 'Flame',
    gradient: 'linear-gradient(145deg, #ea580c, #dc2626)',
    shadowColor: 'rgba(234,88,12,0.3)',
  },
  {
    id: 3,
    kanji: '水曜日',
    kana: 'すいようび',
    romaji: 'su·i·yo·u·bi',
    icon: 'Droplets',
    gradient: 'linear-gradient(145deg, #0ea5e9, #2563eb)',
    shadowColor: 'rgba(14,165,233,0.3)',
  },
  {
    id: 4,
    kanji: '木曜日',
    kana: 'もくようび',
    romaji: 'mo·ku·yo·u·bi',
    icon: 'Trees',
    gradient: 'linear-gradient(145deg, #16a34a, #15803d)',
    shadowColor: 'rgba(22,163,74,0.3)',
  },
  {
    id: 5,
    kanji: '金曜日',
    kana: 'きんようび',
    romaji: 'ki·n·yo·u·bi',
    icon: 'Gem',
    gradient: 'linear-gradient(145deg, #eab308, #ca8a04)',
    shadowColor: 'rgba(234,179,8,0.3)',
  },
  {
    id: 6,
    kanji: '土曜日',
    kana: 'どようび',
    romaji: 'do·yo·u·bi',
    icon: 'Mountain',
    gradient: 'linear-gradient(145deg, #3b82f6, #1d4ed8)',
    shadowColor: 'rgba(59,130,246,0.3)',
  },
];
