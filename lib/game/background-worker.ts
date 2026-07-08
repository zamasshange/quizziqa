/**
 * Background asset scheduler — homepage preload, predictive hover, idle refill.
 */
import type { GameQuestion } from "@/lib/types";
import type { MediaVariant } from "@/lib/media/images";
import { inferMediaVariant } from "@/lib/media/images";
import { ensureQuestionImages } from "@/lib/media/resolve-image";
import { warmSession, prepareAhead } from "@/lib/media/asset-manager";
import { idbGetQuestions, idbPutQuestions } from "@/lib/cache/idb-store";
import {
  POPULAR_GAME_SLUGS,
  CATEGORY_PRELOAD_COUNT,
} from "@/lib/game/preload-config";

const categoryQueues = new Map<string, Promise<void>>();
let homepageStarted = false;

function poolKey(slug: string): string {
  return `pool:${slug}`;
}

async function fetchAndCachePool(slug: string): Promise<GameQuestion[]> {
  const cached = await idbGetQuestions<GameQuestion[]>(poolKey(slug));
  if (cached?.length) return cached;

  const res = await fetch(`/api/games/${slug}/session?count=${CATEGORY_PRELOAD_COUNT}`);
  if (!res.ok) return [];
  const data = await res.json();
  const questions = ensureQuestionImages(data.questions ?? []);
  if (questions.length) {
    await idbPutQuestions(poolKey(slug), questions);
  }
  return questions;
}

function variantForSlug(slug: string) {
  return (q: GameQuestion): MediaVariant =>
    inferMediaVariant(slug, "guess-from-image", {
      hasImage: !!q.image,
      hasEmoji: !!q.emoji,
    });
}

function scheduleIdle(fn: () => void): void {
  if (typeof requestIdleCallback !== "undefined") {
    requestIdleCallback(() => fn(), { timeout: 4000 });
  } else {
    setTimeout(fn, 100);
  }
}

async function preloadCategory(slug: string, priority: "high" | "low"): Promise<void> {
  const questions = await fetchAndCachePool(slug);
  if (!questions.length) return;

  const slice = questions.slice(0, CATEGORY_PRELOAD_COUNT);
  const variantFn = variantForSlug(slug);

  if (priority === "high") {
    warmSession(slice, variantFn);
  } else {
    scheduleIdle(() => {
      prepareAhead(slice, 0, variantFn, CATEGORY_PRELOAD_COUNT);
    });
  }
}

export function prioritizeCategory(slug: string): void {
  if (categoryQueues.has(slug)) return;
  const job = preloadCategory(slug, "high").finally(() => {
    categoryQueues.delete(slug);
  });
  categoryQueues.set(slug, job);
}

export function startHomepagePreload(): void {
  if (homepageStarted || typeof window === "undefined") return;
  homepageStarted = true;

  scheduleIdle(() => {
    POPULAR_GAME_SLUGS.forEach((slug, i) => {
      setTimeout(() => {
        void preloadCategory(slug, i < 3 ? "high" : "low");
      }, i * 400);
    });
  });
}

export function prefetchGame(slug: string): void {
  prioritizeCategory(slug);
}
