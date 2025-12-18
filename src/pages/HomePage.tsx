import React, { useState, useMemo } from 'react'; 
import styles from "./HomePage.module.css";

// 引入组件
import BottomSheet from '../components/BottomSheet'; 
import LessonMenu from '../components/LessonMenu';
import SettingsMenu from '../components/SettingsMenu'; 

// 引入类型
import type { ScriptType } from '../components/LessonMenu'; 

// 引入工具函数
import { 
  getJapaneseGreeting, 
  getJapaneseDateStr, 
  getJapaneseWeekday, 
  getJapaneseHoliday,
  isRedDay 
} from '../utils/dateHelper';

// 引入图标
import { 
  Hash, Calendar, Zap, Type, BookOpen, 
  Headphones, Mic, Trophy, 
  Settings, 
  Search    
} from "lucide-react";

interface HomePageProps {
  onCategorySelect: (categoryId: string) => void;
}

export function HomePage({ onCategorySelect }: HomePageProps) {
  // --- 状态管理 ---
  const [isSelectionOpen, setSelectionOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [currentScript, setCurrentScript] = useState<ScriptType>('hiragana');

  // --- 🔥 核心修改：组装 Header 数据 ---
  const headerData = useMemo(() => {
    const now = new Date();
    
    // 1. 获取各个原子部分
    const datePart = getJapaneseDateStr(now);    // "12月18日"
    const weekPart = getJapaneseWeekday(now);    // "木曜日"
    const holidayPart = getJapaneseHoliday(now); // "元日" 或 null
    const isRed = isRedDay(now);                 // true/false (用于变红)

    // 2. 拼装逻辑 (UI 决定怎么展示)
    // 格式：日期 + 空格 + 星期
    let fullDateText = `${datePart} ${weekPart}`;
    
    // 如果是节日，追加 " · 节日名"
    if (holidayPart) {
      fullDateText += ` · ${holidayPart}`;
    }

    return {
      greeting: getJapaneseGreeting(now),
      fullDateText,
      isRed
    };
  }, []);

  // --- 数据定义 (保持不变) ---
  const heroCourses = [
    {
      id: 'hiragana',
      label: 'CURRENT SESSION',
      title: 'Hiragana\nBasics',
      char: 'あ',
      progress: '45%',
      color: '#007AFF',
      trackColor: 'rgba(255,255,255,0.3)'
    },
    {
      id: 'katakana',
      label: 'NEXT MILESTONE',
      title: 'Katakana\nMastery',
      char: 'ア',
      progress: '10%',
      color: '#FF2D55',
      trackColor: 'rgba(255,255,255,0.3)'
    }
  ];

  const drills = [
    { id: 'numbers', title: 'Numbers', sub: '1 - 100 & Prices', icon: Hash, color: '#FF9500' },
    { id: 'dates', title: 'Dates', sub: 'Week & Month', icon: Calendar, color: '#30B0C7' },
    { id: 'vocab', title: 'Vocab', sub: 'Survival Words', icon: Zap, color: '#AF52DE' },
    { id: 'kanji', title: 'Kanji', sub: 'N5 Essentials', icon: Type, color: '#FF3B30' },
    { id: 'grammar', title: 'Grammar', sub: 'Particles & Verbs', icon: BookOpen, color: '#5856D6' },
    { id: 'listening', title: 'Listening', sub: 'Daily Audio', icon: Headphones, color: '#00C7BE' },
    { id: 'speaking', title: 'Speaking', sub: 'Pronunciation', icon: Mic, color: '#34C759' },
    { id: 'challenge', title: 'Challenge', sub: 'Weekly Quiz', icon: Trophy, color: '#FFcc00' },
  ];

  // --- 交互逻辑 ---
  const handleHeroClick = (id: string) => {
    if (id === 'hiragana' || id === 'katakana') {
      setCurrentScript(id as ScriptType);
      setSelectionOpen(true);
    } else {
      onCategorySelect(id);
    }
  };

  const handleLessonSelect = (lessonId: string) => {
    console.log(`User Selected: ${lessonId}`);
    setSelectionOpen(false); 
  };

  const handleSearchClick = () => {
    console.log("Open Search Modal (Todo)");
  };

  return (
    <div className={styles.container}>
      
      {/* Header */}
      <header className={styles.header}>
        {/* 左侧：日期和日语问候 */}
        <div className={styles.headerText}>
          {/* 🔥 动态样式：如果是红日子，添加 holidayDate 类 */}
          <div className={`${styles.date} ${headerData.isRed ? styles.holidayDate : ''}`}>
            {headerData.fullDateText}
          </div>
          <div className={styles.japaneseTitle}>{headerData.greeting}</div>
        </div>
        
        {/* 右侧：操作按钮组 */}
        <div className={styles.headerActions}>
          <button 
            className={styles.iconBtn} 
            onClick={handleSearchClick}
            aria-label="Search"
          >
            <Search size={24} strokeWidth={2} />
          </button>

          <button 
            className={styles.iconBtn} 
            onClick={() => setSettingsOpen(true)}
            aria-label="Settings"
          >
            <Settings size={24} strokeWidth={2} />
          </button>
        </div>
      </header>

      {/* Hero Banner */}
      <div className={styles.scrollContainer}>
        {heroCourses.map((course) => (
          <div 
            key={course.id}
            className={styles.heroCard} 
            style={{ backgroundColor: course.color }}
            onClick={() => handleHeroClick(course.id)}
          >
            <div className={styles.heroDecor}>{course.char}</div>
            <div className={styles.heroTop}>
              <div className={styles.heroLabel}>{course.label}</div>
              <div className={styles.heroTitle} style={{ whiteSpace: 'pre-wrap' }}>
                {course.title}
              </div>
            </div>
            <div className={styles.heroBottom}>
              <div className={styles.progressTrack} style={{ background: course.trackColor }}>
                <div className={styles.progressFill} style={{ width: course.progress }} />
              </div>
              <div className={styles.progressText}>{course.progress}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Grid Section */}
      <div className={styles.sectionHeader}>Quick Drills</div>
      <div className={styles.grid}>
        {drills.map((item) => (
          <div key={item.id} className={styles.card} onClick={() => onCategorySelect(item.id)}>
            <div className={styles.iconBox} style={{ backgroundColor: item.color }}>
              <item.icon size={24} strokeWidth={2.5} />
            </div>
            <div>
              <div className={styles.cardTitle}>{item.title}</div>
              <div className={styles.cardSub}>{item.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Sheets */}
      <BottomSheet 
        isOpen={isSelectionOpen} 
        onClose={() => setSelectionOpen(false)} 
        title={currentScript === 'hiragana' ? "Select Hiragana Row" : "Select Katakana Row"}
      >
        <LessonMenu script={currentScript} onSelect={handleLessonSelect} />
      </BottomSheet>

      <BottomSheet
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="Settings"
      >
        <SettingsMenu 
          currentLang="English" 
          onLanguageClick={() => console.log("Language clicked")}
        />
      </BottomSheet>

    </div>
  );
}