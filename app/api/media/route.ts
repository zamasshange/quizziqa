import { NextRequest, NextResponse } from "next/server";
import { resolveImageForWiki } from "@/lib/media/resolve-image-server";

const UA =
  "GuessEverythingQuiz/1.0 (https://quizziqa.vercel.app; educational quiz app)";

export async function GET(req: NextRequest) {
  const wiki = req.nextUrl.searchParams.get("wiki");
  if (!wiki) {
    return new Response("Missing wiki parameter", { status: 400 });
  }

  const url = await resolveImageForWiki(wiki);
  if (!url) {
    return new Response("Image not found", { status: 404 });
  }

  // Manifest URLs are verified — redirect for speed (browser caches the target)
  if (url.startsWith("http")) {
    return NextResponse.redirect(url, {
      status: 302,
      headers: {
        "Cache-Control":
          "public, max-age=604800, stale-while-revalidate=86400",
      },
    });
  }

  try {
    const upstream = await fetch(url, {
      headers: {
        "User-Agent": UA,
        Accept: "image/*,*/*",
        Referer: "https://en.wikipedia.org/",
      },
      next: { revalidate: 604800 },
    });

    if (!upstream.ok) {
      return new Response("Upstream image unavailable", { status: 502 });
    }

    const buffer = await upstream.arrayBuffer();
    return new Response(buffer, {
      headers: {
        "Content-Type":
          upstream.headers.get("content-type") ?? "image/jpeg",
        "Cache-Control":
          "public, max-age=604800, stale-while-revalidate=86400, immutable",
      },
    });
  } catch {
    return new Response("Image fetch failed", { status: 502 });
  }
}
