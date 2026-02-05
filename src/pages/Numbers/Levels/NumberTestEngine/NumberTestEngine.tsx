import React, { useState, useCallback, useMemo, useEffect } from 'react';
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
import { NumberKeypad } from '../NumberKeypad';

import { getKeyboardForQuizType } from './keyboardUtils';
import { TestPrompt } from './components/TestPrompt';
import { TestAnswer } from './components/TestAnswer';

// 导出默认延迟时间，供外部引用
export const DEFAULT_NEXT_QUESTION_DELAY = 2800;

export const NumberTestEngine: React.FC<NumberTestEngineProps> = ({
  data,
  numberRange,
  quizTypes,
  onMistake,
  onContinue,
  level = 2,
  nextQuestionDelay = DEFAULT_NEXT_QUESTION_DELAY,
}) => {
  const { speak } = useTTS();
  const playSound = useSound();

  // ==================== 状态管理 ====================
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

  // ==================== 核心逻辑 ====================

  // 1. 触觉反馈
  const triggerHaptic = useCallback(async (type: 'success' | 'error') => {
    if (!Capacitor.isNativePlatform()) return;
    if (type === 'success') {
      await Haptics.impact({ style: ImpactStyle.Light });
    } else {
      await Haptics.notification({ type: NotificationType.Error });
    }
  }, []);

  // 2. 生成新题目
  const generateNewQuiz = useCallback(() => {
    const num = numberRange[Math.floor(Math.random() * numberRange.length)];
    const item = data[num];
    if (!item) return;

    const quizType = quizTypes[Math.floor(Math.random() * quizTypes.length)];
    let correctAnswer: string;
    let prompt: string;

    // 根据题型决定答案和题面
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
      case 'formula-to-kanji':
        // 保护性
        if (num <= 1) {
          prompt = num.toString();
        } else {
          const splitA = Math.floor(Math.random() * (num - 1)) + 1;
          const splitB = num - splitA;
          prompt = `${splitA} + ${splitB}`;
        }
        correctAnswer =
          quizType === 'formula-to-kanji' ? item.kanji : item.kana;
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

    setCurrentQuiz({ num, item, type: quizType, correctAnswer, prompt });
    setUserAnswer('');
    setStatus('answering');
    setRoundId((prev) => prev + 1);

    // 听音题自动播放
    if (quizType.startsWith('audio-')) {
      setTimeout(() => {
        speak(correctAnswer);
      }, 300);
    }
  }, [data, numberRange, quizTypes, speak]);

  // 3. 处理答对
  const handleSuccess = useCallback(() => {
    setStatus('success');
    playSound('score');
    triggerHaptic('success');
    setTimeout(() => {
      generateNewQuiz();
    }, 600);
  }, [playSound, triggerHaptic, generateNewQuiz]);

  // 4. 处理答错
  const handleFailure = useCallback(
    (wrongAnswer: string) => {
      setStatus('error');
      playSound('failure');
      triggerHaptic('error');

      if (currentQuiz) {
        onMistake(
          currentQuiz.num,
          wrongAnswer,
          currentQuiz.correctAnswer,
          currentQuiz.type
        );
      }

      setTimeout(() => {
        generateNewQuiz();
        onContinue?.();
      }, nextQuestionDelay);
    },
    [
      currentQuiz,
      onMistake,
      playSound,
      triggerHaptic,
      generateNewQuiz,
      onContinue,
      nextQuestionDelay,
    ]
  );

  // 5. 键盘点击处理
  const handleKeyClick = useCallback(
    (value: number | string) => {
      if (status !== 'answering' || !currentQuiz) return;

      const strValue = String(value);
      const newAnswer = userAnswer + strValue;
      setUserAnswer(newAnswer);

      if (newAnswer === currentQuiz.correctAnswer) {
        handleSuccess();
      } else if (newAnswer.length >= currentQuiz.correctAnswer.length) {
        handleFailure(newAnswer);
      }
    },
    [status, currentQuiz, userAnswer, handleSuccess, handleFailure]
  );

  // 6. 退格处理 (需要当前键盘配置来判断是删一个字还是删一个词)
  // 获取当前键盘配置 (利用 useMemo 缓存)
  const currentKeyboard = useMemo(() => {
    if (!currentQuiz) return [];
    return getKeyboardForQuizType(
      currentQuiz.type,
      level,
      currentQuiz.correctAnswer
    );
  }, [currentQuiz, level]);

  const handleBackspace = useCallback(() => {
    if (userAnswer.length === 0) return;

    // 尝试匹配键盘上的词条（长词优先），实现“整块删除”
    const fragments = currentKeyboard
      .map((f) => f.value)
      .sort((a, b) => b.length - a.length);

    for (const frag of fragments) {
      if (userAnswer.endsWith(frag)) {
        setUserAnswer(userAnswer.slice(0, -frag.length));
        return;
      }
    }
    // 默认删除一个字符
    setUserAnswer(userAnswer.slice(0, -1));
  }, [userAnswer, currentKeyboard]);

  // 初始化
  useEffect(() => {
    generateNewQuiz();
  }, []);

  // ==================== 渲染层 ====================

  return (
    <div className={styles.container}>
      {/* 1. 题目区 */}
      <div className={styles.gameArea}>
        <TestPrompt
          quiz={currentQuiz}
          roundId={roundId}
          onPlayAudio={() => currentQuiz && speak(currentQuiz.correctAnswer)}
        />
      </div>

      {/* 2. 答案区 */}
      {currentQuiz && (
        <TestAnswer
          userAnswer={userAnswer}
          // correctLength={currentQuiz.correctAnswer.length}
          status={status}
          onBackspace={handleBackspace}
        />
      )}

      {/* 3. 键盘区 */}
      {currentQuiz && (
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
      )}
    </div>
  );
};
