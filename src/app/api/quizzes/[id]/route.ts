import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { quizOptions, quizQuestions, quizzes } from '@/db/schema';
import { asc, eq } from 'drizzle-orm';
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

    // Query questions and options from normalized tables
    const questionsList = await db
      .select({
        questionId: quizQuestions.id,
        questionText: quizQuestions.question,
        questionOrder: quizQuestions.displayOrder,
        optionId: quizOptions.id,
        optionText: quizOptions.optionText,
        optionOrder: quizOptions.displayOrder,
      })
      .from(quizQuestions)
      .leftJoin(quizOptions, eq(quizOptions.questionId, quizQuestions.id))
      .where(eq(quizQuestions.quizId, quiz.id))
      .orderBy(asc(quizQuestions.displayOrder), asc(quizOptions.displayOrder));

    const questionsMap = new Map<string, { id: string; question: string; options: string[] }>();
    for (const row of questionsList) {
      if (!questionsMap.has(row.questionId)) {
        questionsMap.set(row.questionId, {
          id: row.questionId,
          question: row.questionText,
          options: [],
        });
      }
      if (row.optionText) {
        questionsMap.get(row.questionId)!.options.push(row.optionText);
      }
    }

    const sanitizedQuestions = Array.from(questionsMap.values());

    return NextResponse.json({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      passingScore: quiz.passingScore,
      rewardPoints: 100,
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
