import { useState } from 'react';
import { BookOpen, Swords } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './Level1.module.css';

import { Level1Learn } from './Level1Learn';
import { Level1Test } from './Level1Test';
import { CategoryTabs } from '../../../../components/CategoryTabs';

type Mode = 'learn' | 'test';

export const Level1 = () => {
  const { t } = useTranslation();

  // 1. 状态自治：Level 1 自己管理模式
  const [mode, setMode] = useState<Mode>('learn');

  // 定义开关选项
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
      {/* 顶部开关*/}
      <div className={styles.header}>
        <div style={{ width: '240px' }}>
          <CategoryTabs
            options={modeOptions}
            activeId={mode}
            onChange={(id) => setMode(id as Mode)}
            renderTab={(item) => (
              <>
                {item.icon}
                <span>{item.label}</span>
              </>
            )}
          />
        </div>
      </div>

      {/* 舞台内容切换 */}
      {mode === 'learn' ? <Level1Learn /> : <Level1Test />}
    </div>
  );
};
