// 时间段类型定义
export interface TimePeriod {
  name: string;
  kana: string;
  start: number;
  end: number;
  description: string;
}

// 时间段词汇（按一天时序排列）
export const TIME_PERIODS: TimePeriod[] = [
  { name: '深夜', kana: 'しんや', start: 0, end: 4, description: '书面语，天气预报、新闻常用' },
  { name: '未明', kana: 'みめい', start: 2, end: 5, description: '比深夜更书面，黎明前最暗的时段' },
  { name: '夜明け', kana: 'よあけ', start: 4, end: 6, description: '「夜が明ける」的名词形，天开始亮' },
  { name: '早朝', kana: 'そうちょう', start: 5, end: 7, description: '比「朝」更早，正式语感' },
  { name: '朝', kana: 'あさ', start: 6, end: 10, description: '最日常的早晨表达' },
  { name: '午前', kana: 'ごぜん', start: 0, end: 12, description: '注意：范围含深夜，不只是早上' },
  { name: '昼', kana: 'ひる', start: 10, end: 14, description: '也指「午饭时间」' },
  { name: '正午', kana: 'しょうご', start: 12, end: 12, description: '精确的正午，不是泛指中午' },
  { name: '午後', kana: 'ごご', start: 12, end: 18, description: '' },
  { name: '夕方', kana: 'ゆうがた', start: 16, end: 19, description: '专指黄昏傍晚，≠ 下午' },
  { name: '夜', kana: 'よる', start: 19, end: 24, description: '' },
  { name: '真夜中', kana: 'まよなか', start: 0, end: 0, description: '口语"半夜"，比深夜更有情感色彩' },
];
