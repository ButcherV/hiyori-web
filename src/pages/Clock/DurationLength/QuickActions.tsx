import { useTranslation, Trans } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import { Toast } from '../../../components/Toast/Toast';
import styles from './QuickActions.module.css';

type Axis = 'hour' | 'minute' | 'second';

interface QuickActionsProps {
  activeAxes: Set<Axis>;
  onToggleAxis: (axis: Axis) => void;
  onJumpTo: (axis: Axis, value: number) => void;
}

const AXIS_LABELS: Record<Axis, string> = {
  hour: '時間',
  minute: '分',
  second: '秒',
};

export function QuickActions({ activeAxes, onToggleAxis, onJumpTo }: QuickActionsProps) {
  useTranslation(); // subscribe to language changes

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
    setToastConfig({ isVisible: true, message: titleKey, description: descKey });
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setToastConfig((prev) => ({ ...prev, isVisible: false }));
    }, 5800);
  };

  const specialHours = [
    { value: 4,  label: '4時間',  toastTitleKey: 'clock_study.duration_toast.hour_4_title', toastDescKey: 'clock_study.duration_toast.hour_4_desc' },
    { value: 9,  label: '9時間',  toastTitleKey: 'clock_study.duration_toast.hour_9_title', toastDescKey: 'clock_study.duration_toast.hour_9_desc' },
  ];

  const specialMinutes = [
    { value: 1,  label: '1分',  toastTitleKey: 'clock_study.toast.minute_1_title',  toastDescKey: 'clock_study.toast.minute_1_desc' },
    { value: 3,  label: '3分',  toastTitleKey: 'clock_study.toast.minute_3_title',  toastDescKey: 'clock_study.toast.minute_3_desc' },
    { value: 6,  label: '6分',  toastTitleKey: 'clock_study.toast.minute_6_title',  toastDescKey: 'clock_study.toast.minute_6_desc' },
    { value: 8,  label: '8分',  toastTitleKey: 'clock_study.toast.minute_8_title',  toastDescKey: 'clock_study.toast.minute_8_desc' },
    { value: 10, label: '10分', toastTitleKey: 'clock_study.toast.minute_10_title', toastDescKey: 'clock_study.toast.minute_10_desc' },
  ];

  const axes: Axis[] = ['hour', 'minute', 'second'];
  const jaSpan = <span className="jaFont" />;

  return (
    <div className={styles.container}>
      <Toast
        isVisible={toastConfig.isVisible}
        message={<Trans i18nKey={toastConfig.message} components={{ ja: jaSpan }} />}
        description={<Trans i18nKey={toastConfig.description} components={{ ja: jaSpan }} />}
      />

      {/* Axis toggles */}
      <div className={styles.row}>
        {axes.map((axis) => (
          <button
            key={axis}
            className={`${styles.chip} ${activeAxes.has(axis) ? styles.chipActive : styles.chipInactive} jaFont`}
            onClick={() => {
              if (activeAxes.has(axis) && activeAxes.size === 1) return;
              onToggleAxis(axis);
            }}
          >
            {AXIS_LABELS[axis]}
          </button>
        ))}
      </div>

      {/* Special reading chips */}
      <div className={styles.row}>
        {specialHours.map((item) => (
          <button
            key={`h-${item.value}`}
            className={`${styles.chip} ${styles.chipSmall} ${styles.chipHour} jaFont`}
            onClick={() => {
              onJumpTo('hour', item.value);
              showToast(item.toastTitleKey, item.toastDescKey);
            }}
          >
            {item.label}
          </button>
        ))}

        <div className={styles.divider} />

        {specialMinutes.map((item) => (
          <button
            key={`m-${item.value}`}
            className={`${styles.chip} ${styles.chipSmall} ${styles.chipMinute} jaFont`}
            onClick={() => {
              onJumpTo('minute', item.value);
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
