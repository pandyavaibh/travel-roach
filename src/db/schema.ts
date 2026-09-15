import {
  pgTable, pgEnum, serial, integer, varchar, text, boolean,
  timestamp, numeric, jsonb, index, uniqueIndex,
} from 'drizzle-orm/pg-core';

/* ============ Enums ============ */

export const roleEnum = pgEnum('role', ['admin', 'editor', 'owner', 'traveller']);
export const kindEnum = pgEnum('place_kind', ['State', 'UT']);
export const regionEnum = pgEnum('region', ['North', 'West', 'South', 'East', 'North-East', 'Central']);
export const sectionEnum = pgEnum('section', ['things-to-do', 'food', 'how-to-reach', 'nearby']);
export const statusEnum = pgEnum('status', ['draft', 'published']);
export const listingKindEnum = pgEnum('listing_kind', ['travel-agents', 'hotels', 'restaurants']);
export const mediaOwnerEnum = pgEnum('media_owner', ['library', 'listing', 'review', 'post']);
export const claimStatusEnum = pgEnum('claim_status', ['pending', 'approved', 'rejected']);
export const claimMethodEnum = pgEnum('claim_method', ['domain-match', 'manual']);
export const reviewStatusEnum = pgEnum('review_status', ['published', 'hidden', 'reported']);
export const enquiryStatusEnum = pgEnum('enquiry_status', ['new', 'read', 'replied', 'spam']);

export const ROLES = ['admin', 'editor', 'owner', 'traveller'] as const;
export const SECTIONS = ['things-to-do', 'food', 'how-to-reach', 'nearby'] as const;
export const KINDS = ['travel-agents', 'hotels', 'restaurants'] as const;

/* ============ Accounts ============ */

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 200 }).notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 160 }).notNull(),
  role: roleEnum('role').notNull().default('traveller'),
  emailVerified: boolean('email_verified').default(false),
  verifyToken: varchar('verify_token', { length: 120 }),
  resetToken: varchar('reset_token', { length: 120 }),
  resetExpires: timestamp('reset_expires', { withTimezone: true }),
  avatarId: integer('avatar_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
}, (t) => [
  uniqueIndex('users_email').on(t.email),
  index('users_role').on(t.role),
]);

export const sessions = pgTable('sessions', {
  id: varchar('id', { length: 64 }).primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (t) => [index('sessions_user').on(t.userId)]);

/* ============ Media ============ */

export const media = pgTable('media', {
  id: serial('id').primaryKey(),
  filename: varchar('filename', { length: 255 }).notNull(),
  path: varchar('path', { length: 400 }).notNull(),
  thumbPath: varchar('thumb_path', { length: 400 }),
  mime: varchar('mime', { length: 80 }).notNull(),
  width: integer('width'),
  height: integer('height'),
  bytes: integer('bytes').notNull(),
  alt: varchar('alt', { length: 300 }),
  credit: varchar('credit', { length: 200 }),
  uploadedBy: integer('uploaded_by').notNull(),
  ownerKind: mediaOwnerEnum('owner_kind').default('library'),
  ownerId: integer('owner_id'),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (t) => [
  index('media_owner').on(t.ownerKind, t.ownerId),
  index('media_uploader').on(t.uploadedBy),
]);

/* ============ Geography ============ */

export const states = pgTable('states', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 120 }).notNull(),
  name: varchar('name', { length: 160 }).notNull(),
  kind: kindEnum('kind').notNull(),
  region: regionEnum('region').notNull(),
  tagline: varchar('tagline', { length: 255 }),
  intro: text('intro'),
  quote: varchar('quote', { length: 500 }),
  quoteBy: varchar('quote_by', { length: 160 }),
  bestSeason: varchar('best_season', { length: 80 }),
  daysNeeded: varchar('days_needed', { length: 40 }),
  dailyBudget: varchar('daily_budget', { length: 40 }),
  airports: varchar('airports', { length: 255 }),
  heroMediaId: integer('hero_media_id'),
  published: boolean('published').default(true),
}, (t) => [uniqueIndex('states_slug').on(t.slug)]);

export const cities = pgTable('cities', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 120 }).notNull(),
  stateId: integer('state_id').notNull().references(() => states.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 160 }).notNull(),
  tagline: varchar('tagline', { length: 255 }),
  intro: text('intro'),
  bestSeason: varchar('best_season', { length: 80 }),
  daysNeeded: varchar('days_needed', { length: 40 }),
  dailyBudget: varchar('daily_budget', { length: 40 }),
  nearestAirport: varchar('nearest_airport', { length: 120 }),
  heroMediaId: integer('hero_media_id'),
  published: boolean('published').default(false),
}, (t) => [
  uniqueIndex('cities_slug').on(t.stateId, t.slug),
  index('cities_published').on(t.published),
]);

