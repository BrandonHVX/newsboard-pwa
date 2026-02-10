'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';

interface OneSignalInitProps {
  appId: string;
}

export function OneSignalInit({ appId }: OneSignalInitProps) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async (OneSignal) => {
      try {
        await OneSignal.init({
          appId: appId,
          allowLocalhostAsSecureOrigin: process.env.NODE_ENV === 'development',
        });
        window.__oneSignalReady = true;
      } catch (e) {
        console.warn('[OneSignal] Init failed:', e);
        window.__oneSignalReady = false;
      }
    });
  }, [appId]);

  if (!appId) return null;

  return (
    <Script
      src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
      strategy="lazyOnload"
    />
  );
}
