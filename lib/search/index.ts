import { categories } from "@/lib/data/categories";
import { collections } from "@/lib/data/collections";
import { games } from "@/lib/data/games";
import { gameTemplates } from "@/lib/games/templates";
import {
  celebrities,
  cities,
  countries,
  animals,
  landmarks,
  capitals,
  presidents,
  athletes,
  foods,
  flowers,
  scientists,
  planets,
  paintings,
  phones,
  films,
  musicArtists,
  tvShows,
  videoGames,
  brands,
  dinosaurs,
  birds,
  instruments,
  writers,
  explorers,
  mountains,
  islands,
  inventions,
  dogBreeds,
} from "@/lib/data/entities";

export type SearchResultType = "game" | "category" | "collection" | "entity";

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  emoji?: string;
  href: string;
}

const entityGroups: { entities: { wiki: string; answer?: string }[]; label: string; emoji: string; gameSlug: string }[] = [
  { entities: celebrities, label: "Celebrity", emoji: "⭐", gameSlug: "guess-the-celebrity" },
  { entities: countries, label: "Country", emoji: "🌍", gameSlug: "guess-the-flag" },
  { entities: capitals, label: "Capital", emoji: "🏛", gameSlug: "guess-the-capital" },
  { entities: cities, label: "City", emoji: "🏙", gameSlug: "guess-the-city" },
  { entities: animals, label: "Animal", emoji: "🐾", gameSlug: "guess-the-animal-wiki" },
  { entities: landmarks, label: "Landmark", emoji: "🏰", gameSlug: "guess-the-landmark" },
  { entities: presidents, label: "President", emoji: "🎖", gameSlug: "guess-the-president" },
  { entities: athletes, label: "Athlete", emoji: "🏅", gameSlug: "guess-the-athlete" },
  { entities: foods, label: "Food", emoji: "🍕", gameSlug: "guess-the-food" },
  { entities: flowers, label: "Flower", emoji: "🌸", gameSlug: "guess-the-flower" },
  { entities: scientists, label: "Scientist", emoji: "🔬", gameSlug: "guess-the-scientist" },
  { entities: planets, label: "Planet", emoji: "🪐", gameSlug: "guess-the-planet" },
  { entities: paintings, label: "Painting", emoji: "🎨", gameSlug: "guess-the-painting" },
  { entities: phones, label: "Phone", emoji: "📱", gameSlug: "guess-the-phone" },
  { entities: films, label: "Movie", emoji: "🎬", gameSlug: "guess-the-movie" },
  { entities: musicArtists, label: "Artist", emoji: "🎵", gameSlug: "guess-the-artist" },
  { entities: tvShows, label: "TV Show", emoji: "📺", gameSlug: "guess-the-tv-show" },
  { entities: videoGames, label: "Video Game", emoji: "🎮", gameSlug: "guess-the-video-game" },
  { entities: brands, label: "Brand", emoji: "🏢", gameSlug: "guess-the-brand" },
  { entities: dinosaurs, label: "Dinosaur", emoji: "🦕", gameSlug: "guess-the-dinosaur" },
  { entities: birds, label: "Bird", emoji: "🐦", gameSlug: "guess-the-bird" },
  { entities: instruments, label: "Instrument", emoji: "🎸", gameSlug: "guess-the-instrument" },
  { entities: writers, label: "Writer", emoji: "✍️", gameSlug: "guess-the-writer" },
  { entities: explorers, label: "Explorer", emoji: "🧭", gameSlug: "guess-the-explorer" },
  { entities: mountains, label: "Mountain", emoji: "⛰", gameSlug: "guess-the-mountain" },
  { entities: islands, label: "Island", emoji: "🏝", gameSlug: "guess-the-island" },
  { entities: inventions, label: "Invention", emoji: "💡", gameSlug: "guess-the-invention" },
  { entities: dogBreeds, label: "Dog Breed", emoji: "🐕", gameSlug: "guess-the-dog-breed" },
];

function buildSearchIndex(): SearchResult[] {
  const index: SearchResult[] = [];

  for (const cat of categories) {
    index.push({
      id: `cat-${cat.id}`,
      type: "category",
      title: cat.name,
      subtitle: cat.description,
      emoji: cat.emoji,
      href: `/categories/${cat.slug}`,
    });
  }

  const allGames = [
    ...games.map((g) => ({ ...g, slug: g.slug })),
    ...gameTemplates.map((t) => ({ ...t, slug: t.slug })),
  ];

  for (const game of allGames) {
    const cat = categories.find((c) => c.id === game.categoryId);
    index.push({
      id: `game-${game.id}`,
      type: "game",
      title: game.title,
      subtitle: game.description,
      emoji: cat?.emoji ?? "🎯",
      href: `/play/${game.slug}`,
    });
  }

  for (const col of collections) {
    index.push({
      id: `col-${col.id}`,
      type: "collection",
      title: col.title,
      subtitle: col.description,
      emoji: col.emoji,
      href: `/collections/${col.slug}`,
    });
  }

  for (const group of entityGroups) {
    for (const entity of group.entities) {
      const title = entity.answer ?? entity.wiki.replace(/_/g, " ");
      index.push({
        id: `entity-${entity.wiki}`,
        type: "entity",
        title,
        subtitle: group.label,
        emoji: group.emoji,
        href: `/play/${group.gameSlug}`,
      });
    }
  }

  return index;
}

let cachedIndex: SearchResult[] | null = null;

export function getSearchIndex(): SearchResult[] {
  if (!cachedIndex) cachedIndex = buildSearchIndex();
  return cachedIndex;
}

export function searchAll(query: string, limit = 30): SearchResult[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return getSearchIndex()
    .filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.subtitle?.toLowerCase().includes(q)
    )
    .slice(0, limit);
}
