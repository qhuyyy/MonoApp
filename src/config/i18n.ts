import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import vi from '../locales/vi.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_KEY = 'language';

const initLanguage = async () => {
  const savedLang = (await AsyncStorage.getItem(LANGUAGE_KEY)) || 'en';
  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      vi: { translation: vi },
    },
    lng: savedLang,
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });
};

initLanguage();

export default i18n;
