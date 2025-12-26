import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import { HomePage } from '../pages/HomePage';
import { TestStudySession } from '../pages/TestStudySession/TestStudySession';
import { PageTransition } from '../components/PageTransition';

export const AppRouter = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* 首页 */}
        <Route
          path="/"
          element={
            <PageTransition>
              <HomePage
                onCategorySelect={(id) => console.log('用户点击了:', id)}
              />
            </PageTransition>
          }
        />

        {/* 学习页 (注意：这里我们预留了 :courseId 参数，为下一步做准备) */}
        <Route
          path="/study/:courseId"
          element={
            <PageTransition>
              <TestStudySession />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};
