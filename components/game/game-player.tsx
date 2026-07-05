"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { X, Lightbulb } from "lucide-react";
import type { Game, GameQuestion } from "@/lib/types";
import { QuestionMedia } from "@/components/game/question-media";
import { inferMediaVariant } from "@/lib/media/images";
import { usePlayerProgress } from "@/hooks/use-player-progress";
import { calcRoundXp, calcRoundCoins } from "@/lib/game/session-utils";
import { PlayHud } from "@/components/game/play/play-hud";
import { PlayAnswerGrid } from "@/components/game/play/play-answer-grid";
import { PlayPowerUps } from "@/components/game/play/play-power-ups";
import { PlayResultCelebration } from "@/components/game/play/play-result-celebration";
import { PlayVictoryScreen } from "@/components/game/play/play-victory-screen";
import { PlayQuestionHeader } from "@/components/game/play/play-question-header";
import { PlaySidePanel } from "@/components/game/play/play-side-panel";

interface GamePlayerProps {
  game: Game;
  isDaily?: boolean;
  categoryName?: string;
  categorySlug?: string;
  categoryEmoji?: string;
}

type RoundState = "playing" | "correct" | "incorrect" | "finished";

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getOptions(question: GameQuestion, hideCount = 0): string[] {
  const all = shuffleArray([question.answer, ...(question.alternatives ?? [])]);
  if (hideCount <= 0) return all;
  const wrong = all.filter((o) => o.toLowerCase() !== question.answer.toLowerCase());
  const kept = wrong.slice(0, Math.max(0, wrong.length - hideCount));
  return shuffleArray([question.answer, ...kept]);
}

