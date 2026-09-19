import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb, FieldValue } from '@/utils/firebase/admin';


const DEMO_QUIZ_ID = '00000000-0000-0000-0000-000000000001';

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
    let quizDoc = await adminDb.collection('quizzes').doc(targetQuizId).get();

    if (!quizDoc.exists) {
      targetQuizId = DEMO_QUIZ_ID;
      quizDoc = await adminDb.collection('quizzes').doc(targetQuizId).get();
    }

    if (!quizDoc.exists) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    const quizData = quizDoc.data()!;
    const questions = quizData.questions || [];

    // 2. Determine user
    const sessionCookie = request.cookies.get('mentora_session')?.value || '';
    let resolvedUserId = body.userId;

    if (sessionCookie) {
      try {
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
        resolvedUserId = decodedClaims.uid;
      } catch (e) {
        // Ignore
      }
    }

    if (!resolvedUserId) {
      return NextResponse.json(
        { error: 'Authentication required to submit quiz attempt' },
        { status: 401 }
      );
    }

    // 3. Evaluate answers
    let correctCount = 0;
    const totalQuestions = questions.length;

    const answerBreakdown = questions.map((q: any, idx: number) => {
      let selected: number | undefined;
      if (typeof answers === 'object' && !Array.isArray(answers)) {
        selected = answers[q.id] ?? answers[idx] ?? answers[String(idx)];
      } else if (Array.isArray(answers)) {
        selected = answers[idx];
      }

      // We assume correctIndex is stored in Firestore question object.
      // If it's missing (e.g. demo data), we'll default to 0.
      const correctIndex = q.correctIndex ?? 0;
      const isCorrect = typeof selected === 'number' && selected === correctIndex;
      if (isCorrect) {
        correctCount++;
      }

      return {
        questionId: q.id,
        selectedAnswer: selected,
        correctAnswer: correctIndex,
        isCorrect,
      };
    });

    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const passingThreshold = quizData.passingScore ?? 70;
    const passed = percentage >= passingThreshold;
    const pointsToAward = passed ? (quizData.rewardPoints || 100) : 0;

    // 4. Record quiz attempt
    const attemptRef = await adminDb.collection('quiz_attempts').add({
      quizId: targetQuizId,
      userId: resolvedUserId,
      score: percentage,
      passed,
      answerBreakdown,
      startedAt: FieldValue.serverTimestamp(),
      completedAt: FieldValue.serverTimestamp(),
    });

    // 5. Award points if passed
    if (passed && pointsToAward > 0) {
      // Use a transaction to safely increment user's totalPoints
      const userRef = adminDb.collection('users').doc(resolvedUserId);
      
      try {
        await adminDb.runTransaction(async (t: any) => {
          const userDocSnap = await t.get(userRef);
          if (userDocSnap.exists) {
            const currentPoints = userDocSnap.data()?.totalPoints || 0;
            const currentActivities = userDocSnap.data()?.activitiesCount || 0;
            t.update(userRef, {
              totalPoints: currentPoints + pointsToAward,
              activitiesCount: currentActivities + 1,
              lastEarnedAt: FieldValue.serverTimestamp(),
            });
          }
        });
      } catch (err) {
        console.error('Failed to award points transaction:', err);
      }

      // Record XP transaction
      await adminDb.collection('xps').add({
        userId: resolvedUserId,
        points: pointsToAward,
        source: 'quiz',
        refId: targetQuizId,
        createdAt: FieldValue.serverTimestamp(),
      });
    }

    return NextResponse.json({
      attemptId: attemptRef.id,
      quizId: targetQuizId,
      quizTitle: quizData.title,
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
