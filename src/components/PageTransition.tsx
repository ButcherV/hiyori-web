import React from 'react';
import { motion } from 'framer-motion';

// 1. 滑动页面 (详情页)
const slideVariants = {
  initial: {
    x: '100%',
    opacity: 1,
    zIndex: 100, // 确保在上面
  },
  in: {
    x: '0%',
    opacity: 1,
    zIndex: 100,
    boxShadow: '-5px 0 25px rgba(0,0,0,0.1)',
  },
  out: {
    x: '100%',
    opacity: 1,
    zIndex: 100,
    boxShadow: '-5px 0 25px rgba(0,0,0,0.1)',
  },
};

// 2. 底座页面 (首页)
const staticVariants = {
  initial: { x: 0, opacity: 1, zIndex: 1 },
  in: { x: 0, opacity: 1, zIndex: 1 },
  // 🔥 关键：Home 退出时必须保持不动 (static)，绝不能滑走
  out: { x: 0, opacity: 0.999, zIndex: 1 },
};

const pageTransition = {
  type: 'tween',
  ease: [0.25, 0.1, 0.25, 1],
  duration: 0.32,
} as const;

// 🔥 修改接口，接收 isHome
export const PageTransition = ({
  children,
  isHome = false, // 默认为 false
}: {
  children: React.ReactNode;
  isHome?: boolean;
}) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      // 🔥 直接使用传入的参数，不再依赖 URL
      variants={isHome ? staticVariants : slideVariants}
      transition={pageTransition}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#f8f9fa',
        overflowX: 'hidden',
      }}
    >
      {children}
    </motion.div>
  );
};
