import fs from "fs";
const src = fs.readFileSync("lib/media/image-manifest.ts", "utf8");
const entries = [...src.matchAll(/"([^"]+)":\s*"([^"]+)"/g)].map((m) => [m[1], m[2]]);
const redirect = entries.filter(([, u]) => u.includes("commons.wikimedia.org"));
console.log("redirect count", redirect.length, "of", entries.length);
console.log("sample", redirect.slice(0, 8));
