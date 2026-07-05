import { NextRequest } from "next/server";
import { getManifestImage } from "@/lib/media/image-manifest";
import { getCachedWikiImageUrl } from "@/lib/media/fetch-wiki-image";

const UA =
  "GuessEverythingQuiz/1.0 (https://quizziqa.vercel.app; educational quiz app)";

async function fetchImage(url: string): Promise<Response | null> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": UA,
        Accept: "image/*,*/*",
        Referer: "https://en.wikipedia.org/",
      },
      redirect: "follow",
      next: { revalidate: 604800 },
    });
    if (res.ok && res.headers.get("content-type")?.includes("text/html")) {
      return null;
    }
    return res.ok ? res : null;
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const wiki = req.nextUrl.searchParams.get("wiki");
  if (!wiki) {
    return new Response("Missing wiki parameter", { status: 400 });
  }

  const candidates = [
    getManifestImage(wiki),
    await getCachedWikiImageUrl(wiki),
  ].filter((u, i, arr): u is string => !!u && arr.indexOf(u) === i);

  let upstream: Response | null = null;
  let sourceUrl = "";

  for (const url of candidates) {
    upstream = await fetchImage(url);
    if (upstream) {
      sourceUrl = url;
      break;
    }
  }

  if (!upstream) {
    return new Response("Image not found", { status: 404 });
  }

  const buffer = await upstream.arrayBuffer();
  const contentType =
    upstream.headers.get("content-type") ??
    (sourceUrl.endsWith(".svg") ? "image/svg+xml" : "image/jpeg");

  return new Response(buffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control":
        "public, max-age=604800, stale-while-revalidate=86400, immutable",
    },
  });
}

export const runtime = "nodejs";
