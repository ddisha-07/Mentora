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

  const queryUserId = request.nextUrl.searchParams.get('userId');
  if (queryUserId) return queryUserId;

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const userId = (await resolveUserId(request)) || 'guest_user';
    const progressMap: Record<string, {
      enrolled: boolean;
      progress: number;
      completedModules: string[];
      currentModuleNumber: number;
      status: string;
    }> = {};

    // 1. Query Firestore user_courses
    try {
      const snap = await adminDb
        .collection('user_courses')
        .where('userId', '==', userId)
        .get();

      if (!snap.empty) {
        snap.docs.forEach((doc: any) => {
          const data = doc.data();
          if (data?.courseId) {
            progressMap[data.courseId] = {
              enrolled: data.status !== 'dropped',
              progress: typeof data.progress === 'number' ? data.progress : 0,
              completedModules: Array.isArray(data.completedModules) ? data.completedModules : [],
              currentModuleNumber: data.currentModuleNumber || 1,
              status: data.status || 'in_progress',
            };
          }
        });
      }
    } catch (dbErr: any) {
      console.warn('Firestore query skipped in courses progress GET:', dbErr?.message);
    }

    // 2. Fallback to dev store if empty
    if (Object.keys(progressMap).length === 0) {
      for (const val of devEnrollmentStore.values()) {
        if (val.userId === userId && val.status !== 'dropped') {
          progressMap[val.courseId] = {
            enrolled: true,
            progress: val.progress || 0,
            completedModules: Array.isArray(val.completedModules) ? val.completedModules : [],
            currentModuleNumber: val.currentModuleNumber || 1,
            status: val.status || 'in_progress',
          };
        }
      }
    }

    return NextResponse.json({ success: true, progressMap });
  } catch (error: any) {
    console.error('Error in courses progress GET API:', error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      courseId,
      moduleId,
      completed = true,
      totalModules = 4,
      progress: explicitProgress,
    } = body;

    if (!courseId) {
      return NextResponse.json({ error: 'courseId is required' }, { status: 400 });
    }

    const userId = (await resolveUserId(request)) || body.userId || 'guest_user';
    const docId = `${userId}_${courseId}`;

    let completedModules: string[] = [];
    let currentProgress = 0;

    // Check existing progress in Firestore
    try {
      const docRef = adminDb.collection('user_courses').doc(docId);
      const existing = await docRef.get();
      if (existing.exists) {
        const data = existing.data() || {};
        completedModules = Array.isArray(data.completedModules) ? [...data.completedModules] : [];
      }

      if (moduleId) {
        if (completed && !completedModules.includes(moduleId)) {
          completedModules.push(moduleId);
        } else if (!completed && completedModules.includes(moduleId)) {
          completedModules = completedModules.filter((id) => id !== moduleId);
        }
      }

      const total = Math.max(1, totalModules);
      currentProgress = typeof explicitProgress === 'number'
        ? explicitProgress
        : Math.min(100, Math.round((completedModules.length / total) * 100));

      await docRef.set({
        userId,
        courseId,
        completedModules,
        progress: currentProgress,
        status: currentProgress >= 100 ? 'completed' : 'in_progress',
        lastAccessedAt: FieldValue.serverTimestamp(),
      }, { merge: true });
    } catch (dbErr: any) {
      console.warn('Firestore write warning in progress POST:', dbErr?.message);

      // Dev store fallback
      const existingDev = devEnrollmentStore.get(docId);
      if (Array.isArray(existingDev?.completedModules)) {
        completedModules = [...existingDev.completedModules];
      }

      if (moduleId) {
        if (completed && !completedModules.includes(moduleId)) {
          completedModules.push(moduleId);
        } else if (!completed) {
          completedModules = completedModules.filter((id) => id !== moduleId);
        }
      }
      const total = Math.max(1, totalModules);
      currentProgress = typeof explicitProgress === 'number'
        ? explicitProgress
        : Math.min(100, Math.round((completedModules.length / total) * 100));

      devEnrollmentStore.set(docId, {
        userId,
        courseId,
        courseTitle: existingDev?.courseTitle || 'Enrolled Course',
        category: existingDev?.category || 'Track',
        status: currentProgress >= 100 ? 'completed' : 'in_progress',
        progress: currentProgress,
        completedModules,
        currentModuleNumber: existingDev?.currentModuleNumber || 1,
        currentSlide: existingDev?.currentSlide || 1,
        totalSlides: 8,
        enrolledAt: existingDev?.enrolledAt || new Date().toISOString(),
        lastAccessedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      success: true,
      courseId,
      progress: currentProgress,
      completedModules,
    });
  } catch (error: any) {
    console.error('Error in courses progress POST API:', error);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
