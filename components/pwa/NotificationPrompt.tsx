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

    if (!isStandalone) {
      return false;
    }

    const notificationPromptShown = localStorage.getItem('notificationPromptShown');
    if (notificationPromptShown) {
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
        setTimeout(() => setShowPrompt(true), 1500);
      });
    } else {
      setTimeout(() => setShowPrompt(true), 1500);
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
            // optIn may fail on some platforms, but permission is still granted
          }
        }
      } else if ('Notification' in window) {
        await Notification.requestPermission();
      }
      
      localStorage.setItem('notificationPromptShown', 'true');
      setShowPrompt(false);
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      localStorage.setItem('notificationPromptShown', 'true');
      setShowPrompt(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('notificationPromptShown', 'true');
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        <div className="relative p-6">
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <div className="text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-4">
              <BellRing className="w-10 h-10 text-accent" />
            </div>

            <h3 className="font-serif font-bold text-xl text-gray-900 mb-2">
              Stay in the Loop
            </h3>
            
            <p className="text-gray-600 text-sm mb-6">
              Enable push notifications to get breaking news alerts and never miss an important story.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleEnableNotifications}
                disabled={isLoading}
                className="w-full py-3.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                className="w-full py-3 text-gray-500 font-medium hover:text-gray-700 transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>

        <div className="h-1.5 bg-gray-100">
          <div className="h-full w-16 mx-auto bg-gray-300 rounded-full" />
        </div>
      </div>
    </div>
  );
}
