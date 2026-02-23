import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { SplashScreen } from '@capacitor/splash-screen';
import { AppRouter } from './router/AppRouter';
import { useSettings } from './context/SettingsContext'; // 引入 Hook
import { Onboarding } from './pages/Onboarding/Onboarding'; // 引入引导页

export default function App() {
  // 从设置中获取是否完成引导的状态
  const { hasFinishedOnboarding } = useSettings();

  // 等浏览器真正完成首帧绘制后再隐藏 SplashScreen
  // 两层 rAF：第一层在 commit 后的下一帧开始，第二层确保像素已上屏
  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        SplashScreen.hide({ fadeOutDuration: 300 });
      });
    });
  }, []);

  return (
    <BrowserRouter>
      <div className="app-container">
        {/* 逻辑：如果没完成引导，就只显示 Onboarding；完成后才显示正常的路由 */}
        {hasFinishedOnboarding ? <AppRouter /> : <Onboarding />}
      </div>
    </BrowserRouter>
  );
}
