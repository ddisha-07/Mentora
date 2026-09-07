import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { leaderboardPoints, profiles, users } from '@/db/schema';
import { desc, eq, sql } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { ensureQuizAndLeaderboardSeed } from '@/lib/seedQuizAndLeaderboard';

export async function GET(request: NextRequest) {
  try {
    await ensureQuizAndLeaderboardSeed();

    const session = await getSession();
    const currentUserId = session?.userId || null;

    // Aggregate points per user from leaderboard_points
    const aggregated = await db
      .select({
        userId: users.id,
        email: users.email,
        fullName: profiles.fullName,
        targetRole: profiles.targetRole,
        experienceLevel: profiles.experienceLevel,
        totalPoints: sql<number>`coalesce(sum(${leaderboardPoints.points}), 0)::int`,
        activitiesCount: sql<number>`count(${leaderboardPoints.id})::int`,
        lastEarnedAt: sql<string | null>`max(${leaderboardPoints.createdAt})`,
      })
      .from(users)
      .leftJoin(profiles, eq(profiles.userId, users.id))
      .innerJoin(leaderboardPoints, eq(leaderboardPoints.userId, users.id))
      .groupBy(users.id, users.email, profiles.fullName, profiles.targetRole, profiles.experienceLevel)
      .orderBy(desc(sql`sum(${leaderboardPoints.points})`));

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
        name: entry.fullName || entry.email.split('@')[0],
        email: entry.email,
        targetRole: entry.targetRole || 'Professional Learner',
        experienceLevel: entry.experienceLevel || 'intermediate',
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
