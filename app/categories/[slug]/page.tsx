import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { GameCard } from "@/components/games/game-card";
import { getCategoryBySlug, categories } from "@/lib/data/categories";
import { getGamesByCategoryId } from "@/lib/games/registry";
import { QuizButtonLink } from "@/components/ui/quiz-button";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return { title: "Category Not Found" };
  return { title: category.name, description: category.description };
}

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const categoryGames = getGamesByCategoryId(category.id);

  return (
    <AppShell>
      <div className="text-center space-y-2 mb-6">
        <div className="text-5xl">{category.emoji}</div>
        <h1 className="text-3xl font-black text-black">{category.name}</h1>
        <p className="text-sm font-bold text-black/60 max-w-md mx-auto">
          {category.description}
        </p>
        <p className="text-xs font-bold text-black/40">
          {categoryGames.length} games available
        </p>
      </div>

      {categoryGames.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryGames.map((game) => (
            <GameCard key={game.id} game={game} fullWidth />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">🚧</p>
          <p className="font-black text-black">Games coming soon!</p>
          <QuizButtonLink href="/categories" color="cyan" textColor="black" className="mt-4 inline-flex">
            Browse categories
          </QuizButtonLink>
        </div>
      )}
    </AppShell>
  );
}
