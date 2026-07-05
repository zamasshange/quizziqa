"use client";

import { useSearchParams } from "next/navigation";
import { GamePlayer } from "@/components/game/game-player";
import type { Game } from "@/lib/types";

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
