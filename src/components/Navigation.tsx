import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  Sparkles,
  TrendingDown,
  Droplets,
  Utensils,
  Award,
  User,
  Crown,
  Flame,
  Sun,
  Moon,
  Timer,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { TabType, UserProfile } from '../types.ts';
import { PWAInstallButton } from './PWAInstallButton.tsx';
import { LanguageSelector } from './LanguageSelector.tsx';
import { useLanguage } from '../i18n/LanguageContext.tsx';

interface NavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  user: UserProfile;
  onOpenPremium: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  streakDays: number;
  onTriggerVoiceCoach?: () => void;
  isVoiceSpeaking?: boolean;
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
  onTriggerVoiceCoach,
  isVoiceSpeaking,
  onOpenShare,
}) => {
  const { t } = useLanguage();

  const tabs = [
    { id: 'dashboard' as TabType, label: t('navDashboard'), icon: LayoutDashboard },
    { id: 'journal' as TabType, label: t('navJournal'), icon: BookOpen },
    { id: 'aicoach' as TabType, label: t('navAiCoach'), icon: Sparkles, badge: 'IA' },
    { id: 'progress' as TabType, label: t('navProgress'), icon: TrendingDown },
    { id: 'hydration' as TabType, label: t('navHydration'), icon: Droplets },
    { id: 'recipes' as TabType, label: t('navRecipes'), icon: Utensils },
    { id: 'badges' as TabType, label: t('navBadges'), icon: Award },
    { id: 'profile' as TabType, label: t('navProfile'), icon: User },
  ];

  return (
    <header
      id="nutricoach-header"
      className={`${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-100 text-slate-800'
      } border-b sticky top-0 z-40 shadow-xs transition-colors duration-200`}
    >
      {/* Top Banner with real-time trial countdown */}
      <div
        id="top-notification-banner"
        className="bg-gradient-to-r from-[#065F46] via-[#10B981] to-[#F59E0B] text-white text-xs px-4 py-1.5 flex items-center justify-between font-medium"
      >
        <div className="flex items-center gap-2">
          <span className="bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
            <Timer className="w-3 h-3" />
            {t('freeTrialBanner')}
          </span>
          <span className="hidden sm:inline">
            {t('freeTrialNotice', { days: user.trialDaysRemaining })}
          </span>
          <span className="sm:hidden font-bold flex items-center gap-1">
            <span>⏳ {user.trialDaysRemaining}j restants</span>
            <span className="opacity-80 text-[10px]">• 0 € aujourd'hui</span>
          </span>
        </div>
        <button
          id="btn-banner-premium"
          onClick={onOpenPremium}
          className="flex items-center gap-1.5 bg-white text-[#065F46] px-3 py-0.5 rounded-full font-bold hover:bg-emerald-50 transition-all text-xs shadow-xs cursor-pointer"
        >
          <Crown className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
          {t('btnPremium')}
        </button>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Streak */}
          <div className="flex items-center gap-3">
            <div
              id="brand-logo-btn"
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-xl flex items-center justify-center text-white text-base font-black shadow-md shadow-emerald-500/30 group-hover:scale-105 transition-transform tracking-tight">
                NC
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#065F46] dark:text-emerald-400 leading-none flex items-center gap-1.5">
                  <span>NutriCoach</span>
                  <span className="text-amber-500 text-xs font-black uppercase tracking-wider bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 px-1.5 py-0.5 rounded-md">
                    Minceur
                  </span>
                </h1>
                <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                  {t('brandSubtitle')}
                </span>
              </div>
            </div>

            {/* Streak Counter */}
            <div
              id="streak-indicator"
              className="hidden md:flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-full text-[#F59E0B] font-extrabold text-xs ml-3"
            >
              <Flame className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B] animate-pulse" />
              <span>{t('streakDays', { days: streakDays })}</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav id="desktop-nav" className="hidden lg:flex items-center space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all relative cursor-pointer ${
                    isActive
                      ? isDarkMode
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : 'bg-emerald-50 text-emerald-700 font-bold border border-emerald-200'
                      : isDarkMode
                      ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? (isDarkMode ? 'text-white' : 'text-emerald-600') : 'text-slate-400'
                    }`}
                  />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-extrabold uppercase animate-bounce">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Coach Voice, Language Selector, PWA Install, Dark Mode & Profile */}
          <div className="flex items-center gap-2">
            {onTriggerVoiceCoach && (
              <button
                id="btn-nav-coach-voice"
                type="button"
                onClick={onTriggerVoiceCoach}
                className={`p-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 font-bold text-xs ${
                  isVoiceSpeaking
                    ? 'bg-amber-500 text-white animate-pulse shadow-md shadow-amber-500/30'
                    : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800'
                }`}
                title="Écouter le Coach Vocal : Que vas-tu manger aujourd'hui ?"
              >
                {isVoiceSpeaking ? (
                  <>
                    <VolumeX className="w-4 h-4 text-white" />
                    <span className="hidden sm:inline">Arrêter</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="hidden sm:inline">Voix Coach</span>
                  </>
                )}
              </button>
            )}

            <LanguageSelector />

            <PWAInstallButton />

            <button
              id="theme-toggle-btn"
              onClick={toggleDarkMode}
              className={`p-2 rounded-xl transition-colors cursor-pointer ${
                isDarkMode
                  ? 'bg-slate-800 text-amber-400 hover:bg-slate-700'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
              title={isDarkMode ? 'Mode clair' : 'Mode sombre'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {user.name && user.isLoggedIn && (
              <button
                id="user-profile-nav-btn"
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-2 p-1.5 pl-2.5 rounded-xl border transition-all cursor-pointer ${
                  isDarkMode
                    ? 'border-slate-800 bg-slate-800 hover:bg-slate-700 text-white'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                  {user.name.charAt(0)}
                </div>
                <span className="text-xs font-semibold hidden sm:inline">{user.name}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Horizontal Navigation */}
      <div
        id="mobile-nav-bar"
        className={`lg:hidden border-t ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } px-2 py-1.5 overflow-x-auto scrollbar-none flex items-center justify-between gap-1`}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`mobile-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[62px] py-1 px-1.5 rounded-lg text-[10px] font-medium transition-all cursor-pointer shrink-0 ${
                isActive
                  ? 'text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              <Icon
                className={`w-4 h-4 mb-0.5 ${
                  isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                }`}
              />
              <span className="truncate max-w-[64px]">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
