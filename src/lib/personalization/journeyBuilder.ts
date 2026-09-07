/**
 * Mentora Personalization Engine - Journey Builder
 * Takes missing skills and maps them into a 3-level journey containing ordered modules.
 */

import { ExperienceLevel } from './levelClassifier';

export interface JourneyModule {
  id: string;
  title: string;
  skill: string;
  level: 1 | 2 | 3;
  levelName: string;
  order: number;
  description: string;
  estimatedHours: number;
  status: 'available' | 'locked';
}

export interface JourneyLevel {
  level: 1 | 2 | 3;
  name: string;
  isUnlocked: boolean;
  modules: JourneyModule[];
}

export interface LearningJourney {
  role: string;
  userLevel: ExperienceLevel;
  totalModules: number;
  levels: [JourneyLevel, JourneyLevel, JourneyLevel];
}

export interface JourneyBuilderInput {
  role: string;
  missingSkills: string[];
  userLevel?: ExperienceLevel;
}

const LEVEL_NAMES: Record<1 | 2 | 3, string> = {
  1: 'Foundations',
  2: 'Core Practice & Applications',
  3: 'Advanced Specialization & Strategy',
};

/**
 * Known skill catalog metadata providing rich module titles and descriptions.
 */
const MODULE_CATALOG: Record<string, { title: string; description: string; preferredLevel?: 1 | 2 | 3; hours: number }> = {
  // Software Engineer / AI Track
  'python': { title: 'Python for AI & Modern Systems', description: 'Core Python syntax, data structures, and asynchronous execution for AI services.', preferredLevel: 1, hours: 8 },
  'genai foundations': { title: 'Generative AI Foundations & Architectures', description: 'Underlying concepts of transformer architectures, attention mechanisms, and tokens.', preferredLevel: 1, hours: 6 },
  'prompt engineering': { title: 'Advanced Prompt Engineering & System Design', description: 'Few-shot prompting, chain-of-thought, and structural schema enforcement.', preferredLevel: 1, hours: 5 },
  'embeddings & rag': { title: 'Embeddings & Retrieval-Augmented Generation', description: 'Vector embeddings, chunking strategies, semantic similarity, and hybrid search.', preferredLevel: 2, hours: 10 },
  'llm apis & tool calling': { title: 'LLM APIs, Function Calling & Structured Outputs', description: 'Integrating provider APIs, function routing, and strict JSON output validation.', preferredLevel: 2, hours: 8 },
  'vector databases': { title: 'Vector Database Indexing & Scalability', description: 'Postgres pgvector, HNSW vs IVFFlat indexing, and latency optimization.', preferredLevel: 2, hours: 6 },
  'langchain / ai agents': { title: 'Autonomous AI Agents & Multi-Step Reasoning', description: 'Building autonomous loops, ReAct agents, tool execution, and state machines.', preferredLevel: 3, hours: 12 },
  'model fine-tuning': { title: 'Model Adaptation & Parameter-Efficient Fine-Tuning (PEFT)', description: 'LoRA, QLoRA, dataset curation, and evaluation against baseline models.', preferredLevel: 3, hours: 14 },
  'ai system architecture': { title: 'Production AI System Architecture & Observability', description: 'Resilience, caching, token economics, latency profiling, and guardrails.', preferredLevel: 3, hours: 10 },

  // Product Manager / AI Track
  'ai fundamentals': { title: 'AI & Machine Learning Essentials for Product Leaders', description: 'Key concepts of probabilistic computing, models, and technological capabilities.', preferredLevel: 1, hours: 6 },
  'understanding llm capabilities': { title: 'Evaluating LLM Strengths, Limitations & Costs', description: 'Context windows, hallucinations, latency trade-offs, and inference cost modeling.', preferredLevel: 1, hours: 6 },
  'ai product strategy': { title: 'Formulating Defensible AI Product Strategies', description: 'Identifying high-leverage workflows, moat creation, and build vs buy trade-offs.', preferredLevel: 2, hours: 8 },
  'ai ux & product design': { title: 'Human-Centered AI UX & Interaction Design', description: 'Designing confidence indicators, fallback loops, streaming responses, and user trust.', preferredLevel: 2, hours: 8 },
  'evaluating ai products & metrics': { title: 'AI Product Metrics, Evals & Benchmarks', description: 'Defining task completion rates, precision/recall, automated LLM-as-a-judge evals.', preferredLevel: 2, hours: 8 },
  'ai ethics & governance': { title: 'AI Governance, Bias & Responsible Deployment', description: 'Data privacy, copyright compliance, model bias audits, and regulatory alignment.', preferredLevel: 3, hours: 6 },
  'ai product roadmap execution': { title: 'AI Roadmap Execution & Continuous Improvement', description: 'Iterative lifecycle management, user feedback loops, and fine-tuning roadmaps.', preferredLevel: 3, hours: 10 },
};

