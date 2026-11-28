import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, LANGUAGES, translations, TranslationKey } from './translations.ts';

export const LOCALE_BY_LANGUAGE: Record<Language, string> = {
  fr: 'fr-FR',
  en: 'en-US',
  es: 'es-ES',
  de: 'de-DE',
  it: 'it-IT',
  pt: 'pt-PT',
  nl: 'nl-NL',
  pl: 'pl-PL',
  no: 'nb-NO',
  sv: 'sv-SE',
  da: 'da-DK',
  fi: 'fi-FI',
  ru: 'ru-RU',
  ja: 'ja-JP',
  zh: 'zh-CN',
  ar: 'ar-SA',
  tr: 'tr-TR',
  el: 'el-GR',
  cs: 'cs-CZ',
  ro: 'ro-RO',
  uk: 'uk-UA',
};

export const getLocaleForLanguage = (lang: Language): string => {
  return LOCALE_BY_LANGUAGE[lang] || 'fr-FR';
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  isRtl: boolean;
  locale: string;
  isUniversalTranslateOpen: boolean;
  triggerGoogleTranslate: (targetLang?: string) => void;
  resetGoogleTranslate: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const clearGoogleTranslateCookies = () => {
  if (typeof document === 'undefined' || typeof window === 'undefined') return;
  const expired = 'Thu, 01 Jan 1970 00:00:00 GMT';
  const hostname = window.location.hostname;
  const hostParts = hostname.split('.');
  const domains = ['', hostname, `.${hostname}`];
  if (hostParts.length >= 2) {
    domains.push(`.${hostParts.slice(-2).join('.')}`);
  }
  domains.forEach((dom) => {
    const domPart = dom ? ` domain=${dom};` : '';
    document.cookie = `googtrans=; expires=${expired}; path=/;${domPart}`;
    document.cookie = `googtrans=/auto/fr; expires=${expired}; path=/;${domPart}`;
  });
};

const hasGoogleTranslateDomMutation = (): boolean => {
  if (typeof document === 'undefined') return false;
  return (
    document.documentElement.classList.contains('translated-ltr') ||
    document.documentElement.classList.contains('translated-rtl') ||
    document.querySelector('font[style*="vertical-align"]') !== null
  );
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const validCodes = LANGUAGES.map((l) => l.code);
    const rawSaved = localStorage.getItem('nutricoach_lang');
    const saved = rawSaved ? (rawSaved.trim().toLowerCase().slice(0, 2) as Language) : null;
    let initialLang: Language = 'fr';

    if (saved && validCodes.includes(saved)) {
      initialLang = saved;
    } else {
      const navFull = (navigator.language || '').toLowerCase();
      const navShort = navFull.slice(0, 2) as Language;
      if (navShort === ('nb' as any) || navShort === ('nn' as any)) {
        initialLang = 'no';
      } else if (validCodes.includes(navShort)) {
        initialLang = navShort;
      }
    }

    if (typeof document !== 'undefined') {
      document.documentElement.lang = initialLang;
      document.documentElement.setAttribute('dir', initialLang === 'ar' ? 'rtl' : 'ltr');
    }

    return initialLang;
  });

  const [showGoogleTranslateBar, setShowGoogleTranslateBar] = useState(false);

  const isRtl = language === 'ar';
  const locale = getLocaleForLanguage(language);

  const applyLanguageEffects = useCallback((lang: Language) => {
    document.documentElement.lang = lang;
    if (lang === 'ar') {
      document.documentElement.setAttribute('dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }
  }, []);

  const resetGoogleTranslate = useCallback(() => {
    clearGoogleTranslateCookies();
    setShowGoogleTranslateBar(false);
    if (typeof document !== 'undefined') {
      const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
      if (combo && combo.value) {
        combo.value = '';
        combo.dispatchEvent(new Event('change'));
      }
      document.documentElement.classList.remove('translated-ltr', 'translated-rtl');
      const gtBanner = document.querySelector('.goog-te-banner-frame') as HTMLElement | null;
      if (gtBanner) {
        gtBanner.style.display = 'none';
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    const wasTranslatedDom = hasGoogleTranslateDomMutation();
    localStorage.setItem('nutricoach_lang', lang);
    resetGoogleTranslate();
    setLanguageState(lang);
    applyLanguageEffects(lang);
    if (wasTranslatedDom && typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  useEffect(() => {
    clearGoogleTranslateCookies();
    applyLanguageEffects(language);
  }, [language, applyLanguageEffects]);

  // Dynamic Google Translate trigger for 130+ languages (single persistent root mount)
  const triggerGoogleTranslate = useCallback((targetLang?: string) => {
    if (typeof window === 'undefined') return;
    setShowGoogleTranslateBar(true);

    const initWidget = () => {
      const el = document.getElementById('google_translate_element');
      if (el && el.childElementCount === 0 && (window as any).google?.translate?.TranslateElement) {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: language,
            layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: true,
          },
          'google_translate_element'
        );
      }
    };

    const existingScript = document.getElementById('google-translate-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.type = 'text/javascript';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      (window as any).googleTranslateElementInit = () => {
        initWidget();
      };
      document.body.appendChild(script);
    } else {
      initWidget();
    }

    if (targetLang) {
      document.cookie = `googtrans=/auto/${targetLang}; path=/;`;
      document.cookie = `googtrans=/auto/${targetLang}; domain=.${window.location.hostname}; path=/;`;
      const combo = document.querySelector<HTMLSelectElement>('.goog-te-combo');
      if (combo) {
        combo.value = targetLang;
        combo.dispatchEvent(new Event('change'));
      }
    }
  }, [language]);

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
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isRtl,
        locale,
        isUniversalTranslateOpen: showGoogleTranslateBar,
        triggerGoogleTranslate,
        resetGoogleTranslate,
      }}
    >
      {children}
      {/* Single persistent Google Translate root mount so popovers closing never unmount the widget */}
      <div
        id="google-translate-floating-bar"
        className={
          showGoogleTranslateBar
            ? 'fixed bottom-20 lg:bottom-5 right-4 z-[65] bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 rounded-2xl shadow-2xl p-3 flex items-center gap-3 max-w-[92vw]'
            : 'hidden'
        }
      >
        <div id="google_translate_element" className="min-w-[160px]" />
        <button
          type="button"
          onClick={resetGoogleTranslate}
          className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer shrink-0"
          aria-label="Close"
        >
          ✕
        </button>
      </div>
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
