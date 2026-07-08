/**
 * Generates lib/media/image-manifest.ts with verified Wikipedia thumbnail URLs.
 * Run: node scripts/generate-image-manifest.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UA = "Quizzical/1.0 (https://quizzical.site; educational quiz)";

/** Curated Commons filenames when the Wikipedia page image is wrong or missing. */
const FILE_OVERRIDES = {
  IPhone: "IPhone_15_Pro_Black_Titanium.svg",
  IPhone_4: "IPhone_4B.svg",
  Samsung_Galaxy_S24: "Samsung Galaxy S24 Ultra Titanium Black.png",
  Google_Pixel: "Google Pixel 8 Pro Obsidian.png",
  BlackBerry: "BlackBerry Bold 9900.png",
  Nokia_3310: "Nokia 3310 blue.jpg",
  Motorola_Razr: "Motorola RAZR V3i blue.jpg",
  OnePlus: "OnePlus 6T Mirror Black.png",
  Light_bulb: "Edison bulb.jpg",
  Telephone: "Telephone 1876.jpg",
  Printing_press: "Gutenberg Press.jpg",
  Steam_engine: "Steam engine in action.gif",
  Penicillin: "Penicillin core structure.svg",
  Internet: "Internet map 1024 - transparent, inverted.png",
  Wheel: "Wheel in Mesopotamian replica.jpg",
  Compass: "Compass.jpg",
  Telescope: "Hubble Space Telescope (HST).jpg",
  Pizza: "Pizza Margherita edit.jpg",
  Sushi: "Sushi platter.jpg",
  Croissant: "Croissant-Petr Kratochvil.jpg",
  Taco: "001 Tacos de carnitas, carne asada y al pastor.jpg",
  Ramen: "Soy ramen.jpg",
  Pad_Thai: "Pad Thai.jpg",
  Hamburger: "Hamburger (black bg).jpg",
  Apple_Inc: "Apple logo black.svg",
  "Apple_Inc.": "Apple logo black.svg",
  "Nike,_Inc.": "Logo NIKE.svg",
  "Amazon_(company)": "Amazon logo.svg",
  "McDonald's": "McDonald's Golden Arches.svg",
  "Coca-Cola": "Coca-Cola logo.svg",
  "Tesla,_Inc.": "Tesla Motors.svg",
  Google: "Google 2015 logo.svg",
  Microsoft: "Microsoft logo.svg",
  Samsung: "Samsung Logo.svg",
  Adidas: "Adidas Logo.svg",
  Pokemon: "Pokemon logo.png",
  "Super_Mario_Bros.": "Super Mario Bros. box.png",
  "Pac-Man": "Pac-man.png",
  Fortnite: "Fortnite F lettermark logo.png",
  Beyonce: "Beyoncé at The Lion King European Premiere 2019.png",
  "Robert_Downey_Jr.": "Robert Downey Jr 2014 Comic Con (cropped).jpg",
  Drum: "Drum set.jpg",
  Piano: "Steinway Vienna 002.JPG",
  Guitar: "GuitareClassique5.jpg",
  Violin: "Violin VL100.png",
  Trumpet: "Trumpet 1.jpg",
  Saxophone: "Alto saxophone.jpg",
  Flute: "Western concert flute with case.jpg",
  Harp: "Harp.jpg",
  Cello: "Cello study.jpg",
  Accordion: "Accordion1.jpg",
  Airplane: "Wright Flyer (cropped).jpg",
  Ankylosaurus: "Ankylosaurus skeleton.jpg",
  Diplodocus: "Diplodocus carnegii.jpg",
  Pteranodon: "Pteranodon sternbergi.jpg",
  Allosaurus: "Allosaurus fragilis skull.jpg",
  Lotus_flower: "Nelumbo nucifera (Indian Lotus).jpg",
  Cherry_blossom: "Cherry blossoms at the Imperial Palace in Tokyo.jpg",
  "Washington,_D.C.": "US Capitol west side.JPG",
  Brasilia: "Catedral de Brasilia, Brasilia, Brazil.jpg",
  "Christ_the_Redeemer_(statue)": "Christ the Redeemer - Cristo Redentor.jpg",
  "The_Office_(American_TV_series)": "The Office (U.S. TV series).svg",
  "Drake_(musician)": "Drake July 2016.jpg",
  "Queen_(band)": "Queen band members.jpg",
  "Chihuahua_(dog)": "Chihuahua1 bv.jpg",
  "Dalmatian_(dog)": "Dalmatian puppy.jpg",
  Galapagos_Islands: "Galapagos land iguana (Conolophus subcristatus).jpg",
  "Saturn_(planet)": "Saturn during Equinox.jpg",
  "Mercury_(planet)": "Mercury in true color.jpg",
  "Star_Wars_(film)": "StarWarsMoviePoster1977.jpg",
  "Titanic_(1997_film)": "Titanic poster.jpg",
  "Jurassic_Park_(film)": "Jurassic Park poster.jpg",
  "Avatar_(2009_film)": "Avatar (2009 film) poster.jpg",
  "The_Crown_(TV_series)": "The Crown title card.jpg",
  Volodymyr_Zelenskyy: "Volodymyr Zelensky Official portrait.jpg",
  Forrest_Gump: "Forrest Gump poster.jpg",
  Friends: "Friends season one cast.jpg",
  Game_of_Thrones: "Game of Thrones title card.jpg",
  Grand_Theft_Auto_V: "Grand Theft Auto V.png",
  Inception: "Inception ver3.jpg",
  Minecraft: "Minecraft cover.png",
  The_Dark_Knight: "Dark Knight.jpg",
  The_Godfather: "Godfather ver1.jpg",
  The_Lion_King: "The Lion King poster.jpg",
  The_Matrix: "The Matrix Poster.jpg",
  The_Persistence_of_Memory: "The Persistence of Memory.jpg",
  Japan: "Mount Fuji from a nearby mountain.jpg",
  France: "Tour Eiffel Wikimedia Commons (cropped).jpg",
  Germany: "Brandenburger Tor abends.jpg",
  Italy: "Colosseo 2020.jpg",
  Brazil: "Christ the Redeemer - Cristo Redentor.jpg",
  Egypt: "Kheops-Pyramid.jpg",
  Australia: "Sydney Opera House Sails.jpg",
  Canada: "Parliament Hill, Ottawa, Canada.jpg",
  India: "Taj Mahal, Agra, India edit.jpg",
  Mexico: "Angel of Independence Mexico City.jpg",
  China: "The Great Wall of China at Jinshanling-edit.jpg",
  Spain: "Sagrada Familia 01.jpg",
  Norway: "Geirangerfjord and Seven Sisters.jpg",
  Kenya: "Mount Kenya.jpg",
  Thailand: "Wat Arun Ratchawararam Ratchawaramahawihan (cropped).jpg",
  Netherlands: "Amsterdam canal.jpg",
  Turkey: "Hagia Sophia Mars 2013.jpg",
  Greece: "Parthenon from west.jpg",
  Argentina: "Obelisco Buenos Aires.jpg",
  South_Korea: "Seoul N Tower at night.jpg",
};

