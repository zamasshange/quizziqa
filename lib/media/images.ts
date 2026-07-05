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
  // Wikipedia thumbs: .../thumb/a/ab/File.jpg/500px-File.jpg -> increase px
  return url.replace(/\/(\d+)px-/, `/${targetWidth}px-`);
}

export type MediaVariant = "flag" | "portrait" | "landscape" | "square" | "emoji" | "logo";

export function inferMediaVariant(
  gameSlug: string,
  gameMode?: string
): MediaVariant {
  if (gameSlug.includes("flag") || gameSlug === "world-flags") return "flag";
  if (gameMode === "guess-from-emoji") return "emoji";
  if (gameSlug.includes("logo") || gameSlug.includes("brand")) return "logo";
  if (
    gameSlug.includes("celebrity") ||
    gameSlug.includes("athlete") ||
    gameSlug.includes("scientist") ||
    gameSlug.includes("painting")
  ) {
    return "portrait";
  }
  if (
    gameSlug.includes("landmark") ||
    gameSlug.includes("city") ||
    gameSlug.includes("planet") ||
    gameSlug.includes("food")
  ) {
    return "landscape";
  }
  if (gameSlug.includes("animal") || gameSlug.includes("flower")) {
    return "square";
  }
  return "portrait";
}
