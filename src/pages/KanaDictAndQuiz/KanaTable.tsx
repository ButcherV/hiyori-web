// src/pages/KanaDictAndQuiz/KanaTable.tsx
import React, { useMemo } from 'react';
import { KANA_DB } from '../../datas/kanaData';
import styles from './KanaTable.module.css';

interface Props {
  activeScript: 'hiragana' | 'katakana';
  showRomaji: boolean;
  onItemClick?: (data: any) => void;
  rows: (string | null)[][];
  rowHeaders: string[];
  colHeaders: string[];
  hideColHeaders?: boolean;

  // 🔥 新增：选择模式相关的 Props
  isSelectionMode?: boolean;
  selectedIds?: Set<string>;
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

    // 🔥 2. 判断选中状态
    const isSelected = selectedIds?.has(id);

    // 🔥 3. 计算样式
    // 如果开启了选择模式：
    // - 选中的：用 selectedCell
    // - 没选中的：用 dimmedCell (让选中的更突出)，或者保持原样
    // 这里我们简单点：选中的高亮，没选中的保持默认
    const cellClass = `
      ${styles.cell} 
      ${isSelected ? styles.selectedCell : ''}
    `;

    return (
      <div key={id} className={cellClass} onClick={() => onItemClick?.(data)}>
        <div>
          <span className={`${styles.mainChar} jaFont`}>{data.kana}</span>
          {crossData && (
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
