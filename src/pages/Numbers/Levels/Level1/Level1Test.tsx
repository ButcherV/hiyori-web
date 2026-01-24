import React, { useState, useCallback } from 'react';
import { DiceRoller } from '../../../../components/Dice/DiceContainer';
import { NumberKeypad } from './NumberKeypad';
import styles from './Level1Test.module.css'; // 稍后提供简单的样式

interface Level1TestProps {
  // 核心回调：答错时，通知父组件跳转到学习模式，并指定数字
  onMistake: (targetNum: number) => void;
}

export const Level1Test: React.FC<Level1TestProps> = ({ onMistake }) => {
  // 题目状态：null 表示还没掷骰子
  const [problem, setProblem] = useState<{ a: number; b: number } | null>(null);

  // 骰子掷完的回调
  const handleRollComplete = useCallback((total: number, values: number[]) => {
    // values 是 [x, y]，对应两个骰子的值 (0-5)
    setProblem({ a: values[0], b: values[1] });
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
            // 出题态
            <span className={styles.equationText}>
              {problem.a} + {problem.b} ={' '}
              <span className={styles.questionMark}>?</span>
            </span>
          ) : (
            // 空闲态
            <span className={styles.placeholderText}>Drag dice to start</span>
          )}
        </div>
      </div>

      {/* 区域 C: 键盘 */}
      <div
        className={`${styles.keypadSection} ${!problem ? styles.disabled : ''}`}
      >
        <NumberKeypad onKeyClick={handleKeyClick} />
      </div>
    </div>
  );
};
