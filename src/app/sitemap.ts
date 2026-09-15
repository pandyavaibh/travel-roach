import type { MetadataRoute } from 'next';
import { STATES } from '@/content/states';
import { CITIES } from '@/content/cities';
import { ARTICLES } from '@/content/articles';
import { ATTRACTIONS } from '@/content/places';
import { EVENTS } from '@/content/events';
import { PACKAGES } from '@/content/packages';
import { LISTINGS } from '@/content/listings';
import { CITY_SECTIONS, SITE } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const B = SITE.url;
  const urls: MetadataRoute.Sitemap = [
    { url: B, priority: 1 },
    ...['destinations','places','things-to-do','food-culture','search','about','contact','plan','list-your-business','write-for-us','privacy','terms']
      .map((p) => ({ url: `${B}/${p}`, priority: 0.7 })),
  ];
  for (const s of STATES) urls.push({ url: `${B}/${s.slug}`, priority: 0.9 });
  for (const c of CITIES) {
    urls.push({ url: `${B}/${c.stateSlug}/${c.slug}`, priority: 0.9 });
    for (const s of CITY_SECTIONS) urls.push({ url: `${B}/${c.stateSlug}/${c.slug}/${s.slug}`, priority: 0.7 });
  }
  for (const a of ARTICLES) urls.push({ url: `${B}/${a.stateSlug}/${a.citySlug}/${a.section}/${a.slug}`, priority: 0.6 });
  for (const a of ATTRACTIONS) urls.push({ url: `${B}/${a.stateSlug}/${a.citySlug}/attractions/${a.slug}`, priority: 0.6 });
  for (const e of EVENTS) urls.push({ url: `${B}/${e.stateSlug}/${e.citySlug}/festivals/${e.slug}`, priority: 0.5 });
  for (const p of PACKAGES) if (p.citySlug) urls.push({ url: `${B}/${p.stateSlug}/${p.citySlug}/itineraries/${p.slug}`, priority: 0.6 });
  for (const l of LISTINGS) urls.push({ url: `${B}/${l.stateSlug}/${l.citySlug}/${l.kind}/${l.slug}`, priority: 0.6 });
  return urls;
}
