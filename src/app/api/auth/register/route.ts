import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/utils/firebase/tokenVerifier';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { idToken, fullName, targetRole, experienceLevel, role, isGoogle } = body;

    if (!idToken) {
      return NextResponse.json({ error: 'Missing ID token' }, { status: 400 });
    }

    // Verify token with resilient multi-tier verifier
    const decodedToken = await verifyFirebaseToken(idToken);
    const { uid, email } = decodedToken;

    const resolvedName = fullName?.trim() || email?.split('@')[0] || 'Learner';
    const allowedRoles = ['employee', 'admin', 'mentor', 'manager', 'learner'];
    const resolvedRole = role && allowedRoles.includes(role) ? role : 'learner';

    let currentUserData: any = {
      userId: uid,
      email: email || '',
      name: resolvedName,
      role: resolvedRole,
      status: 'active',
      targetRole: targetRole || null,
      experienceLevel: experienceLevel || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      onboardingComplete: false,
    };

    // Best-effort Firestore user synchronization
    try {
      const { adminDb } = await import('@/utils/firebase/admin');
      const userRef = adminDb.collection('users').doc(uid);
      const userDoc = await userRef.get();

      if (userDoc.exists) {
        if (isGoogle) {
          await userRef.update({
            targetRole: targetRole || null,
            experienceLevel: experienceLevel || null,
            updatedAt: new Date(),
          });
          currentUserData = (await userRef.get()).data();
        } else {
          return NextResponse.json({ error: 'User already exists' }, { status: 409 });
        }
      } else {
        await userRef.set(currentUserData);
      }
    } catch (dbError) {
      console.warn('Register Firestore sync warning:', dbError);
    }

    // Create session cookie (or fallback to idToken)
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    let sessionCookie = idToken;
    try {
      const { adminAuth } = await import('@/utils/firebase/admin');
      sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });
    } catch (cookieErr) {
      console.warn('Register createSessionCookie fallback to idToken:', cookieErr);
      sessionCookie = idToken;
    }

    const response = NextResponse.json(
      {
        message: 'User registered successfully',
        user: currentUserData,
      },
      { status: 201 }
    );

    response.cookies.set('mentora_session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: expiresIn / 1000,
    });

    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error during registration' },
      { status: 500 }
    );
  }
}