/* ============ Editorial ============ */

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 200 }).notNull(),
  cityId: integer('city_id').references(() => cities.id, { onDelete: 'cascade' }),
  stateId: integer('state_id'),
  section: sectionEnum('section').notNull(),
  kicker: varchar('kicker', { length: 80 }),
  title: varchar('title', { length: 255 }).notNull(),
  dek: varchar('dek', { length: 500 }),
  bodyHtml: text('body_html'),
  takeaways: jsonb('takeaways').$type<string[]>(),
  heroMediaId: integer('hero_media_id'),
  authorId: integer('author_id'),
  readingMinutes: integer('reading_minutes').default(5),
  featured: boolean('featured').default(false),
  status: statusEnum('status').default('draft'),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (t) => [
  uniqueIndex('posts_slug').on(t.slug),
  index('posts_list').on(t.cityId, t.section, t.status, t.publishedAt),
]);

export const attractions = pgTable('attractions', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 200 }).notNull(),
  cityId: integer('city_id').notNull().references(() => cities.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 200 }).notNull(),
  category: varchar('category', { length: 80 }),
  summary: varchar('summary', { length: 500 }),
  historyHtml: text('history_html'),
  tips: jsonb('tips').$type<string[]>(),
  heroMediaId: integer('hero_media_id'),
  timings: varchar('timings', { length: 160 }),
  entryFee: varchar('entry_fee', { length: 120 }),
  timeNeeded: varchar('time_needed', { length: 80 }),
  bestTime: varchar('best_time', { length: 120 }),
  closedOn: varchar('closed_on', { length: 120 }),
  photography: varchar('photography', { length: 160 }),
  nearestStation: varchar('nearest_station', { length: 160 }),
  accessibility: varchar('accessibility', { length: 160 }),
  lat: numeric('lat', { precision: 10, scale: 7 }),
  lng: numeric('lng', { precision: 10, scale: 7 }),
  // "rank" is a reserved window function in Postgres — named sortRank to avoid quoting.
  sortRank: integer('sort_rank').default(99),
  status: statusEnum('status').default('draft'),
}, (t) => [
  uniqueIndex('attractions_slug').on(t.slug),
  index('attractions_city').on(t.cityId, t.sortRank),
]);

export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 200 }).notNull(),
  cityId: integer('city_id').notNull().references(() => cities.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 200 }).notNull(),
  startsOn: varchar('starts_on', { length: 20 }).notNull(),
  endsOn: varchar('ends_on', { length: 20 }),
  venue: varchar('venue', { length: 200 }),
  season: varchar('season', { length: 40 }),
  ticketed: boolean('ticketed').default(false),
  priceFrom: varchar('price_from', { length: 60 }),
  bookAhead: varchar('book_ahead', { length: 120 }),
  note: text('note'),
  heroMediaId: integer('hero_media_id'),
  status: statusEnum('status').default('draft'),
}, (t) => [
  uniqueIndex('events_slug').on(t.slug),
  index('events_city').on(t.cityId, t.startsOn),
]);

export const packages = pgTable('packages', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 200 }).notNull(),
  cityId: integer('city_id').references(() => cities.id, { onDelete: 'cascade' }),
  stateId: integer('state_id'),
  listingId: integer('listing_id'),
  name: varchar('name', { length: 200 }).notNull(),
  days: integer('days').notNull(),
  route: varchar('route', { length: 255 }),
  note: text('note'),
  inclusions: jsonb('inclusions').$type<string[]>(),
  dayPlan: jsonb('day_plan').$type<{ day: number; title: string; detail: string }[]>(),
  priceFrom: integer('price_from'),
  heroMediaId: integer('hero_media_id'),
  status: statusEnum('status').default('draft'),
  sortOrder: integer('sort_order').default(0),
}, (t) => [
  uniqueIndex('packages_slug').on(t.slug),
  index('packages_city').on(t.cityId, t.days),
]);

/* ============ Directory ============ */

