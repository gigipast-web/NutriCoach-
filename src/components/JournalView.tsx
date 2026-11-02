import React, { useState, useMemo } from 'react';
import {
  Coffee,
  Utensils,
  Apple,
  Moon,
  Plus,
  Trash2,
  Barcode,
  Camera,
  X,
  Sparkles,
  Loader2,
  CheckCircle2,
  Scale,
  Flame,
  RotateCcw,
} from 'lucide-react';
import { MealEntry, MealType, UserProfile } from '../types.ts';
import { initialUser } from '../data/initialData.ts';
import { getMealTypeLabel } from '../utils/metrics.ts';
import { estimateMealFromText, MealCalculationResult } from '../utils/mealEstimator.ts';
import { useLanguage } from '../i18n/LanguageContext.tsx';
import { WeeklyMealRecap } from './WeeklyMealRecap.tsx';

interface JournalViewProps {
  user?: UserProfile;
  meals: MealEntry[];
  initialSubTab?: 'today' | 'weekly';
  onAddMeal: (meal: Omit<MealEntry, 'id'>) => void;
  onDeleteMeal: (id: string) => void;
  onResetTodayMeals?: () => void;
  onOpenBarcodeScanner: () => void;
  onOpenAiScan: () => void;
  isDarkMode: boolean;
}

