'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface OneSignalInitProps {
  appId: string;
}

export function OneSignalInit({ appId }: OneSignalInitProps) {
  useEffect(() => {
    window.OneSignalDeferred = window.OneSignalDeferred || [];
    window.OneSignalDeferred.push(async (OneSignal) => {
      await OneSignal.init({
        appId: appId,
        allowLocalhostAsSecureOrigin: process.env.NODE_ENV === 'development',
      });
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
