import dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// Load .env.local first (Next.js convention), fallback to .env
dotenv.config({ path: '.env.local' });
dotenv.config();

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
});
