import { useTranslation } from 'react-i18next';
import styles from './SpecialTimeShortcuts.module.css';

interface SpecialTimeShortcutsProps {
  onJumpTo: (hour: number, minute: number) => void;
}

export function SpecialTimeShortcuts({ onJumpTo }: SpecialTimeShortcutsProps) {
  const { t } = useTranslation();

  const shortcuts = [
    { hour: 4, minute: 0, label: '4時', kana: 'よじ' },
    { hour: 9, minute: 0, label: '9時', kana: 'くじ' },
    { hour: 7, minute: 0, label: '7時', kana: 'しちじ' },
    { hour: 9, minute: 30, label: '9時半', kana: 'はん' },
  ];

  return (
    <div className={styles.container}>
      <span className={styles.label}>
        {t('clock_study.special_times', '特殊发音')}:
      </span>
      <div className={styles.shortcuts}>
        {shortcuts.map((item, i) => (
          <button
            key={i}
            className={styles.shortcut}
            onClick={() => onJumpTo(item.hour, item.minute)}
          >
            <span className={styles.shortcutLabel}>{item.label}</span>
            <span className={styles.shortcutKana}>({item.kana})</span>
          </button>
        ))}
      </div>
    </div>
  );
}
