import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import de from './locales/de.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection: {
      order: ['navigator'],
    },
    resources: {
      en,
      de,
    },
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
