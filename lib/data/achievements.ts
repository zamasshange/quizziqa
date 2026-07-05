import type { Achievement } from "@/lib/types";

export const achievements: Achievement[] = [
  { id: "first-win", title: "First Win", description: "Complete your first game", emoji: "🎉", xpBonus: 25 },
  { id: "10-correct", title: "10 Correct Answers", description: "Answer 10 questions correctly", emoji: "✅", xpBonus: 50 },
  { id: "100-correct", title: "100 Correct Answers", description: "Answer 100 questions correctly", emoji: "💯", xpBonus: 200 },
  { id: "perfect-game", title: "Perfect Game", description: "Get every answer right in a game", emoji: "⭐", xpBonus: 100 },
  { id: "7-streak", title: "7-Day Streak", description: "Play 7 days in a row", emoji: "🔥", xpBonus: 150 },
  { id: "30-streak", title: "30-Day Streak", description: "Play 30 days in a row", emoji: "🏆", xpBonus: 500 },
  { id: "animal-expert", title: "Animal Expert", description: "Master the Animals category", emoji: "🐾", xpBonus: 100 },
  { id: "movie-master", title: "Movie Master", description: "Master the Movies category", emoji: "🎬", xpBonus: 100 },
  { id: "geo-genius", title: "Geography Genius", description: "Master the Geography category", emoji: "🌍", xpBonus: 100 },
  { id: "car-collector", title: "Car Collector", description: "Master the Cars category", emoji: "🏎", xpBonus: 100 },
  { id: "tech-wizard", title: "Technology Wizard", description: "Master the Technology category", emoji: "💻", xpBonus: 100 },
  { id: "completionist", title: "Completionist", description: "Complete every game in a category", emoji: "👑", xpBonus: 300 },
];
