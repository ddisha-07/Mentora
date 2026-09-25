// src/lib/courses/progressEngine.ts
// AI and content-driven engine for calculating literal course progress and precise durations

/**
 * Parses any duration string into total minutes.
 * Handles formats like: "45m", "1h 10m", "1.5 hrs", "21 min", "90 sec read", "5 min read", "3 Weeks", etc.
 */
export function parseDurationToMinutes(durationStr: any): number {
  if (typeof durationStr === 'number') {
    return durationStr > 0 ? durationStr : 45;
  }
  if (!durationStr || typeof durationStr !== 'string') {
    return 45;
  }

  const str = durationStr.trim().toLowerCase();

  // Handle seconds e.g. "90 sec" or "90 sec read"
  if (str.includes('sec')) {
    const secMatch = str.match(/(\d+)\s*sec/);
    if (secMatch) {
      return Math.max(1, Math.round(parseInt(secMatch[1], 10) / 60));
    }
  }

  // Handle hours and minutes e.g. "1h 10m", "1 hr 30 min", "2.5 hrs", "2 hrs"
  let totalMins = 0;
  let matched = false;

  const hrMatch = str.match(/(\d+(?:\.\d+)?)\s*(?:h|hr|hrs|hours?)/);
  if (hrMatch) {
    totalMins += Math.round(parseFloat(hrMatch[1]) * 60);
    matched = true;
  }

  const minMatch = str.match(/(\d+)\s*(?:m|min|mins|minutes?)/);
  if (minMatch) {
    totalMins += parseInt(minMatch[1], 10);
    matched = true;
  }

  if (matched) {
    return Math.max(5, totalMins);
  }

  // Handle weeks e.g. "6 Weeks" (assume realistic 4-5 study hours per week)
  if (str.includes('week')) {
    const weekMatch = str.match(/(\d+)\s*week/);
    if (weekMatch) {
      const weeks = parseInt(weekMatch[1], 10);
      return weeks * 4 * 60; // 4 hours per week in minutes
    }
  }

  // Fallback direct integer
  const num = parseInt(str, 10);
  if (!isNaN(num) && num > 0) {
    return num <= 12 ? num * 60 : num;
  }

  return 45;
}

/**
 * AI & Content-heuristic estimation of a module's duration based on:
 * - Explicit module.duration
 * - Video duration (video.duration)
 * - Reading time (content.readTime or word count / 200 WPM)
 * - Flashcards (1 min per card)
 * - Quiz / PassGate questions (1.5 min per question)
 * - Practical Task estimatedTime
 */
export function estimateModuleMinutes(mod: any): number {
  if (!mod) return 45;

  let totalMins = 0;
  let hasSpecificContent = false;

  // 1. Explicit duration
  if (mod.duration && typeof mod.duration === 'string') {
    const parsed = parseDurationToMinutes(mod.duration);
    if (parsed > 0) {
      return parsed;
    }
  }

  // 2. Video component
  if (mod.video?.duration) {
    const vidMins = parseDurationToMinutes(mod.video.duration);
    totalMins += vidMins;
    hasSpecificContent = true;
  }

  // 3. Reading component (readTime or content analysis)
  if (mod.content?.readTime) {
    totalMins += parseDurationToMinutes(mod.content.readTime);
    hasSpecificContent = true;
  } else if (mod.content?.summary || mod.description) {
    const text = `${mod.content?.summary || ''} ${mod.content?.funAnalogy || ''} ${(mod.content?.keyTakeaways || []).join(' ')} ${mod.description || ''}`;
    const wordCount = text.trim().split(/\s+/).length;
    if (wordCount > 30) {
      totalMins += Math.max(2, Math.round(wordCount / 180));
      hasSpecificContent = true;
    }
  }

  // 4. Flashcards component (active recall takes ~1 min per card)
  if (Array.isArray(mod.flashcards) && mod.flashcards.length > 0) {
    totalMins += Math.max(3, Math.round(mod.flashcards.length * 1.2));
    hasSpecificContent = true;
  }

  // 5. Interactive Quiz / PassGate component (~1.5 min per diagnostic question)
  const questions = mod.passGate?.quiz?.questions || mod.questions;
  if (Array.isArray(questions) && questions.length > 0) {
    totalMins += Math.max(4, Math.round(questions.length * 1.5));
    hasSpecificContent = true;
  }

  // 6. Practice Task / Assignment component
  if (mod.content?.task?.estimatedTime) {
    totalMins += parseDurationToMinutes(mod.content.task.estimatedTime);
    hasSpecificContent = true;
  } else if (mod.content?.task) {
    totalMins += 15;
    hasSpecificContent = true;
  }

  // 7. Sub-lessons duration
  if (Array.isArray(mod.lessons) && mod.lessons.length > 0) {
    let lessonsMins = 0;
    for (const les of mod.lessons) {
      lessonsMins += parseDurationToMinutes(les.duration || les.readTime || '15m');
    }
    if (lessonsMins > 0) {
      totalMins = Math.max(totalMins, lessonsMins);
      hasSpecificContent = true;
    }
  }

  if (hasSpecificContent && totalMins > 0) {
    return totalMins;
  }

  // Heuristic baseline if empty (approx 35 to 55 mins based on title keywords)
  const title = (mod.title || '').toLowerCase();
  if (title.includes('diagnostic') || title.includes('check') || title.includes('quiz')) return 20;
  if (title.includes('deep dive') || title.includes('mastery') || title.includes('production')) return 60;
  if (title.includes('architecture') || title.includes('distributed')) return 50;

  return 45;
}

