import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { quizzes } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { DEMO_QUIZ_ID, ensureQuizAndLeaderboardSeed } from '@/lib/seedQuizAndLeaderboard';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await ensureQuizAndLeaderboardSeed();

    let targetQuizId = id;
    let [quiz] = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.id, targetQuizId))
      .limit(1);

    if (!quiz) {
      targetQuizId = DEMO_QUIZ_ID;
      [quiz] = await db
        .select()
        .from(quizzes)
        .where(eq(quizzes.id, targetQuizId))
        .limit(1);
    }

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    // Return quiz with questions (omitting correctAnswer so clients cannot cheat before submitting)
    const sanitizedQuestions = (quiz.questions || []).map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
    }));

    return NextResponse.json({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      passingScore: quiz.passingScore,
      rewardPoints: quiz.rewardPoints,
      questions: sanitizedQuestions,
      totalQuestions: sanitizedQuestions.length,
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { error: 'Internal server error fetching quiz' },
      { status: 500 }
    );
  }
}
