import React, { useMemo, useRef } from 'react';
import { ActivityCalendar } from 'react-activity-calendar';
import { useProgress } from '../../context/ProgressContext';
import { subDays, format } from 'date-fns';
import styles from './StatsHeatmap.module.css';
import { useTranslation } from 'react-i18next';
import { Toast } from '@capacitor/toast';

interface ActivityType {
  date: string;
  count: number;
  level: number;
}

export const StatsHeatmap = () => {
  const { activityLog } = useProgress();
  const { t } = useTranslation();

  const lastClickTimeRef = useRef<number>(0);

  const data = useMemo(() => {
    const today = new Date();
    const daysToShow = 90;
    const result = [];

    for (let i = 0; i <= daysToShow; i++) {
      const date = subDays(today, daysToShow - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const count = activityLog[dateStr] || 0;

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
    return result;
  }, [activityLog]);

  //   const totalActivities = Object.values(activityLog).reduce((a, b) => a + b, 0);

  // 节流逻辑
  const handleBlockClick = async (activity: ActivityType) => {
    const now = Date.now();
    const COOLDOWN = 2000;

    if (now - lastClickTimeRef.current < COOLDOWN) {
      return;
    }

    // 更新点击时间
    lastClickTimeRef.current = now;

    await Toast.show({
      text: t('stats.tooltip', {
        count: activity.count,
        date: activity.date,
      }),
      duration: 'short',
      position: 'bottom',
    });
  };

  return (
    <div className={styles.container}>
      {/* <div className={styles.statsRow}>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{totalActivities}</div>
          <div className={styles.statLabel}>{t('stats.total_lessons')}</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statValue}>🔥</div>
          <div className={styles.statLabel}>{t('stats.streak_label')}</div>
        </div>
      </div> */}

      <div className={styles.calendarWrapper}>
        <ActivityCalendar
          data={data}
          blockSize={22}
          blockMargin={5}
          fontSize={14}
          showTotalCount={false}
          showColorLegend={false}
          showMonthLabels={true}
          theme={{
            light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
            dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'],
          }}
          renderBlock={(block, activity) => {
            const act = activity as ActivityType;

            return React.cloneElement(block, {
              onClick: () => handleBlockClick(act),
              title: t('stats.tooltip', {
                count: act.count,
                date: act.date,
              }),
              style: { cursor: 'pointer' },
            });
          }}
        />
      </div>
    </div>
  );
};
