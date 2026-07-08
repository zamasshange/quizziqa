import { unstable_cache } from "next/cache";

const UA =
  "Quizzical/1.0 (https://quizzical.site; educational quiz app)";

async function fetchRestImage(wikiTitle: string): Promise<string | null> {
  const title = encodeURIComponent(wikiTitle.replace(/_/g, " "));
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`,
      {
        headers: { "User-Agent": UA, Accept: "application/json" },
        next: { revalidate: 604800 },
      }
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      originalimage?: { source?: string };
      thumbnail?: { source?: string };
    };
    return data.originalimage?.source ?? data.thumbnail?.source ?? null;
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

  try {
    const res = await fetch(`https://en.wikipedia.org/w/api.php?${params}`, {
      headers: { "User-Agent": UA, Accept: "application/json" },
      next: { revalidate: 604800 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as {
      query?: {
        pages?: Record<
          string,
          {
            original?: { source?: string };
            thumbnail?: { source?: string };
          }
        >;
      };
    };
    const page = Object.values(json.query?.pages ?? {})[0];
    if (!page) return null;
    return page.original?.source ?? page.thumbnail?.source ?? null;
  } catch {
    return null;
  }
}

async function resolveWikiImageUrl(wikiTitle: string): Promise<string | null> {
  const rest = await fetchRestImage(wikiTitle);
  if (rest) return rest;
  return fetchQueryImage(wikiTitle);
}

export const getCachedWikiImageUrl = unstable_cache(
  async (wikiTitle: string) => resolveWikiImageUrl(wikiTitle),
  ["wiki-image-url-v1"],
  { revalidate: 604800, tags: ["wiki-images"] }
);
