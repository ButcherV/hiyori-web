import type { NumberDataItem } from './types';
import { LEVEL_1_DATA } from '../Level1/Level1Data';
import { LEVEL_3_DATA as SOURCE_LEVEL_3_DATA } from '../Level3/Level3Data';
import { LEVEL_4_DATA } from '../Level4/Level4Data';

// 适配 Level 1 数据 (0-10)
export function adaptLevel1Data(): Record<number, NumberDataItem> {
  const adapted: Record<number, NumberDataItem> = {};

  Object.entries(LEVEL_1_DATA).forEach(([numStr, item]) => {
    const num = parseInt(numStr, 10);
    const mainReading = item.readings.find((r) => r.isMain) || item.readings[0];

    adapted[num] = {
      num,
      kanji: item.kanji,
      kana: mainReading.kana,
      romaji: mainReading.romaji,
      // Level 1 没有 parts 结构
    };
  });

  return adapted;
}

// 适配 Level 3 数据 (100-900)
export function adaptLevel3Data(): Record<number, NumberDataItem> {
  const adapted: Record<number, NumberDataItem> = {};

  Object.entries(SOURCE_LEVEL_3_DATA).forEach(([numStr, item]) => {
    const num = parseInt(numStr, 10);

    adapted[num] = {
      num,
      kanji: item.parts.kanji[0] + item.parts.kanji[1],
      kana: item.parts.kana[0] + item.parts.kana[1],
      romaji: item.romaji,
      parts: item.parts,
      mutation: item.mutation
        ? {
            multiplier: item.mutation.multiplier,
            unit: item.mutation.unit,
            kana:
              item.mutation.multiplier && item.mutation.unit
                ? item.mutation.multiplier + item.mutation.unit
                : item.mutation.unit
                  ? item.parts.kana[0] + item.mutation.unit
                  : item.mutation.multiplier + item.parts.kana[1],
            romaji: item.mutation.romaji,
          }
        : undefined,
      note: item.note,
    };
  });

  return adapted;
}

// 适配 Level 4 数据 (1000-9000)
export function adaptLevel4Data(): Record<number, NumberDataItem> {
  const adapted: Record<number, NumberDataItem> = {};

  Object.entries(LEVEL_4_DATA).forEach(([numStr, item]) => {
    const num = parseInt(numStr, 10);

    adapted[num] = {
      num,
      kanji: item.parts.kanji[0] + item.parts.kanji[1],
      kana: item.parts.kana[0] + item.parts.kana[1],
      romaji: item.romaji,
      parts: item.parts,
      mutation: item.mutation
        ? {
            multiplier: item.mutation.multiplier,
            unit: item.mutation.unit,
            kana:
              item.mutation.multiplier && item.mutation.unit
                ? item.mutation.multiplier + item.mutation.unit
                : item.mutation.unit
                  ? item.parts.kana[0] + item.mutation.unit
                  : item.mutation.multiplier + item.parts.kana[1],
            romaji: item.mutation.romaji,
          }
        : undefined,
      note: item.note,
    };
  });

  return adapted;
}

