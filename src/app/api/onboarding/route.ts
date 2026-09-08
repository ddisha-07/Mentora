import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { journeys, modules, moduleProgress, profiles, users } from '@/db/schema';
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
      fullName = 'Alex Morgan',
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
        .select({ id: users.id })
        .from(users)
        .orderBy(desc(users.createdAt))
        .limit(1);

      if (latestUser) {
        resolvedUserId = latestUser.id;
      } else {
        const { hashPassword } = await import('@/lib/auth');
        const defaultHash = await hashPassword('mentora_learner');
        const [newUser] = await db
          .insert(users)
          .values({
            email: 'learner@mentora.ai',
            passwordHash: defaultHash,
            role: 'learner',
            onboardingComplete: true,
          })
          .returning();
        resolvedUserId = newUser.id;
      }
    }

    // 2. Classify Experience Level
    let resolvedLevel: ExperienceLevel = 'intermediate';
    if (experienceLevel === 'beginner' || experienceLevel === 'intermediate' || experienceLevel === 'advanced') {
      resolvedLevel = experienceLevel;
    } else {
      resolvedLevel = classifyLevel({
        yearsOfExperience: Number(yearsOfExperience) || 3,
        knownSkillsCount: Array.isArray(currentSkills) ? currentSkills.length : 3,
      });
    }

    // 3. Match Target Skills & Predict Skill Gaps
    const targetRoleSkills =
      ROLE_SKILL_TARGETS[targetRole] ||
      ROLE_SKILL_TARGETS['Senior AI Systems Architect'];

    const gapResult = predictSkillGaps({
      currentSkills: Array.isArray(currentSkills) ? currentSkills : [],
      targetRoleSkills,
    });

    // Ensure at least 3 missing skills if learner already knows everything
    let missingSkills = gapResult.missingSkills;
    if (missingSkills.length === 0) {
      missingSkills = targetRoleSkills.slice(-3);
    }

    // 4. Run Journey Builder Personalization Engine
    const journeyPlan = buildJourney({
      role: targetRole,
      missingSkills,
      userLevel: resolvedLevel,
    });

    // 5. Update user onboarding status
    await db
      .update(users)
      .set({ onboardingComplete: true })
      .where(eq(users.id, resolvedUserId));

    // 6. Update or insert profile
    const [existingProfile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, resolvedUserId))
      .limit(1);

    if (existingProfile) {
      await db
        .update(profiles)
        .set({
          fullName: fullName || existingProfile.fullName,
          targetRole,
          experienceLevel: resolvedLevel,
        })
        .where(eq(profiles.userId, resolvedUserId));
    } else {
      await db.insert(profiles).values({
        userId: resolvedUserId,
        fullName,
        targetRole,
        experienceLevel: resolvedLevel,
      });
    }

    // 7. Save Journey in Database
    const [newJourney] = await db
      .insert(journeys)
      .values({
        userId: resolvedUserId,
        title: `${targetRole} Personalized Roadmap`,
        role: targetRole,
        level: resolvedLevel,
        totalModules: journeyPlan.totalModules,
      })
      .returning();

    // 8. Insert Modules & Progress Records
    const allModules = journeyPlan.levels.flatMap((lvl) => lvl.modules);

    for (let i = 0; i < allModules.length; i++) {
      const m = allModules[i];
      const [insertedModule] = await db
        .insert(modules)
        .values({
          journeyId: newJourney.id,
          title: m.title,
          skill: m.skill,
          description: m.description,
          level: m.level,
          order: m.order,
          estimatedHours: m.estimatedHours,
        })
        .returning();

      // Module #1 is available immediately, others gated
      await db.insert(moduleProgress).values({
        userId: resolvedUserId,
        moduleId: insertedModule.id,
        status: i === 0 ? 'available' : 'locked',
      });
    }

    return NextResponse.json({
      success: true,
      journeyId: newJourney.id,
      title: newJourney.title,
      role: targetRole,
      level: resolvedLevel,
      missingSkills,
      matchPercentage: gapResult.matchPercentage,
      totalModules: journeyPlan.totalModules,
      redirectUrl: '/journeys/active',
      message: 'Personalized journey synthesized successfully',
    });
  } catch (error) {
    console.error('Error processing onboarding:', error);
    return NextResponse.json(
      { error: 'Internal server error processing onboarding' },
      { status: 500 }
    );
  }
}
