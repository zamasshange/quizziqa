import { NextRequest, NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import { getGameBySlugAsync } from "@/lib/games/registry";
import { getTemplateBySlug } from "@/lib/games/templates";
import { buildFullQuestionPool } from "@/lib/games/builder";
import type { Game } from "@/lib/types";

const getCachedPool = unstable_cache(
  async (slug: string) => {
    const template = getTemplateBySlug(slug);
    if (!template) return null;
    return buildFullQuestionPool(template);
  },
  ["question-pool-v1"],
  { revalidate: 86400, tags: ["question-pools"] }
);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const count = Number(req.nextUrl.searchParams.get("count") ?? "10");

  const game = await getGameBySlugAsync(slug);
  if (!game) {
    return NextResponse.json({ error: "Game not found" }, { status: 404 });
  }

  const template = getTemplateBySlug(slug);
  let pool = game.questions;

  if (template) {
    const fullPool = await getCachedPool(slug);
    if (fullPool && fullPool.length > 0) pool = fullPool;
  }

  const sessionGame = {
    ...game,
    questions: pool,
    questionPoolSize: pool.length,
    sessionCount: Math.min(count, pool.length),
  };

  return NextResponse.json(sessionGame, {
    headers: { "Cache-Control": "private, no-store" },
  });
}
