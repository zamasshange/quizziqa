"use client";

import { useMutation } from "@tanstack/react-query";

interface HintParams {
  question: string;
  answer: string;
  category?: string;
  existingHint?: string;
}

export function useAIHint() {
  return useMutation({
    mutationFn: async (params: HintParams) => {
      const res = await fetch("/api/ai/hint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error("Hint failed");
      return res.json() as Promise<{ hint: string; source: string }>;
    },
  });
}

export function useAIFact() {
  return useMutation({
    mutationFn: async (params: { answer: string; context?: string }) => {
      const res = await fetch("/api/ai/fact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      if (!res.ok) throw new Error("Fact failed");
      return res.json() as Promise<{ fact: string }>;
    },
  });
}
