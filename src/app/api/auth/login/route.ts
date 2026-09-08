import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { createSessionToken, hashPassword, SESSION_COOKIE_NAME, verifyPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists in the connected database
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    let activeUser = existingUser;

    if (!activeUser) {
      // Auto-create user if not found
      const passwordHash = await hashPassword(password);
      const namePart = normalizedEmail.split('@')[0] || 'Learner';
      const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

      const [newUser] = await db
        .insert(users)
        .values({
          email: normalizedEmail,
          name: formattedName,
          password: passwordHash,
          role: 'employee',
          status: 'active',
        })
        .returning();

      activeUser = newUser;
    } else {
      // Verify password for existing user
      const isPasswordValid = await verifyPassword(password, activeUser.password || '');
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Invalid password. Please check your credentials.' },
          { status: 401 }
        );
      }

      // Update database timestamp to record login activity
      await db
        .update(users)
        .set({ updatedAt: new Date() })
        .where(eq(users.userId, activeUser.userId));
    }

    // Generate session JWT
    const token = await createSessionToken({
      userId: activeUser.userId,
      email: activeUser.email,
      role: activeUser.role,
    });

    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: activeUser.userId,
        userId: activeUser.userId,
        email: activeUser.email,
        name: activeUser.name,
        role: activeUser.role,
        status: activeUser.status,
        onboardingComplete: true,
      },
    });

    // Set HTTP-only cookie
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error during login' },
      { status: 500 }
    );
  }
}
