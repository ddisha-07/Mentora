import { getApps, initializeApp, cert } from 'firebase-admin/app';
import type { App, ServiceAccount } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import type { Auth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import type { Firestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
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
  // Safely check if the FIREBASE_SERVICE_ACCOUNT_KEY environment variable exists before parsing
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
      return null;
    }
  }

  // Fallback to individual environment variables
  const projectId =
    cleanEnvString(process.env.FIREBASE_PROJECT_ID) ||
    cleanEnvString(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  const clientEmail = cleanEnvString(process.env.FIREBASE_CLIENT_EMAIL);
  const privateKey = cleanPrivateKey(process.env.FIREBASE_PRIVATE_KEY);

  if (projectId && clientEmail && privateKey) {
    return {
      projectId,
      clientEmail,
      privateKey,
    } as ServiceAccount;
  }

  return null;
}

function getFirebaseAdminApp(): App | null {
  // Check if an app instance already exists using getApps().length
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const credentials = getServiceAccount();
  if (!credentials) {
    return null;
  }

  try {
    const projectId =
      (credentials as any).projectId ||
      (credentials as any).project_id ||
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    return initializeApp({
      credential: cert(credentials),
      databaseURL: projectId ? `https://${projectId}.firebaseio.com` : undefined,
    });
  } catch (error) {
    console.error('Firebase Admin: Initialization failed:', error);
    return null;
  }
}

// Attempt initial initialization if credentials are present
if (!getApps().length) {
  getFirebaseAdminApp();
}

/**
 * Proxy helper to prevent Next.js build from crashing when environment variables
 * are not available during page compilation / data collection, while preserving
 * standard methods and runtime typing.
 */
function createFirebaseProxy<T extends object>(
  getter: (app: App) => T,
  serviceName: string
): T {
  return new Proxy({} as T, {
    get(_target, prop, receiver) {
      if (prop === 'then') return undefined;
      if (prop === Symbol.toStringTag) return serviceName;

      const app = getFirebaseAdminApp();
      if (!app) {
        throw new Error(
          `Firebase Admin ${serviceName} is not initialized. Please ensure FIREBASE_SERVICE_ACCOUNT_KEY (or FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY) is configured in your environment variables.`
        );
      }

      const instance = getter(app);
      const value = Reflect.get(instance as object, prop, receiver);
      return typeof value === 'function' ? value.bind(instance) : value;
    },
  });
}

const adminAuth: Auth = createFirebaseProxy(getAuth, 'Auth');
const adminDb: Firestore = createFirebaseProxy(getFirestore, 'Firestore');
const adminStorage: Storage = createFirebaseProxy(getStorage, 'Storage');

export { adminAuth, adminDb, adminStorage, FieldValue };
