import type { App, ServiceAccount } from 'firebase-admin/app';
import type { Auth } from 'firebase-admin/auth';
import type { Firestore } from 'firebase-admin/firestore';
import type { Storage } from 'firebase-admin/storage';

function cleanPrivateKey(key: string | undefined): string | undefined {
  if (!key) return undefined;
  let cleaned = key.trim();
  // Strip surrounding quotes if present (e.g. from copy-pasting from .env file into Vercel)
  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  return cleaned.replace(/\\n/g, '\n');
}

function cleanEnvString(val: string | undefined): string | undefined {
  if (!val) return undefined;
  let cleaned = val.trim();
  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1).trim();
  }
  return cleaned;
}

function getServiceAccount(): ServiceAccount | null {
  try {
    // 1. Check if FIREBASE_SERVICE_ACCOUNT_KEY environment variable exists
    const serviceAccountKey = cleanEnvString(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    if (serviceAccountKey) {
      try {
        const trimmed = serviceAccountKey.trim();
        let parsed: any;
        if (trimmed.startsWith('{')) {
          parsed = JSON.parse(trimmed);
        } else {
          // Handle base64 encoded service account key if supplied
          const decoded = Buffer.from(trimmed, 'base64').toString('utf-8');
          parsed = JSON.parse(decoded);
        }

        if (parsed && typeof parsed === 'object') {
          if (typeof parsed.private_key === 'string') {
            parsed.private_key = cleanPrivateKey(parsed.private_key);
          }
          return parsed as ServiceAccount;
        }
      } catch (error) {
        console.error('Firebase Admin: Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY:', error);
      }
    }

    // 2. Fallback to individual environment variables
    const clientEmail = cleanEnvString(process.env.FIREBASE_CLIENT_EMAIL);
    const privateKey = cleanPrivateKey(process.env.FIREBASE_PRIVATE_KEY);

    // Auto-extract projectId from clientEmail if not explicitly provided
    let projectId =
      cleanEnvString(process.env.FIREBASE_PROJECT_ID) ||
      cleanEnvString(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);

    if (!projectId && clientEmail && clientEmail.includes('@')) {
      const domainPart = clientEmail.split('@')[1];
      if (domainPart && domainPart.includes('.')) {
        projectId = domainPart.split('.')[0];
      }
    }

    if (projectId && clientEmail && privateKey) {
      return {
        projectId,
        clientEmail,
        privateKey,
      } as ServiceAccount;
    }

    return null;
  } catch (error) {
    console.error('Firebase Admin: Error determining service account credentials:', error);
    return null;
  }
}

/**
 * Safely require firebase-admin modules without crashing the Node.js serverless process
 * if the package or any transitive dependency is missing or incompatible in the deployment environment.
 */
function getFirebaseAdminModules(): {
  getApps: () => App[];
  initializeApp: (options: any) => App;
  cert: (sa: any) => any;
  getAuth: (app: App) => Auth;
  getFirestore: (app: App) => Firestore;
  getStorage: (app: App) => Storage;
  FieldValue?: any;
} | null {
  try {
    // Dynamic require so Next.js bundling does not fail at module evaluation time
    const appModule = require('firebase-admin/app');
    const authModule = require('firebase-admin/auth');
    const firestoreModule = require('firebase-admin/firestore');
    const storageModule = require('firebase-admin/storage');
    return {
      getApps: appModule.getApps,
      initializeApp: appModule.initializeApp,
      cert: appModule.cert,
      getAuth: authModule.getAuth,
      getFirestore: firestoreModule.getFirestore,
      getStorage: storageModule.getStorage,
      FieldValue: firestoreModule.FieldValue,
    };
  } catch (error) {
    console.warn('Firebase Admin modules not available in current runtime:', error);
    return null;
  }
}

function getFirebaseAdminApp(): App | null {
  try {
    const mods = getFirebaseAdminModules();
    if (!mods) return null;

    if (mods.getApps().length > 0) {
      return mods.getApps()[0];
    }

    const credentials = getServiceAccount();
    if (!credentials) {
      return null;
    }

    const projectId =
      (credentials as any).projectId ||
      (credentials as any).project_id ||
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    return mods.initializeApp({
      credential: mods.cert(credentials),
      databaseURL: projectId ? `https://${projectId}.firebaseio.com` : undefined,
    });
  } catch (error) {
    console.error('Firebase Admin: Initialization failed:', error);
    return null;
  }
}

/**
 * Proxy helper that avoids throwing on property inspection by frameworks (Next.js/React/Node),
 * and defers error throwing to method invocation inside route handlers.
 */
function createFirebaseProxy<T extends object>(
  getter: (app: App) => T,
  serviceName: string
): T {
  return new Proxy({} as T, {
    get(_target, prop, receiver) {
      if (prop === 'then') return undefined;
      if (prop === Symbol.toStringTag) return serviceName;
      if (typeof prop === 'symbol') return undefined;

      // Handle common framework/React/Node inspection properties safely without throwing
      if (
        prop === '$$typeof' ||
        prop === '__esModule' ||
        prop === 'default' ||
        prop === 'toJSON' ||
        prop === 'constructor' ||
        prop === 'valueOf' ||
        prop === 'toString' ||
        prop === 'inspect'
      ) {
        return undefined;
      }

      const app = getFirebaseAdminApp();
      if (!app) {
        // Return a callable function that throws at invocation time inside the route handler
        return (..._args: any[]) => {
          throw new Error(
            `Firebase Admin ${serviceName} is not initialized. Please ensure FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY (or FIREBASE_SERVICE_ACCOUNT_KEY) are configured in your Vercel Environment Variables.`
          );
        };
      }

      const instance = getter(app);
      const value = Reflect.get(instance as object, prop, receiver);
      return typeof value === 'function' ? value.bind(instance) : value;
    },
  });
}

const adminAuth: Auth = createFirebaseProxy(
  (app) => {
    const mods = getFirebaseAdminModules();
    return mods ? mods.getAuth(app) : ({} as any);
  },
  'Auth'
);

const adminDb: Firestore = createFirebaseProxy(
  (app) => {
    const mods = getFirebaseAdminModules();
    return mods ? mods.getFirestore(app) : ({} as any);
  },
  'Firestore'
);

const adminStorage: Storage = createFirebaseProxy(
  (app) => {
    const mods = getFirebaseAdminModules();
    return mods ? mods.getStorage(app) : ({} as any);
  },
  'Storage'
);

const FieldValue = new Proxy({} as any, {
  get(_target, prop) {
    const mods = getFirebaseAdminModules();
    if (mods && mods.FieldValue) {
      return Reflect.get(mods.FieldValue, prop);
    }
    // Fallback implementations
    if (prop === 'serverTimestamp') return () => new Date();
    if (prop === 'increment') return (n: number) => n;
    if (prop === 'arrayUnion') return (...elements: any[]) => elements;
    if (prop === 'arrayRemove') return (...elements: any[]) => elements;
    if (prop === 'delete') return () => null;
    return () => undefined;
  },
});

export { adminAuth, adminDb, adminStorage, FieldValue };
