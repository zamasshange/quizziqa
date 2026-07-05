/**
 * Resolve wiki titles to direct upload.wikimedia.org URLs.
 * Uses manifest/fallback first, then Wikipedia REST API (never commons redirects).
 */
import { getManifestImage } from "@/lib/media/image-manifest";
import { fallbackImages } from "@/lib/media/fallback-images";

const UA =
  "GuessEverythingQuiz/1.0 (https://quizziqa.vercel.app; educational quiz app)";

const FETCH_TIMEOUT_MS = 8000;

function isBadRedirect(url: string): boolean {
  return (
    url.includes("commons.wikimedia.org") ||
    url.includes("Special:Redirect")
  );
}

function isFetchableImageUrl(url: string): boolean {
  return (
    url.startsWith("https://upload.wikimedia.org/") ||
    url.startsWith("http://upload.wikimedia.org/")
  );
}

export function getStaticImageUrl(wiki: string): string | undefined {
  for (const candidate of [getManifestImage(wiki), fallbackImages[wiki]]) {
    if (candidate && isFetchableImageUrl(candidate) && !isBadRedirect(candidate)) {
      return candidate;
    }
  }
  return undefined;
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
    return url && isFetchableImageUrl(url) ? url : null;
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
      if (url && isFetchableImageUrl(url)) return url;
    } catch {
      /* fall through to query API */
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

/** Resolve wiki → image bytes for /api/media (fast static first, REST fallback). */
export async function resolveWikiImageBytes(
  wiki: string
): Promise<{ buffer: ArrayBuffer; contentType: string } | null> {
  const tried = new Set<string>();

  for (const url of [getStaticImageUrl(wiki), fallbackImages[wiki]].filter(
    Boolean
  ) as string[]) {
    if (tried.has(url) || isBadRedirect(url)) continue;
    tried.add(url);
    const hit = await fetchImageBytes(url);
    if (hit) return hit;
  }

  const restUrl = await fetchRestImage(wiki);
  if (restUrl && !tried.has(restUrl)) {
    const hit = await fetchImageBytes(restUrl);
    if (hit) return hit;
  }

  return null;
}

export async function resolveDirectImageUrl(
  wiki: string
): Promise<string | null> {
  return getStaticImageUrl(wiki) ?? fetchRestImage(wiki);
}
