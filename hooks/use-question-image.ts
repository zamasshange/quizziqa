"use client";

import type { MediaVariant } from "@/lib/media/images";
import type { GameQuestion } from "@/lib/types";
import { wikiFromQuestionId } from "@/lib/media/resolve-image";
import { prepareAhead, warmSession } from "@/lib/media/asset-manager";
import { BUFFER_AHEAD } from "@/lib/game/preload-config";

export function preloadQuestions(
  questions: GameQuestion[],
  startIndex: number,
  variantFor: (q: GameQuestion) => MediaVariant,
  count = BUFFER_AHEAD
): void {
  prepareAhead(questions, startIndex, variantFor, count);
}

export function warmSessionImages(
  questions: GameQuestion[],
  variantFor: (q: GameQuestion) => MediaVariant
): void {
  warmSession(questions, variantFor);
}

export { wikiFromQuestionId };
