import React from 'react';
import { ChevronLeft, BookA } from 'lucide-react';
import { KanaTable } from './KanaTable';
// import { Switch } from '../../components/Switch';
import { CategoryTabs } from '../../components/CategoryTabs';
import {
  SEION_ROWS,
  SEION_ROW_HEADERS,
  SEION_COL_HEADERS,
  DAKUON_ROWS,
  DAKUON_ROW_HEADERS,
  YOON_ROWS,
  YOON_ROW_HEADERS,
  YOON_COL_HEADERS,
} from './constants';
import styles from './KanaBoard.module.css';
import { type ProficiencyStatus } from './PageKanaQuiz/quizLogic';

interface KanaBoardProps {
  // ... (Props 保持不变)
  activeTab: 'hiragana' | 'katakana';
  showRomaji: boolean;
  tabOptions: { id: string; label: string | React.ReactNode }[];
  title: string;
  // romajiLabel?: string;
  seionTitle: string;
  dakuonTitle: string;
  yoonTitle: string;
  onBackClick: () => void;
  onTabChange: (id: 'hiragana' | 'katakana') => void;
  onToggleRomaji?: () => void;
  onItemClick: (data: any) => void;
  isSelectionMode?: boolean;
  selectedIds?: Set<string>;
  headerRight?: React.ReactNode;
  footer?: React.ReactNode;
  proficiencyMap?: Record<string, ProficiencyStatus>;
  disabledIds?: Set<string>;
  onDisabledItemClick?: () => void;
}

export const KanaBoard: React.FC<KanaBoardProps> = ({
  activeTab,
  showRomaji,
  tabOptions,
  title,
  // romajiLabel,
  seionTitle,
  dakuonTitle,
  yoonTitle,
  onBackClick,
  onTabChange,
  onToggleRomaji,
  onItemClick,
  isSelectionMode,
  selectedIds,
  headerRight,
  footer,
  proficiencyMap,
  disabledIds,
  onDisabledItemClick,
}) => {
  return (
    <div
      className={`${styles.container} ${isSelectionMode ? styles.selectionModeContainer : ''}`}
    >
      {/* 1. 固定头部区域：包含导航栏 + Tabs */}
      <div className={styles.fixedHeaderArea}>
        {/* Row 1: 导航 */}
        <div className={styles.navRow}>
          <div className={styles.headerLeft}>
            <div className={styles.backBtn} onClick={onBackClick}>
              <ChevronLeft size={24} strokeWidth={2.5} />
            </div>
            <span className={styles.pageTitle}>{title}</span>
          </div>

          {headerRight ? (
            <div className={styles.headerRight}>{headerRight}</div>
          ) : (
            <div className={styles.headerRight}>
              {/* <span className={styles.romajiLabel}>{romajiLabel}</span>
              {onToggleRomaji && (
                <Switch checked={showRomaji} onChange={onToggleRomaji} />
              )} */}
              <div onClick={onToggleRomaji}>
                <BookA size={24} color="white" />
              </div>
            </div>
          )}
        </div>

        {/* Row 2: Tabs (现在也固定在顶部了，不随内容滚动) */}
        <div className={styles.tabRow}>
          <CategoryTabs
            options={tabOptions as any}
            activeId={activeTab}
            onChange={(id) => onTabChange(id as 'hiragana' | 'katakana')}
          />
        </div>
      </div>

      {/* 2. 滚动区域：包含 Sections */}
      <div className={styles.scrollArea}>
        <div className={styles.sectionsWrapper}>
          {/* Section 1: 清音 */}
          <section>
            <h2 className={styles.sectionHeader}>
              {/* {seionTitle} */}
              <span className="highlight-text">{seionTitle}</span>
            </h2>
            <KanaTable
              activeScript={activeTab}
              showRomaji={showRomaji}
              onItemClick={onItemClick}
              rows={SEION_ROWS}
              rowHeaders={SEION_ROW_HEADERS}
              colHeaders={SEION_COL_HEADERS}
              isSelectionMode={isSelectionMode}
              selectedIds={selectedIds}
              proficiencyMap={proficiencyMap}
              disabledIds={disabledIds}
              onDisabledItemClick={onDisabledItemClick}
            />
          </section>

          {/* Section 2: 浊音 */}
          <section>
            <h2 className={styles.sectionHeader}>
              <span className="highlight-text">{dakuonTitle}</span>
            </h2>
            <KanaTable
              activeScript={activeTab}
              showRomaji={showRomaji}
              onItemClick={onItemClick}
              rows={DAKUON_ROWS}
              rowHeaders={DAKUON_ROW_HEADERS}
              colHeaders={SEION_COL_HEADERS}
              isSelectionMode={isSelectionMode}
              selectedIds={selectedIds}
              proficiencyMap={proficiencyMap}
              disabledIds={disabledIds}
              onDisabledItemClick={onDisabledItemClick}
            />
          </section>

          {/* Section 3: 拗音 */}
          <section>
            <h2 className={styles.sectionHeader}>
              {/* {yoonTitle} */}
              <span className="highlight-text">{yoonTitle}</span>
            </h2>
            <KanaTable
              activeScript={activeTab}
              showRomaji={showRomaji}
              onItemClick={onItemClick}
              rows={YOON_ROWS}
              rowHeaders={YOON_ROW_HEADERS}
              colHeaders={YOON_COL_HEADERS}
              isSelectionMode={isSelectionMode}
              selectedIds={selectedIds}
              proficiencyMap={proficiencyMap}
              disabledIds={disabledIds}
              onDisabledItemClick={onDisabledItemClick}
            />
          </section>
        </div>
      </div>

      {/* 3. 悬浮 Footer (绝对定位/Fixed在底部) */}
      {footer}
    </div>
  );
};
