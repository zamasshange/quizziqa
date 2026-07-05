import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PromoBanners } from "@/components/home/quiz-home-banners";
import { getDailySeed } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Daily Challenge",
  description: "Play today's daily guessing challenge and maintain your streak.",
};

const allDailyChallenges = [
  { emoji: "⭐", title: "Daily Celebrity", slug: "guess-the-celebrity", category: "Celebrities" },
  { emoji: "🏙", title: "Daily City", slug: "guess-the-city", category: "Geography" },
  { emoji: "🏳", title: "Daily Flag", slug: "guess-the-flag", category: "Geography" },
  { emoji: "🐾", title: "Daily Animal", slug: "guess-the-animal-wiki", category: "Animals" },
  { emoji: "🍕", title: "Daily Food", slug: "guess-the-food", category: "Food" },
  { emoji: "🏰", title: "Daily Landmark", slug: "guess-the-landmark", category: "Landmarks" },
];

function getTodayIndex() {
  const seed = getDailySeed();
  return seed.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % allDailyChallenges.length;
}

export default function DailyPage() {
  const todayIndex = getTodayIndex();

  return (
    <AppShell>
      <h1 className="text-3xl font-black text-black mb-4">Daily Challenge</h1>
      <PromoBanners />

      <div className="mt-6">
        <h2 className="text-lg font-black mb-3">This Week&apos;s Challenges</h2>
        <div className="space-y-2">
          {allDailyChallenges.map((challenge, i) => {
            const isToday = i === todayIndex;
            return (
              <Link
                key={challenge.title}
                href={`/play/${challenge.slug}?daily=true`}
                className={cn(
                  "block rounded-xl bg-white border p-4 shadow-soft-1 active:scale-[0.98] transition-transform",
                  isToday ? "border-black/30 border-2" : "border-black/15"
                )}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{challenge.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-black text-sm">{challenge.title}</h3>
                      {isToday && (
                        <span className="bg-answer4 text-black text-[10px] font-black px-2 py-0.5 rounded-full border border-black">
                          Today
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-black/60">{challenge.category}</p>
                  </div>
                  <span className="text-black font-black text-sm">→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-6 rounded-xl bg-answer4 border-2 border-black/10 p-4 text-center">
        <div className="text-3xl mb-2">🔥</div>
        <h3 className="font-black text-black">5 Day Streak!</h3>
        <p className="text-xs font-bold text-black/60 mt-1">
          Play every day to earn bonus XP and unlock streak achievements.
        </p>
      </div>
    </AppShell>
  );
}
