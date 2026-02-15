// src/pages/Dates/components/MonthLearning/MonthCard.tsx

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
  Volume2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next'; // 🟢 引入 i18n

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
  const { i18n, t } = useTranslation(); // 🟢
  const Icon = IconMap[item.icon] || Sun;

  // 🟢 动态获取当前语言的月份名称 (e.g. "January" or "一月")
  const displayMonth = new Date(2024, item.id - 1, 1).toLocaleString(
    i18n.language,
    { month: 'long' }
  );

  const handleWafuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    speak(item.wafuKana);
  };

  return (
    <div
      id={`month-card-${item.id}`}
      className={`${styles.card} ${isActive ? styles.activeCard : ''}`}
      onClick={onClick}
      style={{ color: item.themeColor }}
    >
      {/* === 左侧：文化侧栏 (竖排) === */}
      <div
        className={styles.leftSpine}
        style={{ backgroundColor: item.themeColor }}
        onClick={handleWafuClick}
      >
        {/* 顶部标签：Old Name */}
        <span className={styles.spineLabel}>
          {t('date_study.month.old_name', 'Old Name')}
        </span>

        {/* 中间：竖排核心内容 */}
        <div className={styles.spineContent}>
          {/* 假名 (竖排) */}
          <span className={`${styles.wafuVertical} ${styles.wafuKana}`}>
            {item.wafuKana}
          </span>
          {/* 汉字 (竖排) */}
          <span className={`${styles.wafuVertical} ${styles.wafuKanji}`}>
            {item.wafuName}
          </span>
        </div>

        {/* 底部意译 */}
        <span className={styles.wafuMeaning}>{item.wafuMeaning}</span>

        {/* 交互提示图标 (隐式) */}
        <div className={styles.spineSpeaker}>
          <Volume2 size={20} color="white" />
        </div>
      </div>

      {/* === 右侧：现代教学区 === */}
      <div className={styles.rightBody}>
        <div className={styles.headerRow}>
          <div className={styles.normalReading}>
            <div className={styles.enMonth}>{displayMonth}</div>
          </div>

          <div className={`${styles.kanjiMain} jaFont`}>{item.kanji}</div>
        </div>

        <div className={styles.readingArea}>
          <span className={styles.romajiText}>{item.romaji}</span>
          <div className={`${styles.kanaText} jaFont`}>{item.kana}</div>
          {item.trapDetail && (
            <div className={styles.correctionBlock}>
              <div className={styles.wrongRow}>
                <X size={14} strokeWidth={3} />
                <span className={styles.strikethrough}>
                  {item.trapDetail.wrongRomaji}
                </span>
                <span className={styles.strikethrough}>
                  ({item.trapDetail.wrongKana})
                </span>
              </div>
            </div>
          )}
        </div>

        <div className={styles.iconBg}>
          <Icon size={120} strokeWidth={1.5} />
        </div>
      </div>
    </div>
  );
};
