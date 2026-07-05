import { NextRequest, NextResponse } from "next/server";
import { generateAIHint } from "@/lib/ai/openrouter";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, answer, category, existingHint } = body;

    if (!question || !answer) {
      return NextResponse.json(
        { error: "question and answer are required" },
        { status: 400 }
      );
    }

    const result = await generateAIHint({
      question,
      answer,
      category,
      existingHint,
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { hint: "Think about what category this belongs to.", source: "static" },
      { status: 200 }
    );
  }
}
