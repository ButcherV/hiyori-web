import React, { useState, useLayoutEffect, useMemo } from 'react';
// 1. 引入路由钩子
import { useNavigate } from 'react-router-dom';

import styles from './LessonMenu.module.css';
import { MenuRow } from './MenuRow';
import type { LessonItem, LessonStatus, LessonCategory } from './types';

import { CategoryTabs } from '../CategoryTabs';
import type { TabOption } from '../CategoryTabs';

import { useScrollShadow } from '../../hooks/useScrollShadow';

// --- 静态数据定义 ---

const HIRAGANA_DATA: LessonItem[] = [
  // --- 清音 (Seion) ---
  {
    id: 'row-a',
    category: 'seion',
    title: 'A - Row',
    preview: 'あ い う え お',
  },
  {
    id: 'row-ka',
    category: 'seion',
    title: 'Ka - Row',
    preview: 'か き く け こ',
  },
  {
    id: 'row-sa',
    category: 'seion',
    title: 'Sa - Row',
    preview: 'さ し す せ そ',
  },
  {
    id: 'row-ta',
    category: 'seion',
    title: 'Ta - Row',
    preview: 'た ち つ て と',
  },
  {
    id: 'row-na',
    category: 'seion',
    title: 'Na - Row',
    preview: 'な に ぬ ね の',
  },
  {
    id: 'row-ha',
    category: 'seion',
    title: 'Ha - Row',
    preview: 'は ひ ふ へ ほ',
  },
  {
    id: 'row-ma',
    category: 'seion',
    title: 'Ma - Row',
    preview: 'ま み む め も',
  },
  { id: 'row-ya', category: 'seion', title: 'Ya - Row', preview: 'や ゆ よ' },
  {
    id: 'row-ra',
    category: 'seion',
    title: 'Ra - Row',
    preview: 'ら り る れ ろ',
  },
  { id: 'row-wa', category: 'seion', title: 'Wa - Row', preview: 'わ を ん' },
  // --- 浊音 ---
  {
    id: 'row-ga',
    category: 'dakuon',
    title: 'Ga - Row',
    preview: 'が ぎ ぐ げ ご',
  },
  {
    id: 'row-za',
    category: 'dakuon',
    title: 'Za - Row',
    preview: 'ざ じ ず ぜ ぞ',
  },
  {
    id: 'row-da',
    category: 'dakuon',
    title: 'Da - Row',
    preview: 'だ ぢ づ で ど',
  },
  {
    id: 'row-ba',
    category: 'dakuon',
    title: 'Ba - Row',
    preview: 'ば び ぶ べ ぼ',
  },
  {
    id: 'row-pa',
    category: 'dakuon',
    title: 'Pa - Row',
    preview: 'ぱ ぴ ぷ ぺ ぽ',
  },
  // --- 拗音 ---
  {
    id: 'row-kya',
    category: 'yoon',
    title: 'Kya - Row',
    preview: 'きゃ きゅ きょ',
  },
  {
    id: 'row-sha',
    category: 'yoon',
    title: 'Sha - Row',
    preview: 'しゃ しゅ しょ',
  },
  {
    id: 'row-cha',
    category: 'yoon',
    title: 'Cha - Row',
    preview: 'ちゃ ちゅ ちょ',
  },
  {
    id: 'row-nya',
    category: 'yoon',
    title: 'Nya - Row',
    preview: 'にゃ にゅ にょ',
  },
  {
    id: 'row-hya',
    category: 'yoon',
    title: 'Hya - Row',
    preview: 'ひゃ ひゅ ひょ',
  },
  {
    id: 'row-mya',
    category: 'yoon',
    title: 'Mya - Row',
    preview: 'みゃ みゅ みょ',
  },
  {
    id: 'row-rya',
    category: 'yoon',
    title: 'Rya - Row',
    preview: 'りゃ りゅ りょ',
  },
  {
    id: 'row-gya',
    category: 'yoon',
    title: 'Gya - Row',
    preview: 'ぎゃ ぎゅ ぎょ',
  },
  {
    id: 'row-ja',
    category: 'yoon',
    title: 'Ja - Row',
    preview: 'じゃ じゅ じょ',
  },
  {
    id: 'row-bya',
    category: 'yoon',
    title: 'Bya - Row',
    preview: 'びゃ びゅ びょ',
  },
  {
    id: 'row-pya',
    category: 'yoon',
    title: 'Pya - Row',
    preview: 'ぴゃ ぴゅ ぴょ',
  },
];

