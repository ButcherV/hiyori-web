import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, HelpCircle, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import styles from './PageDates.module.css';
import { ALL_DATE_LEVELS_CONFIG } from './Levels';
import { Level1 } from './Levels/Level1/Level1';
import BottomSheet from '../../components/BottomSheet';

// 引入通用导航组件
import { LevelNav } from '../../components/LevelNav/LevelNav';

// 如果未来需要持久化，从 Context 引入 useSettings
// import { useSettings } from '../../context/SettingsContext';

export const PageDates = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // 1. 状态管理
  // 如果有 Context，这里初始化 activeLevelId = lastDateLevel
  const [activeLevelId, setActiveLevelId] = useState(
    ALL_DATE_LEVELS_CONFIG[0].id
  );

  const [isInfoOpen, setInfoOpen] = useState(false);

  // 2. 获取当前关卡配置
  const currentLevelConfig =
    ALL_DATE_LEVELS_CONFIG.find((l) => l.id === activeLevelId) ||
    ALL_DATE_LEVELS_CONFIG[0];

  const pageTitle = t(currentLevelConfig.titleKey) || 'Dates Study';

  // 3. 处理点击
  const handleLevelClick = (levelId: string) => {
    setActiveLevelId(levelId);
    // setLastDateLevel(levelId); // 如果有持久化
    setInfoOpen(true); // 切换关卡时打开说明 (可选)
  };

  // 4. 准备导航数据 (LevelNav 需要的格式)
  const navItems = ALL_DATE_LEVELS_CONFIG.map((level) => ({
    id: level.id,
    label: t(level.labelKey) || level.id, // 增加 fallback 防止 key 没翻译时空白
  }));

  return (
    <div className={styles.container}>
      {/* Header */}
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

        {/* 日历速查工具入口 */}
        <div className={styles.iconBtn}>
          <Calendar size={20} color="white" />
        </div>
      </div>

      {/* Nav Pills (使用通用组件) */}
      <div className={styles.levelNavWrapper}>
        <LevelNav
          items={navItems}
          activeId={activeLevelId}
          onSelect={handleLevelClick}
        />
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
