import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users, xps } from '@/db/schema';
import { desc, eq, sql } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    const currentUserId = session?.userId || null;

    // Aggregate points per user from xps table
    const aggregated = await db
      .select({
        userId: users.userId,
        email: users.email,
        name: users.name,
        role: users.role,
        totalPoints: sql<number>`coalesce(sum(${xps.points}), 0)::int`,
        activitiesCount: sql<number>`count(${xps.id})::int`,
        lastEarnedAt: sql<string | null>`max(${xps.createdAt})`,
      })
      .from(users)
      .innerJoin(xps, eq(xps.userId, users.userId))
      .groupBy(users.userId, users.email, users.name, users.role)
      .orderBy(desc(sql`sum(${xps.points})`));

    // Assign sequential ranks and badges
    const leaderboard = aggregated.map((entry, index) => {
      const rank = index + 1;
      let badge = 'Active Learner';
      if (rank === 1) badge = '👑 Grandmaster';
      else if (rank === 2) badge = '🥈 Elite Scholar';
      else if (rank === 3) badge = '🥉 High Achiever';
      else if (entry.totalPoints >= 1000) badge = '⭐ Master';
      else if (entry.totalPoints >= 500) badge = '🚀 Rising Star';

      return {
        rank,
        userId: entry.userId,
        name: entry.name || entry.email.split('@')[0],
        email: entry.email,
        targetRole: entry.role || 'Professional Learner',
        experienceLevel: 'intermediate',
        totalPoints: entry.totalPoints,
        activitiesCount: entry.activitiesCount,
        badge,
        lastEarnedAt: entry.lastEarnedAt,
        isCurrentUser: currentUserId === entry.userId,
      };
    });

    const currentUserRank = leaderboard.find((u) => u.isCurrentUser) || null;

    return NextResponse.json({
      leaderboard,
      totalParticipants: leaderboard.length,
      currentUserRank,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json(
      { error: 'Internal server error fetching leaderboard' },
      { status: 500 }
    );
  }
}
