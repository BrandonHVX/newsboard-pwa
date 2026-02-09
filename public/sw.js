const VERSION = "v2";
const APP_CACHE = `hs-shell-${VERSION}`;
const RUNTIME_CACHE = `hs-runtime-${VERSION}`;
const DATA_CACHE = `hs-data-${VERSION}`;

const PRECACHE = [
  "/offline.html",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/maskable-512.png",
  "/icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(APP_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  const currentCaches = [APP_CACHE, RUNTIME_CACHE, DATA_CACHE];
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((k) =>
          k.startsWith("hs-") && !currentCaches.includes(k)
            ? caches.delete(k)
            : null
        )
      );
      await Promise.all(
        keys.map((k) =>
          k.startsWith("newsroom-") ? caches.delete(k) : null
        )
      );
      await self.clients.claim();

      const allClients = await self.clients.matchAll({ type: "window" });
      allClients.forEach((client) => {
        client.postMessage({ type: "SW_ACTIVATED", version: VERSION });
      });
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  if (req.method !== "GET") return;

  const url = new URL(req.url);

  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) return preloadResponse;

          const networkResponse = await fetch(req);

          if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(DATA_CACHE);
            cache.put(req, networkResponse.clone());
          }

          return networkResponse;
        } catch (e) {
          const dataCache = await caches.open(DATA_CACHE);
          const cachedPage = await dataCache.match(req);
          if (cachedPage) return cachedPage;

          const shellCache = await caches.open(APP_CACHE);
          const offlinePage = await shellCache.match("/offline.html");
          return (
            offlinePage ||
            new Response("Offline", { status: 503, statusText: "Offline" })
          );
        }
      })()
    );
    return;
  }

  if (url.origin === self.location.origin) {
    const isStatic =
      url.pathname.startsWith("/_next/static/") ||
      url.pathname.startsWith("/icons/") ||
      url.pathname.endsWith(".css") ||
      url.pathname.endsWith(".js") ||
      url.pathname.match(/\.(png|jpg|jpeg|webp|svg|gif|ico|woff2?)$/i);

    if (isStatic) {
      event.respondWith(
        (async () => {
          const cache = await caches.open(RUNTIME_CACHE);
          const cached = await cache.match(req);
          if (cached) return cached;

          try {
            const res = await fetch(req);
            if (res && res.status === 200) {
              cache.put(req, res.clone());
            }
            return res;
          } catch (e) {
            return new Response("", { status: 408, statusText: "Offline" });
          }
        })()
      );
      return;
    }
  }

  if (
    url.origin !== self.location.origin &&
    url.pathname.match(/\.(png|jpg|jpeg|webp|gif|svg)$/i)
  ) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(RUNTIME_CACHE);
        const cached = await cache.match(req);
        if (cached) return cached;

        try {
          const res = await fetch(req);
          if (res && res.status === 200) {
            cache.put(req, res.clone());
          }
          return res;
        } catch (e) {
          return new Response("", { status: 408, statusText: "Offline" });
        }
      })()
    );
    return;
  }
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("push", (event) => {
  if (!event.data) return;

  let data;
  try {
    data = event.data.json();
  } catch {
    data = {
      title: "Heavy Status",
      body: event.data.text(),
      icon: "/icons/icon-192.png",
    };
  }

  const options = {
    body: data.body || data.alert || "New update available",
    icon: data.icon || "/icons/icon-192.png",
    badge: "/icons/icon-96.png",
    vibrate: [200, 100, 200],
    tag: data.tag || "hs-notification",
    renotify: true,
    data: {
      url: data.url || data.launchUrl || "/today",
    },
  };

  event.waitUntil(self.registration.showNotification(data.title || "Heavy Status", options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/today";

  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.navigate(targetUrl);
            return client.focus();
          }
        }
        return self.clients.openWindow(targetUrl);
      })
  );
});
