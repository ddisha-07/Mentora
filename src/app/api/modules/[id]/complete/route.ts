import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { modules, moduleProgress } from '@/db/schema';
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
      .from(modules)
      .where(eq(modules.id, id))
      .limit(1);

    if (!currentModule) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    // 2. Mark current module as completed in moduleProgress
    const [existingProgress] = await db
      .select()
      .from(moduleProgress)
      .where(
        userId
          ? and(eq(moduleProgress.moduleId, currentModule.id), eq(moduleProgress.userId, userId))
          : eq(moduleProgress.moduleId, currentModule.id)
      )
      .limit(1);

    const now = new Date();

    if (existingProgress) {
      await db
        .update(moduleProgress)
        .set({
          status: 'completed',
          completedAt: now,
          updatedAt: now,
        })
        .where(eq(moduleProgress.id, existingProgress.id));
    } else {
      await db.insert(moduleProgress).values({
        userId: userId || undefined,
        moduleId: currentModule.id,
        status: 'completed',
        completedAt: now,
        updatedAt: now,
      });
    }

    // 3. Find all modules in this journey in sequence
    const allModules = await db
      .select()
      .from(modules)
      .where(eq(modules.journeyId, currentModule.journeyId))
      .orderBy(asc(modules.level), asc(modules.order));

    const currentIndex = allModules.findIndex((m) => m.id === currentModule.id);
    const nextModule = currentIndex >= 0 && currentIndex + 1 < allModules.length
      ? allModules[currentIndex + 1]
      : null;

    // 4. Unlock next module in sequence if exists
    let unlockedModule = null;
    if (nextModule) {
      const [nextProg] = await db
        .select()
        .from(moduleProgress)
        .where(
          userId
            ? and(eq(moduleProgress.moduleId, nextModule.id), eq(moduleProgress.userId, userId))
            : eq(moduleProgress.moduleId, nextModule.id)
        )
        .limit(1);

      if (nextProg) {
        if (nextProg.status === 'locked') {
          await db
            .update(moduleProgress)
            .set({
              status: 'available',
              updatedAt: now,
            })
            .where(eq(moduleProgress.id, nextProg.id));
        }
      } else {
        await db.insert(moduleProgress).values({
          userId: userId || undefined,
          moduleId: nextModule.id,
          status: 'available',
          updatedAt: now,
        });
      }

      unlockedModule = {
        id: nextModule.id,
        title: nextModule.title,
        order: nextModule.order,
        level: nextModule.level,
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
