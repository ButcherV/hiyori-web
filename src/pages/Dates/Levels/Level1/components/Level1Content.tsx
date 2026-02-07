import React from 'react';
import styles from './Level1Content.module.css'; // 🟢 引用自己的样式
import { type DateItem, type DateType } from '../Level1Data';
import { useTranslation } from 'react-i18next';

interface Level1ContentProps {
  list: DateItem[];
  currentIndex: number;
  filterType: DateType | null;
  onItemClick: (index: number) => void;
  onFilterChange: (type: DateType) => void;
}

export const Level1Content: React.FC<Level1ContentProps> = ({
  list,
  currentIndex,
  filterType,
  onItemClick,
  onFilterChange,
}) => {
  const { t } = useTranslation();
  const legendTypes: DateType[] = ['rune', 'mutant', 'trap', 'regular'];

  return (
    <>
      <div className={styles.legendArea}>
        {legendTypes.map((type) => (
          <div
            key={type}
            className={`${styles.legendItem} ${styles[`legend_${type}`]} ${filterType === type ? styles.legendActive : ''}`}
            onClick={() => onFilterChange(type)}
            style={{ opacity: filterType && filterType !== type ? 0.4 : 1 }}
          >
            <div className={styles.legendDot} />
            <span>{t(`date_study.level1.types.${type}.legend`)}</span>
          </div>
        ))}
      </div>

      <div className={styles.contentArea}>
        <div className={styles.calendarGrid}>
          {list.map((day, index) => {
            const isDimmed = filterType && filterType !== day.type;
            const isActive = currentIndex === index;
            return (
              <div
                key={day.id}
                className={`
                  ${styles.dayCell} 
                  ${styles[`type_${day.type}`]} 
                  ${isActive ? styles.cellActive : ''}
                  ${isDimmed ? styles.cellDimmed : ''}
                `}
                onClick={() => onItemClick(index)}
              >
                {day.id}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
