import { db } from '@/db';
import { leaderboardPoints, profiles, QuizQuestion, quizzes, users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword } from '@/lib/auth';

export const DEMO_QUIZ_ID = '11111111-1111-1111-1111-111111111111';
export const DEMO_USER_ID = '00000000-0000-0000-0000-000000000002';

export const SAMPLE_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What is the primary role of the temperature parameter in LLM token generation?',
    options: [
      'Sets the maximum response length in tokens',
      'Controls the randomness and entropy of token probability sampling',
      'Speeds up the inference hardware compute cycles',
      'Determines the learning rate during gradient descent',
    ],
    correctAnswer: 1,
    explanation: 'Temperature scales logits prior to softmax; higher values increase diversity, lower values make sampling more deterministic.',
  },
  {
    id: 'q2',
    question: 'Which prompting technique provides demonstration input-output pairs directly within the context prompt?',
    options: [
      'Zero-shot prompting',
      'Few-shot prompting (In-Context Learning)',
      'Parameter-efficient fine-tuning (LoRA)',
      'Vector chunk embedding',
    ],
    correctAnswer: 1,
    explanation: 'Few-shot prompting provides exemplary input-output demonstrations to guide the model format and reasoning style.',
  },
  {
    id: 'q3',
    question: 'In a Retrieval-Augmented Generation (RAG) architecture, what is the core purpose of vector embeddings?',
    options: [
      'Encrypting user query passwords in database columns',
      'Transcribing audio waveforms into text representations',
      'Mapping semantic meaning into high-dimensional vector coordinates for similarity search',
      'Formatting JSON payloads for HTTP response headers',
    ],
    correctAnswer: 2,
    explanation: 'Embeddings project text chunks into a vector space where cosine similarity correlates with semantic relevance.',
  },
  {
    id: 'q4',
    question: "What does 'Chain of Thought' (CoT) prompting specifically instruct a language model to perform?",
    options: [
      'Execute shell commands in parallel threads',
      'Break down complex reasoning step-by-step before concluding the answer',
      'Call external REST endpoints without user confirmation',
      'Disregard previous conversation history',
    ],
    correctAnswer: 1,
    explanation: 'Chain of Thought forces intermediate reasoning steps, significantly improving accuracy on multi-step logic problems.',
  },
  {
    id: 'q5',
    question: 'What is the key engineering benefit of structured JSON outputs in LLM function calling?',
    options: [
      'Guarantees predictable schema compliance for reliable programmatic consumption',
      'Reduces GPU inference memory by 90%',
      'Eliminates all possible hallucination risks permanently',
      'Bypasses API rate limits on cloud providers',
    ],
    correctAnswer: 0,
    explanation: 'Strict schema enforcement guarantees responses adhere to expected types and properties, preventing runtime parsing exceptions.',
  },
];

export async function ensureQuizAndLeaderboardSeed() {
  // 1. Ensure Quiz exists
  const [existingQuiz] = await db
    .select()
    .from(quizzes)
    .where(eq(quizzes.id, DEMO_QUIZ_ID))
    .limit(1);

  if (!existingQuiz) {
    await db.insert(quizzes).values({
      id: DEMO_QUIZ_ID,
      title: 'Prompt Engineering & GenAI Foundations Mastery',
      description: 'Evaluate your knowledge of sampling parameters, few-shot prompting, embeddings, RAG pipelines, and structured outputs.',
      passingScore: 70,
      rewardPoints: 100,
      questions: SAMPLE_QUIZ_QUESTIONS,
    });
  }

  // 2. Check if leaderboard has entries
  const existingPoints = await db.select().from(leaderboardPoints).limit(1);
  if (existingPoints.length > 0) {
    return;
  }

  // 3. Seed demo users for competitive leaderboard
  const seedUsers = [
    {
      id: '20000000-0000-0000-0000-000000000001',
      email: 'sarah.chen@mentora.ai',
      fullName: 'Sarah Chen',
      targetRole: 'Staff AI Systems Architect',
      experienceLevel: 'advanced',
      points: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 150], // 1,450
    },
    {
      id: '20000000-0000-0000-0000-000000000002',
      email: 'alex.rivera@mentora.ai',
      fullName: 'Alex Rivera',
      targetRole: 'AI Product Lead',
      experienceLevel: 'advanced',
      points: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100], // 1,200
    },
    {
      id: '20000000-0000-0000-0000-000000000003',
      email: 'priya.sharma@mentora.ai',
      fullName: 'Priya Sharma',
      targetRole: 'Senior MLOps Engineer',
      experienceLevel: 'intermediate',
      points: [100, 100, 100, 100, 100, 100, 100, 100, 150], // 950
    },
    {
      id: '20000000-0000-0000-0000-000000000004',
      email: 'david.kim@mentora.ai',
      fullName: 'David Kim',
      targetRole: 'Full-Stack AI Developer',
      experienceLevel: 'intermediate',
      points: [100, 100, 100, 100, 100, 100, 100, 100], // 800
    },
    {
      id: DEMO_USER_ID,
      email: 'learner.demo@mentora.ai',
      fullName: 'Alex Morgan (You)',
      targetRole: 'Senior AI Engineer',
      experienceLevel: 'intermediate',
      points: [100, 100, 100, 100, 100], // 500
    },
  ];

  const dummyHash = await hashPassword('password123');

  for (const u of seedUsers) {
    // Insert user if not exists
    const [existing] = await db.select().from(users).where(eq(users.id, u.id)).limit(1);
    if (!existing) {
      await db.insert(users).values({
        id: u.id,
        email: u.email,
        passwordHash: dummyHash,
        role: 'learner',
        onboardingComplete: true,
      });

      await db.insert(profiles).values({
        userId: u.id,
        fullName: u.fullName,
        targetRole: u.targetRole,
        experienceLevel: u.experienceLevel,
      });
    }

    // Insert points
    for (let i = 0; i < u.points.length; i++) {
      await db.insert(leaderboardPoints).values({
        userId: u.id,
        points: u.points[i],
        source: i % 2 === 0 ? 'quiz_completion' : 'module_completion',
        sourceId: DEMO_QUIZ_ID,
      });
    }
  }
}
