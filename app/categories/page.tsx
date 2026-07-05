import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { CategoryCard } from "@/components/categories/category-card";
import { categories } from "@/lib/data/categories";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse all guessing game categories.",
};

export default function CategoriesPage() {
  return (
    <AppShell>
      <h1 className="text-3xl font-black text-black mb-2">Categories</h1>
      <p className="text-sm font-bold text-black/60 mb-6">
        {categories.length} categories · 847+ games
      </p>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </AppShell>
  );
}
