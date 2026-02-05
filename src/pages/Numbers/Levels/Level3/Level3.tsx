import { useState, useRef, useEffect, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Level3Learn } from './Level3Learn';
import {
  NumberTestEngine,
  LEVEL_3_DATA,
  type QuizType,
  DEFAULT_NEXT_QUESTION_DELAY,
} from '../NumberTestEngine';
import { ModeToggleFAB } from '../ModeToggleFAB';
import { Toast } from '../../../../components/Toast/Toast';
import styles from './Level3.module.css';

type Mode = 'learn' | 'test';

export const Level3 = () => {
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

  // 生成 100-999 的数字范围
  const numberRange = Array.from({ length: 900 }, (_, i) => i + 100);

  // 错误处理
  const handleMistake = (
    _targetNum: number,
    _userAnswer: string,
    correctAnswer: string,
    quizType: QuizType
  ) => {
    // 如果题型是 "xxx-to-arabic"，说明答案是阿拉伯数字，不需要日文字体。
    // 反之 (to-kana, to-kanji)，答案肯定是日文，需要加 jaFont。
    const isArabicAnswer = quizType.endsWith('to-arabic');

    setToastConfig({
      isVisible: true,
      message: t('number_study.numbers.interaction.toast_wrong_title'),
      description: (
        <span>
          {t('number_study.numbers.interaction.toast_correct_answer_label')}
          <span
            // 如果不是阿拉伯数字，就加上日文字体样式
            className={!isArabicAnswer ? 'jaFont' : ''}
            style={{ fontWeight: 'bold', marginLeft: 6, fontSize: '1.1em' }}
          >
            {correctAnswer}
          </span>
        </span>
      ),
    });

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setToastConfig((prev) => ({ ...prev, isVisible: false }));
    }, DEFAULT_NEXT_QUESTION_DELAY);
  };

  const handleToggleMode = () => {
    setMode((prev) => (prev === 'learn' ? 'test' : 'learn'));
  };

  // Level 3 题型配置
  const quizTypes = [
    'arabic-to-kana',
    'arabic-to-kanji',
    'kanji-to-kana',
    'kana-to-arabic',
    'audio-to-arabic',
    'audio-to-kanji',
    'audio-to-kana',
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
        <Level3Learn />
      ) : (
        <NumberTestEngine
          data={LEVEL_3_DATA}
          numberRange={numberRange}
          quizTypes={[...quizTypes]}
          onMistake={handleMistake}
          level={3}
        />
      )}
    </div>
  );
};

export default Level3;
