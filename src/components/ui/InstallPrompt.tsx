'use client';

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * PWA Install Prompt
 * Android/Chrome: captures beforeinstallprompt and shows a custom banner.
 * iOS/Safari: shows manual instructions (iOS doesn't allow programmatic install).
 * Dismissed state persists in localStorage for 7 days.
 */
export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showAndroid, setShowAndroid] = useState(false);
  const [showIOS, setShowIOS] = useState(false);

  useEffect(() => {
    // Don't show if already dismissed recently
    const dismissed = localStorage.getItem('nc_install_dismissed');
    if (dismissed && Date.now() - parseInt(dismissed) < 7 * 24 * 60 * 60 * 1000) return;

    // Don't show if already running as installed PWA
    if (window.matchMedia('(display-mode: standalone)').matches) return;

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream: unknown }).MSStream;

    if (isIOS) {
      setShowIOS(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowAndroid(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const dismiss = () => {
    localStorage.setItem('nc_install_dismissed', Date.now().toString());
    setShowAndroid(false);
    setShowIOS(false);
  };

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') dismiss();
    setDeferredPrompt(null);
    setShowAndroid(false);
  };

  if (!showAndroid && !showIOS) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 p-4 sm:p-6">
      <div className="mx-auto max-w-md rounded-2xl bg-brand-700 text-white shadow-2xl p-4 flex gap-3 items-start">
        <span className="text-2xl shrink-0" aria-hidden>📱</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">Add to Home Screen</p>
          {showAndroid && (
            <p className="text-xs mt-0.5 text-brand-200">
              Install Northern Connect for quick access — works offline too.
            </p>
          )}
          {showIOS && (
            <p className="text-xs mt-0.5 text-brand-200">
              Tap the <strong>Share button ↑</strong> in Safari, then
              tap <strong>&ldquo;Add to Home Screen&rdquo;</strong>.
            </p>
          )}
        </div>
        <div className="flex gap-2 shrink-0 items-center">
          {showAndroid && (
            <button
              onClick={install}
              className="rounded-lg bg-white text-brand-700 px-3 py-1.5 text-xs font-semibold hover:bg-brand-50"
            >
              Install
            </button>
          )}
          <button
            onClick={dismiss}
            aria-label="Dismiss install prompt"
            className="text-brand-300 hover:text-white text-lg leading-none"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
