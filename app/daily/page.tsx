"use client";

import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { PromoBanners } from "@/components/home/quiz-home-banners";
import { DAILY_CHALLENGES, getTodayChallengeIndex } from "@/lib/daily/challenges";
import { cn } from "@/lib/utils";
import { usePlayerProgress } from "@/hooks/use-player-progress";

export default function DailyPage() {
  const todayIndex = getTodayChallengeIndex();
  const { stats, hydrated } = usePlayerProgress();

  return (
    <AppShell>
      <h1 className="text-3xl font-black text-black mb-4">Daily Challenge</h1>
      <PromoBanners />

      <div className="mt-6">
        <h2 className="text-lg font-black mb-3">Daily Rotations</h2>
        <div className="space-y-2">
          {DAILY_CHALLENGES.map((challenge, i) => {
            const isToday = i === todayIndex;
            return (
              <Link
                key={challenge.id}
                href={`/play/${challenge.slug}?daily=true`}
                className={cn(
                  "block rounded-xl bg-white border p-4 shadow-soft-1 active:scale-[0.98] transition-transform",
                  isToday ? "border-black/30 border-2" : "border-black/15"
                )}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{challenge.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-black text-sm">{challenge.title}</h3>
                      {isToday && (
                        <span className="bg-answer4 text-black text-[10px] font-black px-2 py-0.5 rounded-full border border-black">
                          Today
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-black/60">
                      {challenge.category} · +{challenge.bonusXp} bonus XP
                    </p>
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
        <h3 className="font-black text-black">
          {hydrated && stats.streak > 0
            ? `${stats.streak} Day Streak!`
            : "Start Your Streak"}
        </h3>
        <p className="text-xs font-bold text-black/60 mt-1">
          Play today&apos;s challenge to earn bonus XP and unlock streak achievements.
        </p>
      </div>
    </AppShell>
  );
}
