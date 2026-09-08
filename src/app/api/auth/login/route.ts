import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { profiles, users } from '@/db/schema';
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
      // If user does not exist, auto-create them so credentials entered at login are saved in database
      const passwordHash = await hashPassword(password);
      const [newUser] = await db
        .insert(users)
        .values({
          email: normalizedEmail,
          passwordHash,
          role: 'learner',
          onboardingComplete: false,
        })
        .returning();

      activeUser = newUser;

      // Create linked profile row
      const namePart = normalizedEmail.split('@')[0] || 'Learner';
      const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      await db.insert(profiles).values({
        userId: newUser.id,
        fullName: formattedName,
        targetRole: 'Senior AI Systems Architect',
        experienceLevel: 'intermediate',
      });
    } else {
      // Verify password for existing user
      const isPasswordValid = await verifyPassword(password, activeUser.passwordHash);
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
        .where(eq(users.id, activeUser.id));

      // Ensure profile exists
      const [userProfile] = await db
        .select({ id: profiles.id })
        .from(profiles)
        .where(eq(profiles.userId, activeUser.id))
        .limit(1);

      if (!userProfile) {
        const namePart = normalizedEmail.split('@')[0] || 'Learner';
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        await db.insert(profiles).values({
          userId: activeUser.id,
          fullName: formattedName,
        });
      }
    }

    // Generate session JWT
    const token = await createSessionToken({
      userId: activeUser.id,
      email: activeUser.email,
      role: activeUser.role,
    });

    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: activeUser.id,
        email: activeUser.email,
        role: activeUser.role,
        onboardingComplete: activeUser.onboardingComplete,
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
