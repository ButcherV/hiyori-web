// src/pages/Numbers/Levels/NumberTestEngine/keyboardUtils.ts

import { shuffle } from '../../../../utils/generalTools';
import { type CustomKey } from '../NumberKeypad';
import { type QuizType } from './types';

// ============================================================
// 1. 静态键盘配置池
// ============================================================

// Level 2: 十位组合（11-99）- 10键
export const LEVEL2_KANA_KEYS: CustomKey[] = [
  { value: 'いち', label: 'いち' },
  { value: 'に', label: 'に' },
  { value: 'さん', label: 'さん' },
  { value: 'よん', label: 'よん' },
  { value: 'ご', label: 'ご' },
  { value: 'ろく', label: 'ろく' },
  { value: 'なな', label: 'なな' },
  { value: 'はち', label: 'はち' },
  { value: 'きゅう', label: 'きゅう' },
  { value: 'じゅう', label: 'じゅう' },
];

// 汉字键盘 - 10键
export const KANJI_KEYS: CustomKey[] = [
  { value: '一', label: '一' },
  { value: '二', label: '二' },
  { value: '三', label: '三' },
  { value: '四', label: '四' },
  { value: '五', label: '五' },
  { value: '六', label: '六' },
  { value: '七', label: '七' },
  { value: '八', label: '八' },
  { value: '九', label: '九' },
  { value: '十', label: '十' },
];

// 完整的汉字池 (包含百、千，甚至万) - 用于动态生成
export const KANJI_FULL_POOL: CustomKey[] = [
  { value: '一', label: '一' },
  { value: '二', label: '二' },
  { value: '三', label: '三' },
  { value: '四', label: '四' },
  { value: '五', label: '五' },
  { value: '六', label: '六' },
  { value: '七', label: '七' },
  { value: '八', label: '八' },
  { value: '九', label: '九' },
  { value: '十', label: '十' },
  { value: '百', label: '百' },
  { value: '千', label: '千' },
];

// 阿拉伯数字键盘 - 10键
export const ARABIC_KEYS: CustomKey[] = [
  { value: '0', label: '0' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5' },
  { value: '6', label: '6' },
  { value: '7', label: '7' },
  { value: '8', label: '8' },
  { value: '9', label: '9' },
];

// Level 3 假名片段池（用于动态生成键盘）
const LEVEL3_KANA_POOL: CustomKey[] = [
  { value: 'いち', label: 'いち' },
  { value: 'に', label: 'に' },
  { value: 'さん', label: 'さん' },
  { value: 'よん', label: 'よん' },
  { value: 'ご', label: 'ご' },
  { value: 'ろく', label: 'ろく' },
  { value: 'なな', label: 'なな' },
  { value: 'はち', label: 'はち' },
  { value: 'きゅう', label: 'きゅう' },
  { value: 'じゅう', label: 'じゅう' },
  { value: 'ひゃく', label: 'ひゃく' },
  { value: 'びゃく', label: 'びゃく' }, // 300
  { value: 'ぴゃく', label: 'ぴゃく' }, // 600, 800
  { value: 'ろっ', label: 'ろっ' }, // 600
  { value: 'はっ', label: 'はっ' }, // 800
];

// ============================================================
// 2. 动态生成逻辑
// ============================================================

// 动态生成 Level 3 假名键盘：提取所需片段 + 随机干扰项
export function generateLevel3Keyboard(correctAnswer: string): CustomKey[] {
  const requiredFragments: CustomKey[] = [];
  let remaining = correctAnswer;

  // 按长度降序排序，优先匹配长片段 (如 'ろっ', 'ぴゃく')
  const sortedPool = [...LEVEL3_KANA_POOL].sort(
    (a, b) => b.value.length - a.value.length
  );

  // 贪心匹配，提取所需片段
  while (remaining.length > 0) {
    let matched = false;
    for (const frag of sortedPool) {
      if (remaining.startsWith(frag.value)) {
        if (!requiredFragments.find((f) => f.value === frag.value)) {
          requiredFragments.push(frag);
        }
        remaining = remaining.slice(frag.value.length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      remaining = remaining.slice(1);
    }
  }

  // 补充干扰项，凑够 10 个
  const needed = 10 - requiredFragments.length;
  if (needed > 0) {
    const remainingPool = LEVEL3_KANA_POOL.filter(
      (f) => !requiredFragments.find((rf) => rf.value === f.value)
    );
    const shuffled = shuffle(remainingPool);
    requiredFragments.push(...shuffled.slice(0, needed));
  }

  return requiredFragments;
}

// 动态生成汉字键盘
export function generateDynamicKanjiKeyboard(
  correctAnswer: string
): CustomKey[] {
  const requiredChars = Array.from(new Set(correctAnswer.split('')));
  const keyboardKeys: CustomKey[] = [];

  requiredChars.forEach((char) => {
    const found = KANJI_FULL_POOL.find((k) => k.value === char);
    if (found) {
      keyboardKeys.push(found);
    } else {
      keyboardKeys.push({ value: char, label: char });
    }
  });

  const needed = 10 - keyboardKeys.length;
  if (needed > 0) {
    const remainingPool = KANJI_FULL_POOL.filter(
      (k) => !keyboardKeys.find((existing) => existing.value === k.value)
    );
    const shuffledPool = shuffle(remainingPool);
    keyboardKeys.push(...shuffledPool.slice(0, needed));
  }

  return keyboardKeys;
}

// 工厂函数：根据题型决定使用哪种键盘
export const getKeyboardForQuizType = (
  quizType: QuizType,
  level: number = 2,
  correctAnswer?: string
): CustomKey[] => {
  // 汉字答案
  if (quizType.endsWith('-to-kanji')) {
    if (level >= 2 && correctAnswer) {
      return generateDynamicKanjiKeyboard(correctAnswer);
    }
    return KANJI_KEYS;
  }
  // 数字答案
  if (quizType.endsWith('-to-arabic')) {
    return ARABIC_KEYS;
  }
  // Level 3 假名答案：动态生成
  if (level >= 3 && correctAnswer) {
    return generateLevel3Keyboard(correctAnswer);
  }
  // Level 2 假名答案：固定键盘
  return LEVEL2_KANA_KEYS;
};
