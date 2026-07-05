import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { collections } from "@/lib/data/collections";

export const metadata: Metadata = {
  title: "Collections",
  description: "Curated collections of guessing games to explore.",
};

export default function CollectionsPage() {
  return (
    <AppShell>
      <h1 className="text-3xl font-black text-black mb-2">Collections</h1>
      <p className="text-sm font-bold text-black/60 mb-6">
        Curated game collections to help you discover new challenges.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {collections.map((col) => (
          <Link
            key={col.id}
            href={`/collections/${col.slug}`}
            className="rounded-xl bg-white border border-black/15 p-5 flex flex-col items-center text-center gap-2 shadow-soft-1 active:scale-[0.97] transition-transform"
          >
            <span className="text-4xl">{col.emoji}</span>
            <h3 className="font-black text-sm leading-tight">{col.title}</h3>
            <p className="text-[11px] font-bold text-black/60 line-clamp-2">{col.description}</p>
            <span className="text-[10px] font-black text-petrol-dark">{col.gameIds.length} games</span>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
