"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { X, Lightbulb } from "lucide-react";
import type { Game, GameQuestion } from "@/lib/types";
import { QuestionMedia } from "@/components/game/question-media";
import { inferMediaVariant } from "@/lib/media/images";
import { usePlayerProgress } from "@/hooks/use-player-progress";
import { useGameSettings } from "@/hooks/use-game-settings";
import { calcRoundXp, calcRoundCoins } from "@/lib/game/session-utils";
import {
  buildSessionQueue,
  shuffleOptions,
  getAnswerPool,
  recordSessionQuestions,
} from "@/lib/game/question-engine";
import {
  warmSessionImages,
  preloadQuestions,
} from "@/hooks/use-question-image";
import { ensureQuestionImages, wikiFromQuestionId } from "@/lib/media/resolve-image";
import { DEFAULT_SETTINGS } from "@/lib/game/settings";
import { audioManager } from "@/lib/audio/audio-manager";
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

function buildInitialSession(game: Game, count: number) {
  const pool = ensureQuestionImages(game.questions);
  return buildSessionQueue(pool, game.slug, count);
}

export function GamePlayer({
  game: initialGame,
  isDaily,
  categoryName,
  categorySlug,
  categoryEmoji,
}: GamePlayerProps) {
  const { stats, hydrated, recordGame } = usePlayerProgress();
  const { settings, hydrated: settingsHydrated } = useGameSettings();

  const [pool, setPool] = useState<GameQuestion[]>(() =>
    ensureQuestionImages(initialGame.questions)
  );
  const [sessionQuestions, setSessionQuestions] = useState<GameQuestion[]>(() =>
    buildInitialSession(initialGame, DEFAULT_SETTINGS.questionCount)
  );
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
  const [hintText, setHintText] = useState<string | null>(null);
  const [hintLoading, setHintLoading] = useState(false);
  const [displayFact, setDisplayFact] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>([]);
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
  const [firstQuestion, setFirstQuestion] = useState(true);

  const timerLimit = settingsHydrated
    ? settings.timer
    : (initialGame.timeLimit ?? 20);
  const [timeLeft, setTimeLeft] = useState(timerLimit);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const playRootRef = useRef<HTMLDivElement>(null);
  const freezeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recordedRef = useRef(false);
  const answerTimeRef = useRef(Date.now());
  const answerPoolRef = useRef<string[]>(
    getAnswerPool(ensureQuestionImages(initialGame.questions))
  );

  const variantForQuestion = useCallback(
    (q: GameQuestion) =>
      inferMediaVariant(initialGame.slug, initialGame.mode, {
        hasImage: !!q.image,
        hasEmoji: !!q.emoji,
      }),
    [initialGame.slug, initialGame.mode]
  );

  // Image pipeline — warm entire session on entry, keep 6-question rolling buffer
  useEffect(() => {
    warmSessionImages(sessionQuestions, variantForQuestion);
  }, [sessionQuestions, variantForQuestion]);

  useEffect(() => {
    preloadQuestions(sessionQuestions, currentIndex, variantForQuestion, 6);
  }, [currentIndex, sessionQuestions, variantForQuestion]);

  // Touchpad / wheel scroll when body is locked (play-mode)
  useEffect(() => {
    const scroller = scrollRef.current;
    const root = playRootRef.current;
    if (!scroller || !root) return;

    const onWheel = (e: WheelEvent) => {
      if (scroller.scrollHeight <= scroller.clientHeight) return;
      scroller.scrollTop += e.deltaY;
      e.preventDefault();
    };

    root.addEventListener("wheel", onWheel, { passive: false });
    return () => root.removeEventListener("wheel", onWheel);
  }, []);

  const question = sessionQuestions[currentIndex];
  const backHref = categorySlug ? `/categories/${categorySlug}` : "/categories";
  const mediaVariant = inferMediaVariant(initialGame.slug, initialGame.mode, {
    hasImage: !!question?.image,
    hasEmoji: !!question?.emoji,
  });
  const isTextRound = mediaVariant === "text";
  const baseXpPerQ = sessionQuestions.length
    ? Math.round(initialGame.xpReward / sessionQuestions.length)
    : initialGame.xpReward;

  const resetRound = useCallback(
    (q: GameQuestion, hideWrong = 0) => {
      setOptions(shuffleOptions(q, answerPoolRef.current, hideWrong));
      setHintText(null);
      setDisplayFact(null);
      setSelectedAnswer(null);
      setShowReveal(false);
      if (timerLimit) setTimeLeft(timerLimit);
      answerTimeRef.current = Date.now();
    },
    [timerLimit]
  );

  // Background: fetch full pool and upgrade session (never blocks UI)
  useEffect(() => {
    if (!settingsHydrated) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(
          `/api/games/${initialGame.slug}/session?count=${settings.questionCount}`
        );
        if (!res.ok || cancelled) return;
        const data = (await res.json()) as Game & { questions: GameQuestion[] };
        const source = ensureQuestionImages(data.questions ?? []);
        if (cancelled || source.length === 0) return;

        setPool(source);
        answerPoolRef.current = getAnswerPool(source);
        const session = buildSessionQueue(source, initialGame.slug, settings.questionCount);
        if (session.length === 0 || cancelled) return;

        setSessionQuestions(session);
        setCurrentIndex(0);
        warmSessionImages(session, variantForQuestion);
      } catch {
        /* keep SSR session */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [initialGame.slug, settings.questionCount, settingsHydrated, variantForQuestion]);

  useEffect(() => {
    if (settingsHydrated && timerLimit) setTimeLeft(timerLimit);
  }, [settingsHydrated, timerLimit]);

  useEffect(() => {
    if (!question) return;
    resetRound(question);
    setRoundState("playing");
  }, [currentIndex, question?.id, resetRound]);

  const enrichFact = useCallback(async (baseFact: string, answer: string) => {
    setDisplayFact(baseFact);
    try {
      const res = await fetch("/api/ai/fact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer, context: baseFact }),
      });
      const data = await res.json();
      if (data.fact) setDisplayFact(data.fact);
    } catch {
      /* keep base fact */
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
      audioManager.playWrong();
      enrichFact(question.fact, question.answer);
    },
    [question, roundState, enrichFact]
  );

  useEffect(() => {
    if (!timerLimit || roundState !== "playing" || timerFrozen) {
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
        if (t <= 5 && t > 4) audioManager.play("countdown");
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, roundState, timerLimit, timerFrozen, handleWrong]);

  const handleAnswer = useCallback(
    (answer: string) => {
      if (roundState !== "playing" || !question) return;
      if (timerRef.current) clearInterval(timerRef.current);

      const elapsed = Date.now() - answerTimeRef.current;
      const fastBonus = timerLimit ? elapsed < timerLimit * 500 : elapsed < 8000;
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
        audioManager.playCorrect();
      } else {
        handleWrong(answer);
        return;
      }

      enrichFact(question.fact, question.answer);
    },
    [roundState, question, combo, baseXpPerQ, doubleXpActive, timerLimit, handleWrong, enrichFact]
  );

  const advanceQuestion = useCallback(() => {
    audioManager.playNext();
    setFirstQuestion(false);
    if (currentIndex + 1 >= sessionQuestions.length) {
      setRoundState("finished");
      recordSessionQuestions(
        initialGame.slug,
        sessionQuestions.map((q) => q.id)
      );
    } else {
      setRoundState("playing");
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, sessionQuestions, initialGame.slug]);

  const startNewSession = useCallback(() => {
    const source = pool.length > 0 ? pool : ensureQuestionImages(initialGame.questions);
    const session = buildSessionQueue(source, initialGame.slug, settings.questionCount);
    setSessionQuestions(session);
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
    setFirstQuestion(true);
    recordedRef.current = false;
    if (session[0]) resetRound(session[0]);
    warmSessionImages(session, variantForQuestion);
  }, [pool, initialGame.slug, settings.questionCount, resetRound, variantForQuestion]);

  useEffect(() => {
    if (roundState !== "finished" || recordedRef.current) return;
    recordedRef.current = true;
    const outcome = recordGame({
      gameId: initialGame.id,
      gameSlug: initialGame.slug,
      categoryId: initialGame.categoryId,
      score,
      totalQuestions: sessionQuestions.length,
      xpEarned: sessionXp,
      isDaily,
    });
    setNewAchievements(outcome.newAchievements);
    setBonusXp(outcome.bonusXp);
    audioManager.play("victory");
  }, [roundState, score, initialGame, isDaily, recordGame, sessionXp, sessionQuestions.length]);

  const handleHint = async () => {
    if (!settings.hintsEnabled || hintsUsed >= initialGame.maxHints || !question || hintLoading) return;
    setHintsUsed((h) => h + 1);
    setHintLoading(true);
    audioManager.play("powerUp");
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
    if (skipsUsed >= initialGame.maxSkips) return;
    setSkipsUsed((s) => s + 1);
    setCombo(0);
    advanceQuestion();
  };

  const handleFifty = () => {
    if (fiftyUsed >= 1 || !question) return;
    setFiftyUsed(1);
    setOptions(shuffleOptions(question, answerPoolRef.current, 2));
    audioManager.play("powerUp");
  };

  const handleFreeze = () => {
    if (freezeUsed >= 1 || !timerLimit) return;
    setFreezeUsed(1);
    setTimerFrozen(true);
    audioManager.play("powerUp");
    if (freezeRef.current) clearTimeout(freezeRef.current);
    freezeRef.current = setTimeout(() => setTimerFrozen(false), 5000);
  };

  const handleReveal = () => {
    if (revealUsed >= 1) return;
    setRevealUsed(1);
    setShowReveal(true);
    audioManager.play("powerUp");
  };

  const handleDouble = () => {
    if (doubleXpActive) return;
    setDoubleXpActive(true);
    audioManager.play("powerUp");
  };

  const maxHints = settings.hintsEnabled ? initialGame.maxHints : 0;

  if (!question && roundState !== "finished") {
    return (
      <div className="flex-1 flex items-center justify-center text-black/50 font-bold text-sm">
        Preparing questions…
      </div>
    );
  }

  const totalCoins = (hydrated ? stats.coins ?? 0 : 0) + sessionCoins;
  const playerXp = hydrated ? stats.xp : 0;
  const playerLevel = hydrated ? stats.level : 1;
  const playerStreak = hydrated ? stats.streak : 0;
  const animateEntry = firstQuestion && settings.animations === "full";

  return (
    <div ref={playRootRef} className="relative flex flex-col h-dvh max-h-dvh overflow-hidden w-full">
      <PlayHud
        backHref={backHref}
        level={playerLevel}
        xp={playerXp + sessionXp}
        coins={totalCoins}
        streak={playerStreak}
        lives={lives}
        score={score}
        currentIndex={currentIndex}
        total={sessionQuestions.length}
        settingsDifficulty={settings.difficulty}
        timerSeconds={timerLimit}
        categoryEmoji={categoryEmoji}
        isDaily={isDaily}
        combo={combo}
        timeLeft={timerLimit > 0 && roundState === "playing" ? timeLeft : undefined}
        timerFrozen={timerFrozen}
        sessionXp={sessionXp}
        sessionCoins={sessionCoins}
      />

      {roundState === "finished" ? (
        <PlayVictoryScreen
          score={score}
          total={sessionQuestions.length}
          xpEarned={sessionXp + bonusXp + (isDaily ? 25 : 0)}
          coinsEarned={sessionCoins}
          bestCombo={bestCombo}
          accuracy={Math.round((score / sessionQuestions.length) * 100)}
          newAchievements={newAchievements}
          backHref={backHref}
          onReplay={startNewSession}
        />
      ) : (
        <div className="relative z-10 flex-1 min-h-0 flex flex-col overflow-hidden">
          <div
            ref={scrollRef}
            className="play-scroll-area flex-1 min-h-0 flex flex-col overflow-y-auto overscroll-y-auto px-3 md:px-6 lg:px-10 xl:px-12 pt-1 pb-[calc(6.5rem+env(safe-area-inset-bottom))] md:pb-6"
          >
            <div className="flex flex-1 min-h-0 items-stretch justify-center gap-4 lg:gap-8 w-full max-w-[1720px] mx-auto">
              <PlaySidePanel
                level={playerLevel}
                xp={playerXp + sessionXp}
                streak={playerStreak}
                categoryName={categoryName}
                categoryEmoji={categoryEmoji}
                collectedThisSession={collected}
                isDaily={isDaily}
                score={score}
                currentIndex={currentIndex}
                total={sessionQuestions.length}
                combo={combo}
                bestCombo={bestCombo}
              />

              <div className="play-game-card play-game-card--fill flex-1 min-w-0 min-h-0 flex flex-col md:flex-row items-center md:items-stretch gap-3 md:gap-8 lg:gap-12 p-3 md:p-8 lg:p-10">
                <div className="relative shrink-0 flex items-center justify-center w-full md:flex-1 md:min-h-0 md:max-w-[50%] min-h-[200px] md:min-h-0">
                    <QuestionMedia
                      key={question.id}
                      frameless
                      compact={mediaVariant === "product"}
                      wikiKey={wikiFromQuestionId(question.id)}
                      image={question.image}
                      emoji={question.emoji}
                      text={question.question}
                      alt=""
                      variant={mediaVariant}
                      categoryEmoji={categoryEmoji}
                      className="h-full"
                    />

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

                <div className="w-full md:flex-1 md:min-h-0 md:max-w-[50%] flex flex-col justify-center gap-2 md:gap-4 lg:gap-6">
                  <PlayQuestionHeader
                    categoryEmoji={categoryEmoji}
                    categoryName={categoryName}
                    gameTitle={initialGame.title}
                    questionText={question.question}
                    difficulty={settings.difficulty}
                    isTextRound={isTextRound}
                    questionId={question.id}
                    animateEntry={animateEntry}
                  />

                  <PlayAnswerGrid
                    options={options}
                    correctAnswer={question.answer}
                    selectedAnswer={selectedAnswer}
                    revealed={roundState === "correct" || roundState === "incorrect"}
                    disabled={roundState !== "playing"}
                    onSelect={handleAnswer}
                    questionId={question.id}
                    animateEntry={animateEntry}
                    className="lg:gap-4 xl:gap-5"
                  />

                  {roundState === "playing" && (
                    <div className="hidden md:block">
                      <PlayPowerUps
                        hintsLeft={maxHints - hintsUsed}
                        skipsLeft={initialGame.maxSkips - skipsUsed}
                        fiftyLeft={1 - fiftyUsed}
                        freezeLeft={timerLimit ? 1 - freezeUsed : 0}
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

          {roundState === "playing" && (
            <div className="shrink-0 md:hidden border-t border-black/10 bg-[#fffdf4] px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              <PlayPowerUps
                compact
                hintsLeft={maxHints - hintsUsed}
                skipsLeft={initialGame.maxSkips - skipsUsed}
                fiftyLeft={1 - fiftyUsed}
                freezeLeft={timerLimit ? 1 - freezeUsed : 0}
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
          onContinue={advanceQuestion}
        />
      )}
    </div>
  );
}
