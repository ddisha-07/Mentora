require('dotenv').config({ path: '.env.local' });
require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const initialBlogs = [
  {
    id: "blg-agentic-ai",
    num: "05",
    category: "AI Systems",
    tab_label: "ARTICLE 05",
    sub_tab_label: "AI SYSTEMS",
    tab_position: "left",
    theme: "dark-charcoal",
    primary_tab_color: "#EA580C",
    date: "SEP 13, 2026",
    read_time: "5 MIN READ",
    title: "Agentic AI",
    kicker: "AI",
    synopsis: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1866, when designers at Letraset and James Mosley, the librarian...",
    tags: JSON.stringify(["#AI", "#Agents", "#Agentic AI"]),
    takeaways: JSON.stringify([
      "Autonomous agents execute iterative planning loops with real-time feedback.",
      "Context isolation prevents tool hallucinations and state pollution.",
      "Multi-agent orchestration delivers durable reliability on production workloads."
    ]),
    full_body: JSON.stringify([
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1866, when designers at Letraset and James Mosley, the librarian...",
      "Autonomous agents are redefining how software engineers orchestrate complex development cycles. By combining chain-of-thought verification with specialized subagents, modern architectures achieve deterministic problem-solving.",
      "In Mentora, agentic workflows simulate senior architectural code reviews, isolating edge cases before code hits staging environments."
    ]),
    image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
    status: "Published",
    author: "Mentora AI Research",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "blg-01",
    num: "01",
    category: "Pedagogy",
    tab_label: "ARTICLE 01",
    sub_tab_label: "PEDAGOGY & SYSTEMS",
    tab_position: "left",
    theme: "dark-charcoal",
    primary_tab_color: "#2563EB",
    date: "SEP 14, 2026",
    read_time: "6 MIN READ",
    title: "Level-Gated Progression",
    kicker: "COGNITIVE SCAFFOLDING & PEDAGOGY",
    synopsis: "Why structured prerequisite gates beat infinite, unguided video libraries every single time. Scaffolding knowledge eliminates cognitive fatigue and accelerates retention.",
    tags: JSON.stringify(["#Pedagogy", "#CognitiveLoad", "#ActiveRecall", "#Gamification"]),
    takeaways: JSON.stringify([
      "Unguided libraries lead to passive bingeing without durable memory formation.",
      "Prerequisite gating forces mastery of fundamental mental models before unlocking abstractions.",
      "Immediate diagnostic feedback creates rapid dopamine loops that build consistency."
    ]),
    full_body: JSON.stringify([
      "Modern professionals are drowning in course catalogs. When given a library with 8,000 video lectures, the paradox of choice creates immediate cognitive friction. Learners skip fundamentals to watch trendy topics, accumulate fragmented understanding, and abandon the roadmap after two weeks.",
      "At Mentora, we adopted a level-gated progression architecture inspired by game loop design and Vygotsky’s Zone of Proximal Development. You cannot unlock distributed consensus until you have proven active recall mastery of local concurrency primitives.",
      "By enforcing strict prerequisite gates, we reduce cognitive overwhelm to zero. Every session has exactly one next step, calibrated to your current edge of competence."
    ]),
    image_url: "",
    status: "Published",
    author: "Mentora Pedagogy Lab",
    created_at: "2026-09-14T00:00:00Z",
    updated_at: "2026-09-14T00:00:00Z"
  },
  {
    id: "blg-02",
    num: "02",
    category: "Algorithms",
    tab_label: "ARTICLE 02",
    sub_tab_label: "ALGORITHMIC ENGINE",
    tab_position: "right",
    theme: "warm-amber",
    primary_tab_color: "#F59E0B",
    date: "AUG 28, 2026",
    read_time: "8 MIN READ",
    title: "Skill-Gap Diagnostics",
    kicker: "VECTOR EMBEDDINGS & MARKET DIFFING",
    synopsis: "Getting a new engineer from day one to shipping without the panic. Computing real-time weighted set differences between your current competency matrix and production standards.",
    tags: JSON.stringify(["#VectorEmbeddings", "#SkillMatrix", "#CareerMapping", "#Algorithms"]),
    takeaways: JSON.stringify([
      "Skills are not binary keywords; they are high-dimensional competency vectors.",
      "Market diffing pinpoints the exact 15% delta between senior and staff expectations.",
      "Automated remediation plans turn months of vague anxiety into 3-week tactical sprints."
    ]),
    full_body: JSON.stringify([
      "When engineers join a new tier of engineering responsibility, the hardest part is not knowing what you do not know. Traditional performance reviews identify weaknesses six months too late, usually during high-stakes annual evaluations.",
      "Mentora continuously calculates your personal competency vector against 40,000+ real-world production repos and engineering benchmarks. We compute the exact directional cosine distance between your proven skills and target architecture archetypes.",
      "Instead of generic advice like 'get better at systems', you get a concrete diagnostic: 'Your distributed caching invalidation logic is 28% below Staff baseline. Complete these 3 simulation drills to bridge the delta.'"
    ]),
    image_url: "",
    status: "Published",
    author: "Mentora Intelligence Lab",
    created_at: "2026-08-28T00:00:00Z",
    updated_at: "2026-08-28T00:00:00Z"
  },
  {
    id: "blg-03",
    num: "03",
    category: "Credentials",
    tab_label: "ARTICLE 03",
    sub_tab_label: "PROVABLE REPUTATION",
    tab_position: "left",
    theme: "deep-espresso",
    primary_tab_color: "#EA580C",
    date: "AUG 12, 2026",
    read_time: "5 MIN READ",
    title: "The 70% Mastery Standard",
    kicker: "CREDENTIAL INTEGRITY & RIGOR",
    synopsis: "Why we fail learners who score 68% and why hiring partners love us for it. The mathematical imperative for uncompromising mastery in critical engineering domains.",
    tags: JSON.stringify(["#ProofOfWork", "#MasteryStandards", "#HiringIntegrity", "#Credentials"]),
    takeaways: JSON.stringify([
      "Completion certificates have zero hiring signal in the modern tech economy.",
      "A strict 70% non-negotiable threshold guarantees production reliability.",
      "Provable proof-of-work badges eliminate 80% of technical interview cycles."
    ]),
    full_body: JSON.stringify([
      "The certificate of completion is dead. In an era where anyone can leave a video playing in a background tab to collect a PDF diploma, engineering leaders have stopped caring about credential claims.",
      "At Mentora, every level boss requires an absolute 70% passing score on hardened production dilemmas under timed, sandboxed conditions. If you score 69%, the gate stays locked.",
      "This unyielding standard is why hiring managers trust Mentora Skill Passports. When a candidate presents a verified Mentora badge, engineering directors know they have survived real production failure drills."
    ]),
    image_url: "",
    status: "Published",
    author: "Mentora Verification Team",
    created_at: "2026-08-12T00:00:00Z",
    updated_at: "2026-08-12T00:00:00Z"
  },
  {
    id: "blg-04",
    num: "04",
    category: "AI Systems",
    tab_label: "ARTICLE 04",
    sub_tab_label: "SOCRATIC COGNITION",
    tab_position: "right",
    theme: "warm-parchment",
    primary_tab_color: "#D97706",
    date: "JUL 30, 2026",
    read_time: "7 MIN READ",
    title: "Contextual AI Companion",
    kicker: "SOCRATIC INTELLIGENCE & TUTORING",
    synopsis: "How fine-tuned LLMs analyze code bottlenecks in real-time without giving away the answer. Teaching engineers how to think, unblock themselves, and build lasting intuition.",
    tags: JSON.stringify(["#ArtificialIntelligence", "#LLMs", "#SocraticTutoring", "#CodeReview"]),
    takeaways: JSON.stringify([
      "Copilots that give away answers cripple long-term problem-solving ability.",
      "Socratic prompting guides the learner to discover the root cause themselves.",
      "Inline contextual diffs train the brain to spot architectural smells before running code."
    ]),
    full_body: JSON.stringify([
      "AI coding assistants that automatically paste the solution have created an illusion of competence. When the model goes away or an unprecedented production bug appears, engineers find themselves helpless.",
      "Mentora’s AI companion is deliberately constrained by Socratic heuristics. If your database query causes an N+1 cascade, it doesn’t rewrite your query. It highlights the execution plan and asks: 'Notice the query count in the inner loop. How could a single batch join change the latency curve?'",
      "This shifts the mental model from mindless copy-pasting to deep, intuitive understanding."
    ]),
    image_url: "",
    status: "Published",
    author: "Mentora Cognitive Research",
    created_at: "2026-07-30T00:00:00Z",
    updated_at: "2026-07-30T00:00:00Z"
  }
];

