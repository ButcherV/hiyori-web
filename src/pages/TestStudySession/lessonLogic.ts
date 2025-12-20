// src/pages/TestStudySession/lessonLogic.ts

export type TaskType = 'LEARN' | 'TRACE' | 'QUIZ';
export type SubType = 'SHAPE' | 'CONTEXT' | 'ROMAJI' | 'WORD';

export interface LessonCard {
  id: string;
  type: TaskType;
  subType: SubType;
  char: string;
  word?: string;    // 单词 (如 'あり')
  meaning?: string; // 含义 (如 'Ant')
  targetChar?: string; // Quiz 题目目标
  isCorrect?: boolean; // Quiz 是否正确
}

// 基础数据 (Mock)
const KANA_DB = [
  { char: 'あ', romaji: 'a', word: 'あり', meaning: 'Ant' },
  { char: 'い', romaji: 'i', word: 'いぬ', meaning: 'Dog' },
  { char: 'う', romaji: 'u', word: 'うみ', meaning: 'Sea' },
  { char: 'え', romaji: 'e', word: 'えき', meaning: 'Station' },
  { char: 'お', romaji: 'o', word: 'おに', meaning: 'Demon' },
];

// Helper: 生成 Quiz Block (1对3错)
const createQuizBlock = (targetIndex: number, subType: SubType): LessonCard[] => {
  const target = KANA_DB[targetIndex];
  const cards: LessonCard[] = [];
  
  // A. 正确卡
  cards.push({
    id: `quiz-${target.char}-${subType}-correct`,
    type: 'QUIZ',
    subType: subType,
    char: target.char,
    targetChar: target.char,
    isCorrect: true,
    word: target.word
  });

  // B. 干扰卡
  const distractors = KANA_DB.filter((_, i) => i !== targetIndex)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  distractors.forEach(d => {
    cards.push({
      id: `quiz-${target.char}-${subType}-wrong-${d.char}`,
      type: 'QUIZ',
      subType: subType,
      char: d.char,
      targetChar: target.char,
      isCorrect: false,
      word: d.word
    });
  });

  return cards.sort(() => 0.5 - Math.random());
};

// 🔥 生成波浪序列
export const generateWaveSequence = (): LessonCard[] => {
  const seq: LessonCard[] = [];
  
  const addLearn = (idx: number, sub: 'SHAPE' | 'CONTEXT') => {
    const k = KANA_DB[idx];
    seq.push({ 
      id: `${sub}-${k.char}`, 
      type: 'LEARN', 
      subType: sub, 
      char: k.char, 
      word: sub === 'CONTEXT' ? k.word : undefined,
      meaning: sub === 'CONTEXT' ? k.meaning : undefined
    });
  };

  const addTrace = (idx: number) => {
    const k = KANA_DB[idx];
    seq.push({ id: `trace-${k.char}`, type: 'TRACE', subType: 'SHAPE', char: k.char });
  };

  const addQuiz = (idx: number, sub: 'ROMAJI' | 'WORD') => {
    seq.push(...createQuizBlock(idx, sub));
  };

  // --- 编排剧本 ---
  // Phase 1
  addLearn(0, 'SHAPE'); addTrace(0);
  addLearn(1, 'SHAPE'); addTrace(1);
  addLearn(2, 'SHAPE'); addTrace(2);

  // Phase 2
  addLearn(0, 'CONTEXT'); 
  addLearn(3, 'SHAPE'); addTrace(3);
  addQuiz(0, 'ROMAJI');

  // Phase 3
  addLearn(1, 'CONTEXT');
  addLearn(4, 'SHAPE'); addTrace(4);
  addQuiz(1, 'ROMAJI');

  // Phase 4
  addLearn(2, 'CONTEXT');
  addQuiz(2, 'ROMAJI');
  addLearn(3, 'CONTEXT');
  addQuiz(0, 'WORD');

  // Phase 5
  addQuiz(3, 'ROMAJI');
  addLearn(4, 'CONTEXT');
  addQuiz(1, 'WORD');
  addQuiz(2, 'WORD');
  addQuiz(4, 'ROMAJI');
  
  // Phase 6
  addQuiz(3, 'WORD');
  addQuiz(4, 'WORD');

  return seq;
};