"use client";

import { useEffect, useState } from "react";
import type { MediaVariant } from "@/lib/media/images";
import {
  getBestDisplay,
  awaitDisplay,
  subscribeUrl,
  loadFirst,
  type PreparedAsset,
} from "@/lib/media/asset-manager";
import { getPlayableUrls } from "@/lib/media/image-candidates";
import { getFlagUrl } from "@/lib/media/image-candidates";

export function usePreparedAsset(
  wikiKey: string | undefined,
  imageUrl: string | undefined,
  variant: MediaVariant
): PreparedAsset & { fullReady: boolean } {
  const [asset, setAsset] = useState<PreparedAsset>(() =>
    getBestDisplay(wikiKey, variant, imageUrl)
  );
  const [fullReady, setFullReady] = useState(false);

  useEffect(() => {
    setFullReady(false);
    const initial = getBestDisplay(wikiKey, variant, imageUrl);
    setAsset(initial);

    const fullUrls = wikiKey
      ? getPlayableUrls(wikiKey, variant, imageUrl)
      : imageUrl?.includes("flagcdn.com")
        ? getFlagUrl(imageUrl)
        : imageUrl?.startsWith("http")
          ? [imageUrl]
          : [];

    const unsubs: Array<() => void> = [];
    for (const url of fullUrls) {
      unsubs.push(
        subscribeUrl(url, () => {
          const next = getBestDisplay(wikiKey, variant, imageUrl);
          setAsset(next);
          if (next.state === "full") setFullReady(true);
        })
      );
    }

    void (async () => {
      const result = await awaitDisplay(wikiKey, variant, imageUrl, "critical");
      setAsset(result);
      if (result.state === "full") setFullReady(true);
      else if (result.fullUrl) {
        const full = await loadFirst(fullUrls, "high", "full");
        if (full) {
          setFullReady(true);
          setAsset((prev) => ({
            ...prev,
            displayUrl: full,
            fullUrl: full,
            state: "full",
          }));
        }
      }
    })();

    return () => unsubs.forEach((u) => u());
  }, [wikiKey, imageUrl, variant]);

  return { ...asset, fullReady };
}
