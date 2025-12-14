// src/data.ts
import type { Vocabulary } from './types';

export const RAW_DATA: Vocabulary[] = [
  // ============================================
  // CASE A: 纯文本基础词 (只有 N 属性)
  // 只能考：填空、翻译、汉字读音
  // ============================================
  {
    id: 'w_watashi',
    tags: ['n5', 'pronoun', 'basic'],
    kanji: '私',
    kana: 'わたし',
    romaji: 'watashi',
    meaning: { zh: '我', en: 'I / Me' }
    // visual: undefined -> 没图，引擎会自动屏蔽视觉题型
  },
  {
    id: 'w_anata',
    tags: ['n5', 'pronoun'],
    kanji: 'あなた', // 有些词习惯写假名，但放在 kanji 字段作为"题面"
    kana: 'あなた',
    romaji: 'anata',
    meaning: { zh: '你', en: 'You' }
  },
  {
    id: 'w_iku',
    tags: ['n5', 'verb'],
    kanji: '行く',
    kana: 'いく',
    romaji: 'iku',
    meaning: { zh: '去', en: 'To go' }
  },

  // ============================================
  // CASE B: Emoji 增强词 (N + Emoji)
  // 除了考上面的，还能考：看图猜词、看词选图
  // ============================================
  {
    id: 'w_apple',
    tags: ['food', 'fruit', 'emoji'],
    kanji: '林檎',
    kana: 'りんご',
    romaji: 'ringo',
    meaning: { zh: '苹果', en: 'Apple' },
    visual: { 
      type: 'EMOJI', 
      value: '🍎' 
    }
  },
  {
    id: 'w_cat',
    tags: ['animal', 'emoji'],
    kanji: '猫',
    kana: 'ねこ',
    romaji: 'neko',
    meaning: { zh: '猫', en: 'Cat' },
    visual: { 
      type: 'EMOJI', 
      value: '🐱' 
    }
  },
  {
    id: 'w_japan',
    tags: ['country', 'emoji'],
    kanji: '日本',
    kana: 'にほん',
    romaji: 'nihon',
    meaning: { zh: '日本', en: 'Japan' },
    visual: { 
      type: 'EMOJI', 
      value: '🇯🇵' 
    }
  },

  // ============================================
  // CASE C: 颜色增强词 (N + CSS)
  // 特有考法：看色块猜词
  // ============================================
  {
    id: 'w_red',
    tags: ['color', 'adjective'],
    kanji: '赤',
    kana: 'あか',
    romaji: 'aka',
    meaning: { zh: '红色', en: 'Red' },
    visual: { 
      type: 'CSS_COLOR', 
      value: '#FF0000' 
    }
  },
  {
    id: 'w_blue',
    tags: ['color', 'adjective'],
    kanji: '青',
    kana: 'あお',
    romaji: 'ao',
    meaning: { zh: '蓝色', en: 'Blue' },
    visual: { 
      type: 'CSS_COLOR', 
      value: '#0000FF' 
    }
  },

  // ============================================
  // CASE D: 品牌增强词 (N + Brand)
  // 特有考法：看品牌色猜名字
  // ============================================
  {
    id: 'w_uniqlo',
    tags: ['brand'],
    kanji: 'ユニクロ',
    kana: 'ゆにくろ',
    romaji: 'uniqlo',
    meaning: { zh: '优衣库', en: 'Uniqlo' },
    visual: { 
      type: 'BRAND_COLOR', 
      value: '#E60012' // 优衣库红
    }
  },

  // ============================================
  // CASE E: 组件增强词 (N + Widget)
  // 特有考法：拨动时钟
  // ============================================
  {
    id: 'w_3pm',
    tags: ['time'],
    kanji: '3時',
    kana: 'さんじ',
    romaji: 'san-ji',
    meaning: { zh: '3点', en: '3:00' },
    widget: { 
      type: 'CLOCK', 
      value: '3:00' 
    }
  }
];