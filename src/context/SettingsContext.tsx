import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from 'i18next';

export type UILang = 'en' | 'zh' | 'zh-Hant';

interface AppSettings {
  autoAudio: boolean;
  soundEffect: boolean;
  hapticFeedback: boolean;
  showRomaji: boolean;
  theme: 'light' | 'dark';

  uiLanguage: UILang;
  kanjiBackground: boolean;
  hasFinishedOnboarding: boolean;
  lastActiveCourseId: string;

  // --- 记录假名页面的 Tab ---
  lastHiraganaTab: string; // 'seion' | 'dakuon' | 'yoon'
  lastKatakanaTab: string;

  // 数字模块专用字段
  // 1. 记录上次学到了第几关 (如 'lvl1')
  lastNumberLevel: string;
  // 2. 记录哪些关卡的说明书已经看过了 (存 ['lvl1', 'lvl2'])
  viewedNumberIntros: string[];
}

interface SettingsContextType extends AppSettings {
  toggleSetting: (key: keyof AppSettings) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  setTheme: (mode: 'light' | 'dark') => void;
  setLastNumberLevel: (levelId: string) => void;
  markNumberIntroAsViewed: (levelId: string) => void;
}

// 默认设置
const defaultSettings: AppSettings = {
  autoAudio: true,
  soundEffect: true,
  hapticFeedback: true,
  showRomaji: true,
  theme: 'light',
  // --- 新增默认值 ---
  uiLanguage: 'en',
  kanjiBackground: false,
  hasFinishedOnboarding: false,
  lastActiveCourseId: 'hiragana',
  lastHiraganaTab: 'seion',
  lastKatakanaTab: 'seion',
  lastNumberLevel: 'lvl1',
  viewedNumberIntros: [],
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('app_settings');
      const parsed = saved ? JSON.parse(saved) : {};
      return {
        ...defaultSettings,
        ...parsed,
        // 确保数组字段绝对不为 undefined
        viewedNumberIntros: parsed.viewedNumberIntros || [],
      };
    } catch (e) {
      console.warn('Failed to load settings', e);
      return defaultSettings;
    }
  });

  // 关键逻辑：监听 uiLanguage 变化，强制同步给 i18next 插件
  useEffect(() => {
    i18n.changeLanguage(settings.uiLanguage);
  }, [settings.uiLanguage]);

  useEffect(() => {
    try {
      localStorage.setItem('app_settings', JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings', e);
    }
  }, [settings]);

  const toggleSetting = (key: keyof AppSettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // 新增：更新方法
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const setTheme = (mode: 'light' | 'dark') => {
    setSettings((prev) => ({ ...prev, theme: mode }));
  };

  const setLastNumberLevel = (levelId: string) => {
    setSettings((prev) => ({ ...prev, lastNumberLevel: levelId }));
  };

  const markNumberIntroAsViewed = (levelId: string) => {
    setSettings((prev) => {
      // 如果已经包含，直接返回，避免不必要的重渲染
      if (prev.viewedNumberIntros.includes(levelId)) return prev;
      return {
        ...prev,
        viewedNumberIntros: [...prev.viewedNumberIntros, levelId],
      };
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        toggleSetting,
        updateSettings,
        setTheme,
        setLastNumberLevel,
        markNumberIntroAsViewed,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
