import { create } from 'zustand';
import { translations } from '../i18n/translations';

type Language = 'ar' | 'en';

interface LanguageState {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

// Get saved language from localStorage or default to 'ar'
const getSavedLanguage = (): Language => {
  const saved = localStorage.getItem('language');
  return (saved === 'ar' || saved === 'en') ? saved : 'ar';
};

export const useLanguage = create<LanguageState>((set, get) => ({
  language: getSavedLanguage(),
  toggleLanguage: () => set(state => {
    const newLanguage = state.language === 'ar' ? 'en' : 'ar';
    localStorage.setItem('language', newLanguage);
    return { language: newLanguage };
  }),
  t: (key: string) => {
    const { language } = get();
    const keys = key.split('.');
    let value: any = translations[language];
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key;
      }
    }
    return value || key;
  }
}));