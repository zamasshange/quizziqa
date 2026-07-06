import { NextRequest } from "next/server";
import { resolveWikiImageBytes } from "@/lib/media/wikimedia-resolve";
import { getCachedImage, setCachedImage } from "@/lib/media/server-image-cache";

export async function GET(req: NextRequest) {
  const wiki = req.nextUrl.searchParams.get("wiki");
  if (!wiki) {
    return new Response("Missing wiki parameter", { status: 400 });
  }

  const width = Math.min(
    1200,
    Math.max(200, parseInt(req.nextUrl.searchParams.get("w") ?? "640", 10) || 640)
  );
  const cacheKey = `${wiki}:${width}`;

  try {
    const cached = getCachedImage(cacheKey);
    if (cached) {
      return new Response(cached.buffer, {
        headers: {
          "Content-Type": cached.contentType,
          "Cache-Control":
            "public, max-age=604800, stale-while-revalidate=86400, immutable",
          "X-Image-Cache": "HIT",
        },
      });
    }

    const result = await resolveWikiImageBytes(wiki, width);

    if (!result) {
      return new Response("Image not found", { status: 404 });
    }

    setCachedImage(cacheKey, result.buffer, result.contentType);

    return new Response(result.buffer, {
      headers: {
        "Content-Type": result.contentType,
        "Cache-Control":
          "public, max-age=604800, stale-while-revalidate=86400, immutable",
        "X-Image-Cache": "MISS",
      },
    });
  } catch (err) {
    console.error("[media]", wiki, err);
    return new Response("Image fetch failed", { status: 502 });
  }
}

export const runtime = "nodejs";
export const maxDuration = 30;
