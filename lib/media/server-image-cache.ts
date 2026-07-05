/** In-memory cache for proxied image bytes — speeds repeat / concurrent requests. */

interface CachedImage {
  buffer: ArrayBuffer;
  contentType: string;
}

const cache = new Map<string, CachedImage>();
const MAX_ENTRIES = 300;

export function getCachedImage(key: string): CachedImage | undefined {
  return cache.get(key);
}

export function setCachedImage(
  key: string,
  buffer: ArrayBuffer,
  contentType: string
): void {
  if (cache.size >= MAX_ENTRIES && !cache.has(key)) {
    const oldest = cache.keys().next().value;
    if (oldest) cache.delete(oldest);
  }
  cache.set(key, { buffer, contentType });
}
