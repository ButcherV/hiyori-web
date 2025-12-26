import React from 'react';
// 🔥 1. 补全图标引入：增加了 Speaker 和 Vibrate
import {
  // Sun,
  // Moon,
  // Type,
  Info,
  Globe,
  Volume2,
  Speaker,
  Vibrate,
} from 'lucide-react';
import styles from './AppSettingsMenu.module.css'; // 请确认这里引用的 CSS 文件名正确

import { useTranslation } from 'react-i18next';

// 引入全局钩子
import { useSettings } from '../../context/SettingsContext';

interface AppSettingsMenuProps {
  initialTheme?: 'light' | 'dark';
}

export const AppSettingsMenu: React.FC<AppSettingsMenuProps> = () => {
  const { t, i18n } = useTranslation();

  // 🔥 2. 从全局 Context 取出所有状态，包括漏掉的音效和震动
  const {
    // theme,
    // setTheme,
    // showRomaji,
    autoAudio,
    soundEffect, // 补回
    hapticFeedback, // 补回
    toggleSetting,
  } = useSettings();

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
  };

  return (
    <div className={styles.container}>
      {/* --- 显示设置 --- */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>{t('settings.display')}</div>

        {/* 主题 */}
        {/* <div className={styles.controlRow}>
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
        </div> */}

        {/* 语言 */}
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

      {/* --- 学习辅助 --- */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>{t('settings.learning')}</div>

        {/* 罗马音开关 */}
        {/* <div
          className={styles.controlRow}
          onClick={() => toggleSetting('showRomaji')}
        >
          <div className={styles.labelGroup}>
            <Type size={20} className={styles.icon} />
            <span className={styles.label}>{t('settings.show_romaji')}</span>
          </div>
          <div
            className={`${styles.switch} ${showRomaji ? styles.switchOn : ''}`}
          >
            <div className={styles.switchHandle} />
          </div>
        </div> */}

        {/* 自动发音开关 */}
        <div
          className={styles.controlRow}
          onClick={() => toggleSetting('autoAudio')}
        >
          <div className={styles.labelGroup}>
            <Volume2 size={20} className={styles.icon} />
            <span className={styles.label}>{t('settings.autoplay')}</span>
          </div>
          <div
            className={`${styles.switch} ${autoAudio ? styles.switchOn : ''}`}
          >
            <div className={styles.switchHandle} />
          </div>
        </div>
      </div>

      {/* --- 🔥🔥🔥 3. 新增反馈设置 (Feedback) --- */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Feedback</div>

        {/* 音效开关 (Sound Effects) */}
        <div
          className={styles.controlRow}
          onClick={() => toggleSetting('soundEffect')}
        >
          <div className={styles.labelGroup}>
            <Speaker size={20} className={styles.icon} />
            <span className={styles.label}>Sound Effects</span>
          </div>
          <div
            className={`${styles.switch} ${soundEffect ? styles.switchOn : ''}`}
          >
            <div className={styles.switchHandle} />
          </div>
        </div>

        {/* 震动开关 (Haptic Feedback) */}
        <div
          className={styles.controlRow}
          onClick={() => toggleSetting('hapticFeedback')}
        >
          <div className={styles.labelGroup}>
            <Vibrate size={20} className={styles.icon} />
            <span className={styles.label}>Haptic Feedback</span>
          </div>
          <div
            className={`${styles.switch} ${hapticFeedback ? styles.switchOn : ''}`}
          >
            <div className={styles.switchHandle} />
          </div>
        </div>
      </div>

      {/* --- 关于 --- */}
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

export default AppSettingsMenu;
