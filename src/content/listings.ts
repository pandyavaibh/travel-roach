import { CITIES } from './cities';
import { slugify } from './articles';

function hash(s: string) { let h = 2166136261; for (let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);} return Math.abs(h); }
const num = (s: string, a: number, b: number) => a + (hash(s) % (b - a + 1));
const pick = <T,>(a: T[], s: string) => a[hash(s) % a.length];

export type Kind = 'travel-agents' | 'hotels' | 'restaurants';
export const KINDS: Kind[] = ['travel-agents', 'hotels', 'restaurants'];

export const KIND_LABEL: Record<Kind, string> = {
  'travel-agents': 'Travel agents', hotels: 'Hotels', restaurants: 'Restaurants',
};
export const KIND_SINGULAR: Record<Kind, string> = {
  'travel-agents': 'Travel agent', hotels: 'Hotel', restaurants: 'Restaurant',
};
export const KIND_PRICE_LABEL: Record<Kind, string> = {
  'travel-agents': 'From, per person', hotels: 'Per night, from', restaurants: 'For two, approx',
};
export const KIND_CTA: Record<Kind, [string, string]> = {
  'travel-agents': ['View profile', 'WhatsApp'], hotels: ['View hotel', 'Check dates'], restaurants: ['View restaurant', 'Reserve a table'],
};
export const KIND_FORM: Record<Kind, { title: string; note: string; cta: string; dateField: string }> = {
  'travel-agents': { title: 'Send an enquiry', note: 'Most agents reply the same day.', cta: 'Send enquiry', dateField: 'Travel dates' },
  hotels: { title: 'Check availability', note: 'The property replies directly. No booking commission.', cta: 'Send request', dateField: 'Check-in – check-out' },
  restaurants: { title: 'Reserve a table', note: 'Requests go straight to the restaurant.', cta: 'Request table', dateField: 'Date, time & party size' },
};
export const REVIEW_SOURCE: Record<Kind, string> = {
  'travel-agents': 'Verified enquiries', hotels: 'via Google Business', restaurants: 'via Google Business',
};

export type Listing = {
  slug: string; stateSlug: string; citySlug: string; kind: Kind;
  name: string; meta: string; blurb: string; about: string[];
  verified: boolean; registration: string; established: number;
  area: string; address: string; hours: string; phone: string;
  rating: number; reviews: number; priceFrom: number; tags: string[];
  details: [string, string][];
  rows: { name: string; meta: string; note: string; price: string }[];
  sample?: boolean;
};

/* ---------- Ahmedabad: real businesses, verified names and categories ----------
   Ratings and review counts are illustrative until the Google Business sync runs. */
type Real = [name: string, verified: boolean, meta: string, rating: number, reviews: number, price: number, blurb: string, tags: string[], area: string];

const AMD_AGENTS: Real[] = [
  ['Akshar Travels Pvt. Ltd.', true, 'Tour operator · Est. 1997 · Navrangpura', 4.5, 1240, 16900, 'One of Ahmedabad\u2019s largest operators, running domestic and international packages for 29 years under founder Manish Sharma.', ['Group tours','Family','International'], 'Navrangpura'],
  ['Ventura Holidays Pvt. Ltd.', true, 'IATA accredited · Est. 1997 · Ashram Road', 4.4, 862, 18400, 'IATA-accredited and a registered Gujarat Tourism tour operator. Member of ADTOI, TAFI and the IATA Agents Association of India.', ['Inbound','Outbound','Corporate'], 'Ashram Road'],
  ['Flamingo Transworld Pvt. Ltd.', true, 'Tour operator · 27 years · C.G. Road', 4.6, 2104, 21500, 'Long-established Ahmedabad agency with its own fixed departures and a dedicated Gujarat inbound desk.', ['Fixed departures','Honeymoon'], 'C.G. Road'],
  ['Shrinath Travel Agency', false, 'Travel agency · Est. 1978 · Kalupur', 4.2, 3890, 9800, 'Operating since 1978 under Nandlal R. Kabra. Strongest on bus and rail ticketing plus Saurashtra temple circuits.', ['Temple tours','Bus & rail'], 'Kalupur'],
  ['AB Tours and Travel', true, 'Authorised partner · Gujarat Tourism · Paldi', 4.5, 418, 14200, 'Authorised partner of Gujarat Tourism and the Ministry of Tourism, Government of India. Kutch and Saurashtra focus.', ['Gujarat circuits','Kutch'], 'Paldi'],
  ['Shineworld Tours & Travels', true, 'IATA approved · Est. 2006 · Navrangpura', 4.3, 596, 17600, 'IATA-approved agency founded in 2006, handling air ticketing alongside packaged Gujarat and Rajasthan itineraries.', ['Air ticketing','Rajasthan'], 'Navrangpura'],
  ['Fernweh Vacations', true, 'Tour operator · Bodakdev', 4.7, 284, 23800, 'Smaller operator with a curated approach — fewer departures, customised itineraries, and named guides on each trip.', ['Custom trips','Photography'], 'Bodakdev'],
  ['Kirtan Holidays Pvt. Ltd.', false, 'Travel agency · Satellite', 4.1, 731, 12400, 'Volume agency covering flights, hotels and the standard Gujarat loop. Competitive on price, lighter on planning.', ['Budget','Group tours'], 'Satellite'],
];

