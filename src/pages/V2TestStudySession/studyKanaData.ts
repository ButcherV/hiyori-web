// src/pages/TestStudySession/studyKanaData.ts

// ==========================================
// 1. 基础工具类型 (Infrastructure)
// ==========================================

export interface LocalizedText {
  en: string;
  zh: string;
  zhHant: string; // ✅ 必须保留三项，满足您最初的要求
}

/**
 * 严格校验器：编译期确保干扰项合法
 * 1. 数量必须在 3-6 个之间
 * 2. 绝对不能包含正确答案
 */
type PreciseValidator<
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
// 2. 数据模型定义 (Data Models)
// 目标：精准描述“平假名清音”的生理构造
// ==========================================

export interface HiraganaSeion {
  kind: 'h-seion'; // 🆔 身份标识：平假名清音
  id: string;

  // --- 基础假名信息 ---
  kana: string; // 对应旧代码 char: 'あ'
  romaji: string; // 对应旧代码 romaji: 'a'

  // ✅ 必填：平假名必须有源流 (用于 OriginBadge)
  kanaKanjiOrigin: string; // 对应旧代码 kanjiOrigin: '安'

  // 干扰项
  kanaDistractors: readonly string[]; // 对应 charDistractors
  romajiDistractors: readonly string[]; // 对应 romajiDistractors

  // --- 单词扩展信息 (可选) ---
  // 对于 'wo' 这种没有单词的假名，这些字段可以不填 (undefined)
  // 而不是像旧代码那样填 'を' 和 'object marker' 这种占位符

  word?: string; // 对应旧代码 kanji (显示文本): '愛'
  wordKana?: string; // 对应旧代码 word (读音): 'あい'
  wordRomaji?: string; // 对应旧代码 wordRomaji: 'a·i'
  wordMeaning?: LocalizedText; // 对应旧代码 meaning

  wordEmoji?: string;
  // 单词干扰项 (校验目标是 wordKana)
  wordDistractors?: readonly string[]; // 对应 wordDistractors

  // --- 额外信息 ---
  noteKey?: string; // ✅ 必须保留：用于显示 Lightbulb 提示
}

// 联合类型，目前只有一种，未来扩展 KatakanaSeion | Dakuon 等
export type AnyKanaData = HiraganaSeion;

// ==========================================
// 3. 构造工厂 (Strict Factory)
// 作用：提供智能补全，并强制执行 PreciseValidator 校验
// ==========================================

const defineHSeion = <
  K extends string,
  R extends string,
  // 单词相关泛型 (允许 undefined)
  W extends string | undefined = undefined,
  WK extends string | undefined = undefined,
  // 干扰项泛型
  KD extends readonly string[] = [],
  RD extends readonly string[] = [],
  WD extends readonly string[] = [],
>(data: {
  id: string;
  kana: K;
  kanaKanjiOrigin: string; // 必填

  // 校验：假名干扰项不能包含自己
  kanaDistractors: PreciseValidator<KD, K>;

  romaji: R;
  romajiDistractors: PreciseValidator<RD, R>;

  // 单词部分
  word?: W; // 显示文本 (汉字)
  wordKana?: WK; // 读音 (假名)
  wordRomaji?: string;
  wordMeaning?: LocalizedText;

  wordEmoji?: string;

  // 校验：单词干扰项不能包含读音 (WK)
  // 如果没有读音，就不需要校验这部分
  wordDistractors?: WK extends string
    ? PreciseValidator<WD, WK>
    : readonly string[];

  noteKey?: string;
}): HiraganaSeion => {
  return {
    kind: 'h-seion',
    ...data,
    // 类型断言：消除 TS 对 Validator 递归类型的误报
    kanaDistractors: data.kanaDistractors as unknown as readonly string[],
    romajiDistractors: data.romajiDistractors as unknown as readonly string[],
    wordDistractors: data.wordDistractors as unknown as readonly string[],
  };
};

// ==========================================
// 4. 数据库实例 (KANA_DB)
// ==========================================

export const KANA_DB: Record<string, AnyKanaData> = {
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
    wordDistractors: ['あえ', 'ぬえ', 'めい'],
  }),

  い: defineHSeion({
    id: 'h-i',
    kana: 'い',
    romaji: 'i',
    kanaKanjiOrigin: '以',

    word: '家',
    wordKana: 'いえ',
    wordRomaji: 'i·e',
    wordMeaning: { en: 'house', zh: '房子', zhHant: '房子；家' },

    wordEmoji: '🏠',
    kanaDistractors: ['り', 'こ', 'に'],
    romajiDistractors: ['e', 'ei', 'ie'],
    wordDistractors: ['いい', 'ええ', 'りえ'],
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
