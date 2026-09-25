import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/utils/firebase/admin';
import { getAdminReports, addAdminReport } from '@/lib/admin/services/adminReportStore';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    let reports: any[] = [];

    try {
      const snap = await adminDb
        .collection('admin_reports')
        .orderBy('completedAt', 'desc')
        .limit(30)
        .get();

      if (!snap.empty) {
        reports = snap.docs.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
        }));
      }
    } catch (err: any) {
      console.warn('Firestore admin_reports fetch error (using memory store fallback):', err?.message);
    }

    // Merge shared memory store reports with fetched Firestore reports avoiding duplicate IDs
    const storeReports = getAdminReports();
    const reportMap = new Map<string, any>();
    [...storeReports, ...reports].forEach((r) => {
      reportMap.set(r.id, r);
    });

    const combined = Array.from(reportMap.values()).sort(
      (a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime()
    );

    return NextResponse.json({
      success: true,
      reports: combined,
      total: combined.length,
    });
  } catch (error: any) {
    console.error('Error fetching admin reports:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch admin reports', reports: getAdminReports() },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const newReport = {
      id: `rep_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      userId: body.userId || 'guest_user',
      userName: body.userName || 'Learner',
      courseId: body.courseId || 'crs_1',
      courseTitle: body.courseTitle || 'Machine Learning Fundamentals',
      tileId: body.tileId || body.moduleId || 'mod_1',
      tileTitle: body.tileTitle || body.title || 'Roadmap Activity',
      activityType: body.activityType || 'concept',
      xpReward: typeof body.xpReward === 'number' ? body.xpReward : 50,
      score: typeof body.score === 'number' ? body.score : null,
      completedAt: new Date().toISOString(),
    };

    addAdminReport(newReport);

    try {
      await adminDb.collection('admin_reports').add(newReport);
    } catch {}

    return NextResponse.json({
      success: true,
      report: newReport,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to save admin report' },
      { status: 500 }
    );
  }
}
