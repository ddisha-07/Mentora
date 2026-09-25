'use client';

import { useTheme } from '@/context/ThemeContext';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import type { CareerAnalysisResult, CourseRecommendation } from '@/app/api/analyze-profile/route';
import * as courseService from '@/lib/admin/services/courseService';
import { mockCourses } from '@/lib/admin/data/mockCourses';
import { formatAdminCourseForDisplay, PredefinedCourse, getTechDetails } from '@/lib/courses/courseFormatter';
import { calculateCourseLiteralProgress, calculateCourseDuration } from '@/lib/courses/progressEngine';
import PredefinedCourseCard from '@/components/courses/PredefinedCourseCard';
import CoursePreviewModal from '@/components/courses/CoursePreviewModal';

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const statsCards = [
  {
    id: 'courses-in-progress',
    label: 'Courses In Progress',
    value: '4',
    sub: '2 due this week',
    trend: '+1 this month',
    trendUp: true,
    gradient: ['#FF6B35', '#FF8C5A'],
    bg: 'rgba(255,107,53,0.12)',
    border: 'rgba(255,107,53,0.25)',
    chart: [40, 55, 45, 65, 72, 68, 80],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
      </svg>
    ),
  },
  {
    id: 'hours-learned',
    label: 'Hours Learned',
    value: '12.5h',
    sub: 'this week',
    trend: '+3.2h vs last week',
    trendUp: true,
    gradient: ['#F59E0B', '#FBBF24'],
    bg: 'rgba(245,158,11,0.12)',
    border: 'rgba(245,158,11,0.25)',
    chart: [30, 42, 28, 55, 48, 62, 75],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    id: 'skill-gaps-closed',
    label: 'Skill Gaps Closed',
    value: '7',
    sub: 'of 18 identified',
    trend: '39% complete',
    trendUp: true,
    gradient: ['#10B981', '#34D399'],
    bg: 'rgba(16,185,129,0.12)',
    border: 'rgba(16,185,129,0.25)',
    chart: [10, 20, 25, 30, 38, 42, 50],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
        <path d="M9 12l2 2 4-4" />
        <path d="M21 12c.552 0 1-.448 1-1a9 9 0 10-9 9c.552 0 1-.448 1-1v-1a1 1 0 00-1-1H12a7 7 0 117-7v1a1 1 0 001 1z" />
      </svg>
    ),
  },
  {
    id: 'quiz-average',
    label: 'Quiz Average',
    value: '87%',
    sub: 'across 14 quizzes',
    trend: '+5% this month',
    trendUp: true,
    gradient: ['#8B5CF6', '#A78BFA'],
    bg: 'rgba(139,92,246,0.12)',
    border: 'rgba(139,92,246,0.25)',
    chart: [60, 72, 65, 80, 78, 85, 87],
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
];

const tasks = [
  { id: 't1', task: 'Complete Node.js Module 5', due: 'Today', done: false, priority: 'high' },
  { id: 't2', task: 'Watch System Design Lecture', due: 'Today', done: true, priority: 'medium' },
  { id: 't3', task: 'Take TypeScript Quiz', due: 'Tomorrow', done: false, priority: 'high' },
  { id: 't4', task: 'Review AWS Architecture notes', due: 'Thu', done: false, priority: 'low' },
  { id: 't5', task: 'Post in Community: Week 3 reflection', due: 'Fri', done: false, priority: 'low' },
];

const initialAdminCourses: PredefinedCourse[] = mockCourses
  .filter((c: any) => c.status !== 'Archived')
  .map((c: any, idx: number) => formatAdminCourseForDisplay(c, idx));

const recommendedCourses = initialAdminCourses;

const JOURNEY_PALETTES = [
  {
    gradientLight: ['#0284C7', '#0369A1'],
    gradientDark: ['#0284C7', '#075985'],
    iconType: 'j1',
  },
  {
    gradientLight: ['#C084FC', '#9333EA'],
    gradientDark: ['#9333EA', '#7E22CE'],
    iconType: 'j2',
  },
  {
    gradientLight: ['#FBBF24', '#D97706'],
    gradientDark: ['#D97706', '#B45309'],
    iconType: 'j3',
  },
  {
    gradientLight: ['#F87171', '#DC2626'],
    gradientDark: ['#DC2626', '#991B1B'],
    iconType: 'j4',
  },
  {
    gradientLight: ['#34D399', '#059669'],
    gradientDark: ['#059669', '#047857'],
    iconType: 'j1',
  },
  {
    gradientLight: ['#FB923C', '#EA580C'],
    gradientDark: ['#EA580C', '#C2410C'],
    iconType: 'j2',
  },
];

