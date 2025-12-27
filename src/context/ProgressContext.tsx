import React, { createContext, useContext, useState, useEffect } from 'react';
import { Dialog } from '@capacitor/dialog';
import { Toast } from '@capacitor/toast';
import { useTranslation } from 'react-i18next';

interface ProgressContextType {
  completedLessons: string[];
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
  // 初始化翻译
  const { t } = useTranslation();

  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    const saved = localStorage.getItem('hiyori_progress');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('hiyori_progress', JSON.stringify(completedLessons));
  }, [completedLessons]);

  const markLessonComplete = (lessonId: string) => {
    setCompletedLessons((prev) => {
      if (prev.includes(lessonId)) return prev;
      return [...prev, lessonId];
    });
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

      await Toast.show({
        text: t('settings.clear_success'),
        duration: 'short', // 'short' 大约是 2 秒
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
