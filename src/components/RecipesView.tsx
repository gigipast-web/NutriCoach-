import React, { useState } from 'react';
import {
  Utensils,
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
  RefreshCw,
  ChefHat,
  ChevronRight,
} from 'lucide-react';
import { Recipe, UserProfile } from '../types.ts';
import { getWeekDateRangeLabel, getCurrentWeekTheme, getIsoWeekNumber } from '../data/weeklyRecipes.ts';

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

export const RecipesView: React.FC<RecipesViewProps> = ({
  recipes,
  user,
  onAddMealFromRecipe,
  onAddNewWeeklyRecipes,
  isDarkMode,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('nouveautes_semaine');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isGeneratingRecipes, setIsGeneratingRecipes] = useState(false);

  const currentWeekLabel = getWeekDateRangeLabel();
  const currentWeekNumber = getIsoWeekNumber();
  const currentWeekTheme = getCurrentWeekTheme(currentWeekNumber);

  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>([
    { id: 's1', name: 'Blanc de poulet bio', quantity: '300g', category: 'Viandes', checked: false },
    { id: 's2', name: 'Quinoa', quantity: '250g', category: 'Épicerie', checked: true },
    { id: 's3', name: 'Avocats', quantity: '2 pièces', category: 'Fruits & Légumes', checked: false },
    { id: 's4', name: 'Courgettes & Carottes', quantity: '500g', category: 'Fruits & Légumes', checked: false },
    { id: 's5', name: 'Lait de coco léger', quantity: '1 brique 200ml', category: 'Épicerie', checked: false },
  ]);

  const categories = [
    { id: 'nouveautes_semaine', label: '✨ Nouveautés de la semaine' },
    { id: 'all', label: 'Toutes les recettes' },
    { id: 'riches_proteines', label: 'Riches en protéines' },
    { id: 'faibles_calories', label: 'Faibles calories (< 300 kcal)' },
    { id: 'vegetarienne', label: 'Végétariennes' },
    { id: 'sans_gluten', label: 'Sans Gluten' },
    { id: 'express', label: 'Express (≤ 15 min)' },
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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddMeal = (recipe: Recipe) => {
    onAddMealFromRecipe(recipe);
    showToast(`"${recipe.title}" ajouté à votre journal du jour !`);
  };

  const handleAddIngredientsToShopping = (recipe: Recipe) => {
    const newItems: ShoppingItem[] = recipe.ingredients.map((ing, idx) => ({
      id: `shop_${Date.now()}_${idx}`,
      name: ing,
      quantity: '1 portion',
      category: 'Ingrédients Recette',
      checked: false,
    }));
    setShoppingList((prev) => [...prev, ...newItems]);
    showToast(`Ingrédients de "${recipe.title}" ajoutés à la liste de courses !`);
  };

  const toggleShoppingItem = (id: string) => {
    setShoppingList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  /**
   * Generates brand new custom recipes for the current week using AI
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
          weekTheme: currentWeekTheme,
          currentWeekNumber,
        }),
      });

      const data = await res.json();
      if (data?.recipes && Array.isArray(data.recipes) && data.recipes.length > 0) {
        if (onAddNewWeeklyRecipes) {
          onAddNewWeeklyRecipes(data.recipes);
        }
        showToast(`✨ ${data.recipes.length} nouvelles recettes de la semaine ajoutées avec succès !`);
        setSelectedCategory('nouveautes_semaine');
      } else {
        showToast('Recettes de la semaine déjà à jour !');
      }
    } catch (e) {
      console.error('Error generating weekly recipes:', e);
      showToast('Une erreur est survenue lors de la génération.');
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
                Nouveautés chaque semaine
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {currentWeekTheme}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl leading-relaxed">
              Chaque semaine, découvrez des recettes de saison inédites, équilibrées et conçues par des nutritionnistes pour atteindre votre objectif sans lassitude.
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
                  <span>Création des recettes...</span>
                </>
              ) : (
                <>
                  <ChefHat className="w-4 h-4 text-emerald-700" />
                  <span>🪄 Créer de nouvelles recettes IA</span>
                </>
              )}
            </button>
            <button
              id="btn-toggle-shopping-list"
              onClick={() => setShowShoppingList(!showShoppingList)}
              className="bg-emerald-800/80 hover:bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-2xl text-xs sm:text-sm flex items-center gap-2 border border-emerald-600/60 shadow-xs transition-all cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Liste de courses ({shoppingList.filter((i) => !i.checked).length})</span>
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
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-800 dark:text-white flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-emerald-600" />
              Liste de Courses Intelligente
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              Cochez les articles au supermarché
            </span>
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
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          {filteredRecipes.length} recette{filteredRecipes.length > 1 ? 's' : ''} trouvée{filteredRecipes.length > 1 ? 's' : ''}
          {selectedCategory === 'nouveautes_semaine' && ' pour cette semaine'}
        </span>
        {selectedCategory === 'nouveautes_semaine' && (
          <span className="font-bold text-emerald-600 dark:text-emerald-400">
            🔄 Renouvelé automatiquement chaque lundi
          </span>
        )}
      </div>

      {/* Recipe Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
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
                  Star de la Semaine
                </div>
              )}

              {/* New This Week Badge */}
              {recipe.isNewThisWeek && !recipe.isWeeklyStar && (
                <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  Nouveau cette semaine
                </div>
              )}

              {/* Sans Gluten Badge */}
              {(recipe.category === 'sans_gluten' || recipe.tags?.some((t) => t.toLowerCase().includes('gluten'))) && (
                <div className="absolute top-3 right-3 bg-amber-500/95 backdrop-blur-xs text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <span>🌾 Sans Gluten</span>
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
                    P: {recipe.protein}g
                  </span>
                  <span className="text-amber-600 bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-md">
                    G: {recipe.carbs}g
                  </span>
                  <span className="text-sky-600 bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded-md">
                    L: {recipe.fat}g
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  id={`btn-view-recipe-${recipe.id}`}
                  onClick={() => setSelectedRecipe(recipe)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer text-center ${
                    isDarkMode
                      ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  Voir recette
                </button>
                <button
                  id={`btn-add-recipe-to-journal-${recipe.id}`}
                  onClick={() => handleAddMeal(recipe)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-2 px-3 rounded-xl text-xs transition-colors flex items-center gap-1 cursor-pointer"
                  title="Ajouter à mes repas d'aujourd'hui"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div
            className={`w-full max-w-lg p-6 rounded-3xl border shadow-xl my-8 ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase font-black tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
                {selectedRecipe.tags?.join(' • ') || 'Recette Minceur'}
              </span>
              <button
                type="button"
                onClick={() => setSelectedRecipe(null)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="h-52 w-full rounded-2xl overflow-hidden mb-4 border border-slate-200 dark:border-slate-700">
              <img
                src={selectedRecipe.imageUrl}
                alt={selectedRecipe.title}
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="text-xl font-black mb-1">{selectedRecipe.title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              {selectedRecipe.description}
            </p>

            <div className="grid grid-cols-4 gap-2 mb-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-center">
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">Calories</span>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                  {selectedRecipe.calories} kcal
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">Protéines</span>
                <span className="text-sm font-black text-rose-600">{selectedRecipe.protein}g</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">Glucides</span>
                <span className="text-sm font-black text-amber-600">{selectedRecipe.carbs}g</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block font-bold">Lipides</span>
                <span className="text-sm font-black text-sky-600">{selectedRecipe.fat}g</span>
              </div>
            </div>

            <div className="space-y-4 max-h-60 overflow-y-auto pr-1 mb-6">
              <div>
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400 mb-2">
                  Ingrédients
                </h4>
                <ul className="space-y-1 text-xs">
                  {selectedRecipe.ingredients.map((ing, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-400 mb-2">
                  Préparation ({selectedRecipe.prepTimeMinutes} min)
                </h4>
                <ol className="space-y-2 text-xs">
                  {selectedRecipe.instructions.map((step, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400 shrink-0">
                        {i + 1}.
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleAddIngredientsToShopping(selectedRecipe)}
                className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4 text-emerald-600" />
                Courses
              </button>
              <button
                type="button"
                onClick={() => {
                  handleAddMeal(selectedRecipe);
                  setSelectedRecipe(null);
                }}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Ajouter au Journal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
