"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Dice5, Flame, Sparkles, Timer, Zap } from "lucide-react";
import { QuizButton } from "@/components/ui/quiz-button";
import { cn } from "@/lib/utils";

export interface PlaygroundGame {
  slug: string;
  title: string;
  emoji: string;
  categoryId: string;
}

const VIBES = [
  { id: "brainy", label: "Brainy", emoji: "🧠", hint: "Science & world facts" },
  { id: "chill", label: "Chill", emoji: "😎", hint: "Celebs, food & fun" },
  { id: "speed", label: "Speed", emoji: "⚡", hint: "Quick visual rounds" },
  { id: "wild", label: "Wild", emoji: "🎲", hint: "Surprise me" },
] as const;

const VIBE_CATEGORIES: Record<(typeof VIBES)[number]["id"], string[]> = {
  brainy: ["science", "geo", "history", "space"],
  chill: ["celebrities", "food", "animals", "music"],
  speed: ["movies", "tv", "geo", "sports"],
  wild: [],
};

const ACTIVITY_LINES = [
  "Someone just nailed Guess the Flag 🏳️",
  "A 12-streak just landed on Daily Challenge 🔥",
  "Mystery Spin picked Guess the Landmark 🏛️",
  "Player unlocked a hard movie round 🎬",
  "Blitz mode cleared in under 60s ⚡",
];

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function readStreak(): number {
  if (typeof window === "undefined") return 0;
  try {
    const raw = localStorage.getItem("quizzical-home-streak");
    if (!raw) return 0;
    const data = JSON.parse(raw) as { count: number; day: string };
    const today = new Date().toDateString();
    if (data.day === today) return data.count;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (data.day === yesterday.toDateString()) return data.count;
    return 0;
  } catch {
    return 0;
  }
}

function bumpStreak() {
  try {
    const today = new Date().toDateString();
    const raw = localStorage.getItem("quizzical-home-streak");
    let count = 1;
    if (raw) {
      const data = JSON.parse(raw) as { count: number; day: string };
      if (data.day === today) return data.count;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      count = data.day === yesterday.toDateString() ? data.count + 1 : 1;
    }
    localStorage.setItem(
      "quizzical-home-streak",
      JSON.stringify({ count, day: today })
    );
    return count;
  } catch {
    return 1;
  }
}

