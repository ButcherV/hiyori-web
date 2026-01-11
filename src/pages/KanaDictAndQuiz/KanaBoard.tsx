import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { KanaTable } from './KanaTable';
import { Switch } from '../../components/Switch';
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

interface KanaBoardProps {
  // --- 状态 ---
  activeTab: 'hiragana' | 'katakana';
  showRomaji: boolean; // 用于控制表格内显示
  tabOptions: { id: string; label: string }[];

  title: string;
  romajiLabel?: string; // 变为可选，因为可能被 headerRight 覆盖
  seionTitle: string;
  dakuonTitle: string;
  yoonTitle: string;

  // --- 事件 ---
  onBackClick: () => void;
  onTabChange: (id: 'hiragana' | 'katakana') => void;
  onToggleRomaji?: () => void; // 变为可选
  onItemClick: (data: any) => void;

  // --- 透传给 KanaTable 的选择属性 ---
  isSelectionMode?: boolean;
  selectedIds?: Set<string>;

  // --- 插槽 (Slots) ---
  headerRight?: React.ReactNode; // 自定义右上角区域
  footer?: React.ReactNode; // 自定义底部区域
}

export const KanaBoard: React.FC<KanaBoardProps> = ({
  activeTab,
  showRomaji,
  tabOptions,
  title,
  romajiLabel,
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
}) => {
  return (
    <div
      className={`${styles.container} ${isSelectionMode ? styles.selectionModeContainer : ''}`}
    >
      {/* 顶部固定 Header */}
      <div className={styles.stickyHeader}>
        <div className={styles.stickyHeaderCol}>
          <div className={styles.headerLeft}>
            <button className={styles.backBtn} onClick={onBackClick}>
              <ChevronLeft size={24} strokeWidth={2.5} />
            </button>
            <span className={styles.pageTitle}>{title}</span>
          </div>

          {/* 如果有 headerRight 插槽，就渲染插槽；否则渲染默认的 Switch */}
          {headerRight ? (
            <div className={styles.headerRight}>{headerRight}</div>
          ) : (
            <div className={styles.headerRight}>
              <span className={styles.romajiLabel}>{romajiLabel}</span>
              {onToggleRomaji && (
                <Switch checked={showRomaji} onChange={onToggleRomaji} />
              )}
            </div>
          )}
        </div>
        <div className={styles.stickyHeaderCol2}>
          <div className={styles.tabWrapper}>
            <CategoryTabs
              options={tabOptions}
              activeId={activeTab}
              onChange={(id) => onTabChange(id as 'hiragana' | 'katakana')}
            />
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className={styles.content}>
        <div className={styles.sectionsWrapper}>
          {/* 1. 清音 */}
          <section>
            <h2 className={styles.sectionHeader}>{seionTitle}</h2>
            <KanaTable
              activeScript={activeTab}
              showRomaji={showRomaji}
              onItemClick={onItemClick}
              rows={SEION_ROWS}
              rowHeaders={SEION_ROW_HEADERS}
              colHeaders={SEION_COL_HEADERS}
              isSelectionMode={isSelectionMode} // 透传选择状态
              selectedIds={selectedIds}
            />
          </section>

          {/* 2. 浊音 */}
          <section>
            <h2 className={styles.sectionHeader}>{dakuonTitle}</h2>
            <KanaTable
              activeScript={activeTab}
              showRomaji={showRomaji}
              onItemClick={onItemClick}
              rows={DAKUON_ROWS}
              rowHeaders={DAKUON_ROW_HEADERS}
              colHeaders={SEION_COL_HEADERS}
              isSelectionMode={isSelectionMode} // 透传选择状态
              selectedIds={selectedIds}
            />
          </section>

          {/* 3. 拗音 */}
          <section>
            <h2 className={styles.sectionHeader}>{yoonTitle}</h2>
            <KanaTable
              activeScript={activeTab}
              showRomaji={showRomaji}
              onItemClick={onItemClick}
              rows={YOON_ROWS}
              rowHeaders={YOON_ROW_HEADERS}
              colHeaders={YOON_COL_HEADERS}
              isSelectionMode={isSelectionMode} // 透传选择状态
              selectedIds={selectedIds}
            />
          </section>
        </div>
      </div>

      {/* 渲染底部插槽 (Footer) */}
      {footer}
    </div>
  );
};
