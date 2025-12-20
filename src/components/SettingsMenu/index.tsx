import React, { useState } from 'react';
import { 
  Sun, Moon, 
  Info, Globe, 
  Type, Volume2 
} from 'lucide-react';
import styles from './SettingsMenu.module.css';

import { useTranslation } from 'react-i18next';

type ThemeMode = 'light' | 'dark';

interface SettingsMenuProps {
  initialTheme?: ThemeMode;
}

export const SettingsMenu: React.FC<SettingsMenuProps> = ({ 
  initialTheme = 'light', 
}) => {
  const { t, i18n } = useTranslation();

  const [theme, setTheme] = useState<ThemeMode>(initialTheme);
  const [showRomaji, setShowRomaji] = useState(true);

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
  };

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>{t('settings.display')}</div>
        <div className={styles.controlRow}>
          <div className={styles.labelGroup}>
            <Sun size={20} className={styles.icon} />
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

        <div className={styles.controlRow}>
          <div className={styles.labelGroup}>
            <Globe size={20} className={styles.icon} />
            <span className={styles.label}>{t('settings.language')}</span>
          </div>
          
          <div className={styles.pillGroup}>
            <button
              className={`${styles.pillBtn} ${i18n.language.startsWith('en') ? styles.active : ''}`}
              onClick={() => handleLanguageChange('en')}
            >
              En
            </button>
            <button 
              className={`${styles.pillBtn} ${i18n.language.startsWith('zh') ? styles.active : ''}`}
              onClick={() => handleLanguageChange('zh')}
            >
              中
            </button>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>{t('settings.learning')}</div>
        <div className={styles.controlRow} onClick={() => setShowRomaji(!showRomaji)}>
          <div className={styles.labelGroup}>
            <Type size={20} className={styles.icon} />
            <span className={styles.label}>{t('settings.show_romaji')}</span>
          </div>
          <div className={`${styles.switch} ${showRomaji ? styles.switchOn : ''}`}>
            <div className={styles.switchHandle} />
          </div>
        </div>
        
        <div className={styles.controlRow}>
          <div className={styles.labelGroup}>
            <Volume2 size={20} className={styles.icon} />
            <span className={styles.label}>{t('settings.autoplay')}</span>
          </div>
          <div className={styles.switch}>
            <div className={styles.switchHandle} />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>{t('settings.about')}</div>
        <div className={styles.controlRow}>
          <div className={styles.labelGroup}>
            <Info size={20} className={styles.icon} />
            <span className={styles.label}>{t('common.version')}</span>
          </div>
          <span className={styles.value}>1.0.0 (Beta)</span>
        </div>
      </div>
    </div>
  );
};

export default SettingsMenu;