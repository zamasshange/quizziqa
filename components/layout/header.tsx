"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Search, Sun, Moon, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { defaultPlayerStats } from "@/lib/data/stats";

interface HeaderProps {
  showSearch?: boolean;
  title?: string;
}

export function Header({ showSearch = true, title }: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-lg">
      <div className="flex h-[var(--header-height)] items-center justify-between px-4 max-w-7xl mx-auto">
        {title ? (
          <h1 className="text-lg font-bold truncate">{title}</h1>
        ) : (
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">🎯</span>
            <span className="font-bold text-base hidden xs:block">
              Guess<span className="text-primary">Everything</span>
            </span>
          </Link>
        )}

        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 bg-accent/10 text-accent rounded-full px-2.5 py-1 text-xs font-bold">
            <Flame className="h-3.5 w-3.5" />
            {defaultPlayerStats.streak}
          </div>

          {showSearch && (
            <Button variant="ghost" size="icon" asChild aria-label="Search">
              <Link href="/search">
                <Search className="h-5 w-5" />
              </Link>
            </Button>
          )}

          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
