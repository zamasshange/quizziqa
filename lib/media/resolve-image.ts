import { getMediaProxyUrl } from "@/lib/media/media-url";
import { getStaticImageUrl } from "@/lib/media/wikimedia-resolve";
import { gameTemplates } from "@/lib/games/templates";
import type { GameQuestion } from "@/lib/types";

const TEMPLATE_PREFIXES = gameTemplates
  .map((t) => t.id)
  .sort((a, b) => b.length - a.length);

/**
 * Prefer direct upload.wikimedia.org URLs baked into questions at build time.
 * Proxy URL is used client-side as fallback via wikiKey.
 */
export function resolveEntityImage(
  wiki: string,
  _answer: string,
  opts?: { flagUrl?: string }
): string | undefined {
  if (opts?.flagUrl) return opts.flagUrl;
  const direct = getStaticImageUrl(wiki);
  if (direct) return direct;
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
    (q.image.includes("flagcdn.com") ||
      q.image.startsWith("https://upload.wikimedia.org/") ||
      q.image.startsWith("http"))
  ) {
    return q;
  }

  const wiki = wikiFromQuestionId(q.id) ?? q.answer.replace(/ /g, "_");
  const direct = getStaticImageUrl(wiki);
  if (direct) return { ...q, image: direct };

  return { ...q, image: getMediaProxyUrl(wiki) };
}

export function ensureQuestionImages(questions: GameQuestion[]): GameQuestion[] {
  return questions.map(ensureQuestionImage).filter((q) => q.image || q.emoji);
}

export function getQuestionDirectImage(q: GameQuestion): string | undefined {
  if (q.image?.startsWith("http")) return q.image;
  const wiki = wikiFromQuestionId(q.id);
  if (wiki) return getStaticImageUrl(wiki);
  return undefined;
}
