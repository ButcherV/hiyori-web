import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TimeDrumPicker } from './TimePicker/TimeDrumPicker';
import { DurationPicker } from './Duration/DurationPicker';
import styles from './PageClock.module.css';

type ClockMode = 'time' | 'duration';

export function PageClock() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [mode, setMode] = useState<ClockMode>('time');

  return (
    <div className={styles.page}>
      <div className={styles.systemHeader}>
        <div className={styles.headerLeft}>
          <button className={styles.iconBtn} onClick={() => navigate('/')}>
            <ChevronLeft size={24} />
          </button>
          <span className={styles.headerTitle}>
            {t('clock_study.title')}
          </span>
        </div>
        
        {/* 模式切换按钮 */}
        <div className={styles.modeToggle}>
          <button
            className={`${styles.modeBtn} ${mode === 'duration' ? styles.modeBtnActive : ''}`}
            onClick={() => setMode('duration')}
          >
            {t('clock_study.duration') || '時間段'}
          </button>
          <button
            className={`${styles.modeBtn} ${mode === 'time' ? styles.modeBtnActive : ''}`}
            onClick={() => setMode('time')}
          >
            {t('clock_study.time') || '時刻'}
          </button>
        </div>
      </div>
      <div className={styles.workspace}>
        {mode === 'time' ? <TimeDrumPicker /> : <DurationPicker />}
      </div>
    </div>
  );
}
