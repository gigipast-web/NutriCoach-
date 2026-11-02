import React, { useState, useMemo } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Flame,
  Utensils,
  Coffee,
  Apple,
  Moon,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  PieChart,
  BarChart3,
  Award,
  Scale,
  ArrowRight,
  TrendingUp,
  Info,
} from 'lucide-react';
import { MealEntry, UserProfile, MealType } from '../types.ts';
import { calculateMetrics } from '../utils/metrics.ts';

interface WeeklyMealRecapProps {
  meals: MealEntry[];
  user: UserProfile;
  isDarkMode: boolean;
  onBackToToday?: () => void;
  onAddMealForDay?: (dateStr: string) => void;
  onDeleteMeal?: (mealId: string) => void;
}

interface DaySummary {
  dateStr: string;
  dayName: string;
  dayNumber: string;
  isToday: boolean;
  meals: MealEntry[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  fruitCount: number;
}

export const WeeklyMealRecap: React.FC<WeeklyMealRecapProps> = ({
  meals,
  user,
  isDarkMode,
  onBackToToday,
  onDeleteMeal,
}) => {
  // Week offset: 0 = current 7-day period / current week, -1 = previous week
  const [weekOffset, setWeekOffset] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [filterMealType, setFilterMealType] = useState<MealType | 'all'>('all');

  const userMetrics = useMemo(() => calculateMetrics(user), [user]);
  const targetCalories = userMetrics.targetCalories || 1600;

  // Build the 7 days of the selected week (Monday to Sunday)
  const daysList: DaySummary[] = useMemo(() => {
    const today = new Date();
    // Anchor to Monday of the relevant week
    const currentDayOfWeek = (today.getDay() + 6) % 7; // 0 = Lundi, 6 = Dimanche
    const baseMonday = new Date(today);
    baseMonday.setDate(today.getDate() - currentDayOfWeek + weekOffset * 7);

    const todayIso = today.toISOString().split('T')[0];

    const days: DaySummary[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(baseMonday);
      d.setDate(baseMonday.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];

      const dayMeals = meals.filter((m) => m.timestamp.startsWith(dateStr));
      const totalCalories = dayMeals.reduce((acc, m) => acc + m.calories, 0);
      const totalProtein = dayMeals.reduce((acc, m) => acc + (m.protein || 0), 0);
      const totalCarbs = dayMeals.reduce((acc, m) => acc + (m.carbs || 0), 0);
      const totalFat = dayMeals.reduce((acc, m) => acc + (m.fat || 0), 0);

      // Check fruit mentions
      const fruitCount = dayMeals.filter((m) =>
        /pomme|poire|banane|fraise|framboise|kiwi|clementine|clémentine|orange|mandarine|raisin|melon|pasteque|pastèque|peche|pêche|abricot|fruit|baies/i.test(
          m.foodName
        )
      ).length;

      const dayName = d.toLocaleDateString('fr-FR', { weekday: 'short' });
      const dayNumber = d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

      days.push({
        dateStr,
        dayName: dayName.charAt(0).toUpperCase() + dayName.slice(1),
        dayNumber,
        isToday: dateStr === todayIso,
        meals: dayMeals,
        totalCalories,
        totalProtein: Math.round(totalProtein),
        totalCarbs: Math.round(totalCarbs),
        totalFat: Math.round(totalFat),
        fruitCount,
      });
    }

    return days;
  }, [meals, weekOffset]);

  // Weekly Aggregates
  const totalWeeklyCalories = useMemo(
    () => daysList.reduce((acc, d) => acc + d.totalCalories, 0),
    [daysList]
  );

  const daysWithMealsCount = useMemo(
    () => daysList.filter((d) => d.meals.length > 0).length,
    [daysList]
  );

  const averageCaloriesPerDay = useMemo(() => {
    if (daysWithMealsCount === 0) return 0;
    return Math.round(totalWeeklyCalories / daysWithMealsCount);
  }, [totalWeeklyCalories, daysWithMealsCount]);

  const totalWeeklyProtein = useMemo(
    () => daysList.reduce((acc, d) => acc + d.totalProtein, 0),
    [daysList]
  );
  const totalWeeklyCarbs = useMemo(
    () => daysList.reduce((acc, d) => acc + d.totalCarbs, 0),
    [daysList]
  );
  const totalWeeklyFat = useMemo(
    () => daysList.reduce((acc, d) => acc + d.totalFat, 0),
    [daysList]
  );

  const totalFruitPortions = useMemo(
    () => daysList.reduce((acc, d) => acc + d.fruitCount, 0),
    [daysList]
  );

  const daysOnTargetCount = useMemo(() => {
    return daysList.filter((d) => {
      if (d.meals.length === 0) return false;
      const lower = targetCalories * 0.85;
      const upper = targetCalories * 1.1;
      return d.totalCalories >= lower && d.totalCalories <= upper;
    }).length;
  }, [daysList, targetCalories]);

  // Week range label (e.g. "Du lun. 6 oct. au dim. 12 oct.")
  const weekRangeLabel = useMemo(() => {
    if (daysList.length < 7) return '';
    const first = daysList[0];
    const last = daysList[6];
    return `Semaine du ${first.dayNumber} au ${last.dayNumber}`;
  }, [daysList]);

  // Copy weekly summary to clipboard
  const handleCopySummary = () => {
    let text = `📊 Récapitulatif Nutritionnel NutriCoach\n${weekRangeLabel}\n\n`;
    text += `🎯 Objectif quotidien : ${targetCalories} kcal\n`;
    text += `🔥 Moyenne réelle : ${averageCaloriesPerDay} kcal / jour\n`;
    text += `⚖️ Total consommé : ${totalWeeklyCalories} kcal (${daysWithMealsCount}/7 jours renseignés)\n`;
    text += `🍎 Portions de fruits : ${totalFruitPortions} portions\n\n`;
    text += `Détail par jour :\n`;

    daysList.forEach((d) => {
      text += `\n• ${d.dayName} ${d.dayNumber} : ${d.totalCalories} kcal (${d.meals.length} repas)\n`;
      if (d.meals.length > 0) {
        d.meals.forEach((m) => {
          text += `  - [${m.mealType}] ${m.foodName} (${m.calories} kcal)\n`;
        });
      } else {
        text += `  (Aucun repas enregistré)\n`;
      }
    });

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const getMealTypeConfig = (type: MealType) => {
    switch (type) {
      case 'petit_dejeuner':
        return { label: 'Petit-déjeuner', icon: Coffee, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900' };
      case 'dejeuner':
        return { label: 'Déjeuner', icon: Utensils, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-900' };
      case 'collation':
        return { label: 'Collation', icon: Apple, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-900' };
      case 'diner':
        return { label: 'Dîner', icon: Moon, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900' };
    }
  };

  // Filtered days or day
  const displayedDays = selectedDate
    ? daysList.filter((d) => d.dateStr === selectedDate)
    : daysList;

  // Max calories for scaling bars
  const maxCaloriesInWeek = Math.max(
    targetCalories * 1.25,
    ...daysList.map((d) => d.totalCalories)
  );

  return (
    <div id="weekly-meal-recap-view" className="space-y-6 pb-12 animate-fadeIn">
      {/* Top Header Card */}
      <div
        className={`p-6 rounded-3xl border ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4`}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-3 py-1 rounded-full text-xs font-black">
              📊 Synthèse Hebdomadaire
            </span>
            <span className="text-xs text-slate-400 font-bold">{weekRangeLabel}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">
            Récapitulatif des Repas de la Semaine
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Vue d'ensemble de vos apports caloriques, macronutriments et portions de fruits sur 7 jours.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Week navigator */}
          <div className="flex items-center rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-1">
            <button
              id="btn-recap-prev-week"
              onClick={() => setWeekOffset((prev) => prev - 1)}
              className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
              title="Semaine précédente"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-slate-700 dark:text-slate-200">
              {weekOffset === 0
                ? 'Cette semaine'
                : weekOffset === -1
                ? 'Semaine dernière'
                : `Semaine ${weekOffset}`}
            </span>
            <button
              id="btn-recap-next-week"
              onClick={() => setWeekOffset((prev) => prev + 1)}
              disabled={weekOffset >= 0}
              className="p-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
              title="Semaine suivante"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Copy summary button */}
          <button
            id="btn-copy-weekly-summary"
            onClick={handleCopySummary}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
              isCopied
                ? 'bg-emerald-600 text-white border-emerald-600'
                : isDarkMode
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-2xs'
            }`}
          >
            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-emerald-600" />}
            <span>{isCopied ? 'Copié !' : 'Copier le bilan'}</span>
          </button>

          {onBackToToday && (
            <button
              id="btn-recap-back-today"
              onClick={onBackToToday}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              ← Vue Aujourd'hui
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Moyenne quotidienne */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          } shadow-2xs space-y-1.5`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Moyenne / Jour
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-800 dark:text-white">
              {averageCaloriesPerDay}
            </span>
            <span className="text-xs font-bold text-slate-400">kcal</span>
          </div>
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <span>Cible :</span>
            <strong className="text-emerald-600 dark:text-emerald-400">{targetCalories} kcal</strong>
            <span className="text-slate-400">
              ({averageCaloriesPerDay > 0
                ? `${averageCaloriesPerDay - targetCalories > 0 ? '+' : ''}${averageCaloriesPerDay - targetCalories} kcal`
                : '0'})
            </span>
          </div>
        </div>

        {/* Total Hebdo */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          } shadow-2xs space-y-1.5`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Semaine
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950 flex items-center justify-center text-amber-600">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-800 dark:text-white">
              {totalWeeklyCalories.toLocaleString('fr-FR')}
            </span>
            <span className="text-xs font-bold text-slate-400">kcal</span>
          </div>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            {daysWithMealsCount} / 7 jours renseignés
          </p>
        </div>

        {/* Portions de fruits */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          } shadow-2xs space-y-1.5`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400">
              Fruits & Vitalité
            </span>
            <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950 flex items-center justify-center text-rose-600 text-sm">
              🍎
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-800 dark:text-white">
              {totalFruitPortions}
            </span>
            <span className="text-xs font-bold text-rose-500">portions</span>
          </div>
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            ~{(totalFruitPortions / 7).toFixed(1)} portion / jour (Objectif : 2-3)
          </p>
        </div>

        {/* Régularité / Jours dans la cible */}
        <div
          className={`p-4 sm:p-5 rounded-2xl border ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          } shadow-2xs space-y-1.5`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Régularité Cible
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center text-indigo-600">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-800 dark:text-white">
              {daysOnTargetCount} / {daysWithMealsCount || 7}
            </span>
            <span className="text-xs font-bold text-slate-400">jours</span>
          </div>
          <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            {daysOnTargetCount >= 5 ? '🎯 Excellent respect du budget' : '⚖️ Rythme équilibré'}
          </p>
        </div>
      </div>

      {/* Interactive Bar Chart Card (Monday to Sunday) */}
      <div
        className={`p-6 rounded-3xl border ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-xs space-y-4`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-extrabold text-base text-slate-800 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              Évolution Journalière des Calories
            </h3>
            <p className="text-xs text-slate-400">
              Cliquez sur une barre pour isoler le détail des repas de cette journée.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              Dans la cible
            </span>
            <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              Au-dessus
            </span>
            <span className="flex items-center gap-1.5 text-slate-400 font-medium">
              <span className="w-4 h-0.5 border-t border-dashed border-emerald-500 inline-block" />
              Ligne Cible ({targetCalories} kcal)
            </span>
          </div>
        </div>

        {/* 7-Day Bar Chart */}
        <div className="pt-4 pb-2">
          <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-48 sm:h-52 border-b border-slate-100 dark:border-slate-800 pb-2 relative">
            {/* Target Line overlay */}
            <div
              className="absolute left-0 right-0 border-t-2 border-dashed border-emerald-500/70 z-10 pointer-events-none flex items-center justify-end pr-1"
              style={{
                bottom: `${Math.min(95, Math.max(10, (targetCalories / maxCaloriesInWeek) * 100))}%`,
              }}
            >
              <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-white/90 dark:bg-slate-900/90 px-1.5 rounded-md -translate-y-2.5 shadow-2xs">
                {targetCalories} kcal
              </span>
            </div>

            {daysList.map((day) => {
              const heightPercent =
                day.totalCalories > 0
                  ? Math.min(100, Math.max(12, (day.totalCalories / maxCaloriesInWeek) * 100))
                  : 6;

              const isSelected = selectedDate === day.dateStr;
              const isOverTarget = day.totalCalories > targetCalories * 1.1;
              const hasNoMeals = day.totalCalories === 0;

              let barBg = 'bg-emerald-500 hover:bg-emerald-600';
              if (hasNoMeals) barBg = 'bg-slate-200 dark:bg-slate-800';
              else if (isOverTarget) barBg = 'bg-amber-500 hover:bg-amber-600';

              if (isSelected) {
                barBg = 'bg-emerald-600 ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900';
              }

              return (
                <div
                  key={day.dateStr}
                  onClick={() => setSelectedDate(isSelected ? null : day.dateStr)}
                  className="flex flex-col items-center h-full justify-end cursor-pointer group transition-all"
                >
                  {/* Floating Calorie Pill above bar */}
                  <span
                    className={`text-[10px] font-black mb-1 transition-opacity ${
                      isSelected
                        ? 'opacity-100 text-emerald-600 dark:text-emerald-400 font-extrabold'
                        : 'opacity-70 group-hover:opacity-100 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {day.totalCalories > 0 ? `${day.totalCalories}` : '-'}
                  </span>

                  {/* Vertical Bar */}
                  <div className="w-full max-w-[48px] bg-slate-100 dark:bg-slate-800/50 rounded-xl h-full flex items-end p-1">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-lg transition-all duration-300 ${barBg} shadow-2xs`}
                    />
                  </div>

                  {/* Day Label */}
                  <div className="mt-2 text-center">
                    <span
                      className={`text-xs font-extrabold block ${
                        day.isToday
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      {day.dayName}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      {day.dayNumber.split(' ')[0]}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedDate && (
            <div className="mt-3 flex items-center justify-between text-xs bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900">
              <span className="font-bold text-emerald-800 dark:text-emerald-300">
                Jour sélectionné :{' '}
                {daysList.find((d) => d.dateStr === selectedDate)?.dayName}{' '}
                {daysList.find((d) => d.dateStr === selectedDate)?.dayNumber}
              </span>
              <button
                type="button"
                onClick={() => setSelectedDate(null)}
                className="text-emerald-700 dark:text-emerald-300 font-extrabold underline hover:opacity-80 cursor-pointer"
              >
                Réafficher tous les jours
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Macronutrient Distribution Card */}
      <div
        className={`p-6 rounded-3xl border ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-xs space-y-4`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-800 dark:text-white flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-500" />
              Répartition des Macronutriments de la Semaine
            </h3>
            <p className="text-xs text-slate-400">
              Total cumulé et part relative des protéines, glucides et lipides.
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400 hidden sm:inline">
            Total {totalWeeklyProtein + totalWeeklyCarbs + totalWeeklyFat}g absorbés
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Protéines */}
          <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/50 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
              Protéines
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-blue-900 dark:text-blue-100">
                {totalWeeklyProtein}g
              </span>
              <span className="text-xs text-blue-600 dark:text-blue-400 font-semibold">
                (~{Math.round(totalWeeklyProtein / (daysWithMealsCount || 1))}g/j)
              </span>
            </div>
            <p className="text-[11px] text-blue-800/80 dark:text-blue-300/80">
              Maintien et développement de la masse musculaire.
            </p>
          </div>

          {/* Glucides */}
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
              Glucides
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-amber-900 dark:text-amber-100">
                {totalWeeklyCarbs}g
              </span>
              <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                (~{Math.round(totalWeeklyCarbs / (daysWithMealsCount || 1))}g/j)
              </span>
            </div>
            <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80">
              Énergie disponible pour vos journées et activités.
            </p>
          </div>

          {/* Lipides */}
          <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/50 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-300">
              Lipides
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-rose-900 dark:text-rose-100">
                {totalWeeklyFat}g
              </span>
              <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">
                (~{Math.round(totalWeeklyFat / (daysWithMealsCount || 1))}g/j)
              </span>
            </div>
            <p className="text-[11px] text-rose-800/80 dark:text-rose-300/80">
              Équilibre hormonal et assimilation des vitamines.
            </p>
          </div>
        </div>
      </div>

      {/* AI Coach Weekly Assessment Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-lg">
            🤖
          </div>
          <h4 className="font-extrabold text-sm sm:text-base">
            Le Bilan du Coach IA pour votre semaine
          </h4>
        </div>
        <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
          {averageCaloriesPerDay === 0
            ? "Commencez à enregistrer vos repas pour que le coach puisse analyser la qualité de votre alimentation hebdomadaire !"
            : averageCaloriesPerDay <= targetCalories
            ? `Bravo ${user.name || ''} ! Votre moyenne hebdomadaire (${averageCaloriesPerDay} kcal) est parfaitement alignée avec votre budget cible de ${targetCalories} kcal. Vous avez également enregistré ${totalFruitPortions} portions de fruits : maintenez ce cap pour maximiser votre satiété !`
            : `Bonne semaine ${user.name || ''} ! Votre moyenne hebdomadaire est légèrement au-dessus (${averageCaloriesPerDay} kcal vs ${targetCalories} kcal). Privilégiez des dîners riches en légumes vapeur et en protéines maigres pour rééquilibrer vos journées sans frustration.`}
        </p>
      </div>

      {/* Day by Day Detailed Meals Breakdown */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="font-extrabold text-lg text-slate-800 dark:text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600" />
            Détail des Repas par Jour ({displayedDays.length} jours affichés)
          </h3>

          {/* Quick filter by meal category */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 font-bold mr-1">Filtrer :</span>
            {(['all', 'petit_dejeuner', 'dejeuner', 'collation', 'diner'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFilterMealType(type)}
                className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  filterMealType === type
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                    : isDarkMode
                    ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {type === 'all'
                  ? 'Tous'
                  : type === 'petit_dejeuner'
                  ? 'Petit-déj'
                  : type === 'dejeuner'
                  ? 'Déjeuner'
                  : type === 'collation'
                  ? 'Collation'
                  : 'Dîner'}
              </button>
            ))}
          </div>
        </div>

        {/* Days List */}
        <div className="space-y-4">
          {displayedDays.map((day) => {
            const filteredMeals =
              filterMealType === 'all'
                ? day.meals
                : day.meals.filter((m) => m.mealType === filterMealType);

            return (
              <div
                key={day.dateStr}
                className={`p-5 rounded-3xl border transition-all ${
                  day.isToday
                    ? 'border-emerald-500/80 ring-2 ring-emerald-500/20'
                    : isDarkMode
                    ? 'bg-slate-900 border-slate-800'
                    : 'bg-white border-slate-200'
                } shadow-xs space-y-3`}
              >
                {/* Day Header Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${
                        day.isToday
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : isDarkMode
                          ? 'bg-slate-800 text-slate-300'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {day.dayName.slice(0, 3)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-base text-slate-800 dark:text-white">
                          {day.dayName} {day.dayNumber}
                        </h4>
                        {day.isToday && (
                          <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full text-[10px] font-black">
                            Aujourd'hui
                          </span>
                        )}
                        {day.fruitCount > 0 && (
                          <span className="text-xs bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 px-2 py-0.5 rounded-full font-bold">
                            🍎 {day.fruitCount} fruit{day.fruitCount > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">
                        {day.meals.length} élément{day.meals.length > 1 ? 's' : ''} enregistré{day.meals.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Day Calorie Total & Macros */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="flex items-baseline gap-1 justify-end">
                        <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                          {day.totalCalories}
                        </span>
                        <span className="text-xs font-bold text-slate-400">kcal</span>
                      </div>
                      <div className="text-[10px] text-slate-400 space-x-1.5 font-semibold">
                        <span>P: {day.totalProtein}g</span>
                        <span>•</span>
                        <span>G: {day.totalCarbs}g</span>
                        <span>•</span>
                        <span>L: {day.totalFat}g</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Day Meals List */}
                {filteredMeals.length === 0 ? (
                  <div className="py-4 text-center text-xs text-slate-400 italic">
                    Aucun repas enregistré pour ce jour avec le filtre sélectionné.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {filteredMeals.map((meal) => {
                      const cfg = getMealTypeConfig(meal.mealType);
                      const Icon = cfg.icon;

                      return (
                        <div
                          key={meal.id}
                          className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                            isDarkMode
                              ? 'bg-slate-800/60 border-slate-700/80'
                              : 'bg-slate-50/80 border-slate-200/80'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${cfg.color}`}
                            >
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                                {cfg.label}
                              </span>
                              <h5 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                                {meal.foodName}
                              </h5>
                              <span className="text-[10px] text-slate-400 block">
                                {meal.portionGrams}g • P:{meal.protein}g G:{meal.carbs}g L:{meal.fat}g
                              </span>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="font-black text-xs sm:text-sm text-emerald-600 dark:text-emerald-400 block">
                              {meal.calories} kcal
                            </span>
                            {onDeleteMeal && (
                              <button
                                type="button"
                                onClick={() => onDeleteMeal(meal.id)}
                                className="text-[10px] text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                              >
                                Supprimer
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
