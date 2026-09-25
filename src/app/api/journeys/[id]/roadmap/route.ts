import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/utils/firebase/admin';
import { mockCourses } from '@/lib/admin/data/mockCourses';
import { devEnrollmentStore } from '@/lib/courses/enrollmentStore';

export const dynamic = 'force-dynamic';

const LEVEL_NAMES: Record<number, string> = {
  1: 'Foundations & Core Architecture',
  2: 'Practical Implementations & Deep Dives',
  3: 'Advanced Specialization & Production Gates',
};

// Helper: Curate video fallback matching course category if module has no video
function getFallbackVideoForCategory(category: string = '', title: string = '') {
  const cat = `${category} ${title}`.toLowerCase();
  if (cat.includes('web') || cat.includes('react') || cat.includes('frontend') || cat.includes('javascript')) {
    return {
      title: 'Modern Web Development & React Architecture',
      youtubeId: 'bMknfKXIFA8',
      channel: 'freeCodeCamp.org',
      duration: '30 min',
      summary: 'Comprehensive visual exploration of component lifecycles, state management, and modern architectures.',
    };
  }
  if (cat.includes('algorithm') || cat.includes('data structure') || cat.includes('dsa') || cat.includes('computer science')) {
    return {
      title: 'Algorithms and Data Structures Tutorial',
      youtubeId: '8hly31xKli0',
      channel: 'freeCodeCamp.org',
      duration: '35 min',
      summary: 'Complete algorithmic masterclass covering runtime analysis, graph traversals, and dynamic programming.',
    };
  }
  if (cat.includes('cloud') || cat.includes('aws') || cat.includes('devops') || cat.includes('docker') || cat.includes('kubernetes')) {
    return {
      title: 'Cloud Architecture & Distributed Resilience',
      youtubeId: 'hiKPPy582N8',
      channel: 'AWS re:Invent',
      duration: '45 min',
      summary: 'Deep dive into multi-region cloud transit networks, load balancing, and fault tolerance.',
    };
  }
  return {
    title: 'Neural Networks & Deep Learning Essentials',
    youtubeId: 'aircAruvnKk',
    channel: '3Blue1Brown',
    duration: '19 min',
    summary: 'Visually stunning explanation of mathematical mechanics, weights, and high-dimensional spaces.',
  };
}

