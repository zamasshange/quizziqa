import type { Difficulty } from "@/lib/types";

export function difficultyStars(d: Difficulty): number {
  const map: Record<Difficulty, number> = {
    easy: 2,
    medium: 3,
    hard: 4,
    expert: 5,
    impossible: 5,
  };
  return map[d] ?? 3;
}

export function comboLabel(combo: number): string | null {
  if (combo < 2) return null;
  if (combo >= 10) return "🔥 Legendary Combo!";
  if (combo >= 5) return `🔥 Combo x${combo}`;
  return `🔥 x${combo}`;
}

export function calcRoundXp(
  baseXp: number,
  combo: number,
  fastBonus: boolean,
  doubleXp: boolean
): number {
  let xp = baseXp;
  if (combo >= 3) xp += Math.min(combo * 2, 20);
  if (fastBonus) xp += 5;
  if (doubleXp) xp *= 2;
  return xp;
}

export function calcRoundCoins(combo: number): number {
  return 10 + Math.min(combo * 3, 30);
}

export const ANSWER_COLORS = [
  { bg: "#6FEEFF", shadow: "#3bb8cc" },
  { bg: "#c6ea84", shadow: "#8fb856" },
  { bg: "#F5D76E", shadow: "#c4a843" },
  { bg: "#FF9B9B", shadow: "#cc6b6b" },
] as const;
