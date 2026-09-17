require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// 1. Initialize Firebase Admin
if (!getApps().length) {
  const serviceAccount = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  initializeApp({
    credential: cert(serviceAccount)
  });
}
const db = getFirestore();

// 2. Initialize Postgres connection using the Supabase connection string
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const migrateTable = async (tableName, collectionName) => {
  console.log(`Migrating ${tableName} to Firestore collection ${collectionName}...`);
  try {
    const { rows } = await pool.query(`SELECT * FROM ${tableName}`);
    if (rows.length === 0) {
      console.log(`No records found in ${tableName}.`);
      return;
    }
    
    // Batch write to Firestore (max 500 operations per batch)
    let batch = db.batch();
    let count = 0;
    let total = 0;
    
    for (const row of rows) {
      // Use 'id' or 'user_id' as the document ID
      const docId = row.id || row.user_id; 
      
      if (!docId) {
        console.warn(`Skipping row in ${tableName} with no valid ID.`);
        continue;
      }

      const docRef = db.collection(collectionName).doc(docId.toString());
      
      // Clean up the object to make it Firestore compatible 
      // (Remove nulls or undefined values if necessary)
      const data = { ...row };
      Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);

      batch.set(docRef, data);
      count++;
      total++;
      
      if (count === 500) {
        await batch.commit();
        console.log(`Committed 500 records to ${collectionName}...`);
        batch = db.batch();
        count = 0;
      }
    }
    
    // Commit any remaining records
    if (count > 0) {
      await batch.commit();
    }
    console.log(`Successfully migrated ${total} records to ${collectionName}.\n`);
  } catch (error) {
    console.error(`Error migrating ${tableName}:`, error.message);
  }
};

const run = async () => {
  if (!process.env.DATABASE_URL) {
    console.error("Missing DATABASE_URL in .env.local! Cannot connect to Supabase Postgres.");
    process.exit(1);
  }

  console.log("Starting Live Database Migration to Firebase...\n");

  // Define mapping of Postgres tables to Firestore collections
  const tablesToMigrate = [
    { pg: 'users', fs: 'users' },
    { pg: 'skills', fs: 'skills' },
    { pg: 'user_skills', fs: 'user_skills' },
    { pg: 'courses', fs: 'courses' },
    { pg: 'course_modules', fs: 'modules' },
    { pg: 'lessons', fs: 'lessons' },
    { pg: 'user_courses', fs: 'user_courses' },
    { pg: 'lesson_progress', fs: 'lesson_progress' },
    { pg: 'quizzes', fs: 'quizzes' },
    { pg: 'quiz_questions', fs: 'quiz_questions' },
    { pg: 'quiz_options', fs: 'quiz_options' },
    { pg: 'quiz_attempts', fs: 'quiz_attempts' },
    { pg: 'user_answers', fs: 'user_answers' },
    { pg: 'recommendations', fs: 'recommendations' },
    { pg: 'daily_tasks', fs: 'daily_tasks' },
    { pg: 'user_tasks', fs: 'user_tasks' },
    { pg: 'xps', fs: 'xps' },
    { pg: 'achievements', fs: 'achievements' },
    { pg: 'user_achievements', fs: 'user_achievements' }
  ];

  for (const { pg, fs } of tablesToMigrate) {
    await migrateTable(pg, fs);
  }

  console.log('Migration completed successfully!');
  process.exit(0);
};

run();
