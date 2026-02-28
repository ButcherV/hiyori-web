import { useTranslation } from 'react-i18next';
import { Clock } from 'lucide-react';
import styles from './QuickActions.module.css';

interface QuickActionsProps {
  is24h: boolean;
  onToggleFormat: () => void;
  onJumpToNow: () => void;
}

export function QuickActions({ is24h, onToggleFormat, onJumpToNow }: QuickActionsProps) {
  const { t } = useTranslation();

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
      </div>
    </div>
  );
}
