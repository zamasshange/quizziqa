"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ANSWER_COLORS } from "@/lib/game/session-utils";

interface PlayAnswerGridProps {
  options: string[];
  correctAnswer: string;
  selectedAnswer: string | null;
  revealed: boolean;
  disabled: boolean;
  onSelect: (option: string) => void;
}

export function PlayAnswerGrid({
  options,
  correctAnswer,
  selectedAnswer,
  revealed,
  disabled,
  onSelect,
}: PlayAnswerGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2 md:gap-3">
      {options.map((option, i) => {
        const isSelected = selectedAnswer === option;
        const isCorrect = option.toLowerCase() === correctAnswer.toLowerCase();
        const colors = ANSWER_COLORS[i % ANSWER_COLORS.length];

        let stateClass = "";
        if (revealed && isCorrect) stateClass = "play-answer-correct";
        else if (revealed && isSelected && !isCorrect) stateClass = "play-answer-wrong";

        return (
          <motion.button
            key={option}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(option)}
            whileHover={!disabled ? { y: -3, scale: 1.02 } : undefined}
            whileTap={!disabled ? { scale: 0.96 } : undefined}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.25 }}
            className={cn(
              "play-answer-btn touch-target",
              stateClass,
              disabled && !revealed && "pointer-events-none"
            )}
            style={{
              backgroundColor: revealed && !isCorrect && !isSelected ? `${colors.bg}99` : colors.bg,
              boxShadow: `0 4px 0 ${colors.shadow}`,
            }}
          >
            <span className="relative z-10 line-clamp-2 leading-tight">{option}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
