import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 定义设置的类型
interface SettingsState {
  showRomaji: boolean;    // 显示罗马音
  autoAudio: boolean;     // 自动发音
  soundEffect: boolean;   // 音效 (Bingo/Oops)
  hapticFeedback: boolean; // 震动反馈
}

interface SettingsContextType extends SettingsState {
  toggleSetting: (key: keyof SettingsState) => void;
}

const defaultSettings: SettingsState = {
  showRomaji: true,
  autoAudio: true,
  soundEffect: true,
  hapticFeedback: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  // 尝试从 localStorage 读取设置，如果没有就用默认
  const [settings, setSettings] = useState<SettingsState>(() => {
    const saved = localStorage.getItem('app_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  // 每次设置变动，自动保存到本地
  useEffect(() => {
    localStorage.setItem('app_settings', JSON.stringify(settings));
  }, [settings]);

  const toggleSetting = (key: keyof SettingsState) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <SettingsContext.Provider value={{ ...settings, toggleSetting }}>
      {children}
    </SettingsContext.Provider>
  );
}

// 自定义 Hook，方便组件调用
export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}