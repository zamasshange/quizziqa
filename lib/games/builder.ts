import type { Game, GameQuestion, Difficulty } from "@/lib/types";
import type { GameTemplate } from "@/lib/games/templates";
import type { EntityEntry } from "@/lib/data/entities";
import {
  fetchWikiEntities,
  fetchFlagImages,
} from "@/lib/wikipedia/client";
import { getFallbackImage } from "@/lib/media/fallback-images";
import { getFlagUrl } from "@/lib/media/images";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickAlternatives(
  answer: string,
  pool: string[],
  count = 3
): string[] {
  const others = pool.filter(
    (a) => a.toLowerCase() !== answer.toLowerCase()
  );
  return shuffle(others).slice(0, count);
}

function difficultyForIndex(i: number, total: number): Difficulty {
  const ratio = i / total;
  if (ratio < 0.3) return "easy";
  if (ratio < 0.6) return "medium";
  if (ratio < 0.85) return "hard";
  return "expert";
}

export async function buildFullQuestionPool(
  template: GameTemplate
): Promise<GameQuestion[]> {
  return buildQuestionsFromEntities(template, template.entities);
}

export async function buildGameFromTemplate(
  template: GameTemplate
): Promise<Game> {
  const count = template.questionCount ?? template.entities.length;
  const pool = await buildFullQuestionPool(template);
  const questions = shuffle(pool).slice(0, count);
  return templateToGame(template, questions);
}

async function buildQuestionsFromEntities(
  template: GameTemplate,
  entities: EntityEntry[]
): Promise<GameQuestion[]> {
  const wikiTitles = entities.map((e) => e.wiki);

  const [wikiData, flagImages] = await Promise.all([
    fetchWikiEntities(wikiTitles),
    template.useFlags
      ? fetchFlagImages(entities.map((e) => ({ wiki: e.wiki, answer: e.answer })))
      : Promise.resolve(new Map()),
  ]);

  const allAnswers = entities.map(
    (e) => e.answer ?? e.wiki.replace(/_/g, " ")
  );

  const questions: GameQuestion[] = [];

  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];
    const wiki = wikiData.get(entity.wiki);
    const answer = entity.answer ?? entity.wiki.replace(/_/g, " ");
    const flagUrl = template.useFlags ? getFlagUrl(answer) || getFlagUrl(entity.wiki.replace(/_/g, " ")) : "";
    const image =
      (template.useFlags ? flagImages.get(entity.wiki) || flagUrl || undefined : undefined) ??
      wiki?.image ??
      getFallbackImage(entity.wiki);

    if (!image && template.mode === "guess-from-image") continue;

    questions.push({
      id: `${template.id}-${entity.wiki}`,
      question: template.questionPrompt,
      answer,
      alternatives: pickAlternatives(answer, allAnswers),
      image,
      fact: wiki?.fact ?? `Learn more about ${answer} on Wikipedia.`,
      difficulty: difficultyForIndex(i, entities.length),
    });
  }

  return questions;
}

function templateToGame(template: GameTemplate, questions: GameQuestion[]): Game {
  return {
    id: template.id,
    slug: template.slug,
    title: template.title,
    description: template.description,
    categoryId: template.categoryId,
    mode: template.mode,
    difficulty: template.difficulty,
    questions,
    xpReward: template.xpReward,
    timeLimit: template.timeLimit,
    maxHints: template.maxHints,
    maxSkips: template.maxSkips,
    featured: template.featured,
    trending: template.trending,
    isNew: template.isNew,
  };
}
