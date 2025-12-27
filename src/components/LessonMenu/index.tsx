import React, { useState, useLayoutEffect, useMemo } from 'react';
import styles from './LessonMenu.module.css';
import { MenuRow } from './MenuRow';
import type { LessonStatus } from './types'; // types 里如果还有 LessonItem 定义建议删掉，统一用 kanaData 里的

import { CategoryTabs } from '../CategoryTabs';
import type { TabOption } from '../CategoryTabs';

import { useScrollShadow } from '../../hooks/useScrollShadow';

// [1] 引入刚刚提取的数据和类型
import {
  HIRAGANA_DATA,
  KATAKANA_DATA,
  type LessonItem,
  type LessonCategory,
} from '../../datas/kanaData';

// [2] 引入真实进度管理
import { useProgress } from '../../context/ProgressContext';

// --- 逻辑函数 (保持你的原逻辑) ---
const getStatusMap = (allLessons: LessonItem[], finishedIds: string[]) => {
  const statusMap: Record<string, LessonStatus> = {};
  let foundCurrent = false;

  allLessons.forEach((lesson) => {
    if (finishedIds.includes(lesson.id)) {
      statusMap[lesson.id] = 'mastered';
    } else if (!foundCurrent) {
      statusMap[lesson.id] = 'current';
      foundCurrent = true;
    } else {
      statusMap[lesson.id] = 'new';
    }
  });

  return statusMap;
};

export type ScriptType = 'hiragana' | 'katakana';

interface LessonMenuProps {
  script: ScriptType;
  onSelect?: (lessonId: string, targetChars: string[]) => void;
}

const LessonMenu: React.FC<LessonMenuProps> = ({ script, onSelect }) => {
  const [activeTab, setActiveTab] = useState<LessonCategory>('seion');
  const { scrollRef, isScrolled } = useScrollShadow();

  // [3] 使用真实数据！不再用 useState 定义假数据
  const { completedLessons } = useProgress();
  // completedLessons 就是存在 LocalStorage 里的那个字符串数组 ['row-a', 'row-ka', ...]

  const tabOptions: TabOption[] = [
    { id: 'seion', label: 'Seion', ja: '(清音)' },
    { id: 'dakuon', label: 'Dakuon', ja: '(濁音)' },
    { id: 'yoon', label: 'Yoon', ja: '(拗音)' },
  ];

  const currentDataSet = script === 'hiragana' ? HIRAGANA_DATA : KATAKANA_DATA;

  // 根据数据源和已完成列表，动态生成状态 Map
  const lessonStatusMap = useMemo(() => {
    return getStatusMap(currentDataSet, completedLessons);
  }, [currentDataSet, completedLessons]);

  const visibleLessons = currentDataSet.filter(
    (item) => item.category === activeTab
  );

  const handleTabChange = (newTabId: string) => {
    setActiveTab(newTabId as LessonCategory);
  };

  useLayoutEffect(() => {
    setActiveTab('seion');
  }, [script]);

  useLayoutEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [activeTab, script]);

  return (
    <div className={styles.container}>
      <div
        className={`${styles.headerWrapper} ${isScrolled ? styles.showShadow : ''}`}
      >
        <CategoryTabs
          options={tabOptions}
          activeId={activeTab}
          onChange={handleTabChange}
          renderTab={(item) => (
            <>
              <span>{item.label}</span>
              <span className={styles.jaText} lang="ja">
                {item.ja}
              </span>
            </>
          )}
        />
      </div>

      <div className={styles.list} ref={scrollRef}>
        {visibleLessons.map((item) => {
          const status = lessonStatusMap[item.id];
          return (
            <MenuRow
              key={item.id}
              item={item}
              status={status}
              // 保留你的点击逻辑
              onClick={() => {
                const targetChars = item.preview.split(' ');
                if (onSelect) {
                  onSelect(item.id, targetChars);
                }
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default LessonMenu;
