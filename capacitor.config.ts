import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'hiyori-web',
  webDir: 'dist',
  plugins: {
    SplashScreen: {
      launchAutoHide: false,       // 不自动隐藏，等 React 渲染完再手动隐藏
      backgroundColor: '#f9f9f7', // 与 app 背景色一致，避免闪烁
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: false,
    },
  },
};

export default config;
