"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { categories } from "@/lib/data/categories";
import { searchAll } from "@/lib/search/index";

const startItem = { href: "/", label: "Start", emoji: "🏠" };

const navCategories = [
  startItem,
  ...categories.slice(0, 8).map((c) => ({
    href: `/categories/${c.slug}`,
    label: c.name,
    emoji: c.emoji,
  })),
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function QuizNav({ minimal }: { minimal?: boolean }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const q = query.trim();
      if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
      else router.push("/search");
    },
    [query, router]
  );

  if (minimal) return null;

  return (
    <nav className="relative z-10 h-14 md:h-20 w-full bg-[#fffdf4] border-b border-black/10 shadow-soft-1 md:shadow-none">
      <div className="custom-container h-full flex items-center gap-3">
        <Link href="/" className="block h-9 md:h-12 w-auto shrink-0">
          <Image
            src="/images/logo.png"
            width={180}
            height={180}
            alt="Quizzical"
            draggable={false}
            className="h-full w-auto object-contain object-left"
            priority
          />
        </Link>

        <form onSubmit={handleSearch} className="flex-1 max-w-md hidden sm:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search games…"
              className="w-full h-9 pl-9 pr-3 rounded-full border-2 border-black/15 bg-white text-sm font-bold focus:outline-none focus:border-black/30"
            />
          </div>
        </form>

        <Link
          href="/search"
          className="sm:hidden play-hud-pill !px-2.5 !py-2"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </Link>
      </div>
    </nav>
  );
}

export function QuizCategoryNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-4 pt-2" aria-label="Categories">
      <div className="flex flex-col gap-1">
        {navCategories.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col items-center py-1"
            >
              <span className="w-9 h-9 flex items-center justify-center text-2xl">
                {item.emoji}
              </span>
              <span
                className={cn(
                  "text-xs font-bold leading-snug text-center",
                  active ? "text-black" : "text-black/60"
                )}
              >
                {item.label}
              </span>
              <div
                className={cn(
                  "w-full h-1 bg-black rounded-full mt-0.5",
                  active ? "opacity-100" : "opacity-0 group-hover:opacity-40"
                )}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function QuizMobileCategoryNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden overflow-x-auto no-scrollbar pb-2" aria-label="Categories">
      <div className="flex gap-4 w-max">
        {navCategories.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-0.5 min-w-[52px]"
            >
              <span className="text-xl">{item.emoji}</span>
              <span
                className={cn(
                  "text-[10px] font-bold whitespace-nowrap",
                  active ? "text-black" : "text-black/60"
                )}
              >
                {item.label}
              </span>
              <div
                className={cn(
                  "w-full h-0.5 bg-black rounded-full",
                  active ? "opacity-100" : "opacity-0"
                )}
              />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
