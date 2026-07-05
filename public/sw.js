const CACHE_NAME = "guess-everything-v2";

const OFFLINE_URLS = [
  "/play/world-flags",
  "/play/movie-quotes",
  "/play/planets-quiz",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Never cache HTML/navigation – prevents reload loops
  if (event.request.mode === "navigate" || url.pathname === "/") {
    event.respondWith(fetch(event.request));
    return;
  }

  // Network-first for Next.js assets
  if (url.pathname.startsWith("/_next/")) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Cache-first for offline game pages only
  if (OFFLINE_URLS.some((p) => url.pathname.startsWith(p))) {
    event.respondWith(
      caches.match(event.request).then(
        (cached) =>
          cached ||
          fetch(event.request).then((response) => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
            }
            return response;
          })
      )
    );
  }
});
