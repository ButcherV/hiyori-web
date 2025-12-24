import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';

// 引入全局样式
import './styles/global.css';

// 引入页面组件
import { HomePage } from './pages/HomePage';
// 引入新的测试页面 (注意：这里指向刚才移动到的 pages 目录)
import { TestStudySession } from './pages/TestStudySession/TestStudySession';

export default function App() {
  return (
    <SettingsProvider>
      {/* 1. 最外层包裹 BrowserRouter */}
      <BrowserRouter>
        <div className="app-container">
          {/* 2. 定义路由规则 */}
          <Routes>
            {/* 规则 A: 访问根路径 / -> 显示首页 */}
            <Route
              path="/"
              element={
                <HomePage
                  onCategorySelect={(id) => console.log('用户点击了:', id)}
                />
              }
            />

            {/* 规则 B: 访问 /study/xxx -> 显示测试学习页 
                :courseId 是参数，比如 /study/hira-a
            */}
            <Route path="/study/:courseId" element={<TestStudySession />} />
          </Routes>
        </div>
      </BrowserRouter>
    </SettingsProvider>
  );
}
