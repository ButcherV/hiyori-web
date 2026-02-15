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

  // 自动居中逻辑 (保持不变)
  useEffect(() => {
    if (!containerRef.current) return;
    const activeEl = document.getElementById(`month-nav-${activeMonth}`);
    if (activeEl) {
      const container = containerRef.current;
      const targetScrollLeft =
        activeEl.offsetLeft +
        activeEl.clientWidth / 2 -
        container.clientWidth / 2;

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

        // 动态样式：如果激活，使用月份的主题色作为背景
        const dynamicStyle = isActive
          ? {
              backgroundColor: m.themeColor,
              // 为了防止浅色背景导致文字看不清，添加轻微阴影
              // boxShadow: `0 4px 12px ${m.themeColor}80`,
              color: '#fff',
              textShadow: '0 1px 2px rgba(0,0,0,0.15)', // 增加对比度
            }
          : undefined;

        return (
          <div
            key={m.id}
            id={`month-nav-${m.id}`}
            className={`${styles.itemWrapper} ${isActive ? styles.activeWrapper : ''}`}
            style={dynamicStyle}
            onClick={() => onMonthSelect(m.id)}
          >
            <span className={styles.label}>{m.id}月</span>
          </div>
        );
      })}
    </div>
  );
};
