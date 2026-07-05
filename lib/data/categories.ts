import type { Category } from "@/lib/types";

export const categories: Category[] = [
  { id: "geo", slug: "geography", name: "Geography", emoji: "🌍", description: "Countries, capitals, flags & landmarks", color: "#3B82F6", gradient: "from-blue-500 to-cyan-400", gameCount: 48 },
  { id: "animals", slug: "animals", name: "Animals", emoji: "🐶", description: "Wildlife, pets & creatures big and small", color: "#F59E0B", gradient: "from-amber-500 to-orange-400", gameCount: 36 },
  { id: "food", slug: "food", name: "Food", emoji: "🍕", description: "Dishes, ingredients & cuisines worldwide", color: "#EF4444", gradient: "from-red-500 to-rose-400", gameCount: 42 },
  { id: "cars", slug: "cars", name: "Cars", emoji: "🚗", description: "Classic, modern & exotic automobiles", color: "#6366F1", gradient: "from-indigo-500 to-violet-400", gameCount: 32 },
  { id: "phones", slug: "phones", name: "Phones", emoji: "📱", description: "Smartphones through the ages", color: "#8B5CF6", gradient: "from-violet-500 to-purple-400", gameCount: 24 },
  { id: "games", slug: "video-games", name: "Video Games", emoji: "🎮", description: "Consoles, characters & gaming history", color: "#10B981", gradient: "from-emerald-500 to-teal-400", gameCount: 56 },
  { id: "movies", slug: "movies", name: "Movies", emoji: "🎬", description: "Blockbusters, classics & cult favorites", color: "#EC4899", gradient: "from-pink-500 to-fuchsia-400", gameCount: 64 },
  { id: "tv", slug: "tv-shows", name: "TV Shows", emoji: "📺", description: "Series, characters & iconic moments", color: "#14B8A6", gradient: "from-teal-500 to-cyan-400", gameCount: 40 },
  { id: "music", slug: "music", name: "Music", emoji: "🎵", description: "Artists, albums & music trivia", color: "#F97316", gradient: "from-orange-500 to-amber-400", gameCount: 38 },
  { id: "sports", slug: "sports", name: "Sports", emoji: "🏆", description: "Athletes, teams & sporting events", color: "#22C55E", gradient: "from-green-500 to-lime-400", gameCount: 44 },
  { id: "history", slug: "history", name: "History", emoji: "🏛", description: "Events, figures & ancient civilizations", color: "#A855F7", gradient: "from-purple-500 to-violet-400", gameCount: 36 },
  { id: "space", slug: "space", name: "Space", emoji: "🚀", description: "Planets, stars & space exploration", color: "#0EA5E9", gradient: "from-sky-500 to-blue-400", gameCount: 28 },
  { id: "science", slug: "science", name: "Science", emoji: "🧪", description: "Physics, chemistry & discoveries", color: "#06B6D4", gradient: "from-cyan-500 to-teal-400", gameCount: 34 },
  { id: "nature", slug: "nature", name: "Nature", emoji: "🌿", description: "Plants, ecosystems & natural wonders", color: "#84CC16", gradient: "from-lime-500 to-green-400", gameCount: 30 },
  { id: "fashion", slug: "fashion", name: "Fashion", emoji: "👗", description: "Designers, trends & style icons", color: "#D946EF", gradient: "from-fuchsia-500 to-pink-400", gameCount: 22 },
  { id: "brands", slug: "brands", name: "Brands", emoji: "🏢", description: "Logos, companies & brand history", color: "#64748B", gradient: "from-slate-500 to-gray-400", gameCount: 46 },
  { id: "art", slug: "art", name: "Art", emoji: "🎨", description: "Paintings, sculptures & artists", color: "#E11D48", gradient: "from-rose-500 to-red-400", gameCount: 26 },
  { id: "landmarks", slug: "landmarks", name: "Landmarks", emoji: "🏰", description: "Monuments, buildings & world wonders", color: "#78716C", gradient: "from-stone-500 to-neutral-400", gameCount: 32 },
  { id: "tech", slug: "technology", name: "Technology", emoji: "💻", description: "Gadgets, inventions & tech pioneers", color: "#2563EB", gradient: "from-blue-600 to-indigo-400", gameCount: 38 },
  { id: "celebrities", slug: "celebrities", name: "Celebrities", emoji: "⭐", description: "Actors, musicians, athletes & famous faces", color: "#F472B6", gradient: "from-pink-500 to-rose-400", gameCount: 24 },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryById(id: string) {
  return categories.find((c) => c.id === id);
}
