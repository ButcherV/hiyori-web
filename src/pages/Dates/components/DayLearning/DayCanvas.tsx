// src/pages/Dates/components/DayLearning/DayCanvas.tsx

import React from 'react';
import styles from './DayCanvas.module.css';
import { datesData, type DateType } from '../../Levels/Level1/Level1Data';
import { useTranslation } from 'react-i18next';

interface DayCanvasProps {
  currentDate: Date;
  onDateSelect: (date: Date) => void;
  filterType: DateType | null;
  onFilterChange: (type: DateType) => void;
}

export const DayCanvas: React.FC<DayCanvasProps> = ({
  currentDate,
  onDateSelect,
  filterType,
  onFilterChange,
}) => {
  const { t } = useTranslation();
  const legendTypes: DateType[] = ['rune', 'mutant', 'trap', 'regular'];

  // 当前选中的是几号 (1-31)
  const currentDayNum = currentDate.getDate();

  const handleItemClick = (dayId: number) => {
    // 保持年份月份不变，只切换日期
    const newDate = new Date(currentDate);
    newDate.setDate(dayId);
    onDateSelect(newDate);
  };

  return (
    <div className={styles.container}>
      {/* 1. 图例区 (Legend) */}
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

      {/* 2. 网格区 (Grid) - 纯粹的 1-31 */}
      <div className={styles.contentArea}>
        <div className={styles.grid}>
          {datesData.map((item) => {
            // 样式逻辑
            const isSelected = item.id === currentDayNum;
            const isDimmed = filterType && filterType !== item.type;

            return (
              <div
                key={item.id}
                className={`
                  ${styles.cell} 
                  ${styles[`type_${item.type}`]} 
                  ${isSelected ? styles.cellSelected : ''}
                  ${isDimmed ? styles.cellDimmed : ''}
                `}
                onClick={() => handleItemClick(item.id)}
              >
                {item.id}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
