import { CITIES } from './cities';
import { slugify } from './articles';

function hash(s: string) { let h = 2166136261; for (let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);} return Math.abs(h); }
const num = (s: string, a: number, b: number) => a + (hash(s) % (b - a + 1));

export type Event = {
  slug: string; stateSlug: string; citySlug: string; name: string;
  startsOn: string; endsOn: string | null; venue: string; ticketed: boolean;
  priceFrom: string | null; note: string; bookAhead: string | null; season: string;
};

const TEMPLATES: [name: string, month: number, day: number, days: number, ticketed: boolean, note: string, season: string][] = [
  ['Makar Sankranti', 0, 14, 2, false, 'Kites, rooftops and two days where the whole city looks upward.', 'Winter'],
  ['Republic Day parade', 0, 26, 1, false, 'Civic parade through the centre, roads closed from early morning.', 'Winter'],
  ['Classical music festival', 1, 8, 3, true, 'Three evenings of Hindustani and Carnatic recitals in a heritage venue.', 'Winter'],
  ['Heritage Week walks', 1, 18, 7, true, 'Guided walks on routes that stay closed the rest of the year.', 'Winter'],
  ['Holi', 2, 14, 2, false, 'Colour through the old town, quieter by mid-afternoon.', 'Spring'],
  ['Summer craft mela', 3, 12, 5, false, 'Weavers, potters and block printers from across the district.', 'Spring'],
  ['Monsoon food festival', 6, 20, 4, true, 'Seasonal cooking that only appears for six weeks a year.', 'Monsoon'],
  ['Independence Day', 7, 15, 1, false, 'Flag hoisting at the civic centre, followed by street food stalls.', 'Monsoon'],
  ['Navratri', 8, 22, 9, true, 'Nine consecutive nights of dancing, starting late and running until dawn.', 'Autumn'],
  ['Dussehra', 9, 2, 1, false, 'Effigies burned at dusk on the main grounds.', 'Autumn'],
  ['Diwali', 10, 8, 5, false, 'Lamps, markets and most shops shut for two of the five days.', 'Autumn'],
  ['Winter carnival', 11, 25, 7, false, 'A week of performances and food stalls, very busy after six.', 'Winter'],
];

export const EVENTS: Event[] = CITIES.flatMap((city) =>
  TEMPLATES.map(([name, month, day, days, ticketed, note, season], i) => {
    const seed = city.slug + 'ev' + i;
    const year = month < 2 ? 2027 : 2026;
    const start = new Date(Date.UTC(year, month, day));
    const end = days > 1 ? new Date(Date.UTC(year, month, day + days - 1)) : null;
    return {
      slug: slugify(city.name + '-' + name),
      stateSlug: city.stateSlug, citySlug: city.slug,
      name: name === 'Navratri' || name === 'Holi' || name === 'Diwali' ? name + ' in ' + city.name : name,
      startsOn: start.toISOString().slice(0, 10),
      endsOn: end ? end.toISOString().slice(0, 10) : null,
      venue: [city.name + ' old town', city.name + ' civic grounds', 'Central maidan, ' + city.name, city.name + ' riverfront'][hash(seed) % 4],
      ticketed, priceFrom: ticketed ? '₹' + num(seed, 2, 25) * 100 : null,
      note, season,
      bookAhead: ticketed ? 'Book ' + num(seed, 2, 12) + ' weeks ahead' : null,
    };
  }),
);

export const eventsFor = (stateSlug: string, citySlug: string) =>
  EVENTS.filter((e) => e.stateSlug === stateSlug && e.citySlug === citySlug);
export const eventsForState = (stateSlug: string) =>
  EVENTS.filter((e) => e.stateSlug === stateSlug).sort((a, b) => a.startsOn.localeCompare(b.startsOn));
export const eventBySlug = (stateSlug: string, citySlug: string, slug: string) =>
  EVENTS.find((e) => e.stateSlug === stateSlug && e.citySlug === citySlug && e.slug === slug);
