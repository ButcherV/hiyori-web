// src/pages/Dates/components/HolidayLearning/HolidayCard.tsx

import React from 'react';
import { Volume2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTTS } from '../../../../hooks/useTTS';
import { type HolidayItem } from '../../Datas/holidayData';
import styles from './HolidayCard.module.css';

interface HolidayCardProps {
  item: HolidayItem;
  selectedDate: Date;
}

export const HolidayCard: React.FC<HolidayCardProps> = ({
  item,
  selectedDate,
}) => {
  const { speak } = useTTS();
  const { i18n } = useTranslation();
  const locale = i18n.language.startsWith('zh') ? 'zh' : 'en';

  const month = selectedDate.getMonth() + 1;
  const day = selectedDate.getDate();

  const badgeClass =
    item.badgeType === 'national'
      ? styles.badgeNational
      : item.badgeType === 'global'
        ? styles.badgeGlobal
        : styles.badgeTraditional;
  const badgeLabel =
    item.badgeType === 'national'
      ? '国民の祝日'
      : item.badgeType === 'global'
        ? '世界行事'
        : '年中行事';

  return (
    <div
      className={styles.card}
      style={
        {
          '--card-bg': item.theme.bg,
          '--card-accent': item.theme.accent,
          '--card-sub': item.theme.sub,
          '--card-divider': item.theme.divider,
        } as React.CSSProperties
      }
    >
      {/* ── Top row: badge + date ── */}
      <div className={styles.topRow}>
        <span className={`${styles.badge} ${badgeClass}`}>{badgeLabel}</span>
        <span className={styles.dateLabel}>
          {month}月{day}日
        </span>
      </div>

      {/* ── Hero: kanji, kana, romaji + audio ── */}
      <div className={styles.heroSection}>
        <p
          className={`${styles.kanji} jaFont`}
          style={item.kanji.length >= 6 ? { fontSize: 'clamp(26px, 7vw, 36px)' } : undefined}
        >
          {item.kanji}
          {item.emoji && <span className={styles.emojiSuffix}>{item.emoji}</span>}
        </p>

        {!item.hideKana && (
          <div className={styles.kanaRow}>
            <p className={`${styles.kana} jaFont`}>{item.kana}</p>
            <button
              className={styles.audioBtn}
              onClick={() => speak(item.kana)}
              aria-label={`Play ${item.kana}`}
            >
              <Volume2 size={14} />
            </button>
          </div>
        )}

        <div className={styles.romajiRow}>
          <p className={styles.romaji}>{item.romaji}</p>
          {item.hideKana && (
            <button
              className={styles.audioBtn}
              onClick={() => speak(item.kana)}
              aria-label={`Play ${item.kana}`}
            >
              <Volume2 size={14} />
            </button>
          )}
        </div>

        {item.etymology && (
          <p className={styles.etymologyNote}>{item.etymology[locale]}</p>
        )}
      </div>

      {/* ── Divider ── */}
      <div className={styles.divider} />

      {/* ── Cultural note ── */}
      <p className={styles.culturalNote}>{item.culturalNote[locale]}</p>

      {/* ── Expression ── */}
      <div className={styles.expressionBlock}>
        <div className={styles.expressionRow}>
          <p className={`${styles.expressionJp} jaFont`}>{item.expression.jp}</p>
          <button
            className={styles.audioBtn}
            onClick={() => speak(item.expression.jp)}
            aria-label={`Play ${item.expression.jp}`}
          >
            <Volume2 size={14} />
          </button>
        </div>
        <p className={styles.expressionTranslation}>
          {item.expression.translation[locale]}
        </p>
      </div>
    </div>
  );
};
