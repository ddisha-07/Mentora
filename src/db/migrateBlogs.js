require('dotenv').config({ path: '.env.local' });
require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const sql = `
CREATE TABLE IF NOT EXISTS blogs (
    id VARCHAR(100) PRIMARY KEY,
    num VARCHAR(20),
    category VARCHAR(100) NOT NULL DEFAULT 'General',
    tab_label VARCHAR(100),
    sub_tab_label VARCHAR(100),
    tab_position VARCHAR(20) DEFAULT 'left',
    theme VARCHAR(50) DEFAULT 'dark-charcoal',
    primary_tab_color VARCHAR(50) DEFAULT '#EA580C',
    date VARCHAR(50),
    read_time VARCHAR(50),
    title TEXT NOT NULL,
    kicker TEXT,
    synopsis TEXT,
    tags JSONB NOT NULL DEFAULT '[]'::jsonb,
    takeaways JSONB NOT NULL DEFAULT '[]'::jsonb,
    full_body JSONB NOT NULL DEFAULT '[]'::jsonb,
    image_url TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'Published',
    author VARCHAR(255) DEFAULT 'Mentora Editorial',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS and public policies
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'blogs' AND policyname = 'Allow public read access on blogs'
  ) THEN
    CREATE POLICY "Allow public read access on blogs" ON blogs FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'blogs' AND policyname = 'Allow all access on blogs'
  ) THEN
    CREATE POLICY "Allow all access on blogs" ON blogs FOR ALL USING (true) WITH CHECK (true);
  END IF;
END
$$;
`;

async function main() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL database.');
    await client.query(sql);
    console.log('Successfully created blogs table in database!');

    const countRes = await client.query('SELECT count(*) FROM blogs;');
    console.log('Blogs count:', countRes.rows[0].count);
    await client.end();
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

main();
