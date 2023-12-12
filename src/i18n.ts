import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from 'src/i18n/en.json';
import zh from 'src/i18n/zh.json';

const resources = {
  en: {
    translation: en,
  },
  zh: {
    translation: zh,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n;
