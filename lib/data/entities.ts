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

export const capitals: EntityEntry[] = [
  { wiki: "Paris" },
  { wiki: "London" },
  { wiki: "Tokyo" },
  { wiki: "Washington,_D.C.", answer: "Washington, D.C." },
  { wiki: "Berlin" },
  { wiki: "Moscow" },
  { wiki: "Beijing" },
  { wiki: "New_Delhi", answer: "New Delhi" },
  { wiki: "Canberra" },
  { wiki: "Brasilia", answer: "Brasília" },
  { wiki: "Cairo" },
  { wiki: "Ottawa" },
  { wiki: "Madrid" },
  { wiki: "Rome" },
  { wiki: "Seoul" },
  { wiki: "Bangkok" },
];

export const presidents: EntityEntry[] = [
  { wiki: "George_Washington", answer: "George Washington" },
  { wiki: "Abraham_Lincoln", answer: "Abraham Lincoln" },
  { wiki: "Franklin_D._Roosevelt", answer: "Franklin D. Roosevelt" },
  { wiki: "John_F._Kennedy", answer: "John F. Kennedy" },
  { wiki: "Barack_Obama", answer: "Barack Obama" },
  { wiki: "Joe_Biden", answer: "Joe Biden" },
  { wiki: "Donald_Trump", answer: "Donald Trump" },
  { wiki: "Thomas_Jefferson", answer: "Thomas Jefferson" },
  { wiki: "Theodore_Roosevelt", answer: "Theodore Roosevelt" },
  { wiki: "Ronald_Reagan", answer: "Ronald Reagan" },
  { wiki: "Winston_Churchill", answer: "Winston Churchill" },
  { wiki: "Nelson_Mandela", answer: "Nelson Mandela" },
  { wiki: "Charles_de_Gaulle", answer: "Charles de Gaulle" },
  { wiki: "Volodymyr_Zelenskyy", answer: "Volodymyr Zelenskyy" },
  { wiki: "Emmanuel_Macron", answer: "Emmanuel Macron" },
  { wiki: "Justin_Trudeau", answer: "Justin Trudeau" },
];

export const phones: EntityEntry[] = [
  { wiki: "IPhone", answer: "iPhone" },
  { wiki: "Samsung_Galaxy_S24", answer: "Samsung Galaxy S24" },
  { wiki: "Google_Pixel", answer: "Google Pixel" },
  { wiki: "BlackBerry", answer: "BlackBerry" },
  { wiki: "Nokia_3310", answer: "Nokia 3310" },
  { wiki: "Motorola_Razr", answer: "Motorola Razr" },
  { wiki: "IPhone_4", answer: "iPhone 4" },
  { wiki: "OnePlus", answer: "OnePlus" },
];

export const films: EntityEntry[] = [
  { wiki: "Star_Wars_(film)", answer: "Star Wars" },
  { wiki: "The_Godfather", answer: "The Godfather" },
  { wiki: "Titanic_(1997_film)", answer: "Titanic" },
  { wiki: "The_Dark_Knight", answer: "The Dark Knight" },
  { wiki: "Jurassic_Park_(film)", answer: "Jurassic Park" },
  { wiki: "Forrest_Gump", answer: "Forrest Gump" },
  { wiki: "The_Lion_King", answer: "The Lion King" },
  { wiki: "Avatar_(2009_film)", answer: "Avatar" },
  { wiki: "Inception", answer: "Inception" },
  { wiki: "The_Matrix", answer: "The Matrix" },
];

export const musicArtists: EntityEntry[] = [
  { wiki: "The_Beatles", answer: "The Beatles" },
  { wiki: "Michael_Jackson", answer: "Michael Jackson" },
  { wiki: "Madonna", answer: "Madonna" },
  { wiki: "Elvis_Presley", answer: "Elvis Presley" },
  { wiki: "Beyonce", answer: "Beyoncé" },
  { wiki: "Taylor_Swift", answer: "Taylor Swift" },
  { wiki: "Drake_(musician)", answer: "Drake" },
  { wiki: "Adele", answer: "Adele" },
  { wiki: "Queen_(band)", answer: "Queen" },
  { wiki: "Bob_Marley", answer: "Bob Marley" },
];

