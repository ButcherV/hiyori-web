// src/pages/Dates/Levels/Level4/Level4Config.tsx
import React from 'react';
import { type DateLevelConfig } from '../types';

const Level4Description: React.FC = () => {
  return (
    <div>
      <p>滑动时间轮盘，探索日本近代年号与年份的对应关系。</p>
    </div>
  );
};

export const LEVEL4_CONFIG: DateLevelConfig = {
  id: 'lvl4_years',
  labelKey: 'date_study.levels.years.label', // 记得加 i18n
  titleKey: 'date_study.levels.years.title',
  DescriptionContent: Level4Description,
};
