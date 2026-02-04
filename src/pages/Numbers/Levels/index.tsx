import { LEVEL1_CONFIG, type LevelConfig } from './Level1/Level1Config';
import { LEVEL2_CONFIG } from './Level2/Level2Config';
import { LEVEL3_CONFIG } from './Level3/Level3Config';
import { LEVEL4_CONFIG } from './Level4/Level4Config';

// 这里汇聚所有关卡的配置
export const ALL_LEVELS_CONFIG: LevelConfig[] = [
  LEVEL1_CONFIG,
  LEVEL2_CONFIG,
  LEVEL3_CONFIG,
  LEVEL4_CONFIG,
  {
    id: 'lvl5',
    labelKey: 'number_study.numbers.levels.lvl5.label',
    titleKey: 'number_study.numbers.levels.lvl5.title',
    DescriptionContent: () => <p>...</p>,
  },
];
