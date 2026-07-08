const CACHE_STATIC = "quizzical-static-v3";
const CACHE_IMAGES = "quizzical-images-v3";
const CACHE_API = "quizzical-api-v3";

const PRECACHE_URLS = [
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/images/logo.png",
];

const IMAGE_HOSTS = [
  "upload.wikimedia.org",
  "image.tmdb.org",
  "flagcdn.com",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => ![CACHE_STATIC, CACHE_IMAGES, CACHE_API].includes(k))
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

function isImageRequest(url) {
  if (url.pathname.startsWith("/api/media")) return true;
  return IMAGE_HOSTS.some((h) => url.hostname.includes(h));
}

function isApiPoolRequest(url) {
  return url.pathname.startsWith("/api/games/") && url.pathname.endsWith("/session");
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  if (event.request.mode === "navigate" || url.pathname === "/") {
    event.respondWith(fetch(event.request));
    return;
  }

  if (url.pathname.startsWith("/_next/")) {
    event.respondWith(fetch(event.request));
    return;
  }

  if (isImageRequest(url)) {
    event.respondWith(
      caches.open(CACHE_IMAGES).then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        try {
          const response = await fetch(event.request);
          if (response.ok) {
            cache.put(event.request, response.clone());
          }
          return response;
        } catch {
          return cached || Response.error();
        }
      })
    );
    return;
  }

  if (isApiPoolRequest(url)) {
    event.respondWith(
      caches.open(CACHE_API).then(async (cache) => {
        const cached = await cache.match(event.request);
        const network = fetch(event.request)
          .then((response) => {
            if (response.ok) cache.put(event.request, response.clone());
            return response;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  if (PRECACHE_URLS.some((p) => url.pathname === p)) {
    event.respondWith(
      caches.match(event.request).then(
        (cached) =>
          cached ||
          fetch(event.request).then((response) => {
            if (response.ok) {
              caches.open(CACHE_STATIC).then((c) => c.put(event.request, response.clone()));
            }
            return response;
          })
      )
    );
  }
});
