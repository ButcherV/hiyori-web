import { useState, useRef, useEffect, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import {
  NumberTestEngine,
  LEVEL_2_DATA,
  type QuizType,
  DEFAULT_NEXT_QUESTION_DELAY,
} from '../NumberTestEngine';
// import { ModeToggleFAB } from '../ModeToggleFAB';
import { Toast } from '../../../../components/Toast/Toast';
import styles from './Level2.module.css';

// Level 2 暂时只有 Test 模式
export const Level2 = () => {
  const { t } = useTranslation();

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

  // 生成 11-99 的数字范围
  const numberRange = Array.from({ length: 89 }, (_, i) => i + 11);

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

  // Level 2 题型配置 - 多样化考察
  const quizTypes = [
    'arabic-to-kana',
    'arabic-to-kanji',
    'kanji-to-kana',
    'kana-to-arabic',
    'formula-to-kana',
    'audio-to-arabic',
  ] as const;

  return (
    <div className={styles.container}>
      <Toast
        isVisible={toastConfig.isVisible}
        message={toastConfig.message}
        description={toastConfig.description}
      />

      {/* Level 2 只有 test 模式，不需要切换按钮，但保留占位保持布局一致 */}
      <div className={styles.fabPlaceholder} />

      <NumberTestEngine
        data={LEVEL_2_DATA}
        numberRange={numberRange}
        quizTypes={[...quizTypes]}
        onMistake={handleMistake}
        onContinue={() => {}} // Toast 消失后自动继续下一题
      />
    </div>
  );
};

export default Level2;
