import { type DateLevelConfig } from './types';
import { LEVEL1_CONFIG } from './Level1/Level1Config';
import { LEVEL4_CONFIG } from './Level4/Level4Config';

// 将来有 Level 2 (Months), Level 3 (Weeks) 时直接加在这里
export const ALL_DATE_LEVELS_CONFIG: DateLevelConfig[] = [
  LEVEL1_CONFIG,
  {
    id: 'lvl2_months',
    labelKey: 'date_study.levels.months.label',
    titleKey: 'date_study.levels.months.title',
    DescriptionContent: () => <div>Months Intro...</div>,
  },
  {
    id: 'lvl3_weeks',
    labelKey: 'date_study.levels.weeks.label',
    titleKey: 'date_study.levels.weeks.title',
    DescriptionContent: () => <div>Weeks Intro...</div>,
  },
  LEVEL4_CONFIG,
];
