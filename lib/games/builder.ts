import type { Game, GameQuestion, Difficulty } from "@/lib/types";
import type { GameTemplate } from "@/lib/games/templates";
import type { EntityEntry } from "@/lib/data/entities";
import {
  fetchWikiEntities,
  fetchFlagImages,
} from "@/lib/wikipedia/client";
import { getFallbackImage } from "@/lib/media/fallback-images";

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

export async function buildGameFromTemplate(
  template: GameTemplate
): Promise<Game> {
  const count = template.questionCount ?? template.entities.length;
  const selected = shuffle(template.entities).slice(0, count);
  const wikiTitles = selected.map((e) => e.wiki);

  // Parallel: wiki data + optional flags
  const [wikiData, flagImages] = await Promise.all([
    fetchWikiEntities(wikiTitles),
    template.useFlags
      ? fetchFlagImages(selected.map((e) => ({ wiki: e.wiki, answer: e.answer })))
      : Promise.resolve(new Map()),
  ]);

  const allAnswers = selected.map(
    (e) => e.answer ?? e.wiki.replace(/_/g, " ")
  );

  const questions: GameQuestion[] = [];

  for (let i = 0; i < selected.length; i++) {
    const entity = selected[i];
    const wiki = wikiData.get(entity.wiki);
    const answer = entity.answer ?? entity.wiki.replace(/_/g, " ");
    const image =
      (template.useFlags ? flagImages.get(entity.wiki) : undefined) ??
      wiki?.image ??
      getFallbackImage(entity.wiki);

    if (!image && template.mode === "guess-from-image") continue;

    questions.push({
      id: `${template.id}-q${i}`,
      question: template.questionPrompt,
      answer,
      alternatives: pickAlternatives(answer, allAnswers),
      image,
      fact: wiki?.fact ?? `Learn more about ${answer} on Wikipedia.`,
      difficulty: difficultyForIndex(i, selected.length),
    });
  }

  if (questions.length < 3) {
    // Retry with more entities + fallback images — never ship image-less questions
    const extra = shuffle(template.entities).slice(0, 15);
    for (const entity of extra) {
      if (questions.length >= (template.questionCount ?? 8)) break;
      if (questions.some((q) => q.answer === (entity.answer ?? entity.wiki.replace(/_/g, " "))))
        continue;
      const wiki = wikiData.get(entity.wiki);
      const answer = entity.answer ?? entity.wiki.replace(/_/g, " ");
      const image = wiki?.image ?? getFallbackImage(entity.wiki);
      if (!image) continue;
      questions.push({
        id: `${template.id}-q${questions.length}`,
        question: template.questionPrompt,
        answer,
        alternatives: pickAlternatives(answer, allAnswers),
        image,
        fact: wiki?.fact ?? `Learn more about ${answer} on Wikipedia.`,
        difficulty: "medium",
      });
    }
  }

  return templateToGame(template, questions);
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
