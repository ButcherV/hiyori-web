import { useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// 页面组件
import { HomePage } from '../pages/HomePage/HomePage';
import { TestStudySession } from '../pages/TestStudySession/TestStudySession';
import { KanaDictionaryPage } from '../pages/KanaDictAndQuiz/PageKanaDictionary/KanaDictionaryPage';
import { KanaQuizSelectionPage } from '../pages/KanaDictAndQuiz/PageKanaQuiz/KanaQuizSelectionPage';
import { PageQuizSession } from '../pages/KanaDictAndQuiz/PageKanaQuiz/PageQuizSession';
import { MistakeNotebook } from '../pages/KanaDictAndQuiz/PageMistakeNotebook/MistakeNotebook';
import { DicePage } from '../pages/DicePage';
// import { DatesPage } from '../pages/DatesPage';
import { MagicClock } from '../pages/Clock/Clock';
import { PageNumbers } from '../pages/Numbers/PageNumbers';
import { PageDates } from '../pages/Dates/PageDates';
import { NumberTranslator } from '../pages/Numbers/Translator/NumberTranslator';

// 动画组件
import { PageTransition } from '../components/PageTransition';

// ==========================================
// 1. 路由深度定义
// ==========================================
const getRouteDepth = (pathname: string): number => {
  if (pathname === '/') return 1;

  if (pathname.startsWith('/study/kana')) return 2;
  if (pathname === '/quiz/selection') return 2;
  if (pathname === '/study/dates') return 2;
  if (pathname === '/kana-dictionary') return 2;
  if (pathname === '/dice') return 2;
  if (pathname === '/mistake-book') return 2;
  if (pathname === '/quiz/session') return 3;
  if (pathname === '/study/clock') return 2;
  if (pathname === '/study/numbers') return 2;
  if (pathname === '/study/numbers/translator') return 3;

  return 100;
};

export const AppRouter = () => {
  const location = useLocation();
  const currentDepth = getRouteDepth(location.pathname);
  const prevDepthRef = useRef<number>(currentDepth);

  // 计算方向：1 = 前进/深入, -1 = 后退/返回
  const direction = currentDepth >= prevDepthRef.current ? 1 : -1;

  useEffect(() => {
    prevDepthRef.current = currentDepth;
  }, [currentDepth]);

  return (
    // AnimatePresence 的 custom 负责“离场动画”的方向判断
    <AnimatePresence initial={false} custom={direction}>
      <Routes location={location} key={location.pathname}>
        {/* Level 1 */}
        <Route
          path="/"
          element={
            <PageTransition preset="home" depth={1} direction={direction}>
              <HomePage />
            </PageTransition>
          }
        />

        {/* Level 2 */}
        <Route
          path="/study/kana/:courseId"
          element={
            <PageTransition preset="scale" depth={2} direction={direction}>
              <TestStudySession />
            </PageTransition>
          }
        />

        <Route
          path="/mistake-book"
          element={
            <PageTransition preset="slide" depth={2} direction={direction}>
              <MistakeNotebook />
            </PageTransition>
          }
        />

        <Route
          path="/study/dates"
          element={
            <PageTransition preset="slide" depth={2} direction={direction}>
              <PageDates />
            </PageTransition>
          }
        />

        <Route
          path="/study/numbers"
          element={
            <PageTransition preset="slide" depth={2} direction={direction}>
              <PageNumbers />
            </PageTransition>
          }
        />

        <Route
          path="/kana-dictionary"
          element={
            <PageTransition preset="slide" depth={2} direction={direction}>
              <KanaDictionaryPage />
            </PageTransition>
          }
        />

        <Route
          path="/quiz/selection"
          element={
            <PageTransition preset="slide" depth={2} direction={direction}>
              <KanaQuizSelectionPage />
            </PageTransition>
          }
        />

        <Route path="/dice" element={<DicePage />} />
        <Route path="/study/clock" element={<MagicClock />} />

        {/* Level 3 */}
        <Route
          path="/quiz/session"
          element={
            <PageTransition preset="scale" depth={3} direction={direction}>
              <PageQuizSession />
            </PageTransition>
          }
        />

        <Route
          path="/study/numbers/translator"
          element={
            <PageTransition preset="slide" depth={3} direction={direction}>
              <NumberTranslator />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};
