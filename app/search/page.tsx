"use client";

import { useState, useMemo } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { searchAll, type SearchResult } from "@/lib/search/index";

const typeLabels: Record<string, string> = {
  game: "Games",
  category: "Categories",
  collection: "Collections",
  entity: "People & Places",
};

function groupResults(results: SearchResult[]) {
  const groups: Record<string, SearchResult[]> = {};
  for (const r of results) {
    if (!groups[r.type]) groups[r.type] = [];
    groups[r.type].push(r);
  }
  return groups;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => searchAll(query, 40), [query]);
  const grouped = useMemo(() => groupResults(results), [results]);
  const hasResults = results.length > 0;

  return (
    <AppShell>
      <h1 className="text-3xl font-black text-black mb-4">Search</h1>

      <div className="relative mb-6">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-black/40" />
        <input
          type="search"
          placeholder="Search games, countries, people, animals…"
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
          <p className="font-black">Universal Search</p>
          <p className="text-sm font-bold mt-1">
            Games, categories, collections, countries, celebrities, animals & more
          </p>
        </div>
      )}

      {query.trim() && !hasResults && (
        <div className="text-center py-12 text-black/60">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-black">No results for &ldquo;{query}&rdquo;</p>
        </div>
      )}

      {Object.entries(grouped).map(([type, items]) => (
        <section key={type} className="mb-4">
          <h3 className="text-sm font-black text-black/60 mb-2">
            {typeLabels[type] ?? type}
          </h3>
          <div className="space-y-2">
            {items.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="block rounded-xl bg-white border border-black/15 p-3 shadow-soft-1 active:scale-[0.98] transition-transform"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.emoji ?? "🎯"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-sm truncate">{item.title}</div>
                    {item.subtitle && (
                      <div className="text-xs font-bold text-black/60 truncate">
                        {item.subtitle}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </AppShell>
  );
}
