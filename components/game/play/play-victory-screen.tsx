"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { QuizButton } from "@/components/ui/quiz-button";
import { getAchievementById } from "@/lib/player/achievements";

interface PlayVictoryScreenProps {
  score: number;
  total: number;
  xpEarned: number;
  coinsEarned: number;
  bestCombo: number;
  accuracy: number;
  newAchievements: string[];
  backHref: string;
  onReplay: () => void;
}

export function PlayVictoryScreen({
  score,
  total,
  xpEarned,
  coinsEarned,
  bestCombo,
  accuracy,
  newAchievements,
  backHref,
  onReplay,
}: PlayVictoryScreenProps) {
  const stars =
    accuracy === 100 ? 3 : accuracy >= 80 ? 2 : accuracy >= 50 ? 1 : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col items-center justify-center px-4 py-6 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 18 }}
        className="play-game-card w-full max-w-lg p-6 md:p-8 text-center"
      >
        <motion.div
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
          className="text-6xl mb-3"
        >
          {accuracy === 100 ? "🏆" : accuracy >= 70 ? "🎉" : "💪"}
        </motion.div>

        <h2 className="text-2xl font-black text-black mb-1">
          {accuracy === 100 ? "Perfect Run!" : "Quest Complete!"}
        </h2>
        <div className="flex justify-center gap-1 mb-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <span
              key={i}
              className={`text-2xl ${i < stars ? "opacity-100" : "opacity-20"}`}
            >
              ⭐
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { label: "Score", value: `${score}/${total}` },
            { label: "Accuracy", value: `${accuracy}%` },
            { label: "XP Earned", value: `+${xpEarned}` },
            { label: "Coins", value: `+${coinsEarned} 🪙` },
            { label: "Best Combo", value: bestCombo >= 2 ? `🔥 x${bestCombo}` : "—" },
            { label: "Rating", value: stars === 3 ? "S" : stars === 2 ? "A" : stars === 1 ? "B" : "C" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl bg-secondary border border-black/10 p-2.5"
            >
              <div className="text-lg font-black text-black">{s.value}</div>
              <div className="text-[9px] font-bold text-black/50 uppercase">{s.label}</div>
            </div>
          ))}
        </div>

        {newAchievements.length > 0 && (
          <div className="space-y-1.5 mb-4">
            {newAchievements.map((id) => {
              const a = getAchievementById(id);
              if (!a) return null;
              return (
                <motion.div
                  key={id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="rounded-xl bg-answer4 text-black px-3 py-2 text-xs font-bold border-2 border-black flex items-center gap-2 justify-center"
                >
                  <span>{a.emoji}</span>
                  <span>🏆 {a.title}</span>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <QuizButton color="green-dark" className="w-full" onClick={onReplay}>
            Play Again
          </QuizButton>
          <Link href={backHref}>
            <QuizButton color="cyan" textColor="black" className="w-full">
              Continue Adventure
            </QuizButton>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}
