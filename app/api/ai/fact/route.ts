import { NextRequest, NextResponse } from "next/server";
import { generateAIFact } from "@/lib/ai/openrouter";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { answer, context } = body;

    if (!answer) {
      return NextResponse.json({ error: "answer is required" }, { status: 400 });
    }

    const fact = await generateAIFact(answer, context);
    return NextResponse.json({ fact });
  } catch {
    return NextResponse.json(
      { fact: "Every correct answer teaches you something new!" },
      { status: 200 }
    );
  }
}
