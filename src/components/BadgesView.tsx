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
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Badge, Reminder } from '../types.ts';
import { inspirationalQuotes } from '../data/initialData.ts';
import { playMealVoiceReminder, speakText, stopSpeaking } from '../utils/voiceCoach.ts';

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
    <div id="badges-view" className="space-y-6 pb-12">
      {/* Header Bar */}
      <div
        className={`p-6 rounded-3xl border ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4`}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-3 py-1 rounded-full text-xs font-bold">
              Motivation & Récompenses
            </span>
            <span className="text-xs text-slate-400">Gamification</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">Badges & Défis</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Débloquez des réussites à chaque étape de votre rééquilibrage.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white p-4 rounded-2xl shadow-md">
          <Flame className="w-8 h-8 fill-amber-200 text-amber-200 animate-bounce" />
          <div>
            <span className="text-2xl font-black block leading-none">{streakDays} Jours</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-100">
              Série consécutive
            </span>
          </div>
        </div>
      </div>

      {/* Inspirational Quote Card */}
      <div
        className={`p-6 rounded-3xl border ${
          isDarkMode
            ? 'bg-slate-900 border-slate-800'
            : 'bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 border-emerald-200'
        } shadow-sm flex items-center justify-between gap-4`}
      >
        <div className="flex items-start gap-3">
          <Quote className="w-8 h-8 text-emerald-600 shrink-0 mt-1" />
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-white italic">
              "{currentQuote.text}"
            </p>
            <span className="text-xs text-emerald-600 font-extrabold block mt-1">
              — {currentQuote.author}
            </span>
          </div>
        </div>

        <button
          id="btn-next-quote"
          onClick={nextQuote}
          className="p-3 rounded-2xl border border-emerald-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer shrink-0"
          title="Inspiration suivante"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Badges Grid */}
      <div
        className={`p-6 rounded-3xl border ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-sm space-y-4`}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-800 dark:text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            Mes Trophées ({badges.filter((b) => b.unlocked).length}/{badges.length})
          </h3>
          <button
            id="btn-celebrate-confetti"
            onClick={triggerConfetti}
            className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
          >
            Fêter mes victoires 🎉
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              onClick={() => badge.unlocked && triggerConfetti()}
              className={`p-5 rounded-2xl border transition-all ${
                badge.unlocked
                  ? isDarkMode
                    ? 'bg-slate-800 border-emerald-500/40 cursor-pointer hover:border-emerald-500'
                    : 'bg-white border-emerald-300 shadow-xs cursor-pointer hover:shadow-md'
                  : isDarkMode
                  ? 'bg-slate-900/60 border-slate-800 opacity-60'
                  : 'bg-slate-50 border-slate-200 opacity-70'
              } flex flex-col justify-between space-y-3`}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                    badge.unlocked
                      ? 'bg-emerald-500/10 border border-emerald-500/20'
                      : 'bg-slate-200 dark:bg-slate-800'
                  }`}
                >
                  {renderBadgeIcon(badge.iconName)}
                </div>
                {badge.unlocked && (
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Débloqué
                  </span>
                )}
              </div>

              <div>
                <h4 className="font-black text-sm text-slate-800 dark:text-white leading-tight">
                  {badge.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                  {badge.description}
                </p>
              </div>

              <div className="w-full">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                  <span>Progression</span>
                  <span>
                    {badge.progress} / {badge.maxProgress}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      badge.unlocked ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    style={{
                      width: `${Math.min(100, Math.round((badge.progress / badge.maxProgress) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

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
