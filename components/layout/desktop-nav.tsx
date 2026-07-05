"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3X3, Trophy, User, CalendarDays, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/categories", label: "Play", icon: Grid3X3 },
  { href: "/daily", label: "Daily", icon: CalendarDays },
  { href: "/leaderboards", label: "Leaderboards", icon: Trophy },
  { href: "/profile", label: "Profile", icon: User },
];

export function DesktopNav() {
  const pathname = usePathname();
  const isPlaying = pathname.startsWith("/play/");

  if (isPlaying) return null;

  return (
    <nav
      className="hidden md:flex items-center gap-1 border-b border-border bg-card/50 px-4"
      aria-label="Desktop navigation"
    >
      <div className="flex items-center gap-1 max-w-7xl mx-auto w-full py-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/"
              ? pathname === "/"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
        <div className="flex-1" />
        <Link
          href="/search"
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary"
        >
          <Search className="h-4 w-4" />
          Search
        </Link>
        <Link
          href="/collections"
          className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary"
        >
          Collections
        </Link>
      </div>
    </nav>
  );
}
