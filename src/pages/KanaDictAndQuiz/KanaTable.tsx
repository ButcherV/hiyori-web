import React, { useMemo } from 'react';
import { KANA_DB } from '../../datas/kanaData';
import styles from './KanaTable.module.css';
import { type ProficiencyStatus } from './PageKanaQuiz/quizLogic';

interface Props {
  activeScript: 'hiragana' | 'katakana';
  showRomaji: boolean;
  onItemClick?: (data: any) => void;
  rows: (string | null)[][];
  rowHeaders: string[];
  colHeaders: string[];
  hideColHeaders?: boolean;
  isSelectionMode?: boolean;
  selectedIds?: Set<string>;
  proficiencyMap?: Record<string, ProficiencyStatus>;
  disabledIds?: Set<string>;
  onDisabledItemClick?: () => void;
}

export const KanaTable: React.FC<Props> = ({
  activeScript,
  showRomaji,
  onItemClick,
  rows,
  rowHeaders,
  colHeaders,
  hideColHeaders = false,
  isSelectionMode = false,
  selectedIds,
  proficiencyMap,
  disabledIds,
  onDisabledItemClick,
}) => {
  const idMap = useMemo(() => {
    const map: Record<string, any> = {};
    Object.values(KANA_DB).forEach((item) => {
      if (item && item.id) {
        map[item.id] = item;
      }
    });
    return map;
  }, []);

  const renderCell = (romajiKey: string | null) => {
    if (!romajiKey) return <div className={styles.emptyCell} />;

    // 1. 计算 ID
    const prefix = activeScript === 'hiragana' ? 'h-' : 'k-';
    let id = `${prefix}${romajiKey}`;
    let data = idMap[id];

    // 降级查找拗音
    if (!data) {
      id = `${prefix}yoon-${romajiKey}`;
      data = idMap[id];
    }
    if (!data) return <div className={styles.emptyCell} />;

    // 查找对映字符 (平/片)
    const crossPrefix = activeScript === 'hiragana' ? 'k-' : 'h-';
    let crossId = `${crossPrefix}${romajiKey}`;
    if (!idMap[crossId]) crossId = `${crossPrefix}yoon-${romajiKey}`;
    const crossData = idMap[crossId];

    // 获取状态并计算样式
    const status: ProficiencyStatus = proficiencyMap?.[id] || 'new';
    const isSelected = isSelectionMode && selectedIds?.has(id);

    // 判断当前 ID 是否在禁用名单里
    const isDisabled = disabledIds?.has(id);

    let statusClass = '';
    // 逻辑优化：
    // A. 如果是 Perfect (皇冠/流光)：
    //    必须要常驻。无论是否选中，都加上类名。
    //    原因：防止移除类名导致动画时间轴重置 (Desync)。
    if (status === 'perfect') {
      statusClass = styles.cellPerfect;
    }
    // B. 如果是 Weak / Mastered (普通颜色)：
    //    互斥逻辑。只有在【未选中】时才加类名。
    //    原因：选中就是蓝色，不需要底下的红/绿色干扰。
    else if (!isSelected) {
      if (status === 'weak') statusClass = styles.cellWeak;
      if (status === 'mastered') statusClass = styles.cellMastered;
    }

    const cellClass = `
      ${styles.cell} 
      ${statusClass}
      ${isSelected ? styles.selectedCell : ''}
      ${isDisabled ? styles.disabledCell : ''}
    `;

    return (
      <div
        key={id}
        className={cellClass}
        onClick={() => {
          // 拦截点击逻辑
          if (isDisabled) {
            onDisabledItemClick?.(); // 如果被禁用了，触发回调（目前为空，先占位）
            return;
          }
          onItemClick?.(data);
        }}
      >
        <div>
          <span className={`${styles.mainChar} jaFont`}>{data.kana}</span>
          {/* 只有在【非选择模式】(即字典模式) 下，才显示对照用的副标题字符 */}
          {crossData && !isSelectionMode && (
            <span className={`${styles.subChar} jaFont`}>{crossData.kana}</span>
          )}
        </div>

        {showRomaji && <div className={styles.romaji}>{data.romaji}</div>}
      </div>
    );
  };

  const is3Col = colHeaders.length === 3;
  const headerClass = is3Col ? styles.headerRow3Col : styles.headerRow;
  const rowClass = is3Col ? styles.row3Col : styles.row;

  return (
    <div className={styles.container}>
      {!hideColHeaders && (
        <div className={headerClass}>
          <div />
          {colHeaders.map((h, index) => (
            <div key={index} className={styles.colHeader}>
              {h}
            </div>
          ))}
        </div>
      )}

      <div className={styles.tableBody}>
        {rows.map((rowItems, rowIndex) => (
          <div key={rowIndex} className={rowClass}>
            <div className={styles.rowHeader}>{rowHeaders[rowIndex]}</div>
            {rowItems.map((romajiKey, colIndex) => (
              <React.Fragment key={colIndex}>
                {renderCell(romajiKey)}
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
