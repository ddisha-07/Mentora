import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth, FieldValue } from '@/utils/firebase/admin';

export async function POST(
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

    // 1. Locate current module
    const currentModuleDoc = await adminDb.collection('modules').doc(id).get();
    if (!currentModuleDoc.exists) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }
    const currentModule = { id: currentModuleDoc.id, ...currentModuleDoc.data() } as any;

    // 2. Find all modules in this course in sequence
    const allModulesSnap = await adminDb.collection('modules')
      .where('courseId', '==', currentModule.courseId)
      .get();
      
    const allModules = allModulesSnap.docs
      .map((doc: any) => ({ id: doc.id, ...doc.data() } as any))
      .sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0));

    const currentIndex = allModules.findIndex((m: any) => m.id === currentModule.id);
    const nextModule = currentIndex >= 0 && currentIndex + 1 < allModules.length
      ? allModules[currentIndex + 1]
      : null;

    // 3. Update user_courses progress if enrolled
    if (userId) {
      const completedCount = currentIndex + 1;
      const progressPercent = Math.min(100, Math.round((completedCount / allModules.length) * 100));

      const userCourseId = `${userId}_${currentModule.courseId}`;
      const userCourseRef = adminDb.collection('user_courses').doc(userCourseId);
      
      try {
        await userCourseRef.set({
          userId,
          courseId: currentModule.courseId,
          progress: progressPercent,
          status: progressPercent >= 100 ? 'completed' : 'in_progress',
          completedAt: progressPercent >= 100 ? FieldValue.serverTimestamp() : null,
          lastAccessedAt: FieldValue.serverTimestamp(),
        }, { merge: true });
      } catch (err) {
        console.error('Failed to update user course progress:', err);
      }
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
