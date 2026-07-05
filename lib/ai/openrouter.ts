const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

function getConfig() {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  const model = process.env.OPENROUTER_MODEL?.trim() || "google/gemini-2.5-flash";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim() || "http://localhost:3000";
  return { apiKey, model, appUrl };
}

async function callOpenRouter(
  messages: { role: string; content: string }[],
  maxTokens = 80
): Promise<string | null> {
  const { apiKey, model, appUrl } = getConfig();
  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[OpenRouter] OPENROUTER_API_KEY is missing — add it to .env.local and restart the dev server.");
    }
    return null;
  }

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": appUrl,
      "X-Title": "Guess Everything",
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
    }),
    signal: AbortSignal.timeout(12000),
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    if (process.env.NODE_ENV === "development") {
      console.error(`[OpenRouter] ${res.status} ${res.statusText}`, errBody.slice(0, 200));
    }
    return null;
  }

  const json = await res.json();
  return json.choices?.[0]?.message?.content?.trim() ?? null;
}

export interface AIHintRequest {
  question: string;
  answer: string;
  category?: string;
  existingHint?: string;
}

export interface AIHintResponse {
  hint: string;
  source: "ai" | "static";
}

export async function generateAIHint(
  params: AIHintRequest
): Promise<AIHintResponse> {
  const fallback =
    params.existingHint ?? "Think about what makes this answer unique.";

  const systemPrompt = `You are a helpful quiz game assistant. Give ONE short hint (max 20 words) that helps the player guess the answer WITHOUT revealing it directly. Do not say the answer or spell it out. Be fun and educational.`;

  const userPrompt = `Question: ${params.question}
Category: ${params.category ?? "General"}
Answer (secret – do NOT reveal): ${params.answer}
${params.existingHint ? `Static hint already given: ${params.existingHint}` : ""}
Give a new helpful hint:`;

  try {
    const hint = await callOpenRouter([
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ]);

    if (hint) return { hint, source: "ai" };
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("[OpenRouter] hint error:", err);
    }
  }

  return { hint: fallback, source: "static" };
}

export async function generateAIFact(
  answer: string,
  context?: string
): Promise<string> {
  const fallback = context ?? `Learn something new about ${answer} every day!`;

  try {
    const fact = await callOpenRouter(
      [
        {
          role: "user",
          content: `Give one fascinating, true, educational fact about "${answer}" in one sentence (max 30 words). ${context ? `Context: ${context}` : ""}`,
        },
      ],
      80
    );

    if (fact) return fact;
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("[OpenRouter] fact error:", err);
    }
  }

  return fallback;
}
