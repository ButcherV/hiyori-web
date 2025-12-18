import React, { useState, useMemo } from 'react'; 
import styles from "./HomePage.module.css";

// ✅ 1. 引入 i18n hook
import { useTranslation } from 'react-i18next';

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
  // ✅ 2. 初始化翻译函数
  const { t } = useTranslation();

  // --- 状态管理 ---
  const [isSelectionOpen, setSelectionOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [currentScript, setCurrentScript] = useState<ScriptType>('hiragana');

  // --- Header 数据 (保持原来的逻辑，沉浸式日语体验) ---
  const headerData = useMemo(() => {
    const now = new Date();
    
    const datePart = getJapaneseDateStr(now);    
    const weekPart = getJapaneseWeekday(now);    
    const holidayPart = getJapaneseHoliday(now); 
    const isRed = isRedDay(now);                 

    let fullDateText = `${datePart} ${weekPart}`;
    if (holidayPart) {
      fullDateText += ` · ${holidayPart}`;
    }

    return {
      greeting: getJapaneseGreeting(now),
      fullDateText,
      isRed
    };
  }, []);

  // --- 数据定义 (使用 t 函数替换硬编码) ---
  const heroCourses = [
    {
      id: 'hiragana',
      // ✅ 翻译 Label 和 Title
      label: t('home.hero.current_session'), 
      title: t('home.hero.hiragana_title'),
      char: 'あ',
      progress: '45%',
      color: '#007AFF',
      trackColor: 'rgba(255,255,255,0.3)'
    },
    {
      id: 'katakana',
      // ✅ 翻译 Label 和 Title
      label: t('home.hero.next_milestone'),
      title: t('home.hero.katakana_title'),
      char: 'ア',
      progress: '10%',
      color: '#FF2D55',
      trackColor: 'rgba(255,255,255,0.3)'
    }
  ];

  const drills = [
    { 
      id: 'numbers', 
      title: t('home.drills.numbers'), 
      sub: t('home.drills.numbers_sub'), 
      icon: Hash, color: '#FF9500' 
    },
    { 
      id: 'dates', 
      title: t('home.drills.dates'), 
      sub: t('home.drills.dates_sub'), 
      icon: Calendar, color: '#30B0C7' 
    },
    { 
      id: 'vocab', 
      title: t('home.drills.vocab'), 
      sub: t('home.drills.vocab_sub'), 
      icon: Zap, color: '#AF52DE' 
    },
    { 
      id: 'kanji', 
      title: t('home.drills.kanji'), 
      sub: t('home.drills.kanji_sub'), 
      icon: Type, color: '#FF3B30' 
    },
    { 
      id: 'grammar', 
      title: t('home.drills.grammar'), 
      sub: t('home.drills.grammar_sub'), 
      icon: BookOpen, color: '#5856D6' 
    },
    { 
      id: 'listening', 
      title: t('home.drills.listening'), 
      sub: t('home.drills.listening_sub'), 
      icon: Headphones, color: '#00C7BE' 
    },
    { 
      id: 'speaking', 
      title: t('home.drills.speaking'), 
      sub: t('home.drills.speaking_sub'), 
      icon: Mic, color: '#34C759' 
    },
    { 
      id: 'challenge', 
      title: t('home.drills.challenge'), 
      sub: t('home.drills.challenge_sub'), 
      icon: Trophy, color: '#FFcc00' 
    },
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
        <div className={styles.headerText}>
          <div className={`${styles.date} ${headerData.isRed ? styles.holidayDate : ''}`}>
            {headerData.fullDateText}
          </div>
          <div className={styles.japaneseTitle}>{headerData.greeting}</div>
        </div>
        
        <div className={styles.headerActions}>
          <button 
            className={styles.iconBtn} 
            onClick={handleSearchClick}
            aria-label={t('common.search')} // ✅ 翻译 aria-label
          >
            <Search size={24} strokeWidth={2} />
          </button>

          <button 
            className={styles.iconBtn} 
            onClick={() => setSettingsOpen(true)}
            aria-label={t('common.settings')} // ✅ 翻译 aria-label
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
      <div className={styles.sectionHeader}>{t('home.drills.title')}</div> {/* ✅ 翻译标题 */}
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
        // ✅ 翻译弹窗标题
        title={currentScript === 'hiragana' ? t('home.modal.select_hiragana') : t('home.modal.select_katakana')}
      >
        <LessonMenu script={currentScript} onSelect={handleLessonSelect} />
      </BottomSheet>

      <BottomSheet
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
        // ✅ 翻译弹窗标题
        title={t('common.settings')}
      >
        <SettingsMenu 
          // 这里可以传入当前语言状态，不过 SettingsMenu 内部如果已经接了 i18n hook，这里甚至不需要传 props
        />
      </BottomSheet>

    </div>
  );
}