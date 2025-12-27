import { useState, useMemo } from 'react';
import styles from './HomePage.module.css';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

// --- 引入组件 ---
import BottomSheet from '../components/BottomSheet';
import LessonMenu from '../components/LessonMenu';
import AppSettingsMenu from '../components/AppSettingsMenu';
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
  BookOpenText,
} from 'lucide-react';

// ✅ [改动1] 引入我们刚才提取的公共数据（分母）和进度 Context（分子）
import { HIRAGANA_DATA, KATAKANA_DATA } from '../datas/kanaData';
import { useProgress } from '../context/ProgressContext';

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
  const [activeDrill, setActiveDrill] = useState<string | null>(null);

  // ✅ [改动2] 获取用户已完成的课程列表
  const { completedLessons } = useProgress();

  // ✅ [改动3] 新增计算函数：算出真实的百分比
  const calculateProgress = (script: 'hiragana' | 'katakana') => {
    // 1. 确定分母：是平假名数据还是片假名数据
    const dataSet = script === 'hiragana' ? HIRAGANA_DATA : KATAKANA_DATA;
    const total = dataSet.length;

    if (total === 0) return '0%';

    // 2. 计算分子：有多少个 ID 出现在了 completedLessons 里
    const completedCount = dataSet.filter((item) =>
      completedLessons.includes(item.id)
    ).length;

    // 3. 算出百分比字符串
    const percent = Math.round((completedCount / total) * 100);
    return `${percent}%`;
  };

  // --- Header 数据 (保持不变) ---
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
      progress: calculateProgress('hiragana'),
      color: '#007AFF',
      trackColor: 'rgba(255,255,255,0.3)',
    },
    {
      id: 'katakana',
      label: t('home.hero.next_milestone'),
      title: t('home.hero.katakana_title'),
      char: 'ア',
      progress: calculateProgress('katakana'),
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
      icon: BookOpenText,
      color: '#5856D6',
    }, // 这里改回 BookOpenText 避免报错
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

  // --- 交互逻辑 (保持不变) ---
  const handleHeroClick = (id: string) => {
    if (id === 'hiragana' || id === 'katakana') {
      setCurrentScript(id as ScriptType);
      setSelectionOpen(true);
    } else {
      onCategorySelect(id);
    }
  };

  const handleLessonSelect = (lessonId: string, targetChars: string[]) => {
    setSelectionOpen(false);
    setTimeout(() => {
      navigate(`/study/${lessonId}`, {
        state: { targetChars: targetChars },
      });
    }, 0);
  };

  const handleDrillClick = (id: string) => {
    if (id === 'dates') {
      setActiveDrill('dates');
    } else {
      onCategorySelect(id);
    }
  };

  if (activeDrill === 'dates') {
    return <DatesPage onBack={() => setActiveDrill(null)} />;
  }

  // --- 渲染 (保持不变) ---
  return (
    <div className={styles.container}>
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
            <BookOpenText size={24} strokeWidth={2} />
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
                {/* 这里的 width 就会变成真实的百分比了 */}
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

      <div className={styles.sectionHeader}>{t('home.drills.title')}</div>
      <div className={styles.grid}>
        {drills.map((item) => (
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
