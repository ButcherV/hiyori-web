import React, { useEffect, useRef } from 'react';
import { monthData } from '../../Datas/MonthData';
import { MonthCard } from './MonthCard';
import { useTTS } from '../../../../hooks/useTTS';

interface MonthLearningProps {
  activeMonth: number;
  onMonthSelect: (m: number) => void;
}

const containerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  overflowY: 'auto',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  scrollBehavior: 'smooth',
};

export const MonthLearning: React.FC<MonthLearningProps> = ({
  activeMonth,
  onMonthSelect,
}) => {
  const { speak } = useTTS();
  const containerRef = useRef<HTMLDivElement>(null);

  // 🟢 音频锁：默认锁住，防止进场自动播音
  const audioEnabledRef = useRef(false);

  // 🟢 1. 初始化：设置一个“进场静音期” (500ms)
  // 这段时间足够覆盖页面切换动画和父组件可能的初始数据同步
  useEffect(() => {
    const timer = setTimeout(() => {
      audioEnabledRef.current = true;
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // 🟢 2. 监听 activeMonth 变化：处理滚动 + 播音
  useEffect(() => {
    // === A. 滚动逻辑 (始终执行，保证视觉同步) ===
    const timer = setTimeout(() => {
      const cardElement = document.getElementById(`month-card-${activeMonth}`);
      if (cardElement && containerRef.current) {
        cardElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center', // 垂直居中
        });
      }
    }, 100);

    // === B. 播音逻辑 (受音频锁控制) ===
    // 只有过了静音期（即用户开始交互了），这里才会执行
    if (audioEnabledRef.current) {
      const item = monthData.find((d) => d.id === activeMonth);
      if (item) {
        speak(item.kana);
      }
    }

    return () => clearTimeout(timer);
  }, [activeMonth, speak]);

  return (
    <div style={containerStyle} ref={containerRef}>
      {/* <div style={{ height: '20px', flexShrink: 0 }} /> */}
      {monthData.map((m) => (
        <MonthCard
          key={m.id}
          item={m}
          isActive={m.id === activeMonth}
          // 点击时只负责切换 ID，剩下的交给 useEffect
          onClick={() => onMonthSelect(m.id)}
        />
      ))}
      <div style={{ height: '120px', flexShrink: 0 }} />
    </div>
  );
};
