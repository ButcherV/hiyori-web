// src/types.ts

// ==========================================
// 1. 数据层 (The Facts) - 永远不变的真理
// ==========================================
// 这里存的是“食材”

export interface Vocabulary {
  id: string;
  tags: string[]; // ['n5', 'brand', 'color']

  // --- N: 基础部分 (所有单词都有) ---
  kanji: string; // "私" (显示用，如果没有汉字就填假名)
  kana: string; // "わたし" (发音/挖空用)
  romaji: string; // "watashi" (给零基础用户看)
  meaning: { zh: string; en: string }; // 意思

  // --- +1: 增强部分 (可选) ---
  visual?: {
    type: 'EMOJI' | 'CSS_COLOR' | 'BRAND_COLOR';
    value: string; // Emoji字符 或 Hex颜色代码
  };

  widget?: {
    type: 'CLOCK' | 'AUDIO';
    value: string; // "3:00" 或 音频文件名
  };
}

// ==========================================
// 2. 业务层 (The Logic) - 完整的题型菜单
// ==========================================
// 这里列出所有的“烹饪方式”

export type QuizMode =
  // --- A. 假名专项 (针对 kana 字段) ---
  | 'KANA_FILL_BLANK' // 挖空: "_たし" -> 选 "わ" (你的核心玩法)
  | 'KANA_TO_ROMAJI' // 认读: "わたし" -> 选 "watashi"
  | 'ROMAJI_TO_KANA' // 拼写: "watashi" -> 选 "わたし"

  // --- B. 单词基础 (针对 kanji/meaning 字段) ---
  | 'WORD_TO_MEANING' // 翻译: "私" -> 选 "我"
  | 'MEANING_TO_WORD' // 反向: "我" -> 选 "私"
  | 'KANJI_TO_KANA' // 读音: "私" -> 选 "わたし"
  | 'KANA_TO_KANJI' // 认字: "わたし" -> 选 "私"

  // --- C. 视觉增强 (针对 visual 字段) ---
  // 只有当 visual 存在时，引擎才会生成这类题
  | 'WORD_TO_EMOJI' // 猜意: "りんご" -> 选 🍎
  | 'EMOJI_TO_WORD' // 认图: 🍎 -> 选 "りんご"
  | 'WORD_TO_COLOR' // 猜色: "赤" -> 选 🟥(CSS Block)
  | 'BRAND_TO_NAME' // 认牌: 🟥(Uniqlo红) -> 选 "ユニクロ"

  // --- D. 交互增强 (针对 widget 字段) ---
  | 'CLOCK_INTERACT' // 拨钟: "3時" -> 拨动指针
  | 'AUDIO_TO_WORD'; // 听写: (播放声音) -> 选 "雨"

// ==========================================
// 3. 交互层 (The UI) - 发给前端的指令
// ==========================================

export interface QuizQuestion {
  id: string;
  mode: QuizMode; // 告诉前端：这道题玩哪个模式

  // 题目 (Top)
  prompt: {
    display: string; // 显示的内容
    type: 'TEXT' | 'EMOJI' | 'COLOR' | 'AUDIO'; // 题目内容的类型
    highlightIndex?: number; // 挖空/高亮的索引
  };

  // 选项 (Bottom)
  options: QuizOption[];
}

export interface QuizOption {
  id: string;
  isCorrect: boolean;
  content: string; // 选项显示的内容
  type: 'TEXT' | 'EMOJI' | 'COLOR'; // 选项内容的类型
}
