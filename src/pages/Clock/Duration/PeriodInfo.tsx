import { useTranslation } from 'react-i18next';
import { Volume2, Lightbulb } from 'lucide-react';
import type { TimePeriod } from './types';
import styles from './PeriodInfo.module.css';

interface PeriodInfoProps {
  selectedPeriod: TimePeriod | null;
  onPlayPeriod: () => void;
}

export function PeriodInfo({ selectedPeriod, onPlayPeriod }: PeriodInfoProps) {
  const { t } = useTranslation();

  return (
    <div className={styles.wrapper}>
      <div className={styles.timeRow}>
        {selectedPeriod ? (
          <>
            <div className={styles.segment}>
              <span className={`${styles.segKana} jaFont`}>{selectedPeriod.kana}</span>
              <span className={`${styles.segKanji} jaFont`}>{selectedPeriod.name}</span>
            </div>
            <button className={styles.speakerBtnSmall} onClick={onPlayPeriod}>
              <Volume2 size={14} />
            </button>
          </>
        ) : (
          <div className={styles.segment}>
            <span className={`${styles.segKana} jaFont`}>じかんたい</span>
            <span className={styles.segKanji}>—</span>
          </div>
        )}
      </div>

      <div className="notePill">
        <Lightbulb size={14} className="noteIcon" />
        <span className="noteText">
          {(selectedPeriod && t(`clock_study.period.${selectedPeriod.i18nKey}`, '')) ||
            t('clock_study.duration_hint')}
        </span>
      </div>
    </div>
  );
}
