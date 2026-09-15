import { CITIES, citiesOf, type City } from './cities';
import { STATES, STATE_BY_SLUG } from './states';

/* Deterministic pseudo-random so content is stable across builds. */
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h);
}
const pick = <T,>(arr: T[], seed: string, offset = 0): T => arr[(hash(seed) + offset * 7919) % arr.length];
const num = (seed: string, min: number, max: number) => min + (hash(seed) % (max - min + 1));

export const slugify = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
   .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const AUTHORS = ['Priya Menon','Arjun Rao','Nisha Thakkar','Devang Patel','Meera Joshi','Kabir Shah'];

export type Article = {
  slug: string; stateSlug: string; citySlug: string; section: string;
  kicker: string; title: string; dek: string; author: string; minutes: number;
  featured: boolean; published: string; body: string[]; takeaways: string[];
};

type Tpl = [kicker: string, title: (c: string) => string, dek: (c: string) => string];

const THINGS: Tpl[] = [
  ['Heritage walk', (c) => `The 7am heritage walk through ${c}`, () => 'Where it starts, what it covers, and why the hour matters more than the route.'],
  ['Museums', (c) => `The museums of ${c}, ranked by whether they are worth it`, () => 'Four that justify the ticket, two that do not, and one that needs booking two weeks ahead.'],
  ['Free entry', (c) => `Nine things to do in ${c} that cost nothing`, () => 'No ticket counter, no guide fee, and none of them are a park bench.'],
  ['Architecture', (c) => `Reading the architecture of ${c}`, () => 'What the facades tell you about who built them and when the money arrived.'],
  ['Markets', (c) => `The markets of ${c}, and the right hour for each`, () => 'One opens at six, one only exists after nine at night, and the rest are in between.'],
  ['With children', (c) => `${c} with children, without the meltdown`, () => 'Shade, toilets, short distances and the three stops that actually hold attention.'],
  ['Photography', (c) => `Where to photograph ${c}, and when the light works`, () => 'Six vantage points, the hour each one works, and where tripods are a problem.'],
  ['Neighbourhoods', (c) => `The five neighbourhoods of ${c} worth walking`, () => 'What each one was built for, and what it has become since.'],
  ['One day', (c) => `One perfect day in ${c}`, () => 'A single sequence that works, from first light to the last thing worth staying up for.'],
  ['After dark', (c) => `${c} after dark`, () => 'What opens when the monuments close, and how late it runs.'],
  ['Religious sites', (c) => `The temples and shrines of ${c}, and how to visit respectfully`, () => 'Dress, timings, photography rules and which ones welcome visitors.'],
  ['Crafts', (c) => `Where to watch things being made in ${c}`, () => 'Working workshops rather than showrooms, and the days they actually run.'],
  ['Walks', (c) => `Three self-guided walks in ${c}`, () => 'Routes you can follow on your own, with the turns that are easy to miss.'],
  ['Day plan', (c) => `Half a day in ${c}: the compressed version`, () => 'For a layover or a late train. Four stops, no rushing.'],
  ['Offbeat', (c) => `Seven places in ${c} that guidebooks skip`, () => 'Not hidden, exactly. Just never on the list.'],
  ['Rainy day', (c) => `What to do in ${c} when it rains`, () => 'Indoors, walkable and open through the monsoon.'],
  ['Views', (c) => `The best views over ${c}`, () => 'Rooftops, towers and one hill, with the access rules for each.'],
  ['Shopping', (c) => `What to actually buy in ${c}`, () => 'What is made here, what is trucked in, and the fair price for both.'],
  ['Slow travel', (c) => `Three days in ${c} without a schedule`, () => 'For people who would rather sit in one cafe twice than see everything once.'],
  ['Local life', (c) => `A weekday morning in ${c}`, () => 'Where people actually go before work, and what it costs to join them.'],
];

