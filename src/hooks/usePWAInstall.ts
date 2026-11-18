import { useEffect, useState, useCallback } from 'react';

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

declare global {
  interface Window {
    __deferredPWAInstallPrompt?: BeforeInstallPromptEvent | null;
  }
}

export type PWAPlatform = 'ios' | 'android' | 'desktop';

function checkIsStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const standaloneMedia =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    window.matchMedia('(display-mode: minimal-ui)').matches;
  const iosStandalone =
    (window.navigator as unknown as { standalone?: boolean }).standalone === true;
  const androidTWA =
    typeof document !== 'undefined' && document.referrer.startsWith('android-app://');
  return standaloneMedia || iosStandalone || androidTWA;
}

function detectPlatform(): PWAPlatform {
  if (typeof window === 'undefined') return 'desktop';
  const ua = window.navigator.userAgent.toLowerCase();
  if (/iphone|ipad|ipod/.test(ua)) return 'ios';
  if (/android/.test(ua)) return 'android';
  return 'desktop';
}

function detectInAppBrowser(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent || '';
  return /FBAN|FBAV|Instagram|WhatsApp|Messenger|Line\/|Snapchat|TikTok|BytedanceWebview|GSA\/|; wv\)/i.test(
    ua
  );
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(() => {
    if (typeof window !== 'undefined' && window.__deferredPWAInstallPrompt) {
      return window.__deferredPWAInstallPrompt;
    }
    return null;
  });
  const [isInstalled, setIsInstalled] = useState<boolean>(() => checkIsStandalone());
  const [platform, setPlatform] = useState<PWAPlatform>(() => detectPlatform());
  const [isInAppBrowser, setIsInAppBrowser] = useState<boolean>(() => detectInAppBrowser());

  useEffect(() => {
    const syncStandaloneState = () => {
      const standalone = checkIsStandalone();
      setIsInstalled(standalone);
      document.documentElement.classList.toggle('is-standalone', standalone);
    };

    syncStandaloneState();
    setPlatform(detectPlatform());
    setIsInAppBrowser(detectInAppBrowser());

    if (window.__deferredPWAInstallPrompt) {
      setDeferredPrompt(window.__deferredPWAInstallPrompt);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      window.__deferredPWAInstallPrompt = promptEvent;
      setDeferredPrompt(promptEvent);
    };

    const handleEarlyPromptReady = () => {
      if (window.__deferredPWAInstallPrompt) {
        setDeferredPrompt(window.__deferredPWAInstallPrompt);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      window.__deferredPWAInstallPrompt = null;
      document.documentElement.classList.add('is-standalone');
    };

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleMediaChange = () => syncStandaloneState();

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('nutricoach-pwa-prompt-ready', handleEarlyPromptReady);
    window.addEventListener('appinstalled', handleAppInstalled);
    mediaQuery.addEventListener?.('change', handleMediaChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('nutricoach-pwa-prompt-ready', handleEarlyPromptReady);
      window.removeEventListener('appinstalled', handleAppInstalled);
      mediaQuery.removeEventListener?.('change', handleMediaChange);
    };
  }, []);

  const install = useCallback(async () => {
    const promptToUse = deferredPrompt || window.__deferredPWAInstallPrompt;
    if (!promptToUse) return false;
    try {
      await promptToUse.prompt();
      const { outcome } = await promptToUse.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
        window.__deferredPWAInstallPrompt = null;
        return true;
      }
    } catch (err) {
      console.warn('PWA install prompt error:', err);
    }
    return false;
  }, [deferredPrompt]);

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isIOS: platform === 'ios',
    isAndroid: platform === 'android',
    platform,
    isInAppBrowser,
    install,
  };
}
