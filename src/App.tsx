import React, { useState } from 'react';
import { SettingsProvider } from './context/SettingsContext';

// 引入全局样式 (确保你之前建过这些文件，如果没有就先忽略)
import './styles/global.css';

// 引入组件
import { QuizSession } from './components/QuizSession';
import { HomePage } from './pages/HomePage';

// 定义页面状态类型
type ViewState = 'HOME' | 'QUIZ';

export default function App() {
  // 1. 核心状态：当前显示哪个页面？默认是 HOME
  const [currentView, setCurrentView] = useState<ViewState>('HOME');
  
  // 2. 核心状态：用户选了哪个分类？(比如 'hiragana' 或 'numbers')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // --- 动作处理 ---

  // 从首页点击分类 -> 进入做题页
  const handleCategorySelect = (categoryId: string) => {
    console.log(`用户选择了分类: ${categoryId}`);
    setSelectedCategory(categoryId);
    setCurrentView('QUIZ');
  };

  // 从做题页点击返回 -> 回到首页
  const handleBackToHome = () => {
    setCurrentView('HOME');
    setSelectedCategory(null);
  };

  return (
    <SettingsProvider>
      <div className="app-container">
        
        {/* 逻辑判断：如果是 HOME 就显示首页 */}
        {currentView === 'HOME' && (
          <HomePage onCategorySelect={handleCategorySelect} />
        )}

        {/* 逻辑判断：如果是 QUIZ 就显示做题页 */}
        {currentView === 'QUIZ' && (
          <div style={{ position: 'relative', height: '100vh', background: '#fff' }}>
            
            {/* 临时加一个返回按钮 (以后我们会做到 QuizHeader 里) */}
            <button 
              onClick={handleBackToHome}
              style={{
                position: 'absolute',
                top: 50, // 避开刘海屏
                left: 20,
                zIndex: 100,
                padding: '8px 16px',
                background: '#F2F2F7',
                border: 'none',
                borderRadius: '20px',
                fontWeight: '600',
                color: '#007AFF',
                cursor: 'pointer'
              }}
            >
              ← Back
            </button>

            {/* 这里传入 selectedCategory，让 QuizSession 知道该出什么题 */}
            {/* 目前 QuizSession 可能还没处理 category 属性，但我们可以先传进去备用 */}
            <QuizSession />
          </div>
        )}
      </div>
    </SettingsProvider>
  );
}