/** Per-game SEO keywords — maps slug to search terms people actually type. */
export const GAME_KEYWORDS: Record<string, string[]> = {
  "guess-the-celebrity": [
    "guess the celebrity",
    "celebrity quiz",
    "famous people quiz",
    "celebrity picture quiz",
    "name the celebrity",
  ],
  "guess-the-flag": [
    "guess the flag",
    "flag quiz",
    "country flag game",
    "world flags quiz",
    "flag guessing game",
  ],
  "guess-the-president": [
    "guess the president",
    "world leaders quiz",
    "president picture quiz",
    "guess the world leader",
    "political figures quiz",
  ],
  "guess-the-movie": [
    "guess the movie",
    "movie poster quiz",
    "film quiz game",
    "guess the film",
    "movie trivia",
  ],
  "guess-the-animal-wiki": [
    "guess the animal",
    "animal quiz",
    "wildlife quiz",
    "animal picture quiz",
    "name the animal",
  ],
  "guess-the-brand": [
    "guess the logo",
    "brand logo quiz",
    "company logo game",
    "logo guessing game",
  ],
  "guess-the-car": [
    "guess the car",
    "car quiz",
    "automobile quiz",
    "guess the vehicle",
  ],
  "guess-the-country": [
    "guess the country",
    "country quiz",
    "geography quiz",
    "world countries game",
  ],
  "guess-the-city": [
    "guess the city",
    "city quiz",
    "world cities quiz",
    "geography picture quiz",
  ],
  "guess-the-landmark": [
    "guess the landmark",
    "famous landmarks quiz",
    "world wonders quiz",
    "monument quiz",
  ],
  "guess-the-athlete": [
    "guess the athlete",
    "sports quiz",
    "famous athletes quiz",
    "sports stars game",
  ],
  "guess-the-food": [
    "guess the food",
    "food quiz",
    "cuisine quiz",
    "world food game",
  ],
  "guess-the-planet": [
    "guess the planet",
    "space quiz",
    "solar system quiz",
    "astronomy quiz",
  ],
  "guess-the-phone": [
    "guess the phone",
    "smartphone quiz",
    "phone model quiz",
    "tech quiz",
  ],
};

export const CATEGORY_KEYWORDS: Record<string, string[]> = {
  geography: ["geography quiz", "geography games", "world quiz", "map quiz"],
  animals: ["animal quiz games", "wildlife trivia", "animal guessing game"],
  movies: ["movie quiz games", "film trivia online", "movie guessing game"],
  history: ["history quiz", "history trivia game", "world history quiz"],
  celebrities: ["celebrity quiz games", "famous people trivia"],
  sports: ["sports quiz games", "athlete trivia"],
  brands: ["logo quiz games", "brand trivia"],
  cars: ["car quiz games", "automobile trivia"],
  food: ["food quiz games", "cuisine trivia"],
  space: ["space quiz games", "astronomy trivia"],
};

export function keywordsForGame(slug: string, title: string): string[] {
  const specific = GAME_KEYWORDS[slug] ?? [];
  const generic = [
    title.toLowerCase(),
    `${title.toLowerCase()} online`,
    `${title.toLowerCase()} free`,
    "quizzical",
    "free quiz game",
  ];
  return [...new Set([...specific, ...generic])];
}

export function keywordsForCategory(slug: string, name: string): string[] {
  const specific = CATEGORY_KEYWORDS[slug] ?? [];
  return [
    ...new Set([
      ...specific,
      `${name.toLowerCase()} quiz`,
      `${name.toLowerCase()} guessing games`,
      "quizzical",
      "free online quiz",
    ]),
  ];
}
