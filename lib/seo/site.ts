/** Official site URL — always use quizzical.site for SEO canonicals. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://quizzical.site";

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

export function absoluteUrl(path = ""): string {
  const base = SITE_URL.replace(/\/$/, "");
  if (!path || path === "/") return `${base}/`;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
