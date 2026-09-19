import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/utils/firebase/admin';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();
    if (!idToken) return NextResponse.json({ error: 'Missing ID token' }, { status: 400 });

    // Verify token and create session cookie (valid for 5 days)
    const decodedIdToken = await adminAuth.verifyIdToken(idToken);
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    const response = NextResponse.json({ status: 'success' }, { status: 200 });
    response.cookies.set('mentora_session', sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });

    return response;
  } catch (error: any) {
    console.error('Session creation error:', error);
    return NextResponse.json({
      error: error?.message || 'Failed to create session',
      code: error?.code,
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('mentora_session')?.value || '';
    if (!sessionCookie) {
      return NextResponse.json({ user: null, onboardingComplete: false }, { status: 401 });
    }

    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    
    // Retrieve up-to-date user details from Firestore
    const userDoc = await adminDb.collection('users').doc(decodedClaims.uid).get();
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
