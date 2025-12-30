import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { useSettings } from '../../context/SettingsContext';
import type { UILang } from '../../context/SettingsContext';
import styles from './Onboarding.module.css';

export const Onboarding: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { updateSettings } = useSettings();

  // 💡 修改点 1：将状态改为包含方向的数组 [[当前步, 方向]]
  const [[step, direction], setStepState] = useState([1, 0]);

  const handleLangSelect = (lang: UILang) => {
    setTempUI(lang);
    i18n.changeLanguage(lang);
    // 💡 前进：方向设为 1
    setStepState([2, 1]);
  };

  const goBack = () => {
    // 💡 后退：方向设为 -1
    setStepState([1, -1]);
  };

  const [tempUI, setTempUI] = useState<UILang>('en');

  const handleFinish = (hasBackground: boolean) => {
    updateSettings({
      uiLanguage: tempUI,
      kanjiBackground: hasBackground,
      hasFinishedOnboarding: true,
    });
  };

  // 💡 修改点 2：动画变体逻辑
  const variants = {
    // 进入时：如果前进(1)从右边(300)进，如果后退(-1)从左边(-300)进
    enter: (dir: number) => ({
      x: dir >= 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    // 退出时：如果前进(1)向左(-300)出，如果后退(-1)向右(300)出
    exit: (dir: number) => ({
      x: dir >= 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <div className={styles.container}>
      {/* 💡 修改点 3：将 direction 传给 custom 属性 */}
      <AnimatePresence mode="wait" custom={direction}>
        {step === 1 ? (
          <motion.div
            key="step1"
            custom={direction} // 必须传给每一个 motion 元素
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={styles.content}
          >
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
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={styles.content}
          >
            <h1 className={styles.title}>{t('onboarding.step2_title')}</h1>
            <p className={styles.desc}>{t('onboarding.step2_desc')}</p>

            <div className={styles.cardStack}>
              {tempUI === 'zh' || tempUI === 'zh-Hant' ? (
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

            <button className={styles.backLink} onClick={goBack}>
              {t('onboarding.back')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
