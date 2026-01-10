// src/pages/KanaDictionary/KanaTable.tsx
import React, { useMemo } from 'react';
import { KANA_DB } from '../../datas/kanaData'; // 保持你的路径
import styles from './KanaTable.module.css';

interface Props {
  activeScript: 'hiragana' | 'katakana';
  showRomaji: boolean;
  onItemClick?: (data: any) => void;
  rows: (string | null)[][];
  rowHeaders: string[];
  colHeaders: string[];
  hideColHeaders?: boolean;
}

export const KanaTable: React.FC<Props> = ({
  activeScript,
  showRomaji,
  onItemClick,
  rows,
  rowHeaders,
  colHeaders,
  hideColHeaders = false,
}) => {
  // ... (idMap 和 renderCell 逻辑完全不变，省略以节省篇幅) ...
  // ... (请保留原有的 useMemo 和 renderCell 代码) ...
  // 这里只展示 return 部分的修改：

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
    // ... 保持你之前的 renderCell 代码不变 ...
    // 只需要确认一点：renderCell 里的逻辑不用动
    // 哪怕是 'kya'，逻辑也是一样的

    // 为了完整性，这里简写一下，你直接用你原来的即可
    if (!romajiKey) return <div className={styles.emptyCell} />;
    const prefix = activeScript === 'hiragana' ? 'h-' : 'k-';
    let id = `${prefix}${romajiKey}`;
    let data = idMap[id];
    if (!data) {
      id = `${prefix}yoon-${romajiKey}`;
      data = idMap[id];
    }
    if (!data) return <div className={styles.emptyCell} />;

    const crossPrefix = activeScript === 'hiragana' ? 'k-' : 'h-';
    let crossId = `${crossPrefix}${romajiKey}`;
    let crossData = idMap[crossId];
    if (!crossData) {
      crossId = `${crossPrefix}yoon-${romajiKey}`;
      crossData = idMap[crossId];
    }

    return (
      <div key={id} className={styles.cell} onClick={() => onItemClick?.(data)}>
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

  // 🔥 核心修改：判断列数，决定使用哪个 CSS 类
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
