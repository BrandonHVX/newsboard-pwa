'use client';

import { useState, useEffect } from 'react';
import { X, Share, Plus } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as { MSStream?: unknown }).MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         (navigator as unknown as { standalone?: boolean }).standalone === true;
    
    setIsIOS(isIOSDevice);

    if (isStandalone) {
      return;
    }

    const dismissed = localStorage.getItem('installPromptDismissed');
    const dismissedTime = dismissed ? parseInt(dismissed, 10) : 0;
    const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

    if (daysSinceDismissed < 7) {
      return;
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowPrompt(true), 2000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (isIOSDevice) {
      setTimeout(() => setShowPrompt(true), 2000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('installPromptDismissed', Date.now().toString());
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] animate-slide-up">
      <div className="mx-4 mb-4 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="relative p-4">
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-[#0b0b0c] flex items-center justify-center shadow-md">
              <span className="text-white font-serif font-bold text-lg">HS</span>
            </div>

            <div className="flex-1 pr-6">
              <h3 className="font-serif font-bold text-lg text-gray-900 leading-tight">
                Get Heavy Status
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Install our app for instant access to breaking news and live updates.
              </p>
            </div>
          </div>

          {isIOS ? (
            <div className="mt-4 bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-700 font-medium mb-3">To install:</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="text-accent font-bold text-sm">1</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Tap the</span>
                    <Share className="w-5 h-5 text-blue-500" />
                    <span>Share button</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="text-accent font-bold text-sm">2</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Tap</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white rounded border border-gray-200">
                      <Plus className="w-4 h-4" />
                      <span>Add to Home Screen</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={handleInstall}
              className="mt-4 w-full py-3 bg-[#0b0b0c] text-white font-semibold rounded-xl hover:bg-[#333] transition-colors"
            >
              Install App
            </button>
          )}
        </div>

        <div className="h-1 bg-gray-100">
          <div className="h-full w-12 mx-auto bg-gray-300 rounded-full" />
        </div>
      </div>
    </div>
  );
}