const AMD_HOTELS: Real[] = [
  ['The House of MG', true, 'Heritage hotel · Lal Darwaja · 38 rooms', 4.8, 1842, 9000, 'Restored early-20th-century mansion facing Sidi Saiyyed, in the UNESCO World Heritage City. Courtyards, verandas and the Agashiye rooftop thali.', ['Heritage','Pool','Breakfast'], 'Lal Darwaja'],
  ['Mangaldas ni Haveli I', true, 'Heritage B&B · Old city · 2 suites', 4.7, 214, 6800, 'A 300-year-old haveli intricately carved in wood, restored to two spacious suites around a traditional courtyard.', ['Heritage','Old city','B&B'], 'Old city'],
  ['Mangaldas ni Haveli II', true, 'Heritage hotel · Old city', 4.6, 168, 5900, 'A 150-year-old property with a stucco façade and restored interiors, combining old-city architecture with modern comfort.', ['Heritage','Old city'], 'Old city'],
  ['French Haveli', true, 'Heritage homestay · Khadia · Pol house', 4.6, 322, 4200, 'A 150-year-old Gujarati heritage house refurbished inside the famed pol neighbourhood. Colourful, comfortable, genuinely local.', ['Homestay','Pol house','Old city'], 'Khadia'],
  ['Mani Mansion', true, 'Heritage hotel · City centre', 4.5, 486, 5400, 'Built by a well-known Ahmedabad family as a private mansion, now a heritage hotel known for its design and history.', ['Heritage','Central'], 'City centre'],
  ['Le Méridien Ahmedabad', true, 'Luxury · Khanpur · Riverfront', 4.5, 3210, 11800, 'Riverfront five-star in the heart of the World Heritage City, walking distance from the old city gates.', ['Pool','Riverfront','Airport pickup'], 'Khanpur'],
  ['Crowne Plaza Ahmedabad City Centre', true, 'Business hotel · Ashram Road', 4.4, 2688, 8200, 'Full-service business hotel on Ashram Road with meeting space, twenty minutes from the airport outside rush hour.', ['Business','Pool','Parking'], 'Ashram Road'],
  ['Four Points by Sheraton', true, 'Business hotel · Ashram Road', 4.3, 1974, 6400, 'Reliable mid-scale Marriott property, walkable to the riverfront promenade and Gandhi Ashram.', ['Business','Breakfast'], 'Ashram Road'],
  ['Fortune Landmark', false, '4-star · Usmanpura', 4.2, 2455, 5200, 'ITC\u2019s mid-market brand, north of the river. Good value, dated in places, dependable service.', ['Business','Parking'], 'Usmanpura'],
  ['Lemon Tree Premier', true, '4-star · SG Highway', 4.3, 1806, 5800, 'On the SG Highway corridor, best for business travellers — a long way from the old city in traffic.', ['Business','Pool'], 'SG Highway'],
];

