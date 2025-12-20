// src/components/TinderCard/TinderCard.tsx

import React, { forwardRef, useImperativeHandle, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useAnimation, type PanInfo } from 'framer-motion';
import styles from './TinderCard.module.css';

// 1. 导出 Ref 接口
export interface TinderCardRef {
  swipe: (dir: 'left' | 'right') => Promise<void>;
}

// 2. Props 定义：不再需要 option，改用 children
interface TinderCardProps {
  children: React.ReactNode;
  
  // 视觉参数
  index?: number;
  totalCards?: number; 
  
  // 逻辑控制
  touchEnabled?: boolean; 
  preventSwipe?: ('left' | 'right')[]; 
  
  onSwipe: (direction: 'left' | 'right') => void;
}

// 3. 组件实现
export const TinderCard = forwardRef<TinderCardRef, TinderCardProps>((
  { 
    children, 
    index = 0, 
    touchEnabled = true, 
    preventSwipe = [], 
    onSwipe 
  }, 
  ref
) => {
  const controls = useAnimation();
  const x = useMotionValue(0);
  
  // 动画插值
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const likeOpacity = useTransform(x, [10, 150], [0, 1]);
  const nopeOpacity = useTransform(x, [-10, -150], [0, 1]);

  // 入场动画
  useEffect(() => {
    controls.start({
      scale: 1 - index * 0.05,
      y: index * 15,
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    });
  }, [index, controls]);

  // 暴露给父组件的方法 (遥控器)
  useImperativeHandle(ref, () => ({
    swipe: async (dir) => {
      if (dir === 'right') {
        await controls.start({ x: 500, opacity: 0, transition: { duration: 0.2 } });
        onSwipe('right');
      } else {
        await controls.start({ x: -500, opacity: 0, transition: { duration: 0.2 } });
        onSwipe('left');
      }
    }
  }));

  // 处理拖拽结束
  const handleDragEnd = async (event: any, info: PanInfo) => {
    const threshold = 100;
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    const isSwipeRight = offset > threshold || velocity > 500;
    const isSwipeLeft = offset < -threshold || velocity < -500;

    if (isSwipeRight) {
      if (!preventSwipe.includes('right')) {
        await controls.start({ x: 500, opacity: 0, transition: { duration: 0.2 } });
        onSwipe('right');
      } else {
        controls.start({ x: 0, transition: { type: "spring", stiffness: 500, damping: 30 } });
      }
    } 
    else if (isSwipeLeft) {
      if (!preventSwipe.includes('left')) {
        await controls.start({ x: -500, opacity: 0, transition: { duration: 0.2 } });
        onSwipe('left');
      } else {
        controls.start({ x: 0, transition: { type: "spring", stiffness: 500, damping: 30 } });
      }
    } 
    else {
      controls.start({ x: 0, opacity: 1, transition: { type: "spring", stiffness: 500, damping: 30 } });
    }
  };

  const canDrag = index === 0 && touchEnabled;

  return (
    <motion.div
      className={styles.tinderCard}
      style={{
        zIndex: 100 - index,
        x,
        rotate: index === 0 ? rotate : 0,
        cursor: canDrag ? 'grab' : 'default',
      }}
      animate={controls}
      initial={{ scale: 0.9, y: 50, opacity: 0, x: 0 }}
      
      // 拖拽属性
      drag={canDrag ? "x" : false}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
    >
      {/* 🔥 关键点：直接渲染 children，不调用任何 renderContent 方法 */}
      {children}

      {index === 0 && (
        <>
          <motion.div 
            className={styles.overlay}
            style={{ backgroundColor: 'var(--color-success)', opacity: likeOpacity }}
          />
          <motion.div 
            className={styles.overlay}
            style={{ backgroundColor: 'var(--color-error)', opacity: nopeOpacity }}
          />
        </>
      )}
    </motion.div>
  );
});

TinderCard.displayName = 'TinderCard';