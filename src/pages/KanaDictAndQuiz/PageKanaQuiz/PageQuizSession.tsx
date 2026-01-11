// src/pages/KanaDictAndQuiz/PageQuizSession/index.tsx

import { useState, useRef, useMemo, type CSSProperties } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, Check, CircleX } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

// --- 复用现有组件 ---
import { CompletionScreen } from '../../../components/CompletionScreen';
import { SegmentedProgressBar } from '../../TestStudySession/SegmentedProgressBar';
import { KanaCard } from '../../TestStudySession/Cards/KanaCard';
import { WordCard } from '../../TestStudySession/Cards/WordCard';
import { QuizCard } from '../../TestStudySession/Cards/QuizCard';

// 🔥 直接引用，类型现在是匹配的
import {
  TinderCard,
  type TinderCardRef,
} from '../../../components/TinderCard/index';

// --- Hooks & Context ---
import { useSound } from '../../../hooks/useSound';
import { useTTS } from '../../../hooks/useTTS';
import { useSettings } from '../../../context/SettingsContext';

// --- 本地逻辑 ---
import { generateQuizQueue, getAnswerCard, type LessonCard } from './quizLogic';
import styles from '../../TestStudySession/TestStudySession.module.css';

const MAX_STACK_SIZE = 3;

export const PageQuizSession = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  // 1. 获取选题参数
  const targetIds = location.state?.targetIds || [];

  // 2. 初始化队列
  const [queue, setQueue] = useState<LessonCard[]>(() =>
    generateQuizQueue(targetIds)
  );
  const [currentIndex, setCurrentIndex] = useState(0);

  // 记录原始题目数量
  const [originalTotal] = useState(() => queue.length);

  // 状态
  const [isShaking, setIsShaking] = useState(false);

  // 🔥 直接使用导出的 Ref 类型
  const cardRef = useRef<TinderCardRef>(null);

  // 设置 & 音效
  const { soundEffect, hapticFeedback } = useSettings();
  const playSound = useSound();
  const { speak } = useTTS();

  const currentItem = queue[currentIndex];
  const isFinished = currentIndex >= queue.length;

  // --- 辅助函数 ---
  const triggerSound = (type: Parameters<typeof playSound>[0]) => {
    if (soundEffect) playSound(type);
  };

  const triggerHaptic = async (style: ImpactStyle) => {
    if (!hapticFeedback) return;
    if (Capacitor.isNativePlatform()) await Haptics.impact({ style });
  };

  const triggerNotification = async (type: NotificationType) => {
    if (!hapticFeedback) return;
    if (Capacitor.isNativePlatform()) await Haptics.notification({ type });
  };

  const recordMistake = (card: LessonCard) => {
    console.log('Record Mistake:', card.data.id, card.quizType);
  };

  // --- 核心交互逻辑 ---
  const handleSwipe = (dir: 'left' | 'right') => {
    if (!currentItem) return;

    // A. 补救卡/教学卡 -> 划走即阅
    if (currentItem.type !== 'QUIZ') {
      setTimeout(() => setCurrentIndex((prev) => prev + 1), 200);
      return;
    }

    // B. Quiz 卡
    const isRightSwipe = dir === 'right';

    // 逻辑：是否“操作正确”
    // 1. 选中了对的 (Right + Correct)
    // 2. 排除了错的 (Left + !Correct)
    const isUserCorrect =
      (currentItem.isCorrect && isRightSwipe) ||
      (!currentItem.isCorrect && !isRightSwipe);

    // 辅助函数：移除同组剩余卡片
    const removeRemainingGroupCards = (currentQueue: LessonCard[]) => {
      if (!currentItem.quizGroupId) return [...currentQueue];
      return currentQueue.filter((c, index) => {
        if (index <= currentIndex) return true; // 保留历史
        return c.quizGroupId !== currentItem.quizGroupId; // 移除未来同组
      });
    };

    if (isUserCorrect) {
      // ✅ 用户操作逻辑正确

      if (currentItem.isCorrect && isRightSwipe) {
        // 🎉 场景 1：用户选中了正确答案 -> 真正得分，本题结束
        triggerSound('score');
        triggerHaptic(ImpactStyle.Medium);

        // 🔥 只有在这里，才移除同组剩余卡片，进入下一题
        setQueue((prev) => removeRemainingGroupCards(prev));
      } else {
        // 👋 场景 2：用户排除了错误答案 -> 只是排除，本题继续
        triggerHaptic(ImpactStyle.Light);

        // 🔥 关键修正：这里绝对不能移除同组卡片！
        // 什么都不用做，让这张卡飞走，用户自然会看到下一张选项
      }
    } else {
      // ❌ 用户操作逻辑错误 (把对的扔了，或者选了错的)
      triggerSound('failure');
      triggerNotification(NotificationType.Error);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);

      recordMistake(currentItem);

      const answerCard = getAnswerCard(currentItem);

      // 答错了：移除同组剩余（因为已经失败了，没必要再猜），并插入解析
      setQueue((prev) => {
        const cleanedQueue = removeRemainingGroupCards(prev);
        const newQueue = [...cleanedQueue];
        newQueue.splice(currentIndex + 1, 0, answerCard);
        return newQueue;
      });
    }

    setTimeout(() => setCurrentIndex((prev) => prev + 1), 200);
  };

  // --- Header 逻辑 ---
  const getHeaderInfo = () => {
    if (!currentItem) return { title: '', sub: '', isJa: false };

    if (!currentItem.isOriginal && currentItem.type !== 'QUIZ') {
      return {
        title: t(currentItem.headerTitle || ''),
        sub: '',
        isJa: false,
      };
    }

    let isJa = false;
    if (currentItem.type === 'QUIZ') {
      if (
        currentItem.quizType === 'ROMAJI' ||
        currentItem.quizType === 'WORD'
      ) {
        isJa = true;
      }
    }

    const isWordQuiz =
      currentItem.type === 'QUIZ' && currentItem.quizType === 'WORD';
    const isKatakana = currentItem.data.kind === 'k-seion';

    if (isWordQuiz && isKatakana) {
      return {
        title:
          typeof currentItem.headerSub === 'string'
            ? currentItem.headerSub
            : // @ts-ignore
              currentItem.headerSub?.[i18n.language === 'zh' ? 'zh' : 'en'] ||
              '',
        sub: '',
        isJa: false,
      };
    }

    const subText =
      typeof currentItem.headerSub === 'string'
        ? currentItem.headerSub
        : // @ts-ignore
          currentItem.headerSub?.[i18n.language === 'zh' ? 'zh' : 'en'] || '';

    return {
      title: currentItem.headerTitle || '',
      sub: subText,
      isJa,
    };
  };

  const headerInfo = getHeaderInfo();

  // --- 进度计算 ---
  const quizPassed = useMemo(() => {
    return queue
      .slice(0, currentIndex)
      .filter((c) => c.isOriginal && c.type === 'QUIZ').length;
  }, [queue, currentIndex]);

  // --- 渲染卡片 ---
  const renderCardContent = (card: LessonCard) => {
    switch (card.type) {
      case 'QUIZ':
        return (
          <QuizCard
            displayContent={card.displayContent || card.data.kana}
            isContentJa={card.quizType !== 'ROMAJI'}
          />
        );
      case 'KANA_LEARN':
        return <KanaCard data={card.data} onPlaySound={speak} />;
      case 'WORD_LEARN':
        return <WordCard data={card.data} onPlaySound={speak} />;
      default:
        return null;
    }
  };

  const visibleCards = useMemo(() => {
    if (!queue.length || currentIndex >= queue.length) return [];
    return queue.slice(currentIndex, currentIndex + MAX_STACK_SIZE);
  }, [queue, currentIndex]);

  if (isFinished) {
    return <CompletionScreen onGoHome={() => navigate('/')} />;
  }

  if (queue.length === 0) return null;

  return (
    <div className={`${styles.container} ${styles.quizContainer}`}>
      {/* Top Bar */}
      <div className={styles.topNav}>
        <button className={styles.closeBtn} onClick={() => navigate(-1)}>
          <CircleX size={28} />
        </button>
        <div style={{ flex: 1, margin: '0 8px' }}>
          <SegmentedProgressBar
            learnCurrent={0}
            learnTotal={0}
            quizCurrent={quizPassed}
            quizTotal={originalTotal}
            phase="QUIZ"
          />
        </div>
        <div style={{ width: 40 }} />
      </div>

      {/* Header */}
      <div className={styles.instructionBar}>
        <div
          className={`
          ${styles.instructionTitle} 
          ${currentItem.type !== 'QUIZ' ? styles.passive : ''}
          ${headerInfo.isJa ? styles.jaFont : ''}
        `}
        >
          {headerInfo.isJa ? headerInfo.title : t(headerInfo.title || '')}
        </div>
        {headerInfo.sub && (
          <div className={styles.instructionSub}>{headerInfo.sub}</div>
        )}
      </div>

      {/* Card Area */}
      <div
        className={`${styles.cardAreaWrapper} ${isShaking ? styles.shake : ''}`}
      >
        <div className={styles.cardArea}>
          {visibleCards.map((card, index) => {
            const isTopCard = index === 0;
            const cardStyle = {
              zIndex: MAX_STACK_SIZE - index,
              transform: `translateY(${index * 18}px) scale(${1 - index * 0.05})`,
              pointerEvents: isTopCard ? 'auto' : 'none',
            } as CSSProperties;

            const contentBlurClass = isTopCard
              ? styles.activeCard
              : styles.backgroundCard;

            return (
              <div
                key={card.uniqueId}
                className={styles.stackWrapper}
                style={cardStyle}
              >
                <TinderCard
                  ref={isTopCard ? cardRef : null}
                  touchEnabled={isTopCard}
                  preventSwipe={card.type !== 'QUIZ' ? ['left'] : []}
                  // 🔥 直接传 handleSwipe，不再需要适配器
                  onSwipe={isTopCard ? handleSwipe : () => {}}
                >
                  <div className={`${styles.cardContent} ${contentBlurClass}`}>
                    {renderCardContent(card)}
                  </div>
                </TinderCard>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Actions */}
      {currentItem.type === 'QUIZ' && (
        <div className={styles.quizActions}>
          <button
            className={`${styles.actionBtn} ${styles.reject}`}
            onClick={() => cardRef.current?.swipe('left')}
          >
            <X size={32} strokeWidth={3} />
          </button>
          <button
            className={`${styles.actionBtn} ${styles.accept}`}
            onClick={() => cardRef.current?.swipe('right')}
          >
            <Check size={32} strokeWidth={3} />
          </button>
        </div>
      )}
    </div>
  );
};

export default PageQuizSession;
