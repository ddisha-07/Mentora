export interface BlogArticle {
  id: string;
  num?: string;
  category: string;
  tabLabel?: string;
  subTabLabel?: string;
  tabPosition?: 'left' | 'right';
  theme?: 'dark-charcoal' | 'warm-amber' | 'deep-espresso' | 'warm-parchment';
  primaryTabColor?: string;
  date: string;
  readTime: string;
  title: string;
  kicker?: string;
  synopsis: string;
  tags: string[];
  takeaways: string[];
  fullBody: string[];
  imageUrl?: string;
  status: 'Published' | 'Draft';
  author?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const mockBlogs: BlogArticle[] = [
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
    synopsis:
      "Why structured prerequisite gates beat infinite, unguided video libraries every single time. Scaffolding knowledge eliminates cognitive fatigue and accelerates retention.",
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
    synopsis:
      "Getting a new engineer from day one to shipping without the panic. Computing real-time weighted set differences between your current competency matrix and production standards.",
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
    synopsis:
      "Why multiple-choice certificates are dead and how cryptographically verifiable proof-of-work is replacing resumes for engineering and leadership talent.",
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
    synopsis:
      "How continuous evaluation models adjust quiz difficulty and study cadences in real-time, eliminating plateaus and boredom for advanced professionals.",
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
    synopsis:
      "From passive next-token prediction to goal-directed autonomous agents: how recursive self-critique, external tool use, and multi-agent coordination redefine software engineering.",
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
