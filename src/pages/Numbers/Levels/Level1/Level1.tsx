import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Level1.module.css';

import { Level1Learn } from './Level1Learn';
import { Level1Test } from './Level1Test';
import { Toast } from '../../../../components/Toast/Toast';
import { ModeToggleFAB, type LearnMode } from '../ModeToggleFAB';

type Mode = 'learn' | 'test';

export const Level1 = () => {
  const { t } = useTranslation();

  const [mode, setMode] = useState<Mode>('learn');

  // 记录需要复习的数字
  const [reviewNum, setReviewNum] = useState<number | null>(null);

  // Toast 状态管理
  const [toastConfig, setToastConfig] = useState({
    isVisible: false,
    message: '',
    description: '',
  });

  // 用于清理定时器，防止组件卸载后报错
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // 核心逻辑：处理答错
  const handleMistake = (targetNum: number) => {
    // 1. 设置要复习的数字
    setReviewNum(targetNum);

    // 2. 显示你的 Toast
    setToastConfig({
      isVisible: true,
      message: t('number_study.numbers.interaction.toast_wrong_title'),
      description: t('number_study.numbers.interaction.toast_wrong_desc', {
        val: targetNum,
      }),
    });

    // 3. 延迟 2秒 后，关闭 Toast 并跳转
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      // 隐藏 Toast
      setToastConfig((prev) => ({ ...prev, isVisible: false }));
      // 切换到学习模式
      setMode('learn');
    }, 2000);
  };

  const handleToggleMode = () => {
    const newMode = mode === 'learn' ? 'test' : 'learn';
    setMode(newMode);
    if (newMode === 'test') setReviewNum(null);
  };

  return (
    <div className={styles.container}>
      <Toast
        isVisible={toastConfig.isVisible}
        message={toastConfig.message}
        description={toastConfig.description}
      />

      <ModeToggleFAB mode={mode} onToggle={handleToggleMode} />

      {mode === 'learn' ? (
        <Level1Learn initialNum={reviewNum} />
      ) : (
        <Level1Test onMistake={handleMistake} />
      )}
    </div>
  );
};