const KATAKANA_DATA: LessonItem[] = [
  // --- 清音 ---
  {
    id: 'k-row-a',
    category: 'seion',
    title: 'A - Row',
    preview: 'ア イ ウ エ オ',
  },
  {
    id: 'k-row-ka',
    category: 'seion',
    title: 'Ka - Row',
    preview: 'カ キ ク ケ コ',
  },
  {
    id: 'k-row-sa',
    category: 'seion',
    title: 'Sa - Row',
    preview: 'サ シ ス セ ソ',
  },
  {
    id: 'k-row-ta',
    category: 'seion',
    title: 'Ta - Row',
    preview: 'タ チ ツ テ ト',
  },
  {
    id: 'k-row-na',
    category: 'seion',
    title: 'Na - Row',
    preview: 'ナ ニ ヌ ネ ノ',
  },
  {
    id: 'k-row-ha',
    category: 'seion',
    title: 'Ha - Row',
    preview: 'ハ ヒ フ ヘ ホ',
  },
  {
    id: 'k-row-ma',
    category: 'seion',
    title: 'Ma - Row',
    preview: 'マ ミ ム メ モ',
  },
  { id: 'k-row-ya', category: 'seion', title: 'Ya - Row', preview: 'ヤ ユ ヨ' },
  {
    id: 'k-row-ra',
    category: 'seion',
    title: 'Ra - Row',
    preview: 'ラ リ ル レ ロ',
  },
  { id: 'k-row-wa', category: 'seion', title: 'Wa - Row', preview: 'ワ ヲ ン' },
  // --- 浊音 ---
  {
    id: 'k-row-ga',
    category: 'dakuon',
    title: 'Ga - Row',
    preview: 'ガ ギ グ ゲ ゴ',
  },
  {
    id: 'k-row-za',
    category: 'dakuon',
    title: 'Za - Row',
    preview: 'ザ ジ ズ ゼ ゾ',
  },
  {
    id: 'k-row-da',
    category: 'dakuon',
    title: 'Da - Row',
    preview: 'ダ ヂ ヅ デ ド',
  },
  {
    id: 'k-row-ba',
    category: 'dakuon',
    title: 'Ba - Row',
    preview: 'バ ビ ブ ベ ボ',
  },
  {
    id: 'k-row-pa',
    category: 'dakuon',
    title: 'Pa - Row',
    preview: 'パ ピ プ ペ ポ',
  },
  // --- 拗音 ---
  {
    id: 'k-row-kya',
    category: 'yoon',
    title: 'Kya - Row',
    preview: 'キャ キュ キョ',
  },
  {
    id: 'k-row-sha',
    category: 'yoon',
    title: 'Sha - Row',
    preview: 'シャ シュ ショ',
  },
  {
    id: 'k-row-cha',
    category: 'yoon',
    title: 'Cha - Row',
    preview: 'チャ チュ チョ',
  },
  {
    id: 'k-row-nya',
    category: 'yoon',
    title: 'Nya - Row',
    preview: 'ニャ ニュ ニョ',
  },
  {
    id: 'k-row-hya',
    category: 'yoon',
    title: 'Hya - Row',
    preview: 'ヒャ ヒュ ヒョ',
  },
  {
    id: 'k-row-mya',
    category: 'yoon',
    title: 'Mya - Row',
    preview: 'ミャ ミュ ミョ',
  },
  {
    id: 'k-row-rya',
    category: 'yoon',
    title: 'Rya - Row',
    preview: 'リャ リュ リョ',
  },
  {
    id: 'k-row-gya',
    category: 'yoon',
    title: 'Gya - Row',
    preview: 'ギャ ギュ ギョ',
  },
  {
    id: 'k-row-ja',
    category: 'yoon',
    title: 'Ja - Row',
    preview: 'ジャ ジュ ジョ',
  },
  {
    id: 'k-row-bya',
    category: 'yoon',
    title: 'Bya - Row',
    preview: 'ビャ ビュ ビョ',
  },
  {
    id: 'k-row-pya',
    category: 'yoon',
    title: 'Pya - Row',
    preview: 'ピャ ピュ ピョ',
  },
];

