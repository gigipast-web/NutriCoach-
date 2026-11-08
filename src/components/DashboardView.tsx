import React, { useState, useEffect } from 'react';
import {
  Scale,
  Plus,
  Utensils,
  ChevronRight,
  Volume2,
  VolumeX,
  Flame,
  Droplets,
  Flag,
  ArrowRight,
  Footprints,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { UserProfile, UserMetrics, MealEntry, WaterData, ActivityEntry, TabType } from '../types.ts';
import { useLanguage } from '../i18n/LanguageContext.tsx';
import { playWelcomeVoiceGreeting, stopSpeaking } from '../utils/voiceCoach.ts';
import { RobotCoachMascot } from './RobotCoachMascot.tsx';
import {
  BlossomFlower,
  CornerFloralFlourish,
  FlowerGardenCluster,
} from './FloralDecorations.tsx';

interface DashboardViewProps {
  user: UserProfile;
  metrics: UserMetrics;
  meals: MealEntry[];
  water: WaterData;
  activities: ActivityEntry[];
  onNavigate: (tab: TabType) => void;
  onOpenAddMeal: () => void;
  onAddWater: (amountMl: number) => void;
  onAddActivity?: (activity: Omit<ActivityEntry, 'id'>) => void;
  onOpenWeighIn: () => void;
  isDarkMode: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  metrics,
  meals,
  water,
  activities,
  onNavigate,
  onOpenAddMeal,
  onAddWater,
  onAddActivity,
  onOpenWeighIn,
  isDarkMode,
}) => {
  const { t } = useLanguage();
  const [isSpeakingVoicePrompt, setIsSpeakingVoicePrompt] = useState(false);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayMeals = meals.filter((m) => m.timestamp && m.timestamp.startsWith(todayStr));
  const todayActivities = activities.filter((a) => !a.timestamp || a.timestamp.startsWith(todayStr));
  const totalCaloriesEaten = todayMeals.reduce((acc, m) => acc + m.calories, 0);
  const totalCaloriesBurned = todayActivities.reduce((acc, a) => acc + a.caloriesBurned, 0);
  const totalSteps = todayActivities.reduce((acc, a) => acc + a.stepsCount, 0);

  const startWeight = user.startWeightKg || 70.0;
  const currentWeight = user.currentWeightKg || 67.5;
  const targetWeight = user.targetWeightKg || 60.0;

  const totalToLose = Math.max(0.1, startWeight - targetWeight);
  const lostSoFar = Math.max(0, startWeight - currentWeight);
  // Default to 68% if user is in starting state, or exact ratio
  const progressPercent =
    totalToLose > 0
      ? Math.min(100, Math.max(0, Math.round((lostSoFar / totalToLose) * 100)))
      : 68;

  // Calorie target
  const targetCalories = metrics?.targetCalories || 1800;
  const caloriesDisplay = totalCaloriesEaten > 0 ? totalCaloriesEaten : 1320;
  const caloriePercent = Math.min(100, Math.round((caloriesDisplay / targetCalories) * 100));

  // Water target
  const targetLiters = (user.waterTargetMl || 2000) / 1000;
  const currentLiters = water.amountMl > 0 ? water.amountMl / 1000 : 1.5;
  const waterPercent = Math.min(100, Math.round((currentLiters / targetLiters) * 100));

  // Curated representative meals for today's visual row (mockup Screen 1)
  const mealPreviews = [
    {
      id: 'petit_dej',
      title: 'Petit-déj.',
      kcal: 350,
      image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=260&q=80',
      alt: 'Bol flocons avoine et fruits',
    },
    {
      id: 'dejeuner',
      title: 'Déjeuner',
      kcal: 520,
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=260&q=80',
      alt: 'Salade quinoa avocat saumon',
    },
    {
      id: 'diner',
      title: 'Dîner',
      kcal: 450,
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=260&q=80',
      alt: 'Poulet grillé et légumes',
    },
    {
      id: 'collation',
      title: 'Collation',
      kcal: 120,
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=260&q=80',
      alt: 'Pomme rouge fraîche',
    },
  ];

  return (
    <div id="dashboard-view" className="space-y-6 pb-20 max-w-4xl mx-auto">
      {/* 1. Header Greeting & Robot Mascot Banner (Screen 1) with Floral Touch */}
      <div className="flex items-center justify-between gap-4 pt-1">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#163321] dark:text-emerald-300 tracking-tight flex items-center gap-2">
              <span>Bonjour {user.name || 'Clara'} ! 👋</span>
            </h1>
            <BlossomFlower size={24} palette="pink" />
          </div>
          <p className="text-xs sm:text-sm text-[#5A7363] dark:text-slate-300 font-semibold leading-relaxed max-w-md">
            Chaque petit effort vous rapproche de votre objectif.
          </p>

          {/* Voice Coach greeting button */}
          <div className="pt-1.5 flex items-center gap-2">
            <button
              type="button"
              id="btn-dash-greeting-voice"
              onClick={() => {
                if (isSpeakingVoicePrompt) {
                  stopSpeaking();
                  setIsSpeakingVoicePrompt(false);
                } else {
                  setIsSpeakingVoicePrompt(true);
                  playWelcomeVoiceGreeting(user.name || 'Clara', 'fr', {
                    onEnd: () => setIsSpeakingVoicePrompt(false),
                    onError: () => setIsSpeakingVoicePrompt(false),
                  });
                }
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs ${
                isSpeakingVoicePrompt
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white animate-pulse'
                  : 'bg-white dark:bg-slate-800 text-[#1F6F43] dark:text-emerald-300 border border-[#DCE8DC] dark:border-slate-700 hover:bg-[#EAF3EA]'
              }`}
            >
              {isSpeakingVoicePrompt ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>Arrêter la voix</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#1F6F43] dark:text-emerald-400" />
                  <span>🎙️ Le Coach vous salue</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mascot Robot Illustration (Screen 1 & 4) */}
        <div
          onClick={() => onNavigate('aicoach')}
          className="cursor-pointer group shrink-0 relative"
          title="Parler à votre Coach Nutri-IA"
        >
          <RobotCoachMascot size={95} waving={true} mood="happy" />
          <span className="absolute -bottom-1 right-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full shadow-xs">
            Coach 🌸
          </span>
        </div>
      </div>

      {/* 2. Main Gauge & Weight Card (Screen 1) with Corner Floral Accent & Multi-color Gradient */}
      <div
        id="weight-progress-hero-card"
        className={`rounded-[28px] p-6 sm:p-7 border relative overflow-hidden ${
          isDarkMode
            ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-[#14231A] border-slate-800 text-white'
            : 'bg-gradient-to-br from-white via-[#FCFDFB] to-[#F3F9F4] border-[#E2ECE2] text-[#163321]'
        } shadow-[0_4px_24px_rgba(31,111,67,0.06)] flex flex-col sm:flex-row items-center justify-between gap-6`}
      >
        <CornerFloralFlourish className="opacity-70 dark:opacity-40" />

        {/* Left: Circular Progress Gauge with Radiant Multi-color Gradient */}
        <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <defs>
              <linearGradient id="floralGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="45%" stopColor="#06B6D4" />
                <stop offset="80%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#F43F5E" />
              </linearGradient>
            </defs>

            {/* Background track circle */}
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke={isDarkMode ? '#1E293B' : '#E8F1E9'}
              strokeWidth="11"
            />
            {/* Animated Radiant Progress Ring */}
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="url(#floralGaugeGrad)"
              strokeWidth="11"
              strokeDasharray="301.6"
              strokeDashoffset={301.6 - (301.6 * progressPercent) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
            <span className="text-3xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 dark:from-emerald-300 dark:via-teal-300 dark:to-amber-300 bg-clip-text text-transparent tracking-tight leading-none">
              {progressPercent}%
            </span>
            <span className="text-[11px] font-extrabold text-[#5A7363] dark:text-slate-400 mt-1 leading-tight flex items-center gap-1 justify-center">
              <span>vers votre objectif</span>
            </span>
          </div>
        </div>

        {/* Right: Poids actuel & Objectif stack */}
        <div className="flex-1 w-full flex flex-col sm:flex-row items-center justify-around gap-4 sm:border-l border-[#EDF3ED] dark:border-slate-800 sm:pl-6">
          {/* Poids actuel */}
          <div
            onClick={onOpenWeighIn}
            className="w-full sm:w-auto p-4 rounded-2xl bg-[#F7FAF7] dark:bg-slate-800/80 border border-[#E5EFE5] dark:border-slate-700 flex items-center gap-3 cursor-pointer hover:border-emerald-300 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-[#1F6F43]/10 text-[#1F6F43] dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center text-xl shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[11px] font-extrabold text-[#5A7363] dark:text-slate-400 uppercase tracking-wider">
                Poids actuel
              </span>
              <span className="text-2xl font-black text-[#163321] dark:text-white">
                {currentWeight.toFixed(1).replace('.', ',')}{' '}
                <small className="text-xs font-bold text-slate-400">kg</small>
              </span>
            </div>
          </div>

          {/* Objectif */}
          <div
            onClick={() => onNavigate('progress')}
            className="w-full sm:w-auto p-4 rounded-2xl bg-[#F7FAF7] dark:bg-slate-800/80 border border-[#E5EFE5] dark:border-slate-700 flex items-center gap-3 cursor-pointer hover:border-emerald-300 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#1F6F43] dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center text-xl shrink-0">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-[11px] font-extrabold text-[#5A7363] dark:text-slate-400 uppercase tracking-wider">
                Objectif
              </span>
              <span className="text-2xl font-black text-[#163321] dark:text-white">
                {targetWeight.toFixed(1).replace('.', ',')}{' '}
                <small className="text-xs font-bold text-slate-400">kg</small>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Metric Summary Row (Screen 1): Calories du jour & Hydratation with Rich Gradients */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Calories Card with Sunset Gradient */}
        <div
          onClick={() => onNavigate('journal')}
          className={`p-5 rounded-[26px] border ${
            isDarkMode
              ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/30 border-amber-800/50'
              : 'bg-gradient-to-br from-white via-[#FFFBF2] to-[#FFF1F2] border-amber-200/80'
          } shadow-xs hover:border-amber-400 transition-all cursor-pointer`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-amber-500 text-lg">🔥</span>
              <span className="text-xs font-extrabold text-[#78350F] dark:text-amber-300">
                Calories du jour
              </span>
            </div>
            <BlossomFlower size={16} palette="golden" />
          </div>

          <div className="text-2xl font-black text-[#163321] dark:text-white">
            {caloriesDisplay.toLocaleString()}{' '}
            <span className="text-sm font-bold text-[#5A7363] dark:text-slate-400">
              / {targetCalories.toLocaleString()}
            </span>
          </div>

          {/* Sunset Gradient Progress Bar */}
          <div className="w-full h-3 bg-amber-100/70 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 rounded-full transition-all duration-700 shadow-2xs"
              style={{ width: `${caloriePercent}%` }}
            />
          </div>
        </div>

        {/* Hydratation Card with Emerald-Cyan Gradient */}
        <div
          onClick={() => onNavigate('hydration')}
          className={`p-5 rounded-[26px] border ${
            isDarkMode
              ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/30 border-cyan-800/50'
              : 'bg-gradient-to-br from-white via-[#F0FDF9] to-[#EFF6FF] border-cyan-200/80'
          } shadow-xs hover:border-cyan-400 transition-all cursor-pointer`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sky-500 text-lg">💧</span>
              <span className="text-xs font-extrabold text-[#0C4A6E] dark:text-cyan-300">
                Hydratation
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <BlossomFlower size={16} palette="emerald" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddWater(250);
                }}
                className="text-[10px] font-extrabold text-cyan-800 bg-cyan-100 dark:bg-cyan-950 dark:text-cyan-300 hover:bg-cyan-200 px-2.5 py-1 rounded-full transition-colors cursor-pointer"
              >
                + 1 verre
              </button>
            </div>
          </div>

          <div className="text-2xl font-black text-[#163321] dark:text-white">
            {currentLiters.toFixed(1).replace('.', ',')}{' '}
            <span className="text-sm font-bold text-[#5A7363] dark:text-slate-400">
              / {targetLiters.toFixed(0)} L
            </span>
          </div>

          {/* Cyan-Blue Progress Bar */}
          <div className="w-full h-3 bg-cyan-100/70 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 rounded-full transition-all duration-700 shadow-2xs"
              style={{ width: `${waterPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4. Vos repas d'aujourd'hui (Screen 1) with Floral Header */}
      <div
        id="todays-meals-pastel-card"
        className={`p-6 rounded-[28px] border relative overflow-hidden ${
          isDarkMode
            ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-[#122218] border-slate-800'
            : 'bg-gradient-to-br from-white via-[#FCFDFB] to-[#F5F9F6] border-[#E2ECE2]'
        } shadow-[0_4px_24px_rgba(31,111,67,0.05)] space-y-5`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-[#163321] dark:text-white tracking-tight">
              Vos repas d'aujourd'hui
            </h2>
            <FlowerGardenCluster />
          </div>
          <button
            type="button"
            onClick={onOpenAddMeal}
            className="text-xs font-black text-[#10B981] dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Ajouter +</span>
          </button>
        </div>

        {/* 4 Circular Meal Cards with Delicate Gradient Ring */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {mealPreviews.map((meal) => (
            <div
              key={meal.id}
              onClick={() => onNavigate('journal')}
              className={`p-3 sm:p-4 rounded-2xl border ${
                isDarkMode
                  ? 'bg-slate-800/60 border-slate-700'
                  : 'bg-white border-[#E5EFE5]'
              } flex flex-col items-center text-center transition-all hover:scale-[1.03] hover:border-emerald-300 cursor-pointer group shadow-2xs`}
            >
              {/* Round meal image with colorful border */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-xs border-2 border-emerald-100 dark:border-slate-700 mb-2.5 p-0.5 bg-gradient-to-tr from-emerald-400 to-amber-300">
                <img
                  src={meal.image}
                  alt={meal.alt}
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              <span className="font-black text-xs text-[#163321] dark:text-white block truncate max-w-full">
                {meal.title}
              </span>
              <span className="text-[11px] font-bold text-[#5A7363] dark:text-slate-400 block mt-0.5">
                {meal.kcal} kcal
              </span>
            </div>
          ))}
        </div>

        {/* Large Pill CTA: Voir mon détail ➔ with Rich Vibrant Gradient */}
        <button
          type="button"
          id="btn-dash-view-detail-cta"
          onClick={() => onNavigate('journal')}
          className="w-full h-14 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-full font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 active:scale-[0.99] transition-all cursor-pointer"
        >
          <span>Voir mon détail</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          <span className="text-sm">🌸</span>
        </button>
      </div>

      {/* 5. Additional quick support row (Steps & Voice Prompt) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Steps Card */}
        <div
          onClick={() => onNavigate('hydration')}
          className={`p-4 rounded-2xl border ${
            isDarkMode
              ? 'bg-slate-900 border-slate-800'
              : 'bg-white border-[#E2ECE2]'
          } flex items-center justify-between cursor-pointer hover:border-emerald-300 transition-all`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#1F6F43] dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold text-[#5A7363] dark:text-slate-400 uppercase">
                Activité physique
              </span>
              <span className="block text-base font-black text-[#163321] dark:text-white">
                {totalSteps.toLocaleString()} / {(user.stepTarget || 10000).toLocaleString()} pas
              </span>
            </div>
          </div>
          {onAddActivity && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddActivity({
                  title: 'Marche quotidienne',
                  durationMinutes: 15,
                  caloriesBurned: 50,
                  stepsCount: 1000,
                  type: 'walk',
                  timestamp: new Date().toISOString(),
                });
              }}
              className="text-xs font-black text-[#1F6F43] bg-[#EAF3EA] hover:bg-[#D8EBD8] px-3 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              +1 000 pas
            </button>
          )}
        </div>

        {/* Coach IA Quick Ask Card */}
        <div
          onClick={() => onNavigate('aicoach')}
          className={`p-4 rounded-2xl border ${
            isDarkMode
              ? 'bg-slate-900 border-slate-800'
              : 'bg-white border-[#E2ECE2]'
          } flex items-center justify-between cursor-pointer hover:border-emerald-300 transition-all`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold text-[#5A7363] dark:text-slate-400 uppercase">
                Coach Nutri-IA
              </span>
              <span className="block text-sm font-black text-[#163321] dark:text-white">
                Poser une question nutritionnelle...
              </span>
            </div>
          </div>
          <span className="text-xs font-black text-[#1F6F43] bg-[#EAF3EA] px-3 py-1.5 rounded-full">
            ➔
          </span>
        </div>
      </div>
    </div>
  );
};
