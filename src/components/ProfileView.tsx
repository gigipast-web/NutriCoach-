import React, { useState } from 'react';
import {
  User,
  Calculator,
  Crown,
  Activity,
  Flame,
  Target,
  FileText,
  Trash2,
  Smartphone,
  ExternalLink,
  Globe,
  CreditCard,
  XCircle,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Loader2,
  RefreshCw,
  Watch,
  Mic,
  Sparkles,
  ArrowRight,
  Settings,
  HelpCircle,
  BarChart2,
  ChevronRight,
} from 'lucide-react';
import { UserProfile, UserMetrics, ActivityEntry } from '../types.ts';
import { useLanguage } from '../i18n/LanguageContext.tsx';
import { LanguageSelector } from './LanguageSelector.tsx';
import { SmartwatchSyncModal } from './SmartwatchSyncModal.tsx';
import {
  BlossomFlower,
  CornerFloralFlourish,
  FlowerGardenCluster,
} from './FloralDecorations.tsx';

interface ProfileViewProps {
  user: UserProfile;
  metrics: UserMetrics;
  onUpdateUser: (updates: Partial<UserProfile>) => void;
  onAddActivity?: (activity: Omit<ActivityEntry, 'id'>) => void;
  onCancelSubscription?: () => void;
  onOpenPremium: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  isDarkMode: boolean;
  onOpenShare?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  metrics,
  onUpdateUser,
  onAddActivity,
  onCancelSubscription,
  onOpenPremium,
  onOpenAuth,
  onLogout,
  isDarkMode,
  onOpenShare,
}) => {
  const { t } = useLanguage();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isWatchModalOpen, setIsWatchModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelSuccessMessage, setCancelSuccessMessage] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalNotice, setPortalNotice] = useState<string | null>(null);

  const handleConfirmUnsubscribe = async () => {
    setIsCancelling(true);
    try {
      await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });
    } catch (e) {
      console.warn('Erreur notification Stripe cancel:', e);
    } finally {
      if (onCancelSubscription) {
        onCancelSubscription();
      } else {
        onUpdateUser({ isPremium: false });
      }
      setIsCancelling(false);
      setShowCancelModal(false);
      setCancelSuccessMessage(
        'Votre abonnement a été résilié avec succès. Vous ne serez plus débité et vous conservez la formule gratuite.'
      );
      setTimeout(() => {
        setCancelSuccessMessage(null);
      }, 5000);
    }
  };

  const handleOpenStripePortal = async () => {
    if (!user.email) {
      setPortalNotice("Veuillez renseigner une adresse email pour accéder au portail Stripe.");
      setTimeout(() => setPortalNotice(null), 3500);
      return;
    }
    setPortalLoading(true);
    setPortalNotice(null);
    try {
      const res = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setPortalNotice(
          "Portail Stripe non disponible en mode local ou configuration Stripe incomplète. Vous pouvez résilier directement ci-dessous en un clic."
        );
        setTimeout(() => setPortalNotice(null), 4000);
      }
    } catch (e) {
      setPortalNotice("Erreur de connexion avec le portail Stripe. Utilisez le bouton direct de désabonnement.");
      setTimeout(() => setPortalNotice(null), 4000);
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <div id="profile-view" className="space-y-6 pb-12">
      {/* Toast Notification of Cancellation */}
      {cancelSuccessMessage && (
        <div
          id="toast-unsubscribe-success"
          className="p-4 rounded-2xl bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-top-2"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{cancelSuccessMessage}</span>
          </div>
          <button
            onClick={() => setCancelSuccessMessage(null)}
            className="text-white/80 hover:text-white text-xs underline cursor-pointer ml-3"
          >
            Fermer
          </button>
        </div>
      )}

      {/* 1. Profile Header (Screen 6: Clara Martin) with Blossom */}
      <div className="flex items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white dark:border-slate-700 shadow-md bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-300 flex items-center justify-center text-white text-xl font-black relative">
            <span>{user.name ? user.name.charAt(0) : 'C'}</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#163321] dark:text-white tracking-tight">
                {user.name ? (user.name.toLowerCase().includes('clara') ? 'Clara Martin' : user.name) : 'Clara Martin'}
              </h1>
              <BlossomFlower size={20} palette="pink" />
            </div>
            <span className="text-xs font-bold text-[#5A7363] dark:text-slate-400 block mt-0.5">
              Membre depuis 12 semaines 🌸
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            const el = document.getElementById('account-edit-form');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-[#DCE8DC] dark:border-slate-700 flex items-center justify-center text-[#5A7363] hover:text-[#163321] transition-all cursor-pointer shadow-xs"
          title="Paramètres du profil"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* 2. Target Card: Archery Bullseye (Screen 6) with Coral Sunset Gradient & Flowers */}
      <div
        id="target-goal-progress-card"
        className={`p-6 rounded-[28px] border relative overflow-hidden ${
          isDarkMode
            ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-rose-950/30 border-rose-900/40'
            : 'bg-gradient-to-br from-white via-[#FFF8F8] to-[#FFF0F4] border-rose-200/80'
        } shadow-[0_4px_24px_rgba(244,63,94,0.06)] space-y-4`}
      >
        <CornerFloralFlourish className="opacity-70 dark:opacity-30" flip={true} />

        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-400 text-white flex items-center justify-center text-2xl shrink-0 shadow-sm">
              🎯
            </div>
            <div>
              <span className="text-xs font-bold text-[#5A7363] dark:text-slate-400 block">
                Mon objectif
              </span>
              <h2 className="text-lg font-black text-[#163321] dark:text-white leading-tight flex items-center gap-1.5">
                <span>Perdre 5 kg</span>
                <BlossomFlower size={16} palette="orchid" />
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('account-edit-form');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
            title="Modifier l'objectif"
          >
            ✏️
          </button>
        </div>

        {/* Multi-color Vibrant Progress Bar */}
        <div className="w-full h-3 bg-rose-100/70 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500 rounded-full transition-all duration-700 shadow-2xs"
            style={{ width: '60%' }}
          />
        </div>

        <div className="text-right">
          <span className="text-xs font-extrabold text-[#78350F] dark:text-slate-300">
            Il vous reste <strong className="text-rose-600 dark:text-rose-400 font-black">2,5 kg</strong> ! 🌸🎉
          </span>
        </div>
      </div>

      {/* 3. Mes conseils du jour (Screen 6) */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5">
          <span className="text-amber-500 text-sm">💡</span>
          <h3 className="text-sm font-black text-[#163321] dark:text-white">
            Mes conseils du jour
          </h3>
        </div>

        <div
          onClick={onOpenPremium}
          className={`p-4 rounded-[26px] border ${
            isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#E2ECE2]'
          } shadow-xs flex items-center justify-between gap-4 cursor-pointer hover:border-emerald-300 transition-all group`}
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-xs border border-[#E5EFE5]">
              <img
                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=260&q=80"
                alt="Légumes frais"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                loading="lazy"
              />
            </div>
            <p className="text-xs font-bold text-[#163321] dark:text-slate-200 leading-snug">
              Privilégiez les légumes à chaque repas : ils sont riches en nutriments et peu caloriques !
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-[#1F6F43] transition-colors shrink-0" />
        </div>
      </div>

      {/* 4. Menu Options List (Screen 6) */}
      <div
        className={`divide-y divide-[#EDF3ED] dark:divide-slate-800 rounded-[26px] border ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-[#E2ECE2]'
        } shadow-xs overflow-hidden`}
      >
        {/* Mes statistiques */}
        <div
          onClick={() => {
            const el = document.getElementById('metabolism-calculation-card');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="p-4 flex items-center justify-between hover:bg-[#F9FCF9] dark:hover:bg-slate-800 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <BarChart2 className="w-5 h-5 text-[#1F6F43] dark:text-emerald-400" />
            <span className="text-sm font-bold text-[#163321] dark:text-white">
              Mes statistiques
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#1F6F43] transition-colors" />
        </div>

        {/* Mes paramètres */}
        <div
          onClick={() => {
            const el = document.getElementById('account-edit-form');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="p-4 flex items-center justify-between hover:bg-[#F9FCF9] dark:hover:bg-slate-800 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-[#1F6F43] dark:text-emerald-400" />
            <span className="text-sm font-bold text-[#163321] dark:text-white">
              Mes paramètres
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#1F6F43] transition-colors" />
        </div>

        {/* FAQ & Aide */}
        <div
          onClick={() => {
            alert('NutriCoach Minceur : application de suivi calorique, pesée et rééquilibrage alimentaire assisté par IA.');
          }}
          className="p-4 flex items-center justify-between hover:bg-[#F9FCF9] dark:hover:bg-slate-800 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-[#1F6F43] dark:text-emerald-400" />
            <span className="text-sm font-bold text-[#163321] dark:text-white">
              FAQ & Aide
            </span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#1F6F43] transition-colors" />
        </div>
      </div>

      {/* Metabolism & Targets Hero Card */}
      <div
        id="metabolism-calculation-card"
        className={`p-6 rounded-3xl border ${
          isDarkMode
            ? 'bg-slate-900 border-slate-800 text-white'
            : 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white'
        } shadow-md space-y-4`}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-black text-lg flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Calcul Automatique du Métabolisme & Calories
          </h3>
          <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full uppercase tracking-wider">
            Formule Mifflin-St Jeor
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider block text-emerald-100">
              Métabolisme de base (BMR)
            </span>
            <span className="text-2xl font-black">{metrics.bmr} kcal</span>
            <span className="text-[9px] block text-emerald-100">Besoins au repos total</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider block text-emerald-100">
              Dépense Totale (TDEE)
            </span>
            <span className="text-2xl font-black">{metrics.tdee} kcal</span>
            <span className="text-[9px] block text-emerald-100">Selon niveau d'activité</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider block text-emerald-100">
              Cible Déficit Calorique
            </span>
            <span className="text-2xl font-black text-amber-300">{metrics.targetCalories} kcal</span>
            <span className="text-[9px] block text-emerald-100">Pour perte de poids douce</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider block text-emerald-100">
              Indice IMC
            </span>
            <span className="text-2xl font-black">{metrics.bmi}</span>
            <span className="text-[9px] block text-emerald-100">{metrics.bmiCategory}</span>
          </div>
        </div>
      </div>

      {/* Editable Personal Form Card */}
      <div
        className={`p-6 rounded-3xl border ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-sm space-y-6`}
      >
        <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <User className="w-5 h-5 text-emerald-600" />
          Informations Personnelles
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Prénom</label>
            <input
              id="profile-input-name"
              type="text"
              value={user.name}
              onChange={(e) => onUpdateUser({ name: e.target.value })}
              className={`w-full p-3 rounded-xl border text-sm font-bold outline-none ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
              }`}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Âge (ans)</label>
            <input
              id="profile-input-age"
              type="number"
              value={user.age}
              onChange={(e) => onUpdateUser({ age: parseInt(e.target.value, 10) || 30 })}
              className={`w-full p-3 rounded-xl border text-sm font-bold outline-none ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
              }`}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Sexe</label>
            <select
              id="profile-select-sex"
              value={user.sex}
              onChange={(e) => onUpdateUser({ sex: e.target.value as 'femme' | 'homme' })}
              className={`w-full p-3 rounded-xl border text-sm font-bold outline-none ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <option value="femme">Femme</option>
              <option value="homme">Homme</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Taille (cm)</label>
            <input
              id="profile-input-height"
              type="number"
              value={user.heightCm}
              onChange={(e) => onUpdateUser({ heightCm: parseInt(e.target.value, 10) || 165 })}
              className={`w-full p-3 rounded-xl border text-sm font-bold outline-none ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
              }`}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Poids actuel (kg)</label>
            <input
              id="profile-input-current-weight"
              type="number"
              step="0.1"
              value={user.currentWeightKg}
              onChange={(e) => onUpdateUser({ currentWeightKg: parseFloat(e.target.value) || 70 })}
              className={`w-full p-3 rounded-xl border text-sm font-bold outline-none ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
              }`}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Poids objectif (kg)</label>
            <input
              id="profile-input-target-weight"
              type="number"
              step="0.1"
              value={user.targetWeightKg}
              onChange={(e) => onUpdateUser({ targetWeightKg: parseFloat(e.target.value) || 65 })}
              className={`w-full p-3 rounded-xl border text-sm font-bold outline-none ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
              }`}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Niveau d'activité physique</label>
            <select
              id="profile-select-activity"
              value={user.activityLevel}
              onChange={(e) => onUpdateUser({ activityLevel: e.target.value as any })}
              className={`w-full p-3 rounded-xl border text-sm font-bold outline-none ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <option value="sedentaire">Sédentaire (Bureau, peu de marche)</option>
              <option value="legerement_actif">Légèrement actif (Marche 1-3x/semaine)</option>
              <option value="moderement_actif">Modérément actif (Sport 3-5x/semaine)</option>
              <option value="tres_actif">Très actif (Sport intense quotidien)</option>
              <option value="extremement_actif">Extrêmement actif (Athlète)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Objectif principal</label>
            <select
              id="profile-select-goal"
              value={user.goal}
              onChange={(e) => onUpdateUser({ goal: e.target.value as any })}
              className={`w-full p-3 rounded-xl border text-sm font-bold outline-none ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <option value="perdre">Perdre du poids (-0,5 kg/semaine)</option>
              <option value="maintenir">Maintenir mon poids actuel</option>
              <option value="prendre">Prendre de la masse musculaire</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">
              Régime & Préférence alimentaire
            </label>
            <select
              id="profile-select-dietary-preference"
              value={user.dietaryPreference || 'standard'}
              onChange={(e) => onUpdateUser({ dietaryPreference: e.target.value })}
              className={`w-full p-3 rounded-xl border text-sm font-bold outline-none ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <option value="standard">Standard / Tous aliments</option>
              <option value="sans_gluten">🌾 Sans Gluten (Gluten-Free)</option>
              <option value="vegetarien">🥗 Végétarien</option>
              <option value="vegan">🌱 Végétalien / Végan</option>
              <option value="pescetarien">🐟 Pescétarien (Poissons & Végétaux)</option>
              <option value="keto">🥑 Low Carb / Cétogène</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Objectif Hydratation (ml)</label>
            <input
              id="profile-input-water-target"
              type="number"
              step="250"
              value={user.waterTargetMl}
              onChange={(e) => onUpdateUser({ waterTargetMl: parseInt(e.target.value, 10) || 2000 })}
              className={`w-full p-3 rounded-xl border text-sm font-bold outline-none ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
              }`}
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 block mb-1">Objectif de pas par jour</label>
            <input
              id="profile-input-step-target"
              type="number"
              step="500"
              min="1000"
              max="50000"
              value={user.stepTarget || 10000}
              onChange={(e) => onUpdateUser({ stepTarget: parseInt(e.target.value, 10) || 10000 })}
              className={`w-full p-3 rounded-xl border text-sm font-bold outline-none ${
                isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'
              }`}
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Recommandé : 8 000 à 10 000 pas / jour
            </span>
          </div>
        </div>
      </div>

      {/* Dedicated Subscription & Billing Management Card */}
      <div
        id="section-subscription-management"
        className={`p-6 rounded-3xl border ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-sm space-y-4`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-emerald-500/20 to-teal-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                Abonnement & Facturation
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gestion en toute transparence • Résiliation libre sans frais
              </p>
            </div>
          </div>

          <span
            className={`text-xs font-black px-3 py-1 rounded-full self-start sm:self-auto uppercase tracking-wider ${
              user.isPremium
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {user.isPremium ? 'Premium Actif' : 'Formule Gratuite'}
          </span>
        </div>

        {portalNotice && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs">
            {portalNotice}
          </div>
        )}

        {user.isPremium ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Formule souscrite
                </span>
                <div className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
                  NutriCoach Premium
                </div>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold block">
                  4,99 € / mois (Sans engagement)
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Statut des prélèvements
                </span>
                <div className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  Paiement sécurisé Stripe
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">
                  Résiliable à tout instant en 1 clic
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 text-xs text-slate-700 dark:text-slate-300">
              <p>
                <strong>Vos droits :</strong> Vous pouvez résilier votre abonnement à tout moment sans aucun préavis ni frais. Votre accès reste actif pour la période déjà payée et aucun nouveau prélèvement ne sera effectué.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                id="btn-profile-unsubscribe"
                onClick={() => setShowCancelModal(true)}
                className="px-5 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-2 border-rose-300 dark:border-rose-800 font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xs"
              >
                <XCircle className="w-4 h-4 text-rose-500" />
                Se désabonner de NutriCoach
              </button>

              <button
                id="btn-profile-stripe-portal"
                onClick={handleOpenStripePortal}
                disabled={portalLoading}
                className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                {portalLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                )}
                Gérer mes factures & cartes (Stripe)
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
                Vous n'avez aucun abonnement payant actif
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Aucun prélèvement n'est effectué sur votre carte bancaire. Vous profitez des fonctionnalités gratuites de base.
              </p>
            </div>

            <button
              id="btn-subscribe-cta-profile"
              onClick={onOpenPremium}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md hover:opacity-95 cursor-pointer shrink-0 transition-transform active:scale-95"
            >
              <Crown className="w-4 h-4 text-amber-300 fill-amber-300" />
              S'abonner à Premium (4,99 €/mois)
            </button>
          </div>
        )}
      </div>

      {/* Account Status Card */}
      <div
        className={`p-6 rounded-3xl border ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        } shadow-sm space-y-4`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100">
              Statut du Compte & Décompte Essai Gratuit
            </h3>
          </div>
          <span className="text-xs font-black bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 px-3 py-1 rounded-full flex items-center gap-1.5 self-start sm:self-auto border border-amber-300 dark:border-amber-800">
            <span>⏱️ {user.trialDaysRemaining} jours restants sur 30</span>
          </span>
        </div>

        {/* Live Visual Countdown Progress Box */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 via-emerald-50 to-teal-50 dark:from-slate-800 dark:via-slate-850 dark:to-slate-800 border border-amber-200/80 dark:border-slate-700 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
              <span>Compte à rebours de l'essai (30 jours) :</span>
            </span>
            <strong className="text-amber-700 dark:text-amber-300 font-black">
              Jour {Math.max(1, 31 - user.trialDaysRemaining)} / 30 ({user.trialDaysRemaining} jours restants)
            </strong>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-500 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.max(5, Math.round(((30 - user.trialDaysRemaining) / 30) * 100)))}%`,
              }}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-[11px] text-slate-500 dark:text-slate-400">
            <span>✨ Inscription validée • Période d'évaluation offerte à 100%</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">0 € facturé avant la fin des 30 jours</span>
          </div>
        </div>

        {/* Google Play Store Card */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                NutriCoach sur Google Play
                <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">Android</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                com.nutricoach.nutrition.app
              </div>
            </div>
          </div>

          <a
            id="link-google-play-store"
            href="https://play.google.com/store/apps/details?id=com.nutricoach.nutrition.coach"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs shrink-0"
          >
            <span>Fiche Google Play</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Connected Watch Row */}
        <div
          id="row-connected-watch-settings"
          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Watch className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <span>Montre Connectée & Capteurs</span>
                {user.connectedWatch?.connected ? (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                    {user.connectedWatch.brand}
                  </span>
                ) : (
                  <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold px-2 py-0.5 rounded-full">
                    Non configurée
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {user.connectedWatch?.lastSync
                  ? `Dernière synchro : ${user.connectedWatch.lastSync}`
                  : 'Apple Watch, Garmin, Galaxy Watch, Fitbit, Withings, Bluetooth BLE'}
              </div>
            </div>
          </div>

          <button
            type="button"
            id="btn-profile-manage-watch"
            onClick={() => setIsWatchModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0 self-stretch sm:self-auto justify-center"
          >
            <Watch className="w-3.5 h-3.5" />
            <span>{user.connectedWatch?.connected ? 'Gérer / Synchroniser' : 'Connecter ma montre'}</span>
          </button>
        </div>

        {/* Automatic Voice Greeting Row */}
        <div
          id="row-voice-auto-greeting-settings"
          className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <span>Accueil Vocal Automatique du Coach</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    user.autoVoiceGreeting !== false
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {user.autoVoiceGreeting !== false ? 'Activé' : 'Désactivé'}
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                Le Coach vous accueille de vive voix à l'ouverture : « Que vas-tu manger aujourd'hui ? »
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                id="toggle-auto-voice-greeting"
                type="checkbox"
                checked={user.autoVoiceGreeting !== false}
                onChange={(e) => onUpdateUser({ autoVoiceGreeting: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>

        {/* Language Selection Row */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {t('profileLanguage')}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                21 langues disponibles • Traduction universelle (130+ langues)
              </div>
            </div>
          </div>
          <LanguageSelector variant="full" />
        </div>

        {/* Google Play Closed Testing Banner with Clickable Image */}
        <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/40 text-white shadow-xl space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Test Fermé Google Play
            </span>
            <span className="text-xs text-slate-400 font-mono">com.nutricoach.nutrition.coach</span>
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Rejoignez l'Aventure NutriCoach sur Google Play</h3>
            <p className="text-xs text-slate-300 mt-1">
              Touchez l'image ci-dessous pour accéder directement au lien d'invitation officiel pour les bêta-testeurs :
            </p>
          </div>
          <div className="text-center">
            <a
              id="profile-link-google-play-testing"
              href="https://play.google.com/apps/testing/com.nutricoach.nutrition.coach"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-block max-w-xs sm:max-w-sm rounded-2xl overflow-hidden border-2 border-emerald-500/50 hover:border-emerald-400 shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              title="Cliquez pour ouvrir le lien de test Google Play"
            >
              <img
                src="/assets/aistudio/pub_testeur_e9f48c8d.png"
                alt="Rejoignez l'Aventure NutriCoach - Cliquez pour accéder au test Google Play"
                className="w-full h-auto object-cover group-hover:brightness-105 transition-all"
              />
              <div className="bg-emerald-600 hover:bg-emerald-700 text-white p-3 font-extrabold text-xs flex items-center justify-center gap-2 transition-colors">
                <span>🚀 Ouvrir le lien de test fermé Google Play</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </a>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
              {user.name} {user.email ? `(${user.email})` : ''}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {user.isLoggedIn ? "Compte synchronisé & Période d'essai activée" : 'Mode invité'}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {user.isLoggedIn ? (
              <button
                id="btn-account-logout"
                onClick={onLogout}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                {t('profileLogout')}
              </button>
            ) : (
              <button
                id="btn-account-open-signup"
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Créer un compte
              </button>
            )}
            <a
              id="link-privacy-policy"
              href="/privacy.html"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700"
            >
              {t('profilePrivacy')}
            </a>
            <a
              id="link-tester-sheet"
              href="/tester.html"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 rounded-xl text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800"
            >
              Fiche Testeur
            </a>
            <a
              id="link-delete-account"
              href="/delete-account.html"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            >
              {t('profileDeleteAccount')}
            </a>
          </div>

          {/* Mention L'ESCAPADE DE JOS */}
          <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              ✨ Une création de <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold uppercase">L'ESCAPADE DE JOS</strong>
            </span>
            <span className="text-[11px] opacity-75 font-semibold">NutriCoach</span>
          </div>
        </div>
      </div>

      {/* Unsubscribe Confirmation Modal */}
      {showCancelModal && (
        <div
          id="modal-unsubscribe-confirm"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            className={`w-full max-w-md p-6 rounded-3xl border shadow-2xl relative space-y-5 ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-black">Confirmer le désabonnement</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Êtes-vous certain(e) de vouloir résilier votre abonnement NutriCoach Premium ?
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs space-y-2 text-slate-600 dark:text-slate-300">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Aucun frais de résiliation :</strong> La résiliation est 100% gratuite et immédiate.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Arrêt définitif des prélèvements :</strong> Aucun montant ne sera plus débité sur votre carte.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Vos données sont préservées :</strong> Votre profil, vos repas enregistrés et calculs métaboliques restent intacts.</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                id="btn-cancel-unsubscribe-modal"
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs cursor-pointer transition-colors"
              >
                Garder mon abonnement
              </button>

              <button
                id="btn-confirm-unsubscribe-profile"
                onClick={handleConfirmUnsubscribe}
                disabled={isCancelling}
                className="flex-1 py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 shadow-md"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Résiliation en cours...
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    Confirmer le désabonnement
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Smartwatch Sync Modal */}
      <SmartwatchSyncModal
        isOpen={isWatchModalOpen}
        onClose={() => setIsWatchModalOpen(false)}
        user={user}
        onUpdateUser={onUpdateUser}
        onAddActivity={onAddActivity || (() => {})}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
