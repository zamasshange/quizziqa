import { unstable_cache } from "next/cache";
import type { Game, GameMeta, GameMode } from "@/lib/types";
import { games as staticGames, getGameBySlug as getStaticGame } from "@/lib/data/games";
import { gameTemplates, getTemplateBySlug } from "@/lib/games/templates";
import { buildGameFromTemplate } from "@/lib/games/builder";
import { ensureQuestionImages } from "@/lib/media/resolve-image";

/** Legacy slugs → Wikipedia-powered replacements */
const SLUG_ALIASES: Record<string, string> = {
  "world-flags": "guess-the-flag",
  "guess-the-animal": "guess-the-animal-wiki",
  "famous-landmarks": "guess-the-landmark",
  "brand-logos": "guess-the-brand",
  "planets-quiz": "guess-the-planet",
  "car-silhouettes": "guess-the-car",
};

const getCachedDynamicGame = unstable_cache(
  async (slug: string): Promise<Game | null> => {
    const template = getTemplateBySlug(slug);
    if (!template) return null;
    return buildGameFromTemplate(template);
  },
  ["dynamic-game-v15"],
  { revalidate: 86400, tags: ["wikipedia-games"] }
);

export async function getGameBySlugAsync(slug: string): Promise<Game | null> {
  const resolved = SLUG_ALIASES[slug] ?? slug;
  const legacyStatic = SLUG_ALIASES[slug] ? getStaticGame(slug) : undefined;

  const template = getTemplateBySlug(resolved);
  if (template) {
    const game = await getCachedDynamicGame(resolved);
    if (!game) return null;
    const withImages = {
      ...game,
      questions: ensureQuestionImages(game.questions),
    };
    if (legacyStatic) {
      return {
        ...withImages,
        slug: legacyStatic.slug,
        title: legacyStatic.title,
        id: legacyStatic.id,
        featured: legacyStatic.featured ?? game.featured,
        trending: legacyStatic.trending ?? game.trending,
      };
    }
    return withImages;
  }

  const staticGame = getStaticGame(slug);
  if (staticGame) return staticGame;

  return null;
}

export function getAllGameSlugs(): string[] {
  const staticSlugs = staticGames.map((g) => g.slug);
  const dynamicSlugs = gameTemplates.map((t) => t.slug);
  return [...new Set([...staticSlugs, ...dynamicSlugs])];
}

export function getDynamicTemplates() {
  return gameTemplates;
}

/** Featured & trending games first for homepage display */
export function getSortedDynamicTemplates() {
  return [...gameTemplates].sort((a, b) => {
    const score = (t: typeof a) =>
      (t.featured ? 4 : 0) + (t.trending ? 2 : 0) + (t.isNew ? 1 : 0);
    return score(b) - score(a);
  });
}

type GameListMeta = GameMeta & { mode?: GameMode };

export function getAllGamesMetadata(): GameListMeta[] {
  const aliasSources = new Set(Object.keys(SLUG_ALIASES));
  const dynamicMeta = gameTemplates.map((t) => ({
    id: t.id,
    slug: t.slug,
    title: t.title,
    description: t.description,
    categoryId: t.categoryId,
    difficulty: t.difficulty,
    xpReward: t.xpReward,
    featured: t.featured,
    trending: t.trending,
    isNew: t.isNew,
    mode: t.mode,
  }));

  const staticMeta = staticGames
    .filter((g) => !aliasSources.has(g.slug))
    .map((g) => ({
      id: g.id,
      slug: g.slug,
      title: g.title,
      description: g.description,
      categoryId: g.categoryId,
      difficulty: g.difficulty,
      xpReward: g.xpReward,
      featured: g.featured,
      trending: g.trending,
      isNew: g.isNew,
      mode: g.mode,
    }));

  const aliasedMeta: GameListMeta[] = Object.entries(SLUG_ALIASES).flatMap(
    ([legacySlug, dynamicSlug]) => {
      const template = getTemplateBySlug(dynamicSlug);
      const legacy = staticGames.find((g) => g.slug === legacySlug);
      if (!template) return [];
      return [
        {
          id: legacy?.id ?? template.id,
          slug: legacySlug,
          title: legacy?.title ?? template.title,
          description: legacy?.description ?? template.description,
          categoryId: template.categoryId,
          difficulty: template.difficulty,
          xpReward: template.xpReward,
          featured: legacy?.featured ?? template.featured,
          trending: legacy?.trending ?? template.trending,
          isNew: template.isNew,
          mode: template.mode,
        },
      ];
    }
  );

  return [...staticMeta, ...aliasedMeta, ...dynamicMeta.filter(
    (d) => !Object.values(SLUG_ALIASES).includes(d.slug)
  )];
}

export function getGamesByCategoryId(categoryId: string): GameListMeta[] {
  return getAllGamesMetadata().filter((g) => g.categoryId === categoryId);
}

export function getFeaturedGamesMeta(): GameListMeta[] {
  return getAllGamesMetadata().filter((g) => g.featured);
}

export function getTrendingGamesMeta(): GameListMeta[] {
  return getAllGamesMetadata().filter((g) => g.trending);
}

export function getNewGamesMeta(): GameListMeta[] {
  return getAllGamesMetadata().filter((g) => g.isNew);
}
