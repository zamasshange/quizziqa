"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid3X3, Trophy, User, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/categories", label: "Play", icon: Grid3X3 },
  { href: "/daily", label: "Daily", icon: CalendarDays },
  { href: "/leaderboards", label: "Ranks", icon: Trophy },
  { href: "/profile", label: "Profile", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();
  const isPlaying = pathname.startsWith("/play/");

  if (isPlaying) return null;

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg md:hidden"
      style={{ paddingBottom: "var(--safe-bottom)" }}
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around h-[var(--nav-height)] px-2">
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
                "flex flex-col items-center justify-center gap-0.5 flex-1 touch-target rounded-xl transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground active:text-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={cn("h-5 w-5", isActive && "fill-primary/20")}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-[10px] font-semibold">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
