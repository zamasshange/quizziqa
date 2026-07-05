"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Lightbulb,
  SkipForward,
  Clock,
  Star,
  CheckCircle2,
  XCircle,
  X,
} from "lucide-react";
import type { Game, GameQuestion } from "@/lib/types";
import { QuizButton } from "@/components/ui/quiz-button";
import { QuestionMedia } from "@/components/game/question-media";
import { inferMediaVariant } from "@/lib/media/images";
import { cn } from "@/lib/utils";

interface GamePlayerProps {
  game: Game;
  isDaily?: boolean;
  categoryName?: string;
  categorySlug?: string;
  categoryEmoji?: string;
}

type RoundState = "playing" | "correct" | "incorrect" | "finished";

const answerColors = ["#6FEEFF", "#c6ea84", "#F5D76E", "#FF9B9B"];

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getOptions(question: GameQuestion): string[] {
  return shuffleArray([question.answer, ...(question.alternatives ?? [])]);
}

export function GamePlayer({
  game,
  isDaily,
  categoryName,
  categorySlug,
  categoryEmoji,
}: GamePlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [roundState, setRoundState] = useState<RoundState>("playing");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [skipsUsed, setSkipsUsed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(game.timeLimit ?? 0);
  const [hintText, setHintText] = useState<string | null>(null);
  const [hintLoading, setHintLoading] = useState(false);
  const [displayFact, setDisplayFact] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>(() =>
    game.questions[0] ? getOptions(game.questions[0]) : []
  );
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const question = game.questions[currentIndex];
  const progress =
    ((currentIndex + (roundState !== "playing" ? 1 : 0)) / game.questions.length) * 100;
  const totalXp = score * (game.xpReward / game.questions.length);
  const backHref = categorySlug ? `/categories/${categorySlug}` : "/categories";
  const mediaVariant = inferMediaVariant(game.slug, game.mode);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (!question) return;
    setOptions(getOptions(question));
    setHintText(null);
    setDisplayFact(null);
    setSelectedAnswer(null);
    setRoundState("playing");
    if (game.timeLimit) setTimeLeft(game.timeLimit);
  }, [currentIndex, game.timeLimit, question?.id]);

  useEffect(() => {
    if (!game.timeLimit || roundState !== "playing") {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setRoundState("incorrect");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, roundState, game.timeLimit]);

  const handleHint = async () => {
    if (hintsUsed >= game.maxHints || !question || hintLoading) return;
    setHintsUsed((h) => h + 1);
    setHintLoading(true);
    try {
      const res = await fetch("/api/ai/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.question,
          answer: question.answer,
          category: categoryName,
          existingHint: question.hint,
        }),
      });
      const data = await res.json();
      setHintText(data.hint ?? question.hint ?? "Think about the category.");
    } catch {
      setHintText(question.hint ?? "Eliminate wrong answers first.");
    } finally {
      setHintLoading(false);
    }
  };

  const enrichFact = async (baseFact: string, answer: string) => {
    try {
      const res = await fetch("/api/ai/fact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer, context: baseFact }),
      });
      const data = await res.json();
      setDisplayFact(data.fact ?? baseFact);
    } catch {
      setDisplayFact(baseFact);
    }
  };

  const handleAnswer = useCallback(
    (answer: string) => {
      if (roundState !== "playing" || !question) return;
      if (timerRef.current) clearInterval(timerRef.current);
      setSelectedAnswer(answer);
      const isCorrect = answer.toLowerCase() === question.answer.toLowerCase();
      if (isCorrect) setScore((s) => s + 1);
      setRoundState(isCorrect ? "correct" : "incorrect");
      enrichFact(question.fact, question.answer);
    },
    [roundState, question]
  );

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= game.questions.length) {
      setRoundState("finished");
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, game.questions.length]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setRoundState("playing");
    setSelectedAnswer(null);
    setScore(0);
    setHintsUsed(0);
    setSkipsUsed(0);
    setHintText(null);
    setDisplayFact(null);
    if (game.timeLimit) setTimeLeft(game.timeLimit);
    if (game.questions[0]) setOptions(getOptions(game.questions[0]));
  }, [game.timeLimit, game.questions]);

  const handleSkip = () => {
    if (skipsUsed < game.maxSkips) {
      setSkipsUsed((s) => s + 1);
      handleNext();
    }
  };

  if (!question && roundState !== "finished") return null;

  /* ── FINISHED ── */
  if (roundState === "finished") {
    const accuracy = Math.round((score / game.questions.length) * 100);
    const earnedXp = Math.round(totalXp);
    return (
      <div className="flex flex-col h-dvh max-h-dvh overflow-hidden bg-petrol-dark px-4 pb-3">
        <PlayHUD
          backHref={backHref}
          title={game.title}
          categoryEmoji={categoryEmoji}
          categoryName={categoryName}
          isDaily={isDaily}
          currentIndex={game.questions.length}
          total={game.questions.length}
          score={score}
          progress={100}
        />
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 min-h-0">
          <div className="text-5xl">{accuracy === 100 ? "🏆" : accuracy >= 70 ? "🎉" : "💪"}</div>
          <h2 className="text-xl font-black text-white">
            {accuracy === 100 ? "Perfect!" : "Complete!"}
          </h2>
          <div className="grid grid-cols-3 gap-2 w-full max-w-sm">
            {[
              { label: "Correct", value: `${score}/${game.questions.length}` },
              { label: "Accuracy", value: `${accuracy}%` },
              { label: "XP", value: `+${earnedXp}` },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-white/10 border border-white/20 p-2">
                <div className="text-lg font-black text-white">{s.value}</div>
                <div className="text-[9px] font-bold text-white/60">{s.label}</div>
              </div>
            ))}
          </div>
          <QuizButton color="green-dark" className="w-full max-w-xs" onClick={handleRestart}>
            Play Again
          </QuizButton>
        </div>
      </div>
    );
  }

  /* ── ACTIVE ROUND ── */
  return (
    <div className="flex flex-col h-dvh max-h-dvh overflow-hidden bg-petrol-dark w-full">
      <PlayHUD
        backHref={backHref}
        title={game.title}
        categoryEmoji={categoryEmoji}
        isDaily={isDaily}
        currentIndex={currentIndex}
        total={game.questions.length}
        score={score}
        progress={progress}
        timeLeft={game.timeLimit && roundState === "playing" ? timeLeft : undefined}
      />

      {/* Centered stage – mobile: stack, desktop: split */}
      <div className="flex-1 min-h-0 flex items-center justify-center px-3 md:px-6 pb-3">
        <div className="w-full max-w-5xl h-full min-h-0 flex flex-col md:flex-row md:items-center md:gap-10 md:justify-center py-2 md:py-0">

          {/* LEFT – media */}
          <div className="relative shrink-0 flex items-center justify-center md:flex-1 md:max-w-[50%] md:justify-end md:pr-6">
            <div className="relative flex items-center justify-center">
              <QuestionMedia
                image={question.image}
                emoji={question.emoji}
                alt={question.answer}
                variant={mediaVariant}
              />

              {(hintText || hintLoading) && (
                <div className="absolute inset-x-0 -bottom-2 md:-bottom-4 z-10 mx-auto max-w-[90%] bg-answer4/95 text-black rounded-xl px-3 py-2 text-[11px] font-bold border-2 border-black shadow-lg flex items-start gap-1.5">
                  <Lightbulb className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                  <span className="flex-1 line-clamp-2">
                    {hintLoading ? "Thinking…" : hintText}
                  </span>
                  {hintText && (
                    <button type="button" onClick={() => setHintText(null)} aria-label="Close hint">
                      <X className="h-3.5 w-3.5 shrink-0" />
                    </button>
                  )}
                </div>
              )}

              {question.clues && roundState === "playing" && (
                <div className="absolute top-2 inset-x-2 flex flex-wrap gap-1 justify-center z-10">
                  {question.clues.slice(0, 2).map((clue, i) => (
                    <span
                      key={i}
                      className="text-[9px] font-bold bg-black/60 text-white px-2 py-0.5 rounded-full backdrop-blur-sm"
                    >
                      {clue}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT – question + answers + controls */}
          <div className="shrink-0 md:flex-1 md:max-w-[44%] md:min-w-[300px] flex flex-col gap-2 md:gap-3 justify-center min-h-0 pt-2 md:pt-0">
            <p className="text-center md:text-left text-sm md:text-base font-black text-white leading-tight">
              {question.question}
            </p>

            <div className="shrink-0">
              {roundState === "playing" ? (
                <div className="grid grid-cols-2 gap-2 md:gap-2.5">
                  {options.map((option, i) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleAnswer(option)}
                      className={cn(
                        "rounded-2xl h-[3.25rem] md:h-14 px-2 font-black text-xs md:text-sm text-black text-center",
                        "border-[3px] border-black active:scale-[0.97] transition-transform duration-100",
                        "flex items-center justify-center leading-tight line-clamp-2 touch-target"
                      )}
                      style={{ backgroundColor: answerColors[i % answerColors.length] }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              ) : (
                <ResultStrip
                  roundState={roundState}
                  question={question}
                  displayFact={displayFact}
                  onNext={handleNext}
                />
              )}
            </div>

            {roundState === "playing" && (
              <div className="shrink-0 flex gap-2 h-10 md:h-11">
                <button
                  type="button"
                  disabled={hintsUsed >= game.maxHints || hintLoading}
                  onClick={handleHint}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-full text-[11px] md:text-xs font-bold text-white/90 bg-white/10 border border-white/20 disabled:opacity-40 touch-target hover:bg-white/15 transition-colors"
                >
                  <Lightbulb className="h-3.5 w-3.5" />
                  AI Hint ({game.maxHints - hintsUsed})
                </button>
                <button
                  type="button"
                  disabled={skipsUsed >= game.maxSkips}
                  onClick={handleSkip}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-full text-[11px] md:text-xs font-bold text-white/90 bg-white/10 border border-white/20 disabled:opacity-40 touch-target hover:bg-white/15 transition-colors"
                >
                  <SkipForward className="h-3.5 w-3.5" />
                  Skip ({game.maxSkips - skipsUsed})
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Compact HUD bar ── */
function PlayHUD({
  backHref,
  title,
  categoryEmoji,
  categoryName,
  isDaily,
  currentIndex,
  total,
  score,
  progress,
  timeLeft,
}: {
  backHref: string;
  title: string;
  categoryEmoji?: string;
  categoryName?: string;
  isDaily?: boolean;
  currentIndex: number;
  total: number;
  score: number;
  progress: number;
  timeLeft?: number;
}) {
  return (
    <header className="shrink-0 px-3 md:px-6 pt-[max(0.5rem,env(safe-area-inset-top))] pb-2 space-y-1.5 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between gap-2">
        <Link
          href={backHref}
          className="flex items-center gap-1 text-white/80 hover:text-white font-bold text-xs shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <span className="text-white font-black text-xs truncate flex-1 text-center">
          {title}
        </span>
        <div className="flex items-center gap-1 shrink-0">
          {isDaily && (
            <span className="bg-answer4 text-black text-[8px] font-black px-1.5 py-0.5 rounded-full border border-black">
              Daily
            </span>
          )}
          {categoryEmoji && (
            <span className="text-white/70 text-[10px] font-bold">
              {categoryEmoji}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 text-[10px] font-bold text-white/70">
        <span>
          {Math.min(currentIndex + 1, total)}/{total}
        </span>
        <div className="flex-1 h-1.5 rounded-full bg-white/20 overflow-hidden">
          <div
            className="h-full rounded-full bg-btn-green transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="flex items-center gap-0.5">
          <Star className="h-2.5 w-2.5 text-answer4 fill-answer4" />
          {score}
        </span>
        {timeLeft !== undefined && (
          <span
            className={cn(
              "flex items-center gap-0.5 tabular-nums",
              timeLeft <= 5 && "text-red-400"
            )}
          >
            <Clock className="h-2.5 w-2.5" />
            {timeLeft}s
          </span>
        )}
      </div>
    </header>
  );
}

/* ── In-place result (replaces answer grid, same height) ── */
function ResultStrip({
  roundState,
  question,
  displayFact,
  onNext,
}: {
  roundState: "correct" | "incorrect";
  question: GameQuestion;
  displayFact: string | null;
  onNext: () => void;
}) {
  const isCorrect = roundState === "correct";
  return (
    <div
      className={cn(
        "rounded-2xl border-[3px] border-black p-3 flex flex-col gap-2",
        isCorrect ? "bg-btn-green" : "bg-white"
      )}
    >
      <div className="flex items-center gap-1.5 font-black text-sm text-black">
        {isCorrect ? (
          <>
            <CheckCircle2 className="h-4 w-4 shrink-0" /> Correct!
          </>
        ) : (
          <>
            <XCircle className="h-4 w-4 shrink-0" /> It was {question.answer}
          </>
        )}
      </div>
      <p className="text-[11px] font-bold text-black/75 line-clamp-2 leading-snug">
        📚 {displayFact ?? question.fact}
      </p>
      <QuizButton
        color={isCorrect ? "green-dark" : "cyan"}
        textColor={isCorrect ? "white" : "black"}
        className="w-full !h-10 !text-sm"
        onClick={onNext}
      >
        Continue
      </QuizButton>
    </div>
  );
}
