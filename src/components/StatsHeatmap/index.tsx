import React, { useMemo, useRef } from 'react';
import { ActivityCalendar } from 'react-activity-calendar';
import { useProgress } from '../../context/ProgressContext';
import {
  subDays,
  format,
  startOfWeek,
  endOfWeek,
  subWeeks,
  differenceInDays,
  addDays,
} from 'date-fns';
import styles from './StatsHeatmap.module.css';
import { useTranslation } from 'react-i18next';
import { Toast } from '@capacitor/toast';
import { Flame, CalendarCheck, Medal } from 'lucide-react';

interface ActivityType {
  date: string;
  count: number;
  level: number;
}

export const StatsHeatmap = () => {
  const { activityLog } = useProgress();
  const { t } = useTranslation();

  const lastClickTimeRef = useRef<number>(0);

  // --- 数据处理 & 热力图数据 ---
  const { data, totalActivities } = useMemo(() => {
    const today = new Date();

    // 展示最近 18 周 (约 4 个月)
    const weeksToShow = 18;

    // A. 锁定起点：18周前的【周日】 (左侧对齐)
    const startDate = subWeeks(startOfWeek(today), weeksToShow);

    // B. 锁定终点：本周的【周六】 (右侧对齐)
    // 这样无论今天是周几，图表都会把这一整周的格子画满，形成完美的矩形
    const endDate = endOfWeek(today);

    // 计算总格子数
    const totalDays = differenceInDays(endDate, startDate);

    const result = [];
    let total = 0;

    for (let i = 0; i <= totalDays; i++) {
      const date = addDays(startDate, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const count = activityLog[dateStr] || 0;

      // 只有截至到今天的数据才算进总数 (未来的日子虽然显示格子，但不计入总数)
      // 如果不加这个判断，total 也不会错(因为count是0)，但逻辑上严谨一点
      if (date <= today) {
        total += count;
      }

      let level = 0;
      if (count >= 1) level = 1;
      if (count >= 3) level = 2;
      if (count >= 5) level = 3;
      if (count >= 8) level = 4;

      result.push({
        date: dateStr,
        count: count,
        level: level,
      });
    }
    return { data: result, totalActivities: total };
  }, [activityLog]);

  // --- Streak (连续打卡) 计算 ---
  const currentStreak = useMemo(() => {
    let streak = 0;
    const today = new Date();
    let checkDate = today;

    // 逻辑：
    // 1. 如果今天打卡了，Streak 从今天开始算。
    // 2. 如果今天没打卡，但昨天打卡了，Streak 从昨天开始算（连续未断）。
    // 3. 如果昨天也没打卡，Streak 断了，归零。
    const todayStr = format(today, 'yyyy-MM-dd');
    if (!activityLog[todayStr]) {
      // 今天没打卡，检查昨天
      checkDate = subDays(today, 1);
      const yesterdayStr = format(checkDate, 'yyyy-MM-dd');
      // 如果昨天也没数据，直接返回 0
      if (!activityLog[yesterdayStr]) {
        return 0;
      }
    }

    // 开始回溯计数
    while (true) {
      const dateStr = format(checkDate, 'yyyy-MM-dd');
      if (activityLog[dateStr] && activityLog[dateStr] > 0) {
        streak++;
        checkDate = subDays(checkDate, 1);
      } else {
        break;
      }
    }
    return streak;
  }, [activityLog]);

  // --- 交互逻辑 ---
  const handleBlockClick = async (activity: ActivityType) => {
    const now = Date.now();
    const COOLDOWN = 2000;
    if (now - lastClickTimeRef.current < COOLDOWN) return;
    lastClickTimeRef.current = now;

    await Toast.show({
      text: t('stats.tooltip', { count: activity.count, date: activity.date }),
      duration: 'short',
      position: 'bottom',
    });
  };

  // --- 勋章 Mock 数据 ---
  const badges = [
    { id: 1, icon: '🌱', name: '初学者', unlocked: true },
    { id: 2, icon: '🔥', name: '坚持3天', unlocked: currentStreak >= 3 },
    { id: 3, icon: '🎓', name: '学霸', unlocked: totalActivities > 100 },
    { id: 4, icon: '👑', name: '大师', unlocked: false },
  ];

  return (
    <div className={styles.container}>
      {/* 模块 A: 核心指标概览 */}
      <div className={styles.summarySection}>
        <div className={styles.statCard}>
          <div className={`${styles.iconBox} ${styles.iconFire}`}>
            <Flame size={20} fill="currentColor" />
          </div>
          <div className={styles.statText}>
            <span className={styles.statValue}>{currentStreak}</span>
            <span className={styles.statLabel}>
              {t('stats.streak_label') || 'Streak'}
            </span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.iconBox} ${styles.iconStar}`}>
            <CalendarCheck size={20} />
          </div>
          <div className={styles.statText}>
            <span className={styles.statValue}>{totalActivities}</span>
            <span className={styles.statLabel}>
              {t('stats.total_lessons') || 'Total'}
            </span>
          </div>
        </div>
      </div>

      {/* 模块 B: 热力图卡片 */}
      <div className={styles.sectionCard}>
        {/* <div className={styles.cardHeader}>
          <h3 className={styles.cardTitle}>
            {t('stats.activity_title') || 'Learning Activity'}
          </h3>
        </div> */}
        <div className={styles.calendarWrapper}>
          <ActivityCalendar
            data={data}
            blockSize={14}
            blockMargin={4}
            fontSize={12}
            showTotalCount={false}
            showColorLegend={false}
            showMonthLabels={true}
            theme={{
              light: ['#f0f0f0', '#bbf7d0', '#4ade80', '#22c55e', '#15803d'],
              dark: ['#333333', '#064e3b', '#065f46', '#059669', '#10b981'],
            }}
            renderBlock={(block, activity) => {
              const act = activity as ActivityType;
              return React.cloneElement(block, {
                onClick: () => handleBlockClick(act),
                style: { cursor: 'pointer', borderRadius: '3px' },
              });
            }}
          />
        </div>
      </div>

      {/* 模块 C: 勋章墙 (预留) */}
      <div className={styles.sectionCard}>
        <div className={styles.badgesGrid}>
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`${styles.badgeItem} ${!badge.unlocked ? styles.locked : ''}`}
            >
              <div className={styles.badgeIcon}>
                {badge.unlocked ? badge.icon : <Medal size={24} color="#ccc" />}
              </div>
              <span className={styles.badgeName}>{badge.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
