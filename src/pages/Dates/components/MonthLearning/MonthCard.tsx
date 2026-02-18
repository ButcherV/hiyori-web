// src/pages/Dates/components/MonthLearning/MonthCard.tsx

import React from 'react';
import * as Icons from 'lucide-react';
import { Volume2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTTS } from '../../../../hooks/useTTS';
import { type MonthItem } from '../../Datas/MonthData';
import styles from './MonthCard.module.css';

// 每月独立色板，与 MonthData 的 themeColor 保持同色系
const MONTH_STYLES: Record<
  number,
  { bg: string; accent: string; hiragana: string; divider: string }
> = {
  1: {
    bg: '#FFF0F0',
    accent: '#C0392B',
    hiragana: '#922B21',
    divider: '#FCCACA',
  }, // 紅 crimson
  2: {
    bg: '#EEF2F7',
    accent: '#4A6FA5',
    hiragana: '#2C4A7C',
    divider: '#C5D3E8',
  }, // 藍鼠 slate blue
  3: {
    bg: '#FFF0F5',
    accent: '#C2185B',
    hiragana: '#AD1457',
    divider: '#F8BBD9',
  }, // 桜色 cherry
  4: {
    bg: '#F5F0FF',
    accent: '#7C3AED',
    hiragana: '#5B21B6',
    divider: '#DDD6FE',
  }, // 藤色 wisteria
  5: {
    bg: '#F0FFF4',
    accent: '#2F6E3B',
    hiragana: '#1E4D29',
    divider: '#B7EBC7',
  }, // 若草色 green
  6: {
    bg: '#E6FFF9',
    accent: '#0D7377',
    hiragana: '#085255',
    divider: '#A3ECD6',
  }, // 浅葱色 teal
  7: {
    bg: '#EEF4FF',
    accent: '#1E3A8A',
    hiragana: '#163080',
    divider: '#BFDBFE',
  }, // 瑠璃色 lapis
  8: {
    bg: '#FFFCEB',
    accent: '#B45309',
    hiragana: '#92400E',
    divider: '#FDE68A',
  }, // 向日葵 amber
  9: {
    bg: '#FFF4ED',
    accent: '#9A3412',
    hiragana: '#7C2D12',
    divider: '#FDBA74',
  }, // 柿色 persimmon
  10: {
    bg: '#FFF1F2',
    accent: '#9F1239',
    hiragana: '#881337',
    divider: '#FECDD3',
  }, // 茜色 madder red
  11: {
    bg: '#F3F4F6',
    accent: '#374151',
    hiragana: '#1F2937',
    divider: '#D1D5DB',
  }, // 利休鼠 sage grey
  12: {
    bg: '#EEF2FF',
    accent: '#3730A3',
    hiragana: '#312E81',
    divider: '#C7D2FE',
  }, // 藍 indigo
};

export const MonthCard: React.FC<{
  item: MonthItem;
  isActive: boolean;
  onClick: () => void;
}> = ({ item, isActive, onClick }) => {
  const { speak } = useTTS();
  const { t } = useTranslation();

  const ss = MONTH_STYLES[item.id] ?? MONTH_STYLES[1];
  const BgIcon = (Icons as Record<string, React.ElementType>)[item.icon];

  const handleCardClick = () => {
    if (!isActive) {
      onClick();
    } else {
      speak(item.kana);
    }
  };

  const handleModernAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    speak(item.kana);
  };

  const handleClassicalAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    speak(item.wafuKana);
  };

  const formattedRomaji = item.romaji.replace(/·/g, '·');

  return (
    <div
      id={`month-card-${item.id}`}
      className={`${styles.card} ${isActive ? styles.activeCard : ''}`}
      style={
        {
          '--card-bg': ss.bg,
          '--card-accent': ss.accent,
          '--card-hiragana': ss.hiragana,
          '--card-divider': ss.divider,
        } as React.CSSProperties
      }
      onClick={handleCardClick}
    >
      {/* 背景装饰图标 */}
      {BgIcon && (
        <BgIcon
          size={200}
          className={styles.bgIcon}
          aria-hidden="true"
          strokeWidth={1.0}
        />
      )}

      {/* ① Meta 行：季节 + 进度 */}
      <div className={styles.metaRow}>
        <span className={styles.seasonLabel}>
          {t(`date_study.month.season.${item.season}`)}
        </span>
        <span className={styles.progressLabel}>
          {String(item.id).padStart(2, '0')} / 12
        </span>
      </div>

      {/* ② 现代月名 — 主角 */}
      <p className={`${styles.modernKanji} jaFont`}>{item.kanji}</p>

      {/* ③ 假名读音 */}
      <p className={`${styles.hiragana} jaFont`}>{item.kana}</p>

      {/* ④ 罗马音 + 现代发音按钮 */}
      <div className={styles.romajiRow}>
        <span className={styles.romajiText}>{formattedRomaji}</span>
        <button
          className={styles.audioBtn}
          onClick={handleModernAudio}
          aria-label={`Play ${item.kana}`}
        >
          <Volume2 size={14} />
        </button>
      </div>

      {/* ④.5 发音陷阱提示（仅 trapDetail 存在时显示）*/}
      {item.trapDetail && (
        <div className={styles.trapRow}>
          <span className={styles.trapBadge}>{t('date_study.month.trap')}</span>
          <span className={`${styles.trapWrong} jaFont`}>
            {item.trapDetail.wrongKana}
          </span>
          <span className={styles.trapWrongRomaji}>
            {item.trapDetail.wrongRomaji.replace(/·/g, '·')}
          </span>
        </div>
      )}

      {/* ⑤ 古称分隔线 */}
      <div className={styles.dividerRow}>
        <span className={styles.dividerLabel}>
          {t('date_study.month.old_name')}
        </span>
        <div className={styles.dividerLine} />
      </div>

      {/* ⑥ 古称区域 */}
      <div className={styles.classicalSection}>
        <div className={styles.classicalLeft}>
          <div className={styles.classicalNameRow}>
            <span className={`${styles.classicalKanji} jaFont`}>
              {item.wafuName}
            </span>
            <span className={`${styles.classicalHiragana} jaFont`}>
              {item.wafuKana}
            </span>
          </div>
          <span className={styles.classicalSubtext}>
            {item.wafuRomaji}&nbsp;·&nbsp;
            {t(`date_study.month.meaning.${item.id}`, item.wafuMeaning)}
          </span>
        </div>
        <button
          className={styles.classicalAudioBtn}
          onClick={handleClassicalAudio}
          aria-label={`Play ${item.wafuKana}`}
        >
          <Volume2 size={12} />
        </button>
      </div>
    </div>
  );
};
