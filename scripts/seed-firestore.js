require('dotenv').config({ path: '.env.local' });
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore, FieldValue, Timestamp } = require('firebase-admin/firestore');

// 1. Initialize Firebase Admin
if (!getApps().length) {
  const serviceAccount = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  };

  initializeApp({
    credential: cert(serviceAccount)
  });
}

const db = getFirestore();

// ==========================================
// SEED DATA
// ==========================================

const blogsData = [
  {
    id: "blg-01",
    num: "01",
    category: "Pedagogy",
    tabLabel: "ARTICLE 01",
    subTabLabel: "PEDAGOGY & SYSTEMS",
    tabPosition: "left",
    theme: "dark-charcoal",
    primaryTabColor: "#2563EB",
    date: "SEP 14, 2026",
    readTime: "6 MIN READ",
    title: "Level-Gated Progression",
    kicker: "COGNITIVE SCAFFOLDING & PEDAGOGY",
    synopsis: "Why structured prerequisite gates beat infinite, unguided video libraries every single time. Scaffolding knowledge eliminates cognitive fatigue and accelerates retention.",
    tags: ["#Pedagogy", "#CognitiveLoad", "#ActiveRecall", "#Gamification"],
    takeaways: [
      "Unguided libraries lead to passive bingeing without durable memory formation.",
      "Prerequisite gating forces mastery of fundamental mental models before unlocking abstractions.",
      "Immediate diagnostic feedback creates rapid dopamine loops that build consistency."
    ],
    fullBody: [
      "Modern professionals are drowning in course catalogs. When given a library with 8,000 video lectures, the paradox of choice creates immediate cognitive friction. Learners skip fundamentals to watch trendy topics, accumulate fragmented understanding, and abandon the roadmap after two weeks.",
      "At Mentora, we adopted a level-gated progression architecture inspired by game loop design and Vygotsky’s Zone of Proximal Development. You cannot unlock distributed consensus until you have proven active recall mastery of local concurrency primitives.",
      "By enforcing strict prerequisite gates, we reduce cognitive overwhelm to zero. Every session has exactly one next step, calibrated to your current edge of competence."
    ],
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop",
    status: "Published",
    author: "Mentora Pedagogy Lab",
    createdAt: "2026-09-14",
    updatedAt: "2026-09-14",
  },
  {
    id: "blg-02",
    num: "02",
    category: "Algorithms",
    tabLabel: "ARTICLE 02",
    subTabLabel: "ALGORITHMIC ENGINE",
    tabPosition: "right",
    theme: "warm-amber",
    primaryTabColor: "#F59E0B",
    date: "AUG 28, 2026",
    readTime: "8 MIN READ",
    title: "Skill-Gap Diagnostics",
    kicker: "VECTOR EMBEDDINGS & MARKET DIFFING",
    synopsis: "Getting a new engineer from day one to shipping without the panic. Computing real-time weighted set differences between your current competency matrix and production standards.",
    tags: ["#VectorEmbeddings", "#SkillMatrix", "#CareerMapping", "#Algorithms"],
    takeaways: [
      "Skills are not binary keywords; they are high-dimensional competency vectors.",
      "Weighted set differences reveal the high-leverage 20% of skills that unlock 80% of job requirements.",
      "Continuous calibration prevents engineers from wasting time over-learning commoditized skills."
    ],
    fullBody: [
      "Traditional job descriptions list 30 disconnected bullet points. An engineer sees 'Kubernetes, Go, Kafka, React' and assumes they must master everything simultaneously.",
      "Our diagnostic engine parses live engineering hiring bars, production incident post-mortems, and codebase archetypes into a multi-dimensional graph. When you complete a diagnostic drill, Mentora plots your vectors against target role archetypes.",
      "The output is a surgical delta: instead of telling you to 'learn backend', it prescribes three 6-minute drills on idempotency keys and retry storms."
    ],
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop",
    status: "Published",
    author: "Mentora Systems Team",
    createdAt: "2026-08-28",
    updatedAt: "2026-08-28",
  },
  {
    id: "blg-03",
    num: "03",
    category: "Credentials",
    tabLabel: "ARTICLE 03",
    subTabLabel: "PROOF-OF-WORK",
    tabPosition: "left",
    theme: "deep-espresso",
    primaryTabColor: "#EA580C",
    date: "AUG 12, 2026",
    readTime: "5 MIN READ",
    title: "The 70% Mastery Standard",
    kicker: "VERIFIABLE SKILL CREDENTIALING",
    synopsis: "Why multiple-choice certificates are dead and how cryptographically verifiable proof-of-work is replacing resumes for engineering and leadership talent.",
    tags: ["#ProofOfWork", "#Credentials", "#HiringStandards", "#SkillPassport"],
    takeaways: [
      "Resume bullet points are unverified claims; interactive session transcripts are incontrovertible evidence.",
      "70%+ active recall under time pressure filters out superficial memorization.",
      "Employers integrate directly with the Mentora Passport API to audit real diagnostic attempt logs."
    ],
    fullBody: [
      "Anyone can claim familiarity with system architecture after skimming a tech blog. But when an incident occurs at 2 AM, superficial knowledge collapses.",
      "The Mentora Skill Passport requires learners to reproduce architectural trade-offs under constraints, debug synthetically corrupted payloads, and explain edge cases to our AI evaluator.",
      "When a hiring manager reviews your Mentora Passport, they do not see a certificate; they inspect verified proof-of-work timestamps and benchmark percentiles."
    ],
    imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop",
    status: "Published",
    author: "Mentora Credential Board",
    createdAt: "2026-08-12",
    updatedAt: "2026-08-12",
  },
  {
    id: "blg-04",
    num: "04",
    category: "AI Systems",
    tabLabel: "ARTICLE 04",
    subTabLabel: "ADAPTIVE AI TUTORING",
    tabPosition: "right",
    theme: "warm-parchment",
    primaryTabColor: "#10B981",
    date: "JUL 30, 2026",
    readTime: "7 MIN READ",
    title: "Contextual AI Companion",
    kicker: "NEURAL ADAPTATION ARCHITECTURE",
    synopsis: "How continuous evaluation models adjust quiz difficulty and study cadences in real-time, eliminating plateaus and boredom for advanced professionals.",
    tags: ["#AdaptiveLearning", "#AI", "#NeuralEngine", "#SpacedRepetition"],
    takeaways: [
      "Plateaus happen when curricula do not recalibrate after sudden bursts of learner growth.",
      "Real-time feedback loops tune spaced-repetition intervals based on micro-hesitations and error patterns.",
      "Adaptive pacing compresses a 6-month curriculum down to 6 weeks for focused engineers."
    ],
    fullBody: [
      "Static syllabi treat all learners identically. Fast learners grow bored and drop off; learners who need extra scaffolding on a specific concept get left behind.",
      "Our AI Tutor monitors diagnostic attempt telemetry—such as time-to-first-keypress and revision cycles—to infer cognitive uncertainty. When uncertainty spikes, the system automatically injects an intuitive visual mental model drill before advancing.",
      "The result is a learning curve that always feels challenging, yet never overwhelming."
    ],
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    status: "Published",
    author: "Mentora AI Research",
    createdAt: "2026-07-30",
    updatedAt: "2026-07-30",
  },
  {
    id: "blg-agentic-ai",
    num: "05",
    category: "AI Systems",
    tabLabel: "ARTICLE 05",
    subTabLabel: "AUTONOMOUS REASONING",
    tabPosition: "left",
    theme: "dark-charcoal",
    primaryTabColor: "#3B82F6",
    date: "SEP 13, 2026",
    readTime: "9 MIN READ",
    title: "Agentic AI",
    kicker: "COGNITIVE ARCHITECTURES & TOOL USE",
    synopsis: "From passive next-token prediction to goal-directed autonomous agents: how recursive self-critique, external tool use, and multi-agent coordination redefine software engineering.",
    tags: ["#AgenticAI", "#LLMs", "#AutonomousAgents", "#MultiAgentSystems"],
    takeaways: [
      "Agentic workflows trade latency for accuracy through test-time compute and reflective refinement loops.",
      "Autonomous systems succeed by decomposing ambiguous goals into verifiable subtasks with executable rollback strategies.",
      "The competitive moat moves from model weights to deterministic verification harnesses and real-time environment feedback."
    ],
    fullBody: [
      "The paradigm of AI interaction has fundamentally shifted. For two years, the industry treated large language models as interactive search engines or autocomplete assistants. You provided a prompt, waited two seconds, and accepted whatever token distribution emerged from the weights.",
      "Agentic AI transforms this dynamic by giving models agency: the ability to plan, use command-line tools, write code to disk, execute tests, inspect stderr outputs, and recursively correct their reasoning until a rigorous goal criteria is satisfied.",
      "At Mentora, we incorporate agentic loops into our hands-on diagnostic engineering drills. Rather than answering static quizzes, students pair-program alongside synthetic autonomous agents that construct real pull requests, create failing test cases, and challenge architectural trade-offs."
    ],
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop",
    status: "Published",
    author: "Mentora AI Research",
    createdAt: "2026-09-13",
    updatedAt: "2026-09-13",
  },
];

