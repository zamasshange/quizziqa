import Link from "next/link";
import type { Category } from "@/lib/types";

interface CategoryCardProps {
  category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white border border-black/15 shadow-soft-1 active:scale-[0.98] transition-transform duration-100 touch-target"
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-answer4 text-2xl border-2 border-black/10">
        {category.emoji}
      </div>
      <span className="text-[10px] font-black text-center leading-tight text-black">
        {category.name}
      </span>
      <span className="text-[9px] font-bold text-black/50">
        {category.gameCount} games
      </span>
    </Link>
  );
}
