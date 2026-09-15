import { CITIES } from './cities';
import { slugify } from './articles';

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h);
}
const num = (seed: string, min: number, max: number) => min + (hash(seed) % (max - min + 1));
const pick = <T,>(a: T[], seed: string) => a[hash(seed) % a.length];

export type Attraction = {
  slug: string; stateSlug: string; citySlug: string; name: string; category: string;
  summary: string; rank: number;
  timings: string; entryFee: string; timeNeeded: string; bestTime: string;
  closedOn: string; photography: string; nearestStation: string; accessibility: string;
  history: string[]; tips: string[]; lat: number; lng: number;
};

const KINDS = [
  ['Fort', 'Ramparts, palaces and a view over the whole city from the top.'],
  ['Temple', 'A working temple with daily aarti, open to visitors outside prayer hours.'],
  ['Stepwell', 'Descending storeys of carved stone, ten degrees cooler at the bottom.'],
  ['Museum', 'The state collection, strongest on textiles, bronzes and miniature painting.'],
  ['Old quarter', 'Wooden houses, narrow lanes and courtyards that open off the street.'],
  ['Lake', 'A promenade, boats in the morning and the best sunset in the city.'],
  ['Mosque', 'Carved stone screens and a courtyard that stays quiet through the afternoon.'],
  ['Garden', 'Formal planting, water channels and shade that makes midday survivable.'],
  ['Gallery', 'Contemporary work from the region, in a restored building worth seeing alone.'],
  ['Market', 'Six hundred stalls, busiest before ten and after six.'],
  ['Riverfront', 'A built promenade with steps to the water and space to walk.'],
  ['Monument', 'A protected site under the ASI, with a ticket counter and a small museum.'],
];

const FEES = ['Free','₹25 Indian / ₹300 foreign','₹40 Indian / ₹500 foreign','₹50','₹20','₹35 Indian / ₹400 foreign','Free, ₹25 camera'];
const HOURS = ['06:00 – 18:00','09:00 – 17:30','08:00 – 20:00','10:00 – 18:00, closed 13:00 – 14:00','Sunrise to sunset','05:30 – 12:00, 16:00 – 21:00'];
const CLOSED = ['Open daily','Closed Mondays','Closed Fridays','Closed on public holidays','Open daily, restricted during festivals'];
const PHOTO = ['Allowed, no tripod','Allowed, ₹25 camera fee','No photography inside','Allowed outside only','Allowed, no flash'];
const ACCESS = ['Step-free at the main entrance','Steps throughout, no ramp','Partial ramp access','Wheelchair accessible, staff assistance available','Uneven stone, difficult underfoot'];

export const ATTRACTIONS: Attraction[] = (() => {
  const out: Attraction[] = [];
  for (const city of CITIES) {
    const n = 8;
    for (let i = 0; i < n; i++) {
      const [kind, summary] = KINDS[i % KINDS.length];
      const name = kind === 'Old quarter' ? `${city.name} old quarter`
        : kind === 'Riverfront' ? `${city.name} riverfront`
        : kind === 'Market' ? `${city.name} central market`
        : `${city.name} ${kind}`;
      const seed = city.slug + 'attr' + i;
      out.push({
        slug: slugify(name), stateSlug: city.stateSlug, citySlug: city.slug,
        name, category: kind, summary, rank: i + 1,
        timings: pick(HOURS, seed), entryFee: pick(FEES, seed + 'f'),
        timeNeeded: num(seed, 1, 3) + ' – ' + (num(seed, 1, 3) + 1) + ' hours',
        bestTime: pick(['Early morning','Late afternoon','Sunset','Just after opening','Weekday mornings'], seed + 'b'),
        closedOn: pick(CLOSED, seed + 'c'), photography: pick(PHOTO, seed + 'p'),
        nearestStation: city.name + ' Junction, ' + num(seed, 1, 9) + ' km',
        accessibility: pick(ACCESS, seed + 'a'),
        history: [
          `Built in stages between the fourteenth and eighteenth centuries, the site reflects three separate periods of patronage and at least two of neglect. What survives is largely the work of the middle period, when the city was at its wealthiest.`,
          `It was brought under protection in the twentieth century, and restoration since has been conservative — consolidating what stood rather than rebuilding what had gone. That is why some sections are open to the sky.`,
        ],
        tips: [
          'Arrive within the first hour of opening; the light is better and the ticket queue has not formed.',
          'Guides wait at the gate. Agree the fee and the duration before you start walking.',
          'There is no reliable food inside. Eat before, or plan the visit around a meal nearby.',
        ],
        lat: 20 + (hash(seed) % 1200) / 100, lng: 72 + (hash(seed + 'x') % 1500) / 100,
      });
    }
  }
  return out;
})();

export const attractionsFor = (stateSlug: string, citySlug: string) =>
  ATTRACTIONS.filter((a) => a.stateSlug === stateSlug && a.citySlug === citySlug);
export const attractionBySlug = (stateSlug: string, citySlug: string, slug: string) =>
  ATTRACTIONS.find((a) => a.stateSlug === stateSlug && a.citySlug === citySlug && a.slug === slug);