const FOOD: Tpl[] = [
  ['Thali', (c) => `The ${c} thali, explained course by course`, () => 'Why it arrives in that order, and how to signal that you are finished.'],
  ['Breakfast', (c) => `Breakfast in ${c}, before nine`, () => 'The dishes that vanish by mid-morning, and the four places still doing them properly.'],
  ['Street food', (c) => `A street food crawl through ${c}`, () => 'Six stops, two hours, and roughly what each one should cost.'],
  ['Recipes', (c) => `Three ${c} dishes you can cook at home`, () => 'Ingredient substitutions that work, and the one step people always rush.'],
  ['Cafes', (c) => `Where to work from in ${c}`, () => 'Real coffee, plugs, and a table you can hold for three hours.'],
  ['Budget', (c) => `Full meals in ${c} under ₹150`, () => 'Eleven places where lunch costs less than a coffee.'],
  ['Sweets', (c) => `The sweet shops of ${c} worth the queue`, () => 'What is seasonal, what is daily, and what is only made for one festival.'],
  ['Vegetarian', (c) => `Eating vegetarian in ${c}`, () => 'What to ask for, what to avoid, and the phrase that settles it.'],
  ['Fine dining', (c) => `The restaurants in ${c} worth dressing for`, () => 'Five that justify the bill, with what to order at each.'],
  ['Markets', (c) => `The food markets of ${c}`, () => 'Where the restaurants buy, and when the good stuff is gone.'],
  ['Drinks', (c) => `What to drink in ${c}`, () => 'Chai, coffee, lassi and the regional thing nobody exports.'],
  ['Late night', (c) => `Where to eat in ${c} after eleven`, () => 'Still open, still good, and safe to walk back from.'],
  ['Regional', (c) => `How ${c} eats differently from the rest of the state`, () => 'The dishes that stop at the district line, and why.'],
  ['Food tour', (c) => `Is a food tour in ${c} worth it?`, () => 'What you get for the money, and when to just walk it yourself.'],
  ['Dietary', (c) => `Vegan, Jain and gluten-free in ${c}`, () => 'What is naturally safe, what to check, and how to phrase the question.'],
  ['Classic', (c) => `The five dishes that define ${c}`, () => 'If you eat nothing else, eat these, and here is where.'],
  ['Institution', (c) => `The oldest restaurants in ${c}`, () => 'Still family-run, still on the original stove, and still worth the queue.'],
  ['Snacks', (c) => `The afternoon snack culture of ${c}`, () => 'The four o\u2019clock ritual, and what it involves.'],
  ['Seasonal', (c) => `What to eat in ${c} by season`, () => 'Twelve months, twelve things that only exist for a few weeks.'],
  ['Hidden', (c) => `Six places to eat in ${c} with no sign outside`, () => 'Found by asking, and worth the effort of finding.'],
];

const REACH: Tpl[] = [
  ['By air', (c) => `Flying into ${c}`, () => 'Which airlines run the route, and how far the airport really is.'],
  ['By train', (c) => `Every train worth taking into ${c}`, () => 'Which services to book, which class, and how the Tatkal window works.'],
  ['By road', (c) => `Driving to ${c}`, () => 'Road quality, toll costs, and where to break the journey.'],
  ['Local transport', (c) => `Getting around ${c}`, () => 'Metro, bus, auto and app cabs, with what each should cost.'],
  ['From Delhi', (c) => `Delhi to ${c}: every option compared`, () => 'Flight, train and bus, with real door-to-door times.'],
  ['From Mumbai', (c) => `Mumbai to ${c}: every option compared`, () => 'What the fastest route costs, and what the cheapest one costs you in hours.'],
  ['Airport transfer', (c) => `${c} airport to the centre`, () => 'Prepaid, app cab or bus — what each costs and how long it takes.'],
  ['Rickshaw fares', (c) => `What a rickshaw should cost in ${c}`, () => 'Standard fares for twelve common routes, so you know when to argue.'],
  ['Accessibility', (c) => `Getting around ${c} with reduced mobility`, () => 'Which sites have ramps, which stations have lifts, and what to book ahead.'],
  ['Onward', (c) => `Where to go next from ${c}`, () => 'The eight onward routes people actually take, with times.'],
];

