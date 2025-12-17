import React, { useState, useRef, useEffect } from 'react';
import styles from './LessonMenu.module.css';
import { MenuRow } from './MenuRow';
import type { LessonItem, LessonStatus, LessonCategory } from './types';

// ... (ALL_LESSONS 数据保持不变，省略以节省篇幅，请保留你之前复制的完整数据) ...
const ALL_LESSONS: LessonItem[] = [
  // --- 清音 (Seion) ---
  { id: 'row-a', category: 'seion', title: 'A - Row', preview: 'あ い う え お' },
  { id: 'row-ka', category: 'seion', title: 'Ka - Row', preview: 'か き く け こ' },
  { id: 'row-sa', category: 'seion', title: 'Sa - Row', preview: 'さ し す せ そ' },
  { id: 'row-ta', category: 'seion', title: 'Ta - Row', preview: 'た ち つ て と' },
  { id: 'row-na', category: 'seion', title: 'Na - Row', preview: 'な に ぬ ね の' },
  { id: 'row-ha', category: 'seion', title: 'Ha - Row', preview: 'は ひ ふ へ ほ' },
  { id: 'row-ma', category: 'seion', title: 'Ma - Row', preview: 'ま み む め も' },
  { id: 'row-ya', category: 'seion', title: 'Ya - Row', preview: 'や ゆ よ' },
  { id: 'row-ra', category: 'seion', title: 'Ra - Row', preview: 'ら り る れ ろ' },
  { id: 'row-wa', category: 'seion', title: 'Wa - Row', preview: 'わ を ん' },

  // --- 浊音 (Dakuon) ---
  { id: 'row-ga', category: 'dakuon', title: 'Ga - Row', preview: 'が ぎ ぐ げ ご' },
  { id: 'row-za', category: 'dakuon', title: 'Za - Row', preview: 'ざ じ ず ぜ ぞ' },
  { id: 'row-da', category: 'dakuon', title: 'Da - Row', preview: 'だ ぢ づ で ど' },
  { id: 'row-ba', category: 'dakuon', title: 'Ba - Row', preview: 'ば び ぶ べ ぼ' },
  { id: 'row-pa', category: 'dakuon', title: 'Pa - Row', preview: 'ぱ ぴ ぷ ぺ ぽ' },

  // --- 拗音 (Yoon) ---
  { id: 'row-kya', category: 'yoon', title: 'Kya - Row', preview: 'きゃ きゅ きょ' },
  { id: 'row-sha', category: 'yoon', title: 'Sha - Row', preview: 'しゃ しゅ しょ' },
  { id: 'row-cha', category: 'yoon', title: 'Cha - Row', preview: 'ちゃ ちゅ ちょ' },
  { id: 'row-nya', category: 'yoon', title: 'Nya - Row', preview: 'にゃ にゅ にょ' },
  { id: 'row-hya', category: 'yoon', title: 'Hya - Row', preview: 'ひゃ ひゅ ひょ' },
  { id: 'row-mya', category: 'yoon', title: 'Mya - Row', preview: 'みゃ みゅ みょ' },
  { id: 'row-rya', category: 'yoon', title: 'Rya - Row', preview: 'りゃ りゅ りょ' },
  { id: 'row-gya', category: 'yoon', title: 'Gya - Row', preview: 'ぎゃ ぎゅ ぎょ' },
  { id: 'row-ja',  category: 'yoon', title: 'Ja - Row',  preview: 'じゃ じゅ じょ' },
  { id: 'row-bya', category: 'yoon', title: 'Bya - Row', preview: 'びゃ びゅ びょ' },
  { id: 'row-pya', category: 'yoon', title: 'Pya - Row', preview: 'ぴゃ ぴゅ ぴょ' },
];

interface LessonMenuProps {
  onSelect: (lessonId: string) => void;
}

const LessonMenu: React.FC<LessonMenuProps> = ({ onSelect }) => {
  const [activeTab, setActiveTab] = useState<LessonCategory>('seion');
  
  // ✅ 1. 创建 Ref 来控制滚动容器
  const listRef = useRef<HTMLDivElement>(null);

  // 模拟进度
  const userProgress: Record<string, LessonStatus> = {
    'row-a': 'mastered',
    'row-ka': 'current',
    'row-ga': 'new',
  };

  const visibleLessons = ALL_LESSONS.filter(item => item.category === activeTab);

  // ✅ 2. 监听 Tab 变化，强制滚动回顶
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  return (
    <div className={styles.container}>
      
      {/* Tab 切换栏 */}
      <div className={styles.tabs}>
        <button 
          className={`${styles.tabBtn} ${activeTab === 'seion' ? styles.active : ''}`}
          onClick={() => setActiveTab('seion')}
        >
          Seion <span className={styles.jaText} lang="ja">(清音)</span>
        </button>
        
        <button 
          className={`${styles.tabBtn} ${activeTab === 'dakuon' ? styles.active : ''}`}
          onClick={() => setActiveTab('dakuon')}
        >
          {/* 🔴 重点修正：把 '浊' 改为日文汉字 '濁' */}
          Dakuon <span className={styles.jaText} lang="ja">(濁音)</span>
        </button>
        
        <button 
          className={`${styles.tabBtn} ${activeTab === 'yoon' ? styles.active : ''}`}
          onClick={() => setActiveTab('yoon')}
        >
          Yoon <span className={styles.jaText} lang="ja">(拗音)</span>
        </button>
      </div>

      {/* 绑定 ref 到滚动容器 */}
      <div className={styles.list} ref={listRef}>
        {visibleLessons.map((item) => {
          const status = userProgress[item.id] || 'new';
          return (
            <MenuRow 
              key={item.id}
              item={item}
              status={status}
              onClick={() => onSelect(item.id)}
            />
          );
        })}
      </div>

    </div>
  );
};

export default LessonMenu;