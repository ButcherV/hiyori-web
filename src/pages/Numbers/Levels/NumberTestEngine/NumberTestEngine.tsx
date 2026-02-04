import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { useSound } from '../../../../hooks/useSound';
import { useTTS } from '../../../../hooks/useTTS';
import type {
  QuizType,
  NumberDataItem,
  NumberTestEngineProps,
  GameStatus,
} from './types';
import styles from './NumberTestEngine.module.css';
import { NumberKeypad, type CustomKey } from '../NumberKeypad';
import { shuffle } from '../../../../utils/generalTools';

// ============================================================
// 片段键盘数据
// ============================================================

// Level 2: 十位组合（11-99）- 10键
const LEVEL2_KANA_KEYS: CustomKey[] = [
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
const KANJI_KEYS: CustomKey[] = [
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

// 🟢 新增：完整的汉字池 (包含百、千，甚至万)
const KANJI_FULL_POOL: CustomKey[] = [
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
  { value: '百', label: '百' }, // Level 3 必需
  { value: '千', label: '千' }, // Level 4 必需
  // { value: '万', label: '万' }, // Level 5 预留
];

// 阿拉伯数字键盘 - 10键
const ARABIC_KEYS: CustomKey[] = [
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

// Level 3 动态键盘生成：根据正确答案提取所需片段，再补充干扰项
function generateLevel3Keyboard(correctAnswer: string): CustomKey[] {
  // 从答案中提取所需的片段
  const requiredFragments: CustomKey[] = [];
  let remaining = correctAnswer;

  // 按长度降序排序，优先匹配长片段
  const sortedPool = [...LEVEL3_KANA_POOL].sort(
    (a, b) => b.value.length - a.value.length
  );

  // 贪心匹配，提取所需片段
  while (remaining.length > 0) {
    let matched = false;
    for (const frag of sortedPool) {
      if (remaining.startsWith(frag.value)) {
        // 避免重复添加
        if (!requiredFragments.find((f) => f.value === frag.value)) {
          requiredFragments.push(frag);
        }
        remaining = remaining.slice(frag.value.length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      // 无法匹配，跳过第一个字符
      remaining = remaining.slice(1);
    }
  }

  // 补充干扰项，凑够 10 个
  const needed = 10 - requiredFragments.length;
  if (needed > 0) {
    // 从池中排除已选的，随机选取
    const remainingPool = LEVEL3_KANA_POOL.filter(
      (f) => !requiredFragments.find((rf) => rf.value === f.value)
    );
    // 打乱并选取
    const shuffled = shuffle(remainingPool);
    requiredFragments.push(...shuffled.slice(0, needed));
  }

  return requiredFragments;
}

// 动态生成汉字键盘
function generateDynamicKanjiKeyboard(correctAnswer: string): CustomKey[] {
  // 1. 提取正确答案中的字符 (去重)
  // 例如 "六百三十五" -> ['六', '百', '三', '十', '五']
  const requiredChars = Array.from(new Set(correctAnswer.split('')));

  const keyboardKeys: CustomKey[] = [];

  // 2. 将必需字符加入键盘
  requiredChars.forEach((char) => {
    // 从池子里找对应的对象，或者临时创建一个
    const found = KANJI_FULL_POOL.find((k) => k.value === char);
    if (found) {
      keyboardKeys.push(found);
    } else {
      // 防御性编程：万一答案里有池子里没有的字
      keyboardKeys.push({ value: char, label: char });
    }
  });

  // 3. 补充干扰项直到 10 个
  const needed = 10 - keyboardKeys.length;
  if (needed > 0) {
    // 过滤掉已经选中的
    const remainingPool = KANJI_FULL_POOL.filter(
      (k) => !keyboardKeys.find((existing) => existing.value === k.value)
    );

    // 打乱并截取
    const shuffledPool = shuffle(remainingPool);
    keyboardKeys.push(...shuffledPool.slice(0, needed));
  }

  return keyboardKeys;
}

// ============================================================
// 辅助函数
// ============================================================

// 生成算式题面（用于 Level 2）
const generateFormula = (num: number): string => {
  const tens = Math.floor(num / 10) * 10;
  const ones = num % 10;
  if (ones === 0) return `${tens}`;
  return `${tens} + ${ones}`;
};

// 根据题型获取对应的键盘配置
// 获取键盘配置
// Level 2: 固定 10 键
// Level 3: 根据正确答案动态生成
const getKeyboardForQuizType = (
  quizType: QuizType,
  level: number = 2,
  correctAnswer?: string
): CustomKey[] => {
  // 汉字答案
  if (quizType.endsWith('-to-kanji')) {
    // 如果是 L2 以上且有答案，动态生成；否则回退到基础 1-10
    if (level >= 2 && correctAnswer) {
      return generateDynamicKanjiKeyboard(correctAnswer);
    }
    return KANJI_KEYS; // Level 1 或者 fallback
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

// ============================================================
// 主组件
// ============================================================

export const NumberTestEngine: React.FC<NumberTestEngineProps> = ({
  data,
  numberRange,
  quizTypes,
  onMistake,
  onContinue,
  level = 2,
}) => {
  const { speak } = useTTS();
  const playSound = useSound();

  // 游戏状态
  const [status, setStatus] = useState<GameStatus>('idle');
  const [currentQuiz, setCurrentQuiz] = useState<{
    num: number;
    item: NumberDataItem;
    type: QuizType;
    correctAnswer: string;
    prompt: string;
  } | null>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [roundId, setRoundId] = useState(0);

  // 触觉反馈
  const triggerHaptic = useCallback(async (type: 'success' | 'error') => {
    if (!Capacitor.isNativePlatform()) return;
    if (type === 'success') {
      await Haptics.impact({ style: ImpactStyle.Light });
    } else {
      await Haptics.notification({ type: NotificationType.Error });
    }
  }, []);

  // 生成新题目
  const generateNewQuiz = useCallback(() => {
    const num = numberRange[Math.floor(Math.random() * numberRange.length)];
    const item = data[num];
    if (!item) return;

    // 随机选择题型
    const quizType = quizTypes[Math.floor(Math.random() * quizTypes.length)];

    // 根据题型确定正确答案和题面
    let correctAnswer: string;
    let prompt: string;

    switch (quizType) {
      case 'arabic-to-kana':
        correctAnswer = item.mutation?.kana || item.kana;
        prompt = num.toString();
        break;
      case 'arabic-to-kanji':
        correctAnswer = item.kanji;
        prompt = num.toString();
        break;
      case 'kanji-to-kana':
        correctAnswer = item.mutation?.kana || item.kana;
        prompt = item.kanji;
        break;
      case 'kana-to-arabic':
        correctAnswer = num.toString();
        prompt = item.mutation?.kana || item.kana;
        break;
      case 'kana-to-kanji':
        correctAnswer = item.kanji;
        prompt = item.mutation?.kana || item.kana;
        break;
      case 'formula-to-kana':
        correctAnswer = item.kana;
        prompt = generateFormula(num);
        break;
      case 'audio-to-arabic':
        correctAnswer = num.toString();
        prompt = '🔊';
        break;
      case 'audio-to-kanji':
        correctAnswer = item.kanji;
        prompt = '🔊';
        break;
      case 'audio-to-kana':
        correctAnswer = item.mutation?.kana || item.kana;
        prompt = '🔊';
        break;
      default:
        correctAnswer = item.kana;
        prompt = num.toString();
    }

    setCurrentQuiz({
      num,
      item,
      type: quizType,
      correctAnswer,
      prompt,
    });
    setUserAnswer('');
    setStatus('answering');
    setRoundId((prev) => prev + 1);

    // 如果是听音题型，自动播放
    if (quizType.startsWith('audio-')) {
      setTimeout(() => {
        speak(correctAnswer);
      }, 300);
    }
  }, [data, numberRange, quizTypes, speak]);

  // 处理按键点击
  const handleKeyClick = useCallback(
    (value: number | string) => {
      if (status !== 'answering' || !currentQuiz) return;

      const strValue = String(value);
      const newAnswer = userAnswer + strValue;
      setUserAnswer(newAnswer);

      // 检查是否匹配正确答案
      if (newAnswer === currentQuiz.correctAnswer) {
        handleSuccess();
      } else if (newAnswer.length >= currentQuiz.correctAnswer.length) {
        // 长度超过但不相等，说明错了
        handleFailure(newAnswer);
      }
      // 否则继续输入
    },
    [status, currentQuiz, userAnswer]
  );

  // 删除最后一个片段
  const handleBackspace = useCallback(() => {
    if (userAnswer.length === 0) return;

    // 尝试找到最后匹配的片段并删除
    const fragments = getKeyboardForQuizType(
      currentQuiz?.type || 'arabic-to-kana',
      level,
      currentQuiz?.correctAnswer
    )
      .map((f) => f.value)
      .sort((a, b) => b.length - a.length);

    for (const frag of fragments) {
      if (userAnswer.endsWith(frag)) {
        setUserAnswer(userAnswer.slice(0, -frag.length));
        return;
      }
    }

    // 没有匹配到完整片段，删除最后一个字符
    setUserAnswer(userAnswer.slice(0, -1));
  }, [userAnswer, currentQuiz]);

  // 处理正确
  const handleSuccess = useCallback(() => {
    setStatus('success');
    playSound('score');
    triggerHaptic('success');

    setTimeout(() => {
      generateNewQuiz();
    }, 600);
  }, [playSound, triggerHaptic, generateNewQuiz]);

  // 处理错误
  const handleFailure = useCallback(
    (wrongAnswer: string) => {
      setStatus('error');
      playSound('failure');
      triggerHaptic('error');

      if (currentQuiz) {
        onMistake(currentQuiz.num, wrongAnswer, currentQuiz.correctAnswer);
      }

      // 延迟后自动进入下一题（给 Toast 显示时间）
      setTimeout(() => {
        generateNewQuiz();
        onContinue?.();
      }, 2000);
    },
    [
      currentQuiz,
      onMistake,
      playSound,
      triggerHaptic,
      generateNewQuiz,
      onContinue,
    ]
  );

  // 播放题目音频
  const playQuestionAudio = useCallback(() => {
    if (!currentQuiz) return;
    speak(currentQuiz.correctAnswer);
  }, [currentQuiz, speak]);

  // 获取当前键盘配置
  const currentKeyboard = useMemo(() => {
    if (!currentQuiz) return [];
    return getKeyboardForQuizType(
      currentQuiz.type,
      level,
      currentQuiz.correctAnswer
    );
  }, [currentQuiz, level]);

  // 组件挂载时生成第一题
  useEffect(() => {
    generateNewQuiz();
  }, []);

  // 渲染题面
  const renderPrompt = () => {
    if (!currentQuiz) return null;

    const isAudioType = currentQuiz.type.startsWith('audio-');

    return (
      <div className={styles.promptContainer}>
        <AnimatePresence mode="wait">
          <motion.div
            key={roundId}
            className={styles.promptContent}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            {isAudioType ? (
              <button className={styles.audioBtn} onClick={playQuestionAudio}>
                <Volume2 size={48} />
              </button>
            ) : currentQuiz.type === 'formula-to-kana' ? (
              <div className={styles.formulaPrompt}>
                {currentQuiz.prompt.split(' + ').map((part, idx, arr) => (
                  <React.Fragment key={idx}>
                    <span className={styles.formulaPart}>{part}</span>
                    {idx < arr.length - 1 && (
                      <span className={styles.formulaOperator}>+</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <div className={styles.promptWithSpeaker}>
                <span
                  className={`
                    jaFont 
                    ${styles.promptText} 
                    ${currentQuiz.prompt.length >= 12 ? styles.tinyText : ''}
                    ${currentQuiz.prompt.length >= 8 ? styles.littleText : ''}
                    ${currentQuiz.prompt.length > 4 ? styles.smallText : ''}`}
                >
                  {currentQuiz.prompt}
                </span>
                {/* <button
                  className={styles.speakerBtn}
                  onClick={playQuestionAudio}
                  aria-label="播放读音"
                >
                  <Volume2 size={24} />
                </button> */}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  };

  const getAssembledTextSizeClass = (text: string) => {
    const len = text.length;
    if (len >= 20) return styles.textTiny; // > 20字符 (极长假名)
    if (len >= 12) return styles.textSmall; // > 12字符 (长假名)
    if (len >= 8) return styles.textMedium; // > 8字符 (中等)
    return ''; // 默认 28px
  };

  // 渲染答案区域（拼装槽）
  const renderAnswer = () => {
    if (!currentQuiz) return null;

    return (
      <div
        className={`${styles.answerContainer} ${status === 'error' ? styles.shakeAnim : ''}`}
      >
        <div className={styles.assemblyArea}>
          <div className={styles.assemblySlots}>
            {userAnswer.length === 0 ? (
              <span className={styles.assemblyPlaceholder}>
                点击键盘拼装答案
              </span>
            ) : (
              <motion.span
                className={`
                  ${styles.assembledText} 
                  ${getAssembledTextSizeClass(userAnswer)}
                `}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={userAnswer}
              >
                {userAnswer}
              </motion.span>
            )}
          </div>
          <button
            className={styles.backspaceBtn}
            onClick={handleBackspace}
            disabled={userAnswer.length === 0 || status !== 'answering'}
          >
            ←
          </button>
        </div>

        {/* 进度指示器 */}
        <div className={styles.progressIndicator}>
          <div
            className={styles.progressBar}
            style={{
              width: `${Math.min(100, (userAnswer.length / currentQuiz.correctAnswer.length) * 100)}%`,
              backgroundColor:
                status === 'error' ? 'var(--color-error)' : 'var(--color-Blue)',
            }}
          />
        </div>
      </div>
    );
  };

  // 渲染键盘
  const renderKeyboard = () => {
    if (!currentQuiz) return null;

    return (
      <div
        className={`${styles.keyboardContainer} ${status !== 'answering' ? styles.disabledKeyboard : ''}`}
      >
        <NumberKeypad
          onKeyClick={handleKeyClick}
          customKeys={currentKeyboard}
          shuffle={true}
          layout={{
            splitIdx: Math.ceil(currentKeyboard.length / 2),
            maxCols: Math.ceil(currentKeyboard.length / 2),
          }}
        />
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.gameArea}>{renderPrompt()}</div>
      {renderAnswer()}
      {renderKeyboard()}
    </div>
  );
};

export default NumberTestEngine;
