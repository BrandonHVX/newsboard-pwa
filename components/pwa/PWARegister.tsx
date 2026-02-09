'use client';

import { useEffect } from "react";

export function PWARegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        // Register service worker for app shell caching only.
        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      } catch {
        // Ignore SW registration failures (do not break the app).
      }
    };

    // Delay slightly to keep first paint fast.
    const id = window.setTimeout(register, 800);
    return () => window.clearTimeout(id);
  }, []);

  return null;
}
