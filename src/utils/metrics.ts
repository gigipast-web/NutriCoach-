import { UserProfile, UserMetrics } from '../types.ts';

export function calculateBMR(user: Pick<UserProfile, 'currentWeightKg' | 'heightCm' | 'age' | 'sex'>): number {
  const { currentWeightKg, heightCm, age, sex } = user;
  const base = 10 * currentWeightKg + 6.25 * heightCm - 5 * age;
  return Math.round(sex === 'homme' ? base + 5 : base - 161);
}

export function getActivityMultiplier(level: UserProfile['activityLevel']): number {
  switch (level) {
    case 'sedentaire':
      return 1.2;
    case 'legerement_actif':
      return 1.375;
    case 'moderement_actif':
      return 1.55;
    case 'tres_actif':
      return 1.725;
    case 'extremement_actif':
      return 1.9;
    default:
      return 1.375;
  }
}

export function calculateMetrics(user: UserProfile): UserMetrics {
  const bmr = calculateBMR(user);
  const multiplier = getActivityMultiplier(user.activityLevel);
  const tdee = Math.round(bmr * multiplier);

  let targetCalories = tdee;
  if (user.goal === 'perdre') {
    targetCalories = Math.max(1200, Math.round(tdee - 500));
  } else if (user.goal === 'prendre') {
    targetCalories = Math.round(tdee + 350);
  }

  const proteinGrams = Math.round((targetCalories * 0.3) / 4);
  const carbsGrams = Math.round((targetCalories * 0.45) / 4);
  const fatGrams = Math.round((targetCalories * 0.25) / 9);

  const heightM = user.heightCm / 100;
  const bmi = Number((user.currentWeightKg / (heightM * heightM)).toFixed(1));

  let bmiCategory = 'Poids idéal / Normal';
  let bmiColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';

  if (bmi < 18.5) {
    bmiCategory = 'Insuffisance pondérale';
    bmiColor = 'text-amber-600 bg-amber-50 border-amber-200';
  } else if (bmi >= 18.5 && bmi < 25) {
    bmiCategory = 'Poids idéal / Normal';
    bmiColor = 'text-emerald-600 bg-emerald-50 border-emerald-200';
  } else if (bmi >= 25 && bmi < 30) {
    bmiCategory = 'Surpoids léger';
    bmiColor = 'text-amber-600 bg-amber-50 border-amber-200';
  } else {
    bmiCategory = 'Obésité';
    bmiColor = 'text-rose-600 bg-rose-50 border-rose-200';
  }

  return {
    bmr,
    tdee,
    targetCalories,
    proteinGrams,
    carbsGrams,
    fatGrams,
    bmi,
    bmiCategory,
    bmiColor,
  };
}

export function getMealTypeLabel(type: string): string {
  switch (type) {
    case 'petit_dejeuner':
      return 'Petit-déjeuner';
    case 'dejeuner':
      return 'Déjeuner';
    case 'collation':
      return 'Collation';
    case 'diner':
      return 'Dîner';
    default:
      return 'Repas';
  }
}
