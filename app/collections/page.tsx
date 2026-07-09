import type { Metadata } from "next";
import { AppShell } from "@/components/layout/app-shell";
import { collections } from "@/lib/data/collections";
import Link from "next/link";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Quiz Collections – Curated Guessing Game Packs",
  description:
    "Explore curated Quizzical quiz collections — world capitals, famous paintings, national flags, Disney movies, and more. Free themed guessing game packs.",
  path: "/collections",
  keywords: [
    "quiz collections",
    "themed trivia games",
    "guessing game packs",
    "quizzical collections",
  ],
});

export default function CollectionsPage() {
  return (
    <AppShell>
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-black text-black">Quiz Collections</h1>
        <p className="text-sm font-bold text-black/60 mt-1">
          Curated packs of free guessing games
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pb-8">
        {collections.map((col) => (
          <Link
            key={col.id}
            href={`/collections/${col.slug}`}
            className="rounded-xl bg-white border border-black/15 p-4 flex flex-col items-center text-center gap-2 shadow-soft-1 active:scale-[0.97] transition-transform"
          >
            <span className="text-3xl">{col.emoji}</span>
            <h2 className="font-black text-sm leading-tight">{col.title}</h2>
            <p className="text-[10px] font-bold text-black/60 line-clamp-2">
              {col.description}
            </p>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