export function GamePlayer({
  game,
  isDaily,
  categoryName,
  categorySlug,
  categoryEmoji,
}: GamePlayerProps) {
  const { stats, hydrated, recordGame } = usePlayerProgress();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [roundState, setRoundState] = useState<RoundState>("playing");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [skipsUsed, setSkipsUsed] = useState(0);
  const [fiftyUsed, setFiftyUsed] = useState(0);
  const [freezeUsed, setFreezeUsed] = useState(0);
  const [revealUsed, setRevealUsed] = useState(0);
  const [doubleXpActive, setDoubleXpActive] = useState(false);
  const [timerFrozen, setTimerFrozen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(game.timeLimit ?? 0);
  const [hintText, setHintText] = useState<string | null>(null);
  const [hintLoading, setHintLoading] = useState(false);
  const [displayFact, setDisplayFact] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>(() =>
    game.questions[0] ? getOptions(game.questions[0]) : []
  );
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [sessionCoins, setSessionCoins] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);
  const [lastRoundXp, setLastRoundXp] = useState(0);
  const [lastRoundCoins, setLastRoundCoins] = useState(0);
  const [collected, setCollected] = useState(0);
  const [newAchievements, setNewAchievements] = useState<string[]>([]);
  const [bonusXp, setBonusXp] = useState(0);
  const [showReveal, setShowReveal] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const freezeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recordedRef = useRef(false);
  const answerTimeRef = useRef(Date.now());

  const question = game.questions[currentIndex];
  const backHref = categorySlug ? `/categories/${categorySlug}` : "/categories";
  const mediaVariant = inferMediaVariant(game.slug, game.mode, {
    hasImage: !!question?.image,
    hasEmoji: !!question?.emoji,
  });
  const isTextRound = mediaVariant === "text";
  const baseXpPerQ = Math.round(game.xpReward / game.questions.length);

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
    setShowReveal(false);
    if (game.timeLimit) setTimeLeft(game.timeLimit);
    answerTimeRef.current = Date.now();
  }, [currentIndex, game.timeLimit, question?.id]);

  const enrichFact = useCallback(async (baseFact: string, answer: string) => {
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
  }, []);

  const handleWrong = useCallback(
    (answer: string | null) => {
      if (!question || roundState !== "playing") return;
      if (timerRef.current) clearInterval(timerRef.current);
      setSelectedAnswer(answer);
      setCombo(0);
      setLives((l) => Math.max(0, l - 1));
      setRoundState("incorrect");
      enrichFact(question.fact, question.answer);
    },
    [question, roundState, enrichFact]
  );

  useEffect(() => {
    if (!game.timeLimit || roundState !== "playing" || timerFrozen) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleWrong(null);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, roundState, game.timeLimit, timerFrozen, handleWrong]);

  const handleAnswer = useCallback(
    (answer: string) => {
      if (roundState !== "playing" || !question) return;
      if (timerRef.current) clearInterval(timerRef.current);

      const elapsed = Date.now() - answerTimeRef.current;
      const fastBonus = game.timeLimit ? elapsed < game.timeLimit * 500 : elapsed < 8000;
      const isCorrect = answer.toLowerCase() === question.answer.toLowerCase();

      setSelectedAnswer(answer);

      if (isCorrect) {
        const newCombo = combo + 1;
        setCombo(newCombo);
        setBestCombo((b) => Math.max(b, newCombo));
        setScore((s) => s + 1);
        setCollected((c) => c + 1);

        const xp = calcRoundXp(baseXpPerQ, newCombo, fastBonus, doubleXpActive);
        const coins = calcRoundCoins(newCombo);
        setSessionXp((x) => x + xp);
        setSessionCoins((c) => c + coins);
        setLastRoundXp(xp);
        setLastRoundCoins(coins);
        setDoubleXpActive(false);
        setRoundState("correct");
      } else {
        handleWrong(answer);
        return;
      }

      enrichFact(question.fact, question.answer);
    },
    [roundState, question, combo, baseXpPerQ, doubleXpActive, game.timeLimit, handleWrong, enrichFact]
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
    setFiftyUsed(0);
    setFreezeUsed(0);
    setRevealUsed(0);
    setDoubleXpActive(false);
    setCombo(0);
    setBestCombo(0);
    setLives(3);
    setSessionCoins(0);
    setSessionXp(0);
    setCollected(0);
    setHintText(null);
    setDisplayFact(null);
    setNewAchievements([]);
    setBonusXp(0);
    recordedRef.current = false;
    if (game.timeLimit) setTimeLeft(game.timeLimit);
    if (game.questions[0]) setOptions(getOptions(game.questions[0]));
  }, [game.timeLimit, game.questions]);

  useEffect(() => {
    if (roundState !== "finished" || recordedRef.current) return;
    recordedRef.current = true;
    const outcome = recordGame({
      gameId: game.id,
      gameSlug: game.slug,
      categoryId: game.categoryId,
      score,
      totalQuestions: game.questions.length,
      xpEarned: sessionXp,
      isDaily,
    });
    setNewAchievements(outcome.newAchievements);
    setBonusXp(outcome.bonusXp);
  }, [roundState, score, game, isDaily, recordGame, sessionXp]);

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

  const handleSkip = () => {
    if (skipsUsed >= game.maxSkips) return;
    setSkipsUsed((s) => s + 1);
    setCombo(0);
    handleNext();
  };

  const handleFifty = () => {
    if (fiftyUsed >= 1 || !question) return;
    setFiftyUsed(1);
    setOptions(getOptions(question, 2));
  };

  const handleFreeze = () => {
    if (freezeUsed >= 1 || !game.timeLimit) return;
    setFreezeUsed(1);
    setTimerFrozen(true);
    if (freezeRef.current) clearTimeout(freezeRef.current);
    freezeRef.current = setTimeout(() => setTimerFrozen(false), 5000);
  };

  const handleReveal = () => {
    if (revealUsed >= 1) return;
    setRevealUsed(1);
    setShowReveal(true);
  };

  const handleDouble = () => {
    if (doubleXpActive) return;
    setDoubleXpActive(true);
  };

  if (!question && roundState !== "finished") return null;

  const totalCoins = (hydrated ? stats.coins ?? 0 : 0) + sessionCoins;
  const playerXp = hydrated ? stats.xp : 0;
  const playerLevel = hydrated ? stats.level : 1;
  const playerStreak = hydrated ? stats.streak : 0;

  return (
    <div className="relative flex flex-col h-dvh max-h-dvh overflow-hidden w-full">
      <PlayHud
        backHref={backHref}
        level={playerLevel}
        xp={playerXp + sessionXp}
        coins={totalCoins}
        streak={playerStreak}
        lives={lives}
        score={score}
        currentIndex={currentIndex}
        total={game.questions.length}
        difficulty={question?.difficulty ?? game.difficulty}
        categoryEmoji={categoryEmoji}
        isDaily={isDaily}
        combo={combo}
        timeLeft={game.timeLimit && roundState === "playing" ? timeLeft : undefined}
        timerFrozen={timerFrozen}
      />

      {roundState === "finished" ? (
        <PlayVictoryScreen
          score={score}
          total={game.questions.length}
          xpEarned={sessionXp + bonusXp + (isDaily ? 25 : 0)}
          coinsEarned={sessionCoins}
          bestCombo={bestCombo}
          accuracy={Math.round((score / game.questions.length) * 100)}
          newAchievements={newAchievements}
          backHref={backHref}
          onReplay={handleRestart}
        />
      ) : (
        <div className="relative z-10 flex-1 min-h-0 flex flex-col overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 md:px-5 pt-2 pb-2">
            <div className="flex items-start justify-center gap-4 max-w-6xl mx-auto w-full">
              <PlaySidePanel
                level={playerLevel}
                xp={playerXp + sessionXp}
                streak={playerStreak}
                categoryName={categoryName}
                categoryEmoji={categoryEmoji}
                collectedThisSession={collected}
                isDaily={isDaily}
              />

              <div className="play-game-card flex-1 min-w-0 flex flex-col md:flex-row items-center gap-3 md:gap-6 p-3 md:p-6">
                {/* Media */}
                <div className="relative shrink-0 flex items-center justify-center w-full md:flex-1 md:max-w-[48%]">
                  <div className="play-media-frame">
                    <QuestionMedia
                      image={question.image}
                      emoji={question.emoji}
                      text={question.question}
                      alt={question.answer}
                      variant={mediaVariant}
                    />
                  </div>

                  {(hintText || hintLoading) && (
                    <div className="absolute -bottom-2 inset-x-0 z-10 mx-auto max-w-[95%] bg-answer4/95 text-black rounded-xl px-3 py-2 text-[11px] font-bold border-2 border-black shadow-lg flex items-start gap-1.5">
                      <Lightbulb className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      <span className="flex-1 line-clamp-2">
                        {hintLoading ? "Thinking…" : hintText}
                      </span>
                      {hintText && (
                        <button type="button" onClick={() => setHintText(null)} aria-label="Close">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  )}

                  {showReveal && categoryName && (
                    <div className="absolute top-2 inset-x-2 z-10 bg-btn-cyan/90 text-black text-xs font-black text-center py-1.5 rounded-full border-2 border-black">
                      Category: {categoryName}
                    </div>
                  )}
                </div>

                {/* Answers */}
                <div className="w-full md:flex-1 md:max-w-[48%] flex flex-col gap-2 md:gap-3">
                  <PlayQuestionHeader
                    categoryEmoji={categoryEmoji}
                    categoryName={categoryName}
                    gameTitle={game.title}
                    questionText={question.question}
                    difficulty={question.difficulty}
                    isTextRound={isTextRound}
                  />

                  <PlayAnswerGrid
                    options={options}
                    correctAnswer={question.answer}
                    selectedAnswer={selectedAnswer}
                    revealed={roundState === "correct" || roundState === "incorrect"}
                    disabled={roundState !== "playing"}
                    onSelect={handleAnswer}
                  />

                  {/* Desktop: power-ups inline */}
                  {roundState === "playing" && (
                    <div className="hidden md:block">
                      <PlayPowerUps
                        hintsLeft={game.maxHints - hintsUsed}
                        skipsLeft={game.maxSkips - skipsUsed}
                        fiftyLeft={1 - fiftyUsed}
                        freezeLeft={game.timeLimit ? 1 - freezeUsed : 0}
                        revealLeft={1 - revealUsed}
                        doubleActive={doubleXpActive}
                        hintLoading={hintLoading}
                        onHint={handleHint}
                        onSkip={handleSkip}
                        onFifty={handleFifty}
                        onFreeze={handleFreeze}
                        onReveal={handleReveal}
                        onDouble={handleDouble}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile: sticky power-up bar — always fully visible */}
          {roundState === "playing" && (
            <div className="shrink-0 md:hidden border-t border-black/10 bg-[#fffdf4] px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <PlayPowerUps
                compact
                hintsLeft={game.maxHints - hintsUsed}
                skipsLeft={game.maxSkips - skipsUsed}
                fiftyLeft={1 - fiftyUsed}
                freezeLeft={game.timeLimit ? 1 - freezeUsed : 0}
                revealLeft={1 - revealUsed}
                doubleActive={doubleXpActive}
                hintLoading={hintLoading}
                onHint={handleHint}
                onSkip={handleSkip}
                onFifty={handleFifty}
                onFreeze={handleFreeze}
                onReveal={handleReveal}
                onDouble={handleDouble}
              />
            </div>
          )}
        </div>
      )}

      {(roundState === "correct" || roundState === "incorrect") && (
        <PlayResultCelebration
          isCorrect={roundState === "correct"}
          answer={question.answer}
          fact={displayFact}
          xpGained={lastRoundXp}
          coinsGained={lastRoundCoins}
          combo={combo}
          onContinue={handleNext}
        />
      )}
    </div>
  );
}
