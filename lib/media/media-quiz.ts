import { films, tvShows } from "@/lib/data/entities";

const MEDIA_QUIZ_WIKIS = new Set([
  ...films.map((f) => f.wiki),
  ...tvShows.map((t) => t.wiki),
]);

export function isMediaQuizWiki(wiki: string): boolean {
  return MEDIA_QUIZ_WIKIS.has(wiki);
}