const quizQuestions = [
  {
    id: 'q1',
    question: 'What is the primary role of the temperature parameter in LLM token generation?',
    options: [
      'Sets the maximum response length in tokens',
      'Controls the randomness and entropy of token probability sampling',
      'Speeds up the inference hardware compute cycles',
      'Determines the learning rate during gradient descent',
    ],
    correctIndex: 1,
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
    correctIndex: 1,
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
    correctIndex: 2,
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
    correctIndex: 1,
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
    correctIndex: 0,
    explanation: 'Strict schema enforcement guarantees responses adhere to expected types and properties, preventing runtime parsing exceptions.',
  },
];

const quizzesData = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    title: 'Prompt Engineering & GenAI Foundations Mastery',
    description: 'Evaluate your knowledge of sampling parameters, few-shot prompting, embeddings, RAG pipelines, and structured outputs.',
    passingScore: 70,
    rewardPoints: 100,
    totalQuestions: quizQuestions.length,
    questions: quizQuestions,
    createdAt: FieldValue.serverTimestamp(),
  },
  {
    id: '11111111-1111-1111-1111-111111111111',
    title: 'Prompt Engineering & GenAI Foundations Mastery',
    description: 'Evaluate your knowledge of sampling parameters, few-shot prompting, embeddings, RAG pipelines, and structured outputs.',
    passingScore: 70,
    rewardPoints: 100,
    totalQuestions: quizQuestions.length,
    questions: quizQuestions,
    createdAt: FieldValue.serverTimestamp(),
  }
];

