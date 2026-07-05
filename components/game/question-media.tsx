"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getFallbackImage } from "@/lib/media/fallback-images";
import type { MediaVariant } from "@/lib/media/images";

interface QuestionMediaProps {
  image?: string;
  emoji?: string;
  alt?: string;
  text?: string;
  variant: MediaVariant;
  className?: string;
  questionKey?: string;
  wikiKey?: string;
}

function MediaImage({
  src,
  alt,
  className,
  wikiKey,
}: {
  src: string;
  alt: string;
  className?: string;
  wikiKey?: string;
}) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setFailed(false);
  }, [src]);

  const handleError = () => {
    const fallback = wikiKey ? getFallbackImage(wikiKey) : undefined;
    if (fallback && fallback !== currentSrc) {
      setCurrentSrc(fallback);
      return;
    }
    setFailed(true);
  };

  if (failed) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary text-black/40">
        <span className="text-2xl">📷</span>
        <span className="text-[10px] font-bold mt-1">Image unavailable</span>
      </div>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={currentSrc}
      alt={alt}
      className={cn("absolute inset-0 w-full h-full", className)}
      onError={handleError}
      decoding="async"
      loading="eager"
      fetchPriority="high"
    />
  );
}

export function QuestionMedia({
  image,
  emoji,
  alt = "",
  text,
  variant,
  className,
  questionKey,
  wikiKey,
}: QuestionMediaProps) {
  if (variant === "text" && text) {
    const quoteMatch = text.match(/^("[^"]+"|'[^']+')/);
    const quote = quoteMatch?.[1] ?? text;
    const prompt = quoteMatch ? text.slice(quoteMatch[0].length).replace(/^[.\s—–-]+/, "") : null;

    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div className="w-[280px] sm:w-[340px] md:w-[400px] px-6 py-8 md:py-10 rounded-2xl bg-secondary border border-black/15 shadow-soft-1 text-center">
          <p className="text-xl md:text-2xl font-black text-black leading-snug italic">{quote}</p>
          {prompt && <p className="mt-4 text-sm font-bold text-black/60">{prompt}</p>}
        </div>
      </div>
    );
  }

  if (emoji) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-2xl border-2 border-black/15 bg-secondary",
          "w-full max-w-[280px] aspect-square mx-auto",
          className
        )}
      >
        <span className="text-6xl md:text-7xl">{emoji}</span>
      </div>
    );
  }

  if (!image) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-black/15 bg-secondary",
          "w-full max-w-[280px] aspect-[4/3] mx-auto text-black/40 min-h-[120px]",
          className
        )}
      >
        <span className="text-3xl">📷</span>
        <span className="text-xs font-bold">No image</span>
      </div>
    );
  }

  const frameClass = cn(
    "relative overflow-hidden shadow-soft-1 ring-1 ring-black/10 bg-white",
    variant === "flag" && "w-[240px] sm:w-[300px] aspect-[3/2] rounded-sm",
    variant === "landscape" && "w-full max-w-[320px] sm:max-w-[400px] aspect-[4/3] rounded-xl",
    (variant === "square" || variant === "logo") && "w-[180px] sm:w-[240px] aspect-square rounded-xl",
    variant === "portrait" && "w-[160px] sm:w-[220px] md:w-[280px] aspect-[3/4] max-h-[32vh] md:max-h-none rounded-xl"
  );

  const imgClass =
    variant === "logo"
      ? "object-contain p-4 bg-white"
      : variant === "flag"
        ? "object-cover"
        : "object-cover object-center";

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className={frameClass}>
        <MediaImage
          src={image}
          alt={alt || "Guess this"}
          className={imgClass}
          wikiKey={wikiKey}
        />
      </div>
    </div>
  );
}
