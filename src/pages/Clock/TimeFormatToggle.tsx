import styles from './TimeFormatToggle.module.css';

interface TimeFormatToggleProps {
  is24h: boolean;
  onChange: (is24h: boolean) => void;
}

export function TimeFormatToggle({ is24h, onChange }: TimeFormatToggleProps) {
  return (
    <div className={styles.toggle}>
      <button
        className={`${styles.btn} ${!is24h ? styles.active : ''}`}
        onClick={() => onChange(false)}
      >
        12h
      </button>
      <button
        className={`${styles.btn} ${is24h ? styles.active : ''}`}
        onClick={() => onChange(true)}
      >
        24h
      </button>
    </div>
  );
}
