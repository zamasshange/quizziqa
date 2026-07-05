import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { GamePlayerLoader } from "@/components/game/game-player-loader";
import { getGameBySlugAsync, getAllGameSlugs } from "@/lib/games/registry";
import { getCategoryById } from "@/lib/data/categories";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ daily?: string }>;
}

export async function generateStaticParams() {
  return getAllGameSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const game = await getGameBySlugAsync(slug);
  if (!game) return { title: "Game Not Found" };
  return { title: game.title, description: game.description };
}

export default async function PlayPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { daily } = await searchParams;
  const game = await getGameBySlugAsync(slug);

  if (!game || game.questions.length === 0) notFound();

  const category = getCategoryById(game.categoryId);
  const isDaily = daily === "true";

  return (
    <AppShell playMode>
      <GamePlayerLoader
        game={game}
        isDaily={isDaily}
        categoryName={category?.name}
        categorySlug={category?.slug}
        categoryEmoji={category?.emoji}
      />
    </AppShell>
  );
}
