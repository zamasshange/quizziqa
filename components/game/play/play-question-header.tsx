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
  questionId: string;
  animateEntry?: boolean;
}

export function PlayQuestionHeader({
  categoryEmoji,
  categoryName,
  gameTitle,
  questionText,
  difficulty,
  isTextRound,
  questionId,
  animateEntry = false,
}: PlayQuestionHeaderProps) {
  const stars = difficultyStars(difficulty);

  return (
    <motion.div
      key={questionId}
      initial={animateEntry ? { opacity: 0, y: -6 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={animateEntry ? { duration: 0.15 } : { duration: 0 }}
      className="mb-1 md:mb-4"
    >
      <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1.5">
        {categoryEmoji && <span className="text-base md:text-2xl">{categoryEmoji}</span>}
        <div>
          <p className="text-[9px] md:text-[10px] font-bold text-black/50 uppercase tracking-wide">
            {categoryName ?? gameTitle}
          </p>
          <div className="flex items-center gap-1.5">
            <span className="text-amber-500 text-[10px] md:text-xs tracking-tight">
              {"★".repeat(stars)}
              {"☆".repeat(5 - stars)}
            </span>
            <span className="text-[9px] md:text-[10px] font-black text-black/60 capitalize">
              {difficulty}
            </span>
          </div>
        </div>
      </div>
      {!isTextRound && (
        <h2 className="text-sm md:text-lg lg:text-2xl xl:text-[1.65rem] font-black text-black leading-tight">
          {questionText}
        </h2>
      )}
    </motion.div>
  );
}
