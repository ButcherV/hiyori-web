import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import styles from './TestPrompt.module.css';
import { type QuizType } from '../types';

interface TestPromptProps {
  quiz: {
    prompt: string;
    type: QuizType;
    correctAnswer: string;
  } | null;
  roundId: number; // 用于触发切换动画
  onPlayAudio: () => void;
}

export const TestPrompt: React.FC<TestPromptProps> = ({
  quiz,
  roundId,
  onPlayAudio,
}) => {
  if (!quiz) return null;

  // 🟢 智能语义分词函数
  // 将长日语字符串切分成 [三千] [六百] 这样的不换行积木块，防止阅读时产生歧义换行
  const renderSemanticPrompt = (text: string) => {
    // 1. 如果是纯数字或算式，直接返回
    if (/^[\d\s\+\-\.]+$/.test(text)) return text;

    // 2. 定义分隔符
    const delimiters = /([千百十万]|せん|ぜん|ひゃく|びゃく|ぴゃく|じゅう)/;
    const parts = text.split(delimiters);
    const chunks: string[] = [];

    // 3. 组合语义块
    for (let i = 0; i < parts.length; i += 2) {
      if (parts[i] || parts[i + 1]) {
        chunks.push(parts[i] + (parts[i + 1] || ''));
      }
    }

    // 4. 渲染为 inline-block
    return chunks.map((chunk, idx) => (
      <span key={idx} className={styles.semanticChunk}>
        {chunk}
      </span>
    ));
  };

  const isAudioType = quiz.type.startsWith('audio-');

  return (
    <div className={styles.promptContainer}>
      <AnimatePresence mode="wait">
        <motion.div
          key={roundId}
          className={styles.promptContent}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.3 }}
        >
          {isAudioType ? (
            <button className={styles.audioBtn} onClick={onPlayAudio}>
              <Volume2 size={48} />
            </button>
          ) : quiz.type === 'formula-to-kana' ? (
            /* 算式题面 */
            <div className={styles.formulaPrompt}>
              {quiz.prompt.split(' + ').map((part, idx, arr) => (
                <React.Fragment key={idx}>
                  <span className={styles.formulaPart}>{part}</span>
                  {idx < arr.length - 1 && (
                    <span className={styles.formulaOperator}>+</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          ) : (
            /* 普通文字题面 */
            <div className={styles.promptWithSpeaker}>
              <span
                className={`
                  jaFont 
                  ${styles.promptText} 
                  ${quiz.prompt.length >= 11 ? styles.tinyText : ''}
                  ${quiz.prompt.length >= 7 ? styles.littleText : ''}
                  ${quiz.prompt.length > 4 ? styles.smallText : ''}`}
              >
                {renderSemanticPrompt(quiz.prompt)}
              </span>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
