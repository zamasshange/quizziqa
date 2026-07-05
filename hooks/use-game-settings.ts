"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_SETTINGS,
  loadGameSettings,
  saveGameSettings,
  type GameSettings,
} from "@/lib/game/settings";

export function useGameSettings() {
  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSettings(loadGameSettings());
    setHydrated(true);
  }, []);

  const updateSettings = useCallback((patch: Partial<GameSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveGameSettings(next);
      return next;
    });
  }, []);

  const resetSettings = useCallback(() => {
    saveGameSettings(DEFAULT_SETTINGS);
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return { settings, hydrated, updateSettings, resetSettings };
}
