import React, { useState } from 'react';
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Scale,
  Ruler,
  Calendar,
  Activity,
  Target,
  CheckCircle2,
  Info,
  Timer,
  Clock,
  Rocket,
  Camera,
  Mic,
  Utensils,
  Zap,
  Smartphone,
  ChevronRight,
  Flame,
  Check,
} from 'lucide-react';
import { UserProfile } from '../types.ts';
import { useLanguage } from '../i18n/LanguageContext.tsx';
import { LanguageSelector } from './LanguageSelector.tsx';

interface RegistrationViewProps {
  onRegister: (newUser: Partial<UserProfile>) => void;
  onLoadDemo: () => void;
  onOpenLogin: () => void;
  isDarkMode: boolean;
}

export const RegistrationView: React.FC<RegistrationViewProps> = ({
  onRegister,
  onLoadDemo,
  onOpenLogin,
  isDarkMode,
}) => {
  const { t } = useLanguage();

  // Mode selection: instant discovery (1-click guest preview) vs custom registration form
  const [onboardingMode, setOnboardingMode] = useState<'instant_discovery' | 'custom_profile'>('instant_discovery');

  // All fields start completely empty ("cases vides")
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Biometrics - empty strings
  const [sex, setSex] = useState<'femme' | 'homme' | ''>('');
  const [age, setAge] = useState<string>('');
  const [heightCm, setHeightCm] = useState<string>('');
  const [currentWeightKg, setCurrentWeightKg] = useState<string>('');
  const [targetWeightKg, setTargetWeightKg] = useState<string>('');

  // Preferences
  const [activityLevel, setActivityLevel] = useState<UserProfile['activityLevel'] | ''>('');
  const [goal, setGoal] = useState<'perdre' | 'maintenir' | 'prendre'>('perdre');
  const [weeklyGoalKg, setWeeklyGoalKg] = useState<string>('0.5');
  const [dietaryPreference, setDietaryPreference] = useState<UserProfile['dietaryPreference']>('standard');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Validation errors
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg(t('errName'));
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg(t('errEmail'));
      return;
    }
    if (!password || password.length < 6) {
      setErrorMsg(t('errPassword'));
      return;
    }
    if (!sex) {
      setErrorMsg(t('errSex'));
      return;
    }
    const ageNum = Number(age);
    if (!age || isNaN(ageNum) || ageNum < 14 || ageNum > 100) {
      setErrorMsg(t('errAge'));
      return;
    }
    const heightNum = Number(heightCm);
    if (!heightCm || isNaN(heightNum) || heightNum < 120 || heightNum > 230) {
      setErrorMsg(t('errHeight'));
      return;
    }
    const weightNum = Number(currentWeightKg);
    if (!currentWeightKg || isNaN(weightNum) || weightNum < 35 || weightNum > 250) {
      setErrorMsg(t('errWeight'));
      return;
    }
    const targetNum = targetWeightKg ? Number(targetWeightKg) : (goal === 'perdre' ? weightNum - 5 : weightNum);

    if (!agreeTerms) {
      setErrorMsg(t('errTerms'));
      return;
    }

    onRegister({
      name: name.trim(),
      email: email.trim(),
      isLoggedIn: true,
      sex: sex === 'homme' ? 'homme' : 'femme',
      age: ageNum,
      heightCm: heightNum,
      currentWeightKg: weightNum,
      startWeightKg: weightNum,
      targetWeightKg: targetNum,
      activityLevel: (activityLevel as UserProfile['activityLevel']) || 'moderement_actif',
      goal,
      weeklyGoalKg: Number(weeklyGoalKg) || 0.5,
      dietaryPreference,
      trialDaysRemaining: 30,
      trialStartDate: new Date().toISOString(),
      waterTargetMl: Math.round(weightNum * 30),
      stepTarget: 10000,
    });
  };

  return (
    <div id="registration-onboarding-page" className="max-w-3xl mx-auto py-4 px-2 sm:px-4 pb-16">
      {/* Welcome Banner */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden mb-8 transition-colors ${
          isDarkMode
            ? 'bg-slate-900 border-slate-800 text-white'
            : 'bg-white border-slate-200/90 text-slate-800'
        }`}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {t('regBadge')}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {t('regTitle')}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <LanguageSelector />
            <button
              type="button"
              onClick={onOpenLogin}
              className="text-xs font-bold px-3.5 py-1.5 rounded-xl border border-emerald-600/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
            >
              {t('regAlreadyHaveAccount')}
            </button>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
          {t('regSubtitle')}
        </p>

        {/* Free Trial Countdown Banner */}
        <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-teal-500/15 border border-amber-500/30 dark:border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <Timer className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>⏱️ Décompte de l'Essai Gratuit : 30 Jours Inclus</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold uppercase">
                  Actif dès l'inscription
                </span>
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                Le compte à rebours démarre automatiquement dès que vous validez cette fiche. Vous suivez vos jours restants en direct au sommet de l'application • <strong>0 € aujourd'hui</strong>.
              </p>
            </div>
          </div>
          <div className="text-right sm:text-center shrink-0 bg-white/80 dark:bg-slate-800/80 px-4 py-2 rounded-xl border border-amber-200 dark:border-amber-900">
            <span className="text-xl font-black text-amber-600 dark:text-amber-400 block leading-tight">
              30 Jours
            </span>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block uppercase tracking-wider">
              100% Gratuits
            </span>
          </div>
        </div>
      </div>

      {/* Choice of Onboarding Mode */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <button
          type="button"
          onClick={() => setOnboardingMode('instant_discovery')}
          className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
            onboardingMode === 'instant_discovery'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/25 ring-2 ring-emerald-500/50'
              : isDarkMode
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div
            className={`p-2.5 rounded-xl shrink-0 ${
              onboardingMode === 'instant_discovery'
                ? 'bg-white/20 text-white'
                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
            }`}
          >
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base">Mode Découverte 1-Clic</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  onboardingMode === 'instant_discovery'
                    ? 'bg-white/25 text-white'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                Accès Immédiat
              </span>
            </div>
            <p
              className={`text-xs mt-1 leading-relaxed ${
                onboardingMode === 'instant_discovery' ? 'text-white/90' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Entrez directement sans remplir de formulaire pour tester toutes les fonctionnalités.
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setOnboardingMode('custom_profile')}
          className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
            onboardingMode === 'custom_profile'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-600/25 ring-2 ring-emerald-500/50'
              : isDarkMode
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300 shadow-xs'
          }`}
        >
          <div
            className={`p-2.5 rounded-xl shrink-0 ${
              onboardingMode === 'custom_profile'
                ? 'bg-white/20 text-white'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm sm:text-base">Profil Sur-Mesure</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  onboardingMode === 'custom_profile'
                    ? 'bg-white/25 text-white'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                Formulaire
              </span>
            </div>
            <p
              className={`text-xs mt-1 leading-relaxed ${
                onboardingMode === 'custom_profile' ? 'text-white/90' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Renseignez vos mensurations réelles (taille, poids, rythme) pour un calcul direct.
            </p>
          </div>
        </button>
      </div>

      {/* MODE 1: INSTANT DISCOVERY HERO CARD */}
      {onboardingMode === 'instant_discovery' && (
        <div
          className={`p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-colors space-y-6 ${
            isDarkMode
              ? 'bg-slate-900 border-slate-800 text-white'
              : 'bg-white border-slate-200/90 text-slate-800'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-2">
                <Zap className="w-3.5 h-3.5" />
                Accès Testeur & Invité 1-Clic
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Découvrez NutriCoach Minceur en direct
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
                Testez immédiatement l'ensemble de l'application sans formulaire préalable. Un profil démo complet avec 30 jours d'essai gratuit est prêt pour vous.
              </p>
            </div>
          </div>

          {/* Interactive Feature Highlights Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/60 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Scanner Photo & IA de Repas
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                  Reconnaissance instantanée des aliments et calcul automatique des calories, glucides, lipides et protéines.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200/80 dark:border-teal-900/60 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Coach Vocal & Chat IA
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                  Dialogue fluide par la voix ou par écrit pour recevoir des recommandations minceur personnalisées.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Recettes Saines & Sans Gluten
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                  Catalogue gourmand adapté aux intolérances, prêt en moins de 25 min avec ratios macronutriments.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-900/60 flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Journal & Bilan 7 Jours
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                  Suivi de l'eau (verres du jour), des pas quotidiens et analyse du déficit calorique hebdomadaire.
                </p>
              </div>
            </div>
          </div>

          {/* Primary 1-Click Action */}
          <div className="pt-2">
            <button
              id="btn-instant-discovery"
              type="button"
              onClick={onLoadDemo}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-base sm:text-lg shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Rocket className="w-6 h-6 animate-pulse" />
              <span>Entrer dans l'Application (Mode Découverte 1 Clic)</span>
              <ArrowRight className="w-6 h-6" />
            </button>
            <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-2.5 flex items-center justify-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <Check className="w-3.5 h-3.5" /> Aucune inscription requise
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <Check className="w-3.5 h-3.5" /> Données de démonstration prêtes
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <Check className="w-3.5 h-3.5" /> 30 jours gratuits activés
              </span>
            </p>
          </div>

          {/* Official Google Play Tester Recruitment Image Button */}
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-emerald-950/50 via-slate-900/70 to-teal-950/50 border border-emerald-500/30 shadow-xl text-center space-y-3.5">
            <div className="flex items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Programme Bêta-Testeurs Google Play
              </span>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Rejoignez l'Aventure NutriCoach sur Android
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-md mx-auto">
                Cliquez sur l'image ci-dessous pour accéder directement au programme de test fermé officiel sur le Google Play Store :
              </p>
            </div>

            {/* Clickable Image Button */}
            <a
              id="btn-link-google-play-testing"
              href="https://play.google.com/apps/testing/com.nutricoach.nutrition.coach"
              target="_blank"
              rel="noopener noreferrer"
              className="group block relative max-w-xs sm:max-w-sm mx-auto overflow-hidden rounded-2xl border-2 border-emerald-500/40 hover:border-emerald-400 shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              title="Cliquez sur l'image pour ouvrir le lien Google Play Testing"
            >
              <img
                src="/assets/aistudio/pub_testeur_e9f48c8d.png"
                alt="Rejoignez l'Aventure NutriCoach - Cliquez pour accéder au test Google Play"
                className="w-full h-auto object-cover group-hover:brightness-105 transition-all"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3">
                <span className="text-xs font-extrabold text-white bg-emerald-600 px-3.5 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5">
                  <ArrowRight className="w-4 h-4" /> Rejoindre le test Google Play
                </span>
              </div>
            </a>

            <div>
              <a
                href="https://play.google.com/apps/testing/com.nutricoach.nutrition.coach"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                <span>🚀 Accéder à la page Google Play Testing</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <span className="block text-[11px] text-slate-400 mt-1">
                ID du package : com.nutricoach.nutrition.coach
              </span>
            </div>
          </div>

          {/* Helper for Samsung Galaxy Note9 / Android Browsers */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300">
              <span className="font-bold text-slate-900 dark:text-white block mb-0.5">
                📱 Vous testez sur smartphone (Samsung Galaxy Note9 ou Android) ?
              </span>
              <span>
                Pour utiliser NutriCoach en plein écran comme une application native sans la barre d'adresse du navigateur Samsung Internet ou Chrome, touchez le menu <strong className="text-slate-800 dark:text-white">⋮</strong> ou l'icône de partage, puis sélectionnez <strong className="text-emerald-600 dark:text-emerald-400">« Ajouter à l'écran d'accueil »</strong>.
              </span>
            </div>
          </div>

          {/* Switch to custom form shortcut */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setOnboardingMode('custom_profile')}
              className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 underline cursor-pointer"
            >
              Vous préférez saisir vos mensurations exactes dès maintenant ? Ouvrir le formulaire sur-mesure →
            </button>
          </div>
        </div>
      )}

      {/* MODE 2: CUSTOM PROFILE REGISTRATION FORM */}
      {onboardingMode === 'custom_profile' && (
        <form
          id="form-registration-sheet"
          onSubmit={handleSubmit}
          className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-8 ${
            isDarkMode
              ? 'bg-slate-900 border-slate-800 text-white'
              : 'bg-white border-slate-200/90 text-slate-800'
          }`}
        >
          {/* Top fast-track banner inside custom form */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
              <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Vous préférez tester l'application sans remplir de formulaire ?</span>
            </div>
            <button
              type="button"
              onClick={onLoadDemo}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Rocket className="w-3.5 h-3.5" />
              <span>Lancer en 1 Clic</span>
            </button>
          </div>

          {/* Error notification */}
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-sm font-semibold flex items-center gap-2">
              <Info className="w-5 h-5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

        {/* Section 1: Identifiants de connexion */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2 border-slate-200 dark:border-slate-800">
            <User className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-extrabold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
              {t('regSectionIdentity')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                {t('regNameLabel')} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  id="reg-input-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('regNamePlaceholder')}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all ${
                    isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                {t('regEmailLabel')} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  id="reg-input-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('regEmailPlaceholder')}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all ${
                    isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              {t('regPasswordLabel')} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
              <input
                id="reg-input-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('regPasswordPlaceholder')}
                className={`w-full pl-10 pr-12 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all ${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                aria-label={showPassword ? 'Masquer' : 'Afficher'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Section 2: Mesures Biométriques */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2 border-slate-200 dark:border-slate-800">
            <Scale className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-extrabold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
              {t('regSectionBiometrics')}
            </h2>
          </div>

          {/* Sexe biologique */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              {t('regSexLabel')} <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSex('femme')}
                className={`py-3 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  sex === 'femme'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                    : isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{t('regSexFemale')}</span>
              </button>
              <button
                type="button"
                onClick={() => setSex('homme')}
                className={`py-3 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  sex === 'homme'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                    : isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{t('regSexMale')}</span>
              </button>
            </div>
          </div>

          {/* Âge, Taille, Poids */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                {t('regAgeLabel')} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  id="reg-input-age"
                  type="number"
                  min="14"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder={t('regAgePlaceholder')}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all ${
                    isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                {t('regHeightLabel')} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Ruler className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  id="reg-input-height"
                  type="number"
                  min="120"
                  max="230"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  placeholder={t('regHeightPlaceholder')}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all ${
                    isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                {t('regCurrentWeightLabel')} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Scale className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  id="reg-input-weight"
                  type="number"
                  step="0.1"
                  min="35"
                  max="250"
                  value={currentWeightKg}
                  onChange={(e) => setCurrentWeightKg(e.target.value)}
                  placeholder={t('regCurrentWeightPlaceholder')}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all ${
                    isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Objectifs */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2 border-slate-200 dark:border-slate-800">
            <Target className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-extrabold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
              {t('regSectionGoals')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                {t('regTargetWeightLabel')}
              </label>
              <div className="relative">
                <Target className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  id="reg-input-target-weight"
                  type="number"
                  step="0.1"
                  min="35"
                  max="250"
                  value={targetWeightKg}
                  onChange={(e) => setTargetWeightKg(e.target.value)}
                  placeholder={t('regTargetWeightPlaceholder')}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all ${
                    isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                {t('regGoalLabel')}
              </label>
              <select
                id="reg-select-goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value as any)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all ${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value="perdre">{t('regGoalLose')}</option>
                <option value="maintenir">{t('regGoalMaintain')}</option>
                <option value="prendre">{t('regGoalGain')}</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                {t('regActivityLabel')}
              </label>
              <select
                id="reg-select-activity"
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value as any)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all ${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value="">{t('regActivitySelect')}</option>
                <option value="sedentaire">{t('regActivitySedentary')}</option>
                <option value="legerement_actif">{t('regActivityLight')}</option>
                <option value="moderement_actif">{t('regActivityModerate')}</option>
                <option value="tres_actif">{t('regActivityVery')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                {t('regPaceLabel')}
              </label>
              <select
                id="reg-select-weekly-goal"
                value={weeklyGoalKg}
                onChange={(e) => setWeeklyGoalKg(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all ${
                  isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              >
                <option value="0.25">{t('regPaceSlow')}</option>
                <option value="0.5">{t('regPaceRec')}</option>
                <option value="0.75">{t('regPaceFast')}</option>
                <option value="1">{t('regPaceIntense')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
              Régime & Préférence alimentaire
            </label>
            <select
              id="reg-select-dietary-preference"
              value={dietaryPreference}
              onChange={(e) => setDietaryPreference(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-white'
                  : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            >
              <option value="standard">Standard / Tous aliments</option>
              <option value="sans_gluten">🌾 Sans Gluten (Gluten-Free)</option>
              <option value="vegetarien">🥗 Végétarien</option>
              <option value="vegan">🌱 Végétalien / Végan</option>
              <option value="pescetarien">🐟 Pescétarien</option>
              <option value="keto">🥑 Low Carb / Cétogène</option>
            </select>
          </div>
        </div>

        {/* Section 4: Consentement & Validation */}
        <div className="space-y-4 pt-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              id="reg-checkbox-terms"
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-1 w-4 h-4 rounded-sm text-emerald-600 border-slate-300 focus:ring-emerald-500"
            />
            <span className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {t('regTermsText1')}{' '}
              <a
                href="/privacy.html"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-600 dark:text-emerald-400 underline font-semibold"
              >
                {t('regTermsLink')}
              </a>{' '}
              {t('regTermsText2')}
            </span>
          </label>

          <button
            id="btn-submit-registration"
            type="submit"
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-base shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <span>{t('regBtnSubmit')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500">
            <button
              type="button"
              onClick={onOpenLogin}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold cursor-pointer underline"
            >
              {t('regLinkLogin')}
            </button>
            <button
              type="button"
              onClick={onLoadDemo}
              className="hover:text-slate-700 dark:hover:text-slate-300 font-medium cursor-pointer"
            >
              {t('regLinkDemo')}
            </button>
          </div>
        </div>
      </form>
      )}
    </div>
  );
};
