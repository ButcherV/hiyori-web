import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from 'react';
import {
  type MistakeStore,
  type ProficiencyStatus,
} from '../pages/KanaDictAndQuiz/PageKanaQuiz/quizLogic';
import { Dialog } from '@capacitor/dialog';
import { Toast } from '@capacitor/toast';
import { useTranslation } from 'react-i18next';

// Context 定义
interface MistakeContextType {
  mistakes: MistakeStore;
  proficiencyMap: Record<string, ProficiencyStatus>;
  recordQuizResult: (id: string, isCorrect: boolean) => void;
  removeMistake: (id: string) => void;
  clearAllMistakes: () => void;
}

const MistakeContext = createContext<MistakeContextType | undefined>(undefined);

const STORAGE_KEY = 'hiyori_mistakes_v1';
const MASTERY_THRESHOLD = 2; // 🔥 必须连对 2 次才能变绿
const PERFECT_THRESHOLD = 8; // 👑 皇冠：连续对 8 次

export const MistakeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { t } = useTranslation();
  const [mistakes, setMistakes] = useState<MistakeStore>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.warn('Failed to load mistakes', e);
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mistakes));
    } catch (e) {
      console.warn('Failed to save mistakes', e);
    }
  }, [mistakes]);

  // ==========================================
  // 🔥 UI 颜色判定逻辑
  // ==========================================
  const proficiencyMap = useMemo(() => {
    const map: Record<string, ProficiencyStatus> = {};

    Object.values(mistakes).forEach((record) => {
      // 调试
      //   if (record.id === 'h-i') {
      //     console.log('DEBUG:', {
      //       id: record.id,
      //       streak: record.streak,
      //       perfectThres: PERFECT_THRESHOLD,
      //       isPerfect: record.streak >= PERFECT_THRESHOLD,
      //     });
      //   }
      // 1. 👑 皇冠 (Perfect)
      // 优先级最高：连对次数达到 10 次，封神！
      if (record.streak >= PERFECT_THRESHOLD) {
        map[record.id] = 'perfect';
      }
      // 2 🟢 绿色 (Mastered)
      // 优先级最高：只要连对 >= 2，不管以前错过多少次，都算掌握。
      else if (record.streak >= MASTERY_THRESHOLD) {
        map[record.id] = 'mastered';
      }

      // 3. 🔴 红色 (Weak)
      // 优先级次之：只要没变绿 (streak < 2)，且历史上出过错 (mistakeCount > 0)，就是红。
      // 这包含了 "浪子回头第一步 (streak=1)" 的情况，依然保持红色。
      else if (record.mistakeCount > 0) {
        map[record.id] = 'weak';
      }

      // 4. ⚪ 白色 (New)
      // 隐含逻辑：mistakeCount == 0 (身家清白) 且 streak < 2 (连对不够)。
      // 代码里不设置 key，UI 组件默认会显示白色。
    });

    return map;
  }, [mistakes]);

  // ==========================================
  // 记录逻辑
  // ==========================================
  const recordQuizResult = (id: string, isCorrect: boolean) => {
    setMistakes((prev) => {
      // 初始化记录 (默认为白：count=0, streak=0)
      const currentRecord = prev[id] || {
        id,
        mistakeCount: 0,
        streak: 0,
        lastMistakeTime: 0,
      };

      // A. 答错了
      if (!isCorrect) {
        return {
          ...prev,
          [id]: {
            ...currentRecord,
            mistakeCount: currentRecord.mistakeCount + 1, // 增加污点 (变红)
            streak: 0, // 连对归零
            lastMistakeTime: Date.now(),
          },
        };
      }

      // B. 答对了
      if (isCorrect) {
        const newStreak = currentRecord.streak + 1;

        return {
          ...prev,
          [id]: {
            ...currentRecord,
            streak: newStreak,
            // 如果本来是 0 (白)，保持 0 (继续白，直到 streak>=2 变绿)。
            // 如果本来 >0 (红)，保持 >0 (继续红，直到 streak>=2 变绿)。
          },
        };
      }

      return prev;
    });
  };

  const removeMistake = (id: string) => {
    setMistakes((prev) => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  };

  const clearAllMistakes = async () => {
    const { value } = await Dialog.confirm({
      title: t('settings.clear_mistakes_title'),
      message: t('settings.clear_mistakes_message'),
      okButtonTitle: t('common.delete'), // "删除"
      cancelButtonTitle: t('common.cancel'), // "取消"
    });

    if (value) {
      setMistakes({}); // 清空 State

      await Toast.show({
        text: t('settings.clear_success'),
        duration: 'short',
        position: 'bottom',
      });
    }
  };

  return (
    <MistakeContext.Provider
      value={{
        mistakes,
        proficiencyMap,
        recordQuizResult,
        removeMistake,
        clearAllMistakes,
      }}
    >
      {children}
    </MistakeContext.Provider>
  );
};

export const useMistakes = () => {
  const context = useContext(MistakeContext);
  if (!context) {
    throw new Error('useMistakes must be used within a MistakeProvider');
  }
  return context;
};
