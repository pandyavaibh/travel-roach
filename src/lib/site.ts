import { STATES } from '@/content/states';
import { CITIES } from '@/content/cities';

export const SITE = {
  name: 'Travel Roach',
  tagline: 'India, guide by guide.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
};

export type SectionType = 'articles' | 'packages' | 'events' | 'directory' | 'attractions';

export const CITY_SECTIONS: { slug: string; label: string; type: SectionType; kind?: 'travel-agents'|'hotels'|'restaurants' }[] = [
  { slug: 'things-to-do',  label: 'Things to do',      type: 'articles' },
  { slug: 'attractions',   label: 'Attractions',       type: 'attractions' },
  { slug: 'itineraries',   label: 'Itineraries',       type: 'packages' },
  { slug: 'food',          label: 'Food',              type: 'articles' },
  { slug: 'how-to-reach',  label: 'How to reach',      type: 'articles' },
  { slug: 'hotels',        label: 'Where to stay',     type: 'directory', kind: 'hotels' },
  { slug: 'nearby',        label: 'Near by',           type: 'articles' },
  { slug: 'festivals',     label: 'Fairs & festivals', type: 'events' },
  { slug: 'restaurants',   label: 'Restaurants',       type: 'directory', kind: 'restaurants' },
  { slug: 'travel-agents', label: 'Travel agents',     type: 'directory', kind: 'travel-agents' },
];

export const sectionDef = (slug: string) => CITY_SECTIONS.find((s) => s.slug === slug);

export const SECTION_CHIPS: Record<string, string[]> = {
  'things-to-do': ['All','Heritage walk','Museums','Markets','Free entry','With children','Photography'],
  food: ['All','Thali','Breakfast','Street food','Cafes','Budget','Sweets'],
  'how-to-reach': ['All','By air','By train','By road','Local transport'],
  nearby: ['All','Under 1 hour','Half day','Full day','UNESCO','Wildlife','Temples'],
  festivals: ['All','Winter','Spring','Monsoon','Autumn','Free','Ticketed'],
  itineraries: ['All','1 day','2 – 3 days','4 – 6 days','A week or more'],
  attractions: ['All','Fort','Temple','Museum','Stepwell','Garden','Market'],
};

export const LISTING_FILTERS: Record<string, { title: string; options: string[] }[]> = {
  'travel-agents': [
    { title: 'Agent type', options: ['Tour operator (DMC)','Independent advisor','Agency with staff','Licensed guide'] },
    { title: 'Speciality', options: ['Wildlife','Heritage','Honeymoon','Family','Photography','Custom trips'] },
    { title: 'Rating', options: ['4.5','4.0','3.5'] },
  ],
  hotels: [
    { title: 'Property type', options: ['Heritage hotel','Homestay','Business hotel','Boutique hotel','Guesthouse'] },
    { title: 'Amenities', options: ['Pool','Breakfast','Parking','Airport pickup','Old city'] },
    { title: 'Rating', options: ['4.5','4.0','3.5'] },
  ],
  restaurants: [
    { title: 'Cuisine', options: ['Regional thali','Street food','Multi-cuisine','Cafe','Fine dining'] },
    { title: 'Good for', options: ['Pure veg','Jain options','Rooftop','Late night','Outdoor','Groups'] },
    { title: 'Rating', options: ['4.5','4.0','3.5'] },
  ],
};

