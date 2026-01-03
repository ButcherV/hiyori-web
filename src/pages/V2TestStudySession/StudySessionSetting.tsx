import React from 'react';
import { Volume2, Speaker, Vibrate } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from './StudySessionSetting.module.css';

// 定义 Props：只接收状态和回调，不处理逻辑
interface StudySessionSettingProps {
  // 1. 自动发音 (结构保留，暂时可以是摆设，也可以存状态)
  autoAudioEnabled: boolean;
  onToggleAutoAudio: () => void;

  // 2. 音效
  soundEnabled: boolean;
  onToggleSound: () => void;

  // 3. 震动
  hapticEnabled: boolean;
  onToggleHaptic: () => void;
}

export const StudySessionSetting: React.FC<StudySessionSettingProps> = ({
  autoAudioEnabled,
  onToggleAutoAudio,
  soundEnabled,
  onToggleSound,
  hapticEnabled,
  onToggleHaptic,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      {/* 自动发音开关*/}
      <div className={styles.controlRow} onClick={onToggleAutoAudio}>
        <div className={styles.labelGroup}>
          <Volume2 size={20} className={styles.icon} />
          <span className={styles.label}>{t('settings.autoplay')}</span>
        </div>
        <div
          className={`${styles.switch} ${autoAudioEnabled ? styles.switchOn : ''}`}
        >
          <div className={styles.switchHandle} />
        </div>
      </div>

      {/* 音效开关 */}
      <div className={styles.controlRow} onClick={onToggleSound}>
        <div className={styles.labelGroup}>
          <Speaker size={20} className={styles.icon} />
          <span className={styles.label}>Sound Effects</span>
        </div>
        <div
          className={`${styles.switch} ${soundEnabled ? styles.switchOn : ''}`}
        >
          <div className={styles.switchHandle} />
        </div>
      </div>

      {/* 震动开关 */}
      <div className={styles.controlRow} onClick={onToggleHaptic}>
        <div className={styles.labelGroup}>
          <Vibrate size={20} className={styles.icon} />
          <span className={styles.label}>Haptic Feedback</span>
        </div>
        <div
          className={`${styles.switch} ${hapticEnabled ? styles.switchOn : ''}`}
        >
          <div className={styles.switchHandle} />
        </div>
      </div>
    </div>
  );
};
