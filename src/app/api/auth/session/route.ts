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
        id: users.userId,
        userId: users.userId,
        email: users.email,
        name: users.name,
        role: users.role,
        status: users.status,
      })
      .from(users)
      .where(eq(users.userId, session.userId))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { user: null, onboardingComplete: false },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.userId,
        userId: user.userId,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
      },
      onboardingComplete: true,
    });
  } catch (error) {
    console.error('Session retrieval error:', error);
    return NextResponse.json(
      { error: 'Internal server error retrieving session' },
      { status: 500 }
    );
  }
}
