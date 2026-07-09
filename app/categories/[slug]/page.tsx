import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { GameCard } from "@/components/games/game-card";
import { getCategoryBySlug, categories } from "@/lib/data/categories";
import { getGamesByCategoryId } from "@/lib/games/registry";
import { QuizButtonLink } from "@/components/ui/quiz-button";
import { buildCategoryMetadata } from "@/lib/seo/metadata";
import { keywordsForCategory } from "@/lib/seo/keywords";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";

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
  return buildCategoryMetadata(
    slug,
    category.name,
    category.description,
    keywordsForCategory(slug, category.name)
  );
}

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const categoryGames = getGamesByCategoryId(category.id);

  return (
    <AppShell>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Categories", path: "/categories" },
          { name: category.name, path: `/categories/${slug}` },
        ]}
      />
      <div className="text-center space-y-2 mb-6">
        <div className="text-5xl">{category.emoji}</div>
        <h1 className="text-3xl font-black text-black">{category.name} Quiz Games</h1>
        <p className="text-sm font-bold text-black/60 max-w-md mx-auto">
          {category.description}
        </p>
        <p className="text-xs font-bold text-black/40">
          {categoryGames.length} free games available
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
