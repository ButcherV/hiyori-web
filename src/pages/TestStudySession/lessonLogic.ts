// src/pages/TestStudySession/lessonLogic.ts

// --- 1. 类型定义 ---
export type TaskType = 'LEARN' | 'TRACE' | 'QUIZ';
export type SubType = 'SHAPE' | 'CONTEXT' | 'ROMAJI' | 'WORD';

export interface LessonCard {
  id: string;
  type: TaskType;
  subType: SubType;
  
  // 基础数据
  char: string;           // 核心假名 (如 'あ')
  romaji: string;         // 单个假名罗马音 (如 'a')
  
  word?: string;          // 单词假名 (如 'あり')
  kanji?: string;         // 单词汉字 (如 '蟻')
  meaning?: string;       // 含义 (如 'Ant')
  wordRomaji?: string;    // 单词罗马音 (如 'ari')
  
  // 视图显示
  displayContent: string; // 卡片中间显示的内容 (可能是假名、汉字、罗马音等)
  
  // Quiz 专用逻辑
  quizGroupId?: string;   // 同组ID，用于清场
  targetChar?: string;    // 题目核心字符
  targetKanji?: string;       // 题目的汉字 (用于 Quiz2 Header)
  targetWordRomaji?: string;  // 题目的单词罗马音 (用于 Quiz2 Header)
  isCorrect?: boolean; 
  
  // 🔥 [新增] 定制 Header 文案 (用于补救卡显示 "Review ...")
  customTitle?: string;
}

// --- 2. 静态数据库 ---
// 确保包含 wordRomaji 字段
const KANA_DB: Record<string, { char: string, romaji: string, word: string, wordRomaji: string, kanji: string, meaning: string }> = {
  'あ': { char: 'あ', romaji: 'a', word: 'あり', wordRomaji: 'ari', kanji: '蟻', meaning: 'Ant' },
  'い': { char: 'い', romaji: 'i', word: 'いぬ', wordRomaji: 'inu', kanji: '犬', meaning: 'Dog' },
  'う': { char: 'う', romaji: 'u', word: 'うみ', wordRomaji: 'umi', kanji: '海', meaning: 'Sea' },
  'え': { char: 'え', romaji: 'e', word: 'えき', wordRomaji: 'eki', kanji: '駅', meaning: 'Station' },
  'お': { char: 'お', romaji: 'o', word: 'おに', wordRomaji: 'oni', kanji: '鬼', meaning: 'Demon' },
};

// --- 3. 辅助生成函数 ---

// 生成学习卡
const createLearn = (char: string, subType: 'SHAPE' | 'CONTEXT'): LessonCard => {
  const data = KANA_DB[char];
  return {
    id: `learn-${char}-${subType}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    type: 'LEARN',
    subType: subType,
    char: data.char,
    romaji: data.romaji,
    
    word: data.word,
    kanji: data.kanji,
    wordRomaji: data.wordRomaji, // 单词卡底部显示 ari
    meaning: data.meaning,
    
    // SHAPE 显示假名, CONTEXT 显示汉字
    displayContent: subType === 'SHAPE' ? data.char : data.kanji, 
  };
};

// 生成描红卡
const createTrace = (char: string): LessonCard => {
  return {
    id: `trace-${char}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    type: 'TRACE',
    subType: 'SHAPE',
    char: char,
    romaji: KANA_DB[char].romaji,
    displayContent: char
  };
};

// 生成测试卡 (核心逻辑)
// type: 'ROMAJI' (测读音) | 'WORD' (测单词)
const createQuiz = (target: string, distractors: string[], type: 'ROMAJI' | 'WORD'): LessonCard[] => {
  const targetData = KANA_DB[target];
  const cards: LessonCard[] = [];
  const groupId = `group-${target}-${type}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

  // 决定卡片上显示什么：
  // ROMAJI模式 -> 显示 'a', 'i'
  // WORD模式   -> 显示 'あり', 'いぬ'
  const getContent = (d: typeof targetData) => type === 'ROMAJI' ? d.romaji : d.word;

  // 1. 添加正确项
  cards.push({
    id: `${groupId}-correct`,
    type: 'QUIZ',
    subType: type,
    quizGroupId: groupId,
    
    char: targetData.char,
    romaji: targetData.romaji,
    word: targetData.word,
    kanji: targetData.kanji,
    wordRomaji: targetData.wordRomaji,
    
    displayContent: getContent(targetData),
    
    // Header 需要的数据
    targetChar: targetData.char,
    targetKanji: targetData.kanji,
    targetWordRomaji: targetData.wordRomaji,
    
    isCorrect: true
  });

  // 2. 添加干扰项
  distractors.forEach(dChar => {
    const dData = KANA_DB[dChar];
    if (dData) {
      cards.push({
        id: `${groupId}-wrong-${dChar}`,
        type: 'QUIZ',
        subType: type,
        quizGroupId: groupId,
        
        char: dData.char, // 这是干扰项自己的数据
        romaji: dData.romaji,
        word: dData.word,
        kanji: dData.kanji,
        wordRomaji: dData.wordRomaji,
        
        displayContent: getContent(dData),
        
        // 🔥 关键：干扰项也必须携带 Target 的信息，否则滑到这张卡时 Header 会变
        targetChar: targetData.char,
        targetKanji: targetData.kanji,
        targetWordRomaji: targetData.wordRomaji,
        
        isCorrect: false
      });
    }
  });

  // 打乱顺序
  return cards.sort(() => 0.5 - Math.random());
};

// --- 4. 导出逻辑函数 ---

// 🔥 补救逻辑分流 + 注入 Custom Title
export const getRemedialCards = (char: string, failedType: SubType): LessonCard[] => {
  const distractor = char === 'あ' ? 'い' : 'あ'; // 简单 mock 一个干扰项

  // 情况 A: 单词测错了 -> 补单词 [学2] + [测2]
  if (failedType === 'WORD') {
    const learnCard = createLearn(char, 'CONTEXT');
    // 🏷️ 贴上便利贴，告诉 UI 显示 "Review Word"
    learnCard.customTitle = "Review Word";
    
    return [
      learnCard,
      ...createQuiz(char, [distractor], 'WORD')
    ];
  }

  // 情况 B: 读音测错了 -> 补字形 [学1] + [测1]
  const learnCard = createLearn(char, 'SHAPE');
  // 🏷️ 贴上便利贴，告诉 UI 显示 "Review Character"
  learnCard.customTitle = "Review KANA";

  return [
    learnCard,
    ...createQuiz(char, [distractor], 'ROMAJI')
  ];
};

// 课程编排 (Wave Sequence)
export const generateWaveSequence = (): LessonCard[] => {
  const sequence: LessonCard[] = [];

  // === Demo 流程 ===
  
  // 1. 学 あ (Shape)
  sequence.push(createLearn('あ', 'SHAPE'));
  
  // 2. 学 あ (Context)
  sequence.push(createLearn('あ', 'CONTEXT'));
  
  // 3. 练 あ (Trace)
  sequence.push(createTrace('あ'));
  
  // 4. 测 あ (读音: Header "あ" -> Card "a", "i")
  sequence.push(...createQuiz('あ', ['い', 'う'], 'ROMAJI'));

  // 5. 测 あ (单词: Header "蟻" -> Card "あり", "いぬ")
  sequence.push(...createQuiz('あ', ['い', 'う'], 'WORD'));

  // (可选) 继续学 'い'...
  // sequence.push(createLearn('い', 'SHAPE'));
  // ...

  return sequence;
};