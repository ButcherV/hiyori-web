import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  // initial: { opacity: 0, y: 20, scale: 0.92 },
  // in: { opacity: 1, y: 0, scale: 1 },
  // out: { opacity: 0, y: -20, scale: 0.92 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.25,
} as const; // 加上 as const，锁定类型

export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </motion.div>
  );
};
