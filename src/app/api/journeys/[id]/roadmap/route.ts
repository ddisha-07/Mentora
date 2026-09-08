import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { courseModules, courses, lessonProgress, lessons, userCourses } from '@/db/schema';
import { and, asc, desc, eq, inArray } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

const LEVEL_NAMES: Record<number, string> = {
  1: 'Foundations',
  2: 'Core Practice & Applications',
  3: 'Advanced Specialization & Strategy',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    const userId = session?.userId || null;

    let targetCourseId = id;
    let course: typeof courses.$inferSelect | undefined;

    if (id === 'active') {
      if (userId) {
        [course] = await db
          .select()
          .from(courses)
          .where(eq(courses.createdBy, userId))
          .orderBy(desc(courses.createdAt))
          .limit(1);
      }
      if (!course) {
        [course] = await db
          .select()
          .from(courses)
          .orderBy(desc(courses.createdAt))
          .limit(1);
      }
      if (course) {
        targetCourseId = course.id;
      }
    }

    // Attempt to locate course if not active alias
    if (!course) {
      [course] = await db
        .select()
        .from(courses)
        .where(eq(courses.id, targetCourseId))
        .limit(1);
    }

    if (!course) {
      return NextResponse.json(
        { error: 'No active journey found. Please complete onboarding first.' },
        { status: 404 }
      );
    }

    // Retrieve modules for this course ordered by displayOrder
    const moduleList = await db
      .select()
      .from(courseModules)
      .where(eq(courseModules.courseId, targetCourseId))
      .orderBy(asc(courseModules.displayOrder));

    if (moduleList.length === 0) {
      return NextResponse.json({
        journey: {
          id: course.id,
          title: course.title,
          role: course.category || 'AI Engineer',
          level: course.difficulty,
          totalModules: 0,
        },
        levels: [
          { level: 1, name: LEVEL_NAMES[1], modules: [] },
          { level: 2, name: LEVEL_NAMES[2], modules: [] },
          { level: 3, name: LEVEL_NAMES[3], modules: [] },
        ],
      });
    }

    // Map modules into 3 progressive tiers
    const levelsMap: Record<number, any[]> = { 1: [], 2: [], 3: [] };

    for (let i = 0; i < moduleList.length; i++) {
      const mod = moduleList[i];
      const lvl = mod.displayOrder <= 3 ? 1 : mod.displayOrder <= 6 ? 2 : 3;

      levelsMap[lvl].push({
        id: mod.id,
        journeyId: mod.courseId,
        courseId: mod.courseId,
        title: mod.title,
        skill: mod.title,
        description: mod.description,
        level: lvl,
        order: mod.displayOrder,
        estimatedHours: Math.round((mod.estimatedTime || 360) / 60),
        status: i === 0 ? 'available' : 'locked',
        completedAt: null,
      });
    }

    const levels = [1, 2, 3].map((lvl) => ({
      level: lvl,
      name: LEVEL_NAMES[lvl] || `Level ${lvl}`,
      modules: levelsMap[lvl] || [],
    }));

    return NextResponse.json({
      journey: {
        id: course.id,
        title: course.title,
        role: course.category || 'AI Engineer',
        level: course.difficulty,
        totalModules: moduleList.length,
      },
      levels,
    });
  } catch (error) {
    console.error('Error fetching journey roadmap:', error);
    return NextResponse.json(
      { error: 'Internal server error fetching roadmap' },
      { status: 500 }
    );
  }
}
