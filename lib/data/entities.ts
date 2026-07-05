/** Wikipedia page titles (use underscores). Used to build dynamic games. */

export interface EntityEntry {
  wiki: string;
  /** Display answer override */
  answer?: string;
}

export const celebrities: EntityEntry[] = [
  { wiki: "Leonardo_DiCaprio" },
  { wiki: "Taylor_Swift" },
  { wiki: "Beyonce", answer: "Beyonce" },
  { wiki: "Tom_Cruise" },
  { wiki: "Dwayne_Johnson", answer: "Dwayne Johnson" },
  { wiki: "Rihanna" },
  { wiki: "Cristiano_Ronaldo" },
  { wiki: "Serena_Williams" },
  { wiki: "Barack_Obama" },
  { wiki: "Oprah_Winfrey" },
  { wiki: "Elon_Musk" },
  { wiki: "Zendaya" },
  { wiki: "Ryan_Reynolds" },
  { wiki: "Emma_Watson" },
  { wiki: "Keanu_Reeves" },
  { wiki: "Lady_Gaga" },
  { wiki: "Michael_Jordan" },
  { wiki: "Scarlett_Johansson" },
  { wiki: "Robert_Downey_Jr.", answer: "Robert Downey Jr." },
  { wiki: "Jennifer_Lawrence" },
];

export const cities: EntityEntry[] = [
  { wiki: "Paris" },
  { wiki: "Tokyo" },
  { wiki: "New_York_City", answer: "New York City" },
  { wiki: "London" },
  { wiki: "Rome" },
  { wiki: "Sydney" },
  { wiki: "Dubai" },
  { wiki: "Barcelona" },
  { wiki: "Cairo" },
  { wiki: "Rio_de_Janeiro", answer: "Rio de Janeiro" },
  { wiki: "Moscow" },
  { wiki: "Singapore" },
  { wiki: "Istanbul" },
  { wiki: "Los_Angeles" },
  { wiki: "Hong_Kong", answer: "Hong Kong" },
];

export const countries: EntityEntry[] = [
  { wiki: "Japan" },
  { wiki: "Brazil" },
  { wiki: "France" },
  { wiki: "Egypt" },
  { wiki: "Australia" },
  { wiki: "Canada" },
  { wiki: "Germany" },
  { wiki: "India" },
  { wiki: "Mexico" },
  { wiki: "South_Korea", answer: "South Korea" },
  { wiki: "Italy" },
  { wiki: "Spain" },
  { wiki: "Argentina" },
  { wiki: "Norway" },
  { wiki: "Kenya" },
  { wiki: "China" },
  { wiki: "Thailand" },
  { wiki: "Netherlands" },
  { wiki: "Turkey" },
  { wiki: "Greece" },
];

export const animals: EntityEntry[] = [
  { wiki: "Lion" },
  { wiki: "African_elephant", answer: "African Elephant" },
  { wiki: "Giant_panda", answer: "Giant Panda" },
  { wiki: "Emperor_penguin", answer: "Emperor Penguin" },
  { wiki: "Bald_eagle", answer: "Bald Eagle" },
  { wiki: "Blue_whale", answer: "Blue Whale" },
  { wiki: "Giraffe" },
  { wiki: "Kangaroo" },
  { wiki: "Tiger" },
  { wiki: "Dolphin" },
  { wiki: "Red_panda", answer: "Red Panda" },
  { wiki: "Polar_bear", answer: "Polar Bear" },
];

export const landmarks: EntityEntry[] = [
  { wiki: "Eiffel_Tower", answer: "Eiffel Tower" },
  { wiki: "Statue_of_Liberty", answer: "Statue of Liberty" },
  { wiki: "Colosseum" },
  { wiki: "Taj_Mahal", answer: "Taj Mahal" },
  { wiki: "Great_Wall_of_China", answer: "Great Wall of China" },
  { wiki: "Machu_Picchu", answer: "Machu Picchu" },
  { wiki: "Christ_the_Redeemer_(statue)", answer: "Christ the Redeemer" },
  { wiki: "Sydney_Opera_House", answer: "Sydney Opera House" },
  { wiki: "Big_Ben", answer: "Big Ben" },
  { wiki: "Petra" },
];

export const planets: EntityEntry[] = [
  { wiki: "Mars" },
  { wiki: "Jupiter" },
  { wiki: "Saturn_(planet)", answer: "Saturn" },
  { wiki: "Venus" },
  { wiki: "Mercury_(planet)", answer: "Mercury" },
  { wiki: "Neptune" },
  { wiki: "Uranus" },
  { wiki: "Earth" },
];

export const paintings: EntityEntry[] = [
  { wiki: "Mona_Lisa", answer: "Mona Lisa" },
  { wiki: "The_Starry_Night", answer: "The Starry Night" },
  { wiki: "The_Scream", answer: "The Scream" },
  { wiki: "Girl_with_a_Pearl_Earring", answer: "Girl with a Pearl Earring" },
  { wiki: "The_Persistence_of_Memory", answer: "The Persistence of Memory" },
  { wiki: "American_Gothic", answer: "American Gothic" },
];

export const athletes: EntityEntry[] = [
  { wiki: "Lionel_Messi", answer: "Lionel Messi" },
  { wiki: "LeBron_James", answer: "LeBron James" },
  { wiki: "Usain_Bolt", answer: "Usain Bolt" },
  { wiki: "Simone_Biles", answer: "Simone Biles" },
  { wiki: "Roger_Federer", answer: "Roger Federer" },
  { wiki: "Naomi_Osaka", answer: "Naomi Osaka" },
  { wiki: "Tom_Brady", answer: "Tom Brady" },
  { wiki: "Serena_Williams", answer: "Serena Williams" },
];

export const flowers: EntityEntry[] = [
  { wiki: "Rose" },
  { wiki: "Sunflower" },
  { wiki: "Tulip" },
  { wiki: "Orchid" },
  { wiki: "Lotus_flower", answer: "Lotus" },
  { wiki: "Cherry_blossom", answer: "Cherry Blossom" },
  { wiki: "Lavender" },
  { wiki: "Daffodil" },
];

export const scientists: EntityEntry[] = [
  { wiki: "Albert_Einstein", answer: "Albert Einstein" },
  { wiki: "Marie_Curie", answer: "Marie Curie" },
  { wiki: "Isaac_Newton", answer: "Isaac Newton" },
  { wiki: "Charles_Darwin", answer: "Charles Darwin" },
  { wiki: "Stephen_Hawking", answer: "Stephen Hawking" },
  { wiki: "Nikola_Tesla", answer: "Nikola Tesla" },
];

export const foods: EntityEntry[] = [
  { wiki: "Pizza" },
  { wiki: "Sushi" },
  { wiki: "Croissant" },
  { wiki: "Taco" },
  { wiki: "Paella" },
  { wiki: "Ramen" },
  { wiki: "Pad_Thai", answer: "Pad Thai" },
  { wiki: "Hamburger" },
];
