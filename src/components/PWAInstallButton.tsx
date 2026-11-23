import React, { useState } from 'react';
import { Download, Smartphone, Share, MoreVertical, ExternalLink, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall, PWAPlatform } from '../hooks/usePWAInstall.ts';
import { useLanguage } from '../i18n/LanguageContext.tsx';
import { getUiCore } from '../i18n/uiCoreI18n.ts';

export const PWAInstallGuideModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  platform: PWAPlatform;
  isInAppBrowser: boolean;
}> = ({ isOpen, onClose, platform, isInAppBrowser }) => {
  const { language } = useLanguage();
  if (!isOpen) return null;

  const ui = getUiCore(language);
  const copy = {
    btnLabel: ui.pwaBtnLabel,
    btnTitle: ui.pwaBtnTitle,
    modalTitle: ui.pwaModalTitle,
    modalSubtitle: ui.pwaModalSubtitle,
    inAppWarningTitle: ui.pwaInAppWarnTitle,
    inAppWarningDesc: ui.pwaInAppWarnDesc,
    iosStep1: ui.pwaIos1,
    iosStep2: ui.pwaIos2,
    iosStep3: ui.pwaIos3,
    androidStep1: ui.pwaAndroid1,
    androidStep2: ui.pwaAndroid2,
    androidStep3: ui.pwaAndroid3,
    desktopStep1: ui.pwaDesktop1,
    desktopStep2: ui.pwaDesktop2,
    benefitFullScreen: ui.pwaBenefitFull,
    benefitIcon: ui.pwaBenefitIcon,
    close: ui.pwaGotIt,
  };

  return (
    <div
      id="modal-pwa-install-guide"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-emerald-200 dark:border-slate-800 space-y-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white cursor-pointer"
          aria-label={copy.close}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mx-auto shadow-md">
          <Smartphone className="w-6 h-6" />
        </div>

        <div className="text-center space-y-1">
          <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
            {copy.modalTitle}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {copy.modalSubtitle}
          </p>
        </div>

        {isInAppBrowser && (
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs space-y-1">
            <div className="font-black flex items-center gap-1.5">
              <ExternalLink className="w-4 h-4 shrink-0" />
              <span>{copy.inAppWarningTitle}</span>
            </div>
            <p className="font-semibold leading-relaxed">{copy.inAppWarningDesc}</p>
          </div>
        )}

        <div className="space-y-2 text-xs text-slate-700 dark:text-slate-200">
          {platform === 'ios' ? (
            <>
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70">
                <span className="font-black text-emerald-600">1.</span>
                <span className="flex items-center gap-1.5 flex-wrap">
                  {copy.iosStep1} <Share className="w-3.5 h-3.5 text-emerald-600 inline" />
                </span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70">
                <span className="font-black text-emerald-600">2.</span>
                <span>{copy.iosStep2}</span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70">
                <span className="font-black text-emerald-600">3.</span>
                <span>{copy.iosStep3}</span>
              </div>
            </>
          ) : platform === 'android' ? (
            <>
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70">
                <span className="font-black text-emerald-600">1.</span>
                <span className="flex items-center gap-1.5 flex-wrap">
                  {copy.androidStep1} <MoreVertical className="w-3.5 h-3.5 text-emerald-600 inline" />
                </span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70">
                <span className="font-black text-emerald-600">2.</span>
                <span>{copy.androidStep2}</span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70">
                <span className="font-black text-emerald-600">3.</span>
                <span>{copy.androidStep3}</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70">
                <span className="font-black text-emerald-600">1.</span>
                <span>{copy.desktopStep1}</span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/70">
                <span className="font-black text-emerald-600">2.</span>
                <span>{copy.desktopStep2}</span>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-emerald-700 dark:text-emerald-300 font-bold">
          <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-2 rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>{copy.benefitFullScreen}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-2 rounded-xl">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>{copy.benefitIcon}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 py-3 text-xs font-black text-white transition cursor-pointer shadow-sm"
        >
          {copy.close}
        </button>
      </div>
    </div>
  );
};

export const PWAInstallButton: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { isInstallable, isInstalled, platform, isInAppBrowser, install } = usePWAInstall();
  const { language } = useLanguage();
  const [showGuide, setShowGuide] = useState(false);

  // Already running in standalone/installed PWA or Android TWA: hide completely
  if (isInstalled) {
    return null;
  }

  const ui = getUiCore(language);
  const copy = {
    btnLabel: ui.pwaBtnLabel,
    btnTitle: ui.pwaBtnTitle,
  };

  const handleClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (!accepted) {
        setShowGuide(true);
      }
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      <button
        type="button"
        id={isInstallable ? 'btn-pwa-install' : 'btn-pwa-install-guide'}
        onClick={handleClick}
        className={`flex items-center gap-1.5 rounded-xl bg-emerald-600 px-2.5 sm:px-3 py-1.5 text-xs font-black text-white shadow-sm hover:bg-emerald-700 transition active:scale-95 cursor-pointer ${className}`}
        title={copy.btnTitle}
      >
        <Download className="w-3.5 h-3.5 shrink-0" />
        <span className="whitespace-nowrap">{copy.btnLabel}</span>
      </button>

      <PWAInstallGuideModal
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        platform={platform}
        isInAppBrowser={isInAppBrowser}
      />
    </>
  );
};
