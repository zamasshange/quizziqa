/**
 * Resolve wiki titles to direct upload.wikimedia.org URLs.
 */
import { getManifestImage } from "@/lib/media/image-manifest";
import { fallbackImages } from "@/lib/media/fallback-images";
import { getOriginalUrls } from "@/lib/media/image-candidates";
import { isMediaQuizWiki } from "@/lib/media/media-quiz";
import { fetchWikiSceneImage } from "@/lib/media/wiki-scene-image";

const UA =
  "Quizzical/1.0 (https://quizzical.site; educational quiz app)";

const FETCH_TIMEOUT_MS = 5000;

function isBadRedirect(url: string): boolean {
  return (
    url.includes("commons.wikimedia.org") ||
    url.includes("Special:Redirect")
  );
}

async function fetchWithTimeout(
  url: string,
  init?: RequestInit
): Promise<Response | null> {
  try {
    const res = await fetch(url, {
      ...init,
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    return res.ok ? res : null;
  } catch {
    return null;
  }
}

async function fetchQueryImage(wikiTitle: string): Promise<string | null> {
  const params = new URLSearchParams({
    action: "query",
    titles: wikiTitle.replace(/_/g, " "),
    prop: "pageimages",
    piprop: "original|thumbnail",
    pithumbsize: "800",
    format: "json",
    redirects: "1",
  });

  const res = await fetchWithTimeout(
    `https://en.wikipedia.org/w/api.php?${params}`,
    {
      headers: { "User-Agent": UA, Accept: "application/json" },
      next: { revalidate: 604800 },
    }
  );
  if (!res) return null;

  try {
    const json = (await res.json()) as {
      query?: {
        pages?: Record<
          string,
          { original?: { source?: string }; thumbnail?: { source?: string } }
        >;
      };
    };
    const page = Object.values(json.query?.pages ?? {})[0];
    if (!page) return null;
    const url = page.original?.source ?? page.thumbnail?.source ?? null;
    return url?.startsWith("https://upload.wikimedia.org/") ? url : null;
  } catch {
    return null;
  }
}

async function fetchRestImage(wikiTitle: string): Promise<string | null> {
  const title = encodeURIComponent(wikiTitle.replace(/_/g, " "));
  const res = await fetchWithTimeout(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`,
    {
      headers: { "User-Agent": UA, Accept: "application/json" },
      next: { revalidate: 604800 },
    }
  );
  if (res) {
    try {
      const data = (await res.json()) as {
        originalimage?: { source?: string };
        thumbnail?: { source?: string };
      };
      const url =
        data.originalimage?.source ?? data.thumbnail?.source ?? null;
      if (url?.startsWith("https://upload.wikimedia.org/")) return url;
    } catch {
      /* fall through */
    }
  }
  return fetchQueryImage(wikiTitle);
}

export async function fetchImageBytes(
  url: string
): Promise<{ buffer: ArrayBuffer; contentType: string } | null> {
  if (isBadRedirect(url)) return null;

  const res = await fetchWithTimeout(url, {
    headers: {
      "User-Agent": UA,
      Accept: "image/*,*/*",
      Referer: "https://en.wikipedia.org/",
    },
    redirect: "follow",
    next: { revalidate: 604800 },
  });

  if (!res) return null;

  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("text/html")) return null;

  const buffer = await res.arrayBuffer();
  if (buffer.byteLength < 100) return null;

  return {
    buffer,
    contentType:
      contentType ||
      (url.endsWith(".svg") ? "image/svg+xml" : "image/jpeg"),
  };
}

/** Resolve wiki → image bytes — originals first (thumbs return 400). */
export async function resolveWikiImageBytes(
  wiki: string,
  _width = 640
): Promise<{ buffer: ArrayBuffer; contentType: string } | null> {
  const tried = new Set<string>();

  if (isMediaQuizWiki(wiki)) {
    const sceneUrl = await fetchWikiSceneImage(wiki);
    if (sceneUrl && !tried.has(sceneUrl)) {
      tried.add(sceneUrl);
      const hit = await fetchImageBytes(sceneUrl);
      if (hit) return hit;
    }
  }

  for (const url of getOriginalUrls(wiki)) {
    if (tried.has(url)) continue;
    tried.add(url);
    const hit = await fetchImageBytes(url);
    if (hit) return hit;
  }

  const restUrl = await fetchRestImage(wiki);
  if (restUrl && !tried.has(restUrl)) {
    tried.add(restUrl);
    const hit = await fetchImageBytes(restUrl);
    if (hit) return hit;
  }

  return null;
}

export function getStaticImageUrl(wiki: string): string | undefined {
  if (isMediaQuizWiki(wiki)) return undefined;
  return getOriginalUrls(wiki)[0] ?? getManifestImage(wiki) ?? fallbackImages[wiki];
}

export async function resolveDirectImageUrl(
  wiki: string
): Promise<string | null> {
  return getStaticImageUrl(wiki) ?? fetchRestImage(wiki);
}
