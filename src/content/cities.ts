export type City = {
  slug: string; stateSlug: string; name: string; tagline: string;
  bestSeason: string; daysNeeded: string; dailyBudget: string; nearestAirport: string;
  intro: string;
};

const c = (stateSlug: string, slug: string, name: string, tagline: string, intro: string,
  bestSeason = 'Nov – Feb', daysNeeded = '2 – 3', dailyBudget = '₹2,800', nearestAirport = 'Regional airport'): City =>
  ({ slug, stateSlug, name, tagline, intro, bestSeason, daysNeeded, dailyBudget, nearestAirport });

export const CITIES: City[] = [
  // Gujarat
  c('gujarat','ahmedabad','Ahmedabad','India\u2019s first UNESCO World Heritage City','Six hundred years of stepwells, pols and mill-owner mansions, plus the best vegetarian street food in the country.','Nov – Feb','2 – 3','₹2,800','AMD, 9 km'),
  c('gujarat','bhuj','Bhuj','Gateway to the Rann and the craft villages','The base for the white desert, the Banni grasslands and a dozen villages where Ajrakh, Rogan and bandhani are still made by hand.','Nov – Feb','3 – 4','₹2,600','BHJ, 5 km'),
  c('gujarat','vadodara','Vadodara','Palaces, art school, Navratri capital','The Gaekwad capital, with a palace four times the size of Buckingham and the country\u2019s most serious fine art faculty.','Nov – Feb','2','₹2,400','BDQ, 6 km'),
  c('gujarat','surat','Surat','Diamonds, textiles and the best locho','Ninety per cent of the world\u2019s diamonds are cut here, and the street food is the reason people from Ahmedabad drive down.','Nov – Feb','2','₹2,500','STV, 11 km'),
  c('gujarat','dwarka','Dwarka','Krishna\u2019s city, and the ferry to Bet Dwarka','One of the four Char Dham sites, on the westernmost point of the mainland, with a temple that has stood in some form for two millennia.','Oct – Mar','2','₹2,000','JGA, 137 km'),
  c('gujarat','somnath','Somnath','Temple on the sea, rebuilt six times','Destroyed and rebuilt through a thousand years of history, now facing the Arabian Sea with an evening aarti worth timing your day around.','Oct – Mar','1 – 2','₹2,000','DIU, 90 km'),
  c('gujarat','junagadh','Junagadh','Gir\u2019s base, plus the Girnar climb','Ten thousand steps up Girnar at dawn, and the only place on earth with wild Asiatic lions an hour down the road.','Dec – Mar','2 – 3','₹2,200','RAJ, 100 km'),
  c('gujarat','rajkot','Rajkot','Saurashtra\u2019s centre, and Gandhi\u2019s school','A working city rather than a sight, but the food is the best in Saurashtra and Gandhi\u2019s childhood home is here.','Nov – Feb','1 – 2','₹2,200','RAJ, 4 km'),
  // Rajasthan
  c('rajasthan','jaipur','Jaipur','Pink city, Amber Fort, block printing','A planned city from 1727 with a fort above it, the best shopping in north India and an observatory that still tells the time.','Oct – Mar','3','₹3,200','JAI, 13 km'),
  c('rajasthan','udaipur','Udaipur','Lakes, palaces, and the best sunsets','Built around a chain of artificial lakes, with a palace complex on the shore and another in the middle of the water.','Sep – Mar','2 – 3','₹3,400','UDR, 22 km'),
  c('rajasthan','jodhpur','Jodhpur','Blue city under Mehrangarh','The fort is the finest in India and the old city beneath it is painted blue for reasons nobody fully agrees on.','Oct – Mar','2','₹2,800','JDH, 5 km'),
  c('rajasthan','jaisalmer','Jaisalmer','A living fort in the Thar','One of the few forts in the world people still live inside, with the desert starting where the walls end.','Nov – Feb','2 – 3','₹2,600','JSA, 17 km'),
  c('rajasthan','pushkar','Pushkar','Lake, temple, and the November mela','A small pilgrimage town around a holy lake that swells to two hundred thousand people for the camel fair.','Oct – Mar','2','₹2,200','JAI, 145 km'),
  c('rajasthan','bundi','Bundi','Stepwells and a fort nobody visits','Kipling wrote here. The stepwells are extraordinary and you will usually have them to yourself.','Oct – Mar','2','₹1,900','JAI, 210 km'),
  // Maharashtra
  c('maharashtra','mumbai','Mumbai','Art deco, Kala Ghoda, the last local train','The financial capital, with the world\u2019s second-largest collection of art deco buildings and a street food culture to match.','Nov – Feb','3 – 4','₹4,200','BOM, 8 km'),
  c('maharashtra','aurangabad','Aurangabad','Base for Ajanta and Ellora','Two UNESCO cave complexes within a two-hour drive, carved between the second century BC and the tenth AD.','Oct – Mar','3','₹2,400','IXU, 10 km'),
  c('maharashtra','pune','Pune','Deccan college town with good food','A university city with Maratha history, a strong cafe scene and the Sahyadri forts an hour away.','Oct – Feb','2','₹2,800','PNQ, 10 km'),
  c('maharashtra','nashik','Nashik','Vineyards and the Godavari ghats','India\u2019s wine capital, with Sula and a dozen others, plus one of the four Kumbh Mela sites.','Oct – Feb','2','₹2,600','ISK, 20 km'),
  // Goa
  c('goa','panaji','Panaji','Fontainhas and the Mandovi','The Latin Quarter is the reason to stay in the capital rather than the beach.','Nov – Feb','2','₹3,000','GOI, 30 km'),
  c('goa','south-goa','South Goa','Quieter sand, Portuguese churches','Palolem, Agonda and Patnem, with Old Goa\u2019s cathedrals inland.','Nov – Feb','4','₹3,400','GOI, 40 km'),
  // Kerala
  c('kerala','kochi','Kochi','Fort Kochi, Chinese nets, Jew Town','Five hundred years of Portuguese, Dutch and British trade layered into a few walkable streets.','Sep – Mar','2 – 3','₹3,000','COK, 28 km'),
  c('kerala','alappuzha','Alappuzha','Backwaters and the public ferry','The houseboat capital, though the ₹40 state ferry covers the same water.','Sep – Mar','2','₹2,800','COK, 75 km'),
  c('kerala','munnar','Munnar','Tea at fifteen hundred metres','Rolling estates, Eravikulam\u2019s tahr and mornings above the cloud line.','Sep – Mar','2 – 3','₹2,600','COK, 110 km'),
  c('kerala','thekkady','Thekkady','Periyar, spices, bamboo rafting','A tiger reserve you explore by boat, with cardamom and pepper plantations around it.','Sep – Mar','2','₹2,600','COK, 150 km'),
  c('kerala','varkala','Varkala','Cliff, beach, and the long stay','A red laterite cliff above a beach, and the calmest long-stay town on the coast.','Oct – Mar','3','₹2,400','TRV, 50 km'),
  // Tamil Nadu
  c('tamil-nadu','madurai','Madurai','Meenakshi temple, and the city around it','A temple city that has been continuously inhabited for two and a half thousand years.','Nov – Feb','2','₹2,200','IXM, 12 km'),
  c('tamil-nadu','chennai','Chennai','Marina, Mylapore, filter coffee','The Carnatic music capital, with Mylapore\u2019s temple streets and a thirteen-kilometre beach.','Nov – Feb','2 – 3','₹3,000','MAA, 21 km'),
  c('tamil-nadu','mahabalipuram','Mahabalipuram','Shore temple and rock-cut caves','Seventh-century Pallava carvings on a beach an hour south of Chennai.','Nov – Feb','1 – 2','₹2,400','MAA, 55 km'),
  c('tamil-nadu','thanjavur','Thanjavur','Brihadeeswarar, and the Chola bronzes','A thousand-year-old granite temple that still has no equal in south India.','Nov – Feb','2','₹2,000','TRZ, 55 km'),
  c('tamil-nadu','ooty','Ooty','Nilgiris, and the mountain railway','Two thousand metres up, reached by a rack railway that has run since 1908.','Oct – Jun','2 – 3','₹2,600','CJB, 88 km'),
  // Karnataka
  c('karnataka','bengaluru','Bengaluru','Parks, breweries and the best breakfast','The tech capital, with Lalbagh, Cubbon Park and the best idli-dosa culture in the country.','Oct – Feb','2','₹3,400','BLR, 35 km'),
  c('karnataka','hampi','Hampi','Boulders, ruins, and the Tungabhadra','The capital of Vijayanagara, the richest city in the world in 1500, now fourteen square miles of ruins.','Oct – Feb','3','₹2,000','HBX, 143 km'),
  c('karnataka','mysuru','Mysuru','Palace, market, and Dasara','The Wodeyar palace is lit by ninety-seven thousand bulbs on Sunday nights and the Devaraja market is the best in the south.','Oct – Feb','2','₹2,400','MYQ, 10 km'),
  c('karnataka','coorg','Coorg','Coffee hills and Kodagu culture','Estates, waterfalls and a distinct hill culture in the Western Ghats.','Oct – Mar','3','₹3,000','MYQ, 120 km'),
  c('karnataka','gokarna','Gokarna','Temple town with quiet beaches','A pilgrimage town whose beaches stayed quiet while Goa did not.','Nov – Feb','3','₹2,200','IXG, 60 km'),
  // Telangana / AP
  c('telangana','hyderabad','Hyderabad','Charminar, Golconda, biryani','Four hundred years of Qutb Shahi and Nizami history, and the biryani people fly in for.','Oct – Feb','3','₹2,800','HYD, 32 km'),
  c('telangana','warangal','Warangal','Kakatiya forts and the Ramappa temple','A UNESCO temple since 2021, with floating bricks and a thousand-pillar hall nearby.','Oct – Feb','1 – 2','₹2,000','HYD, 145 km'),
  c('andhra-pradesh','visakhapatnam','Visakhapatnam','Beaches and the Araku railway','A port city with quiet beaches and the best mountain rail journey in the south.','Oct – Mar','3','₹2,600','VTZ, 12 km'),
  c('andhra-pradesh','tirupati','Tirupati','The busiest pilgrimage on earth','Tens of thousands of pilgrims a day at Tirumala, with darshan slots booked months ahead.','Sep – Feb','1 – 2','₹2,000','TIR, 15 km'),
  c('puducherry','puducherry','Puducherry','French quarter, Auroville, the promenade','A colonial grid by the sea, best walked slowly over two days.','Nov – Feb','2','₹3,000','PNY, 6 km'),
  // North
  c('delhi','new-delhi','Delhi','Eight cities on the same ground','Mughal forts, Lutyens\u2019 avenues and Mehrauli\u2019s tombs, connected by a metro that actually works.','Oct – Mar','3 – 4','₹3,200','DEL, 16 km'),
  c('himachal-pradesh','shimla','Shimla','The summer capital, and the toy train','Colonial architecture along a ridge, reached by a narrow-gauge railway that is a UNESCO site.','Mar – Jun, Sep – Nov','2','₹2,600','SLV, 22 km'),
  c('himachal-pradesh','manali','Manali','Beas valley, and the road to Spiti','The base for Solang, Rohtang and the high road north.','Mar – Jun, Sep – Nov','3','₹2,800','KUU, 50 km'),
  c('himachal-pradesh','dharamshala','Dharamshala','McLeod Ganj and the Tibetan exile','Home of the Dalai Lama, with Triund above and the Dhauladhar behind.','Mar – Jun, Sep – Nov','3','₹2,400','DHM, 15 km'),
  c('himachal-pradesh','spiti','Spiti','High desert above four thousand metres','Key Monastery, Chandratal and villages that are cut off half the year.','Jun – Sep','5 – 7','₹3,000','KUU, 245 km'),
  c('uttarakhand','rishikesh','Rishikesh','Where the Ganga leaves the mountains','Yoga, rafting and the evening aarti at Triveni Ghat.','Mar – Jun, Sep – Nov','3','₹2,400','DED, 20 km'),
  c('uttarakhand','nainital','Nainital','Lake town in the Kumaon','A colonial hill station around a lake, with Naina Peak above it.','Mar – Jun, Sep – Nov','2','₹2,600','PGH, 65 km'),
  c('uttarakhand','jim-corbett','Jim Corbett','India\u2019s oldest national park','Established 1936, with four zones and a genuine tiger population.','Nov – Jun','2 – 3','₹3,400','PGH, 85 km'),
  c('ladakh','leh','Leh','Three and a half thousand metres up','Monasteries on ridgelines, Pangong and Nubra beyond the passes, and two days of acclimatisation first.','Jun – Sep','6 – 8','₹3,600','IXL, 4 km'),
  c('jammu-kashmir','srinagar','Srinagar','Dal Lake, houseboats, Mughal gardens','Shikaras at dawn, four Mughal gardens and the old city\u2019s wooden mosques.','Apr – Oct','3','₹3,000','SXR, 14 km'),
  c('punjab','amritsar','Amritsar','Golden Temple, Partition Museum, Wagah','Open all night, feeding fifty thousand a day, and the most moving building in north India.','Oct – Mar','2','₹2,400','ATQ, 11 km'),
  c('chandigarh','chandigarh','Chandigarh','Le Corbusier\u2019s planned capital','A UNESCO Capitol Complex and a rock garden built from industrial waste.','Oct – Mar','2','₹2,800','IXC, 12 km'),
  c('haryana','kurukshetra','Kurukshetra','The Mahabharata battlefield','Brahma Sarovar, the Krishna museum, and a landscape thick with legend.','Oct – Mar','1 – 2','₹2,000','IXC, 90 km'),
  // Central
  c('uttar-pradesh','agra','Agra','The Taj, Agra Fort, Fatehpur Sikri','Three UNESCO sites within an hour, and a city that rewards a second day.','Oct – Mar','2','₹2,600','AGR, 13 km'),
  c('uttar-pradesh','varanasi','Varanasi','Ghats, Sarnath, and the morning boat','One of the oldest continuously inhabited cities in the world, best seen from the water at five.','Oct – Mar','3','₹2,200','VNS, 26 km'),
  c('uttar-pradesh','lucknow','Lucknow','Awadhi kitchens and Nawabi ruins','The best kebabs in India, plus the Bara Imambara and the Residency.','Oct – Mar','2','₹2,400','LKO, 12 km'),
  c('uttar-pradesh','ayodhya','Ayodhya','Sarayu ghats and the new temple','A pilgrimage town in rapid transition, with the ghats still the quiet part.','Oct – Mar','1 – 2','₹2,000','AYJ, 8 km'),
  c('madhya-pradesh','khajuraho','Khajuraho','Twenty-five temples of an original eighty-five','Chandela sculpture from the tenth century, in a village that is otherwise very quiet.','Oct – Mar','2','₹2,200','HJR, 6 km'),
  c('madhya-pradesh','orchha','Orchha','Cenotaphs on the Betwa','Bundela palaces and riverside cenotaphs, still largely undiscovered.','Oct – Mar','2','₹2,000','GWL, 120 km'),
  c('madhya-pradesh','bandhavgarh','Bandhavgarh','The highest tiger density in India','Three zones, two safaris a day, and a genuine chance of a sighting.','Oct – Jun','3','₹4,000','JLR, 160 km'),
  c('madhya-pradesh','bhopal','Bhopal','Lakes, Sanchi, and Bhimbetka','Two UNESCO sites within an hour, and the best-organised state museum in India.','Oct – Mar','2 – 3','₹2,400','BHO, 15 km'),
  c('chhattisgarh','jagdalpur','Jagdalpur','Chitrakote falls and Bastar markets','India\u2019s widest waterfall and the weekly tribal haats around it.','Oct – Mar','3','₹2,000','RPR, 300 km'),
  // East
  c('west-bengal','kolkata','Kolkata','College Street, Park Street, Durga Puja','Colonial architecture, the best bookshops in India, and a food culture worth a week.','Oct – Mar','3 – 4','₹2,800','CCU, 17 km'),
  c('west-bengal','darjeeling','Darjeeling','Tea, the toy train, and Kanchenjunga','A UNESCO railway, eighty-odd tea estates, and sunrise from Tiger Hill.','Mar – May, Oct – Nov','3','₹2,600','IXB, 70 km'),
  c('west-bengal','sundarbans','Sundarbans','Mangrove tiger country, by boat only','The largest mangrove forest in the world, and the only tigers that swim.','Nov – Mar','2 – 3','₹3,200','CCU, 110 km'),
  c('odisha','puri','Puri','Jagannath, the beach, and Rath Yatra','One of the Char Dham, with a beach town attached and Konark an hour away.','Oct – Mar','2 – 3','₹2,200','BBI, 60 km'),
  c('odisha','bhubaneswar','Bhubaneswar','A city of temples','Six hundred temples, of which Lingaraj and Mukteshwar are the ones to see.','Oct – Mar','2','₹2,200','BBI, 5 km'),
  c('bihar','bodh-gaya','Bodh Gaya','Where the Buddha reached enlightenment','A working pilgrimage centre with monasteries built by a dozen countries.','Oct – Mar','2','₹2,000','GAY, 12 km'),
  c('bihar','nalanda','Nalanda','The ruined university','A thousand years of scholarship, burned in 1193 and excavated since.','Oct – Mar','1','₹1,800','GAY, 95 km'),
  c('jharkhand','ranchi','Ranchi','Waterfalls on the plateau','Hundru, Dassam and Jonha, all within an hour of the city.','Oct – Mar','2','₹2,200','IXR, 7 km'),
  c('sikkim','gangtok','Gangtok','Kanchenjunga from the capital','Rumtek, Tsomgo Lake and the permit road north.','Mar – May, Oct – Dec','3','₹3,000','PYG, 30 km'),
  c('sikkim','pelling','Pelling','Mountain views and Pemayangtse','The clearest Kanchenjunga views in the state, and the skywalk.','Mar – May, Oct – Dec','2','₹2,600','PYG, 130 km'),
  // North-East
  c('assam','guwahati','Guwahati','Kamakhya, the Brahmaputra, and the gateway','The entry point to the north-east, with a hilltop temple and river sunsets.','Nov – Apr','2','₹2,600','GAU, 25 km'),
  c('assam','kaziranga','Kaziranga','Two thirds of the world\u2019s rhinos','Elephant-back at dawn, jeep in the afternoon, and grassland to the horizon.','Nov – Apr','2 – 3','₹3,400','JRH, 97 km'),
  c('assam','majuli','Majuli','The largest river island in the world','Vaishnavite satras, mask-making villages, and a ferry that sets the pace.','Nov – Apr','2','₹2,200','JRH, 20 km'),
  c('meghalaya','shillong','Shillong','Hills, waterfalls, and the music scene','The Scotland of the East, with Elephant Falls and a serious rock tradition.','Oct – Apr','2','₹2,800','SHL, 30 km'),
  c('meghalaya','cherrapunji','Cherrapunji','Living root bridges and the wettest place on earth','Nongriat\u2019s double-decker bridge is three thousand steps down and worth it.','Oct – Apr','2 – 3','₹2,600','SHL, 80 km'),
  c('arunachal-pradesh','tawang','Tawang','The largest monastery in India','Three thousand metres up, over the Sela Pass, near the Tibetan border.','Oct – Apr','4','₹3,000','TEZ, 320 km'),
  c('arunachal-pradesh','ziro','Ziro','Apatani valley and the music festival','Terraced rice fields, bamboo groves and a September festival worth planning around.','Oct – Apr','3','₹2,600','ZER, 30 km'),
  c('nagaland','kohima','Kohima','Hornbill, and the war cemetery','The December festival brings all sixteen tribes to Kisama, ten kilometres away.','Oct – Apr','3','₹2,800','DMU, 74 km'),
  c('manipur','imphal','Imphal','Loktak, Ima Keithel, and the floating park','A market run by five thousand women, and the world\u2019s only floating national park.','Oct – Mar','3','₹2,600','IMF, 8 km'),
  c('mizoram','aizawl','Aizawl','A capital along a ridge','Near-total literacy, Sunday observed, and views down both sides of the town.','Oct – Mar','2','₹2,600','AJL, 32 km'),
  c('tripura','agartala','Agartala','Ujjayanta Palace and Neermahal','A lake palace, a hill of rock-cut reliefs at Unakoti, and very few visitors.','Oct – Mar','2 – 3','₹2,400','IXA, 12 km'),
  // Islands
  c('andaman-nicobar','port-blair','Port Blair','Cellular Jail and the ferry hub','The entry point, with the colonial prison and the Ross Island ruins.','Nov – Apr','2','₹3,600','IXZ, 4 km'),
  c('andaman-nicobar','havelock','Havelock','Radhanagar, and the best diving in India','Swaraj Dweep officially, and the reason most people come.','Nov – Apr','3 – 4','₹4,500','IXZ, 70 km'),
  c('lakshadweep','agatti','Agatti','Lagoon water and a capped visitor count','Permits required, numbers limited, and the clearest water in the country.','Oct – Mar','4','₹5,000','AGX, 2 km'),
];

export const CITY_BY_KEY = new Map(CITIES.map((x) => [x.stateSlug + '/' + x.slug, x]));
export const citiesOf = (stateSlug: string) => CITIES.filter((x) => x.stateSlug === stateSlug);
