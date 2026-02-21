// src/pages/TestStudySession/kana-data/core.ts

// ==========================================
// 1. 基础工具类型
// ==========================================
export interface LocalizedText {
  en: string;
  zh: string;
  zhHant: string;
}

export interface WordOrigin {
  lang:
    | 'en-US'
    | 'en-GB'
    | 'de'
    | 'ru'
    | 'fr'
    | 'pt'
    | 'nl'
    | 'it'
    | 'zh'
    | 'ja'
    | 'sv'
    | 'es'
    | 'ko'
    | 'other'; // 语言代码
  word: string; // 原词写法 (例如 "Arbeit", "Pão")
  desc?: string; // 备注 (可选，例如 "和制英语", "拟声词")
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
  wordNoteKey?: string;
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
  wordRomaji?: string;
  wordMeaning?: LocalizedText;
  wordEmoji?: string;
  wordOrigin?: WordOrigin;
  wordKana?: string; // 片假名一般不写。为了逻辑统一。
  wordDistractors?: readonly string[];

  noteKey?: string;
  wordNoteKey?: string;
}

// --- 片假名浊音 (Dakuon) ---
export interface KatakanaDakuon {
  kind: 'k-dakuon';
  id: string;
  kana: string;
  romaji: string;
  kanaKanjiOrigin: string;

  kanaDistractors: readonly string[];
  romajiDistractors: readonly string[];

  word?: string;
  wordRomaji?: string;
  wordMeaning?: LocalizedText;
  wordEmoji?: string;
  wordOrigin?: WordOrigin;
  wordKana?: string;
  wordDistractors?: readonly string[];

  noteKey?: string;
  wordNoteKey?: string;
}

// --- 平假名浊音 (Dakuon) ---
export interface HiraganaDakuon {
  kind: 'h-dakuon'; // 唯一标识
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
  wordNoteKey?: string;
}

export interface HiraganaYoon {
  kind: 'h-yoon'; // 唯一标识
  id: string;
  kana: string; // 例如 "きゃ"
  romaji: string; // 例如 "kya"
  kanaKanjiOrigin: string; // 例如 "From き + small や"
  kanaDistractors: readonly string[];
  romajiDistractors: readonly string[];

  word?: string;
  wordKana?: string;
  wordRomaji?: string;
  wordMeaning?: LocalizedText;
  wordEmoji?: string;

  // 校验目标是 wordKana
  wordDistractors?: readonly string[];

  noteKey?: string;
  wordNoteKey?: string;
}

// --- 片假名拗音 (Yoon) ---
export interface KatakanaYoon {
  kind: 'k-yoon'; // 唯一标识
  id: string;
  kana: string; // 例如 "キャ"
  romaji: string; // 例如 "kya"
  kanaKanjiOrigin: string; // 例如 "From キ + small ャ"
  kanaDistractors: readonly string[];
  romajiDistractors: readonly string[];

  word?: string;
  wordRomaji?: string;
  wordMeaning?: LocalizedText;
  wordEmoji?: string;
  wordOrigin?: WordOrigin;
  wordKana?: string;
  wordDistractors?: readonly string[];

  noteKey?: string;
  wordNoteKey?: string;
}

export type AnyKanaData =
  | HiraganaSeion
  | KatakanaSeion
  | HiraganaDakuon
  | KatakanaDakuon
  | HiraganaYoon
  | KatakanaYoon;

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
  wordNoteKey?: string;
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
  wordOrigin?: WordOrigin;
  wordRomaji?: string;
  wordMeaning?: LocalizedText;
  wordEmoji?: string;
  wordKana?: WK;

  // 校验目标是 W (word/写法)
  // 片假名：如果有单词(W)，则校验干扰项(WD)不能包含正确单词(W)
  // 因为片假名单词本身就是纯片假名
  wordDistractors?: W extends string
    ? PreciseValidator<WD, W>
    : readonly string[];

  noteKey?: string;
  wordNoteKey?: string;
}): KatakanaSeion => {
  return {
    kind: 'k-seion',
    ...data,
    kanaDistractors: data.kanaDistractors as unknown as readonly string[],
    romajiDistractors: data.romajiDistractors as unknown as readonly string[],
    wordDistractors: data.wordDistractors as unknown as readonly string[],
  };
};

export const defineHDakuon = <
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
  wordDistractors?: WK extends string
    ? PreciseValidator<WD, WK>
    : readonly string[];
  noteKey?: string;
  wordNoteKey?: string;
}): HiraganaDakuon => {
  return {
    kind: 'h-dakuon',
    ...data,
    kanaDistractors: data.kanaDistractors as unknown as readonly string[],
    romajiDistractors: data.romajiDistractors as unknown as readonly string[],
    wordDistractors: data.wordDistractors as unknown as readonly string[],
  };
};

export const defineHYoon = <
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
  // 校验目标是 wordKana
  wordDistractors?: WK extends string
    ? PreciseValidator<WD, WK>
    : readonly string[];
  noteKey?: string;
  wordNoteKey?: string;
}): HiraganaYoon => {
  return {
    kind: 'h-yoon',
    ...data,
    kanaDistractors: data.kanaDistractors as unknown as readonly string[],
    romajiDistractors: data.romajiDistractors as unknown as readonly string[],
    wordDistractors: data.wordDistractors as unknown as readonly string[],
  };
};

export const defineKDakuon = <
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
  wordOrigin?: WordOrigin;
  wordRomaji?: string;
  wordMeaning?: LocalizedText;
  wordEmoji?: string;
  wordKana?: WK;
  wordDistractors?: W extends string
    ? PreciseValidator<WD, W>
    : readonly string[];
  noteKey?: string;
  wordNoteKey?: string;
}): KatakanaDakuon => {
  return {
    kind: 'k-dakuon',
    ...data,
    kanaDistractors: data.kanaDistractors as unknown as readonly string[],
    romajiDistractors: data.romajiDistractors as unknown as readonly string[],
    wordDistractors: data.wordDistractors as unknown as readonly string[],
  };
};

export const defineKYoon = <
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
  wordOrigin?: WordOrigin;
  wordRomaji?: string;
  wordMeaning?: LocalizedText;
  wordEmoji?: string;
  wordKana?: WK;
  // 校验目标是 W (word/写法)
  // 片假名拗音：如果有单词(W)，则校验干扰项(WD)不能包含正确单词(W)
  wordDistractors?: W extends string
    ? PreciseValidator<WD, W>
    : readonly string[];
  noteKey?: string;
  wordNoteKey?: string;
}): KatakanaYoon => {
  return {
    kind: 'k-yoon',
    ...data,
    kanaDistractors: data.kanaDistractors as unknown as readonly string[],
    romajiDistractors: data.romajiDistractors as unknown as readonly string[],
    wordDistractors: data.wordDistractors as unknown as readonly string[],
  };
};
