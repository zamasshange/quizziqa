"use client";

import Link from "next/link";
import { ArrowLeft, Flame, Coins, Heart, Star, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { xpProgressInLevel } from "@/lib/player/progress";

interface PlayHudProps {
  backHref: string;
  level: number;
  xp: number;
  coins: number;
  streak: number;
  lives: number;
  score: number;
  currentIndex: number;
  total: number;
  difficulty: string;
  categoryEmoji?: string;
  isDaily?: boolean;
  combo: number;
  timeLeft?: number;
  timerFrozen?: boolean;
}

export function PlayHud({
  backHref,
  level,
  xp,
  coins,
  streak,
  lives,
  score,
  currentIndex,
  total,
  difficulty,
  categoryEmoji,
  isDaily,
  combo,
  timeLeft,
  timerFrozen,
}: PlayHudProps) {
  const xpBar = xpProgressInLevel(xp);

  return (
    <header className="relative z-20 shrink-0 px-3 md:px-5 pt-[max(0.4rem,env(safe-area-inset-top))] pb-2 max-w-6xl mx-auto w-full">
      <div className="flex items-center gap-2 mb-2">
        <Link
          href={backHref}
          className="play-hud-pill shrink-0 !px-2.5 !py-1.5 hover:bg-secondary"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>

        <div className="flex-1 flex items-center justify-center gap-1.5 flex-wrap">
          <span className="play-hud-pill text-[10px]">
            <Flame className="h-3 w-3 text-orange-500" />
            {streak}
          </span>
          <span className="play-hud-pill text-[10px]">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={cn(
                  "h-3 w-3 inline",
                  i < lives ? "text-red-500 fill-red-500" : "text-black/15"
                )}
              />
            ))}
          </span>
          <span className="play-hud-pill text-[10px]">
            <Coins className="h-3 w-3 text-amber-600" />
            {coins}
          </span>
          <span className="play-hud-pill text-[10px]">
            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
            Lv.{level}
          </span>
          {combo >= 2 && (
            <span className="play-hud-pill text-[10px] text-orange-600 play-combo-pulse">
              🔥 x{combo}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {isDaily && (
            <span className="bg-answer4 text-black text-[8px] font-black px-1.5 py-0.5 rounded-full border border-black">
              Daily
            </span>
          )}
          {categoryEmoji && <span className="text-base">{categoryEmoji}</span>}
        </div>
      </div>

      <div className="mb-2 px-1">
        <div className="flex justify-between text-[9px] font-bold text-black/50 mb-0.5">
          <span>{xp.toLocaleString()} XP</span>
          <span>
            {xpBar.current}/{xpBar.needed}
          </span>
        </div>
        <div className="h-2 rounded-full bg-black/8 overflow-hidden border border-black/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-btn-green to-btn-green-dark transition-[width] duration-700 ease-out"
            style={{ width: `${xpBar.percent}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 text-[10px] font-bold text-black/70">
        <span className="play-hud-pill !py-1 capitalize">{difficulty}</span>
        <span>
          Q {Math.min(currentIndex + 1, total)}/{total}
        </span>
        <div className="flex-1 h-1.5 rounded-full bg-black/8 overflow-hidden">
          <div
            className="h-full rounded-full bg-petrol-dark/70 transition-[width] duration-500"
            style={{ width: `${(currentIndex / total) * 100}%` }}
          />
        </div>
        <span className="flex items-center gap-0.5 text-petrol-dark font-black">
          <Star className="h-3 w-3 fill-answer4 text-answer4" />
          {score}
        </span>
        {timeLeft !== undefined && (
          <span
            className={cn(
              "play-hud-pill !py-1 tabular-nums",
              timeLeft <= 5 && !timerFrozen && "text-red-600 play-shake",
              timerFrozen && "text-sky-600"
            )}
          >
            <Clock className="h-3 w-3 inline mr-0.5" />
            {timerFrozen ? "⏸" : `${timeLeft}s`}
          </span>
        )}
      </div>
    </header>
  );
}
