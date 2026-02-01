import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LEVEL_3_DATA, KANA_MULTIPLIERS } from './Level3Data';
import { NumberKeypad } from '../NumberKeypad';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';
import { useTTS } from '../../../../hooks/useTTS'; // 确保路径正确
import styles from './Level3Learn.module.css';

// --- 配置 ---
const DURATION_RESET = 0.5;
const DURATION_SCROLL = 0.4;
const DURATION_MUTATE = 0.6;
const DELAY_GAP = 0.05;

// 罗马音动画
const TRANSITION_ROMAJI = {
  enter: { type: 'spring', stiffness: 200, damping: 20, delay: 0.05 },
  exit: { duration: 0.15, ease: 'easeOut' }, // 快速离场
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

// --- 组件：演化提示词 (放在 ScrollWindow 下面) ---
const EvolutionHint = ({
  from,
  to,
  visible,
}: {
  from: string;
  to?: string;
  visible: boolean;
}) => {
  return (
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
};

// --- 组件：翻转器 ---
const MutationFlipper = ({
  oldText,
  newText,
  isLeft,
}: {
  oldText: string;
  newText: string;
  isLeft: boolean;
}) => (
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

// --- 组件：假名滚轮 (包含下方提示) ---
const KanaReel = ({
  targetIndex,
  regularText,
  mutationText,
  showMutation,
  isLeft,
}: {
  targetIndex: number;
  regularText: string;
  mutationText?: string;
  showMutation: boolean;
  isLeft: boolean;
}) => {
  return (
    <div className={styles.columnWrapper}>
      {/* 3D 视窗 */}
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

      {/* 🔴 下方演化提示 (scrollWindow 的外部) */}
      <EvolutionHint
        from={regularText}
        to={mutationText}
        visible={showMutation}
      />
    </div>
  );
};

// --- 组件：静态单元格 (包含下方提示) ---
const UnitCell = ({
  regularText,
  mutationText,
  showMutation,
  isLeft,
}: {
  regularText: string;
  mutationText?: string;
  showMutation: boolean;
  isLeft: boolean;
}) => {
  return (
    <div className={styles.columnWrapper}>
      <div className={styles.scrollWindow}>
        <div
          className={`${styles.cellAbsolute} ${isLeft ? styles.alignRight : styles.alignLeft} jaFont`}
        >
          {regularText}
        </div>
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

      {/* 🔴 下方演化提示 */}
      <EvolutionHint
        from={regularText}
        to={mutationText}
        visible={showMutation}
      />
    </div>
  );
};

// --- 组件：汉字滚轮 (不变) ---
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

export const Level3Learn = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language.startsWith('zh') ? 'zh' : 'en';
  const { speak } = useTTS(); // 🔴 使用 useTTS

  const [currentNum, setCurrentNum] = useState(200);
  const [showMutation, setShowMutation] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showRomaji, setShowRomaji] = useState(true);

  const data = LEVEL_3_DATA[currentNum];
  const isHundred = currentNum === 100;
  const currentIndex = Math.floor(currentNum / 100);
  const finalRomaji = data.mutation?.romaji || data.romaji;

  // 🔴 构造完整读音并播放
  const playCurrentAudio = () => {
    // 如果有变异，用变异后的组合；否则用规律组合
    const leftPart = data.mutation?.multiplier || data.parts.kana[0];
    const rightPart = data.mutation?.unit || data.parts.kana[1];
    const fullText = leftPart + rightPart;
    speak(fullText);
  };

  // 🔴 监听 showRomaji 变为 true 时 (即动画结束时)，自动播放
  useEffect(() => {
    if (showRomaji) {
      playCurrentAudio();
    }
  }, [showRomaji, currentNum]); // 依赖 currentNum 确保切数字后能触发

  const handleKeyClick = async (targetNum: number) => {
    if (targetNum === currentNum || isAnimating) return;

    if (targetNum === 100) {
      setCurrentNum(targetNum);
      setShowMutation(false);
      setShowRomaji(true);
      return;
    }

    setIsAnimating(true);
    setShowRomaji(false);

    if (Capacitor.isNativePlatform())
      Haptics.impact({ style: ImpactStyle.Light });

    if (showMutation) {
      setShowMutation(false);
      await wait(DURATION_RESET + DELAY_GAP);
    }

    setCurrentNum(targetNum);
    await wait(DURATION_SCROLL + DELAY_GAP);

    const targetData = LEVEL_3_DATA[targetNum];
    if (targetData.mutation) {
      if (Capacitor.isNativePlatform())
        Haptics.impact({ style: ImpactStyle.Heavy });
      setShowMutation(true);
      await wait(DURATION_MUTATE);
    }

    setShowRomaji(true);
    setIsAnimating(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.stage}>
        <AnimatePresence mode="wait">
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

              {/* 100 的罗马音 + 喇叭 */}
              <div className={styles.romajiWrapper}>
                {/* 复用 romajiMotionContainer 的 Flex 样式，但不加 absolute，因为 100 不需要重叠动画 */}
                <div
                  className={styles.romajiMotionContainer}
                  style={{ position: 'relative' }}
                >
                  <span className={`${styles.romajiText}`}>{finalRomaji}</span>
                  <Volume2
                    size={20}
                    className={styles.speakerIcon}
                    onClick={playCurrentAudio}
                  />
                </div>
              </div>

              <div className={styles.singleDrumWindow}>
                <div className={`${styles.staticCell} jaFont`}>
                  {data.parts.kana[1]}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="split-multi"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.1 } }}
              className={styles.splitModeContainer}
            >
              <div className={`${styles.kanjiRow} jaFont`}>
                <div className={styles.kanjiLeft}>
                  <KanjiReel targetIndex={currentIndex} />
                </div>
                <span className={styles.kanjiRight}>{data.parts.kanji[1]}</span>
              </div>

              {/* 🔴 罗马音 + 喇叭区域 */}
              <div className={styles.romajiWrapper}>
                <AnimatePresence>
                  {showRomaji && (
                    <motion.div
                      key={`romaji-${currentNum}`}
                      // 这里的 className 包含了 absolute + flex center
                      className={styles.romajiMotionContainer}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={TRANSITION_ROMAJI}
                    >
                      {/* 文字：标准流 */}
                      <span className={`${styles.romajiText}`}>
                        {finalRomaji}
                      </span>

                      {/* 喇叭：标准流，自然跟在文字后面 */}
                      <Volume2
                        size={20}
                        className={styles.speakerIcon}
                        onClick={playCurrentAudio}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className={styles.drumsContainer}>
                <KanaReel
                  targetIndex={currentIndex}
                  regularText={data.parts.kana[0]}
                  mutationText={data.mutation?.multiplier}
                  showMutation={showMutation}
                  isLeft={true}
                />

                <UnitCell
                  regularText={data.parts.kana[1]}
                  mutationText={data.mutation?.unit}
                  showMutation={showMutation}
                  isLeft={false}
                />
              </div>

              {/* 🔴 底部 Note (放在 splitModeContainer 内部最下方) */}
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
          )}
        </AnimatePresence>

        {/* 100 的 Note 放在这里 (因为 100 结构比较特殊，可以直接放在 stage 底部) */}
        {isHundred && (
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
        )}
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
