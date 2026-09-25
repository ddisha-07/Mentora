export interface AdminReportItem {
  id: string;
  userId: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  tileId: string;
  tileTitle: string;
  activityType: 'concept' | 'flashcards' | 'video' | 'dialogue' | 'quiz' | 'task';
  xpReward: number;
  score?: number | null;
  completedAt: string;
}

export const globalAdminReports: AdminReportItem[] = [
  {
    id: 'rep_seed_1',
    userId: 'guest_user',
    userName: 'Guest Learner',
    courseId: 'crs_1',
    courseTitle: 'Machine Learning Fundamentals',
    tileId: 'mod_1',
    tileTitle: 'What is Machine Learning, Really?',
    activityType: 'concept',
    xpReward: 50,
    score: 100,
    completedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
];

export function addAdminReport(item: AdminReportItem) {
  globalAdminReports.unshift(item);
  if (globalAdminReports.length > 50) {
    globalAdminReports.pop();
  }
}

export function getAdminReports(): AdminReportItem[] {
  return [...globalAdminReports];
}
