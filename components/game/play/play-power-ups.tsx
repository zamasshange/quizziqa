"use client";

import {
  Lightbulb,
  SkipForward,
  SplitSquareHorizontal,
  Snowflake,
  Eye,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type PowerUpId = "hint" | "skip" | "fifty" | "freeze" | "reveal" | "double";

interface PowerUp {
  id: PowerUpId;
  icon: React.ReactNode;
  label: string;
  count: number;
  disabled?: boolean;
}

interface PlayPowerUpsProps {
  hintsLeft: number;
  skipsLeft: number;
  fiftyLeft: number;
  freezeLeft: number;
  revealLeft: number;
  doubleActive: boolean;
  hintLoading?: boolean;
  onHint: () => void;
  onSkip: () => void;
  onFifty: () => void;
  onFreeze: () => void;
  onReveal: () => void;
  onDouble: () => void;
}

export function PlayPowerUps({
  hintsLeft,
  skipsLeft,
  fiftyLeft,
  freezeLeft,
  revealLeft,
  doubleActive,
  hintLoading,
  onHint,
  onSkip,
  onFifty,
  onFreeze,
  onReveal,
  onDouble,
}: PlayPowerUpsProps) {
  const items: (PowerUp & { onClick: () => void })[] = [
    { id: "hint", icon: <Lightbulb className="h-4 w-4" />, label: "AI Hint", count: hintsLeft, disabled: hintsLeft <= 0 || hintLoading, onClick: onHint },
    { id: "skip", icon: <SkipForward className="h-4 w-4" />, label: "Skip", count: skipsLeft, disabled: skipsLeft <= 0, onClick: onSkip },
    { id: "fifty", icon: <SplitSquareHorizontal className="h-4 w-4" />, label: "50/50", count: fiftyLeft, disabled: fiftyLeft <= 0, onClick: onFifty },
    { id: "freeze", icon: <Snowflake className="h-4 w-4" />, label: "Freeze", count: freezeLeft, disabled: freezeLeft <= 0, onClick: onFreeze },
    { id: "reveal", icon: <Eye className="h-4 w-4" />, label: "Reveal", count: revealLeft, disabled: revealLeft <= 0, onClick: onReveal },
    { id: "double", icon: <Zap className="h-4 w-4" />, label: "2× XP", count: doubleActive ? 0 : 1, disabled: doubleActive, onClick: onDouble },
  ];

  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5 md:gap-2">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          disabled={item.disabled}
          onClick={item.onClick}
          className={cn(
            "play-powerup-btn touch-target",
            item.disabled && "opacity-40 cursor-not-allowed",
            item.id === "double" && doubleActive && "ring-2 ring-answer4"
          )}
        >
          {item.icon}
          <span className="text-[9px] font-black leading-none mt-0.5">{item.label}</span>
          {item.count > 0 && (
            <span className="absolute -top-1 -right-1 bg-answer4 text-black text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-black">
              {item.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
