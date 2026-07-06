"use client";

import type { MediaVariant } from "@/lib/media/images";
import type { GameQuestion } from "@/lib/types";
import { wikiFromQuestionId } from "@/lib/media/resolve-image";
import { preloadAhead, warmSession } from "@/lib/media/image-pipeline";

export function preloadQuestions(
  questions: GameQuestion[],
  startIndex: number,
  variantFor: (q: GameQuestion) => MediaVariant,
  count = 8
): void {
  preloadAhead(questions, startIndex, variantFor, count);
}

export function warmSessionImages(
  questions: GameQuestion[],
  variantFor: (q: GameQuestion) => MediaVariant
): void {
  warmSession(questions, variantFor);
}

export { wikiFromQuestionId };
