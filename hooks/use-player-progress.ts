"use client";

import { useCallback, useEffect, useState } from "react";
import type { PlayerStats } from "@/lib/types";
import {
  loadPlayerStats,
  recordGameSession,
  type GameSessionResult,
  type RecordGameOutcome,
  EMPTY_STATS,
} from "@/lib/player/progress";
import { checkAchievements } from "@/lib/player/achievements";

export function usePlayerProgress() {
  const [stats, setStats] = useState<PlayerStats>(EMPTY_STATS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setStats(loadPlayerStats());
    setHydrated(true);
  }, []);

  const recordGame = useCallback(
    (result: GameSessionResult): RecordGameOutcome => {
      const outcome = recordGameSession(result, checkAchievements);
      setStats(outcome.stats);
      return outcome;
    },
    []
  );

  const refresh = useCallback(() => {
    setStats(loadPlayerStats());
  }, []);

  return { stats, hydrated, recordGame, refresh };
}