export const tvShows: EntityEntry[] = [
  { wiki: "Breaking_Bad", answer: "Breaking Bad" },
  { wiki: "Friends", answer: "Friends" },
  { wiki: "Game_of_Thrones", answer: "Game of Thrones" },
  { wiki: "The_Office_(American_TV_series)", answer: "The Office" },
  { wiki: "Stranger_Things", answer: "Stranger Things" },
  { wiki: "The_Simpsons", answer: "The Simpsons" },
  { wiki: "Squid_Game", answer: "Squid Game" },
  { wiki: "The_Crown_(TV_series)", answer: "The Crown" },
];

export const videoGames: EntityEntry[] = [
  { wiki: "Minecraft", answer: "Minecraft" },
  { wiki: "Super_Mario_Bros.", answer: "Super Mario Bros." },
  { wiki: "The_Legend_of_Zelda", answer: "The Legend of Zelda" },
  { wiki: "Grand_Theft_Auto_V", answer: "Grand Theft Auto V" },
  { wiki: "Fortnite", answer: "Fortnite" },
  { wiki: "Pac-Man", answer: "Pac-Man" },
  { wiki: "Tetris", answer: "Tetris" },
  { wiki: "Pokemon", answer: "Pokémon" },
];

export const cars: EntityEntry[] = [
  { wiki: "Porsche_911", answer: "Porsche 911" },
  { wiki: "Tesla_Model_S", answer: "Tesla Model S" },
  { wiki: "Ford_Mustang", answer: "Ford Mustang" },
  { wiki: "Ferrari_F40", answer: "Ferrari F40" },
  { wiki: "Lamborghini_Aventador", answer: "Lamborghini Aventador" },
  { wiki: "Volkswagen_Beetle", answer: "Volkswagen Beetle" },
  { wiki: "Toyota_Corolla", answer: "Toyota Corolla" },
  { wiki: "BMW_M3", answer: "BMW M3" },
];

export const brands: EntityEntry[] = [
  { wiki: "Apple_Inc.", answer: "Apple" },
  { wiki: "Nike,_Inc.", answer: "Nike" },
  { wiki: "Google", answer: "Google" },
  { wiki: "Amazon_(company)", answer: "Amazon" },
  { wiki: "McDonald's", answer: "McDonald's" },
  { wiki: "Coca-Cola", answer: "Coca-Cola" },
  { wiki: "Samsung", answer: "Samsung" },
  { wiki: "Microsoft", answer: "Microsoft" },
  { wiki: "Tesla,_Inc.", answer: "Tesla" },
  { wiki: "Adidas", answer: "Adidas" },
];

export const dinosaurs: EntityEntry[] = [
  { wiki: "Tyrannosaurus", answer: "Tyrannosaurus" },
  { wiki: "Triceratops" },
  { wiki: "Velociraptor" },
  { wiki: "Stegosaurus" },
  { wiki: "Brachiosaurus" },
  { wiki: "Spinosaurus" },
  { wiki: "Ankylosaurus" },
  { wiki: "Diplodocus" },
  { wiki: "Pteranodon" },
  { wiki: "Allosaurus" },
];

export const birds: EntityEntry[] = [
  { wiki: "Bald_eagle", answer: "Bald Eagle" },
  { wiki: "Penguin" },
  { wiki: "Peafowl", answer: "Peacock" },
  { wiki: "Flamingo" },
  { wiki: "Owl" },
  { wiki: "Parrot" },
  { wiki: "Hummingbird" },
  { wiki: "Ostrich" },
  { wiki: "Swan" },
  { wiki: "Toucan" },
];

export const instruments: EntityEntry[] = [
  { wiki: "Piano" },
  { wiki: "Guitar" },
  { wiki: "Violin" },
  { wiki: "Drum" },
  { wiki: "Trumpet" },
  { wiki: "Saxophone" },
  { wiki: "Flute" },
  { wiki: "Harp" },
  { wiki: "Cello" },
  { wiki: "Accordion" },
];

