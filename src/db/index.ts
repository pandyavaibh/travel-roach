import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Copy .env.example to .env and fill it in.');
}

const g = globalThis as unknown as { _sql?: ReturnType<typeof postgres> };

/**
 * One pool per process. Neon and Supabase both sit behind a pooler, so keep the
 * client count low and let the pooler do the multiplexing.
 */
const client = g._sql ?? postgres(process.env.DATABASE_URL, {
  max: 8,
  idle_timeout: 20,
  connect_timeout: 10,
  prepare: false, // required when connecting through a transaction-mode pooler
});

if (process.env.NODE_ENV !== 'production') g._sql = client;

export const db = drizzle(client, { schema });
export { client as sql };
export * from './schema';
