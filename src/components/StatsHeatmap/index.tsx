import React, { useMemo } from 'react';
import { ActivityCalendar } from 'react-activity-calendar';
import { useProgress } from '../../context/ProgressContext';
import { subDays } from 'date-fns'; // 用来计算"半年前"
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

  // 1. 数据转换：把对象转成数组
  const data = useMemo(() => {
    // 自动填充过去 180 天 (半年)，保证没数据的日子显示灰色
    const today = new Date();
    const daysToShow = 90; // 手机屏幕窄，显示 5-6 个月差不多了

    const result = [];

    // 遍历过去 daysToShow 天
    for (let i = 0; i <= daysToShow; i++) {
      const date = subDays(today, daysToShow - i);
      const dateStr = date.toISOString().split('T')[0];
      const count = activityLog[dateStr] || 0;

      // 简单分级：0=灰, 1-2=浅绿, 3-5=中绿, 6+=深绿
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

  // 2. 统计总数据
  const totalActivities = Object.values(activityLog).reduce((a, b) => a + b, 0);

  // 抽离点击处理函数
  const handleBlockClick = async (activity: ActivityType) => {
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
      <div className={styles.statsRow}>
        <div className={styles.statItem}>
          <div className={styles.statValue}>{totalActivities}</div>
          <div className={styles.statLabel}>{t('stats.total_lessons')}</div>
        </div>
        {/* 这里以后可以算 Current Streak (连胜) */}
        <div className={styles.statItem}>
          <div className={styles.statValue}>🔥</div>
          <div className={styles.statLabel}>{t('stats.streak_label')}</div>
        </div>
      </div>

      <div className={styles.calendarWrapper}>
        <ActivityCalendar
          data={data}
          blockSize={22} // 格子大小
          blockMargin={5} // 间距
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
              // 添加点击事件 (手机端交互核心)
              onClick: () => handleBlockClick(act),
              // 添加鼠标悬停 title (Web端辅助)
              title: t('stats.tooltip', {
                count: act.count,
                date: act.date,
              }),
              // 鼠标变手型
              style: { cursor: 'pointer' },
            });
          }}
        />
      </div>
    </div>
  );
};
