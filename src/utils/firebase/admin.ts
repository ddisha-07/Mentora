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

function getFirebaseAdminApp(): App | null {
  try {
    // Check if an app instance already exists
    if (getApps().length > 0) {
      return getApps()[0];
    }

    const credentials = getServiceAccount();
    if (!credentials) {
      return null;
    }

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

const adminAuth: Auth = createFirebaseProxy(getAuth, 'Auth');
const adminDb: Firestore = createFirebaseProxy(getFirestore, 'Firestore');
const adminStorage: Storage = createFirebaseProxy(getStorage, 'Storage');

export { adminAuth, adminDb, adminStorage, FieldValue };
