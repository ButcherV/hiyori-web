import React from 'react';
import styles from './MonthCard.module.css';
import { type MonthItem } from '../../Datas/MonthData';
import { useTTS } from '../../../../hooks/useTTS';
import {
  Snowflake,
  Ticket,
  Flower,
  Sprout,
  Trees,
  Droplets,
  Star,
  Sun,
  Moon,
  Leaf,
  CloudSnow,
  Timer,
  X,
  Check,
} from 'lucide-react';

const IconMap: Record<string, React.FC<any>> = {
  Snowflake,
  Ticket,
  Flower,
  Sprout,
  Trees,
  Droplets,
  Star,
  Sun,
  Moon,
  Leaf,
  CloudSnow,
  Timer,
};

export const MonthCard: React.FC<{
  item: MonthItem;
  isActive: boolean;
  onClick: () => void;
}> = ({ item, isActive, onClick }) => {
  const { speak } = useTTS();
  const Icon = IconMap[item.icon] || Sun;

  // 点击和风侧栏，播放和风读音
  const handleWafuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    speak(item.wafuKana);
  };

  return (
    <div
      id={`month-card-${item.id}`}
      className={`${styles.card} ${isActive ? styles.activeCard : ''}`}
      onClick={onClick}
      // 这里的 color 属性会让右侧的背景 Icon 自动继承主题色
      style={{ color: item.themeColor }}
    >
      {/* 🟢 左侧：文化侧栏 (书签脊) */}
      <div
        className={styles.leftSpine}
        style={{ backgroundColor: item.themeColor }}
        onClick={handleWafuClick} // 只有点这个色块才播和风音
      >
        <div className={styles.spinePattern} />
        <span className={styles.wafuVertical}>{item.wafuName}</span>
      </div>

      {/* 🟢 右侧：教学主区 */}
      <div className={styles.rightBody}>
        {/* 1. 汉字 */}
        <div className={styles.kanjiMain}>{item.kanji}</div>

        {/* 2. 读音区：区分“普通”和“陷阱” */}
        <div className={styles.readingArea}>
          {item.trapDetail ? (
            // === 纠错模式 (Trap) ===
            <div className={styles.correctionBlock}>
              {/* 错误读法 */}
              <div className={styles.wrongRow}>
                <X size={14} strokeWidth={3} />
                <span className={styles.strikethrough}>
                  {item.trapDetail.wrongRomaji}
                </span>
                <span style={{ fontSize: 11 }}>
                  ({item.trapDetail.wrongKana})
                </span>
              </div>

              {/* 正确读法 */}
              <div className={styles.correctRow}>
                <Check size={16} strokeWidth={3} />
                <span className={styles.highlight}>
                  {item.trapDetail.correctRomaji}
                </span>
                <span>{item.trapDetail.correctKana}</span>
              </div>
            </div>
          ) : (
            // === 普通模式 ===
            <div className={styles.normalReading}>
              <span className={styles.kanaText}>{item.kana}</span>
              <span className={styles.romajiText}>{item.romaji}</span>
            </div>
          )}
        </div>

        {/* 3. 背景装饰 Icon */}
        <div className={styles.iconBg}>
          <Icon size={120} strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
};
