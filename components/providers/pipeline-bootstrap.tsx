"use client";

import { useEffect } from "react";
import { startHomepagePreload } from "@/lib/game/background-worker";

/** Starts background category preloading after hydration — non-blocking. */
export function PipelineBootstrap() {
  useEffect(() => {
    startHomepagePreload();
  }, []);
  return null;
}
