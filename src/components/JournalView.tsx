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
  Calendar,
} from 'lucide-react';
import { MealEntry, MealType, UserProfile } from '../types.ts';
import { initialUser } from '../data/initialData.ts';
import { getMealTypeLabel } from '../utils/metrics.ts';
import { estimateMealFromText, MealCalculationResult } from '../utils/mealEstimator.ts';
import { useLanguage } from '../i18n/LanguageContext.tsx';
import { WeeklyMealRecap } from './WeeklyMealRecap.tsx';
import {
  BlossomFlower,
  CornerFloralFlourish,
  FlowerGardenCluster,
} from './FloralDecorations.tsx';

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
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'tomorrow' | 'week'>('today');
  const [completedMeals, setCompletedMeals] = useState<Record<string, boolean>>({
    petit_dejeuner: true,
    dejeuner: true,
    diner: false,
    collation: true,
  });
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
    '☕ Un café',
    '☕ Café au lait & 1 biscotte',
    '🥚 Une omelette et mousse chocolat',
    '🍎 Omelette nature, salade & 1 pomme',
    '🍓 Yaourt grec & fruits rouges',
    '🥩 Steak haché, haricots & 1 poire',
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

    // 1. Instant local calculation (0ms latency fallback, accurate clinical values)
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
        if (data && typeof data.calories === 'number' && data.calories >= 0) {
          // Guard: If local estimate identified a zero/low-calorie drink (<= 15 kcal like coffee/tea/water),
          // prevent AI or fallback from returning a dish-level calorie count (> 25 kcal).
          const resolvedCalories =
            localEstimate.totalCalories <= 15 && data.calories > 25
              ? localEstimate.totalCalories
              : data.calories;

          setCalories(String(resolvedCalories));
          setPortionGrams(String(data.portionGrams || localEstimate.totalPortionGrams));
          setProtein(String(data.protein ?? localEstimate.totalProtein));
          setCarbs(String(data.carbs ?? localEstimate.totalCarbs));
          setFat(String(data.fat ?? localEstimate.totalFat));
          setCalculationResult({
            foodName: data.foodName || localEstimate.foodName,
            totalCalories: resolvedCalories,
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
    const cleanFoodName = foodName.trim();
    if (!cleanFoodName) return;

    let calVal = calories;
    let protVal = protein;
    let carbsVal = carbs;
    let fatVal = fat;
    let portionVal = portionGrams;

    if (!calVal) {
      const estimate = estimateMealFromText(cleanFoodName);
      calVal = String(estimate.totalCalories);
      protVal = String(estimate.totalProtein);
      carbsVal = String(estimate.totalCarbs);
      fatVal = String(estimate.totalFat);
      portionVal = String(estimate.totalPortionGrams);
    }

    onAddMeal({
      mealType: selectedMealType,
      foodName: cleanFoodName,
      calories: parseInt(calVal, 10) || 0,
      protein: parseFloat(protVal) || 0,
      carbs: parseFloat(carbsVal) || 0,
      fat: parseFloat(fatVal) || 0,
      portionGrams: parseInt(portionVal, 10) || 100,
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
    <div id="journal-view" className="space-y-5 pb-20 max-w-4xl mx-auto">
      {/* 1. Header bar with "Mon alimentation", Calendar icon & Blossom (Screen 3) */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-[#DCE8DC] dark:border-slate-700 flex items-center justify-center text-[#163321] dark:text-emerald-300 font-bold shadow-xs">
            ‹
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[#163321] dark:text-white tracking-tight">
              Mon alimentation
            </h1>
            <BlossomFlower size={22} palette="pink" />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setSelectedPeriod('week')}
          className="w-9 h-9 rounded-full bg-white dark:bg-slate-800 border border-[#DCE8DC] dark:border-slate-700 flex items-center justify-center text-[#1F6F43] dark:text-emerald-400 hover:bg-[#EAF3EA] transition-all cursor-pointer shadow-xs"
          title="Historique & Bilan semaine"
        >
          <Calendar className="w-4 h-4" />
        </button>
      </div>

      {/* 2. Period selector tabs: [Aujourd'hui] [Demain] [Semaine] with Radiant Gradients */}
      <div className="flex items-center gap-2 max-w-md">
        <button
          type="button"
          onClick={() => setSelectedPeriod('today')}
          className={`flex-1 py-2 px-3 rounded-full text-xs font-black transition-all cursor-pointer text-center ${
            selectedPeriod === 'today'
              ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-md'
              : 'bg-[#E3ECE2] text-[#5A7363] hover:bg-[#D5E4D5]'
          }`}
        >
          Aujourd'hui
        </button>
        <button
          type="button"
          onClick={() => setSelectedPeriod('tomorrow')}
          className={`flex-1 py-2 px-3 rounded-full text-xs font-black transition-all cursor-pointer text-center ${
            selectedPeriod === 'tomorrow'
              ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-md'
              : 'bg-[#E3ECE2] text-[#5A7363] hover:bg-[#D5E4D5]'
          }`}
        >
          Demain
        </button>
        <button
          type="button"
          onClick={() => setSelectedPeriod('week')}
          className={`flex-1 py-2 px-3 rounded-full text-xs font-black transition-all cursor-pointer text-center ${
            selectedPeriod === 'week'
              ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-md'
              : 'bg-[#E3ECE2] text-[#5A7363] hover:bg-[#D5E4D5]'
          }`}
        >
          Semaine
        </button>
      </div>

      {selectedPeriod === 'week' ? (
        <WeeklyMealRecap
          meals={meals}
          user={user || initialUser}
          isDarkMode={isDarkMode}
          onBackToToday={() => setSelectedPeriod('today')}
        />
      ) : (
        <>
          {/* 3. Nutrition Goal Overview Banner (Screen 3) with Corner Floral Flourish & Botanical Gradient */}
          <div
            id="nutrition-goal-banner-card"
            className={`p-5 rounded-[26px] border relative overflow-hidden ${
              isDarkMode
                ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-[#122218] border-slate-800'
                : 'bg-gradient-to-br from-white via-[#FCFDFB] to-[#F2F8F4] border-[#E2ECE2]'
            } shadow-[0_4px_24px_rgba(31,111,67,0.05)] flex items-center gap-5`}
          >
            <CornerFloralFlourish className="opacity-70 dark:opacity-40" />

            {/* Salad bowl image thumbnail with colorful border */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden shrink-0 shadow-xs border-2 border-emerald-200 dark:border-slate-700 p-0.5 bg-gradient-to-tr from-emerald-400 via-teal-300 to-amber-300">
              <img
                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80"
                alt="Salade équilibrée"
                className="w-full h-full object-cover rounded-full"
                loading="lazy"
              />
            </div>

            {/* Nutrition checklist */}
            <div className="space-y-1.5 flex-1 relative z-10">
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-extrabold text-[#5A7363] dark:text-slate-300">
                  Votre objectif nutritionnel
                </h3>
                <BlossomFlower size={15} palette="emerald" />
              </div>
              <div className="space-y-1 text-xs font-black text-[#163321] dark:text-white">
                <div className="flex items-center gap-2">
                  <span className="text-[#10B981] dark:text-emerald-400 font-bold">✔</span>
                  <span>1 800 kcal</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#10B981] dark:text-emerald-400 font-bold">✔</span>
                  <span>Protéines : 90 g</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#10B981] dark:text-emerald-400 font-bold">✔</span>
                  <span>Fibres : 25 g</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Meal Checklist Cards (Screen 3) */}
          <div className="space-y-3">
            {/* Meal 1: Petit-déjeuner */}
            <div
              id="meal-card-petit-dejeuner"
              onClick={() => handleOpenAddModal('petit_dejeuner')}
              className={`p-4 rounded-[24px] border ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#E2ECE2]'
              } shadow-xs flex items-center justify-between gap-3 hover:border-emerald-300 transition-all cursor-pointer group`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 shadow-xs border border-[#E5EFE5]">
                  <img
                    src="https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=260&q=80"
                    alt="Petit-déjeuner"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-500 text-xs">☀️</span>
                    <span className="font-black text-sm text-[#163321] dark:text-white">
                      Petit-déjeuner
                    </span>
                    <span className="text-xs font-bold text-[#5A7363] dark:text-slate-400">
                      350 / 400 kcal
                    </span>
                  </div>
                  <p className="text-xs text-[#5A7363] dark:text-slate-400 font-semibold truncate mt-0.5">
                    Flocons d'avoine, fruits rouges, yaourt nature
                  </p>
                </div>
              </div>

              {/* Status Circle */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCompletedMeals((prev) => ({ ...prev, petit_dejeuner: !prev.petit_dejeuner }));
                }}
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 cursor-pointer transition-all"
              >
                {completedMeals.petit_dejeuner ? (
                  <div className="w-6 h-6 rounded-full bg-[#1F6F43] text-white flex items-center justify-center text-xs font-black shadow-xs">
                    ✓
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                )}
              </button>
            </div>

            {/* Meal 2: Déjeuner */}
            <div
              id="meal-card-dejeuner"
              onClick={() => handleOpenAddModal('dejeuner')}
              className={`p-4 rounded-[24px] border ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#E2ECE2]'
              } shadow-xs flex items-center justify-between gap-3 hover:border-emerald-300 transition-all cursor-pointer group`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 shadow-xs border border-[#E5EFE5]">
                  <img
                    src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=260&q=80"
                    alt="Déjeuner"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-amber-500 text-xs">☀️</span>
                    <span className="font-black text-sm text-[#163321] dark:text-white">
                      Déjeuner
                    </span>
                    <span className="text-xs font-bold text-[#5A7363] dark:text-slate-400">
                      520 / 600 kcal
                    </span>
                  </div>
                  <p className="text-xs text-[#5A7363] dark:text-slate-400 font-semibold truncate mt-0.5">
                    Salade quinoa, avocat, saumon
                  </p>
                </div>
              </div>

              {/* Status Circle */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCompletedMeals((prev) => ({ ...prev, dejeuner: !prev.dejeuner }));
                }}
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 cursor-pointer transition-all"
              >
                {completedMeals.dejeuner ? (
                  <div className="w-6 h-6 rounded-full bg-[#1F6F43] text-white flex items-center justify-center text-xs font-black shadow-xs">
                    ✓
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                )}
              </button>
            </div>

            {/* Meal 3: Dîner */}
            <div
              id="meal-card-diner"
              onClick={() => handleOpenAddModal('diner')}
              className={`p-4 rounded-[24px] border ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#E2ECE2]'
              } shadow-xs flex items-center justify-between gap-3 hover:border-emerald-300 transition-all cursor-pointer group`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 shadow-xs border border-[#E5EFE5]">
                  <img
                    src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=260&q=80"
                    alt="Dîner"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-indigo-400 text-xs">🌙</span>
                    <span className="font-black text-sm text-[#163321] dark:text-white">
                      Dîner
                    </span>
                    <span className="text-xs font-bold text-[#5A7363] dark:text-slate-400">
                      450 / 500 kcal
                    </span>
                  </div>
                  <p className="text-xs text-[#5A7363] dark:text-slate-400 font-semibold truncate mt-0.5">
                    Filet de poulet, légumes vapeur
                  </p>
                </div>
              </div>

              {/* Status Circle */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCompletedMeals((prev) => ({ ...prev, diner: !prev.diner }));
                }}
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 cursor-pointer transition-all"
              >
                {completedMeals.diner ? (
                  <div className="w-6 h-6 rounded-full bg-[#1F6F43] text-white flex items-center justify-center text-xs font-black shadow-xs">
                    ✓
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                )}
              </button>
            </div>

            {/* Meal 4: Collation */}
            <div
              id="meal-card-collation"
              onClick={() => handleOpenAddModal('collation')}
              className={`p-4 rounded-[24px] border ${
                isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#E2ECE2]'
              } shadow-xs flex items-center justify-between gap-3 hover:border-emerald-300 transition-all cursor-pointer group`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 shadow-xs border border-[#E5EFE5]">
                  <img
                    src="https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=260&q=80"
                    alt="Collation"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-rose-500 text-xs">🍎</span>
                    <span className="font-black text-sm text-[#163321] dark:text-white">
                      Collation
                    </span>
                    <span className="text-xs font-bold text-[#5A7363] dark:text-slate-400">
                      120 / 200 kcal
                    </span>
                  </div>
                  <p className="text-xs text-[#5A7363] dark:text-slate-400 font-semibold truncate mt-0.5">
                    Pomme
                  </p>
                </div>
              </div>

              {/* Status Circle */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setCompletedMeals((prev) => ({ ...prev, collation: !prev.collation }));
                }}
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 cursor-pointer transition-all"
              >
                {completedMeals.collation ? (
                  <div className="w-6 h-6 rounded-full bg-[#1F6F43] text-white flex items-center justify-center text-xs font-black shadow-xs">
                    ✓
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-slate-300 dark:border-slate-600" />
                )}
              </button>
            </div>
          </div>

          {/* 5. Primary Full-width CTA: Ajouter un aliment + with Vibrant Gradient */}
          <button
            type="button"
            id="btn-journal-add-food-full"
            onClick={() => handleOpenAddModal('dejeuner')}
            className="w-full h-14 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-full font-black text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 active:scale-[0.99] transition-all cursor-pointer"
          >
            <span>Ajouter un aliment</span>
            <span className="text-lg font-bold">+</span>
            <span className="text-sm">🌸</span>
          </button>

          {/* Supporting tools bar: Code-barres, Scanner IA, Vider */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              id="btn-journal-barcode-scanner"
              onClick={onOpenBarcodeScanner}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-white dark:bg-slate-800 border border-[#DCE8DC] dark:border-slate-700 text-[#163321] dark:text-slate-200 hover:bg-[#EAF3EA] transition-all cursor-pointer shadow-xs"
            >
              <Barcode className="w-3.5 h-3.5 text-[#1F6F43]" />
              <span>Code-barres</span>
            </button>
            <button
              type="button"
              id="btn-journal-ai-scanner"
              onClick={onOpenAiScan}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-[#EAF3EA] dark:bg-emerald-950/60 border border-[#D5E4D5] dark:border-emerald-800 text-[#1F6F43] dark:text-emerald-300 hover:bg-[#D5EBD5] transition-all cursor-pointer shadow-xs"
            >
              <Camera className="w-3.5 h-3.5 text-[#1F6F43]" />
              <span>Scanner Photo IA</span>
            </button>
            {todayMeals.length > 0 && onResetTodayMeals && (
              <button
                type="button"
                onClick={onResetTodayMeals}
                className="flex items-center gap-1 px-3 py-2 rounded-full text-xs font-semibold text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                title="Vider aujourd'hui"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Vider</span>
              </button>
            )}
          </div>
        </>
      )}

      {/* Custom Logged Items Detailed Breakdown (Collapsible) */}
      {todayMeals.length > 0 && (
        <details className="group bg-white dark:bg-slate-900 border border-[#E2ECE2] dark:border-slate-800 rounded-[24px] p-4 text-xs">
          <summary className="font-extrabold text-[#5A7363] dark:text-slate-300 cursor-pointer select-none flex items-center justify-between">
            <span>Détail des {todayMeals.length} aliments enregistrés ({totalCaloriesConsumedToday} kcal)</span>
            <span className="text-[#1F6F43] group-open:rotate-180 transition-transform">▼</span>
          </summary>
          <div className="mt-3 divide-y divide-[#EDF3ED] dark:divide-slate-800">
            {todayMeals.map((m) => (
              <div key={m.id} className="py-2.5 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="font-bold text-[#163321] dark:text-white block truncate">{m.foodName}</span>
                  <span className="text-[10px] text-slate-400 font-semibold">
                    {getMealTypeLabel(m.mealType)} • {m.portionGrams}g • P:{m.protein}g G:{m.carbs}g L:{m.fat}g
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-black text-[#1F6F43] dark:text-emerald-400">{m.calories} kcal</span>
                  <button
                    type="button"
                    onClick={() => onDeleteMeal(m.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer"
                    title="Supprimer cet aliment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </details>
      )}
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
