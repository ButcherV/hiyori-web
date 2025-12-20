import { useEffect } from 'react'; 
import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import type { PanInfo } from 'framer-motion';

import styles from './TinderCard.module.css'; 
import type { QuizOption } from '../types';

interface TinderCardProps {
  option: QuizOption;
  index: number;
  totalCards: number;
  isTop: boolean;
  // 🔥 新增：接受一个禁用状态
  disabled: boolean; 
  onSwipe: (option: QuizOption, direction: 'LIKE' | 'NOPE') => void;
}

export function TinderCard({ option, index, totalCards, isTop, disabled, onSwipe }: TinderCardProps) {
  const controls = useAnimation();
  const x = useMotionValue(0);
  
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const likeOpacity = useTransform(x, [10, 150], [0, 1]);
  const nopeOpacity = useTransform(x, [-10, -150], [0, 1]);

  useEffect(() => {
    controls.start({
      scale: 1 - index * 0.05,
      y: index * 15,
      opacity: 1,
      x: 0, 
      transition: { type: "spring", stiffness: 300, damping: 20 }
    });
  }, [index, controls]);

  const handleDragEnd = async (event: any, info: PanInfo) => {
    // 🔥 如果被禁用了，直接 return，不处理任何滑动逻辑
    if (!isTop || disabled) return;

    const threshold = 100;
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    const isSwipeRight = offset > threshold || velocity > 500;
    const isSwipeLeft = offset < -threshold || velocity < -500;

    if (isSwipeRight) {
      await controls.start({ x: 500, opacity: 0, transition: { duration: 0.2 } });
      onSwipe(option, 'LIKE');
    } else if (isSwipeLeft) {
      await controls.start({ x: -500, opacity: 0, transition: { duration: 0.2 } });
      onSwipe(option, 'NOPE');
    } else {
      controls.start({ x: 0, opacity: 1, transition: { type: "spring", stiffness: 500, damping: 30 } });
    }
  };

  const renderContent = () => {
    if (option.type === 'COLOR') {
      return <div className={styles.colorBlock} style={{ backgroundColor: option.content }} />;
    }
    return option.content;
  };

  // 计算交互状态：必须是 Top 且 没有被 Disabled
  const canInteract = isTop && !disabled;

  return (
    <motion.div
      className={styles.tinderCard}
      style={{
        zIndex: totalCards - index,
        x, 
        rotate: isTop ? rotate : 0,
        // 🔥 样式控制：如果被禁用了，鼠标不变成抓手，且完全忽略点击事件
        cursor: canInteract ? 'grab' : 'default',
        pointerEvents: canInteract ? 'auto' : 'none', 
      }}
      animate={controls}
      initial={{ scale: 0.9, y: 50, opacity: 0, x: 0 }}
      
      // 🔥 拖拽控制
      drag={canInteract ? "x" : false} 
      dragElastic={0.7} 
      onDragEnd={handleDragEnd}
    >
      {renderContent()}

      {isTop && (
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
}