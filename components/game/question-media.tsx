"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { isImageCached } from "@/lib/game/image-cache";
import type { MediaVariant } from "@/lib/media/images";

interface QuestionMediaProps {
  image?: string;
  emoji?: string;
  alt?: string;
  text?: string;
  variant: MediaVariant;
  className?: string;
  questionKey?: string;
}

function MediaImage({
  src,
  alt,
  className,
  onError,
  instant,
}: {
  src: string;
  alt: string;
  className?: string;
  onError: () => void;
  instant?: boolean;
}) {
  const cached = instant || isImageCached(src);
  const [loaded, setLoaded] = useState(cached);

  useEffect(() => {
    setLoaded(cached || isImageCached(src));
  }, [src, cached]);

  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 bg-black/5 animate-pulse rounded-inherit" aria-hidden />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={cn(
          "absolute inset-0 w-full h-full",
          loaded ? "opacity-100" : "opacity-0",
          !instant && !cached && loaded && "transition-opacity duration-100",
          className
        )}
        onLoad={() => setLoaded(true)}
        onError={onError}
        decoding="sync"
        fetchPriority="high"
      />
    </>
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
}: QuestionMediaProps) {
  const [error, setError] = useState(false);
  const instant = !!image && isImageCached(image);

  useEffect(() => {
    setError(false);
  }, [image, questionKey]);

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

  if (!image || error) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-black/15 bg-secondary",
          "w-full max-w-[280px] aspect-[3/4] mx-auto text-black/40",
          className
        )}
      >
        <span className="text-3xl">📷</span>
        <span className="text-xs font-bold">Photo loading…</span>
      </div>
    );
  }

  if (variant === "flag") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div className="relative w-[280px] sm:w-[340px] md:w-[420px] aspect-[3/2] rounded-[4px] overflow-hidden bg-white ring-2 ring-black/10 shadow-soft-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={questionKey ?? image}
            src={image}
            alt={alt || "Flag"}
            className="block w-full h-full object-cover"
            decoding="sync"
            fetchPriority="high"
            onError={() => setError(true)}
          />
        </div>
      </div>
    );
  }

  if (variant === "landscape") {
    return (
      <div className={cn("relative flex items-center justify-center", className)}>
        <div className="relative w-full max-w-[420px] md:max-w-[520px] aspect-[4/3] rounded-2xl overflow-hidden shadow-soft-1 ring-1 ring-black/10">
          <MediaImage
            src={image}
            alt={alt || "Guess this"}
            className="object-cover object-center"
            onError={() => setError(true)}
            instant={instant}
          />
        </div>
      </div>
    );
  }

  if (variant === "square" || variant === "logo") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div className="relative w-full max-w-[300px] sm:max-w-[340px] md:max-w-[380px] aspect-square rounded-2xl overflow-hidden shadow-soft-1 ring-1 ring-black/10">
          <MediaImage
            src={image}
            alt={alt || "Guess this"}
            className={variant === "logo" ? "object-contain p-6" : "object-cover object-center"}
            onError={() => setError(true)}
            instant={instant}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <div
        className={cn(
          "relative w-[160px] sm:w-[220px] md:w-[320px] aspect-[3/4] max-h-[32vh] md:max-h-none",
          "rounded-2xl overflow-hidden shadow-soft-1 ring-1 ring-black/10"
        )}
      >
        <MediaImage
          src={image}
          alt={alt || "Guess this"}
          className="object-cover object-[center_20%]"
          onError={() => setError(true)}
          instant={instant}
        />
      </div>
    </div>
  );
}
