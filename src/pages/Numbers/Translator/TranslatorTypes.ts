// src/pages/Numbers/Translator/TranslatorTypes.ts

// 单个音节/部分的结构 (用于高亮显示音便)
export interface PhonePart {
  text: string; // 显示的文本 (如 "rop", "pyaku")
  isMutation?: boolean; // 是否是音便/特殊读法 (UI标红)
  note?: string; // 备注 (如 "促音变")
}

// 四位分节的数据块 (UI 卡片的基础单位)
export interface NumberBlock {
  value: number; // 这一节的数值 (如 1234)
  unit: string; // 单位 (万, 亿, 兆) - 只有非空时才显示
  unitReading?: string; // 单位的读法 (man, oku)

  // 这一节内部的详细读法
  kanji: string; // "一千二百三十四"
  kana: string; // 纯假名
  romajiParts: PhonePart[]; // 罗马音拆分 (为了做高亮)

  isZero: boolean; // 是否是0 (如果是0且不是个位，通常不渲染)
}

// 最终返回给 UI 的完整结果
export interface TranslationResult {
  originalNum: number;
  blocks: NumberBlock[];
}
