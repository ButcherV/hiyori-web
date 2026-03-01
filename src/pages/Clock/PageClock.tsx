import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TimeDrumPicker } from './TimePicker/TimeDrumPicker';
import { TimeDrumPicker as DurationLengthPicker } from './DurationLength/TimeDrumPicker';
import { DurationPicker } from './Duration/DurationPicker';
import { LevelNav } from '../../components/LevelNav/LevelNav';
import { CLOCK_LESSONS } from './clockConfig';
import BottomSheet from '../../components/BottomSheet';
import { useSettings } from '../../context/SettingsContext';
import styles from './PageClock.module.css';

type ClockMode = 'time' | 'duration-length' | 'duration-period';

export function PageClock() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const {
    lastClockLesson = 'time',
    setLastClockLesson,
    viewedClockIntros = [],
    markClockIntroAsViewed,
  } = useSettings();

  const [mode, setMode] = useState<ClockMode>(lastClockLesson as ClockMode);
  
  const [isInfoOpen, setInfoOpen] = useState(() => {
    return !viewedClockIntros.includes(mode);
  });

  useEffect(() => {
    if (!isInfoOpen) {
      markClockIntroAsViewed(mode);
    }
  }, [isInfoOpen, mode, markClockIntroAsViewed]);

  const currentLessonConfig =
    CLOCK_LESSONS.find((l) => l.id === mode) || CLOCK_LESSONS[0];

  const pageTitle = t(currentLessonConfig.titleKey);

  // 导航项配置：时刻、时长、时段
  const navItems = CLOCK_LESSONS.map((lesson) => ({
    id: lesson.id,
    label: t(lesson.labelKey),
  }));

  const handleModeChange = (id: string) => {
    const newMode = id as ClockMode;
    setMode(newMode);
    setLastClockLesson(newMode);
    const hasViewedNewLesson = viewedClockIntros.includes(newMode);
    setInfoOpen(!hasViewedNewLesson);
  };

  return (
    <div className={styles.container}>
      <div className={styles.systemHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.iconBtn} onClick={() => navigate('/')}>
            <ChevronLeft size={24} color="white" />
          </div>
          <div className={styles.titleWrapper}>
            <span key={pageTitle} className={styles.headerTitle}>
              {pageTitle}
            </span>
            <div
              onClick={() => setInfoOpen(true)}
              className={styles.iconBtn}
              style={{ color: 'white' }}
            >
              <HelpCircle size={20} />
            </div>
          </div>
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
        {mode === 'duration-length' && <DurationLengthPicker />}
        {mode === 'duration-period' && <DurationPicker />}
      </div>

      <BottomSheet
        isOpen={isInfoOpen}
        onClose={() => setInfoOpen(false)}
        title={pageTitle}
      >
        <div className={styles.infoSheetContent}>
          <currentLessonConfig.DescriptionContent />
        </div>
      </BottomSheet>
    </div>
  );
}