const usersData = [
  {
    id: 'usr_sarah',
    userId: 'usr_sarah',
    name: 'Sarah Chen',
    email: 'sarah.chen@techcorp.io',
    role: 'learner',
    targetRole: 'Senior AI Systems Architect',
    experienceLevel: 'advanced',
    totalPoints: 3840,
    activitiesCount: 28,
    status: 'active',
    onboardingComplete: true,
    createdAt: new Date('2025-07-15'),
    updatedAt: new Date(),
  },
  {
    id: 'usr_alex_r',
    userId: 'usr_alex_r',
    name: 'Alex Rivera',
    email: 'alex.rivera@cloudscale.net',
    role: 'learner',
    targetRole: 'Staff Platform Engineer',
    experienceLevel: 'advanced',
    totalPoints: 3210,
    activitiesCount: 22,
    status: 'active',
    onboardingComplete: true,
    createdAt: new Date('2025-08-20'),
    updatedAt: new Date(),
  },
  {
    id: 'usr_priya_s',
    userId: 'usr_priya_s',
    name: 'Priya Sharma',
    email: 'priya.sharma@aimodels.org',
    role: 'learner',
    targetRole: 'AI Research Scientist',
    experienceLevel: 'intermediate',
    totalPoints: 2980,
    activitiesCount: 19,
    status: 'active',
    onboardingComplete: true,
    createdAt: new Date('2025-09-10'),
    updatedAt: new Date(),
  },
  {
    id: 'usr_alex_j',
    userId: 'usr_alex_j',
    name: 'Alex Johnson',
    email: 'alex.j@mentora.io',
    role: 'learner',
    targetRole: 'Full-Stack AI Developer',
    experienceLevel: 'intermediate',
    totalPoints: 2450,
    activitiesCount: 15,
    status: 'active',
    onboardingComplete: true,
    createdAt: new Date('2025-10-01'),
    updatedAt: new Date(),
  },
  {
    id: 'usr_1',
    userId: 'usr_1',
    name: 'Amara Okafor',
    email: 'amara.okafor@mentora.io',
    role: 'learner',
    targetRole: 'Senior AI Systems Architect',
    experienceLevel: 'advanced',
    totalPoints: 4210,
    activitiesCount: 24,
    status: 'active',
    onboardingComplete: true,
    createdAt: new Date('2025-11-02'),
    updatedAt: new Date(),
  },
  {
    id: 'usr_2',
    userId: 'usr_2',
    name: 'Diego Fernandez',
    email: 'diego.fernandez@mentora.io',
    role: 'mentor',
    targetRole: 'Lead Cloud Architect',
    experienceLevel: 'advanced',
    totalPoints: 8890,
    activitiesCount: 45,
    status: 'active',
    onboardingComplete: true,
    createdAt: new Date('2025-08-14'),
    updatedAt: new Date(),
  },
  {
    id: 'usr_3',
    userId: 'usr_3',
    name: 'Priya Natarajan',
    email: 'priya.n@mentora.io',
    role: 'learner',
    targetRole: 'AI Product Lead',
    experienceLevel: 'beginner',
    totalPoints: 120,
    activitiesCount: 2,
    status: 'active',
    onboardingComplete: true,
    createdAt: new Date('2026-01-20'),
    updatedAt: new Date(),
  },
  {
    id: 'usr_4',
    userId: 'usr_4',
    name: 'Lucas Bennett',
    email: 'lucas.bennett@mentora.io',
    role: 'admin',
    targetRole: 'Platform Administrator',
    experienceLevel: 'advanced',
    totalPoints: 0,
    activitiesCount: 0,
    status: 'active',
    onboardingComplete: true,
    createdAt: new Date('2024-05-30'),
    updatedAt: new Date(),
  },
  {
    id: 'usr_5',
    userId: 'usr_5',
    name: 'Hana Suzuki',
    email: 'hana.suzuki@mentora.io',
    role: 'learner',
    targetRole: 'Full-Stack AI Developer',
    experienceLevel: 'intermediate',
    totalPoints: 1560,
    activitiesCount: 12,
    status: 'active',
    onboardingComplete: true,
    createdAt: new Date('2025-12-11'),
    updatedAt: new Date(),
  },
  {
    id: 'usr_6',
    userId: 'usr_6',
    name: 'Michael Osei',
    email: 'michael.osei@mentora.io',
    role: 'mentor',
    targetRole: 'Senior MLOps Engineer',
    experienceLevel: 'advanced',
    totalPoints: 6300,
    activitiesCount: 38,
    status: 'active',
    onboardingComplete: true,
    createdAt: new Date('2025-06-19'),
    updatedAt: new Date(),
  },
];