export const JournalView: React.FC<JournalViewProps> = ({
  user,
  meals,
  initialSubTab,
  onAddMeal,
  onDeleteMeal,
  onResetTodayMeals,
  onOpenBarcodeScanner,
  onOpenAiScan,
  isDarkMode,
}) => {
  const { t } = useLanguage();
  const [activeSubTab, setActiveSubTab] = useState<'today' | 'weekly'>(initialSubTab || 'today');
  const [selectedMealType, setSelectedMealType] = useState<MealType>('petit_dejeuner');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [portionGrams, setPortionGrams] = useState('150');

  // Smart calculation state
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationResult, setCalculationResult] = useState<MealCalculationResult | null>(null);

  const mealTypesConfig: Array<{
    type: MealType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }> = [
    { type: 'petit_dejeuner', label: 'Petit-déjeuner', icon: Coffee, color: 'from-amber-500 to-orange-500' },
    { type: 'dejeuner', label: 'Déjeuner', icon: Utensils, color: 'from-emerald-500 to-teal-500' },
    { type: 'collation', label: 'Collation', icon: Apple, color: 'from-violet-500 to-purple-500' },
    { type: 'diner', label: 'Dîner', icon: Moon, color: 'from-indigo-500 to-blue-500' },
  ];

  const FRESH_FRUITS = [
    { emoji: '🍎', name: '1 Pomme', kcal: 52, grams: 150 },
    { emoji: '🍊', name: '1 Clémentine', kcal: 38, grams: 80 },
    { emoji: '🍓', name: 'Fruits rouges', kcal: 38, grams: 100 },
    { emoji: '🥝', name: '1 Kiwi', kcal: 42, grams: 75 },
    { emoji: '🍌', name: '1/2 Banane', kcal: 45, grams: 60 },
    { emoji: '🍐', name: '1 Poire', kcal: 57, grams: 120 },
  ];

  const quickMealExamples = [
    '🥚 Une omelette et mousse chocolat',
    '🍎 Omelette nature, salade & 1 pomme',
    '🍓 Yaourt grec & fruits rouges',
    '🥩 Steak haché, haricots & 1 poire',
    '🐟 Pavé de saumon, riz & 1 kiwi',
  ];

  const handleOpenAddModal = (type: MealType) => {
    setSelectedMealType(type);
    setFoodName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setPortionGrams('150');
    setCalculationResult(null);
    setIsAddModalOpen(true);
  };

  /**
   * Automatically calculates calories, quantity and macros from food description
   */
  const handleCalculateMeal = async (customText?: string) => {
    const textToCalculate = (customText ?? foodName).trim();
    if (!textToCalculate) return;

    setIsCalculating(true);

    // 1. Instant local calculation (0ms latency fallback)
    const localEstimate = estimateMealFromText(textToCalculate);
    setCalories(String(localEstimate.totalCalories));
    setPortionGrams(String(localEstimate.totalPortionGrams));
    setProtein(String(localEstimate.totalProtein));
    setCarbs(String(localEstimate.totalCarbs));
    setFat(String(localEstimate.totalFat));
    setCalculationResult(localEstimate);

    // 2. Refine with Gemini AI backend if available
    try {
      const res = await fetch('/api/ai/calculate-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mealText: textToCalculate }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && typeof data.calories === 'number' && data.calories > 0) {
          setCalories(String(data.calories));
          setPortionGrams(String(data.portionGrams || localEstimate.totalPortionGrams));
          setProtein(String(data.protein ?? localEstimate.totalProtein));
          setCarbs(String(data.carbs ?? localEstimate.totalCarbs));
          setFat(String(data.fat ?? localEstimate.totalFat));
          setCalculationResult({
            foodName: data.foodName || localEstimate.foodName,
            totalCalories: data.calories,
            totalPortionGrams: data.portionGrams || localEstimate.totalPortionGrams,
            totalProtein: data.protein ?? localEstimate.totalProtein,
            totalCarbs: data.carbs ?? localEstimate.totalCarbs,
            totalFat: data.fat ?? localEstimate.totalFat,
            items: Array.isArray(data.items) && data.items.length > 0 ? data.items : localEstimate.items,
            explanation: data.explanation || localEstimate.explanation,
            isAiRefined: true,
          });
        }
      }
    } catch (err) {
      // Local estimate already in place
    } finally {
      setIsCalculating(false);
    }
  };

  const handleApplyExample = (example: string) => {
    // Strip leading emoji if present
    const cleanName = example.replace(/^[\p{Emoji}\s]+/u, '').trim();
    setFoodName(cleanName);
    handleCalculateMeal(cleanName);
  };

  /**
   * Proposes and instantly adds a fresh fruit portion to the meal
   */
  const handleAddFruitToMeal = (fruitName: string) => {
    const current = foodName.trim();
    let updated = '';
    if (!current) {
      updated = fruitName;
    } else if (!current.toLowerCase().includes(fruitName.toLowerCase())) {
      updated = `${current} & ${fruitName}`;
    } else {
      updated = current;
    }
    setFoodName(updated);
    handleCalculateMeal(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName || !calories) return;

    onAddMeal({
      mealType: selectedMealType,
      foodName,
      calories: parseInt(calories, 10) || 0,
      protein: parseFloat(protein) || 0,
      carbs: parseFloat(carbs) || 0,
      fat: parseFloat(fat) || 0,
      portionGrams: parseInt(portionGrams, 10) || 100,
      timestamp: new Date().toISOString(),
    });

    setFoodName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setCalculationResult(null);
    setIsAddModalOpen(false);
  };

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const todayMeals = useMemo(() => {
    return meals.filter((m) => m.timestamp && m.timestamp.startsWith(todayStr));
  }, [meals, todayStr]);

  const totalCaloriesConsumedToday = todayMeals.reduce((acc, m) => acc + m.calories, 0);

  // If user selected Weekly Recap mode, render full weekly breakdown component
  if (activeSubTab === 'weekly') {
    return (
      <div id="journal-view-weekly-container" className="space-y-6">
        {/* Subtab toggle bar */}
        <div className="flex items-center justify-between">
          <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
            <button
              type="button"
              id="btn-journal-tab-today"
              onClick={() => setActiveSubTab('today')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all cursor-pointer"
            >
              📅 Aujourd'hui
            </button>
            <button
              type="button"
              id="btn-journal-tab-weekly"
              className="px-4 py-2 rounded-xl text-xs font-black bg-emerald-600 text-white shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>📊 Récapitulatif Semaine</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full">7j</span>
            </button>
          </div>
        </div>

        <WeeklyMealRecap
          meals={meals}
          user={user || initialUser}
          isDarkMode={isDarkMode}
          onBackToToday={() => setActiveSubTab('today')}
          onDeleteMeal={onDeleteMeal}
        />
      </div>
    );
  }

  return (
    <div id="journal-view" className="space-y-6 pb-12">
      {/* Subtab Switcher & Header bar */}
      <div className="flex items-center justify-between">
        <div className="inline-flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs">
          <button
            type="button"
            className="px-4 py-2 rounded-xl text-xs font-black bg-emerald-600 text-white shadow-xs transition-all cursor-pointer"
          >
            📅 Aujourd'hui
          </button>
          <button
            type="button"
            id="btn-switch-to-weekly-recap"
            onClick={() => setActiveSubTab('weekly')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>📊 Récapitulatif Semaine</span>
            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.2 rounded-full font-black">
              7j
            </span>
          </button>
        </div>
      </div>

      {/* Header bar */}
      <div
        className={`p-6 rounded-3xl border ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4`}
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-3 py-1 rounded-full text-xs font-bold">
              Journal Nutritionnel
            </span>
            <span className="text-xs text-slate-400">Aujourd'hui</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-white">Suivi des Repas</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Total consommé aujourd'hui :{' '}
            <strong className="text-emerald-600 font-bold">{totalCaloriesConsumedToday} kcal</strong>
            {todayMeals.length === 0 ? (
              <span className="ml-2 text-slate-400 font-medium italic">• Champs vides au réveil (prêts pour vos repas)</span>
            ) : (
              <span className="ml-2 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold">
                • {todayMeals.length} aliment{todayMeals.length > 1 ? 's' : ''} noté{todayMeals.length > 1 ? 's' : ''}
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {todayMeals.length > 0 && onResetTodayMeals && (
            <button
              type="button"
              id="btn-journal-reset-today"
              onClick={onResetTodayMeals}
              className={`flex items-center gap-1.5 border px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-slate-400 hover:text-rose-500 hover:border-rose-300 dark:hover:border-rose-800 ${
                isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'
              }`}
              title="Vider les repas du jour pour repartir à zéro (conserve l'historique de la semaine)"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Vider aujourd'hui</span>
            </button>
          )}

          <button
            id="btn-journal-barcode-scanner"
            onClick={onOpenBarcodeScanner}
            className={`flex items-center gap-2 border px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isDarkMode
                ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200'
                : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
            }`}
          >
            <Barcode className="w-4 h-4 text-emerald-600" />
            Code-barres
          </button>
          <button
            id="btn-journal-ai-scanner"
            onClick={onOpenAiScan}
            className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md transition-all cursor-pointer hover:opacity-90"
          >
            <Camera className="w-4 h-4 text-amber-300" />
            Scanner Repas IA
          </button>
        </div>
      </div>

      {/* Weekly Recap CTA Banner */}
      <div
        id="banner-weekly-recap-cta"
        onClick={() => setActiveSubTab('weekly')}
        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
          isDarkMode
            ? 'bg-slate-900 hover:bg-slate-850 border-slate-800'
            : 'bg-emerald-50/70 hover:bg-emerald-100/70 border-emerald-200/80'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-lg shadow-xs shrink-0">
            📊
          </div>
          <div>
            <h4 className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-white">
              Bilan & Récapitulatif de la Semaine disponible
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Vos repas des jours précédents sont soigneusement conservés. Moyennes, calories et macronutriments sur 7 jours.
            </p>
          </div>
        </div>
        <span className="text-xs font-black text-emerald-700 dark:text-emerald-300 bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-emerald-200 dark:border-emerald-800 shrink-0 shadow-2xs">
          Ouvrir le bilan →
        </span>
      </div>

      {/* Grid of Meal Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mealTypesConfig.map((item) => {
          const mealsForType = todayMeals.filter((m) => m.mealType === item.type);
          const typeCalories = mealsForType.reduce((acc, m) => acc + m.calories, 0);
          const Icon = item.icon;

          return (
            <div
              key={item.type}
              id={`meal-category-card-${item.type}`}
              className={`p-5 rounded-2xl border transition-all ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              } shadow-xs space-y-4`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shadow-xs`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-800 dark:text-white">{item.label}</h3>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {typeCalories} kcal
                    </span>
                  </div>
                </div>
                <button
                  id={`btn-add-meal-to-${item.type}`}
                  onClick={() => handleOpenAddModal(item.type)}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Ajouter
                </button>
              </div>

              {mealsForType.length === 0 ? (
                <div className="py-6 text-center text-slate-400 text-xs italic space-y-1">
                  <p>Aucun aliment enregistré aujourd'hui pour le {item.label.toLowerCase()}.</p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold not-italic">
                    Cliquez sur « + Ajouter » ou scannez votre repas
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {mealsForType.map((meal) => (
                    <div
                      key={meal.id}
                      className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                        isDarkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-slate-50 border-slate-100'
                      }`}
                    >
                      <div>
                        <span className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 block">
                          {meal.foodName}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {meal.portionGrams}g • P: {meal.protein}g • G: {meal.carbs}g • L: {meal.fat}g
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-black text-xs sm:text-sm text-slate-900 dark:text-white">
                          {meal.calories} kcal
                        </span>
                        <button
                          id={`btn-delete-meal-${meal.id}`}
                          onClick={() => onDeleteMeal(meal.id)}
                          className="text-slate-400 hover:text-rose-500 p-1 rounded-md transition-colors cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Meal Modal with Instant Calorie & Quantity Calculator */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div
            className={`w-full max-w-lg p-5 sm:p-6 rounded-3xl border shadow-2xl transition-all my-8 ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-black text-lg">
                  {t('modalAddMealTitle', { meal: getMealTypeLabel(selectedMealType) })}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Tapez simplement ce que vous mangez (ex : <em>une omelette et mousse chocolat</em>). Les calories et quantités sont calculées directement !
            </p>

            {/* Quick Suggestions Chips */}
            <div className="mb-4">
              <span className="text-[11px] font-bold text-slate-400 block mb-1.5">
                {t('quickSuggestions')}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickMealExamples.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => handleApplyExample(ex)}
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/60 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 hover:border-emerald-300 transition-colors cursor-pointer"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Food / Meal Name Input + Direct Calculate Button */}
              <div>
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                  {t('modalFoodNameLabel')}
                </label>
                <div className="relative">
                  <input
                    id="input-food-name"
                    type="text"
                    required
                    placeholder={t('modalFoodNamePlaceholder')}
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !calories) {
                        e.preventDefault();
                        handleCalculateMeal();
                      }
                    }}
                    className={`w-full p-3 pr-28 rounded-xl border text-sm font-medium outline-hidden focus:ring-2 focus:ring-emerald-500 ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                  <button
                    id="btn-calculate-meal-direct"
                    type="button"
                    onClick={() => handleCalculateMeal()}
                    disabled={!foodName.trim() || isCalculating}
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isCalculating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span className="hidden sm:inline">{t('btnCalculating')}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Calculer</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Automatic Calculation Breakdown Card */}
              {calculationResult && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 border border-emerald-200/80 dark:border-emerald-800/80 space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between text-xs font-black text-emerald-800 dark:text-emerald-300">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      {t('calcConfidence')}
                    </span>
                    <span className="text-emerald-700 dark:text-emerald-300 bg-white/80 dark:bg-emerald-900/60 px-2 py-0.5 rounded-md text-[11px] font-bold">
                      {calculationResult.totalCalories} kcal • {calculationResult.totalPortionGrams}g
                    </span>
                  </div>

                  {calculationResult.items && calculationResult.items.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block">
                        {t('calcBreakdownTitle')}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {calculationResult.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-white/90 dark:bg-slate-800/90 border border-emerald-100 dark:border-emerald-900/50 text-xs"
                          >
                            <span className="font-semibold text-slate-700 dark:text-slate-200 truncate pr-2">
                              {item.name}
                            </span>
                            <span className="font-bold text-emerald-700 dark:text-emerald-400 shrink-0">
                              {item.portionGrams}g • ~{item.calories} kcal
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Eat More Fruits Coach Proposal & Quick Add */}
              <div className="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/90 dark:border-amber-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">🍎</span>
                    <h4 className="text-xs font-black text-amber-950 dark:text-amber-200">
                      {t('fruitSuggestionTitle')}
                    </h4>
                  </div>
                  <span className="text-[10px] font-extrabold text-amber-800 dark:text-amber-300 bg-amber-200/70 dark:bg-amber-900/70 px-2 py-0.5 rounded-md">
                    Satiété & Vitamines
                  </span>
                </div>
                <p className="text-[11px] text-amber-900/80 dark:text-amber-300/80 leading-snug">
                  {t('fruitSuggestionDesc')}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {FRESH_FRUITS.map((fruit) => (
                    <button
                      key={fruit.name}
                      type="button"
                      onClick={() => handleAddFruitToMeal(fruit.name)}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-700/60 hover:border-amber-400 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-amber-100/60 dark:hover:bg-amber-900/40 transition-all flex items-center gap-1 cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
                      title={`Ajouter ${fruit.name} à ce repas`}
                    >
                      <span>{fruit.emoji}</span>
                      <span>+ {fruit.name}</span>
                      <span className="text-[10px] font-normal text-slate-400 dark:text-slate-400">
                        (~{fruit.kcal} kcal)
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Calories & Portion inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    <span className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      {t('modalCaloriesLabel')}
                    </span>
                  </label>
                  <input
                    id="input-food-calories"
                    type="number"
                    required
                    placeholder="ex: 425"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border text-sm font-bold outline-hidden focus:ring-2 focus:ring-emerald-500 ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1">
                    <span className="flex items-center gap-1">
                      <Scale className="w-3.5 h-3.5 text-emerald-500" />
                      {t('modalPortionLabel')}
                    </span>
                  </label>
                  <input
                    id="input-food-portion"
                    type="number"
                    placeholder="ex: 240"
                    value={portionGrams}
                    onChange={(e) => setPortionGrams(e.target.value)}
                    className={`w-full p-2.5 rounded-xl border text-sm font-bold outline-hidden focus:ring-2 focus:ring-emerald-500 ${
                      isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Macronutrients */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 block mb-1">
                  Macronutriments (g)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">
                      {t('modalProteinLabel')}
                    </label>
                    <input
                      id="input-food-protein"
                      type="number"
                      step="0.1"
                      placeholder="18"
                      value={protein}
                      onChange={(e) => setProtein(e.target.value)}
                      className={`w-full p-2 rounded-lg border text-xs outline-hidden focus:ring-2 focus:ring-emerald-500 ${
                        isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">
                      {t('modalCarbsLabel')}
                    </label>
                    <input
                      id="input-food-carbs"
                      type="number"
                      step="0.1"
                      placeholder="25"
                      value={carbs}
                      onChange={(e) => setCarbs(e.target.value)}
                      className={`w-full p-2 rounded-lg border text-xs outline-hidden focus:ring-2 focus:ring-emerald-500 ${
                        isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">
                      {t('modalFatLabel')}
                    </label>
                    <input
                      id="input-food-fat"
                      type="number"
                      step="0.1"
                      placeholder="28"
                      value={fat}
                      onChange={(e) => setFat(e.target.value)}
                      className={`w-full p-2 rounded-lg border text-xs outline-hidden focus:ring-2 focus:ring-emerald-500 ${
                        isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  {t('btnCancel')}
                </button>
                <button
                  id="btn-save-custom-meal"
                  type="submit"
                  disabled={!foodName.trim() || !calories}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-40 text-white font-black text-xs shadow-md transition-all cursor-pointer disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('btnSaveMeal')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
