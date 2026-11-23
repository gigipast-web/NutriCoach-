import React, { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  Flame,
  ShoppingCart,
  Plus,
  Check,
  X,
  Sparkles,
  Calendar,
  Loader2,
  Award,
  ChefHat,
} from 'lucide-react';
import { Recipe, UserProfile } from '../types.ts';
import { getWeekDateRangeLabel, getCurrentWeekTheme, getIsoWeekNumber } from '../data/weeklyRecipes.ts';
import { useLanguage } from '../i18n/LanguageContext.tsx';
import { getRecipesUi } from '../i18n/recipesI18n.ts';
import { getUiCore } from '../i18n/uiCoreI18n.ts';
import {
  getStaticRecipeTranslation,
  getStaticWeekTheme,
  getStaticShoppingItems,
} from '../i18n/recipeCatalogTranslations.ts';

interface RecipesViewProps {
  recipes: Recipe[];
  user: UserProfile;
  onAddMealFromRecipe: (recipe: Recipe) => void;
  onAddNewWeeklyRecipes?: (newRecipes: Recipe[]) => void;
  isDarkMode: boolean;
}

interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  checked: boolean;
}

interface TranslatedRecipeFields {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  tags?: string[];
}

interface LanguageCachePayload {
  weekTheme?: string;
  recipes: Record<string, TranslatedRecipeFields>;
}

const getCacheKey = (lang: string, weekNum: number) => `nutricoach_recipes_i18n_${lang}_w${weekNum}`;

