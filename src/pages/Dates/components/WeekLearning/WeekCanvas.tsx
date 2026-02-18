// src/pages/Dates/components/WeekLearning/WeekCanvas.tsx

import React from 'react';
import { motion } from 'framer-motion';
import styles from './WeekCanvas.module.css';

// 与 WeekCard DAY_STYLES 对应的 7 个激活色
const PILL_COLORS = [
  '#ef4444', // 日 Sun
  '#64748b', // 月 Moon
  '#ea580c', // 火 Fire
  '#0ea5e9', // 水 Water
  '#16a34a', // 木 Wood
  '#eab308', // 金 Gold
  '#3b82f6', // 土 Earth
];

interface WeekCanvasProps {
  currentWeekDay: number; // 0–6
  onDaySelect?: (day: number) => void;
}

export const WeekCanvas: React.FC<WeekCanvasProps> = ({
  currentWeekDay,
  onDaySelect,
}) => {
  // 日语星期缩写 = 学习内容本身，不走 i18n
  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <div className={styles.container}>
      <div className={styles.weekGrid}>
        {weekDays.map((day, idx) => {
          const isActive = idx === currentWeekDay;

          return (
            <div
              key={day}
              className={`${styles.weekCell} jaFont`}
              onClick={() => onDaySelect?.(idx)}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className={styles.activeBg}
                  style={{ background: PILL_COLORS[idx] }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span
                className={styles.text}
                style={isActive ? { color: 'white' } : undefined}
              >
                {day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
