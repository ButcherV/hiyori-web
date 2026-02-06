import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, HelpCircle, Calendar } from 'lucide-react'; // 换了个 Calendar 图标
import { useTranslation } from 'react-i18next';

import styles from './PageDates.module.css';
import { ALL_DATE_LEVELS_CONFIG } from './Levels';
import { Level1 } from './Levels/Level1/Level1';
import BottomSheet from '../../components/BottomSheet';

// 注意：如果你想持久化“上次学到的位置”，需要在 SettingsContext 里加对应的逻辑
// 这里为了演示，暂时使用本地 state
// import { useSettings } from '../../context/SettingsContext';

export const PageDates = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const navRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Map<string, HTMLButtonElement>>(new Map());

  // 如果有 Context，这里应该从 Context 获取 lastDateLevel
  const [activeLevelId, setActiveLevelId] = useState(
    ALL_DATE_LEVELS_CONFIG[0].id
  );

  // 控制 BottomSheet
  const [isInfoOpen, setInfoOpen] = useState(false);

  // 1. 自动滚动居中逻辑 (和 PageNumbers 一模一样)
  const scrollToCenter = (levelId: string) => {
    const container = navRef.current;
    const item = itemsRef.current.get(levelId);

    if (container && item) {
      const targetLeft =
        item.offsetLeft + item.offsetWidth / 2 - container.offsetWidth / 2;

      container.scrollTo({
        left: targetLeft,
        behavior: 'smooth',
      });
    }
  };

  // 2. 监听 activeLevelId 变化，触发滚动
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToCenter(activeLevelId);
    }, 100);
    return () => clearTimeout(timer);
  }, [activeLevelId]);

  // 3. 获取当前配置
  const currentLevelConfig =
    ALL_DATE_LEVELS_CONFIG.find((l) => l.id === activeLevelId) ||
    ALL_DATE_LEVELS_CONFIG[0];

  // 这里为了容错，如果 i18n key 没取到，暂时显示 fallback
  const pageTitle = t(currentLevelConfig.titleKey) || 'Dates Study';

  const handleLevelClick = (levelId: string) => {
    setActiveLevelId(levelId);
    // 这里可以添加逻辑：setLastDateLevel(levelId);
    // 这里可以添加逻辑：如果是个新关卡，自动打开 info sheet
    setInfoOpen(true);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.systemHeader}>
        <div className={styles.headerLeft}>
          <button className={styles.iconBtn} onClick={() => navigate('/')}>
            <ChevronLeft size={24} color="white" />
          </button>
          <div className={styles.titleWrapper}>
            <span className={styles.headerTitle}>{pageTitle}</span>
            <button
              onClick={() => setInfoOpen(true)}
              className={styles.iconBtn}
              style={{ color: 'white' }}
            >
              <HelpCircle size={20} />
            </button>
          </div>
        </div>

        {/* 这里预留一个入口，比如日历速查工具 */}
        <div className={styles.iconBtn}>
          <Calendar size={20} color="white" />
        </div>
      </div>

      {/* Nav Pills */}
      <div className={styles.levelNavWrapper}>
        <div className={styles.levelNav} ref={navRef}>
          {ALL_DATE_LEVELS_CONFIG.map((level) => {
            const isActive = activeLevelId === level.id;
            const pillClass = `${styles.levelPill} ${
              isActive ? styles.levelPillActive : styles.levelPillDefault
            }`;

            return (
              <button
                key={level.id}
                ref={(el) => {
                  if (el) itemsRef.current.set(level.id, el);
                  else itemsRef.current.delete(level.id);
                }}
                className={pillClass}
                onClick={() => handleLevelClick(level.id)}
              >
                {t(level.labelKey) || level.id} {/* Fallback显示ID */}
              </button>
            );
          })}
        </div>
      </div>

      {/* Workspace Area */}
      <div className={styles.workspace}>
        {activeLevelId === 'lvl1_days' && <Level1 />}

        {/* 以后加了 Level 2, 3 在这里扩展 */}
        {activeLevelId === 'lvl2_months' && (
          <div style={{ padding: 20, textAlign: 'center', color: '#ccc' }}>
            Level 2 Coming Soon
          </div>
        )}
        {activeLevelId === 'lvl3_weeks' && (
          <div style={{ padding: 20, textAlign: 'center', color: '#ccc' }}>
            Level 3 Coming Soon
          </div>
        )}
      </div>

      {/* Info Sheet */}
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
