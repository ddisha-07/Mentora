import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb, FieldValue } from '@/utils/firebase/admin';
import { buildJourney, classifyLevel, ExperienceLevel, predictSkillGaps } from '@/lib/personalization';

const ROLE_SKILL_TARGETS: Record<string, string[]> = {
  'Senior AI Systems Architect': [
    'Python',
    'GenAI Foundations',
    'Prompt Engineering',
    'Embeddings & RAG',
    'LLM APIs & Tool Calling',
    'Vector Databases',
    'LangChain / AI Agents',
    'Model Fine-Tuning',
    'AI System Architecture',
  ],
  'AI Product Lead': [
    'AI Fundamentals',
    'Understanding LLM Capabilities',
    'AI Product Strategy',
    'AI UX & Product Design',
    'Evaluating AI Products & Metrics',
    'AI Ethics & Governance',
    'AI Product Roadmap Execution',
  ],
  'Senior MLOps Engineer': [
    'Python',
    'GenAI Foundations',
    'Vector Databases',
    'LLM APIs & Tool Calling',
    'Model Fine-Tuning',
    'AI System Architecture',
  ],
  'Full-Stack AI Developer': [
    'Python',
    'GenAI Foundations',
    'Prompt Engineering',
    'Embeddings & RAG',
    'LLM APIs & Tool Calling',
    'Vector Databases',
  ],
  'Data & Analytics Strategist': [
    'AI Fundamentals',
    'Understanding LLM Capabilities',
    'Vector Databases',
    'AI Product Strategy',
    'AI Ethics & Governance',
  ],
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      fullName = 'Learner',
      currentRole = 'Software Developer',
      yearsOfExperience = 3,
      targetRole = 'Senior AI Systems Architect',
      experienceLevel,
      currentSkills = [],
    } = body;

    // 1. Identify user
    const sessionCookie = request.cookies.get('mentora_session')?.value || '';
    let resolvedUserId: string | null = null;
    let userEmail = 'learner@mentora.ai';

    if (sessionCookie) {
      try {
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
        resolvedUserId = decodedClaims.uid;
        userEmail = decodedClaims.email || userEmail;
      } catch (e) {}
    }

    if (!resolvedUserId) {
      // In NoSQL, if no session, we create an anonymous doc or error out. 
      // Assuming they must be logged in for onboarding.
      return NextResponse.json(
        { error: 'Authentication required for onboarding' },
        { status: 401 }
      );
    }

    const batch = adminDb.batch();

    // 2. Update user display name in users collection
    const userRef = adminDb.collection('users').doc(resolvedUserId);
    batch.set(userRef, {
      name: fullName,
      updatedAt: FieldValue.serverTimestamp(),
      onboardingComplete: true
    }, { merge: true });

    // 3. Classify Experience Level
    let resolvedLevel: ExperienceLevel = 'intermediate';
    if (experienceLevel === 'beginner' || experienceLevel === 'intermediate' || experienceLevel === 'advanced') {
      resolvedLevel = experienceLevel;
    } else {
      resolvedLevel = classifyLevel({
        yearsOfExperience: Number(yearsOfExperience) || 3,
        knownSkillsCount: Array.isArray(currentSkills) ? currentSkills.length : 3,
      });
    }

    // 4. Save existing user skills to user_skills & skills master
    const skillLevelNumber = resolvedLevel === 'advanced' ? 4 : resolvedLevel === 'intermediate' ? 3 : 2;
    if (Array.isArray(currentSkills)) {
      for (const skillName of currentSkills) {
        if (!skillName || typeof skillName !== 'string') continue;
        const normalizedSkillName = skillName.trim();
        
        // We'll just create a user_skill document directly to avoid querying the master in a loop.
        // A Cloud Function can aggregate these into a master list if needed.
        const userSkillRef = adminDb.collection('user_skills').doc(`${resolvedUserId}_${normalizedSkillName.replace(/\s+/g, '_')}`);
        batch.set(userSkillRef, {
          userId: resolvedUserId,
          skillName: normalizedSkillName,
          level: skillLevelNumber,
          createdAt: FieldValue.serverTimestamp(),
        }, { merge: true });
      }
    }

    // 5. Match Target Skills & Predict Skill Gaps
    const targetRoleSkills = ROLE_SKILL_TARGETS[targetRole] || ROLE_SKILL_TARGETS['Senior AI Systems Architect'];

    const gapResult = predictSkillGaps({
      currentSkills: Array.isArray(currentSkills) ? currentSkills : [],
      targetRoleSkills,
    });

    let missingSkills = gapResult.missingSkills;
    if (missingSkills.length === 0) {
      missingSkills = targetRoleSkills.slice(-3);
    }

    // 6. Run Journey Builder Personalization Engine
    const journeyPlan = buildJourney({
      role: targetRole,
      missingSkills,
      userLevel: resolvedLevel,
    });

    // 7. Save Course (Personalized Journey) in courses collection
    const newCourseRef = adminDb.collection('courses').doc();
    batch.set(newCourseRef, {
      title: `${targetRole} Personalized Roadmap`,
      description: `Customized 3-tier career transformation pathway tailored for ${targetRole}.`,
      category: 'AI Engineering',
      difficulty: resolvedLevel,
      status: 'published',
      createdBy: resolvedUserId,
      xpCount: journeyPlan.totalModules * 100,
      estimatedTime: journeyPlan.totalModules * 8 * 60, // minutes
      dailyGoal: 45, // 45 mins per day
      tags: [targetRole, resolvedLevel, ...missingSkills.slice(0, 3)],
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });

    // 8. Enroll User in Course (user_courses)
    const userCourseRef = adminDb.collection('user_courses').doc(`${resolvedUserId}_${newCourseRef.id}`);
    batch.set(userCourseRef, {
      userId: resolvedUserId,
      courseId: newCourseRef.id,
      status: 'in_progress',
      progress: 0,
      startedAt: FieldValue.serverTimestamp(),
      enrolledAt: FieldValue.serverTimestamp(),
    });

    // 9. Insert Course Modules and Lessons
    const allModules = journeyPlan.levels.flatMap((lvl) => lvl.modules);

    for (let i = 0; i < allModules.length; i++) {
      const m = allModules[i];
      const modRef = adminDb.collection('modules').doc();
      batch.set(modRef, {
        courseId: newCourseRef.id,
        title: m.title,
        description: m.description,
        displayOrder: m.order,
        xp: 100,
        estimatedTime: (m.estimatedHours || 6) * 60,
        status: 'active',
        createdAt: FieldValue.serverTimestamp(),
      });

      // Create linked lesson
      const lessonRef = adminDb.collection('lessons').doc();
      batch.set(lessonRef, {
        moduleId: modRef.id,
        title: m.title,
        description: m.description,
        content: `Comprehensive learning module covering ${m.skill}.`,
        type: 'article',
        displayOrder: 1,
        xp: 100,
        estimatedTime: (m.estimatedHours || 6) * 60,
        status: 'active',
        createdAt: FieldValue.serverTimestamp(),
      });

      // Track lesson progress
      const lessonProgressRef = adminDb.collection('lesson_progress').doc(`${resolvedUserId}_${lessonRef.id}`);
      batch.set(lessonProgressRef, {
        userId: resolvedUserId,
        lessonId: lessonRef.id,
        status: i === 0 ? 'in_progress' : 'not_started',
        progress: 0,
        startedAt: i === 0 ? FieldValue.serverTimestamp() : null,
      });
    }

    // 10. Award Welcome XP in xps collection
    const xpRef = adminDb.collection('xps').doc();
    batch.set(xpRef, {
      userId: resolvedUserId,
      points: 50,
      source: 'bonus',
      refId: newCourseRef.id,
      createdAt: FieldValue.serverTimestamp(),
    });

    // Update user's total points as well (denormalized)
    batch.set(userRef, {
      totalPoints: FieldValue.increment(50),
      activitiesCount: FieldValue.increment(1)
    }, { merge: true });

    // 11. Initialize Streak
    const streakRef = adminDb.collection('user_streaks').doc(resolvedUserId);
    batch.set(streakRef, {
      userId: resolvedUserId,
      currentStreak: 1,
      longestStreak: 1,
      lastActivityDate: new Date().toISOString().split('T')[0],
      updatedAt: FieldValue.serverTimestamp(),
    }, { merge: true });

    // Commit all writes atomically
    await batch.commit();

    return NextResponse.json({
      success: true,
      journeyId: newCourseRef.id,
      courseId: newCourseRef.id,
      title: `${targetRole} Personalized Roadmap`,
      role: targetRole,
      level: resolvedLevel,
      missingSkills,
      matchPercentage: gapResult.matchPercentage,
      totalModules: journeyPlan.totalModules,
      redirectUrl: `/journeys/${newCourseRef.id}`,
      message: 'Personalized course synthesized successfully into backend database',
    });
  } catch (error) {
    console.error('Error processing onboarding:', error);
    return NextResponse.json(
      { error: 'Internal server error processing onboarding' },
      { status: 500 }
    );
  }
}
