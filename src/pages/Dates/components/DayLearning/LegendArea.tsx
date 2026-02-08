// src/pages/Dates/components/DayLearning/LegendArea.tsx

import React from 'react';
import styles from './LegendArea.module.css';
import { type DateType } from '../../Levels/Level1/Level1Data';
import { useTranslation } from 'react-i18next';

interface LegendAreaProps {
  filterType: DateType | null;
  onFilterChange: (type: DateType) => void;
}

export const LegendArea: React.FC<LegendAreaProps> = ({
  filterType,
  onFilterChange,
}) => {
  const { t } = useTranslation();
  const legendTypes: DateType[] = ['rune', 'mutant', 'trap', 'regular'];

  return (
    <div className={styles.legendArea}>
      {legendTypes.map((type) => (
        <div
          key={type}
          className={`
            ${styles.legendItem} 
            ${styles[`legend_${type}`]} 
            ${filterType === type ? styles.legendActive : ''}
          `}
          onClick={() => onFilterChange(type)}
          style={{ opacity: filterType && filterType !== type ? 0.3 : 1 }}
        >
          <div className={styles.legendDot} />
          <span className={styles.legendLabel}>
            {t(`date_study.level1.types.${type}.legend`)}
          </span>
        </div>
      ))}
    </div>
  );
};
