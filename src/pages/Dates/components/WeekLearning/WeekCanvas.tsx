// src/pages/Dates/components/WeekLearning/WeekCanvas.tsx

import React from 'react';
import { motion } from 'framer-motion'; // 🟢 引入动画库
import styles from './WeekCanvas.module.css';

interface WeekCanvasProps {
  currentWeekDay: number; // 0-6
  onDaySelect?: (day: number) => void;
}

export const WeekCanvas: React.FC<WeekCanvasProps> = ({
  currentWeekDay,
  onDaySelect,
}) => {
  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <div className={styles.container}>
      <div className={styles.weekGrid}>
        {weekDays.map((day, idx) => {
          const isActive = idx === currentWeekDay;
          const isSunday = idx === 0;
          const isSaturday = idx === 6;

          return (
            <div
              key={day}
              className={`
                ${styles.weekCell} 
                ${isActive ? styles.active : ''}
                ${isSunday ? styles.sunday : ''}
                ${isSaturday ? styles.saturday : ''}
                jaFont
              `}
              onClick={() => onDaySelect && onDaySelect(idx)}
            >
              {/* 🟢 动画滑块背景 */}
              {isActive && (
                <motion.div
                  layoutId="active-pill" // 关键：layoutId 让它学会滑动
                  className={styles.activeBg}
                  transition={{
                    type: 'spring', // 使用弹簧动效，更灵动
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}

              {/* 这里的文字加一层 span 以便 z-index 控制 */}
              <span className={styles.text}>{day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
