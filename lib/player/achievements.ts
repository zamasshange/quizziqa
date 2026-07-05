import { achievements } from "@/lib/data/achievements";
import type { GameSessionResult } from "@/lib/player/progress";
import type { PlayerStats } from "@/lib/types";

interface ExtendedStats extends PlayerStats {
  lastPlayedDate?: string;
  categoryPlays: Record<string, number>;
  completedGames: string[];
}

const CATEGORY_MASTERY = 5;

export function checkAchievements(
  stats: ExtendedStats,
  result: GameSessionResult
): { unlocked: string[]; bonusXp: number } {
  const unlocked: string[] = [];
  let bonusXp = 0;

  const already = new Set(stats.achievements);

  function unlock(id: string) {
    if (already.has(id) || unlocked.includes(id)) return;
    unlocked.push(id);
    const def = achievements.find((a) => a.id === id);
    if (def) bonusXp += def.xpBonus;
  }

  if (stats.gamesPlayed >= 1) unlock("first-win");
  if (stats.correctAnswers >= 10) unlock("10-correct");
  if (stats.correctAnswers >= 100) unlock("100-correct");
  if (result.score === result.totalQuestions && result.totalQuestions > 0) {
    unlock("perfect-game");
  }
  if (stats.streak >= 7) unlock("7-streak");
  if (stats.streak >= 30) unlock("30-streak");

  const categoryPlays = stats.categoryPlays[result.categoryId] ?? 0;
  if (categoryPlays >= CATEGORY_MASTERY) {
    const map: Record<string, string> = {
      animals: "animal-expert",
      movies: "movie-master",
      geo: "geo-genius",
      cars: "car-collector",
      tech: "tech-wizard",
    };
    const id = map[result.categoryId];
    if (id) unlock(id);
  }

  return { unlocked, bonusXp };
}

export function getAchievementById(id: string) {
  return achievements.find((a) => a.id === id);
}
