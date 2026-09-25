// src/lib/courses/enrollmentStore.ts
// Fallback in-memory store for local development / testing when Firebase Admin credentials are not set

export interface DevUserCourse {
  userId: string;
  courseId: string;
  courseTitle: string;
  category: string;
  status: 'in_progress' | 'completed' | 'dropped';
  progress: number;
  completedModules?: string[];
  currentModuleNumber: number;
  currentSlide: number;
  totalSlides: number;
  enrolledAt: string;
  lastAccessedAt: string;
}

const globalStore = globalThis as unknown as {
  __mentora_dev_enrollments?: Map<string, DevUserCourse>;
};

if (!globalStore.__mentora_dev_enrollments) {
  globalStore.__mentora_dev_enrollments = new Map<string, DevUserCourse>();
}

export const devEnrollmentStore = globalStore.__mentora_dev_enrollments;
