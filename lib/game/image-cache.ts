const loaded = new Set<string>();
const loading = new Map<string, Promise<void>>();

export function isImageCached(url: string): boolean {
  return loaded.has(url);
}

export function preloadImage(url: string): Promise<void> {
  if (!url || loaded.has(url)) return Promise.resolve();
  const pending = loading.get(url);
  if (pending) return pending;

  const promise = new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => {
      loaded.add(url);
      loading.delete(url);
      resolve();
    };
    img.onerror = () => {
      loading.delete(url);
      resolve();
    };
    img.src = url;
  });

  loading.set(url, promise);
  return promise;
}

export function preloadImages(urls: (string | undefined)[]): void {
  for (const url of urls) {
    if (url) void preloadImage(url);
  }
}

/** Hidden DOM link preload for high-priority next question */
export function preloadImageLink(url: string): void {
  if (!url || typeof document === "undefined" || loaded.has(url)) return;
  const existing = document.querySelector(`link[rel="preload"][href="${url}"]`);
  if (existing) return;
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "image";
  link.href = url;
  document.head.appendChild(link);
  void preloadImage(url);
}
