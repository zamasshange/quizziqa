/**
 * Central Asset Manager — all image loading goes through here.
 * Layers: memory → IndexedDB → service worker → network (with retry).
 */
import type { GameQuestion } from "@/lib/types";
import type { MediaVariant } from "@/lib/media/images";
import { wikiFromQuestionId } from "@/lib/media/resolve-image";
import {
  cacheKeyFor,
  getFlagUrl,
  getPlayableUrls,
  VARIANT_WIDTH,
} from "@/lib/media/image-candidates";
import { getMediaProxyUrl } from "@/lib/media/media-url";
import { idbGetImage, idbPutImage } from "@/lib/cache/idb-store";
import { MAX_PREPARED_QUESTIONS } from "@/lib/game/preload-config";

export type AssetPriority = "critical" | "high" | "normal" | "low";
export type AssetTier = "thumb" | "full";

export interface PreparedAsset {
  displayUrl: string | null;
  thumbUrl: string | null;
  fullUrl: string | null;
  state: "loading" | "thumb" | "full";
}

const RETRY_DELAYS_MS = [1000, 2000, 5000, 10000];
const LOAD_TIMEOUT_MS = 8000;
const MAX_CONCURRENT = 8;
const THUMB_WIDTH = 180;

const memoryReady = new Set<string>();
const objectUrls = new Map<string, string>();
const inflight = new Map<string, Promise<boolean>>();
const listeners = new Map<string, Set<() => void>>();
const lruKeys: string[] = [];

let active = 0;
const queue: Array<{ run: () => void; priority: number }> = [];

function priorityScore(p: AssetPriority): number {
  return { critical: 0, high: 1, normal: 2, low: 3 }[p];
}

function acquire(priority: AssetPriority): Promise<void> {
  if (active < MAX_CONCURRENT) {
    active++;
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    queue.push({ run: resolve, priority: priorityScore(priority) });
    queue.sort((a, b) => a.priority - b.priority);
  });
}

function release(): void {
  active--;
  const next = queue.shift();
  if (next) {
    active++;
    next.run();
  }
}

function notify(url: string): void {
  listeners.get(url)?.forEach((cb) => cb());
}

export function subscribeUrl(url: string, cb: () => void): () => void {
  if (!listeners.has(url)) listeners.set(url, new Set());
  listeners.get(url)!.add(cb);
  return () => listeners.get(url)?.delete(cb);
}

function touchLru(key: string): void {
  const idx = lruKeys.indexOf(key);
  if (idx >= 0) lruKeys.splice(idx, 1);
  lruKeys.push(key);
  while (lruKeys.length > MAX_PREPARED_QUESTIONS * 3) {
    const evict = lruKeys.shift();
    if (!evict) break;
    const objUrl = objectUrls.get(evict);
    if (objUrl) {
      URL.revokeObjectURL(objUrl);
      objectUrls.delete(evict);
    }
    memoryReady.delete(evict);
  }
}

export function isUrlReady(url: string): boolean {
  return memoryReady.has(url) || objectUrls.has(url);
}

export function firstReady(urls: string[]): string | null {
  for (const u of urls) {
    if (objectUrls.has(u)) return objectUrls.get(u)!;
    if (memoryReady.has(u)) return u;
  }
  return null;
}

function thumbUrlsFor(
  wiki: string,
  variant: MediaVariant,
  bakedImage?: string
): string[] {
  if (bakedImage?.includes("flagcdn.com")) return getFlagUrl(bakedImage);
  if (bakedImage?.includes("image.tmdb.org")) return [bakedImage];
  const thumbW = Math.min(THUMB_WIDTH, Math.round((VARIANT_WIDTH[variant] ?? 520) / 3));
  return [getMediaProxyUrl(wiki, thumbW)];
}

export function urlsForQuestion(
  q: GameQuestion,
  variant: MediaVariant
): { thumb: string[]; full: string[] } {
  if (q.emoji && !q.image) return { thumb: [], full: [] };
  if (q.image?.includes("flagcdn.com")) {
    const urls = getFlagUrl(q.image);
    return { thumb: urls, full: urls };
  }
  const wiki = wikiFromQuestionId(q.id);
  if (wiki) {
    return {
      thumb: thumbUrlsFor(wiki, variant, q.image),
      full: getPlayableUrls(wiki, variant, q.image),
    };
  }
  if (q.image?.startsWith("http")) {
    return { thumb: [q.image], full: [q.image] };
  }
  return { thumb: [], full: [] };
}

async function loadViaImage(url: string): Promise<boolean> {
  if (typeof window === "undefined" || typeof Image === "undefined") {
    return false;
  }
  return new Promise((resolve) => {
    const img = new Image();
    let settled = false;
    const done = (ok: boolean) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(ok);
    };
    const timer = setTimeout(() => done(false), LOAD_TIMEOUT_MS);
    img.onload = () => done(true);
    img.onerror = () => done(false);
    img.decoding = "async";
    img.src = url;
  });
}

async function loadViaFetch(url: string): Promise<Blob | null> {
  try {
    const res = await fetch(url, { credentials: "same-origin" });
    if (!res.ok) return null;
    return await res.blob();
  } catch {
    return null;
  }
}

