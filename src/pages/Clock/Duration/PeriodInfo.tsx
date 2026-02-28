import { useTranslation } from 'react-i18next';
import { Volume2, Lightbulb } from 'lucide-react';
import type { TimePeriod } from './types';
import styles from './PeriodInfo.module.css';

interface PeriodInfoProps {
  selectedPeriod: TimePeriod | null;
  durationText: string;
  onPlayPeriod: () => void;
}

export function PeriodInfo({ selectedPeriod, durationText, onPlayPeriod }: PeriodInfoProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <div className={styles.timeRow}>
        {selectedPeriod ? (
          <>
            <div className={styles.segment}>
              <span className={styles.segKana}>{selectedPeriod.kana}</span>
              <span className={styles.segKanji}>{selectedPeriod.name}</span>
            </div>
            <button className={styles.speakerBtnSmall} onClick={onPlayPeriod}>
              <Volume2 size={14} />
            </button>
          </>
        ) : (
          <div className={styles.segment}>
            <span className={styles.segKana}>じかんたい</span>
            <span className={styles.segKanji}>{durationText}</span>
          </div>
        )}
      </div>

      <div className="notePill">
        <Lightbulb size={14} className="noteIcon" />
        <span className="noteText">
          {selectedPeriod?.description || t('clock_study.duration_hint') || '拖动圆圈上的控制点来选择时间段'}
        </span>
      </div>
    </div>
  );
}
