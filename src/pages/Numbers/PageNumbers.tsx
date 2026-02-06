import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, HelpCircle, Calculator } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import styles from './PageNumbers.module.css';
import { Level1 } from './Levels/Level1/Level1';
import { Level2 } from './Levels/Level2/Level2';
import { Level3 } from './Levels/Level3/Level3';
import { Level4 } from './Levels/Level4/Level4';
import { ALL_LEVELS_CONFIG } from './Levels';
import BottomSheet from '../../components/BottomSheet';
import { useSettings } from '../../context/SettingsContext';

// 引入新封装的组件
import { LevelNav } from '../../components/LevelNav/LevelNav';

export const PageNumbers = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    lastNumberLevel,
    setLastNumberLevel,
    viewedNumberIntros,
    markNumberIntroAsViewed,
  } = useSettings();

  const [activeLevelId, setActiveLevelId] = useState(lastNumberLevel);

  const [isInfoOpen, setInfoOpen] = useState(() => {
    return !viewedNumberIntros.includes(activeLevelId);
  });

  useEffect(() => {
    if (!isInfoOpen) {
      markNumberIntroAsViewed(activeLevelId);
    }
  }, [isInfoOpen, activeLevelId, markNumberIntroAsViewed]);

  const currentLevelConfig =
    ALL_LEVELS_CONFIG.find((l) => l.id === activeLevelId) ||
    ALL_LEVELS_CONFIG[0];

  const pageTitle = t(currentLevelConfig.titleKey);

  const handleLevelClick = (levelId: string) => {
    setActiveLevelId(levelId);
    setLastNumberLevel(levelId);
    const hasViewedNewLevel = viewedNumberIntros.includes(levelId);
    setInfoOpen(!hasViewedNewLevel);
  };

  // 准备导航数据
  const navItems = ALL_LEVELS_CONFIG.map((level) => ({
    id: level.id,
    label: t(level.labelKey),
  }));

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
        <div
          className={styles.translatorEntryBtn}
          onClick={() => navigate('/study/numbers/translator')}
          aria-label="Number Translator"
        >
          <Calculator size={20} strokeWidth={2.5} />
        </div>
      </div>

      <div className={styles.levelNavWrapper}>
        <LevelNav
          items={navItems}
          activeId={activeLevelId}
          onSelect={handleLevelClick}
        />
      </div>

      <div className={styles.workspace}>
        {activeLevelId === 'lvl1' && <Level1 />}
        {activeLevelId === 'lvl2' && <Level2 />}
        {activeLevelId === 'lvl3' && <Level3 />}
        {activeLevelId === 'lvl4' && <Level4 />}
      </div>

      <BottomSheet
        isOpen={isInfoOpen}
        onClose={() => setInfoOpen(false)}
        title={pageTitle}
      >
        <div className={styles.infoSheetContent}>
          <currentLevelConfig.DescriptionContent />
        </div>
      </BottomSheet>
    </div>
  );
};
