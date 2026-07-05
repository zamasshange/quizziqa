import { getMediaProxyUrl } from "@/lib/media/media-url";
import { gameTemplates } from "@/lib/games/templates";
import type { GameQuestion } from "@/lib/types";

const TEMPLATE_PREFIXES = gameTemplates
  .map((t) => t.id)
  .sort((a, b) => b.length - a.length);

/**
 * All wiki images load via same-origin /api/media — avoids Wikimedia hotlink blocks on mobile.
 * Flags keep flagcdn direct URLs (reliable CDN).
 */
export function resolveEntityImage(
  wiki: string,
  _answer: string,
  opts?: { flagUrl?: string }
): string | undefined {
  if (opts?.flagUrl) return opts.flagUrl;
  return getMediaProxyUrl(wiki);
}

export function wikiFromQuestionId(id: string): string | undefined {
  for (const prefix of TEMPLATE_PREFIXES) {
    const marker = `${prefix}-`;
    if (id.startsWith(marker)) {
      return id.slice(marker.length);
    }
  }
  return undefined;
}

export function ensureQuestionImage(q: GameQuestion): GameQuestion {
  if (q.emoji && !q.image) return q;
  if (
    q.image &&
    (q.image.includes("flagcdn.com") || q.image.includes("unsplash.com"))
  ) {
    return q;
  }

  const wiki = wikiFromQuestionId(q.id) ?? q.answer.replace(/ /g, "_");
  const resolved = resolveEntityImage(wiki, q.answer);
  if (resolved) return { ...q, image: resolved };
  return q;
}

export function ensureQuestionImages(questions: GameQuestion[]): GameQuestion[] {
  return questions.map(ensureQuestionImage).filter((q) => q.image || q.emoji);
}
