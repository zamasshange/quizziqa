"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { MediaVariant } from "@/lib/media/images";
import {
  getFlagUrl,
  getPlayableUrls,
} from "@/lib/media/image-candidates";

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
  categoryEmoji?: string;
}

function MediaImage({
  wikiKey,
  imageUrl,
  variant,
}: {
  wikiKey?: string;
  imageUrl?: string;
  variant: MediaVariant;
}) {
  const urls = useMemo(() => {
    if (imageUrl?.includes("flagcdn.com") || imageUrl?.includes("image.tmdb.org")) {
      return [imageUrl];
    }
    if (imageUrl?.startsWith("/api/media")) return [imageUrl];
    if (wikiKey) return getPlayableUrls(wikiKey, variant, imageUrl);
    if (imageUrl?.startsWith("http")) return [imageUrl];
    return [];
  }, [wikiKey, imageUrl, variant]);

  const [urlIndex, setUrlIndex] = useState(0);
  const src = urls[urlIndex] ?? null;

  useEffect(() => {
    setUrlIndex(0);
  }, [urls]);

  if (!src) return null;

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt=""
      role="presentation"
      className="relative z-10 block w-full h-full min-w-0 min-h-0 object-contain"
      decoding="async"
      loading="eager"
      fetchPriority="high"
      onError={() => {
        if (urlIndex + 1 < urls.length) setUrlIndex((i) => i + 1);
      }}
    />
  );
}

const FRAME: Record<MediaVariant, { normal: string; compact: string }> = {
  flag: {
    normal: "w-full max-w-[240px] sm:max-w-[300px] lg:max-w-[380px] xl:max-w-[440px] h-[100px] sm:h-[150px] lg:h-[240px] xl:h-[280px]",
    compact: "w-[160px] h-[100px]",
  },
  landscape: {
    normal: "w-full max-w-[280px] sm:max-w-[380px] lg:max-w-[560px] xl:max-w-[640px] h-[110px] sm:h-[180px] lg:h-[380px] xl:h-[440px]",
    compact: "w-full max-w-[220px] h-[110px]",
  },
  food: {
    normal: "w-full max-w-[260px] sm:max-w-[360px] lg:max-w-[460px] xl:max-w-[520px] h-[110px] sm:h-[180px] lg:h-[300px] xl:h-[340px]",
    compact: "w-full max-w-[220px] h-[110px]",
  },
  square: {
    normal: "w-[140px] sm:w-[220px] lg:w-[320px] xl:w-[380px] h-[140px] sm:h-[220px] lg:h-[320px] xl:h-[380px]",
    compact: "w-[120px] h-[120px]",
  },
  product: {
    normal: "w-[100px] sm:w-[160px] md:w-full md:max-w-[320px] lg:max-w-[380px] h-[140px] sm:h-[220px] md:h-[340px] lg:h-[400px]",
    compact: "w-[90px] h-[130px] max-h-[22vh] md:w-full md:max-w-[320px] md:h-[340px] md:max-h-none",
  },
  logo: {
    normal: "w-[120px] sm:w-[200px] lg:w-[300px] xl:w-[360px] h-[120px] sm:h-[200px] lg:h-[300px] xl:h-[360px]",
    compact: "w-[110px] h-[110px]",
  },
  portrait: {
    normal: "w-[150px] sm:w-[220px] md:w-[280px] lg:w-[360px] xl:w-[420px] h-[190px] sm:h-[270px] md:h-[360px] lg:h-[460px] xl:h-[540px]",
    compact: "w-[130px] h-[165px]",
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
  categoryEmoji = "🎯",
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
          "flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-black/15 bg-secondary mx-auto",
          "w-full max-w-[280px] h-[160px] sm:h-[200px]",
          className
        )}
      >
        <span className="text-3xl">{categoryEmoji}</span>
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
          "relative flex items-center justify-center overflow-hidden",
          frameless
            ? "w-full h-full min-h-0 max-h-[38vh] md:max-h-none md:min-h-[320px] lg:min-h-[380px]"
            : cn("mx-auto rounded-xl", sizeClass)
        )}
      >
        <MediaImage wikiKey={wikiKey} imageUrl={image} variant={variant} />
      </div>
    </div>
  );
}
