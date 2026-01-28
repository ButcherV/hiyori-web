import React, { useMemo } from 'react';
import styles from './NumberKeypad.module.css';
import { shuffle as shuffleList } from '../../../utils/generalTools';

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
  customNums?: number[];
  // 🟢 布局配置：splitIdx (在哪里折行), maxCols (这一关最宽的一排有几个按键)
  layout?: { splitIdx: number; maxCols: number };
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
}) => {
  const keys = useMemo(() => {
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
  }, [shuffle, displayMode, customNums]);

  const row1 = keys.slice(0, layout.splitIdx);
  const row2 = keys.slice(layout.splitIdx);

  return (
    <div
      className={styles.keyboardArea}
      // 🟢 注入当前关卡的列数基准
      style={{ '--max-cols': layout.maxCols } as React.CSSProperties}
    >
      <div className={styles.keyRow}>
        {row1.map((key) => (
          <div
            key={`k-${key.value}`}
            role="button"
            className={`${styles.keyBtn} ${activeNum === key.value ? styles.keyBtnActive : ''} ${displayMode !== 'arabic' ? `jaFont ${styles.fontJa}` : ''}`}
            onClick={() => onKeyClick(key.value)}
          >
            {key.label}
          </div>
        ))}
      </div>
      <div className={styles.keyRow}>
        {row2.map((key) => (
          <div
            key={`k-${key.value}`}
            role="button"
            className={`${styles.keyBtn} ${activeNum === key.value ? styles.keyBtnActive : ''} ${displayMode !== 'arabic' ? `jaFont ${styles.fontJa}` : ''}`}
            onClick={() => onKeyClick(key.value)}
          >
            {key.label}
          </div>
        ))}
      </div>
    </div>
  );
};