export const listings = pgTable('listings', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 200 }).notNull(),
  cityId: integer('city_id').notNull().references(() => cities.id, { onDelete: 'cascade' }),
  kind: listingKindEnum('kind').notNull(),
  name: varchar('name', { length: 200 }).notNull(),
  meta: varchar('meta', { length: 255 }),
  blurb: varchar('blurb', { length: 600 }),
  aboutHtml: text('about_html'),
  heroMediaId: integer('hero_media_id'),

  verified: boolean('verified').default(false),
  verifiedAt: timestamp('verified_at', { withTimezone: true }),
  registration: varchar('registration', { length: 200 }),
  established: integer('established'),

  area: varchar('area', { length: 120 }),
  address: varchar('address', { length: 300 }),
  hours: varchar('hours', { length: 160 }),
  phone: varchar('phone', { length: 40 }),
  whatsapp: varchar('whatsapp', { length: 40 }),
  email: varchar('email', { length: 200 }),
  website: varchar('website', { length: 300 }),
  lat: numeric('lat', { precision: 10, scale: 7 }),
  lng: numeric('lng', { precision: 10, scale: 7 }),

  priceFrom: integer('price_from'),
  tags: jsonb('tags').$type<string[]>(),
  details: jsonb('details').$type<[string, string][]>(),

  ratingCached: numeric('rating_cached', { precision: 2, scale: 1 }).default('0.0'),
  reviewCountCached: integer('review_count_cached').default(0),
  viewsThisMonth: integer('views_this_month').default(0),

  ownerId: integer('owner_id').references(() => users.id, { onDelete: 'set null' }),
  status: statusEnum('status').default('draft'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (t) => [
  uniqueIndex('listings_slug').on(t.slug),
  index('listings_browse').on(t.cityId, t.kind, t.status, t.ratingCached),
  index('listings_owner').on(t.ownerId),
]);

export const listingRows = pgTable('listing_rows', {
  id: serial('id').primaryKey(),
  listingId: integer('listing_id').notNull().references(() => listings.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 200 }).notNull(),
  meta: varchar('meta', { length: 200 }),
  note: text('note'),
  price: varchar('price', { length: 60 }),
  mediaId: integer('media_id'),
  sortOrder: integer('sort_order').default(0),
}, (t) => [index('rows_listing').on(t.listingId, t.sortOrder)]);

export const claims = pgTable('claims', {
  id: serial('id').primaryKey(),
  listingId: integer('listing_id').notNull().references(() => listings.id, { onDelete: 'cascade' }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  status: claimStatusEnum('status').default('pending'),
  method: claimMethodEnum('method').default('manual'),
  evidence: text('evidence'),
  reviewedBy: integer('reviewed_by'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
}, (t) => [
  index('claims_listing').on(t.listingId),
  index('claims_status').on(t.status),
]);

/* ============ Reviews & enquiries ============ */

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey(),
  listingId: integer('listing_id').notNull().references(() => listings.id, { onDelete: 'cascade' }),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull(),
  body: text('body'),
  tripLabel: varchar('trip_label', { length: 200 }),
  verifiedBooking: boolean('verified_booking').default(false),
  ownerReply: text('owner_reply'),
  ownerRepliedAt: timestamp('owner_replied_at', { withTimezone: true }),
  status: reviewStatusEnum('status').default('published'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (t) => [
  index('reviews_listing').on(t.listingId, t.status),
  uniqueIndex('reviews_one_per_user').on(t.listingId, t.userId),
]);

export const enquiries = pgTable('enquiries', {
  id: serial('id').primaryKey(),
  listingId: integer('listing_id').references(() => listings.id, { onDelete: 'set null' }),
  packageId: integer('package_id'),
  userId: integer('user_id'),
  name: varchar('name', { length: 160 }).notNull(),
  email: varchar('email', { length: 200 }).notNull(),
  phone: varchar('phone', { length: 40 }),
  travelDates: varchar('travel_dates', { length: 120 }),
  message: text('message'),
  status: enquiryStatusEnum('status').default('new'),
  sourcePage: varchar('source_page', { length: 300 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (t) => [
  index('enquiries_listing').on(t.listingId, t.createdAt),
  index('enquiries_email').on(t.email),
]);

/* ============ Analytics ============ */

export const pageViews = pgTable('page_views', {
  id: serial('id').primaryKey(),
  path: varchar('path', { length: 300 }).notNull(),
  day: varchar('day', { length: 10 }).notNull(),
  hits: integer('hits').default(1),
  listingId: integer('listing_id'),
}, (t) => [
  uniqueIndex('views_path_day').on(t.path, t.day),
  index('views_day').on(t.day),
]);
