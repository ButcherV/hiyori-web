import { useTranslation } from 'react-i18next';
import { Volume2 } from 'lucide-react';
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
    <>
      <div className={styles.timeDisplay}>
        {selectedPeriod ? (
          <>
            <div className={styles.timeBlock}>
              <div className={styles.timeLabel}>意思</div>
              <div className={styles.timeValue}>{selectedPeriod.description || '—'}</div>
            </div>
            <button className={styles.speakBtn} onClick={onPlayPeriod}>
              <Volume2 size={20} />
            </button>
          </>
        ) : (
          <>
            <div className={styles.timeBlock}>
              <div className={styles.timeLabel}>じかんたい</div>
              <div className={styles.timeValue}>{durationText}</div>
            </div>
          </>
        )}
      </div>

      <div className="notePill">
        <span className="noteIcon">💡</span>
        <span className="noteText">
          {t('clock_study.duration_hint') || '拖动圆圈上的控制点来选择时间段'}
        </span>
      </div>
    </>
  );
}
