import { initializeApp, getApps, getApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import type { FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Safe client-side app initialization that won't crash during SSR / build prerendering
function getClientApp(): FirebaseApp {
  if (getApps().length > 0) {
    return getApp();
  }

  // If apiKey is missing (e.g. during build-time static generation or CI without env vars),
  // provide a fallback configuration to prevent compilation/prerendering crashes
  const effectiveConfig = firebaseConfig.apiKey
    ? firebaseConfig
    : {
        apiKey: 'dummy-api-key-for-build',
        authDomain: 'dummy.firebaseapp.com',
        projectId: 'dummy-project',
        storageBucket: 'dummy.appspot.com',
        messagingSenderId: '000000000000',
        appId: '1:000000000000:web:0000000000000000',
      };

  return initializeApp(effectiveConfig);
}

const app: FirebaseApp = getClientApp();
const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

export { app, auth, db, storage };
