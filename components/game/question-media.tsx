"use client";

import { useState, useEffect, useRef } from "react";
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
  frameless?: boolean;
}

type LoadPhase = "direct" | "proxy" | "failed";

function MediaImage({ wikiKey, fallbackSrc }: { wikiKey?: string; fallbackSrc?: string }) {
  const directSrc =
    fallbackSrc?.startsWith("https://upload.wikimedia.org/") ||
    fallbackSrc?.startsWith("http")
      ? fallbackSrc
      : undefined;
  const proxySrc = wikiKey ? getMediaProxyUrl(wikiKey) : undefined;

  const initialSrc = directSrc ?? proxySrc ?? "";
  const [currentSrc, setCurrentSrc] = useState(initialSrc);
  const [phase, setPhase] = useState<LoadPhase>(
    directSrc ? "direct" : proxySrc ? "proxy" : "failed"
  );
  const [loaded, setLoaded] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const nextDirect =
      fallbackSrc?.startsWith("http") ? fallbackSrc : undefined;
    const nextProxy = wikiKey ? getMediaProxyUrl(wikiKey) : undefined;
    setCurrentSrc(nextDirect ?? nextProxy ?? "");
    setPhase(nextDirect ? "direct" : nextProxy ? "proxy" : "failed");
    setLoaded(false);
  }, [wikiKey, fallbackSrc]);

  // If direct CDN hangs, switch to same-origin proxy after 6s
  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (phase !== "direct" || loaded || !proxySrc) return;

    timeoutRef.current = setTimeout(() => {
      if (!loaded && proxySrc && currentSrc === directSrc) {
        setPhase("proxy");
        setCurrentSrc(proxySrc);
        setLoaded(false);
      }
    }, 6000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [phase, loaded, proxySrc, directSrc, currentSrc]);

  const handleError = () => {
    if (phase === "direct" && proxySrc) {
      setPhase("proxy");
      setCurrentSrc(proxySrc);
      setLoaded(false);
      return;
    }
    setPhase("failed");
  };

  if (!currentSrc || phase === "failed") {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full min-h-[100px] text-black/35 py-6">
        <span className="text-2xl">📷</span>
        <span className="text-[10px] font-bold mt-1">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl bg-black/[0.04] animate-pulse">
          <span className="text-2xl opacity-40">📷</span>
          <span className="text-[10px] font-bold text-black/30">Loading…</span>
        </div>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={currentSrc}
        src={currentSrc}
        alt=""
        role="presentation"
        className={cn(
          "block max-w-full max-h-full w-auto h-auto object-contain mx-auto transition-opacity duration-200",
          loaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setLoaded(true)}
        onError={handleError}
        decoding="async"
        loading="eager"
        fetchPriority="high"
      />
    </div>
  );
}

/** Only product (phone/car) uses compact on mobile — everything else keeps full size */
const FRAME: Record<MediaVariant, { normal: string; compact: string }> = {
  flag: {
    normal: "w-[240px] sm:w-[300px] lg:w-[380px] xl:w-[440px] h-[150px] sm:h-[188px] lg:h-[240px] xl:h-[280px]",
    compact: "w-[200px] h-[125px]",
  },
  landscape: {
    normal: "w-full max-w-[300px] sm:max-w-[380px] lg:max-w-[480px] xl:max-w-[560px] h-[180px] sm:h-[240px] lg:h-[320px] xl:h-[380px]",
    compact: "w-full max-w-[260px] h-[150px]",
  },
  food: {
    normal: "w-full max-w-[280px] sm:max-w-[360px] lg:max-w-[460px] xl:max-w-[520px] h-[180px] sm:h-[220px] lg:h-[300px] xl:h-[340px]",
    compact: "w-full max-w-[240px] h-[150px]",
  },
  square: {
    normal: "w-[200px] sm:w-[260px] lg:w-[320px] xl:w-[380px] h-[200px] sm:h-[260px] lg:h-[320px] xl:h-[380px]",
    compact: "w-[170px] h-[170px]",
  },
  product: {
    normal: "w-[140px] sm:w-[180px] lg:w-[220px] xl:w-[260px] h-[220px] sm:h-[280px] lg:h-[340px] xl:h-[400px]",
    compact: "w-[120px] h-[180px] max-h-[28vh]",
  },
  logo: {
    normal: "w-[180px] sm:w-[240px] lg:w-[300px] xl:w-[360px] h-[180px] sm:h-[240px] lg:h-[300px] xl:h-[360px]",
    compact: "w-[150px] h-[150px]",
  },
  portrait: {
    normal: "w-[180px] sm:w-[240px] md:w-[280px] lg:w-[360px] xl:w-[420px] h-[230px] sm:h-[300px] md:h-[360px] lg:h-[460px] xl:h-[540px]",
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
  frameless = false,
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
    <div className={cn("flex items-center justify-center w-full h-full", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden mx-auto",
          frameless
            ? sizeClass
            : cn("rounded-xl bg-white p-2 border border-black/10", sizeClass)
        )}
      >
        <MediaImage wikiKey={wikiKey} fallbackSrc={image} />
      </div>
    </div>
  );
}
