import React, { useState, useEffect } from 'react';
import {
  Scale,
  Plus,
  Utensils,
  Volume2,
  VolumeX,
  Droplets,
  Flag,
  ArrowRight,
  Footprints,
  Sparkles,
  Camera,
  Barcode,
} from 'lucide-react';
import { UserProfile, UserMetrics, MealEntry, WaterData, ActivityEntry, TabType } from '../types.ts';
import { useLanguage } from '../i18n/LanguageContext.tsx';
import { getDashboardUi } from '../i18n/dashboardI18n.ts';
import { getUiCore } from '../i18n/uiCoreI18n.ts';
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
  onOpenAiScan?: () => void;
  onOpenBarcodeScanner?: () => void;
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
  onOpenAiScan,
  onOpenBarcodeScanner,
  onAddWater,
  onAddActivity,
  onOpenWeighIn,
  isDarkMode,
}) => {
  const { language, locale } = useLanguage();
  const dui = getDashboardUi(language);
  const ui = getUiCore(language);
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
  const totalSteps = todayActivities.reduce((acc, a) => acc + a.stepsCount, 0);

  const startWeight = user.startWeightKg || 70.0;
  const currentWeight = user.currentWeightKg || 67.5;
  const targetWeight = user.targetWeightKg || 60.0;

  const totalToLose = Math.max(0.1, startWeight - targetWeight);
  const lostSoFar = Math.max(0, startWeight - currentWeight);
  const progressPercent =
    totalToLose > 0
      ? Math.min(100, Math.max(0, Math.round((lostSoFar / totalToLose) * 100)))
      : 0;

  // Real calorie & water totals (no misleading hardcoded placeholders)
  const targetCalories = metrics?.targetCalories || 1800;
  const caloriesDisplay = totalCaloriesEaten;
  const caloriesRemaining = Math.max(0, targetCalories - caloriesDisplay);
  const caloriePercent = Math.min(100, Math.round((caloriesDisplay / targetCalories) * 100));

  const targetLiters = (user.waterTargetMl || 2000) / 1000;
  const currentLiters = Math.max(0, water.amountMl) / 1000;
  const waterPercent = Math.min(100, Math.round((currentLiters / targetLiters) * 100));

  const formatNum = (val: number, decimals = 1) =>
    val.toLocaleString(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  // Representative meals for today's visual row computed dynamically from todayMeals
  const mealPreviews = [
    {
      id: 'petit_dej',
      title: dui.breakfast,
      mealType: 'petit_dejeuner',
      image: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=260&q=80',
      alt: dui.breakfast,
    },
    {
      id: 'dejeuner',
      title: dui.lunch,
      mealType: 'dejeuner',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=260&q=80',
      alt: dui.lunch,
    },
    {
      id: 'collation',
      title: dui.snack,
      mealType: 'collation',
      image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=260&q=80',
      alt: dui.snack,
    },
    {
      id: 'diner',
      title: dui.dinner,
      mealType: 'diner',
      image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=260&q=80',
      alt: dui.dinner,
    },
  ].map((meal) => {
    const typeMeals = todayMeals.filter((m) => m.mealType === meal.mealType);
    const kcal = typeMeals.reduce((sum, m) => sum + m.calories, 0);
    return {
      ...meal,
      kcal,
      count: typeMeals.length,
      hasLogged: typeMeals.length > 0,
    };
  });

  return (
    <div id="dashboard-view" className="space-y-5 sm:space-y-6 pb-20 max-w-4xl mx-auto">
      {/* 1. Header Greeting & Robot Mascot Banner */}
      <div className="flex items-center justify-between gap-4 pt-1">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-black dark:text-emerald-300 tracking-tight truncate">
              {dui.hello} {user.name || 'Clara'} ! 👋
            </h1>
            <BlossomFlower size={24} palette="pink" />
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-semibold leading-relaxed max-w-md">
            {dui.motivationSubtitle}
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
                  playWelcomeVoiceGreeting(user.name || 'Clara', language, {
                    onEnd: () => setIsSpeakingVoicePrompt(false),
                    onError: () => setIsSpeakingVoicePrompt(false),
                  });
                }
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs ${
                isSpeakingVoicePrompt
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white'
                  : 'bg-white dark:bg-slate-800 text-[#1F6F43] dark:text-emerald-300 border border-[#DCE8DC] dark:border-slate-700 hover:bg-[#EAF3EA]'
              }`}
            >
              {isSpeakingVoicePrompt ? (
                <>
                  <VolumeX className="w-3.5 h-3.5" />
                  <span>{dui.stopVoice}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#1F6F43] dark:text-emerald-400" />
                  <span>{dui.coachGreetsYou}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mascot Robot Shortcut */}
        <button
          type="button"
          onClick={() => onNavigate('aicoach')}
          className="cursor-pointer group shrink-0 flex flex-col items-center p-1.5 rounded-2xl hover:bg-emerald-50/70 dark:hover:bg-slate-800/60 transition-colors"
          title={dui.talkToCoach}
          aria-label={dui.talkToCoach}
        >
          <RobotCoachMascot size={82} waving={true} mood="happy" />
          <span className="text-[11px] font-black text-[#1F6F43] dark:text-emerald-400 -mt-1">
            {dui.coachTitle} →
          </span>
        </button>
      </div>

      {/* 1b. Quick Actions Strip (1-tap access for core daily tasks) */}
      <div
        id="dashboard-quick-actions"
        className="grid grid-cols-2 sm:grid-cols-4 gap-2.5"
      >
        <button
          type="button"
          id="qa-add-meal"
          onClick={onOpenAddMeal}
          className={`min-h-[46px] px-3 py-2.5 rounded-2xl border flex items-center justify-center gap-2 text-xs font-extrabold transition-all cursor-pointer active:scale-[0.98] ${
            isDarkMode
              ? 'bg-slate-900 border-slate-800 text-emerald-300 hover:border-emerald-700'
              : 'bg-white border-[#DCE8DC] text-[#163321] hover:border-emerald-400 hover:bg-emerald-50/50'
          }`}
        >
          <Plus className="w-4 h-4 text-[#1F6F43] dark:text-emerald-400 shrink-0" />
          <span className="truncate">{ui.addMealQuick}</span>
        </button>

        <button
          type="button"
          id="qa-ai-scan"
          onClick={() => (onOpenAiScan ? onOpenAiScan() : onNavigate('aicoach'))}
          className={`min-h-[46px] px-3 py-2.5 rounded-2xl border flex items-center justify-center gap-2 text-xs font-extrabold transition-all cursor-pointer active:scale-[0.98] ${
            isDarkMode
              ? 'bg-slate-900 border-slate-800 text-amber-300 hover:border-amber-700'
              : 'bg-white border-[#DCE8DC] text-[#163321] hover:border-amber-400 hover:bg-amber-50/40'
          }`}
        >
          <Camera className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="truncate">{ui.aiScanQuick}</span>
        </button>

        <button
          type="button"
          id="qa-barcode-scan"
          onClick={() => (onOpenBarcodeScanner ? onOpenBarcodeScanner() : onNavigate('journal'))}
          className={`min-h-[46px] px-3 py-2.5 rounded-2xl border flex items-center justify-center gap-2 text-xs font-extrabold transition-all cursor-pointer active:scale-[0.98] ${
            isDarkMode
              ? 'bg-slate-900 border-slate-800 text-sky-300 hover:border-sky-700'
              : 'bg-white border-[#DCE8DC] text-[#163321] hover:border-sky-400 hover:bg-sky-50/40'
          }`}
        >
          <Barcode className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
          <span className="truncate">{ui.barcodeQuick}</span>
        </button>

        <button
          type="button"
          id="qa-weigh-in"
          onClick={onOpenWeighIn}
          className={`min-h-[46px] px-3 py-2.5 rounded-2xl border flex items-center justify-center gap-2 text-xs font-extrabold transition-all cursor-pointer active:scale-[0.98] ${
            isDarkMode
              ? 'bg-slate-900 border-slate-800 text-rose-300 hover:border-rose-700'
              : 'bg-white border-[#DCE8DC] text-[#163321] hover:border-rose-400 hover:bg-rose-50/40'
          }`}
        >
          <Scale className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
          <span className="truncate">{ui.weighInQuick}</span>
        </button>
      </div>

      {/* 2. Main Gauge & Weight Card */}
      <div
        id="weight-progress-hero-card"
        className={`rounded-[28px] p-6 sm:p-7 border relative overflow-hidden ${
          isDarkMode
            ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-[#14231A] border-slate-800 text-white'
            : 'bg-gradient-to-br from-white via-[#FCFDFB] to-[#F3F9F4] border-[#E2ECE2] text-[#163321]'
        } shadow-[0_4px_24px_rgba(31,111,67,0.06)] flex flex-col sm:flex-row items-center justify-between gap-6`}
      >
        <CornerFloralFlourish className="opacity-70 dark:opacity-40" />

        {/* Left: Circular Progress Gauge */}
        <div className="relative w-36 h-36 sm:w-40 sm:h-40 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <defs>
              <linearGradient id="floralGaugeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="45%" stopColor="#06B6D4" />
                <stop offset="80%" stopColor="#F59E0B" />
                <stop offset="100%" stopColor="#F43F5E" />
              </linearGradient>
            </defs>

            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke={isDarkMode ? '#1E293B' : '#E8F1E9'}
              strokeWidth="11"
            />
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
            <span className="text-3xl font-black tabular-nums bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-600 dark:from-emerald-300 dark:via-teal-300 dark:to-amber-300 bg-clip-text text-transparent tracking-tight leading-none">
              {progressPercent}%
            </span>
            <span className="text-[11px] font-black text-black dark:text-slate-300 mt-1 leading-tight">
              {dui.towardsGoal}
            </span>
          </div>
        </div>

        {/* Right: Current Weight & Goal */}
        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3 sm:border-l border-[#EDF3ED] dark:border-slate-800 sm:pl-6">
          <button
            type="button"
            onClick={onOpenWeighIn}
            className="w-full p-4 rounded-2xl bg-[#F7FAF7] dark:bg-slate-800/80 border border-[#E5EFE5] dark:border-slate-700 flex items-center gap-3 cursor-pointer hover:border-emerald-400 transition-all text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-[#1F6F43]/10 text-[#1F6F43] dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                {dui.currentWeight}
              </span>
              <span className="text-2xl font-black tabular-nums text-black dark:text-white">
                {formatNum(currentWeight, 1)}{' '}
                <small className="text-xs font-bold text-slate-600 dark:text-slate-400">kg</small>
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('progress')}
            className="w-full p-4 rounded-2xl bg-[#F7FAF7] dark:bg-slate-800/80 border border-[#E5EFE5] dark:border-slate-700 flex items-center gap-3 cursor-pointer hover:border-emerald-400 transition-all text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#1F6F43] dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-600 dark:text-slate-300">
                {dui.goal}
              </span>
              <span className="text-2xl font-black tabular-nums text-black dark:text-white">
                {formatNum(targetWeight, 1)}{' '}
                <small className="text-xs font-bold text-slate-600 dark:text-slate-400">kg</small>
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 3. Metric Summary Row: Calories du jour & Hydratation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Calories Card */}
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
              <span className="text-xs font-black text-black dark:text-amber-300">
                {dui.todayCalories}
              </span>
            </div>
            <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 tabular-nums">
              {caloriesDisplay <= targetCalories
                ? ui.kcalLeft(caloriesRemaining.toLocaleString(locale))
                : `+${(caloriesDisplay - targetCalories).toLocaleString(locale)} kcal`}
            </span>
          </div>

          <div className="text-2xl font-black tabular-nums text-black dark:text-white">
            {caloriesDisplay.toLocaleString(locale)}{' '}
            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
              / {targetCalories.toLocaleString(locale)} kcal
            </span>
          </div>

          <div className="w-full h-3 bg-amber-100/70 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 rounded-full transition-all duration-700 shadow-2xs"
              style={{ width: `${caloriePercent}%` }}
            />
          </div>
        </div>

        {/* Hydratation Card */}
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
              <Droplets className="w-4 h-4 text-sky-500" />
              <span className="text-xs font-black text-black dark:text-cyan-300">
                {dui.hydration}
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddWater(250);
              }}
              className="min-h-[34px] text-xs font-extrabold text-cyan-800 bg-cyan-100 dark:bg-cyan-950 dark:text-cyan-300 hover:bg-cyan-200 px-3 py-1 rounded-full transition-colors cursor-pointer active:scale-95"
            >
              {dui.addGlass}
            </button>
          </div>

          <div className="text-2xl font-black tabular-nums text-black dark:text-white">
            {formatNum(currentLiters, 2)}{' '}
            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">
              / {formatNum(targetLiters, 1)} L
            </span>
          </div>

          <div className="w-full h-3 bg-cyan-100/70 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 rounded-full transition-all duration-700 shadow-2xs"
              style={{ width: `${waterPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4. Vos repas d'aujourd'hui */}
      <div
        id="todays-meals-pastel-card"
        className={`p-5 sm:p-6 rounded-[28px] border relative overflow-hidden ${
          isDarkMode
            ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-[#122218] border-slate-800'
            : 'bg-gradient-to-br from-white via-[#FCFDFB] to-[#F5F9F6] border-[#E2ECE2]'
        } shadow-[0_4px_24px_rgba(31,111,67,0.05)] space-y-4 sm:space-y-5`}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-black dark:text-white tracking-tight">
              {dui.todaysMeals}
            </h2>
            <FlowerGardenCluster />
          </div>
          <button
            type="button"
            onClick={onOpenAddMeal}
            className="min-h-[36px] px-3 py-1 rounded-full text-xs font-black text-[#1F6F43] dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>{dui.addBtn}</span>
          </button>
        </div>

        {/* 4 Circular Meal Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {mealPreviews.map((meal) => (
            <button
              type="button"
              key={meal.id}
              onClick={() => onNavigate('journal')}
              className={`p-3 sm:p-4 rounded-2xl border text-center ${
                isDarkMode
                  ? 'bg-slate-800/60 border-slate-700'
                  : 'bg-white border-[#E5EFE5]'
              } flex flex-col items-center transition-all hover:scale-[1.02] hover:border-emerald-400 cursor-pointer group shadow-2xs`}
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden shadow-xs border-2 border-emerald-100 dark:border-slate-700 mb-2.5 p-0.5 bg-gradient-to-tr from-emerald-400 to-amber-300">
                <img
                  src={meal.image}
                  alt={meal.alt}
                  className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </div>

              <span className="font-black text-xs text-black dark:text-white block truncate max-w-full">
                {meal.title}
              </span>
              <span className="text-[11px] font-bold tabular-nums text-slate-600 dark:text-slate-300 block mt-0.5">
                {meal.hasLogged ? (
                  <>
                    <strong className="text-[#1F6F43] dark:text-emerald-400 font-black">
                      {meal.kcal}
                    </strong>{' '}
                    kcal
                  </>
                ) : (
                  <span className="text-slate-400 dark:text-slate-500 font-semibold">
                    {ui.kcalTapAdd}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>

        {/* Primary CTA */}
        <button
          type="button"
          id="btn-dash-view-detail-cta"
          onClick={() => onNavigate('journal')}
          className="w-full h-13 sm:h-14 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-full font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 active:scale-[0.99] transition-all cursor-pointer"
        >
          <span>{dui.viewDetails}</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* 5. Steps & Coach IA Quick Access */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Steps Card */}
        <div
          onClick={() => onNavigate('hydration')}
          className={`p-4 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#E2ECE2]'
          } flex items-center justify-between gap-2 cursor-pointer hover:border-emerald-300 transition-all`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#1F6F43] dark:bg-emerald-950 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0">
              <Footprints className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                {dui.physicalActivity}
              </span>
              <span className="block text-base font-black tabular-nums text-black dark:text-white truncate">
                {totalSteps.toLocaleString(locale)} / {(user.stepTarget || 10000).toLocaleString(locale)} {dui.stepsWord}
              </span>
            </div>
          </div>
          {onAddActivity && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddActivity({
                  title: dui.dailyWalkTitle,
                  durationMinutes: 15,
                  caloriesBurned: 50,
                  stepsCount: 1000,
                  type: 'walk',
                  timestamp: new Date().toISOString(),
                });
              }}
              className="min-h-[38px] text-xs font-black text-[#1F6F43] bg-[#EAF3EA] hover:bg-[#D8EBD8] px-3 py-1.5 rounded-full transition-colors cursor-pointer shrink-0 active:scale-95"
            >
              {dui.add1000Steps}
            </button>
          )}
        </div>

        {/* Coach IA Quick Ask Card */}
        <button
          type="button"
          onClick={() => onNavigate('aicoach')}
          className={`p-4 rounded-2xl border text-left ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#E2ECE2]'
          } flex items-center justify-between gap-2 cursor-pointer hover:border-emerald-300 transition-all`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400 flex items-center justify-center font-bold shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                {dui.coachTitle}
              </span>
              <span className="block text-sm font-black text-black dark:text-white truncate">
                {dui.askQuestion}
              </span>
            </div>
          </div>
          <span className="text-xs font-black text-[#1F6F43] bg-[#EAF3EA] px-3 py-1.5 rounded-full shrink-0">
            →
          </span>
        </button>
      </div>
    </div>
  );
};
