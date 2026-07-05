"use client";

import { motion, AnimatePresence } from "framer-motion";
import { QuizButton } from "@/components/ui/quiz-button";
import { cn } from "@/lib/utils";
import { comboLabel } from "@/lib/game/session-utils";

interface PlayResultCelebrationProps {
  isCorrect: boolean;
  answer: string;
  fact: string | null;
  xpGained: number;
  coinsGained: number;
  combo: number;
  onContinue: () => void;
}

export function PlayResultCelebration({
  isCorrect,
  answer,
  fact,
  xpGained,
  coinsGained,
  combo,
  onContinue,
}: PlayResultCelebrationProps) {
  const comboText = comboLabel(combo);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-30 flex items-end md:items-center justify-center p-3 md:p-6 bg-black/40 backdrop-blur-sm"
      >
        <motion.div
          initial={{ y: 40, scale: 0.95 }}
          animate={{ y: 0, scale: 1 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className={cn(
            "w-full max-w-md rounded-2xl border-[3px] border-black p-4 md:p-5 shadow-2xl",
            isCorrect ? "bg-btn-green" : "bg-white"
          )}
        >
          {isCorrect ? (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                className="text-center text-4xl mb-2"
              >
                🎉
              </motion.div>
              <h3 className="text-center text-xl font-black text-black mb-2">
                CORRECT!
              </h3>
              <div className="flex justify-center gap-3 mb-3 flex-wrap">
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="play-reward-badge"
                >
                  +{xpGained} XP
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="play-reward-badge"
                >
                  +{coinsGained} 🪙
                </motion.span>
                {comboText && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="play-reward-badge bg-orange-200"
                  >
                    {comboText}
                  </motion.span>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="text-center text-3xl mb-2">❌</div>
              <h3 className="text-center text-lg font-black text-black mb-1">
                Not Quite!
              </h3>
              <p className="text-center text-sm font-bold text-black/70 mb-3">
                The correct answer was <strong>{answer}</strong>
              </p>
            </>
          )}

          <div className="rounded-xl bg-black/5 border border-black/10 p-3 mb-3">
            <p className="text-[10px] font-black text-black/50 uppercase mb-1">
              Did you know?
            </p>
            <p className="text-xs font-bold text-black/80 leading-snug">
              {fact ?? `Learn more about ${answer}.`}
            </p>
          </div>

          <QuizButton
            color={isCorrect ? "green-dark" : "cyan"}
            textColor={isCorrect ? "white" : "black"}
            className="w-full !h-11"
            onClick={onContinue}
          >
            Continue
          </QuizButton>
        </motion.div>

        {isCorrect && (
          <div className="play-confetti" aria-hidden>
            {Array.from({ length: 24 }).map((_, i) => (
              <span
                key={i}
                className="play-confetti-piece"
                style={{
                  left: `${(i * 4.2) % 100}%`,
                  animationDelay: `${i * 0.05}s`,
                  backgroundColor: ["#6FEEFF", "#c6ea84", "#F5D76E", "#FF9B9B"][i % 4],
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
