// src/pages/Dates/components/WeekLearning/WeekCard.tsx

import React from 'react';
import styles from './WeekCard.module.css';
import { type WeekDayItem } from './WeekData';
import {
  Sun,
  Moon,
  Flame,
  Droplets,
  Trees,
  Gem,
  Mountain,
  Volume2,
} from 'lucide-react';
import { useTTS } from '../../../../hooks/useTTS';

// 图标映射表
const IconMap: Record<string, React.FC<any>> = {
  Sun,
  Moon,
  Flame,
  Droplets,
  Trees,
  Gem,
  Mountain,
};

interface WeekCardProps {
  item: WeekDayItem;
  isActive: boolean;
  onClick: () => void;
}

export const WeekCard: React.FC<WeekCardProps> = ({
  item,
  isActive,
  onClick,
}) => {
  const { speak } = useTTS();
  const IconComponent = IconMap[item.icon] || Sun;

  // 颜色处理
  const iconColor = item.colorVar.startsWith('--')
    ? `var(${item.colorVar})`
    : item.colorVar;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止冒泡，防止触发外层的 onDaySelect (也就是页面滚动)
    speak(item.kana);
  };

  return (
    <div
      className={`${styles.card} ${isActive ? styles.activeCard : ''}`}
      onClick={onClick}
      id={`week-card-${item.id}`}
    >
      {/* 1. 左侧：Logo */}
      <div className={styles.iconWrapper} style={{ color: iconColor }}>
        <IconComponent size={24} strokeWidth={2.5} />
      </div>

      {/* 2. 中间：纵向排列 (汉字 -> 假名 -> 罗马音) */}
      <div className={styles.mainInfo}>
        <span className={styles.romaji}>{item.romaji}</span>
        <span className={`${styles.kana} jaFont`}>{item.kana}</span>
        <div className={styles.kanjiRow}>
          <span className={`${styles.kanji} jaFont`}>{item.kanji}</span>
        </div>
      </div>
      <span className={styles.english}>{item.english}</span>
      <div className={styles.rightSection}>
        <button
          className={styles.speakerBtn}
          onClick={handlePlayClick}
          aria-label="Play Audio"
        >
          <Volume2 size={18} />
        </button>
      </div>
    </div>
  );
};
