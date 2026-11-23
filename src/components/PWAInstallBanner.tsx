import React, { useState, useEffect } from 'react';
import { Smartphone, X, Download, ExternalLink } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';
import { useLanguage } from '../i18n/LanguageContext.tsx';
import { getUiCore } from '../i18n/uiCoreI18n.ts';
import { PWAInstallGuideModal } from './PWAInstallButton.tsx';

const DISMISS_STORAGE_KEY = 'nutricoach_pwa_banner_dismissed_at';
const DISMISS_TTL_MS = 24 * 60 * 60 * 1000;

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, platform, isInAppBrowser, install } = usePWAInstall();
  const { language } = useLanguage();
  const ui = getUiCore(language);
  const [dismissed, setDismissed] = useState<boolean>(true);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    if (isInstalled) {
      setDismissed(true);
      return;
    }
    try {
      const raw = localStorage.getItem(DISMISS_STORAGE_KEY);
      if (raw) {
        const ts = parseInt(raw, 10);
        if (!isNaN(ts) && Date.now() - ts < DISMISS_TTL_MS) {
          setDismissed(true);
          return;
        }
      }
      setDismissed(false);
    } catch {
      setDismissed(false);
    }
  }, [isInstalled]);

  if (isInstalled || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_STORAGE_KEY, String(Date.now()));
    } catch {
      // ignore storage failure
    }
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (accepted) return;
    }
    setShowGuide(true);
  };

  const title = isInAppBrowser ? ui.pwaInAppTitle : ui.pwaAppTitle;
  const subtitle = isInAppBrowser ? ui.pwaInAppSub : ui.pwaAppSub;
  const ctaLabel = isInAppBrowser ? ui.pwaHowTo : ui.pwaOpenAsApp;

  return (
    <>
      <div
        id="pwa-floating-install-banner"
        className="fixed bottom-[4.75rem] lg:bottom-5 left-3 right-3 sm:left-auto sm:right-5 sm:max-w-md z-30 rounded-2xl bg-gradient-to-r from-[#163321] via-[#1F6F43] to-[#115E59] text-white p-3 shadow-2xl border border-emerald-400/30 flex items-center justify-between gap-2.5 animate-in fade-in slide-in-from-bottom-4"
      >
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5 text-emerald-200" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-black truncate">{title}</div>
            <div className="text-[11px] text-emerald-100/95 font-semibold truncate">{subtitle}</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            id="btn-floating-pwa-install"
            onClick={handleInstallClick}
            className="px-3 py-1.5 rounded-xl bg-white text-[#163321] hover:bg-emerald-50 text-xs font-black flex items-center gap-1 shadow-xs cursor-pointer transition active:scale-95"
          >
            {isInAppBrowser ? (
              <ExternalLink className="w-3.5 h-3.5 text-[#1F6F43]" />
            ) : (
              <Download className="w-3.5 h-3.5 text-[#1F6F43]" />
            )}
            <span>{ctaLabel}</span>
          </button>
          <button
            type="button"
            id="btn-dismiss-pwa-banner"
            onClick={handleDismiss}
            className="p-1.5 rounded-xl text-white/75 hover:text-white hover:bg-white/10 cursor-pointer"
            aria-label={ui.close}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <PWAInstallGuideModal
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        platform={platform}
        isInAppBrowser={isInAppBrowser}
      />
    </>
  );
};
