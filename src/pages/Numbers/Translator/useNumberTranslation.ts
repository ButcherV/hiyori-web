// src/pages/Numbers/Translator/useNumberTranslation.ts

import { useCallback } from 'react';
import {
  type TranslationResult,
  type NumberBlock,
  type PhonePart,
} from './TranslatorTypes';

// --- 基础字典 ---
const DIGITS = [
  '',
  'ichi',
  'ni',
  'san',
  'yon',
  'go',
  'roku',
  'nana',
  'hachi',
  'kyuu',
];
const DIGITS_KANA = [
  '',
  'いち',
  'に',
  'さん',
  'よん',
  'ご',
  'ろく',
  'なな',
  'はち',
  'きゅう',
];
const DIGITS_KANJI = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];

// --- 辅助函数：处理 0-9999 的逻辑 ---
const getSmallNumberReading = (num: number) => {
  if (num === 0) return { kanji: '', kana: '', romajiParts: [] as PhonePart[] };

  let kanji = '';
  let kana = '';
  let romajiParts: PhonePart[] = [];

  // 千位 (1000-9000)
  const th = Math.floor(num / 1000);
  if (th > 0) {
    if (th === 1) {
      // 1000 读 Sen (除非在 1000万 这种特殊大单位前，那个在外部处理，这里只处理标准 sen)
      kanji += '千';
      kana += 'せん';
      romajiParts.push({ text: 'sen' });
    } else if (th === 3) {
      kanji += '三千';
      kana += 'さんぜん';
      romajiParts.push({ text: 'san' }, { text: 'zen', isMutation: true });
    } else if (th === 8) {
      kanji += '八千';
      kana += 'はっせん';
      romajiParts.push(
        { text: 'has', isMutation: true },
        { text: 'sen', isMutation: true }
      );
    } else {
      kanji += DIGITS_KANJI[th] + '千';
      kana += DIGITS_KANA[th] + 'せん';
      romajiParts.push({ text: DIGITS[th] }, { text: '-sen' });
    }
  }

  // 百位 (100-900)
  const hu = Math.floor((num % 1000) / 100);
  if (hu > 0) {
    if (hu === 1) {
      kanji += '百';
      kana += 'ひゃく';
      romajiParts.push({ text: 'hyaku' });
    } else if (hu === 3) {
      kanji += '三百';
      kana += 'さんびゃく';
      romajiParts.push({ text: 'san' }, { text: 'byaku', isMutation: true });
    } else if (hu === 6) {
      kanji += '六百';
      kana += 'ろっぴゃく';
      romajiParts.push(
        { text: 'rop', isMutation: true },
        { text: 'pyaku', isMutation: true }
      );
    } else if (hu === 8) {
      kanji += '八百';
      kana += 'はっぴゃく';
      romajiParts.push(
        { text: 'hap', isMutation: true },
        { text: 'pyaku', isMutation: true }
      );
    } else {
      kanji += DIGITS_KANJI[hu] + '百';
      kana += DIGITS_KANA[hu] + 'ひゃく';
      romajiParts.push({ text: DIGITS[hu] }, { text: '-hyaku' });
    }
  }

  // 十位 (10-90)
  const te = Math.floor((num % 100) / 10);
  if (te > 0) {
    if (te === 1) {
      kanji += '十';
      kana += 'じゅう';
      romajiParts.push({ text: 'juu' });
    } else {
      kanji += DIGITS_KANJI[te] + '十';
      kana += DIGITS_KANA[te] + 'じゅう';
      romajiParts.push({ text: DIGITS[te] }, { text: '-juu' });
    }
  }

  // 个位 (1-9)
  const on = num % 10;
  if (on > 0) {
    kanji += DIGITS_KANJI[on];
    kana += DIGITS_KANA[on];
    romajiParts.push({ text: DIGITS[on] });
  }

  return { kanji, kana, romajiParts };
};

export const useNumberTranslation = () => {
  const translate = useCallback((numStr: string): TranslationResult | null => {
    // 1. 清理输入，转为数字
    const num = parseInt(numStr.replace(/,/g, ''), 10);
    if (isNaN(num)) return null;
    if (num === 0) {
      // 特殊处理 0
      return {
        originalNum: 0,
        blocks: [
          {
            value: 0,
            unit: '',
            unitReading: '',
            isZero: true,
            kanji: '零',
            kana: 'れい',
            romajiParts: [{ text: 'rei' }],
          },
        ],
      };
    }

    // 2. 拆分为 4 位一组 (低位在前，高位在后)
    // 12345678 -> [5678, 1234]
    const chunks: number[] = [];
    let temp = num;
    while (temp > 0) {
      chunks.push(temp % 10000);
      temp = Math.floor(temp / 10000);
    }

    const UNITS = ['', '万', '亿', '兆'];
    const UNITS_READING = ['', 'man', 'oku', 'chou'];

    const blocks: NumberBlock[] = [];

    // 3. 从高位开始处理 (chunks 反向遍历)
    for (let i = chunks.length - 1; i >= 0; i--) {
      const chunkVal = chunks[i];
      const unitIndex = i; // 0=无, 1=万, 2=亿

      // 如果这一节是 0，跳过 (例如 100000001 的中间两个0000)
      // 但如果是唯一的个位 (如 num=0 虽前面已处理)，需保留。此处只处理大数中的0块
      if (chunkVal === 0 && chunks.length > 1) continue;

      let { kanji, kana, romajiParts } = getSmallNumberReading(chunkVal);
      const isBlockZero = chunkVal === 0;

      // --- 处理单位间的特殊连接规则 (核心难点) ---

      // 规则 1: 10000 -> Ichi-man (万以上单位，1必须读出)
      // 规则 2: 1亿 -> Ichi-oku
      if (unitIndex >= 1 && chunkVal === 1) {
        // 如果 getSmallNumberReading 返回的是空(因为1000以内1通常省略)，这里强制补 "一"
        // 但注意 10001 (一万零一)，个位的1不补。这里只针对 chunkVal === 1 (也就是整 1万/1亿)
        kanji = '一';
        kana = 'いち';
        romajiParts = [{ text: 'ichi', isMutation: true, note: '必须读出' }];
      }

      // 规则 3: 千万/千亿 的 Issen 音便
      // 如果这一节是 1000 (千)，且后面跟了单位(万/亿)
      if (unitIndex >= 1 && chunkVal === 1000) {
        kanji = '一千'; // 习惯写一千，或者保持千
        kana = 'いっせん';
        romajiParts = [
          { text: 'is', isMutation: true },
          { text: 'sen', isMutation: true, note: '促音变' },
        ];
      }

      blocks.push({
        value: chunkVal,
        unit: UNITS[unitIndex],
        unitReading: UNITS_READING[unitIndex],
        kanji,
        kana,
        romajiParts,
        isZero: isBlockZero,
      });
    }

    return {
      originalNum: num,
      blocks: blocks,
    };
  }, []);

  return { translate };
};
