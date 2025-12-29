import { useState, useMemo } from 'react';
import styles from './HomePage.module.css';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import BottomSheet from '../components/BottomSheet';
import LessonMenu from '../components/LessonMenu';
import AppSettingsMenu from '../components/AppSettingsMenu';
import { StatsHeatmap } from '../components/StatsHeatmap';

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
  Clock,
  CircleDollarSign,
} from 'lucide-react';

import { HIRAGANA_DATA, KATAKANA_DATA } from '../datas/kanaData';
import { useProgress } from '../context/ProgressContext';

export function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // --- 状态管理 ---
  // 1. 假名选择弹窗（Hero 卡片共用）
  const [isSelectionOpen, setSelectionOpen] = useState(false);
  const [currentScript, setCurrentScript] = useState<ScriptType>('hiragana');

  // 2. 专项练习弹窗（Numbers）
  const [isNumbersOpen, setNumbersOpen] = useState(false);

  // 3. Header 弹窗
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isStatsOpen, setStatsOpen] = useState(false);

  const { activityLog, completedLessons } = useProgress();
  const hasActivity = Object.values(activityLog).some((count) => count > 0);

  // 进度计算逻辑
  const calculateProgress = (script: 'hiragana' | 'katakana') => {
    const dataSet = script === 'hiragana' ? HIRAGANA_DATA : KATAKANA_DATA;
    const total = dataSet.length;
    if (total === 0) return '0%';
    const completedCount = dataSet.filter((item) =>
      completedLessons.includes(item.id)
    ).length;
    return `${Math.round((completedCount / total) * 100)}%`;
  };

  const headerData = useMemo(() => {
    const now = new Date();
    const isRed = isRedDay(now);
    let fullDateText = `${getJapaneseDateStr(now)} ${getJapaneseWeekday(now)}`;
    const holiday = getJapaneseHoliday(now);
    if (holiday) fullDateText += ` · ${holiday}`;
    return { greeting: getJapaneseGreeting(now), fullDateText, isRed };
  }, []);

  const heroCourses = [
    {
      id: 'hiragana',
      char: 'あ',
      color: '#007AFF',
      progress: calculateProgress('hiragana'),
      label: t('home.hero.current_session'),
      title: t('home.hero.hiragana_title'),
    },
    {
      id: 'katakana',
      char: 'ア',
      color: '#FF2D55',
      progress: calculateProgress('katakana'),
      label: t('home.hero.next_milestone'),
      title: t('home.hero.katakana_title'),
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
      id: 'times',
      title: t('home.drills.times'),
      sub: t('home.drills.times_sub'),
      icon: Clock,
      color: '#30B0C7',
    },
    {
      id: 'money',
      title: t('home.drills.money'),
      sub: t('home.drills.moeny_sub'),
      icon: CircleDollarSign,
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

  const handleHeroClick = (id: string) => {
    if (id === 'hiragana' || id === 'katakana') {
      setCurrentScript(id as ScriptType);
      setSelectionOpen(true);
    }
  };

  const handleDrillClick = (id: string) => {
    if (id === 'dates') {
      navigate('/study/dates');
    } else if (id === 'numbers') {
      setNumbersOpen(true);
    }
    // 其他暂时不处理
  };

  const handleLessonSelect = (courseId: string, targetChars: string[]) => {
    setSelectionOpen(false);
    setNumbersOpen(false);
    setTimeout(() => {
      navigate(`/study/kana/${courseId}`, { state: { targetChars } });
    }, 0);
  };

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
          {hasActivity && (
            <button
              className={styles.iconBtn}
              onClick={() => setStatsOpen(true)}
            >
              <Trophy size={22} color="#ffbb00ff" />
            </button>
          )}
          <button className={styles.iconBtn}>
            <BookOpenText size={24} />
          </button>
          <button
            className={styles.iconBtn}
            onClick={() => setSettingsOpen(true)}
          >
            <Settings size={24} />
          </button>
        </div>
      </header>

      <div className={styles.scrollContainer}>
        {heroCourses.map((course) => (
          <div
            key={course.id}
            className={`${styles.heroCard} ${styles[course.id]}`}
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
                style={{ background: 'rgba(255,255,255,0.3)' }}
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

      <div className={styles.testBtnContainer}>
        <button onClick={() => navigate('/dice')} className={styles.testBtn}>
          🎲 Try 3D Dice (Test)
        </button>
      </div>

      {/* <div className={styles.sectionHeader}>{t('home.drills.title')}</div> */}

      <div className={styles.grid}>
        {drills.map((item) => (
          <div
            key={item.id}
            className={`${styles.card} ${styles[item.id]}`}
            onClick={() => handleDrillClick(item.id)}
          >
            <div
              className={styles.iconBox}
              style={{ backgroundColor: item.color }}
            >
              <item.icon size={24} strokeWidth={2.5} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div className={styles.cardTitle}>{item.title}</div>
              <div className={styles.cardSub}>{item.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* --- 所有的 BottomSheet --- */}

      {/* 假名选择弹窗 */}
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

      {/* Numbers 专用弹窗 */}
      <BottomSheet
        isOpen={isNumbersOpen}
        onClose={() => setNumbersOpen(false)}
        title={t('home.drills.numbers')}
      >
        {/* 注意：此处 script 设为 numbers 是为了让 LessonMenu 知道该加载数字数据 */}
        <LessonMenu script={'numbers' as any} onSelect={handleLessonSelect} />
      </BottomSheet>

      {/* Header 相关弹窗 */}
      <BottomSheet
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
        title={t('common.settings')}
      >
        <AppSettingsMenu />
      </BottomSheet>
      <BottomSheet
        isOpen={isStatsOpen}
        onClose={() => setStatsOpen(false)}
        title={t('stats.title')}
      >
        <StatsHeatmap />
      </BottomSheet>
    </div>
  );
}
