import { useState, useRef, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './HeroScroll.module.css';
import { HIRAGANA_DATA, KATAKANA_DATA } from '../../datas/kanaDataCategory';
import { useProgress } from '../../context/ProgressContext';
import { useSettings } from '../../context/SettingsContext';
import type { ScriptType } from '../../components/LessonMenu';

import { Sparkles, CheckCircle2, PlayCircle, Hourglass } from 'lucide-react';

interface HeroScrollProps {
  onCourseClick: (script: ScriptType) => void;
}

export const HeroScroll = ({ onCourseClick }: HeroScrollProps) => {
  const { t } = useTranslation();
  const { completedLessons } = useProgress();
  const { lastActiveCourseId, updateSettings } = useSettings();

  const [activeHeroIndex, setActiveHeroIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 🟢 1. 建立一个 Ref 数组来存储卡片 DOM 节点
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

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
    const getStatus = (progress: number) => {
      if (progress === 100)
        return { type: 'COMPLETED', label: t('status.completed'), icon: CheckCircle2 };
      if (progress > 0)
        return { type: 'IN_PROGRESS', label: t('status.in_progress'), icon: Hourglass };
      return { type: 'START', label: t('status.start'), icon: PlayCircle };
    };

    return [
      {
        id: 'hiragana',
        char: 'あ',
        colorClass: 'hiragana',
        progressVal: hiraganaProgress,
        title: t('home.hero.hiragana.title'),
        subTitle: t('home.hero.hiragana.subtitle'),
        status: getStatus(hiraganaProgress),
      },
      {
        id: 'katakana',
        char: 'サ',
        colorClass: 'katakana',
        progressVal: katakanaProgress,
        title: t('home.hero.katakana.title'),
        subTitle: t('home.hero.katakana.subtitle'),
        status: getStatus(katakanaProgress),
      },
      {
        id: 'kanji',
        char: '漢',
        colorClass: 'kanji',
        progressVal: 0,
        title: t('home.hero.kanji.title'),
        subTitle: t('home.hero.kanji.subtitle'),
        status: { type: 'COMING_SOON', label: t('status.coming_soon'), icon: Sparkles },
      },
    ];
  }, [hiraganaProgress, katakanaProgress, t]);

  // 🟢 2. 核心逻辑：使用 Intersection Observer 监听卡片
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // 当卡片有 60% 以上的部分进入容器视窗时，判定为 Active
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            const index = Number(entry.target.getAttribute('data-index'));
            setActiveHeroIndex(index);
          }
        });
      },
      {
        root: container,
        threshold: 0.6, // 灵敏度阈值
      }
    );

    // 监听所有卡片节点
    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, [heroCourses.length]); // 确保数据加载后重新绑定

  // 🟢 3. 处理初始化滚动 (仅在组件挂载时执行一次)
  useEffect(() => {
    const targetIndex = heroCourses.findIndex(
      (c) => c.id === lastActiveCourseId
    );

    // 防御性检查：确保能找到对应课程且不是第一个（第一个无需滚动）
    if (targetIndex > 0 && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const cardWidth = container.offsetWidth * 0.85;
      const gap = 16;

      // ✅ 关键 1：立即同步设置状态，避免先渲染 index 0 的闪烁
      setActiveHeroIndex(targetIndex);

      // ✅ 关键 2：临时覆盖 CSS 的 scroll-behavior，实现硬切无动画
      const originalBehavior = container.style.scrollBehavior;
      container.style.scrollBehavior = 'auto';
      container.scrollLeft = targetIndex * (cardWidth + gap);

      // ✅ 关键 3：恢复平滑滚动（下一帧），保证用户后续手动滑动的动画体验
      requestAnimationFrame(() => {
        container.style.scrollBehavior = originalBehavior;
      });
    }
  }, []); // 保持仅在挂载时执行

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
        // 此处不需要 setActiveHeroIndex，Observer 会代劳
      }
    } else {
      if (isLocked) return;
      updateSettings({ lastActiveCourseId: id });
      if (id === 'hiragana' || id === 'katakana') {
        onCourseClick(id as ScriptType);
      }
    }
  };

  return (
    <div
      className={styles.scrollContainer}
      ref={scrollContainerRef}
      /* 🟢 移除了原有的 onScroll={handleScroll} */
    >
      {heroCourses.map((course, index) => {
        const isActive = index === activeHeroIndex;
        const isComingSoon = course.status.type === 'COMING_SOON';
        const StatusIcon = course.status.icon;

        return (
          <div
            key={course.id}
            /* 🟢 绑定 Ref 和 data-index */
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
            data-index={index}
            className={`
              ${styles.heroCard} 
              ${styles[course.colorClass]} 
              ${!isActive ? styles.heroCardInactive : ''}
              ${isComingSoon ? styles.heroCardLocked : ''}
            `}
            onClick={() => handleHeroClick(course.id, index, isComingSoon)}
          >
            <div className={styles.heroDecor}>{course.char}</div>

            <div className={styles.heroTop}>
              <div className={`${styles.statusBadge}`}>
                <StatusIcon size={12} strokeWidth={3} />
                <span>{course.status.label}</span>
              </div>
              <div className={styles.heroTitle}>{course.title}</div>
              <div className={styles.heroSubTitle}>{course.subTitle}</div>
            </div>

            <div
              className={styles.heroBottom}
              style={{ opacity: isActive ? 1 : 0.6 }}
            >
              {isComingSoon ? (
                <div className={styles.lockedText}>
                  <Sparkles size={14} />
                  <span>{t('home.hero.kanji.coming_soon_desc')}</span>
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
