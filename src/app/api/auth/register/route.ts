import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { profiles, users } from '@/db/schema';
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
      .select({ id: users.id })
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

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email: normalizedEmail,
        passwordHash,
        role: role || 'learner',
      })
      .returning({
        id: users.id,
        email: users.email,
        role: users.role,
        onboardingComplete: users.onboardingComplete,
        createdAt: users.createdAt,
      });

    // Create profile if initial details provided
    if (fullName || targetRole || experienceLevel) {
      await db.insert(profiles).values({
        userId: newUser.id,
        fullName: fullName || null,
        targetRole: targetRole || null,
        experienceLevel: experienceLevel || null,
      });
    }

    return NextResponse.json(
      {
        message: 'User registered successfully',
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error during registration' },
      { status: 500 }
    );
  }
}
