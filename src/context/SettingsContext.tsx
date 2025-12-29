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
}

interface SettingsContextType extends AppSettings {
  toggleSetting: (key: keyof AppSettings) => void;
  // 新增：支持直接更新多个字段的方法
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  setTheme: (mode: 'light' | 'dark') => void;
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
      return saved
        ? { ...defaultSettings, ...JSON.parse(saved) }
        : defaultSettings;
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

  return (
    <SettingsContext.Provider
      value={{ ...settings, toggleSetting, updateSettings, setTheme }}
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