// 生成 Level 2 数据 (11-99)
export function generateLevel2Data(): Record<number, NumberDataItem> {
  const data: Record<number, NumberDataItem> = {};

  const kanaOnes = [
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
  const kanaTens = [
    '',
    'じゅう',
    'にじゅう',
    'さんじゅう',
    'よんじゅう',
    'ごじゅう',
    'ろくじゅう',
    'ななじゅう',
    'はちじゅう',
    'きゅうじゅう',
  ];
  const kanjiOnes = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const kanjiTens = [
    '',
    '十',
    '二十',
    '三十',
    '四十',
    '五十',
    '六十',
    '七十',
    '八十',
    '九十',
  ];

  for (let num = 11; num <= 99; num++) {
    const tens = Math.floor(num / 10);
    const ones = num % 10;

    data[num] = {
      num,
      kanji: kanjiTens[tens] + kanjiOnes[ones],
      kana: kanaTens[tens] + kanaOnes[ones],
      romaji: formatRomaji(tens, ones),
      parts: {
        kanji: [kanjiTens[tens], kanjiOnes[ones]],
        kana: [kanaTens[tens], kanaOnes[ones]],
      },
    };
  }

  return data;
}

// 格式化罗马音
function formatRomaji(tens: number, ones: number): string {
  const romajiTens = [
    '',
    'juu',
    'ni-juu',
    'sa-n-juu',
    'yo-n-juu',
    'go-juu',
    'ro-ku-juu',
    'na-na-juu',
    'ha-chi-juu',
    'kyu-u-juu',
  ];
  const romajiOnes = [
    '',
    'i-chi',
    'ni',
    'sa-n',
    'yo-n',
    'go',
    'ro-ku',
    'na-na',
    'ha-chi',
    'kyu-u',
  ];

  if (ones === 0) {
    return romajiTens[tens];
  }
  return `${romajiTens[tens]}-${romajiOnes[ones]}`;
}

// 生成 Level 3 数据 (100-999)
export function generateLevel3Data(): Record<number, NumberDataItem> {
  const data: Record<number, NumberDataItem> = {};

  // 基础数字假名
  const kanaDigits = [
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

  // 百位单位（含音便）
  const getHundreds = (digit: number): { kana: string; kanji: string } => {
    const kanjiHundreds = [
      '',
      '一百',
      '二百',
      '三百',
      '四百',
      '五百',
      '六百',
      '七百',
      '八百',
      '九百',
    ];

    switch (digit) {
      case 0:
        return { kana: '', kanji: '' };
      case 1:
        return { kana: 'ひゃく', kanji: '一百' }; // 100 省略 いち
      case 3:
        return { kana: 'さんびゃく', kanji: '三百' }; // 连浊
      case 6:
        return { kana: 'ろっぴゃく', kanji: '六百' }; // 促音+半浊
      case 8:
        return { kana: 'はっぴゃく', kanji: '八百' }; // 促音+半浊
      default:
        return {
          kana: `${kanaDigits[digit]}ひゃく`,
          kanji: kanjiHundreds[digit],
        };
    }
  };

  // 十位单位（含音便）
  const getTens = (digit: number): { kana: string; kanji: string } => {
    const kanjiTens = [
      '',
      '十',
      '二十',
      '三十',
      '四十',
      '五十',
      '六十',
      '七十',
      '八十',
      '九十',
    ];

    switch (digit) {
      case 0:
        return { kana: '', kanji: '' };
      default:
        return { kana: `${kanaDigits[digit]}じゅう`, kanji: kanjiTens[digit] };
    }
  };

  for (let num = 100; num <= 999; num++) {
    const hundreds = Math.floor(num / 100);
    const tens = Math.floor((num % 100) / 10);
    const ones = num % 10;

    const hundredsPart = getHundreds(hundreds);
    const tensPart = getTens(tens);
    const onesPart = ones === 0 ? '' : kanaDigits[ones];

    // 构建完整假名和汉字
    const kana = hundredsPart.kana + tensPart.kana + onesPart;
    const kanji = getKanjiForLevel3(hundreds, tens, ones);

    data[num] = {
      num,
      kanji,
      kana,
      romaji: '', // Level 3 暂时不需要罗马音
      parts: {
        kanji: [hundredsPart.kanji, tensPart.kanji + (onesPart ? '' : '')],
        kana: [hundredsPart.kana, tensPart.kana + onesPart],
      },
    };
  }

  return data;
}

// 辅助函数：生成 Level 3 的汉字
function getKanjiForLevel3(
  hundreds: number,
  tens: number,
  ones: number
): string {
  const kanjiDigits = [
    '',
    '一',
    '二',
    '三',
    '四',
    '五',
    '六',
    '七',
    '八',
    '九',
  ];
  let result = '';

  // 百位
  if (hundreds > 0) {
    result += kanjiDigits[hundreds] + '百';
  }

  // 十位
  if (tens > 0) {
    result += kanjiDigits[tens] + '十';
  }

  // 个位
  if (ones > 0) {
    result += kanjiDigits[ones];
  }

  return result;
}

// 预生成的数据
export const LEVEL_1_ADAPTED = adaptLevel1Data();
export const LEVEL_2_DATA = generateLevel2Data();
export const LEVEL_3_DATA = generateLevel3Data();
export const LEVEL_4_ADAPTED = adaptLevel4Data();
