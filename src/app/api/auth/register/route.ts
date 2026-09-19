import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/utils/firebase/admin';
import { verifyFirebaseToken } from '@/utils/firebase/tokenVerifier';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken, fullName, targetRole, experienceLevel, role, isGoogle } = body;

    if (!idToken) {
      return NextResponse.json({ error: 'Missing ID token' }, { status: 400 });
    }

    // Verify token with resilient multi-tier verifier
    const decodedToken = await verifyFirebaseToken(idToken);
    const { uid, email } = decodedToken;

    // Check if user exists in Firestore
    const userRef = adminDb.collection('users').doc(uid);
    const userDoc = await userRef.get();

    let currentUserData: any;

    if (userDoc.exists) {
      if (isGoogle) {
        // Google user already exists, update role and proceed gracefully
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
      const resolvedName = fullName?.trim() || email?.split('@')[0] || 'Learner';
      const allowedRoles = ['employee', 'admin', 'mentor', 'manager', 'learner'];
      const resolvedRole = role && allowedRoles.includes(role) ? role : 'learner';

      currentUserData = {
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

      // Create user in Firestore
      await userRef.set(currentUserData);
    }

    // Create session cookie (or fallback to idToken)
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    let sessionCookie = idToken;
    try {
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
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error during registration' },
      { status: 500 }
    );
  }
}
