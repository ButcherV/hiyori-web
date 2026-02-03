import { useState, useEffect } from 'react';
import {
  motion,
  AnimatePresence,
  type Variants,
  type Transition,
} from 'framer-motion'; // 🟢 1. 引入 Transition 类型
import { Volume2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LEVEL_3_DATA, KANA_MULTIPLIERS } from './Level3Data';
import { NumberKeypad } from '../NumberKeypad';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';
import { useTTS } from '../../../../hooks/useTTS';
import styles from './Level3Learn.module.css';

// --- 配置 ---
const DURATION_RESET = 0.5;
const DURATION_SCROLL = 0.4;
const DURATION_MUTATE = 0.6;
const DELAY_GAP = 0.05;

// 🟢 关键时间点定义
const DURATION_FADE = 0.3; // 第一阶段：左侧淡出
const DURATION_MOVE = 0.4; // 第二阶段：位移

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
      opacity: { duration: DURATION_FADE, ease: 'easeOut' }, // 0-0.3s
      width: {
        delay: DURATION_FADE,
        duration: DURATION_MOVE,
        ease: 'easeInOut',
      }, // 0.3-0.7s
      marginRight: {
        delay: DURATION_FADE,
        duration: DURATION_MOVE,
        ease: 'easeInOut',
      }, // 0.3-0.7s
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

// ... EvolutionHint ...
const EvolutionHint = ({
  from,
  to,
  visible,
}: {
  from: string;
  to?: string;
  visible: boolean;
}) => (
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

// ... MutationFlipper ...
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

// ... KanaReel ...
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

// ... KanjiReel ...
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

// 🟢 UnitCell 更新：接收外部传入的 layoutTransition
const UnitCell = ({
  regularText,
  mutationText,
  showMutation,
  isLeft,
  isLeftVisible,
  layoutTransition, // <--- 必须接收这个 prop
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
          transition={layoutTransition} // <--- 使用动态参数
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

export const Level3Learn = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith('zh') ? 'zh' : 'en';
  const { speak } = useTTS();

  const [currentNum, setCurrentNum] = useState(200);
  const [showMutation, setShowMutation] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showRomaji, setShowRomaji] = useState(true);
  const [isLeftVisible, setIsLeftVisible] = useState(true);

  const data = LEVEL_3_DATA[currentNum];
  const currentIndex = Math.floor(currentNum / 100);
  const finalRomaji = data.mutation?.romaji || data.romaji;

  const playCurrentAudio = () => {
    const leftPart = data.mutation?.multiplier || data.parts.kana[0];
    const rightPart = data.mutation?.unit || data.parts.kana[1];
    speak(leftPart + rightPart);
  };

  useEffect(() => {
    if (showRomaji) {
      playCurrentAudio();
    }
  }, [showRomaji, currentNum]);

  const handleKeyClick = async (targetNum: number) => {
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

    if (targetNum === 100) {
      setIsLeftVisible(false); // 触发变身
      await wait(DURATION_FADE + DURATION_MOVE); // 等待完整的 0.7s
    } else {
      const targetData = LEVEL_3_DATA[targetNum];
      if (targetData.mutation) {
        if (Capacitor.isNativePlatform())
          Haptics.impact({ style: ImpactStyle.Heavy });
        setShowMutation(true);
        await wait(DURATION_MUTATE);
      }
    }

    setShowRomaji(true);
    setIsAnimating(false);
  };

  // 🟢 核心修正：动态计算 Transition
  // 加上 : Transition 类型注解，解决 ease 属性类型推断错误
  const dynamicLayoutTransition: Transition = isLeftVisible
    ? {
        duration: DURATION_FADE,
        ease: 'easeInOut',
        delay: 0,
      }
    : {
        duration: DURATION_MOVE,
        ease: 'easeInOut',
        delay: DURATION_FADE,
      };

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

            {/* 🟢 右侧汉字：应用动态 Transition */}
            <motion.span
              className={styles.kanjiRight}
              layout
              style={{
                justifyContent: isLeftVisible ? 'flex-start' : 'center',
              }}
              transition={dynamicLayoutTransition} // <--- 使用动态参数
            >
              {/* Wrapper */}
              <motion.span layout transition={dynamicLayoutTransition}>
                {data.parts.kanji[1]}
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
                    onClick={playCurrentAudio}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
                regularText={data.parts.kana[0]}
                mutationText={data.mutation?.multiplier}
                showMutation={showMutation}
                isLeft={true}
              />
            </motion.div>

            {/* 🟢 右侧假名 UnitCell：传入动态 Transition */}
            <motion.div layout>
              <UnitCell
                regularText={data.parts.kana[1]}
                mutationText={data.mutation?.unit}
                showMutation={showMutation}
                isLeft={false}
                isLeftVisible={isLeftVisible}
                layoutTransition={dynamicLayoutTransition} // <--- 传入
              />
            </motion.div>
          </div>

          {/* 4. 底部 Note */}
          <div className={styles.noteContainer}>
            <AnimatePresence>
              {showRomaji && data.note && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={styles.noteBadge}
                >
                  {data.note[lang]}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
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
