import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { GameCard } from "@/components/games/game-card";
import { getCollectionBySlug, collections } from "@/lib/data/collections";
import { getGameById } from "@/lib/data/games";
import { QuizButtonLink } from "@/components/ui/quiz-button";
import { buildPageMetadata } from "@/lib/seo/metadata";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) return { title: "Collection Not Found" };
  return buildPageMetadata({
    title: `${collection.title} – Quiz Collection`,
    description: `${collection.description} Play free guessing games in this Quizzical collection.`,
    path: `/collections/${slug}`,
    keywords: [collection.title.toLowerCase(), "quiz collection", "quizzical"],
  });
}

export default async function CollectionDetailPage({ params }: Props) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();

  const collectionGames = collection.gameIds
    .map((id) => getGameById(id))
    .filter(Boolean);

  return (
    <AppShell>
      <div className="text-center space-y-2 mb-6">
        <div className="text-5xl">{collection.emoji}</div>
        <h1 className="text-3xl font-black text-black">{collection.title}</h1>
        <p className="text-sm font-bold text-black/60 max-w-md mx-auto">
          {collection.description}
        </p>
      </div>

      {collectionGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {collectionGames.map((game) =>
            game ? <GameCard key={game.id} game={game} fullWidth /> : null
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">🚧</p>
          <p className="font-black">Games coming soon!</p>
          <QuizButtonLink href="/collections" color="cyan" textColor="black" className="mt-4 inline-flex">
            Browse collections
          </QuizButtonLink>
        </div>
      )}
    </AppShell>
  );
}
