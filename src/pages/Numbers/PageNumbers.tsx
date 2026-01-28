import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import styles from './PageNumbers.module.css';
import { Level1 } from './Levels/Level1/Level1';
import { Level3 } from './Levels/Level3/Level3';
import { ALL_LEVELS_CONFIG } from './Levels';
import BottomSheet from '../../components/BottomSheet';
import { useSettings } from '../../context/SettingsContext';

export const PageNumbers = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const navRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Map<string, HTMLButtonElement>>(new Map());

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

  // 计算并执行“尽力居中”滚动
  const scrollToCenter = (levelId: string) => {
    const container = navRef.current;
    const item = itemsRef.current.get(levelId);

    if (container && item) {
      // 计算公式：(元素左偏移 + 元素一半宽) - (容器一半宽)
      // 浏览器会自动处理边界：如果是首尾项，计算结果超出范围，会自动停在尽头
      const targetLeft =
        item.offsetLeft + item.offsetWidth / 2 - container.offsetWidth / 2;

      container.scrollTo({
        left: targetLeft,
        behavior: 'smooth', // 平滑滚动
      });
    }
  };

  // 监听 activeLevelId：只要切换关卡（包括初始化），就自动居中
  useEffect(() => {
    // 稍微延迟确保 DOM 已经渲染完毕
    const timer = setTimeout(() => {
      scrollToCenter(activeLevelId);
    }, 100);
    return () => clearTimeout(timer);
  }, [activeLevelId]);

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

  return (
    <div className={styles.container}>
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

      <div className={styles.levelNavWrapper}>
        {/* 绑定 navRef 容器 */}
        <div className={styles.levelNav} ref={navRef}>
          {ALL_LEVELS_CONFIG.map((level) => {
            const isActive = activeLevelId === level.id;

            const pillClass = `${styles.levelPill} ${
              isActive ? styles.levelPillActive : styles.levelPillDefault
            }`;

            return (
              <button
                key={level.id}
                // 将每个 Pill 的 DOM 存入 Map
                ref={(el) => {
                  if (el) itemsRef.current.set(level.id, el);
                  else itemsRef.current.delete(level.id);
                }}
                className={pillClass}
                onClick={() => handleLevelClick(level.id)}
              >
                {t(level.labelKey)}
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.workspace}>
        {activeLevelId === 'lvl1' && <Level1 />}

        {activeLevelId === 'lvl3' && <Level3 />}

        {/* {(activeLevelId !== 'lvl1' || 'lvl3') && (
          <div
            className={styles.placeholder}
            style={{ padding: 20, textAlign: 'center', color: '#999' }}
          >
            <h2>{t('number_study.common.coming_soon')}</h2>
            <p>{pageTitle}</p>
          </div>
        )} */}
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
