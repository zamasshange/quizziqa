"use client";

import { cn } from "@/lib/utils";
import type { MediaVariant } from "@/lib/media/images";
import { useQuestionImage } from "@/hooks/use-question-image";

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

function MediaSkeleton() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-xl bg-gradient-to-br from-black/[0.04] to-black/[0.08]">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <div className="w-12 h-12 rounded-full bg-black/[0.06] animate-pulse" />
        <div className="h-2 w-16 rounded-full bg-black/[0.06] animate-pulse" />
      </div>
    </div>
  );
}

function CategoryPlaceholder({ emoji }: { emoji: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-secondary to-white border border-black/[0.06]">
      <span className="text-5xl md:text-6xl opacity-70">{emoji}</span>
    </div>
  );
}

function MediaImage({
  wikiKey,
  imageUrl,
  variant,
  categoryEmoji,
}: {
  wikiKey?: string;
  imageUrl?: string;
  variant: MediaVariant;
  categoryEmoji?: string;
}) {
  const { src, state } = useQuestionImage({ wikiKey, imageUrl, variant });
  const showImage = state === "ready" && src;

  return (
    <div className="relative w-full h-full min-h-[160px] flex items-center justify-center">
      {(state === "loading" || (state === "ready" && !showImage)) && <MediaSkeleton />}

      {state === "placeholder" && categoryEmoji && (
        <CategoryPlaceholder emoji={categoryEmoji} />
      )}

      {showImage && (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={src}
          alt=""
          role="presentation"
          className={cn(
            "relative z-10 block w-full h-full min-w-0 min-h-0 object-contain",
            "animate-[fadeIn_0.35s_ease-out]"
          )}
          decoding="async"
        />
      )}
    </div>
  );
}

const FRAME: Record<MediaVariant, { normal: string; compact: string }> = {
  flag: {
    normal: "w-[240px] sm:w-[300px] lg:w-[380px] xl:w-[440px] h-[150px] sm:h-[188px] lg:h-[240px] xl:h-[280px]",
    compact: "w-[200px] h-[125px]",
  },
  landscape: {
    normal: "w-full max-w-[300px] sm:max-w-[380px] lg:max-w-[560px] xl:max-w-[640px] h-[180px] sm:h-[240px] lg:h-[380px] xl:h-[440px]",
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
    normal: "w-[140px] sm:w-[200px] md:w-full md:max-w-[320px] lg:max-w-[380px] h-[220px] sm:h-[280px] md:h-[340px] lg:h-[400px]",
    compact: "w-[120px] h-[180px] max-h-[28vh] md:w-full md:max-w-[320px] md:h-[340px] md:max-h-none",
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
          "flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-black/15 bg-secondary mx-auto text-black/40",
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
            ? "w-full h-full min-h-[200px] md:min-h-[320px] lg:min-h-[380px]"
            : cn("mx-auto rounded-xl", sizeClass)
        )}
      >
        <MediaImage
          wikiKey={wikiKey}
          imageUrl={image}
          variant={variant}
          categoryEmoji={categoryEmoji}
        />
      </div>
    </div>
  );
}
