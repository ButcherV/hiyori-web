import React, { useEffect, useRef } from 'react';
import { weekData } from './WeekData';
import { WeekCard } from './WeekCard';

interface WeekLearningProps {
  activeDay: number;
  onDaySelect: (day: number) => void;
}

const containerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  overflowY: 'auto', // 确保容器可以滚动
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  scrollBehavior: 'smooth', // 增加平滑滚动效果
};

const spacerStyle: React.CSSProperties = {
  height: '120px',
  width: '100%',
  flexShrink: 0,
};

export const WeekLearning: React.FC<WeekLearningProps> = ({
  activeDay,
  onDaySelect,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // 自动滚动逻辑 (垂直居中)
  useEffect(() => {
    // 稍微延迟 100ms，等待页面动画展开、布局稳定后再滚动，否则可能滚不准
    const timer = setTimeout(() => {
      const cardElement = document.getElementById(`week-card-${activeDay}`);

      // 只有当元素存在，且容器允许滚动时才执行
      if (cardElement && containerRef.current) {
        cardElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center', // 关键：让卡片在垂直方向居中 (start | center | end)
          inline: 'nearest',
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [activeDay]);

  return (
    <div style={containerStyle} ref={containerRef}>
      {weekData.map((item) => (
        <WeekCard
          key={item.id}
          item={item}
          isActive={item.id === activeDay}
          onClick={() => onDaySelect(item.id)}
        />
      ))}

      {/* 底部垫高，保证最后一个卡片也能滚到中间 */}
      <div style={spacerStyle} />
    </div>
  );
};