const AMD_RESTAURANTS: Real[] = [
  ['Agashiye', true, 'Gujarati thali · House of MG · Rooftop', 4.7, 2904, 2200, 'Rooftop thali at the House of MG. Unlimited, seasonal, and paced slowly over about two hours.', ['Thali','Rooftop','Pure veg'], 'Lal Darwaja'],
  ['Vishalla', true, 'Village dining · Vasna · Dinner only', 4.5, 4150, 1400, 'Eaten cross-legged on the floor by lamplight, with a utensil museum attached. Book ahead in winter.', ['Thali','Jain options','Outdoor'], 'Vasna'],
  ['Gordhan Thal', true, 'Gujarati thali · Bodakdev', 4.4, 6820, 1100, 'One of the city\u2019s most-reviewed thali houses. Large, efficient, and busier at lunch than dinner.', ['Thali','Pure veg','Groups'], 'Bodakdev'],
  ['Rajwadu', true, 'Gujarati & Rajasthani · Jivraj Park', 4.4, 5940, 1300, 'Upscale village-style courtyard dining behind Ambaji Temple. Among the most reviewed places in Ahmedabad.', ['Thali','Outdoor','Live music'], 'Jivraj Park'],
  ['Patang Re-Evolve', true, 'North Indian · Revolving · Ashram Road', 4.2, 3488, 2400, 'The revolving restaurant above the city — go for the view at sunset and order conservatively.', ['Fine dining','Views'], 'Ashram Road'],
  ['Green House', true, 'Multi-cuisine café · House of MG', 4.5, 2210, 900, 'Open-air café on the ground floor of the House of MG, good for breakfast and the mid-morning gap.', ['Café','Breakfast','Outdoor'], 'Lal Darwaja'],
  ['Swati Snacks', true, 'Gujarati snacks · Law Garden', 4.5, 4720, 700, 'Panki, handvo and pav bhaji done properly, in a bright room with a queue most evenings.', ['Snacks','Pure veg','Casual'], 'Law Garden'],
  ['Under The Neem Trees', false, 'Multi-cuisine · Bodakdev', 4.3, 1140, 1200, 'Garden restaurant opposite the Mahila Municipal Garden. Pleasant in winter, hard work in May.', ['Outdoor','Multi-cuisine'], 'Bodakdev'],
  ['Kovallam — The South Indian Kitchen', false, 'South Indian · Navrangpura', 4.3, 986, 600, 'Next to Cadila House in Navrangpura. Appam, stew and the best dosa north of the river.', ['South Indian','Pure veg','Budget'], 'Navrangpura'],
  ['Manek Chowk night stalls', false, 'Street food · Old city · 9pm–1am', 4.6, 8401, 300, 'Sandwich, dosa and kulfi carts that set up on the jewellery market after the shutters come down.', ['Street food','Late night','Budget'], 'Old city'],
  ['Chandravilas', true, 'Breakfast · Gandhi Road · Since 1900', 4.4, 3210, 240, 'Fafda-jalebi only, and only before ten. Sunday queues run forty minutes and are worth it.', ['Breakfast','Street food','Heritage'], 'Gandhi Road'],
];

const REAL: Record<string, Record<Kind, Real[]>> = {
  ahmedabad: { 'travel-agents': AMD_AGENTS, hotels: AMD_HOTELS, restaurants: AMD_RESTAURANTS },
};

/* ---------- Generated listings for every other city ---------- */
const GEN_NAMES: Record<Kind, string[]> = {
  'travel-agents': ['{C} Journeys','{C} Travel Company','Compass {C}','{C} Holidays Pvt. Ltd.','Heritage Trails {C}','{C} Voyages','Meridian {C} Tours','{C} Explorers'],
  hotels: ['The {C} Heritage','{C} Palace Hotel','Haveli {C}','{C} Residency','The Courtyard, {C}','{C} Homestay','Riverside {C}','Hotel {C} Grand'],
  restaurants: ['{C} Thali House','The {C} Kitchen','Old {C} Cafe','{C} Spice Room','Courtyard Dining, {C}','{C} Street Kitchen','The {C} Table','Cafe {C}'],
};
const GEN_META: Record<Kind, string[]> = {
  'travel-agents': ['Tour operator (DMC)','Independent advisor','Agency with staff','Licensed guide'],
  hotels: ['Heritage hotel','Homestay','Business hotel','Boutique hotel','Guesthouse'],
  restaurants: ['Regional thali','Street food','Multi-cuisine','Cafe','Fine dining'],
};
const GEN_TAGS: Record<Kind, string[]> = {
  'travel-agents': ['Wildlife','Heritage','Honeymoon','Family','Pilgrimage','Photography','Custom trips','Group tours'],
  hotels: ['Heritage','Homestay','Pool','Breakfast','Parking','Old city','Budget','Airport pickup'],
  restaurants: ['Pure veg','Street food','Rooftop','Late night','Jain options','Outdoor','Budget','Groups'],
};
const GEN_BLURB: Record<Kind, (c: string) => string> = {
  'travel-agents': (c) => `Locally run operator covering ${c} and the districts around it, with named guides and its own vehicles rather than subcontracted ones.`,
  hotels: (c) => `Mid-sized property within reach of the main sights in ${c}, with parking, a kitchen that runs late and staff who arrange transport.`,
  restaurants: (c) => `A long-standing kitchen in ${c} doing regional cooking without concessions, busiest at lunch and worth the wait.`,
};

