import React, { useState } from 'react';
import { 
  Sun, Moon, 
  Info, Globe, 
  Type, Volume2 
} from 'lucide-react';
import styles from './SettingsMenu.module.css';

// ✅ 1. 引入 i18n 钩子
import { useTranslation } from 'react-i18next';

// 外观只保留 light/dark
type ThemeMode = 'light' | 'dark';

interface SettingsMenuProps {
  initialTheme?: ThemeMode;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({ 
  initialTheme = 'light', 
}) => {
  // ✅ 2. 获取 t (翻译函数) 和 i18n (控制实例)
  const { t, i18n } = useTranslation();

  const [theme, setTheme] = useState<ThemeMode>(initialTheme);
  const [showRomaji, setShowRomaji] = useState(true);

  // ❌ 删除：const [lang, setLang] = useState... 
  // 我们不再需要本地的 lang 状态，直接读取 i18n.language

  // ✅ 3. 定义切换语言的函数
  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code); // 这行代码会触发全局重新渲染
  };

  return (
    <div className={styles.container}>
      
      {/* --- Section 1: Display --- */}
      <div className={styles.section}>
        {/* ✅ 文案替换变量: DISPLAY */}
        <div className={styles.sectionTitle}>{t('settings.display')}</div>

        {/* 1. Appearance */}
        <div className={styles.controlRow}>
          <div className={styles.labelGroup}>
            <Sun size={20} className={styles.icon} />
            {/* ✅ 文案替换变量: Appearance */}
            <span className={styles.label}>{t('settings.appearance')}</span>
          </div>
          
          <div className={styles.segmentedControl}>
            <button 
              className={`${styles.segmentBtn} ${theme === 'light' ? styles.active : ''}`}
              onClick={() => setTheme('light')}
            >
              <Sun size={18} />
            </button>
            <button 
              className={`${styles.segmentBtn} ${theme === 'dark' ? styles.active : ''}`}
              onClick={() => setTheme('dark')}
            >
              <Moon size={18} />
            </button>
          </div>
        </div>

        {/* 2. Language */}
        <div className={styles.controlRow}>
          <div className={styles.labelGroup}>
            <Globe size={20} className={styles.icon} />
            {/* ✅ 文案替换变量: Language */}
            <span className={styles.label}>{t('settings.language')}</span>
          </div>
          
          <div className={styles.pillGroup}>
            <button 
              // ✅ 逻辑修改: 判断 i18n.language 是否以 'en' 开头 (兼容 en-US, en-GB)
              className={`${styles.pillBtn} ${i18n.language.startsWith('en') ? styles.active : ''}`}
              // ✅ 逻辑修改: 调用 changeLanguage
              onClick={() => handleLanguageChange('en')}
            >
              En
            </button>
            <button 
              // ✅ 逻辑修改: 判断 i18n.language 是否以 'zh' 开头
              className={`${styles.pillBtn} ${i18n.language.startsWith('zh') ? styles.active : ''}`}
              // ✅ 逻辑修改: 调用 changeLanguage
              onClick={() => handleLanguageChange('zh')}
            >
              中
            </button>
          </div>
        </div>
      </div>

      {/* --- Section 2: Learning --- */}
      <div className={styles.section}>
        {/* ✅ 文案替换变量: LEARNING */}
        <div className={styles.sectionTitle}>{t('settings.learning')}</div>
        
        <div className={styles.controlRow} onClick={() => setShowRomaji(!showRomaji)}>
          <div className={styles.labelGroup}>
            <Type size={20} className={styles.icon} />
            {/* ✅ 文案替换变量: Show Romaji */}
            <span className={styles.label}>{t('settings.show_romaji')}</span>
          </div>
          <div className={`${styles.switch} ${showRomaji ? styles.switchOn : ''}`}>
            <div className={styles.switchHandle} />
          </div>
        </div>
        
        <div className={styles.controlRow}>
          <div className={styles.labelGroup}>
            <Volume2 size={20} className={styles.icon} />
            {/* ✅ 文案替换变量: Auto-play Audio */}
            <span className={styles.label}>{t('settings.autoplay')}</span>
          </div>
          <div className={styles.switch}>
            <div className={styles.switchHandle} />
          </div>
        </div>
      </div>

      {/* --- Section 3: About --- */}
      <div className={styles.section}>
        {/* ✅ 文案替换变量: ABOUT */}
        <div className={styles.sectionTitle}>{t('settings.about')}</div>
        <div className={styles.controlRow}>
          <div className={styles.labelGroup}>
            <Info size={20} className={styles.icon} />
            {/* ✅ 文案替换变量: Version (注意这个在 common 命名空间下) */}
            <span className={styles.label}>{t('common.version')}</span>
          </div>
          <span className={styles.value}>1.0.0 (Beta)</span>
        </div>
      </div>

    </div>
  );
};

export default SettingsMenu;