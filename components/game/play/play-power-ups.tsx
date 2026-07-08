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
  compact?: boolean;
}

const ICON = "h-3.5 w-3.5 md:h-4 md:w-4 shrink-0";

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
  compact,
}: PlayPowerUpsProps) {
  const items: (PowerUp & { onClick: () => void })[] = [
    { id: "hint", icon: <Lightbulb className={ICON} strokeWidth={2.25} />, label: "Hint", count: hintsLeft, disabled: hintsLeft <= 0 || hintLoading, onClick: onHint },
    { id: "skip", icon: <SkipForward className={ICON} strokeWidth={2.25} />, label: "Skip", count: skipsLeft, disabled: skipsLeft <= 0, onClick: onSkip },
    { id: "fifty", icon: <SplitSquareHorizontal className={ICON} strokeWidth={2.25} />, label: "50/50", count: fiftyLeft, disabled: fiftyLeft <= 0, onClick: onFifty },
    { id: "freeze", icon: <Snowflake className={ICON} strokeWidth={2.25} />, label: "Freeze", count: freezeLeft, disabled: freezeLeft <= 0, onClick: onFreeze },
    { id: "reveal", icon: <Eye className={ICON} strokeWidth={2.25} />, label: "Reveal", count: revealLeft, disabled: revealLeft <= 0, onClick: onReveal },
    { id: "double", icon: <Zap className={ICON} strokeWidth={2.25} />, label: "2× XP", count: doubleActive ? 0 : 1, disabled: doubleActive, onClick: onDouble },
  ];

  return (
    <div
      className={cn(
        "grid gap-1.5 md:gap-2",
        compact ? "grid-cols-6" : "grid-cols-3 md:grid-cols-6"
      )}
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          disabled={item.disabled}
          onClick={item.onClick}
          className={cn(
            "play-powerup-btn",
            compact && "play-powerup-btn-compact",
            item.disabled && "opacity-40 cursor-not-allowed",
            item.id === "double" && doubleActive && "ring-2 ring-answer4"
          )}
        >
          {item.icon}
          <span className="text-[9px] md:text-[9px] font-black leading-none mt-0.5 truncate max-w-full px-0.5">
            {item.label}
          </span>
          {item.count > 0 && (
            <span className="play-powerup-badge">{item.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}
