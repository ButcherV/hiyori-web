// src/pages/KanaDictionary/KanaBoard.tsx
import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { KanaTable } from './KanaTable';
import { Switch } from '../../components/Switch';
import { CategoryTabs } from '../../components/CategoryTabs';
// 👇 必须引入 YOON_COL_HEADERS
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
  // 状态
  activeTab: 'hiragana' | 'katakana';
  showRomaji: boolean;
  tabOptions: { id: string; label: string }[];

  // 文案
  title: string;
  romajiLabel: string;
  seionTitle: string;
  dakuonTitle: string;
  yoonTitle: string;

  // 事件
  onBackClick: () => void;
  onTabChange: (id: 'hiragana' | 'katakana') => void;
  onToggleRomaji: () => void;
  onItemClick: (data: any) => void;
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
}) => {
  return (
    <div className={styles.container}>
      {/* 顶部固定 Header */}
      <div className={styles.stickyHeader}>
        <div className={styles.stickyHeaderCol}>
          <div className={styles.headerLeft}>
            <button className={styles.backBtn} onClick={onBackClick}>
              <ChevronLeft size={24} strokeWidth={2.5} />
            </button>
            <span className={styles.pageTitle}>{title}</span>
          </div>

          <div className={styles.headerRight}>
            <span className={styles.romajiLabel}>{romajiLabel}</span>
            <Switch checked={showRomaji} onChange={onToggleRomaji} />
          </div>
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
            />
          </section>

          {/* 3. 拗音 (注意这里！) */}
          <section>
            <h2 className={styles.sectionHeader}>{yoonTitle}</h2>
            <KanaTable
              activeScript={activeTab}
              showRomaji={showRomaji}
              onItemClick={onItemClick}
              rows={YOON_ROWS}
              rowHeaders={YOON_ROW_HEADERS}
              // 🔥 修正点：这里必须用 YOON_COL_HEADERS (3列)，才会触发 KanaTable 内部的 3列样式
              colHeaders={YOON_COL_HEADERS}
            />
          </section>
        </div>
      </div>
    </div>
  );
};
