import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/utils/firebase/admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idToken, fullName, targetRole, experienceLevel, role } = body;

    if (!idToken) {
      return NextResponse.json({ error: 'Missing ID token' }, { status: 400 });
    }

    // Verify token
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const { uid, email } = decodedToken;

    // Check if user exists in Firestore
    const userRef = adminDb.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }
    const resolvedName = fullName?.trim() || email?.split('@')[0] || 'Learner';
    const allowedRoles = ['employee', 'admin', 'mentor', 'manager', 'learner'];
    const resolvedRole = role && allowedRoles.includes(role) ? role : 'employee';

    const newUser = {
      userId: uid,
      email: email || '',
      name: resolvedName,
      role: resolvedRole,
      status: 'active',
      targetRole: targetRole || null,
      experienceLevel: experienceLevel || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      onboardingComplete: true, // Assuming true for now
    };

    // Create user in Firestore
    await userRef.set(newUser);

    // Create session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    const response = NextResponse.json(
      {
        message: 'User registered successfully',
        user: newUser,
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
