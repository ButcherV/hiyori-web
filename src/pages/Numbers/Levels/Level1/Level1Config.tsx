import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Target, Lightbulb } from 'lucide-react';
import styles from '../LevelDescription.module.css';

// 定义关卡配置的接口
export interface LevelConfig {
  id: string;
  labelKey: string;
  titleKey: string;
  DescriptionContent: React.FC;
}

// 提取为一个独立的组件，保持 Config 文件的整洁
const Level1Description: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      {/* 板块 1: 本课目标 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          {/* 使用红色/橙色图标表示目标 */}
          <Target size={18} color="var(--color-error)" />
          <span>{t('number_study.common.goal')}</span>
        </div>
        <div className={styles.sectionContent}>
          <p className={styles.text}>
            <Trans
              i18nKey="number_study.numbers.levels.lvl1.goal_desc"
              components={{
                highlight: <span className="highlight-text" />,
              }}
            />
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
            <Trans
              i18nKey="number_study.numbers.levels.lvl1.keypoint_desc"
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
    </div>
  );
};

// Level 1 的具体配置
export const LEVEL1_CONFIG: LevelConfig = {
  id: 'lvl1',
  labelKey: 'number_study.numbers.levels.lvl1.label',
  titleKey: 'number_study.numbers.levels.lvl1.title',
  DescriptionContent: Level1Description,
};
