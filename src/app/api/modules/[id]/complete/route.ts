import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth, FieldValue } from '@/utils/firebase/admin';
import { devEnrollmentStore } from '@/lib/courses/enrollmentStore';
import { addAdminReport } from '@/lib/admin/services/adminReportStore';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));

    // Determine user session
    const sessionCookie = request.cookies.get('mentora_session')?.value || '';
    let userId: string | null = null;
    if (sessionCookie) {
      try {
        const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
        userId = decodedClaims.uid;
      } catch (e) {}
    }

    const effectiveUserId = userId || body.userId || 'guest_user';
    let targetCourseId = body.courseId || '';
    let moduleTitle = body.title || 'Module';
    let xpReward = typeof body.xpReward === 'number' ? body.xpReward : 250;

    // 1. Check if module document exists in Firestore
    try {
      const currentModuleDoc = await adminDb.collection('modules').doc(id).get();
      if (currentModuleDoc.exists) {
        const data = currentModuleDoc.data();
        if (data?.courseId) targetCourseId = data.courseId;
        if (data?.title) moduleTitle = data.title;
        if (data?.xpPoints) xpReward = data.xpPoints;
      }
    } catch {}

    const courseId = targetCourseId || 'active';
    const docId = `${effectiveUserId}_${courseId}`;
    const aliasDocIds = (courseId === 'demo' || courseId === 'active')
      ? Array.from(new Set([docId, `${effectiveUserId}_demo`]))
      : [docId];

    // 2. Update Firestore user_courses (merge and sync main doc and aliases)
    let completedModules: string[] = [];
    try {
      for (const aDocId of aliasDocIds) {
        try {
          const docSnap = await adminDb.collection('user_courses').doc(aDocId).get();
          if (docSnap.exists) {
            const data = docSnap.data() || {};
            if (Array.isArray(data.completedModules)) {
              data.completedModules.forEach((mId: string) => {
                if (!completedModules.includes(mId)) completedModules.push(mId);
              });
            }
          }
        } catch {}
      }
      if (!completedModules.includes(id)) {
        completedModules.push(id);
      }

      for (const aDocId of aliasDocIds) {
        try {
          await adminDb.collection('user_courses').doc(aDocId).set({
            userId: effectiveUserId,
            courseId,
            completedModules,
            lastAccessedAt: FieldValue.serverTimestamp(),
          }, { merge: true });
        } catch {}
      }
    } catch (err: any) {
      console.warn('Firestore write notice in module complete:', err?.message);
    }

    // 3. Update devEnrollmentStore fallback for main doc and aliases
    for (const aDocId of aliasDocIds) {
      const existingDevDoc = devEnrollmentStore.get(aDocId);
      if (Array.isArray(existingDevDoc?.completedModules)) {
        existingDevDoc.completedModules.forEach((mId: string) => {
          if (!completedModules.includes(mId)) completedModules.push(mId);
        });
      }
    }

    const totalCount = body.totalModules || 15;
    const progressPercent = Math.min(100, Math.round((completedModules.length / totalCount) * 100));

    const updatedStoreRecord = {
      userId: effectiveUserId,
      courseId,
      courseTitle: body.courseTitle || (courseId === 'crs_1' ? 'Machine Learning Fundamentals' : (body.title || 'Career Track')),
      category: body.category || 'Professional Track',
      status: (progressPercent >= 100 ? 'completed' : 'in_progress') as 'completed' | 'in_progress',
      progress: progressPercent,
      completedModules,
      currentModuleNumber: Math.min(totalCount, completedModules.length + 1),
      currentSlide: 1,
      totalSlides: totalCount,
      enrolledAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
    };

    for (const aDocId of aliasDocIds) {
      devEnrollmentStore.set(aDocId, updatedStoreRecord);
    }

    // 4. Create and record Admin Activity Report
    const adminReport = {
      id: `rep_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      userId: effectiveUserId,
      userName: body.userName || (effectiveUserId === 'guest_user' ? 'Guest Learner' : 'Active Learner'),
      courseId,
      courseTitle: body.courseTitle || 'Machine Learning Fundamentals',
      tileId: id,
      tileTitle: moduleTitle,
      activityType: (body.activityType || 'concept') as any,
      xpReward,
      score: typeof body.score === 'number' ? body.score : null,
      completedAt: new Date().toISOString(),
    };

    addAdminReport(adminReport);

    try {
      await adminDb.collection('admin_reports').add({
        ...adminReport,
        createdAt: FieldValue.serverTimestamp(),
      });
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: 'Module completed successfully',
      completedModule: {
        id,
        title: moduleTitle,
        status: 'completed',
        xpReward,
      },
      xpAwarded: xpReward,
      report: adminReport,
      progress: progressPercent,
    });
  } catch (error: any) {
    console.error('Error completing module:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error completing module' },
      { status: 500 }
    );
  }
}
