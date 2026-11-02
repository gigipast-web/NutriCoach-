import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext.tsx';
import { LANGUAGES, POPULAR_LANGUAGE_CODES, Language } from '../i18n/translations.ts';
import { Globe, Check, Search, Sparkles, ChevronDown, X } from 'lucide-react';

interface LanguageSelectorProps {
  variant?: 'compact' | 'full' | 'dropdown';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const { language, setLanguage, t, triggerGoogleTranslate } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showGoogleTranslate, setShowGoogleTranslate] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const currentOption = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Auto-focus search input
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Filter languages by search query
  const filteredLanguages = LANGUAGES.filter(
    (l) =>
      l.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.native.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const popularLanguages = LANGUAGES.filter((l) => POPULAR_LANGUAGE_CODES.includes(l.code));

  const handleSelectLanguage = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleActivateUniversalTranslate = () => {
    setShowGoogleTranslate(true);
    triggerGoogleTranslate();
  };

  // -------------------------------------------------------------
  // Full Variant (Used in Profile View)
  // -------------------------------------------------------------
  if (variant === 'full') {
    return (
      <div className={`flex flex-col gap-3 w-full sm:w-auto ${className}`}>
        <div className="flex items-center flex-wrap gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          {popularLanguages.slice(0, 6).map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang.code)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
                }`}
                title={lang.native}
              >
                <span>{lang.flag}</span>
                <span>{lang.code.toUpperCase()}</span>
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-700/80 transition-all cursor-pointer border border-dashed border-emerald-300 dark:border-emerald-600"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>+ {LANGUAGES.length - 6} autres</span>
          </button>
        </div>

        {/* Modal / Dialog when clicking "+ others" in full variant */}
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div
              ref={dropdownRef}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-800 dark:text-white leading-tight">
                      {t('langTitle')}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {LANGUAGES.length} {t('langAll').toLowerCase()}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('langSearchPlaceholder')}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>

              {/* Language Grid */}
              <div className="p-4 overflow-y-auto max-h-[50vh] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredLanguages.map((lang) => {
                    const isSelected = language === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleSelectLanguage(lang.code)}
                        className={`flex items-center justify-between p-3 rounded-2xl text-left transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold shadow-xs'
                            : 'bg-white dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 hover:border-emerald-300 dark:hover:border-emerald-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{lang.flag}</span>
                          <div>
                            <div className="text-sm font-extrabold">{lang.native}</div>
                            <div className="text-xs text-slate-400 font-medium">
                              {lang.label} ({lang.code.toUpperCase()})
                            </div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                      </button>
                    );
                  })}
                </div>

                {/* Universal Google Translate Widget Option */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-800/80 border border-emerald-200/70 dark:border-slate-700 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-xs font-black text-slate-800 dark:text-slate-100">
                        {t('langGoogleTranslate')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      {t('langGoogleTranslateDesc')}
                    </p>
                    <button
                      type="button"
                      onClick={handleActivateUniversalTranslate}
                      className="mt-1 self-start px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      Activer la traduction universelle
                    </button>
                    <div id="google_translate_element" className="mt-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // Compact Variant (Used in Navigation Bar & Top Headers)
  // -------------------------------------------------------------
  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        id="btn-language-selector"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-emerald-400 transition-all cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-200 shadow-2xs"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={`${t('langCurrent')}: ${currentOption.native}`}
      >
        <span className="text-base leading-none">{currentOption.flag}</span>
        <span className="uppercase text-[11px] font-black tracking-wide">{currentOption.code}</span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Search Header */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/50">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('langSearchPlaceholder')}
                className="w-full pl-9 pr-7 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Quick popular chips */}
            {!searchQuery && (
              <div className="flex items-center gap-1 mt-2.5 overflow-x-auto pb-0.5 scrollbar-none">
                {popularLanguages.slice(0, 5).map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-black shrink-0 transition-all cursor-pointer flex items-center gap-1 ${
                      language === lang.code
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200/70 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
                    }`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.code.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Languages List */}
          <div className="max-h-64 overflow-y-auto p-1.5 divide-y divide-slate-100 dark:divide-slate-800/50">
            <div className="space-y-0.5">
              {filteredLanguages.map((lang) => {
                const isSelected = language === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200 font-bold'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{lang.flag}</span>
                      <div className="leading-tight">
                        <span className="text-xs font-extrabold block">{lang.native}</span>
                        <span className="text-[10px] text-slate-400 block">
                          {lang.label} ({lang.code.toUpperCase()})
                        </span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                  </button>
                );
              })}

              {filteredLanguages.length === 0 && (
                <div className="p-4 text-center text-xs text-slate-400">
                  Aucune langue trouvée pour "{searchQuery}".
                </div>
              )}
            </div>
          </div>

          {/* Universal Google Translate Footer */}
          <div className="p-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
            <button
              type="button"
              onClick={handleActivateUniversalTranslate}
              className="w-full flex items-center justify-between p-2 rounded-xl text-[11px] font-extrabold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100/60 dark:hover:bg-slate-700/80 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>🌐 Toutes les langues (130+ langues)</span>
              </div>
              <Sparkles className="w-3 h-3 text-amber-500" />
            </button>
            <div id="google_translate_element" className="mt-1" />
          </div>
        </div>
      )}
    </div>
  );
};
