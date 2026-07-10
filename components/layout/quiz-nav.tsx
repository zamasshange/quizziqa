"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useCallback } from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { categories } from "@/lib/data/categories";
import { AuthControls } from "@/components/auth/auth-controls";

const startItem = { href: "/", label: "Start", emoji: "🏠" };

const navCategories = [
  startItem,
  ...categories.slice(0, 8).map((c) => ({
    href: `/categories/${c.slug}`,
    label: c.name,
    emoji: c.emoji,
  })),
];

const headerLinks = [
  { href: "/daily", label: "Daily" },
  { href: "/leaderboards", label: "Leaderboards" },
  { href: "/profile", label: "Profile" },
  { href: "/collections", label: "Collections" },
  { href: "/settings", label: "Settings" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function QuizNav({ minimal }: { minimal?: boolean }) {
  const pathname = usePathname();
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
    <nav className="sticky top-0 z-40 h-14 md:h-20 w-full bg-[#fffdf4]/95 backdrop-blur-sm border-b border-black/10 shadow-soft-1 md:shadow-none">
      <div className="custom-container h-full flex items-center gap-3 md:gap-4">
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

        <form onSubmit={handleSearch} className="flex-1 max-w-sm lg:max-w-md hidden sm:block">
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

        <div className="hidden md:flex items-center gap-1 lg:gap-2 ml-auto">
          {headerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-2.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors",
                isActive(pathname, link.href)
                  ? "bg-black text-white"
                  : "text-black/60 hover:text-black hover:bg-black/5"
              )}
            >
              {link.label}
            </Link>
          ))}
          <AuthControls />
        </div>

        <Link
          href="/search"
          className="sm:hidden play-hud-pill !px-2.5 !py-2 ml-auto"
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
    <nav className="pt-2" aria-label="Categories">
      <div className="flex flex-col gap-1 rounded-2xl bg-white/80 border border-black/10 p-2 shadow-soft-1 backdrop-blur-sm">
        {navCategories.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex flex-col items-center py-1.5 rounded-xl transition-colors",
                active ? "bg-[#c6ea84]/50" : "hover:bg-black/5"
              )}
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
                  "w-10 h-1 bg-black rounded-full mt-0.5",
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
