import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { CategoryCard } from "@/components/categories/category-card";
import { categories } from "@/lib/data/categories";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Quiz Game Categories – Geography, Movies, Sports & More",
  description:
    "Browse all Quizzical quiz categories — geography, animals, movies, history, sports, celebrities, and more. Free online guessing games for every interest.",
  path: "/categories",
  keywords: [
    "quiz categories",
    "guessing game categories",
    "trivia categories",
    "geography quiz",
    "movie quiz games",
    "quizzical",
  ],
});

export default function CategoriesPage() {
  return (
    <AppShell>
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-black text-black">Quiz Categories</h1>
        <p className="text-sm font-bold text-black/60 mt-1">
          {categories.length} categories of free guessing &amp; trivia games
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pb-8">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </AppShell>
  );
}
