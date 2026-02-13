// src/pages/Dates/components/MonthLearning/MonthCanvas.tsx

import React, { useEffect, useRef } from 'react';
import styles from './MonthCanvas.module.css';
import { monthData } from '../../Datas/MonthData';

interface MonthCanvasProps {
  activeMonth: number;
  onMonthSelect: (m: number) => void;
}

export const MonthCanvas: React.FC<MonthCanvasProps> = ({
  activeMonth,
  onMonthSelect,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // 核心：自动居中逻辑 (Center if possible, clamp at edges)
  useEffect(() => {
    if (!containerRef.current) return;

    const activeEl = document.getElementById(`month-nav-${activeMonth}`);
    if (activeEl) {
      const container = containerRef.current;

      // 计算目标滚动位置：
      // (元素左边缘 + 元素一半宽度) - (容器一半宽度) = 将元素中心对齐容器中心
      const targetScrollLeft =
        activeEl.offsetLeft +
        activeEl.clientWidth / 2 -
        container.clientWidth / 2;

      // 浏览器会自动处理边界：
      // 1. 如果 targetScrollLeft < 0 (比如 1月)，它会滚到 0 (最左边)
      // 2. 如果 targetScrollLeft > maxScroll (比如 12月)，它会滚到 max (最右边)
      // 3. 只有在中间时，才会真正的“居中”
      container.scrollTo({
        left: targetScrollLeft,
        behavior: 'smooth',
      });
    }
  }, [activeMonth]);

  return (
    <div className={styles.container} ref={containerRef}>
      {monthData.map((m) => {
        const isActive = m.id === activeMonth;
        return (
          <div
            key={m.id}
            id={`month-nav-${m.id}`}
            className={`${styles.itemWrapper} ${isActive ? styles.activeWrapper : ''}`}
            onClick={() => onMonthSelect(m.id)}
          >
            <span className={styles.label}>{m.id}月</span>
          </div>
        );
      })}
    </div>
  );
};
