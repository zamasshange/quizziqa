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
  score?: number;
  currentIndex?: number;
  total?: number;
  combo?: number;
  bestCombo?: number;
}

const SESSION_TIPS = [
  "Use 50/50 when you're stuck between two names.",
  "Freeze time buys you extra seconds on hard rounds.",
  "Build a combo streak for bonus XP each correct answer.",
  "Daily missions reward consistency — play every day!",
  "World leaders span every continent — look for clues in dress and setting.",
];

export function PlaySidePanel({
  level,
  xp,
  streak,
  categoryName,
  categoryEmoji,
  collectedThisSession,
  isDaily,
  score = 0,
  currentIndex = 0,
  total = 10,
  combo = 0,
  bestCombo = 0,
}: PlaySidePanelProps) {
  const xpBar = xpProgressInLevel(xp);
  const accuracy =
    currentIndex > 0 ? Math.round((score / currentIndex) * 100) : 0;
  const tip = SESSION_TIPS[currentIndex % SESSION_TIPS.length];

  return (
    <aside className="hidden lg:flex flex-col gap-3 lg:gap-4 w-52 lg:w-64 xl:w-72 shrink-0 self-stretch">
      <div className="play-game-card p-4 lg:p-5 space-y-3 lg:space-y-4">
        <div className="text-center">
          <div className="text-xs lg:text-sm font-bold text-black/50 uppercase">Rank</div>
          <div className="text-2xl lg:text-3xl font-black text-black">Level {level}</div>
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

      <div className="play-game-card p-3 lg:p-4">
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

      <div className="play-game-card flex-1 p-4 lg:p-5 flex flex-col gap-3 min-h-[140px]">
        <p className="text-[10px] font-black text-black/50 uppercase">
          This Session
        </p>
        <div className="space-y-2 text-xs font-bold text-black/70">
          <div className="flex justify-between">
            <span>📊 Progress</span>
            <span className="text-black">
              {currentIndex + 1}/{total}
            </span>
          </div>
          <div className="flex justify-between">
            <span>✅ Score</span>
            <span className="text-black">{score}</span>
          </div>
          {currentIndex > 0 && (
            <div className="flex justify-between">
              <span>🎯 Accuracy</span>
              <span className="text-black">{accuracy}%</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>⚡ Combo</span>
            <span className="text-black">{combo > 0 ? `${combo}x` : "—"}</span>
          </div>
          {bestCombo > 1 && (
            <div className="flex justify-between">
              <span>🏆 Best combo</span>
              <span className="text-black">{bestCombo}x</span>
            </div>
          )}
        </div>

        <div className="mt-auto pt-3 border-t border-black/10">
          <p className="text-[10px] font-black text-black/50 uppercase mb-1.5">
            Tip
          </p>
          <p className="text-[11px] font-bold text-black/60 leading-snug">
            {tip}
          </p>
        </div>
      </div>
    </aside>
  );
}
