import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/utils/firebase/admin';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();
    if (!idToken) return NextResponse.json({ error: 'Missing ID token' }, { status: 400 });

    // 1. Verify token
    let decodedIdToken: any;
    try {
      decodedIdToken = await adminAuth.verifyIdToken(idToken);
    } catch (verifyError: any) {
      console.error('ID token verification failed:', verifyError);
      const isConfigError = verifyError?.message?.includes('not initialized');
      return NextResponse.json(
        { 
          error: isConfigError ? verifyError.message : 'Invalid or expired ID token',
          code: verifyError?.code,
        }, 
        { status: isConfigError ? 500 : 401 }
      );
    }

    const uid = decodedIdToken.uid;
    const email = decodedIdToken.email || '';
    const name = decodedIdToken.name || email.split('@')[0] || 'Learner';

    // 2. Ensure user document exists in Firestore (for Google Sign-In or new users)
    try {
      const userRef = adminDb.collection('users').doc(uid);
      const userDoc = await userRef.get();
      if (!userDoc.exists) {
        await userRef.set({
          userId: uid,
          email,
          name,
          role: 'learner',
          status: 'active',
          picture: decodedIdToken.picture || null,
          createdAt: new Date(),
          updatedAt: new Date(),
          onboardingComplete: false,
        });
      }
    } catch (dbError) {
      console.warn('Could not sync user to Firestore:', dbError);
    }

    // 3. Create session cookie (or fallback to idToken if createSessionCookie is unavailable/fails)
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    let sessionCookieVal = idToken;

    try {
      sessionCookieVal = await adminAuth.createSessionCookie(idToken, { expiresIn });
    } catch (sessionCookieError: any) {
      console.warn(
        'createSessionCookie failed, falling back to idToken session cookie:',
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
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
      uid = decodedClaims.uid;
    } catch {
      // Fallback: verify as ID token
      try {
        const decodedId = await adminAuth.verifyIdToken(sessionCookie);
        uid = decodedId.uid;
      } catch {
        return NextResponse.json({ user: null, onboardingComplete: false }, { status: 401 });
      }
    }

    // Retrieve up-to-date user details from Firestore
    const userDoc = await adminDb.collection('users').doc(uid).get();
    if (!userDoc.exists) {
      return NextResponse.json({ user: null, onboardingComplete: false }, { status: 401 });
    }

    const userData = userDoc.data();
    return NextResponse.json({
      user: userData,
      onboardingComplete: userData?.onboardingComplete ?? true,
    });
  } catch (error) {
    console.error('Session retrieval error:', error);
    return NextResponse.json({ error: 'Internal server error retrieving session' }, { status: 500 });
  }
}
