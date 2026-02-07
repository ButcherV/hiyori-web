import { useState, useMemo } from 'react';
import {
  motion,
  AnimatePresence,
  type Variants,
  type Transition,
} from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NumberKeypad } from './NumberKeypad';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';
import { useTTS } from '../../../hooks/useTTS';
import styles from './SplitNumberLearn.module.css';

// --- 配置 (保留原样) ---
const DURATION_RESET = 0.5;
const DURATION_SCROLL = 0.4;
const DURATION_MUTATE = 0.6;
const DELAY_GAP = 0.05;
const DURATION_FADE = 0.3;
const DURATION_MOVE = 0.4;

const TRANSITION_ROMAJI = {
  enter: { type: 'spring', stiffness: 200, damping: 20, delay: 0.05 },
  exit: { duration: 0.15, ease: 'easeOut' },
};

// 左侧部件：淡出 + 塌陷
const LEFT_PART_VARIANTS: Variants = {
  visible: {
    opacity: 1,
    width: 'auto',
    marginRight: 12,
    transition: {
      duration: 0.3,
      width: { duration: 0.3 },
      opacity: { duration: 0.3, delay: 0.2 },
      marginRight: { duration: 0.3 },
    },
  },
  hidden: {
    opacity: 0,
    width: 0,
    marginRight: 0,
    transition: {
      opacity: { duration: DURATION_FADE, ease: 'easeOut' },
      width: {
        delay: DURATION_FADE,
        duration: DURATION_MOVE,
        ease: 'easeInOut',
      },
      marginRight: {
        delay: DURATION_FADE,
        duration: DURATION_MOVE,
        ease: 'easeInOut',
      },
    },
  },
};

const KANJI_LEFT_VARIANTS: Variants = {
  visible: {
    opacity: 1,
    width: 'auto',
    marginRight: 4,
    transition: {
      duration: 0.3,
      width: { duration: 0.3 },
      opacity: { duration: 0.3, delay: 0.2 },
      marginRight: { duration: 0.3 },
    },
  },
  hidden: {
    opacity: 0,
    width: 0,
    marginRight: 0,
    transition: {
      opacity: { duration: DURATION_FADE, ease: 'easeOut' },
      width: {
        delay: DURATION_FADE,
        duration: DURATION_MOVE,
        ease: 'easeInOut',
      },
      marginRight: {
        delay: DURATION_FADE,
        duration: DURATION_MOVE,
        ease: 'easeInOut',
      },
    },
  },
};

// 1-9 的假名序列 (L3/L4 通用)
const KANA_MULTIPLIERS = [
  '',
  'いち',
  'に',
  'さん',
  'よん',
  'ご',
  'ろく',
  'なな',
  'はち',
  'きゅう',
];
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
const KANA_HEIGHT = 64;

const wait = (s: number) => new Promise((r) => setTimeout(r, s * 1000));

// --- 子组件 (保留原逻辑) ---

