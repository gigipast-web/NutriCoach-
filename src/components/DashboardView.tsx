import React, { useState, useEffect } from 'react';
import { Scale, Plus, Utensils, ChevronRight, Volume2, VolumeX, Mic } from 'lucide-react';
import { UserProfile, UserMetrics, MealEntry, WaterData, ActivityEntry, TabType } from '../types.ts';
import { useLanguage } from '../i18n/LanguageContext.tsx';
import { playMealVoiceReminder, playWelcomeVoiceGreeting, stopSpeaking } from '../utils/voiceCoach.ts';

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
  const caloriesRemaining = Math.max(0, metrics.targetCalories - totalCaloriesEaten + totalCaloriesBurned);

  const totalToLose = user.startWeightKg - user.targetWeightKg;
  const lostSoFar = user.startWeightKg - user.currentWeightKg;
  const progressPercent = totalToLose > 0 ? Math.min(100, Math.max(0, Math.round((lostSoFar / totalToLose) * 100))) : 100;
  const targetGlasses = Math.round(user.waterTargetMl / 250);

  return (
    <div id="dashboard-view" className="space-y-8 pb-12">
      {/* Top Banner & Main Metrics */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          {/* Greeting & Quick Action */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white tracking-tight">
                Bonjour {user.name} 👋
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm sm:text-base">
                Vous êtes sur la bonne voie ! Encore{' '}
                <strong className="text-[#10B981] font-bold">
                  {(user.currentWeightKg - user.targetWeightKg).toFixed(1)} kg
                </strong>{' '}
                pour atteindre votre objectif.
              </p>

              {/* Voice Greeting Quick Pill */}
              <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  id="btn-dash-greeting-voice"
                  onClick={() => {
                    if (isSpeakingVoicePrompt) {
                      stopSpeaking();
                      setIsSpeakingVoicePrompt(false);
                    } else {
                      setIsSpeakingVoicePrompt(true);
                      playWelcomeVoiceGreeting(user.name, 'fr', {
                        onEnd: () => setIsSpeakingVoicePrompt(false),
                        onError: () => setIsSpeakingVoicePrompt(false),
                      });
                    }
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs ${
                    isSpeakingVoicePrompt
                      ? 'bg-amber-500 text-white animate-pulse'
                      : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100'
                  }`}
                  title="Écouter le message vocal d'accueil du Coach"
                >
                  {isSpeakingVoicePrompt ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Arrêter la voix</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>🎙️ Le Coach vous salue : « Que vas-tu manger ? »</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <button
              id="btn-quick-weigh-in"
              onClick={onOpenWeighIn}
              className="hidden sm:flex items-center gap-2 bg-white dark:bg-slate-800 border-2 border-[#10B981] text-[#10B981] dark:text-emerald-400 px-4 py-2.5 rounded-2xl font-extrabold text-xs shadow-xs hover:bg-emerald-50 dark:hover:bg-slate-700 transition-all cursor-pointer"
            >
              <Scale className="w-4 h-4 text-[#10B981]" />
              {t('dashWeighIn')}
            </button>
          </div>

          {/* Weight & Progress Circular Gauge Card */}
          <div
            id="weight-progress-hero-card"
            className={`rounded-[32px] p-6 sm:p-8 border ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-emerald-50 text-slate-800'
            } shadow-xs flex flex-col sm:flex-row items-center gap-8`}
          >
            <div className="relative w-36 h-36 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke={isDarkMode ? '#1E293B' : '#ECFDF5'}
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="8"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * progressPercent) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-[#10B981]">{progressPercent}%</span>
                <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">{t('dashGoal')}</span>
              </div>
            </div>

            <div className="flex-1 w-full flex items-center justify-between gap-2 sm:gap-6 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 pt-4 sm:pt-0 sm:pl-6">
              <div className="text-center sm:text-left">
                <span className="block text-xs text-slate-400 font-extrabold uppercase tracking-wider">{t('dashCurrent')}</span>
                <span className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white">
                  {user.currentWeightKg.toFixed(1)}
                  <small className="text-sm font-bold text-slate-400 ml-0.5">kg</small>
                </span>
              </div>
              <div className="w-px h-12 bg-slate-100 dark:bg-slate-800" />
              <div className="text-center sm:text-left">
                <span className="block text-xs text-slate-400 font-extrabold uppercase tracking-wider">{t('dashTarget')}</span>
                <span className="text-3xl sm:text-4xl font-black text-slate-800 dark:text-white">
                  {user.targetWeightKg.toFixed(1)}
                  <small className="text-sm font-bold text-slate-400 ml-0.5">kg</small>
                </span>
              </div>
              <div className="w-px h-12 bg-slate-100 dark:bg-slate-800" />
              <div className="text-center sm:text-left">
                <span className="block text-xs text-slate-400 font-extrabold uppercase tracking-wider">{t('dashBmi')}</span>
                <span className="text-3xl sm:text-4xl font-black text-[#F59E0B]">{metrics.bmi}</span>
              </div>
            </div>
          </div>

          {/* 3 Metric Cards: Calories, Hydration, Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Calories Card */}
            <div
              id="card-metric-calories"
              className={`rounded-3xl p-6 border ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-orange-50/70 border-orange-100'
              } transition-transform hover:scale-[1.01]`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-200/80 rounded-2xl flex items-center justify-center text-xl shadow-xs">
                  🔥
                </div>
                <span className="text-xs font-black text-orange-900 dark:text-orange-400 uppercase tracking-wider">
                  {t('dashConsumed')}
                </span>
              </div>
              <div className="text-3xl font-black text-orange-950 dark:text-white">
                {caloriesRemaining}{' '}
                <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase">{t('dashRemaining')}</span>
              </div>
              <div className="w-full h-2.5 bg-orange-200/60 dark:bg-slate-800 rounded-full mt-4 overflow-hidden">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round((totalCaloriesEaten / metrics.targetCalories) * 100))}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-bold text-orange-700 dark:text-orange-300 mt-2">
                <span>{t('dashEaten')} {totalCaloriesEaten} kcal</span>
                <span>{t('dashTarget')} : {metrics.targetCalories} kcal</span>
              </div>
            </div>

            {/* Hydration Card */}
            <div
              id="card-metric-hydration"
              className={`rounded-3xl p-6 border ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-blue-50/70 border-blue-100'
              } transition-transform hover:scale-[1.01]`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-200/80 rounded-2xl flex items-center justify-center text-xl shadow-xs">
                    💧
                  </div>
                  <span className="text-xs font-black text-blue-900 dark:text-blue-400 uppercase tracking-wider">
                    {t('dashWater')}
                  </span>
                </div>
                <button
                  id="btn-quick-add-water"
                  onClick={() => onAddWater(250)}
                  className="text-[11px] font-extrabold text-blue-700 bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  {t('dashAddGlass')}
                </button>
              </div>
              <div className="text-3xl font-black text-blue-950 dark:text-white">
                {water.glassesCount}/{targetGlasses}{' '}
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase">{t('dashGlasses')}</span>
              </div>
              <div className="flex gap-1.5 mt-4">
                {Array.from({ length: targetGlasses }).map((_, index) => (
                  <div
                    key={index}
                    onClick={() => onAddWater(index < water.glassesCount ? -250 : 250)}
                    className={`h-2.5 flex-1 rounded-full cursor-pointer transition-all ${
                      index < water.glassesCount ? 'bg-blue-500' : 'bg-blue-200/60 dark:bg-slate-800'
                    }`}
                  />
                ))}
              </div>
              <div className="text-[10px] font-bold text-blue-700 dark:text-blue-300 mt-2">
                Total : {(water.amountMl / 1000).toFixed(2)} L
              </div>
            </div>

            {/* Activity & Steps Card */}
            <div
              id="card-metric-activity"
              className={`rounded-3xl p-6 border ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-emerald-50/70 border-emerald-100'
              } transition-transform hover:scale-[1.01] flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-200/80 rounded-2xl flex items-center justify-center text-xl shadow-xs">
                      🚶
                    </div>
                    <span className="text-xs font-black text-emerald-900 dark:text-emerald-400 uppercase tracking-wider">
                      {t('dashSteps')}
                    </span>
                  </div>
                  {onAddActivity && (
                    <button
                      id="btn-quick-add-steps-dash"
                      type="button"
                      onClick={() =>
                        onAddActivity({
                          title: 'Marche quotidienne',
                          durationMinutes: 12,
                          caloriesBurned: 45,
                          stepsCount: 1000,
                          type: 'walk',
                          timestamp: new Date().toISOString(),
                        })
                      }
                      className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                      title="Ajouter rapidement 1 000 pas"
                    >
                      +1 000 pas
                    </button>
                  )}
                </div>

                <div className="text-3xl font-black text-emerald-950 dark:text-white">
                  {totalSteps.toLocaleString()}{' '}
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                    / {(user.stepTarget || 10000).toLocaleString()} pas
                  </span>
                </div>

                {/* Visual Progress Bar */}
                <div className="w-full bg-emerald-200/60 dark:bg-slate-800 rounded-full h-2.5 mt-3 overflow-hidden">
                  <div
                    className="bg-[#10B981] h-2.5 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round((totalSteps / (user.stepTarget || 10000)) * 100)
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2 border-t border-emerald-200/40 dark:border-slate-800">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                  <span>~{totalCaloriesBurned} {t('dashBurnedToday')}</span>
                  {user.connectedWatch?.connected && (
                    <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-md bg-emerald-200/60 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[9px] font-bold">
                      ⌚ {user.connectedWatch.brand}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('hydration')}
                  className="text-[11px] font-extrabold text-emerald-700 dark:text-emerald-300 hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  Gérer les pas <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Action CTA buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <button
              id="btn-add-meal-primary"
              onClick={onOpenAddMeal}
              className="h-16 bg-[#10B981] hover:bg-[#059669] text-white rounded-2xl text-lg font-extrabold flex items-center justify-center gap-3 shadow-lg shadow-emerald-200/60 active:scale-[0.98] transition-all cursor-pointer"
            >
              <Plus className="w-6 h-6 stroke-[3]" />
              {t('dashAddMeal')}
            </button>
            <button
              id="btn-view-recipes-cta"
              onClick={() => onNavigate('recipes')}
              className="h-16 bg-white dark:bg-slate-800 border-2 border-[#10B981] text-[#10B981] dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-700 rounded-2xl text-lg font-extrabold flex items-center justify-center gap-3 transition-all cursor-pointer"
            >
              <Utensils className="w-6 h-6" />
              {t('dashViewRecipes')}
            </button>
          </div>
        </div>

        {/* Right Sidebar: AI Assistant Card & Motivation Trophy */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          <div className="bg-slate-900 rounded-[32px] p-6 text-white flex flex-col h-full border border-slate-800 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-[#10B981] rounded-xl flex items-center justify-center text-xl shadow-md">
                🤖
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">Assistant Nutri-IA</h3>
                <span className="text-[10px] text-emerald-400 font-bold block">En ligne • Conseils personnalisés</span>
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-3 overflow-hidden my-2">
              <div className="bg-slate-800/90 rounded-2xl p-3.5 rounded-tl-none border border-slate-700/50">
                <p className="text-xs leading-relaxed text-slate-200">
                  Bonjour {user.name} ! Pour soutenir votre objectif de{' '}
                  <strong className="text-emerald-400">{user.targetWeightKg} kg</strong>, privilégiez un dîner riche en
                  protéines.
                </p>
              </div>
              <div className="bg-[#10B981]/20 border border-[#10B981]/40 rounded-2xl p-3.5 rounded-tr-none ml-6">
                <p className="text-xs text-emerald-100 font-semibold">
                  Une idée de repas rapide à moins de 400 kcal ?
                </p>
              </div>
            </div>

            {/* Quick Voice Ask Meal Button */}
            <button
              id="btn-dash-voice-ask-meal"
              type="button"
              onClick={() => {
                if (isSpeakingVoicePrompt) {
                  stopSpeaking();
                  setIsSpeakingVoicePrompt(false);
                } else {
                  setIsSpeakingVoicePrompt(true);
                  playMealVoiceReminder(user.name, 'fr', {
                    onEnd: () => setIsSpeakingVoicePrompt(false),
                    onError: () => setIsSpeakingVoicePrompt(false),
                  });
                }
              }}
              className={`w-full mt-3 p-3 rounded-2xl font-bold text-xs flex items-center justify-between transition-all cursor-pointer shadow-xs ${
                isSpeakingVoicePrompt
                  ? 'bg-amber-500 text-white animate-pulse'
                  : 'bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              <div className="flex items-center gap-2">
                {isSpeakingVoicePrompt ? (
                  <VolumeX className="w-4 h-4 text-white" />
                ) : (
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                )}
                <span>
                  {isSpeakingVoicePrompt
                    ? 'Le Coach vous parle...'
                    : '🎙️ « Que vas-tu manger ? » (Vocal)'}
                </span>
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider opacity-80">
                {isSpeakingVoicePrompt ? 'Stop' : 'Écouter'}
              </span>
            </button>

            <button
              id="btn-ask-ai-widget"
              onClick={() => onNavigate('aicoach')}
              className="mt-2 bg-slate-800 hover:bg-slate-700 rounded-2xl p-3.5 flex items-center justify-between text-xs text-slate-300 font-bold border border-slate-700 transition-colors cursor-pointer"
            >
              <span>Poser une question à l'IA...</span>
              <div className="w-7 h-7 bg-[#10B981] rounded-xl flex items-center justify-center text-white text-sm">
                ➔
              </div>
            </button>
          </div>

          <div
            id="streak-motivation-card"
            onClick={() => onNavigate('badges')}
            className="bg-[#F59E0B] rounded-[32px] p-6 text-white flex items-center gap-4 shadow-md shadow-amber-500/20 cursor-pointer hover:opacity-95 transition-all"
          >
            <div className="text-4xl shrink-0">🏆</div>
            <div>
              <h4 className="font-black text-lg leading-tight uppercase tracking-tight">Série de 5 jours !</h4>
              <p className="text-xs text-amber-100 font-medium mt-1">
                Continuez ainsi, vous débloquez le badge 'Endurant'.
              </p>
            </div>
          </div>

          {/* Fresh Fruit Booster Card */}
          <div
            id="fruit-booster-card"
            onClick={onOpenAddMeal}
            className="p-5 rounded-[28px] bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-950/30 dark:to-orange-950/20 border border-rose-200/80 dark:border-rose-900/50 flex items-center justify-between gap-3 shadow-xs hover:border-rose-300 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center text-2xl shadow-xs">
                🍎
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-xs text-rose-900 dark:text-rose-200">
                    Mangez + de fruits frais
                  </h4>
                  <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/60 px-1.5 py-0.5 rounded-md">
                    Fibres & Vitalité
                  </span>
                </div>
                <p className="text-[11px] text-rose-800/80 dark:text-rose-300/80 mt-0.5">
                  Idéal en dessert ou en collation pour caler la faim sans excès !
                </p>
              </div>
            </div>
            <span className="text-xs font-black text-rose-700 dark:text-rose-300 bg-white/90 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-rose-200/80 dark:border-rose-800 shrink-0 shadow-2xs">
              + 1 Fruit
            </span>
          </div>
        </div>
      </div>

      {/* Today's Meals Section */}
      <div
        id="todays-meals-overview"
        className={`p-6 rounded-[32px] border ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-emerald-50'
        } shadow-xs space-y-4`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-800 dark:text-white">Repas enregistrés aujourd'hui</h3>
            <p className="text-xs text-slate-400">
              {meals.length} éléments enregistrés • {totalCaloriesEaten} kcal consommées
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="btn-dash-weekly-recap"
              onClick={() => onNavigate('journal')}
              className="text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 flex items-center gap-1 transition-all cursor-pointer"
            >
              <span>📊 Bilan Semaine</span>
            </button>
            <button
              id="btn-view-full-journal"
              onClick={() => onNavigate('journal')}
              className="text-xs font-extrabold text-[#10B981] hover:underline flex items-center gap-1 cursor-pointer"
            >
              Voir journal complet <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {meals.length === 0 ? (
          <div className="text-center py-6 text-slate-400 space-y-2">
            <p className="text-sm font-medium">Aucun repas enregistré pour le moment.</p>
            <button
              id="btn-empty-add-meal"
              onClick={onOpenAddMeal}
              className="text-xs font-extrabold bg-emerald-50 text-[#10B981] px-4 py-2 rounded-xl border border-emerald-200 cursor-pointer"
            >
              + Enregistrer mon repas
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {meals.map((meal) => (
              <div
                key={meal.id}
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  isDarkMode ? 'bg-slate-800/60 border-slate-700' : 'bg-[#F9FCF9] border-emerald-100/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#10B981] font-bold flex items-center justify-center text-lg shrink-0">
                    {meal.mealType === 'petit_dejeuner' && '🥐'}
                    {meal.mealType === 'dejeuner' && '🥗'}
                    {meal.mealType === 'diner' && '🍲'}
                    {meal.mealType === 'collation' && '🍎'}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-white">{meal.foodName}</h4>
                    <span className="text-[11px] text-slate-400 block">
                      P: {meal.protein}g • G: {meal.carbs}g • L: {meal.fat}g
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-black text-sm text-[#10B981]">{meal.calories} kcal</span>
                  <span className="text-[10px] text-slate-400 block font-bold">{meal.portionGrams}g</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
