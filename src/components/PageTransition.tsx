import React from 'react';
import { motion } from 'framer-motion';

// ==========================================
// 1. 预设定义 (Presets)
// ==========================================

// A. 滑动模式 (Slide) - 适合列表去详情
const slideVariants = {
  initial: {
    x: '100%',
    opacity: 1,
    zIndex: 100, // 保证在最上层
  },
  in: {
    x: '0%',
    opacity: 1,
    zIndex: 100,
    boxShadow: '-5px 0 25px rgba(0,0,0,0.1)', // 阴影增加层次感
  },
  out: {
    x: '100%',
    opacity: 1,
    zIndex: 100,
    boxShadow: '-5px 0 25px rgba(0,0,0,0.1)',
  },
};

// B. 缩放模式 (Scale) - 适合工具页/独立页
const scaleVariants = {
  initial: {
    opacity: 0,
    scale: 0.95, // 稍微缩小一点，不要缩太小
    y: 20, // 稍微向下偏移一点
    zIndex: 100,
  },
  in: {
    opacity: 1,
    scale: 1,
    y: 0,
    zIndex: 100,
  },
  out: {
    opacity: 0,
    scale: 0.95, // 退出时缩小并淡出
    y: 20,
    zIndex: 100,
  },
};

// C. 底座模式 (Home) - 永远静止
const homeVariants = {
  initial: { x: 0, opacity: 1, zIndex: 1 },
  in: { x: 0, opacity: 1, zIndex: 1 },
  // 🔥 关键：Home 退出时必须保留 DOM (0.999)，否则会被瞬间卸载导致白屏
  out: { x: 0, opacity: 0.999, zIndex: 1 },
};

// ==========================================
// 2. 动画曲线配置
// ==========================================
const pageTransition = {
  type: 'tween',
  ease: [0.25, 0.1, 0.25, 1], // iOS 风格舒缓曲线
  duration: 0.35,
} as const;

// ==========================================
// 3. 组件实现
// ==========================================

// 定义支持的模式类型
type TransitionPreset = 'home' | 'slide' | 'scale';

interface Props {
  children: React.ReactNode;
  preset?: TransitionPreset; // 默认 'slide'
}

export const PageTransition = ({ children, preset = 'slide' }: Props) => {
  // 根据传入的 preset 选择对应的 variants
  const getVariants = () => {
    switch (preset) {
      case 'home':
        return homeVariants;
      case 'scale':
        return scaleVariants;
      case 'slide':
      default:
        return slideVariants;
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={getVariants()}
      transition={pageTransition}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#f8f9fa',
        // 保持滚动条修复
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {children}
    </motion.div>
  );
};
