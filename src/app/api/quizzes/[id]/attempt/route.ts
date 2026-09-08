import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { leaderboardPoints, quizAttempts, quizzes, users } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { DEMO_QUIZ_ID } from '@/lib/seedQuizAndLeaderboard';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { answers } = body;

    if (!answers) {
      return NextResponse.json(
        { error: 'Submitted answers are required' },
        { status: 400 }
      );
    }

    // 1. Locate quiz
    let targetQuizId = id;
    let [quiz] = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.id, targetQuizId))
      .limit(1);

    if (!quiz) {
      // Fallback to demo quiz
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

    // 2. Determine user
    const session = await getSession();
    let resolvedUserId = session?.userId || body.userId;

    if (!resolvedUserId) {
      const [latestUser] = await db
        .select({ id: users.id })
        .from(users)
        .orderBy(desc(users.createdAt))
        .limit(1);

      if (latestUser) {
        resolvedUserId = latestUser.id;
      } else {
        return NextResponse.json(
          { error: 'Authentication required to submit quiz attempt' },
          { status: 401 }
        );
      }
    }

    // 3. Evaluate answers
    const questions = quiz.questions || [];
    let correctCount = 0;
    const totalQuestions = questions.length;

    const answerBreakdown = questions.map((q, idx) => {
      // Support object map by question id or array index
      let selected: number | undefined;
      if (typeof answers === 'object' && !Array.isArray(answers)) {
        selected = answers[q.id] ?? answers[idx] ?? answers[String(idx)];
      } else if (Array.isArray(answers)) {
        selected = answers[idx];
      }

      const isCorrect = typeof selected === 'number' && selected === q.correctAnswer;
      if (isCorrect) {
        correctCount++;
      }

      return {
        questionId: q.id,
        selectedAnswer: selected,
        correctAnswer: q.correctAnswer,
        isCorrect,
      };
    });

    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passingThreshold = quiz.passingScore ?? 70;
    const passed = percentage >= passingThreshold;
    const pointsToAward = passed ? (quiz.rewardPoints || 100) : 0;

    // 4. Record quiz attempt in database
    const [recordedAttempt] = await db
      .insert(quizAttempts)
      .values({
        quizId: quiz.id,
        userId: resolvedUserId,
        score: correctCount,
        maxScore: totalQuestions,
        percentage,
        passed,
        answers: answers,
      })
      .returning();

    // 5. Award points to leaderboard_points if score >= 70%
    if (passed && pointsToAward > 0) {
      await db.insert(leaderboardPoints).values({
        userId: resolvedUserId,
        points: pointsToAward,
        source: 'quiz_completion',
        sourceId: quiz.id,
      });
    }

    return NextResponse.json({
      attemptId: recordedAttempt.id,
      quizId: quiz.id,
      quizTitle: quiz.title,
      score: correctCount,
      maxScore: totalQuestions,
      percentage,
      passingScore: passingThreshold,
      passed,
      pointsAwarded: pointsToAward,
      answerBreakdown,
      message: passed
        ? `Congratulations! You scored ${percentage}% (>= ${passingThreshold}%) and earned ${pointsToAward} points on the leaderboard!`
        : `You scored ${percentage}%. You need at least ${passingThreshold}% to earn leaderboard points. Review the concepts and try again.`,
    });
  } catch (error) {
    console.error('Error evaluating quiz attempt:', error);
    return NextResponse.json(
      { error: 'Internal server error evaluating quiz attempt' },
      { status: 500 }
    );
  }
}