function commonsRedirectUrl(filename, width = 640) {
  return `https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/${encodeURIComponent(filename)}&width=${width}`;
}

async function fetchBatch(titles) {
  const params = new URLSearchParams({
    action: "query",
    titles: titles.map((t) => t.replace(/_/g, " ")).join("|"),
    prop: "pageimages",
    piprop: "thumbnail|original",
    pithumbsize: "640",
    format: "json",
    redirects: "1",
    origin: "*",
  });
  const res = await fetch(`https://en.wikipedia.org/w/api.php?${params}`, {
    headers: { "User-Agent": UA },
  });
  if (!res.ok) return {};
  const json = await res.json();
  const out = {};
  for (const redirect of json.query?.redirects ?? []) {
    out[String(redirect.from).replace(/ /g, "_")] = String(redirect.to).replace(/ /g, "_");
  }
  for (const page of Object.values(json.query?.pages ?? {})) {
    if (!page.title || page.missing !== undefined) continue;
    const key = page.title.replace(/ /g, "_");
    const url = page.original?.source ?? page.thumbnail?.source;
    if (url) out[key] = url;
  }
  return out;
}

function collectWikiTitles() {
  const entitiesPath = path.join(__dirname, "../lib/data/entities.ts");
  const src = fs.readFileSync(entitiesPath, "utf8");
  const wikis = new Set();
  for (const m of src.matchAll(/wiki:\s*"([^"]+)"/g)) wikis.add(m[1]);
  for (const m of src.matchAll(/wiki:\s*'([^']+)'/g)) wikis.add(m[1]);
  return [...wikis].sort();
}

async function main() {
  const titles = collectWikiTitles();
  const outPath = path.join(__dirname, "../lib/media/image-manifest.ts");

  /** Keep existing entries when a refresh batch fails. */
  let existing = {};
  try {
    const prev = fs.readFileSync(outPath, "utf8");
    for (const m of prev.matchAll(/"([^"]+)":\s*"([^"]+)"/g)) {
      existing[m[1]] = m[2];
    }
  } catch {
    /* first run */
  }

  const manifest = { ...existing };
  const BATCH = 40;

  for (let i = 0; i < titles.length; i += BATCH) {
    const batch = titles.slice(i, i + BATCH);
    console.log(`Fetching ${i + 1}-${i + batch.length} / ${titles.length}...`);
    try {
      const results = await fetchBatch(batch);
      for (const wiki of batch) {
        if (FILE_OVERRIDES[wiki]) {
          manifest[wiki] = commonsRedirectUrl(FILE_OVERRIDES[wiki]);
        } else if (results[wiki] && results[wiki].startsWith("http")) {
          manifest[wiki] = results[wiki];
        } else {
          const resolved = Object.entries(results).find(([k]) => k === wiki);
          if (resolved?.[1]?.startsWith("http")) manifest[wiki] = resolved[1];
        }
      }
    } catch (err) {
      console.warn("Batch failed:", err.message);
      for (const wiki of batch) {
        if (FILE_OVERRIDES[wiki]) {
          manifest[wiki] = commonsRedirectUrl(FILE_OVERRIDES[wiki]);
        }
      }
    }
    await new Promise((r) => setTimeout(r, 300));
  }

  for (const [wiki, file] of Object.entries(FILE_OVERRIDES)) {
    if (!manifest[wiki]) manifest[wiki] = commonsRedirectUrl(file);
  }

  const missing = titles.filter((t) => !manifest[t]);
  console.log(`Resolved ${Object.keys(manifest).length}/${titles.length}, missing: ${missing.length}`);
  if (missing.length) console.log("Missing:", missing.join(", "));

  const lines = [
    "/** Auto-generated verified image URLs — run: node scripts/generate-image-manifest.mjs */",
    "export const imageManifest: Record<string, string> = {",
  ];
  for (const [wiki, url] of Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b))) {
    lines.push(`  ${JSON.stringify(wiki)}: ${JSON.stringify(url)},`);
  }
  lines.push("};");
  lines.push("");
  lines.push("export function getManifestImage(wiki: string): string | undefined {");
  lines.push("  return imageManifest[wiki];");
  lines.push("}");

  const outPath = path.join(__dirname, "../lib/media/image-manifest.ts");
  fs.writeFileSync(outPath, lines.join("\n"));
  console.log("Wrote", outPath);
}

main().catch(console.error);
