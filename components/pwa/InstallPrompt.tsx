'use client';

import { useState, useEffect } from 'react';
import { X, Share, Plus, Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

type DeviceType = 'ios' | 'android' | 'desktop';

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const ua = navigator.userAgent;
    const isIOSDevice = /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
    const isAndroidDevice = /Android/i.test(ua);
    const isMobile = isIOSDevice || isAndroidDevice;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                         (navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isIOSDevice) setDeviceType('ios');
    else if (isAndroidDevice) setDeviceType('android');
    else setDeviceType('desktop');

    if (isStandalone || !isMobile) {
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
      <div className="mx-4 mb-4 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden max-w-md md:mx-auto">
        <div className="relative p-5">
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>

          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-[#0b0b0c] flex items-center justify-center shadow-md">
              <span className="text-white font-serif font-bold text-lg">HS</span>
            </div>

            <div className="flex-1 pr-6">
              <h3 className="font-serif font-bold text-lg text-gray-900 leading-tight">
                Add Heavy Status to Home Screen
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Get the app-like experience with faster access and offline support.
              </p>
            </div>
          </div>

          {deviceType === 'ios' ? (
            <div className="mt-4 bg-gray-50 rounded-xl p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                    <Share className="w-4 h-4 text-blue-500" />
                  </div>
                  <p className="text-sm text-gray-700">
                    Tap the <strong>Share</strong> button in Safari&apos;s toolbar
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                    <Plus className="w-4 h-4 text-blue-500" />
                  </div>
                  <p className="text-sm text-gray-700">
                    Scroll down and tap <strong>&quot;Add to Home Screen&quot;</strong>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                    <Smartphone className="w-4 h-4 text-blue-500" />
                  </div>
                  <p className="text-sm text-gray-700">
                    Tap <strong>&quot;Add&quot;</strong> to install the app
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={handleInstall}
              className="mt-4 w-full py-3.5 bg-[#0b0b0c] text-white font-semibold rounded-xl hover:bg-[#333] transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              <span>Add to Home Screen</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
