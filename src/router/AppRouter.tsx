import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { HomePage } from '../pages/HomePage/HomePage';
import { TestStudySession } from '../pages/TestStudySession/TestStudySession';
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
            <PageTransition preset="home">
              <HomePage />
            </PageTransition>
          }
        />

        <Route
          path="/study/kana/:courseId"
          element={
            <PageTransition preset="scale">
              <TestStudySession />
            </PageTransition>
          }
        />

        <Route
          path="/study/dates"
          element={
            <PageTransition preset="slide">
              <DatesPage />
            </PageTransition>
          }
        />

        <Route
          path="/kana-dictionary"
          element={
            <PageTransition preset="slide">
              <KanaDictionaryPage />
            </PageTransition>
          }
        />

        <Route path="/dice" element={<DicePage />} />
      </Routes>
    </AnimatePresence>
  );
};
