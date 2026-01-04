// src/pages/TestStudySession/kana-data/core.ts

// ==========================================
// 1. 基础工具类型
// ==========================================
export interface LocalizedText {
  en: string;
  zh: string;
  zhHant: string;
}

export type PreciseValidator<
  Distractors extends readonly string[],
  Answer extends string,
> = Distractors['length'] extends 3 | 4 | 5 | 6
  ? {
      [K in keyof Distractors]: Distractors[K] extends Answer
        ? '❌ 错误：干扰项不能包含正确答案'
        : Distractors[K];
    }
  : readonly ['❌ 错误：干扰项数量必须在 3 到 6 个之间'];

// ==========================================
// 2. 数据模型定义
// ==========================================
export interface HiraganaSeion {
  kind: 'h-seion';
  id: string;
  kana: string;
  romaji: string;
  kanaKanjiOrigin: string;
  kanaDistractors: readonly string[];
  romajiDistractors: readonly string[];
  word?: string;
  wordKana?: string;
  wordRomaji?: string;
  wordMeaning?: LocalizedText;
  wordEmoji?: string;

  // 单词干扰项
  // 平假名的校验目标是 wordKana
  // 片假名的校验目标是 word
  wordDistractors?: readonly string[];
  noteKey?: string;
}

export interface KatakanaSeion {
  kind: 'k-seion';
  id: string;
  kana: string;
  romaji: string;
  kanaKanjiOrigin: string;

  kanaDistractors: readonly string[];
  romajiDistractors: readonly string[];

  word?: string;
  wordKana?: string;
  wordRomaji?: string;
  wordMeaning?: LocalizedText;
  wordEmoji?: string;
  wordDistractors?: readonly string[];
  noteKey?: string;
}

export type AnyKanaData = HiraganaSeion | KatakanaSeion;

// ==========================================
// 3. 构造工厂
// ==========================================
export const defineHSeion = <
  K extends string,
  R extends string,
  W extends string | undefined = undefined,
  WK extends string | undefined = undefined,
  KD extends readonly string[] = [],
  RD extends readonly string[] = [],
  WD extends readonly string[] = [],
>(data: {
  id: string;
  kana: K;
  kanaKanjiOrigin: string;
  kanaDistractors: PreciseValidator<KD, K>;
  romaji: R;
  romajiDistractors: PreciseValidator<RD, R>;
  word?: W;
  wordKana?: WK;
  wordRomaji?: string;
  wordMeaning?: LocalizedText;
  wordEmoji?: string;
  // 校验目标是 W (word/写法)
  // 平假名：如果有单词(W)，则校验干扰项(WD)不能包含单词的正确罗马音(WK)
  wordDistractors?: WK extends string
    ? PreciseValidator<WD, WK>
    : readonly string[];
  noteKey?: string;
}): HiraganaSeion => {
  return {
    kind: 'h-seion',
    ...data,
    kanaDistractors: data.kanaDistractors as unknown as readonly string[],
    romajiDistractors: data.romajiDistractors as unknown as readonly string[],
    wordDistractors: data.wordDistractors as unknown as readonly string[],
  };
};

export const defineKSeion = <
  K extends string,
  R extends string,
  W extends string | undefined = undefined,
  WK extends string | undefined = undefined,
  KD extends readonly string[] = [],
  RD extends readonly string[] = [],
  WD extends readonly string[] = [],
>(data: {
  id: string;
  kana: K;
  kanaKanjiOrigin: string;
  kanaDistractors: PreciseValidator<KD, K>;
  romaji: R;
  romajiDistractors: PreciseValidator<RD, R>;

  word?: W;
  wordKana?: WK;
  wordRomaji?: string;
  wordMeaning?: LocalizedText;
  wordEmoji?: string;

  // 校验目标是 W (word/写法)
  // 片假名：如果有单词(W)，则校验干扰项(WD)不能包含正确单词(W)
  // 因为片假名单词本身就是纯片假名
  wordDistractors?: W extends string
    ? PreciseValidator<WD, W>
    : readonly string[];

  noteKey?: string;
}): KatakanaSeion => {
  return {
    kind: 'k-seion',
    ...data,
    kanaDistractors: data.kanaDistractors as unknown as readonly string[],
    romajiDistractors: data.romajiDistractors as unknown as readonly string[],
    wordDistractors: data.wordDistractors as unknown as readonly string[],
  };
};
