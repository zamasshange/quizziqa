"use client";

import { useState } from "react";
import { Globe, Users, MapPin, Calendar, Trophy } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { globalLeaderboard, weeklyLeaderboard } from "@/lib/data/leaderboards";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "global", label: "Global", icon: Globe },
  { id: "weekly", label: "Weekly", icon: Calendar },
  { id: "friends", label: "Friends", icon: Users },
  { id: "country", label: "Country", icon: MapPin },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function LeaderboardsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("global");
  const data = activeTab === "weekly" ? weeklyLeaderboard : globalLeaderboard;

  return (
    <AppShell>
      <h1 className="text-3xl font-black text-black mb-4">Leaderboards</h1>

      <div className="flex gap-1 bg-black/5 rounded-xl p-1 mb-6">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex-1 flex items-center justify-center gap-1 rounded-lg py-2.5 text-xs font-black touch-target",
              activeTab === id ? "bg-white text-black shadow-soft-1" : "text-black/60"
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {data.length >= 3 && (
        <div className="flex items-end justify-center gap-3 py-4 mb-4">
          {[data[1], data[0], data[2]].map((entry, i) => {
            const heights = ["h-20", "h-28", "h-16"];
            const medals = ["🥈", "🥇", "🥉"];
            return (
              <div key={entry.rank} className="flex flex-col items-center gap-1 flex-1">
                <span className="text-2xl">{entry.avatar}</span>
                <span className="text-xs font-black truncate max-w-full">{entry.username}</span>
                <div className={cn("w-full rounded-t-xl bg-petrol-dark flex flex-col items-center justify-end pb-2", heights[i])}>
                  <span className="text-lg">{medals[i]}</span>
                  <span className="text-xs font-black text-white">{entry.score.toLocaleString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="space-y-2">
        {data.map((entry) => (
          <div
            key={entry.rank}
            className={cn(
              "rounded-xl bg-white border p-3 shadow-soft-1 flex items-center gap-3",
              entry.username === "You" ? "border-2 border-black/30" : "border-black/15"
            )}
          >
            <span className="text-sm font-black text-black/40 w-6 text-center">{entry.rank}</span>
            <span className="text-xl">{entry.avatar}</span>
            <div className="flex-1 min-w-0">
              <div className="font-black text-sm truncate">
                {entry.username}
                {entry.username === "You" && (
                  <span className="ml-2 bg-answer4 text-black text-[10px] font-black px-2 py-0.5 rounded-full border border-black">
                    You
                  </span>
                )}
              </div>
              {entry.country && (
                <span className="text-[10px] font-bold text-black/50">{entry.country}</span>
              )}
            </div>
            <div className="flex items-center gap-1 text-sm font-black">
              <Trophy className="h-3.5 w-3.5 text-answer4" />
              {entry.score.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
