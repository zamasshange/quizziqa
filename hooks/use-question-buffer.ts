"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { GameQuestion } from "@/lib/types";
import type { MediaVariant } from "@/lib/media/images";
import { QuestionBuffer } from "@/lib/game/question-buffer";

export function useQuestionBuffer(
  slug: string,
  ssrQuestions: GameQuestion[],
  sessionCount: number,
  variantFor: (q: GameQuestion) => MediaVariant
) {
  const bufferRef = useRef<QuestionBuffer | null>(null);
  const prevCountRef = useRef(sessionCount);
  const [, tick] = useState(0);
  const forceUpdate = useCallback(() => tick((n) => n + 1), []);

  if (!bufferRef.current) {
    bufferRef.current = new QuestionBuffer(slug, sessionCount, variantFor);
    bufferRef.current.init(ssrQuestions);
  }

  useEffect(() => {
    bufferRef.current!.prepareAssets();
  }, []);

  useEffect(() => {
    const buf = bufferRef.current!;
    return buf.subscribe(forceUpdate);
  }, [forceUpdate]);

  useEffect(() => {
    const buf = bufferRef.current!;
    if (prevCountRef.current !== sessionCount && buf.index === 0) {
      buf.rebuildSession(sessionCount);
      forceUpdate();
    }
    prevCountRef.current = sessionCount;
  }, [sessionCount, forceUpdate]);

  const buffer = bufferRef.current;

  return {
    buffer,
    current: buffer.current,
    questions: buffer.questions,
    index: buffer.index,
    answerPool: buffer.answerPool,
    fullPool: buffer.fullPool,
    isReady: buffer.isReady,
    advance: () => buffer.advance(),
    isFinished: () => buffer.isFinished(),
    finishSession: () => buffer.finishSession(),
    rebuildSession: () => {
      buffer.rebuildSession(sessionCount);
      buffer.prepareAssets();
      forceUpdate();
    },
  };
}
