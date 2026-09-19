// src/lib/services/mentoraAiCourseService.ts
// Client service for Mentora AI Course Creator & Learning Coach

export interface CoursePlanResponse {
  success: boolean;
  plan: {
    course_overview: {
      title: string;
      description: string;
      category: string;
      difficulty: string;
      duration_weeks: number;
      total_deliverables: number;
      learning_outcomes: string[];
    };
    modules: Array<{
      module_number: number;
      title: string;
      purpose: string;
      introduction: string;
      learning_objectives: string[];
      subtopics: string[];
      estimated_weeks: number;
    }>;
    weeks: Array<{
      week_number: number;
      module_ref: number;
      topics: string[];
      planned_deliverables: Array<{
        deliverable_number: number;
        type: string;
        title: string;
        learning_purpose: string;
        estimated_minutes: number;
        xp: number;
      }>;
      expected_learning_outcome: string;
    }>;
    confirmation_prompt: string;
  };
}

export interface CompleteCourseResponse {
  success: boolean;
  master_course: any;
  mentora_course: any;
}

export interface ClientDocumentInfo {
  name: string;
  mode: "full" | "integrate";
  integrationType?: "reading" | "video" | "reference";
  documentText?: string;
  isVideo?: boolean;
  videoUrl?: string;
  targetModuleIndex?: number;
  smartFlowNote?: string;
}

export async function generateCoursePlan(params: {
  title: string;
  description: string;
  category: string;
  duration_weeks: number;
  difficulty: string;
  documentInfo?: ClientDocumentInfo;
}): Promise<CoursePlanResponse> {
  const res = await fetch("/api/courses/ai/plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to generate course plan.");
  }
  return res.json();
}

export async function generateCompleteCourse(params: {
  title: string;
  description: string;
  category: string;
  duration_weeks: number;
  difficulty: string;
  approved_plan?: any;
  documentInfo?: ClientDocumentInfo;
}): Promise<CompleteCourseResponse> {
  const res = await fetch("/api/courses/ai/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to generate complete course.");
  }
  return res.json();
}

export async function requestCourseEdit(
  message: string,
  courseContext: any
): Promise<any> {
  const res = await fetch("/api/courses/ai/edit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, courseContext }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to process course edit.");
  }
  return res.json();
}

export async function applyCourseEdit(
  proposedChange: any,
  courseContext: any
): Promise<any> {
  const res = await fetch("/api/courses/ai/edit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "apply",
      proposedChange,
      courseContext,
    }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to apply course edit.");
  }
  return res.json();
}

export async function interactDialogue(params: {
  action: "ask" | "hint" | "answer" | "skip";
  scenario?: string;
  question?: string;
  expectedReasoning?: string;
  userAnswer?: string;
  hintCount?: number;
  hints?: string[];
}): Promise<any> {
  const res = await fetch("/api/courses/ai/dialogue", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to interact with dialogue.");
  }
  return res.json();
}

export async function evaluateQuiz(params: {
  moduleTitle: string;
  questions: any[];
  userAnswers: Record<string, number>;
}): Promise<any> {
  const res = await fetch("/api/courses/ai/quiz", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "evaluate", ...params }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to evaluate quiz.");
  }
  return res.json();
}

export async function retryQuiz(questions: any[]): Promise<any> {
  const res = await fetch("/api/courses/ai/quiz", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "retry", questions }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to generate quiz retry.");
  }
  return res.json();
}

export async function generateExitAnalysis(params: {
  courseTitle: string;
  completedActivities: any;
  xpBreakdown: any;
}): Promise<any> {
  const res = await fetch("/api/courses/ai/exit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Failed to generate exit analysis.");
  }
  return res.json();
}
