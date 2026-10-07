import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Language, 
  TRANSLATIONS, 
  DYNASTY_TRANSLATIONS, 
  MOTIF_TRANSLATIONS, 
  ACCESSORY_TRANSLATIONS 
} from '../locales/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, fallback?: string) => string;
  tDynasty: (dynasty: string) => string;
  tMotif: (motifId: string) => string;
  tAccessory: (accId: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('vietphuc_lang');
      return saved === 'en' ? 'en' : 'vi';
    } catch {
      return 'vi';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('vietphuc_lang', lang);
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'vi' ? 'en' : 'vi');
  };

  const t = (key: string, fallback?: string): string => {
    const item = TRANSLATIONS[key];
    if (item && item[language]) {
      return item[language];
    }
    return fallback || key;
  };

  const tDynasty = (dynasty: string): string => {
    const item = DYNASTY_TRANSLATIONS[dynasty];
    if (item && item[language]) {
      return item[language];
    }
    return dynasty;
  };

  const tMotif = (motifId: string): string => {
    const item = MOTIF_TRANSLATIONS[motifId];
    if (item && item[language]) {
      return item[language];
    }
    return motifId;
  };

  const tAccessory = (accId: string): string => {
    const item = ACCESSORY_TRANSLATIONS[accId];
    if (item && item[language]) {
      return item[language];
    }
    return accId;
  };

  useEffect(() => {
    // Update document html lang attribute
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider 
      value={{ 
        language, 
        setLanguage, 
        toggleLanguage, 
        t, 
        tDynasty, 
        tMotif, 
        tAccessory 
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
