import React, { useEffect, useRef, useState } from 'react';
import { loadStripe, StripeEmbeddedCheckout } from '@stripe/stripe-js';
import {
  X,
  Lock,
  ShieldCheck,
  Loader2,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext.tsx';
import { getUiAuthBilling } from '../i18n/uiAuthBillingI18n.ts';
import { getUiCore } from '../i18n/uiCoreI18n.ts';

interface StripeCheckoutSheetProps {
  isOpen: boolean;
  onClose: () => void;
  plan: 'monthly' | 'yearly';
  trialDaysRemaining: number;
  userEmail?: string;
  userName?: string;
  isDarkMode: boolean;
  onPaymentSuccess: (customerEmail?: string) => void;
}

export const StripeCheckoutSheet: React.FC<StripeCheckoutSheetProps> = ({
  isOpen,
  onClose,
  plan,
  trialDaysRemaining,
  userEmail,
  userName,
  isDarkMode,
  onPaymentSuccess,
}) => {
  const { language } = useLanguage();
  const ab = getUiAuthBilling(language);
  const uiCore = getUiCore(language);
  const abRef = useRef(ab);
  abRef.current = ab;

  const mountRef = useRef<HTMLDivElement | null>(null);
  const checkoutInstanceRef = useRef<StripeEmbeddedCheckout | null>(null);

  const [mode, setMode] = useState<'loading' | 'embedded' | 'hosted' | 'verifying' | 'error'>('loading');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [hostedUrl, setHostedUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verifyMessage, setVerifyMessage] = useState<string | null>(null);
  const [embeddedReady, setEmbeddedReady] = useState(false);

  const isInIframe = (() => {
    try {
      return typeof window !== 'undefined' && window.self !== window.top;
    } catch {
      return true;
    }
  })();

  const destroyEmbeddedCheckout = () => {
    if (checkoutInstanceRef.current) {
      try {
        checkoutInstanceRef.current.destroy();
      } catch {
        // Ignore cleanup errors if already unmounted
      }
      checkoutInstanceRef.current = null;
    }
    if (mountRef.current) {
      mountRef.current.innerHTML = '';
    }
  };

  const verifyCurrentSession = async (targetSessionId?: string | null) => {
    const sid = targetSessionId || sessionId;
    if (!sid) {
      setVerifyMessage(abRef.current.stripeNoSession);
      return;
    }

    setMode('verifying');
    setVerifyMessage(null);
    try {
      const res = await fetch(`/api/stripe/verify-session?sessionId=${encodeURIComponent(sid)}`);
      const data = await res.json();
      if (data.isPremium && data.verified && !data.mock) {
        destroyEmbeddedCheckout();
        onPaymentSuccess(data.customerEmail);
        onClose();
        return;
      }

      setMode('hosted');
      setVerifyMessage(abRef.current.stripeIncomplete);
    } catch {
      setMode('hosted');
      setVerifyMessage(abRef.current.stripeVerifyFailed);
    }
  };

  const switchToHostedTab = async () => {
    destroyEmbeddedCheckout();
    setMode('loading');
    setErrorMessage(null);
    setVerifyMessage(null);

    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          userEmail: userEmail || '',
          userName: userName || '',
          skipTrial: trialDaysRemaining <= 0,
          trialDaysRemaining,
          uiMode: 'hosted',
        }),
      });
      const data = await res.json();

      if (data.url) {
        setSessionId(data.sessionId || null);
        setHostedUrl(data.url);
        setMode('hosted');
        return;
      }

      setMode('error');
      setErrorMessage(
        data.error || data.message || abRef.current.stripeCreateLinkErr
      );
    } catch {
      setMode('error');
      setErrorMessage(abRef.current.stripeNetworkErr);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      destroyEmbeddedCheckout();
      setMode('loading');
      setHostedUrl(null);
      setSessionId(null);
      setErrorMessage(null);
      setVerifyMessage(null);
      setEmbeddedReady(false);
      return;
    }

    let isCancelled = false;
    let watchdogTimer: number | null = null;
    let observer: MutationObserver | null = null;

    const initializeCheckout = async () => {
      setMode('loading');
      setErrorMessage(null);
      setVerifyMessage(null);
      setEmbeddedReady(false);
      destroyEmbeddedCheckout();

      try {
        // Inside an iframe (such as embedded web previews), Stripe checkout.stripe.com blocks framing
        // and third-party cookie restrictions can break nested embedded frames -> offer crisp external tab
        const requestedUiMode = isInIframe ? 'hosted' : 'embedded';

        const response = await fetch('/api/stripe/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            plan,
            userEmail: userEmail || '',
            userName: userName || '',
            skipTrial: trialDaysRemaining <= 0,
            trialDaysRemaining,
            uiMode: requestedUiMode,
          }),
        });

        const data = await response.json();
        if (isCancelled) return;

        if (!response.ok || data.error) {
          setMode('error');
          setErrorMessage(
            data.error || abRef.current.stripeContactErr
          );
          return;
        }

        if (data.sessionId) {
          setSessionId(data.sessionId);
        }

        // Hosted fallback path (always used inside iframes or when embedded is unavailable)
        if (data.uiMode !== 'embedded' || !data.clientSecret || !data.publishableKey) {
          if (data.url) {
            setHostedUrl(data.url);
            setMode('hosted');
          } else {
            setMode('error');
            setErrorMessage(
              data.message || abRef.current.stripeMissingKeyErr
            );
          }
          return;
        }

        // In-app Embedded Checkout path (Android TWA, Standalone PWA, top-level browser)
        setMode('embedded');
        const stripe = await loadStripe(data.publishableKey);
        if (isCancelled) return;

        if (!stripe) {
          await switchToHostedTab();
          return;
        }

        const checkout = await stripe.createEmbeddedCheckoutPage({
          clientSecret: data.clientSecret,
          onComplete: () => {
            if (!isCancelled) {
              verifyCurrentSession(data.sessionId);
            }
          },
        });

        if (isCancelled) {
          checkout.destroy();
          return;
        }

        checkoutInstanceRef.current = checkout;

        // Wait one animation frame to guarantee mountRef is attached
        requestAnimationFrame(() => {
          if (isCancelled || !mountRef.current) return;
          checkout.mount(mountRef.current);

          const checkMountedIframe = () => {
            if (!mountRef.current) return false;
            const iframe = mountRef.current.querySelector('iframe');
            if (iframe) {
              setEmbeddedReady(true);
              if (watchdogTimer !== null) {
                window.clearTimeout(watchdogTimer);
                watchdogTimer = null;
              }
              return true;
            }
            return false;
          };

          if (!checkMountedIframe() && mountRef.current) {
            observer = new MutationObserver(() => {
              if (checkMountedIframe() && observer) {
                observer.disconnect();
              }
            });
            observer.observe(mountRef.current, { childList: true, subtree: true });
          }

          // Fallback safety net: if embedded frame fails to mount within 8 seconds, switch cleanly to hosted link
          watchdogTimer = window.setTimeout(() => {
            if (!isCancelled && mountRef.current && !mountRef.current.querySelector('iframe')) {
              switchToHostedTab();
            }
          }, 8000);
        });
      } catch (err) {
        console.error('Erreur initialisation Stripe Checkout:', err);
        if (!isCancelled) {
          await switchToHostedTab();
        }
      }
    };

    initializeCheckout();

    return () => {
      isCancelled = true;
      if (watchdogTimer !== null) window.clearTimeout(watchdogTimer);
      if (observer) observer.disconnect();
      destroyEmbeddedCheckout();
    };
  }, [isOpen, plan, trialDaysRemaining, userEmail, userName]);

  if (!isOpen) return null;

  const priceLabel =
    plan === 'yearly'
      ? ab.stripeYearPriceLabel
      : ab.stripeMonthPriceLabel;

  return (
    <div
      id="stripe-checkout-sheet"
      className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto"
    >
      <div
        className={`w-full max-w-xl max-h-[92dvh] overflow-y-auto overscroll-contain rounded-3xl border shadow-2xl relative my-auto p-4 sm:p-6 ${
          isDarkMode
            ? 'bg-slate-900 border-slate-700 text-white'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-200 dark:border-slate-800">
          <button
            type="button"
            id="btn-stripe-sheet-back"
            onClick={() => {
              destroyEmbeddedCheckout();
              onClose();
            }}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{ab.stripeBack}</span>
          </button>

          <div className="text-center">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
              NutriCoach Premium
            </span>
            <span className="text-xs font-extrabold">{priceLabel}</span>
          </div>

          <button
            type="button"
            id="btn-stripe-sheet-close"
            onClick={() => {
              destroyEmbeddedCheckout();
              onClose();
            }}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 cursor-pointer"
            aria-label={uiCore.close}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Loading State */}
        {(mode === 'loading' || mode === 'verifying') && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <Loader2 className="w-9 h-9 animate-spin text-emerald-500" />
            <p className="text-sm font-bold">
              {mode === 'verifying'
                ? ab.stripeVerifying
                : ab.stripeOpening}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
              {ab.stripeSsl}
            </p>
          </div>
        )}

        {/* In-App Embedded Stripe Form (Zero redirect, zero blank page on TWA/PWA) */}
        {mode === 'embedded' && (
          <div className="space-y-3">
            {!embeddedReady && (
              <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
                <Loader2 className="w-7 h-7 animate-spin text-emerald-500" />
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {ab.stripeLoadingCard}
                </p>
              </div>
            )}

            <div className="bg-white rounded-2xl p-2 sm:p-3 border border-slate-200 shadow-inner min-h-[340px]">
              <div id="stripe-embedded-checkout" ref={mountRef} className="w-full" />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                {ab.stripeSecuredBy}
              </span>
              <button
                type="button"
                id="btn-switch-hosted-checkout"
                onClick={switchToHostedTab}
                className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                <span>
                  {ab.stripeOpenInBrowser}
                </span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Safe External Browser Tab View (Used automatically inside iframes / fallback) */}
        {mode === 'hosted' && hostedUrl && (
          <div className="py-4 space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black">
                {ab.stripeCompleteTitle}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                {ab.stripeCompleteDesc}
              </p>
            </div>

            <div className="space-y-3">
              <a
                id="btn-stripe-external-checkout"
                href={hostedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-amber-500 hover:opacity-95 text-white font-black text-sm shadow-xl inline-flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <Lock className="w-4 h-4" />
                <span>
                  {ab.stripeOpenCheckout(priceLabel)}
                </span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                type="button"
                id="btn-verify-stripe-payment"
                onClick={() => verifyCurrentSession()}
                className="w-full py-3 px-4 rounded-2xl border-2 border-emerald-500/40 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>
                  {ab.stripeVerifyDone}
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </button>
            </div>

            {verifyMessage && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs font-semibold">
                {verifyMessage}
              </div>
            )}
          </div>
        )}

        {/* Error State */}
        {mode === 'error' && (
          <div className="py-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-rose-700 dark:text-rose-300 max-w-sm mx-auto">
              {errorMessage}
            </p>
            <button
              type="button"
              onClick={switchToHostedTab}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
            >
              {ab.stripeRetry}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
