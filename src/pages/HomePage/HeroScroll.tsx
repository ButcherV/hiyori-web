import { useState, useRef, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './HeroScroll.module.css';
import { HIRAGANA_DATA, KATAKANA_DATA } from '../../datas/kanaData';
import { useProgress } from '../../context/ProgressContext';
import { useSettings } from '../../context/SettingsContext';
import type { ScriptType } from '../../components/LessonMenu';

import { Lock, CheckCircle2, PlayCircle, Hourglass } from 'lucide-react';

interface HeroScrollProps {
  onCourseClick: (script: ScriptType) => void;
}

export const HeroScroll = ({ onCourseClick }: HeroScrollProps) => {
  const { t } = useTranslation();
  const { completedLessons } = useProgress();

  // 获取全局设置中的 lastActiveCourseId 和更新方法
  const { lastActiveCourseId, updateSettings } = useSettings();

  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const getProgressNum = (script: 'hiragana' | 'katakana') => {
    const dataSet = script === 'hiragana' ? HIRAGANA_DATA : KATAKANA_DATA;
    const total = dataSet.length;
    if (total === 0) return 0;
    const completedCount = dataSet.filter((item) =>
      completedLessons.includes(item.id)
    ).length;
    return Math.round((completedCount / total) * 100);
  };
  const hiraganaProgress = getProgressNum('hiragana');
  const katakanaProgress = getProgressNum('katakana');

  const heroCourses = useMemo(() => {
    const getStatus = (progress: number, isLocked: boolean) => {
      if (isLocked)
        return { type: 'LOCKED', label: t('status.locked'), icon: Lock };
      if (progress === 100)
        return {
          type: 'COMPLETED',
          label: t('status.completed'),
          icon: CheckCircle2,
        };
      if (progress > 0)
        return {
          type: 'IN_PROGRESS',
          label: t('status.in_progress'),
          icon: Hourglass,
        };
      return { type: 'START', label: t('status.start'), icon: PlayCircle };
    };

    const KANA_MASTERY_THRESHOLD = 80;
    const isKanjiLocked =
      hiraganaProgress < KANA_MASTERY_THRESHOLD ||
      katakanaProgress < KANA_MASTERY_THRESHOLD;

    return [
      {
        id: 'hiragana',
        char: 'あ',
        colorClass: 'hiragana',
        progressVal: hiraganaProgress,
        title: t('home.hero.hiragana_title'),
        status: getStatus(hiraganaProgress, false),
      },
      {
        id: 'katakana',
        char: 'サ',
        colorClass: 'katakana',
        progressVal: katakanaProgress,
        title: t('home.hero.katakana_title'),
        status: getStatus(katakanaProgress, false),
      },
      {
        id: 'kanji',
        char: '漢',
        colorClass: 'kanji',
        progressVal: 0,
        title: t('home.hero.kanji_title'),
        status: getStatus(0, isKanjiLocked),
      },
    ];
  }, [hiraganaProgress, katakanaProgress, t]);

  useEffect(() => {
    const targetIndex = heroCourses.findIndex(
      (c) => c.id === lastActiveCourseId
    );

    if (targetIndex > 0 && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.offsetWidth * 0.85;
      const gap = 16;

      setTimeout(() => {
        container.scrollTo({
          left: targetIndex * (cardWidth + gap),
          behavior: 'smooth',
        });
        setActiveHeroIndex(targetIndex);
      }, 100);
    }
  }, []);

  const handleHeroClick = (id: string, index: number, isLocked: boolean) => {
    if (index !== activeHeroIndex) {
      const container = scrollContainerRef.current;
      if (container) {
        const cardWidth = container.offsetWidth * 0.85;
        const gap = 16;
        container.scrollTo({
          left: index * (cardWidth + gap),
          behavior: 'smooth',
        });
        setActiveHeroIndex(index);
      }
    } else {
      if (isLocked) return;
      updateSettings({ lastActiveCourseId: id });

      if (id === 'hiragana' || id === 'katakana') {
        onCourseClick(id as ScriptType);
      }
    }
  };

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollLeft = container.scrollLeft;
    const cardOuterWidth = container.offsetWidth * 0.85 + 16;
    const index = Math.round(scrollLeft / cardOuterWidth);
    if (index !== activeHeroIndex) {
      setActiveHeroIndex(index);
    }
  };

  return (
    <div
      className={styles.scrollContainer}
      ref={scrollContainerRef}
      onScroll={handleScroll}
    >
      {heroCourses.map((course, index) => {
        const isActive = index === activeHeroIndex;
        const isLocked = course.status.type === 'LOCKED';
        const StatusIcon = course.status.icon;

        return (
          <div
            key={course.id}
            className={`
              ${styles.heroCard} 
              ${styles[course.colorClass]} 
              ${!isActive ? styles.heroCardInactive : styles.heroCardActive} 
              ${isLocked ? styles.heroCardLocked : ''}
            `}
            onClick={() => handleHeroClick(course.id, index, isLocked)}
          >
            <div className={styles.heroDecor}>{course.char}</div>

            <div className={styles.heroTop}>
              <div className={`${styles.statusBadge}`}>
                <StatusIcon size={12} strokeWidth={3} />
                <span>{course.status.label}</span>
              </div>
              <div className={styles.heroTitle}>{course.title}</div>
            </div>

            <div
              className={styles.heroBottom}
              style={{ opacity: isActive ? 1 : 0.6 }}
            >
              {isLocked ? (
                <div className={styles.lockedText}>
                  <Lock size={14} />
                  <span>Finish Kana to unlock</span>
                </div>
              ) : (
                <>
                  <div className={styles.progressTrack}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${course.progressVal}%` }}
                    />
                  </div>
                  <div className={styles.progressText}>
                    {course.progressVal}%
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
