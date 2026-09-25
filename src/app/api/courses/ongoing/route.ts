import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/utils/firebase/admin';
import { verifyFirebaseToken } from '@/utils/firebase/tokenVerifier';
import { mockCourses } from '@/lib/admin/data/mockCourses';
import { getTechDetails } from '@/lib/courses/courseFormatter';
import { devEnrollmentStore } from '@/lib/courses/enrollmentStore';

export const dynamic = 'force-dynamic';

async function resolveUserId(request: NextRequest): Promise<string | null> {
  const sessionCookie = request.cookies.get('mentora_session')?.value || '';
  if (sessionCookie) {
    try {
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
      return decodedClaims.uid;
    } catch {
      try {
        const verified = await verifyFirebaseToken(sessionCookie);
        return verified.uid;
      } catch {}
    }
  }

  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    try {
      const verified = await verifyFirebaseToken(token);
      return verified.uid;
    } catch {}
  }

  // Fallback check in query param for dev/testing
  const queryUserId = request.nextUrl.searchParams.get('userId');
  if (queryUserId) return queryUserId;

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const userId = await resolveUserId(request);

    // If no authenticated user, report not enrolled
    if (!userId) {
      return NextResponse.json({
        enrolled: false,
        hasOngoingCourse: false,
        ongoingCourse: null,
      });
    }

    // Query user_courses collection from Firestore
    let userCourseDocs: any[] = [];
    try {
      const snap = await adminDb
        .collection('user_courses')
        .where('userId', '==', userId)
        .get();

      if (!snap.empty) {
        userCourseDocs = snap.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      }
    } catch (err) {
      console.warn('Error querying user_courses from Firestore:', err);
    }

    if (userCourseDocs.length === 0) {
      for (const val of devEnrollmentStore.values()) {
        if (val.userId === userId) {
          userCourseDocs.push(val);
        }
      }
    }

    // Filter to only enrolled and ongoing courses (progress < 100 and not dropped)
    const ongoingUserCourses = userCourseDocs.filter((uc) => {
      const isStatusValid = uc.status === 'in_progress' || uc.status === 'enrolled' || !uc.status;
      const progress = typeof uc.progress === 'number' ? uc.progress : 0;
      return isStatusValid && progress < 100;
    });

    if (ongoingUserCourses.length === 0) {
      return NextResponse.json({
        enrolled: false,
        hasOngoingCourse: false,
        ongoingCourse: null,
      });
    }

    // Sort by lastAccessedAt desc, then enrolledAt desc
    ongoingUserCourses.sort((a, b) => {
      const timeA = a.lastAccessedAt?.toMillis?.() || new Date(a.lastAccessedAt || a.enrolledAt || 0).getTime();
      const timeB = b.lastAccessedAt?.toMillis?.() || new Date(b.lastAccessedAt || b.enrolledAt || 0).getTime();
      return timeB - timeA;
    });

    const activeUserCourse = ongoingUserCourses[0];
    const courseId = activeUserCourse.courseId;

    // 1. Fetch course metadata from Firestore or mockCourses
    let courseData: any = null;
    try {
      const courseDoc = await adminDb.collection('courses').doc(courseId).get();
      if (courseDoc.exists) {
        courseData = { id: courseDoc.id, ...courseDoc.data() };
      }
    } catch {}

    if (!courseData) {
      const foundMock = mockCourses.find((c) => c.id === courseId);
      if (foundMock) {
        courseData = foundMock;
      }
    }

    const courseTitle = courseData?.title || activeUserCourse.courseTitle || 'Career Track';
    const category = courseData?.category || activeUserCourse.category || 'Software Engineering';

    // 2. Fetch modules sequence
    let modulesList: any[] = [];
    try {
      const modulesSnap = await adminDb
        .collection('modules')
        .where('courseId', '==', courseId)
        .get();

      if (!modulesSnap.empty) {
        modulesList = modulesSnap.docs
          .map((d: any) => ({ id: d.id, ...d.data() }))
          .sort((a: any, b: any) => (a.displayOrder || 0) - (b.displayOrder || 0));
      }
    } catch {}

    if (modulesList.length === 0 && Array.isArray(courseData?.modules) && courseData.modules.length > 0) {
      modulesList = courseData.modules.map((m: any, idx: number) => ({
        id: m.id || `mod_${idx + 1}`,
        title: m.title || `Module ${idx + 1}`,
        description: m.tagline || m.content?.tagline || m.content?.summary || '',
        displayOrder: idx + 1,
        estimatedTime: 50,
      }));
    }

    const totalModules = Math.max(modulesList.length, courseData?.modulesCount || 4);
    const progressPercent = typeof activeUserCourse.progress === 'number' ? activeUserCourse.progress : 0;

    // Determine current ongoing module index
    let currentModuleNumber = activeUserCourse.currentModuleNumber;
    if (!currentModuleNumber || currentModuleNumber < 1) {
      const completedCount = Math.floor((progressPercent / 100) * totalModules);
      currentModuleNumber = Math.min(totalModules, Math.max(1, completedCount + 1));
    }

    const currentModule = modulesList[currentModuleNumber - 1] || null;
    const currentModuleTitle = currentModule?.title || activeUserCourse.currentModuleTitle || `Module ${currentModuleNumber}`;
    const moduleSubtitle = currentModule?.description || currentModule?.tagline || activeUserCourse.currentModuleSubtitle || 'Key patterns, architectural fundamentals & best practices';

    // Estimate duration and remaining time
    const totalMins = currentModule?.estimatedTime ? Math.round(currentModule.estimatedTime > 120 ? currentModule.estimatedTime / 60 : currentModule.estimatedTime) : 50;
    const moduleChunkPercent = 100 / (totalModules || 1);
    const withinModuleProgress = (progressPercent % moduleChunkPercent) / moduleChunkPercent;
    const remainingMins = Math.max(5, Math.round(totalMins * (1 - withinModuleProgress)));

    // Slides estimation
    const currentSlide = activeUserCourse.currentSlide || Math.max(1, Math.round(withinModuleProgress * 8) || 1);
    const totalSlides = activeUserCourse.totalSlides || 8;

    const techInfo = getTechDetails(courseTitle, category);

    return NextResponse.json({
      enrolled: true,
      hasOngoingCourse: true,
      ongoingCourse: {
        courseId,
        courseTitle,
        category,
        techLogo: techInfo.techLogo,
        techIcon: techInfo.techIcon,
        techGradient: techInfo.techGradient,
        techTextColor: techInfo.techTextColor,
        currentModuleNumber,
        totalModules,
        currentModuleTitle,
        moduleSubtitle,
        currentSlide,
        totalSlides,
        progress: progressPercent,
        remainingMins,
        totalMins,
        actionUrl: `/dashboard/journeys/${courseId}`,
      },
    });
  } catch (error: any) {
    console.error('Error fetching ongoing course:', error);
    return NextResponse.json({
      enrolled: false,
      hasOngoingCourse: false,
      ongoingCourse: null,
      error: error?.message || 'Failed to fetch ongoing course',
    }, { status: 500 });
  }
}
