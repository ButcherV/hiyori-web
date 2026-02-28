import { useTranslation, Trans } from 'react-i18next';
import { Clock } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Toast } from '../../../components/Toast/Toast';
import styles from './QuickActions.module.css';

interface QuickActionsProps {
  is24h: boolean;
  currentHour: number;
  onToggleFormat: () => void;
  onJumpToNow: () => void;
  onJumpTo: (hour: number, minute: number) => void;
}

export function QuickActions({
  is24h,
  currentHour,
  onToggleFormat,
  onJumpToNow,
  onJumpTo,
}: QuickActionsProps) {
  const { t } = useTranslation();

  // Toast 状态管理
  const [toastConfig, setToastConfig] = useState<{
    isVisible: boolean;
    message: string;
    description: string;
  }>({
    isVisible: false,
    message: '',
    description: '',
  });

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const showToast = (titleKey: string, descKey: string) => {
    setToastConfig({
      isVisible: true,
      message: titleKey,
      description: descKey,
    });

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setToastConfig((prev) => ({ ...prev, isVisible: false }));
    }, 5800);
  };

  const specialHours = [
    { 
      hour: 4, 
      minute: 0, 
      label: '4時',
      toastTitleKey: 'clock_study.toast.hour_4_title',
      toastDescKey: 'clock_study.toast.hour_4_desc'
    },
    { 
      hour: 7, 
      minute: 0, 
      label: '7時',
      toastTitleKey: 'clock_study.toast.hour_7_title',
      toastDescKey: 'clock_study.toast.hour_7_desc'
    },
    { 
      hour: 9, 
      minute: 0, 
      label: '9時',
      toastTitleKey: 'clock_study.toast.hour_9_title',
      toastDescKey: 'clock_study.toast.hour_9_desc'
    },
  ];

  const specialMinutes = [
    { minute: 1, label: '1分', toastTitleKey: 'clock_study.toast.minute_1_title', toastDescKey: 'clock_study.toast.minute_1_desc' },
    { minute: 3, label: '3分', toastTitleKey: 'clock_study.toast.minute_3_title', toastDescKey: 'clock_study.toast.minute_3_desc' },
    { minute: 6, label: '6分', toastTitleKey: 'clock_study.toast.minute_6_title', toastDescKey: 'clock_study.toast.minute_6_desc' },
    { minute: 8, label: '8分', toastTitleKey: 'clock_study.toast.minute_8_title', toastDescKey: 'clock_study.toast.minute_8_desc' },
    { minute: 10, label: '10分', toastTitleKey: 'clock_study.toast.minute_10_title', toastDescKey: 'clock_study.toast.minute_10_desc' },
    { minute: 30, label: '30分', toastTitleKey: 'clock_study.toast.minute_30_title', toastDescKey: 'clock_study.toast.minute_30_desc' },
  ];

  const jaSpan = <span className="jaFont" />;

  return (
    <div className={styles.container}>
      <Toast
        isVisible={toastConfig.isVisible}
        message={
          <Trans
            i18nKey={toastConfig.message}
            components={{ ja: jaSpan }}
          />
        }
        description={
          <Trans
            i18nKey={toastConfig.description}
            components={{ ja: jaSpan }}
          />
        }
      />

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
            onClick={() => {
              onJumpTo(item.hour, item.minute);
              showToast(item.toastTitleKey, item.toastDescKey);
            }}
          >
            {item.label}
          </button>
        ))}

        <div className={styles.divider} />

        {specialMinutes.map((item, i) => (
          <button
            key={`m-${i}`}
            className={`${styles.chip} ${styles.chipMinute} jaFont`}
            onClick={() => {
              onJumpTo(currentHour, item.minute);
              showToast(item.toastTitleKey, item.toastDescKey);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
