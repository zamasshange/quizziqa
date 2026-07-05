import type { Collection } from "@/lib/types";

export const collections: Collection[] = [
  { id: "capitals", slug: "world-capitals", title: "World Capitals", description: "Test your knowledge of capital cities", emoji: "🏛", gameIds: ["flag-quiz"], color: "#3B82F6" },
  { id: "euro-cars", slug: "european-cars", title: "European Cars", description: "Classic and modern European automobiles", emoji: "🚗", gameIds: ["car-silhouette"], color: "#6366F1" },
  { id: "consoles", slug: "classic-consoles", title: "Classic Consoles", description: "Retro gaming hardware through the ages", emoji: "🎮", gameIds: [], color: "#10B981" },
  { id: "fast-food", slug: "fast-food-logos", title: "Fast Food Logos", description: "Recognize iconic fast food brands", emoji: "🍔", gameIds: ["brand-logos"], color: "#EF4444" },
  { id: "flags", slug: "national-flags", title: "National Flags", description: "Every flag tells a story", emoji: "🏳", gameIds: ["flag-quiz"], color: "#F59E0B" },
  { id: "paintings", slug: "famous-paintings", title: "Famous Paintings", description: "Masterpieces from art history", emoji: "🎨", gameIds: [], color: "#E11D48" },
  { id: "wonders", slug: "ancient-wonders", title: "Ancient Wonders", description: "Marvels of the ancient world", emoji: "🏛", gameIds: ["landmark-guess"], color: "#A855F7" },
  { id: "disney", slug: "disney-movies", title: "Disney Movies", description: "Magical moments from Disney films", emoji: "✨", gameIds: ["movie-quotes"], color: "#EC4899" },
  { id: "olympics", slug: "olympic-sports", title: "Olympic Sports", description: "Events from the greatest sporting stage", emoji: "🏅", gameIds: [], color: "#22C55E" },
  { id: "planets", slug: "planets", title: "Planets", description: "Journey through our solar system", emoji: "🪐", gameIds: ["space-planets"], color: "#0EA5E9" },
];

export function getCollectionBySlug(slug: string) {
  return collections.find((c) => c.slug === slug);
}
