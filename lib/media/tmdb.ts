import type { EntityEntry } from "@/lib/data/entities";

const TMDB_API = "https://api.themoviedb.org/3";
const TMDB_IMG = "https://image.tmdb.org/t/p";

export type TmdbMediaType = "movie" | "tv";

/** Map wiki titles → clean search query when the page title is awkward. */
const QUERY_OVERRIDES: Record<string, string> = {
  "Star_Wars_(film)": "Star Wars 1977",
  "Titanic_(1997_film)": "Titanic 1997",
  "Avatar_(2009_film)": "Avatar 2009",
  "Jurassic_Park_(film)": "Jurassic Park 1993",
  "The_Office_(American_TV_series)": "The Office US",
  "The_Crown_(TV_series)": "The Crown",
  "The_Lion_King": "The Lion King 1994",
  "The_Dark_Knight": "The Dark Knight 2008",
};

const SKIP_NAME =
  /poster|logo|title[\s_-]?card|wordmark|banner|cover|svg|icon|emblem|sign|text|opening|intro|promotional/i;
const PREFER_NAME =
  /scene|still|screenshot|character|cast|filming|on[\s_-]?set|actor|promo(?!tional)|frame|na'vi|homer|walter|jon\s?snow/i;

export function getTmdbSearchQuery(entity: EntityEntry): string {
  if (QUERY_OVERRIDES[entity.wiki]) return QUERY_OVERRIDES[entity.wiki];
  return (entity.answer ?? entity.wiki.replace(/_/g, " "))
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .trim();
}

function authHeaders(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };
}

async function tmdbFetch<T>(path: string, token: string): Promise<T | null> {
  try {
    const res = await fetch(`${TMDB_API}${path}`, {
      headers: authHeaders(token),
      next: { revalidate: 604800 },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function searchMediaId(
  query: string,
  type: TmdbMediaType,
  token: string
): Promise<number | undefined> {
  const endpoint =
    type === "movie"
      ? `/search/movie?query=${encodeURIComponent(query)}&include_adult=false`
      : `/search/tv?query=${encodeURIComponent(query)}&include_adult=false`;

  const data = await tmdbFetch<{
    results?: { id: number; name?: string; title?: string }[];
  }>(endpoint, token);

  return data?.results?.[0]?.id;
}

function pickBackdrop(
  backdrops: Array<{
    file_path?: string | null;
    vote_average?: number;
    width?: number;
  }>
): string | undefined {
  const sorted = backdrops
    .filter((b) => b.file_path && (b.width ?? 1280) >= 780)
    .sort((a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0));

  if (!sorted.length) return undefined;

  // Prefer 2nd-ranked backdrop — #1 is often a hero banner with title text
  const pick = sorted[1] ?? sorted[0];
  return `${TMDB_IMG}/w780${pick.file_path}`;
}

function pickCastPortrait(
  cast: Array<{ profile_path?: string | null; order?: number }>
): string | undefined {
  const member = cast
    .filter((c) => c.profile_path)
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))[0];

  if (!member?.profile_path) return undefined;
  return `${TMDB_IMG}/w500${member.profile_path}`;
}

/**
 * Scene still or character portrait — never the theatrical poster.
 */
export async function fetchTmdbQuizImage(
  query: string,
  type: TmdbMediaType
): Promise<string | undefined> {
  const token = process.env.TMDB_READ_TOKEN?.trim();
  if (!token || !query) return undefined;

  const id = await searchMediaId(query, type, token);
  if (!id) return undefined;

  const imagesPath =
    type === "movie" ? `/movie/${id}/images` : `/tv/${id}/images`;
  const creditsPath =
    type === "movie" ? `/movie/${id}/credits` : `/tv/${id}/aggregate_credits`;

  const [images, credits] = await Promise.all([
    tmdbFetch<{ backdrops?: Array<{ file_path?: string | null; vote_average?: number; width?: number }> }>(
      imagesPath,
      token
    ),
    tmdbFetch<{
      cast?: Array<{ profile_path?: string | null; order?: number }>;
    }>(creditsPath, token),
  ]);

  return (
    pickBackdrop(images?.backdrops ?? []) ??
    pickCastPortrait(credits?.cast ?? [])
  );
}

export async function fetchTmdbQuizImagesForEntities(
  entities: EntityEntry[],
  type: TmdbMediaType
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  const token = process.env.TMDB_READ_TOKEN?.trim();
  if (!token) return map;

  await Promise.all(
    entities.map(async (entity) => {
      const image = await fetchTmdbQuizImage(getTmdbSearchQuery(entity), type);
      if (image) map.set(entity.wiki, image);
    })
  );

  return map;
}

/** @deprecated Use fetchTmdbQuizImagesForEntities */
export async function fetchTmdbPostersForEntities(
  entities: EntityEntry[]
): Promise<Map<string, string>> {
  return fetchTmdbQuizImagesForEntities(entities, "movie");
}

/** @deprecated */
export async function fetchTmdbPosterUrl(
  query: string
): Promise<string | undefined> {
  return fetchTmdbQuizImage(query, "movie");
}

export { SKIP_NAME, PREFER_NAME };