async function seed() {
  try {
    await client.connect();
    console.log('Seeding initial blogs into PostgreSQL...');

    for (const b of initialBlogs) {
      const query = `
        INSERT INTO blogs (
          id, num, category, tab_label, sub_tab_label, tab_position,
          theme, primary_tab_color, date, read_time, title, kicker,
          synopsis, tags, takeaways, full_body, image_url, status,
          author, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6,
          $7, $8, $9, $10, $11, $12,
          $13, $14, $15, $16, $17, $18,
          $19, $20, $21
        )
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          category = EXCLUDED.category,
          kicker = EXCLUDED.kicker,
          synopsis = EXCLUDED.synopsis,
          tags = EXCLUDED.tags,
          takeaways = EXCLUDED.takeaways,
          full_body = EXCLUDED.full_body,
          image_url = EXCLUDED.image_url,
          status = EXCLUDED.status,
          updated_at = NOW();
      `;

      await client.query(query, [
        b.id, b.num, b.category, b.tab_label, b.sub_tab_label, b.tab_position,
        b.theme, b.primary_tab_color, b.date, b.read_time, b.title, b.kicker,
        b.synopsis, b.tags, b.takeaways, b.full_body, b.image_url, b.status,
        b.author, b.created_at, b.updated_at
      ]);
    }

    const countRes = await client.query('SELECT count(*) FROM blogs;');
    console.log('Seeded successfully! Total blogs in PostgreSQL:', countRes.rows[0].count);
    await client.end();
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
