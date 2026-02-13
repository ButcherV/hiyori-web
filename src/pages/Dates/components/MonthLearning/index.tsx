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
  const isFirstRender = useRef(true);

  // 自动滚动 (复用 WeekLearning 逻辑)
  useEffect(() => {
    const timer = setTimeout(() => {
      const cardElement = document.getElementById(`month-card-${activeMonth}`);
      if (cardElement && containerRef.current) {
        cardElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [activeMonth]);

  // 自动播音 (复用 WeekLearning 逻辑)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const item = monthData.find((d) => d.id === activeMonth);
    if (item) {
      speak(item.kana);
    }
  }, [activeMonth, speak]);

  return (
    <div style={containerStyle} ref={containerRef}>
      <div style={{ height: '20px', flexShrink: 0 }} />
      {monthData.map((m) => (
        <MonthCard
          key={m.id}
          item={m}
          isActive={m.id === activeMonth}
          onClick={() => onMonthSelect(m.id)}
        />
      ))}
      <div style={{ height: '120px', flexShrink: 0 }} />
    </div>
  );
};
