import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { HomePage } from '../pages/HomePage/HomePage';
// import { TestStudySession } from '../pages/TestStudySession/TestStudySession';
import { TestStudySession } from '../pages/V2TestStudySession/TestStudySession';
import { KanaDictionaryPage } from '../pages/KanaDictionary';
import { PageTransition } from '../components/PageTransition';
import { DicePage } from '../pages/DicePage';
import { DatesPage } from '../pages/DatesPage';

export const AppRouter = () => {
  const location = useLocation();

  return (
    <AnimatePresence initial={false}>
      <Routes location={location} key={location.pathname}>
        {/* 首页 */}
        <Route
          path="/"
          element={
            <PageTransition isHome={true}>
              <HomePage />
            </PageTransition>
          }
        />

        <Route
          path="/study/kana/:courseId"
          element={
            <PageTransition>
              <TestStudySession />
            </PageTransition>
          }
        />

        <Route
          path="/study/dates"
          element={
            <PageTransition>
              <DatesPage />
            </PageTransition>
          }
        />

        <Route
          path="/study/dates"
          element={
            <PageTransition>
              <DatesPage />
            </PageTransition>
          }
        />

        <Route
          path="/kana-dictionary"
          element={
            <PageTransition>
              <KanaDictionaryPage />
            </PageTransition>
          }
        />

        <Route path="/dice" element={<DicePage />} />
      </Routes>
    </AnimatePresence>
  );
};
