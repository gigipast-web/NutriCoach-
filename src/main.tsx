import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import { LanguageProvider } from './i18n/LanguageContext.tsx';
import './index.css';

// Capture Chromium beforeinstallprompt early (before React mounts) so it is never missed
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    (window as unknown as { __deferredPWAInstallPrompt?: Event }).__deferredPWAInstallPrompt = e;
    window.dispatchEvent(new CustomEvent('nutricoach-pwa-prompt-ready'));
  });
}

// Register Service Worker via vite-plugin-pwa
if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV !== 'test') {
  try {
    registerSW({
      immediate: true,
      onRegisteredSW(swUrl) {
        console.log('NutriCoach Service Worker registered:', swUrl);
      },
      onRegisterError(err) {
        console.warn('NutriCoach Service Worker registration failed:', err);
      },
    });
  } catch (err) {
    console.warn('NutriCoach Service Worker setup skipped:', err);
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
);
