/**
 * Question Buffer — maintains a rolling window of prepared questions.
 * Gameplay never waits on Wikipedia; assets are prepared ahead of the player.
 */
import type { GameQuestion } from "@/lib/types";
import type { MediaVariant } from "@/lib/media/images";
import { ensureQuestionImages } from "@/lib/media/resolve-image";
import {
  buildSessionQueue,
  getAnswerPool,
  recordSessionQuestions,
} from "@/lib/game/question-engine";
import { preloadAhead, warmSession } from "@/lib/media/image-pipeline";
import { idbGetQuestions, idbPutQuestions } from "@/lib/cache/idb-store";
import {
  BUFFER_AHEAD,
  POOL_FETCH_MARGIN,
} from "@/lib/game/preload-config";

export type QuestionPrepState = "pending" | "downloading" | "ready";

export interface BufferedQuestion {
  question: GameQuestion;
  state: QuestionPrepState;
}

type Listener = () => void;

function poolCacheKey(slug: string): string {
  return `pool:${slug}`;
}

export class QuestionBuffer {
  private slug: string;
  private pool: GameQuestion[] = [];
  private session: GameQuestion[] = [];
  private currentIndex = 0;
  private sessionCount: number;
  private variantFor: (q: GameQuestion) => MediaVariant;
  private prepState = new Map<string, QuestionPrepState>();
  private listeners = new Set<Listener>();
  private poolLoaded = false;
  private poolLoading = false;

  constructor(
    slug: string,
    sessionCount: number,
    variantFor: (q: GameQuestion) => MediaVariant
  ) {
    this.slug = slug;
    this.sessionCount = sessionCount;
    this.variantFor = variantFor;
  }

  subscribe(cb: Listener): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private emit(): void {
    this.listeners.forEach((cb) => cb());
  }

  private markState(id: string, state: QuestionPrepState): void {
    this.prepState.set(id, state);
  }

  private prepareRange(start: number, count: number): void {
    preloadAhead(this.session, start, this.variantFor, count);
  }

  private syncAnswerPool(): void {
    this._answerPool = getAnswerPool(this.pool);
  }

  private _answerPool: string[] = [];

  init(ssrQuestions: GameQuestion[]): void {
    const pool = ensureQuestionImages(ssrQuestions);
    this.pool = pool;
    this.syncAnswerPool();
    this.session = buildSessionQueue(pool, this.slug, this.sessionCount);
    this.currentIndex = 0;
    for (const q of this.session) this.markState(q.id, "ready");
    this.emit();
  }

  /** Client-only: warm images and fetch full pool in background. */
  prepareAssets(): void {
    warmSession(this.session, this.variantFor);
    this.prepareRange(0, Math.min(BUFFER_AHEAD, this.session.length));
    void this.loadFullPool();
  }

  async loadFullPool(): Promise<void> {
    if (this.poolLoaded || this.poolLoading) return;
    this.poolLoading = true;

    try {
      let source: GameQuestion[] | null = null;

      const cached = await idbGetQuestions<GameQuestion[]>(poolCacheKey(this.slug));
      if (cached?.length) {
        source = cached;
      }

      const res = await fetch(
        `/api/games/${this.slug}/session?count=${this.sessionCount + POOL_FETCH_MARGIN}`
      );
      if (res.ok) {
        const data = await res.json();
        const fetched = ensureQuestionImages(data.questions ?? []);
        if (fetched.length) {
          source = fetched;
          await idbPutQuestions(poolCacheKey(this.slug), fetched);
        }
      }

      if (source?.length) {
        this.mergePool(source);
        this.poolLoaded = true;
      }
    } catch {
      /* keep SSR pool */
    } finally {
      this.poolLoading = false;
    }
  }

  /** Merge full pool without resetting player position. */
  private mergePool(source: GameQuestion[]): void {
    const prevLen = this.pool.length;
    const prevSessionLen = this.session.length;
    const existingIds = new Set(this.pool.map((q) => q.id));
    const merged = [...this.pool];
    for (const q of source) {
      if (!existingIds.has(q.id)) merged.push(q);
    }
    this.pool = merged;
    if (merged.length !== prevLen) this.syncAnswerPool();

    const playedIds = new Set(this.session.slice(0, this.currentIndex).map((q) => q.id));
    const tail = this.session.slice(this.currentIndex + 1);
    const needed = this.sessionCount - (this.currentIndex + 1 + tail.length);
    if (needed > 0) {
      const candidates = buildSessionQueue(
        merged.filter((q) => !playedIds.has(q.id) && !tail.some((t) => t.id === q.id)),
        this.slug,
        needed + tail.length
      );
      const extension = candidates.filter(
        (q) => !tail.some((t) => t.id === q.id) && q.id !== this.session[this.currentIndex]?.id
      );
      this.session = [
        ...this.session.slice(0, this.currentIndex + 1),
        ...tail,
        ...extension.slice(0, needed),
      ];
    }

    this.prepareRange(
      this.currentIndex,
      Math.min(BUFFER_AHEAD, this.session.length - this.currentIndex)
    );

    if (merged.length !== prevLen || this.session.length !== prevSessionLen) {
      this.emit();
    }
  }

  rebuildSession(count: number): void {
    this.sessionCount = count;
    const source = this.pool.length > 0 ? this.pool : [];
    this.session = buildSessionQueue(source, this.slug, count);
    this.currentIndex = 0;
    for (const q of this.session) this.markState(q.id, "ready");
    this.emit();
  }

  get current(): GameQuestion | null {
    return this.session[this.currentIndex] ?? null;
  }

  get index(): number {
    return this.currentIndex;
  }

  get questions(): GameQuestion[] {
    return this.session;
  }

  get fullPool(): GameQuestion[] {
    return this.pool;
  }

  get answerPool(): string[] {
    return this._answerPool;
  }

  get isReady(): boolean {
    const q = this.current;
    if (!q) return false;
    if (q.emoji && !q.image) return true;
    return this.prepState.get(q.id) !== "pending";
  }

  peek(n: number): BufferedQuestion[] {
    return this.session
      .slice(this.currentIndex, this.currentIndex + n)
      .map((question) => ({
        question,
        state: this.prepState.get(question.id) ?? "pending",
      }));
  }

  advance(): boolean {
    if (this.currentIndex + 1 >= this.session.length) return false;
    this.currentIndex++;
    const aheadStart = this.currentIndex;
    this.prepareRange(
      aheadStart,
      Math.min(BUFFER_AHEAD, this.session.length - aheadStart)
    );

    const extendAt = this.session.length - 5;
    if (this.currentIndex >= extendAt && this.pool.length > this.session.length) {
      const extra = buildSessionQueue(
        this.pool.filter((q) => !this.session.some((s) => s.id === q.id)),
        this.slug,
        3
      );
      if (extra.length) {
        this.session = [...this.session, ...extra];
        this.prepareRange(this.session.length - extra.length, extra.length);
      }
    }
    this.emit();
    return true;
  }

  finishSession(): void {
    recordSessionQuestions(
      this.slug,
      this.session.map((q) => q.id)
    );
  }

  isFinished(): boolean {
    return this.currentIndex + 1 >= this.session.length;
  }
}
