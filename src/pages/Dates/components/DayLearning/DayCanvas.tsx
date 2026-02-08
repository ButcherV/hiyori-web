// src/pages/Dates/components/DayLearning/DayCanvas.tsx

import React from 'react';
import styles from './DayCanvas.module.css';
import { datesData, type DateType } from '../../Levels/Level1/Level1Data';

interface DayCanvasProps {
  currentDate: Date; // 需要根据这个来计算 offset
  onDateSelect: (date: Date) => void;
  filterType: DateType | null;
  // 注意：onFilterChange 移除了，因为 Legend 不在这里了
}

export const DayCanvas: React.FC<DayCanvasProps> = ({
  currentDate,
  onDateSelect,
  filterType,
}) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const currentDayNum = currentDate.getDate();

  // 🟢 关键逻辑：计算当月1号是周几，生成对应数量的空白格
  // 这样 1 号的位置就会和日历视图里的 1 号完全重合
  const firstDayObj = new Date(year, month, 1);
  const startDayOfWeek = firstDayObj.getDay(); // 0 (Sun) - 6 (Sat)
  const blanks = Array(startDayOfWeek).fill(null);

  const handleItemClick = (dayId: number) => {
    // 保持年份月份不变，只切换日期
    const newDate = new Date(year, month, dayId);
    onDateSelect(newDate);
  };

  return (
    <div className={styles.container}>
      {/* 这里的 Grid 现在包含了 blanks，实现了物理对齐 */}
      <div className={styles.grid}>
        {/* 1. 渲染空白占位符 */}
        {blanks.map((_, i) => (
          <div key={`blank-${i}`} />
        ))}

        {/* 2. 渲染 1-31 日数据 */}
        {datesData.map((item) => {
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
  );
};
