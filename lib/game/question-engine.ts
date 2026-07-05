import type { GameQuestion } from "@/lib/types";

const HISTORY_KEY = "guess-everything-question-history";
const MAX_HISTORY_PER_GAME = 200;

export interface QuestionHistoryStore {
  [gameSlug: string]: string[];
}

function loadHistory(): QuestionHistoryStore {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as QuestionHistoryStore) : {};
  } catch {
    return {};
  }
}

function saveHistory(store: QuestionHistoryStore): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(store));
}

export function getRecentlyPlayed(gameSlug: string): Set<string> {
  const history = loadHistory();
  return new Set(history[gameSlug] ?? []);
}

export function recordSessionQuestions(
  gameSlug: string,
  questionIds: string[]
): void {
  if (questionIds.length === 0) return;
  const history = loadHistory();
  const existing = history[gameSlug] ?? [];
  const merged = [...questionIds, ...existing.filter((id) => !questionIds.includes(id))];
  history[gameSlug] = merged.slice(0, MAX_HISTORY_PER_GAME);
  saveHistory(history);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Build a session queue: prioritize unseen questions, never repeat within session.
 */
export function buildSessionQueue(
  pool: GameQuestion[],
  gameSlug: string,
  count: number
): GameQuestion[] {
  if (pool.length === 0) return [];
  const sessionCount = Math.min(count, pool.length);
  const recentlyPlayed = getRecentlyPlayed(gameSlug);

  const unseen = shuffle(pool.filter((q) => !recentlyPlayed.has(q.id)));
  const seen = shuffle(pool.filter((q) => recentlyPlayed.has(q.id)));

  const queue: GameQuestion[] = [];
  const used = new Set<string>();

  for (const q of [...unseen, ...seen]) {
    if (queue.length >= sessionCount) break;
    if (used.has(q.id)) continue;
    used.add(q.id);
    queue.push(q);
  }

  return queue;
}

export function shuffleOptions(
  question: GameQuestion,
  allAnswers: string[],
  hideWrong = 0
): string[] {
  const distractors = shuffle(
    allAnswers.filter((a) => a.toLowerCase() !== question.answer.toLowerCase())
  );
  const wrongCount = hideWrong > 0 ? Math.max(1, 4 - hideWrong) : 3;
  const wrong = distractors.slice(0, wrongCount);
  return shuffle([question.answer, ...wrong]);
}

export function getAnswerPool(questions: GameQuestion[]): string[] {
  return [...new Set(questions.map((q) => q.answer))];
}
