"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { categories } from "@/lib/data/categories";

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
  if (minimal) return null;

  return (
    <nav className="relative z-10 h-14 md:h-24 w-full bg-[#fffdf4] border-b border-black/10 shadow-soft-1 md:shadow-none">
      <div className="custom-container h-full flex items-center">
        <Link href="/" className="block h-10 md:h-14 w-36 md:w-48 lg:w-56 shrink-0">
          <Image
            src="/images/logo.svg"
            width={152}
            height={41}
            alt="Guess Everything"
            draggable={false}
            className="h-full w-auto object-contain object-left"
            priority
          />
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
