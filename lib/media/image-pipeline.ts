/**
 * Simple client image preloader — warms browser cache via Image().
 */
import type { GameQuestion } from "@/lib/types";
import type { MediaVariant } from "@/lib/media/images";
import { wikiFromQuestionId } from "@/lib/media/resolve-image";
import { getMediaProxyUrl } from "@/lib/media/media-url";

const MAX_CONCURRENT = 6;
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

export function preloadUrl(url: string): void {
  if (!url || typeof window === "undefined") return;
  void acquire().then(() => {
    const img = new Image();
    img.onload = release;
    img.onerror = release;
    img.src = url;
  });
}

export function urlsForQuestion(q: GameQuestion, _variant: MediaVariant): string[] {
  if (q.emoji && !q.image) return [];
  if (q.image) return [q.image];
  const wiki = wikiFromQuestionId(q.id);
  if (wiki) return [getMediaProxyUrl(wiki, 520)];
  return [];
}

export function preloadAhead(
  questions: GameQuestion[],
  startIndex: number,
  _variantFor: (q: GameQuestion) => MediaVariant,
  count = 8
): void {
  for (
    let i = startIndex;
    i < Math.min(questions.length, startIndex + count);
    i++
  ) {
    const urls = urlsForQuestion(questions[i], "portrait");
    urls.forEach((u) => preloadUrl(u));
  }
}

export function warmSession(
  questions: GameQuestion[],
  variantFor: (q: GameQuestion) => MediaVariant
): void {
  preloadAhead(questions, 0, variantFor, Math.min(questions.length, 12));
}

export function isUrlReady(_url: string): boolean {
  return false;
}

export function firstReady(_urls: string[]): string | null {
  return null;
}

export async function loadFirst(urls: string[]): Promise<string | null> {
  return urls[0] ?? null;
}

export function cacheKeyForWiki(wiki: string, variant: MediaVariant): string {
  return `${wiki}:${variant}`;
}

export { preloadAhead as prepareAhead };
