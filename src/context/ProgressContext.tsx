import React, { createContext, useContext, useState, useEffect } from 'react';

// 定义我们这个 Context 里都有什么数据和方法
interface ProgressContextType {
  completedLessons: string[]; // 已经学完的课程 ID 列表
  markLessonComplete: (lessonId: string) => void; // 用来标记某个课程“已学完”的方法
  clearHistory: () => void; // 清除所有历史记录的方法
  isLessonCompleted: (lessonId: string) => boolean; // 检查某个课程是否学过的方法
}

const ProgressContext = createContext<ProgressContextType | undefined>(
  undefined
);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // 1. 初始化状态：尝试从 localStorage 读取 'hiyori_progress'，如果没有就用空数组 []
  const [completedLessons, setCompletedLessons] = useState<string[]>(() => {
    const saved = localStorage.getItem('hiyori_progress');
    return saved ? JSON.parse(saved) : [];
  });

  // 2. 监听变化：每当 completedLessons 发生变化时，自动同步保存到 localStorage
  useEffect(() => {
    localStorage.setItem('hiyori_progress', JSON.stringify(completedLessons));
  }, [completedLessons]);

  // 标记课程完成
  const markLessonComplete = (lessonId: string) => {
    setCompletedLessons((prev) => {
      // 如果已经包含这个 ID，就不重复添加了
      if (prev.includes(lessonId)) return prev;
      return [...prev, lessonId];
    });
  };

  // 清除历史
  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all progress?')) {
      setCompletedLessons([]);
    }
  };

  // 检查是否完成
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

// 这是一个自定义 Hook，方便我们在组件里直接调用
export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
