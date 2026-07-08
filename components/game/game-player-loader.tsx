"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { GamePlayer } from "@/components/game/game-player";
import type { Game } from "@/lib/types";
import { ensureQuestionImages } from "@/lib/media/resolve-image";
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

  useEffect(() => {
    const questions = ensureQuestionImages(game.questions);
    warmSessionImages(questions, () => "portrait");
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
