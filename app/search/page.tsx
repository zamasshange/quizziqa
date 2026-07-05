"use client";

import { useState, useMemo } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { categories } from "@/lib/data/categories";
import { games } from "@/lib/data/games";
import { gameTemplates } from "@/lib/games/templates";
import { collections } from "@/lib/data/collections";
import { getCategoryById } from "@/lib/data/categories";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return { games: [], categories: [], collections: [] };
    const q = query.toLowerCase();
    const allGameMeta = [
      ...games.map((g) => ({ id: g.id, slug: g.slug, title: g.title, description: g.description, categoryId: g.categoryId, difficulty: g.difficulty })),
      ...gameTemplates.map((t) => ({ id: t.id, slug: t.slug, title: t.title, description: t.description, categoryId: t.categoryId, difficulty: t.difficulty })),
    ];
    return {
      games: allGameMeta.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q)
      ),
      categories: categories.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      ),
      collections: collections.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      ),
    };
  }, [query]);

  const hasResults =
    results.games.length > 0 ||
    results.categories.length > 0 ||
    results.collections.length > 0;

  return (
    <AppShell>
      <h1 className="text-3xl font-black text-black mb-4">Search</h1>

      <div className="relative mb-6">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black/40" />
        <input
          type="search"
          placeholder="Search games, categories, collections..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
          className="w-full h-12 pl-12 pr-10 rounded-full border-4 border-black bg-white font-bold text-center shadow-inner-hard-1 focus:outline-none focus:placeholder:text-transparent text-base"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 touch-target flex items-center justify-center"
            aria-label="Clear search"
          >
            <X className="h-5 w-5 text-black/40" />
          </button>
        )}
      </div>

      {!query.trim() && (
        <div className="text-center py-12 text-black/60">
          <SearchIcon className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="font-black">Instant Search</p>
          <p className="text-sm font-bold mt-1">Find games, categories, and collections</p>
        </div>
      )}

      {query.trim() && !hasResults && (
        <div className="text-center py-12 text-black/60">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-black">No results for &ldquo;{query}&rdquo;</p>
        </div>
      )}

      {results.categories.length > 0 && (
        <section className="mb-4">
          <h3 className="text-sm font-black text-black/60 mb-2">Categories</h3>
          <div className="space-y-2">
            {results.categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="block rounded-xl bg-white border border-black/15 p-3 shadow-soft-1 active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cat.emoji}</span>
                  <div>
                    <div className="font-black text-sm">{cat.name}</div>
                    <div className="text-xs font-bold text-black/60">{cat.gameCount} games</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {results.games.length > 0 && (
        <section className="mb-4">
          <h3 className="text-sm font-black text-black/60 mb-2">Games</h3>
          <div className="space-y-2">
            {results.games.map((game) => {
              const cat = getCategoryById(game.categoryId);
              return (
                <Link
                  key={game.id}
                  href={`/play/${game.slug}`}
                  className="block rounded-xl bg-white border border-black/15 p-3 shadow-soft-1 active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cat?.emoji ?? "🎯"}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-black text-sm truncate">{game.title}</div>
                      <div className="text-xs font-bold text-black/60 truncate">{game.description}</div>
                    </div>
                    <span className="text-[10px] font-black uppercase bg-secondary px-2 py-0.5 rounded-full border border-black/10">
                      {game.difficulty}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {results.collections.length > 0 && (
        <section>
          <h3 className="text-sm font-black text-black/60 mb-2">Collections</h3>
          <div className="space-y-2">
            {results.collections.map((col) => (
              <Link
                key={col.id}
                href={`/collections/${col.slug}`}
                className="block rounded-xl bg-white border border-black/15 p-3 shadow-soft-1 active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{col.emoji}</span>
                  <div>
                    <div className="font-black text-sm">{col.title}</div>
                    <div className="text-xs font-bold text-black/60">{col.description}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </AppShell>
  );
}