export const writers: EntityEntry[] = [
  { wiki: "William_Shakespeare", answer: "William Shakespeare" },
  { wiki: "Jane_Austen", answer: "Jane Austen" },
  { wiki: "Mark_Twain", answer: "Mark Twain" },
  { wiki: "Charles_Dickens", answer: "Charles Dickens" },
  { wiki: "J._K._Rowling", answer: "J.K. Rowling" },
  { wiki: "Ernest_Hemingway", answer: "Ernest Hemingway" },
  { wiki: "Agatha_Christie", answer: "Agatha Christie" },
  { wiki: "Leo_Tolstoy", answer: "Leo Tolstoy" },
  { wiki: "Franz_Kafka", answer: "Franz Kafka" },
  { wiki: "Maya_Angelou", answer: "Maya Angelou" },
];

export const explorers: EntityEntry[] = [
  { wiki: "Christopher_Columbus", answer: "Christopher Columbus" },
  { wiki: "Marco_Polo", answer: "Marco Polo" },
  { wiki: "Ferdinand_Magellan", answer: "Ferdinand Magellan" },
  { wiki: "Neil_Armstrong", answer: "Neil Armstrong" },
  { wiki: "Amelia_Earhart", answer: "Amelia Earhart" },
  { wiki: "Roald_Amundsen", answer: "Roald Amundsen" },
  { wiki: "Jacques_Cousteau", answer: "Jacques Cousteau" },
  { wiki: "Sacagawea" },
  { wiki: "Vasco_da_Gama", answer: "Vasco da Gama" },
  { wiki: "Ibn_Battuta", answer: "Ibn Battuta" },
];

export const mountains: EntityEntry[] = [
  { wiki: "Mount_Everest", answer: "Mount Everest" },
  { wiki: "K2" },
  { wiki: "Matterhorn" },
  { wiki: "Mount_Fuji", answer: "Mount Fuji" },
  { wiki: "Mount_Kilimanjaro", answer: "Mount Kilimanjaro" },
  { wiki: "Mont_Blanc", answer: "Mont Blanc" },
  { wiki: "Denali" },
  { wiki: "Mount_Rainier", answer: "Mount Rainier" },
  { wiki: "Aconcagua" },
  { wiki: "Mount_Elbrus", answer: "Mount Elbrus" },
];

export const islands: EntityEntry[] = [
  { wiki: "Hawaii" },
  { wiki: "Iceland" },
  { wiki: "Madagascar" },
  { wiki: "Bali" },
  { wiki: "Sicily" },
  { wiki: "Galapagos_Islands", answer: "Galápagos Islands" },
  { wiki: "Greenland" },
  { wiki: "Sri_Lanka", answer: "Sri Lanka" },
  { wiki: "Fiji" },
  { wiki: "Maldives" },
];

export const inventions: EntityEntry[] = [
  { wiki: "Light_bulb", answer: "Light Bulb" },
  { wiki: "Telephone" },
  { wiki: "Airplane" },
  { wiki: "Printing_press", answer: "Printing Press" },
  { wiki: "Steam_engine", answer: "Steam Engine" },
  { wiki: "Penicillin" },
  { wiki: "Internet" },
  { wiki: "Wheel" },
  { wiki: "Compass" },
  { wiki: "Telescope" },
];

export const dogBreeds: EntityEntry[] = [
  { wiki: "Golden_Retriever", answer: "Golden Retriever" },
  { wiki: "German_Shepherd", answer: "German Shepherd" },
  { wiki: "Bulldog" },
  { wiki: "Poodle" },
  { wiki: "Beagle" },
  { wiki: "Siberian_Husky", answer: "Siberian Husky" },
  { wiki: "Dachshund" },
  { wiki: "Chihuahua_(dog)", answer: "Chihuahua" },
  { wiki: "Dalmatian_(dog)", answer: "Dalmatian" },
  { wiki: "Labrador_Retriever", answer: "Labrador Retriever" },
];
