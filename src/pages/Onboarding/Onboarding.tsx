import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../../context/SettingsContext';
import type { UILang } from '../../context/SettingsContext';
import styles from './Onboarding.module.css';

export const Onboarding: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { updateSettings } = useSettings();
  const [step, setStep] = useState<1 | 2>(1);
  const [tempUI, setTempUI] = useState<UILang>('en');

  // 第一步：选语言
  const handleLangSelect = (lang: UILang) => {
    setTempUI(lang);
    // 选完立刻切换 i18n，这样第二步看到的翻译就是对的
    i18n.changeLanguage(lang);
    setStep(2);
  };

  const handleFinish = (hasBackground: boolean) => {
    updateSettings({
      uiLanguage: tempUI,
      kanjiBackground: hasBackground,
      hasFinishedOnboarding: true,
    });
  };

  if (step === 1) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.bilingualTitle}>Language / 语言 / 語言</h1>
          <div className={styles.btnStack}>
            <button
              className={styles.mainBtn}
              onClick={() => handleLangSelect('zh')}
            >
              简体中文
            </button>
            <button
              className={styles.mainBtn}
              onClick={() => handleLangSelect('zh-Hant')}
            >
              繁體中文
            </button>
            <button
              className={styles.mainBtn}
              onClick={() => handleLangSelect('en')}
            >
              English
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 第二步：根据 tempUI 决定是展示“询问”还是“智能建议”
  const isChineseUI = tempUI === 'zh' || tempUI === 'zh-Hant';

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>{t('onboarding.step2_title')}</h1>
        <p className={styles.desc}>{t('onboarding.step2_desc')}</p>

        <div className={styles.cardStack}>
          {isChineseUI ? (
            /* 中文界面分支：直接放一个巨大的推荐按钮 */
            <>
              <div className={styles.previewCard}>
                <div className={styles.badge}>推荐方案</div>
                <h3>{t('onboarding.option_kanji_label')}</h3>
                <p>{t('onboarding.option_kanji_desc')}</p>
              </div>
              <button
                className={styles.finishBtn}
                onClick={() => handleFinish(true)}
              >
                这就开始
              </button>
              <button
                className={styles.altLink}
                onClick={() => handleFinish(false)}
              >
                {t('onboarding.option_kana_label')}
              </button>
            </>
          ) : (
            /* 英文界面分支：老老实实二选一 */
            <>
              <div
                className={styles.logicCard}
                onClick={() => handleFinish(false)}
              >
                <h3>{t('onboarding.option_kana_label')}</h3>
                <p>{t('onboarding.option_kana_desc')}</p>
              </div>
              <div
                className={styles.logicCard}
                onClick={() => handleFinish(true)}
              >
                <h3>{t('onboarding.option_kanji_label')}</h3>
                <p>{t('onboarding.option_kanji_desc')}</p>
              </div>
            </>
          )}
        </div>

        <button className={styles.backLink} onClick={() => setStep(1)}>
          {t('onboarding.back')}
        </button>
      </div>
    </div>
  );
};
