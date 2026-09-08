import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function inspectAll() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  const client = await pool.connect();
  const tables = ['users', 'profiles', 'journeys', 'modules', 'module_progress', 'quizzes', 'quiz_attempts', 'leaderboard_points'];
  
  for (const t of tables) {
    const res = await client.query(`SELECT count(*) FROM "${t}"`);
    console.log(`Table ${t}: ${res.rows[0].count} rows`);
    if (parseInt(res.rows[0].count) > 0 && parseInt(res.rows[0].count) <= 10) {
      const rows = await client.query(`SELECT * FROM "${t}" LIMIT 5`);
      console.log(`Sample from ${t}:`, rows.rows);
    }
  }

  client.release();
  await pool.end();
}

inspectAll().catch(console.error);
