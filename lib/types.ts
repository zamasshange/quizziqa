export type Difficulty = "easy" | "medium" | "hard" | "expert" | "impossible";

export type GameMode =
  | "guess-from-image"
  | "guess-silhouette"
  | "guess-pixelated"
  | "guess-from-emoji"
  | "guess-from-clues"
  | "multiple-choice"
  | "timed"
  | "endless"
  | "daily"
  | "weekly";

export interface Category {
  id: string;
  slug: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
  gameCount: number;
  gradient: string;
}

export interface GameQuestion {
  id: string;
  question: string;
  answer: string;
  alternatives?: string[];
  image?: string;
  emoji?: string;
  clues?: string[];
  hint?: string;
  fact: string;
  difficulty: Difficulty;
}

export interface GameMeta {
  id: string;
  slug: string;
  title: string;
  description: string;
  categoryId: string;
  difficulty: Difficulty;
  xpReward: number;
  featured?: boolean;
  trending?: boolean;
  isNew?: boolean;
  timeLimit?: number;
}

export interface Game extends GameMeta {
  mode: GameMode;
  questions: GameQuestion[];
  maxHints: number;
  maxSkips: number;
  offline?: boolean;
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  description: string;
  emoji: string;
  gameIds: string[];
  color: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  xpBonus: number;
  unlocked?: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar: string;
  score: number;
  country?: string;
}

export interface PlayerStats {
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  gamesPlayed: number;
  correctAnswers: number;
  totalAnswers: number;
  favoriteCategory: string;
  achievements: string[];
  coins?: number;
}

export interface DailyChallenge {
  id: string;
  date: string;
  title: string;
  emoji: string;
  categoryId: string;
  gameId: string;
  participants: number;
}
