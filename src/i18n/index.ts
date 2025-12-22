import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import zh from './locales/zh.json';

i18n
  // 检测用户浏览器语言
  .use(LanguageDetector)
  // 注入 react-i18next 实例
  .use(initReactI18next)
  // 初始化
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh }, // 注意：这里用 zh 代表中文，对应 settings 里的 key
    },
    fallbackLng: 'en', // 如果检测不到语言，默认用英语
    interpolation: {
      escapeValue: false, // React 默认已经防范 XSS，不需要 i18n 再转义
    },
  });

export default i18n;
