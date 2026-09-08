import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function applySchema() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    const migrationPath = path.join(__dirname, '../../supabase/migrations/20260909000001_mentora_backend_schema.sql');
    console.log('Reading migration file:', migrationPath);
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('Executing Mentora 29-table schema migration on connected Supabase database...');
    await pool.query(sql);
    console.log('✅ Migration executed successfully!');

    // Verify all 29 tables
    const expectedTables = [
      'users',
      'skills',
      'user_skills',
      'courses',
      'course_modules',
      'lessons',
      'user_courses',
      'lesson_progress',
      'schedule_events',
      'communities',
      'community_members',
      'daily_tasks',
      'user_tasks',
      'xps',
      'achievements',
      'user_achievements',
      'media',
      'lesson_resources',
      'quizzes',
      'quiz_questions',
      'quiz_options',
      'quiz_attempts',
      'user_answers',
      'recommendations',
      'chat_conversations',
      'chat_messages',
      'notifications',
      'user_streaks',
      'learning_events',
    ];

    const res = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    const existing = res.rows.map((r) => r.table_name);
    console.log('\n--- VERIFICATION OF CREATED TABLES ---');
    console.log(`Total public tables found: ${existing.length}`);
    
    let allFound = true;
    for (const t of expectedTables) {
      const found = existing.includes(t);
      console.log(`[${found ? '✓' : '✗'}] ${t}`);
      if (!found) allFound = false;
    }

    if (allFound) {
      console.log('\n🎉 ALL 29 TABLES VERIFIED AND CREATED SUCCESSFULLY!');
    } else {
      console.error('\n⚠️ Some expected tables are missing!');
    }

    // Verify views
    const viewRes = await pool.query(`
      SELECT table_name 
      FROM information_schema.views 
      WHERE table_schema = 'public';
    `);
    console.log('\n--- VERIFICATION OF CREATED VIEWS ---');
    viewRes.rows.forEach(r => console.log(`[✓] View: ${r.table_name}`));

    // Test dashboard metrics RPC function
    console.log('\n--- TESTING RPC FUNCTION get_user_dashboard_metrics ---');
    const testId = '00000000-0000-0000-0000-000000000001';
    const funcRes = await pool.query(`SELECT get_user_dashboard_metrics($1) AS metrics`, [testId]);
    console.log('Result for dummy test UUID:', funcRes.rows[0].metrics);

  } catch (err: any) {
    console.error('❌ Migration failed:', err);
  } finally {
    await pool.end();
  }
}

applySchema();
