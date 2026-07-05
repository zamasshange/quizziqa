/** Final patch for remaining redirect URLs — run: node scripts/patch-remaining-manifest.mjs */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const manifestPath = path.join(__dirname, "../lib/media/image-manifest.ts");

const PATCH = {
  Accordion:
    "https://upload.wikimedia.org/wikipedia/commons/7/79/A_converter_free-bass_piano-accordion_and_a_Russian_bayan.jpg",
  Airplane:
    "https://upload.wikimedia.org/wikipedia/commons/3/36/United_Airlines_Boeing_777-200_Meulemans.jpg",
  Fortnite:
    "https://upload.wikimedia.org/wikipedia/commons/7/7c/Fortnite_F_lettermark_logo.png",
  Friends:
    "https://upload.wikimedia.org/wikipedia/en/thumb/d/df/Friends_season_one_cast.jpg/640px-Friends_season_one_cast.jpg",
  "Jurassic_Park_(film)":
    "https://upload.wikimedia.org/wikipedia/en/e/e7/Jurassic_Park_poster.jpg",
  Lotus_flower:
    "https://upload.wikimedia.org/wikipedia/commons/e/ed/Sacred_lotus_Nelumbo_nucifera.jpg",
  Minecraft:
    "https://upload.wikimedia.org/wikipedia/en/5/51/Minecraft_cover.png",
  OnePlus:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/OnePlus_logo.svg/640px-OnePlus_logo.svg.png",
  The_Dark_Knight:
    "https://upload.wikimedia.org/wikipedia/en/8/8a/Dark_Knight.jpg",
  "The_Office_(American_TV_series)":
    "https://upload.wikimedia.org/wikipedia/en/0/0b/TheOfficeUS.jpg",
  "Titanic_(1997_film)":
    "https://upload.wikimedia.org/wikipedia/en/2/22/Titanic_poster.jpg",
  "Washington,_D.C.":
    "https://upload.wikimedia.org/wikipedia/commons/e/e4/12-07-13-washington-by-RalfR-08.jpg",
  Wheel:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Landesmuseum_W%C3%BCrttemberg_Kelten_011.4.jpg/960px-Landesmuseum_W%C3%BCrttemberg_Kelten_011.4.jpg",
};

const src = fs.readFileSync(manifestPath, "utf8");
const entries = {};
for (const m of src.matchAll(/"([^"]+)":\s*"([^"]+)"/g)) {
  entries[m[1]] = m[2];
}
Object.assign(entries, PATCH);

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
console.log("Patched remaining entries:", Object.keys(PATCH).length);
