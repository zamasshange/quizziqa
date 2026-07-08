import { getManifestImage } from "@/lib/media/image-manifest";
import { fallbackImages } from "@/lib/media/fallback-images";
import { getMediaProxyUrl } from "@/lib/media/media-url";
import type { MediaVariant } from "@/lib/media/images";

export const VARIANT_WIDTH: Record<MediaVariant, number> = {
  portrait: 520,
  landscape: 720,
  square: 480,
  product: 400,
  food: 560,
  logo: 400,
  flag: 320,
  emoji: 200,
  text: 400,
};

export function cacheKeyFor(wiki: string, variant: MediaVariant): string {
  return `${wiki}:${VARIANT_WIDTH[variant] ?? 520}`;
}

function isGoodUrl(url: string): boolean {
  return (
    url.startsWith("https://upload.wikimedia.org/") &&
    !url.includes("commons.wikimedia.org")
  );
}

/** Original verified URLs from manifest — never auto-generated thumbs (they 400). */
export function getOriginalUrls(wiki: string): string[] {
  const urls: string[] = [];
  const manifest = getManifestImage(wiki);
  const fallback = fallbackImages[wiki];
  if (manifest && isGoodUrl(manifest)) urls.push(manifest);
  if (fallback && isGoodUrl(fallback) && fallback !== manifest) {
    urls.push(fallback);
  }
  return urls;
}

/**
 * URLs for <img src> — verified originals first, proxy last.
 * Original Wikimedia URLs return 200; our thumb URLs return 400.
 */
export function getPlayableUrls(
  wiki: string,
  variant: MediaVariant,
  bakedImage?: string
): string[] {
  const width = VARIANT_WIDTH[variant] ?? 520;
  const urls: string[] = [];

  if (
    bakedImage?.startsWith("http") &&
    !bakedImage.includes("/api/media") &&
    !bakedImage.includes("commons.wikimedia.org")
  ) {
    // Prefer TMDB / trusted CDN baked URLs first
    if (bakedImage.includes("image.tmdb.org") || bakedImage.includes("flagcdn.com")) {
      urls.unshift(bakedImage);
    } else {
      urls.push(bakedImage);
    }
  }

  urls.push(...getOriginalUrls(wiki));
  urls.push(getMediaProxyUrl(wiki, width));

  return [...new Set(urls)];
}

export function getFlagUrl(imageUrl: string): string[] {
  return [imageUrl];
}

/** @deprecated */
export function getImageCandidates(
  wiki: string,
  variant: MediaVariant
): string[] {
  return getPlayableUrls(wiki, variant);
}

export function getDirectCandidates(imageUrl: string): string[] {
  if (imageUrl.includes("flagcdn.com")) return [imageUrl];
  if (imageUrl.startsWith("http")) return [imageUrl];
  return [];
}

// Keep for any legacy imports — do NOT use for primary loading
export function wikimediaThumbUrl(url: string, _width: number): string {
  return url;
}
