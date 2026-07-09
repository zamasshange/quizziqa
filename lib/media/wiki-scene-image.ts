/**
 * Pick a scene / character still from a Wikipedia article — skip posters & logos.
 */
import { PREFER_NAME, SKIP_NAME } from "@/lib/media/tmdb";

const WIKI_API = "https://en.wikipedia.org/w/api.php";
const UA = "Quizzical/1.0 (https://quizzical.site; educational quiz app)";

interface WikiImageRow {
  title: string;
  url?: string;
  width?: number;
  height?: number;
}

function scoreImageTitle(title: string): number {
  const name = title.replace(/^File:/i, "");
  if (SKIP_NAME.test(name)) return -100;
  if (/\.svg$/i.test(name)) return -50;
  if (PREFER_NAME.test(name)) return 20;
  if (/\.(jpg|jpeg|png|webp)$/i.test(name)) return 5;
  return 0;
}

async function listArticleImages(wikiTitle: string): Promise<string[]> {
  const params = new URLSearchParams({
    action: "query",
    titles: wikiTitle.replace(/_/g, " "),
    prop: "images",
    imlimit: "50",
    format: "json",
    redirects: "1",
  });

  const res = await fetch(`${WIKI_API}?${params}`, {
    headers: { "User-Agent": UA },
    next: { revalidate: 604800 },
  });
  if (!res.ok) return [];

  const json = (await res.json()) as {
    query?: { pages?: Record<string, { images?: Array<{ title: string }> }> };
  };
  const page = Object.values(json.query?.pages ?? {})[0];
  return (page?.images ?? []).map((i) => i.title);
}

async function resolveImageUrl(fileTitle: string): Promise<WikiImageRow | null> {
  const params = new URLSearchParams({
    action: "query",
    titles: fileTitle,
    prop: "imageinfo",
    iiprop: "url|size",
    iiurlwidth: "900",
    format: "json",
  });

  const res = await fetch(`${WIKI_API}?${params}`, {
    headers: { "User-Agent": UA },
    next: { revalidate: 604800 },
  });
  if (!res.ok) return null;

  const json = (await res.json()) as {
    query?: {
      pages?: Record<
        string,
        { imageinfo?: Array<{ url?: string; width?: number; height?: number }> }
      >;
    };
  };
  const info = Object.values(json.query?.pages ?? {})[0]?.imageinfo?.[0];
  if (!info?.url || info.url.includes("commons.wikimedia.org")) return null;
  if ((info.width ?? 0) < 200) return null;

  return {
    title: fileTitle,
    url: info.url,
    width: info.width,
    height: info.height,
  };
}

export async function fetchWikiSceneImage(
  wikiTitle: string
): Promise<string | undefined> {
  const titles = await listArticleImages(wikiTitle);
  if (!titles.length) return undefined;

  const ranked = titles
    .map((title) => ({ title, score: scoreImageTitle(title) }))
    .filter((t) => t.score > 0)
    .sort((a, b) => b.score - a.score);

  const fallback = titles
    .map((title) => ({ title, score: scoreImageTitle(title) }))
    .filter((t) => t.score >= 0)
    .sort((a, b) => b.score - a.score);

  const candidates = ranked.length ? ranked : fallback;

  for (const { title } of candidates.slice(0, 8)) {
    const resolved = await resolveImageUrl(title);
    if (resolved?.url) return resolved.url;
  }

  return undefined;
}

export async function fetchWikiSceneImagesForEntities(
  wikiTitles: string[]
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  await Promise.all(
    wikiTitles.map(async (wiki) => {
      const url = await fetchWikiSceneImage(wiki);
      if (url) map.set(wiki, url);
    })
  );
  return map;
}
