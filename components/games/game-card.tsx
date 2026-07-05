import Link from "next/link";
import { Clock, Star, Sparkles } from "lucide-react";
import type { Game, GameMeta } from "@/lib/types";
import { getCategoryById } from "@/lib/data/categories";

interface GameCardProps {
  game: Game | GameMeta;
  fullWidth?: boolean;
}

export function GameCard({ game, fullWidth }: GameCardProps) {
  const category = getCategoryById(game.categoryId);

  return (
    <div className={fullWidth ? "w-full" : "shrink-0 w-[260px] sm:w-[280px]"}>
      <Link href={`/play/${game.slug}`}>
        <div className="overflow-hidden rounded-xl bg-white border border-black/15 shadow-soft-1 active:scale-[0.98] transition-transform duration-100 h-full">
          <div className="relative h-32 bg-petrol-dark flex items-center justify-center">
            <span className="text-5xl">{category?.emoji ?? "🎯"}</span>
            {game.isNew && (
              <span className="absolute top-2 left-2 bg-btn-cyan text-black text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-black">
                NEW
              </span>
            )}
            {game.trending && (
              <span className="absolute top-2 right-2 bg-answer4 text-black text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-black">
                HOT
              </span>
            )}
            {"mode" in game && game.mode === "guess-from-image" && (
              <span className="absolute bottom-2 right-2 bg-white/90 text-black text-[9px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                <Sparkles className="h-2.5 w-2.5" /> Wiki
              </span>
            )}
          </div>
          <div className="p-4 space-y-2">
            <h3 className="font-black text-base leading-tight text-black">{game.title}</h3>
            <p className="text-xs font-bold text-black/60 line-clamp-2">{game.description}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase bg-secondary px-2 py-0.5 rounded-full border border-black/10">
                {game.difficulty}
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-black/60">
                <Star className="h-3 w-3 text-answer4 fill-answer4" />
                +{game.xpReward} XP
              </span>
              {game.timeLimit && (
                <span className="flex items-center gap-1 text-xs font-bold text-black/60">
                  <Clock className="h-3 w-3" />
                  {game.timeLimit}s
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
