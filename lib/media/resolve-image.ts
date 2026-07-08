import { getMediaProxyUrl } from "@/lib/media/media-url";
import { gameTemplates } from "@/lib/games/templates";
import type { GameQuestion } from "@/lib/types";

const TEMPLATE_PREFIXES = gameTemplates
  .map((t) => t.id)
  .sort((a, b) => b.length - a.length);

const PORTRAIT_WIDTH = 520;

/**
 * Bake same-origin proxy URLs for Wikipedia entities.
 * The server resolves fresh image bytes — never stale 404 manifest links.
 */
export function resolveEntityImage(
  wiki: string,
  _answer: string,
  opts?: { flagUrl?: string }
): string | undefined {
  if (opts?.flagUrl) return opts.flagUrl;
  return getMediaProxyUrl(wiki, PORTRAIT_WIDTH);
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
  if (q.image?.includes("flagcdn.com") || q.image?.includes("image.tmdb.org")) {
    return q;
  }

  const wiki = wikiFromQuestionId(q.id);
  if (wiki) {
    return { ...q, image: getMediaProxyUrl(wiki, PORTRAIT_WIDTH) };
  }

  if (q.image?.startsWith("http") || q.image?.startsWith("/api/media")) {
    return q;
  }

  const fallbackWiki = q.answer.replace(/ /g, "_");
  return { ...q, image: getMediaProxyUrl(fallbackWiki, PORTRAIT_WIDTH) };
}

export function ensureQuestionImages(questions: GameQuestion[]): GameQuestion[] {
  return questions.map(ensureQuestionImage).filter((q) => q.image || q.emoji);
}

export function getQuestionDirectImage(q: GameQuestion): string | undefined {
  return q.image;
}
