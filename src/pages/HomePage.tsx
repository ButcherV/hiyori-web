import React, { useState } from 'react'; 
import styles from "./HomePage.module.css";
import BottomSheet from '../components/BottomSheet'; 
import LessonMenu from '../components/LessonMenu';

import { 
  Hash, Calendar, Zap, Type, BookOpen, 
  Headphones, Mic, Trophy 
} from "lucide-react";

interface HomePageProps {
  onCategorySelect: (categoryId: string) => void;
}

export function HomePage({ onCategorySelect }: HomePageProps) {
  const [isSelectionOpen, setSelectionOpen] = useState(false);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  // --- 数据定义 (不变) ---
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

  // 处理 Hero 卡片点击
  const handleHeroClick = (id: string) => {
    if (id === 'hiragana') {
      setSelectionOpen(true); // 打开弹窗
    } else {
      onCategorySelect(id);
    }
  };

  // ✅ 2. 新增：处理课程选择事件
  const handleLessonSelect = (lessonId: string) => {
    console.log("用户选择了课程:", lessonId);
    setSelectionOpen(false); // 选完关闭弹窗
    
    // TODO: 这里将来调用 onCategorySelect 或 navigation 跳转到学习页
    // onCategorySelect(lessonId); 
  };

  return (
    <div className={styles.container}>
      
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.date}>{today.toUpperCase()}</div>
        <div className={styles.title}>Dashboard</div>
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

      {/* ✅ 3. 挂载 LessonMenu 组件 */}
      <BottomSheet 
        isOpen={isSelectionOpen} 
        onClose={() => setSelectionOpen(false)} 
        title="Select Hiragana Row"
      >
        <LessonMenu onSelect={handleLessonSelect} />
      </BottomSheet>

    </div>
  );
}