import fs from "fs";

const src = fs.readFileSync("lib/data/entities.ts", "utf8");
const wikis = new Set();
for (const m of src.matchAll(/wiki:\s*["']([^"']+)["']/g)) wikis.add(m[1]);

const man = fs.readFileSync("lib/media/image-manifest.ts", "utf8");
const have = new Set();
for (const m of man.matchAll(/"([^"]+)":\s*"https/g)) have.add(m[1]);

const missing = [...wikis].filter((w) => !have.has(w)).sort();
console.log("missing", missing.length);
console.log(missing.join("\n"));
