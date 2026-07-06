"use client";

import { useEffect, useState } from "react";
import type { MediaVariant } from "@/lib/media/images";
import type { GameQuestion } from "@/lib/types";
import { wikiFromQuestionId } from "@/lib/media/resolve-image";
import { cacheKeyFor } from "@/lib/media/image-candidates";
import { imagePipeline } from "@/lib/media/image-pipeline";

export type ImageDisplayState = "ready" | "loading" | "placeholder";

interface UseQuestionImageOptions {
  wikiKey?: string;
  imageUrl?: string;
  variant: MediaVariant;
}

export function useQuestionImage({
  wikiKey,
  imageUrl,
  variant,
}: UseQuestionImageOptions) {
  const cacheKey = wikiKey
    ? cacheKeyFor(wikiKey, variant)
    : imageUrl
      ? `direct:${imageUrl}`
      : "";

  const [src, setSrc] = useState<string | null>(() =>
    cacheKey ? imagePipeline.getCached(cacheKey) : null
  );
  const [state, setState] = useState<ImageDisplayState>(() =>
    src ? "ready" : "loading"
  );

  useEffect(() => {
    let cancelled = false;
    let retryTimer: ReturnType<typeof setInterval> | null = null;

    const load = async (): Promise<string | null> => {
      if (imageUrl?.includes("flagcdn.com")) {
        return imagePipeline.fetchDirect(
          imageUrl,
          variant,
          `flag:${imageUrl}`
        );
      }
      if (wikiKey) {
        return imagePipeline.fetchWiki(wikiKey, variant);
      }
      if (imageUrl?.startsWith("http")) {
        return imagePipeline.fetchDirect(imageUrl, variant);
      }
      return null;
    };

    const syncHit = cacheKey ? imagePipeline.getCached(cacheKey) : null;
    if (syncHit) {
      setSrc(syncHit);
      setState("ready");
      return;
    }

    setState("loading");
    setSrc(null);

    void (async () => {
      const result = await load();
      if (cancelled) return;
      if (result) {
        setSrc(result);
        setState("ready");
        return;
      }

      setState("placeholder");

      let attempts = 0;
      retryTimer = setInterval(async () => {
        attempts++;
        if (cancelled || attempts > 3) {
          if (retryTimer) clearInterval(retryTimer);
          return;
        }
        const retry = await load();
        if (!cancelled && retry) {
          setSrc(retry);
          setState("ready");
          if (retryTimer) clearInterval(retryTimer);
        }
      }, 4000);
    })();

    return () => {
      cancelled = true;
      if (retryTimer) clearInterval(retryTimer);
    };
  }, [wikiKey, imageUrl, variant, cacheKey]);

  return { src, state };
}

export function preloadQuestions(
  questions: GameQuestion[],
  startIndex: number,
  variantFor: (q: GameQuestion) => MediaVariant,
  count = 6
): void {
  imagePipeline.preloadAhead(questions, startIndex, variantFor, count);
}

export function warmSessionImages(
  questions: GameQuestion[],
  variantFor: (q: GameQuestion) => MediaVariant
): void {
  imagePipeline.warmSession(questions, variantFor);
}

export { wikiFromQuestionId };
