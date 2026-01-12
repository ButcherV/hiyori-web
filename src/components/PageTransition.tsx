import React from 'react';
import { motion, type Variants } from 'framer-motion';

// ==========================================
// 1. 类型定义
// ==========================================

type TransitionPreset = 'home' | 'slide' | 'scale';

interface Props {
  children: React.ReactNode;
  preset?: TransitionPreset;
  depth: number; // 用于计算层级 (Z-Index)
  direction: number;
}

// 基础层级步进值
const Z_STEP = 100;

// ==========================================
// 2. Variants 定义
// ==========================================

const slideVariants: Variants = {
  // 进场：依赖 direction 判断是从右边进来(1) 还是原地出现(-1)
  initial: (direction: number) => ({
    x: direction > 0 ? '100%' : '0%',
    opacity: 1,
  }),
  in: {
    x: '0%',
    opacity: 1,
    boxShadow: '-5px 0 25px rgba(0,0,0,0.1)',
  },
  // 离场：依赖 AnimatePresence 传入的 direction
  out: (direction: number) => ({
    x: direction > 0 ? '0%' : '100%',
    opacity: direction > 0 ? 0.99 : 1,
    boxShadow: direction > 0 ? 'none' : '-5px 0 25px rgba(0,0,0,0.1)',
  }),
};

const scaleVariants: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  in: { opacity: 1, scale: 1, y: 0 },
  out: { opacity: 0, scale: 0.95, y: 20 },
};

const homeVariants: Variants = {
  initial: { x: 0, opacity: 1 },
  in: { x: 0, opacity: 1 },
  out: { x: 0, opacity: 0.999 },
};

// ==========================================
// 3. 动画配置
// ==========================================
const transitionConfig = {
  type: 'tween',
  ease: [0.25, 0.1, 0.25, 1],
  duration: 0.35,
} as const;

export const PageTransition = ({
  children,
  preset = 'slide',
  depth,
  direction, // 接收方向
}: Props) => {
  const getVariants = () => {
    switch (preset) {
      case 'home':
        return homeVariants;
      case 'scale':
        return scaleVariants;
      case 'slide':
        return slideVariants;
      default:
        return slideVariants;
    }
  };

  // 保持之前的 Z-Index 修复逻辑
  const staticZIndex = depth * Z_STEP;

  return (
    <motion.div
      // 🔥这里必须传 direction，否则 initial 动画拿不到方向，默认为 0 就不动了
      custom={direction}
      initial="initial"
      animate="in"
      exit="out"
      variants={getVariants()}
      transition={transitionConfig}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#f8f9fa',
        overflowY: 'auto',
        overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
        // 锁死层级
        zIndex: staticZIndex,
      }}
    >
      {children}
    </motion.div>
  );
};
