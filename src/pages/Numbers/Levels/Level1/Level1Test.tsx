import React, { useState, useCallback } from 'react';
import { DiceRoller } from '../../../../components/Dice/DiceContainer';
import { NumberKeypad, type KeypadDisplayMode } from '../NumberKeypad';
import styles from './Level1Test.module.css';
import { ArrowUp } from 'lucide-react';
import { Haptics, NotificationType, ImpactStyle } from '@capacitor/haptics';
import { Capacitor } from '@capacitor/core';
import { useSound } from '../../../../hooks/useSound';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

interface Level1TestProps {
  onMistake: (targetNum: number) => void;
}

const ALLOWED_MODES: KeypadDisplayMode[] = ['kana', 'mixed'];

type GameStatus = 'idle' | 'answering' | 'success' | 'error';

export const Level1Test: React.FC<Level1TestProps> = ({ onMistake }) => {
  const { t } = useTranslation();
  const [problem, setProblem] = useState<{ a: number; b: number } | null>(null);

  const [status, setStatus] = useState<GameStatus>('idle');
  const [userAnswer, setUserAnswer] = useState<number | null>(null);
  const [keypadMode, setKeypadMode] = useState<KeypadDisplayMode>('mixed');
  const [roundId, setRoundId] = useState(0);

  const playSound = useSound();

  const triggerHaptic = async (type: 'success' | 'error') => {
    if (!Capacitor.isNativePlatform()) return;
    if (type === 'success') {
      await Haptics.impact({ style: ImpactStyle.Light });
    } else {
      await Haptics.notification({ type: NotificationType.Error });
    }
  };

  const handleRollComplete = useCallback((values: number[]) => {
    setProblem({ a: values[0], b: values[1] });

    setStatus('answering'); // 进入答题状态
    setUserAnswer(null); // 重置之前的答案
    const randomMode =
      ALLOWED_MODES[Math.floor(Math.random() * ALLOWED_MODES.length)];
    setKeypadMode(randomMode);
    setRoundId((prev) => prev + 1);
  }, []);

  const handleKeyClick = (inputNum: number) => {
    // 锁定逻辑：只有 answering 状态才允许点击
    if (status !== 'answering' || !problem) return;

    const correctAnswer = problem.a + problem.b;
    setUserAnswer(inputNum); // 记录用户点击的数字

    if (inputNum === correctAnswer) {
      handleSuccess();
    } else {
      handleFailure(inputNum, correctAnswer);
    }
  };

  const handleSuccess = () => {
    setStatus('success');
    playSound('score');
    triggerHaptic('success');

    // 800ms 欣赏期 (延迟重置)
    setTimeout(() => {
      setProblem(null);
      setStatus('idle');
      setUserAnswer(null);
    }, 800);
  };

  // 失败处理 (拒绝逻辑)
  const handleFailure = (wrongInput: number, correctVal: number) => {
    setStatus('error'); // 1. 状态变更为失败 (HUD变红, 颤动, 键盘锁死)
    playSound('failure'); // 2. 播放失败音效
    triggerHaptic('error'); // 3. 错误强震动

    console.log(`Wrong! User: ${wrongInput}, Correct: ${correctVal}`);

    // 通知父组件 (父组件会弹 Toast 并倒计时 2秒跳转)
    // 注意：此时 status 停留在 'error'，键盘保持不可点状态，直到父组件卸载此组件
    onMistake(correctVal);
  };

  return (
    <div className={styles.container}>
      <div className={styles.stageSection}>
        {/* Layer 1: 3D 骰子层 */}
        {/* 只要不是 idle (包括 answering/success/error)，骰子都保持模糊 */}
        <div
          className={`${styles.diceLayer} ${status !== 'idle' ? styles.blurMode : ''}`}
        >
          <DiceRoller
            onRoll={handleRollComplete}
            disabled={status !== 'idle'}
          />
        </div>

        {/* Layer 2: 答题 HUD */}
        {problem && (
          /* 错误时颤动整个 HUD */
          <div
            className={`
            ${styles.hudOverlay}
            ${status === 'error' ? styles.shakeAnim : ''} 
          `}
          >
            <React.Fragment key={roundId}>
              <div
                className={`${styles.numBlock} ${styles.animPop}`}
                style={{ animationDelay: '0s' }}
              >
                {problem.a}
              </div>
              <div
                className={`${styles.operator} ${styles.animPop}`}
                style={{ animationDelay: '0.1s' }}
              >
                +
              </div>
              <div
                className={`${styles.numBlock} ${styles.animPop}`}
                style={{ animationDelay: '0.2s' }}
              >
                {problem.b}
              </div>
              <div
                className={`${styles.operator} ${styles.animPop}`}
                style={{ animationDelay: '0.3s' }}
              >
                =
              </div>
              <div
                className={styles.animPop}
                style={{ animationDelay: '0.4s' }}
              >
                {/* 问号块-动态 */}
                <div
                  className={`
                    ${styles.numBlock} 
                    ${styles.targetBlock} 
                    ${status === 'answering' ? styles.animPulse : ''}
                    ${status === 'success' ? styles.successState : ''}
                    ${status === 'error' ? styles.errorState : ''}
                  `}
                  style={{
                    opacity: 1,
                    transform: 'none',
                    animationDelay: '0.9s',
                  }}
                >
                  {/* 答题中显示?，否则显示用户填的数字 */}
                  {status === 'answering' ? '?' : userAnswer}
                </div>
              </div>
            </React.Fragment>
          </div>
        )}
      </div>

      <div className={styles.keypadSection}>
        {/* 键盘锁定逻辑 - 只有 answering 时键盘才是亮的 */}
        <div className={status !== 'answering' ? styles.disabledKeypad : ''}>
          <NumberKeypad
            key={roundId}
            onKeyClick={handleKeyClick}
            shuffle={true}
            displayMode={keypadMode}
          />
        </div>

        {/* 2. 封印提示条 (只在 idle 时显示) */}
        {/* {status === 'idle' && (
          <div className={styles.idleHintOverlay}>
            <span className={styles.hintText}>
              <ArrowUp size={16} strokeWidth={3} />
              {t('number_study.numbers.interaction.roll_hint')}
            </span>
          </div>
        )} */}
        <AnimatePresence>
          {status === 'idle' && (
            <motion.div
              className={styles.idleHintOverlay}
              // 定义进场初始状态
              initial={{ opacity: 0, y: 10 }}
              // 定义显示状态
              animate={{ opacity: 1, y: 0 }}
              // 定义离场状态 (这是 React 原生做不到的！)
              exit={{ opacity: 0, y: -10 }}
              // 定义动画参数
              transition={{ duration: 0.3 }}
            >
              {/* 这里的箭头动画可以保留 CSS 里的，也可以用 motion 进一步重写，
                  但为了省事，保留内部 CSS 动画即可 */}
              <span className={styles.hintText}>
                <ArrowUp size={16} strokeWidth={3} />
                {t('number_study.numbers.interaction.roll_hint')}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
