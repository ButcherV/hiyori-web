// src/pages/Dates/components/MonthLearning/MonthCard.tsx
// 简单版，你可以后续丰富
import React from 'react';
import styles from './MonthCard.module.css';
import { type MonthItem } from '../../Datas/MonthData';
import { useTTS } from '../../../../hooks/useTTS';
import { Volume2 } from 'lucide-react';

/* 需要配套的 CSS: 
   .card { width: 100%; min-height: 100px; margin-bottom: 12px; border-radius: 16px; ... } 
   .activeCard { border: 2px solid themeColor; background: themeColor(light); ... }
*/

export const MonthCard: React.FC<{
  item: MonthItem;
  isActive: boolean;
  onClick: () => void;
}> = ({ item, isActive, onClick }) => {
  const { speak } = useTTS();

  return (
    <div
      className={`${styles.card} ${isActive ? styles.activeCard : ''}`}
      onClick={() => {
        onClick();
        speak(item.kana);
      }}
      style={
        isActive
          ? { borderColor: item.themeColor, background: `${item.themeColor}15` }
          : {}
      }
    >
      <div className={styles.left}>
        <span className={styles.kanji}>{item.kanji}</span>
        <span className={styles.kana}>{item.kana}</span>
      </div>
      <div className={styles.right}>
        <span className={styles.wafuName}>{item.wafuName}</span>
        <span className={styles.romaji}>{item.romaji}</span>
      </div>
      <Volume2 size={16} className={styles.icon} />
    </div>
  );
};
