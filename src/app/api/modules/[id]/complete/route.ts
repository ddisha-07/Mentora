import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { courseModules, courses, userCourses } from '@/db/schema';
import { and, asc, eq } from 'drizzle-orm';
import { getSession } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    const userId = session?.userId || null;

    // 1. Locate current module
    const [currentModule] = await db
      .select()
      .from(courseModules)
      .where(eq(courseModules.id, id))
      .limit(1);

    if (!currentModule) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    // 2. Find all modules in this course in sequence
    const allModules = await db
      .select()
      .from(courseModules)
      .where(eq(courseModules.courseId, currentModule.courseId))
      .orderBy(asc(courseModules.displayOrder));

    const currentIndex = allModules.findIndex((m) => m.id === currentModule.id);
    const nextModule = currentIndex >= 0 && currentIndex + 1 < allModules.length
      ? allModules[currentIndex + 1]
      : null;

    // 3. Update user_courses progress if enrolled
    if (userId) {
      const completedCount = currentIndex + 1;
      const progressPercent = Math.min(100, Math.round((completedCount / allModules.length) * 100));

      await db
        .update(userCourses)
        .set({
          progress: progressPercent.toFixed(2),
          status: progressPercent >= 100 ? 'completed' : 'in_progress',
          completedAt: progressPercent >= 100 ? new Date() : null,
          lastAccessedAt: new Date(),
        })
        .where(
          and(
            eq(userCourses.userId, userId),
            eq(userCourses.courseId, currentModule.courseId)
          )
        )
        .catch(() => {});
    }

    let unlockedModule = null;
    if (nextModule) {
      unlockedModule = {
        id: nextModule.id,
        title: nextModule.title,
        order: nextModule.displayOrder,
        level: nextModule.displayOrder <= 3 ? 1 : nextModule.displayOrder <= 6 ? 2 : 3,
        status: 'available',
      };
    }

    return NextResponse.json({
      message: 'Module completed successfully',
      completedModule: {
        id: currentModule.id,
        title: currentModule.title,
        status: 'completed',
      },
      nextUnlockedModule: unlockedModule,
      isJourneyComplete: !nextModule,
    });
  } catch (error) {
    console.error('Error completing module:', error);
    return NextResponse.json(
      { error: 'Internal server error completing module' },
      { status: 500 }
    );
  }
}
