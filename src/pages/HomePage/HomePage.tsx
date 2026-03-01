import { useState, useEffect } from 'react';
import styles from './HomePage.module.css';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import BottomSheet from '../../components/BottomSheet';
import LessonMenu from '../../components/LessonMenu';
import AppSettingsMenu from '../../components/AppSettingsMenu';
import { StatsHeatmap } from '../../components/StatsHeatmap';
import { GreetingHeader } from './GreetingHeader';

import { HeroScroll } from './HeroScroll';
import { JapaneseWritingIntro } from './JapaneseWritingIntro';
// import { HiraganaOriginChecker } from './HiraganaOriginChecker';
// import { KatakanaOriginAnnotator } from './KatakanaOriginAnnotator';

import type { ScriptType } from '../../components/LessonMenu';

import {
  // Hash,
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
  ChevronRight,
  Shuffle,
  BookX,
  Dices,
  // MountainSnow,
  // Activity,
  Flame,
} from 'lucide-react';
import { useProgress } from '../../context/ProgressContext';

export function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // 预加载学习页 chunk，消除首次进入时的延迟
  useEffect(() => {
    import('../TestStudySession/TestStudySession');
  }, []);

  // --- 状态管理 ---
  // 假名选择弹窗
  const [isSelectionOpen, setSelectionOpen] = useState(false);
  const [currentScript, setCurrentScript] = useState<ScriptType>('hiragana');

  // Header 弹窗
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isStatsOpen, setStatsOpen] = useState(false);

  const { activityLog } = useProgress();
  const hasActivity = Object.values(activityLog).some((count) => count > 0);

  const drills = [
    {
      id: 'numbers',
      title: t('home.drills.numbers'),
      sub: t('home.drills.numbers_sub'),
      icon: Dices,
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
      color: '#AF52DE',
    },
    {
      id: 'money',
      title: t('home.drills.money'),
      sub: t('home.drills.money_sub'),
      icon: CircleDollarSign,
      color: '#FF3B30',
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
  ];

  // --- 事件处理 ---

  const handleCourseClick = (script: ScriptType) => {
    setCurrentScript(script);
    setSelectionOpen(true);
  };

  const handleDrillClick = (id: string) => {
    if (id === 'dates') {
      navigate('/study/dates');
    } else if (id === 'numbers') {
      navigate('/study/numbers');
    } else if (id === 'times') {
      navigate('/study/clock');
    }
  };

  const handleLessonSelect = (courseId: string, targetChars: string[]) => {
    setSelectionOpen(false);
    setTimeout(() => {
      navigate(`/study/kana/${courseId}`, { state: { targetChars } });
    }, 0);
  };

  return (
    <div className={styles.container}>
      {/* <HiraganaOriginChecker /> */}
      {/* <KatakanaOriginAnnotator /> */}
      <header className={styles.header}>
        <GreetingHeader />
        <div className={styles.headerActions}>
          {hasActivity && (
            <button
              className={styles.iconBtn}
              onClick={() => setStatsOpen(true)}
            >
              {/* <Trophy size={22} color="#ffbb00ff" /> */}
              {/* <Activity size={22} color="#30B0C7" /> */}
              <Flame size={22} />
            </button>
          )}
          {/* <button className={styles.iconBtn}>
            <BookOpenText size={24} />
          </button> */}
          <button
            className={styles.iconBtn}
            onClick={() => setSettingsOpen(true)}
          >
            <Settings size={24} />
          </button>
        </div>
      </header>
      <div className={styles.kanaSection}>
        <HeroScroll onCourseClick={handleCourseClick} />

        <div className={styles.quickActionsContainer}>
          {/* 随机测试 */}
          <div
            className={styles.quickActionBtn}
            onClick={() => navigate('/quiz/selection')}
            style={{ '--btn-color': '#FF9500' } as React.CSSProperties}
          >
            <div className={styles.quickIconBox}>
              <Shuffle size={18} strokeWidth={2} />
            </div>
            <div className={styles.quickText}>
              <span className={styles.quickTitle}>
                {t('home.kanaTest.random_test') || 'Random Quiz'}
              </span>
              {/* <span className={styles.quickSub}>
                {t('home.kanaTest.random_test_sub') || 'Custom Test'}
              </span> */}
            </div>
          </div>

          {/* 错题本 */}
          <div
            className={styles.quickActionBtn}
            onClick={() => navigate('/mistake-book')}
            style={{ '--btn-color': '#FF2D55' } as React.CSSProperties}
          >
            <div className={styles.quickIconBox}>
              <BookX size={18} strokeWidth={2} />
            </div>
            <div className={styles.quickText}>
              <span className={styles.quickTitle}>
                {t('home.kanaTest.mistake_book') || 'Review'}
              </span>
              {/* <span className={styles.quickSub}>
                {t('home.kanaTest.mistake_book_sub') || 'Fix Errors'}
              </span> */}
            </div>
          </div>

          {/* 假名查询 */}
          <div
            className={styles.quickActionBtn}
            onClick={() => navigate('/kana-dictionary')}
            style={{ '--btn-color': '#007AFF' } as React.CSSProperties}
          >
            <div className={styles.quickIconBox}>
              <BookOpenText size={18} strokeWidth={2} />
            </div>
            <div className={styles.quickText}>
              <span className={styles.quickTitle}>
                {t('home.kanaTest.dictionary') || 'Kana Dict'}
              </span>
              {/* <span className={styles.quickSub}>
                {t('home.kanaTest.dictionary_sub') || 'Search & Ref'}
              </span> */}
            </div>
          </div>
        </div>
      </div>

      {/* <div className={styles.testBtnContainer}>
        <button onClick={() => navigate('/dice')} className={styles.testBtn}>
          🎲 Try 3D Dice (Test)
        </button>
      </div> */}

      <div className={styles.sectionHeader}>
        {t('home.drills.title') || 'Practice Drills'}
      </div>

      <div className={styles.grid}>
        {drills.map((item) => (
          <div
            key={item.id}
            className={styles.drillCard} // ✅ 使用新样式
            onClick={() => handleDrillClick(item.id)}
            style={
              {
                '--drill-color': item.color,
                // 🔥 1. 背景不再是纯白，而是极淡的渐变
                '--drill-bg-gradient': `linear-gradient(145deg, #ffffff 0%, ${item.color}18 100%)`,
                // 🔥 2. 图标背景色稍微深一点点
                '--drill-icon-bg': `${item.color}25`,
                // 🔥 3. 关键：有色阴影 (Glowing Shadow)
                '--drill-shadow': `0 8px 20px -6px ${item.color}50`,
              } as React.CSSProperties
            }
          >
            {/* 🔥🔥🔥 新增：背景大图标 (复用 item.icon) */}
            <div className={styles.cardBgIcon}>
              {/* strokeWidth 设细一点(1.5)，大图标显得更精致 */}
              <item.icon size={80} strokeWidth={1.5} />
            </div>
            {/* 上半部分：图标 + 箭头 */}
            <div className={styles.cardTop}>
              <div className={styles.drillIconBox}>
                <item.icon size={22} strokeWidth={2.5} />
              </div>
              <ChevronRight size={18} className={styles.arrowIcon} />
            </div>

            {/* 下半部分：文字信息 */}
            <div className={styles.cardContent}>
              <div className={styles.cardTitle}>{item.title}</div>
              <div className={styles.cardSub}>{item.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <JapaneseWritingIntro />

      {/* --- BottomSheets --- */}
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
