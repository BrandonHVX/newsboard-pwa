'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Bell, BellRing } from 'lucide-react';

declare global {
  interface Window {
    OneSignalDeferred?: Array<(oneSignal: OneSignalType) => void>;
    OneSignal?: OneSignalType;
  }
}

interface OneSignalType {
  init: (config: { appId: string; allowLocalhostAsSecureOrigin?: boolean }) => Promise<void>;
  Notifications: {
    permission: boolean;
    permissionNative: NotificationPermission;
    requestPermission: () => Promise<void>;
    isPushSupported: () => boolean;
  };
  User: {
    PushSubscription: {
      optedIn: boolean;
      optIn: () => Promise<void>;
    };
  };
}

export function NotificationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [oneSignalReady, setOneSignalReady] = useState(false);

  const checkAndShowPrompt = useCallback(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                         (navigator as unknown as { standalone?: boolean }).standalone === true;

    const ua = navigator.userAgent;
    const isMobile = /iPad|iPhone|iPod|Android/i.test(ua);
    const isDesktop = !isMobile;

    if (isMobile && !isStandalone) {
      return false;
    }

    const notificationPromptDismissed = localStorage.getItem('notificationPromptDismissed');
    if (notificationPromptDismissed) {
      const dismissedTime = parseInt(notificationPromptDismissed, 10);
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 14) {
        return false;
      }
    }

    const notificationPromptAccepted = localStorage.getItem('notificationPromptAccepted');
    if (notificationPromptAccepted) {
      return false;
    }

    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted' || Notification.permission === 'denied') {
      return false;
    }

    return true;
  }, []);

  useEffect(() => {
    if (!checkAndShowPrompt()) {
      return;
    }

    const oneSignalAppId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;

    if (oneSignalAppId && window.OneSignalDeferred) {
      window.OneSignalDeferred.push((OneSignal) => {
        const isPushSupported = OneSignal.Notifications?.isPushSupported?.() ?? false;

        if (!isPushSupported) {
          return;
        }

        if (OneSignal.Notifications.permission || OneSignal.User?.PushSubscription?.optedIn) {
          return;
        }

        setOneSignalReady(true);
        setTimeout(() => setShowPrompt(true), 3000);
      });
    } else {
      setTimeout(() => setShowPrompt(true), 3000);
    }
  }, [checkAndShowPrompt]);

  const handleEnableNotifications = async () => {
    setIsLoading(true);

    try {
      const oneSignalAppId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;

      if (oneSignalAppId && window.OneSignal && oneSignalReady) {
        await window.OneSignal.Notifications.requestPermission();

        if (window.OneSignal.Notifications.permission) {
          try {
            await window.OneSignal.User.PushSubscription.optIn();
          } catch {
          }
        }
      } else if ('Notification' in window) {
        await Notification.requestPermission();
      }

      localStorage.setItem('notificationPromptAccepted', 'true');
      setShowPrompt(false);
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      localStorage.setItem('notificationPromptDismissed', Date.now().toString());
      setShowPrompt(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('notificationPromptDismissed', Date.now().toString());
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        <div className="relative p-6">
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>

          <div className="text-center">
            <div className="mx-auto w-20 h-20 rounded-2xl bg-[#0b0b0c] flex items-center justify-center mb-5 shadow-lg">
              <BellRing className="w-10 h-10 text-white" />
            </div>

            <h3 className="font-serif font-bold text-xl text-gray-900 mb-2">
              Never Miss Breaking News
            </h3>

            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Get instant alerts for breaking news, live updates, and important stories delivered right to your screen.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleEnableNotifications}
                disabled={isLoading}
                className="w-full py-3.5 bg-[#df4a2c] text-white font-semibold rounded-xl hover:bg-[#c43d22] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Bell className="w-5 h-5" />
                    <span>Enable Notifications</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDismiss}
                className="w-full py-3 text-gray-400 text-sm font-medium hover:text-gray-600 transition-colors"
              >
                Not Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
