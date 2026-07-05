import type { GameQuestion } from "@/lib/types";
import { getMediaProxyUrl } from "@/lib/media/media-url";
import { wikiFromQuestionId } from "@/lib/media/resolve-image";
import { preloadImageLink, preloadImages } from "@/lib/game/image-cache";

/** Resolve the best same-origin URL for preloading a question image. */
export function questionMediaUrl(q: GameQuestion): string | undefined {
  const wiki = wikiFromQuestionId(q.id);
  if (wiki) return getMediaProxyUrl(wiki);
  if (q.image?.startsWith("/api/media")) return q.image;
  if (q.image?.startsWith("http")) return q.image;
  return undefined;
}

/** Preload all session images in parallel — warms CDN + server cache. */
export function preloadSessionImages(questions: GameQuestion[]): void {
  const urls = questions.map(questionMediaUrl).filter(Boolean) as string[];
  preloadImages(urls);
  urls.slice(0, 3).forEach((url) => preloadImageLink(url));
}
