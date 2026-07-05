"use client";

import { xpProgressInLevel } from "@/lib/player/progress";

interface PlaySidePanelProps {
  level: number;
  xp: number;
  streak: number;
  categoryName?: string;
  categoryEmoji?: string;
  collectedThisSession: number;
  isDaily?: boolean;
}

export function PlaySidePanel({
  level,
  xp,
  streak,
  categoryName,
  categoryEmoji,
  collectedThisSession,
  isDaily,
}: PlaySidePanelProps) {
  const xpBar = xpProgressInLevel(xp);

  return (
    <aside className="hidden lg:flex flex-col gap-3 w-52 shrink-0">
      <div className="play-game-card p-4 space-y-3">
        <div className="text-center">
          <div className="text-xs font-bold text-black/50 uppercase">Rank</div>
          <div className="text-2xl font-black text-black">Level {level}</div>
          <div className="h-1.5 rounded-full bg-black/8 mt-2 overflow-hidden">
            <div
              className="h-full bg-btn-green rounded-full transition-all duration-700"
              style={{ width: `${xpBar.percent}%` }}
            />
          </div>
          <div className="text-[9px] text-black/40 mt-1">
            {xpBar.current}/{xpBar.needed} XP
          </div>
        </div>

        <div className="border-t border-black/10 pt-3 space-y-2 text-xs font-bold text-black/70">
          <div className="flex justify-between">
            <span>🔥 Streak</span>
            <span className="text-black">{streak} days</span>
          </div>
          {isDaily && (
            <div className="flex justify-between text-btn-green-dark">
              <span>📅 Daily</span>
              <span>+25 XP</span>
            </div>
          )}
          {categoryEmoji && (
            <div className="flex justify-between">
              <span>{categoryEmoji} Category</span>
              <span className="text-black truncate ml-2">{categoryName}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>🃏 Collected</span>
            <span className="text-black">+{collectedThisSession}</span>
          </div>
        </div>
      </div>

      <div className="play-game-card p-3">
        <p className="text-[10px] font-black text-black/50 uppercase mb-2">
          Daily Mission
        </p>
        <p className="text-xs font-bold text-black/80">
          Answer 5 correctly in a row
        </p>
        <div className="h-1.5 rounded-full bg-black/8 mt-2 overflow-hidden">
          <div
            className="h-full bg-answer4 rounded-full"
            style={{ width: `${Math.min(100, collectedThisSession * 20)}%` }}
          />
        </div>
      </div>
    </aside>
  );
}
