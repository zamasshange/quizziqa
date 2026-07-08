"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { GamePlayer } from "@/components/game/game-player";
import type { Game } from "@/lib/types";
import { ensureQuestionImages } from "@/lib/media/resolve-image";
import { inferMediaVariant } from "@/lib/media/images";
import { warmSession } from "@/lib/media/asset-manager";
import { prioritizeCategory } from "@/lib/game/background-worker";

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
    prioritizeCategory(game.slug);
    const questions = ensureQuestionImages(game.questions);
    warmSession(questions, (q) =>
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
