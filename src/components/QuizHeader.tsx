import { motion, AnimatePresence } from 'framer-motion';
import styles from './QuizHeader.module.css';
import type { QuizQuestion } from '../types';

interface QuizHeaderProps {
  question: QuizQuestion;
  isRevealed: boolean;
  correctAnswerContent?: string;
}

export function QuizHeader({
  question,
  isRevealed,
  correctAnswerContent,
}: QuizHeaderProps) {
  const { prompt } = question;
  const text = prompt.display;
  const highlightIndex = prompt.highlightIndex;

  if (highlightIndex === undefined || highlightIndex < 0) {
    return <div className={styles.headerContainer}>{text}</div>;
  }

  const chars = text.split('');

  return (
    <div className={styles.headerContainer}>
      <motion.div
        className={styles.headerTitle}
        // 阶段二：整体缩放庆祝
        animate={
          isRevealed
            ? { scale: 1.6, color: 'var(--color-success)' }
            : { scale: 1, color: 'var(--color-text-main)' }
        }
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 15,
          // 🔥 关键：延迟 0.3s。等下面的“文字上浮+横线消失”做完了，再整体放大
          delay: isRevealed ? 0.3 : 0,
        }}
      >
        <div className={styles.promptText}>
          {chars.map((char, index) => {
            const isTarget = index === highlightIndex;

            // 无论是不是目标，都使用 styles.charBase 保证对齐
            // 只有 target 才会由 framer-motion 控制 border-color
            return (
              <motion.span
                key={index}
                className={styles.charBase}
                // 阶段一 (同步A)：控制横线颜色
                // 平时是红色(primary)，揭示的一瞬间变成透明
                animate={{
                  borderBottomColor: isTarget
                    ? isRevealed
                      ? 'transparent'
                      : 'var(--color-primary)'
                    : 'transparent',
                }}
                // 横线消失不需要 delay，立即执行，和文字上浮同步
                transition={{ duration: 0.3 }}
              >
                {isTarget ? (
                  <AnimatePresence mode="popLayout">
                    {/* popLayout 让布局更紧凑，避免布局跳动 */}
                    {!isRevealed ? (
                      <motion.span
                        key="placeholder"
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                      >
                        &nbsp;
                      </motion.span>
                    ) : (
                      <motion.span
                        key="answer"
                        // 阶段一 (同步B)：文字上浮
                        initial={{ y: '100%' }}
                        animate={{ y: '0%' }}
                        transition={{
                          type: 'spring',
                          stiffness: 400,
                          damping: 25,
                        }}
                        style={{ display: 'inline-block' }}
                      >
                        {correctAnswerContent}
                      </motion.span>
                    )}
                  </AnimatePresence>
                ) : (
                  // 普通字符
                  char
                )}
              </motion.span>
            );
          })}
        </div>
      </motion.div>
      <div className={styles.headerSubtitle}>
        {question.mode.replace(/_/g, ' ')}
      </div>
    </div>
  );
}
