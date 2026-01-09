import React, { useState, useLayoutEffect, useMemo } from 'react';
import styles from './LessonMenu.module.css';
import { MenuRow } from './MenuRow';

import { CategoryTabs } from '../CategoryTabs';
import type { TabOption } from '../CategoryTabs';

import { useScrollShadow } from '../../hooks/useScrollShadow';

import {
  HIRAGANA_DATA,
  KATAKANA_DATA,
  type LessonItem,
  type LessonCategory,
  type LessonStatus,
} from '../../datas/kanaDataCategory';

import { useProgress } from '../../context/ProgressContext';

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

  const { completedLessons } = useProgress();
  // LocalStorage - ['row-a', 'row-ka', ...]

  const tabOptions: TabOption[] = [
    { id: 'seion', label: 'Seion', ja: '(清音)' },
    { id: 'dakuon', label: 'Dakuon', ja: '(濁音)' },
    { id: 'yoon', label: 'Yoon', ja: '(拗音)' },
  ];

  const currentDataSet = script === 'hiragana' ? HIRAGANA_DATA : KATAKANA_DATA;

  const lessonStatusMap = useMemo(() => {
    return getStatusMap(currentDataSet, completedLessons);
  }, [currentDataSet, completedLessons]);

  const visibleLessons = currentDataSet.filter(
    (item) => item.category === activeTab
  );

  const handleTabChange = (newTabId: string) => {
    setActiveTab(newTabId as LessonCategory);
  };

  // 当 script 变化时，根据进度自动跳转到对应的 Tab
  useLayoutEffect(() => {
    const data = script === 'hiragana' ? HIRAGANA_DATA : KATAKANA_DATA;
    const currentLesson = data.find(
      (item) => !completedLessons.includes(item.id)
    );

    if (currentLesson) {
      setActiveTab(currentLesson.category);
    } else {
      setActiveTab('seion');
    }
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
