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

  // 点击卡片：选中 + 播放
  const handleCardClick = () => {
    onClick();
    speak(item.kana);
  };

  // 点击喇叭：选中 + 播放
  const handleSpeakerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
    speak(item.kana);
  };

  return (
    <div
      className={`${styles.card} ${isActive ? styles.activeCard : ''}`}
      onClick={handleCardClick}
      id={`week-card-${item.id}`}
      style={
        isActive
          ? ({
              background: item.gradient, // 选中时直接使用渐变背景
              boxShadow: `0 12px 30px -8px ${item.shadowColor}`, // 对应颜色的扩散光晕
            } as React.CSSProperties)
          : undefined
      }
    >
      {/* 1. 背景大水印 (Decorative) */}
      <div className={styles.bgIcon}>
        <IconComponent strokeWidth={1.5} />
      </div>

      {/* 2. 左侧：日文核心 (Information) */}
      <div className={styles.leftSection}>
        {/* 汉字 */}
        <div className={`${styles.kanji} jaFont`}>{item.kanji}</div>

        {/* 垂直堆叠的读音区 */}
        <div className={styles.readingBlock}>
          <div className={`${styles.kana} jaFont`}>{item.kana}</div>
          <div className={styles.romaji}>{item.romaji}</div>
        </div>
      </div>

      {/* 3. 右侧：英文 + 操作 (Context & Action) */}
      <div className={styles.rightSection}>
        <div className={styles.englishLarge}>{item.english}</div>

        <button
          className={styles.speakerBtn}
          onClick={handleSpeakerClick}
          aria-label="Play Audio"
        >
          <Volume2 size={22} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};
