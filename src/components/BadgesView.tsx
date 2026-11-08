import React, { useState, useEffect } from 'react';
import {
  Award,
  Flame,
  Scale,
  Droplets,
  Footprints,
  Trophy,
  CheckCircle2,
  RefreshCw,
  Quote,
  Bell,
  Volume2,
  VolumeX,
  Mic,
  Sparkles,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Badge, Reminder } from '../types.ts';
import { inspirationalQuotes } from '../data/initialData.ts';
import { playMealVoiceReminder, speakText, stopSpeaking } from '../utils/voiceCoach.ts';
import {
  BlossomFlower,
  CornerFloralFlourish,
  FlowerGardenCluster,
} from './FloralDecorations.tsx';

interface BadgesViewProps {
  badges: Badge[];
  reminders: Reminder[];
  onToggleReminder: (id: string) => void;
  streakDays: number;
  userName?: string;
  isDarkMode: boolean;
}

export const BadgesView: React.FC<BadgesViewProps> = ({
  badges,
  reminders,
  onToggleReminder,
  streakDays,
  userName,
  isDarkMode,
}) => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [playingReminderId, setPlayingReminderId] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const nextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % inspirationalQuotes.length);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const renderBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Scale':
        return <Scale className="w-6 h-6 text-emerald-500" />;
      case 'Droplets':
        return <Droplets className="w-6 h-6 text-sky-500" />;
      case 'Flame':
        return <Flame className="w-6 h-6 text-amber-500" />;
      case 'Footprints':
        return <Footprints className="w-6 h-6 text-violet-500" />;
      case 'Trophy':
        return <Trophy className="w-6 h-6 text-amber-500" />;
      default:
        return <Award className="w-6 h-6 text-teal-500" />;
    }
  };

  const currentQuote = inspirationalQuotes[quoteIndex];

  return (
    <div id="badges-view" className="space-y-5 pb-20 max-w-4xl mx-auto">
      {/* 1. Header Bar with title "Mes réussites", Share & Blossom (Screen 5) */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-[#DCE8DC] dark:border-slate-700 flex items-center justify-center text-[#163321] dark:text-emerald-300 font-bold shadow-xs">
            ‹
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#163321] dark:text-white tracking-tight">
              Mes réussites
            </h1>
            <BlossomFlower size={22} palette="golden" />
          </div>
        </div>

        <button
          type="button"
          onClick={triggerConfetti}
          className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-[#DCE8DC] dark:border-slate-700 flex items-center justify-center text-[#1F6F43] dark:text-emerald-400 hover:bg-[#EAF3EA] transition-all cursor-pointer shadow-xs"
          title="Partager mes réussites & fêter"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Hero Trophy Celebration Banner (Screen 5) with Floral Accents & Radiant Ribbon */}
      <div
        id="hero-trophy-celebration-card"
        onClick={triggerConfetti}
        className="p-6 sm:p-8 rounded-[32px] bg-gradient-to-br from-white via-[#FFFDF9] to-[#FFF6EA] dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 shadow-[0_4px_24px_rgba(245,158,11,0.08)] text-center relative overflow-hidden cursor-pointer group"
      >
        <CornerFloralFlourish className="opacity-80 dark:opacity-40" />
        <CornerFloralFlourish className="opacity-80 dark:opacity-40" flip={true} />

        {/* Golden Trophy with Laurel Wreath */}
        <div className="relative inline-flex items-center justify-center mb-3">
          <svg viewBox="0 0 120 100" className="w-28 h-24 drop-shadow-md group-hover:scale-105 transition-transform duration-300">
            {/* Laurel Wreath */}
            <path
              d="M 20 65 C 10 40, 20 20, 35 15 M 100 65 C 110 40, 100 20, 85 15"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeDasharray="4 6"
            />
            {/* Leaves */}
            <circle cx="20" cy="40" r="3.5" fill="#F59E0B" />
            <circle cx="100" cy="40" r="3.5" fill="#F59E0B" />
            <circle cx="28" cy="24" r="3.5" fill="#F59E0B" />
            <circle cx="92" cy="24" r="3.5" fill="#F59E0B" />

            {/* Golden 3D Cup */}
            <path
              d="M 38 20 L 82 20 L 78 52 C 78 62, 42 62, 42 52 Z"
              fill="#F59E0B"
            />
            <path
              d="M 42 22 L 78 22 L 75 50 C 75 58, 45 58, 45 50 Z"
              fill="#FBBF24"
            />
            {/* Cup handles */}
            <path
              d="M 38 26 C 26 26, 26 44, 39 46"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M 82 26 C 94 26, 94 44, 81 46"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Cup Stem & Base */}
            <rect x="56" y="58" width="8" height="12" fill="#D97706" rx="2" />
            <path d="M 46 70 L 74 70 L 78 76 L 42 76 Z" fill="#F59E0B" />
            {/* Star badge on cup */}
            <circle cx="60" cy="38" r="7" fill="#FEF3C7" />
            <polygon points="60,33 62,37 66,37 63,40 64,44 60,41 56,44 57,40 54,37 58,37" fill="#D97706" />
          </svg>
        </div>

        {/* Radiant Sunset Ribbon Banner: Bravo Clara ! */}
        <div className="inline-block relative mb-1.5">
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white px-8 py-2 rounded-full font-black text-base sm:text-lg shadow-md tracking-wide flex items-center gap-2 justify-center">
            <span>🌸</span>
            <span>Bravo {userName || 'Clara'} !</span>
            <span>🌸</span>
          </div>
        </div>

        {/* Subtext */}
        <p className="text-xs sm:text-sm font-extrabold text-[#78350F] dark:text-amber-300 mt-1">
          Vous avez atteint 5 objectifs ! Félicitations pour votre régularité ✨
        </p>
      </div>

      {/* 3. Hexagonal & Rounded 3D Badges Grid (Screen 5) */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {/* Badge 1: 5 jours actifs */}
        <div
          onClick={triggerConfetti}
          className="p-3 sm:p-4 rounded-[24px] bg-white dark:bg-slate-900 border border-[#E2ECE2] dark:border-slate-800 shadow-xs flex flex-col items-center text-center cursor-pointer hover:scale-105 transition-transform"
        >
          <div className="w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center mb-2 relative">
            {/* Hexagon SVG background in Green */}
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs">
              <polygon
                points="50 5, 90 27, 90 73, 50 95, 10 73, 10 27"
                fill="#22C55E"
              />
              <polygon
                points="50 10, 85 30, 85 70, 50 90, 15 70, 15 30"
                fill="#4ADE80"
              />
            </svg>
            <span className="absolute text-2xl select-none">👟</span>
          </div>
          <span className="text-xs font-black text-[#163321] dark:text-white leading-tight">
            5 jours
          </span>
          <span className="text-[10px] font-bold text-[#5A7363] dark:text-slate-400 mt-0.5">
            actifs
          </span>
        </div>

        {/* Badge 2: 2 L d'eau/jour */}
        <div
          onClick={triggerConfetti}
          className="p-3 sm:p-4 rounded-[24px] bg-white dark:bg-slate-900 border border-[#E2ECE2] dark:border-slate-800 shadow-xs flex flex-col items-center text-center cursor-pointer hover:scale-105 transition-transform"
        >
          <div className="w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center mb-2 relative">
            {/* Hexagon SVG background in Blue */}
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs">
              <polygon
                points="50 5, 90 27, 90 73, 50 95, 10 73, 10 27"
                fill="#0284C7"
              />
              <polygon
                points="50 10, 85 30, 85 70, 50 90, 15 70, 15 30"
                fill="#38BDF8"
              />
            </svg>
            <span className="absolute text-2xl select-none">💧</span>
          </div>
          <span className="text-xs font-black text-[#163321] dark:text-white leading-tight">
            2 L
          </span>
          <span className="text-[10px] font-bold text-[#5A7363] dark:text-slate-400 mt-0.5">
            d'eau/jour
          </span>
        </div>

        {/* Badge 3: Menu équilibré */}
        <div
          onClick={triggerConfetti}
          className="p-3 sm:p-4 rounded-[24px] bg-white dark:bg-slate-900 border border-[#E2ECE2] dark:border-slate-800 shadow-xs flex flex-col items-center text-center cursor-pointer hover:scale-105 transition-transform"
        >
          <div className="w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center mb-2 relative">
            {/* Hexagon SVG background in Red/Amber */}
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xs">
              <polygon
                points="50 5, 90 27, 90 73, 50 95, 10 73, 10 27"
                fill="#EA580C"
              />
              <polygon
                points="50 10, 85 30, 85 70, 50 90, 15 70, 15 30"
                fill="#FB923C"
              />
            </svg>
            <span className="absolute text-2xl select-none">🍎</span>
          </div>
          <span className="text-xs font-black text-[#163321] dark:text-white leading-tight">
            Menu
          </span>
          <span className="text-[10px] font-bold text-[#5A7363] dark:text-slate-400 mt-0.5">
            équilibré
          </span>
        </div>

        {/* Badge 4: - 2 kg */}
        <div
          onClick={triggerConfetti}
          className="p-3 sm:p-4 rounded-[24px] bg-white dark:bg-slate-900 border border-[#E2ECE2] dark:border-slate-800 shadow-xs flex flex-col items-center text-center cursor-pointer hover:scale-105 transition-transform"
        >
          <div className="w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center mb-2 relative">
            {/* Golden Star Circle */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-xs">
              <span className="text-white text-2xl">★</span>
            </div>
          </div>
          <span className="text-xs font-black text-[#163321] dark:text-white leading-tight">
            - 2 kg
          </span>
          <span className="text-[10px] font-bold text-[#5A7363] dark:text-slate-400 mt-0.5">
            atteints
          </span>
        </div>

        {/* Badge 5: 1 semaine au top */}
        <div
          onClick={triggerConfetti}
          className="p-3 sm:p-4 rounded-[24px] bg-white dark:bg-slate-900 border border-[#E2ECE2] dark:border-slate-800 shadow-xs flex flex-col items-center text-center cursor-pointer hover:scale-105 transition-transform"
        >
          <div className="w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center mb-2 relative">
            {/* Orange rounded square calendar */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-400 flex items-center justify-center shadow-xs">
              <span className="text-white text-2xl">📅</span>
            </div>
          </div>
          <span className="text-xs font-black text-[#163321] dark:text-white leading-tight">
            1 semaine
          </span>
          <span className="text-[10px] font-bold text-[#5A7363] dark:text-slate-400 mt-0.5">
            au top
          </span>
        </div>

        {/* Badge 6: Sérénité */}
        <div
          onClick={triggerConfetti}
          className="p-3 sm:p-4 rounded-[24px] bg-white dark:bg-slate-900 border border-[#E2ECE2] dark:border-slate-800 shadow-xs flex flex-col items-center text-center cursor-pointer hover:scale-105 transition-transform"
        >
          <div className="w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center mb-2 relative">
            {/* Violet Lotus Circle */}
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-500 to-pink-400 flex items-center justify-center shadow-xs">
              <span className="text-white text-2xl">🪷</span>
            </div>
          </div>
          <span className="text-xs font-black text-[#163321] dark:text-white leading-tight">
            Sérénité
          </span>
          <span className="text-[10px] font-bold text-[#5A7363] dark:text-slate-400 mt-0.5">
            zen & équilibre
          </span>
        </div>
      </div>

      {/* 4. Encouragement Footer Banner (Screen 5) */}
      <div
        id="encouragement-heart-footer"
        className="p-4 rounded-2xl bg-[#E6EFE6] dark:bg-emerald-950/40 border border-[#D5E4D5] dark:border-emerald-800/60 flex items-center justify-center gap-2.5 shadow-xs text-center"
      >
        <span className="text-xl select-none">💚</span>
        <p className="text-xs sm:text-sm font-bold text-[#1F6F43] dark:text-emerald-300">
          Vous êtes incroyable ! Continuez à prendre soin de vous.
        </p>
      </div>

      {/* Detailed Badges Progression (Collapsible) */}
      <details className="group bg-white dark:bg-slate-900 border border-[#E2ECE2] dark:border-slate-800 rounded-[24px] p-5 text-xs">
        <summary className="font-extrabold text-[#5A7363] dark:text-slate-300 cursor-pointer select-none flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#F59E0B]" />
            <span>Consulter les {badges.length} défis et niveaux ({badges.filter((b) => b.unlocked).length} débloqués)</span>
          </span>
          <span className="text-[#1F6F43] group-open:rotate-180 transition-transform">▼</span>
        </summary>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-4 mt-3 border-t border-[#EDF3ED] dark:border-slate-800">
          {badges.map((badge) => (
            <div
              key={badge.id}
              onClick={() => badge.unlocked && triggerConfetti()}
              className={`p-4 rounded-2xl border transition-all ${
                badge.unlocked
                  ? isDarkMode
                    ? 'bg-slate-800 border-emerald-500/40 cursor-pointer'
                    : 'bg-[#F9FCF9] border-emerald-200 shadow-2xs cursor-pointer'
                  : isDarkMode
                  ? 'bg-slate-900/60 border-slate-800 opacity-60'
                  : 'bg-slate-50 border-slate-200 opacity-70'
              } flex flex-col justify-between space-y-2`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    badge.unlocked
                      ? 'bg-emerald-500/10 border border-emerald-500/20'
                      : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                >
                  {renderBadgeIcon(badge.iconName)}
                </div>
                {badge.unlocked && (
                  <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Fait
                  </span>
                )}
              </div>
              <div>
                <h4 className="font-black text-xs text-[#163321] dark:text-white leading-tight">
                  {badge.title}
                </h4>
                <p className="text-[11px] text-[#5A7363] dark:text-slate-400 mt-0.5">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </details>

      {/* Daily Reminders Section with Voice Mode */}
      <div
        className={`p-6 rounded-3xl border ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-sm space-y-4`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-base text-slate-800 dark:text-white">
              Rappels Quotidiens & Mode Vocal
            </h3>
          </div>
          <span className="text-xs text-slate-400">Restez régulier sans effort</span>
        </div>

        {/* Highlight Banner: Rappel Vocal "Que vas-tu manger aujourd'hui ?" */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-amber-500/15 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>🎙️ Rappel Vocal du Coach : « Que vas-tu manger aujourd'hui ? »</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold uppercase">
                  Actif
                </span>
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Le Coach IA vous interpelle de vive voix pour vous demander votre repas et vous aider à garder le cap sur vos calories !
              </p>
            </div>
          </div>

          <button
            id="btn-test-meal-voice-reminder"
            type="button"
            onClick={() => {
              if (playingReminderId === 'meal-demo') {
                stopSpeaking();
                setPlayingReminderId(null);
              } else {
                setPlayingReminderId('meal-demo');
                playMealVoiceReminder(userName, 'fr', {
                  onEnd: () => setPlayingReminderId(null),
                  onError: () => setPlayingReminderId(null),
                });
              }
            }}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm shrink-0 ${
              playingReminderId === 'meal-demo'
                ? 'bg-amber-600 text-white animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {playingReminderId === 'meal-demo' ? (
              <>
                <VolumeX className="w-4 h-4" />
                <span>Arrêter la voix</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>🔊 Écouter la voix du Coach</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {reminders.map((reminder) => {
            const isPlaying = playingReminderId === reminder.id;

            return (
              <div
                key={reminder.id}
                className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 ${
                  isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-bold text-sm text-slate-800 dark:text-white block">
                      {reminder.title}
                    </span>
                    <span className="text-xs text-slate-400 block mt-0.5">{reminder.subtitle}</span>
                    <span className="text-[11px] font-extrabold text-emerald-600 block mt-1">
                      Tous les jours à {reminder.time}
                    </span>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      id={`reminder-toggle-${reminder.id}`}
                      type="checkbox"
                      checked={reminder.enabled}
                      onChange={() => onToggleReminder(reminder.id)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {/* Voice button for each reminder */}
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Synthèse vocale IA</span>
                  </span>

                  <button
                    type="button"
                    id={`btn-voice-test-${reminder.id}`}
                    onClick={() => {
                      if (isPlaying) {
                        stopSpeaking();
                        setPlayingReminderId(null);
                      } else {
                        setPlayingReminderId(reminder.id);
                        if (reminder.type === 'repas') {
                          playMealVoiceReminder(userName, 'fr', {
                            onEnd: () => setPlayingReminderId(null),
                            onError: () => setPlayingReminderId(null),
                          });
                        } else {
                          const msg = `Bonjour ${userName || ''} ! C'est votre rappel NutriCoach : ${reminder.title}. ${reminder.subtitle}.`;
                          speakText(msg, {
                            language: 'fr-FR',
                            onEnd: () => setPlayingReminderId(null),
                            onError: () => setPlayingReminderId(null),
                          });
                        }
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isPlaying
                        ? 'bg-amber-500 text-white animate-pulse'
                        : 'bg-emerald-100/70 hover:bg-emerald-200 dark:bg-emerald-950/70 dark:hover:bg-emerald-900 text-emerald-800 dark:text-emerald-200'
                    }`}
                  >
                    {isPlaying ? (
                      <>
                        <VolumeX className="w-3.5 h-3.5" />
                        <span>Arrêter</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Tester la voix</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
