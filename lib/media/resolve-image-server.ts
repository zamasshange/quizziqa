import { getManifestImage } from "@/lib/media/image-manifest";
import { getCachedWikiImageUrl } from "@/lib/media/fetch-wiki-image";

/** Resolve image URL — manifest (instant) then live Wikipedia lookup. */
export async function resolveImageForWiki(wiki: string): Promise<string | null> {
  const fromManifest = getManifestImage(wiki);
  if (fromManifest) return fromManifest;
  return getCachedWikiImageUrl(wiki);
}
