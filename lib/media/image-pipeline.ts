/**
 * Client image pipeline — delegates to Asset Manager.
 * @deprecated Import from @/lib/media/asset-manager directly.
 */
export {
  assetManager as imagePipeline,
  prepareAhead as preloadAhead,
  warmSession,
  loadFirst,
  preloadUrl,
  isUrlReady,
  firstReady,
  urlsForQuestion,
  cacheKeyForWiki,
} from "@/lib/media/asset-manager";

export function getCachedByKey(_key: string): string | null {
  return null;
}
