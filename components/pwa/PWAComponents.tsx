'use client';

import { useState, useEffect, useCallback } from 'react';

interface PWAComponentsProps {
  oneSignalAppId?: string;
}

export function PWAComponents({ oneSignalAppId }: PWAComponentsProps) {
  const [mounted, setMounted] = useState(false);
  const [showUpdateBanner, setShowUpdateBanner] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [InstallPromptComponent, setInstallPromptComponent] = useState<React.ComponentType | null>(null);
  const [NotificationPromptComponent, setNotificationPromptComponent] = useState<React.ComponentType | null>(null);
  const [OneSignalInitComponent, setOneSignalInitComponent] = useState<React.ComponentType<{ appId: string }> | null>(null);

  const handleSWUpdate = useCallback((registration: ServiceWorkerRegistration) => {
    if (registration.waiting) {
      setWaitingWorker(registration.waiting);
      setShowUpdateBanner(true);
    }
  }, []);

  const handleUpdateClick = useCallback(() => {
    if (waitingWorker) {
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      setShowUpdateBanner(false);
      window.location.reload();
    }
  }, [waitingWorker]);

  useEffect(() => {
    setMounted(true);

    if (!("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/" });

        if (registration.waiting) {
          handleSWUpdate(registration);
        }

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              handleSWUpdate(registration);
            }
          });
        });

        if ('periodicSync' in registration) {
          try {
            const status = await navigator.permissions.query({
              name: 'periodic-background-sync' as PermissionName,
            });
            if (status.state === 'granted') {
              await (registration as unknown as { periodicSync: { register: (tag: string, opts: { minInterval: number }) => Promise<void> } }).periodicSync.register('content-sync', {
                minInterval: 60 * 60 * 1000,
              });
            }
          } catch {
          }
        }
      } catch {
      }
    };

    const id = window.setTimeout(register, 800);

    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data?.type === 'SW_ACTIVATED') {
      }
    });

    import('./InstallPrompt').then(mod => setInstallPromptComponent(() => mod.InstallPrompt)).catch(() => {});
    import('./NotificationPrompt').then(mod => setNotificationPromptComponent(() => mod.NotificationPrompt)).catch(() => {});
    
    if (oneSignalAppId) {
      import('./OneSignalInit').then(mod => setOneSignalInitComponent(() => mod.OneSignalInit)).catch(() => {});
    }

    return () => window.clearTimeout(id);
  }, [oneSignalAppId, handleSWUpdate]);

  if (!mounted) return null;

  return (
    <>
      {showUpdateBanner && (
        <div className="fixed top-0 left-0 right-0 z-[10000] bg-[#0b0b0c] text-white px-4 py-3 flex items-center justify-between animate-slide-down safe-top">
          <p className="text-sm font-medium">A new version is available</p>
          <button
            onClick={handleUpdateClick}
            className="text-sm font-semibold bg-white text-[#0b0b0c] px-4 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Update
          </button>
        </div>
      )}
      {InstallPromptComponent && <InstallPromptComponent />}
      {NotificationPromptComponent && <NotificationPromptComponent />}
      {oneSignalAppId && OneSignalInitComponent && <OneSignalInitComponent appId={oneSignalAppId} />}
    </>
  );
}
