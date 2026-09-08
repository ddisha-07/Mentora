import { db } from '@/db';
import { quizOptions, quizQuestions, quizzes } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const DEMO_QUIZ_ID = '11111111-1111-1111-1111-111111111111';
export const DEMO_USER_ID = '00000000-0000-0000-0000-000000000002';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

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
  const [existingQuiz] = await db
    .select()
    .from(quizzes)
    .where(eq(quizzes.id, DEMO_QUIZ_ID))
    .limit(1);

  if (!existingQuiz) {
    const [quiz] = await db
      .insert(quizzes)
      .values({
        id: DEMO_QUIZ_ID,
        title: 'Prompt Engineering & GenAI Foundations Mastery',
        description: 'Evaluate your knowledge of sampling parameters, few-shot prompting, embeddings, RAG pipelines, and structured outputs.',
        passingScore: 70,
      })
      .returning();

    for (let i = 0; i < SAMPLE_QUIZ_QUESTIONS.length; i++) {
      const q = SAMPLE_QUIZ_QUESTIONS[i];
      const [insertedQ] = await db
        .insert(quizQuestions)
        .values({
          quizId: quiz.id,
          question: q.question,
          questionType: 'mcq',
          points: 1,
          displayOrder: i + 1,
        })
        .returning();

      for (let j = 0; j < q.options.length; j++) {
        await db.insert(quizOptions).values({
          questionId: insertedQ.id,
          optionText: q.options[j],
          isCorrect: j === q.correctAnswer,
          displayOrder: j + 1,
        });
      }
    }
  }

  // Do NOT seed dummy users or leaderboard points
  return;
}
