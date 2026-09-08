import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function verifyDetails() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  try {
    // 1. Check RLS on all 29 tables
    const rlsRes = await pool.query(`
      SELECT relname, relrowsecurity 
      FROM pg_class 
      JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace 
      WHERE nspname = 'public' AND relkind = 'r'
      ORDER BY relname;
    `);
    console.log('--- RLS STATUS (All tables must have relrowsecurity = true) ---');
    let rlsAllEnabled = true;
    for (const r of rlsRes.rows) {
      if (!r.relrowsecurity) rlsAllEnabled = false;
      console.log(`[${r.relrowsecurity ? '✓' : '✗'}] ${r.relname}`);
    }
    console.log(`RLS fully enabled: ${rlsAllEnabled}`);

    // 2. Count total indexes
    const idxRes = await pool.query(`
      SELECT count(*) 
      FROM pg_indexes 
      WHERE schemaname = 'public';
    `);
    console.log(`\nTotal public indexes created: ${idxRes.rows[0].count}`);

    // 3. Check triggers
    const triggerRes = await pool.query(`
      SELECT trigger_name, event_object_table 
      FROM information_schema.triggers 
      WHERE trigger_schema = 'public'
      ORDER BY event_object_table;
    `);
    console.log('\n--- TRIGGERS ---');
    triggerRes.rows.forEach(t => console.log(`[✓] ${t.event_object_table}: ${t.trigger_name}`));

  } catch (err) {
    console.error('Error verifying:', err);
  } finally {
    await pool.end();
  }
}

verifyDetails();
