import React, { useState } from 'react';
import {
  Lock,
  Crown,
  Check,
  ShieldCheck,
  Loader2,
  CreditCard,
  User,
  Sparkles,
  LogOut,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext.tsx';

interface TrialExpiredPaywallProps {
  isDarkMode: boolean;
  userEmail?: string;
  userName?: string;
  onLogout: () => void;
}

export const TrialExpiredPaywall: React.FC<TrialExpiredPaywallProps> = ({
  isDarkMode,
  userEmail,
  userName,
  onLogout,
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showAccountDetails, setShowAccountDetails] = useState(false);

  const handlePayNow = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: billingCycle,
          userEmail: userEmail || '',
          userName: userName || '',
          skipTrial: true,
          trialDaysRemaining: 0,
        }),
      });
      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      setErrorMessage(
        data.error ||
          data.message ||
          (isEn
            ? 'Stripe checkout must be configured (STRIPE_SECRET_KEY) to validate your paid subscription.'
            : 'Le paiement par carte Stripe (STRIPE_SECRET_KEY) doit être configuré pour activer votre abonnement.')
      );
    } catch {
      setErrorMessage(
        isEn
          ? 'Network error while connecting to Stripe. Please check your connection.'
          : 'Erreur réseau lors de la connexion à Stripe. Vérifiez votre connexion.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = isEn
    ? [
        'Unlimited AI Nutrition Coach (text & voice)',
        'Instant AI Meal Photo & Barcode Scanner',
        '100+ personalized healthy recipes in 21 languages',
        'Full calorie, hydration, weight & watch sync tracking',
      ]
    : [
        'Coach nutritionnel IA illimité (écrit & vocal)',
        'Scanner photo IA de vos repas & code-barres instantané',
        'Catalogue complet de 100+ recettes personnalisées',
        'Suivi complet calories, poids, hydratation et montre connectée',
      ];

  return (
    <div id="trial-expired-paywall" className="max-w-xl mx-auto py-4 sm:py-8">
      <div
        className={`rounded-3xl border p-6 sm:p-8 shadow-2xl space-y-6 ${
          isDarkMode
            ? 'bg-slate-900 border-rose-900/60 text-white'
            : 'bg-white border-rose-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="text-center space-y-2.5">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-500 via-amber-500 to-emerald-500 mx-auto flex items-center justify-center text-white shadow-lg">
            <Lock className="w-8 h-8" />
          </div>

          <span className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-300 dark:border-rose-800 text-[11px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            {isEn
              ? '30-day trial ended • Payment required'
              : "Essai de 30 jours terminé • Paiement requis"}
          </span>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {isEn
              ? 'Pay & Subscribe to Continue'
              : 'Payez pour continuer à utiliser NutriCoach'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
            {isEn
              ? 'Your 30-day free trial has ended. There is no free tier after the trial — choose a subscription below to unlock NutriCoach and keep all your saved progress.'
              : 'Vos 30 jours d’essai gratuit sont terminés. Il n’y a pas de formule gratuite sans abonnement : réglez votre abonnement ci-dessous pour continuer à utiliser l’application et retrouver toutes vos données.'}
          </p>
        </div>

        {/* Plan Selector */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            id="paywall-plan-monthly"
            onClick={() => setBillingCycle('monthly')}
            className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
              billingCycle === 'monthly'
                ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 ring-2 ring-emerald-500/25'
                : 'border-slate-200 dark:border-slate-800 opacity-85 hover:opacity-100'
            }`}
          >
            <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 block mb-1">
              {isEn ? 'Monthly' : 'Mensuel'}
            </span>
            <div className="text-xl font-black">
              4,99 €
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {isEn ? '/mo' : '/mois'}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">
              {isEn ? 'Cancel anytime' : 'Résiliable à tout moment'}
            </span>
          </button>

          <button
            type="button"
            id="paywall-plan-yearly"
            onClick={() => setBillingCycle('yearly')}
            className={`p-4 rounded-2xl border text-left cursor-pointer transition-all relative ${
              billingCycle === 'yearly'
                ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 ring-2 ring-emerald-500/25'
                : 'border-slate-200 dark:border-slate-800 opacity-85 hover:opacity-100'
            }`}
          >
            <span className="absolute -top-2.5 right-3 bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase shadow-xs">
              -30%
            </span>
            <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 block mb-1">
              {isEn ? 'Yearly' : 'Annuel'}
            </span>
            <div className="text-xl font-black">
              39,99 €
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {isEn ? '/yr' : '/an'}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">
              {isEn ? 'Only 3.33 €/mo' : 'Soit 3,33 €/mois'}
            </span>
          </button>
        </div>

        {/* Benefits */}
        <div className="space-y-2 text-xs">
          {benefits.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <Check className="w-3 h-3" />
              </div>
              <span className="font-semibold text-slate-700 dark:text-slate-200">{item}</span>
            </div>
          ))}
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-200 text-xs font-bold text-center">
            {errorMessage}
          </div>
        )}

        {/* Primary Stripe Pay CTA */}
        <button
          type="button"
          id="btn-paywall-continue-stripe"
          onClick={handlePayNow}
          disabled={isLoading}
          className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 hover:opacity-95 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95 disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{isEn ? 'Connecting to Stripe...' : 'Redirection vers Stripe...'}</span>
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              <span>
                {isEn
                  ? `Pay & Continue (${billingCycle === 'monthly' ? '4.99 €/mo' : '39.99 €/yr'})`
                  : `Payer et continuer (${billingCycle === 'monthly' ? '4,99 €/mois' : '39,99 €/an'})`}
              </span>
              <Sparkles className="w-4 h-4 text-amber-200" />
            </>
          )}
        </button>

        {/* Trust + Account footer (kept inside paywall so no bypass to ProfileView) */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              {isEn
                ? '100% secure Stripe payment • Cancel anytime'
                : 'Paiement Stripe 100% sécurisé • Résiliation en 1 clic'}
            </span>
            <button
              type="button"
              id="btn-paywall-profile"
              onClick={() => setShowAccountDetails((prev) => !prev)}
              className="inline-flex items-center gap-1 font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 underline cursor-pointer px-2 py-1"
            >
              <User className="w-3.5 h-3.5" />
              <span>{isEn ? 'My Account / Log out' : 'Mon compte / Déconnexion'}</span>
              {showAccountDetails ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {showAccountDetails && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="font-black text-slate-800 dark:text-white">
                    {userName || 'Utilisateur'}
                  </div>
                  {userEmail && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{userEmail}</div>
                  )}
                </div>
                <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 uppercase">
                  {isEn ? 'Trial ended' : 'Essai expiré'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2 flex-wrap pt-2 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3 text-[11px]">
                  <a
                    href="/privacy.html"
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-slate-600 dark:text-slate-300 hover:text-emerald-600"
                  >
                    {isEn ? 'Privacy Policy' : 'Confidentialité'}
                  </a>
                  <a
                    href="/delete-account.html"
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-rose-600 dark:text-rose-400"
                  >
                    {isEn ? 'Delete Account' : 'Supprimer mon compte'}
                  </a>
                </div>

                <button
                  type="button"
                  id="btn-paywall-logout"
                  onClick={onLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold cursor-pointer transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Log out' : 'Se déconnecter'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
