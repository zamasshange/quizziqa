"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getMediaProxyUrl } from "@/lib/media/media-url";
import type { MediaVariant } from "@/lib/media/images";

interface QuestionMediaProps {
  image?: string;
  emoji?: string;
  alt?: string;
  text?: string;
  variant: MediaVariant;
  className?: string;
  wikiKey?: string;
  /** Smaller frame — only for tall product images (phones, cars) on mobile */
  compact?: boolean;
}

function MediaImage({ wikiKey, fallbackSrc }: { wikiKey?: string; fallbackSrc?: string }) {
  const primarySrc = wikiKey ? getMediaProxyUrl(wikiKey) : fallbackSrc ?? "";
  const [currentSrc, setCurrentSrc] = useState(primarySrc);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setCurrentSrc(wikiKey ? getMediaProxyUrl(wikiKey) : fallbackSrc ?? "");
    setFailed(false);
    setAttempt(0);
  }, [wikiKey, fallbackSrc]);

  const handleError = () => {
    if (attempt === 0 && fallbackSrc && fallbackSrc !== currentSrc && fallbackSrc.startsWith("http")) {
      setAttempt(1);
      setCurrentSrc(fallbackSrc);
      return;
    }
    setFailed(true);
  };

  if (!currentSrc || failed) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full min-h-[100px] text-black/35 py-6">
        <span className="text-2xl">📷</span>
        <span className="text-[10px] font-bold mt-1">Image unavailable</span>
      </div>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={currentSrc}
      alt=""
      role="presentation"
      className="block max-w-full max-h-full w-auto h-auto object-contain mx-auto"
      onError={handleError}
      decoding="async"
      loading="eager"
      fetchPriority="high"
    />
  );
}

/** Only product (phone/car) uses compact on mobile — everything else keeps full size */
const FRAME: Record<MediaVariant, { normal: string; compact: string }> = {
  flag: {
    normal: "w-[240px] sm:w-[300px] h-[150px] sm:h-[188px]",
    compact: "w-[200px] h-[125px]",
  },
  landscape: {
    normal: "w-full max-w-[300px] sm:max-w-[380px] h-[180px] sm:h-[240px]",
    compact: "w-full max-w-[260px] h-[150px]",
  },
  food: {
    normal: "w-full max-w-[280px] sm:max-w-[360px] h-[180px] sm:h-[220px]",
    compact: "w-full max-w-[240px] h-[150px]",
  },
  square: {
    normal: "w-[200px] sm:w-[260px] h-[200px] sm:h-[260px]",
    compact: "w-[170px] h-[170px]",
  },
  product: {
    normal: "w-[140px] sm:w-[180px] h-[220px] sm:h-[280px]",
    compact: "w-[120px] h-[180px] max-h-[28vh]",
  },
  logo: {
    normal: "w-[180px] sm:w-[240px] h-[180px] sm:h-[240px]",
    compact: "w-[150px] h-[150px]",
  },
  portrait: {
    normal: "w-[180px] sm:w-[240px] md:w-[280px] h-[230px] sm:h-[300px] md:h-[360px]",
    compact: "w-[150px] h-[190px]",
  },
  emoji: { normal: "", compact: "" },
  text: { normal: "", compact: "" },
};

export function QuestionMedia({
  image,
  emoji,
  text,
  variant,
  className,
  wikiKey,
  compact = false,
}: QuestionMediaProps) {
  if (variant === "text" && text) {
    const quoteMatch = text.match(/^("[^"]+"|'[^']+')/);
    const quote = quoteMatch?.[1] ?? text;
    const prompt = quoteMatch
      ? text.slice(quoteMatch[0].length).replace(/^[.\s—–-]+/, "")
      : null;

    return (
      <div className={cn("flex items-center justify-center w-full", className)}>
        <div className="w-full max-w-[340px] px-6 py-8 rounded-2xl bg-secondary border border-black/15 shadow-soft-1 text-center">
          <p className="text-xl font-black text-black leading-snug italic">{quote}</p>
          {prompt && (
            <p className="mt-3 text-sm font-bold text-black/60">{prompt}</p>
          )}
        </div>
      </div>
    );
  }

  if (emoji) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-2xl border-2 border-black/15 bg-secondary mx-auto",
          compact ? "w-[140px] h-[140px]" : "w-[180px] h-[180px] sm:w-[220px] sm:h-[220px]",
          className
        )}
      >
        <span className={compact ? "text-5xl" : "text-6xl md:text-7xl"}>{emoji}</span>
      </div>
    );
  }

  if (!image && !wikiKey) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-black/15 bg-secondary mx-auto text-black/40",
          "w-full max-w-[280px] h-[160px] sm:h-[200px]",
          className
        )}
      >
        <span className="text-3xl">📷</span>
        <span className="text-xs font-bold">No image</span>
      </div>
    );
  }

  const frame = FRAME[variant] ?? FRAME.landscape;
  const useCompact = compact && variant === "product";
  const sizeClass = useCompact ? frame.compact : frame.normal;

  return (
    <div className={cn("flex items-center justify-center w-full", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden mx-auto",
          "rounded-xl shadow-soft-1 ring-1 ring-black/10 bg-white p-2",
          sizeClass
        )}
      >
        <MediaImage wikiKey={wikiKey} fallbackSrc={image} />
      </div>
    </div>
  );
}
