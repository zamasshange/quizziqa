import { getDailySeed } from "@/lib/utils";

export interface DailyChallengeDef {
  id: string;
  emoji: string;
  title: string;
  slug: string;
  category: string;
  bonusXp: number;
}

export const DAILY_CHALLENGES: DailyChallengeDef[] = [
  { id: "daily-celebrity", emoji: "⭐", title: "Daily Celebrity", slug: "guess-the-celebrity", category: "Celebrities", bonusXp: 25 },
  { id: "daily-city", emoji: "🏙", title: "Daily City", slug: "guess-the-city", category: "Geography", bonusXp: 25 },
  { id: "daily-flag", emoji: "🏳", title: "Daily Flag", slug: "guess-the-flag", category: "Geography", bonusXp: 25 },
  { id: "daily-animal", emoji: "🐾", title: "Daily Animal", slug: "guess-the-animal-wiki", category: "Animals", bonusXp: 25 },
  { id: "daily-food", emoji: "🍕", title: "Daily Food", slug: "guess-the-food", category: "Food", bonusXp: 25 },
  { id: "daily-landmark", emoji: "🏰", title: "Daily Landmark", slug: "guess-the-landmark", category: "Landmarks", bonusXp: 25 },
  { id: "daily-capital", emoji: "🏛", title: "Daily Capital", slug: "guess-the-capital", category: "Geography", bonusXp: 30 },
  { id: "daily-science", emoji: "🔬", title: "Daily Scientist", slug: "guess-the-scientist", category: "Science", bonusXp: 30 },
  { id: "daily-planet", emoji: "🪐", title: "Daily Planet", slug: "guess-the-planet", category: "Space", bonusXp: 25 },
  { id: "daily-athlete", emoji: "🏅", title: "Daily Athlete", slug: "guess-the-athlete", category: "Sports", bonusXp: 25 },
  { id: "daily-painting", emoji: "🎨", title: "Daily Painting", slug: "guess-the-painting", category: "Art", bonusXp: 35 },
  { id: "daily-president", emoji: "🎖", title: "Daily President", slug: "guess-the-president", category: "History", bonusXp: 35 },
];

export function getTodayChallengeIndex(): number {
  const seed = getDailySeed();
  return seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % DAILY_CHALLENGES.length;
}

export function getTodayChallenge(): DailyChallengeDef {
  return DAILY_CHALLENGES[getTodayChallengeIndex()];
}

export function getDailyChallengeForDayOffset(offset: number): DailyChallengeDef {
  const idx = (getTodayChallengeIndex() + offset + DAILY_CHALLENGES.length) % DAILY_CHALLENGES.length;
  return DAILY_CHALLENGES[idx];
}
