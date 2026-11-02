export type TabType =
  | 'dashboard'
  | 'journal'
  | 'aicoach'
  | 'progress'
  | 'hydration'
  | 'recipes'
  | 'badges'
  | 'profile';

export type MealType = 'petit_dejeuner' | 'dejeuner' | 'collation' | 'diner';

export interface UserProfile {
  name: string;
  email: string;
  isLoggedIn: boolean;
  age: number;
  sex: 'femme' | 'homme';
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg: number;
  startWeightKg: number;
  activityLevel: 'sedentaire' | 'legerement_actif' | 'moderement_actif' | 'tres_actif' | 'extremement_actif';
  goal: 'perdre' | 'maintenir' | 'prendre';
  weeklyGoalKg: number;
  dietaryPreference: string;
  waterTargetMl: number;
  stepTarget: number;
  isPremium: boolean;
  trialDaysRemaining: number;
  trialStartDate?: string;
  connectedWatch?: ConnectedWatchInfo;
  autoVoiceGreeting?: boolean;
}

export interface ConnectedWatchInfo {
  brand: string;
  model: string;
  connected: boolean;
  lastSync?: string;
  syncedStepsToday?: number;
}

export interface UserMetrics {
  bmr: number;
  tdee: number;
  targetCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  bmi: number;
  bmiCategory: string;
  bmiColor: string;
}

export interface MealEntry {
  id: string;
  mealType: MealType;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portionGrams: number;
  timestamp: string;
  imageUrl?: string;
}

export interface WaterData {
  date: string;
  glassesCount: number;
  amountMl: number;
}

export interface ActivityEntry {
  id: string;
  title: string;
  type: string;
  durationMinutes: number;
  caloriesBurned: number;
  stepsCount: number;
  timestamp: string;
}

export interface WeightEntry {
  id: string;
  date: string;
  weightKg: number;
  waistCm?: number;
  note?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTimeMinutes: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: string;
  imageUrl: string;
  ingredients: string[];
  instructions: string[];
  tags: string[];
  weekNumber?: number;
  weekLabel?: string;
  isNewThisWeek?: boolean;
  isWeeklyStar?: boolean;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedDate?: string;
  progress: number;
  maxProgress: number;
  category: string;
}

export interface Reminder {
  id: string;
  title: string;
  subtitle: string;
  type: 'eau' | 'repas' | 'marche' | 'pesee';
  time: string;
  enabled: boolean;
  isVoiceEnabled?: boolean;
  voiceMessage?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  category: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  checked: boolean;
}
