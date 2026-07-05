/**
 * Replace commons Special:Redirect URLs with direct upload.wikimedia.org URLs
 * via Wikipedia REST API. Run: node scripts/fix-manifest-urls.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const manifestPath = path.join(__dirname, "../lib/media/image-manifest.ts");
const UA = "GuessEverythingQuiz/1.0";

function isBad(url) {
  return (
    url.includes("commons.wikimedia.org") ||
    url.includes("Special:Redirect")
  );
}

async function restImage(wiki) {
  const title = encodeURIComponent(wiki.replace(/_/g, " "));
  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`,
      { headers: { "User-Agent": UA, Accept: "application/json" } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.originalimage?.source ?? data.thumbnail?.source ?? null;
  } catch {
    return null;
  }
}

async function main() {
  const src = fs.readFileSync(manifestPath, "utf8");
  const entries = {};
  for (const m of src.matchAll(/"([^"]+)":\s*"([^"]+)"/g)) {
    entries[m[1]] = m[2];
  }

  const bad = Object.entries(entries).filter(([, url]) => isBad(url));
  console.log(`Fixing ${bad.length} redirect URLs…`);

  let fixed = 0;
  let failed = 0;

  for (const [wiki, url] of bad) {
    const resolved = await restImage(wiki);
    if (resolved && resolved.startsWith("https://upload.wikimedia.org")) {
      entries[wiki] = resolved;
      fixed++;
      console.log(`  ✓ ${wiki}`);
    } else {
      failed++;
      console.log(`  ✗ ${wiki} (keeping old)`);
    }
    await new Promise((r) => setTimeout(r, 120));
  }

  const lines = [
    "/** Verified image URLs — refresh: node scripts/fix-manifest-urls.mjs */",
    "export const imageManifest: Record<string, string> = {",
  ];
  for (const [wiki, url] of Object.entries(entries).sort(([a], [b]) =>
    a.localeCompare(b)
  )) {
    lines.push(`  ${JSON.stringify(wiki)}: ${JSON.stringify(url)},`);
  }
  lines.push("};");
  lines.push("");
  lines.push("export function getManifestImage(wiki: string): string | undefined {");
  lines.push("  return imageManifest[wiki];");
  lines.push("}");

  fs.writeFileSync(manifestPath, lines.join("\n"));
  console.log(`Done: ${fixed} fixed, ${failed} failed, ${Object.keys(entries).length} total`);
}

main().catch(console.error);
