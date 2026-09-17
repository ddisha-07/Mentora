import { adminDb } from '@/utils/firebase/admin';

// Types
export interface UserDocument {
  userId: string;
  email: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
  role: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  onboardingComplete?: boolean;
}

// References
export const collections = {
  get users() {
    return adminDb.collection('users');
  },
  get courses() {
    return adminDb.collection('courses');
  },
  get modules() {
    return adminDb.collection('modules');
  },
  get lessons() {
    return adminDb.collection('lessons');
  },
  get quizzes() {
    return adminDb.collection('quizzes');
  },
  get userCourses() {
    return adminDb.collection('user_courses');
  },
  get lessonProgress() {
    return adminDb.collection('lesson_progress');
  }
};
