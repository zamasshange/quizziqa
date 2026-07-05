import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { GamePlayerLoader } from "@/components/game/game-player-loader";
import { getGameBySlugAsync, getAllGameSlugs } from "@/lib/games/registry";
import { getCategoryById } from "@/lib/data/categories";

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
  return { title: game.title, description: game.description };
}

export default async function PlayPage({ params }: Props) {
  const { slug } = await params;
  const game = await getGameBySlugAsync(slug);

  if (!game || game.questions.length === 0) notFound();

  const category = getCategoryById(game.categoryId);

  return (
    <AppShell playMode>
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
