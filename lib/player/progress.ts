import type { PlayerStats } from "@/lib/types";

const STORAGE_KEY = "guess-everything-progress";

export const EMPTY_STATS: PlayerStats = {
  xp: 0,
  level: 1,
  streak: 0,
  longestStreak: 0,
  gamesPlayed: 0,
  correctAnswers: 0,
  totalAnswers: 0,
  favoriteCategory: "geo",
  achievements: [],
  coins: 0,
};

export interface GameSessionResult {
  gameId: string;
  gameSlug: string;
  categoryId: string;
  score: number;
  totalQuestions: number;
  xpEarned: number;
  isDaily?: boolean;
}

export interface RecordGameOutcome {
  stats: PlayerStats;
  newAchievements: string[];
  bonusXp: number;
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayKey(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function xpForLevel(level: number): number {
  return level * 250;
}

export function levelFromXp(xp: number): number {
  return Math.max(1, Math.floor(xp / 250) + 1);
}

export function xpProgressInLevel(xp: number): {
  current: number;
  needed: number;
  percent: number;
} {
  const level = levelFromXp(xp);
  const currentLevelFloor = (level - 1) * 250;
  const current = xp - currentLevelFloor;
  const needed = 250;
  return { current, needed, percent: Math.min(100, (current / needed) * 100) };
}

interface StoredProgress extends PlayerStats {
  lastPlayedDate?: string;
  categoryPlays: Record<string, number>;
  completedGames: string[];
}

function loadRaw(): StoredProgress {
  if (typeof window === "undefined") {
    return { ...EMPTY_STATS, categoryPlays: {}, completedGames: [] };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...EMPTY_STATS, categoryPlays: {}, completedGames: [] };
    const parsed = JSON.parse(raw) as StoredProgress;
    return {
      ...EMPTY_STATS,
      ...parsed,
      categoryPlays: parsed.categoryPlays ?? {},
      completedGames: parsed.completedGames ?? [],
      level: levelFromXp(parsed.xp ?? 0),
    };
  } catch {
    return { ...EMPTY_STATS, categoryPlays: {}, completedGames: [] };
  }
}

function saveRaw(data: StoredProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadPlayerStats(): PlayerStats {
  const raw = loadRaw();
  const { categoryPlays: _cp, completedGames: _cg, lastPlayedDate: _lp, ...stats } = raw;
  return stats;
}

export function recordGameSession(
  result: GameSessionResult,
  checkAchievements: (stats: StoredProgress, result: GameSessionResult) => {
    unlocked: string[];
    bonusXp: number;
  }
): RecordGameOutcome {
  const raw = loadRaw();
  const today = todayKey();

  let streak = raw.streak;
  if (raw.lastPlayedDate !== today) {
    if (raw.lastPlayedDate === yesterdayKey()) {
      streak += 1;
    } else {
      streak = 1;
    }
  }

  const categoryPlays = { ...raw.categoryPlays };
  categoryPlays[result.categoryId] = (categoryPlays[result.categoryId] ?? 0) + 1;

  const completedGames = raw.completedGames.includes(result.gameSlug)
    ? raw.completedGames
    : [...raw.completedGames, result.gameSlug];

  let xp = raw.xp + result.xpEarned;
  if (result.isDaily) xp += 25;

  const coins = (raw.coins ?? 0) + Math.floor(result.xpEarned / 2);

  const updated: StoredProgress = {
    ...raw,
    xp,
    coins,
    level: levelFromXp(xp),
    streak,
    longestStreak: Math.max(raw.longestStreak, streak),
    gamesPlayed: raw.gamesPlayed + 1,
    correctAnswers: raw.correctAnswers + result.score,
    totalAnswers: raw.totalAnswers + result.totalQuestions,
    lastPlayedDate: today,
    categoryPlays,
    completedGames,
    favoriteCategory: Object.entries(categoryPlays).sort((a, b) => b[1] - a[1])[0]?.[0] ?? raw.favoriteCategory,
  };

  const { unlocked, bonusXp } = checkAchievements(updated, result);
  if (bonusXp > 0) {
    updated.xp += bonusXp;
    updated.level = levelFromXp(updated.xp);
  }
  updated.achievements = [...new Set([...raw.achievements, ...unlocked])];

  saveRaw(updated);

  const { categoryPlays: _c, completedGames: _g, lastPlayedDate: _l, ...stats } = updated;
  return { stats, newAchievements: unlocked, bonusXp };
}

export function getCategoryPlays(): Record<string, number> {
  return loadRaw().categoryPlays;
}

export function getCompletedGameSlugs(): string[] {
  return loadRaw().completedGames;
}
