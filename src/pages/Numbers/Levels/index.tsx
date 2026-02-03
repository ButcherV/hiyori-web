import { LEVEL1_CONFIG, type LevelConfig } from './Level1/Level1Config';
import { LEVEL3_CONFIG } from './Level3/Level3Config';

// 这里汇聚所有关卡的配置
export const ALL_LEVELS_CONFIG: LevelConfig[] = [
  LEVEL1_CONFIG,
  // 以后 Level 2, Level 3 的配置也引入并放在这里
  {
    id: 'lvl2',
    labelKey: 'number_study.numbers.levels.lvl2.label',
    titleKey: 'number_study.numbers.levels.lvl2.title',
    DescriptionContent: () => {
      // 临时占位，实际应创建 Level2Config.tsx
      // 可以在这里直接用 useTranslation，或者写简单的 JSX
      return <p>Level 2 Description...</p>;
    },
  },
  LEVEL3_CONFIG,
  // {
  //   id: 'lvl3',
  //   labelKey: 'number_study.numbers.levels.lvl3.label',
  //   titleKey: 'number_study.numbers.levels.lvl3.title',
  //   DescriptionContent: () => <p>...</p>,
  // },
  {
    id: 'lvl4',
    labelKey: 'number_study.numbers.levels.lvl4.label',
    titleKey: 'number_study.numbers.levels.lvl4.title',
    DescriptionContent: () => <p>...</p>,
  },
  {
    id: 'lvl5',
    labelKey: 'number_study.numbers.levels.lvl5.label',
    titleKey: 'number_study.numbers.levels.lvl5.title',
    DescriptionContent: () => <p>...</p>,
  },
];
