/* Service Worker: cache app shell only.
   - Navigation requests: network-first (real-time WordPress SSR), offline fallback
   - Static assets/images: cache-first
*/
const VERSION = "v1";
const APP_CACHE = `newsroom-shell-${VERSION}`;
const RUNTIME_CACHE = `newsroom-runtime-${VERSION}`;

const PRECACHE = [
  "/offline.html",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/maskable-512.png",
  "/icons/apple-touch-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(APP_CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((k) => (k.startsWith("newsroom-") && ![APP_CACHE, RUNTIME_CACHE].includes(k) ? caches.delete(k) : null))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Only handle GET
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Navigation: always fetch fresh; fallback offline page
  if (req.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          return await fetch(req);
        } catch (e) {
          const cache = await caches.open(APP_CACHE);
          const cached = await cache.match("/offline.html");
          return cached || new Response("Offline", { status: 503, statusText: "Offline" });
        }
      })()
    );
    return;
  }

  // Same-origin static assets/images: cache-first
  if (url.origin === self.location.origin) {
    const isStatic =
      url.pathname.startsWith("/_next/static/") ||
      url.pathname.startsWith("/icons/") ||
      url.pathname.endsWith(".css") ||
      url.pathname.endsWith(".js") ||
      url.pathname.match(/\.(png|jpg|jpeg|webp|svg|gif)$/i);

    if (isStatic) {
      event.respondWith(
        (async () => {
          const cache = await caches.open(RUNTIME_CACHE);
          const cached = await cache.match(req);
          if (cached) return cached;

          const res = await fetch(req);
          // Cache successful responses only.
          if (res && res.status === 200) cache.put(req, res.clone());
          return res;
        })()
      );
    }
  }
});
