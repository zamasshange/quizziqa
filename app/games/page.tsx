import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { GameCard } from "@/components/games/game-card";
import { getSortedDynamicTemplates } from "@/lib/games/registry";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "All Guessing Games – Guess the Celebrity, Flag, Movie & More",
  description:
    "Play every Quizzical guessing game free online. Guess the celebrity, flag, president, movie, animal, car, landmark, and more. Picture quizzes powered by Wikipedia.",
  path: "/games",
  keywords: [
    "guess the celebrity",
    "guess the flag",
    "guess the movie",
    "guess the president",
    "guessing games list",
    "free quiz games",
    "quizzical games",
  ],
});

export default function AllGamesPage() {
  const games = getSortedDynamicTemplates();

  return (
    <AppShell>
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-black text-black">All Guessing Games</h1>
        <p className="text-sm font-bold text-black/60 mt-1">
          {games.length} free picture quiz games on Quizzical
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 pb-8">
        {games.map((game) => (
          <GameCard
            key={game.id}
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
            }}
            grid
          />
        ))}
      </div>
    </AppShell>
  );
}
