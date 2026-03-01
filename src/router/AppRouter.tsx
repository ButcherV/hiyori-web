import { Suspense, lazy, useEffect, useRef } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { App as CapApp } from '@capacitor/app';

// 动画组件 - 路由层直接使用，不懒加载
import { PageTransition } from '../components/PageTransition';

import { HomePage } from '../pages/HomePage/HomePage';

// 页面组件 - 懒加载，只在用户导航到对应路由时才解析
const TestStudySession = lazy(() =>
  import('../pages/TestStudySession/TestStudySession').then(m => ({ default: m.TestStudySession }))
);

const KanaDictionaryPage = lazy(() =>
  import('../pages/KanaDictAndQuiz/PageKanaDictionary/KanaDictionaryPage').then(m => ({
    default: m.KanaDictionaryPage,
  }))
);
const KanaQuizSelectionPage = lazy(() =>
  import('../pages/KanaDictAndQuiz/PageKanaQuiz/KanaQuizSelectionPage').then(m => ({
    default: m.KanaQuizSelectionPage,
  }))
);
const PageQuizSession = lazy(() =>
  import('../pages/KanaDictAndQuiz/PageKanaQuiz/PageQuizSession').then(m => ({
    default: m.PageQuizSession,
  }))
);
const MistakeNotebook = lazy(() =>
  import('../pages/KanaDictAndQuiz/PageMistakeNotebook/MistakeNotebook').then(m => ({
    default: m.MistakeNotebook,
  }))
);
const DicePage = lazy(() =>
  import('../pages/DicePage').then(m => ({ default: m.DicePage }))
);
const PageClock = lazy(() =>
  import('../pages/Clock/PageClock').then(m => ({ default: m.PageClock }))
);
const PageNumbers = lazy(() =>
  import('../pages/Numbers/PageNumbers').then(m => ({ default: m.PageNumbers }))
);
const PageDates = lazy(() =>
  import('../pages/Dates/PageDates').then(m => ({ default: m.PageDates }))
);
const NumberTranslator = lazy(() =>
  import('../pages/Numbers/Translator/NumberTranslator').then(m => ({
    default: m.NumberTranslator,
  }))
);

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

const BG_KEY = 'hiyori_bg_time';
const BG_TIMEOUT_MS = 3 * 60 * 1000; // 后台超过 3 分钟，回来时跳回首页

export const AppRouter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentDepth = getRouteDepth(location.pathname);
  const prevDepthRef = useRef<number>(currentDepth);

  // 计算方向：1 = 前进/深入, -1 = 后退/返回
  const direction = currentDepth >= prevDepthRef.current ? 1 : -1;

  useEffect(() => {
    prevDepthRef.current = currentDepth;
  }, [currentDepth]);

  useEffect(() => {
    const listenerPromise = CapApp.addListener('appStateChange', ({ isActive }) => {
      if (!isActive) {
        localStorage.setItem(BG_KEY, String(Date.now()));
      } else {
        const stored = localStorage.getItem(BG_KEY);
        if (stored && Date.now() - Number(stored) > BG_TIMEOUT_MS) {
          navigate('/', { replace: true });
        }
        localStorage.removeItem(BG_KEY);
      }
    });

    return () => {
      listenerPromise.then((h) => h.remove());
    };
  }, [navigate]);

  return (
    // Suspense 包裹整个路由区域，懒加载期间显示空白（本地文件极快，几乎不可见）
    <Suspense fallback={null}>
      {/* AnimatePresence 的 custom 负责"离场动画"的方向判断 */}
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
          <Route
            path="/study/clock"
            element={
              <PageTransition preset="slide" depth={2} direction={direction}>
                <PageClock />
              </PageTransition>
            }
          />

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
    </Suspense>
  );
};
