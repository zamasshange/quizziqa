import { getManifestImage } from "@/lib/media/image-manifest";
import { getFlagUrl } from "@/lib/media/images";
import { getMediaProxyUrl } from "@/lib/media/media-url";
import { gameTemplates } from "@/lib/games/templates";
import type { GameQuestion } from "@/lib/types";

const TEMPLATE_PREFIXES = gameTemplates
  .map((t) => t.id)
  .sort((a, b) => b.length - a.length);

/** Best image URL — verified manifest first, then same-origin proxy fallback. */
export function resolveEntityImage(
  wiki: string,
  _answer: string,
  opts?: { flagUrl?: string }
): string | undefined {
  if (opts?.flagUrl) return opts.flagUrl;
  return getManifestImage(wiki) ?? getMediaProxyUrl(wiki);
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

/** Always attach the best known image URL for a question. */
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
  if (resolved && resolved !== q.image) return { ...q, image: resolved };
  if (resolved) return q;
  return q;
}

export function ensureQuestionImages(questions: GameQuestion[]): GameQuestion[] {
  return questions.map(ensureQuestionImage).filter((q) => q.image || q.emoji);
}

export { getManifestImage };
