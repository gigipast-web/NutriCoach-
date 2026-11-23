import React, { useState } from 'react';
import { Crown, Check, Sparkles, X, ShieldCheck, Lock, Loader2, AlertTriangle } from 'lucide-react';
import { StripeCheckoutSheet } from './StripeCheckoutSheet.tsx';
import { useLanguage } from '../i18n/LanguageContext.tsx';
import { getUiAuthBilling } from '../i18n/uiAuthBillingI18n.ts';
import { getUiCore } from '../i18n/uiCoreI18n.ts';

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
  const { language } = useLanguage();
  const ab = getUiAuthBilling(language);
  const uiCore = getUiCore(language);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [statusIsError, setStatusIsError] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = () => {
    setStatusNotice(null);
    setStatusIsError(false);
    setIsCheckoutOpen(true);
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
      setStatusNotice(ab.premUnsubscribedNotice);
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  const benefits = ab.premBenefits;
  const selectedPrice =
    billingCycle === 'monthly' ? `4,99 €${ab.perMonth}` : `39,99 €${ab.perYear}`;

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
          aria-label={uiCore.close}
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
              ? ab.premBadgeActive
              : trialDaysLeft <= 0
              ? ab.premBadgeEnded
              : ab.premBadgeDays(trialDaysLeft)}
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">NutriCoach Premium</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            {isPremium
              ? ab.premSubActive
              : trialDaysLeft <= 0
              ? ab.premSubEnded
              : ab.premSubTrial}
          </p>
        </div>

        {/* If user is already Premium */}
        {isPremium ? (
          <div className="space-y-4 mb-4">
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
              <div className="font-extrabold flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                {ab.premActiveStatusLine}
              </div>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                {ab.premActiveUnsubNote}
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
                    <h4 className="font-bold text-xs">{ab.premConfirmCancelTitle}</h4>
                    <p className="text-[11px] text-rose-600 dark:text-rose-300 mt-0.5">
                      {ab.premConfirmCancelDesc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    id="btn-cancel-unsubscribe"
                    onClick={() => setShowCancelConfirm(false)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer"
                  >
                    {ab.premKeepSub}
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
                    {ab.premConfirmUnsubBtn}
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
                  {ab.premUnsubBtn}
                </button>
                <p className="text-[10px] text-center text-slate-400">
                  {ab.premUnsubImmediate}
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
                  {ab.monthly}
                </span>
                <div className="text-xl font-black text-slate-900 dark:text-white">
                  4,99 €<span className="text-xs font-normal text-slate-400">{ab.perMonth}</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">
                  {trialDaysLeft <= 0 ? ab.premMonthPayReq : ab.premMonthTrial}
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
                  {ab.save30}
                </span>
                <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 block mb-1">
                  {ab.yearly}
                </span>
                <div className="text-xl font-black text-slate-900 dark:text-white">
                  39,99 €<span className="text-xs font-normal text-slate-400">{ab.perYear}</span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-1">{ab.only333Mo}</span>
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
              className="w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 hover:opacity-95 text-white font-black py-4 rounded-2xl shadow-xl flex items-center justify-center gap-2 text-sm cursor-pointer transition-transform active:scale-95"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              {trialDaysLeft <= 0
                ? ab.premPayContinueBtn(selectedPrice)
                : ab.premStartTrialBtn}
            </button>
          </>
        )}

        {/* Stripe Trust Badges */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            {ab.premTrustLeft}
          </span>
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            {ab.premTrustRight}
          </span>
        </div>
      </div>

      <StripeCheckoutSheet
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        plan={billingCycle}
        trialDaysRemaining={trialDaysLeft}
        userEmail={userEmail}
        userName={userName}
        isDarkMode={isDarkMode}
        onPaymentSuccess={() => {
          setIsCheckoutOpen(false);
          onUpgrade();
          onClose();
        }}
      />
    </div>
  );
};
