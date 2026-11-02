import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, LANGUAGES, translations, TranslationKey } from './translations.ts';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  isRtl: boolean;
  triggerGoogleTranslate: (targetLang?: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('nutricoach_lang') as Language;
    const validCodes = LANGUAGES.map((l) => l.code);
    if (saved && validCodes.includes(saved)) {
      return saved;
    }

    // Detect browser language
    const navFull = (navigator.language || '').toLowerCase();
    const navShort = navFull.slice(0, 2) as Language;

    if (navShort === 'nb' as any || navShort === 'nn' as any) {
      return 'no';
    }

    if (validCodes.includes(navShort)) {
      return navShort;
    }

    return 'fr';
  });

  const isRtl = language === 'ar';

  const applyLanguageEffects = useCallback((lang: Language) => {
    document.documentElement.lang = lang;
    if (lang === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('nutricoach_lang', lang);
    applyLanguageEffects(lang);
  };

  useEffect(() => {
    applyLanguageEffects(language);
  }, [language, applyLanguageEffects]);

  // Dynamic Google Translate trigger for 130+ languages
  const triggerGoogleTranslate = useCallback((targetLang?: string) => {
    if (typeof window === 'undefined') return;

    // Check if script is already added
    const existingScript = document.getElementById('google-translate-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.type = 'text/javascript';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      (window as any).googleTranslateElementInit = () => {
        if ((window as any).google?.translate?.TranslateElement) {
          new (window as any).google.translate.TranslateElement(
            {
              pageLanguage: 'fr',
              layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: true,
            },
            'google_translate_element'
          );
        }
      };
      document.body.appendChild(script);
    }

    // If targetLang provided, try setting google translate select or cookie
    if (targetLang) {
      document.cookie = `googtrans=/auto/${targetLang}; path=/;`;
      document.cookie = `googtrans=/auto/${targetLang}; domain=.${window.location.hostname}; path=/;`;
    }
  }, []);

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    const langDict = (translations as any)[language] || translations.fr;
    let str = langDict?.[key] || (translations.en as any)?.[key] || (translations.fr as any)?.[key] || key;

    if (params) {
      Object.entries(params).forEach(([k, val]) => {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(val));
      });
    }

    return str;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRtl, triggerGoogleTranslate }}>
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
