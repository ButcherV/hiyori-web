import { defineHSeion, type AnyKanaData } from '../core';

export const HIRAGANA_SEION: Record<string, AnyKanaData> = {
  // --- A 行 ---
  あ: defineHSeion({
    id: 'h-a',
    kana: 'あ',
    romaji: 'a',
    kanaKanjiOrigin: '安',

    word: '愛',
    wordKana: 'あい',
    wordRomaji: 'a·i',
    wordMeaning: { en: 'love', zh: '爱', zhHant: '愛' },

    wordEmoji: '❤️',
    kanaDistractors: ['お', 'め', 'ぬ'],
    romajiDistractors: ['o', 'ou', 'au'],
    wordDistractors: ['あえ', 'ぬえ', 'めい'], // wordKana 的形似
  }),

  い: defineHSeion({
    id: 'h-i',
    kana: 'い',
    romaji: 'i',
    kanaKanjiOrigin: '以',

    word: '家',
    wordKana: 'いえ',
    wordRomaji: 'i·e',
    wordMeaning: { en: 'house', zh: '房子', zhHant: '房子' },

    wordEmoji: '🏠',
    kanaDistractors: ['り', 'こ', 'に'],
    romajiDistractors: ['e', 'ei', 'ie'],
    wordDistractors: ['にえ', 'えい', 'りえ'],
  }),

  う: defineHSeion({
    id: 'h-u',
    kana: 'う',
    romaji: 'u',
    kanaKanjiOrigin: '宇',

    word: '上',
    wordKana: 'うえ',
    wordRomaji: 'u·e',
    wordMeaning: { en: 'up; superior', zh: '上面', zhHant: '上面' },

    wordEmoji: '🔝',
    kanaDistractors: ['え', 'ラ', 'ら'],
    romajiDistractors: ['wu', 'eu', 'ui'],
    wordDistractors: ['うら', 'えう', 'ラら', 'ラえ'],
  }),

  // ... (为了节省篇幅，省略中间部分，实际使用时请填入所有数据) ...

  // --- 特殊例子：wo (无单词) ---
  // 按照您的要求，处理这种“扩展难”的特殊情况
  を: defineHSeion({
    id: 'h-wo',
    kana: 'を',
    romaji: 'wo',
    kanaKanjiOrigin: '遠',

    // ✅ 关键改变：这里我们不填 word 字段
    // 这真实地反映了数据状态。Logic 层看到没有 word，就不会生成单词卡。
    // 从而避免了旧代码里 word: 'を' 这种为了不报错而填的占位符。
    noteKey: 'studyKana.notes.wo', // 保留 noteKey

    kanaDistractors: ['わ', 'ね', 'れ'],
    romajiDistractors: ['wa', 'on', 'o'],
  }),
};
