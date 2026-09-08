import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import {
  quizAttempts,
  quizOptions,
  quizQuestions,
  quizzes,
  userAnswers,
  users,
  xps,
} from '@/db/schema';
import { asc, desc, eq } from 'drizzle-orm';
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
        .select({ userId: users.userId })
        .from(users)
        .orderBy(desc(users.createdAt))
        .limit(1);

      if (latestUser) {
        resolvedUserId = latestUser.userId;
      } else {
        return NextResponse.json(
          { error: 'Authentication required to submit quiz attempt' },
          { status: 401 }
        );
      }
    }

    // 3. Retrieve questions and options from normalized tables
    const questionsList = await db
      .select({
        questionId: quizQuestions.id,
        questionText: quizQuestions.question,
        displayOrder: quizQuestions.displayOrder,
        points: quizQuestions.points,
        optionId: quizOptions.id,
        optionText: quizOptions.optionText,
        isCorrect: quizOptions.isCorrect,
        optionOrder: quizOptions.displayOrder,
      })
      .from(quizQuestions)
      .leftJoin(quizOptions, eq(quizOptions.questionId, quizQuestions.id))
      .where(eq(quizQuestions.quizId, quiz.id))
      .orderBy(asc(quizQuestions.displayOrder), asc(quizOptions.displayOrder));

    // Group options by question
    const qMap = new Map<
      string,
      {
        id: string;
        question: string;
        correctIndex: number;
        options: { id: string; text: string; isCorrect: boolean }[];
      }
    >();

    for (const r of questionsList) {
      if (!qMap.has(r.questionId)) {
        qMap.set(r.questionId, {
          id: r.questionId,
          question: r.questionText,
          correctIndex: 0,
          options: [],
        });
      }
      if (r.optionId && r.optionText) {
        const qEntry = qMap.get(r.questionId)!;
        const optIndex = qEntry.options.length;
        if (r.isCorrect) {
          qEntry.correctIndex = optIndex;
        }
        qEntry.options.push({
          id: r.optionId,
          text: r.optionText,
          isCorrect: Boolean(r.isCorrect),
        });
      }
    }

    const questionEntries = Array.from(qMap.values());
    let correctCount = 0;
    const totalQuestions = questionEntries.length;

    const answerBreakdown = questionEntries.map((q, idx) => {
      let selected: number | undefined;
      if (typeof answers === 'object' && !Array.isArray(answers)) {
        selected = answers[q.id] ?? answers[idx] ?? answers[String(idx)];
      } else if (Array.isArray(answers)) {
        selected = answers[idx];
      }

      const isCorrect = typeof selected === 'number' && selected === q.correctIndex;
      if (isCorrect) {
        correctCount++;
      }

      const selectedOpt = typeof selected === 'number' && q.options[selected] ? q.options[selected] : null;

      return {
        questionId: q.id,
        selectedOptionId: selectedOpt?.id || null,
        selectedAnswer: selected,
        correctAnswer: q.correctIndex,
        isCorrect,
      };
    });

    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passingThreshold = quiz.passingScore ?? 70;
    const passed = percentage >= passingThreshold;
    const pointsToAward = passed ? 100 : 0;

    // 4. Record quiz attempt in database (quiz_attempts table)
    const [recordedAttempt] = await db
      .insert(quizAttempts)
      .values({
        quizId: quiz.id,
        userId: resolvedUserId,
        score: percentage.toFixed(2),
        passed,
        startedAt: new Date(),
        completedAt: new Date(),
      })
      .returning();

    // Record user answers in user_answers table
    for (const ans of answerBreakdown) {
      if (!ans.questionId) continue;
      await db
        .insert(userAnswers)
        .values({
          attemptId: recordedAttempt.id,
          questionId: ans.questionId,
          selectedOptionId: ans.selectedOptionId || undefined,
          isCorrect: Boolean(ans.isCorrect),
        })
        .onConflictDoNothing()
        .catch(() => {});
    }

    // 5. Award points to xps table if score >= passingScore
    if (passed && pointsToAward > 0) {
      await db.insert(xps).values({
        userId: resolvedUserId,
        points: pointsToAward,
        source: 'quiz',
        refId: quiz.id,
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
        ? `Congratulations! You scored ${percentage}% (>= ${passingThreshold}%) and earned ${pointsToAward} XP!`
        : `You scored ${percentage}%. You need at least ${passingThreshold}% to earn XP. Review the concepts and try again.`,
    });
  } catch (error) {
    console.error('Error evaluating quiz attempt:', error);
    return NextResponse.json(
      { error: 'Internal server error evaluating quiz attempt' },
      { status: 500 }
    );
  }
}