const skillsData = [
  { id: 'skl_py', name: 'Python', category: 'Technical', field: 'Software Engineering', level: 'Intermediate', learners: 1240 },
  { id: 'skl_genai', name: 'GenAI Foundations', category: 'Technical', field: 'AI Engineering', level: 'Intermediate', learners: 980 },
  { id: 'skl_prompt', name: 'Prompt Engineering', category: 'Technical', field: 'AI Engineering', level: 'Intermediate', learners: 850 },
  { id: 'skl_rag', name: 'Embeddings & RAG', category: 'Technical', field: 'AI Engineering', level: 'Advanced', learners: 720 },
  { id: 'skl_llm_apis', name: 'LLM APIs & Tool Calling', category: 'Technical', field: 'AI Engineering', level: 'Advanced', learners: 690 },
  { id: 'skl_vecdb', name: 'Vector Databases', category: 'Technical', field: 'Data Engineering', level: 'Advanced', learners: 610 },
  { id: 'skl_agents', name: 'LangChain / AI Agents', category: 'Technical', field: 'AI Engineering', level: 'Advanced', learners: 540 },
  { id: 'skl_ft', name: 'Model Fine-Tuning', category: 'Technical', field: 'Machine Learning', level: 'Advanced', learners: 430 },
  { id: 'skl_arch', name: 'AI System Architecture', category: 'Technical', field: 'System Architecture', level: 'Advanced', learners: 510 },
  { id: 'skl_dsa', name: 'Data Structures & Algorithms', category: 'Technical', field: 'Software Engineering', level: 'Intermediate', learners: 812 },
  { id: 'skl_ts', name: 'Advanced TypeScript', category: 'Technical', field: 'Frontend / Fullstack', level: 'Advanced', learners: 740 },
  { id: 'skl_k8s', name: 'Kubernetes & Cloud Orchestration', category: 'Technical', field: 'DevOps & Cloud', level: 'Advanced', learners: 620 },
  { id: 'skl_kafka', name: 'Kafka & Event-Driven Systems', category: 'Technical', field: 'Distributed Systems', level: 'Advanced', learners: 580 },
  { id: 'skl_pm', name: 'Product Management', category: 'Professional', field: 'Business', level: 'Advanced', learners: 265 },
  { id: 'skl_speaking', name: 'Public Speaking', category: 'Non-Professional', field: 'Personal Growth', level: 'Beginner', learners: 431 },
];

const coursesData = [
  {
    id: 'demo',
    title: 'Senior AI Systems Architect Personalized Roadmap',
    description: 'Customized 3-tier career transformation pathway tailored for Senior AI Systems Architect.',
    category: 'AI Engineering',
    difficulty: 'advanced',
    status: 'published',
    createdBy: 'system',
    xpCount: 900,
    estimatedTime: 54 * 60,
    dailyGoal: 45,
    tags: ['AI Architecture', 'RAG', 'VectorDB', 'PEFT', 'Agents'],
    createdAt: new Date('2026-01-01'),
    updatedAt: new Date(),
    modulesCount: 9,
  },
  {
    id: 'cloud-architect',
    title: 'Full-Stack Cloud Architect',
    description: 'Master high-availability distributed systems, multi-region cloud resilience, and level-gated enterprise microservices.',
    category: 'Architecture',
    difficulty: 'advanced',
    status: 'published',
    createdBy: 'usr_2',
    xpCount: 2450,
    estimatedTime: 510,
    dailyGoal: 45,
    tags: ['Distributed Systems', 'AWS', 'Kafka', 'Terraform'],
    createdAt: new Date('2026-02-01'),
    updatedAt: new Date(),
    modulesCount: 5,
  },
  {
    id: 'ts-patterns',
    title: 'Advanced TypeScript Patterns',
    description: 'Type-level metaprogramming, template literal types, conditional types, and distributed schema validation.',
    category: 'Software Engineering',
    difficulty: 'intermediate',
    status: 'published',
    createdBy: 'usr_sarah',
    xpCount: 1800,
    estimatedTime: 360,
    dailyGoal: 30,
    tags: ['TypeScript', 'Static Analysis', 'Type Systems'],
    createdAt: new Date('2026-02-15'),
    updatedAt: new Date(),
    modulesCount: 4,
  },
  {
    id: 'backend-spec',
    title: 'Senior Backend & Distributed Systems Specialist',
    description: 'Go deep on high-throughput microservices, concurrency models, ACID vs BASE guarantees, and resilient database sharding.',
    category: 'Backend',
    difficulty: 'advanced',
    status: 'published',
    createdBy: 'usr_6',
    xpCount: 2800,
    estimatedTime: 480,
    dailyGoal: 45,
    tags: ['Go', 'PostgreSQL', 'Kafka', 'gRPC'],
    createdAt: new Date('2026-03-01'),
    updatedAt: new Date(),
    modulesCount: 6,
  },
];

