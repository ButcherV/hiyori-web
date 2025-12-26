import { useState, useMemo } from 'react';
import styles from './HomePage.module.css';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

// --- 引入组件 ---
import BottomSheet from '../components/BottomSheet';
import LessonMenu from '../components/LessonMenu';
import AppSettingsMenu from '../components/AppSettingsMenu';
// ✅ 1. 引入新做好的 DatesPage
import DatesPage from './DatesPage';

import type { ScriptType } from '../components/LessonMenu';
import {
  getJapaneseGreeting,
  getJapaneseDateStr,
  getJapaneseWeekday,
  getJapaneseHoliday,
  isRedDay,
} from '../utils/dateHelper';

import {
  Hash,
  Calendar,
  Zap,
  Type,
  Headphones,
  Mic,
  Trophy,
  Settings,
  BookOpen,
  // Search,
  // BookA,
  BookOpenText,
  // BookOpen,
  // Library,
} from 'lucide-react';

interface HomePageProps {
  onCategorySelect: (categoryId: string) => void;
}

export function HomePage({ onCategorySelect }: HomePageProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // --- 状态管理 ---
  const [isSelectionOpen, setSelectionOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [currentScript, setCurrentScript] = useState<ScriptType>('hiragana');

  // ✅ 2. 新增状态：当前正在进行的练习 (null 代表在首页)
  const [activeDrill, setActiveDrill] = useState<string | null>(null);

  // --- Header 数据 (沉浸式日语) ---
  const headerData = useMemo(() => {
    const now = new Date();
    const datePart = getJapaneseDateStr(now);
    const weekPart = getJapaneseWeekday(now);
    const holidayPart = getJapaneseHoliday(now);
    const isRed = isRedDay(now);
    let fullDateText = `${datePart} ${weekPart}`;
    if (holidayPart) fullDateText += ` · ${holidayPart}`;

    return {
      greeting: getJapaneseGreeting(now),
      fullDateText,
      isRed,
    };
  }, []);

  // --- 数据定义 ---
  const heroCourses = [
    {
      id: 'hiragana',
      label: t('home.hero.current_session'),
      title: t('home.hero.hiragana_title'),
      char: 'あ',
      progress: '45%',
      color: '#007AFF',
      trackColor: 'rgba(255,255,255,0.3)',
    },
    {
      id: 'katakana',
      label: t('home.hero.next_milestone'),
      title: t('home.hero.katakana_title'),
      char: 'ア',
      progress: '10%',
      color: '#FF2D55',
      trackColor: 'rgba(255,255,255,0.3)',
    },
  ];

  const drills = [
    {
      id: 'numbers',
      title: t('home.drills.numbers'),
      sub: t('home.drills.numbers_sub'),
      icon: Hash,
      color: '#FF9500',
    },
    // ✅ 注意这个 id 必须是 'dates'，对应下面的判断
    {
      id: 'dates',
      title: t('home.drills.dates'),
      sub: t('home.drills.dates_sub'),
      icon: Calendar,
      color: '#30B0C7',
    },
    {
      id: 'vocab',
      title: t('home.drills.vocab'),
      sub: t('home.drills.vocab_sub'),
      icon: Zap,
      color: '#AF52DE',
    },
    {
      id: 'kanji',
      title: t('home.drills.kanji'),
      sub: t('home.drills.kanji_sub'),
      icon: Type,
      color: '#FF3B30',
    },
    {
      id: 'grammar',
      title: t('home.drills.grammar'),
      sub: t('home.drills.grammar_sub'),
      icon: BookOpen,
      color: '#5856D6',
    },
    {
      id: 'listening',
      title: t('home.drills.listening'),
      sub: t('home.drills.listening_sub'),
      icon: Headphones,
      color: '#00C7BE',
    },
    {
      id: 'speaking',
      title: t('home.drills.speaking'),
      sub: t('home.drills.speaking_sub'),
      icon: Mic,
      color: '#34C759',
    },
    {
      id: 'challenge',
      title: t('home.drills.challenge'),
      sub: t('home.drills.challenge_sub'),
      icon: Trophy,
      color: '#FFcc00',
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

  const handleLessonSelect = (lessonId: string, targetChars: string[]) => {
    console.log(`User Selected: ${lessonId}`);
    setSelectionOpen(false);

    // 2. 延迟跳转 (配合 CSS 动画时间，通常 250ms - 300ms)
    setTimeout(() => {
      navigate(`/study/${lessonId}`, {
        state: {
          targetChars: targetChars,
        },
      });
    }, 0);
  };

  // ✅ 3. 修改 Drill 点击逻辑：拦截 'dates'，其他的继续向上层汇报
  const handleDrillClick = (id: string) => {
    if (id === 'dates') {
      // 切换到日期页面
      setActiveDrill('dates');
    } else {
      // 其他功能还没做，保持原样
      onCategorySelect(id);
    }
  };

  // ✅ 4. 条件渲染：如果 activeDrill 是 dates，直接显示 DatesPage
  if (activeDrill === 'dates') {
    return (
      <DatesPage
        onBack={() => setActiveDrill(null)} // 传进去一个回调，让它能切回来
      />
    );
  }

  // --- 下面是原本的 Dashboard 渲染 ---
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerText}>
          <div className={styles.japaneseTitle}>{headerData.greeting}</div>
          <div
            className={`${styles.date} ${headerData.isRed ? styles.holidayDate : ''}`}
          >
            {headerData.fullDateText}
          </div>
        </div>

        <div className={styles.headerActions}>
          <button className={styles.iconBtn} aria-label={t('common.search')}>
            {/* <BookA size={24} strokeWidth={2} /> */}
            <BookOpenText size={24} strokeWidth={2} />
            {/* <BookOpenText size={24} strokeWidth={2} /> */}
            {/* <Library size={24} strokeWidth={2} /> */}
          </button>

          <button
            className={styles.iconBtn}
            onClick={() => setSettingsOpen(true)}
            aria-label={t('common.settings')}
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
              <div
                className={styles.heroTitle}
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {course.title}
              </div>
            </div>
            <div className={styles.heroBottom}>
              <div
                className={styles.progressTrack}
                style={{ background: course.trackColor }}
              >
                <div
                  className={styles.progressFill}
                  style={{ width: course.progress }}
                />
              </div>
              <div className={styles.progressText}>{course.progress}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Grid Section */}
      <div className={styles.sectionHeader}>{t('home.drills.title')}</div>
      <div className={styles.grid}>
        {drills.map((item) => (
          // ✅ 修改：onClick 这里调用新的 handleDrillClick
          <div
            key={item.id}
            className={styles.card}
            onClick={() => handleDrillClick(item.id)}
          >
            <div
              className={styles.iconBox}
              style={{ backgroundColor: item.color }}
            >
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
        title={
          currentScript === 'hiragana'
            ? t('home.modal.select_hiragana')
            : t('home.modal.select_katakana')
        }
      >
        <LessonMenu script={currentScript} onSelect={handleLessonSelect} />
      </BottomSheet>

      <BottomSheet
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
        title={t('common.settings')}
      >
        <AppSettingsMenu />
      </BottomSheet>
    </div>
  );
}
