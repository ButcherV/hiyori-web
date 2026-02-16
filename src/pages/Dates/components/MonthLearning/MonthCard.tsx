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
  Volume2, // 🟢 确保引入 Volume2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
  const { i18n, t } = useTranslation();
  const Icon = IconMap[item.icon] || Sun;

  // 获取当前语言的月份名称 (e.g. "January" or "一月")
  const displayMonth = new Date(2024, item.id - 1, 1).toLocaleString(
    i18n.language,
    { month: 'long' }
  );

  // 1. 左侧点击：和风读音
  const handleWafuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    speak(item.wafuKana);
  };

  // 2. 右侧点击：现代读音 + 选中逻辑
  const handleModernClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isActive) {
      // 如果还没选中，只触发切换。
      // 父组件 MonthLearning 的 useEffect 会监听到 activeMonth 变化并自动播放一次。
      onClick();
    } else {
      // 如果已经选中了，则是用户想重听，直接播放
      speak(item.kana);
    }
  };

  // 3. 动态背景色：选中时，使用主题色 + 12 (Hex透明度，约7%)
  // 例如 #ef4444 变成 #ef444412，营造淡淡的氛围感
  const rightBodyStyle = isActive
    ? { backgroundColor: `${item.themeColor}12` }
    : undefined;

  // 4. 动态喇叭颜色：选中时跟随主题色，未选中时灰色
  const speakerStyle = isActive ? { color: item.themeColor, opacity: 1 } : {};

  return (
    <div
      id={`month-card-${item.id}`}
      className={`${styles.card} ${isActive ? styles.activeCard : ''}`}
      style={{ color: item.themeColor }}
      // 注意：这里移除了外层的 onClick，改为由左右两侧分别接管点击事件
    >
      {/* === 左侧：文化侧栏 (点击发音) === */}
      <div
        className={styles.leftSpine}
        style={{ backgroundColor: item.themeColor }}
        onClick={handleWafuClick}
      >
        <span className={styles.spineLabel}>
          {t('date_study.month.old_name', 'Old Name')}
        </span>

        <div className={styles.spineContent}>
          {/* 🟢 左侧喇叭：常驻半透明显示 */}
          <div className={styles.spineSpeaker}>
            <Volume2 size={18} />
          </div>
          <span className={`${styles.wafuVertical} ${styles.wafuKana}`}>
            {item.wafuKana}
          </span>
          <span className={`${styles.wafuVertical} ${styles.wafuKanji}`}>
            {item.wafuName}
          </span>
        </div>

        <span className={styles.wafuMeaning}>{item.wafuMeaning}</span>
      </div>

      {/* === 右侧：现代教学区 (点击发音/选中) === */}
      <div
        className={styles.rightBody}
        onClick={handleModernClick}
        style={rightBodyStyle} // 🟢 注入淡淡的背景色
      >
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

        {/* 背景大图标 */}
        <div className={styles.iconBg}>
          <Icon size={120} strokeWidth={1.5} />
        </div>

        {/* 🟢 新增：右侧发音喇叭 */}
        <div className={styles.modernSpeaker} style={speakerStyle}>
          <Volume2 size={18} />
        </div>
      </div>
    </div>
  );
};
