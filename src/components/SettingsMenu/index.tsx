import React, { useState } from 'react';
import { 
  Sun, Moon, 
  Info, Globe, 
  Type, Volume2 
} from 'lucide-react';
import styles from './SettingsMenu.module.css';

// ✅ 修改 1: 外观只保留 light/dark
type ThemeMode = 'light' | 'dark';
type LanguageCode = 'en' | 'zh'; 

interface SettingsMenuProps {
  initialTheme?: ThemeMode;
  initialLang?: LanguageCode;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({ 
  initialTheme = 'light', // 默认为 light
  initialLang = 'en'
}) => {
  const [theme, setTheme] = useState<ThemeMode>(initialTheme);
  const [lang, setLang] = useState<LanguageCode>(initialLang);
  const [showRomaji, setShowRomaji] = useState(true);

  return (
    <div className={styles.container}>
      
      {/* --- Section 1: Display --- */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>DISPLAY</div>

        {/* 1. Appearance (只保留 Light/Dark) */}
        <div className={styles.controlRow}>
          <div className={styles.labelGroup}>
            <Sun size={20} className={styles.icon} />
            <span className={styles.label}>Appearance</span>
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

        {/* 2. Language (✅ 修改：改为 controlRow，实现左右一行展示) */}
        <div className={styles.controlRow}>
          <div className={styles.labelGroup}>
            <Globe size={20} className={styles.icon} />
            <span className={styles.label}>Language</span>
          </div>
          
          <div className={styles.pillGroup}>
            <button 
              className={`${styles.pillBtn} ${lang === 'en' ? styles.active : ''}`}
              onClick={() => setLang('en')}
            >
              En
            </button>
            <button 
              className={`${styles.pillBtn} ${lang === 'zh' ? styles.active : ''}`}
              onClick={() => setLang('zh')}
            >
              中
            </button>
          </div>
        </div>
      </div>

      {/* --- Section 2: Learning --- */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>LEARNING</div>
        
        <div className={styles.controlRow} onClick={() => setShowRomaji(!showRomaji)}>
          <div className={styles.labelGroup}>
            <Type size={20} className={styles.icon} />
            <span className={styles.label}>Show Romaji</span>
          </div>
          <div className={`${styles.switch} ${showRomaji ? styles.switchOn : ''}`}>
            <div className={styles.switchHandle} />
          </div>
        </div>
        
        <div className={styles.controlRow}>
          <div className={styles.labelGroup}>
            <Volume2 size={20} className={styles.icon} />
            <span className={styles.label}>Auto-play Audio</span>
          </div>
          <div className={styles.switch}>
            <div className={styles.switchHandle} />
          </div>
        </div>
      </div>

      {/* --- Section 3: About --- */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>ABOUT</div>
        <div className={styles.controlRow}>
          <div className={styles.labelGroup}>
            <Info size={20} className={styles.icon} />
            <span className={styles.label}>Version</span>
          </div>
          <span className={styles.value}>1.0.0 (Beta)</span>
        </div>
      </div>

    </div>
  );
};

export default SettingsMenu;