const modulesData = [
  // Demo / AI Architect course modules (Level 1..3, Display order 1..9)
  {
    id: 'mod_ai_1',
    courseId: 'demo',
    title: 'Python for AI & Modern Systems',
    description: 'Core Python syntax, data structures, and asynchronous execution for AI services.',
    displayOrder: 1,
    xp: 100,
    estimatedTime: 480,
    status: 'active',
  },
  {
    id: 'mod_ai_2',
    courseId: 'demo',
    title: 'Generative AI Foundations & Architectures',
    description: 'Underlying concepts of transformer architectures, attention mechanisms, and tokens.',
    displayOrder: 2,
    xp: 100,
    estimatedTime: 360,
    status: 'active',
  },
  {
    id: 'mod_ai_3',
    courseId: 'demo',
    title: 'Advanced Prompt Engineering & System Design',
    description: 'Few-shot prompting, chain-of-thought, and structural schema enforcement.',
    displayOrder: 3,
    xp: 100,
    estimatedTime: 300,
    status: 'active',
  },
  {
    id: 'mod_ai_4',
    courseId: 'demo',
    title: 'Embeddings & Retrieval-Augmented Generation',
    description: 'Vector embeddings, chunking strategies, semantic similarity, and hybrid search.',
    displayOrder: 4,
    xp: 100,
    estimatedTime: 600,
    status: 'active',
  },
  {
    id: 'mod_ai_5',
    courseId: 'demo',
    title: 'LLM APIs, Function Calling & Structured Outputs',
    description: 'Integrating provider APIs, function routing, and strict JSON output validation.',
    displayOrder: 5,
    xp: 100,
    estimatedTime: 480,
    status: 'active',
  },
  {
    id: 'mod_ai_6',
    courseId: 'demo',
    title: 'Vector Database Indexing & Scalability',
    description: 'Postgres pgvector, HNSW vs IVFFlat indexing, and latency optimization.',
    displayOrder: 6,
    xp: 100,
    estimatedTime: 360,
    status: 'active',
  },
  {
    id: 'mod_ai_7',
    courseId: 'demo',
    title: 'Autonomous AI Agents & Multi-Step Reasoning',
    description: 'Building autonomous loops, ReAct agents, tool execution, and state machines.',
    displayOrder: 7,
    xp: 100,
    estimatedTime: 720,
    status: 'active',
  },
  {
    id: 'mod_ai_8',
    courseId: 'demo',
    title: 'Model Adaptation & Parameter-Efficient Fine-Tuning (PEFT)',
    description: 'LoRA, QLoRA, dataset curation, and evaluation against baseline models.',
    displayOrder: 8,
    xp: 100,
    estimatedTime: 840,
    status: 'active',
  },
  {
    id: 'mod_ai_9',
    courseId: 'demo',
    title: 'Production AI System Architecture & Observability',
    description: 'Resilience, caching, token economics, latency profiling, and guardrails.',
    displayOrder: 9,
    xp: 100,
    estimatedTime: 600,
    status: 'active',
  },

  // Cloud Architect modules
  {
    id: 'mod_ca_1',
    courseId: 'cloud-architect',
    title: 'Core Cloud Resilience & Multi-Region VPCs',
    description: 'Designing fail-safe multi-region VPC topologies and high availability transit gateways.',
    displayOrder: 1,
    xp: 150,
    estimatedTime: 45,
    status: 'active',
  },
  {
    id: 'mod_ca_2',
    courseId: 'cloud-architect',
    title: 'Scalable API Gateways & Edge Routing',
    description: 'Configuring low-latency edge caching, rate limiting, and mTLS microservice authentication.',
    displayOrder: 2,
    xp: 150,
    estimatedTime: 55,
    status: 'active',
  },
  {
    id: 'mod_ca_3',
    courseId: 'cloud-architect',
    title: 'Cloud Architecture Diagnostic Drill',
    description: 'Interactive system design drill assessing failover scenarios and disaster recovery MTTR.',
    displayOrder: 3,
    xp: 200,
    estimatedTime: 30,
    status: 'active',
  },
  {
    id: 'mod_ca_4',
    courseId: 'cloud-architect',
    title: 'Distributed Event-Driven Queues with Kafka',
    description: 'Partition rebalancing, consumer groups, exactly-once delivery guarantees, and backpressure.',
    displayOrder: 4,
    xp: 250,
    estimatedTime: 70,
    status: 'active',
  },
  {
    id: 'mod_ca_5',
    courseId: 'cloud-architect',
    title: 'Byzantine Fault Recovery Audit',
    description: 'Simulating node partitions, consensus failure modes, and automated recovery procedures.',
    displayOrder: 5,
    xp: 300,
    estimatedTime: 45,
    status: 'active',
  },

  // Backend Specialist modules
  {
    id: 'mod_bs_1',
    courseId: 'backend-spec',
    title: 'High-Throughput Go & Concurrency Primitives',
    description: 'Goroutines, channels, sync primitives, and low-latency runtime tuning.',
    displayOrder: 1,
    xp: 200,
    estimatedTime: 60,
    status: 'active',
  },
  {
    id: 'mod_bs_2',
    courseId: 'backend-spec',
    title: 'PostgreSQL Internals, MVCC & ACID Guarantees',
    description: 'WAL logs, transaction isolation levels, indexing mechanics, and vacuum tuning.',
    displayOrder: 2,
    xp: 250,
    estimatedTime: 75,
    status: 'active',
  },
  {
    id: 'mod_bs_3',
    courseId: 'backend-spec',
    title: 'Distributed Consensus & Raft Implementations',
    description: 'Leader election, log replication, safety invariants, and network partitions.',
    displayOrder: 3,
    xp: 300,
    estimatedTime: 90,
    status: 'active',
  },

  // TypeScript Patterns modules
  {
    id: 'mod_ts_1',
    courseId: 'ts-patterns',
    title: 'Advanced Generics & Conditional Types',
    description: 'Infer keyword, recursive type definitions, and union distribution.',
    displayOrder: 1,
    xp: 150,
    estimatedTime: 45,
    status: 'active',
  },
  {
    id: 'mod_ts_2',
    courseId: 'ts-patterns',
    title: 'Template Literal Types & Type-Safe Parsers',
    description: 'Building DSL parsers and type-safe router matchers at compile time.',
    displayOrder: 2,
    xp: 200,
    estimatedTime: 60,
    status: 'active',
  },
];

