import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import zh from './locales/zh.json';
// 1. 引入你创建的繁体 JSON 文件
import zhHant from './locales/zh-Hant.json';

i18n
  // 检测用户浏览器语言
  .use(LanguageDetector)
  // 注入 react-i18next 实例
  .use(initReactI18next)
  // 初始化
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
      // 2. 必须在这里注册 zh-Hant，这样 i18n 才能识别这个 key
      'zh-Hant': { translation: zhHant },
    },
    // 如果找不到指定的语言（比如你以后加了日文 UI 但没写翻译），默认用英语
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    // 强制检测顺序，优先使用 localStorage 里的 i18nextLng（如果你还想保留插件检测逻辑的话）
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