/**
 * Maps missing skills into an ordered 3-level journey.
 */
export function buildJourney(input: JourneyBuilderInput): LearningJourney {
  const { role, missingSkills, userLevel = 'beginner' } = input;

  if (missingSkills.length === 0) {
    return {
      role,
      userLevel,
      totalModules: 0,
      levels: [
        { level: 1, name: LEVEL_NAMES[1], isUnlocked: true, modules: [] },
        { level: 2, name: LEVEL_NAMES[2], isUnlocked: userLevel !== 'beginner', modules: [] },
        { level: 3, name: LEVEL_NAMES[3], isUnlocked: userLevel === 'advanced', modules: [] },
      ],
    };
  }

  // Bucket missing skills into 3 levels
  const level1Skills: string[] = [];
  const level2Skills: string[] = [];
  const level3Skills: string[] = [];

  const unassigned: string[] = [];

  for (const skill of missingSkills) {
    const key = skill.trim().toLowerCase();
    const catalogEntry = MODULE_CATALOG[key];

    if (catalogEntry?.preferredLevel === 1) {
      level1Skills.push(skill);
    } else if (catalogEntry?.preferredLevel === 2) {
      level2Skills.push(skill);
    } else if (catalogEntry?.preferredLevel === 3) {
      level3Skills.push(skill);
    } else {
      unassigned.push(skill);
    }
  }

  // Distribute any unassigned skills proportionally across the 3 levels
  unassigned.forEach((skill, index) => {
    const target = index % 3;
    if (target === 0) level1Skills.push(skill);
    else if (target === 1) level2Skills.push(skill);
    else level3Skills.push(skill);
  });

  // Ensure every level has at least one module if we have 3 or more skills
  if (missingSkills.length >= 3) {
    if (level1Skills.length === 0 && level2Skills.length > 1) {
      level1Skills.push(level2Skills.shift()!);
    }
    if (level3Skills.length === 0 && level2Skills.length > 1) {
      level3Skills.push(level2Skills.pop()!);
    }
  }

  let globalOrder = 1;

  const createModulesForLevel = (skills: string[], levelNumber: 1 | 2 | 3): JourneyModule[] => {
    return skills.map((skill) => {
      const key = skill.trim().toLowerCase();
      const entry = MODULE_CATALOG[key];
      const title = entry?.title || `${skill}: Foundations to Implementation`;
      const description =
        entry?.description || `Mastery of ${skill} concepts and practical production application.`;
      const estimatedHours = entry?.hours || 6;

      const module: JourneyModule = {
        id: `mod-${role.toLowerCase().replace(/[^a-z0-9]/g, '-')}-l${levelNumber}-${globalOrder}`,
        title,
        skill,
        level: levelNumber,
        levelName: LEVEL_NAMES[levelNumber],
        order: globalOrder++,
        description,
        estimatedHours,
        // Level 1 is unlocked initially; Level 2 unlocked if intermediate/advanced; Level 3 unlocked if advanced
        status:
          levelNumber === 1 ||
          (levelNumber === 2 && userLevel !== 'beginner') ||
          (levelNumber === 3 && userLevel === 'advanced')
            ? 'available'
            : 'locked',
      };

      return module;
    });
  };

  const level1Modules = createModulesForLevel(level1Skills, 1);
  const level2Modules = createModulesForLevel(level2Skills, 2);
  const level3Modules = createModulesForLevel(level3Skills, 3);

  const levels: [JourneyLevel, JourneyLevel, JourneyLevel] = [
    {
      level: 1,
      name: LEVEL_NAMES[1],
      isUnlocked: true,
      modules: level1Modules,
    },
    {
      level: 2,
      name: LEVEL_NAMES[2],
      isUnlocked: userLevel !== 'beginner',
      modules: level2Modules,
    },
    {
      level: 3,
      name: LEVEL_NAMES[3],
      isUnlocked: userLevel === 'advanced',
      modules: level3Modules,
    },
  ];

  return {
    role,
    userLevel,
    totalModules: level1Modules.length + level2Modules.length + level3Modules.length,
    levels,
  };
}
