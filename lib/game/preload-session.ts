import type { GameQuestion } from "@/lib/types";
import { getMediaProxyUrl } from "@/lib/media/media-url";
import { getQuestionDirectImage, wikiFromQuestionId } from "@/lib/media/resolve-image";
import { preloadImages } from "@/lib/game/image-cache";

/** Warm same-origin proxy (matches fetch-based MediaImage loader). */
export function preloadSessionImages(questions: GameQuestion[]): void {
  const proxyUrls: string[] = [];
  const directUrls: string[] = [];

  for (const q of questions) {
    const wiki = wikiFromQuestionId(q.id);
    if (wiki) proxyUrls.push(getMediaProxyUrl(wiki));
    const direct = getQuestionDirectImage(q);
    if (direct) directUrls.push(direct);
  }

  // Fetch proxy URLs to warm server + browser cache (used first at display time)
  for (const url of proxyUrls) {
    void fetch(url, { cache: "force-cache" }).catch(() => {});
  }

  preloadImages(directUrls);
}

export function questionMediaUrl(q: GameQuestion): string | undefined {
  const wiki = wikiFromQuestionId(q.id);
  if (wiki) return getMediaProxyUrl(wiki);
  return getQuestionDirectImage(q);
}
