require('dotenv').config({ path: '.env.local' });
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

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

async function checkStatus() {
  console.log('Connecting to Firebase Project:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  
  try {
    const collections = await db.listCollections();
    console.log(`\nFound ${collections.length} total collections in Firestore:`);
    
    if (collections.length === 0) {
      console.log('=> NO COLLECTIONS EXIST IN FIRESTORE!');
    }

    for (const col of collections) {
      const snap = await col.get();
      console.log(` - Collection '${col.id}': ${snap.size} document(s)`);
      if (snap.size > 0 && snap.size <= 5) {
        snap.forEach(doc => {
          console.log(`    doc id: ${doc.id}`);
        });
      } else if (snap.size > 5) {
        console.log(`    (first 3 IDs: ${snap.docs.slice(0, 3).map(d => d.id).join(', ')}...)`);
      }
    }

    const expectedCollections = [
      'blogs',
      'quizzes',
      'users',
      'courses',
      'modules',
      'lessons',
      'skills',
      'user_skills',
      'user_courses',
      'lesson_progress',
      'communities',
      'daily_tasks',
      'xps',
      'user_streaks',
      'achievements'
    ];

    console.log('\n--- Status of Expected Application Collections ---');
    const existingIds = collections.map(c => c.id);
    for (const name of expectedCollections) {
      const exists = existingIds.includes(name);
      console.log(` - ${name.padEnd(16)}: ${exists ? 'EXISTS' : 'MISSING / NOT UPDATED'}`);
    }

  } catch (err) {
    console.error('Error connecting or querying Firestore:', err);
  }
  process.exit(0);
}

checkStatus();
