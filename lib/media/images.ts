export type MediaVariant =
  | "flag"
  | "portrait"
  | "landscape"
  | "square"
  | "emoji"
  | "logo"
  | "text"
  | "product"
  | "food";

/** ISO 3166-1 alpha-2 codes for flagcdn.com (fast, reliable flag CDN) */
export const countryIsoCodes: Record<string, string> = {
  Japan: "jp",
  Brazil: "br",
  France: "fr",
  Egypt: "eg",
  Australia: "au",
  Canada: "ca",
  Germany: "de",
  India: "in",
  Mexico: "mx",
  "South Korea": "kr",
  Italy: "it",
  Spain: "es",
  Argentina: "ar",
  Norway: "no",
  Kenya: "ke",
  China: "cn",
  Thailand: "th",
  "United States": "us",
  "United Kingdom": "gb",
  Netherlands: "nl",
  Belgium: "be",
  Portugal: "pt",
  Colombia: "co",
  Turkey: "tr",
  Greece: "gr",
  Morocco: "ma",
  Poland: "pl",
  Sweden: "se",
  Switzerland: "ch",
  Indonesia: "id",
  Vietnam: "vn",
  Philippines: "ph",
  Ireland: "ie",
  "South Africa": "za",
  Chile: "cl",
  Peru: "pe",
  Nigeria: "ng",
  Israel: "il",
  "Saudi Arabia": "sa",
  Russia: "ru",
  Ukraine: "ua",
  Pakistan: "pk",
  Bangladesh: "bd",
  Iran: "ir",
};

export function getFlagUrl(countryName: string, width = 640): string {
  const iso = countryIsoCodes[countryName];
  if (!iso) return "";
  return `https://flagcdn.com/w${width}/${iso}.png`;
}

export function getFlagUrlByIso(iso: string, width = 640): string {
  return `https://flagcdn.com/w${width}/${iso.toLowerCase()}.png`;
}

/** Upgrade Wikipedia thumb URL to higher resolution */
export function upsizeWikiImage(url: string, targetWidth = 800): string {
  if (!url) return url;
  return url.replace(/\/(\d+)px-/, `/${targetWidth}px-`);
}

export function inferMediaVariant(
  gameSlug: string,
  gameMode?: string,
  opts?: { hasImage?: boolean; hasEmoji?: boolean }
): MediaVariant {
  if (opts?.hasEmoji) return "emoji";
  if (!opts?.hasImage && !opts?.hasEmoji) {
    if (
      gameMode === "multiple-choice" ||
      gameSlug.includes("quote") ||
      gameSlug.includes("trivia")
    ) {
      return "text";
    }
  }
  if (gameSlug.includes("flag") || gameSlug === "world-flags") return "flag";
  if (gameMode === "guess-from-emoji") return "emoji";
  if (gameSlug.includes("logo") || gameSlug.includes("brand")) return "logo";
  if (gameSlug.includes("tech")) return "logo";
  if (gameSlug.includes("food")) return "food";
  if (gameSlug.includes("phone")) return "product";
  if (
    gameSlug.includes("car") ||
    gameSlug.includes("video-game") ||
    gameSlug.includes("invention") ||
    gameSlug.includes("instrument")
  ) {
    return "landscape";
  }
  if (
    gameSlug.includes("celebrity") ||
    gameSlug.includes("athlete") ||
    gameSlug.includes("scientist") ||
    gameSlug.includes("painting") ||
    gameSlug.includes("president") ||
    gameSlug.includes("writer") ||
    gameSlug.includes("explorer") ||
    gameSlug.includes("artist")
  ) {
    return "portrait";
  }
  if (
    gameSlug.includes("landmark") ||
    gameSlug.includes("city") ||
    gameSlug.includes("capital") ||
    gameSlug.includes("planet") ||
    gameSlug.includes("country") ||
    gameSlug.includes("mountain") ||
    gameSlug.includes("island")
  ) {
    return "landscape";
  }
  if (
    gameSlug.includes("animal") ||
    gameSlug.includes("flower") ||
    gameSlug.includes("bird") ||
    gameSlug.includes("dinosaur") ||
    gameSlug.includes("dog")
  ) {
    return "square";
  }
  if (gameSlug.includes("movie") || gameSlug.includes("tv")) {
    return "landscape";
  }
  return "portrait";
}
