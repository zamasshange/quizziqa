"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { MediaVariant } from "@/lib/media/images";

interface QuestionMediaProps {
  image?: string;
  emoji?: string;
  alt?: string;
  text?: string;
  variant: MediaVariant;
  className?: string;
}

function MediaImage({
  src,
  alt,
  className,
  onError,
}: {
  src: string;
  alt: string;
  className?: string;
  onError: () => void;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 bg-white/5 animate-pulse" aria-hidden />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={cn(
          "absolute inset-0 w-full h-full transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={() => setLoaded(true)}
        onError={onError}
        decoding="async"
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
}: QuestionMediaProps) {
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
  }, [image]);

  if (variant === "text" && text) {
    const quoteMatch = text.match(/^("[^"]+"|'[^']+')/);
    const quote = quoteMatch?.[1] ?? text;
    const prompt = quoteMatch ? text.slice(quoteMatch[0].length).replace(/^[.\s—–-]+/, "") : null;

    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div
          className={cn(
            "w-[280px] sm:w-[340px] md:w-[400px] px-6 py-8 md:py-10",
            "rounded-2xl bg-white/10 border-2 border-white/25",
            "shadow-[0_16px_48px_rgba(0,0,0,0.4)] text-center"
          )}
        >
          <p className="text-xl md:text-2xl font-black text-white leading-snug italic">
            {quote}
          </p>
          {prompt && (
            <p className="mt-4 text-sm font-bold text-white/70">{prompt}</p>
          )}
        </div>
      </div>
    );
  }

  if (emoji) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-2xl border-[3px] border-white/25 bg-white/5",
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
          "flex flex-col items-center justify-center gap-2 rounded-2xl border-[3px] border-white/20 bg-white/5",
          "w-full max-w-[280px] aspect-[3/4] mx-auto text-white/50",
          className
        )}
      >
        <span className="text-3xl">📷</span>
        <span className="text-xs font-bold">Photo loading…</span>
      </div>
    );
  }

  /* Flags — fixed 3:2 frame, always visible size */
  if (variant === "flag") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div
          className={cn(
            "relative w-[280px] sm:w-[340px] md:w-[420px] aspect-[3/2]",
            "rounded-[4px] overflow-hidden bg-white/5",
            "ring-[3px] ring-white/95",
            "shadow-[0_12px_40px_rgba(0,0,0,0.5)]"
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt={alt || "Flag"}
            className="block w-full h-full object-cover"
            loading="eager"
            decoding="async"
            onError={() => setError(true)}
          />
        </div>
      </div>
    );
  }

  if (variant === "landscape") {
    return (
      <div className={cn("relative flex items-center justify-center", className)}>
        <div
          className={cn(
            "relative w-full max-w-[420px] md:max-w-[520px] aspect-[4/3]",
            "rounded-2xl overflow-hidden",
            "shadow-[0_16px_48px_rgba(0,0,0,0.45)] ring-1 ring-white/20"
          )}
        >
          <MediaImage
            src={image}
            alt={alt || "Guess this"}
            className="object-cover object-center"
            onError={() => setError(true)}
          />
        </div>
      </div>
    );
  }

  if (variant === "square" || variant === "logo") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div
          className={cn(
            "relative w-full max-w-[300px] sm:max-w-[340px] md:max-w-[380px] aspect-square",
            "rounded-2xl overflow-hidden",
            "shadow-[0_16px_48px_rgba(0,0,0,0.45)] ring-1 ring-white/20"
          )}
        >
          <MediaImage
            src={image}
            alt={alt || "Guess this"}
            className={variant === "logo" ? "object-contain p-6" : "object-cover object-center"}
            onError={() => setError(true)}
          />
        </div>
      </div>
    );
  }

  /* Portrait — celebrities, athletes, people */
  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <div
        className={cn(
          "relative w-[240px] sm:w-[280px] md:w-[320px] aspect-[3/4]",
          "rounded-2xl overflow-hidden",
          "shadow-[0_16px_48px_rgba(0,0,0,0.5)] ring-1 ring-white/25"
        )}
      >
        <MediaImage
          src={image}
          alt={alt || "Guess this"}
          className="object-cover object-[center_20%]"
          onError={() => setError(true)}
        />
      </div>
    </div>
  );
}
