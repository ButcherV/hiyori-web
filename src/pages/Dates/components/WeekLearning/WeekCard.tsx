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
  Volume2, // 🟢 引入喇叭图标
} from 'lucide-react';
import { useTTS } from '../../../../hooks/useTTS'; // 🟢 引入 TTS

// 图标映射表
const IconMap: Record<string, React.ElementType> = {
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

  // 🟢 独立播放处理 (点击喇叭不触发切换，或者根据你的需求决定)
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
        <div className={styles.kanjiRow}>
          <span className={`${styles.kanji} jaFont`}>{item.kanji}</span>
        </div>
        <span className={`${styles.kana} jaFont`}>{item.kana}</span>
        {/* 🟢 罗马音移到这里 */}
        <span className={styles.romaji}>{item.romaji}</span>
      </div>

      {/* 3. 右侧：功能区 (翻译 + 喇叭) */}
      <div className={styles.rightSection}>
        <span className={styles.english}>{item.english}</span>

        {/* 🟢 喇叭按钮 */}
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
