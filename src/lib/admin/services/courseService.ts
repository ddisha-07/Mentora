import { mockCourses } from "../data/mockCourses";
import { uid, delay } from "../utils";

let _courses = [...mockCourses];

export async function getCourses() {
  await delay();
  return [..._courses];
}

export async function addCourse(courseDraft: any) {
  await delay();
  const newCourse = {
    id: uid("crs"),
    status: "Draft",
    enrolled: 0,
    modules: [],
    updatedAt: new Date().toISOString().slice(0, 10),
    coverColor: "#ff7a1a",
    ...courseDraft,
  };
  _courses = [newCourse, ..._courses];
  return newCourse;
}

export async function updateCourse(id: string, patch: any) {
  await delay();
  _courses = _courses.map((c) =>
    c.id === id ? { ...c, ...patch, updatedAt: new Date().toISOString().slice(0, 10) } : c
  );
  return _courses.find((c) => c.id === id);
}

export async function deleteCourse(id: string) {
  await delay();
  _courses = _courses.filter((c) => c.id !== id);
  return { id };
}

export async function setCourseStatus(id: string, status: string) {
  return updateCourse(id, { status });
}

export async function addModule(courseId: string, moduleDraft: any) {
  await delay(200);
  const newModule = { id: uid("mod"), lessons: [], ...moduleDraft };
  _courses = _courses.map((c) =>
    c.id === courseId ? { ...c, modules: [...c.modules, newModule] } : c
  );
  return newModule;
}

export async function deleteModule(courseId: string, moduleId: string) {
  await delay(200);
  _courses = _courses.map((c) =>
    c.id === courseId ? { ...c, modules: c.modules.filter((m: any) => m.id !== moduleId) } : c
  );
  return { moduleId };
}

export async function addLesson(courseId: string, moduleId: string, lessonDraft: any) {
  await delay(200);
  const newLesson = { id: uid("les"), duration: "10 min", ...lessonDraft };
  _courses = _courses.map((c) =>
    c.id === courseId
      ? {
          ...c,
          modules: c.modules.map((m: any) =>
            m.id === moduleId ? { ...m, lessons: [...m.lessons, newLesson] } : m
          ),
        }
      : c
  );
  return newLesson;
}

export async function deleteLesson(courseId: string, moduleId: string, lessonId: string) {
  await delay(200);
  _courses = _courses.map((c) =>
    c.id === courseId
      ? {
          ...c,
          modules: c.modules.map((m: any) =>
            m.id === moduleId
              ? { ...m, lessons: m.lessons.filter((l: any) => l.id !== lessonId) }
              : m
          ),
        }
      : c
  );
  return { lessonId };
}
