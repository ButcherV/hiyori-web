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
  overflowY: 'auto', // 确保容器可以滚动
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  scrollBehavior: 'smooth', // 增加平滑滚动效果
};

const spacerStyle: React.CSSProperties = {
  height: '120px', // 底部留白加大一点，防止卡片被手机底部遮挡
  width: '100%',
  flexShrink: 0,
};

export const WeekLearning: React.FC<WeekLearningProps> = ({
  activeDay,
  onDaySelect,
}) => {
  const { speak } = useTTS();
  const containerRef = useRef<HTMLDivElement>(null);

  // 🟢 1. 门卫变量：标记是否是“刚进来”的那一次
  const isFirstRender = useRef(true);

  // 🟢 2. 自动滚动逻辑 (修正：垂直居中)
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
  }, [activeDay]); // 只要 activeDay 变了，就滚一次

  // 🟢 3. 自动播音逻辑 (修正：刚进来不播)
  useEffect(() => {
    // 如果是刚进来（第一次渲染）
    if (isFirstRender.current) {
      // 1. 把标记关掉，表示“我已经进来了，下次就不是第一次了”
      isFirstRender.current = false;
      // 2. 直接返回，不执行下面的 speak
      return;
    }

    // 如果能走到这里，说明不是第一次了（是用户点击切换的），正常播音
    const item = weekData.find((d) => d.id === activeDay);
    if (item) {
      speak(item.kana);
    }
  }, [activeDay, speak]);

  return (
    <div style={containerStyle} ref={containerRef}>
      {/* 顶部留一点空间 */}
      <div style={{ height: '20px', flexShrink: 0 }} />

      {weekData.map((item) => (
        <WeekCard
          key={item.id}
          item={item}
          isActive={item.id === activeDay}
          onClick={() => {
            // 点击只负责切换状态，播音交给上面的 useEffect
            onDaySelect(item.id);
          }}
        />
      ))}

      {/* 底部垫高，保证最后一个卡片也能滚到中间 */}
      <div style={spacerStyle} />
    </div>
  );
};
