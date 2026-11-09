import React, { useState } from 'react';
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
  Volume2,
  VolumeX,
  Bell,
  Sparkles,
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
  const [showBellNotice, setShowBellNotice] = useState(false);

  // The 5 canonical tabs from the mockup (Screens 1 to 6)
  const mainTabs = [
    { id: 'dashboard' as TabType, label: 'Accueil', icon: Home },
    { id: 'journal' as TabType, label: 'Alimentation', icon: Utensils },
    { id: 'progress' as TabType, label: 'Mon évolution', icon: BarChart2 },
    { id: 'hydration' as TabType, label: 'Hydratation', icon: Droplets },
    { id: 'aicoach' as TabType, label: 'Mon coach', isRobot: true },
  ];

  // Secondary desktop tabs for full feature access
  const secondaryTabs = [
    { id: 'recipes' as TabType, label: t('navRecipes'), icon: Utensils },
    { id: 'badges' as TabType, label: 'Réussites', icon: Award },
    { id: 'profile' as TabType, label: 'Profil', icon: User },
  ];

  return (
    <>
      <header
        id="nutricoach-header"
        className={`${
          isDarkMode
            ? 'bg-slate-900 border-slate-800 text-white'
            : 'bg-white border-[#E2ECE2] text-[#163321]'
        } border-b sticky top-0 z-40 shadow-xs transition-colors duration-200`}
      >
        {/* Top Banner with real-time trial countdown */}
        <div
          id="top-notification-banner"
          className="bg-gradient-to-r from-[#1F6F43] via-[#2A8F57] to-[#F59E0B] text-white text-xs px-4 py-1.5 flex items-center justify-between font-medium"
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
            className="flex items-center gap-1.5 bg-white text-[#1F6F43] px-3 py-0.5 rounded-full font-black hover:bg-emerald-50 transition-all text-xs shadow-xs cursor-pointer"
          >
            <Crown className="w-3.5 h-3.5 text-[#F59E0B] fill-[#F59E0B]" />
            {t('btnPremium')}
          </button>
        </div>

        {/* Main Header Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Mockup Logo: Two fresh organic leaves + "NutriCoach" */}
            <div className="flex items-center gap-3">
              <div
                id="brand-logo-btn"
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-2.5 cursor-pointer group select-none"
              >
                {/* Organic Leaf Logo SVG from mockup */}
                <div className="w-9 h-9 flex items-center justify-center text-[#1F6F43] group-hover:scale-105 transition-transform">
                  <svg viewBox="0 0 40 40" className="w-full h-full fill-[#1F6F43]">
                    {/* Big Leaf */}
                    <path d="M12 28 C 12 16, 22 10, 32 8 C 30 18, 24 28, 12 28 Z" />
                    {/* Small Leaf */}
                    <path d="M14 28 C 16 22, 22 20, 26 18 C 24 24, 20 28, 14 28 Z" fill="#4ADE80" opacity="0.9" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#163321] dark:text-emerald-300 leading-none">
                    NutriCoach
                  </h1>
                </div>
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

            {/* Desktop Navigation (Main 5 tabs + Secondary) */}
            <nav id="desktop-nav" className="hidden lg:flex items-center space-x-1">
              {mainTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`nav-tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-black transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#1F6F43] text-white shadow-xs'
                        : isDarkMode
                        ? 'text-slate-300 hover:bg-slate-800'
                        : 'text-black hover:bg-[#EDF3ED]'
                    }`}
                  >
                    {tab.isRobot ? (
                      <RobotCoachMascot size={18} waving={false} />
                    ) : (
                      Icon && <Icon className="w-4 h-4" />
                    )}
                    <span>{tab.label}</span>
                  </button>
                );
              })}

              <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1" />

              {secondaryTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#1F6F43] text-white shadow-xs'
                        : isDarkMode
                        ? 'text-slate-400 hover:text-white'
                        : 'text-black hover:text-[#1F6F43]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            {/* Right Actions: Notification Bell (Mockup Screen 1), Voice Coach, Dark Mode & User Profile */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Notification Bell Button (Screen 1 in mockup) */}
              <div className="relative">
                <button
                  type="button"
                  id="btn-nav-notification-bell"
                  onClick={() => setShowBellNotice((prev) => !prev)}
                  className="w-9 h-9 rounded-full bg-[#F4F7F4] dark:bg-slate-800 border border-[#DCE8DC] dark:border-slate-700 flex items-center justify-center text-[#163321] dark:text-emerald-300 hover:bg-[#EAF3EA] transition-all cursor-pointer shadow-xs relative"
                  title="Notifications & conseils"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#1F6F43] animate-ping" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#1F6F43]" />
                </button>

                {showBellNotice && (
                  <div className="absolute right-0 mt-2 w-72 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-[#E2ECE2] dark:border-slate-800 shadow-xl z-50 text-xs space-y-2 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center justify-between pb-2 border-b border-[#EDF3ED] dark:border-slate-800">
                      <span className="font-black text-[#163321] dark:text-white">
                        Conseil du jour
                      </span>
                      <span className="text-[10px] text-[#1F6F43] font-bold">Aujourd'hui</span>
                    </div>
                    <p className="text-[#5A7363] dark:text-slate-300 font-semibold leading-relaxed">
                      💧 Pensez à boire votre verre d'eau avant le déjeuner pour stimuler votre digestion !
                    </p>
                  </div>
                )}
              </div>

              {/* Voice Coach Button */}
              {onTriggerVoiceCoach && (
                <button
                  id="btn-nav-coach-voice"
                  type="button"
                  onClick={onTriggerVoiceCoach}
                  className={`p-2 rounded-full transition-all cursor-pointer flex items-center gap-1 font-black text-xs ${
                    isVoiceSpeaking
                      ? 'bg-amber-500 text-white animate-pulse shadow-md shadow-amber-500/30'
                      : 'bg-[#EDF3ED] dark:bg-slate-800 text-[#1F6F43] dark:text-emerald-300 hover:bg-[#DFEADF]'
                  }`}
                  title="Écouter le Coach Vocal"
                >
                  {isVoiceSpeaking ? (
                    <VolumeX className="w-4 h-4 text-white" />
                  ) : (
                    <Volume2 className="w-4 h-4 text-[#1F6F43] dark:text-emerald-400" />
                  )}
                </button>
              )}

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
              {user.name && (
                <button
                  id="user-profile-nav-btn"
                  onClick={() => setActiveTab('profile')}
                  className="w-9 h-9 rounded-full bg-[#1F6F43] text-white font-black flex items-center justify-center text-xs shadow-xs cursor-pointer hover:scale-105 transition-transform"
                  title="Voir mon profil"
                >
                  {user.name.charAt(0)}
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 5-Tab Fixed Mobile Bottom Navigation Bar (Matching Screens 1 through 6) */}
      <nav
        id="mobile-bottom-nav-bar"
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-40 ${
          isDarkMode
            ? 'bg-slate-900/95 border-slate-800 text-white'
            : 'bg-white/95 border-[#E2ECE2] text-black'
        } backdrop-blur-md border-t px-2 py-2 flex items-center justify-around shadow-[0_-4px_16px_rgba(31,111,67,0.06)]`}
      >
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`mobile-nav-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl text-[10px] font-black transition-all cursor-pointer ${
                isActive
                  ? 'text-[#1F6F43] dark:text-emerald-400 font-black scale-105'
                  : 'text-black dark:text-slate-300 hover:text-black font-extrabold'
              }`}
            >
              <div
                className={`p-1 rounded-xl mb-0.5 transition-colors ${
                  isActive ? 'bg-[#E5EFE5] dark:bg-emerald-950/60' : ''
                }`}
              >
                {tab.isRobot ? (
                  <RobotCoachMascot size={22} waving={false} />
                ) : (
                  Icon && <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                )}
              </div>
              <span className="truncate max-w-[68px] leading-tight font-extrabold">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