// ─── Mini Sparkline Chart ─────────────────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 64, h = 28;
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(' ');
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={0.8}
      />
      <circle
        cx={(((data.length - 1) / (data.length - 1)) * w)}
        cy={h - ((data[data.length - 1] - min) / range) * h}
        r={2.5}
        fill={color}
      />
    </svg>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ value, color = '#FF6B35', height = 6 }: { value: number; color?: string; height?: number }) {
  return (
    <div className="w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)', height }}>
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color}, ${color}cc)` }}
      />
    </div>
  );
}

// ─── Journey Isometric 3D Icon Component ──────────────────────────────────
function JourneyIsometricIcon({ type }: { type: string }) {
  if (type === 'j1') {
    return (
      <svg viewBox="0 0 80 80" fill="none" className="w-full h-full drop-shadow-md">
        <path d="M40 10 L68 25 L40 40 L12 25 Z" fill="white" opacity="0.9" />
        <path d="M12 25 L40 40 L40 62 L12 47 Z" fill="white" opacity="0.6" />
        <path d="M40 40 L68 25 L68 47 L40 62 Z" fill="white" opacity="0.75" />
        <circle cx="40" cy="25" r="7" fill="#0284C7" />
        <path d="M37 25 L39 27 L43 23" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === 'j2') {
    return (
      <svg viewBox="0 0 80 80" fill="none" className="w-full h-full drop-shadow-md">
        <path d="M40 12 Q58 12 62 26 Q72 28 70 40 Q72 54 58 56 Q54 62 40 62 Q26 62 22 56 Q10 54 12 40 Q10 28 20 26 Q24 12 40 12 Z" fill="white" opacity="0.85" />
        <path d="M30 35 Q40 25 50 35 L44 48 Q40 42 36 48 Z" fill="#7E22CE" opacity="0.8" />
        <circle cx="40" cy="46" r="4" fill="white" />
      </svg>
    );
  }
  if (type === 'j3') {
    return (
      <svg viewBox="0 0 80 80" fill="none" className="w-full h-full drop-shadow-md">
        <path d="M20 20 L60 20 L60 48 L20 48 Z" fill="white" opacity="0.9" />
        <rect x="26" y="38" width="7" height="6" fill="#D97706" />
        <rect x="36" y="30" width="7" height="14" fill="#B45309" />
        <rect x="46" y="24" width="7" height="20" fill="#78350F" />
        <path d="M12 48 L68 48 L60 56 L20 56 Z" fill="white" opacity="0.65" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 80 80" fill="none" className="w-full h-full drop-shadow-md">
      <circle cx="40" cy="40" r="26" fill="white" opacity="0.9" />
      <circle cx="40" cy="40" r="18" fill="#DC2626" />
      <circle cx="40" cy="40" r="11" fill="white" />
      <circle cx="40" cy="40" r="5" fill="#DC2626" />
      <path d="M52 24 L64 12" stroke="white" strokeWidth="3" strokeLinecap="round" />
      <path d="M60 12 L64 12 L64 16" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// ─── Course Thumbnail Banner Header Component ─────────────────────────────
function CourseBannerGraphic({
  type,
  bannerText,
  techLogo,
  tag,
}: {
  type: string;
  bannerText: string;
  techLogo: string;
  tag: string;
}) {
  return (
    <div className="relative w-full h-32 rounded-t-2xl overflow-hidden flex flex-col justify-between p-3 select-none">
      {/* Background Grid Pattern */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.25) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.25) 1px, transparent 1px)
          `,
          backgroundSize: '16px 16px',
        }}
      />

      {/* Radial ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 85% 15%, rgba(255,255,255,0.3) 0%, transparent 60%)',
        }}
      />

      {/* Top Header Row: Pill Badge on Left, Tech Logo on Right */}
      <div className="relative z-10 flex items-center justify-between w-full">
        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#0084FF] text-white shadow-md uppercase tracking-wider">
          {tag}
        </span>
        <div className="w-6 h-6 rounded-md bg-black/35 backdrop-blur-sm border border-white/20 flex items-center justify-center text-[10px] font-black text-white shadow-sm">
          {techLogo}
        </div>
      </div>

      {/* Main Banner Visual Content (Left: Styled Title Text, Right: Vector Graphic) */}
      <div className="relative z-10 flex items-end justify-between gap-1 mt-auto">
        <div className="max-w-[55%] pb-1">
          <p className="text-[11px] font-black leading-tight tracking-wider text-white uppercase drop-shadow-md">
            {bannerText}
          </p>
        </div>

        {/* Right-side Vector Artwork */}
        <div className="w-20 h-16 relative flex items-center justify-center">
          {type === 'typescript' && (
            <svg viewBox="0 0 100 80" fill="none" className="w-full h-full drop-shadow-md">
              <rect x="10" y="10" width="76" height="50" rx="5" fill="#0F172A" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
              <rect x="16" y="18" width="28" height="4" rx="2" fill="#38BDF8" />
              <rect x="16" y="26" width="44" height="4" rx="2" fill="#818CF8" opacity="0.9" />
              <rect x="22" y="34" width="34" height="4" rx="2" fill="#93C5FD" opacity="0.7" />
              <rect x="16" y="42" width="24" height="4" rx="2" fill="#38BDF8" />
              <path d="M5 62 Q 48 70 91 62 L 86 70 Q 48 76 10 70 Z" fill="#334155" />
              <rect x="40" y="62" width="16" height="3" rx="1.5" fill="#94A3B8" />
              <circle cx="74" cy="30" r="11" fill="#3178C6" stroke="white" strokeWidth="1" />
              <text x="74" y="34" textAnchor="middle" fill="white" fontSize="8.5" fontWeight="900">TS</text>
            </svg>
          )}

          {type === 'docker' && (
            <svg viewBox="0 0 100 80" fill="none" className="w-full h-full drop-shadow-md">
              <rect x="15" y="22" width="20" height="14" rx="2" fill="#0284C7" stroke="white" strokeWidth="1" />
              <rect x="39" y="22" width="20" height="14" rx="2" fill="#0EA5E9" stroke="white" strokeWidth="1" />
              <rect x="63" y="22" width="20" height="14" rx="2" fill="#38BDF8" stroke="white" strokeWidth="1" />
              <rect x="27" y="6" width="20" height="14" rx="2" fill="#7DD3FC" stroke="white" strokeWidth="1" />
              <rect x="51" y="6" width="20" height="14" rx="2" fill="#0284C7" stroke="white" strokeWidth="1" />
              <path d="M5 46 Q 48 64 91 46 L 84 60 Q 48 72 12 60 Z" fill="#0369A1" stroke="white" strokeWidth="1" />
            </svg>
          )}

          {type === 'graphql' && (
            <svg viewBox="0 0 100 80" fill="none" className="w-full h-full drop-shadow-md">
              <line x1="50" y1="12" x2="20" y2="48" stroke="#E10098" strokeWidth="2" />
              <line x1="50" y1="12" x2="80" y2="48" stroke="#E10098" strokeWidth="2" />
              <line x1="20" y1="48" x2="80" y2="48" stroke="#E10098" strokeWidth="2" />
              <line x1="50" y1="12" x2="50" y2="65" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="2 2" />
              <circle cx="50" cy="12" r="9" fill="#E10098" stroke="white" strokeWidth="1.5" />
              <circle cx="20" cy="48" r="8" fill="#8B5CF6" stroke="white" strokeWidth="1.5" />
              <circle cx="80" cy="48" r="8" fill="#3B82F6" stroke="white" strokeWidth="1.5" />
              <circle cx="50" cy="65" r="7" fill="#F59E0B" stroke="white" strokeWidth="1.5" />
            </svg>
          )}

          {type === 'redis' && (
            <svg viewBox="0 0 100 80" fill="none" className="w-full h-full drop-shadow-md">
              <ellipse cx="40" cy="16" rx="26" ry="7" fill="#EF4444" stroke="white" strokeWidth="1" />
              <path d="M14 16 v 9 cy 25 rx 26 ry 7 v -9" fill="#DC2626" />
              <ellipse cx="40" cy="25" rx="26" ry="7" fill="#EF4444" stroke="white" strokeWidth="1" />
              <path d="M14 25 v 9 cy 34 rx 26 ry 7 v -9" fill="#B91C1C" />
              <ellipse cx="40" cy="34" rx="26" ry="7" fill="#EF4444" stroke="white" strokeWidth="1" />
              <path d="M14 34 v 9 cy 43 rx 26 ry 7 v -9" fill="#991B1B" />
              <ellipse cx="40" cy="43" rx="26" ry="7" fill="#B91C1C" stroke="white" strokeWidth="1" />
              <g transform="translate(54, 18)">
                <circle cx="13" cy="13" r="12" fill="#F97316" stroke="white" strokeWidth="1.5" />
                <path d="M14 4 L7 14 L13 14 L12 22 L20 11 L14 11 Z" fill="white" />
              </g>
            </svg>
          )}

          {type === 'microservices' && (
            <svg viewBox="0 0 100 80" fill="none" className="w-full h-full drop-shadow-md">
              <rect x="28" y="8" width="44" height="20" rx="4" fill="#6366F1" stroke="white" strokeWidth="1" />
              <line x1="50" y1="28" x2="22" y2="48" stroke="#818CF8" strokeWidth="1.5" />
              <line x1="50" y1="28" x2="50" y2="48" stroke="#818CF8" strokeWidth="1.5" />
              <line x1="50" y1="28" x2="78" y2="48" stroke="#818CF8" strokeWidth="1.5" />
              <rect x="6" y="48" width="32" height="18" rx="4" fill="#4F46E5" stroke="white" strokeWidth="1" />
              <rect x="42" y="48" width="32" height="18" rx="4" fill="#4F46E5" stroke="white" strokeWidth="1" />
              <rect x="78" y="48" width="18" height="18" rx="4" fill="#4F46E5" stroke="white" strokeWidth="1" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard Component ─────────────────────────────────────────────────
export default function DashboardPage() {
  const { isBright } = useTheme();
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>(
    Object.fromEntries(tasks.map((t) => [t.id, t.done]))
  );
  const [journeysExpanded, setJourneysExpanded] = useState(true);
  const [careerAnalysis, setCareerAnalysis] = useState<CareerAnalysisResult | null>(null);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mentora_enrolled_courses');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object') {
            return parsed;
          }
        }
      } catch (err) {
        console.error('Failed to load enrolled courses from localStorage:', err);
      }
    }
    return {};
  });
  const [completedModulesMap, setCompletedModulesMap] = useState<Record<string, string[]>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('mentora_completed_modules');
        if (raw) return JSON.parse(raw);
      } catch {}
    }
    return {};
  });
  const [activeGapTab, setActiveGapTab] = useState<'missing' | 'possessed'>('missing');

  const [adminCourses, setAdminCourses] = useState<PredefinedCourse[]>(initialAdminCourses);
  const [previewCourse, setPreviewCourse] = useState<PredefinedCourse | null>(null);
  const [ongoingCourse, setOngoingCourse] = useState<{
    courseId: string;
    courseTitle: string;
    category: string;
    techLogo: string;
    techIcon: string;
    techGradient: string;
    techTextColor: string;
    currentModuleNumber: number;
    totalModules: number;
    currentModuleTitle: string;
    moduleSubtitle: string;
    currentSlide: number;
    totalSlides: number;
    progress: number;
    remainingMins: number;
    totalMins: number;
    actionUrl: string;
  } | null>(null);

  const deriveOngoingCourse = (course: any) => {
    const title = course.title || course.name || 'Web Development';
    const category = course.category || course.subtitle || 'Software Engineering';
    const tech = getTechDetails(title, category);
    const rawModules = Array.isArray(course.modules) ? course.modules : [];
    const totalModules = rawModules.length || course.modulesCount || (course.modules || 6) || 6;

    // Literal progress: count actual completed modules from database / state
    const completedIds =
      completedModulesMap[course.id] ||
      (course.id === 'crs_1' ? completedModulesMap['demo'] : undefined) ||
      (course.id === 'demo' ? completedModulesMap['crs_1'] : undefined) ||
      rawModules.filter((m: any) => m.completed).map((m: any) => m.id) ||
      [];
    const completedMods = completedIds.length;
    const computedTotal = rawModules.length > 0 ? rawModules.length : (course.id === 'crs_1' || course.id === 'demo' ? 15 : (course.modulesCount || 6));
    const progress = computedTotal > 0 ? Math.min(100, Math.round((completedMods / computedTotal) * 100)) : 0;
    const currentModuleNumber = Math.min(computedTotal, Math.max(1, completedMods + 1));

    let currentModuleTitle = `Tile ${currentModuleNumber}: Core Concepts & Architecture`;
    let moduleSubtitle = 'Hands-on practice, visual masterclasses, and verified milestone gates';
    let totalMins = 30;

    if (rawModules[currentModuleNumber - 1]) {
      const mod = rawModules[currentModuleNumber - 1];
      currentModuleTitle = mod.title || currentModuleTitle;
      moduleSubtitle = mod.subtitle || mod.tagline || mod.description || mod.content?.tagline || moduleSubtitle;
      if (mod.duration) {
        const parsed = parseInt(mod.duration, 10);
        if (!isNaN(parsed) && parsed > 0) totalMins = parsed;
      }
    }

    const moduleChunk = 100 / (computedTotal || 1);
    const withinModuleProgress = (progress % moduleChunk) / moduleChunk;
    const remainingMins = Math.max(5, Math.round(totalMins * (1 - withinModuleProgress)));
    const currentSlide = Math.max(1, Math.round(withinModuleProgress * 8) || 1);

    return {
      courseId: course.id,
      courseTitle: title,
      category,
      techLogo: tech.techLogo,
      techIcon: tech.techIcon,
      techGradient: tech.techGradient,
      techTextColor: tech.techTextColor,
      currentModuleNumber,
      totalModules,
      currentModuleTitle,
      moduleSubtitle,
      currentSlide,
      totalSlides: 8,
      progress,
      remainingMins,
      totalMins,
      actionUrl: `/dashboard/journeys/${course.id}`,
    };
  };

  const loadOngoingCourse = async () => {
    try {
      const res = await fetch('/api/courses/ongoing');
      if (res.ok) {
        const data = await res.json();
        if (data.hasOngoingCourse && data.ongoingCourse) {
          setOngoingCourse(data.ongoingCourse);
          return;
        }
      }
    } catch (err) {
      console.warn('Could not fetch ongoing course from API:', err);
    }

    // Fallback: check locally enrolled courses
    try {
      const raw = localStorage.getItem('mentora_enrolled_courses');
      const enrolled = raw ? JSON.parse(raw) : {};
      const enrolledKeys = Object.keys(enrolled).filter((k) => !!enrolled[k]);
      if (enrolledKeys.length === 0) {
        setOngoingCourse(null);
        return;
      }

      const allAvailable = [
        ...adminCourses,
        ...(careerAnalysis?.targetedCourseRecommendations?.map((c: any, i: number) => formatAdminCourseForDisplay(c, i)) || []),
      ];

      const match = allAvailable.find((c) => enrolled[c.id]);
      if (match) {
        setOngoingCourse(deriveOngoingCourse(match));
      } else {
        setOngoingCourse(null);
      }
    } catch {
      setOngoingCourse(null);
    }
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('mentora_career_analysis');
      if (saved) {
        setCareerAnalysis(JSON.parse(saved));
      }
    } catch (err) {
      console.error('Failed to load career analysis from localStorage:', err);
    }

    let isMounted = true;
    async function loadAdminCourses() {
      try {
        const stored = await courseService.getCourses();
        if (!isMounted) return;
        if (Array.isArray(stored) && stored.length > 0) {
          const formatted = stored
            .filter((c: any) => c.status !== 'Archived')
            .map((c: any, idx: number) => formatAdminCourseForDisplay(c, idx));
          setAdminCourses(formatted);
        }
      } catch (err) {
        console.error('Failed to load courses from courseService:', err);
      }
    }

    async function loadProgressFromDb() {
      try {
        const res = await fetch('/api/courses/progress');
        if (res.ok) {
          const data = await res.json();
          if (data && data.progressMap) {
            const newCompleted: Record<string, string[]> = {};
            const newEnrolled: Record<string, boolean> = {};
            Object.entries(data.progressMap).forEach(([cId, pData]: [string, any]) => {
              if (pData.completedModules && Array.isArray(pData.completedModules)) {
                newCompleted[cId] = pData.completedModules;
              }
              if (pData.enrolled) {
                newEnrolled[cId] = true;
              }
            });
            if (Object.keys(newCompleted).length > 0) {
              setCompletedModulesMap((prev) => ({ ...prev, ...newCompleted }));
            }
            if (Object.keys(newEnrolled).length > 0) {
              setEnrolledCourseIds((prev) => ({ ...prev, ...newEnrolled }));
            }
          }
        }
      } catch (err) {
        console.warn('Failed to load courses progress from API in dashboard:', err);
      }
    }

    loadAdminCourses();
    loadProgressFromDb();
    loadOngoingCourse();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'mentora_admin_courses_v2') {
        loadAdminCourses();
      }
      if (e.key === 'mentora_enrolled_courses') {
        try {
          const raw = localStorage.getItem('mentora_enrolled_courses');
          if (raw) setEnrolledCourseIds(JSON.parse(raw));
          else setEnrolledCourseIds({});
        } catch {}
        loadOngoingCourse();
      }
      if (e.key === 'mentora_completed_modules') {
        try {
          const raw = localStorage.getItem('mentora_completed_modules');
          if (raw) setCompletedModulesMap(JSON.parse(raw));
        } catch {}
        loadOngoingCourse();
      }
    };
    const handleCustomUpdate = () => {
      loadAdminCourses();
      loadOngoingCourse();
    };
    const handleCustomEnrolled = (e: any) => {
      if (e?.detail) setEnrolledCourseIds(e.detail);
      loadOngoingCourse();
    };
    const handleCustomProgress = (e: any) => {
      if (e?.detail) setCompletedModulesMap(e.detail);
      loadOngoingCourse();
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('mentora_courses_updated', handleCustomUpdate);
    window.addEventListener('mentora_enrolled_updated', handleCustomEnrolled);
    window.addEventListener('mentora_progress_updated', handleCustomProgress);

    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('mentora_courses_updated', handleCustomUpdate);
      window.removeEventListener('mentora_enrolled_updated', handleCustomEnrolled);
      window.removeEventListener('mentora_progress_updated', handleCustomProgress);
    };
  }, []);

  const toggleEnrollCourse = async (id: string) => {
    const isCurrentlyEnrolled = !!enrolledCourseIds[id];
    const nextState = !isCurrentlyEnrolled;

    setEnrolledCourseIds((prev) => {
      const next = {
        ...prev,
        [id]: nextState,
      };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('mentora_enrolled_courses', JSON.stringify(next));
          window.dispatchEvent(new CustomEvent('mentora_enrolled_updated', { detail: next }));
        } catch (err) {
          console.error('Failed to save enrolled courses to localStorage:', err);
        }
      }
      return next;
    });

    // Sync with database and backend
    try {
      await fetch('/api/courses/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: id,
          action: nextState ? 'enroll' : 'unenroll',
        }),
      });
      loadOngoingCourse();
    } catch (err) {
      console.warn('Failed to sync enrollment with backend API:', err);
    }
  };

  const enrolledJourneys = useMemo(() => {
    const list: Array<{
      id: string;
      name: string;
      subtitle: string;
      modules: number;
      done: number;
      progress: number;
      status: string;
      gradientLight: string[];
      gradientDark: string[];
      textColor: string;
      borderColor: string;
      iconType: string;
    }> = [];

    const allAvailable = [
      ...adminCourses,
      ...(careerAnalysis?.targetedCourseRecommendations?.map((c: any, i: number) => formatAdminCourseForDisplay(c, i)) || []),
    ];

    const effectiveEnrolledMap = Object.keys(enrolledCourseIds).some((k) => !!enrolledCourseIds[k])
      ? enrolledCourseIds
      : { 'crs_1': true };

    const seen = new Set<string>();

    allAvailable.forEach((c) => {
      if (effectiveEnrolledMap[c.id] && !seen.has(c.id)) {
        seen.add(c.id);
        const palette = JOURNEY_PALETTES[list.length % JOURNEY_PALETTES.length];
        const rawModules = Array.isArray(c.modules) ? c.modules : [];
        const totalMods = rawModules.length || c.modulesCount || 4;
        const completedIds = completedModulesMap[c.id] || rawModules.filter((m: any) => m.completed).map((m: any) => m.id);
        const doneMods = completedIds.length;
        const progress = totalMods > 0 ? Math.min(100, Math.round((doneMods / totalMods) * 100)) : 0;

        list.push({
          id: c.id,
          name: c.title,
          subtitle: c.category ? `${c.category} Track` : (c.reason || 'Active learning pathway'),
          modules: totalMods,
          done: doneMods,
          progress,
          status: 'active',
          gradientLight: palette.gradientLight,
          gradientDark: palette.gradientDark,
          textColor: '#FFFFFF',
          borderColor: 'rgba(255,255,255,0.2)',
          iconType: palette.iconType,
        });
      }
    });

    return list;
  }, [enrolledCourseIds, completedModulesMap, adminCourses, careerAnalysis]);

  const bgPage = isBright ? '#FFF8F0' : '#111010';
  const cardBg = isBright ? '#FFFFFF' : '#1C1916';
  const cardBorder = isBright ? 'rgba(234,88,12,0.1)' : 'rgba(255,107,53,0.08)';
  const textPrimary = isBright ? '#1C1917' : '#FFF8F0';
  const textMuted = isBright ? '#78716C' : 'rgba(255,248,240,0.5)';
  const textSub = isBright ? '#A8A29E' : 'rgba(255,248,240,0.35)';
  const sectionLabelStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#FF6B35',
    marginBottom: '12px',
  };
  const cardShadow = isBright
    ? '0 2px 20px rgba(234,88,12,0.07), 0 1px 4px rgba(0,0,0,0.04)'
    : '0 2px 20px rgba(0,0,0,0.35), 0 1px 4px rgba(0,0,0,0.2)';

  const getHour = () => {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
  };
  const streakDays = 14;

  return (
    <div
      id="mentora-dashboard"
      className="min-h-screen flex"
      style={{ background: bgPage, fontFamily: 'var(--font-geist-sans), sans-serif' }}
    >
      {/* Left Sidebar */}
      <DashboardSidebar />

      {/* Center scrollable column */}
      <main
        id="dashboard-main"
        className="flex-1 ml-[76px] lg:ml-[84px] mr-[340px] min-h-screen overflow-y-auto px-6 py-6"
        style={{ scrollbarWidth: 'none' }}
      >
        <div className="max-w-[860px] mx-auto space-y-6">

          {/* ── 1. Welcome Header Banner ──────────────────────────────────── */}
          <div
            id="welcome-header"
            className="relative rounded-3xl overflow-hidden shadow-2xl"
            style={{
              background: isBright
                ? 'linear-gradient(135deg, #FF6B35 0%, #E85D2C 40%, #FF8C5A 100%)'
                : 'linear-gradient(135deg, #FF6B35 0%, #C94E20 40%, #FF7A45 100%)',
              boxShadow: '0 8px 36px rgba(255,107,53,0.35), 0 2px 8px rgba(0,0,0,0.15)',
            }}
          >
            {/* Background decorative radial overlay */}
            <div
              className="absolute inset-0 rounded-3xl pointer-events-none overflow-hidden"
              style={{
                background: 'radial-gradient(circle at 75% 50%, rgba(255,255,255,0.13) 0%, transparent 55%), radial-gradient(circle at 15% 85%, rgba(0,0,0,0.08) 0%, transparent 50%)',
              }}
            />

            {/* Floating dots decoration */}
            <div className="absolute top-4 right-[255px] w-2 h-2 rounded-full bg-white opacity-30" />
            <div className="absolute top-10 right-[240px] w-1 h-1 rounded-full bg-white opacity-20" />
            <div className="absolute bottom-5 left-[42%] w-1.5 h-1.5 rounded-full bg-white opacity-25" />

            {/* Right Character Image Container */}
            <div
              className="absolute right-4 bottom-0 top-0 w-[240px] xl:w-[270px] pointer-events-none z-10 flex items-end justify-end"
            >
              <img
                src="/dashboard-character.png"
                alt="Mentora student character"
                style={{
                  maxHeight: '175px',
                  width: 'auto',
                  objectFit: 'contain',
                  objectPosition: 'bottom right',
                  filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.3))',
                }}
              />
            </div>

            {/* Banner Text Content */}
            <div
              className="relative z-20 flex items-center px-7 py-6 min-h-[155px]"
            >
              <div className="flex-1 pr-[230px]">
                <h1 className="text-2xl xl:text-3xl font-bold text-white leading-tight mb-2">
                  Good {getHour()}, Alex! 👋
                </h1>
                <p className="text-sm leading-relaxed text-white/85 max-w-[340px]">
                  You&apos;re on a roll — 3 modules left to hit your weekly goal. Keep it up!
                </p>
              </div>
            </div>
          </div>

          {/* ── AI Career Assessment & Roadmap Blueprint ──────────────────────── */}
          {careerAnalysis ? (
            <section
              id="ai-career-blueprint"
              className="relative rounded-3xl p-6 overflow-hidden transition-all duration-300 shadow-xl border"
              style={{
                background: isBright
                  ? 'linear-gradient(135deg, #FFFFFF 0%, #FFF8F2 60%, #FFF0E6 100%)'
                  : 'linear-gradient(135deg, #18110B 0%, #130E09 60%, #201309 100%)',
                borderColor: isBright ? 'rgba(234, 88, 12, 0.25)' : 'rgba(255, 107, 53, 0.25)',
                boxShadow: cardShadow,
              }}
            >
              {/* Background ambient decorative glow */}
              <div
                className="absolute top-0 right-0 w-80 h-80 pointer-events-none rounded-full blur-3xl opacity-20 -z-0"
                style={{ background: 'radial-gradient(circle, #EA580C 0%, transparent 70%)' }}
              />

              <div className="relative z-10 space-y-5">
                {/* Header Row: Level Badge & Future Goal */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4" style={{ borderColor: isBright ? 'rgba(234,88,12,0.15)' : 'rgba(255,107,53,0.15)' }}>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono font-bold" style={{ color: textMuted }}>
                        Target Goal: <span style={{ color: textPrimary }} className="underline decoration-orange-500 font-extrabold">{careerAnalysis.futureGoal}</span>
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: textPrimary }}>
                      Skill Gap & Readiness Analysis
                    </h2>
                  </div>

                  {/* Level Pill Badge */}
                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <div
                      className="px-4 py-2 rounded-2xl border shadow-sm flex items-center gap-2"
                      style={{
                        background:
                          careerAnalysis.currentLevel === 'Advanced'
                            ? isBright ? '#FEF3C7' : '#2C1D06'
                            : careerAnalysis.currentLevel === 'Intermediate'
                            ? isBright ? '#FFEDD5' : '#291406'
                            : isBright ? '#ECFDF5' : '#062817',
                        borderColor:
                          careerAnalysis.currentLevel === 'Advanced'
                            ? '#F59E0B'
                            : careerAnalysis.currentLevel === 'Intermediate'
                            ? '#EA580C'
                            : '#10B981',
                      }}
                    >
                      <span className="text-lg">
                        {careerAnalysis.currentLevel === 'Advanced' ? '🏆' : careerAnalysis.currentLevel === 'Intermediate' ? '⚡' : '🌱'}
                      </span>
                      <div>
                        <div className="text-[10px] font-mono uppercase font-bold tracking-wider" style={{ color: textMuted }}>
                          Current Level
                        </div>
                        <div
                          className="text-sm font-black font-mono"
                          style={{
                            color:
                              careerAnalysis.currentLevel === 'Advanced'
                                ? '#D97706'
                                : careerAnalysis.currentLevel === 'Intermediate'
                                ? '#EA580C'
                                : '#059669',
                          }}
                        >
                          {careerAnalysis.currentLevel} Tier
                        </div>
                      </div>
                    </div>

                    <Link
                      href="/onboarding"
                      className="px-3 py-2 rounded-xl text-xs font-mono font-semibold border transition-all hover:scale-105"
                      style={{
                        borderColor: isBright ? 'rgba(234,88,12,0.3)' : 'rgba(255,107,53,0.3)',
                        color: '#EA580C',
                        background: isBright ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.3)',
                      }}
                      title="Update your profile or upload a new resume"
                    >
                      Update Profile ↺
                    </Link>
                  </div>
                </div>

                {/* Interactive Tabs for Missing Skills (Prerequisite Gaps) vs Possessed Skills */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveGapTab('missing')}
                      className={`text-xs font-mono font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                        activeGapTab === 'missing'
                          ? 'bg-[#EA580C] text-white border-[#EA580C] shadow-sm'
                          : isBright
                          ? 'bg-white border-stone-200 text-stone-600 hover:border-orange-300'
                          : 'bg-[#120b06] border-orange-950/60 text-zinc-400 hover:border-orange-800'
                      }`}
                    >
                      ⚠️ Prerequisite Gaps ({careerAnalysis.prerequisiteGaps?.length || careerAnalysis.missingSkills?.length || 0})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveGapTab('possessed')}
                      className={`text-xs font-mono font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                        activeGapTab === 'possessed'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : isBright
                          ? 'bg-white border-stone-200 text-stone-600 hover:border-emerald-300'
                          : 'bg-[#120b06] border-emerald-950/60 text-zinc-400 hover:border-emerald-800'
                      }`}
                    >
                      ✓ Possessed Skills ({careerAnalysis.possessedSkills?.length || 0})
                    </button>
                  </div>

                  {activeGapTab === 'missing' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in duration-200">
                      {(careerAnalysis.prerequisiteGaps && careerAnalysis.prerequisiteGaps.length > 0
                        ? careerAnalysis.prerequisiteGaps
                        : (careerAnalysis.missingSkills || []).map((s) => ({
                            skill: s,
                            impact: 'Required prerequisite to achieve target career role.',
                            urgency: 'High' as const,
                          }))
                      ).map((gap, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl border transition-all hover:scale-[1.01]"
                          style={{
                            background: cardBg,
                            borderColor:
                              gap.urgency === 'High'
                                ? 'rgba(239, 68, 68, 0.35)'
                                : gap.urgency === 'Medium'
                                ? 'rgba(245, 158, 11, 0.35)'
                                : 'rgba(59, 130, 246, 0.35)',
                          }}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold font-mono" style={{ color: textPrimary }}>
                              {gap.skill}
                            </span>
                            <span
                              className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                                gap.urgency === 'High'
                                  ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                                  : gap.urgency === 'Medium'
                                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                  : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                              }`}
                            >
                              {gap.urgency} Gap
                            </span>
                          </div>
                          <p className="text-[11px] leading-relaxed" style={{ color: textMuted }}>
                            {gap.impact}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 p-3 rounded-2xl border animate-in fade-in duration-200" style={{ background: cardBg, borderColor: cardBorder }}>
                      {careerAnalysis.possessedSkills?.map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-xs font-mono font-semibold px-3 py-1 rounded-xl border flex items-center gap-1.5"
                          style={{
                            background: isBright ? '#ECFDF5' : 'rgba(16, 185, 129, 0.1)',
                            color: isBright ? '#065F46' : '#34D399',
                            borderColor: isBright ? '#A7F3D0' : 'rgba(16, 185, 129, 0.3)',
                          }}
                        >
                          <span className="text-emerald-500 font-bold">✓</span>
                          <span>{skill}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          ) : (
            <div
              className="p-5 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-4 transition-all"
              style={{
                background: isBright
                  ? 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)'
                  : 'linear-gradient(135deg, #1C130D 0%, #140E0A 100%)',
                borderColor: isBright ? '#FDBA74' : 'rgba(234, 88, 12, 0.3)',
                boxShadow: cardShadow,
              }}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-2xl shrink-0">
                  🎯
                </div>
                <div>
                  <h3 className="text-sm font-black" style={{ color: textPrimary }}>
                    Unlock Your AI Career Blueprint & Course Recommendations
                  </h3>
                  <p className="text-xs" style={{ color: textMuted }}>
                    Paste your LinkedIn profile and CV to get Gemini-powered gap analysis and 3-4 targeted courses.
                  </p>
                </div>
              </div>
              <Link
                href="/onboarding"
                className="px-5 py-2.5 rounded-xl font-bold font-mono text-xs text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/20 whitespace-nowrap transition-all active:scale-95"
              >
                Complete Onboarding →
              </Link>
            </div>
          )}

          {/* ── 2. Bento Stats Grid (Layout matching User Reference Image 1) ────────────── */}
          <section id="quick-stats">
            <div className="grid grid-cols-12 gap-4">
              
              {/* ── Card 1: Courses In Progress (Yellow / Amber Theme - Top Left) ── */}
              <div
                id="stats-card-courses"
                className="col-span-12 md:col-span-5 rounded-3xl p-5 relative overflow-hidden transition-all duration-300 hover:scale-[1.015] hover:shadow-xl group"
                style={{
                  background: isBright
                    ? 'linear-gradient(135deg, #FEF08A 0%, #FEF9C3 100%)'
                    : 'linear-gradient(135deg, #2A2208 0%, #1A1505 100%)',
                  border: isBright ? '1px solid rgba(234, 179, 8, 0.4)' : '1px solid rgba(245, 158, 11, 0.3)',
                  color: isBright ? '#451A03' : '#FFF8F0',
                  boxShadow: cardShadow,
                }}
              >
                {/* Decorative "+" watermark background graphic */}
                <div className="absolute -top-3 -right-3 w-28 h-28 opacity-15 pointer-events-none text-amber-500 font-bold text-9xl select-none leading-none">
                  +
                </div>

                {/* Header Title */}
                <h3 className="text-base font-extrabold tracking-tight mb-3 flex items-center justify-between" style={{ color: isBright ? '#78350F' : '#FBBF24' }}>
                  <span>Courses In Progress:</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">+1 this month</span>
                </h3>

                {/* Sub-Metrics Columns with Underline Accents */}
                <div className="grid grid-cols-3 gap-2 mb-4 text-left">
                  <div className="pb-1.5 border-b-2 border-amber-500/60">
                    <p className="text-xl xl:text-2xl font-black" style={{ color: isBright ? '#78350F' : '#FDE68A' }}>
                      {enrolledJourneys.length} <span className="text-xs font-semibold">courses</span>
                    </p>
                    <p className="text-[10px] uppercase font-bold tracking-wider opacity-70 mt-0.5">Active</p>
                  </div>
                  <div className="pb-1.5 border-b-2 border-amber-500/30">
                    <p className="text-xl xl:text-2xl font-black" style={{ color: isBright ? '#92400E' : '#F59E0B' }}>
                      {enrolledJourneys.length > 0 ? Math.min(enrolledJourneys.length, 2) : 0} <span className="text-xs font-semibold">due</span>
                    </p>
                    <p className="text-[10px] uppercase font-bold tracking-wider opacity-70 mt-0.5">This Week</p>
                  </div>
                  <div className="pb-1.5 border-b-2 border-amber-500/60">
                    <p className="text-xl xl:text-2xl font-black" style={{ color: isBright ? '#451A03' : '#FBBF24' }}>
                      {enrolledJourneys.length > 0 ? 1 : 0} <span className="text-xs font-semibold">done</span>
                    </p>
                    <p className="text-[10px] uppercase font-bold tracking-wider opacity-70 mt-0.5">Completed</p>
                  </div>
                </div>

                {/* Bar Chart Graphics & Time Labels */}
                <div className="pt-2">
                  <div className="h-16 flex items-end justify-between gap-1 px-1">
                    {[
                      { h: '45%', active: false },
                      { h: '65%', active: false },
                      { h: '25%', active: true },
                      { h: '85%', active: false },
                      { h: '35%', active: false },
                      { h: '95%', active: true },
                      { h: '55%', active: false },
                      { h: '40%', active: false },
                      { h: '70%', active: false },
                    ].map((bar, idx) => (
                      <div
                        key={idx}
                        className="flex-1 rounded-full transition-all duration-300 group-hover:scale-y-105"
                        style={{
                          height: bar.h,
                          background: bar.active
                            ? (isBright ? '#78350F' : '#FBBF24')
                            : (isBright ? 'rgba(217, 119, 6, 0.25)' : 'rgba(245, 158, 11, 0.2)'),
                          boxShadow: bar.active ? '0 0 10px rgba(251, 191, 36, 0.5)' : undefined,
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] opacity-60 font-mono mt-1.5 px-0.5">
                    <span>07:30 p.m.</span>
                    <span>12:00 p.m.</span>
                  </div>
                </div>
              </div>

              {/* ── Card 2: Visits & Learning Summary (Pink / Rose / Ember Theme - Top Right) ── */}
              <div
                id="stats-card-learning-summary"
                className="col-span-12 md:col-span-7 rounded-3xl p-5 relative overflow-hidden transition-all duration-300 hover:scale-[1.015] hover:shadow-xl group"
                style={{
                  background: isBright
                    ? 'linear-gradient(135deg, #FBCFE8 0%, #FCE7F3 100%)'
                    : 'linear-gradient(135deg, #2D1420 0%, #1A0B13 100%)',
                  border: isBright ? '1px solid rgba(244, 114, 182, 0.4)' : '1px solid rgba(244, 114, 182, 0.3)',
                  color: isBright ? '#831843' : '#FFF8F0',
                  boxShadow: cardShadow,
                }}
              >
                {/* Decorative Heart Watermark shape in background */}
                <div className="absolute -top-6 -right-6 w-36 h-36 opacity-15 pointer-events-none flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-pink-400">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </div>

                {/* Header Title */}
                <h3 className="text-base font-extrabold tracking-tight mb-3 flex items-center justify-between" style={{ color: isBright ? '#9D174D' : '#F472B6' }}>
                  <span>Learning Summary & Hours:</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">+3.2h vs last week</span>
                </h3>

                {/* Sub-Metrics Columns */}
                <div className="grid grid-cols-3 gap-2 mb-3 text-left">
                  <div>
                    <p className="text-xl xl:text-2xl font-black" style={{ color: isBright ? '#831843' : '#FCE7F3' }}>12.5h</p>
                    <p className="text-[10px] uppercase font-bold tracking-wider opacity-70 mt-0.5">AVERAGE</p>
                  </div>
                  <div>
                    <p className="text-xl xl:text-2xl font-black" style={{ color: isBright ? '#9D174D' : '#F472B6' }}>3.2h</p>
                    <p className="text-[10px] uppercase font-bold tracking-wider opacity-70 mt-0.5">TODAY</p>
                  </div>
                  <div>
                    <p className="text-xl xl:text-2xl font-black" style={{ color: isBright ? '#BE185D' : '#F472B6' }}>01:30h</p>
                    <p className="text-[10px] uppercase font-bold tracking-wider opacity-70 mt-0.5">PEAK SESSION</p>
                  </div>
                </div>

                {/* Continuous Wavy Area Line Chart with Time Axis */}
                <div className="relative pt-1">
                  <svg viewBox="0 0 350 70" fill="none" className="w-full h-16 overflow-visible">
                    <defs>
                      <linearGradient id="pink-chart-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F472B6" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#F472B6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0 45 C 30 40, 50 50, 80 48 C 110 46, 130 20, 160 30 C 180 38, 200 12, 220 10 C 235 25, 250 40, 280 42 C 310 44, 330 35, 350 38 L 350 70 L 0 70 Z"
                      fill="url(#pink-chart-grad)"
                    />
                    <path
                      d="M 0 45 C 30 40, 50 50, 80 48 C 110 46, 130 20, 160 30 C 180 38, 200 12, 220 10 C 235 25, 250 40, 280 42 C 310 44, 330 35, 350 38"
                      fill="none"
                      stroke={isBright ? '#BE185D' : '#F472B6'}
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    {/* Peak Dot & Dashed Guide Line at 12:00 */}
                    <line x1="220" y1="10" x2="220" y2="70" stroke={isBright ? '#BE185D' : '#F472B6'} strokeDasharray="3 3" opacity="0.6" strokeWidth="1.5" />
                    <circle cx="220" cy="10" r="4.5" fill={isBright ? '#831843' : '#FFF8F0'} stroke={isBright ? '#BE185D' : '#F472B6'} strokeWidth="2.5" />
                  </svg>

                  {/* Time X-Axis */}
                  <div className="flex justify-between text-[10px] opacity-60 font-mono mt-0.5 px-1">
                    <span>10:30</span>
                    <span>11:00</span>
                    <span>11:30</span>
                    <span className="font-bold underline text-pink-400">12:00</span>
                    <span>12:30</span>
                    <span>13:00</span>
                    <span>13:30</span>
                  </div>
                </div>
              </div>

              {/* ── Card 3: Skill Gaps & Mastery (Green / Emerald Theme - Bottom Left) ── */}
              <div
                id="stats-card-skill-gaps"
                className="col-span-12 md:col-span-5 rounded-3xl p-5 relative overflow-hidden transition-all duration-300 hover:scale-[1.015] hover:shadow-xl group"
                style={{
                  background: isBright
                    ? 'linear-gradient(135deg, #A7F3D0 0%, #D1FAE5 100%)'
                    : 'linear-gradient(135deg, #092618 0%, #051910 100%)',
                  border: isBright ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(16, 185, 129, 0.3)',
                  color: isBright ? '#064E3B' : '#FFF8F0',
                  boxShadow: cardShadow,
                }}
              >
                {/* Decorative Triangle / Pyramid Watermark */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 opacity-15 pointer-events-none">
                  <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full text-emerald-400">
                    <polygon points="50,10 90,90 10,90" />
                  </svg>
                </div>

                {/* Header Title */}
                <h3 className="text-base font-extrabold tracking-tight mb-3 flex items-center justify-between" style={{ color: isBright ? '#065F46' : '#34D399' }}>
                  <span>By Condition & Skill Gaps:</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">39% Complete</span>
                </h3>

                {/* Sub-Metrics Columns */}
                <div className="grid grid-cols-3 gap-2 text-left">
                  <div>
                    <p className="text-xl xl:text-2xl font-black" style={{ color: isBright ? '#064E3B' : '#A7F3D0' }}>7 <span className="text-xs font-semibold">gaps</span></p>
                    <p className="text-[10px] uppercase font-bold tracking-wider opacity-70 mt-0.5">CLOSED</p>
                  </div>
                  <div>
                    <p className="text-xl xl:text-2xl font-black" style={{ color: isBright ? '#065F46' : '#34D399' }}>5 <span className="text-xs font-semibold">skills</span></p>
                    <p className="text-[10px] uppercase font-bold tracking-wider opacity-70 mt-0.5">IN REVIEW</p>
                  </div>
                  <div>
                    <p className="text-xl xl:text-2xl font-black" style={{ color: isBright ? '#047857' : '#10B981' }}>6 <span className="text-xs font-semibold">left</span></p>
                    <p className="text-[10px] uppercase font-bold tracking-wider opacity-70 mt-0.5">REMAINING</p>
                  </div>
                </div>
              </div>

              {/* ── Card 4: Quiz & Assessment Sessions (Blue / Purple Theme - Bottom Right) ── */}
              <div
                id="stats-card-quizzes"
                className="col-span-12 md:col-span-7 rounded-3xl p-5 relative overflow-hidden transition-all duration-300 hover:scale-[1.015] hover:shadow-xl group"
                style={{
                  background: isBright
                    ? 'linear-gradient(135deg, #BFDBFE 0%, #DBEAFE 100%)'
                    : 'linear-gradient(135deg, #101B38 0%, #0A1124 100%)',
                  border: isBright ? '1px solid rgba(59, 130, 246, 0.4)' : '1px solid rgba(99, 102, 241, 0.3)',
                  color: isBright ? '#1E3A8A' : '#FFF8F0',
                  boxShadow: cardShadow,
                }}
              >
                {/* Decorative Starburst Watermark shape */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 opacity-20 pointer-events-none">
                  <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full text-blue-400">
                    <path d="M50 0 L61 38 L100 50 L61 62 L50 100 L39 62 L0 50 L39 38 Z" />
                  </svg>
                </div>

                {/* Header Title */}
                <h3 className="text-base font-extrabold tracking-tight mb-3 flex items-center justify-between" style={{ color: isBright ? '#1E40AF' : '#818CF8' }}>
                  <span>Quiz Performance & Sessions:</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">+5% this month</span>
                </h3>

                {/* Sub-Metrics Columns */}
                <div className="grid grid-cols-3 gap-2 text-left">
                  <div>
                    <p className="text-xl xl:text-2xl font-black" style={{ color: isBright ? '#1E3A8A' : '#C7D2FE' }}>87%</p>
                    <p className="text-[10px] uppercase font-bold tracking-wider opacity-70 mt-0.5">AVG SCORE</p>
                  </div>
                  <div>
                    <p className="text-xl xl:text-2xl font-black" style={{ color: isBright ? '#1E40AF' : '#818CF8' }}>14</p>
                    <p className="text-[10px] uppercase font-bold tracking-wider opacity-70 mt-0.5">QUIZZES</p>
                  </div>
                  <div>
                    <p className="text-xl xl:text-2xl font-black" style={{ color: isBright ? '#2563EB' : '#A5B4FC' }}>00:24m</p>
                    <p className="text-[10px] uppercase font-bold tracking-wider opacity-70 mt-0.5">AVG SPEED</p>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* ── 3. Continue Learning ──────────────────────────────────────── */}
          {ongoingCourse && (
            <section id="continue-learning">
              <p style={sectionLabelStyle}>Continue Learning</p>
              <div
                onClick={() => {
                  window.location.href = ongoingCourse.actionUrl || `/dashboard/journeys/${ongoingCourse.courseId}`;
                }}
                className="rounded-2xl p-5 transition-all duration-200 hover:scale-[1.005] cursor-pointer"
                style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: cardShadow }}
              >
                <div className="flex gap-4 items-start">
                  {/* Thumbnail */}
                  <div
                    className="w-24 h-20 rounded-xl flex-shrink-0 flex items-center justify-center relative overflow-hidden"
                    style={{ background: ongoingCourse.techGradient || 'linear-gradient(135deg, #1a2a3a, #0f1c2a)' }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl mb-1">{ongoingCourse.techIcon || '⚙️'}</div>
                        <div
                          className="text-xs font-bold uppercase tracking-wider"
                          style={{ color: ongoingCourse.techTextColor || '#93c5fd' }}
                        >
                          {ongoingCourse.techLogo || 'NODE.JS'}
                        </div>
                      </div>
                    </div>
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#FF6B35' }}>
                        <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5 ml-0.5">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span
                          className="text-xs font-medium px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(255,107,53,0.1)', color: '#FF6B35', border: '1px solid rgba(255,107,53,0.2)' }}
                        >
                          {ongoingCourse.category}
                        </span>
                        <h3 className="mt-1.5 text-base font-bold" style={{ color: textPrimary }}>
                          Module {ongoingCourse.currentModuleNumber}: {ongoingCourse.currentModuleTitle}
                        </h3>
                        <p className="text-sm mt-0.5" style={{ color: textMuted }}>
                          {ongoingCourse.moduleSubtitle}
                        </p>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs" style={{ color: textMuted }}>Progress</span>
                        <span className="text-xs font-bold" style={{ color: '#FF6B35' }}>{ongoingCourse.progress}%</span>
                      </div>
                      <ProgressBar value={ongoingCourse.progress} color="#FF6B35" height={6} />
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-xs" style={{ color: textSub }}>
                          {ongoingCourse.remainingMins} / {ongoingCourse.totalMins} mins remaining
                        </span>
                        <span className="text-xs" style={{ color: textSub }}>
                          Module {ongoingCourse.currentModuleNumber} of {ongoingCourse.totalModules}
                          {ongoingCourse.totalSlides > 1 && (
                            <span className="ml-1 opacity-80">
                              • Slide {ongoingCourse.currentSlide} of {ongoingCourse.totalSlides}
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Resume button */}
                    <div className="mt-3">
                      <Link
                        href={ongoingCourse.actionUrl || `/dashboard/journeys/${ongoingCourse.courseId}`}
                        id="btn-resume-learning"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-[1.03] hover:-translate-y-0.5"
                        style={{
                          background: 'linear-gradient(135deg, #FF6B35, #E85D2C)',
                          color: '#fff',
                          boxShadow: '0 4px 14px rgba(255,107,53,0.35)',
                        }}
                      >
                        <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4 ml-0.5">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                        Resume Learning
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}



          {/* ── 5. Recommended Courses Container Card ──────────────────────── */}
          <section
            id="recommended-courses"
            className="relative rounded-3xl p-6 overflow-hidden transition-all duration-300"
            style={{
              background: isBright
                ? 'linear-gradient(135deg, #FFF1E8 0%, #FFF8F2 50%, #FFEBE0 100%)'
                : 'linear-gradient(135deg, rgba(255, 107, 53, 0.08) 0%, rgba(28, 25, 22, 0.95) 50%, rgba(255, 107, 53, 0.04) 100%)',
              border: isBright ? '1px solid rgba(255, 107, 53, 0.2)' : '1px solid rgba(255, 107, 53, 0.18)',
              boxShadow: isBright
                ? '0 10px 30px rgba(234, 88, 12, 0.08), 0 2px 8px rgba(0, 0, 0, 0.03)'
                : '0 10px 35px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            }}
          >
            {/* 3D Decorative Overlapping Background Ribbon Artwork (Top Right) */}
            <div className="absolute -top-10 -right-10 w-96 h-96 pointer-events-none opacity-40 overflow-hidden">
              <svg viewBox="0 0 300 300" fill="none" className="w-full h-full">
                <rect
                  x="70"
                  y="20"
                  width="130"
                  height="210"
                  rx="65"
                  transform="rotate(35 135 125)"
                  fill={isBright ? 'url(#grad-ribbon-light-1)' : 'url(#grad-ribbon-dark-1)'}
                />
                <rect
                  x="145"
                  y="60"
                  width="125"
                  height="200"
                  rx="62"
                  transform="rotate(35 207 160)"
                  fill={isBright ? 'url(#grad-ribbon-light-2)' : 'url(#grad-ribbon-dark-2)'}
                />
                <defs>
                  <linearGradient id="grad-ribbon-light-1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FF9E7A" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#FF6B35" stopOpacity="0.3" />
                  </linearGradient>
                  <linearGradient id="grad-ribbon-light-2" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFC2A8" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#FF8C5A" stopOpacity="0.25" />
                  </linearGradient>
                  <linearGradient id="grad-ribbon-dark-1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#C94E20" stopOpacity="0.08" />
                  </linearGradient>
                  <linearGradient id="grad-ribbon-dark-2" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FF8C5A" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#1C1916" stopOpacity="0.04" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Header Row */}
            <div className="relative z-10 flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-black tracking-tight mt-1 mb-0" style={{ color: textPrimary }}>
                  {careerAnalysis ? 'AI Targeted Course Recommendations' : 'Curated Admin Courses'}
                </h2>
              </div>
              <Link
                href="/dashboard/courses"
                className="text-xs font-semibold px-3 py-1.5 rounded-full border border-[#FF6B35]/30 text-[#FF6B35] bg-[#FF6B35]/10 hover:bg-[#FF6B35] hover:text-white transition-all duration-200"
              >
                See all ({adminCourses.length > 0 ? adminCourses.length : recommendedCourses.length}) →
              </Link>
            </div>

            {/* Nested Cards Grid / Scroll */}
            <div className="relative z-10 flex gap-4 overflow-x-auto pb-2 pt-1" style={{ scrollbarWidth: 'none' }}>
              {(careerAnalysis?.targetedCourseRecommendations && careerAnalysis.targetedCourseRecommendations.length > 0
                ? careerAnalysis.targetedCourseRecommendations.map((c: any, i: number) => formatAdminCourseForDisplay(c, i))
                : (adminCourses.length > 0 ? adminCourses : recommendedCourses.map((c: any, i: number) => formatAdminCourseForDisplay(c, i)))
              ).map((course: PredefinedCourse) => {
                const isEnrolled = !!enrolledCourseIds[course.id];

                return (
                  <PredefinedCourseCard
                    key={course.id}
                    course={course}
                    isEnrolled={isEnrolled}
                    onEnrollToggle={toggleEnrollCourse}
                    onViewSyllabus={(c) => setPreviewCourse(c)}
                  />
                );
              })}
            </div>

            {/* Syllabus / Curriculum Preview Modal */}
            <CoursePreviewModal
              course={previewCourse}
              isOpen={Boolean(previewCourse)}
              onClose={() => setPreviewCourse(null)}
              onEnroll={toggleEnrollCourse}
              isEnrolled={previewCourse ? !!enrolledCourseIds[previewCourse.id] : false}
              ctaMode="enroll"
            />
          </section>

          {/* ── 6. My Learning Journeys (Outer Container Card matching theme) ── */}
          <section
            id="my-learning-journeys"
            className="relative rounded-3xl p-6 overflow-hidden transition-all duration-300 pb-6 mb-6"
            style={{
              background: isBright
                ? 'linear-gradient(135deg, #FFF1E8 0%, #FFF8F2 50%, #FFEBE0 100%)'
                : 'linear-gradient(135deg, rgba(255, 107, 53, 0.08) 0%, rgba(28, 25, 22, 0.95) 50%, rgba(255, 107, 53, 0.04) 100%)',
              border: isBright ? '1px solid rgba(255, 107, 53, 0.2)' : '1px solid rgba(255, 107, 53, 0.18)',
              boxShadow: isBright
                ? '0 10px 30px rgba(234, 88, 12, 0.08), 0 2px 8px rgba(0, 0, 0, 0.03)'
                : '0 10px 35px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            }}
          >
            {/* 3D Decorative Overlapping Background Ribbon Artwork (Top Right) */}
            <div className="absolute -top-10 -right-10 w-96 h-96 pointer-events-none opacity-35 overflow-hidden">
              <svg viewBox="0 0 300 300" fill="none" className="w-full h-full">
                <rect
                  x="70"
                  y="20"
                  width="130"
                  height="210"
                  rx="65"
                  transform="rotate(35 135 125)"
                  fill={isBright ? 'url(#grad-ribbon-jlight-1)' : 'url(#grad-ribbon-jdark-1)'}
                />
                <rect
                  x="145"
                  y="60"
                  width="125"
                  height="200"
                  rx="62"
                  transform="rotate(35 207 160)"
                  fill={isBright ? 'url(#grad-ribbon-jlight-2)' : 'url(#grad-ribbon-jdark-2)'}
                />
                <defs>
                  <linearGradient id="grad-ribbon-jlight-1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FF9E7A" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#FF6B35" stopOpacity="0.3" />
                  </linearGradient>
                  <linearGradient id="grad-ribbon-jlight-2" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FFC2A8" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#FF8C5A" stopOpacity="0.25" />
                  </linearGradient>
                  <linearGradient id="grad-ribbon-jdark-1" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#C94E20" stopOpacity="0.08" />
                  </linearGradient>
                  <linearGradient id="grad-ribbon-jdark-2" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FF8C5A" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#1C1916" stopOpacity="0.04" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Header Row */}
            <div className="relative z-10 flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-black tracking-tight mt-1 mb-0" style={{ color: textPrimary }}>
                  My Learning Journeys
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                    enrolledJourneys.length > 0
                      ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/25'
                      : 'bg-amber-500/15 text-amber-500 border-amber-500/25'
                  }`}
                >
                  {enrolledJourneys.length} Active {enrolledJourneys.length === 1 ? 'Pathway' : 'Pathways'}
                </span>
                <button
                  id="btn-toggle-journeys"
                  onClick={() => setJourneysExpanded((v) => !v)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-[#FF6B35]/30 text-[#FF6B35] bg-[#FF6B35]/10 hover:bg-[#FF6B35] hover:text-white transition-all duration-200"
                >
                  {journeysExpanded ? 'Collapse' : 'Expand'}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    className="w-3.5 h-3.5 transition-transform duration-300"
                    style={{ transform: journeysExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Expanded Content Box */}
            <div
              className="relative z-10 transition-all duration-500 overflow-hidden space-y-3"
              style={{
                maxHeight: journeysExpanded ? '2000px' : '0px',
                opacity: journeysExpanded ? 1 : 0,
              }}
            >
              {enrolledJourneys.length === 0 ? (
                /* Empty state when not enrolled yet */
                <div
                  id="empty-enrolled-journeys"
                  className="py-12 px-6 rounded-3xl border text-center flex flex-col items-center justify-center transition-all duration-300 relative overflow-hidden"
                  style={{
                    background: isBright ? 'rgba(255, 255, 255, 0.75)' : 'rgba(255, 255, 255, 0.03)',
                    borderColor: isBright ? 'rgba(234, 88, 12, 0.2)' : 'rgba(255, 107, 53, 0.18)',
                    boxShadow: cardShadow,
                  }}
                >
                  {/* Glowing Compass / Sparkle Icon */}
                  <div className="w-14 h-14 rounded-2xl bg-[#FF6B35]/15 text-[#FF6B35] flex items-center justify-center mb-3 shadow-inner">
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" />
                      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                    </svg>
                  </div>

                  <p
                    className="text-base sm:text-lg font-bold tracking-tight mb-2 max-w-lg leading-snug"
                    style={{ color: textPrimary }}
                  >
                    &ldquo;Your next skill is waiting — explore a course and start learning.&rdquo;
                  </p>
                  <p className="text-xs max-w-md mb-4" style={{ color: textMuted }}>
                    Browse our courses above, choose a pathway that matches your career goals, and click &ldquo;Start Learning&rdquo; to begin.
                  </p>

                  <a
                    href="#recommended-courses"
                    onClick={(e) => {
                      e.preventDefault();
                      const el = document.getElementById('recommended-courses');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        window.location.href = '/dashboard/courses';
                      }
                    }}
                    className="px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/20 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                  >
                    <span>Explore Courses</span>
                    <span>→</span>
                  </a>
                </div>
              ) : (
                /* Journey Cards Grid (2 per row) */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  {enrolledJourneys.map((j) => (
                    <div
                      key={j.id}
                      id={`journey-${j.id}`}
                      className="rounded-3xl p-4.5 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer shadow-lg group flex flex-col justify-between"
                      style={{
                        background: isBright
                          ? `linear-gradient(135deg, ${j.gradientLight[0]}, ${j.gradientLight[1]})`
                          : `linear-gradient(135deg, ${j.gradientDark[0]}, ${j.gradientDark[1]})`,
                        color: j.textColor,
                        border: `1px solid ${j.borderColor}`,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                      }}
                    >
                      {/* Top Row: Isometric Icon + Title/Subtitle + Right White Rounded Box */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="w-11 h-11 relative flex-shrink-0 flex items-center justify-center">
                          <JourneyIsometricIcon type={j.iconType} />
                        </div>

                        <div className="flex-1 min-w-0 pr-1">
                          <h3 className="text-sm font-black leading-tight tracking-tight text-white drop-shadow-sm group-hover:underline">
                            {j.name}
                          </h3>
                          <p className="text-[11px] mt-1 font-medium text-white/80 line-clamp-1">
                            {j.subtitle}
                          </p>
                        </div>

                        <div className="flex flex-col items-center flex-shrink-0">
                          <div className="w-12 h-12 rounded-xl bg-white shadow-lg flex flex-col items-center justify-center text-slate-900 p-0.5">
                            <span className="text-sm font-black leading-none text-[#0F172A]">
                              {j.done}<span className="text-[9px] font-bold opacity-60">/{j.modules}</span>
                            </span>
                            <span className="text-[7.5px] font-black uppercase tracking-wider text-slate-500 mt-0.5">
                              Modules
                            </span>
                          </div>
                          <span className="text-[8px] font-extrabold mt-1 text-white/80 uppercase tracking-wider">
                            Enrolled
                          </span>
                        </div>
                      </div>

                      {/* Bottom Row: Graph Bar with percentage right beside + Enroll Link */}
                      <div className="mt-4 pt-1 flex items-center justify-between gap-3">
                        <div className="flex-1 flex items-center gap-2">
                          <div className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/30 backdrop-blur-sm p-[1px]">
                            <div
                              className="h-full rounded-full transition-all duration-700 bg-white shadow-sm"
                              style={{ width: `${j.progress}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-black text-white min-w-[28px]">
                            {j.progress}%
                          </span>
                        </div>

                        <Link
                          href={`/dashboard/journeys/${j.id}`}
                          className="flex items-center gap-1 text-[11px] font-extrabold text-white transition-transform group-hover:translate-x-1"
                        >
                          <span>Continue</span>
                          <span>→</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom Footer Bar */}
              <div
                className="rounded-2xl px-5 py-3.5 flex items-center justify-between mt-3"
                style={{
                  background: cardBg,
                  border: `1px solid ${cardBorder}`,
                  boxShadow: cardShadow,
                }}
              >
                <span className="text-xs font-medium" style={{ color: textMuted }}>
                  ⚡ <strong style={{ color: textPrimary }}>{enrolledJourneys.length} active {enrolledJourneys.length === 1 ? 'journey' : 'journeys'}</strong>
                  {enrolledJourneys.length > 0 &&
                    ` · ${enrolledJourneys.reduce((sum, j) => sum + (j.done || 0), 0)} total modules completed`}
                </span>
                <Link
                  href="/dashboard/journeys"
                  className="text-xs font-bold px-3 py-1.5 rounded-full text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white border border-[#FF6B35]/30 transition-all duration-200"
                >
                  Browse More Journeys →
                </Link>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* Right Panel */}
      <DashboardRightPanel />
    </div>
  );
}
