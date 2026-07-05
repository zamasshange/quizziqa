import { fallbackImages } from "@/lib/media/fallback-images";
import { entityImages } from "@/lib/media/entity-images";
import { getFlagUrl } from "@/lib/media/images";
import { gameTemplates } from "@/lib/games/templates";
import type { GameQuestion } from "@/lib/types";

const TEMPLATE_PREFIXES = gameTemplates
  .map((t) => t.id)
  .sort((a, b) => b.length - a.length);

/** Resolve the best image URL — curated fallbacks first, then Wikipedia. */
export function resolveEntityImage(
  wiki: string,
  answer: string,
  opts?: { wikiImage?: string; flagUrl?: string }
): string | undefined {
  return (
    entityImages[wiki] ??
    fallbackImages[wiki] ??
    opts?.flagUrl ??
    (getFlagUrl(answer) || undefined) ??
    opts?.wikiImage
  );
}

/** Extract wiki key from question id like "guess-phone-IPhone" */
export function wikiFromQuestionId(id: string): string | undefined {
  for (const prefix of TEMPLATE_PREFIXES) {
    const marker = `${prefix}-`;
    if (id.startsWith(marker)) {
      return id.slice(marker.length);
    }
  }
  return undefined;
}

/** Guarantee every question uses a reliable image URL when possible. */
export function ensureQuestionImage(q: GameQuestion): GameQuestion {
  if (q.emoji && !q.image) return q;

  const wiki = wikiFromQuestionId(q.id) ?? q.answer.replace(/ /g, "_");
  const resolved = resolveEntityImage(wiki, q.answer, { wikiImage: q.image });
  if (resolved) return { ...q, image: resolved };
  return q;
}

export function ensureQuestionImages(questions: GameQuestion[]): GameQuestion[] {
  return questions.map(ensureQuestionImage).filter((q) => q.image || q.emoji);
}