const lessonsData = modulesData.map((m, idx) => ({
  id: `les_${m.id}`,
  moduleId: m.id,
  title: m.title,
  description: m.description,
  content: `Comprehensive hands-on lesson covering ${m.title}. Explore real-world code patterns, trade-offs, and production verification harnesses.`,
  type: 'article',
  displayOrder: 1,
  xp: m.xp,
  estimatedTime: m.estimatedTime,
  status: 'active',
  createdAt: FieldValue.serverTimestamp(),
}));

const communitiesData = [
  {
    id: "com_1",
    name: "Product Builders Circle",
    description: "A space for PMs and founders to trade playbooks and get feedback.",
    category: "Business",
    visibility: "Public",
    membersCount: 142,
    createdAt: new Date('2025-10-01'),
  },
  {
    id: "com_2",
    name: "Code & Coffee",
    description: "Casual daily check-ins for engineers working through DSA and systems architecture.",
    category: "Software Engineering",
    visibility: "Public",
    membersCount: 289,
    createdAt: new Date('2025-11-15'),
  },
  {
    id: "com_3",
    name: "AI & Neural Systems Group",
    description: "Deep-dives into LLM fine-tuning, retrieval techniques, agentic loops, and GPU optimization.",
    category: "AI Engineering",
    visibility: "Public",
    membersCount: 375,
    createdAt: new Date('2026-01-10'),
  },
];

const dailyTasksData = [
  {
    id: "tsk_1",
    title: "Complete one diagnostic drill",
    description: "Finish any single module lesson or quiz to maintain your daily streak.",
    points: 20,
    difficulty: "Easy",
    active: true,
  },
  {
    id: "tsk_2",
    title: "Post in an engineering community",
    description: "Share a technical insight, question, or architecture win in any community.",
    points: 15,
    difficulty: "Easy",
    active: true,
  },
  {
    id: "tsk_3",
    title: "Pass a mastery checkpoint quiz",
    description: "Score at least 70% on any module quiz or milestone diagnostic.",
    points: 40,
    difficulty: "Medium",
    active: true,
  },
  {
    id: "tsk_4",
    title: "Complete an architectural case review",
    description: "Submit an architectural trade-off breakdown on a distributed system problem.",
    points: 60,
    difficulty: "Hard",
    active: true,
  },
];

const achievementsData = [
  {
    id: "ach_first_drill",
    title: "First Steps",
    description: "Complete your first diagnostic learning module.",
    points: 50,
    icon: "🚀",
  },
  {
    id: "ach_quiz_master",
    title: "Perfect Recall",
    description: "Score 100% on a diagnostic mastery quiz.",
    points: 100,
    icon: "🎯",
  },
  {
    id: "ach_streak_7",
    title: "Consistency Champion",
    description: "Maintain a continuous 7-day study streak.",
    points: 150,
    icon: "🔥",
  },
  {
    id: "ach_tier1_grad",
    title: "Tier 1 Foundations Mastery",
    description: "Complete all foundation modules in your personalized journey.",
    points: 250,
    icon: "👑",
  },
];

// ==========================================
// SEED RUNNER FUNCTION
// ==========================================

