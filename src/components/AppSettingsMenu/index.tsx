import React from 'react';
import {
  Info,
  Globe,
  Volume2,
  Speaker,
  Vibrate,
  Trash2,
  BookOpen,
} from 'lucide-react';
import styles from './AppSettingsMenu.module.css';

import { useTranslation } from 'react-i18next';
import { useSettings } from '../../context/SettingsContext';
import { useProgress } from '../../context/ProgressContext';

interface AppSettingsMenuProps {
  initialTheme?: 'light' | 'dark';
  onClose?: () => void;
}

export const AppSettingsMenu: React.FC<AppSettingsMenuProps> = ({
  onClose,
}) => {
  const { t, i18n } = useTranslation();

  const {
    uiLanguage,
    kanjiBackground,
    autoAudio,
    soundEffect,
    hapticFeedback,
    toggleSetting,
    updateSettings,
  } = useSettings();

  const { clearHistory } = useProgress();

  const handleLanguageChange = (code: 'en' | 'zh' | 'zh-Hant') => {
    updateSettings({ uiLanguage: code });
    i18n.changeLanguage(code);
  };

  const handleClearData = async () => {
    await clearHistory();
    if (onClose) onClose();
  };

  return (
    <div className={styles.container}>
      {/* UI Language - (En/简/繁) */}
      <div className={styles.controlRow}>
        <div className={styles.labelGroup}>
          <Globe size={20} className={styles.icon} />
          <span className={styles.label}>{t('settings.ui_language')}</span>
        </div>

        <div className={styles.pillGroup}>
          <button
            className={`${styles.pillBtn} ${uiLanguage === 'en' ? styles.active : ''}`}
            onClick={() => handleLanguageChange('en')}
          >
            En
          </button>
          <button
            className={`${styles.pillBtn} ${uiLanguage === 'zh' ? styles.active : ''}`}
            onClick={() => handleLanguageChange('zh')}
          >
            简
          </button>
          <button
            className={`${styles.pillBtn} ${uiLanguage === 'zh-Hant' ? styles.active : ''}`}
            onClick={() => handleLanguageChange('zh-Hant')}
          >
            繁
          </button>
        </div>
      </div>

      {/* 汉字基础 */}
      <div
        className={styles.controlRow}
        onClick={() => toggleSetting('kanjiBackground')}
      >
        <div className={styles.labelGroup}>
          <BookOpen size={20} className={styles.icon} />
          <span className={styles.label}>{t('settings.kanji_background')}</span>
        </div>
        <div
          className={`${styles.switch} ${kanjiBackground ? styles.switchOn : ''}`}
        >
          <div className={styles.switchHandle} />
        </div>
      </div>

      {/* 自动发音 */}
      <div
        className={styles.controlRow}
        onClick={() => toggleSetting('autoAudio')}
      >
        <div className={styles.labelGroup}>
          <Volume2 size={20} className={styles.icon} />
          <span className={styles.label}>{t('settings.autoplay')}</span>
        </div>
        <div className={`${styles.switch} ${autoAudio ? styles.switchOn : ''}`}>
          <div className={styles.switchHandle} />
        </div>
      </div>

      {/* 音效 */}
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

      {/* 触感反馈 */}
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

      {/* 版本号 */}
      <div className={styles.controlRow}>
        <div className={styles.labelGroup}>
          <Info size={20} className={styles.icon} />
          <span className={styles.label}>{t('common.version')}</span>
        </div>
        <span className={styles.value}>1.0.0 (Beta)</span>
      </div>

      {/* 清除数据 */}
      <div
        className={styles.controlRow}
        onClick={handleClearData}
        style={{ cursor: 'pointer' }}
      >
        <div className={styles.labelGroup}>
          <Trash2 size={20} className={styles.icon} color="#ff3b30" />
          <span className={styles.label} style={{ color: '#ff3b30' }}>
            {t('settings.clear_progress_btn')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AppSettingsMenu;
