// src/pages/Dates/components/DayLearning/DayCanvas.tsx

import React from 'react';
import styles from './DayCanvas.module.css';
import { datesData, type DateType } from '../../Datas/DayData';

interface DayCanvasProps {
  // 视觉定位用 (决定前面空几格)
  year: number;
  month: number;

  // 逻辑交互用
  activeDay: number; // 1-31
  onDaySelect: (day: number) => void;

  filterType: DateType | null;
}

export const DayCanvas: React.FC<DayCanvasProps> = ({
  year,
  month,
  activeDay,
  onDaySelect,
  filterType,
}) => {
  // 1. 计算对齐用的空白格 (保持和日历视图一致)
  const firstDayObj = new Date(year, month, 1);
  const startDayOfWeek = firstDayObj.getDay();
  const blanks = Array(startDayOfWeek).fill(null);

  // 2. 渲染列表：永远渲染 31 个，不管这个月有几天
  // 这就是“学习模式”和“日历模式”的最大区别
  const allDays = datesData; // datesData 本身就有 31 个数据

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {/* 空白格 */}
        {blanks.map((_, i) => (
          <div key={`blank-${i}`} />
        ))}

        {/* 1-31 全部渲染 */}
        {allDays.map((item) => {
          const isSelected = item.id === activeDay;
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
              onClick={() => onDaySelect(item.id)} // 🟢 直接传数字，不转换 Date
            >
              {item.id}
            </div>
          );
        })}
      </div>
    </div>
  );
};
