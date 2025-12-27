import React from 'react';
import { Info, Globe, Volume2, Speaker, Vibrate, Trash2 } from 'lucide-react';
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
  const { autoAudio, soundEffect, hapticFeedback, toggleSetting } =
    useSettings();

  const { clearHistory } = useProgress();

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
  };

  const handleClearData = async () => {
    await clearHistory();
    if (onClose) onClose();
  };

  return (
    <div className={styles.container}>
      {/* 1. 语言设置 */}
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

      {/* 2. 自动发音 */}
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

      {/* 3. 音效 */}
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

      {/* 4. 触感反馈 */}
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

      {/* 6. 版本号 (放在最后比较合适) */}
      <div className={styles.controlRow}>
        <div className={styles.labelGroup}>
          <Info size={20} className={styles.icon} />
          <span className={styles.label}>{t('common.version')}</span>
        </div>
        <span className={styles.value}>1.0.0 (Beta)</span>
      </div>

      {/* 5. 清除数据 (红色) */}
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
