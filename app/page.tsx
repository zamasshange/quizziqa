import { AppShell } from "@/components/layout/app-shell";
import { DailyJoinBanner, PromoBanners } from "@/components/home/quiz-home-banners";
import { SectionHeader, HorizontalScroll } from "@/components/ui/section-header";
import { CategoryCard } from "@/components/categories/category-card";
import { GameCard } from "@/components/games/game-card";
import { categories } from "@/lib/data/categories";
import {
  getFeaturedGamesMeta,
  getTrendingGamesMeta,
  getNewGamesMeta,
  getDynamicTemplates,
} from "@/lib/games/registry";
import { collections } from "@/lib/data/collections";
import { siteStats } from "@/lib/data/stats";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";
import { QuizButtonLink } from "@/components/ui/quiz-button";

export default function HomePage() {
  const featured = getFeaturedGamesMeta();
  const trending = getTrendingGamesMeta();
  const recentlyAdded = getNewGamesMeta();
  const guessTheGames = getDynamicTemplates();
  const continueGame = guessTheGames.find((g) => g.slug === "guess-the-celebrity") ?? featured[0];

  return (
    <AppShell>
      <DailyJoinBanner />

      <div className="md:pt-2 flex flex-col gap-4 pt-4">
        <PromoBanners />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Games", value: siteStats.gamesAvailable + guessTheGames.length },
            { label: "Players", value: formatNumber(siteStats.players) },
            { label: "Categories", value: categories.length },
            { label: "Completed", value: formatNumber(siteStats.challengesCompleted) },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl bg-white border border-black/15 p-4 text-center shadow-soft-1"
            >
              <div className="text-2xl font-black">{stat.value}</div>
              <div className="text-xs font-bold text-black/60">{stat.label}</div>
            </div>
          ))}
        </div>

        <section>
          <SectionHeader title="Continue Playing" />
          <div className="rounded-xl bg-white border border-black/15 p-4 shadow-soft-1">
            <div className="flex items-center gap-4">
              <span className="text-4xl">⭐</span>
              <div className="flex-1 min-w-0">
                <h3 className="font-black text-base truncate">{continueGame?.title ?? "Guess the Celebrity"}</h3>
                <p className="text-xs font-bold text-black/60">Powered by Wikipedia + AI hints</p>
              </div>
              <QuizButtonLink
                href={`/play/${continueGame?.slug ?? "guess-the-celebrity"}`}
                color="lime"
                textColor="black"
                className="!min-w-0 !px-4 !h-10 !text-sm shrink-0"
              >
                Play
              </QuizButtonLink>
            </div>
          </div>
        </section>

        {/* Guess the __ series */}
        <section>
          <SectionHeader title="Guess the…" href="/categories" />
          <HorizontalScroll>
            {guessTheGames.map((game) => (
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
              />
            ))}
          </HorizontalScroll>
        </section>

        <section>
          <SectionHeader title="Categories" href="/categories" />
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {categories.slice(0, 6).map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title="Popular This Week" />
          <HorizontalScroll>
            {trending.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </HorizontalScroll>
        </section>

        <section>
          <SectionHeader title="Recently Added" />
          <HorizontalScroll>
            {(recentlyAdded.length > 0 ? recentlyAdded : featured.slice(0, 3)).map(
              (game) => (
                <GameCard key={game.id} game={game} />
              )
            )}
          </HorizontalScroll>
        </section>

        <section>
          <SectionHeader title="Featured Games" />
          <HorizontalScroll>
            {featured.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </HorizontalScroll>
        </section>

        <section className="pb-8">
          <SectionHeader title="Collections" href="/collections" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {collections.slice(0, 8).map((col) => (
              <Link
                key={col.id}
                href={`/collections/${col.slug}`}
                className="rounded-xl bg-white border border-black/15 p-4 flex flex-col items-center text-center gap-2 shadow-soft-1 active:scale-[0.97] transition-transform"
              >
                <span className="text-3xl">{col.emoji}</span>
                <h3 className="font-black text-sm leading-tight">{col.title}</h3>
                <p className="text-[10px] font-bold text-black/60 line-clamp-2">
                  {col.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <h1 className="sr-only">Guess Everything</h1>
    </AppShell>
  );
}
