import { NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { user: null, onboardingComplete: false },
        { status: 401 }
      );
    }

    // Retrieve up-to-date user details from database
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        role: users.role,
        onboardingComplete: users.onboardingComplete,
      })
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { user: null, onboardingComplete: false },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      onboardingComplete: user.onboardingComplete,
    });
  } catch (error) {
    console.error('Session retrieval error:', error);
    return NextResponse.json(
      { error: 'Internal server error retrieving session' },
      { status: 500 }
    );
  }
}
