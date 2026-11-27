import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '../locales/en.json';
import zhCN from '../locales/zh-CN.json';
import ms from '../locales/ms.json';
import ta from '../locales/ta.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      'zh-CN': { translation: zhCN },
      ms: { translation: ms },
      ta: { translation: ta },
    },
    lng: 'en', // Default to English on load
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;