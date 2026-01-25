import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, HelpCircle, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import styles from './PageNumbers.module.css';
import { Level1 } from './Levels/Level1/Level1';
import { ALL_LEVELS_CONFIG } from './Levels';
import BottomSheet from '../../components/BottomSheet';
import { Toast } from '../../components/Toast/Toast';

export const PageNumbers = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // 全局状态：在哪个关卡
  const [activeLevelId, setActiveLevelId] = useState('lvl1');
  const [isInfoOpen, setInfoOpen] = useState(false);

  const [toastState, setToastState] = useState({
    isVisible: false,
    message: '',
    description: '',
  });

  const showToast = (message: string, description: string = '') => {
    setToastState({ isVisible: true, message, description });
    setTimeout(() => {
      setToastState((prev) => ({ ...prev, isVisible: false }));
    }, 2000);
  };

  // 获取当前关卡配置
  const currentLevelConfig =
    ALL_LEVELS_CONFIG.find((l) => l.id === activeLevelId) ||
    ALL_LEVELS_CONFIG[0];

  // 动态 Title
  const pageTitle = t(currentLevelConfig.titleKey);

  const handleLevelClick = (levelId: string) => {
    const isLocked = levelId !== 'lvl1';

    if (isLocked) {
      showToast(
        t('number_study.common.level_locked_title'),
        t('number_study.common.level_locked_desc')
      );
      return;
    }

    setActiveLevelId(levelId);
    // 切换关卡时，是否自动弹出说明书？
    // setInfoOpen(true);
  };

  return (
    <div className={styles.container}>
      <Toast
        isVisible={toastState.isVisible}
        message={toastState.message}
        description={toastState.description}
      />

      {/* Layer 1: Header */}
      <div className={styles.systemHeader}>
        <div className={styles.headerLeft}>
          <button className={styles.iconBtn} onClick={() => navigate('/')}>
            <ChevronLeft size={24} color="var(--color-Blue)" />
          </button>
          <div className={styles.titleWrapper}>
            <span className={styles.headerTitle}>{pageTitle}</span>
            <button
              onClick={() => setInfoOpen(true)}
              className={styles.iconBtn}
              style={{ color: 'var(--color-Gray6)' }}
            >
              <HelpCircle size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Layer 2: Nav Pills */}
      <div className={styles.levelNavWrapper}>
        <div className={styles.levelNav}>
          {ALL_LEVELS_CONFIG.map((level) => {
            const isActive = activeLevelId === level.id;
            const isLocked = level.id !== 'lvl1';

            let pillClass = styles.levelPill;
            if (isLocked) {
              pillClass += ` ${styles.levelPillLocked}`;
            } else if (isActive) {
              pillClass += ` ${styles.levelPillActive}`;
            } else {
              pillClass += ` ${styles.levelPillUnlocked}`;
            }

            return (
              <button
                key={level.id}
                className={pillClass}
                onClick={() => handleLevelClick(level.id)}
              >
                {isLocked && <Lock className={styles.lockIcon} />}
                {t(level.labelKey)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Layer 4: Workspace */}
      <div className={styles.workspace}>
        {activeLevelId === 'lvl1' && <Level1 />}

        {/* {activeLevelId === 'lvl2' && (
          <div className={styles.placeholder}>
            <h2>{t('number_study.numbers.levels.lvl2.title')}</h2>
            <p>{t('number_study.numbers.test_only_hint')}</p>
          </div>
        )} */}
      </div>

      <BottomSheet
        isOpen={isInfoOpen}
        onClose={() => setInfoOpen(false)}
        title={pageTitle}
      >
        <div className={styles.infoSheetContent}>
          {/* 渲染当前关卡的说明书组件 */}
          <currentLevelConfig.DescriptionContent />

          {/* <button
            className={styles.sheetActionBtn}
            onClick={() => setInfoOpen(false)}
          >
            {t('number_study.common.understand')}
          </button> */}
        </div>
      </BottomSheet>
    </div>
  );
};