export function HomePlayground({ games }: { games: PlaygroundGame[] }) {
  const router = useRouter();
  const [spinning, setSpinning] = useState(false);
  const [picked, setPicked] = useState<PlaygroundGame | null>(null);
  const [streak, setStreak] = useState(0);
  const [vibe, setVibe] = useState<(typeof VIBES)[number]["id"]>("wild");
  const [activityIdx, setActivityIdx] = useState(0);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    setStreak(readStreak());
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setActivityIdx((i) => (i + 1) % ACTIVITY_LINES.length);
      setPulse((p) => p + 1);
    }, 3800);
    return () => clearInterval(id);
  }, []);

  const vibeGames = useMemo(() => {
    const cats = VIBE_CATEGORIES[vibe];
    if (!cats.length) return games;
    const filtered = games.filter((g) => cats.includes(g.categoryId));
    return filtered.length ? filtered : games;
  }, [games, vibe]);

  const blitzGames = useMemo(() => games.slice(0, 3), [games]);

  const spin = useCallback(() => {
    if (spinning || !vibeGames.length) return;
    setSpinning(true);
    setPicked(null);
    let ticks = 0;
    const id = setInterval(() => {
      setPicked(pickRandom(vibeGames));
      ticks += 1;
      if (ticks >= 12) {
        clearInterval(id);
        const final = pickRandom(vibeGames);
        setPicked(final);
        setSpinning(false);
        setStreak(bumpStreak());
      }
    }, 90);
  }, [spinning, vibeGames]);

  const playPicked = () => {
    if (!picked) return;
    setStreak(bumpStreak());
    router.push(`/play/${picked.slug}`);
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-3 md:gap-4">
      {/* Mystery Spin */}
      <div className="lg:col-span-5 rounded-2xl bg-white border border-black/15 p-4 md:p-5 shadow-soft-1 relative overflow-hidden">
        <div
          className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, #c6ea84 0%, transparent 70%)",
          }}
        />
        <div className="flex items-center gap-2 mb-3">
          <Dice5 className="h-5 w-5" />
          <h2 className="font-black text-lg">Mystery Spin</h2>
        </div>
        <p className="text-xs font-bold text-black/55 mb-4">
          Can&apos;t decide? Spin for a random quiz — no spoilers.
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {VIBES.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => setVibe(v.id)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-black border-2 transition-transform active:scale-95",
                vibe === v.id
                  ? "border-black bg-[#c6ea84] text-black"
                  : "border-black/15 bg-white text-black/60 hover:border-black/30"
              )}
            >
              {v.emoji} {v.label}
            </button>
          ))}
        </div>

        <div className="rounded-xl border-2 border-dashed border-black/20 bg-[#fffdf4] min-h-[88px] flex items-center justify-center mb-4 px-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={picked?.slug ?? "empty"}
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              className="text-center"
            >
              {picked ? (
                <>
                  <div className="text-3xl mb-1">{picked.emoji}</div>
                  <div className="font-black text-base">{picked.title}</div>
                </>
              ) : (
                <div className="text-sm font-bold text-black/40">
                  Hit spin — feel the chaos
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex gap-2">
          <QuizButton
            color="lime"
            textColor="black"
            className="!min-w-0 !h-11 !px-5 !text-sm flex-1"
            onClick={spin}
            disabled={spinning}
          >
            {spinning ? "Spinning…" : "Spin"}
          </QuizButton>
          <QuizButton
            color="green-dark"
            className="!min-w-0 !h-11 !px-5 !text-sm flex-1"
            onClick={playPicked}
            disabled={!picked || spinning}
          >
            Play it
          </QuizButton>
        </div>
      </div>

      {/* Streak + live pulse */}
      <div className="lg:col-span-3 flex flex-col gap-3">
        <div className="rounded-2xl bg-[#1a4d4a] text-white p-4 shadow-soft-1 flex-1 relative overflow-hidden">
          <motion.div
            key={pulse}
            className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          />
          <div className="flex items-center gap-2 mb-2">
            <Flame className="h-5 w-5 text-[#ffb020]" />
            <h2 className="font-black text-base">Your streak</h2>
          </div>
          <div className="text-5xl font-black leading-none mb-1">{streak}</div>
          <p className="text-xs font-bold text-white/70">
            {streak === 0
              ? "Play once today to light it up"
              : streak === 1
                ? "day — keep the fire going"
                : "days — you're on a roll"}
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-black/15 p-4 shadow-soft-1">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-[#00a76d]" />
            <h2 className="font-black text-sm">Live lobby</h2>
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={activityIdx}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }}
              className="text-xs font-bold text-black/65 min-h-[2.5rem]"
            >
              {ACTIVITY_LINES[activityIdx]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Blitz lane */}
      <div className="lg:col-span-4 rounded-2xl bg-white border border-black/15 p-4 md:p-5 shadow-soft-1">
        <div className="flex items-center gap-2 mb-1">
          <Zap className="h-5 w-5 text-[#e8a317]" />
          <h2 className="font-black text-lg">Blitz lane</h2>
        </div>
        <p className="text-xs font-bold text-black/55 mb-4">
          Jump straight into a hot round — no menu diving.
        </p>
        <div className="flex flex-col gap-2">
          {blitzGames.map((game, i) => (
            <Link
              key={game.slug}
              href={`/play/${game.slug}`}
              onClick={() => setStreak(bumpStreak())}
              className="group flex items-center gap-3 rounded-xl border border-black/12 bg-[#fffdf4] px-3 py-2.5 hover:border-black/30 hover:bg-white transition-colors active:scale-[0.98]"
            >
              <span className="text-2xl">{game.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-black text-sm truncate">{game.title}</div>
                <div className="text-[10px] font-bold text-black/45 flex items-center gap-1">
                  <Timer className="h-3 w-3" />
                  {i === 0 ? "Daily heat" : i === 1 ? "Crowd favorite" : "Fresh pick"}
                </div>
              </div>
              <span className="text-xs font-black text-[#00a76d] opacity-0 group-hover:opacity-100 transition-opacity">
                Go →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
