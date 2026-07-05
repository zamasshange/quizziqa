import { NextRequest } from "next/server";
import { getManifestImage } from "@/lib/media/image-manifest";
import { getCachedWikiImageUrl } from "@/lib/media/fetch-wiki-image";

const UA =
  "GuessEverythingQuiz/1.0 (https://quizziqa.vercel.app; educational quiz app)";

async function resolveImageUrl(wiki: string): Promise<string | null> {
  return getManifestImage(wiki) ?? (await getCachedWikiImageUrl(wiki));
}

/** Always fetch + stream bytes — never redirect (mobile Safari blocks external image redirects). */
export async function GET(req: NextRequest) {
  const wiki = req.nextUrl.searchParams.get("wiki");
  if (!wiki) {
    return new Response("Missing wiki parameter", { status: 400 });
  }

  const url = await resolveImageUrl(wiki);
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
      redirect: "follow",
      next: { revalidate: 604800 },
    });

    if (!upstream.ok) {
      return new Response("Upstream image unavailable", { status: 502 });
    }

    const buffer = await upstream.arrayBuffer();
    const contentType =
      upstream.headers.get("content-type") ??
      (url.endsWith(".svg") ? "image/svg+xml" : "image/jpeg");

    return new Response(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control":
          "public, max-age=604800, stale-while-revalidate=86400, immutable",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return new Response("Image fetch failed", { status: 502 });
  }
}

export const runtime = "nodejs";
