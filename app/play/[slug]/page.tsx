import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { GamePlayerLoader } from "@/components/game/game-player-loader";
import { GameJsonLd, BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { getGameBySlugAsync, getAllGameSlugs } from "@/lib/games/registry";
import { getCategoryById } from "@/lib/data/categories";
import { buildGameMetadata } from "@/lib/seo/metadata";
import { keywordsForGame } from "@/lib/seo/keywords";

export const dynamic = "force-static";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllGameSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameBySlugAsync(slug);
  if (!game) return { title: "Game Not Found" };
  return buildGameMetadata(
    slug,
    game.title,
    game.description,
    keywordsForGame(slug, game.title)
  );
}

export default async function PlayPage({ params }: Props) {
  const { slug } = await params;
  const game = await getGameBySlugAsync(slug);

  if (!game || game.questions.length === 0) notFound();

  const category = getCategoryById(game.categoryId);

  return (
    <AppShell playMode>
      <GameJsonLd
        name={game.title}
        description={game.description}
        slug={slug}
        category={category?.name}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Games", path: "/games" },
          ...(category
            ? [{ name: category.name, path: `/categories/${category.slug}` }]
            : []),
          { name: game.title, path: `/play/${slug}` },
        ]}
      />
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center min-h-[40dvh]">
            <div className="w-8 h-8 rounded-full border-[3px] border-black/10 border-t-btn-green animate-spin" />
          </div>
        }
      >
        <GamePlayerLoader
          game={game}
          categoryName={category?.name}
          categorySlug={category?.slug}
          categoryEmoji={category?.emoji}
        />
      </Suspense>
    </AppShell>
  );
}
