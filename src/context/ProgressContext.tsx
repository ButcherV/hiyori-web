import React, { createContext, useContext, useState, useEffect } from 'react';
import { Dialog } from '@capacitor/dialog';
import { Toast } from '@capacitor/toast';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

// 定义活动日志类型：{ "2023-10-01": 5, "2023-10-02": 1 }
type ActivityLog = Record<string, number>;

interface ProgressContextType {
  completedLessons: string[];
  activityLog: ActivityLog; // [新增] 暴露活动日志
  markLessonComplete: (lessonId: string) => void;
  clearHistory: () => Promise<void>;
  isLessonCompleted: (lessonId: string) => boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(
  undefined
);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { t } = useTranslation();

  // 1. 课程完成记录 (Set 逻辑，去重)
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    const saved = localStorage.getItem('hiyori_progress');
    return saved ? JSON.parse(saved) : [];
  });

  // 2. [新增] 每日活动记录 (Log 逻辑，记录次数)
  const [activityLog, setActivityLog] = useState<ActivityLog>(() => {
    const saved = localStorage.getItem('hiyori_activity');
    return saved ? JSON.parse(saved) : {};
  });

  // 监听保存
  useEffect(() => {
    localStorage.setItem('hiyori_progress', JSON.stringify(completedLessons));
  }, [completedLessons]);

  useEffect(() => {
    localStorage.setItem('hiyori_activity', JSON.stringify(activityLog));
  }, [activityLog]);

  // 核心逻辑：完成课程
  const markLessonComplete = (lessonId: string) => {
    // A. 去重：标记课程为已完成
    setCompletedLessons((prev) => {
      if (prev.includes(lessonId)) return prev;
      return [...prev, lessonId];
    });

    // B. 不去重：记录今天的活动 (只要学完一次就算一次，不管是不是新课)
    const today = format(new Date(), 'yyyy-MM-dd');
    setActivityLog((prev) => ({
      ...prev,
      [today]: (prev[today] || 0) + 1, // 次数 +1
    }));
  };

  const clearHistory = async () => {
    const { value } = await Dialog.confirm({
      title: t('settings.clear_dialog_title'),
      message: t('settings.clear_dialog_message'),
      okButtonTitle: t('common.delete'),
      cancelButtonTitle: t('common.cancel'),
    });

    if (value) {
      setCompletedLessons([]);
      setActivityLog({});

      await Toast.show({
        text: t('settings.clear_success'),
        duration: 'short', // 2s
        position: 'bottom',
      });
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return completedLessons.includes(lessonId);
  };

  return (
    <ProgressContext.Provider
      value={{
        completedLessons,
        activityLog, // [新增]
        markLessonComplete,
        clearHistory,
        isLessonCompleted,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