const NEAR: Tpl[] = [
  ['Under 1 hour', (c) => `Six places within an hour of ${c}`, () => 'Close enough for a morning, far enough to feel like leaving.'],
  ['Half day', (c) => `The best half-day trips from ${c}`, () => 'Out by nine, back for a late lunch.'],
  ['Full day', (c) => `Full-day trips from ${c}, ranked`, () => 'What justifies the drive and what does not.'],
  ['UNESCO', (c) => `UNESCO sites near ${c}`, () => 'What each one is, and how long you actually need there.'],
  ['Wildlife', (c) => `Wildlife near ${c}`, () => 'Parks, sanctuaries and lakes, with the season each one works.'],
  ['Temples', (c) => `Temple circuits from ${c}`, () => 'A day, a route, and the timings that decide the order.'],
  ['Weekend', (c) => `Three weekend escapes from ${c}`, () => 'Leave Friday evening, back Sunday night, no flights.'],
  ['Nature', (c) => `Hills, lakes and forests near ${c}`, () => 'Where the city goes when it needs to stop being a city.'],
  ['Villages', (c) => `Craft villages around ${c}`, () => 'Working villages, market days, and what they make.'],
  ['Overnight', (c) => `Four overnight trips from ${c}`, () => 'Far enough to need a bed, close enough to be worth it.'],
];

const SECTION_TEMPLATES: Record<string, Tpl[]> = {
  'things-to-do': THINGS, food: FOOD, 'how-to-reach': REACH, nearby: NEAR,
};

export const SECTION_ARTICLE_COUNT: Record<string, number> = {
  'things-to-do': 20, food: 20, 'how-to-reach': 10, nearby: 10,
};

function buildBody(city: string, kicker: string, dek: string): string[] {
  return [
    `${dek} What follows is based on visits made in the last eighteen months, and we update it when the timings or the prices change.`,
    `The practical constraints in ${city} are the ones that catch people out: opening hours that shift with the season, a midday gap when almost everything closes, and distances that look walkable on a map and are not in May. Plan around those three and the rest falls into place.`,
    `If you only have one morning, take the earliest slot available. Sites that are unbearable at noon are quiet and photogenic at seven, and most of the ticket queues have not formed yet.`,
    `Prices below were correct at the last check. Entry fees for Indian and foreign nationals differ at centrally protected monuments, and camera fees are usually charged separately.`,
  ];
}

export const ARTICLES: Article[] = (() => {
  const out: Article[] = [];
  for (const city of CITIES) {
    for (const [section, templates] of Object.entries(SECTION_TEMPLATES)) {
      const count = Math.min(SECTION_ARTICLE_COUNT[section], templates.length);
      for (let i = 0; i < count; i++) {
        const [kicker, titleFn, dekFn] = templates[i];
        const title = titleFn(city.name);
        const dek = dekFn(city.name);
        const seed = city.slug + section + i;
        out.push({
          slug: slugify(title),
          stateSlug: city.stateSlug, citySlug: city.slug, section,
          kicker, title, dek,
          author: pick(AUTHORS, seed),
          minutes: num(seed, 4, 14),
          featured: i === 0,
          published: new Date(Date.UTC(2026, 1, 20) - num(seed, 0, 300) * 86400000).toISOString().slice(0, 10),
          body: buildBody(city.name, kicker, dek),
          takeaways: [
            'Go early. The first two hours are the difference between a good visit and a queue.',
            'Carry cash for entry fees; card machines are unreliable at smaller sites.',
            'Check the weekly closing day before you plan the route around it.',
          ],
        });
      }
    }
  }
  return out;
})();

export const articlesFor = (stateSlug: string, citySlug: string, section: string) =>
  ARTICLES.filter((a) => a.stateSlug === stateSlug && a.citySlug === citySlug && a.section === section);

export const articleBySlug = (stateSlug: string, citySlug: string, section: string, slug: string) =>
  ARTICLES.find((a) => a.stateSlug === stateSlug && a.citySlug === citySlug && a.section === section && a.slug === slug);
