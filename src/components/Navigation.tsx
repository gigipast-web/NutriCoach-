import React, { useState, useEffect, useRef } from 'react';
import {
  Home,
  Utensils,
  BarChart2,
  Droplets,
  Award,
  User,
  Crown,
  Flame,
  Sun,
  Moon,
  Timer,
  Bell,
  ChefHat,
} from 'lucide-react';
import { TabType, UserProfile } from '../types.ts';
import { PWAInstallButton } from './PWAInstallButton.tsx';
import { LanguageSelector } from './LanguageSelector.tsx';
import { RobotCoachMascot } from './RobotCoachMascot.tsx';
import { useLanguage } from '../i18n/LanguageContext.tsx';

interface NavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  user: UserProfile;
  onOpenPremium: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  streakDays: number;
  onOpenShare?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  user,
  onOpenPremium,
  isDarkMode,
  toggleDarkMode,
  streakDays,
  onOpenShare,
}) => {
  const { t, language } = useLanguage();
  const [showBellNotice, setShowBellNotice] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showBellNotice) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setShowBellNotice(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowBellNotice(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showBellNotice]);

  // Primary navigation tabs visible on both Desktop and Mobile bottom bar
  const mainTabs = [
    { id: 'dashboard' as TabType, label: t('navDashboard'), mobileLabel: t('navDashboard'), icon: Home },
    { id: 'journal' as TabType, label: t('navJournal'), mobileLabel: t('navJournal'), icon: Utensils },
    { id: 'recipes' as TabType, label: t('navRecipes'), mobileLabel: t('navRecipes'), icon: ChefHat },
    { id: 'progress' as TabType, label: t('navProgress'), mobileLabel: t('navProgress'), icon: BarChart2 },
    { id: 'hydration' as TabType, label: t('navHydration'), mobileLabel: t('navHydration'), icon: Droplets },
    { id: 'aicoach' as TabType, label: t('navAiCoach'), mobileLabel: t('navAiCoach'), isRobot: true },
  ];

  // Secondary desktop tabs for full feature access
  const secondaryTabs = [
    { id: 'badges' as TabType, label: t('navBadges'), icon: Award },
    { id: 'profile' as TabType, label: t('navProfile'), icon: User },
  ];

  return (
    <>
      <header
        id="nutricoach-header"
        className={`${
          isDarkMode
            ? 'bg-slate-900 border-slate-800 text-white'
            : 'bg-white border-[#E2ECE2] text-[#163321]'
        } safe-area-top border-b sticky top-0 z-40 shadow-xs transition-colors duration-200 select-none`}
      >
        {/* Top Banner with real-time trial countdown or expiration notice */}
        {(() => {
          const isTrialExpired = !user.isPremium && user.trialDaysRemaining <= 0;
          return (
            <div
              id="top-notification-banner"
              className={`${
                isTrialExpired
                  ? 'bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500'
                  : 'bg-gradient-to-r from-[#1F6F43] via-[#2A8F57] to-[#F59E0B]'
              } text-white text-xs px-4 py-1.5 flex items-center justify-between font-medium gap-2`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] flex items-center gap-1 shrink-0">
                  <Timer className="w-3 h-3" />
                  {user.isPremium
                    ? 'Premium Actif'
                    : isTrialExpired
                    ? 'Essai terminé'
                    : t('freeTrialBanner')}
                </span>
                {user.isPremium ? (
                  <span className="truncate font-semibold">
                    Accès complet illimité activé
                  </span>
                ) : isTrialExpired ? (
                  <>
                    <span className="hidden sm:inline font-bold">
                      Période d'essai terminée (0 jour restant) — Abonnez-vous pour continuer
                    </span>
                    <span className="sm:hidden font-bold truncate">
                      🔒 0j restant • Paiement requis
                    </span>
                  </>
                ) : (
                  <>
                    <span className="hidden sm:inline">
                      {t('freeTrialNotice', { days: user.trialDaysRemaining })}
                    </span>
                    <span className="sm:hidden font-bold flex items-center gap-1">
                      <span>⏳ {user.trialDaysRemaining}j restants</span>
                      <span className="opacity-80 text-[10px]">• 0 € aujourd'hui</span>
                    </span>
                  </>
                )}
              </div>
              <button
                id="btn-banner-premium"
                onClick={onOpenPremium}
                className={`flex items-center gap-1.5 bg-white ${
                  isTrialExpired ? 'text-rose-700 hover:bg-rose-50' : 'text-[#1F6F43] hover:bg-emerald-50'
                } px-3 py-0.5 rounded-full font-black transition-all text-xs shadow-xs cursor-pointer shrink-0`}
              >
                <Crown className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                {isTrialExpired ? 'Payer 4,99 €/mois' : user.isPremium ? 'Gérer' : t('btnPremium')}
              </button>
            </div>
          );
        })()}

        {/* Main Header Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Brand Title: "NutriCoach" */}
            <div className="flex items-center gap-3">
              <div
                id="brand-logo-btn"
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center cursor-pointer group select-none"
              >
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#163321] dark:text-emerald-300 leading-none group-hover:opacity-85 transition-opacity">
                  NutriCoach
                </h1>
              </div>

              {/* Streak Pill */}
              <div
                id="streak-indicator"
                className="hidden md:flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full text-[#F59E0B] font-extrabold text-xs ml-2"
              >
                <Flame className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B] animate-pulse" />
                <span>{streakDays} j</span>
              </div>
            </div>

            {/* Desktop Navigation (Main 6 tabs + Secondary) */}
            <nav id="desktop-nav" className="hidden lg:flex items-center gap-0.5 xl:gap-1 flex-wrap justify-center">
              {mainTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`nav-tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-full text-[11px] xl:text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#1F6F43] text-white shadow-xs'
                        : isDarkMode
                        ? 'text-slate-300 hover:bg-slate-800'
                        : 'text-black hover:bg-[#EDF3ED]'
                    }`}
                  >
                    {tab.isRobot ? (
                      <RobotCoachMascot size={17} waving={false} />
                    ) : (
                      Icon && <Icon className="w-3.5 h-3.5 xl:w-4 xl:h-4 shrink-0" />
                    )}
                    <span>{tab.label}</span>
                  </button>
                );
              })}

              <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-0.5" />

              {secondaryTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`nav-tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-[11px] xl:text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-[#1F6F43] text-white shadow-xs'
                        : isDarkMode
                        ? 'text-slate-400 hover:text-white'
                        : 'text-black hover:text-[#1F6F43]'
                    }`}
                  >
                    {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Right Actions: Daily Tip Bell, Language, Install, Dark Mode & Profile */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <div className="relative" ref={bellRef}>
                <button
                  type="button"
                  id="btn-nav-notification-bell"
                  onClick={() => setShowBellNotice((prev) => !prev)}
                  className="w-9 h-9 rounded-full bg-[#F4F7F4] dark:bg-slate-800 border border-[#DCE8DC] dark:border-slate-700 flex items-center justify-center text-[#163321] dark:text-emerald-300 hover:bg-[#EAF3EA] transition-all cursor-pointer shadow-xs relative"
                  title={language === 'en' ? 'Daily tip' : 'Conseil du jour'}
                  aria-expanded={showBellNotice}
                >
                  <Bell className="w-4 h-4" />
                </button>

                {showBellNotice && (
                  <div className="absolute right-0 mt-2 w-72 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#E2ECE2] dark:border-slate-800 shadow-xl z-50 text-xs space-y-2 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between pb-2 border-b border-[#EDF3ED] dark:border-slate-800">
                      <span className="font-black text-[#163321] dark:text-white">
                        {language === 'en' ? 'Daily tip' : 'Conseil du jour'}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowBellNotice(false)}
                        className="text-[11px] text-[#1F6F43] dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                      >
                        {language === 'en' ? 'Close' : 'Fermer'}
                      </button>
                    </div>
                    <p className="text-[#5A7363] dark:text-slate-300 font-semibold leading-relaxed">
                      {language === 'en'
                        ? '💧 Drink a glass of water 15 minutes before lunch to aid digestion and satiety.'
                        : '💧 Buvez un verre d’eau 15 min avant le déjeuner pour faciliter la digestion et la satiété.'}
                    </p>
                  </div>
                )}
              </div>

              <LanguageSelector />
              <PWAInstallButton />

              {/* Dark mode toggle */}
              <button
                id="theme-toggle-btn"
                onClick={toggleDarkMode}
                className={`p-2 rounded-full transition-colors cursor-pointer ${
                  isDarkMode
                    ? 'bg-slate-800 text-amber-400 hover:bg-slate-700'
                    : 'bg-[#F4F7F4] text-slate-600 hover:bg-slate-200'
                }`}
                title={isDarkMode ? 'Mode clair' : 'Mode sombre'}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* User profile avatar */}
              <button
                id="user-profile-nav-btn"
                onClick={() => setActiveTab('profile')}
                className="w-9 h-9 rounded-full bg-[#1F6F43] text-white font-black flex items-center justify-center text-xs shadow-xs cursor-pointer hover:scale-105 transition-transform"
                title={t('navProfile')}
              >
                {user.name ? user.name.charAt(0) : <User className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 6-Tab Fixed Mobile Bottom Navigation Bar (with Recettes always visible) */}
      <nav
        id="mobile-bottom-nav-bar"
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 select-none safe-area-bottom-nav ${
          isDarkMode
            ? 'bg-slate-900/95 border-slate-800 text-white'
            : 'bg-white/95 border-[#E2ECE2] text-black'
        } backdrop-blur-md border-t px-1 pt-1.5 grid grid-cols-6 gap-0.5 shadow-[0_-4px_16px_rgba(31,111,67,0.06)]`}
      >
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`mobile-nav-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`min-w-0 w-full flex flex-col items-center justify-center py-1 px-0.5 rounded-2xl text-[9.5px] sm:text-[10px] font-black transition-all cursor-pointer ${
                isActive
                  ? 'text-[#1F6F43] dark:text-emerald-400 font-black scale-[1.03]'
                  : 'text-black dark:text-slate-300 hover:text-black font-extrabold'
              }`}
            >
              <div
                className={`p-1 rounded-xl mb-0.5 transition-colors ${
                  isActive ? 'bg-[#E5EFE5] dark:bg-emerald-950/60' : ''
                }`}
              >
                {tab.isRobot ? (
                  <RobotCoachMascot size={20} waving={false} />
                ) : (
                  Icon && <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                )}
              </div>
              <span className="truncate w-full text-center leading-tight font-extrabold">
                {tab.mobileLabel || tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
