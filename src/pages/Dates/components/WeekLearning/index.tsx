// src/pages/Dates/components/WeekLearning/index.tsx

import React, { useEffect, useRef } from 'react';
import { weekData } from './WeekData';
import { WeekCard } from './WeekCard';
import { useTTS } from '../../../../hooks/useTTS';

interface WeekLearningProps {
  activeDay: number;
  onDaySelect: (day: number) => void;
}

const containerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  overflowY: 'auto',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
};

const spacerStyle: React.CSSProperties = {
  height: '80px',
  width: '100%',
  flexShrink: 0,
};

export const WeekLearning: React.FC<WeekLearningProps> = ({
  activeDay,
  onDaySelect,
}) => {
  const { speak } = useTTS();
  const containerRef = useRef<HTMLDivElement>(null);

  // 1. 自动滚动 (Auto Scroll)
  useEffect(() => {
    const cardElement = document.getElementById(`week-card-${activeDay}`);
    if (cardElement && containerRef.current) {
      cardElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeDay]);

  // 🟢 2. 自动播音 (Auto Play)
  // 核心逻辑：监听 activeDay。
  // 无论是 WeekCanvas 改变了它，还是 WeekCard 改变了它，
  // 只要 activeDay 变了，这里就会执行，实现“双向选择自动播音”。
  useEffect(() => {
    const item = weekData.find((d) => d.id === activeDay);
    if (item) {
      speak(item.kana);
    }
  }, [activeDay, speak]);

  return (
    <div style={containerStyle} ref={containerRef}>
      <div style={{ height: '20px', flexShrink: 0 }} />

      {weekData.map((item) => (
        <WeekCard
          key={item.id}
          item={item}
          isActive={item.id === activeDay}
          onClick={() => {
            // 🔴 移除：speak(item.kana);
            // 既然已经有了上面的 useEffect 负责播音，这里就不要再手动调用了，
            // 否则点击卡片时会因为“点击事件+状态改变”触发两次声音。
            onDaySelect(item.id);
          }}
        />
      ))}

      <div style={spacerStyle} />
    </div>
  );
};
