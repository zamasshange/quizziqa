import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import { POPADS_MARKER, POPADS_SCRIPT_TAG } from "@/lib/ads/popads-snippet";

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim();
const secretKey = process.env.CLERK_SECRET_KEY?.trim();
const clerkEnabled = Boolean(publishableKey && secretKey);
const popadsEnabled = process.env.NEXT_PUBLIC_POPADS_ENABLED !== "false";

function isHtmlDocumentRequest(req: NextRequest): boolean {
  if (req.method !== "GET") return false;
  if (req.nextUrl.pathname.startsWith("/api")) return false;
  if (req.nextUrl.pathname.startsWith("/_next")) return false;
  // Skip RSC / client navigations — only full HTML documents
  if (req.headers.get("RSC") === "1") return false;
  if (req.headers.has("next-router-state-tree")) return false;
  if (req.headers.has("next-router-prefetch")) return false;
  const accept = req.headers.get("accept") ?? "";
  return accept.includes("text/html");
}

/**
 * Ensure exactly one PopAds adcode in the HTML PopAds crawlers fetch.
 * React must NOT render the adcode (Next duplicates it into the RSC payload).
 */
function ensureSinglePopAds(html: string): string {
  // Drop any leftover <script>…PopAds…</script> from older deploys
  let out = html.replace(
    /<script\b[^>]*>[\s\S]*?e83cd509981011e40e1a02a5b440bafe[\s\S]*?<\/script>/gi,
    ""
  );

  // Scrub escaped copies inside RSC/flight JSON so they are not counted
  if (out.includes(POPADS_MARKER)) {
    out = out.split(POPADS_MARKER).join("");
  }

  if (out.includes("</body>")) {
    return out.replace("</body>", `${POPADS_SCRIPT_TAG}</body>`);
  }
  return `${out}${POPADS_SCRIPT_TAG}`;
}

async function withClerk(req: NextRequest, event: NextFetchEvent) {
  if (!clerkEnabled) {
    return NextResponse.next();
  }
  const { clerkMiddleware } = await import("@clerk/nextjs/server");
  return clerkMiddleware()(req, event);
}

/**
 * Next.js 16 uses proxy.ts instead of middleware.ts.
 * PopAds is injected here (not in React) so it appears once with CDATA intact.
 */
export default async function proxy(req: NextRequest, event: NextFetchEvent) {
  if (req.headers.get("x-popads-pass") === "1") {
    return withClerk(req, event);
  }

  if (!popadsEnabled || !isHtmlDocumentRequest(req)) {
    return withClerk(req, event);
  }

  const headers = new Headers(req.headers);
  headers.set("x-popads-pass", "1");
  // Avoid compressed bodies we can't safely rewrite
  headers.set("accept-encoding", "identity");

  const upstream = await fetch(req.nextUrl.href, {
    method: "GET",
    headers,
    redirect: "manual",
  });

  const contentType = upstream.headers.get("content-type") ?? "";
  if (!contentType.includes("text/html")) {
    return new NextResponse(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: upstream.headers,
    });
  }

  const html = await upstream.text();
  const patched = ensureSinglePopAds(html);

  const outHeaders = new Headers(upstream.headers);
  outHeaders.delete("content-length");
  outHeaders.delete("content-encoding");

  return new NextResponse(patched, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: outHeaders,
  });
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
