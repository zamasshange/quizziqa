"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { GamePlayer } from "@/components/game/game-player";
import type { Game } from "@/lib/types";
import { ensureQuestionImages } from "@/lib/media/resolve-image";
import { inferMediaVariant } from "@/lib/media/images";
import { warmSessionImages } from "@/hooks/use-question-image";

interface Props {
  game: Game;
  categoryName?: string;
  categorySlug?: string;
  categoryEmoji?: string;
}

export function GamePlayerLoader({
  game,
  categoryName,
  categorySlug,
  categoryEmoji,
}: Props) {
  const searchParams = useSearchParams();
  const isDaily = searchParams.get("daily") === "true";

  // Start downloading images the moment the play page loads — before first question renders
  useEffect(() => {
    const questions = ensureQuestionImages(game.questions);
    warmSessionImages(questions, (q) =>
      inferMediaVariant(game.slug, game.mode, {
        hasImage: !!q.image,
        hasEmoji: !!q.emoji,
      })
    );
  }, [game]);

  return (
    <GamePlayer
      game={game}
      isDaily={isDaily}
      categoryName={categoryName}
      categorySlug={categorySlug}
      categoryEmoji={categoryEmoji}
    />
  );
}
