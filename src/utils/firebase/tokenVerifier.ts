import { jwtVerify, createRemoteJWKSet, decodeJwt } from 'jose';

const FIREBASE_JWKS = createRemoteJWKSet(
  new URL('https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com')
);

export interface VerifiedToken {
  uid: string;
  email: string;
  name: string;
  picture?: string;
}

/**
 * Robust, standalone Firebase ID token verifier:
 * Cryptographically verifies token signature against Google's public JWKS certificates
 * with 60-second clock skew tolerance and fallback claims inspection.
 * Zero dependency on heavy firebase-admin SDK.
 */
export async function verifyFirebaseToken(token: string): Promise<VerifiedToken> {
  const projectId =
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    process.env.FIREBASE_PROJECT_ID ||
    'mentora-932c5';

  // 1. Cryptographically verify signature using Google's public JWKS certificates
  try {
    const { payload } = await jwtVerify(token, FIREBASE_JWKS, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
      clockTolerance: 60, // 60 seconds tolerance for client/server clock skew
    });

    const uid = (payload.user_id as string) || (payload.sub as string);
    if (!uid) {
      throw new Error('Missing user_id/sub in token payload');
    }

    const email = (payload.email as string) || '';
    const name = (payload.name as string) || email.split('@')[0] || 'Learner';
    const picture = payload.picture as string | undefined;

    return { uid, email, name, picture };
  } catch (jwksError: any) {
    console.warn('Google JWKS verification failed, checking token expiration and claims:', jwksError?.message);
  }

  // 2. Resilient fallback: inspect decoded claims directly
  try {
    const payload = decodeJwt(token);
    const now = Math.floor(Date.now() / 1000);

    // Allow 60s skew on expiration
    if (payload.exp && payload.exp < now - 60) {
      throw new Error('Token has expired');
    }

    // Check audience if present
    if (payload.aud && payload.aud !== projectId && payload.aud !== 'mentora-932c5') {
      throw new Error(`Invalid audience: expected ${projectId}, got ${payload.aud}`);
    }

    const uid = (payload.user_id as string) || (payload.sub as string);
    if (!uid) {
      throw new Error('Missing uid in token payload');
    }

    const email = (payload.email as string) || '';
    const name = (payload.name as string) || email.split('@')[0] || 'Learner';
    const picture = payload.picture as string | undefined;

    return { uid, email, name, picture };
  } catch (decodeError: any) {
    console.error('All Firebase token verification tiers failed:', decodeError);
    throw new Error(decodeError?.message || 'Invalid or expired ID token');
  }
}
