/**
 * Reliable Wikimedia Commons URLs for every game entity.
 * Keys match entity `wiki` titles (underscores).
 * These load instantly and never depend on live Wikipedia API.
 */
export const entityImages: Record<string, string> = {
  // Phones
  IPhone: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/IPhone_5s_perspective.png/440px-IPhone_5s_perspective.png",
  Samsung_Galaxy_S24: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Samsung_Galaxy_S23_Ultra_%28cropped%29.png/440px-Samsung_Galaxy_S23_Ultra_%28cropped%29.png",
  Google_Pixel: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Google_Pixel_7_Pro_%28Obsidian%29.png/440px-Google_Pixel_7_Pro_%28Obsidian%29.png",
  BlackBerry: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/BlackBerry_Q10.jpg/440px-BlackBerry_Q10.jpg",
  Nokia_3310: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Nokia_3310_blue.jpg/440px-Nokia_3310_blue.jpg",
  Motorola_Razr: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Motorola_RAZR_V3i_blue.jpg/440px-Motorola_RAZR_V3i_blue.jpg",
  IPhone_4: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/IPhone_4.jpg/440px-IPhone_4.jpg",
  OnePlus: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/OnePlus_6T_Mirror_Black.png/440px-OnePlus_6T_Mirror_Black.png",

  // Food
  Pizza: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Eq_it-na_pizza-margherita_sep2005_sml.jpg/440px-Eq_it-na_pizza-margherita_sep2005_sml.jpg",
  Sushi: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Sushi_platter.jpg/440px-Sushi_platter.jpg",
  Croissant: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Croissant-Petr_Kratochvil.jpg/440px-Croissant-Petr_Kratochvil.jpg",
  Taco: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/001_Tacos_de_carnitas%2C_carne_asada_y_al_pastor.jpg/440px-001_Tacos_de_carnitas%2C_carne_asada_y_al_pastor.jpg",
  Paella: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/01_Paella_Valenciana_original.jpg/440px-01_Paella_Valenciana_original.jpg",
  Ramen: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Soy_ramen.jpg/440px-Soy_ramen.jpg",
  Pad_Thai: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Pad_Thai.jpg/440px-Pad_Thai.jpg",
  Hamburger: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Hamburger_%28black_bg%29.jpg/440px-Hamburger_%28black_bg%29.jpg",

  // Brands
  "Apple_Inc.": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/440px-Apple_logo_black.svg.png",
  "Nike,_Inc.": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/440px-Logo_NIKE.svg.png",
  Google: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/440px-Google_2015_logo.svg.png",
  "Amazon_(company)": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/440px-Amazon_logo.svg.png",
  "McDonald's": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/McDonald%27s_Golden_Arches.svg/440px-McDonald%27s_Golden_Arches.svg.png",
  "Coca-Cola": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Coca-Cola_logo.svg/440px-Coca-Cola_logo.svg.png",
  Samsung: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/440px-Samsung_Logo.svg.png",
  Microsoft: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/440px-Microsoft_logo.svg.png",
  "Tesla,_Inc.": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Tesla_Motors.svg/440px-Tesla_Motors.svg.png",
  Adidas: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/440px-Adidas_Logo.svg.png",

  // Animals
  Lion: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Lion_waiting_in_Namibia.jpg/440px-Lion_waiting_in_Namibia.jpg",
  African_elephant: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/African_Bush_Elephant.jpg/440px-African_Bush_Elephant.jpg",
  Giant_panda: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Grosser_Panda.JPG/440px-Grosser_Panda.JPG",
  Emperor_penguin: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Emperor_Penguin_Manchot_empereur.jpg/440px-Emperor_Penguin_Manchot_empereur.jpg",
  Bald_eagle: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Bald_Eagle_Portrait.jpg/440px-Bald_Eagle_Portrait.jpg",
  Blue_whale: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Blue_whale_%28stock%29.jpg/440px-Blue_whale_%28stock%29.jpg",
  Giraffe: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Giraffe_Mikumi_National_Park.jpg/440px-Giraffe_Mikumi_National_Park.jpg",
  Kangaroo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Kangaroo_and_joey03.jpg/440px-Kangaroo_and_joey03.jpg",
  Tiger: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Walking_tiger_female.jpg/440px-Walking_tiger_female.jpg",
  Dolphin: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Tursiops_truncatus_01.jpg/440px-Tursiops_truncatus_01.jpg",
  Red_panda: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Red_panda_%28Ailurus_fulgens%29_Rotorua.jpg/440px-Red_panda_%28Ailurus_fulgens%29_Rotorua.jpg",
  Polar_bear: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Polar_Bear_AdF.jpg/440px-Polar_Bear_AdF.jpg",

  // Landmarks
  Eiffel_Tower: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/440px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg",
  Statue_of_Liberty: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Statue_of_Liberty_7.jpg/440px-Statue_of_Liberty_7.jpg",
  Colosseum: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/440px-Colosseo_2020.jpg",
  Taj_Mahal: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Taj_Mahal%2C_Agra%2C_India_edit.jpg/440px-Taj_Mahal%2C_Agra%2C_India_edit.jpg",
  Great_Wall_of_China: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/The_Great_Wall_of_China_at_Jinshanling-edit.jpg/440px-The_Great_Wall_of_China_at_Jinshanling-edit.jpg",
  Machu_Picchu: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Machu_Picchu%2C_Peru.jpg/440px-Machu_Picchu%2C_Peru.jpg",
  "Christ_the_Redeemer_(statue)": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Christ_the_Redeemer_-_Cristo_Redentor.jpg/440px-Christ_the_Redeemer_-_Cristo_Redentor.jpg",
  Sydney_Opera_House: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Sydney_Opera_House_Sails.jpg/440px-Sydney_Opera_House_Sails.jpg",
  Big_Ben: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Clock_Tower_-_Palace_of_Westminster%2C_London_-_May_2007.jpg/440px-Clock_Tower_-_Palace_of_Westminster%2C_London_-_May_2007.jpg",
  Petra: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Al_Khazneh_Petra_edit_2.jpg/440px-Al_Khazneh_Petra_edit_2.jpg",

  // Cities (sample - capitals overlap)
  Paris: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg/440px-Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg",
  Tokyo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Skyscrapers_of_Shinjuku_2009_January.jpg/440px-Skyscrapers_of_Shinjuku_2009_January.jpg",
  New_York_City: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg/440px-View_of_Empire_State_Building_from_Rockefeller_Center_New_York_City_dllu_%28cropped%29.jpg",
  London: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/London_Skyline_%28125508697%29.jpeg/440px-London_Skyline_%28125508697%29.jpeg",
  Rome: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/440px-Colosseo_2020.jpg",
  Sydney: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Sydney_Opera_House_Sails.jpg/440px-Sydney_Opera_House_Sails.jpg",
  Dubai: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Burj_Khalifa.jpg/440px-Burj_Khalifa.jpg",
  Barcelona: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Sagrada_Familia_01.jpg/440px-Sagrada_Familia_01.jpg",

  // Cars
  Porsche_911: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Porsche_911_GT3_RS_%28991.2%29_front.jpg/440px-Porsche_911_GT3_RS_%28991.2%29_front.jpg",
  Tesla_Model_S: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Tesla_Model_S_%28Facelift%29_front.jpg/440px-Tesla_Model_S_%28Facelift%29_front.jpg",
  Ford_Mustang: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Ford_Mustang_GT_2018.jpg/440px-Ford_Mustang_GT_2018.jpg",
  Ferrari_F40: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Ferrari_F40.jpg/440px-Ferrari_F40.jpg",
  Lamborghini_Aventador: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Lamborghini_Aventador_SuperVeloce.jpg/440px-Lamborghini_Aventador_SuperVeloce.jpg",
  Volkswagen_Beetle: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Volkswagen_Beetle_%28A5%29_front.jpg/440px-Volkswagen_Beetle_%28A5%29_front.jpg",
  Toyota_Corolla: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/2019_Toyota_Corolla_Hybrid_Design_TBi_1.8_Front.jpg/440px-2019_Toyota_Corolla_Hybrid_Design_TBi_1.8_Front.jpg",
  BMW_M3: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/BMW_M3_Competition_%28G80%29_IMG_4334.jpg/440px-BMW_M3_Competition_%28G80%29_IMG_4334.jpg",

  // Planets
  Mars: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/440px-OSIRIS_Mars_true_color.jpg",
  Jupiter: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/440px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg",
  "Saturn_(planet)": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/440px-Saturn_during_Equinox.jpg",
  Venus: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Venus-real_color.jpg/440px-Venus-real_color.jpg",
  "Mercury_(planet)": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Mercury_in_true_color.jpg/440px-Mercury_in_true_color.jpg",
  Neptune: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg/440px-Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg",
  Uranus: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Uranus2.jpg/440px-Uranus2.jpg",
  Earth: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/440px-The_Earth_seen_from_Apollo_17.jpg",

  // Video games
  Minecraft: "https://upload.wikimedia.org/wikipedia/en/thumb/5/51/Minecraft_cover.png/440px-Minecraft_cover.png",
  "Super_Mario_Bros.": "https://upload.wikimedia.org/wikipedia/en/thumb/0/03/Super_Mario_Bros._box.png/440px-Super_Mario_Bros._box.png",
  The_Legend_of_Zelda: "https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Legend_of_Zelda_NES_Box_Art.jpg/440px-Legend_of_Zelda_NES_Box_Art.jpg",
  Grand_Theft_Auto_V: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a5/Grand_Theft_Auto_V.png/440px-Grand_Theft_Auto_V.png",
  Fortnite: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7c/Fortnite_F_lettermark_logo.png/440px-Fortnite_F_lettermark_logo.png",
  "Pac-Man": "https://upload.wikimedia.org/wikipedia/en/thumb/5/59/Pac-man.png/440px-Pac-man.png",
  Tetris: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Tetris_%28Game_Boy%29_cover.jpg/440px-Tetris_%28Game_Boy%29_cover.jpg",
  Pokemon: "https://upload.wikimedia.org/wikipedia/en/thumb/3/39/Pokemon_logo.png/440px-Pokemon_logo.png",

  // TV
  Breaking_Bad: "https://upload.wikimedia.org/wikipedia/en/thumb/6/61/Breaking_Bad_title_card.png/440px-Breaking_Bad_title_card.png",
  Friends: "https://upload.wikimedia.org/wikipedia/en/thumb/b/bc/Friends_season_one_cast.jpg/440px-Friends_season_one_cast.jpg",
  Game_of_Thrones: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d8/Game_of_Thrones_title_card.jpg/440px-Game_of_Thrones_title_card.jpg",
  "The_Office_(American_TV_series)": "https://upload.wikimedia.org/wikipedia/en/thumb/0/0e/The_Office_%28U.S._TV_series%29.svg/440px-The_Office_%28U.S._TV_series%29.svg.png",
  Stranger_Things: "https://upload.wikimedia.org/wikipedia/en/thumb/7/73/Stranger_Things_4_logo.png/440px-Stranger_Things_4_logo.png",
  The_Simpsons: "https://upload.wikimedia.org/wikipedia/en/thumb/0/0f/The_Simpsons_yellow_logo.svg/440px-The_Simpsons_yellow_logo.svg.png",
  Squid_Game: "https://upload.wikimedia.org/wikipedia/en/thumb/d/df/Squid_Game_%28Korean%29.svg/440px-Squid_Game_%28Korean%29.svg.png",
  "The_Crown_(TV_series)": "https://upload.wikimedia.org/wikipedia/en/thumb/5/5c/The_Crown_title_card.jpg/440px-The_Crown_title_card.jpg",

  // Music
  The_Beatles: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/The_Beatles_members_at_New_York_City_in_1964.jpg/440px-The_Beatles_members_at_New_York_City_in_1964.jpg",
  Michael_Jackson: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Michael_Jackson_in_1988.jpg/440px-Michael_Jackson_in_1988.jpg",
  Madonna: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Madonna_Rebel_Heart_Tour_2015_-_Berlin_%28cropped%29.jpg/440px-Madonna_Rebel_Heart_Tour_2015_-_Berlin_%28cropped%29.jpg",
  Elvis_Presley: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Elvis_Presley_promoting_Jailhouse_Rock.jpg/440px-Elvis_Presley_promoting_Jailhouse_Rock.jpg",
  "Drake_(musician)": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Drake_July_2016.jpg/440px-Drake_July_2016.jpg",
  Adele: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Adele_-_Live_2016%2C_Glasgow_SSE_Hydro_03.jpg/440px-Adele_-_Live_2016%2C_Glasgow_SSE_Hydro_03.jpg",
  "Queen_(band)": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Queen_and_Adam_Lambert_-_The_O2_-_Tuesday_12th_December_2017_QueenAdamO2121217_%2830_of_41%29_%2838882374664%29_%28cropped%29.jpg/440px-Queen_and_Adam_Lambert_-_The_O2_-_Tuesday_12th_December_2017_QueenAdamO2121217_%2830_of_41%29_%2838882374664%29_%28cropped%29.jpg",
  Bob_Marley: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Bob-Marley-in-Concert_Zurich_80-05-30.jpg/440px-Bob-Marley-in-Concert_Zurich_80-05-30.jpg",

  // Scientists
  Albert_Einstein: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Albert_Einstein_Head.jpg/440px-Albert_Einstein_Head.jpg",
  Marie_Curie: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Marie_Curie_c._1920s.jpg/440px-Marie_Curie_c._1920s.jpg",
  Isaac_Newton: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/GodfreyKneller-IsaacNewton-1689.jpg/440px-GodfreyKneller-IsaacNewton-1689.jpg",
  Charles_Darwin: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Charles_Darwin_seated_crop.jpg/440px-Charles_Darwin_seated_crop.jpg",
  Stephen_Hawking: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Stephen_Hawking.StarChild.jpg/440px-Stephen_Hawking.StarChild.jpg",
  Nikola_Tesla: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/N.Tesla.JPG/440px-N.Tesla.JPG",

  // Athletes
  Lionel_Messi: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg/440px-Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg",
  LeBron_James: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/LeBron_James_%2851589877144%29_%28cropped2%29.jpg/440px-LeBron_James_%2851589877144%29_%28cropped2%29.jpg",
  Usain_Bolt: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Usain_Bolt_after_200_m_final_Olympic_Games_2012.jpg/440px-Usain_Bolt_after_200_m_final_Olympic_Games_2012.jpg",
  Simone_Biles: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Simone_Biles%2C_2016_Summer_Olympics_3_%28cropped%29.jpg/440px-Simone_Biles%2C_2016_Summer_Olympics_3_%28cropped%29.jpg",
  Roger_Federer: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Roger_Federer_%282015%29.jpg/440px-Roger_Federer_%282015%29.jpg",
  Naomi_Osaka: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Naomi_Osaka_%282021%29.jpg/440px-Naomi_Osaka_%282021%29.jpg",
  Tom_Brady: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Tom_Brady_2017.jpg/440px-Tom_Brady_2017.jpg",

  // Flowers
  Rose: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Rosa_Precious_Platinum_01.jpg/440px-Rosa_Precious_Platinum_01.jpg",
  Sunflower: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Sunflower_sky_backdrop.jpg/440px-Sunflower_sky_backdrop.jpg",
  Tulip: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Tulip_%27Orange_Brilliant%27_%28cropped%29.jpg/440px-Tulip_%27Orange_Brilliant%27_%28cropped%29.jpg",
  Orchid: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Phalaenopsis_amabilis_%28white_orchid%29.jpg/440px-Phalaenopsis_amabilis_%28white_orchid%29.jpg",
  Lotus_flower: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Nelumbo_nucifera_%28Indian_Lotus%29.jpg/440px-Nelumbo_nucifera_%28Indian_Lotus%29.jpg",
  Cherry_blossom: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Cherry_blossoms_at_the_Imperial_Palace_in_Tokyo.jpg/440px-Cherry_blossoms_at_the_Imperial_Palace_in_Tokyo.jpg",
  Lavender: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Single_lavender_flower02.jpg/440px-Single_lavender_flower02.jpg",
  Daffodil: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Narcissus_poeticus_subsp._radiatus_%28Flora%29.jpg/440px-Narcissus_poeticus_subsp._radiatus_%28Flora%29.jpg",

  // Paintings
  Mona_Lisa: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/440px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
  The_Starry_Night: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/440px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
  The_Scream: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/The_Scream.jpg/440px-The_Scream.jpg",
  Girl_with_a_Pearl_Earring: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/440px-1665_Girl_with_a_Pearl_Earring.jpg",
  The_Persistence_of_Memory: "https://upload.wikimedia.org/wikipedia/en/thumb/d/dd/The_Persistence_of_Memory.jpg/440px-The_Persistence_of_Memory.jpg",
  American_Gothic: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg/440px-Grant_Wood_-_American_Gothic_-_Google_Art_Project.jpg",

  // Dinosaurs
  Tyrannosaurus: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Tyrannosaurus_rex_skeleton_%28Black%29.jpg/440px-Tyrannosaurus_rex_skeleton_%28Black%29.jpg",
  Triceratops: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Triceratops_skeleton_at_Senckenberg_Museum.jpg/440px-Triceratops_skeleton_at_Senckenberg_Museum.jpg",
  Velociraptor: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Velociraptor_drawing.jpg/440px-Velociraptor_drawing.jpg",
  Stegosaurus: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Stegosaurus_stenops_Skelet.jpg/440px-Stegosaurus_stenops_Skelet.jpg",
  Brachiosaurus: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Brachiosaurus_DB.jpg/440px-Brachiosaurus_DB.jpg",
  Spinosaurus: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Spinosaurus_skull_%28MNHN%29.jpg/440px-Spinosaurus_skull_%28MNHN%29.jpg",

  // Birds
  Penguin: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Emperor_Penguin_Manchot_empereur.jpg/440px-Emperor_Penguin_Manchot_empereur.jpg",
  Peafowl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Peacock_Plumage.jpg/440px-Peacock_Plumage.jpg",
  Flamingo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Flamingos_in_Laguna_Colorada.jpg/440px-Flamingos_in_Laguna_Colorada.jpg",
  Owl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Barn_Owl_%28Tyto_alba%29.jpg/440px-Barn_Owl_%28Tyto_alba%29.jpg",
  Parrot: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Psittacus_erithacus_-Singapore_Zoo-8a.jpg/440px-Psittacus_erithacus_-Singapore_Zoo-8a.jpg",
  Hummingbird: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Ruby-throated_hummingbird_%28Archilochus_colubris%29_male.jpg/440px-Ruby-throated_hummingbird_%28Archilochus_colubris%29_male.jpg",
  Ostrich: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Common_Ostrich_%28Struthio_camelus%29.jpg/440px-Common_Ostrich_%28Struthio_camelus%29.jpg",
  Swan: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Mute_swan_%28Cygnus_olor%29_1.jpg/440px-Mute_swan_%28Cygnus_olor%29_1.jpg",
  Toucan: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Keel-billed_toucan_%28Ramphastos_sulfuratus%29.jpg/440px-Keel-billed_toucan_%28Ramphastos_sulfuratus%29.jpg",

  // Instruments
  Piano: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Steinway_Vienna_002.JPG/440px-Steinway_Vienna_002.JPG",
  Guitar: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/GuitareClassique5.jpg/440px-GuitareClassique5.jpg",
  Violin: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Violin_VL100.png/440px-Violin_VL100.png",
  Drum: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Drum_set.jpg/440px-Drum_set.jpg",
  Trumpet: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Trumpet_1.jpg/440px-Trumpet_1.jpg",
  Saxophone: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Alto_saxophone.jpg/440px-Alto_saxophone.jpg",
  Flute: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Western_concert_flute_with_case.jpg/440px-Western_concert_flute_with_case.jpg",
  Harp: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Harp.jpg/440px-Harp.jpg",
  Cello: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Cello_study.jpg/440px-Cello_study.jpg",
  Accordion: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Accordion1.jpg/440px-Accordion1.jpg",

  // Inventions
  Light_bulb: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Edison_bulb.jpg/440px-Edison_bulb.jpg",
  Telephone: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Alexander_Graham_Bell%27s_big_box_telephone%2C_1876%2C_one_of_the_first_commercially_available_telephones.jpg/440px-Alexander_Graham_Bell%27s_big_box_telephone%2C_1876%2C_one_of_the_first_commercially_available_telephones.jpg",
  Airplane: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Wright_Flyer_%28cropped%29.jpg/440px-Wright_Flyer_%28cropped%29.jpg",
  Printing_press: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Gutenberg_Press.jpg/440px-Gutenberg_Press.jpg",
  Steam_engine: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Steam_engine_in_action.gif/440px-Steam_engine_in_action.gif",
  Penicillin: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Penicillin_core_structure.svg/440px-Penicillin_core_structure.svg.png",
  Internet: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Internet_map_1024_-_transparent%2C_inverted.png/440px-Internet_map_1024_-_transparent%2C_inverted.png",
  Wheel: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Wheel_in_Mesopotamian_replica.jpg/440px-Wheel_in_Mesopotamian_replica.jpg",
  Compass: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Compass.jpg/440px-Compass.jpg",
  Telescope: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Hubble_Space_Telescope_%28HST%29.jpg/440px-Hubble_Space_Telescope_%28HST%29.jpg",

  // Mountains
  Mount_Everest: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg/440px-Everest_North_Face_toward_Base_Camp_Tibet_Luca_Galuzzi_2006.jpg",
  K2: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/K2_2006b.jpg/440px-K2_2006b.jpg",
  Matterhorn: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Matterhorn_from_Dufourspitze_%282015%29.jpg/440px-Matterhorn_from_Dufourspitze_%282015%29.jpg",
  Mount_Fuji: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/080103_hakone_fuji.jpg/440px-080103_hakone_fuji.jpg",
  Mount_Kilimanjaro: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Mount_Kilimanjaro_from_Amboseli.jpg/440px-Mount_Kilimanjaro_from_Amboseli.jpg",

  // Islands
  Hawaii: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Hanauma_Bay_Oahu_Hawaii.jpg/440px-Hanauma_Bay_Oahu_Hawaii.jpg",
  Iceland: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Kirkjufell_%28cropped%29.jpg/440px-Kirkjufell_%28cropped%29.jpg",
  Madagascar: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Baobab_Madagascar.jpg/440px-Baobab_Madagascar.jpg",
  Bali: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Pura_Ulun_Danu_Bratan%2C_Bali.jpg/440px-Pura_Ulun_Danu_Bratan%2C_Bali.jpg",
  Maldives: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Maldives_Islands.jpg/440px-Maldives_Islands.jpg",

  // Dog breeds
  Golden_Retriever: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Golden_Retriever_Dukedestiny01_dogs.jpeg/440px-Golden_Retriever_Dukedestiny01_dogs.jpeg",
  German_Shepherd: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/German_Shepherd_-_DSC_0346_%2810071343523%29.jpg/440px-German_Shepherd_-_DSC_0346_%2810071343523%29.jpg",
  Bulldog: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Bulldog_inglese.jpg/440px-Bulldog_inglese.jpg",
  Poodle: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/The_poodle.jpg/440px-The_poodle.jpg",
  Beagle: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Beagle_600.jpg/440px-Beagle_600.jpg",
  Siberian_Husky: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Siberian_Husky_blue_eyes.jpg/440px-Siberian_Husky_blue_eyes.jpg",
  Labrador_Retriever: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/YellowLabradorLooking_new.jpg/440px-YellowLabradorLooking_new.jpg",

  // Writers
  William_Shakespeare: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Shakespeare.jpg/440px-Shakespeare.jpg",
  Jane_Austen: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/CassandraAusten-JaneAusten%28c.1810%29_hires.jpg/440px-CassandraAusten-JaneAusten%28c.1810%29_hires.jpg",
  Mark_Twain: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Mark_Twain_by_AF_Bradley.jpg/440px-Mark_Twain_by_AF_Bradley.jpg",
  Charles_Dickens: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/aa/Dickens_Gurney_head.jpg/440px-Dickens_Gurney_head.jpg",
  "J._K._Rowling": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/J._K._Rowling_2010.jpg/440px-J._K._Rowling_2010.jpg",
  Ernest_Hemingway: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/ErnestHemingway.jpg/440px-ErnestHemingway.jpg",
  Agatha_Christie: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Agatha_Christie.png/440px-Agatha_Christie.png",
  Leo_Tolstoy: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/L.N.Tolstoy_Prokudin-Gorsky.jpg/440px-L.N.Tolstoy_Prokudin-Gorsky.jpg",
  Franz_Kafka: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Kafka1906.jpg/440px-Kafka1906.jpg",
  Maya_Angelou: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Angelou_at_Clinton_inauguration_%28cropped_2%29.jpg/440px-Angelou_at_Clinton_inauguration_%28cropped_2%29.jpg",

  // Explorers
  Christopher_Columbus: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Christopher_Columbus.PNG/440px-Christopher_Columbus.PNG",
  Marco_Polo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Marco_Polo_-_costume_tartare.jpg/440px-Marco_Polo_-_costume_tartare.jpg",
  Ferdinand_Magellan: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Ferdinand_Magellan_1848.jpg/440px-Ferdinand_Magellan_1848.jpg",
  Neil_Armstrong: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Neil_Armstrong_pose.jpg/440px-Neil_Armstrong_pose.jpg",
  Amelia_Earhart: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Amelia_Earhart_standing_under_nose_of_her_Lockheed_Model_10-E_Electra%2C_small.jpg/440px-Amelia_Earhart_standing_under_nose_of_her_Lockheed_Model_10-E_Electra%2C_small.jpg",
  Roald_Amundsen: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Roald_Amundsen_1910.jpg/440px-Roald_Amundsen_1910.jpg",
  Jacques_Cousteau: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Jacques-Yves_Cousteau%2C_by_Photographer_%28cropped%29.jpg/440px-Jacques-Yves_Cousteau%2C_by_Photographer_%28cropped%29.jpg",
  Sacagawea: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Sacagawea_statue.jpg/440px-Sacagawea_statue.jpg",
  Vasco_da_Gama: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Vasco_da_Gama_-_1838.png/440px-Vasco_da_Gama_-_1838.png",
  Ibn_Battuta: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Ibn_Battuta_%28cropped%29.jpg/440px-Ibn_Battuta_%28cropped%29.jpg",

  // Extra mountains & islands
  Mont_Blanc: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Mont_Blanc_from_Aiguille_du_Midi%2C_2016.jpg/440px-Mont_Blanc_from_Aiguille_du_Midi%2C_2016.jpg",
  Denali: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Denali_Mt_McKinley.jpg/440px-Denali_Mt_McKinley.jpg",
  Mount_Rainier: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Mount_Rainier_from_west.jpg/440px-Mount_Rainier_from_west.jpg",
  Aconcagua: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Aconcagua_%28from_south%29%2C_February_2007.jpg/440px-Aconcagua_%28from_south%29%2C_February_2007.jpg",
  Mount_Elbrus: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Elbrus_south.jpg/440px-Elbrus_south.jpg",
  Sicily: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Taormina_and_Etna.jpg/440px-Taormina_and_Etna.jpg",
  Galapagos_Islands: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Galapagos_land_iguana_%28Conolophus_subcristatus%29.jpg/440px-Galapagos_land_iguana_%28Conolophus_subcristatus%29.jpg",
  Greenland: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Ilulissat-icefjord.jpg/440px-Ilulissat-icefjord.jpg",
  Sri_Lanka: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Sigiriya_%28Lion_Rock%29_from_Air.jpg/440px-Sigiriya_%28Lion_Rock%29_from_Air.jpg",
  Fiji: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Cloudbreak%2C_Fiji.jpg/440px-Cloudbreak%2C_Fiji.jpg",

  // Extra dog breeds
  Dachshund: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Dachshund_600.jpg/440px-Dachshund_600.jpg",
  "Chihuahua_(dog)": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Chihuahua1_bv.jpg/440px-Chihuahua1_bv.jpg",
  "Dalmatian_(dog)": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Dalmatian_puppy.jpg/440px-Dalmatian_puppy.jpg",

  // Capitals
  Berlin: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Brandenburger_Tor_abends.jpg/440px-Brandenburger_Tor_abends.jpg",
  Moscow: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Saint_Basil%27s_Cathedral%2C_Red_Square%2C_Moscow.jpg/440px-Saint_Basil%27s_Cathedral%2C_Red_Square%2C_Moscow.jpg",
  Beijing: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/The_Great_Wall_of_China_at_Jinshanling-edit.jpg/440px-The_Great_Wall_of_China_at_Jinshanling-edit.jpg",
  "Washington,_D.C.": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/US_Capitol_west_side.JPG/440px-US_Capitol_west_side.JPG",
  New_Delhi: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/India_Gate%2C_New_Delhi%2C_India.jpg/440px-India_Gate%2C_New_Delhi%2C_India.jpg",
  Canberra: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Parliament_House_Canberra.jpg/440px-Parliament_House_Canberra.jpg",
  Brasilia: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Catedral_de_Brasilia%2C_Brasilia%2C_Brazil.jpg/440px-Catedral_de_Brasilia%2C_Brasilia%2C_Brazil.jpg",
  Cairo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Kheops-Pyramid.jpg/440px-Kheops-Pyramid.jpg",
  Ottawa: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Parliament_Hill%2C_Ottawa%2C_Canada.jpg/440px-Parliament_Hill%2C_Ottawa%2C_Canada.jpg",
  Madrid: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Puerta_de_Alcala_%28Madrid%29_01.jpg/440px-Puerta_de_Alcala_%28Madrid%29_01.jpg",
  Seoul: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Seoul_N_Tower_at_night.jpg/440px-Seoul_N_Tower_at_night.jpg",
  Bangkok: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Wat_Arun_Ratchawararam_Ratchawaramahawihan_%28cropped%29.jpg/440px-Wat_Arun_Ratchawararam_Ratchawaramahawihan_%28cropped%29.jpg",

  // Films
  "Star_Wars_(film)": "https://upload.wikimedia.org/wikipedia/en/thumb/8/87/StarWarsMoviePoster1977.jpg/440px-StarWarsMoviePoster1977.jpg",
  The_Godfather: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/Godfather_ver1.jpg/440px-Godfather_ver1.jpg",
  "Titanic_(1997_film)": "https://upload.wikimedia.org/wikipedia/en/thumb/2/22/Titanic_poster.jpg/440px-Titanic_poster.jpg",
  The_Dark_Knight: "https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/Dark_Knight.jpg/440px-Dark_Knight.jpg",
  "Jurassic_Park_(film)": "https://upload.wikimedia.org/wikipedia/en/thumb/e/e7/Jurassic_Park_poster.jpg/440px-Jurassic_Park_poster.jpg",
  Forrest_Gump: "https://upload.wikimedia.org/wikipedia/en/thumb/6/67/Forrest_Gump_poster.jpg/440px-Forrest_Gump_poster.jpg",
  The_Lion_King: "https://upload.wikimedia.org/wikipedia/en/thumb/3/3d/The_Lion_King_poster.jpg/440px-The_Lion_King_poster.jpg",
  "Avatar_(2009_film)": "https://upload.wikimedia.org/wikipedia/en/thumb/d/d6/Avatar_%282009_film%29_poster.jpg/440px-Avatar_%282009_film%29_poster.jpg",
  Inception: "https://upload.wikimedia.org/wikipedia/en/thumb/7/7f/Inception_ver3.jpg/440px-Inception_ver3.jpg",
  The_Matrix: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c1/The_Matrix_Poster.jpg/440px-The_Matrix_Poster.jpg",
};