const EvolutionHint = ({ from, to, visible }: any) => (
  <div className={styles.evolutionHint}>
    <AnimatePresence>
      {visible && to && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="jaFont"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <span>{from}</span>
          <span className={styles.evolutionArrow}>→</span>
          <span className={styles.evolutionHigh}>{to}</span>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const MutationFlipper = ({ oldText, newText, isLeft }: any) => (
  <div className={styles.flipperContainer}>
    <motion.div
      className={`${styles.flipFace} ${styles.flipFaceOld} ${isLeft ? styles.alignRight : styles.alignLeft} jaFont`}
      initial={{ rotateX: 0, opacity: 1, filter: 'brightness(1)' }}
      animate={{ rotateX: 90, opacity: 0, filter: 'brightness(0.5)' }}
      exit={{ rotateX: 0, opacity: 1, filter: 'brightness(1)' }}
      transition={{ duration: DURATION_MUTATE, ease: 'easeInOut' }}
      style={{ transformOrigin: 'center center' }}
    >
      {oldText}
    </motion.div>
    <motion.div
      className={`${styles.flipFace} ${styles.flipFaceNew} ${isLeft ? styles.alignRight : styles.alignLeft} jaFont`}
      initial={{ rotateX: -90, opacity: 0, filter: 'brightness(0.5)' }}
      animate={{ rotateX: 0, opacity: 1, filter: 'brightness(1)' }}
      exit={{ rotateX: -90, opacity: 0, filter: 'brightness(0.5)' }}
      transition={{ duration: DURATION_MUTATE, ease: 'easeInOut' }}
      style={{ transformOrigin: 'center center' }}
    >
      {newText}
    </motion.div>
  </div>
);

const KanaReel = ({
  targetIndex,
  regularText,
  mutationText,
  showMutation,
  isLeft,
}: any) => (
  <div className={styles.columnWrapper}>
    <div className={styles.scrollWindow}>
      <motion.div
        animate={{ y: -targetIndex * KANA_HEIGHT }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className={styles.kanjiReel}
      >
        {KANA_MULTIPLIERS.map((text, i) => (
          <div
            key={i}
            className={`${styles.cellReelItem} ${isLeft ? styles.alignRight : styles.alignLeft} jaFont`}
          >
            {i === 1 && text === '' ? '' : text}
          </div>
        ))}
      </motion.div>
      <AnimatePresence>
        {showMutation && mutationText && (
          <MutationFlipper
            oldText={regularText}
            newText={mutationText}
            isLeft={isLeft}
          />
        )}
      </AnimatePresence>
    </div>
    <EvolutionHint
      from={regularText}
      to={mutationText}
      visible={showMutation}
    />
  </div>
);

const KanjiReel = ({ targetIndex }: { targetIndex: number }) => (
  <div className={styles.kanjiWindow}>
    <motion.div
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

// 🟢 UnitCell: 严格保留原有的双层 Wrapper 结构和 props
const UnitCell = ({
  regularText,
  mutationText,
  showMutation,
  isLeft,
  isLeftVisible,
  layoutTransition,
}: any) => {
  return (
    <div className={styles.columnWrapper}>
      <div className={styles.scrollWindow}>
        <motion.div
          className={`${styles.cellAbsolute} jaFont`}
          layout
          style={{
            justifyContent: isLeftVisible ? 'flex-start' : 'center',
          }}
          transition={layoutTransition}
        >
          {/* Wrapper 解决文字抖动 */}
          <motion.div layout transition={layoutTransition}>
            {regularText}
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {showMutation && mutationText && (
            <MutationFlipper
              oldText={regularText}
              newText={mutationText}
              isLeft={isLeft}
            />
          )}
        </AnimatePresence>
      </div>
      <EvolutionHint
        from={regularText}
        to={mutationText}
        visible={showMutation}
      />
    </div>
  );
};

// ================== 通用组件入口 ==================

interface SplitNumberLearnProps {
  data: Record<number, any>; // 数据源
  baseUnit: number; // 基础单位 (100 或 1000)
  keypadNums: number[]; // 键盘显示的数字
  initialNum?: number; // 初始选中的数字
}

export const SplitNumberLearn = ({
  data: levelData,
  baseUnit,
  keypadNums,
  initialNum,
}: SplitNumberLearnProps) => {
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith('zh') ? 'zh' : 'en';
  const { speak } = useTTS();

  // 如果没有传 initialNum，默认选中第二个数字 (如 200 或 2000)
  const [currentNum, setCurrentNum] = useState(initialNum || baseUnit * 2);

  const [showMutation, setShowMutation] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showRomaji, setShowRomaji] = useState(true);
  const [isLeftVisible, setIsLeftVisible] = useState(true);
  // const [hasMounted, setHasMounted] = useState(false);

  const currentItem = levelData[currentNum];
  // 🟢 关键：根据 baseUnit 计算索引 (100 或 1000)
  const currentIndex = Math.floor(currentNum / baseUnit);
  const finalRomaji = currentItem.mutation?.romaji || currentItem.romaji;

  const playCurrentAudio = (item = currentItem) => {
    const leftPart = item.mutation?.multiplier || item.parts.kana[0];
    const rightPart = item.mutation?.unit || item.parts.kana[1];
    speak(leftPart + rightPart);
  };

  // useEffect(() => {
  //   if (showRomaji && hasMounted) {
  //     playCurrentAudio();
  //   }
  // }, [showRomaji, currentNum, hasMounted]);

  const handleKeyClick = async (val: string | number) => {
    const targetNum = Number(val);

    if (targetNum === currentNum || isAnimating) return;

    setIsAnimating(true);
    setShowRomaji(false);

    if (Capacitor.isNativePlatform())
      Haptics.impact({ style: ImpactStyle.Light });

    setIsLeftVisible(true);

    if (showMutation) {
      setShowMutation(false);
      await wait(DURATION_RESET + DELAY_GAP);
    }

    setCurrentNum(targetNum);
    await wait(DURATION_SCROLL + DELAY_GAP);

    // 🟢 关键：根据 baseUnit 判断单体模式
    if (targetNum === baseUnit) {
      setIsLeftVisible(false);
      await wait(DURATION_FADE + DURATION_MOVE);
    } else {
      // 检查变异
      if (levelData[targetNum].mutation) {
        if (Capacitor.isNativePlatform())
          Haptics.impact({ style: ImpactStyle.Heavy });
        setShowMutation(true);
        await wait(DURATION_MUTATE);
      }
    }

    setShowRomaji(true);
    setIsAnimating(false);
    // 只有点击键盘走完动画后，这里才会执行。加载时绝对不会执行。
    playCurrentAudio(levelData[targetNum]);
  };

  // 🟢 严格保留 useMemo 计算 Transition 逻辑
  const dynamicLayoutTransition: Transition = useMemo(
    () =>
      isLeftVisible
        ? {
            duration: DURATION_FADE,
            ease: 'easeInOut',
            delay: 0,
          }
        : {
            duration: DURATION_MOVE,
            ease: 'easeInOut',
            delay: DURATION_FADE,
          },
    [isLeftVisible]
  );

  return (
    <div className={styles.container}>
      <div className={styles.stage}>
        <motion.div
          key="split-multi"
          className={styles.splitModeContainer}
          layout
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          {/* 1. 汉字层 */}
          <div className={`${styles.kanjiRow} jaFont`}>
            <motion.div
              className={styles.kanjiLeft}
              variants={KANJI_LEFT_VARIANTS}
              initial="visible"
              animate={isLeftVisible ? 'visible' : 'hidden'}
            >
              <KanjiReel targetIndex={currentIndex} />
            </motion.div>

            {/* 右侧汉字：应用动态 Transition */}
            <motion.span
              className={styles.kanjiRight}
              layout
              style={{
                justifyContent: isLeftVisible ? 'flex-start' : 'center',
              }}
              transition={dynamicLayoutTransition}
            >
              {/* Wrapper */}
              <motion.span layout transition={dynamicLayoutTransition}>
                {currentItem.parts.kanji[1]}
              </motion.span>
            </motion.span>
          </div>

          {/* 2. 罗马音 + 喇叭 */}
          <div className={styles.romajiWrapper}>
            <AnimatePresence>
              {showRomaji && (
                <motion.div
                  key={`romaji-${currentNum}`}
                  className={styles.romajiMotionContainer}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={TRANSITION_ROMAJI}
                >
                  <span className={`${styles.romajiText}`}>{finalRomaji}</span>
                  <Volume2
                    size={20}
                    className={styles.speakerIcon}
                    onClick={() => playCurrentAudio()}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* <div className={styles.drumsWrapper}> */}
          {/* 3. 滚轮层 */}
          <div className={styles.drumsContainer}>
            <motion.div
              className={styles.drumsLeftWrapper}
              variants={LEFT_PART_VARIANTS}
              initial="visible"
              animate={isLeftVisible ? 'visible' : 'hidden'}
            >
              <KanaReel
                targetIndex={currentIndex}
                regularText={currentItem.parts.kana[0]}
                mutationText={currentItem.mutation?.multiplier}
                showMutation={showMutation}
                isLeft={true}
              />
            </motion.div>

            {/* 🟢 右侧假名 UnitCell：传入动态 Transition */}
            <motion.div layout>
              <UnitCell
                regularText={currentItem.parts.kana[1]}
                mutationText={currentItem.mutation?.unit}
                showMutation={showMutation}
                isLeft={false}
                isLeftVisible={isLeftVisible}
                layoutTransition={dynamicLayoutTransition}
              />
            </motion.div>
          </div>

          {/* 4. 底部 Note */}
          <div className={styles.noteContainer}>
            <AnimatePresence>
              {showRomaji && currentItem.note && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={styles.noteBadge}
                >
                  {/* {currentItem.note[lang]} */}
                  <span className="notePill">
                    {/* <Lightbulb size={14} className="noteIcon" /> */}
                    <span>{currentItem.note[lang]}</span>
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* </div> */}
        </motion.div>
      </div>

      <NumberKeypad
        onKeyClick={handleKeyClick}
        activeNum={currentNum}
        customNums={keypadNums}
        layout={{ splitIdx: 4, maxCols: 5 }}
      />
    </div>
  );
};
