"use client";

import { motion } from "framer-motion";
import { difficultyStars } from "@/lib/game/session-utils";
import type { Difficulty } from "@/lib/types";

interface PlayQuestionHeaderProps {
  categoryEmoji?: string;
  categoryName?: string;
  gameTitle: string;
  questionText: string;
  difficulty: Difficulty;
  isTextRound: boolean;
}

export function PlayQuestionHeader({
  categoryEmoji,
  categoryName,
  gameTitle,
  questionText,
  difficulty,
  isTextRound,
}: PlayQuestionHeaderProps) {
  const stars = difficultyStars(difficulty);

  return (
    <motion.div
      key={questionText}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-2 md:mb-4"
    >
      <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-1.5">
        {categoryEmoji && <span className="text-xl md:text-2xl">{categoryEmoji}</span>}
        <div>
          <p className="text-[10px] font-bold text-black/50 uppercase tracking-wide">
            {categoryName ?? gameTitle}
          </p>
          <div className="flex items-center gap-1.5">
            <span className="text-amber-500 text-xs tracking-tight">
              {"★".repeat(stars)}
              {"☆".repeat(5 - stars)}
            </span>
            <span className="text-[10px] font-black text-black/60 capitalize">
              {difficulty}
            </span>
          </div>
        </div>
      </div>
      {!isTextRound && (
        <h2 className="text-sm md:text-lg font-black text-black leading-tight">
          {questionText}
        </h2>
      )}
    </motion.div>
  );
}