export const RecipesView: React.FC<RecipesViewProps> = ({
  recipes,
  user,
  onAddMealFromRecipe,
  onAddNewWeeklyRecipes,
  isDarkMode,
}) => {
  const { language } = useLanguage();
  const ui = useMemo(() => getRecipesUi(language), [language]);

  const [selectedCategory, setSelectedCategory] = useState<string>('nouveautes_semaine');
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isGeneratingRecipes, setIsGeneratingRecipes] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const currentWeekNumber = getIsoWeekNumber();
  const currentWeekLabel = getWeekDateRangeLabel(new Date(), language);
  const baseWeekTheme = getCurrentWeekTheme(currentWeekNumber);
  const staticWeekTheme = getStaticWeekTheme(currentWeekNumber, language);

  const [translatedMap, setTranslatedMap] = useState<Record<string, TranslatedRecipeFields>>({});
  const [translatedTheme, setTranslatedTheme] = useState<string>(staticWeekTheme);

  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(() =>
    getStaticShoppingItems(language)
  );

  // Sync default starter shopping items (s1..s5) when language changes, preserving checked & user-added items
  useEffect(() => {
    const localizedDefaults = getStaticShoppingItems(language);
    const defaultById = new Map(localizedDefaults.map((item) => [item.id, item]));
    setShoppingList((prev) =>
      prev.map((item) => {
        const match = defaultById.get(item.id);
        if (!match) return item;
        return {
          ...item,
          name: match.name,
          quantity: match.quantity,
          category: match.category,
        };
      })
    );
  }, [language]);

  // Translate custom/AI recipes dynamically via API when language !== 'fr' and not covered by static catalog
  useEffect(() => {
    if (language === 'fr') {
      setTranslatedMap({});
      setTranslatedTheme(baseWeekTheme);
      setIsTranslating(false);
      return;
    }

    let cancelled = false;
    const cacheKey = getCacheKey(language, currentWeekNumber);
    let cached: LanguageCachePayload = { recipes: {} };

    try {
      const raw = localStorage.getItem(cacheKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          cached = {
            weekTheme: parsed.weekTheme,
            recipes: parsed.recipes || {},
          };
        }
      }
    } catch {
      // Ignore malformed cache
    }

    setTranslatedMap(cached.recipes);
    setTranslatedTheme(staticWeekTheme || cached.weekTheme || baseWeekTheme);

    const missingRecipes = recipes.filter(
      (r) => !getStaticRecipeTranslation(r.id, language) && !cached.recipes[r.id]
    );

    if (missingRecipes.length === 0) {
      setIsTranslating(false);
      return;
    }

    const translateMissing = async () => {
      setIsTranslating(true);
      try {
        const chunkSize = 10;
        let updatedRecipes = { ...cached.recipes };

        const chunks: Recipe[][] = [];
        for (let i = 0; i < missingRecipes.length; i += chunkSize) {
          chunks.push(missingRecipes.slice(i, i + chunkSize));
        }

        for (let idx = 0; idx < chunks.length; idx++) {
          if (cancelled) return;
          const chunk = chunks[idx];
          const res = await fetch('/api/ai/translate-recipes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              recipes: chunk.map((r) => ({
                id: r.id,
                title: r.title,
                description: r.description,
                ingredients: r.ingredients,
                instructions: r.instructions,
                tags: r.tags,
              })),
              targetLanguage: language,
            }),
          });

          if (!res.ok) continue;
          const data = await res.json();

          if (data?.translations && typeof data.translations === 'object') {
            updatedRecipes = { ...updatedRecipes, ...data.translations };
          }

          if (!cancelled) {
            setTranslatedMap(updatedRecipes);
            try {
              localStorage.setItem(
                cacheKey,
                JSON.stringify({ weekTheme: staticWeekTheme, recipes: updatedRecipes })
              );
            } catch {
              // Ignore storage quota errors
            }
          }
        }
      } catch (err) {
        console.warn('Recipe translation error:', err);
      } finally {
        if (!cancelled) {
          setIsTranslating(false);
        }
      }
    };

    translateMissing();

    return () => {
      cancelled = true;
    };
  }, [language, recipes, baseWeekTheme, staticWeekTheme, currentWeekNumber]);

  const getLocalizedRecipe = (recipe: Recipe): Recipe => {
    if (language === 'fr') return recipe;
    const tr = translatedMap[recipe.id] || getStaticRecipeTranslation(recipe.id, language);
    if (!tr) return recipe;
    return {
      ...recipe,
      title: tr.title || recipe.title,
      description: tr.description || recipe.description,
      ingredients: tr.ingredients && tr.ingredients.length > 0 ? tr.ingredients : recipe.ingredients,
      instructions: tr.instructions && tr.instructions.length > 0 ? tr.instructions : recipe.instructions,
      tags: tr.tags && tr.tags.length > 0 ? tr.tags : recipe.tags,
    };
  };

  const categories = [
    { id: 'nouveautes_semaine', label: ui.catWeekly },
    { id: 'all', label: ui.catAll },
    { id: 'riches_proteines', label: ui.catProtein },
    { id: 'faibles_calories', label: ui.catLowCal },
    { id: 'vegetarienne', label: ui.catVeg },
    { id: 'sans_gluten', label: ui.catGlutenFree },
    { id: 'express', label: ui.catExpress },
  ];

  const filteredRecipes = recipes.filter((r) => {
    if (selectedCategory === 'nouveautes_semaine') {
      return r.isNewThisWeek || r.tags?.some((t) => t.toLowerCase().includes('semaine'));
    }
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'sans_gluten') {
      return (
        r.category === 'sans_gluten' ||
        r.tags?.some((t) => t.toLowerCase().includes('gluten')) ||
        r.title.toLowerCase().includes('sans gluten') ||
        r.title.toLowerCase().includes('sarrasin') ||
        r.title.toLowerCase().includes('quinoa')
      );
    }
    if (selectedCategory === 'vegetarienne') {
      return (
        r.category === 'vegetarienne' ||
        r.tags?.some((t) => t.toLowerCase().includes('végé'))
      );
    }
    if (selectedCategory === 'riches_proteines') {
      return (
        r.category === 'riches_proteines' ||
        r.tags?.some((t) => t.toLowerCase().includes('protéine')) ||
        r.protein >= 30
      );
    }
    if (selectedCategory === 'faibles_calories') {
      return r.category === 'faibles_calories' || r.calories <= 350;
    }
    if (selectedCategory === 'express') {
      return r.category === 'express' || r.prepTimeMinutes <= 15;
    }
    return r.category === selectedCategory;
  });

  const localizedFilteredRecipes = filteredRecipes.map(getLocalizedRecipe);
  const selectedRecipeRaw = selectedRecipeId ? recipes.find((r) => r.id === selectedRecipeId) || null : null;
  const selectedRecipe = selectedRecipeRaw ? getLocalizedRecipe(selectedRecipeRaw) : null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddMeal = (recipe: Recipe) => {
    const loc = getLocalizedRecipe(recipe);
    onAddMealFromRecipe(loc);
    showToast(`"${loc.title}" ${ui.toastAddedMeal}`);
  };

  const handleAddIngredientsToShopping = (recipe: Recipe) => {
    const loc = getLocalizedRecipe(recipe);
    const newItems: ShoppingItem[] = loc.ingredients.map((ing, idx) => ({
      id: `shop_${Date.now()}_${idx}`,
      name: ing,
      quantity: '1',
      category: ui.ingredients,
      checked: false,
    }));
    setShoppingList((prev) => [...prev, ...newItems]);
    showToast(`${ui.toastAddedShopping} "${loc.title}"`);
  };

  const toggleShoppingItem = (id: string) => {
    setShoppingList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  /**
   * Generates brand new custom recipes for the current week using AI in the active language
   */
  const handleGenerateWeeklyAiRecipes = async () => {
    setIsGeneratingRecipes(true);
    try {
      const res = await fetch('/api/ai/generate-weekly-recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dietaryPreference: user.dietaryPreference || 'standard',
          targetCalories: user.targetWeightKg ? 1600 : 1800,
          weekTheme: translatedTheme || baseWeekTheme,
          currentWeekNumber,
          language,
        }),
      });

      const data = await res.json();
      if (data?.recipes && Array.isArray(data.recipes) && data.recipes.length > 0) {
        if (language !== 'fr') {
          const cacheKey = getCacheKey(language, currentWeekNumber);
          const additions: Record<string, TranslatedRecipeFields> = {};
          for (const r of data.recipes) {
            if (r?.id) {
              additions[r.id] = {
                title: r.title,
                description: r.description,
                ingredients: r.ingredients || [],
                instructions: r.instructions || [],
                tags: r.tags,
              };
            }
          }
          const nextMap = { ...translatedMap, ...additions };
          setTranslatedMap(nextMap);
          try {
            localStorage.setItem(
              cacheKey,
              JSON.stringify({ weekTheme: translatedTheme, recipes: nextMap })
            );
          } catch {
            // Ignore
          }
        }
        if (onAddNewWeeklyRecipes) {
          onAddNewWeeklyRecipes(data.recipes);
        }
        showToast(`✨ ${data.recipes.length} ${ui.toastGenerated}`);
        setSelectedCategory('nouveautes_semaine');
      } else {
        showToast(ui.toastUpToDate);
      }
    } catch (e) {
      console.error('Error generating weekly recipes:', e);
      showToast(ui.toastGenError);
    } finally {
      setIsGeneratingRecipes(false);
    }
  };

  return (
    <div id="recipes-view" className="space-y-6 pb-12">
      {/* Floating toast notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-600 text-white font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-300" /> {toastMessage}
        </div>
      )}

      {/* Weekly Feature Banner */}
      <div
        id="weekly-recipes-hero-banner"
        className="p-6 rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900 text-white shadow-lg space-y-4 relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {currentWeekLabel}
              </span>
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                {ui.weeklyNewBadge}
              </span>
              {isTranslating && (
                <span className="bg-white/20 text-white px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  {ui.translatingLabel}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {translatedTheme}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl leading-relaxed">
              {ui.weeklySubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              id="btn-generate-weekly-recipes"
              onClick={handleGenerateWeeklyAiRecipes}
              disabled={isGeneratingRecipes}
              className="bg-white hover:bg-emerald-50 text-emerald-900 font-extrabold px-4 py-2.5 rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
            >
              {isGeneratingRecipes ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
                  <span>{ui.creatingBtn}</span>
                </>
              ) : (
                <>
                  <ChefHat className="w-4 h-4 text-emerald-700" />
                  <span>{ui.createAiBtn}</span>
                </>
              )}
            </button>
            <button
              id="btn-toggle-shopping-list"
              onClick={() => setShowShoppingList(!showShoppingList)}
              className="bg-emerald-800/80 hover:bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-2xl text-xs sm:text-sm flex items-center gap-2 border border-emerald-600/60 shadow-xs transition-all cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>
                {ui.shoppingListBtn} ({shoppingList.filter((i) => !i.checked).length})
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Shopping List drawer/panel */}
      {showShoppingList && (
        <div
          id="shopping-list-container"
          className={`p-6 rounded-3xl border ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-emerald-50/50 border-emerald-200'
          } space-y-4`}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-extrabold text-base text-slate-800 dark:text-white flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-emerald-600" />
              {ui.shoppingTitle}
            </h3>
            <span className="text-xs text-slate-400 font-medium">{ui.shoppingHint}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {shoppingList.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleShoppingItem(item.id)}
                className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                  item.checked
                    ? 'opacity-50 line-through bg-slate-100 dark:bg-slate-800/40 border-transparent'
                    : isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center border text-white text-xs ${
                    item.checked ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300'
                  }`}
                >
                  {item.checked && <Check className="w-3.5 h-3.5" />}
                </div>
                <div className="text-xs font-semibold flex-1">
                  <span>{item.name}</span>
                  <span className="text-[10px] text-slate-400 block font-normal">{item.quantity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories filter pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            id={`btn-filter-category-${cat.id}`}
            onClick={() => setSelectedCategory(cat.id)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-emerald-600 text-white shadow-xs'
                : isDarkMode
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Results Count & Notice */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1 flex-wrap gap-2">
        <span>
          {localizedFilteredRecipes.length} {ui.recipesFound}
          {selectedCategory === 'nouveautes_semaine' && ` ${ui.forThisWeek}`}
        </span>
        {selectedCategory === 'nouveautes_semaine' && (
          <span className="font-bold text-emerald-600 dark:text-emerald-400">{ui.renewedWeekly}</span>
        )}
      </div>

      {/* Recipe Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {localizedFilteredRecipes.map((recipe) => (
          <div
            key={recipe.id}
            id={`recipe-card-${recipe.id}`}
            className={`rounded-3xl border overflow-hidden shadow-xs transition-all hover:shadow-md flex flex-col relative ${
              recipe.isWeeklyStar
                ? 'border-amber-300 dark:border-amber-700 ring-2 ring-amber-400/20'
                : isDarkMode
                ? 'bg-slate-900 border-slate-800'
                : 'bg-white border-slate-200'
            }`}
          >
            {/* Image & Badges */}
            <div className="relative h-48 w-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                referrerPolicy="no-referrer"
              />

              {/* Weekly Star Badge */}
              {recipe.isWeeklyStar && (
                <div className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <Award className="w-3.5 h-3.5" />
                  {ui.weeklyStar}
                </div>
              )}

              {/* New This Week Badge */}
              {recipe.isNewThisWeek && !recipe.isWeeklyStar && (
                <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  {ui.newThisWeek}
                </div>
              )}

              {/* Sans Gluten Badge */}
              {(recipe.category === 'sans_gluten' ||
                recipes.find((raw) => raw.id === recipe.id)?.tags?.some((t) => t.toLowerCase().includes('gluten')) ||
                recipe.tags?.some((t) => /gluten|グルテン|麸质|غلوتين|γλουτέν|lepku|глютен/i.test(t))) && (
                <div className="absolute top-3 right-3 bg-amber-500/95 backdrop-blur-xs text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <span>{ui.glutenFreeBadge}</span>
                </div>
              )}

              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3 h-3 text-orange-400" />
                {recipe.calories} kcal
              </div>
              <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-400" />
                {recipe.prepTimeMinutes} min
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-black text-base text-slate-900 dark:text-white leading-snug">
                  {recipe.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                  {recipe.description}
                </p>

                {recipe.tags && recipe.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {recipe.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          tag.toLowerCase().includes('gluten')
                            ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 mt-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 flex-wrap">
                  <span className="text-rose-600 bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded-md">
                    {ui.protein.charAt(0)}: {recipe.protein}g
                  </span>
                  <span className="text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-md">
                    {ui.carbs.charAt(0)}: {recipe.carbs}g
                  </span>
                  <span className="text-sky-600 bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded-md">
                    {ui.fat.charAt(0)}: {recipe.fat}g
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  id={`btn-view-recipe-${recipe.id}`}
                  onClick={() => setSelectedRecipeId(recipe.id)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer text-center ${
                    isDarkMode
                      ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  {ui.viewRecipe}
                </button>
                <button
                  id={`btn-add-recipe-to-journal-${recipe.id}`}
                  onClick={() => handleAddMeal(recipe)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-2 px-3 rounded-xl text-xs transition-colors flex items-center gap-1 cursor-pointer"
                  title={ui.addToLogTitle}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div
          id="modal-recipe-detail"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedRecipeId(null);
          }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
          <div
            className={`w-full max-w-lg max-h-[92dvh] sm:max-h-[90vh] flex flex-col rounded-t-3xl sm:rounded-3xl border shadow-2xl overflow-hidden ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Fixed Modal Header */}
            <div
              className={`shrink-0 flex items-center justify-between gap-2 px-4 sm:px-6 pt-4 pb-3 border-b ${
                isDarkMode ? 'border-slate-800' : 'border-slate-100'
              }`}
            >
              <span className="text-[10px] uppercase font-black tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full truncate">
                {selectedRecipe.tags?.join(' • ') || ui.defaultTag}
              </span>
              <button
                type="button"
                aria-label={getUiCore(language).close}
                onClick={() => setSelectedRecipeId(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shrink-0"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Single Smooth Scrollable Body (all ingredients & steps visible on mobile) */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-4 sm:px-6 py-4 space-y-4">
              <div className="h-36 sm:h-48 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <img
                  src={selectedRecipe.imageUrl}
                  alt={selectedRecipe.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-black mb-1">{selectedRecipe.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{selectedRecipe.description}</p>
              </div>

              <div className="grid grid-cols-4 gap-1.5 sm:gap-2 p-2.5 sm:p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">{ui.calories}</span>
                  <span className="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400">
                    {selectedRecipe.calories} kcal
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">{ui.protein}</span>
                  <span className="text-xs sm:text-sm font-black text-rose-600">{selectedRecipe.protein}g</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">{ui.carbs}</span>
                  <span className="text-xs sm:text-sm font-black text-amber-600">{selectedRecipe.carbs}g</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">{ui.fat}</span>
                  <span className="text-xs sm:text-sm font-black text-sky-600">{selectedRecipe.fat}g</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-800/40">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-2.5">
                  {ui.ingredients} ({selectedRecipe.ingredients.length})
                </h4>
                <ul className="space-y-1.5 text-sm sm:text-xs">
                  {selectedRecipe.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block shrink-0 mt-1.5" />
                      <span className="leading-snug break-words">{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400 mb-2">
                  {ui.preparation} ({selectedRecipe.prepTimeMinutes} min)
                </h4>
                <ol className="space-y-2 text-sm sm:text-xs pb-2">
                  {selectedRecipe.instructions.map((step, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400 shrink-0">
                        {i + 1}.
                      </span>
                      <span className="leading-relaxed break-words">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Sticky Bottom Action Bar */}
            <div
              className={`shrink-0 flex gap-2 px-4 sm:px-6 py-3.5 border-t ${
                isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'
              }`}
            >
              <button
                type="button"
                onClick={() => handleAddIngredientsToShopping(selectedRecipe)}
                className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4 text-emerald-600" />
                {ui.shoppingBtn}
              </button>
              <button
                type="button"
                onClick={() => {
                  handleAddMeal(selectedRecipe);
                  setSelectedRecipeId(null);
                }}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                {ui.addToLogBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
