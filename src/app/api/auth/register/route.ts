import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, role, fullName, targetRole, experienceLevel } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const [existing] = await db
      .select({ userId: users.userId })
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const resolvedName = fullName?.trim() || normalizedEmail.split('@')[0];

    // Allowed roles: 'employee', 'admin', 'mentor', 'manager'
    const allowedRoles = ['employee', 'admin', 'mentor', 'manager'];
    const resolvedRole = role && allowedRoles.includes(role) ? role : 'employee';

    // Create user in users table
    const [newUser] = await db
      .insert(users)
      .values({
        email: normalizedEmail,
        name: resolvedName,
        password: passwordHash,
        role: resolvedRole,
        status: 'active',
      })
      .returning({
        userId: users.userId,
        email: users.email,
        name: users.name,
        role: users.role,
        status: users.status,
        createdAt: users.createdAt,
      });

    // Generate session JWT
    const { createSessionToken, SESSION_COOKIE_NAME } = await import('@/lib/auth');
    const token = await createSessionToken({
      userId: newUser.userId,
      email: newUser.email,
      role: newUser.role,
    });

    const response = NextResponse.json(
      {
        message: 'User registered successfully',
        user: {
          id: newUser.userId,
          userId: newUser.userId,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          status: newUser.status,
          onboardingComplete: true,
        },
      },
      { status: 201 }
    );

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
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
