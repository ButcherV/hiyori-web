import type { TimePeriod } from './types';
import styles from './PeriodChips.module.css';

interface PeriodChipsProps {
  periods: TimePeriod[];
  selectedPeriod: TimePeriod | null;
  onSelectPeriod: (period: TimePeriod) => void;
}

export function PeriodChips({ periods, selectedPeriod, onSelectPeriod }: PeriodChipsProps) {
  return (
    <div className={styles.timePeriods}>
      {periods.map((period) => (
        <button
          key={period.name}
          className={`${styles.periodChip} ${selectedPeriod?.name === period.name ? styles.periodChipActive : ''}`}
          onClick={() => onSelectPeriod(period)}
          title={period.description}
        >
          {period.name}
        </button>
      ))}
    </div>
  );
}
