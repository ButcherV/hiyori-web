import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LEVEL_3_DATA, KANA_MULTIPLIERS } from './Level3Data';
import { NumberKeypad } from '../NumberKeypad';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';
import styles from './Level3Learn.module.css';

// 滚动动画时长
const SCROLL_DURATION = 0.3;

const KANJI_MULTIPLIERS = [
  '',
  '一',
  '二',
  '三',
  '四',
  '五',
  '六',
  '七',
  '八',
  '九',
];
const KANJI_HEIGHT = 88;
// 假名的高度通常较小，这里对应 CSS 中的 scrollWindow 高度 (64px)
const KANA_HEIGHT = 64;

// --- 组件：左侧汉字大滚轮 (Reel) ---
const KanjiReel = ({ targetIndex }: { targetIndex: number }) => {
  return (
    <div className={styles.kanjiWindow}>
      <motion.div
        // 根据索引计算 Y 轴偏移量，实现物理滚动
        animate={{ y: -targetIndex * KANJI_HEIGHT }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className={styles.kanjiReel}
      >
        {KANJI_MULTIPLIERS.map((char, i) => (
          <div key={i} className={`${styles.kanjiCell} jaFont`}>
            {char === '' ? <span className={styles.ghostText}>一</span> : char}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// --- 🔴 新组件：假名滚轮 (Reel) ---
// 逻辑与 KanjiReel 一致，确保经过中间态
const KanaReel = ({
  targetIndex,
  isLeft,
}: {
  targetIndex: number;
  isLeft: boolean;
}) => {
  return (
    <div className={styles.scrollWindow}>
      <motion.div
        // 假名也根据索引滚动：Index * 64px
        animate={{ y: -targetIndex * KANA_HEIGHT }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className={styles.kanjiReel} // 复用列布局样式
      >
        {/* 这里渲染所有的假名乘数 (1-9) */}
        {KANA_MULTIPLIERS.map((text, i) => (
          <div
            key={i}
            className={`${styles.cellReelItem} ${isLeft ? styles.alignRight : styles.alignLeft} jaFont`}
          >
            {/* 100 (Index 1) 没有假名，显示空占位或者短横线 */}
            {i === 1 && text === '' ? '' : text}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

// --- 组件：右侧单位滚轮 (静态/单独处理) ---
// 因为单位全是 "hyaku" (在我们目前的理想模型里)，所以它其实不需要长滚轮
// 如果以后有单位变化 (如 sen -> man)，也可以改成 Reel 模式
const UnitCell = ({ text, isLeft }: { text: string; isLeft: boolean }) => {
  return (
    <div className={styles.scrollWindow}>
      <div
        className={`${styles.cellAbsolute} ${isLeft ? styles.alignRight : styles.alignLeft} jaFont`}
      >
        {text}
      </div>
    </div>
  );
};

export const Level3Learn = () => {
  const [currentNum, setCurrentNum] = useState(200);
  const prevNumRef = useRef(200);

  const data = LEVEL_3_DATA[currentNum];
  const isHundred = currentNum === 100;

  // 计算当前数字的索引 (例如 200 -> 2, 900 -> 9)
  const currentIndex = Math.floor(currentNum / 100);

  const handleKeyClick = (num: number) => {
    if (num === currentNum) return;

    if (Capacitor.isNativePlatform()) {
      Haptics.impact({ style: ImpactStyle.Light });
    }

    prevNumRef.current = currentNum;
    setCurrentNum(num);
  };

  return (
    <div className={styles.container}>
      <div className={styles.stage}>
        <AnimatePresence mode="wait">
          {/* === 100: 单体静止布局 === */}
          {isHundred ? (
            <motion.div
              key="single-100"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.1 } }}
              className={styles.singleModeContainer}
            >
              <div className={`${styles.singleKanji} jaFont`}>
                {data.parts.kanji[1]}
              </div>
              <div className={`${styles.romaji} jaFont`}>{data.romaji}</div>
              <div className={styles.singleDrumWindow}>
                <div className={`${styles.staticCell} jaFont`}>
                  {data.parts.kana[1]}
                </div>
              </div>
            </motion.div>
          ) : (
            /* === 200-900: 双体统一滚动布局 === */
            <motion.div
              key="split-multi"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.1 } }}
              className={styles.splitModeContainer}
            >
              {/* 1. 汉字层 (物理滚轮) */}
              <div className={`${styles.kanjiRow} jaFont`}>
                <div className={styles.kanjiLeft}>
                  <KanjiReel targetIndex={currentIndex} />
                </div>
                <span className={styles.kanjiRight}>{data.parts.kanji[1]}</span>
              </div>

              {/* 2. 罗马音 (带延迟动效) */}
              <div className={styles.romajiWrapper}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={data.romaji}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5, transition: { duration: 0.1 } }}
                    transition={{
                      delay: SCROLL_DURATION + 0.05,
                      type: 'spring',
                      stiffness: 100,
                      damping: 15,
                    }}
                    className={`${styles.romaji} jaFont`}
                  >
                    {data.romaji}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* 3. 假名滚轮层 (完全物理同步) */}
              <div className={styles.drumsContainer}>
                {/* 左侧：乘数 (使用 KanaReel 实现长列表滚动) */}
                <KanaReel targetIndex={currentIndex} isLeft={true} />

                {/* 右侧：单位 (Hyaku 保持不动) */}
                <UnitCell text={data.parts.kana[1]} isLeft={false} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <NumberKeypad
        onKeyClick={handleKeyClick}
        activeNum={currentNum}
        customNums={[100, 200, 300, 400, 500, 600, 700, 800, 900]}
        layout={{ splitIdx: 4, maxCols: 5 }}
      />
    </div>
  );
};
