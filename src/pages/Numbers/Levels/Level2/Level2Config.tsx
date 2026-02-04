import { useTranslation } from 'react-i18next';
import type { LevelConfig } from '../Level1/Level1Config';
import { Target, Lightbulb, Zap } from 'lucide-react';
import styles from '../LevelDescription.module.css';

export const Level2Description = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <Target size={18} color="#ef4444" />
          <span>{t('number_study.common.goal')}</span>
        </div>
        <div className={styles.sectionContent}>
          <p className={styles.text}>
            建立两位数的「拆分-组合」直觉。通过多样化的题型训练，
            让你看到任意两位数都能立即反应出正确的日语读法。
          </p>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <Lightbulb size={18} color="var(--color-study-number)" fill="var(--color-study-number)" fillOpacity={0.2} />
          <span>{t('number_study.common.keypoint')}</span>
        </div>
        <div className={styles.sectionContent}>
          <p className={styles.text}>
            <strong className={styles.strong}>组合规则：</strong>
            十位数字 + じゅう + 个位数字
          </p>
          <p style={{ marginTop: 8, color: 'var(--color-Gray7)' }}>
            例：47 = 40 (よんじゅう) + 7 (なな) = よんじゅうなな
          </p>
          <p className={styles.text} style={{ marginTop: 12 }}>
            <strong className={styles.strong}>省略规则：</strong>
            个位为 0 时，不读零。
          </p>
          <p style={{ marginTop: 8, color: 'var(--color-Gray7)' }}>
            例：20 = にじゅう（不是 にじゅうれい）
          </p>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <Zap size={18} color="#f59e0b" />
          <span>{t('number_study.common.speed_challenge')}</span>
        </div>
        <div className={styles.sectionContent}>
          <p className={styles.text}>
            本关卡包含 8 种题型：阿拉伯数字→假名、汉字→假名、
            听音辨数、算式组合等。通过多样化的考察方式，
            全方位建立数字与读音的条件反射。
          </p>
        </div>
      </div>
    </div>
  );
};

export const LEVEL2_CONFIG: LevelConfig = {
  id: 'lvl2',
  labelKey: 'number_study.numbers.levels.lvl2.label',
  titleKey: 'number_study.numbers.levels.lvl2.title',
  DescriptionContent: Level2Description,
};
