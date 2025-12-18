import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

// --- CSS 架构引入顺序 (保持你原有的不变) ---
import './styles/reset.css'
import './styles/variables.css'
import './styles/global.css'

import './i18n';

// 🔥 1. 引入我们刚才写的设置 Context
import { SettingsProvider } from './context/SettingsContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 🔥 2. 用 Provider 包裹 App，这样全应用都能读取设置了 */}
    <SettingsProvider>
      <App />
    </SettingsProvider>
  </React.StrictMode>,
)