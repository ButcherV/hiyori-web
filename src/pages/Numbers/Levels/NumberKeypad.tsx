import React, { useMemo } from 'react';
import styles from './NumberKeypad.module.css';
import { shuffle as shuffleList } from '../../../utils/generalTools';

export type KeypadDisplayMode =
  | 'arabic'
  | 'kanji'
  | 'kana'
  | 'romaji'
  | 'mixed';

// 自定义键（用于 Level 2/3/4 的片段键盘）
export interface CustomKey {
  value: string; // 实际值（用于拼接答案）
  label: string; // 显示文本
  type?: 'digit' | 'unit' | 'variant';
}

interface NumberKeypadProps {
  onKeyClick: (value: number | string) => void;
  activeNum?: number | null;
  shuffle?: boolean;
  displayMode?: KeypadDisplayMode;
  customNums?: number[];
  // 🟢 布局配置：splitIdx (在哪里折行), maxCols (这一关最宽的一排有几个按键)
  layout?: { splitIdx: number; maxCols: number };
  // 🟢 自定义键模式（用于 Level 2/3/4）
  customKeys?: CustomKey[];
}

const KEYPAD_DATA: Record<
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
  100: { kanji: '百', kana: 'ひゃく', romaji: 'Hyaku' },
  200: { kanji: '二百', kana: 'にひゃく', romaji: 'Nihyaku' },
  300: { kanji: '三百', kana: 'さんびゃく', romaji: 'Sanbyaku' },
  400: { kanji: '四百', kana: 'よんひゃく', romaji: 'Yonhyaku' },
  500: { kanji: '五百', kana: 'ごひゃく', romaji: 'Gohyaku' },
  600: { kanji: '六百', kana: 'ろっぴゃく', romaji: 'Roppyaku' },
  700: { kanji: '七百', kana: 'ななひゃく', romaji: 'Nanahyaku' },
  800: { kanji: '八百', kana: 'はっぴゃく', romaji: 'Happyaku' },
  900: { kanji: '九百', kana: 'きゅうひゃく', romaji: 'Kyuuhyaku' },
};

export const NumberKeypad: React.FC<NumberKeypadProps> = ({
  onKeyClick,
  activeNum,
  shuffle = false,
  displayMode = 'arabic',
  customNums,
  layout = { splitIdx: 5, maxCols: 6 }, // 默认适配 Level 1 (上5下6)
  customKeys,
}) => {
  const keys = useMemo(() => {
    // 如果传入了 customKeys，优先使用（Level 2/3/4 场景）
    if (customKeys) {
      let result = [...customKeys];
      if (shuffle) result = shuffleList(result);
      return result;
    }

    // 原有逻辑（Level 1 场景）
    let nums = customNums ?? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    if (shuffle) nums = shuffleList([...nums]);

    return nums.map((num) => {
      let label = num.toString();
      const item = KEYPAD_DATA[num];
      if (!item) return { value: num, label: num.toString() };

      switch (displayMode) {
        case 'kanji':
          label = item.kanji;
          break;
        case 'kana':
          label = item.kana;
          break;
        case 'romaji':
          label = item.romaji;
          break;
        case 'mixed':
          label = Math.random() > 0.65 ? item.kanji : item.kana;
          break;
        default:
          label = num.toString();
          break;
      }
      return { value: num, label };
    });
  }, [shuffle, displayMode, customNums, customKeys]);

  // 🟢 核心逻辑：根据内容长度计算字号样式类
  const getKeySizeClass = (label: string) => {
    const len = label.length;
    // 简单判断是否为纯数字（因为数字字体本身比日文窄，所以容忍度更高）
    const isNumber = /^\d+$/.test(label);

    if (isNumber) {
      if (len >= 4) return styles.textSmall; // 1000, 2000 -> 15px (数字较窄，Small即可)
      if (len >= 3) return styles.textMedium; // 100 -> 19px
      return styles.textLarge; // 1, 10 -> 24px
    }

    // 针对日文/文字 (假名比较宽，需要更早变小)
    if (len >= 4) return styles.textTiny; // 极长假名 (如 ろっぴゃく 5字符) -> 12px
    if (len >= 3) return styles.textSmall; // ひゃく, きゅう -> 15px
    if (len >= 2) return styles.textMedium; // いち, さん -> 19px
    return styles.textLarge; // 一, 二 -> 24px
  };

  const row1 = keys.slice(0, layout.splitIdx);
  const row2 = keys.slice(layout.splitIdx);

  // 渲染单个按键的辅助函数
  const renderKey = (
    key: { value: number | string; label: string },
    idx: number
  ) => (
    <div
      key={`k-${key.value}-${idx}`}
      role="button"
      className={`
        ${styles.keyBtn} 
        ${activeNum === key.value ? styles.keyBtnActive : ''} 
        ${customKeys || displayMode !== 'arabic' ? 'jaFont' : ''}
        ${getKeySizeClass(key.label)} /* 🟢 应用动态字号 */
      `}
      onClick={() => onKeyClick(key.value)}
    >
      {key.label}
    </div>
  );

  return (
    <div
      className={styles.keyboardArea}
      // 注入当前关卡的列数基准
      style={{ '--max-cols': layout.maxCols } as React.CSSProperties}
    >
      <div className={styles.keyRow}>
        {row1.map((key, idx) => renderKey(key, idx))}
      </div>
      <div className={styles.keyRow}>
        {row2.map((key, idx) => renderKey(key, idx))}
      </div>
    </div>
  );
};