/**
 * Format minutes into a sleek, clean human-readable duration string.
 * Examples: 45 -> "45m", 120 -> "2.0 hrs", 175 -> "2.9 hrs"
 */
export function formatMinutesToDuration(mins: number): string {
  if (mins <= 0) return '30m';
  if (mins < 60) return `${mins}m`;
  const hours = (mins / 60).toFixed(1);
  return `${hours} hrs`;
}

/**
 * Computes the total duration for an entire course from its actual modules.
 */
export function calculateCourseDuration(course: any): { totalMinutes: number; formatted: string } {
  const modules = Array.isArray(course?.modules) ? course.modules : [];

  if (modules.length === 0) {
    const rawDuration = course?.duration;
    if (rawDuration) {
      const parsed = parseDurationToMinutes(rawDuration);
      return { totalMinutes: parsed, formatted: formatMinutesToDuration(parsed) };
    }
    const count = course?.modulesCount || course?.totalModules || 4;
    const est = count * 45;
    return { totalMinutes: est, formatted: formatMinutesToDuration(est) };
  }

  let totalMins = 0;
  for (const mod of modules) {
    totalMins += estimateModuleMinutes(mod);
  }

  return {
    totalMinutes: totalMins,
    formatted: formatMinutesToDuration(totalMins),
  };
}

/**
 * Calculates literal course progress based on whether the user is enrolled
 * and which modules are actually completed.
 *
 * Rules:
 * - If not enrolled in this course -> Progress is strictly 0%!
 * - If enrolled -> Literal progress = (completedCount / totalModules) * 100%
 */
export function calculateCourseLiteralProgress({
  courseId,
  modules,
  totalModules,
  isEnrolled,
  completedModuleIds = [],
  storedProgress,
}: {
  courseId: string;
  modules?: any[];
  totalModules?: number;
  isEnrolled: boolean;
  completedModuleIds?: string[];
  storedProgress?: number;
}): {
  progressPercent: number;
  completedCount: number;
  totalCount: number;
} {
  // If not enrolled at all, literal progress is always 0%
  if (!isEnrolled) {
    return {
      progressPercent: 0,
      completedCount: 0,
      totalCount: (modules && modules.length > 0) ? modules.length : (totalModules || 4),
    };
  }

  const mods = Array.isArray(modules) ? modules : [];
  const totalCount = Math.max(1, mods.length || totalModules || 4);

  // If completedModuleIds array is provided, count matching modules
  if (completedModuleIds && completedModuleIds.length > 0) {
    const completedSet = new Set(completedModuleIds);
    let count = 0;
    if (mods.length > 0) {
      count = mods.filter((m) => completedSet.has(m.id)).length;
    } else {
      count = completedModuleIds.length;
    }
    const progressPercent = Math.min(100, Math.round((count / totalCount) * 100));
    return { progressPercent, completedCount: count, totalCount };
  }

  // Check if modules have internal completed flag
  if (mods.length > 0) {
    const completedInModules = mods.filter((m) => Boolean(m.completed)).length;
    if (completedInModules > 0) {
      const progressPercent = Math.min(100, Math.round((completedInModules / totalCount) * 100));
      return { progressPercent, completedCount: completedInModules, totalCount };
    }
  }

  // If a validated storedProgress percentage exists in user_courses doc
  if (typeof storedProgress === 'number' && storedProgress > 0) {
    const progressPercent = Math.min(100, Math.max(0, storedProgress));
    const completedCount = Math.round((progressPercent / 100) * totalCount);
    return { progressPercent, completedCount, totalCount };
  }

  // Newly enrolled with 0 completed modules
  return {
    progressPercent: 0,
    completedCount: 0,
    totalCount,
  };
}
