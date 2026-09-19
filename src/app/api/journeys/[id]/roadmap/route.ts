import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/utils/firebase/admin';

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
    
    // Determine user session
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

    if (id === 'active') {
      // Find the latest course for the user, or just the latest course
      let coursesQuery = adminDb.collection('courses').orderBy('createdAt', 'desc').limit(1);
      if (userId) {
        // Try user specific first
        try {
          const userCoursesSnap = await adminDb.collection('courses').where('createdBy', '==', userId).get();
          if (!userCoursesSnap.empty) {
            const sorted = userCoursesSnap.docs.sort((a: any, b: any) => {
              const timeA = a.data().createdAt?.toMillis?.() || new Date(a.data().createdAt || 0).getTime();
              const timeB = b.data().createdAt?.toMillis?.() || new Date(b.data().createdAt || 0).getTime();
              return timeB - timeA;
            });
            courseDocId = sorted[0].id;
            courseDocData = sorted[0].data();
          }
        } catch (e) {}
      }
      
      if (!courseDocData) {
        const snap = await coursesQuery.get();
        if (!snap.empty) {
          courseDocId = snap.docs[0].id;
          courseDocData = snap.docs[0].data();
        }
      }
      
      if (courseDocId) {
        targetCourseId = courseDocId;
      }
    }

    if (!courseDocData && targetCourseId !== 'active') {
      const docSnap = await adminDb.collection('courses').doc(targetCourseId).get();
      if (docSnap.exists) {
        courseDocId = docSnap.id;
        courseDocData = docSnap.data();
      }
    }

    if (!courseDocData || !courseDocId) {
      return NextResponse.json(
        { error: 'No active journey found. Please complete onboarding first.' },
        { status: 404 }
      );
    }

    // Retrieve modules for this course
    const modulesSnap = await adminDb.collection('modules')
      .where('courseId', '==', courseDocId)
      .get();

    const moduleList = modulesSnap.docs
      .map((doc: any) => ({ id: doc.id, ...doc.data() as any }))
      .sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0));

    if (moduleList.length === 0) {
      return NextResponse.json({
        journey: {
          id: courseDocId,
          title: courseDocData.title,
          role: courseDocData.category || 'AI Engineer',
          level: courseDocData.difficulty,
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
        id: courseDocId,
        title: courseDocData.title,
        role: courseDocData.category || 'AI Engineer',
        level: courseDocData.difficulty,
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
