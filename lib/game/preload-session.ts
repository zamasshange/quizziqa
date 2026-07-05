import type { GameQuestion } from "@/lib/types";
import { getMediaProxyUrl } from "@/lib/media/media-url";
import { getQuestionDirectImage, wikiFromQuestionId } from "@/lib/media/resolve-image";
import { preloadImageLink, preloadImages } from "@/lib/game/image-cache";

/** Resolve the best URL for preloading a question image (direct CDN first). */
export function questionMediaUrl(q: GameQuestion): string | undefined {
  const direct = getQuestionDirectImage(q);
  if (direct) return direct;
  const wiki = wikiFromQuestionId(q.id);
  if (wiki) return getMediaProxyUrl(wiki);
  if (q.image?.startsWith("http") || q.image?.startsWith("/api/media")) {
    return q.image;
  }
  return undefined;
}

/** Preload session images — direct CDN URLs first, then proxy fallback. */
export function preloadSessionImages(questions: GameQuestion[]): void {
  const urls = new Set<string>();
  for (const q of questions) {
    const direct = getQuestionDirectImage(q);
    if (direct) urls.add(direct);
    const wiki = wikiFromQuestionId(q.id);
    if (wiki) urls.add(getMediaProxyUrl(wiki));
    else if (q.image) urls.add(q.image);
  }
  const list = [...urls];
  preloadImages(list);
  list.slice(0, 5).forEach((url) => preloadImageLink(url));
}
