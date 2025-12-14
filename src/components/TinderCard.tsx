// src/components/TinderCard.tsx
import { useEffect } from 'react'; // ✅ 引入 useEffect
import { 
  motion, 
  useMotionValue, 
  useTransform, 
  useAnimation 
} from 'framer-motion';
import type { PanInfo } from 'framer-motion';

import styles from './TinderCard.module.css'; 
import type { QuizOption } from '../types';

interface TinderCardProps {
  option: QuizOption;
  index: number;
  totalCards: number;
  isTop: boolean;
  onSwipe: (option: QuizOption, direction: 'LIKE' | 'NOPE') => void;
}

export function TinderCard({ option, index, totalCards, isTop, onSwipe }: TinderCardProps) {
  const controls = useAnimation();
  const x = useMotionValue(0);
  
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const likeOpacity = useTransform(x, [10, 150], [0, 1]);
  const nopeOpacity = useTransform(x, [-10, -150], [0, 1]);

  // ✅ 核心修复：监听 index 变化
  // 当前面的卡片飞走，这张卡片 index 减少 (例如 1 -> 0)
  // 我们必须显式告诉动画控制器：去新的位置！
  useEffect(() => {
    controls.start({
      scale: 1 - index * 0.05,
      y: index * 15,
      opacity: 1,
      x: 0, // 强制归位 X 轴 (防止继承了之前的偏移)
      transition: { type: "spring", stiffness: 300, damping: 20 }
    });
  }, [index, controls]);

  const handleDragEnd = async (event: any, info: PanInfo) => {
    if (!isTop) return;

    const threshold = 100;
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    const isSwipeRight = offset > threshold || velocity > 500;
    const isSwipeLeft = offset < -threshold || velocity < -500;

    if (isSwipeRight) {
      // 右滑飞走
      await controls.start({ x: 500, opacity: 0, transition: { duration: 0.2 } });
      onSwipe(option, 'LIKE');
    } else if (isSwipeLeft) {
      // 左滑飞走
      await controls.start({ x: -500, opacity: 0, transition: { duration: 0.2 } });
      onSwipe(option, 'NOPE');
    } else {
      // 没滑到位，回弹归位
      controls.start({ x: 0, opacity: 1, transition: { type: "spring", stiffness: 500, damping: 30 } });
    }
  };

  const renderContent = () => {
    if (option.type === 'COLOR') {
      return <div className={styles.colorBlock} style={{ backgroundColor: option.content }} />;
    }
    return option.content;
  };

  return (
    <motion.div
      className={styles.tinderCard}
      style={{
        zIndex: totalCards - index,
        x, 
        rotate: isTop ? rotate : 0,
        cursor: isTop ? 'grab' : 'default',
        // 只有 Top 卡片能交互，防止误触下面的
        pointerEvents: isTop ? 'auto' : 'none', 
      }}
      
      // ✅ 这里的 animate 完全交给 controls 控制
      animate={controls}
      
      // 初始状态
      initial={{ scale: 0.9, y: 50, opacity: 0, x: 0 }}

      // 开启拖拽
      drag={isTop ? "x" : false} 
      // 这里的 dragConstraints 不需要了，因为我们在 handleDragEnd 里手动处理回弹
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