async function tryLoadUrl(
  url: string,
  priority: AssetPriority,
  idbKey: string
): Promise<boolean> {
  if (typeof window === "undefined" || !url) return false;
  if (memoryReady.has(url) || objectUrls.has(url)) return true;

  const pending = inflight.get(url);
  if (pending) return pending;

  const promise = (async () => {
    const cached = await idbGetImage(idbKey);
    if (cached) {
      const objUrl = URL.createObjectURL(cached);
      objectUrls.set(url, objUrl);
      touchLru(idbKey);
      notify(url);
      return true;
    }

    for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt++) {
      if (attempt > 0) {
        await new Promise((r) => setTimeout(r, RETRY_DELAYS_MS[attempt - 1]));
      }

      await acquire(priority);
      try {
        const imgOk = await loadViaImage(url);
        if (imgOk) {
          memoryReady.add(url);
          touchLru(url);
          notify(url);
          void (async () => {
            const blob = await loadViaFetch(url);
            if (blob) await idbPutImage(idbKey, blob);
          })();
          return true;
        }

        const blob = await loadViaFetch(url);
        if (blob) {
          const objUrl = URL.createObjectURL(blob);
          objectUrls.set(url, objUrl);
          await idbPutImage(idbKey, blob);
          touchLru(idbKey);
          notify(url);
          return true;
        }
      } finally {
        release();
      }
    }
    return false;
  })();

  inflight.set(url, promise);
  try {
    return await promise;
  } finally {
    inflight.delete(url);
  }
}

export async function loadFirst(
  urls: string[],
  priority: AssetPriority = "normal",
  tier: AssetTier = "full"
): Promise<string | null> {
  const cached = firstReady(urls);
  if (cached) return cached;

  for (const url of urls) {
    const key = `${tier}:${url}`;
    const ok = await tryLoadUrl(url, priority, key);
    if (ok) return objectUrls.get(url) ?? url;
  }
  return null;
}

export function preloadUrl(
  url: string,
  priority: AssetPriority = "low",
  tier: AssetTier = "full"
): void {
  if (typeof window === "undefined" || !url || isUrlReady(url)) return;
  const key = `${tier}:${url}`;
  void tryLoadUrl(url, priority, key);
}

function prepareQuestionInternal(
  q: GameQuestion,
  variant: MediaVariant,
  priority: AssetPriority
): void {
  const { thumb, full } = urlsForQuestion(q, variant);
  if (!thumb.length && !full.length) return;

  for (const u of thumb) preloadUrl(u, priority, "thumb");
  for (const u of full) preloadUrl(u, priority === "critical" ? "high" : priority, "full");
}

export function prepareQuestion(
  q: GameQuestion,
  variant: MediaVariant,
  priority: AssetPriority = "normal"
): void {
  prepareQuestionInternal(q, variant, priority);
}

export function prepareAhead(
  questions: GameQuestion[],
  currentIndex: number,
  variantFor: (q: GameQuestion) => MediaVariant,
  count = 20
): void {
  for (
    let i = currentIndex;
    i < Math.min(questions.length, currentIndex + count);
    i++
  ) {
    const q = questions[i];
    const offset = i - currentIndex;
    const priority: AssetPriority =
      offset === 0
        ? "critical"
        : offset <= 3
          ? "high"
          : offset <= 10
            ? "normal"
            : "low";
    prepareQuestionInternal(q, variantFor(q), priority);
  }
}

export function warmSession(
  questions: GameQuestion[],
  variantFor: (q: GameQuestion) => MediaVariant
): void {
  prepareAhead(questions, 0, variantFor, Math.min(questions.length, 25));
}

export function getBestDisplay(
  wikiKey: string | undefined,
  variant: MediaVariant,
  bakedImage?: string
): PreparedAsset {
  const wiki = wikiKey ?? "";
  const { thumb, full } = wiki
    ? {
        thumb: thumbUrlsFor(wiki, variant, bakedImage),
        full: getPlayableUrls(wiki, variant, bakedImage),
      }
    : bakedImage
      ? { thumb: [bakedImage], full: [bakedImage] }
      : { thumb: [], full: [] };

  const fullHit = firstReady(full);
  if (fullHit) {
    return { displayUrl: fullHit, thumbUrl: null, fullUrl: fullHit, state: "full" };
  }
  const thumbHit = firstReady(thumb);
  if (thumbHit) {
    return {
      displayUrl: thumbHit,
      thumbUrl: thumbHit,
      fullUrl: full[0] ?? null,
      state: "thumb",
    };
  }
  const candidate = thumb[0] ?? full[0] ?? null;
  return { displayUrl: candidate, thumbUrl: thumb[0] ?? null, fullUrl: full[0] ?? null, state: "loading" };
}

export async function awaitDisplay(
  wikiKey: string | undefined,
  variant: MediaVariant,
  bakedImage?: string,
  priority: AssetPriority = "critical"
): Promise<PreparedAsset> {
  const wiki = wikiKey ?? "";
  const { thumb, full } = wiki
    ? {
        thumb: thumbUrlsFor(wiki, variant, bakedImage),
        full: getPlayableUrls(wiki, variant, bakedImage),
      }
    : bakedImage
      ? { thumb: [bakedImage], full: [bakedImage] }
      : { thumb: [], full: [] };

  const fullHit = await loadFirst(full, priority, "full");
  if (fullHit) {
    return { displayUrl: fullHit, thumbUrl: null, fullUrl: fullHit, state: "full" };
  }
  const thumbHit = await loadFirst(thumb, priority, "thumb");
  if (thumbHit) {
    return {
      displayUrl: thumbHit,
      thumbUrl: thumbHit,
      fullUrl: full[0] ?? null,
      state: "thumb",
    };
  }
  return getBestDisplay(wikiKey, variant, bakedImage);
}

export function cacheKeyForWiki(wiki: string, variant: MediaVariant): string {
  return cacheKeyFor(wiki, variant);
}

export const assetManager = {
  prepareQuestion,
  prepareAhead,
  warmSession,
  loadFirst,
  preloadUrl,
  isUrlReady,
  firstReady,
  getBestDisplay,
  awaitDisplay,
  subscribeUrl,
  urlsForQuestion,
  cacheKeyForWiki,
};

// Legacy re-exports for image-pipeline consumers
export { urlsForQuestion as urlsForQuestionLegacy };
