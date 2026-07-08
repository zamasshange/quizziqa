"use client";

import Link from "next/link";
import { Clock, Star, Sparkles } from "lucide-react";
import type { Game, GameMeta } from "@/lib/types";
import { getCategoryById } from "@/lib/data/categories";
import { prefetchGame } from "@/lib/game/background-worker";
import { cn } from "@/lib/utils";

interface GameCardProps {
  game: Game | GameMeta;
  fullWidth?: boolean;
  grid?: boolean;
}

export function GameCard({ game, fullWidth, grid }: GameCardProps) {
  const category = getCategoryById(game.categoryId);

  return (
    <div
      className={cn(
        fullWidth && "w-full",
        grid && "w-full",
        !fullWidth && !grid && "shrink-0 w-[260px] sm:w-[280px]"
      )}
    >
      <Link
        href={`/play/${game.slug}`}
        onMouseEnter={() => prefetchGame(game.slug)}
        onFocus={() => prefetchGame(game.slug)}
      >
        <div className="overflow-hidden rounded-xl bg-white border border-black/15 shadow-soft-1 active:scale-[0.98] transition-transform duration-100 h-full">
          <div className={cn(
            "relative bg-petrol-dark flex items-center justify-center",
            grid ? "h-24 md:h-28" : "h-32"
          )}>
            <span className={cn(grid ? "text-4xl" : "text-5xl")}>{category?.emoji ?? "🎯"}</span>
            {game.isNew && (
              <span className="absolute top-1.5 left-1.5 bg-btn-cyan text-black text-[8px] font-black px-1.5 py-0.5 rounded-full border border-black">
                NEW
              </span>
            )}
            {game.trending && (
              <span className="absolute top-1.5 right-1.5 bg-answer4 text-black text-[8px] font-black px-1.5 py-0.5 rounded-full border border-black">
                HOT
              </span>
            )}
            {"mode" in game && game.mode === "guess-from-image" && (
              <span className="absolute bottom-1.5 right-1.5 bg-white/90 text-black text-[8px] font-black px-1 py-0.5 rounded-full flex items-center gap-0.5">
                <Sparkles className="h-2 w-2" /> Wiki
              </span>
            )}
          </div>
          <div className={cn("space-y-1.5", grid ? "p-2.5" : "p-4 space-y-2")}>
            <h3 className={cn("font-black leading-tight text-black", grid ? "text-xs line-clamp-2" : "text-base")}>
              {game.title}
            </h3>
            {!grid && (
              <p className="text-xs font-bold text-black/60 line-clamp-2">{game.description}</p>
            )}
            <div className="flex items-center gap-1 flex-wrap">
              <span className="text-[8px] font-black uppercase bg-secondary px-1.5 py-0.5 rounded-full border border-black/10">
                {game.difficulty}
              </span>
              <span className="flex items-center gap-0.5 text-[10px] font-bold text-black/60">
                <Star className="h-2.5 w-2.5 text-answer4 fill-answer4" />
                +{game.xpReward}
              </span>
              {game.timeLimit ? (
                <span className="flex items-center gap-0.5 text-[10px] font-bold text-black/60">
                  <Clock className="h-2.5 w-2.5" />
                  {game.timeLimit}s
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