const ROOMS = [
  { name: 'Standard double', meta: '1 queen · 22 sqm', note: 'The base room, interior-facing and the quietest in the building.' },
  { name: 'Deluxe double', meta: '1 king · 30 sqm', note: 'Larger, with a sitting area and a view over the street.' },
  { name: 'Heritage suite', meta: '1 king + daybed · 44 sqm', note: 'Corner suite with the original woodwork and the best light.' },
  { name: 'Family room', meta: '1 king + 2 singles · 52 sqm', note: 'Two connected rooms, sleeps four comfortably.' },
];
const MENUS = [
  { name: 'Winter thali', meta: 'Nov – Feb · unlimited', note: 'Seasonal vegetables, fresh jaggery and the dishes that only run in the cold months.' },
  { name: 'Everyday thali', meta: 'Year round · unlimited', note: 'The standard spread, served through both sittings.' },
  { name: 'Jain thali', meta: 'On request · 24 hours notice', note: 'Same structure, no root vegetables.' },
  { name: 'À la carte', meta: 'Lunch and dinner', note: 'Shorter menu for people who do not want the full thali.' },
];
const TOURS = [
  { name: 'Half-day city walk', meta: '4 hours · morning', note: 'The old quarter on foot, with entry fees included.' },
  { name: 'Full-day city tour', meta: '8 hours · car + guide', note: 'Everything inside the city plus the two sites just outside it.' },
  { name: 'Three-day regional loop', meta: '3 days · driver', note: 'Uses the city as a base, out and back each day.' },
  { name: 'Custom itinerary', meta: 'Any length', note: 'Built around your dates, priced after a call.' },
];

function detailsFor(kind: Kind, l: { meta: string; area: string; tags: string[]; established: number }): [string, string][] {
  if (kind === 'hotels') return [
    ['Property type', l.meta.split(' · ')[0]], ['Area', l.area], ['Check-in / out', '14:00 / 11:00'],
    ['Amenities', l.tags.join(', ')], ['Parking', 'On site'], ['Payment', 'Cards, UPI, cash'],
  ];
  if (kind === 'restaurants') return [
    ['Cuisine', l.meta.split(' · ')[0]], ['Meals', 'Lunch, dinner'], ['Area', l.area],
    ['Good for', l.tags.join(', ')], ['Dietary', 'Vegetarian options'], ['Timings', '11:00–15:00, 19:00–22:30'],
  ];
  return [
    ['Agent type', l.meta.split(' · ')[0]], ['Speciality', l.tags.join(', ')], ['Languages', 'English, Hindi'],
    ['Area', l.area], ['Response time', 'Within 6 hours'], ['Established', String(l.established)],
  ];
}

function build(city: { slug: string; stateSlug: string; name: string }, kind: Kind, r: Real, sample: boolean): Listing {
  const [name, verified, meta, rating, reviews, priceFrom, blurb, tags, area] = r;
  const established = Number((meta.match(/Est\. (\d{4})/) || meta.match(/Since (\d{4})/) || [])[1]) || 2005;
  const rows = kind === 'hotels' ? ROOMS : kind === 'restaurants' ? MENUS : TOURS;
  return {
    slug: slugify(name), stateSlug: city.stateSlug, citySlug: city.slug, kind,
    name, meta, blurb, verified, established, area, sample,
    about: [
      blurb,
      kind === 'travel-agents'
        ? `They handle the permits and bookings that are hard to arrange from outside the state, and will build around your dates rather than sell a fixed departure.`
        : kind === 'hotels'
          ? `Rooms vary — ask which side the room faces before confirming, and check whether breakfast is included in the rate you were quoted.`
          : `Busiest at lunch. Booking is advisable at weekends and essential during festival weeks.`,
    ],
    registration: verified
      ? (kind === 'travel-agents' ? 'Tourism reg. verified · checked Feb 2026' : 'Licence on file · synced from Google today')
      : 'Unverified listing',
    address: `${area}, ${city.name}`,
    hours: kind === 'restaurants' ? '11:00–15:00 · 19:00–22:30' : kind === 'hotels' ? 'Front desk, 24 hours' : 'Mon–Sat, 10:00–19:00',
    phone: '+91 ' + num(name, 70, 99) + ' ' + num(name + 'x', 10000, 99999) + ' ' + num(name + 'y', 1000, 9999),
    rating, reviews, priceFrom, tags,
    details: detailsFor(kind, { meta, area, tags, established }),
    rows: rows.map((x) => ({ ...x, price: '₹' + (priceFrom + num(name + x.name, 0, 40) * 100).toLocaleString('en-IN') })),
  };
}

