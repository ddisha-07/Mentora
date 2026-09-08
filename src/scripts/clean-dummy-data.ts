import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function cleanDummyData() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('Connecting to database to remove all dummy data...');

    // Delete in order of foreign key dependency or with CASCADE
    const tables = [
      'leaderboard_points',
      'quiz_attempts',
      'module_progress',
      'modules',
      'journeys',
      'profiles',
      'users',
    ];

    for (const table of tables) {
      const res = await pool.query(`DELETE FROM "${table}"`);
      console.log(`Cleared ${res.rowCount} rows from "${table}"`);
    }

    console.log('\n--- VERIFYING TABLE COUNTS AFTER CLEANUP ---');
    const allTables = ['users', 'profiles', 'journeys', 'modules', 'module_progress', 'quizzes', 'quiz_attempts', 'leaderboard_points'];
    for (const t of allTables) {
      const countRes = await pool.query(`SELECT count(*) FROM "${t}"`);
      console.log(`Table "${t}": ${countRes.rows[0].count} rows`);
    }

    console.log('\nAll dummy data successfully removed from connected database!');
  } catch (err) {
    console.error('Error cleaning dummy data:', err);
  } finally {
    await pool.end();
  }
}

cleanDummyData();
