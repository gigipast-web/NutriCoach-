import React from 'react';
import { Sparkles, Heart, Shield, FileText, Trash2, Crown, Smartphone } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext.tsx';

interface FooterProps {
  isDarkMode: boolean;
  onOpenPremium?: () => void;
  onNavigateTab?: (tab: 'dashboard' | 'journal' | 'aicoach' | 'progress' | 'hydration' | 'recipes' | 'badges' | 'profile') => void;
}

export const Footer: React.FC<FooterProps> = ({
  isDarkMode,
  onOpenPremium,
  onNavigateTab,
}) => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="app-footer"
      role="contentinfo"
      className={`mt-16 border-t transition-colors duration-200 ${
        isDarkMode
          ? 'bg-slate-900/90 border-slate-800 text-slate-300'
          : 'bg-white/90 border-slate-200 text-slate-600'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Main Creator Brand Attribution */}
          <div
            id="footer-creator-credit"
            className={`inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-6 py-3.5 rounded-2xl border shadow-xs transition-all ${
              isDarkMode
                ? 'bg-slate-800/80 border-slate-700/80 text-slate-100 hover:border-emerald-500/50'
                : 'bg-gradient-to-r from-emerald-50 via-teal-50 to-slate-50 border-emerald-200/80 text-slate-900 hover:border-emerald-400'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-xs text-sm font-black">
                ✨
              </span>
              <span className="text-xs uppercase font-semibold tracking-wider text-emerald-600 dark:text-emerald-400">
                {t('footerOfficialApp')}
              </span>
            </div>
            <div className="h-4 w-px bg-slate-300 dark:bg-slate-700 hidden sm:block" />
            <p className="text-base sm:text-lg font-black tracking-tight">
              {t('footerCreationOf')}{' '}
              <span className="text-emerald-600 dark:text-emerald-400 underline decoration-emerald-400 decoration-2 underline-offset-4 font-black uppercase">
                L'ESCAPADE DE JOS
              </span>
            </p>
          </div>

          {/* Subtitle / Description */}
          <div className="max-w-xl space-y-1">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {t('footerSubtitle')}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('footerDescription')}
            </p>
          </div>

          {/* Useful Quick Links */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap text-xs font-semibold">
            {onNavigateTab && (
              <button
                type="button"
                onClick={() => onNavigateTab('dashboard')}
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
              >
                {t('navDashboard')}
              </button>
            )}
            {onNavigateTab && (
              <button
                type="button"
                onClick={() => onNavigateTab('recipes')}
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
              >
                {t('navRecipes')}
              </button>
            )}
            {onNavigateTab && (
              <button
                type="button"
                onClick={() => onNavigateTab('aicoach')}
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                {t('navAiCoach')}
              </button>
            )}
            {onOpenPremium && (
              <button
                type="button"
                onClick={onOpenPremium}
                className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Crown className="w-3.5 h-3.5 text-amber-500" />
                {t('footerSubscription')}
              </button>
            )}
            <a
              id="footer-link-privacy"
              href="/privacy.html"
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5" />
              {t('footerPrivacy')}
            </a>
            <a
              id="footer-link-tester"
              href="/tester.html"
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              {t('footerTester')}
            </a>
            <a
              id="footer-link-play-testing"
              href="https://play.google.com/apps/testing/com.nutricoach.nutrition.coach"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold transition-colors flex items-center gap-1"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Test Google Play</span>
            </a>
            <a
              id="footer-link-delete-account"
              href="/delete-account.html"
              target="_blank"
              rel="noreferrer"
              className="text-rose-500 hover:text-rose-600 dark:text-rose-400 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {t('footerDeleteAccount')}
            </a>
          </div>

          {/* Copyright & Disclaimer */}
          <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/80 w-full flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 gap-2">
            <p className="flex items-center gap-1">
              © {currentYear} NutriCoach — {t('footerCreationOf')}{' '}
              <strong className="text-slate-700 dark:text-slate-200 font-bold">
                L'ESCAPADE DE JOS
              </strong>
              . {t('footerCopyright').split('.').pop()?.trim() || 'Tous droits réservés.'}
            </p>
            <p className="flex items-center gap-1.5">
              <span>NutriCoach Global</span>
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
