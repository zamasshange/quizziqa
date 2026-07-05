/** Patch missing manifest entries — run: node scripts/patch-manifest.mjs */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, "../lib/media/image-manifest.ts");

const PATCH = {
  Abraham_Lincoln:
    "https://upload.wikimedia.org/wikipedia/commons/5/57/Abraham_Lincoln_1863_Portrait_%283x4_cropped%29.jpg",
  Aconcagua:
    "https://upload.wikimedia.org/wikipedia/commons/4/4e/Aconcagua2016.jpg",
  Adele: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Adele_2016.jpg",
  African_elephant:
    "https://upload.wikimedia.org/wikipedia/commons/b/bf/African_Elephant_%28Loxodonta_africana%29_male_%2817289351322%29.jpg",
  Agatha_Christie:
    "https://upload.wikimedia.org/wikipedia/commons/f/f7/Agatha_Christie_in_Nederland_%28detectiveschrijfster%29%2C_bij_aankomst_op_Schiphol_me%2C_Bestanddeelnr_916-8898_%28cropped%29.jpg",
  Albert_Einstein:
    "https://upload.wikimedia.org/wikipedia/commons/2/28/Albert_Einstein_Head_cleaned.jpg",
  Amelia_Earhart:
    "https://upload.wikimedia.org/wikipedia/commons/7/72/Amelia_Earhart_standing_under_nose_of_her_Lockheed_Model_10-E_Electra%2C_small_%28cropped%29.jpg",
  American_Gothic:
    "https://upload.wikimedia.org/wikipedia/commons/c/cc/Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg",
  BMW_M3:
    "https://upload.wikimedia.org/wikipedia/commons/8/8a/BMW_M3_Competition_%28G80%29_IMG_4041.jpg",
  Bald_eagle:
    "https://upload.wikimedia.org/wikipedia/commons/d/db/Bald_eagle_about_to_fly_in_Alaska_%282016%29.jpg",
  Bali: "https://upload.wikimedia.org/wikipedia/commons/8/8d/Pura_Ulun_Danu_Bratan%2C_Bali.jpg",
  Bangkok:
    "https://upload.wikimedia.org/wikipedia/commons/7/7d/4Y1A1159_Bangkok_%2833536795515%29.jpg",
  Barack_Obama:
    "https://upload.wikimedia.org/wikipedia/commons/8/8d/President_Barack_Obama.jpg",
  Barcelona:
    "https://upload.wikimedia.org/wikipedia/commons/a/a6/Evening_light_over_Barcelona.jpg",
  Beagle: "https://upload.wikimedia.org/wikipedia/commons/5/55/Beagle_600.jpg",
  Beijing:
    "https://upload.wikimedia.org/wikipedia/commons/2/2d/Skyline_of_Beijing_CBD_with_B-5906_approaching_%2820211016171955%29_%281%29.jpg",
  Berlin:
    "https://upload.wikimedia.org/wikipedia/commons/f/f7/Museumsinsel_Berlin_Juli_2021_1_%28cropped%29_b.jpg",
  Big_Ben:
    "https://upload.wikimedia.org/wikipedia/commons/4/43/Elizabeth_Tower%2C_June_2022.jpg",
  Blue_whale:
    "https://upload.wikimedia.org/wikipedia/commons/1/1c/Anim1754_-_Flickr_-_NOAA_Photo_Library.jpg",
  Bob_Marley:
    "https://upload.wikimedia.org/wikipedia/commons/2/2d/Bob_Marley_1976_press_photo.jpg",
  Brachiosaurus:
    "https://upload.wikimedia.org/wikipedia/commons/e/ed/Brachiosaurus_mount.jpg",
  Breaking_Bad:
    "https://upload.wikimedia.org/wikipedia/commons/7/77/Breaking_Bad_logo.svg",
  Bulldog: "https://upload.wikimedia.org/wikipedia/commons/a/a3/Whitebulldog.jpg",
  Cairo: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Kheops-Pyramid.jpg",
  Canberra:
    "https://upload.wikimedia.org/wikipedia/commons/5/5c/Parliament_House_Canberra.jpg",
};

const src = fs.readFileSync(outPath, "utf8");
const entries = {};
for (const m of src.matchAll(/"([^"]+)":\s*"([^"]+)"/g)) {
  entries[m[1]] = m[2];
}
Object.assign(entries, PATCH);

const lines = [
  "/** Auto-generated verified image URLs — run: node scripts/generate-image-manifest.mjs */",
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

fs.writeFileSync(outPath, lines.join("\n"));
console.log("Patched manifest:", Object.keys(entries).length, "entries");
