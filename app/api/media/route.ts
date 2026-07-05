import { NextRequest } from "next/server";
import { getCachedWikiImageUrl } from "@/lib/media/fetch-wiki-image";

const UA =
  "GuessEverythingQuiz/1.0 (https://quizziqa.vercel.app; educational quiz app)";

export async function GET(req: NextRequest) {
  const wiki = req.nextUrl.searchParams.get("wiki");
  if (!wiki) {
    return new Response("Missing wiki parameter", { status: 400 });
  }

  const url = await getCachedWikiImageUrl(wiki);
  if (!url) {
    return new Response("Image not found", { status: 404 });
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

    if (!upstream.ok || !upstream.body) {
      return new Response("Upstream image unavailable", { status: 502 });
    }

    return new Response(upstream.body, {
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
