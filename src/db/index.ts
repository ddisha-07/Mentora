import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// Ensure DATABASE_URL is accessible
const connectionString = process.env.DATABASE_URL;

declare global {
  // eslint-disable-next-line no-var
  var __dbPool: Pool | undefined;
}

const pool =
  globalThis.__dbPool ??
  new Pool({
    connectionString: connectionString || undefined,
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.__dbPool = pool;
}

export const db = drizzle(pool, { schema });
export { schema };
export default db;
