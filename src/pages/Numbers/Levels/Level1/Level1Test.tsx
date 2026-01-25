import React, { useState, useCallback } from 'react';
import { DiceRoller } from '../../../../components/Dice/DiceContainer';
import { NumberKeypad, type KeypadDisplayMode } from './NumberKeypad';
import styles from './Level1Test.module.css';
import { MoveRight } from 'lucide-react';

interface Level1TestProps {
  // 核心回调：答错时，通知父组件跳转到学习模式，并指定数字
  onMistake: (targetNum: number) => void;
}

const ALLOWED_MODES: KeypadDisplayMode[] = ['kana', 'mixed'];

export const Level1Test: React.FC<Level1TestProps> = ({ onMistake }) => {
  // 题目状态：null 表示还没掷骰子
  const [problem, setProblem] = useState<{ a: number; b: number } | null>(null);

  // keypadMode: 用于控制当前这一题键盘显示什么文字（汉字/假名/混合）
  // roundId: 自增计数器，作为 key 传给键盘，用于强制销毁并重新生成组件（实现彻底的乱序刷新）
  const [keypadMode, setKeypadMode] = useState<KeypadDisplayMode>('mixed');
  const [roundId, setRoundId] = useState(0);

  // 骰子掷完的回调
  const handleRollComplete = useCallback((total: number, values: number[]) => {
    console.log(total);
    // values 是 [x, y]，对应两个骰子的值 (0-5)
    setProblem({ a: values[0], b: values[1] });

    const randomMode =
      ALLOWED_MODES[Math.floor(Math.random() * ALLOWED_MODES.length)];
    setKeypadMode(randomMode);
    setRoundId((prev) => prev + 1); // 计数器 +1，触发 React 的重新挂载机制
  }, []);

  // 键盘点击处理
  const handleKeyClick = (inputNum: number) => {
    if (!problem) return; // 没出题不能点

    const correctAnswer = problem.a + problem.b;

    if (inputNum === correctAnswer) {
      // ✅ 答对逻辑
      console.log('Correct!');
      // 简单粗暴：直接清空题目，等待用户再次拖拽骰子
      // 你也可以在这里加个 500ms 延时让用户看一眼绿色结果
      setProblem(null);
    } else {
      // ❌ 答错逻辑
      console.log(`Wrong! ${problem.a} + ${problem.b} = ${correctAnswer}`);
      // 核心需求：失败跳到学习对应的答案
      onMistake(correctAnswer);
    }
  };

  return (
    <div className={styles.container}>
      {/* 区域 A: 3D 骰子 */}
      <div className={styles.diceSection}>
        <DiceRoller onRoll={handleRollComplete} disabled={!!problem} />
      </div>

      {/* 区域 B: 算式板 */}
      <div className={styles.boardSection}>
        <div className={styles.equationCard}>
          {problem ? (
            // --- 动态出题态 ---
            // key={roundId} 确保每次新题目都会重新触发动画
            <React.Fragment key={roundId}>
              {/* 1. 加数 A (立即弹出) */}
              <div
                className={`${styles.numBlock} ${styles.animPop}`}
                style={{ animationDelay: '0s' }}
              >
                {problem.a}
              </div>

              {/* 2. 加号 (延迟 0.1s) */}
              <div
                className={`${styles.operator} ${styles.animPop}`}
                style={{ animationDelay: '0.1s' }}
              >
                +
              </div>

              {/* 3. 加数 B (延迟 0.2s) */}
              <div
                className={`${styles.numBlock} ${styles.animPop}`}
                style={{ animationDelay: '0.2s' }}
              >
                {problem.b}
              </div>

              {/* 4. 等号 (延迟 0.3s) */}
              <div
                className={`${styles.operator} ${styles.animPop}`}
                style={{ animationDelay: '0.3s' }}
              >
                =
              </div>

              {/* 5. 问号 (Target Block) */}
              {/* 外层包装：只负责“进场动画”和“延迟” */}
              <div
                className={styles.animPop}
                style={{ animationDelay: '0.4s' }}
              >
                {/* 内层积木 */}
                <div
                  className={`
                    ${styles.numBlock} 
                    ${styles.targetBlock} 
                    ${styles.animPulse}
                  `}
                  style={{
                    opacity: 1,
                    transform: 'none',
                    // 🟢 优化：让呼吸动画等“落地”后再开始
                    // 0.4s(等待) + 0.5s(飞行) = 0.9s
                    animationDelay: '0.9s',
                  }}
                >
                  ?
                </div>
              </div>
            </React.Fragment>
          ) : (
            // --- 空闲态 ---
            <span className={styles.placeholderText}>
              Drag dice <MoveRight size={16} /> Roll
            </span>
          )}
        </div>
      </div>

      {/* 区域 C: 键盘 */}
      <div
        className={`${styles.keypadSection} ${!problem ? styles.disabled : ''}`}
      >
        <NumberKeypad
          // 关键点：key 变化时，React 会销毁旧组件、创建新组件 -> 触发内部 shuffleList -> 实现全新乱序
          key={roundId}
          onKeyClick={handleKeyClick}
          // 开启乱序
          shuffle={true}
          // 使用随机生成的非阿拉伯模式
          displayMode={keypadMode}
        />
      </div>
    </div>
  );
};
