import React, { useState } from 'react';
import { Share2, Copy, Check, X, Globe, MessageCircle, Mail } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext.tsx';
import { getUiAuthBilling } from '../i18n/uiAuthBillingI18n.ts';
import { getUiCore } from '../i18n/uiCoreI18n.ts';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, isDarkMode }) => {
  const { language } = useLanguage();
  const ab = getUiAuthBilling(language);
  const uiCore = getUiCore(language);
  const [copiedApp, setCopiedApp] = useState(false);

  if (!isOpen) return null;

  const webAppUrl = typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-jvehdpluienrd2edq3fw3u-665307952988.europe-west2.run.app';

  const shareText = ab.shareText;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedApp(true);
    setTimeout(() => setCopiedApp(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: ab.shareAppTitle,
          text: shareText,
          url: webAppUrl,
        });
      } catch {
        // User cancelled or share failed
      }
    }
  };

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + webAppUrl)}`;
  const emailShareUrl = `mailto:?subject=${encodeURIComponent(ab.shareEmailSubject)}&body=${encodeURIComponent(shareText + '\n\n' + ab.shareEmailBodyPrefix + webAppUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md rounded-3xl p-6 border shadow-2xl relative transition-all ${
          isDarkMode
            ? 'bg-slate-900 border-slate-800 text-white'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label={uiCore.close}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Share2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black">{ab.shareHeading}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {ab.shareSubheading}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Quick Social Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href={whatsappShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-[#128C7E] dark:text-[#25D366] font-bold text-xs transition-colors"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>WhatsApp</span>
            </a>

            <a
              href={emailShareUrl}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-bold text-xs transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>{ab.shareEmailSms}</span>
            </a>
          </div>

          {/* Native Mobile Share Sheet if available */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>{ab.shareNativeBtn}</span>
            </button>
          )}

          {/* Link 1: Direct Web / PWA App */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                {ab.shareWebLinkLabel}
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                {ab.shareNoInstallBadge}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={webAppUrl}
                className="w-full text-xs font-mono px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 select-all"
              />
              <button
                onClick={() => handleCopy(webAppUrl)}
                className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 transition-colors cursor-pointer"
                title={ab.shareCopyLinkTitle}
              >
                {copiedApp ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            {copiedApp && (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-3 h-3" /> {ab.shareCopied}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
          <p className="text-[11px] text-slate-400">
            {ab.shareFooter}
          </p>
        </div>
      </div>
    </div>
  );
};
