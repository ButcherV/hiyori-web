import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TimeDrumPicker } from './TimePicker/TimeDrumPicker';
import { DurationPicker } from './Duration/DurationPicker';
import { LevelNav } from '../../components/LevelNav/LevelNav';
import styles from './PageClock.module.css';

type ClockMode = 'time' | 'duration-length' | 'duration-period';

export function PageClock() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [mode, setMode] = useState<ClockMode>('time');

  // 导航项配置：时刻、时长、时段
  const navItems = [
    { id: 'time', label: t('clock_study.time') || '時刻' },
    { id: 'duration-length', label: t('clock_study.duration_length') || '時長' },
    { id: 'duration-period', label: t('clock_study.duration_period') || '時段' },
  ];

  const handleModeChange = (id: string) => {
    setMode(id as ClockMode);
  };

  return (
    <div className={styles.container}>
      <div className={styles.systemHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.iconBtn} onClick={() => navigate('/')}>
            <ChevronLeft size={24} color="white" />
          </div>
          <span className={styles.headerTitle}>
            {t('clock_study.title')}
          </span>
        </div>
      </div>

      <div className={styles.levelNavWrapper}>
        <LevelNav
          items={navItems}
          activeId={mode}
          onSelect={handleModeChange}
        />
      </div>

      <div className={styles.workspace}>
        {mode === 'time' && <TimeDrumPicker />}
        {mode === 'duration-length' && <div>时长组件待开发</div>}
        {mode === 'duration-period' && <DurationPicker />}
      </div>
    </div>
  );
}
