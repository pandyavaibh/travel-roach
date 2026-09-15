import { CITIES } from './cities';
import { STATES } from './states';
import { slugify } from './articles';

function hash(s: string) { let h = 2166136261; for (let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);} return Math.abs(h); }
const num = (s: string, a: number, b: number) => a + (hash(s) % (b - a + 1));

export type Pkg = {
  slug: string; stateSlug: string; citySlug: string | null; name: string; days: number;
  route: string; note: string; inclusions: string[]; priceFrom: number; sellers: number;
  dayPlan: { day: number; title: string; detail: string }[];
};

const CITY_TPL: [days: number, name: (c: string) => string, route: string, note: string, incl: string[]][] = [
  [1, (c) => `One day in ${c}`, '6 stops · walking + rickshaw', 'The compressed version, arranged so nothing doubles back.', ['Guide','Entry fees']],
  [2, (c) => `${c} in two days`, '9 stops · car + guide', 'Adds the sites just outside the centre that need a vehicle.', ['Car','Guide','Entry fees']],
  [3, (c) => `${c} heritage weekend`, '11 stops · car + guide', 'Two mornings of walks and one full day out of town.', ['2 nights','Breakfast','Car']],
  [2, (c) => `${c} with children`, '7 stops · car', 'Shorter distances, more shade, and stops that hold attention.', ['Car','Entry fees']],
  [4, (c) => `${c} and around`, 'City plus three day trips', 'Uses the city as a base rather than moving hotels every night.', ['3 nights','Car','Guide']],
  [5, (c) => `Slow ${c}`, 'One base · no daily packing', 'For people who would rather see less and understand more.', ['4 nights','Breakfast','2 guided days']],
];

const STATE_TPL: [days: number, suffix: string, note: string][] = [
  [7, 'in seven days', 'The full loop with a driver, all permits, and guided days at the two sites that need one.'],
  [10, 'end to end', 'North to south without backtracking, moving every second or third day.'],
  [5, 'highlights', 'Three bases, two long drives, no repeated hotels.'],
  [14, 'in depth', 'For a second visit, or a first one with time. Includes the districts most tours skip.'],
];

export const PACKAGES: Pkg[] = [
  ...CITIES.flatMap((city) =>
    CITY_TPL.map(([days, nameFn, route, note, inclusions], i) => {
      const name = nameFn(city.name);
      const seed = city.slug + 'pkg' + i;
      return {
        slug: slugify(name), stateSlug: city.stateSlug, citySlug: city.slug, name, days, route, note, inclusions,
        priceFrom: num(seed, 18, 90) * 100 * days,
        sellers: num(seed, 3, 12),
        dayPlan: Array.from({ length: days }, (_, d) => ({
          day: d + 1,
          title: d === 0 ? 'Arrive and walk the old quarter' : d === days - 1 ? 'Morning at leisure, depart' : `Day ${d + 1}: sites and a long lunch`,
          detail: d === 0
            ? `Land, drop bags and walk. The first evening is deliberately unstructured — ${city.name} is easier to read on foot before you start ticking things off.`
            : `Two or three stops in the morning while it is cool, a proper lunch, then one indoor site in the afternoon heat. Evenings are yours.`,
        })),
      };
    }),
  ),
  ...STATES.flatMap((state) =>
    STATE_TPL.map(([days, suffix, note], i) => {
      const name = `${state.name} ${suffix}`;
      const seed = state.slug + 'spkg' + i;
      return {
        slug: slugify(name), stateSlug: state.slug, citySlug: null, name, days,
        route: state.tagline, note, inclusions: [`${days - 1} nights`, 'Driver', 'Permits'],
        priceFrom: num(seed, 45, 110) * 100 * Math.ceil(days / 2),
        sellers: num(seed, 4, 14),
        dayPlan: Array.from({ length: days }, (_, d) => ({
          day: d + 1,
          title: d === 0 ? 'Arrive and acclimatise' : `Day ${d + 1}`,
          detail: 'Travel in the morning while the roads are clear, arrive in time to see something before dark.',
        })),
      };
    }),
  ),
];

export const packagesFor = (stateSlug: string, citySlug: string) =>
  PACKAGES.filter((p) => p.stateSlug === stateSlug && p.citySlug === citySlug).sort((a, b) => a.days - b.days);
export const packagesForState = (stateSlug: string) =>
  PACKAGES.filter((p) => p.stateSlug === stateSlug && !p.citySlug).sort((a, b) => a.days - b.days);
export const packageBySlug = (slug: string) => PACKAGES.find((p) => p.slug === slug);
