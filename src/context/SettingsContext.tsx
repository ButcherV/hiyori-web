import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. 定义设置项的数据结构
interface AppSettings {
  // 学习页用的 (Study Session)
  autoAudio: boolean; // 自动发音
  soundEffect: boolean; // 音效 (Ding/Buzz)
  hapticFeedback: boolean; // 震动反馈

  // 首页设置用的 (Global)
  showRomaji: boolean; // 显示罗马音
  theme: 'light' | 'dark'; // 主题 (预留)
}

// 定义 Context 提供的方法
interface SettingsContextType extends AppSettings {
  // 通用的切换方法 (key 必须是上面的属性名之一)
  toggleSetting: (key: keyof AppSettings) => void;
  // 单独设置主题的方法
  setTheme: (mode: 'light' | 'dark') => void;
}

// 默认设置
const defaultSettings: AppSettings = {
  autoAudio: true,
  soundEffect: true,
  hapticFeedback: true,
  showRomaji: true,
  theme: 'light',
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // 2. 初始化状态：优先从 localStorage 读取
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('app_settings');
      // 如果有存档，就合并（防止新加字段丢失）；没存档就用默认
      return saved
        ? { ...defaultSettings, ...JSON.parse(saved) }
        : defaultSettings;
    } catch (e) {
      console.warn('Failed to load settings', e);
      return defaultSettings;
    }
  });

  // 3. 监听变化：只要 settings 一变，自动保存到手机
  useEffect(() => {
    try {
      localStorage.setItem('app_settings', JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings', e);
    }
  }, [settings]);

  // 提供给组件的修改方法
  const toggleSetting = (key: keyof AppSettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const setTheme = (mode: 'light' | 'dark') => {
    setSettings((prev) => ({ ...prev, theme: mode }));
  };

  return (
    <SettingsContext.Provider value={{ ...settings, toggleSetting, setTheme }}>
      {children}
    </SettingsContext.Provider>
  );
};

// 4. 自定义 Hook：让组件方便调用
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
