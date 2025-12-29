import React, { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';
import styles from './Onboarding.module.css';

export const Onboarding: React.FC = () => {
  const { updateSettings } = useSettings();
  const [step, setStep] = useState<1 | 2>(1);
  const [tempUI, setTempUI] = useState<'en' | 'zh'>('en');

  // 处理最终提交
  const handleFinish = (nativeLang: 'en' | 'zh') => {
    updateSettings({
      uiLanguage: tempUI,
      nativeLanguage: nativeLang,
      hasFinishedOnboarding: true,
    });
  };

  // 第一步：双语入口
  if (step === 1) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.bilingualTitle}>
            Select Language <br />
            <span className={styles.subTitle}>选择界面语言</span>
          </h1>
          <div className={styles.btnStack}>
            <button
              className={styles.mainBtn}
              onClick={() => {
                setTempUI('en');
                setStep(2);
              }}
            >
              English
            </button>
            <button
              className={styles.mainBtn}
              onClick={() => {
                setTempUI('zh');
                setStep(2);
              }}
            >
              简体中文
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 第二步：智能分支逻辑
  const isEnUI = tempUI === 'en';

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {isEnUI ? (
          /* 分支 A：英文界面 -> 询问背景 */
          <>
            <h1 className={styles.title}>Kanji Foundation</h1>
            <p className={styles.desc}>
              Do you have experience with Chinese characters
              (Kanji/Hanzi/Hanja)?
            </p>
            <div className={styles.cardStack}>
              <div
                className={styles.logicCard}
                onClick={() => handleFinish('zh')}
              >
                <h3>Yes, I know Kanji</h3>
                <p>Use characters as semantic anchors to learn faster.</p>
              </div>
              <div
                className={styles.logicCard}
                onClick={() => handleFinish('en')}
              >
                <h3>No, I'm a beginner</h3>
                <p>Focus on phonetic shapes with visual noise reduction.</p>
              </div>
            </div>
          </>
        ) : (
          /* 分支 B：中文界面 -> 智能推断 */
          <>
            <h1 className={styles.title}>教学逻辑已就绪</h1>
            <p className={styles.desc}>
              检测到您使用中文界面，系统已自动为您开启<b>“汉字锚点模式”</b>
              ，利用您的汉字储备加速记忆。
            </p>
            <div className={styles.previewCard}>
              <div className={styles.badge}>已智能开启</div>
              <h3>语义加速算法</h3>
              <p>我们将利用汉字与假名的对应关系，为您规划最高效的学习路径。</p>
            </div>
            <button
              className={styles.finishBtn}
              onClick={() => handleFinish('zh')}
            >
              开启学习之旅
            </button>
            <button
              className={styles.altLink}
              onClick={() => handleFinish('en')}
            >
              我不熟悉汉字，切换为基础模式
            </button>
          </>
        )}

        <button className={styles.backLink} onClick={() => setStep(1)}>
          {isEnUI ? '← Back' : '← 返回修改语言'}
        </button>
      </div>
    </div>
  );
};
