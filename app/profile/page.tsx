"use client";

import { Flame, Target, Gamepad2, Award } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { achievements } from "@/lib/data/achievements";
import { getCategoryById } from "@/lib/data/categories";
import { usePlayerProgress } from "@/hooks/use-player-progress";
import { xpProgressInLevel } from "@/lib/player/progress";

export default function ProfilePage() {
  const { stats, hydrated } = usePlayerProgress();

  if (!hydrated) {
    return (
      <AppShell>
        <div className="text-center py-20 text-black/40 font-bold">Loading profile…</div>
      </AppShell>
    );
  }

  const accuracy =
    stats.totalAnswers > 0
      ? Math.round((stats.correctAnswers / stats.totalAnswers) * 100)
      : 0;
  const xpBar = xpProgressInLevel(stats.xp);
  const favoriteCategory = getCategoryById(stats.favoriteCategory);

  const statCards = [
    { label: "Games Played", value: stats.gamesPlayed, icon: Gamepad2 },
    { label: "Accuracy", value: stats.totalAnswers > 0 ? `${accuracy}%` : "—", icon: Target },
    { label: "Longest Streak", value: `${stats.longestStreak} days`, icon: Flame },
    { label: "Achievements", value: stats.achievements.length, icon: Award },
  ];

  return (
    <AppShell>
      <div className="text-center space-y-3 mb-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-answer4 text-4xl border-4 border-black shadow-soft-1">
          😎
        </div>
        <div>
          <h1 className="text-2xl font-black text-black">Player</h1>
          <span className="inline-block mt-1 bg-petrol-dark text-white text-xs font-black px-3 py-1 rounded-full">
            Level {stats.level}
          </span>
        </div>
        <div className="max-w-xs mx-auto space-y-1">
          <div className="flex justify-between text-xs font-bold text-black/60">
            <span>{stats.xp.toLocaleString()} XP</span>
            <span>{stats.level * 250} XP</span>
          </div>
          <div className="h-2 w-full rounded-full bg-black/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-btn-green-dark transition-[width] duration-500"
              style={{ width: `${xpBar.percent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-answer4 border-2 border-black/10 p-4 flex items-center gap-4 mb-6">
        <div className="text-3xl">🔥</div>
        <div>
          <div className="font-black text-black">
            {stats.streak > 0 ? `${stats.streak} Day Streak` : "Start Your Streak"}
          </div>
          <div className="text-xs font-bold text-black/60">
            {stats.streak > 0
              ? "Play daily to keep it going!"
              : "Complete a game today to begin."}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {statCards.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-xl bg-white border border-black/15 p-4 flex flex-col items-center gap-1 text-center shadow-soft-1"
          >
            <Icon className="h-5 w-5 text-petrol-dark" />
            <span className="text-lg font-black">{value}</span>
            <span className="text-[10px] font-bold text-black/60">{label}</span>
          </div>
        ))}
      </div>

      {favoriteCategory && stats.gamesPlayed > 0 && (
        <div className="rounded-xl bg-white border border-black/15 p-4 flex items-center gap-3 mb-6 shadow-soft-1">
          <span className="text-3xl">{favoriteCategory.emoji}</span>
          <div>
            <div className="text-xs font-bold text-black/60">Favorite Category</div>
            <div className="font-black">{favoriteCategory.name}</div>
          </div>
        </div>
      )}

      <h2 className="text-lg font-black mb-3">Achievements</h2>
      <div className="grid grid-cols-3 gap-2">
        {achievements.map((achievement) => {
          const unlocked = stats.achievements.includes(achievement.id);
          return (
            <div
              key={achievement.id}
              className={`rounded-xl bg-white border border-black/15 p-3 flex flex-col items-center text-center gap-1 shadow-soft-1 ${unlocked ? "" : "opacity-40 grayscale"}`}
              title={achievement.description}
            >
              <span className="text-2xl">{achievement.emoji}</span>
              <span className="text-[10px] font-black leading-tight">{achievement.title}</span>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
