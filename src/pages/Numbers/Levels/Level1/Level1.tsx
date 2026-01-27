import { useState, useRef, useEffect } from 'react';
import { BookOpen, Swords } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './Level1.module.css';

import { Level1Learn } from './Level1Learn';
import { Level1Test } from './Level1Test';
import { CategoryTabs } from '../../../../components/CategoryTabs';
import { Toast } from '../../../../components/Toast/Toast';

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

  // 手动切换模式时的处理
  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    if (newMode === 'test') {
      setReviewNum(null);
    }
  };

  const modeOptions = [
    {
      id: 'learn',
      label: t('number_study.common.mode_learn'),
      icon: <BookOpen size={16} />,
    },
    {
      id: 'test',
      label: t('number_study.common.mode_test'),
      icon: <Swords size={16} />,
    },
  ];

  return (
    <div className={styles.container}>
      <Toast
        isVisible={toastConfig.isVisible}
        message={toastConfig.message}
        description={toastConfig.description}
      />

      <div className={styles.header}>
        <div style={{ width: '240px' }}>
          <CategoryTabs
            options={modeOptions}
            activeId={mode}
            onChange={(id) => handleModeChange(id as Mode)}
            renderTab={(item) => (
              <>
                {item.icon}
                <span>{item.label}</span>
              </>
            )}
          />
        </div>
      </div>

      {mode === 'learn' ? (
        <Level1Learn initialNum={reviewNum} />
      ) : (
        <Level1Test onMistake={handleMistake} />
      )}
    </div>
  );
};
