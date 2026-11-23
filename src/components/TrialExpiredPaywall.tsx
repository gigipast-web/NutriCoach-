import React, { useState } from 'react';
import {
  Lock,
  Crown,
  Check,
  ShieldCheck,
  CreditCard,
  User,
  Sparkles,
  LogOut,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext.tsx';
import { getUiAuthBilling } from '../i18n/uiAuthBillingI18n.ts';
import { StripeCheckoutSheet } from './StripeCheckoutSheet.tsx';

interface TrialExpiredPaywallProps {
  isDarkMode: boolean;
  userEmail?: string;
  userName?: string;
  onLogout: () => void;
  onPaymentSuccess?: (customerEmail?: string) => void;
}

export const TrialExpiredPaywall: React.FC<TrialExpiredPaywallProps> = ({
  isDarkMode,
  userEmail,
  userName,
  onLogout,
  onPaymentSuccess,
}) => {
  const { language } = useLanguage();
  const ab = getUiAuthBilling(language);

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showAccountDetails, setShowAccountDetails] = useState(false);

  const handlePayNow = () => {
    setIsCheckoutOpen(true);
  };

  const benefits = ab.paywallBenefits;
  const selectedPrice =
    billingCycle === 'monthly' ? `4,99 €${ab.perMonth}` : `39,99 €${ab.perYear}`;

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
            {ab.paywallBadge}
          </span>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            {ab.paywallTitle}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
            {ab.paywallDesc}
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
              {ab.monthly}
            </span>
            <div className="text-xl font-black">
              4,99 €
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {ab.perMonth}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">
              {ab.cancelAnytime}
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
              {ab.yearly}
            </span>
            <div className="text-xl font-black">
              39,99 €
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {ab.perYear}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1">
              {ab.only333Mo}
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

        {/* Primary Stripe Pay CTA */}
        <button
          type="button"
          id="btn-paywall-continue-stripe"
          onClick={handlePayNow}
          className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 hover:opacity-95 text-white font-black text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
        >
          <CreditCard className="w-5 h-5" />
          <span>
            {ab.payAndContinue(selectedPrice)}
          </span>
          <Sparkles className="w-4 h-4 text-amber-200" />
        </button>

        {/* Trust + Account footer (kept inside paywall so no bypass to ProfileView) */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              {ab.stripeSecureShort}
            </span>
            <button
              type="button"
              id="btn-paywall-profile"
              onClick={() => setShowAccountDetails((prev) => !prev)}
              className="inline-flex items-center gap-1 font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 underline cursor-pointer px-2 py-1"
            >
              <User className="w-3.5 h-3.5" />
              <span>{ab.myAccountLogout}</span>
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
                    {userName || ab.userFallback}
                  </div>
                  {userEmail && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{userEmail}</div>
                  )}
                </div>
                <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 uppercase">
                  {ab.trialExpiredBadge}
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
                    {ab.privacyPolicy}
                  </a>
                  <a
                    href="/delete-account.html"
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-rose-600 dark:text-rose-400"
                  >
                    {ab.deleteAccount}
                  </a>
                </div>

                <button
                  type="button"
                  id="btn-paywall-logout"
                  onClick={onLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold cursor-pointer transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{ab.logoutBtn}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <StripeCheckoutSheet
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        plan={billingCycle}
        trialDaysRemaining={0}
        userEmail={userEmail}
        userName={userName}
        isDarkMode={isDarkMode}
        onPaymentSuccess={(customerEmail) => {
          setIsCheckoutOpen(false);
          if (onPaymentSuccess) {
            onPaymentSuccess(customerEmail);
          }
        }}
      />
    </div>
  );
};
