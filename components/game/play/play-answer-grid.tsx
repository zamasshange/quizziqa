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
  questionId: string;
  animateEntry?: boolean;
  className?: string;
}

export function PlayAnswerGrid({
  options,
  correctAnswer,
  selectedAnswer,
  revealed,
  disabled,
  onSelect,
  questionId,
  animateEntry = false,
  className,
}: PlayAnswerGridProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-2 md:gap-3", className)}>
      {options.map((option, i) => {
        const isSelected = selectedAnswer === option;
        const isCorrect = option.toLowerCase() === correctAnswer.toLowerCase();
        const colors = ANSWER_COLORS[i % ANSWER_COLORS.length];

        let stateClass = "";
        if (revealed && isCorrect) stateClass = "play-answer-correct";
        else if (revealed && isSelected && !isCorrect) stateClass = "play-answer-wrong";

        return (
          <motion.button
            key={`${questionId}-${option}`}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(option)}
            whileHover={!disabled ? { y: -2, scale: 1.01 } : undefined}
            whileTap={!disabled ? { scale: 0.97 } : undefined}
          initial={animateEntry ? { opacity: 0, y: 8 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={animateEntry ? { delay: i * 0.03, duration: 0.15 } : undefined}
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
