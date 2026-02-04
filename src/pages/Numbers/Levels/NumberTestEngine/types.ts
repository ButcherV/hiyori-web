// 题型类型
export type QuizType = 
  | 'arabic-to-kana'      // 阿拉伯数字 → 假名
  | 'arabic-to-kanji'     // 阿拉伯数字 → 汉字
  | 'kanji-to-kana'       // 汉字 → 假名
  | 'kana-to-arabic'      // 假名 → 阿拉伯数字
  | 'kana-to-kanji'       // 假名 → 汉字
  | 'formula-to-kana'     // 算式 → 假名 (如 "40+7" → "よんじゅうなな")
  | 'audio-to-arabic'     // 听音 → 阿拉伯数字
  | 'audio-to-kanji'      // 听音 → 汉字
  | 'audio-to-kana';      // 听音 → 假名

// 统一的数字数据项接口
export interface NumberDataItem {
  num: number;
  kanji: string;
  kana: string;        // 完整假名读音
  romaji: string;
  parts?: {
    kanji: [string, string];  // [十位/高位部分, 个位/低位部分]
    kana: [string, string];
  };
  mutation?: {
    multiplier?: string;
    unit?: string;
    kana?: string;     // 变异后的完整读音
    romaji?: string;
  };
  note?: {
    zh: string;
    en: string;
  };
}

// 测试引擎 Props
export interface NumberTestEngineProps {
  // 数据源
  data: Record<number, NumberDataItem>;
  
  // 可用的数字范围
  numberRange: number[];
  
  // 题型配置（可以配置多种题型随机出现）
  quizTypes: QuizType[];
  
  // 错误回调（显示 Toast 用）
  onMistake: (targetNum: number, userAnswer: string, correctAnswer: string) => void;
  
  // 错误后继续下一题（Toast 消失后调用）
  onContinue?: () => void;
  
  // 关卡级别（影响键盘生成策略）
  level?: 2 | 3 | 4;
}

// 游戏状态
export type GameStatus = 'idle' | 'answering' | 'success' | 'error';
