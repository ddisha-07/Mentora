// src/lib/admin/services/courseService.ts

import { mockCourses } from "../data/mockCourses";
import { uid, delay } from "../utils";
import { getTopicTileTemplate, isTemplateThumbnail } from "./courseGenerationEngine";

const STORAGE_KEY = "mentora_admin_courses_v2";

// Helper to get courses from persistent localStorage or mock initial data
function loadCoursesFromStorage(): any[] {
  if (typeof window === "undefined") return [...mockCourses];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    // First time load: seed from mockCourses and persist
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockCourses));
    return [...mockCourses];
  } catch (err) {
    console.error("Failed to load courses from localStorage:", err);
    return [...mockCourses];
  }
}

function persistCourses(courses: any[]) {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
      window.dispatchEvent(new CustomEvent("mentora_courses_updated", { detail: courses }));
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("Failed to persist courses to localStorage:", err);
    }
  }
}

export async function fetchCourses(): Promise<any[]> {
  await delay(200);
  return loadCoursesFromStorage();
}

export async function getCourses(): Promise<any[]> {
  return fetchCourses();
}

export async function createCourse(courseDraft: any): Promise<any> {
  await delay(250);
  const courses = loadCoursesFromStorage();
  const courseId = courseDraft.id || uid("crs");

  // Derive dynamic topic template for consistent aesthetic styling if fields are not specified
  const tileTemplate = getTopicTileTemplate({
    title: courseDraft.title,
    category: courseDraft.category,
    description: courseDraft.description,
  });

  const hasCustomThumbnail = Boolean(courseDraft.thumbnail?.trim() && !isTemplateThumbnail(courseDraft.thumbnail));

  const newCourse = {
    id: courseId,
    status: courseDraft.status || "Draft",
    enrolled: courseDraft.enrolled || 0,
    modules: courseDraft.modules || [],
    resources: courseDraft.resources || null,
    updatedAt: new Date().toISOString().slice(0, 10),
    coverColor: courseDraft.coverColor?.trim() || tileTemplate.accentColor,
    description: courseDraft.description?.trim() || tileTemplate.description,
    level: courseDraft.level || "Beginner",
    duration: courseDraft.duration !== undefined ? courseDraft.duration : "",
    thumbnail: hasCustomThumbnail ? courseDraft.thumbnail.trim() : "",
    hasCustomThumbnail,
    ...courseDraft,
  };

  // Ensure fallbacks are applied if courseDraft had empty strings
  if (!newCourse.thumbnail?.trim()) newCourse.thumbnail = tileTemplate.thumbnail;
  if (!newCourse.description?.trim()) newCourse.description = tileTemplate.description;
  if (!newCourse.coverColor?.trim()) newCourse.coverColor = tileTemplate.accentColor;

  // Check if course already exists (e.g. updating an existing draft)
  const existingIdx = courses.findIndex((c) => c.id === newCourse.id);
  let updatedCourses: any[];

  if (existingIdx >= 0) {
    updatedCourses = [...courses];
    updatedCourses[existingIdx] = newCourse;
  } else {
    updatedCourses = [newCourse, ...courses];
  }

  persistCourses(updatedCourses);
  return newCourse;
}

export const addCourse = createCourse;

export async function updateCourse(id: string, patch: any): Promise<any> {
  await delay(150);
  const courses = loadCoursesFromStorage();

  const updatedCourses = courses.map((c) =>
    c.id === id
      ? { ...c, ...patch, updatedAt: new Date().toISOString().slice(0, 10) }
      : c
  );

  persistCourses(updatedCourses);
  return updatedCourses.find((c) => c.id === id);
}

export async function deleteCourse(id: string): Promise<{ id: string }> {
  await delay(150);
  const courses = loadCoursesFromStorage();
  const filtered = courses.filter((c) => c.id !== id);
  persistCourses(filtered);
  return { id };
}

export async function setCourseStatus(id: string, status: string): Promise<any> {
  return updateCourse(id, { status });
}

export async function addModule(courseId: string, moduleDraft: any): Promise<any> {
  await delay(150);
  const courses = loadCoursesFromStorage();
  const newModule = { id: uid("mod"), lessons: [], subtopics: [], ...moduleDraft };

  const updatedCourses = courses.map((c) =>
    c.id === courseId ? { ...c, modules: [...(c.modules || []), newModule] } : c
  );

  persistCourses(updatedCourses);
  return newModule;
}

export async function deleteModule(courseId: string, moduleId: string): Promise<{ moduleId: string }> {
  await delay(150);
  const courses = loadCoursesFromStorage();

  const updatedCourses = courses.map((c) =>
    c.id === courseId
      ? { ...c, modules: (c.modules || []).filter((m: any) => m.id !== moduleId) }
      : c
  );

  persistCourses(updatedCourses);
  return { moduleId };
}

export async function addLesson(courseId: string, moduleId: string, lessonDraft: any): Promise<any> {
  await delay(150);
  const courses = loadCoursesFromStorage();
  const newLesson = {
    id: uid("les"),
    duration: "10 min",
    type: "reading",
    summary: lessonDraft.summary || `Lesson on ${lessonDraft.title}`,
    sections: [
      {
        heading: "Core Concepts",
        body: "Practical guidelines and step-by-step concepts.",
      },
    ],
    keyTakeaways: [`Understand and apply ${lessonDraft.title}.`],
    ...lessonDraft,
  };

  const updatedCourses = courses.map((c) =>
    c.id === courseId
      ? {
          ...c,
          modules: (c.modules || []).map((m: any) =>
            m.id === moduleId
              ? {
                  ...m,
                  lessons: [...(m.lessons || []), newLesson],
                  subtopics: [...(m.subtopics || []), newLesson],
                }
              : m
          ),
        }
      : c
  );

  persistCourses(updatedCourses);
  return newLesson;
}

export async function deleteLesson(courseId: string, moduleId: string, lessonId: string): Promise<{ lessonId: string }> {
  await delay(150);
  const courses = loadCoursesFromStorage();

  const updatedCourses = courses.map((c) =>
    c.id === courseId
      ? {
          ...c,
          modules: (c.modules || []).map((m: any) =>
            m.id === moduleId
              ? {
                  ...m,
                  lessons: (m.lessons || []).filter((l: any) => l.id !== lessonId),
                  subtopics: (m.subtopics || []).filter((s: any) => s.id !== lessonId),
                }
              : m
          ),
        }
      : c
  );

  persistCourses(updatedCourses);
  return { lessonId };
}
