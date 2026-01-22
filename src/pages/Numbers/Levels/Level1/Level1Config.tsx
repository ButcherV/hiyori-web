import React from 'react';
import { useTranslation } from 'react-i18next';

// 定义关卡配置的接口
export interface LevelConfig {
  id: string;
  labelKey: string;
  titleKey: string;
  // 说明书组件：让它是一个 React 组件或函数，这样可以使用 Hooks (如 t函数)
  DescriptionContent: React.FC;
}

// Level 1 的具体配置
export const LEVEL1_CONFIG: LevelConfig = {
  id: 'lvl1',
  labelKey: 'number_study.numbers.levels.lvl1.label',
  titleKey: 'number_study.numbers.levels.lvl1.title',
  DescriptionContent: () => {
    const { t } = useTranslation();
    return (
      <>
        <h3>🎯 {t('number_study.common.goal')}</h3>
        <p>{t('number_study.numbers.levels.lvl1.goal_desc')}</p>
        <h3>⚠️ {t('number_study.common.keypoint')}</h3>
        <p
          dangerouslySetInnerHTML={{
            __html: t('number_study.numbers.levels.lvl1.keypoint_desc'),
          }}
        />
      </>
    );
  },
};
