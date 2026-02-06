import React from 'react';

// 定义每个关卡的配置结构
export interface DateLevelConfig {
  id: string; // 唯一ID，例如 'lvl1_days'
  labelKey: string; // 导航条显示的文字 key
  titleKey: string; // 顶部标题 key
  DescriptionContent: React.FC; // BottomSheet 里的说明组件
}
