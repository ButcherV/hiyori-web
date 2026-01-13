import React from 'react';
import {
  Globe,
  Volume2,
  Speaker,
  Vibrate,
  Trash2,
  BookOpen,
  MessageCircle,
} from 'lucide-react';
import styles from './AppSettingsMenu.module.css';

import { useTranslation } from 'react-i18next';
import { useSettings } from '../../context/SettingsContext';
import { useProgress } from '../../context/ProgressContext';
import { Switch } from '../../components/Switch';

interface AppSettingsMenuProps {
  initialTheme?: 'light' | 'dark';
  onClose?: () => void;
}

// --- 定义内联品牌 SVG 组件 ---

// X (原 Twitter) 官方品牌 Logo (单色，跟随文字颜色)
const XBrandIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    id="X-Twitter-Logo--Streamline-Logos-Block"
    height="24"
    width="24"
  >
    <desc>X Twitter Logo Streamline Icon: https://streamlinehq.com</desc>
    <path
      fill="#000000"
      fillRule="evenodd"
      d="M5 1C2.79086 1 1 2.79086 1 5v14c0 2.2091 1.79086 4 4 4h14c2.2091 0 4 -1.7909 4 -4V5c0 -2.20914 -1.7909 -4 -4 -4H5Zm-0.33429 3.5c-0.17536 0.06527 -0.32332 0.19509 -0.40968 0.3683 -0.12689 0.2545 -0.09892 0.55889 0.07223 0.78601l5.61418 7.45029 -5.91591 6.344c-0.01551 0.0167 -0.03011 0.0338 -0.04382 0.0514h2.04691l4.82948 -5.179 3.7133 4.9278c0.0871 0.1155 0.2043 0.2018 0.3364 0.2512h4.4223c0.1748 -0.0654 0.3224 -0.195 0.4085 -0.3679 0.1269 -0.2545 0.099 -0.5589 -0.0722 -0.786l-5.6142 -7.4503L20.0173 4.5h-2.051l-4.8298 5.17932 -3.7133 -4.92774c-0.08729 -0.11583 -0.20496 -0.20227 -0.3375 -0.25158H4.66571ZM15.5454 18.0475 6.4315 5.95294h2.01878L17.5642 18.0475h-2.0188Z"
      clipRule="evenodd"
      strokeWidth="1"
    ></path>
  </svg>
);

const GmailBrandIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    id="Google-Logo--Streamline-Logos-Block"
    height="24"
    width="24"
  >
    <desc>Google Logo Streamline Icon: https://streamlinehq.com</desc>
    <path
      fill="#000000"
      fillRule="evenodd"
      d="M5 1a4 4 0 0 0 -4 4v14a4 4 0 0 0 4 4h14a4 4 0 0 0 4 -4V5a4 4 0 0 0 -4 -4H5Zm0.285 6.9C6.65 5.564 9.147 4 12 4c2.321 0 4.15 0.744 5.455 1.973l-2.252 2.39A4.728 4.728 0 0 0 7.9 9.993L5.285 7.9ZM17.01 18.412C15.745 19.409 14.068 20 12 20c-2.864 0 -5.369 -1.576 -6.73 -3.927l2.649 -2.027a4.728 4.728 0 0 0 6.358 2.193l-0.019 0.023 2.75 2.15Zm0.808 -0.753c1.319 -1.448 2.001 -3.449 2.001 -5.659 0 -0.497 -0.034 -0.983 -0.103 -1.454H12v2.909h4.681a4.734 4.734 0 0 1 -1.466 2.17l2.602 2.034ZM7.55 12.954a4.748 4.748 0 0 1 -0.01 -1.854L4.79 8.9a8.13 8.13 0 0 0 -0.608 3.099c0 1.09 0.213 2.127 0.598 3.074l2.77 -2.12Z"
      clipRule="evenodd"
      strokeWidth="1"
    ></path>
  </svg>
);

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
        <Switch
          checked={kanjiBackground}
          onChange={() => toggleSetting('kanjiBackground')}
        />
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
        <Switch
          checked={autoAudio}
          onChange={() => toggleSetting('autoAudio')}
        />
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
        <Switch
          checked={soundEffect}
          onChange={() => toggleSetting('soundEffect')}
        />
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
        <Switch
          checked={hapticFeedback}
          onChange={() => toggleSetting('hapticFeedback')}
        />
      </div>

      {/* --- 联系作者  --- */}
      <div className={styles.controlRow}>
        <div className={styles.labelGroup}>
          <MessageCircle size={20} className={styles.icon} />
          <span className={styles.label}>{t('settings.contact_author')}</span>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            paddingRight: '2px',
          }}
        >
          {/* X (Twitter) 链接 */}
          <a
            href="https://x.com/xiaowei_911" //  https://x.com/yourname
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'inherit',
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
            }}
            title="X (Twitter)"
          >
            <XBrandIcon />
          </a>

          {/* Gmail 链接 */}
          <a
            href="mailto:butchervv@gmail.com" // mailto: xxx@mail.com
            style={{ display: 'flex', alignItems: 'center', padding: '4px' }}
            title="Gmail"
          >
            <GmailBrandIcon />
          </a>
        </div>
      </div>

      {/* 版本号 */}
      {/* <div className={styles.controlRow}>
        <div className={styles.labelGroup}>
          <Info size={20} className={styles.icon} />
          <span className={styles.label}>{t('common.version')}</span>
        </div>
        <span className={styles.value}>1.0.0 (Beta)</span>
      </div> */}

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
