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
import { useSettings } from '../../context/SettingsContext';

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
  const { lastHiraganaTab, lastKatakanaTab, updateSettings } = useSettings();

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

    if (script === 'hiragana') {
      updateSettings({ lastHiraganaTab: newTabId });
    } else {
      updateSettings({ lastKatakanaTab: newTabId });
    }
  };

  useLayoutEffect(() => {
    // 1. 获取当前应该显示的 Tab (从设置里读)
    const savedTab = script === 'hiragana' ? lastHiraganaTab : lastKatakanaTab;

    // 2. 判断逻辑：
    // 如果 savedTab 不是默认的 'seion'，说明用户手动切换过，我们要尊重用户的选择。
    // 如果 savedTab 是 'seion' (或者没存)，我们保留“智能进度跳转”功能，帮用户定位到没学的课。

    if (savedTab && savedTab !== 'seion') {
      setActiveTab(savedTab as LessonCategory);
    } else {
      // --- 智能跳转逻辑 (你原来的逻辑) ---
      const data = script === 'hiragana' ? HIRAGANA_DATA : KATAKANA_DATA;
      const currentLesson = data.find(
        (item) => !completedLessons.includes(item.id)
      );
      if (currentLesson) {
        setActiveTab(currentLesson.category);
      } else {
        setActiveTab('seion');
      }
    }
  }, [script]); // 注意：依赖项不要加 settings，只在 script 改变时触发一次初始化

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
                if (onSelect) {
                  onSelect(item.id, item.preview);
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
