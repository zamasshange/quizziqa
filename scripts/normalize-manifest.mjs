/**
 * Resolves commons Special:Redirect URLs to direct upload.wikimedia.org URLs.
 * Run: node scripts/normalize-manifest.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UA = "GuessEverythingQuiz/1.0";

const DIRECT_OVERRIDES = {
  IPhone:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/IPhone_4.jpg/640px-IPhone_4.jpg",
  IPhone_4:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/IPhone_4.jpg/640px-IPhone_4.jpg",
  Samsung_Galaxy_S24:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Samsung_Galaxy_S23_Ultra_%28cropped%29.png/640px-Samsung_Galaxy_S23_Ultra_%28cropped%29.png",
  Hawaii:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Hanauma_Bay_Oahu_Hawaii.jpg/640px-Hanauma_Bay_Oahu_Hawaii.jpg",
  Breaking_Bad:
    "https://upload.wikimedia.org/wikipedia/en/thumb/6/61/Breaking_Bad_title_card.png/640px-Breaking_Bad_title_card.png",
  "Dalmatian_(dog)":
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Dalmatian_puppy.jpg/640px-Dalmatian_puppy.jpg",
};

async function resolveUrl(url) {
  if (!url.includes("commons.wikimedia.org")) return url;
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: { "User-Agent": UA },
    });
    if (res.ok && res.url.startsWith("https://upload.wikimedia.org")) {
      return res.url;
    }
  } catch {
    /* keep original */
  }
  return url;
}

async function main() {
  const manifestPath = path.join(__dirname, "../lib/media/image-manifest.ts");
  const src = fs.readFileSync(manifestPath, "utf8");
  const entries = {};
  for (const m of src.matchAll(/"([^"]+)":\s*"([^"]+)"/g)) {
    entries[m[1]] = m[2];
  }

  let changed = 0;
  for (const [wiki, url] of Object.entries(entries)) {
    if (DIRECT_OVERRIDES[wiki]) {
      entries[wiki] = DIRECT_OVERRIDES[wiki];
      changed++;
      continue;
    }
    if (url.includes("commons.wikimedia.org")) {
      const resolved = await resolveUrl(url);
      if (resolved !== url) {
        entries[wiki] = resolved;
        changed++;
      }
      await new Promise((r) => setTimeout(r, 100));
    }
  }

  const lines = [
    "/** Verified image URLs — refresh: node scripts/generate-image-manifest.mjs && node scripts/normalize-manifest.mjs */",
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
  console.log(`Normalized ${changed} URLs, total ${Object.keys(entries).length}`);
}

main().catch(console.error);