// --- 逻辑函数 ---

// 逻辑：已完成的 -> mastered; 第一个未完成的 -> current; 剩下的 -> new
const getStatusMap = (allLessons: LessonItem[], finishedIds: string[]) => {
  const statusMap: Record<string, LessonStatus> = {};

  // 标记是否已经找到了当前的进度点
  let foundCurrent = false;

  allLessons.forEach((lesson) => {
    // 1. 只要 ID 在已完成列表里，那就是 master
    if (finishedIds.includes(lesson.id)) {
      statusMap[lesson.id] = 'mastered';
    }
    // 2. 如果还没找到 current，且当前这个没学完 -> 它就是 current
    else if (!foundCurrent) {
      statusMap[lesson.id] = 'current';
      foundCurrent = true; // 找到了！把门关上，后面的都是 new
    }
    // 3. 剩下的所有未完成的 -> new (Locked)
    else {
      statusMap[lesson.id] = 'new';
    }
  });

  return statusMap;
};

// --- 类型与组件定义 ---

export type ScriptType = 'hiragana' | 'katakana';

interface LessonMenuProps {
  script: ScriptType;
  onSelect?: (lessonId: string) => void;
}

const LessonMenu: React.FC<LessonMenuProps> = ({ script, onSelect }) => {
  // 2. 初始化路由钩子
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<LessonCategory>('seion');
  const { scrollRef, isScrolled } = useScrollShadow();

  // --- 模拟用户数据 ---
  const [finishedIds] = useState<string[]>([
    'row-a', // 平假名第1行 (已完成)
    'row-sa', // 平假名第3行 (已完成 - 跳过了 row-ka)
    'k-row-a', // 片假名第1行 (已完成)
  ]);

  const tabOptions: TabOption[] = [
    { id: 'seion', label: 'Seion', ja: '(清音)' },
    { id: 'dakuon', label: 'Dakuon', ja: '(濁音)' },
    { id: 'yoon', label: 'Yoon', ja: '(拗音)' },
  ];

  // 1. 根据 script 确定使用哪个数据源
  const currentDataSet = script === 'hiragana' ? HIRAGANA_DATA : KATAKANA_DATA;

  // 2. 根据数据源和已完成列表，动态生成状态 Map
  const lessonStatusMap = useMemo(() => {
    return getStatusMap(currentDataSet, finishedIds);
  }, [currentDataSet, finishedIds]);

  // 3. 根据 Tab 筛选显示列表
  const visibleLessons = currentDataSet.filter(
    (item) => item.category === activeTab
  );

  const handleTabChange = (newTabId: string) => {
    setActiveTab(newTabId as LessonCategory);
  };

  // UX优化：当 script 变化时，重置 Tab 为第一页
  useLayoutEffect(() => {
    setActiveTab('seion');
  }, [script]);

  // UX优化：防止白屏，切换数据时滚回顶部
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
          // 获取该课程的状态
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
                // navigate(`/study/${item.id}`, {
                //   state: {
                //     targetChars: targetChars,
                //   },
                // });
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default LessonMenu;
