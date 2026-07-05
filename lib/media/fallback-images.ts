/**
 * Curated Wikimedia URLs — used when live Wikipedia fetch misses an image.
 * Keys match entity `wiki` titles (underscores).
 */
export const fallbackImages: Record<string, string> = {
  Leonardo_DiCaprio:
    "https://upload.wikimedia.org/wikipedia/commons/4/46/Leonardo_Dicaprio_Cannes_2019.jpg",
  Taylor_Swift:
    "https://upload.wikimedia.org/wikipedia/commons/b/b5/191125_Taylor_Swift_at_the_2019_American_Music_Awards_%28cropped%29.png",
  Beyonce:
    "https://upload.wikimedia.org/wikipedia/commons/1/17/Beyonc%C3%A9_at_The_Lion_King_European_Premiere_2019.png",
  Tom_Cruise:
    "https://upload.wikimedia.org/wikipedia/commons/4/46/Tom_Cruise_2023.jpg",
  Dwayne_Johnson:
    "https://upload.wikimedia.org/wikipedia/commons/9/9d/Dwayne_Johnson_2014_%28cropped%29.jpg",
  Rihanna:
    "https://upload.wikimedia.org/wikipedia/commons/c/c2/Rihanna_Fenty_2018.png",
  Cristiano_Ronaldo:
    "https://upload.wikimedia.org/wikipedia/commons/8/8c/Cristiano_Ronaldo_2018.jpg",
  Serena_Williams:
    "https://upload.wikimedia.org/wikipedia/commons/4/4b/Serena_Williams_at_2013_US_Open.jpg",
  Barack_Obama:
    "https://upload.wikimedia.org/wikipedia/commons/8/8d/President_Barack_Obama.jpg",
  Oprah_Winfrey:
    "https://upload.wikimedia.org/wikipedia/commons/3/3d/Oprah_Winfrey_2014.jpg",
  Elon_Musk:
    "https://upload.wikimedia.org/wikipedia/commons/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg",
  Zendaya:
    "https://upload.wikimedia.org/wikipedia/commons/2/28/Zendaya_-_2019_by_Glenn_Francis.jpg",
  Ryan_Reynolds:
    "https://upload.wikimedia.org/wikipedia/commons/1/14/Deadpool_2_Japan_Premiere_Red_Carpet_Ryan_Reynolds_%28cropped%29.jpg",
  Emma_Watson:
    "https://upload.wikimedia.org/wikipedia/commons/7/7f/Emma_Watson_2013.jpg",
  Keanu_Reeves:
    "https://upload.wikimedia.org/wikipedia/commons/9/90/Keanu_Reeves_%28crop_and_levels%29_%28cropped%29.jpg",
  Lady_Gaga:
    "https://upload.wikimedia.org/wikipedia/commons/0/0e/Lady_Gaga_at_Joanne_World_Tour_%28cropped%29.jpg",
  Michael_Jordan:
    "https://upload.wikimedia.org/wikipedia/commons/a/ae/Michael_Jordan_in_2014.jpg",
  Scarlett_Johansson:
    "https://upload.wikimedia.org/wikipedia/commons/2/2a/Scarlett_Johansson-8585.jpg",
  "Robert_Downey_Jr.":
    "https://upload.wikimedia.org/wikipedia/commons/2/23/Robert_Downey_Jr._2014_Comic-Con.jpg",
  Jennifer_Lawrence:
    "https://upload.wikimedia.org/wikipedia/commons/f/fe/Jennifer_Lawrence_in_2018.png",
};

export function getFallbackImage(wikiTitle: string): string | undefined {
  return fallbackImages[wikiTitle];
}
