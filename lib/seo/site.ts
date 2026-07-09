/** Official production origin — used for sitemap, canonicals, and structured data. */
export const CANONICAL_ORIGIN = "https://quizzical.site";

export const SITE_NAME = "Quizzical";

export const SITE_TAGLINE = "Free Online Guessing & Quiz Games";

export const SITE_DESCRIPTION =
  "Play free guessing games on Quizzical — guess the celebrity, flag, movie, president, animal, and more. Picture quizzes, daily challenges, XP, and trivia powered by Wikipedia. No download required.";

/** Core keywords for search engines and social previews. */
export const SITE_KEYWORDS = [
  "quizzical",
  "quizzical.site",
  "quiz games",
  "guessing games",
  "free online quiz",
  "picture quiz",
  "image quiz",
  "trivia games",
  "guess the celebrity",
  "guess the flag",
  "guess the movie",
  "guess the president",
  "guess the animal",
  "daily quiz",
  "free trivia",
  "wikipedia quiz",
  "photo quiz game",
  "online trivia game",
  "brain games",
  "quiz game online free",
] as const;

export const OG_IMAGE_PATH = "/icons/icon-512.png";

export const TWITTER_HANDLE = "@quizzical";

function isLocalUrl(url: string): boolean {
  return /localhost|127\.0\.0\.1/i.test(url);
}

/**
 * Resolve the public site URL.
 * Production NEVER uses localhost — sitemap/canonicals must always be quizzical.site.
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim();
  const isProd =
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "production";

  if (isProd) {
    if (fromEnv && !isLocalUrl(fromEnv)) {
      return fromEnv.replace(/\/$/, "");
    }
    return CANONICAL_ORIGIN;
  }

  if (fromEnv && !isLocalUrl(fromEnv)) {
    return fromEnv.replace(/\/$/, "");
  }

  return fromEnv?.replace(/\/$/, "") || "http://localhost:3000";
}

/** @deprecated use getSiteUrl() — kept for static imports; prefer getSiteUrl() in sitemap/robots */
export const SITE_URL = getSiteUrl();

export function absoluteUrl(path = ""): string {
  const base = getSiteUrl();
  if (!path || path === "/") return `${base}/`;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