// Decompose any database course into 3 Units of 5 discrete single-activity stepping stone tiles (15 total)
function buildSteppingStonesForCourse(courseDocId: string, course: any, rawModules: any[]): any[] {
  const isCrs1 = courseDocId === 'crs_1';
  const cTitle = course.title || 'Course';
  const cCat = course.category || 'Professional Track';

  const m1 = rawModules[0] || {};
  const m2 = rawModules.length >= 3 ? rawModules[1] : (rawModules[1] || rawModules[0] || {});
  const m3 = rawModules.length >= 3 ? rawModules[rawModules.length - 1] : (rawModules[2] || rawModules[1] || rawModules[0] || {});

  const tiles: any[] = [];

  // ════════════════════════════════════════════════════════════════════════
  // UNIT 1: FOUNDATIONS & CORE ARCHITECTURE
  // ════════════════════════════════════════════════════════════════════════
  const u1Title = m1.title || `${cTitle} Foundations`;
  const u1Content = (m1.content && (m1.content.summary || m1.content.title)) ? m1.content : {
    title: `${u1Title}: Mental Models`,
    readTime: '2 min read',
    tagline: m1.tagline || 'Core concepts made intuitive and visual!',
    summary: m1.description || course.description || `Learn the foundational principles and core mental models of ${cTitle}.`,
    funAnalogy: `💡 Think of ${u1Title} like foundational Lego blocks: get the base plates sturdy and connected before stacking higher layers!`,
    keyTakeaways: [
      `Computers and frameworks model patterns from explicit rules or learned data in ${cTitle}.`,
      'Deconstruct complex systems into clean, modular, and testable units.',
      'Always verify baseline assumptions with hands-on mental models.'
    ]
  };

  const u1Cards = (Array.isArray(m1.flashcards) && m1.flashcards.length > 0)
    ? m1.flashcards
    : (Array.isArray(course.resources?.flashcards) && course.resources.flashcards.length > 0)
    ? course.resources.flashcards
    : [
      { id: `${courseDocId}_fc_1_1`, question: `What is the primary foundation of ${u1Title}?`, answer: `Decomposing problems into predictable, isolated, and verifiable components.`, tag: 'Foundations' },
      { id: `${courseDocId}_fc_1_2`, question: `Why is active recall essential when learning ${cTitle}?`, answer: `Active recall stimulates memory retrieval pathways, producing dramatically higher retention than passive reading.`, tag: 'Best Practice' },
      { id: `${courseDocId}_fc_1_3`, question: `What is the #1 rookie pitfall in ${u1Title}?`, answer: `Over-engineering before establishing solid fundamentals and understanding edge cases.`, tag: 'Core Principles' }
    ];

  const u1Video = (m1.video && m1.video.youtubeId)
    ? m1.video
    : (course.resources?.videos?.[0]?.youtubeId ? course.resources.videos[0] : getFallbackVideoForCategory(cCat, u1Title));

  const u1Dialogue = (m1.dialogue && Array.isArray(m1.dialogue.qaList) && m1.dialogue.qaList.length > 0)
    ? m1.dialogue
    : {
      mentorName: 'Byte the AI Coach 🤖',
      mentorAvatar: '🤖',
      tagline: `Ask me anything about ${u1Title}!`,
      suggestedQuestions: [
        `What is the best way to understand ${u1Title}?`,
        `Give me a memorable analogy for this topic.`
      ],
      qaList: [
        { question: `What is the best way to understand ${u1Title}?`, answer: `Focus on the inputs, transformations, and outputs! If you can trace data flow from start to finish, the rest is just syntax.` },
        { question: `Give me a memorable analogy for this topic.`, answer: `Think of it like learning to play an instrument: master finger positions and tempo before attempting lightning-fast solos!` }
      ]
    };

  const u1Gate = (m1.passGate && m1.passGate.quiz?.questions?.length)
    ? m1.passGate
    : {
      type: 'quiz',
      quiz: {
        title: `${u1Title} Mastery Gate 🎯`,
        passingScore: 70,
        questions: [
          {
            id: `${courseDocId}_q1_1`,
            question: `In ${cTitle}, what is the foundational practice for building scalable solutions?`,
            options: [
              'Writing modular, single-responsibility components with automated validation',
              'Putting all business logic into a single monolithic script',
              'Skipping local testing and deploying straight to production',
              'Ignoring error handling and logging'
            ],
            correctAnswer: 0,
            funFact: 'Modular single-responsibility architectures ensure high testability and maintainability!'
          },
          {
            id: `${courseDocId}_q1_2`,
            question: `Why is automated verification critical at the foundational stage?`,
            options: [
              'It catches regressions early and provides fast feedback loops for learners',
              'It slows down development intentionally',
              'It encrypts the hard drive',
              'It deletes database records automatically'
            ],
            correctAnswer: 0,
            funFact: 'Fast feedback loops are the secret to rapid skill mastery.'
          }
        ]
      }
    };

  tiles.push({
    id: isCrs1 ? 'mod_1' : `${courseDocId}_u1_concept`,
    journeyId: courseDocId,
    courseId: courseDocId,
    level: 1,
    order: 1,
    activityType: 'concept',
    icon: '📖',
    title: u1Content.title || `${u1Title}: Concept Bite`,
    subtitle: '90-Second Power Bite & Mental Models',
    tagline: u1Content.tagline || m1.tagline || 'Core concepts made intuitive and visual!',
    skill: `${cCat} Foundations`,
    description: u1Content.summary || 'Learn foundational patterns and mental models.',
    duration: u1Content.readTime || '2 min read',
    xpPoints: 50,
    content: u1Content,
  });

  tiles.push({
    id: isCrs1 ? 'act_1_fc' : `${courseDocId}_u1_fc`,
    journeyId: courseDocId,
    courseId: courseDocId,
    level: 1,
    order: 2,
    activityType: 'flashcards',
    icon: '🃏',
    title: `Flashcards: ${u1Title}`,
    subtitle: 'Active Recall Terminology Practice',
    tagline: `Test your recall on key ${u1Title} principles`,
    skill: 'Active Recall',
    description: 'Quick active-recall flashcard deck testing foundational terminology.',
    duration: '4 mins',
    xpPoints: 75,
    flashcards: u1Cards,
  });

  tiles.push({
    id: isCrs1 ? 'act_1_vid' : `${courseDocId}_u1_vid`,
    journeyId: courseDocId,
    courseId: courseDocId,
    level: 1,
    order: 3,
    activityType: 'video',
    icon: '🎥',
    title: `Video: ${u1Video.title || u1Title}`,
    subtitle: `${u1Video.channel || 'Mentora Academy'} Visual Masterclass`,
    tagline: 'Visual explanations, mechanics, and mental models',
    skill: 'Visual Architecture',
    description: u1Video.summary || 'Visual explanation of core concepts and architecture.',
    duration: u1Video.duration || '18 min',
    xpPoints: 100,
    video: u1Video,
  });

  tiles.push({
    id: isCrs1 ? 'act_1_coach' : `${courseDocId}_u1_coach`,
    journeyId: courseDocId,
    courseId: courseDocId,
    level: 1,
    order: 4,
    activityType: 'dialogue',
    icon: '🤖',
    title: `AI Coach: ${u1Title} Intuition Check`,
    subtitle: `Interactive Discussion with ${u1Dialogue.mentorName || 'AI Mentor'}`,
    tagline: u1Dialogue.tagline || 'Clarify tricky concepts with your personal mentor',
    skill: 'Conceptual Intuition',
    description: 'Engage with your AI Coach to clarify tricky concepts and check your mental models.',
    duration: '5 mins',
    xpPoints: 75,
    dialogue: u1Dialogue,
  });

  tiles.push({
    id: isCrs1 ? 'act_1_gate' : `${courseDocId}_u1_gate`,
    journeyId: courseDocId,
    courseId: courseDocId,
    level: 1,
    order: 5,
    activityType: 'quiz',
    icon: '🎯',
    title: `Unit 1 Mastery Duel: ${u1Gate.quiz?.title || 'Foundations Gate'}`,
    subtitle: 'Pass with 70% to Unlock Unit 2',
    tagline: 'Prove conceptual mastery to unlock Unit 2 and bonus loot',
    skill: 'Foundations Mastery',
    description: 'Evaluation gate testing core principles. Earn +150 XP and unlock Unit 2 upon scoring 70% or higher.',
    duration: '10 mins',
    xpPoints: 150,
    passGate: u1Gate,
  });

  // ════════════════════════════════════════════════════════════════════════
  // UNIT 2: PRACTICAL IMPLEMENTATIONS & DEEP DIVES
  // ════════════════════════════════════════════════════════════════════════
  const u2Title = m2.title || `${cTitle} Mechanics`;
  const u2Content = (m2.content && (m2.content.summary || m2.content.title)) ? m2.content : {
    title: `${u2Title}: Deep Dive & Mechanics`,
    readTime: '3 min read',
    tagline: m2.tagline || 'Explore real-world mechanics and non-linear patterns!',
    summary: m2.description || `Delve into the mathematical mechanics, runtime transformations, and practical implementations of ${u2Title}.`,
    funAnalogy: `📐 Origami: Stacking flat sheets of paper only gives a thicker flat stack. Folding and creasing (mechanics) lets you shape complex 3D structures!`,
    keyTakeaways: [
      `Master the runtime mechanics and internal state transitions of ${u2Title}.`,
      'Optimize performance through intelligent caching, memoization, or gradient bounds.',
      'Prevent common production pitfalls like state leaks, race conditions, or overfitting.'
    ]
  };

  const u2Cards = (Array.isArray(m2.flashcards) && m2.flashcards.length > 0)
    ? m2.flashcards
    : [
      { id: `${courseDocId}_fc_2_1`, question: `What is the core implementation challenge in ${u2Title}?`, answer: `Managing state transitions, memory boundaries, and asynchronous synchronization cleanly.`, tag: 'Mechanics' },
      { id: `${courseDocId}_fc_2_2`, question: `How do you diagnose performance bottlenecks in ${u2Title}?`, answer: `By profiling memory allocation, measuring latency percentiles (p99), and inspecting flame graphs.`, tag: 'Optimization' },
      { id: `${courseDocId}_fc_2_3`, question: `What distinguishes intermediate practice from beginner scripts?`, answer: `Adhering to strict immutability, type safety, modular decoupling, and deterministic error handling.`, tag: 'Best Practice' }
    ];

  const u2Video = (m2.video && m2.video.youtubeId)
    ? m2.video
    : getFallbackVideoForCategory(cCat, u2Title);

  const u2Task = m2.passGate?.task || {
    missionTitle: `Hands-on Mission: Build with ${u2Title} 🛠️`,
    xpReward: 120,
    estimatedTime: '15 mins',
    dailyGoal: `Implement a working prototype demonstrating core mechanics of ${u2Title}.`,
    instructions: `Write and test a clean, focused script or component verifying the key behavior of ${u2Title}.`,
    checklist: [
      `Step 1: Set up sample input parameters and baseline configurations for ${u2Title}`,
      'Step 2: Apply core transformation logic and verify outputs match expected invariants',
      'Step 3: Test edge cases (null inputs, empty states, or boundaries) to ensure robustness'
    ],
    dailyTip: 'Hands-on muscle memory cements mental models 10x faster than passive reading!'
  };

  const u2Gate = (m2.passGate && m2.passGate.quiz?.questions?.length)
    ? m2.passGate
    : {
      type: 'quiz',
      quiz: {
        title: `${u2Title} Architecture Gate 🎯`,
        passingScore: 70,
        questions: [
          {
            id: `${courseDocId}_q2_1`,
            question: `Which strategy is most effective for maintaining high performance in ${u2Title}?`,
            options: [
              'Avoiding unnecessary duplicate computations via memoization or efficient indexing',
              'Running infinite recursive loops without termination conditions',
              'Allocating all memory globally without garbage collection',
              'Blocking the event loop with synchronous network calls'
            ],
            correctAnswer: 0,
            funFact: 'Efficient indexing and memoization eliminate redundant computation and keep response times sub-millisecond!'
          },
          {
            id: `${courseDocId}_q2_2`,
            question: `What occurs when state mutations violate immutability standards?`,
            options: [
              'Downstream listeners and change detectors fail to update reliably, leading to subtle state bugs',
              'Code execution becomes 100x faster',
              'Network bandwidth automatically doubles',
              'The compiler converts JavaScript into Python'
            ],
            correctAnswer: 0,
            funFact: 'Immutability enables fast shallow equality checks (===) and predictable reactivity!'
          }
        ]
      }
    };

  tiles.push({
    id: isCrs1 ? 'mod_2' : `${courseDocId}_u2_concept`,
    journeyId: courseDocId,
    courseId: courseDocId,
    level: 2,
    order: 6,
    activityType: 'concept',
    icon: '🧠',
    title: u2Content.title || `Concept: ${u2Title}`,
    subtitle: 'Practical Mechanics & Mental Models',
    tagline: u2Content.tagline || m2.tagline || 'Deep dive into practical implementation patterns',
    skill: `${cCat} Mechanics`,
    description: u2Content.summary || 'Understand deep architecture mechanics and implementation patterns.',
    duration: u2Content.readTime || '3 min read',
    xpPoints: 50,
    content: u2Content,
  });

  tiles.push({
    id: isCrs1 ? 'act_2_fc' : `${courseDocId}_u2_fc`,
    journeyId: courseDocId,
    courseId: courseDocId,
    level: 2,
    order: 7,
    activityType: 'flashcards',
    icon: '🃏',
    title: `Flashcards: ${u2Title}`,
    subtitle: 'Mechanics & Architecture Recall Deck',
    tagline: `Reinforce your grasp of ${u2Title} patterns`,
    skill: 'Deep Implementation',
    description: 'Reinforce your grasp of implementation mechanics, state boundaries, and optimization.',
    duration: '4 mins',
    xpPoints: 75,
    flashcards: u2Cards,
  });

  tiles.push({
    id: isCrs1 ? 'act_2_vid' : `${courseDocId}_u2_vid`,
    journeyId: courseDocId,
    courseId: courseDocId,
    level: 2,
    order: 8,
    activityType: 'video',
    icon: '🎥',
    title: `Video: ${u2Video.title || u2Title}`,
    subtitle: `${u2Video.channel || 'Mentora Studio'} Deep Dive`,
    tagline: 'Visual exploration of high-scale implementation mechanics',
    skill: 'Implementation Video',
    description: u2Video.summary || 'Watch code come alive visually with detailed architecture walkthroughs.',
    duration: u2Video.duration || '21 min',
    xpPoints: 100,
    video: u2Video,
  });

  tiles.push({
    id: isCrs1 ? 'act_2_task' : `${courseDocId}_u2_task`,
    journeyId: courseDocId,
    courseId: courseDocId,
    level: 2,
    order: 9,
    activityType: 'task',
    icon: '🛠️',
    title: u2Task.missionTitle || `Hands-on Mission: ${u2Title}`,
    subtitle: 'Interactive Guided Implementation',
    tagline: `Build and test a working prototype for ${u2Title}`,
    skill: 'Hands-on Code',
    description: u2Task.dailyGoal || 'Implement and test a working prototype demonstrating core mechanics.',
    duration: '15 mins',
    xpPoints: 120,
    passGate: {
      type: 'task',
      task: u2Task,
    },
  });

  tiles.push({
    id: isCrs1 ? 'act_2_gate' : `${courseDocId}_u2_gate`,
    journeyId: courseDocId,
    courseId: courseDocId,
    level: 2,
    order: 10,
    activityType: 'quiz',
    icon: '🎯',
    title: `Unit 2 Mastery Duel: ${u2Gate.quiz?.title || 'Architecture Gate'}`,
    subtitle: 'Pass with 70% to Unlock Unit 3',
    tagline: 'Test your mechanics and unlock the final unit',
    skill: 'Architecture Mastery',
    description: 'Evaluation gate testing practical mechanics and optimization.',
    duration: '10 mins',
    xpPoints: 150,
    passGate: u2Gate,
  });

  // ════════════════════════════════════════════════════════════════════════
  // UNIT 3: ADVANCED SPECIALIZATION & PRODUCTION GATES
  // ════════════════════════════════════════════════════════════════════════
  const u3Title = m3.title || `${cTitle} Production Mastery`;
  const u3Content = (m3.content && (m3.content.summary || m3.content.title)) ? m3.content : {
    title: `${u3Title}: Enterprise Scale & Reliability`,
    readTime: '4 min read',
    tagline: m3.tagline || 'Deploy with zero downtime, high availability, and telemetry monitoring!',
    summary: m3.description || `Master enterprise-grade scalability, observability, automated recovery, and production benchmarking for ${cTitle}.`,
    funAnalogy: `🚨 Smoke Alarm: In high-scale production systems, resilience means designing components to fail gracefully without bringing down the entire cluster!`,
    keyTakeaways: [
      `Design for high availability with automated health checks and graceful degradation in ${cTitle}.`,
      'Implement structured telemetry, tracing, and metric alerts to catch regressions proactively.',
      'Deploy using canary or blue-green rollout strategies to prevent production outages.'
    ]
  };

  const u3Cards = (Array.isArray(m3.flashcards) && m3.flashcards.length > 0)
    ? m3.flashcards
    : [
      { id: `${courseDocId}_fc_3_1`, question: `What is the Golden Rule of Production Reliability in ${cTitle}?`, answer: `Assume every network call, disk write, and dependency will eventually fail; implement timeouts, retries with backoff, and circuit breakers!`, tag: 'Production' },
      { id: `${courseDocId}_fc_3_2`, question: `Why are Canary Deployments preferred over big-bang releases?`, answer: `Canary rollouts expose new changes to a tiny percentage (e.g. 5%) of real traffic to verify metrics before wider release.`, tag: 'Deployment' },
      { id: `${courseDocId}_fc_3_3`, question: `What is the significance of the 99th percentile (p99) latency?`, answer: `p99 latency measures the slowest 1% of user experiences, which heavily impacts user perception and system bottlenecks under load.`, tag: 'Observability' }
    ];

  const u3Video = (m3.video && m3.video.youtubeId)
    ? m3.video
    : getFallbackVideoForCategory(cCat, u3Title);

  const u3Dialogue = (m3.dialogue && Array.isArray(m3.dialogue.qaList) && m3.dialogue.qaList.length > 0)
    ? m3.dialogue
    : {
      mentorName: m3.dialogue?.mentorName || 'Byte the AI Coach 🤖',
      mentorAvatar: m3.dialogue?.mentorAvatar || '🤖',
      tagline: `Your guide to enterprise production mastery in ${cTitle}!`,
      suggestedQuestions: [
        `How do enterprise teams monitor ${cTitle} in production?`,
        `What is the #1 lesson learned from production outages?`
      ],
      qaList: [
        { question: `How do enterprise teams monitor ${cTitle} in production?`, answer: `They rely on the Three Pillars of Observability: Metrics (latency/error rates), Structured Logs (event context), and Distributed Traces (request waterfalls)!` },
        { question: `What is the #1 lesson learned from production outages?`, answer: `Always have an instant, one-click rollback mechanism and tested automated circuit breakers before deploying any major update!` }
      ]
    };

  const u3Gate = (m3.passGate && m3.passGate.quiz?.questions?.length)
    ? m3.passGate
    : {
      type: 'quiz',
      quiz: {
        title: `Grand Master Production Certification Gate 🏆`,
        passingScore: 70,
        questions: [
          {
            id: `${courseDocId}_q3_1`,
            question: `In high-scale enterprise production, what deployment pattern safest avoids total outage regressions?`,
            options: [
              'Canary rollouts with automated health check rollbacks',
              'Directly editing code files in the production container live',
              'Deleting all backup databases before applying migrations',
              'Deploying on Friday evening without monitoring dashboards'
            ],
            correctAnswer: 0,
            funFact: 'Canary deployments limit risk by exposing only a small fraction of traffic to new builds.'
          },
          {
            id: `${courseDocId}_q3_2`,
            question: `What metric best measures high-tail user friction under heavy concurrent traffic?`,
            options: [
              'p99 (99th percentile) latency',
              'Raw average latency of 1 request',
              'Total line count of CSS files',
              'Screen refresh rate of developer monitor'
            ],
            correctAnswer: 0,
            funFact: 'p99 latency reveals the worst-case delays experienced by high-volume users.'
          }
        ]
      }
    };

  tiles.push({
    id: isCrs1 ? 'mod_7' : `${courseDocId}_u3_concept`,
    journeyId: courseDocId,
    courseId: courseDocId,
    level: 3,
    order: 11,
    activityType: 'concept',
    icon: '🚀',
    title: u3Content.title || `Concept: ${u3Title}`,
    subtitle: 'Advanced Enterprise Specialization',
    tagline: u3Content.tagline || m3.tagline || 'Master advanced production patterns and scaling laws',
    skill: `${cCat} Specialization`,
    description: u3Content.summary || 'Discover advanced architectural patterns and production strategies.',
    duration: u3Content.readTime || '4 min read',
    xpPoints: 50,
    content: u3Content,
  });

  tiles.push({
    id: isCrs1 ? 'act_3_fc' : `${courseDocId}_u3_fc`,
    journeyId: courseDocId,
    courseId: courseDocId,
    level: 3,
    order: 12,
    activityType: 'flashcards',
    icon: '🃏',
    title: `Flashcards: ${u3Title}`,
    subtitle: 'Production Mechanics Deck',
    tagline: 'Active recall on production reliability and telemetry',
    skill: 'Production Recall',
    description: 'Test your understanding of high-scale trade-offs, circuit breakers, and monitoring.',
    duration: '4 mins',
    xpPoints: 75,
    flashcards: u3Cards,
  });

  tiles.push({
    id: isCrs1 ? 'act_3_vid' : `${courseDocId}_u3_vid`,
    journeyId: courseDocId,
    courseId: courseDocId,
    level: 3,
    order: 13,
    activityType: 'video',
    icon: '🎥',
    title: `Video: ${u3Video.title || u3Title}`,
    subtitle: `${u3Video.channel || 'Mentora Studio'} Masterclass`,
    tagline: 'Visual masterclass on enterprise architecture',
    skill: 'Visual Specialization',
    description: u3Video.summary || 'Visual masterclass on production architecture and resilience.',
    duration: u3Video.duration || '26 min',
    xpPoints: 100,
    video: u3Video,
  });

  tiles.push({
    id: isCrs1 ? 'act_3_coach' : `${courseDocId}_u3_coach`,
    journeyId: courseDocId,
    courseId: courseDocId,
    level: 3,
    order: 14,
    activityType: 'dialogue',
    icon: '🤖',
    title: `AI Coach: ${u3Title} Masterclass`,
    subtitle: `Discussion with ${u3Dialogue.mentorName || 'AI Mentor'} on Production`,
    tagline: u3Dialogue.tagline || 'Ask your AI mentor about scaling laws and production reliability',
    skill: 'Enterprise Mechanics',
    description: 'Engage with your AI Coach on production trade-offs and modern enterprise architectures.',
    duration: '5 mins',
    xpPoints: 75,
    dialogue: u3Dialogue,
  });

  tiles.push({
    id: isCrs1 ? 'mod_8' : `${courseDocId}_u3_gate`,
    journeyId: courseDocId,
    courseId: courseDocId,
    level: 3,
    order: 15,
    activityType: 'quiz',
    icon: '🎯',
    title: u3Gate.quiz?.title || 'Grand Master Production Gate 🏆',
    subtitle: 'Final Certification Gate Duel',
    tagline: 'Prove production mastery to earn your course certificate',
    skill: 'Production Certification',
    description: 'Final comprehensive evaluation gate testing production readiness, error handling, and reliability.',
    duration: '12 mins',
    xpPoints: 200,
    passGate: u3Gate,
  });

  return tiles;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Resolve user session
    const sessionCookie = request.cookies.get('mentora_session')?.value || '';
    let userId: string | null = null;
    if (sessionCookie) {
      try {
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
        userId = decodedClaims.uid;
      } catch (e) {}
    }

    let targetCourseId = id;
    let courseDocData: any = null;
    let courseDocId: string | null = null;

    // 1. Try Firestore lookup
    try {
      if (id === 'active') {
        const coursesQuery = adminDb.collection('courses').orderBy('createdAt', 'desc').limit(1);
        if (userId) {
          try {
            const userCoursesSnap = await adminDb.collection('user_courses').where('userId', '==', userId).get();
            if (!userCoursesSnap.empty) {
              const sorted = userCoursesSnap.docs.sort((a: any, b: any) => {
                const timeA = a.data().lastAccessedAt?.toMillis?.() || new Date(a.data().lastAccessedAt || 0).getTime();
                const timeB = b.data().lastAccessedAt?.toMillis?.() || new Date(b.data().lastAccessedAt || 0).getTime();
                return timeB - timeA;
              });
              const activeCourseId = sorted[0].data()?.courseId;
              if (activeCourseId) {
                targetCourseId = activeCourseId;
              }
            }
          } catch (e) {}
        }

        if (targetCourseId === 'active') {
          const snap = await coursesQuery.get();
          if (!snap.empty) {
            courseDocId = snap.docs[0].id;
            courseDocData = snap.docs[0].data();
          }
        }
      }

      if (!courseDocData && targetCourseId !== 'active') {
        const docSnap = await adminDb.collection('courses').doc(targetCourseId).get();
        if (docSnap.exists) {
          courseDocId = docSnap.id;
          courseDocData = docSnap.data();
        }
      }
    } catch (dbErr: any) {
      console.warn('Firestore read notice in roadmap GET:', dbErr?.message);
    }

    // 2. Fallback to mockCourses (admin seed courses)
    if (!courseDocData) {
      const normalizedTarget = targetCourseId.toLowerCase().trim();
      const matchedMock = mockCourses.find((c: any) => c.id.toLowerCase() === normalizedTarget)
        || mockCourses.find((c: any) => c.title?.toLowerCase().includes(normalizedTarget))
        || mockCourses[0];

      if (matchedMock) {
        courseDocData = matchedMock;
        courseDocId = matchedMock.id;
      }
    }

    if (!courseDocData || !courseDocId) {
      return NextResponse.json(
        { error: 'No course found for this roadmap.' },
        { status: 404 }
      );
    }

    // 3. Collect modules from Firestore or directly from courseDocData
    let rawModules: any[] = [];
    try {
      const modulesSnap = await adminDb.collection('modules')
        .where('courseId', '==', courseDocId)
        .get();

      if (!modulesSnap.empty) {
        rawModules = modulesSnap.docs
          .map((doc: any) => ({ id: doc.id, ...doc.data() as any }))
          .sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0));
      }
    } catch {}

    if (rawModules.length === 0 && Array.isArray(courseDocData.modules) && courseDocData.modules.length > 0) {
      rawModules = courseDocData.modules;
    }

    // 4. Retrieve completed module IDs for the current user and this specific course
    const completedSet = new Set<string>();
    const effectiveUserId = userId || 'guest_user';

    try {
      const userCourseDoc = await adminDb.collection('user_courses').doc(`${effectiveUserId}_${courseDocId}`).get();
      if (userCourseDoc.exists) {
        const data = userCourseDoc.data();
        if (Array.isArray(data?.completedModules)) {
          data.completedModules.forEach((mId: string) => completedSet.add(mId));
        }
      }
    } catch {}

    // Also check devEnrollmentStore fallback
    const devDoc = devEnrollmentStore.get(`${effectiveUserId}_${courseDocId}`);
    if (Array.isArray(devDoc?.completedModules)) {
      devDoc.completedModules.forEach((mId: string) => completedSet.add(mId));
    }
    if (courseDocId === 'demo') {
      const devDemoDoc = devEnrollmentStore.get(`${effectiveUserId}_demo`);
      if (Array.isArray(devDemoDoc?.completedModules)) {
        devDemoDoc.completedModules.forEach((mId: string) => completedSet.add(mId));
      }
    }

    // 5. Build 15 discrete single-activity stepping stone tiles
    const rawTiles = buildSteppingStonesForCourse(courseDocId, courseDocData, rawModules);

    // 6. Assign status (completed, available, locked) sequentially across all 15 single-activity tiles
    const levelsMap: Record<number, any[]> = { 1: [], 2: [], 3: [] };
    let firstIncompleteFound = false;

    for (let i = 0; i < rawTiles.length; i++) {
      const tile = rawTiles[i];
      tile.content = tile.content || {};
      tile.flashcards = tile.flashcards || [];
      tile.video = tile.video || null;
      tile.dialogue = tile.dialogue || null;
      tile.passGate = tile.passGate || { type: 'quiz' };

      const isCompleted = completedSet.has(tile.id);

      let status: 'completed' | 'available' | 'in_progress' | 'locked' = 'locked';
      if (isCompleted) {
        status = 'completed';
      } else if (!firstIncompleteFound) {
        status = 'available';
        firstIncompleteFound = true;
      } else {
        status = 'locked';
      }

      tile.status = status;
      levelsMap[tile.level].push(tile);
    }

    const levels = [1, 2, 3]
      .filter((lvl) => levelsMap[lvl] && levelsMap[lvl].length > 0)
      .map((lvl) => ({
        level: lvl,
        name: LEVEL_NAMES[lvl] || `Level ${lvl}`,
        modules: levelsMap[lvl] || [],
      }));

    const totalXpSum = rawTiles.reduce((acc: number, t: any) => acc + (t.xpPoints || 100), 0);

    return NextResponse.json({
      journey: {
        id: courseDocId,
        title: courseDocData.title,
        category: courseDocData.category || 'Professional Track',
        role: courseDocData.category || courseDocData.title,
        level: courseDocData.level || courseDocData.difficulty || 'Intermediate',
        duration: courseDocData.duration || '6 Weeks',
        totalModules: rawTiles.length,
        totalXp: totalXpSum,
      },
      levels,
    });
  } catch (error: any) {
    console.error('Error fetching journey roadmap:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error fetching roadmap' },
      { status: 500 }
    );
  }
}
