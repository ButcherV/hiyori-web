// src/pages/Dates/components/WeekLearning/WeekCard.tsx

import React from 'react';
import * as Icons from 'lucide-react';
import { Volume2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTTS } from '../../../../hooks/useTTS';
import { type WeekDayItem } from './WeekData';
import styles from './WeekCard.module.css';

// 每天独立色板 — 与 gradient/shadowColor 保持同色系
const DAY_STYLES: Record<
  number,
  { bg: string; accent: string; leftBg: string }
> = {
  0: { bg: '#fff5f5', accent: '#dc2626', leftBg: '#fee2e2' }, // 日 Sun      - red
  1: { bg: '#f8fafc', accent: '#475569', leftBg: '#e2e8f0' }, // 月 Moon     - slate
  2: { bg: '#fff7ed', accent: '#c2410c', leftBg: '#fed7aa' }, // 火 Fire     - orange
  3: { bg: '#f0f9ff', accent: '#0369a1', leftBg: '#bae6fd' }, // 水 Water    - sky
  4: { bg: '#f0fdf4', accent: '#15803d', leftBg: '#bbf7d0' }, // 木 Wood     - green
  5: { bg: '#fffbeb', accent: '#92400e', leftBg: '#fde68a' }, // 金 Gold     - amber
  6: { bg: '#eff6ff', accent: '#1e40af', leftBg: '#bfdbfe' }, // 土 Earth    - blue
};

export const WeekCard: React.FC<{
  item: WeekDayItem;
  isActive: boolean;
  onClick: () => void;
}> = ({ item, isActive, onClick }) => {
  const { speak } = useTTS();
  const { t } = useTranslation();

  const ds = DAY_STYLES[item.id] ?? DAY_STYLES[0];
  const BgIcon = (Icons as Record<string, React.ElementType>)[item.icon];
  // 元素字 = 星期名第一个汉字（日/月/火/水/木/金/土）
  const elementKanji = item.kanji.charAt(0);
  const formattedRomaji = item.romaji.replace(/·/g, '·');

  const handleCardClick = () => {
    onClick();
    speak(item.kana);
  };

  const handleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    speak(item.kana);
  };

  return (
    <div
      id={`week-card-${item.id}`}
      className={`${styles.card} ${isActive ? styles.activeCard : ''}`}
      style={
        {
          '--card-bg': ds.bg,
          '--card-accent': ds.accent,
          '--card-left-bg': ds.leftBg,
          '--card-gradient': item.gradient,
          '--card-shadow': isActive ? item.shadowColor : 'transparent',
        } as React.CSSProperties
      }
      onClick={handleCardClick}
    >
      {/* 左柱：元素标识 */}
      <div className={styles.leftPanel}>
        <span className={`${styles.elementKanji} jaFont`}>{elementKanji}</span>
        <span className={styles.elementName}>
          {t(`date_study.week.element.${item.id}`)}
        </span>
        <span className={styles.dayLabel}>
          {t(`date_study.week.day.${item.id}`)}
        </span>
      </div>

      {/* 右侧：日语学习内容 */}
      <div className={styles.rightPanel}>
        {/* 背景装饰图标 */}
        {BgIcon && (
          <BgIcon
            size={110}
            className={styles.bgIcon}
            aria-hidden="true"
            strokeWidth={1.0}
          />
        )}

        {/* 汉字 */}
        <p className={`${styles.kanji} jaFont`}>{item.kanji}</p>

        {/* 假名 */}
        <p className={`${styles.kana} jaFont`}>{item.kana}</p>

        {/* 罗马音 + 音频 */}
        <div className={styles.romajiRow}>
          <span className={styles.romaji}>{formattedRomaji}</span>
          <button
            className={styles.audioBtn}
            onClick={handleAudio}
            aria-label={`Play ${item.kana}`}
          >
            <Volume2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
