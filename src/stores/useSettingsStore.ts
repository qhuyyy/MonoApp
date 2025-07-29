import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../config/i18n';

type SettingsState = {
  theme: 'light' | 'dark';
  language: 'en' | 'vi';
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: 'en' | 'vi') => void;
};

export const useSettingsStore = create<
  SettingsState & { loadSettings: () => Promise<void> }
>(set => ({
  theme: 'light',
  language: 'en',
  setTheme: async theme => {
    await AsyncStorage.setItem('theme', theme);
    set({ theme });
  },
  setLanguage: async language => {
    await AsyncStorage.setItem('language', language);
    i18n.changeLanguage(language);
    set({ language });
  },
  loadSettings: async () => {
    const theme = (await AsyncStorage.getItem('theme')) as
      | 'light'
      | 'dark'
      | null;
    const language = (await AsyncStorage.getItem('language')) as
      | 'en'
      | 'vi'
      | null;
    if (theme) set({ theme });
    if (language) set({ language });
  },
}));
