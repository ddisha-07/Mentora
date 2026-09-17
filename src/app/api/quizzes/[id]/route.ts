import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/utils/firebase/admin';
// import { ensureQuizAndLeaderboardSeed } from '@/lib/seedQuizAndLeaderboard';

// Assuming DEMO_QUIZ_ID is some fixed UUID or string
const DEMO_QUIZ_ID = '00000000-0000-0000-0000-000000000001';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // await ensureQuizAndLeaderboardSeed(); // Seeding would need to be rewritten for Firestore

    let targetQuizId = id;
    let quizDoc = await adminDb.collection('quizzes').doc(targetQuizId).get();

    if (!quizDoc.exists) {
      targetQuizId = DEMO_QUIZ_ID;
      quizDoc = await adminDb.collection('quizzes').doc(targetQuizId).get();
    }

    if (!quizDoc.exists) {
      // Return a mock demo quiz if it doesn't exist to prevent app from breaking during migration
      return NextResponse.json({
        id: DEMO_QUIZ_ID,
        title: 'Demo Quiz',
        description: 'This is a demo quiz.',
        passingScore: 70,
        rewardPoints: 100,
        questions: [
          {
            id: 'q1',
            question: 'What is 2 + 2?',
            options: ['3', '4', '5', '6']
          }
        ],
        totalQuestions: 1,
      });
    }

    const quizData = quizDoc.data()!;
    // Assuming questions are embedded in the quiz document in NoSQL
    const questions = quizData.questions || [];

    return NextResponse.json({
      id: quizDoc.id,
      title: quizData.title,
      description: quizData.description,
      passingScore: quizData.passingScore,
      rewardPoints: quizData.rewardPoints || 100,
      questions: questions,
      totalQuestions: questions.length,
    });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return NextResponse.json(
      { error: 'Internal server error fetching quiz' },
      { status: 500 }
    );
  }
}
