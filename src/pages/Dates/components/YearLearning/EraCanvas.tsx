// src/pages/Dates/components/YearLearning/EraCanvas.tsx

import React from 'react';
import styles from './EraCanvas.module.css';
import { ERAS_DATA } from '../../Datas/EraData';

interface EraCanvasProps {
  activeEraKey: string;
  onEraSelect: (key: string) => void;
}

export const EraCanvas: React.FC<EraCanvasProps> = ({
  activeEraKey,
  onEraSelect,
}) => {
  return (
    <div className={styles.container}>
      {ERAS_DATA.map((era) => {
        const isActive = era.key === activeEraKey;
        const activeStyle = isActive
          ? {
              backgroundColor: era.theme.accent,
              color: '#fff',
              // boxShadow: `0 3px 10px ${era.theme.accent}55`,
            }
          : undefined;

        return (
          <div
            key={era.key}
            className={`${styles.chip} ${isActive ? styles.activeChip : ''}`}
            style={activeStyle}
            onClick={() => onEraSelect(era.key)}
          >
            <span className={`${styles.chipKanji} jaFont`}>{era.kanji}</span>
            <span className={styles.chipYears}>
              {era.startYear}
              {era.endYear ? `〜${era.endYear}` : '〜'}
            </span>
          </div>
        );
      })}
    </div>
  );
};
