import React, { useMemo } from 'react';
import styles from './NumberKeypad.module.css';
import { shuffle as shuffleList } from '../../../../utils/generalTools';

// --- 定义显示模式 ---
export type KeypadDisplayMode =
  | 'arabic'
  | 'kanji'
  | 'kana'
  | 'romaji'
  | 'mixed';

interface NumberKeypadProps {
  onKeyClick: (num: number) => void;
  activeNum?: number | null;
  shuffle?: boolean;
  displayMode?: KeypadDisplayMode;
}

// --- 静态数据源 ---
const NUM_DATA: Record<
  number,
  { kanji: string; kana: string; romaji: string }
> = {
  0: { kanji: '零', kana: 'ゼロ', romaji: 'Zero' },
  1: { kanji: '一', kana: 'いち', romaji: 'Ichi' },
  2: { kanji: '二', kana: 'に', romaji: 'Ni' },
  3: { kanji: '三', kana: 'さん', romaji: 'San' },
  4: { kanji: '四', kana: 'よん', romaji: 'Yon' },
  5: { kanji: '五', kana: 'ご', romaji: 'Go' },
  6: { kanji: '六', kana: 'ろく', romaji: 'Roku' },
  7: { kanji: '七', kana: 'なな', romaji: 'Nana' },
  8: { kanji: '八', kana: 'はち', romaji: 'Hachi' },
  9: { kanji: '九', kana: 'きゅう', romaji: 'Kyuu' },
  10: { kanji: '十', kana: 'じゅう', romaji: 'Juu' },
};

export const NumberKeypad: React.FC<NumberKeypadProps> = ({
  onKeyClick,
  activeNum,
  shuffle = false, // 默认不乱序
  displayMode = 'arabic',
}) => {
  const keys = useMemo(() => {
    // 1. 生成基础 0-10 数组
    let nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // 2. 如果开启乱序，调用全局工具函数
    if (shuffle) {
      nums = shuffleList(nums);
    }

    // 3. 映射显示内容
    return nums.map((num) => {
      let label = num.toString();

      switch (displayMode) {
        case 'kanji':
          label = NUM_DATA[num].kanji;
          break;
        case 'kana':
          label = NUM_DATA[num].kana;
          break;
        case 'romaji':
          label = NUM_DATA[num].romaji;
          break;
        case 'mixed':
          // 混合模式：50% 概率显示汉字，50% 概率显示假名
          label =
            Math.random() > 0.5 ? NUM_DATA[num].kanji : NUM_DATA[num].kana;
          break;
        case 'arabic':
        default:
          label = num.toString();
          break;
      }

      return {
        value: num, // 真实数值
        label: label, // 显示文本
      };
    });
  }, [shuffle, displayMode]); // 依赖项：只要这两个变了，就会重新计算（重新洗牌）

  // 4. 分割布局 (根据洗牌后的数组切分)
  const row1 = keys.slice(0, 5);
  const row2 = keys.slice(5, 11);

  return (
    <div className={styles.keyboardArea}>
      {/* 第一排 */}
      <div className={styles.keyRow}>
        {row1.map((key, index) => (
          <div
            key={`k-${key.value}`}
            role="button"
            className={`
              ${styles.keyBtn} 
              ${activeNum === key.value ? styles.keyBtnActive : ''}
              ${displayMode !== 'arabic' ? `jaFont ${styles.fontJa}` : ''}
              ${styles.shuffleAnim}
            `}
            style={{ animationDelay: `${index * 0.05}s` }}
            onClick={() => onKeyClick(key.value)}
          >
            {key.label}
          </div>
        ))}
      </div>

      {/* 第二排 */}
      <div className={styles.keyRow}>
        {row2.map((key, index) => (
          <div
            key={`k-${key.value}`}
            role="button"
            className={`
              ${styles.keyBtn} 
              ${activeNum === key.value ? styles.keyBtnActive : ''}
              ${displayMode !== 'arabic' ? `jaFont ${styles.fontJa}` : ''}
              ${styles.shuffleAnim}
            `}
            style={{ animationDelay: `${index * 0.05}s` }}
            onClick={() => onKeyClick(key.value)}
          >
            {key.label}
          </div>
        ))}
      </div>
    </div>
  );
};
