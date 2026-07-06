/**
 * Client image pipeline — uses Image() preloading (no fetch/CORS issues).
 * Tracks which URLs are browser-cached and ready for instant <img> display.
 */
import type { GameQuestion } from "@/lib/types";
import type { MediaVariant } from "@/lib/media/images";
import { wikiFromQuestionId } from "@/lib/media/resolve-image";
import {
  cacheKeyFor,
  getFlagUrl,
  getPlayableUrls,
} from "@/lib/media/image-candidates";

const TIMEOUT_MS = 6000;
const MAX_CONCURRENT = 6;
const LOOKAHEAD = 8;

const ready = new Set<string>();
const inflight = new Map<string, Promise<boolean>>();
let active = 0;
const queue: Array<() => void> = [];

function acquire(): Promise<void> {
  if (active < MAX_CONCURRENT) {
    active++;
    return Promise.resolve();
  }
  return new Promise((r) => queue.push(r));
}

function release(): void {
  active--;
  queue.shift()?.();
}

/** Preload a URL into the browser image cache via Image(). */
export function preloadUrl(url: string): Promise<boolean> {
  if (!url) return Promise.resolve(false);
  if (ready.has(url)) return Promise.resolve(true);

  const pending = inflight.get(url);
  if (pending) return pending;

  const promise = (async () => {
    await acquire();
    try {
      const ok = await new Promise<boolean>((resolve) => {
        const img = new Image();
        let settled = false;
        const done = (success: boolean) => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          resolve(success);
        };
        const timer = setTimeout(() => done(false), TIMEOUT_MS);
        img.onload = () => done(true);
        img.onerror = () => done(false);
        img.decoding = "async";
        img.src = url;
      });
      if (ok) ready.add(url);
      return ok;
    } finally {
      release();
      inflight.delete(url);
    }
  })();

  inflight.set(url, promise);
  return promise;
}

export function isUrlReady(url: string): boolean {
  return ready.has(url);
}

/** First ready URL from a candidate list, or null. */
export function firstReady(urls: string[]): string | null {
  return urls.find((u) => ready.has(u)) ?? null;
}

/** Try each URL in order until one loads. Returns the winning URL. */
export async function loadFirst(urls: string[]): Promise<string | null> {
  const cached = firstReady(urls);
  if (cached) return cached;

  for (const url of urls) {
    const ok = await preloadUrl(url);
    if (ok) return url;
  }
  return null;
}

export function urlsForQuestion(
  q: GameQuestion,
  variant: MediaVariant
): string[] {
  if (q.emoji && !q.image) return [];
  if (q.image?.includes("flagcdn.com")) return getFlagUrl(q.image);
  const wiki = wikiFromQuestionId(q.id);
  if (wiki) return getPlayableUrls(wiki, variant);
  if (q.image?.startsWith("http")) return [q.image];
  return [];
}

function preloadQuestion(
  q: GameQuestion,
  variant: MediaVariant,
  priority: "high" | "low" = "low"
): void {
  const urls = urlsForQuestion(q, variant);
  if (!urls.length) return;

  const run = () => {
    void loadFirst(urls);
    urls.slice(1).forEach((u) => void preloadUrl(u));
  };

  if (priority === "high") {
    run();
  } else {
    setTimeout(run, 30);
  }
}

export function preloadAhead(
  questions: GameQuestion[],
  currentIndex: number,
  variantFor: (q: GameQuestion) => MediaVariant,
  count = LOOKAHEAD
): void {
  for (
    let i = currentIndex;
    i < Math.min(questions.length, currentIndex + count);
    i++
  ) {
    const q = questions[i];
    const priority =
      i === currentIndex ? "high" : i <= currentIndex + 3 ? "high" : "low";
    preloadQuestion(q, variantFor(q), priority);
  }
}

export function warmSession(
  questions: GameQuestion[],
  variantFor: (q: GameQuestion) => MediaVariant
): void {
  preloadAhead(questions, 0, variantFor, Math.min(questions.length, 12));
}

/** Legacy compat — sync cache check by wiki key */
export function getCachedByKey(key: string): string | null {
  return null;
}

export function cacheKeyForWiki(wiki: string, variant: MediaVariant): string {
  return cacheKeyFor(wiki, variant);
}

// Legacy singleton shape for any remaining imports
export const imagePipeline = {
  getCached: () => null as string | null,
  preloadAhead,
  warmSession,
  fetchWiki: async (wiki: string, variant: MediaVariant) =>
    loadFirst(getPlayableUrls(wiki, variant)),
  fetchDirect: async (url: string) => (await preloadUrl(url)) ? url : null,
  preloadQuestion,
};
