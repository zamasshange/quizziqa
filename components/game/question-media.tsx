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
  compact?: boolean;
}

function MediaImage({ src, wikiKey }: { src: string; wikiKey?: string }) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setLoaded(false);
    setFailed(false);
  }, [src]);

  const handleError = () => {
    if (wikiKey) {
      const proxy = getMediaProxyUrl(wikiKey);
      if (proxy !== currentSrc) {
        setCurrentSrc(proxy);
        setLoaded(false);
        return;
      }
    }
    setFailed(true);
  };

  if (failed) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full min-h-[80px] text-black/35 py-4">
        <span className="text-xl">📷</span>
        <span className="text-[9px] font-bold mt-1">Image unavailable</span>
      </div>
    );
  }

  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-secondary/60 animate-pulse rounded-[inherit]" />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={currentSrc}
        alt=""
        role="presentation"
        className={cn(
          "block max-w-full max-h-full w-auto h-auto object-contain mx-auto",
          loaded ? "opacity-100" : "opacity-0",
          "transition-opacity duration-200"
        )}
        onLoad={() => setLoaded(true)}
        onError={handleError}
        decoding="async"
        loading="eager"
        fetchPriority="high"
      />
    </>
  );
}

const FRAME: Record<
  MediaVariant,
  { normal: string; compact: string }
> = {
  flag: {
    normal: "w-[220px] sm:w-[280px] h-[140px] sm:h-[175px]",
    compact: "w-[160px] h-[100px]",
  },
  landscape: {
    normal: "w-full max-w-[280px] sm:max-w-[340px] h-[160px] sm:h-[200px]",
    compact: "w-full max-w-[200px] h-[120px]",
  },
  food: {
    normal: "w-full max-w-[260px] sm:max-w-[320px] h-[160px] sm:h-[190px]",
    compact: "w-full max-w-[200px] h-[120px]",
  },
  square: {
    normal: "w-[160px] sm:w-[220px] h-[160px] sm:h-[220px]",
    compact: "w-[130px] h-[130px]",
  },
  product: {
    normal: "w-[130px] sm:w-[160px] h-[200px] sm:h-[240px]",
    compact: "w-[100px] h-[150px]",
  },
  logo: {
    normal: "w-[140px] sm:w-[180px] h-[140px] sm:h-[180px]",
    compact: "w-[110px] h-[110px]",
  },
  portrait: {
    normal: "w-[130px] sm:w-[180px] h-[170px] sm:h-[230px]",
    compact: "w-[100px] h-[130px]",
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
      <div className={cn("flex items-center justify-center", className)}>
        <div className="w-full max-w-[320px] px-5 py-6 rounded-2xl bg-secondary border border-black/15 shadow-soft-1 text-center">
          <p className="text-lg font-black text-black leading-snug italic">{quote}</p>
          {prompt && (
            <p className="mt-3 text-xs font-bold text-black/60">{prompt}</p>
          )}
        </div>
      </div>
    );
  }

  if (emoji) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-2xl border-2 border-black/15 bg-secondary",
          compact ? "w-[120px] h-[120px]" : "w-[160px] h-[160px] sm:w-[200px] sm:h-[200px]",
          className
        )}
      >
        <span className={compact ? "text-5xl" : "text-6xl md:text-7xl"}>{emoji}</span>
      </div>
    );
  }

  if (!image) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-black/15 bg-secondary text-black/40",
          compact ? "w-[130px] h-[100px]" : "w-[160px] h-[120px] sm:w-[200px] sm:h-[150px]",
          className
        )}
      >
        <span className="text-2xl">📷</span>
        <span className="text-[9px] font-bold">No image</span>
      </div>
    );
  }

  const frame = FRAME[variant] ?? FRAME.landscape;
  const sizeClass = compact ? frame.compact : frame.normal;

  return (
    <div className={cn("flex items-center justify-center shrink-0", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden",
          "rounded-xl shadow-soft-1 ring-1 ring-black/10 bg-white p-1.5",
          sizeClass
        )}
      >
        <MediaImage src={image} wikiKey={wikiKey} />
      </div>
    </div>
  );
}
