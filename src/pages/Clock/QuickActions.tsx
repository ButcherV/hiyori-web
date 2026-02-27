import { useTranslation } from 'react-i18next';
import { Clock } from 'lucide-react';
import styles from './QuickActions.module.css';

interface QuickActionsProps {
  is24h: boolean;
  onToggleFormat: () => void;
  onJumpToNow: () => void;
  onJumpTo: (hour: number, minute: number) => void;
}

export function QuickActions({
  is24h,
  onToggleFormat,
  onJumpToNow,
  onJumpTo,
}: QuickActionsProps) {
  const { t } = useTranslation();

  const specialHours = [
    { hour: 4, minute: 0, label: '4時' },
    { hour: 7, minute: 0, label: '7時' },
    { hour: 9, minute: 0, label: '9時' },
    { hour: 14, minute: 0, label: '14時' },
    { hour: 19, minute: 0, label: '19時' },
    { hour: 9, minute: 30, label: '9時半' },
  ];

  const specialMinutes = [
    { hour: 9, minute: 1, label: '1分' },
    { hour: 9, minute: 3, label: '3分' },
    { hour: 9, minute: 6, label: '6分' },
    { hour: 9, minute: 8, label: '8分' },
    { hour: 9, minute: 10, label: '10分' },
    { hour: 9, minute: 30, label: '30分' },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <button
          className={`${styles.chip} ${is24h ? styles.chipModeActive : styles.chipMode}`}
          onClick={onToggleFormat}
        >
          {is24h ? '24h' : '12h'}
        </button>

        <button className={`${styles.chip} ${styles.chipNow}`} onClick={onJumpToNow}>
          <Clock size={14} />
          <span>{t('clock_study.now', 'Now')}</span>
        </button>

        <div className={styles.divider} />

        {specialHours.map((item, i) => (
          <button
            key={`h-${i}`}
            className={`${styles.chip} ${styles.chipHour} jaFont`}
            onClick={() => onJumpTo(item.hour, item.minute)}
          >
            {item.label}
          </button>
        ))}

        <div className={styles.divider} />

        {specialMinutes.map((item, i) => (
          <button
            key={`m-${i}`}
            className={`${styles.chip} ${styles.chipMinute} jaFont`}
            onClick={() => onJumpTo(item.hour, item.minute)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
