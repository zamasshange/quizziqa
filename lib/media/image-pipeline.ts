/**
 * Client-side image pipeline — preload, cache, dedupe, retry.
 * Images are ready BEFORE the player sees the question.
 */
import type { GameQuestion } from "@/lib/types";
import type { MediaVariant } from "@/lib/media/images";
import { wikiFromQuestionId } from "@/lib/media/resolve-image";
import {
  cacheKeyFor,
  getDirectCandidates,
  getImageCandidates,
} from "@/lib/media/image-candidates";
import { idbGet, idbPut } from "@/lib/media/image-store";

const ATTEMPT_TIMEOUT_MS = 4000;
const MAX_CONCURRENT = 4;
const LOOKAHEAD = 6;

interface CacheEntry {
  blobUrl: string;
  refs: number;
}

class ImagePipeline {
  private memory = new Map<string, CacheEntry>();
  private inflight = new Map<string, Promise<string | null>>();
  private active = 0;
  private waiters: Array<() => void> = [];

  /** Synchronous memory hit — instant display. */
  getCached(key: string): string | null {
    const entry = this.memory.get(key);
    return entry?.blobUrl ?? null;
  }

  retain(key: string, blobUrl: string): void {
    const existing = this.memory.get(key);
    if (existing) {
      existing.refs++;
      return;
    }
    this.memory.set(key, { blobUrl, refs: 1 });
  }

  release(key: string): void {
    const entry = this.memory.get(key);
    if (!entry) return;
    entry.refs--;
    if (entry.refs <= 0) {
      URL.revokeObjectURL(entry.blobUrl);
      this.memory.delete(key);
    }
  }

  private async acquireSlot(): Promise<void> {
    if (this.active < MAX_CONCURRENT) {
      this.active++;
      return;
    }
    await new Promise<void>((r) => this.waiters.push(r));
    this.active++;
  }

  private releaseSlot(): void {
    this.active--;
    const next = this.waiters.shift();
    if (next) next();
  }

  private async fetchUrl(url: string): Promise<Blob | null> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ATTEMPT_TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        signal: controller.signal,
        credentials: url.startsWith("/") ? "same-origin" : "omit",
        cache: "force-cache",
      });
      if (!res.ok) return null;
      const blob = await res.blob();
      if (!blob.size || !blob.type.startsWith("image/")) return null;
      return blob;
    } catch {
      return null;
    } finally {
      clearTimeout(timer);
    }
  }

  private async loadCandidates(
    key: string,
    candidates: string[]
  ): Promise<string | null> {
    const cached = this.getCached(key);
    if (cached) return cached;

    const pending = this.inflight.get(key);
    if (pending) return pending;

    const promise = (async () => {
      const idbBlob = await idbGet(key);
      if (idbBlob) {
        const url = URL.createObjectURL(idbBlob);
        this.memory.set(key, { blobUrl: url, refs: 1 });
        return url;
      }

      for (const candidate of candidates) {
        await this.acquireSlot();
        try {
          const blob = await this.fetchUrl(candidate);
          if (blob) {
            void idbPut(key, blob);
            const url = URL.createObjectURL(blob);
            this.memory.set(key, { blobUrl: url, refs: 1 });
            return url;
          }
        } finally {
          this.releaseSlot();
        }
      }
      return null;
    })();

    this.inflight.set(key, promise);
    try {
      return await promise;
    } finally {
      this.inflight.delete(key);
    }
  }

  async fetchWiki(
    wiki: string,
    variant: MediaVariant,
    opts?: { silentRetry?: boolean }
  ): Promise<string | null> {
    const key = cacheKeyFor(wiki, variant);
    const hit = await this.loadCandidates(key, getImageCandidates(wiki, variant));
    if (hit || !opts?.silentRetry) return hit;

    // Background silent retry with smaller proxy only
    const small = getImageCandidates(wiki, variant).slice(-1);
    return this.loadCandidates(`${key}:retry`, small);
  }

  async fetchDirect(
    imageUrl: string,
    variant: MediaVariant,
    cacheKey?: string
  ): Promise<string | null> {
    const key = cacheKey ?? `direct:${imageUrl}:${variant}`;
    return this.loadCandidates(key, getDirectCandidates(imageUrl, variant));
  }

  /** Preload a single question image (non-blocking). */
  preloadQuestion(
    q: GameQuestion,
    variant: MediaVariant,
    priority: "high" | "low" = "low"
  ): void {
    if (q.emoji && !q.image) return;

    const wiki = wikiFromQuestionId(q.id);
    const run = async () => {
      if (q.image?.includes("flagcdn.com")) {
        await this.fetchDirect(q.image, variant, `flag:${q.id}`);
        return;
      }
      if (wiki) {
        await this.fetchWiki(wiki, variant);
      } else if (q.image?.startsWith("http")) {
        await this.fetchDirect(q.image, variant, `img:${q.id}`);
      }
    };

    if (priority === "high") {
      void run();
    } else {
      if (typeof requestIdleCallback !== "undefined") {
        requestIdleCallback(() => void run(), { timeout: 2000 });
      } else {
        setTimeout(() => void run(), 50);
      }
    }
  }

  /** Rolling buffer — preload current + next N questions. */
  preloadAhead(
    questions: GameQuestion[],
    currentIndex: number,
    variantFor: (q: GameQuestion) => MediaVariant,
    count = LOOKAHEAD
  ): void {
    for (let i = currentIndex; i < Math.min(questions.length, currentIndex + count); i++) {
      const q = questions[i];
      const variant = variantFor(q);
      const priority = i === currentIndex ? "high" : i <= currentIndex + 2 ? "high" : "low";
      this.preloadQuestion(q, variant, priority);
    }
  }

  /** Warm entire session on game entry. */
  warmSession(
    questions: GameQuestion[],
    variantFor: (q: GameQuestion) => MediaVariant
  ): void {
    this.preloadAhead(questions, 0, variantFor, Math.min(questions.length, 10));
  }
}

export const imagePipeline = new ImagePipeline();
