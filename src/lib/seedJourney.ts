import { db } from '@/db';
import { journeys, modules, moduleProgress } from '@/db/schema';
import { asc, eq } from 'drizzle-orm';

export const DEMO_JOURNEY_ID = '00000000-0000-0000-0000-000000000001';

export async function ensureDemoJourney() {
  // Check if demo journey already exists
  const [existing] = await db
    .select()
    .from(journeys)
    .where(eq(journeys.id, DEMO_JOURNEY_ID))
    .limit(1);

  if (existing) {
    return existing;
  }

  // Create demo journey
  const [createdJourney] = await db
    .insert(journeys)
    .values({
      id: DEMO_JOURNEY_ID,
      title: 'Full-Stack AI Engineer Journey',
      role: 'Senior AI Software Engineer',
      level: 'intermediate',
      totalModules: 9,
    })
    .returning();

  const demoModules = [
    // Level 1: Foundations
    {
      title: 'Generative AI Foundations & Architectures',
      skill: 'GenAI Foundations',
      description: 'Underlying concepts of transformer architectures, attention mechanisms, and tokens.',
      level: 1,
      order: 1,
      estimatedHours: 6,
    },
    {
      title: 'Advanced Prompt Engineering & System Design',
      skill: 'Prompt Engineering',
      description: 'Few-shot prompting, chain-of-thought, and structural schema enforcement.',
      level: 1,
      order: 2,
      estimatedHours: 5,
    },
    {
      title: 'Python for AI & Modern Systems',
      skill: 'Python',
      description: 'Core Python syntax, data structures, and asynchronous execution for AI services.',
      level: 1,
      order: 3,
      estimatedHours: 8,
    },

    // Level 2: Core Practice & Applications
    {
      title: 'Embeddings & Retrieval-Augmented Generation',
      skill: 'Embeddings & RAG',
      description: 'Vector embeddings, chunking strategies, semantic similarity, and hybrid search.',
      level: 2,
      order: 4,
      estimatedHours: 10,
    },
    {
      title: 'LLM APIs, Function Calling & Structured Outputs',
      skill: 'LLM APIs & Tool Calling',
      description: 'Integrating provider APIs, function routing, and strict JSON output validation.',
      level: 2,
      order: 5,
      estimatedHours: 8,
    },
    {
      title: 'Vector Database Indexing & Scalability',
      skill: 'Vector Databases',
      description: 'Postgres pgvector, HNSW vs IVFFlat indexing, and latency optimization.',
      level: 2,
      order: 6,
      estimatedHours: 6,
    },

    // Level 3: Advanced Specialization & Strategy
    {
      title: 'Production AI System Architecture & Observability',
      skill: 'AI System Architecture',
      description: 'Resilience, caching, token economics, latency profiling, and guardrails.',
      level: 3,
      order: 7,
      estimatedHours: 10,
    },
    {
      title: 'Autonomous AI Agents & Multi-Step Reasoning',
      skill: 'LangChain / AI Agents',
      description: 'Building autonomous loops, ReAct agents, tool execution, and state machines.',
      level: 3,
      order: 8,
      estimatedHours: 12,
    },
    {
      title: 'Model Adaptation & Parameter-Efficient Fine-Tuning (PEFT)',
      skill: 'Model Fine-Tuning',
      description: 'LoRA, QLoRA, dataset curation, and evaluation against baseline models.',
      level: 3,
      order: 9,
      estimatedHours: 14,
    },
  ];

  const insertedModules = await db
    .insert(modules)
    .values(
      demoModules.map((m) => ({
        ...m,
        journeyId: createdJourney.id,
      }))
    )
    .returning();

  // Initialize progress: First module is 'available', remaining are 'locked'
  if (insertedModules.length > 0) {
    const sorted = insertedModules.sort((a, b) => a.order - b.order);
    await db.insert(moduleProgress).values(
      sorted.map((m, idx) => ({
        moduleId: m.id,
        status: idx === 0 ? ('available' as const) : ('locked' as const),
      }))
    );
  }

  return createdJourney;
}
