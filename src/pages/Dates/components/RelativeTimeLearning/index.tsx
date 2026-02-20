// src/pages/Dates/components/RelativeTimeLearning/index.tsx

import React, { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTTS } from '../../../../hooks/useTTS';
import {
  type Granularity,
  getRelativeItem,
  getDateLabel,
} from '../../Datas/RelativeTimeData';
import styles from './index.module.css';

const OFFSETS = [-2, -1, 0, 1, 2] as const;

interface RelativeTimeLearningProps {
  granularity: Granularity;
}

export const RelativeTimeLearning: React.FC<RelativeTimeLearningProps> = ({
  granularity,
}) => {
  const [selectedOffset, setSelectedOffset] = useState(0);
  const { speak } = useTTS();
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith('zh') ? 'zh' : 'en';

  // Reset to current when switching granularity
  useEffect(() => {
    setSelectedOffset(0);
  }, [granularity]);

  const item = getRelativeItem(granularity, selectedOffset);

  return (
    <div className={styles.container}>

      {/* ── Timeline ── */}
      <div className={styles.timeline}>
        <div className={styles.timelineAxis} />
        {OFFSETS.map((offset) => {
          const node = getRelativeItem(granularity, offset);
          const isSelected = offset === selectedOffset;
          const isCurrent = offset === 0;
          const dateLabel = getDateLabel(granularity, offset);

          return (
            <div
              key={offset}
              className={[
                styles.node,
                isSelected ? styles.nodeSelected : '',
                isCurrent && !isSelected ? styles.nodeCurrent : '',
              ].join(' ')}
              onClick={() => setSelectedOffset(offset)}
            >
              <span className={`${styles.nodeKanji} jaFont`}>
                {node?.kanji ?? '—'}
                {node?.trap && <span className={styles.trapDot} />}
              </span>
              <div className={styles.nodeDot} />
              <span className={styles.nodeDate}>{dateLabel}</span>
            </div>
          );
        })}
      </div>

      {/* ── Detail card ── */}
      {item && (
        <div className={styles.detail} key={`${granularity}-${selectedOffset}`}>

          {/* Hero row: kanji + trap badge */}
          <div className={styles.heroRow}>
            <p className={`${styles.heroKanji} jaFont`}>{item.kanji}</p>
            {item.trap && (
              <span className={styles.trapBadge}>
                {t('date_study.relative.trap_badge')}
              </span>
            )}
          </div>

          {/* Meaning in UI language */}
          <p className={styles.meaning}>{item.meaning[locale]}</p>

          {/* Kana + audio */}
          <div className={styles.kanaRow}>
            <p className={`${styles.kana} jaFont`}>{item.kana}</p>
            <button
              className={styles.audioBtn}
              onClick={() => speak(item.kana)}
              aria-label={`Play ${item.kana}`}
            >
              <Volume2 size={15} />
            </button>
          </div>

          {/* Romaji */}
          <p className={styles.romaji}>{item.romaji}</p>

          {/* Alt reading */}
          {item.altKana && (
            <div className={styles.altRow}>
              <span className={styles.altBadge}>
                {t('date_study.relative.alt_badge')}
              </span>
              {item.altKanji && (
                <span className={`${styles.altKanji} jaFont`}>{item.altKanji}</span>
              )}
              <span className={`${styles.altKana} jaFont`}>{item.altKana}</span>
              <span className={styles.altRomaji}>{item.altRomaji}</span>
              <button
                className={styles.audioBtn}
                onClick={() => speak(item.altKana!)}
                aria-label={`Play ${item.altKana}`}
              >
                <Volume2 size={13} />
              </button>
            </div>
          )}

          {/* Note */}
          {item.note && (
            <p className={styles.note}>{item.note[locale]}</p>
          )}
        </div>
      )}
    </div>
  );
};
