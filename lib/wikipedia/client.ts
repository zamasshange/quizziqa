import { getFlagUrl, upsizeWikiImage } from "@/lib/media/images";

const WIKI_API = "https://en.wikipedia.org/w/api.php";
const WIKI_REST = "https://en.wikipedia.org/api/rest_v1/page/summary";
const FETCH_TIMEOUT_MS = 8000;

export interface WikiEntityData {
  title: string;
  answer: string;
  image?: string;
  fact: string;
  extract?: string;
}

interface WikiApiPage {
  title?: string;
  extract?: string;
  thumbnail?: { source: string; width?: number; height?: number };
  original?: { source: string; width?: number; height?: number };
  pageimage?: string;
  missing?: string;
}

async function fetchWithTimeout(
  url: string,
  timeoutMs = FETCH_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 86400 },
      headers: { "User-Agent": "GuessEverything/1.0 ( educational quiz app )" },
    });
  } finally {
    clearTimeout(timer);
  }
}

function buildApiUrl(titles: string[], thumbSize = 800): string {
  const params = new URLSearchParams({
    action: "query",
    titles: titles.join("|"),
    prop: "pageimages|extracts",
    exintro: "1",
    explaintext: "1",
    piprop: "thumbnail|original",
    pithumbsize: String(thumbSize),
    format: "json",
    origin: "*",
    redirects: "1",
  });
  return `${WIKI_API}?${params}`;
}

function firstSentence(text: string): string {
  const match = text.match(/^[^.!?]+[.!?]/);
  return match ? match[0].trim() : text.slice(0, 160).trim() + "…";
}

function normalizeTitle(wikiTitle: string): string {
  return wikiTitle.replace(/_/g, " ");
}

function pickBestImage(page: WikiApiPage): string | undefined {
  if (page.original?.source) return page.original.source;
  if (page.thumbnail?.source) return upsizeWikiImage(page.thumbnail.source, 800);
  return undefined;
}

async function fetchRestSummary(wikiTitle: string): Promise<WikiEntityData | null> {
  try {
    const title = encodeURIComponent(wikiTitle.replace(/_/g, " "));
    const res = await fetchWithTimeout(`${WIKI_REST}/${title}`);
    if (!res.ok) return null;
    const data = await res.json();
    const image = data.originalimage?.source
      ?? (data.thumbnail?.source ? upsizeWikiImage(data.thumbnail.source, 800) : undefined);
    if (!data.title) return null;
    const key = data.title.replace(/ /g, "_");
    const extract = data.extract ?? data.description ?? "";
    return {
      title: key,
      answer: data.title,
      image,
      fact: extract ? firstSentence(extract) : `Learn more about ${data.title}.`,
      extract,
    };
  } catch {
    return null;
  }
}

export async function fetchWikiEntities(
  wikiTitles: string[]
): Promise<Map<string, WikiEntityData>> {
  const result = new Map<string, WikiEntityData>();
  if (wikiTitles.length === 0) return result;

  /** Map requested title → resolved Wikipedia title key */
  const titleAlias = new Map<string, string>();
  for (const t of wikiTitles) titleAlias.set(t, t);

  try {
    const res = await fetchWithTimeout(buildApiUrl(wikiTitles, 800));
    if (res.ok) {
      const json = await res.json();

      for (const redirect of json.query?.redirects ?? []) {
        const from = String(redirect.from).replace(/ /g, "_");
        const to = String(redirect.to).replace(/ /g, "_");
        for (const [requested, current] of titleAlias) {
          if (current === from) titleAlias.set(requested, to);
        }
      }

      const pages: Record<string, WikiApiPage> = json.query?.pages ?? {};

      for (const page of Object.values(pages)) {
        if (!page.title || page.missing !== undefined) continue;
        const key = page.title.replace(/ /g, "_");
        const extract = page.extract ?? "";
        const entry: WikiEntityData = {
          title: key,
          answer: normalizeTitle(key),
          image: pickBestImage(page),
          fact: extract
            ? firstSentence(extract)
            : `Learn more about ${normalizeTitle(key)} on Wikipedia.`,
          extract,
        };
        result.set(key, entry);

        for (const [requested, resolved] of titleAlias) {
          if (resolved === key) result.set(requested, entry);
        }
      }
    }
  } catch {
    // REST fallback below
  }

  const missing = wikiTitles.filter((t) => !result.get(t)?.image);
  if (missing.length > 0) {
    const restResults = await Promise.all(
      missing.map((t) => fetchRestSummary(t))
    );
    for (let i = 0; i < missing.length; i++) {
      const data = restResults[i];
      const requested = missing[i];
      if (!data) continue;
      const existing = result.get(requested) ?? result.get(data.title);
      if (existing) {
        if (!existing.image && data.image) existing.image = data.image;
        result.set(requested, existing);
      } else {
        result.set(data.title, data);
        result.set(requested, data);
      }
    }
  }

  return result;
}

export async function fetchFlagImage(
  countryWikiTitle: string,
  displayName?: string
): Promise<string | undefined> {
  const name = displayName ?? countryWikiTitle.replace(/_/g, " ");
  const cdnUrl = getFlagUrl(name, 640);
  if (cdnUrl) return cdnUrl;

  const flagTitle = `Flag_of_${countryWikiTitle}`;
  try {
    const res = await fetchWithTimeout(buildApiUrl([flagTitle], 640));
    if (!res.ok) return undefined;
    const json = await res.json();
    const pages: Record<string, WikiApiPage> = json.query?.pages ?? {};
    const page = Object.values(pages)[0];
    return page ? pickBestImage(page) : undefined;
  } catch {
    return undefined;
  }
}

export async function fetchFlagImages(
  entries: { wiki: string; answer?: string }[]
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  await Promise.all(
    entries.map(async (entry) => {
      const url = await fetchFlagImage(entry.wiki, entry.answer);
      if (url) map.set(entry.wiki, url);
    })
  );
  return map;
}
