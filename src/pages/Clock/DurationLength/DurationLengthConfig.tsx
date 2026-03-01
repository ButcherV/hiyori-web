import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Target, Lightbulb, MousePointerClick } from 'lucide-react';
import styles from '../../Numbers/Levels/LevelDescription.module.css';

// 定义关卡配置的接口
export interface ClockLessonConfig {
  id: string;
  labelKey: string;
  titleKey: string;
  DescriptionContent: React.FC;
}

// 时长课程说明组件
const DurationLengthDescription: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      {/* 板块 1: 本课目标 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <Target size={18} color="var(--color-error)" />
          <span>{t('clock_study.common.goal')}</span>
        </div>
        <div className={styles.sectionContent}>
          <p className={styles.text}>
            <Trans
              i18nKey="clock_study.duration_length_course.goal_desc"
              components={{
                highlight: <span className="highlight-text" />,
              }}
            />
          </p>
        </div>
      </div>

      {/* 板块 2: 特殊读音 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <Lightbulb
            size={18}
            color="var(--color-study-clock)"
            fill="var(--color-study-clock)"
            fillOpacity={0.2}
          />
          <span>{t('clock_study.common.special_pronunciation')}</span>
        </div>
        <div className={styles.sectionContent}>
          <div className={styles.text}>
            <Trans
              i18nKey="clock_study.duration_length_course.special_pronunciation_desc"
              components={{
                strong: <strong className={styles.strong} />,
                br: <br />,
                span: <span className={styles.highlight} />,
                highlight: <span className="highlight-text" />,
              }}
            />
          </div>
        </div>
      </div>

      {/* 板块 3: 交互说明 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <MousePointerClick
            size={18}
            color="var(--color-study-clock)"
          />
          <span>{t('clock_study.common.interaction')}</span>
        </div>
        <div className={styles.sectionContent}>
          <div className={styles.text}>
            <Trans
              i18nKey="clock_study.duration_length_course.interaction_desc"
              components={{
                strong: <strong className={styles.strong} />,
                br: <br />,
                span: <span className={styles.highlight} />,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// 时长课程配置
export const DURATION_LENGTH_CONFIG: ClockLessonConfig = {
  id: 'duration-length',
  labelKey: 'clock_study.duration_length_label',
  titleKey: 'clock_study.duration_length_title',
  DescriptionContent: DurationLengthDescription,
};
