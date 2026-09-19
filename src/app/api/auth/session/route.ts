import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/utils/firebase/tokenVerifier';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { idToken } = body;
    if (!idToken) {
      return NextResponse.json({ error: 'Missing ID token' }, { status: 400 });
    }

    // 1. Verify token with standalone, resilient verifier (Google JWKS + 60s clock skew tolerance)
    let decodedUser: { uid: string; email: string; name: string; picture?: string };
    try {
      decodedUser = await verifyFirebaseToken(idToken);
    } catch (verifyError: any) {
      console.error('ID token verification failed:', verifyError);
      return NextResponse.json(
        {
          error: verifyError?.message || 'Invalid or expired ID token',
          code: verifyError?.code,
        },
        { status: 401 }
      );
    }

    const { uid, email, name, picture } = decodedUser;

    // 2. Best-effort Firestore user synchronization (won't block login if Firestore is unavailable)
    try {
      const { adminDb } = await import('@/utils/firebase/admin');
      const userRef = adminDb.collection('users').doc(uid);
      const userDoc = await userRef.get();
      if (!userDoc.exists) {
        await userRef.set({
          userId: uid,
          email,
          name,
          role: 'learner',
          status: 'active',
          picture: picture || null,
          createdAt: new Date(),
          updatedAt: new Date(),
          onboardingComplete: false,
        });
      }
    } catch (dbError) {
      console.warn('Could not sync user to Firestore:', dbError);
    }

    // 3. Create session cookie (fallback to idToken if createSessionCookie is unavailable)
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    let sessionCookieVal = idToken;

    try {
      const { adminAuth } = await import('@/utils/firebase/admin');
      sessionCookieVal = await adminAuth.createSessionCookie(idToken, { expiresIn });
    } catch (sessionCookieError: any) {
      console.warn(
        'createSessionCookie failed or uninitialized, using idToken as session cookie:',
        sessionCookieError?.message || sessionCookieError
      );
      sessionCookieVal = idToken;
    }

    const response = NextResponse.json({ status: 'success', uid }, { status: 200 });
    response.cookies.set('mentora_session', sessionCookieVal, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });

    return response;
  } catch (error: any) {
    console.error('Session creation error:', error);
    return NextResponse.json(
      {
        error: error?.message || 'Failed to create session',
        code: error?.code,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('mentora_session')?.value || '';
    if (!sessionCookie) {
      return NextResponse.json({ user: null, onboardingComplete: false }, { status: 401 });
    }

    let uid: string;
    try {
      const { adminAuth } = await import('@/utils/firebase/admin');
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
      uid = decodedClaims.uid;
    } catch {
      // Fallback: verify with verifyFirebaseToken
      try {
        const verified = await verifyFirebaseToken(sessionCookie);
        uid = verified.uid;
      } catch {
        return NextResponse.json({ user: null, onboardingComplete: false }, { status: 401 });
      }
    }

    // Retrieve up-to-date user details from Firestore if accessible
    try {
      const { adminDb } = await import('@/utils/firebase/admin');
      const userDoc = await adminDb.collection('users').doc(uid).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        return NextResponse.json({
          user: userData,
          onboardingComplete: userData?.onboardingComplete ?? true,
        });
      }
    } catch (dbErr) {
      console.warn('Firestore user fetch warning in GET session:', dbErr);
    }

    // Default response if Firestore is offline or user doc pending
    return NextResponse.json({
      user: { userId: uid },
      onboardingComplete: true,
    });
  } catch (error) {
    console.error('Session retrieval error:', error);
    return NextResponse.json({ error: 'Internal server error retrieving session' }, { status: 500 });
  }
}
