import React, { useState } from 'react';
import { Crown, Check, Sparkles, X, ShieldCheck, Lock, Loader2, AlertTriangle } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  onCancelSubscription?: () => void;
  isDarkMode: boolean;
  trialDaysLeft: number;
  userEmail?: string;
  userName?: string;
  isPremium?: boolean;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  onUpgrade,
  onCancelSubscription,
  isDarkMode,
  trialDaysLeft,
  userEmail,
  userName,
  isPremium,
}) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [statusIsError, setStatusIsError] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    setIsLoading(true);
    setStatusNotice(null);
    setStatusIsError(false);

    try {
      const isTrialEnded = trialDaysLeft <= 0 && !isPremium;
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: billingCycle,
          userEmail: userEmail || '',
          userName: userName || '',
          skipTrial: isTrialEnded,
          trialDaysRemaining: trialDaysLeft,
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Real Stripe checkout session created -> redirect user to Stripe's hosted checkout
        window.location.href = data.url;
        return;
      }

      if (!response.ok || data.error) {
        setStatusIsError(true);
        setStatusNotice(
          data.error || 'Impossible de contacter Stripe pour le moment. Veuillez réessayer.'
        );
        return;
      }

      if (isTrialEnded) {
        setStatusIsError(true);
        setStatusNotice(
          data.message ||
            "Le paiement Stripe doit être configuré (STRIPE_SECRET_KEY) pour valider votre abonnement après la fin de l'essai."
        );
        return;
      }

      // Never grant permanent Premium without a real Stripe checkout redirect
      setStatusIsError(true);
      setStatusNotice(
        data.message ||
          "La configuration Stripe (STRIPE_SECRET_KEY) est requise pour activer l'abonnement payant."
      );
    } catch (err: any) {
      console.error('Erreur Stripe Checkout:', err);
      setStatusIsError(true);
      setStatusNotice('Erreur réseau lors de la connexion à Stripe. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setIsCancelling(true);
    try {
      await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail || '' }),
      });
    } catch (err) {
      console.error('Erreur lors du désabonnement:', err);
    } finally {
      if (onCancelSubscription) {
        onCancelSubscription();
      }
      setIsCancelling(false);
      setShowCancelConfirm(false);
      setStatusNotice('Votre abonnement a été résilié avec succès. Aucun frais ne vous sera facturé.');
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  const benefits = [
    "Menus diététiques sur-mesure générés par l'IA",
    'Coach vocal et textuel NutriCoach IA illimité',
    'Analyse instantanée des photos de vos repas',
    'Catalogue complet de 100+ recettes exclusives',
    'Programme sportif & synchronisation montres',
    'Export PDF des bilans de santé et courbes',
    'Paiement 100% sécurisé géré par Stripe (Chiffrement SSL 256-bit)',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div
        className={`w-full max-w-lg max-h-[90dvh] overflow-y-auto overscroll-contain p-5 sm:p-7 rounded-3xl border shadow-2xl relative my-auto ${
          isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <button
          id="btn-close-premium-modal"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1.5 mb-4 sm:mb-5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-400 via-emerald-500 to-teal-500 mx-auto flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <Crown className="w-7 h-7 sm:w-8 sm:h-8 fill-white" />
          </div>
          <span
            className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider inline-block ${
              !isPremium && trialDaysLeft <= 0
                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
            }`}
          >
            {isPremium
              ? 'Abonnement Actif'
              : trialDaysLeft <= 0
              ? 'Essai gratuit terminé (0 jour restant)'
              : `${trialDaysLeft} Jours d'essai gratuit restant`}
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">NutriCoach Premium</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            {isPremium
              ? 'Votre formule Premium est active sans engagement.'
              : trialDaysLeft <= 0
              ? 'Votre période d’essai de 30 jours est terminée. Activez votre abonnement pour continuer.'
              : 'Accélérez vos résultats grâce au suivi nutritionnel IA personnalisé.'}
          </p>
        </div>

        {/* If user is already Premium */}
        {isPremium ? (
          <div className="space-y-4 mb-4">
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
              <div className="font-extrabold flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Statut : Abonnement actif (4,99 €/mois • Sans engagement)
              </div>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                Vous pouvez vous désabonner à tout moment en 1 clic sans aucun frais.
              </p>
            </div>

            {statusNotice && (
              <div className="p-3 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold text-center">
                {statusNotice}
              </div>
            )}

            {/* Unsubscribe Section placed right at top of active view for instant access */}
            {showCancelConfirm ? (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-left space-y-3">
                <div className="flex items-start gap-2.5 text-rose-800 dark:text-rose-200">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs">Confirmer la résiliation</h4>
                    <p className="text-[11px] text-rose-600 dark:text-rose-300 mt-0.5">
                      Êtes-vous sûr(e) de vouloir vous désabonner ? Aucun prélèvement futur ne sera effectué. Sans abonnement actif à la fin des 30 jours d'essai, l'application nécessitera un paiement pour continuer.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    id="btn-cancel-unsubscribe"
                    onClick={() => setShowCancelConfirm(false)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
                  >
                    Garder mon abonnement
                  </button>
                  <button
                    id="btn-confirm-unsubscribe"
                    onClick={handleUnsubscribe}
                    disabled={isCancelling}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isCancelling ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : null}
                    Confirmer le désabonnement
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <button
                  id="btn-modal-unsubscribe"
                  onClick={() => setShowCancelConfirm(true)}
                  className="w-full py-3 px-4 rounded-2xl border-2 border-rose-300 hover:border-rose-500 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4 text-rose-500" />
                  Se désabonner de NutriCoach
                </button>
                <p className="text-[10px] text-center text-slate-400">
                  Résiliation immédiate, sans frais, réactivable à tout moment.
                </p>
              </div>
            )}

            {/* Benefits Checklist */}
            <div className="space-y-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
              {benefits.slice(0, 4).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Pricing Options */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div
                id="plan-monthly"
                onClick={() => setBillingCycle('monthly')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  billingCycle === 'monthly'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 shadow-sm ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 opacity-80 hover:opacity-100'
                }`}
              >
                <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 block mb-1">
                  Mensuel
                </span>
                <div className="text-xl font-black text-slate-900 dark:text-white">
                  4,99 €<span className="text-xs font-normal text-slate-400">/mois</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">
                  {trialDaysLeft <= 0 ? 'Paiement requis pour continuer' : '30 jours offerts puis 4,99 €/mois'}
                </span>
              </div>

              <div
                id="plan-yearly"
                onClick={() => setBillingCycle('yearly')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all relative ${
                  billingCycle === 'yearly'
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 shadow-sm ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 opacity-80 hover:opacity-100'
                }`}
              >
                <span className="absolute -top-2.5 right-3 bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase shadow-xs">
                  Économisez 30%
                </span>
                <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 block mb-1">
                  Annuel
                </span>
                <div className="text-xl font-black text-slate-900 dark:text-white">
                  39,99 €<span className="text-xs font-normal text-slate-400">/an</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">Soit 3,33 €/mois</span>
              </div>
            </div>

            {/* Benefits Checklist */}
            <div className="space-y-2 mb-6 text-xs">
              {benefits.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{item}</span>
                </div>
              ))}
            </div>

            {statusNotice && (
              <div
                className={`p-3 mb-4 rounded-xl text-xs font-medium text-center ${
                  statusIsError
                    ? 'bg-rose-100/80 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
                    : 'bg-emerald-100/70 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                }`}
              >
                {statusNotice}
              </div>
            )}

            <button
              id="btn-confirm-start-trial"
              onClick={handleCheckout}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 hover:opacity-95 text-white font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 text-sm cursor-pointer transition-transform active:scale-95 disabled:opacity-75"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connexion sécurisée à Stripe...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  {trialDaysLeft <= 0
                    ? `Payer et continuer — ${billingCycle === 'monthly' ? '4,99 €/mois' : '39,99 €/an'} (Stripe)`
                    : 'Démarrer mon essai (Paiement sécurisé Stripe)'}
                </>
              )}
            </button>
          </>
        )}

        {/* Stripe Trust Badges */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Paiement Stripe 100% sécurisé
          </span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            Sans engagement, résiliation en 1 clic
          </span>
        </div>
      </div>
    </div>
  );
};
