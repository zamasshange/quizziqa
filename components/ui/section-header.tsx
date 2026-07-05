"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  href?: string;
}

export function SectionHeader({ title, href }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-xl font-black text-black">{title}</h2>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-0.5 text-sm text-black font-black opacity-60 hover:opacity-100 touch-target"
        >
          See all
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

interface HorizontalScrollProps {
  children: React.ReactNode;
}

export function HorizontalScroll({ children }: HorizontalScrollProps) {
  return (
    <div className="overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 md:mx-0 md:px-0">
      <div className="flex gap-3 w-max">{children}</div>
    </div>
  );
}
