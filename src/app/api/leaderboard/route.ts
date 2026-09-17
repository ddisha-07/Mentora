import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/utils/firebase/admin';

export async function GET(request: NextRequest) {
  try {
    const sessionCookie = request.cookies.get('mentora_session')?.value || '';
    let currentUserId: string | null = null;
    
    if (sessionCookie) {
      try {
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
        currentUserId = decodedClaims.uid;
      } catch (e) {
        // Ignore invalid session
      }
    }

    // Fetch users ordered by totalPoints (assuming we maintain this field on user document)
    // For now, if the field doesn't exist, we'll fetch all and calculate/sort in memory,
    // but in a production NoSQL app, you'd want to maintain this counter via Cloud Functions or transactions.
    
    const usersSnapshot = await adminDb.collection('users').orderBy('totalPoints', 'desc').get();
    
    // In case we don't have totalPoints index yet, let's just fetch all and sort
    let allUsers = [];
    if (usersSnapshot.empty) {
       const snapshot = await adminDb.collection('users').get();
       allUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
       allUsers.sort((a: any, b: any) => (b.totalPoints || 0) - (a.totalPoints || 0));
    } else {
       allUsers = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    // Assign sequential ranks and badges
    const leaderboard = allUsers.map((entry: any, index) => {
      const rank = index + 1;
      const totalPoints = entry.totalPoints || 0;
      let badge = 'Active Learner';
      if (rank === 1) badge = '👑 Grandmaster';
      else if (rank === 2) badge = '🥈 Elite Scholar';
      else if (rank === 3) badge = '🥉 High Achiever';
      else if (totalPoints >= 1000) badge = '⭐ Master';
      else if (totalPoints >= 500) badge = '🚀 Rising Star';

      return {
        rank,
        userId: entry.id,
        name: entry.name || entry.email?.split('@')[0] || 'Anonymous',
        email: entry.email,
        targetRole: entry.targetRole || entry.role || 'Professional Learner',
        experienceLevel: entry.experienceLevel || 'intermediate',
        totalPoints: totalPoints,
        activitiesCount: entry.activitiesCount || 0,
        badge,
        lastEarnedAt: entry.lastEarnedAt || null,
        isCurrentUser: currentUserId === entry.id,
      };
    }).filter(u => u.totalPoints > 0); // Only show users with >0 points on leaderboard

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
