import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Target, Lightbulb } from 'lucide-react';
import styles from '../LevelDescription.module.css';

export interface LevelConfig {
  id: string;
  labelKey: string;
  titleKey: string;
  DescriptionContent: React.FC;
}

const Level4Description: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      {/* 板块 1: 本课目标 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <Target size={18} color="var(--color-error)" />
          <span>{t('number_study.common.goal')}</span>
        </div>
        <div className={styles.sectionContent}>
          <p className={styles.text}>
            {t('number_study.numbers.levels.lvl4.goal_desc')}
          </p>
        </div>
      </div>

      {/* 板块 2: 学习指南 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <Lightbulb
            size={18}
            color="var(--color-study-number)"
            fill="var(--color-study-number)"
            fillOpacity={0.2}
          />
          <span>{t('number_study.common.keypoint')}</span>
        </div>
        <div className={styles.sectionContent}>
          <div className={styles.text}>
            {/* 使用 Trans 组件解析带有 html 标签的文案 */}
            <Trans
              i18nKey="number_study.numbers.levels.lvl4.keypoint_desc"
              components={{
                strong: <strong className={styles.strong} />,
                br: <br />,
                // 高亮样式，用于强调音便部分 (zen, hassen)
                span: <span className={styles.highlight} />,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Level 4 的具体配置
export const LEVEL4_CONFIG: LevelConfig = {
  id: 'lvl4',
  labelKey: 'number_study.numbers.levels.lvl4.label',
  titleKey: 'number_study.numbers.levels.lvl4.title',
  DescriptionContent: Level4Description,
};
