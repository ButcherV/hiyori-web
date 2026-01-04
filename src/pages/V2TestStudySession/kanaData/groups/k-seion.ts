// src/pages/TestStudySession/kana-data/groups/k-seion.ts

import { defineKSeion, type AnyKanaData } from '../core';

export const KATAKANA_SEION: Record<string, AnyKanaData> = {
  // --- A 行 (片假名) ---
  ア: defineKSeion({
    id: 'k-a',
    kana: 'ア', // 片假名
    romaji: 'a',

    word: 'アイス', // 片假名单词
    wordKana: 'あいす', // 片假名单词的发音的平假名形式
    wordRomaji: 'a·i·su',
    wordMeaning: { en: 'ice cream', zh: '冰淇淋', zhHant: '冰淇淋' },
    wordEmoji: '🍦',
    kanaKanjiOrigin: '阿',
    kanaDistractors: ['イ', 'マ', 'ヤ'],
    romajiDistractors: ['i', 'ma', 'ya'],
    wordDistractors: ['アンク', 'イソク', 'オンク'], // word 的形似
  }),

  イ: defineKSeion({
    id: 'k-i',
    kana: 'イ',
    romaji: 'i',

    word: 'インク',
    wordKana: 'いんく',
    wordRomaji: 'i·n·ku',
    wordMeaning: { en: 'ink', zh: '墨水', zhHant: '墨水' },
    wordEmoji: '🖋️',
    kanaKanjiOrigin: '伊',
    kanaDistractors: ['ア', 'ト', 'リ'],
    romajiDistractors: ['a', 'to', 'li'],
    wordDistractors: ['アンク', 'イソク', 'オンク'],
  }),
};
