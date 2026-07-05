import { AppShell } from "@/components/layout/app-shell";
import { GameCard } from "@/components/games/game-card";
import { getSortedDynamicTemplates } from "@/lib/games/registry";

export default function AllGamesPage() {
  const games = getSortedDynamicTemplates();

  return (
    <AppShell>
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-black text-black">Guess the…</h1>
        <p className="text-sm font-bold text-black/60 mt-1">
          {games.length} Wikipedia-powered guessing games
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 pb-8">
        {games.map((game) => (
          <GameCard
            key={game.id}
            grid
            game={{
              id: game.id,
              slug: game.slug,
              title: game.title,
              description: game.description,
              categoryId: game.categoryId,
              difficulty: game.difficulty,
              xpReward: game.xpReward,
              featured: game.featured,
              trending: game.trending,
              isNew: game.isNew,
              timeLimit: game.timeLimit,
              mode: game.mode,
            }}
          />
        ))}
      </div>
    </AppShell>
  );
}
