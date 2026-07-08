/** Popular categories preloaded on homepage and kept warm in background. */
export const POPULAR_GAME_SLUGS = [
  "guess-the-celebrity",
  "guess-the-flag",
  "guess-the-athlete",
  "guess-the-brand",
  "guess-the-movie",
  "guess-the-animal-wiki",
  "guess-the-car",
  "guess-the-country",
  "guess-the-phone",
] as const;

export type PopularGameSlug = (typeof POPULAR_GAME_SLUGS)[number];

/** Questions prepared per category during idle/homepage preload. */
export const CATEGORY_PRELOAD_COUNT = 20;

/** Rolling buffer: questions kept ready ahead of the player. */
export const BUFFER_AHEAD = 20;

/** Max prepared questions kept in memory per active category. */
export const MAX_PREPARED_QUESTIONS = 30;

/** Session pool fetch margin beyond visible questions. */
export const POOL_FETCH_MARGIN = 5;
