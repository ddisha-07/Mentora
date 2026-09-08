import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import {
  courseModules,
  courses,
  lessonProgress,
  lessons,
  skills,
  userCourses,
  users,
  userSkills,
  userStreaks,
  xps,
} from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
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
    const session = await getSession();
    let resolvedUserId = session?.userId;

    if (!resolvedUserId) {
      const [latestUser] = await db
        .select({ userId: users.userId })
        .from(users)
        .orderBy(desc(users.createdAt))
        .limit(1);

      if (latestUser) {
        resolvedUserId = latestUser.userId;
      } else {
        const { hashPassword } = await import('@/lib/auth');
        const defaultHash = await hashPassword('mentora_learner');
        const [newUser] = await db
          .insert(users)
          .values({
            email: 'learner@mentora.ai',
            name: fullName || 'Learner',
            password: defaultHash,
            role: 'employee',
            status: 'active',
          })
          .returning();
        resolvedUserId = newUser.userId;
      }
    }

    // 2. Update user display name in users table
    if (fullName) {
      await db
        .update(users)
        .set({ name: fullName, updatedAt: new Date() })
        .where(eq(users.userId, resolvedUserId));
    }

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

    // 4. Save existing user skills to user_skills & skills master table
    const skillLevelNumber = resolvedLevel === 'advanced' ? 4 : resolvedLevel === 'intermediate' ? 3 : 2;
    if (Array.isArray(currentSkills)) {
      for (const skillName of currentSkills) {
        if (!skillName || typeof skillName !== 'string') continue;
        const normalizedSkillName = skillName.trim();
        
        let [masterSkill] = await db
          .select()
          .from(skills)
          .where(eq(skills.name, normalizedSkillName))
          .limit(1);

        if (!masterSkill) {
          [masterSkill] = await db
            .insert(skills)
            .values({
              name: normalizedSkillName,
              type: 'technical',
              status: 'active',
            })
            .returning();
        }

        // Upsert user_skills
        const [existingUserSkill] = await db
          .select()
          .from(userSkills)
          .where(eq(userSkills.userId, resolvedUserId))
          .limit(1);

        if (!existingUserSkill) {
          await db
            .insert(userSkills)
            .values({
              userId: resolvedUserId,
              skillId: masterSkill.id,
              level: skillLevelNumber,
            })
            .onConflictDoNothing();
        }
      }
    }

    // 5. Match Target Skills & Predict Skill Gaps
    const targetRoleSkills =
      ROLE_SKILL_TARGETS[targetRole] ||
      ROLE_SKILL_TARGETS['Senior AI Systems Architect'];

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

    // 7. Save Course (Personalized Journey) in courses table
    const [newCourse] = await db
      .insert(courses)
      .values({
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
      })
      .returning();

    // 8. Enroll User in Course (user_courses)
    await db
      .insert(userCourses)
      .values({
        userId: resolvedUserId,
        courseId: newCourse.id,
        status: 'in_progress',
        progress: '0.00',
        startedAt: new Date(),
      })
      .onConflictDoNothing();

    // 9. Insert Course Modules and Lessons
    const allModules = journeyPlan.levels.flatMap((lvl) => lvl.modules);

    for (let i = 0; i < allModules.length; i++) {
      const m = allModules[i];
      const [insertedModule] = await db
        .insert(courseModules)
        .values({
          courseId: newCourse.id,
          title: m.title,
          description: m.description,
          displayOrder: m.order,
          xp: 100,
          estimatedTime: (m.estimatedHours || 6) * 60,
          status: 'active',
        })
        .returning();

      // Create linked lesson
      const [insertedLesson] = await db
        .insert(lessons)
        .values({
          moduleId: insertedModule.id,
          title: m.title,
          description: m.description,
          content: `Comprehensive learning module covering ${m.skill}.`,
          type: 'article',
          displayOrder: 1,
          xp: 100,
          estimatedTime: (m.estimatedHours || 6) * 60,
          status: 'active',
        })
        .returning();

      // Track lesson progress (Module #1 is available immediately, others not_started)
      await db
        .insert(lessonProgress)
        .values({
          userId: resolvedUserId,
          lessonId: insertedLesson.id,
          status: i === 0 ? 'in_progress' : 'not_started',
          progress: '0.00',
          startedAt: i === 0 ? new Date() : null,
        })
        .onConflictDoNothing();
    }

    // 10. Award Welcome XP in xps table
    await db
      .insert(xps)
      .values({
        userId: resolvedUserId,
        points: 50,
        source: 'bonus',
        refId: newCourse.id,
      })
      .catch(() => {});

    // 11. Initialize Streak
    await db
      .insert(userStreaks)
      .values({
        userId: resolvedUserId,
        currentStreak: 1,
        longestStreak: 1,
      })
      .onConflictDoNothing()
      .catch(() => {});

    return NextResponse.json({
      success: true,
      journeyId: newCourse.id,
      courseId: newCourse.id,
      title: newCourse.title,
      role: targetRole,
      level: resolvedLevel,
      missingSkills,
      matchPercentage: gapResult.matchPercentage,
      totalModules: journeyPlan.totalModules,
      redirectUrl: `/journeys/${newCourse.id}`,
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