async function seedFirestore() {
  console.log('🚀 Starting Firebase Firestore Database Seed for Mentora...\n');

  try {
    // 1. Seed blogs
    console.log('📝 Seeding "blogs" collection...');
    const blogsBatch = db.batch();
    for (const blog of blogsData) {
      const ref = db.collection('blogs').doc(blog.id);
      blogsBatch.set(ref, {
        ...blog,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
    }
    await blogsBatch.commit();
    console.log(`✅ Seeded ${blogsData.length} blogs successfully.\n`);

    // 2. Seed quizzes
    console.log('🧠 Seeding "quizzes" collection...');
    const quizzesBatch = db.batch();
    for (const quiz of quizzesData) {
      const ref = db.collection('quizzes').doc(quiz.id);
      quizzesBatch.set(ref, quiz, { merge: true });
    }
    await quizzesBatch.commit();
    console.log(`✅ Seeded ${quizzesData.length} quizzes successfully.\n`);

    // 3. Seed users
    console.log('👥 Seeding "users" collection...');
    const usersBatch = db.batch();
    for (const user of usersData) {
      const ref = db.collection('users').doc(user.id);
      usersBatch.set(ref, user, { merge: true });
    }
    await usersBatch.commit();
    console.log(`✅ Seeded ${usersData.length} users successfully.\n`);

    // 4. Seed skills
    console.log('⚡ Seeding "skills" collection...');
    const skillsBatch = db.batch();
    for (const skill of skillsData) {
      const ref = db.collection('skills').doc(skill.id);
      skillsBatch.set(ref, {
        ...skill,
        createdAt: FieldValue.serverTimestamp(),
      }, { merge: true });
    }
    await skillsBatch.commit();
    console.log(`✅ Seeded ${skillsData.length} skills successfully.\n`);

    // 5. Seed courses
    console.log('🎓 Seeding "courses" collection...');
    const coursesBatch = db.batch();
    for (const course of coursesData) {
      const ref = db.collection('courses').doc(course.id);
      coursesBatch.set(ref, course, { merge: true });
    }
    await coursesBatch.commit();
    console.log(`✅ Seeded ${coursesData.length} courses successfully.\n`);

    // 6. Seed modules
    console.log('📦 Seeding "modules" collection...');
    const modulesBatch = db.batch();
    for (const moduleItem of modulesData) {
      const ref = db.collection('modules').doc(moduleItem.id);
      modulesBatch.set(ref, {
        ...moduleItem,
        createdAt: FieldValue.serverTimestamp(),
      }, { merge: true });
    }
    await modulesBatch.commit();
    console.log(`✅ Seeded ${modulesData.length} modules successfully.\n`);

    // 7. Seed lessons
    console.log('📖 Seeding "lessons" collection...');
    const lessonsBatch = db.batch();
    for (const lesson of lessonsData) {
      const ref = db.collection('lessons').doc(lesson.id);
      lessonsBatch.set(ref, lesson, { merge: true });
    }
    await lessonsBatch.commit();
    console.log(`✅ Seeded ${lessonsData.length} lessons successfully.\n`);

    // 8. Seed communities
    console.log('🌐 Seeding "communities" collection...');
    const comBatch = db.batch();
    for (const com of communitiesData) {
      const ref = db.collection('communities').doc(com.id);
      comBatch.set(ref, com, { merge: true });
    }
    await comBatch.commit();
    console.log(`✅ Seeded ${communitiesData.length} communities successfully.\n`);

    // 9. Seed daily_tasks
    console.log('📋 Seeding "daily_tasks" collection...');
    const tasksBatch = db.batch();
    for (const task of dailyTasksData) {
      const ref = db.collection('daily_tasks').doc(task.id);
      tasksBatch.set(ref, task, { merge: true });
    }
    await tasksBatch.commit();
    console.log(`✅ Seeded ${dailyTasksData.length} daily_tasks successfully.\n`);

    // 10. Seed achievements
    console.log('🏆 Seeding "achievements" collection...');
    const achBatch = db.batch();
    for (const ach of achievementsData) {
      const ref = db.collection('achievements').doc(ach.id);
      achBatch.set(ref, ach, { merge: true });
    }
    await achBatch.commit();
    console.log(`✅ Seeded ${achievementsData.length} achievements successfully.\n`);

    // 11. Seed user_courses
    console.log('📚 Seeding "user_courses" collection...');
    const userCoursesData = [
      { id: 'usr_1_cloud-architect', userId: 'usr_1', courseId: 'cloud-architect', progress: 72, status: 'in_progress' },
      { id: 'usr_1_demo', userId: 'usr_1', courseId: 'demo', progress: 33, status: 'in_progress' },
      { id: 'usr_sarah_demo', userId: 'usr_sarah', courseId: 'demo', progress: 85, status: 'in_progress' },
      { id: 'usr_2_cloud-architect', userId: 'usr_2', courseId: 'cloud-architect', progress: 100, status: 'completed' },
      { id: 'usr_alex_r_backend-spec', userId: 'usr_alex_r', courseId: 'backend-spec', progress: 50, status: 'in_progress' },
    ];
    const ucBatch = db.batch();
    for (const uc of userCoursesData) {
      const ref = db.collection('user_courses').doc(uc.id);
      ucBatch.set(ref, {
        ...uc,
        enrolledAt: FieldValue.serverTimestamp(),
        lastAccessedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
    }
    await ucBatch.commit();
    console.log(`✅ Seeded ${userCoursesData.length} user_courses successfully.\n`);

    // 12. Seed user_skills
    console.log('🎯 Seeding "user_skills" collection...');
    const userSkillsData = [
      { id: 'usr_1_Python', userId: 'usr_1', skillName: 'Python', level: 4 },
      { id: 'usr_1_GenAI_Foundations', userId: 'usr_1', skillName: 'GenAI Foundations', level: 4 },
      { id: 'usr_1_Prompt_Engineering', userId: 'usr_1', skillName: 'Prompt Engineering', level: 3 },
      { id: 'usr_sarah_Vector_Databases', userId: 'usr_sarah', skillName: 'Vector Databases', level: 4 },
      { id: 'usr_sarah_AI_System_Architecture', userId: 'usr_sarah', skillName: 'AI System Architecture', level: 4 },
    ];
    const usBatch = db.batch();
    for (const us of userSkillsData) {
      const ref = db.collection('user_skills').doc(us.id);
      usBatch.set(ref, {
        ...us,
        createdAt: FieldValue.serverTimestamp(),
      }, { merge: true });
    }
    await usBatch.commit();
    console.log(`✅ Seeded ${userSkillsData.length} user_skills successfully.\n`);

    // 13. Seed lesson_progress
    console.log('📊 Seeding "lesson_progress" collection...');
    const lessonProgressData = [
      { id: 'usr_1_les_mod_ai_1', userId: 'usr_1', lessonId: 'les_mod_ai_1', status: 'completed', progress: 100 },
      { id: 'usr_1_les_mod_ai_2', userId: 'usr_1', lessonId: 'les_mod_ai_2', status: 'completed', progress: 100 },
      { id: 'usr_1_les_mod_ai_3', userId: 'usr_1', lessonId: 'les_mod_ai_3', status: 'in_progress', progress: 50 },
      { id: 'usr_sarah_les_mod_ai_1', userId: 'usr_sarah', lessonId: 'les_mod_ai_1', status: 'completed', progress: 100 },
    ];
    const lpBatch = db.batch();
    for (const lp of lessonProgressData) {
      const ref = db.collection('lesson_progress').doc(lp.id);
      lpBatch.set(ref, {
        ...lp,
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
    }
    await lpBatch.commit();
    console.log(`✅ Seeded ${lessonProgressData.length} lesson_progress successfully.\n`);

    // 14. Seed user_streaks
    console.log('🔥 Seeding "user_streaks" collection...');
    const userStreaksData = [
      { id: 'usr_1', userId: 'usr_1', currentStreak: 5, longestStreak: 14, lastActivityDate: '2026-09-15' },
      { id: 'usr_sarah', userId: 'usr_sarah', currentStreak: 8, longestStreak: 21, lastActivityDate: '2026-09-15' },
      { id: 'usr_2', userId: 'usr_2', currentStreak: 12, longestStreak: 30, lastActivityDate: '2026-09-15' },
    ];
    const streakBatch = db.batch();
    for (const strk of userStreaksData) {
      const ref = db.collection('user_streaks').doc(strk.id);
      streakBatch.set(ref, {
        ...strk,
        updatedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
    }
    await streakBatch.commit();
    console.log(`✅ Seeded ${userStreaksData.length} user_streaks successfully.\n`);

    // 15. Seed xps
    console.log('💎 Seeding "xps" collection...');
    const xpsData = [
      { id: 'xp_1', userId: 'usr_1', points: 100, source: 'quiz', refId: '00000000-0000-0000-0000-000000000001' },
      { id: 'xp_2', userId: 'usr_1', points: 150, source: 'module', refId: 'mod_ca_1' },
      { id: 'xp_3', userId: 'usr_sarah', points: 250, source: 'quiz', refId: '00000000-0000-0000-0000-000000000001' },
      { id: 'xp_4', userId: 'usr_2', points: 300, source: 'module', refId: 'mod_ca_5' },
    ];
    const xpBatch = db.batch();
    for (const xp of xpsData) {
      const ref = db.collection('xps').doc(xp.id);
      xpBatch.set(ref, {
        ...xp,
        createdAt: FieldValue.serverTimestamp(),
      }, { merge: true });
    }
    await xpBatch.commit();
    console.log(`✅ Seeded ${xpsData.length} xps records successfully.\n`);

    console.log('🎉 ALL FIRESTORE COLLECTIONS SEEDED & UPDATED SUCCESSFULLY!\n');
  } catch (error) {
    console.error('❌ Error during Firestore seeding:', error);
    process.exit(1);
  }

  process.exit(0);
}

seedFirestore();
