import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth, FieldValue } from '@/utils/firebase/admin';
import { verifyFirebaseToken } from '@/utils/firebase/tokenVerifier';
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

  return null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      courseId,
      action = 'enroll', // 'enroll' | 'unenroll'
      courseTitle,
      category,
      progress = 0,
      currentModuleNumber = 1,
      currentSlide = 1,
    } = body;

    if (!courseId) {
      return NextResponse.json({ error: 'courseId is required' }, { status: 400 });
    }

    const userId = (await resolveUserId(request)) || body.userId;

    if (!userId) {
      // Allow unauthenticated / guest usage
      return NextResponse.json({
        success: true,
        enrolled: action === 'enroll',
        guest: true,
        courseId,
      });
    }

    const docId = `${userId}_${courseId}`;

    // 1. Try Firestore write
    let firestoreSuccess = false;
    try {
      const userCourseRef = adminDb.collection('user_courses').doc(docId);
      if (action === 'unenroll') {
        try {
          await userCourseRef.delete();
        } catch {
          await userCourseRef.set({
            status: 'dropped',
            droppedAt: FieldValue.serverTimestamp(),
            lastAccessedAt: FieldValue.serverTimestamp(),
          }, { merge: true });
        }
      } else {
        await userCourseRef.set({
          userId,
          courseId,
          courseTitle: courseTitle || 'Enrolled Course',
          category: category || 'Web Development',
          status: 'in_progress',
          progress: typeof progress === 'number' ? progress : 0,
          currentModuleNumber: currentModuleNumber || 1,
          currentSlide: currentSlide || 1,
          totalSlides: 8,
          lastAccessedAt: FieldValue.serverTimestamp(),
          enrolledAt: FieldValue.serverTimestamp(),
        }, { merge: true });
      }
      firestoreSuccess = true;
    } catch (dbErr: any) {
      console.warn('Firestore write skipped or uninitialized in enroll route:', dbErr?.message);
    }

    // 2. Also keep dev fallback store in sync
    if (action === 'unenroll') {
      devEnrollmentStore.delete(docId);
    } else {
      devEnrollmentStore.set(docId, {
        userId,
        courseId,
        courseTitle: courseTitle || 'Enrolled Course',
        category: category || 'Web Development',
        status: 'in_progress',
        progress: typeof progress === 'number' ? progress : 0,
        currentModuleNumber: currentModuleNumber || 1,
        currentSlide: currentSlide || 1,
        totalSlides: 8,
        enrolledAt: new Date().toISOString(),
        lastAccessedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      enrolled: action === 'enroll',
      courseId,
      userId,
      savedToFirestore: firestoreSuccess,
    });
  } catch (error: any) {
    console.error('Error in courses enroll API:', error);
    return NextResponse.json({
      error: error?.message || 'Failed to update enrollment',
    }, { status: 500 });
  }
}
