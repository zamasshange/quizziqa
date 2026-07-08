import type { EntityEntry } from "@/lib/data/entities";

const TMDB_SEARCH = "https://api.themoviedb.org/3/search/movie";
const TMDB_IMG = "https://image.tmdb.org/t/p/w500";

/** Map wiki titles → clean search query when the page title is awkward. */
const QUERY_OVERRIDES: Record<string, string> = {
  "Star_Wars_(film)": "Star Wars 1977",
  "Titanic_(1997_film)": "Titanic 1997",
  "Avatar_(2009_film)": "Avatar 2009",
  "Jurassic_Park_(film)": "Jurassic Park 1993",
  "The_Office_(American_TV_series)": "The Office",
};

export function getTmdbSearchQuery(entity: EntityEntry): string {
  if (QUERY_OVERRIDES[entity.wiki]) return QUERY_OVERRIDES[entity.wiki];
  return (entity.answer ?? entity.wiki.replace(/_/g, " ")).replace(
    /\s*\([^)]*\)\s*/g,
    " "
  ).trim();
}

export async function fetchTmdbPosterUrl(
  query: string
): Promise<string | undefined> {
  const token = process.env.TMDB_READ_TOKEN?.trim();
  if (!token || !query) return undefined;

  try {
    const url = `${TMDB_SEARCH}?query=${encodeURIComponent(query)}&include_adult=false`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      next: { revalidate: 604800 },
    });
    if (!res.ok) return undefined;
    const data = (await res.json()) as {
      results?: { poster_path?: string | null }[];
    };
    const path = data.results?.[0]?.poster_path;
    if (!path) return undefined;
    return `${TMDB_IMG}${path}`;
  } catch {
    return undefined;
  }
}

export async function fetchTmdbPostersForEntities(
  entities: EntityEntry[]
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const token = process.env.TMDB_READ_TOKEN?.trim();
  if (!token) return map;

  await Promise.all(
    entities.map(async (entity) => {
      const poster = await fetchTmdbPosterUrl(getTmdbSearchQuery(entity));
      if (poster) map.set(entity.wiki, poster);
    })
  );

  return map;
}
