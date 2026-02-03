import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Target, Lightbulb } from 'lucide-react';
import styles from '../LevelDescription.module.css';

// 如果 LevelConfig 接口在公共文件中定义了，请改为 import；
// 这里为了保持文件独立性，参照 Level1Config 暂时保留定义
export interface LevelConfig {
  id: string;
  labelKey: string;
  titleKey: string;
  DescriptionContent: React.FC;
}

const Level3Description: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      {/* 板块 1: 本课目标 */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>
          <Target size={18} color="#ef4444" />
          <span>{t('number_study.common.goal')}</span>
        </div>
        <div className={styles.sectionContent}>
          <p className={styles.text}>
            {t('number_study.numbers.levels.lvl3.goal_desc')}
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
              i18nKey="number_study.numbers.levels.lvl3.keypoint_desc"
              components={{
                strong: <strong className={styles.strong} />,
                br: <br />,
                // 高亮样式，用于强调音便部分 (byaku, ppyaku)
                span: <span className={styles.highlight} />,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Level 3 的具体配置
export const LEVEL3_CONFIG: LevelConfig = {
  id: 'lvl3',
  labelKey: 'number_study.numbers.levels.lvl3.label',
  titleKey: 'number_study.numbers.levels.lvl3.title',
  DescriptionContent: Level3Description,
};
