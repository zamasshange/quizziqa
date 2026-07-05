import type { Game } from "@/lib/types";

export const games: Game[] = [
  {
    id: "flag-quiz",
    slug: "world-flags",
    title: "World Flags",
    description: "Identify countries from their flags",
    categoryId: "geo",
    mode: "guess-from-image",
    difficulty: "medium",
    xpReward: 50,
    timeLimit: 30,
    maxHints: 2,
    maxSkips: 1,
    featured: true,
    trending: true,
    offline: true,
    questions: [
      { id: "f1", question: "Which country does this flag belong to?", answer: "Japan", alternatives: ["China", "South Korea", "Thailand"], image: "https://images.unsplash.com/photo-1493974678665-dee736ee9798?w=400&h=300&fit=crop", fact: "Japan's flag represents the sun, and the country is known as the Land of the Rising Sun.", difficulty: "easy" },
      { id: "f2", question: "Which country does this flag belong to?", answer: "Brazil", alternatives: ["Argentina", "Portugal", "Colombia"], image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=400&h=300&fit=crop", fact: "Brazil is the largest country in South America and home to the Amazon rainforest.", difficulty: "medium" },
      { id: "f3", question: "Which country does this flag belong to?", answer: "France", alternatives: ["Italy", "Netherlands", "Belgium"], image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&h=300&fit=crop", fact: "The Eiffel Tower was completed in 1889 for the World's Fair.", difficulty: "easy" },
      { id: "f4", question: "Which country does this flag belong to?", answer: "Egypt", alternatives: ["Morocco", "Turkey", "Greece"], image: "https://images.unsplash.com/photo-1572252009283-48c3ec8092ef?w=400&h=300&fit=crop", fact: "The Great Pyramid of Giza is the oldest of the Seven Wonders of the Ancient World.", difficulty: "medium" },
      { id: "f5", question: "Which country does this flag belong to?", answer: "Australia", alternatives: ["New Zealand", "United Kingdom", "Canada"], image: "https://images.unsplash.com/photo-1523482580670-44fcac89a0a2?w=400&h=300&fit=crop", fact: "Australia is both a country and a continent, and is home to unique wildlife like kangaroos.", difficulty: "easy" },
    ],
  },
  {
    id: "animal-sounds",
    slug: "guess-the-animal",
    title: "Guess the Animal",
    description: "Identify animals from photos and clues",
    categoryId: "animals",
    mode: "guess-from-clues",
    difficulty: "easy",
    xpReward: 40,
    maxHints: 3,
    maxSkips: 2,
    trending: true,
    isNew: true,
    questions: [
      { id: "a1", question: "What animal is this?", answer: "Lion", alternatives: ["Tiger", "Leopard", "Cheetah"], image: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400&h=300&fit=crop", clues: ["King of the jungle", "Lives in prides", "Males have manes"], fact: "A lion's roar can be heard up to 5 miles away.", difficulty: "easy" },
      { id: "a2", question: "What animal is this?", answer: "Penguin", alternatives: ["Puffin", "Albatross", "Pelican"], image: "https://images.unsplash.com/photo-1551986784-d9820f037963?w=400&h=300&fit=crop", clues: ["Cannot fly", "Lives in cold climates", "Excellent swimmer"], fact: "Emperor penguins can dive over 500 meters deep.", difficulty: "easy" },
      { id: "a3", question: "What animal is this?", answer: "Elephant", alternatives: ["Rhino", "Hippo", "Walrus"], image: "https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&h=300&fit=crop", clues: ["Largest land animal", "Has a trunk", "Incredible memory"], fact: "Elephants can recognize themselves in a mirror — a sign of self-awareness.", difficulty: "medium" },
    ],
  },
  {
    id: "food-emoji",
    slug: "food-emoji-quiz",
    title: "Food Emoji Quiz",
    description: "Guess dishes from emoji combinations",
    categoryId: "food",
    mode: "guess-from-emoji",
    difficulty: "medium",
    xpReward: 45,
    maxHints: 2,
    maxSkips: 1,
    featured: true,
    questions: [
      { id: "fo1", question: "What dish do these emojis represent?", answer: "Pizza", emoji: "🍕🇮🇹", alternatives: ["Pasta", "Calzone", "Focaccia"], fact: "Modern pizza originated in Naples, Italy in the 18th century.", difficulty: "easy" },
      { id: "fo2", question: "What dish do these emojis represent?", answer: "Sushi", emoji: "🍣🐟", alternatives: ["Sashimi", "Ramen", "Tempura"], fact: "Sushi was originally a method of preserving fish in fermented rice.", difficulty: "medium" },
      { id: "fo3", question: "What dish do these emojis represent?", answer: "Tacos", emoji: "🌮🇲🇽", alternatives: ["Burrito", "Quesadilla", "Enchilada"], fact: "Tacos predate the arrival of Europeans in Mexico.", difficulty: "easy" },
    ],
  },
  {
    id: "car-silhouette",
    slug: "car-silhouettes",
    title: "Car Silhouettes",
    description: "Identify cars from their silhouettes",
    categoryId: "cars",
    mode: "guess-silhouette",
    difficulty: "hard",
    xpReward: 60,
    timeLimit: 20,
    maxHints: 1,
    maxSkips: 1,
    trending: true,
    questions: [
      { id: "c1", question: "Which car model is this?", answer: "Porsche 911", alternatives: ["Ferrari 488", "Lamborghini Huracán", "Audi R8"], image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop", fact: "The Porsche 911 has been in continuous production since 1964.", difficulty: "hard" },
      { id: "c2", question: "Which car model is this?", answer: "Tesla Model S", alternatives: ["BMW i4", "Mercedes EQS", "Polestar 2"], image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop", fact: "The Model S was the first electric car to top monthly sales in a country (Norway, 2013).", difficulty: "medium" },
    ],
  },
  {
    id: "movie-quotes",
    slug: "movie-quotes",
    title: "Movie Quotes",
    description: "Guess the movie from famous quotes",
    categoryId: "movies",
    mode: "multiple-choice",
    difficulty: "medium",
    xpReward: 50,
    maxHints: 2,
    maxSkips: 1,
    featured: true,
    offline: true,
    questions: [
      { id: "m1", question: "\"May the Force be with you.\" — Which movie?", answer: "Star Wars", alternatives: ["Star Trek", "Guardians of the Galaxy", "Avatar"], fact: "Star Wars (1977) revolutionized special effects and became a global phenomenon.", difficulty: "easy" },
      { id: "m2", question: "\"Here's looking at you, kid.\" — Which movie?", answer: "Casablanca", alternatives: ["Gone with the Wind", "Citizen Kane", "The Maltese Falcon"], fact: "Casablanca won 3 Academy Awards including Best Picture in 1944.", difficulty: "hard" },
      { id: "m3", question: "\"I'll be back.\" — Which movie?", answer: "The Terminator", alternatives: ["Predator", "RoboCop", "Total Recall"], fact: "Arnold Schwarzenegger improvised the iconic line in The Terminator (1984).", difficulty: "medium" },
    ],
  },
  {
    id: "landmark-guess",
    slug: "famous-landmarks",
    title: "Famous Landmarks",
    description: "Identify world-famous landmarks",
    categoryId: "landmarks",
    mode: "guess-from-image",
    difficulty: "easy",
    xpReward: 40,
    maxHints: 2,
    maxSkips: 2,
    isNew: true,
    questions: [
      { id: "l1", question: "What landmark is this?", answer: "Eiffel Tower", alternatives: ["Tokyo Tower", "CN Tower", "Space Needle"], image: "https://images.unsplash.com/photo-1511739001486-6b10f1a3fb7b?w=400&h=300&fit=crop", fact: "The Eiffel Tower was completed in 1889 and was initially criticized by Parisian artists.", difficulty: "easy" },
      { id: "l2", question: "What landmark is this?", answer: "Colosseum", alternatives: ["Parthenon", "Pantheon", "Acropolis"], image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=400&h=300&fit=crop", fact: "The Colosseum could hold 50,000-80,000 spectators for gladiatorial contests.", difficulty: "medium" },
    ],
  },
  {
    id: "brand-logos",
    slug: "brand-logos",
    title: "Brand Logos",
    description: "Identify famous brand logos",
    categoryId: "brands",
    mode: "guess-from-image",
    difficulty: "medium",
    xpReward: 55,
    maxHints: 1,
    maxSkips: 1,
    trending: true,
    questions: [
      { id: "b1", question: "Which brand is this?", answer: "Apple", alternatives: ["Samsung", "Google", "Microsoft"], fact: "Apple's logo with a bite taken out was designed to prevent it from being confused with a cherry.", difficulty: "easy" },
      { id: "b2", question: "Which brand is this?", answer: "Nike", alternatives: ["Adidas", "Puma", "Reebok"], fact: "The Nike Swoosh was designed by a student for just $35 in 1971.", difficulty: "easy" },
    ],
  },
  {
    id: "space-planets",
    slug: "planets-quiz",
    title: "Planets Quiz",
    description: "Explore our solar system",
    categoryId: "space",
    mode: "multiple-choice",
    difficulty: "easy",
    xpReward: 35,
    maxHints: 3,
    maxSkips: 2,
    offline: true,
    questions: [
      { id: "s1", question: "Which planet is known as the Red Planet?", answer: "Mars", alternatives: ["Venus", "Jupiter", "Mercury"], fact: "Mars gets its red color from iron oxide (rust) on its surface.", difficulty: "easy" },
      { id: "s2", question: "Which planet has the most moons?", answer: "Saturn", alternatives: ["Jupiter", "Uranus", "Neptune"], fact: "Saturn has over 140 confirmed moons, including Titan which is larger than Mercury.", difficulty: "medium" },
    ],
  },
];

export function getGameBySlug(slug: string) {
  return games.find((g) => g.slug === slug);
}

export function getGameById(id: string) {
  return games.find((g) => g.id === id);
}

export function getGamesByCategory(categoryId: string) {
  return games.filter((g) => g.categoryId === categoryId);
}

export function getFeaturedGames() {
  return games.filter((g) => g.featured);
}

export function getTrendingGames() {
  return games.filter((g) => g.trending);
}

export function getNewGames() {
  return games.filter((g) => g.isNew);
}
