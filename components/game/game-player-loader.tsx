import { GamePlayer } from "@/components/game/game-player";
import type { Game } from "@/lib/types";

interface Props {
  game: Game;
  isDaily?: boolean;
  categoryName?: string;
  categorySlug?: string;
  categoryEmoji?: string;
}

export function GamePlayerLoader({
  game,
  isDaily,
  categoryName,
  categorySlug,
  categoryEmoji,
}: Props) {
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
