'use client';

import { useState, useEffect } from 'react';

interface PWAComponentsProps {
  oneSignalAppId?: string;
}

export function PWAComponents({ oneSignalAppId }: PWAComponentsProps) {
  const [mounted, setMounted] = useState(false);
  const [InstallPromptComponent, setInstallPromptComponent] = useState<React.ComponentType | null>(null);
  const [NotificationPromptComponent, setNotificationPromptComponent] = useState<React.ComponentType | null>(null);
  const [OneSignalInitComponent, setOneSignalInitComponent] = useState<React.ComponentType<{ appId: string }> | null>(null);

  useEffect(() => {
    setMounted(true);

    if (!("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      } catch {
        // Ignore SW registration failures
      }
    };

    const id = window.setTimeout(register, 800);

    import('./InstallPrompt').then(mod => setInstallPromptComponent(() => mod.InstallPrompt)).catch(() => {});
    import('./NotificationPrompt').then(mod => setNotificationPromptComponent(() => mod.NotificationPrompt)).catch(() => {});
    
    if (oneSignalAppId) {
      import('./OneSignalInit').then(mod => setOneSignalInitComponent(() => mod.OneSignalInit)).catch(() => {});
    }

    return () => window.clearTimeout(id);
  }, [oneSignalAppId]);

  if (!mounted) return null;

  return (
    <>
      {InstallPromptComponent && <InstallPromptComponent />}
      {NotificationPromptComponent && <NotificationPromptComponent />}
      {oneSignalAppId && OneSignalInitComponent && <OneSignalInitComponent appId={oneSignalAppId} />}
    </>
  );
}