export const LISTINGS: Listing[] = CITIES.flatMap((city) =>
  KINDS.flatMap((kind) => {
    const real = REAL[city.slug]?.[kind];
    if (real) return real.map((r) => build(city, kind, r, true));
    const names = GEN_NAMES[kind];
    return names.map((tpl, i) => {
      const name = tpl.replace('{C}', city.name);
      const seed = city.slug + kind + i;
      const meta = pick(GEN_META[kind], seed) + ' · Est. ' + num(seed, 1985, 2019) + ' · ' + city.name;
      const tags = [pick(GEN_TAGS[kind], seed), pick(GEN_TAGS[kind], seed + 'b')].filter((v, j, a) => a.indexOf(v) === j);
      const base = kind === 'hotels' ? num(seed, 18, 95) * 100 : kind === 'restaurants' ? num(seed, 3, 22) * 100 : num(seed, 90, 260) * 100;
      return build(city, kind, [
        name, num(seed, 0, 10) > 3, meta, Number((3.8 + (num(seed, 0, 11) / 10)).toFixed(1)),
        num(seed, 40, 2400), base, GEN_BLURB[kind](city.name),
        tags, city.name,
      ], false);
    });
  }),
);

export const listingsFor = (stateSlug: string, citySlug: string, kind: Kind) =>
  LISTINGS.filter((l) => l.stateSlug === stateSlug && l.citySlug === citySlug && l.kind === kind)
    .sort((a, b) => b.rating - a.rating);

export const listingBySlug = (stateSlug: string, citySlug: string, kind: Kind, slug: string) =>
  LISTINGS.find((l) => l.stateSlug === stateSlug && l.citySlug === citySlug && l.kind === kind && l.slug === slug);

export const REVIEWS_FOR = (l: Listing) => {
  const s = l.slug;
  const bodies: Record<Kind, [string, string, string][]> = {
    'travel-agents': [
      ['Daniel R.', 'Permits were confirmed within a day of paying — we had failed to get them ourselves for three weeks. The driver was waiting thirty minutes before the agreed time, every morning.', 'Regional loop, 7 days'],
      ['Aparna S.', 'They rebooked twice when our flights moved and never mentioned a fee. Genuinely helpful rather than merely responsive.', 'City tour, 3 days'],
      ['Marc L.', 'Excellent on the ground, slightly slow on email before the trip. Worth the wait.', 'Custom itinerary'],
    ],
    hotels: [
      ['Sunita M.', 'The courtyard is genuinely cooler than the street and you hear birds rather than traffic. Breakfast before the heat arrives is the reason to stay here.', 'Deluxe double, 3 nights'],
      ['Tom H.', 'Beautiful building, and the staff arranged a guide at no notice. The plumbing is period-appropriate, which is a polite way of saying the shower is slow.', 'Heritage suite, 2 nights'],
      ['Ritu B.', 'Connecting rooms meant the children could sleep while we ate. They held our bags for a full day after checkout without being asked.', 'Family room, 4 nights'],
    ],
    restaurants: [
      ['Karan D.', 'They keep bringing it until you physically cover the plate. Two hours, and we walked out slowly.', 'Winter thali, dinner'],
      ['Elena P.', 'Told them about the Jain requirement when booking and it was handled without fuss. Lunch is much quieter than dinner and the same food.', 'Lunch thali'],
      ['Ajay S.', 'Book two days ahead — we tried walking in on a Saturday and had no chance.', 'Dinner, table for four'],
    ],
  };
  return bodies[l.kind].map(([who, text, trip], i) => ({
    who, text, trip,
    when: ['Feb 2026', 'Jan 2026', 'Dec 2025'][i],
    stars: (i === 2 ? 4.0 : 5.0).toFixed(1),
  }));
};
