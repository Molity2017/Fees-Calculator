import { create } from 'zustand';
import { translations } from '../i18n/translations';

type Language = 'ar' | 'en';

interface LanguageState {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

export const useLanguage = create<LanguageState>((set, get) => ({
  language: 'ar',
  toggleLanguage: () => set(state => ({ 
    language: state.language === 'ar' ? 'en' : 'ar' 
  })),
  t: (key: string) => {
    const { language } = get();
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  }
}));