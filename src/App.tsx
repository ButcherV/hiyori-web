import { BrowserRouter } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { AppRouter } from './router/AppRouter'; // 👈 引入刚才拆出去的路由
import './styles/global.css';

export default function App() {
  return (
    <SettingsProvider>
      <BrowserRouter>
        <div className="app-container">
          {/* 🔥 路由逻辑已经拆出去了，这里极其清爽 */}
          <AppRouter />
        </div>
      </BrowserRouter>
    </SettingsProvider>
  );
}
