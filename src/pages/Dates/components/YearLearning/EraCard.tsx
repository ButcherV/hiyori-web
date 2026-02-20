// src/pages/Dates/components/YearLearning/EraCard.tsx

import React from 'react';
import { Volume2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTTS } from '../../../../hooks/useTTS';
import { type EraItem, getYearsKana } from '../../Datas/EraData';
import { getWesternYearReading } from '../../../../utils/dateHelper';
import styles from './EraCard.module.css';

interface EraCardProps {
  item: EraItem;
}

export const EraCard: React.FC<EraCardProps> = ({ item }) => {
  const { speak } = useTTS();
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith('zh') ? 'zh' : 'en';

  const startYearReading = getWesternYearReading(item.startYear);
  const durationYears = item.totalYears ?? (new Date().getFullYear() - item.startYear);
  const durationReading = getYearsKana(durationYears);
  const dateRange = item.endYear !== null
    ? `${item.startYear}〜${item.endYear}年`
    : `${item.startYear}〜`;

  const stopProp = (fn: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation();
    fn();
  };

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
      {/* ── Large background symbol ── */}
      <div className={styles.bgSymbol} aria-hidden="true">
        {item.kanji}
      </div>

      {/* ── Top meta row ── */}
      <div className={styles.topRow}>
        <span className={styles.badge}>{t('date_study.era.badge')}</span>
      </div>

      {/* ── Hero: era name ── */}
      <div className={styles.heroSection}>
        <p className={`${styles.heroKanji} jaFont`}>{item.kanji}</p>
        <div className={styles.kanaRow}>
          <p className={`${styles.kana} jaFont`}>{item.kana}</p>
          <button
            className={styles.audioBtn}
            onClick={stopProp(() => speak(item.kana))}
            aria-label={`Play ${item.kana}`}
          >
            <Volume2 size={14} />
          </button>
        </div>
        <p className={styles.romaji}>{item.romaji}</p>
      </div>

      {/* ── Start year section ── */}
      <div className={styles.sectionLabel}>{t('date_study.era.section_start_year')}</div>
      <div className={styles.gannenBlock}>
        <div className={styles.gannenTop}>
          <div className={styles.gannenLeft}>
            <p className={`${styles.gannenKanji} jaFont`}>{item.startYear}年</p>
            <p className={`${styles.gannenKana} jaFont`}>{startYearReading.kana}</p>
            <p className={styles.gannenRomaji}>{startYearReading.romaji}</p>
          </div>
          <button
            className={`${styles.audioBtn} ${styles.audioBtnGannen}`}
            onClick={stopProp(() => speak(startYearReading.kana))}
            aria-label={`Play ${startYearReading.kana}`}
          >
            <Volume2 size={14} />
          </button>
        </div>
      </div>

      {/* ── Duration section ── */}
      <div className={styles.sectionLabel}>{t('date_study.era.section_duration')}</div>
      <div className={styles.periodBlock}>
        <div className={styles.periodTop}>
          <div className={styles.periodLeft}>
            <p className={styles.dateRange}>{dateRange}</p>
            <p className={`${styles.periodKanji} jaFont`}>{durationYears}年間</p>
            <p className={`${styles.periodKana} jaFont`}>{durationReading.kana}</p>
            <p className={styles.periodRomaji}>{durationReading.romaji}</p>
          </div>
          <div className={styles.periodMeta}>
            {item.totalYears === null && (
              <span className={`${styles.durationBadge} ${styles.durationCurrent}`}>
                {t('date_study.era.ongoing')}
              </span>
            )}
          </div>
          <button
            className={`${styles.audioBtn} ${styles.audioBtnPeriod}`}
            onClick={stopProp(() => speak(durationReading.kana))}
            aria-label={`Play duration`}
          >
            <Volume2 size={14} />
          </button>
        </div>
      </div>

      {/* ── Divider: 字義と由来 ── */}
      <div className={styles.dividerRow}>
        <span className={styles.dividerLabel}>{t('date_study.era.char_meaning_divider')}</span>
        <div className={styles.dividerLine} />
      </div>

      {/* ── Character meanings ── */}
      <div className={styles.charMeaningBlock}>
        {item.charMeaning[locale].split('\n').map((line, i) => (
          <p key={i} className={styles.charMeaning}>{line}</p>
        ))}
      </div>

      {/* ── Source ── */}
      <div className={styles.sourceBlock}>
        <div className={styles.sourceTitleRow}>
          <span className={`${styles.sourceTitle} jaFont`}>{item.source.title}</span>
          <span className={`${styles.sourceTitleKana} jaFont`}>
            （{item.source.titleKana}）
          </span>
        </div>
        <p className={styles.sourceDesc}>{item.source[locale]}</p>
      </div>

      {/* ── Cultural note ── */}
      <p className={styles.culturalNote}>{item.culturalNote[locale]}</p>
    </div>
  );
};
