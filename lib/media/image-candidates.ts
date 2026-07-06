import { getManifestImage } from "@/lib/media/image-manifest";
import { fallbackImages } from "@/lib/media/fallback-images";
import { getMediaProxyUrl } from "@/lib/media/media-url";
import type { MediaVariant } from "@/lib/media/images";

/** Target widths per media type. */
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

export function wikimediaThumbUrl(url: string, width: number): string {
  if (!url.includes("upload.wikimedia.org")) return url;
  if (url.includes("/thumb/")) {
    return url.replace(/\/(\d+)px-/, `/${width}px-`);
  }
  const match = url.match(
    /upload\.wikimedia\.org\/wikipedia\/(commons|en)\/(.+)$/
  );
  if (!match) return url;
  const [, project, path] = match;
  const filename = path.split("/").pop() ?? path;
  const isSvg = filename.toLowerCase().endsWith(".svg");
  if (isSvg) {
    return `https://upload.wikimedia.org/wikipedia/${project}/thumb/${path}/${width}px-${filename}.png`;
  }
  return `https://upload.wikimedia.org/wikipedia/${project}/thumb/${path}/${width}px-${filename}`;
}

export function cacheKeyFor(wiki: string, variant: MediaVariant): string {
  return `${wiki}:${VARIANT_WIDTH[variant] ?? 520}`;
}

/**
 * URLs for <img src> — direct CDN first (fast on desktop), proxy fallback (mobile-safe).
 * img tags bypass CORS; never use fetch() for Wikimedia on the client.
 */
export function getPlayableUrls(
  wiki: string,
  variant: MediaVariant
): string[] {
  const width = VARIANT_WIDTH[variant] ?? 520;
  const small = Math.max(200, Math.round(width * 0.55));
  const urls: string[] = [];

  const manifest = getManifestImage(wiki);
  const fallback = fallbackImages[wiki];

  if (manifest && !manifest.includes("commons.wikimedia.org")) {
    urls.push(wikimediaThumbUrl(manifest, width));
    urls.push(wikimediaThumbUrl(manifest, small));
  }
  if (
    fallback &&
    fallback !== manifest &&
    !fallback.includes("commons.wikimedia.org")
  ) {
    urls.push(wikimediaThumbUrl(fallback, width));
  }

  urls.push(getMediaProxyUrl(wiki, width));
  urls.push(getMediaProxyUrl(wiki, small));

  return [...new Set(urls)];
}

export function getFlagUrl(imageUrl: string): string[] {
  return [imageUrl];
}

/** @deprecated use getPlayableUrls */
export function getImageCandidates(
  wiki: string,
  variant: MediaVariant
): string[] {
  return getPlayableUrls(wiki, variant);
}

export function getDirectCandidates(
  imageUrl: string,
  variant: MediaVariant
): string[] {
  if (imageUrl.includes("flagcdn.com")) return [imageUrl];
  if (imageUrl.includes("upload.wikimedia.org")) {
    const w = VARIANT_WIDTH[variant] ?? 520;
    return [
      wikimediaThumbUrl(imageUrl, w),
      wikimediaThumbUrl(imageUrl, Math.round(w * 0.55)),
      imageUrl,
    ];
  }
  return [imageUrl];
}
