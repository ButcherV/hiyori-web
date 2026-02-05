// src/pages/Numbers/Levels/Level4/Level4.tsx

import { useState, useRef, useEffect, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Level4Learn } from './Level4Learn';
import {
  NumberTestEngine,
  LEVEL_4_DATA,
  type QuizType,
  DEFAULT_NEXT_QUESTION_DELAY,
} from '../NumberTestEngine';
import { ModeToggleFAB } from '../ModeToggleFAB';
import { Toast } from '../../../../components/Toast/Toast';
import styles from './Level4.module.css';

type Mode = 'learn' | 'test';

export const Level4 = () => {
  const { t } = useTranslation();
  const [mode, setMode] = useState<Mode>('learn');

  // Toast 状态
  const [toastConfig, setToastConfig] = useState<{
    isVisible: boolean;
    message: string;
    description: string | ReactNode;
  }>({
    isVisible: false,
    message: '',
    description: '',
  });

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // 生成 1000-9999 的数字范围
  const numberRange = Array.from({ length: 9000 }, (_, i) => i + 1000);

  // 错误处理
  const handleMistake = (
    _targetNum: number,
    _userAnswer: string,
    correctAnswer: string,
    quizType: QuizType
  ) => {
    const isArabicAnswer = quizType.endsWith('to-arabic');

    setToastConfig({
      isVisible: true,
      message: t('number_study.numbers.interaction.toast_wrong_title'),
      description: (
        <div className={styles.toastContent}>
          <span className={styles.toastLabel}>
            {t('number_study.numbers.interaction.toast_correct_answer_label')}
          </span>
          <span
            // 组合类名：模块化样式 + 全局日文字体类
            className={`${styles.toastAnswer} ${!isArabicAnswer ? 'jaFont' : ''}`}
          >
            {correctAnswer}
          </span>
        </div>
      ),
    });

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setToastConfig((prev) => ({ ...prev, isVisible: false }));
    }, DEFAULT_NEXT_QUESTION_DELAY - 200); // 建议保留 -200 的缓冲
  };

  const handleToggleMode = () => {
    setMode((prev) => (prev === 'learn' ? 'test' : 'learn'));
  };

  // Level 4 题型配置
  const quizTypes = [
    'arabic-to-kana',
    'kanji-to-kana',
    'kana-to-arabic',
    'audio-to-arabic',
    'audio-to-kanji',
    'audio-to-kana',
    'arabic-to-kanji',
  ] as const;

  return (
    <div className={styles.container}>
      <Toast
        isVisible={toastConfig.isVisible}
        message={toastConfig.message}
        description={toastConfig.description}
      />

      <ModeToggleFAB mode={mode} onToggle={handleToggleMode} />

      {mode === 'learn' ? (
        <Level4Learn />
      ) : (
        <div className={styles.testWrapper}>
          <NumberTestEngine
            data={LEVEL_4_DATA}
            numberRange={numberRange}
            quizTypes={[...quizTypes]}
            onMistake={handleMistake}
            level={4}
          />
        </div>
      )}
    </div>
  );
};

export default Level4;
