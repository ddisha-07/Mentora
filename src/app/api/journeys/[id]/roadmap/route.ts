import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { journeys, modules, moduleProgress } from '@/db/schema';
import { and, asc, desc, eq, inArray } from 'drizzle-orm';
import { getSession } from '@/lib/auth';
import { DEMO_JOURNEY_ID, ensureDemoJourney } from '@/lib/seedJourney';

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

    let targetJourneyId = id;
    let journey: typeof journeys.$inferSelect | undefined;

    if (id === 'active') {
      if (userId) {
        [journey] = await db
          .select()
          .from(journeys)
          .where(eq(journeys.userId, userId))
          .orderBy(desc(journeys.createdAt))
          .limit(1);
      }
      if (!journey) {
        [journey] = await db
          .select()
          .from(journeys)
          .orderBy(desc(journeys.createdAt))
          .limit(1);
      }
      if (journey) {
        targetJourneyId = journey.id;
      }
    } else if (id === 'demo') {
      const demo = await ensureDemoJourney();
      targetJourneyId = demo.id;
    }

    // Attempt to locate journey if not already found
    if (!journey) {
      [journey] = await db
        .select()
        .from(journeys)
        .where(eq(journeys.id, targetJourneyId))
        .limit(1);
    }

    if (!journey) {
      // Fallback to ensuring demo journey so testing with any id works gracefully
      journey = await ensureDemoJourney();
      targetJourneyId = journey.id;
    }

    // Retrieve modules for this journey ordered by level and order
    const moduleList = await db
      .select()
      .from(modules)
      .where(eq(modules.journeyId, targetJourneyId))
      .orderBy(asc(modules.level), asc(modules.order));

    if (moduleList.length === 0) {
      return NextResponse.json({
        journey,
        levels: [
          { level: 1, name: LEVEL_NAMES[1], modules: [] },
          { level: 2, name: LEVEL_NAMES[2], modules: [] },
          { level: 3, name: LEVEL_NAMES[3], modules: [] },
        ],
      });
    }

    const moduleIds = moduleList.map((m) => m.id);

    // Retrieve progress records
    const progressList = await db
      .select()
      .from(moduleProgress)
      .where(
        userId
          ? and(inArray(moduleProgress.moduleId, moduleIds), eq(moduleProgress.userId, userId))
          : inArray(moduleProgress.moduleId, moduleIds)
      );

    const progressMap = new Map<string, typeof moduleProgress.$inferSelect>();
    for (const prog of progressList) {
      progressMap.set(prog.moduleId, prog);
    }

    // Group modules by level with resolved status
    const levelsMap: Record<number, any[]> = { 1: [], 2: [], 3: [] };

    for (let i = 0; i < moduleList.length; i++) {
      const mod = moduleList[i];
      const prog = progressMap.get(mod.id);

      // Default status logic: if no record, module #1 is available, others locked
      let status: 'locked' | 'available' | 'in_progress' | 'completed' = 'locked';
      if (prog) {
        status = prog.status;
      } else if (i === 0) {
        status = 'available';
      }

      const lvl = mod.level || 1;
      if (!levelsMap[lvl]) levelsMap[lvl] = [];

      levelsMap[lvl].push({
        id: mod.id,
        journeyId: mod.journeyId,
        title: mod.title,
        skill: mod.skill,
        description: mod.description,
        level: mod.level,
        order: mod.order,
        estimatedHours: mod.estimatedHours,
        status,
        completedAt: prog?.completedAt || null,
      });
    }

    const levels = [1, 2, 3].map((lvl) => ({
      level: lvl,
      name: LEVEL_NAMES[lvl] || `Level ${lvl}`,
      modules: levelsMap[lvl] || [],
    }));

    return NextResponse.json({
      journey,
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
