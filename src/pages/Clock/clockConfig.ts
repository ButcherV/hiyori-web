import { TIME_CONFIG } from './TimePicker/TimeConfig';
import { DURATION_LENGTH_CONFIG } from './DurationLength/DurationLengthConfig';
import { DURATION_PERIOD_CONFIG } from './Duration/DurationPeriodConfig';
import type { ClockLessonConfig } from './TimePicker/TimeConfig';

// 导出所有时钟课程配置
export const CLOCK_LESSONS: ClockLessonConfig[] = [
  TIME_CONFIG,
  DURATION_LENGTH_CONFIG,
  DURATION_PERIOD_CONFIG,
];

// 根据 ID 获取配置
export function getClockLessonConfig(id: string): ClockLessonConfig | undefined {
  return CLOCK_LESSONS.find((lesson) => lesson.id === id);
}

// 导出类型
export type { ClockLessonConfig };
