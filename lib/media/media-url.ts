/** Same-origin image proxy — avoids broken hardcoded Wikimedia thumb URLs. */
export function getMediaProxyUrl(wiki: string, width = 440): string {
  return `/api/media?wiki=${encodeURIComponent(wiki)}&w=${width}`;
}

export function isMediaProxyUrl(url?: string): boolean {
  return !!url && url.startsWith("/api/media");
}

export function isExternalImageUrl(url?: string): boolean {
  if (!url) return false;
  return url.startsWith("http://") || url.startsWith("https://");
}
