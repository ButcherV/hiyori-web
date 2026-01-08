import { motion, AnimatePresence, type Variants } from 'framer-motion';

interface FlipTextProps {
  text: string;
  className?: string;
}

const containerVariants: Variants = {
  visible: {
    transition: { staggerChildren: 0.05 },
  },
  exit: {
    transition: { staggerChildren: 0.03, staggerDirection: -1 },
  },
};

const charVariants: Variants = {
  hidden: { opacity: 0, rotateX: 90, y: 10 },
  visible: { opacity: 1, rotateX: 0, y: 0 },
  exit: { opacity: 0, rotateX: -90, y: -10 },
};

export function FlipText({ text, className = '' }: FlipTextProps) {
  const characters = text.split('');

  return (
    // 1. 删掉了最外层的 div，它会干扰布局
    // 2. 删掉了 mode="wait"，让动画无缝重叠
    <AnimatePresence>
      <motion.div
        key={text}
        className={className}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        style={{
          // --- 核心修复区域 ---

          // 1. 透视移到这里，效果一样，少一层标签
          perspective: '600px',

          // 2. 绝对定位，确保新旧文字重叠
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',

          // 3. 【关键修复】：撑满高度并垂直居中
          // 之前就是少了这俩，导致文字贴着顶部，看起来像下降了
          height: '100%',
          display: 'flex',
          alignItems: 'center',

          // -----------------

          transformStyle: 'preserve-3d',
        }}
      >
        {characters.map((char, i) => (
          <motion.span
            key={`${char}-${i}`}
            variants={charVariants}
            // transition={{ type: 'spring', damping: 12, stiffness: 200 }}
            transition={{ type: 'spring', damping: 8, stiffness: 40 }}
            style={{
              display: 'inline-block',
              backfaceVisibility: 'hidden',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
