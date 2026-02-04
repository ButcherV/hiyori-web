// Level 2: 十位组合 (11-99) - 纯测试模式
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NumberTestEngine, LEVEL_2_DATA } from '../NumberTestEngine';
import { ModeToggleFAB } from '../ModeToggleFAB';
import { Toast } from '../../../../components/Toast/Toast';
import styles from './Level2.module.css';

// Level 2 只有 Test 模式
export const Level2 = () => {
  const { t } = useTranslation();

  // Toast 状态
  const [toastConfig, setToastConfig] = useState({
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
    targetNum: number,
    userAnswer: string,
    correctAnswer: string
  ) => {
    setToastConfig({
      isVisible: true,
      message: t('number_study.numbers.interaction.toast_wrong_title'),
      // 显示真正的正确答案（假名/汉字），而非阿拉伯数字
      description: `正确答案是：${correctAnswer}`,
    });

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setToastConfig((prev) => ({ ...prev, isVisible: false }));
    }, 2000);
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
