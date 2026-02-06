import React from 'react';
import { type DateLevelConfig } from '../types';
// 假设你有一些通用的样式
// import styles from '../../../Numbers/Levels/LevelDescription.module.css';

const Level1Description: React.FC = () => {
  return (
    <div></div>
    // <div className={styles.container}>
    //   <div className={styles.section}>
    //     <div className={styles.sectionTitle}>
    //       <span>本课目标</span>
    //     </div>
    //     <div className={styles.sectionContent}>
    //       <p className={styles.text}>
    //         学习日语日期的读法（1日-31日）。重点掌握 1-10 日以及 14/20/24
    //         日的特殊读音。
    //       </p>
    //     </div>
    //   </div>
    // </div>
  );
};

export const LEVEL1_CONFIG: DateLevelConfig = {
  id: 'lvl1_days',
  labelKey: 'date_study.levels.days.label', // 记得在 i18n 里添加对应翻译
  titleKey: 'date_study.levels.days.title',
  DescriptionContent: Level1Description,
};