export const HUBS: Record<string, { slug: string; title: string; intro: string; groups: { title: string; links: [string, string][] }[] }> = {
  destinations: {
    slug: 'destinations', title: 'Destinations',
    intro: 'Thirty-six states and union territories, and the seasons that decide which of them is worth your week.',
    groups: [
      { title: 'By region', links: [['North India','/destinations'],['West India','/destinations'],['South India','/destinations'],['East India','/destinations'],['North-East','/destinations'],['Central India','/destinations']] },
      { title: 'States & UTs', links: [['Gujarat','/gujarat'],['Rajasthan','/rajasthan'],['Kerala','/kerala'],['Goa','/goa'],['Maharashtra','/maharashtra'],['Himachal Pradesh','/himachal-pradesh']] },
      { title: 'Cities', links: [['Ahmedabad','/gujarat/ahmedabad'],['Jaipur','/rajasthan/jaipur'],['Mumbai','/maharashtra/mumbai'],['Delhi','/delhi/new-delhi'],['Kochi','/kerala/kochi'],['Varanasi','/uttar-pradesh/varanasi']] },
      { title: 'Popular', links: [['Rann of Kutch','/gujarat/bhuj'],['Backwaters','/kerala/alappuzha'],['Ladakh','/ladakh/leh'],['Andamans','/andaman-nicobar/havelock'],['Spiti','/himachal-pradesh/spiti'],['Sundarbans','/west-bengal/sundarbans']] },
    ],
  },
  places: {
    slug: 'places', title: 'Places to Visit',
    intro: 'Forts, stepwells, beaches, monasteries and the modern landmarks that earned their place beside them.',
    groups: [
      { title: 'Heritage', links: [['Historical places','/places'],['Forts & palaces','/places'],['Stepwells','/places'],['UNESCO sites','/places']] },
      { title: 'Faith', links: [['Temples','/places'],['Mosques & dargahs','/places'],['Churches','/places'],['Monasteries','/places']] },
      { title: 'Nature', links: [['Beaches','/places'],['Hill stations','/places'],['National parks','/places'],['Waterfalls','/places']] },
      { title: 'Modern', links: [['Statue of Unity','/gujarat'],['Museums','/places'],['Markets','/places'],['Waterfronts','/places']] },
    ],
  },
  'things-to-do': {
    slug: 'things-to-do', title: 'Things to Do',
    intro: 'Travel by what you actually want to do — a tiger at dawn, a pass at 4,500 metres, or nine nights of dancing.',
    groups: [
      { title: 'Active', links: [['Adventure','/things-to-do'],['Trekking','/things-to-do'],['Diving','/things-to-do'],['Cycling','/things-to-do']] },
      { title: 'Wildlife', links: [['Tiger safaris','/madhya-pradesh'],['Birding','/things-to-do'],['Lion safari','/gujarat'],['Marine parks','/andaman-nicobar']] },
      { title: 'Culture', links: [['Heritage walks','/things-to-do'],['Festivals','/things-to-do'],['Crafts','/things-to-do'],['Photography','/things-to-do']] },
      { title: 'Slow travel', links: [['Family activities','/things-to-do'],['Shopping','/things-to-do'],['Homestays','/things-to-do'],['Food trails','/food-culture']] },
    ],
  },
  'food-culture': {
    slug: 'food-culture', title: 'Food & Culture',
    intro: 'What the state eats, why it eats it that way, and the festivals and crafts that came from the same place.',
    groups: [
      { title: 'Eat', links: [['Indian food','/food-culture'],['State food','/food-culture'],['Street food','/food-culture'],['Thali guides','/food-culture']] },
      { title: 'Culture', links: [['Festivals','/food-culture'],['Local culture','/food-culture'],['Textiles','/food-culture'],['Music & dance','/food-culture']] },
      { title: 'Guides', links: [['Gujarati food','/gujarat/ahmedabad/food'],['Rajasthani food','/rajasthan/jaipur/food'],['Kerala food','/kerala/kochi/food'],['Bengali food','/west-bengal/kolkata/food']] },
      { title: 'Seasonal', links: [['Navratri','/gujarat/ahmedabad/festivals'],['Pushkar Mela','/rajasthan/pushkar/festivals'],['Onam','/kerala/kochi/festivals'],['Hornbill','/nagaland/kohima/festivals']] },
    ],
  },
};

export const MEGA_MENU: [string, string][] = [
  ['Destinations', '/destinations'],
  ['Places to Visit', '/places'],
  ['Things to Do', '/things-to-do'],
  ['Food & Culture', '/food-culture'],
];

export const FOOTER_COLUMNS: { title: string; links: [string, string][] }[] = [
  { title: 'Explore', links: [['Destinations','/destinations'],['Places to Visit','/places'],['Things to Do','/things-to-do'],['Food & Culture','/food-culture'],['Search','/search']] },
  { title: 'Popular states', links: [['Gujarat','/gujarat'],['Rajasthan','/rajasthan'],['Kerala','/kerala'],['Maharashtra','/maharashtra'],['Uttar Pradesh','/uttar-pradesh']] },
  { title: 'Popular cities', links: [['Ahmedabad','/gujarat/ahmedabad'],['Jaipur','/rajasthan/jaipur'],['Varanasi','/uttar-pradesh/varanasi'],['Kochi','/kerala/kochi'],['Leh','/ladakh/leh']] },
  { title: 'Company', links: [['About us','/about'],['Contact','/contact'],['List your business','/list-your-business'],['Write for us','/write-for-us'],['Privacy','/privacy'],['Terms','/terms']] },
];

export const INTERESTS: [string, number, string][] = [
  ['Wildlife', 128, 'Nov – Mar'], ['Heritage', 402, 'Oct – Mar'], ['Food', 310, 'Year round'], ['Adventure', 240, 'Sep – Jun'],
  ['Beaches', 96, 'Nov – Feb'], ['Trekking', 132, 'Mar – Jun'], ['Festivals', 148, 'Seasonal'], ['Crafts', 82, 'Year round'],
];

export const POPULAR = [
  ['gujarat','ahmedabad','▲ 4','#1F7A33','100%','4,182'],
  ['rajasthan','jaipur','▲ 1','#1F7A33','91%','3,804'],
  ['ladakh','leh','▼ 2','#B4441F','78%','3,266'],
  ['uttar-pradesh','varanasi','—','#8C8677','71%','2,948'],
  ['rajasthan','udaipur','▲ 6','#1F7A33','64%','2,671'],
  ['kerala','kochi','▼ 1','#B4441F','58%','2,410'],
  ['goa','panaji','▲ 2','#1F7A33','52%','2,188'],
  ['maharashtra','mumbai','—','#8C8677','47%','1,962'],
] as const;

export const inr = (n: number) => '₹' + n.toLocaleString('en-IN');
export const totalCities = CITIES.length;
export const totalStates = STATES.length;
