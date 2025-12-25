import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { AnimatePresence } from 'framer-motion'; // 👈 1. 新增引入

// 引入全局样式
import './styles/global.css';

// 引入页面组件
import { HomePage } from './pages/HomePage';
import { TestStudySession } from './pages/TestStudySession/TestStudySession';

// 👈 2. 引入刚才写好的动画壳子
import { PageTransition } from './components/PageTransition';

// 🔥 3. 新增：把路由规则拆分到一个子组件里
// 为什么要这么做？因为 useLocation 必须在 BrowserRouter 内部使用
const AnimatedRoutes = () => {
  const location = useLocation(); // 获取当前路径，用于触发动画

  return (
    // mode="wait" 表示：旧页面先走完离场动画，新页面再开始进场
    <AnimatePresence mode="wait">
      {/* key={location.pathname} 是告诉 React：路径变了，这是个新页面，请播放动画 */}
      <Routes location={location} key={location.pathname}>
        {/* 规则 A: 首页 */}
        <Route
          path="/"
          element={
            // 👇 用 PageTransition 包裹页面
            <PageTransition>
              <HomePage
                onCategorySelect={(id) => console.log('用户点击了:', id)}
              />
            </PageTransition>
          }
        />

        {/* 规则 B: 学习页 */}
        <Route
          path="/study/:courseId"
          element={
            // 👇 用 PageTransition 包裹页面
            <PageTransition>
              <TestStudySession />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <SettingsProvider>
      {/* 1. 最外层包裹 BrowserRouter */}
      <BrowserRouter>
        <div className="app-container">
          {/* 🔥 4. 这里直接使用我们拆分出来的组件，替代原来的 <Routes>... */}
          <AnimatedRoutes />
        </div>
      </BrowserRouter>
    </SettingsProvider>
  );
}
