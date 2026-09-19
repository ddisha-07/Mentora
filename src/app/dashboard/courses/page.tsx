'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Bot,
  Code2,
  Database,
  Server,
  Shield,
  Terminal,
  Palette,
  Smartphone,
  Cpu,
  Brain,
  Check,
  X,
  Search,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  Clock,
  Zap,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import * as courseService from '@/lib/admin/services/courseService';

function renderArtworkIcon(iconName: string, className = 'w-4 h-4') {
  switch (iconName) {
    case 'bot':
      return <Bot className={className} />;
    case 'code':
      return <Code2 className={className} />;
    case 'database':
      return <Database className={className} />;
    case 'server':
      return <Server className={className} />;
    case 'shield':
      return <Shield className={className} />;
    case 'terminal':
      return <Terminal className={className} />;
    case 'palette':
      return <Palette className={className} />;
    case 'smartphone':
      return <Smartphone className={className} />;
    case 'brain':
      return <Brain className={className} />;
    default:
      return <BookOpen className={className} />;
  }
}

interface FannedCourse {
  id: string;
  title: string;
  subtitle: string;
  instructor: {
    name: string;
    handle: string;
    avatar: string;
    verified: boolean;
  };
  level: number;
  progressPercent: number;
  quizzesCount: number;
  totalModules: number;
  duration: string;
  xpPoints: number;
  cardColor: string;
  accentGradient: string;
  tag: string;
  artworkIcon: string;
  description: string;
  modules: { id: string; title: string; duration: string; isQuiz: boolean; completed: boolean }[];
}

const fannedCourses: FannedCourse[] = [
  {
    id: 'cloud-architect',
    title: 'Full-Stack Cloud Architect',
    subtitle: 'Level 4 Milestone Gate',
    instructor: {
      name: 'Lynn Chang',
      handle: '@lynnchang_eng',
      avatar: 'LC',
      verified: true,
    },
    level: 4,
    progressPercent: 72,
    quizzesCount: 8,
    totalModules: 14,
    duration: '8.5 hrs',
    xpPoints: 2450,
    cardColor: 'from-[#321c10] via-[#22140b] to-[#140c06]',
    accentGradient: 'from-orange-500 via-amber-500 to-yellow-500',
    tag: 'Active Track',
    artworkIcon: 'bot',
    description: 'Master high-availability distributed systems, multi-region cloud resilience, and level-gated enterprise microservices.',
    modules: [
      { id: 'm1', title: 'Core Cloud Resilience & Multi-Region VPCs', duration: '45m', isQuiz: false, completed: true },
      { id: 'm2', title: 'Scalable API Gateways & Edge Routing', duration: '55m', isQuiz: false, completed: true },
      { id: 'm3', title: 'Check: Cloud Architecture Diagnostic', duration: '20m', isQuiz: true, completed: true },
      { id: 'm4', title: 'Distributed Event-Driven Queues with Kafka', duration: '1h 10m', isQuiz: false, completed: false },
      { id: 'm5', title: 'Final Gate: Byzantine Fault Recovery Audit', duration: '35m', isQuiz: true, completed: false },
    ],
  },
  {
    id: 'ts-patterns',
    title: 'Advanced TypeScript Patterns',
    subtitle: 'Type-Level Metaprogramming',
    instructor: {
      name: 'Andrew Paul',
      handle: '@andrew_type',
      avatar: 'AP',
      verified: true,
    },
    level: 7,
    progressPercent: 58,
    quizzesCount: 6,
    totalModules: 12,
    duration: '6.0 hrs',
    xpPoints: 1850,
    cardColor: 'from-[#1a2336] via-[#121927] to-[#0c101a]',
    accentGradient: 'from-blue-500 via-indigo-500 to-cyan-400',
    tag: 'Trending',
    artworkIcon: 'code',
    description: 'Master template literal combinators, recursive type gymnastics, and compiler-level invariant typing.',
    modules: [
      { id: 't1', title: 'Generics, Constraints & Invariant Typing', duration: '40m', isQuiz: false, completed: true },
      { id: 't2', title: 'Conditional Types & Infer Keyword', duration: '50m', isQuiz: false, completed: true },
      { id: 't3', title: 'Template Literal Type Systems', duration: '1h 05m', isQuiz: false, completed: false },
      { id: 't4', title: 'Compiler-Level Validation Benchmark', duration: '30m', isQuiz: true, completed: false },
    ],
  },
  {
    id: 'postgres-opt',
    title: 'High-Throughput PostgreSQL',
    subtitle: 'Distributed Sharding & Indexing',
    instructor: {
      name: 'Sarah Lin',
      handle: '@sarah_db',
      avatar: 'SL',
      verified: true,
    },
    level: 5,
    progressPercent: 45,
    quizzesCount: 5,
    totalModules: 10,
    duration: '5.5 hrs',
    xpPoints: 1620,
    cardColor: 'from-[#102b20] via-[#0c1e16] to-[#07130e]',
    accentGradient: 'from-emerald-500 via-teal-500 to-green-400',
    tag: 'Staff Pick',
    artworkIcon: 'database',
    description: 'Deep dive on EXPLAIN ANALYZE, composite B-tree indexing, connection pooling, and MVCC bloat prevention.',
    modules: [
      { id: 'p1', title: 'Execution Plans & Index Selection Internals', duration: '50m', isQuiz: false, completed: true },
      { id: 'p2', title: 'Partitioning & PgBouncer Pool Setup', duration: '1h 15m', isQuiz: false, completed: false },
      { id: 'p3', title: 'Benchmark: High-Volume Query Optimization', duration: '35m', isQuiz: true, completed: false },
    ],
  },
  {
    id: 'k8s-prod',
    title: 'Kubernetes in Production',
    subtitle: 'Zero-Downtime Microservices',
    instructor: {
      name: 'Marcus Vance',
      handle: '@marcus_ops',
      avatar: 'MV',
      verified: true,
    },
    level: 6,
    progressPercent: 30,
    quizzesCount: 4,
    totalModules: 8,
    duration: '4.0 hrs',
    xpPoints: 1400,
    cardColor: 'from-[#302416] via-[#21180e] to-[#140e08]',
    accentGradient: 'from-amber-600 via-orange-600 to-yellow-500',
    tag: 'Essential',
    artworkIcon: 'server',
    description: 'Container lifecycle, rolling updates, pod autoscaling, ingress controllers, and secrets rotation.',
    modules: [
      { id: 'k1', title: 'Multi-stage Docker Builds & Minimal Images', duration: '40m', isQuiz: false, completed: true },
      { id: 'k2', title: 'Pods, ReplicaSets & Deployments', duration: '1h 00m', isQuiz: false, completed: false },
      { id: 'k3', title: 'Production Cluster Resilience Quiz', duration: '30m', isQuiz: true, completed: false },
    ],
  },
];

interface HistoryItem {
  id: string;
  eventType: 'evaluation' | 'module' | 'milestone' | 'quiz' | 'enroll';
  eventLabel: string;
  courseTitle: string;
  instructorAvatar: string;
  instructorName: string;
  lessonsOrCount: string;
  scoreOrXp: string;
  date: string;
  badgeColor: string;
}

const historyItems: HistoryItem[] = [
  {
    id: 'h1',
    eventType: 'evaluation',
    eventLabel: 'Evaluation Passed',
    courseTitle: 'Cloud Systems Architecture',
    instructorAvatar: 'LC',
    instructorName: 'Lynn Chang',
    lessonsOrCount: 'Gate 4',
    scoreOrXp: '94% • +150 XP',
    date: '21/08',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    id: 'h2',
    eventType: 'module',
    eventLabel: 'Module Completed',
    courseTitle: 'Template Literal Type Systems',
    instructorAvatar: 'AP',
    instructorName: 'Andrew Paul',
    lessonsOrCount: '7 lessons',
    scoreOrXp: '11,3 XP',
    date: '12/07',
    badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  },
  {
    id: 'h3',
    eventType: 'milestone',
    eventLabel: 'Skill Passport Gate',
    instructorAvatar: 'SL',
    instructorName: 'Sarah Lin',
    courseTitle: 'PostgreSQL Distributed Shards',
    lessonsOrCount: '1 cert',
    scoreOrXp: '2,56 ETH (XP)',
    date: '04/01',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  },
  {
    id: 'h4',
    eventType: 'quiz',
    eventLabel: 'Diagnostic Quiz',
    instructorAvatar: 'MV',
    instructorName: 'Marcus Vance',
    courseTitle: 'Kubernetes Pod Topology',
    lessonsOrCount: '3 quizzes',
    scoreOrXp: '6,51 XP',
    date: '24/02',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  },
];

const CARD_PALETTES = [
  {
    cardColor: 'from-[#321c10] via-[#22140b] to-[#140c06]',
    accentGradient: 'from-orange-500 via-amber-500 to-yellow-500',
  },
  {
    cardColor: 'from-[#1a2336] via-[#121927] to-[#0c101a]',
    accentGradient: 'from-blue-500 via-indigo-500 to-cyan-400',
  },
  {
    cardColor: 'from-[#102b20] via-[#0c1e16] to-[#07130e]',
    accentGradient: 'from-emerald-500 via-teal-500 to-green-400',
  },
  {
    cardColor: 'from-[#302416] via-[#21180e] to-[#140e08]',
    accentGradient: 'from-amber-600 via-orange-600 to-yellow-500',
  },
  {
    cardColor: 'from-[#28153c] via-[#1b0d29] to-[#0f0717]',
    accentGradient: 'from-purple-500 via-violet-500 to-indigo-400',
  },
  {
    cardColor: 'from-[#34141d] via-[#240c13] to-[#14060a]',
    accentGradient: 'from-rose-500 via-pink-500 to-orange-400',
  },
];

function getCourseArtworkIcon(category = '', title = ''): string {
  const text = `${category} ${title}`.toLowerCase();
  if (text.includes('ai') || text.includes('machine learning') || text.includes('neural') || text.includes('deep learning')) return 'brain';
  if (text.includes('type') || text.includes('react') || text.includes('frontend') || text.includes('web')) return 'code';
  if (text.includes('postgres') || text.includes('sql') || text.includes('database') || text.includes('data')) return 'database';
  if (text.includes('k8s') || text.includes('kubernetes') || text.includes('cloud') || text.includes('docker') || text.includes('devops')) return 'server';
  if (text.includes('security') || text.includes('cyber') || text.includes('auth')) return 'shield';
  if (text.includes('python')) return 'terminal';
  if (text.includes('design') || text.includes('ui') || text.includes('ux')) return 'palette';
  if (text.includes('mobile') || text.includes('ios') || text.includes('android')) return 'smartphone';
  return 'cpu';
}

function getInstructorInitials(name = ''): string {
  if (!name) return 'MF';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function parseLevelNumber(lvl: any): number {
  if (typeof lvl === 'number') return Math.min(9, Math.max(1, lvl));
  if (typeof lvl === 'string') {
    const lower = lvl.toLowerCase();
    if (lower.includes('begin')) return 3;
    if (lower.includes('inter')) return 5;
    if (lower.includes('adv')) return 8;
    if (lower.includes('expert') || lower.includes('master')) return 9;
    const num = parseInt(lvl, 10);
    if (!isNaN(num)) return Math.min(9, Math.max(1, num));
  }
  return 4;
}

function mapAdminCourseToFanned(adminCourse: any, index: number): FannedCourse {
  const palette = CARD_PALETTES[index % CARD_PALETTES.length];
  const totalMods = Array.isArray(adminCourse.modules) && adminCourse.modules.length > 0
    ? adminCourse.modules.length
    : 6;

  const rawModules = Array.isArray(adminCourse.modules) && adminCourse.modules.length > 0
    ? adminCourse.modules
    : [
        { id: `${adminCourse.id}-m1`, title: 'Core Foundations & Setup', duration: '45m', isQuiz: false, completed: true },
        { id: `${adminCourse.id}-m2`, title: 'Architecture & Implementation', duration: '1h 00m', isQuiz: false, completed: false },
        { id: `${adminCourse.id}-m3`, title: 'Diagnostic Milestone Check', duration: '25m', isQuiz: true, completed: false },
        { id: `${adminCourse.id}-m4`, title: 'Production Best Practices', duration: '50m', isQuiz: false, completed: false },
        { id: `${adminCourse.id}-m5`, title: 'Mastery Certification Audit', duration: '35m', isQuiz: true, completed: false },
      ];

  const modules = rawModules.map((m: any, mIdx: number) => ({
    id: m.id || `${adminCourse.id}-m${mIdx + 1}`,
    title: m.title || `Module ${mIdx + 1}: Key Principles`,
    duration: m.duration || m.readTime || (m.video?.duration) || `${35 + (mIdx * 10) % 35}m`,
    isQuiz: Boolean(m.isQuiz || (Array.isArray(m.flashcards) && m.flashcards.length > 0) || mIdx % 3 === 2),
    completed: Boolean(m.completed || mIdx === 0),
  }));

  const instructorName = typeof adminCourse.instructor === 'object' && adminCourse.instructor?.name
    ? adminCourse.instructor.name
    : typeof adminCourse.instructor === 'string' && adminCourse.instructor.trim()
    ? adminCourse.instructor
    : adminCourse.author?.trim()
    ? adminCourse.author
    : 'Mentora Faculty';

  const instructorHandle = typeof adminCourse.instructor === 'object' && adminCourse.instructor?.handle
    ? adminCourse.instructor.handle
    : `@${instructorName.toLowerCase().replace(/\s+/g, '_')}`;

  const instructorAvatar = typeof adminCourse.instructor === 'object' && adminCourse.instructor?.avatar
    ? adminCourse.instructor.avatar
    : getInstructorInitials(instructorName);

  const quizzesCount = modules.filter((m: any) => m.isQuiz).length || Math.max(2, Math.floor(totalMods * 0.4));
  const xpPoints = adminCourse.xp || (totalMods * 175 + 400);

  let durationStr = adminCourse.duration || `${(totalMods * 1.1).toFixed(1)} hrs`;
  if (typeof durationStr === 'string' && durationStr.toLowerCase().includes('week')) {
    const weeks = parseInt(durationStr, 10) || 4;
    durationStr = `${(weeks * 2.5).toFixed(1)} hrs`;
  }

  return {
    id: String(adminCourse.id),
    title: adminCourse.title || 'Untitled Track',
    subtitle: adminCourse.category || (adminCourse.level ? `${adminCourse.level} Track` : 'Career Track'),
    instructor: {
      name: instructorName,
      handle: instructorHandle,
      avatar: instructorAvatar,
      verified: true,
    },
    level: parseLevelNumber(adminCourse.level),
    progressPercent: adminCourse.progressPercent !== undefined
      ? Number(adminCourse.progressPercent)
      : (adminCourse.enrolled ? Math.min(80, (adminCourse.enrolled % 50) + 25) : 35),
    quizzesCount,
    totalModules: totalMods,
    duration: durationStr,
    xpPoints,
    cardColor: palette.cardColor,
    accentGradient: palette.accentGradient,
    tag: adminCourse.category ? adminCourse.category : 'Published',
    artworkIcon: getCourseArtworkIcon(adminCourse.category, adminCourse.title),
    description: adminCourse.description || 'Master real-world skills, high-scale patterns, and verified milestone gates with Mentora.',
    modules,
  };
}

export default function CoursesPage() {
  const { isBright } = useTheme();
  const [allCourses, setAllCourses] = useState<FannedCourse[]>(fannedCourses);
  const [selectedCourseIndex, setSelectedCourseIndex] = useState<number>(0);
  const [hoveredCourseIndex, setHoveredCourseIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'recommended' | 'saved'>('recommended');
  const [savedCourseIds, setSavedCourseIds] = useState<string[]>(['postgres-opt', 'cloud-architect']);
  const [historyFilter, setHistoryFilter] = useState<'all' | 'eval' | 'milestone'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [syllabusModalOpen, setSyllabusModalOpen] = useState(false);
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPublishedCourses() {
      try {
        const stored = await courseService.getCourses();
        if (!isMounted) return;

        const published = (stored || []).filter((c: any) => c.status === 'Published');
        if (published.length === 0) return;

        const mapped = published.map((c: any, idx: number) =>
          mapAdminCourseToFanned(c, idx)
        );

        // Deduplicate against static demo courses by id or normalized title
        const publishedIds = new Set(mapped.map((c) => c.id.toLowerCase()));
        const publishedTitles = new Set(mapped.map((c) => c.title.toLowerCase().trim()));

        const remainingDemo = fannedCourses.filter(
          (c) => !publishedIds.has(c.id.toLowerCase()) && !publishedTitles.has(c.title.toLowerCase().trim())
        );

        setAllCourses([...mapped, ...remainingDemo]);
      } catch (err) {
        console.error('Failed to load published courses:', err);
      }
    }

    loadPublishedCourses();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'mentora_admin_courses_v2') {
        loadPublishedCourses();
      }
    };

    const handleCustomUpdate = () => {
      loadPublishedCourses();
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('mentora_courses_updated', handleCustomUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('mentora_courses_updated', handleCustomUpdate);
    };
  }, []);

  const baseCourses = viewMode === 'saved'
    ? allCourses.filter((c) => savedCourseIds.includes(c.id))
    : allCourses;

  const displayedCourses = searchQuery.trim()
    ? baseCourses.filter((c) =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.instructor.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : baseCourses;

  const safeActiveIndex = (selectedCourseIndex >= 0 && selectedCourseIndex < displayedCourses.length)
    ? selectedCourseIndex
    : 0;

  const activeCourse = displayedCourses[safeActiveIndex] || allCourses[0] || fannedCourses[0];

  const bgPage = isBright ? '#FAF4EE' : '#120D09';
  const cardBg = isBright ? '#FFFFFF' : '#1A130D';
  const cardBorder = isBright ? 'rgba(234,88,12,0.12)' : 'rgba(255,107,53,0.12)';
  const textPrimary = isBright ? '#1C1917' : '#FFF8F0';
  const textMuted = isBright ? '#78716C' : 'rgba(255,248,240,0.55)';

  const filteredHistory = historyItems.filter((item) => {
    if (historyFilter === 'eval') return item.eventType === 'evaluation' || item.eventType === 'quiz';
    if (historyFilter === 'milestone') return item.eventType === 'milestone';
    return true;
  });

  return (
    <div
      id="courses-page"
      className="min-h-screen flex transition-colors duration-200"
      style={{ background: bgPage, fontFamily: 'var(--font-geist-sans), sans-serif' }}
    >
      <DashboardSidebar />

      <main className="flex-1 ml-[76px] lg:ml-[84px] min-h-screen overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto space-y-6">

          {/* Toast Alert */}
          {toastMessage && (
            <div className="p-4 rounded-2xl bg-orange-950/90 border border-orange-500/70 text-orange-200 text-sm font-medium shadow-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-3">
              <span className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-orange-400 shrink-0" />
                <span>{toastMessage}</span>
              </span>
              <button
                onClick={() => setToastMessage(null)}
                className="text-orange-400 hover:text-white font-bold ml-4"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ── TOP NAV BAR (Matching reference header) ── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Left Brand Mark & Segment Toggle */}
            <div className="flex items-center gap-4">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm text-white shadow-md select-none shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #FF6B35 0%, #E85D2C 100%)',
                  boxShadow: '0 4px 14px rgba(255,107,53,0.4)',
                }}
              >
                CC
              </div>

              {/* Pill Segment Switcher */}
              <div
                className="p-1 rounded-full border flex items-center gap-1 shadow-inner"
                style={{
                  background: isBright ? '#FFFFFF' : '#1F1711',
                  borderColor: cardBorder,
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('recommended');
                    setSelectedCourseIndex(0);
                  }}
                  className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    viewMode === 'recommended'
                      ? 'bg-white text-zinc-900 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                  style={{
                    background: viewMode === 'recommended' ? (isBright ? '#1C1917' : '#FFFFFF') : 'transparent',
                    color: viewMode === 'recommended' ? (isBright ? '#FFFFFF' : '#1C1917') : undefined,
                  }}
                >
                  Recommended Courses
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('saved');
                    setSelectedCourseIndex(0);
                  }}
                  className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    viewMode === 'saved'
                      ? 'bg-white text-zinc-900 shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                  style={{
                    background: viewMode === 'saved' ? (isBright ? '#1C1917' : '#FFFFFF') : 'transparent',
                    color: viewMode === 'saved' ? (isBright ? '#FFFFFF' : '#1C1917') : undefined,
                  }}
                >
                  Saved Courses
                </button>
              </div>
            </div>

            {/* Right Search Input & Action Button */}
            <div className="flex items-center gap-3">
              {/* Search Pill Input */}
              <div className="relative min-w-[220px] sm:min-w-[280px]">
                <input
                  type="text"
                  placeholder="Search courses, skills, tracks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-full text-xs outline-none border transition-all focus:ring-2 focus:ring-orange-500/40"
                  style={{
                    background: isBright ? '#FFFFFF' : '#1F1711',
                    borderColor: cardBorder,
                    color: textPrimary,
                  }}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-orange-500">
                  <Search className="w-3.5 h-3.5" />
                </span>
              </div>

              {/* Add / Enroll Button */}
              <button
                type="button"
                onClick={() => setEnrollModalOpen(true)}
                className="px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95 shadow-md flex items-center gap-1.5 shrink-0"
                style={{
                  background: isBright ? '#1C1917' : '#FFFFFF',
                  color: isBright ? '#FFFFFF' : '#1C1917',
                }}
              >
                <span>+</span>
                <span>Enroll Course</span>
              </button>
            </div>
          </div>

          {/* ── MAIN CONTENT GRID: Left (Fanned Deck + History) & Right (Hero Spotlight) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

            {/* ── LEFT COLUMN (7 Cols): Recent Collections & History Table ── */}
            <div className="lg:col-span-7 space-y-6">

              {/* 1. Recent Collections / Courses Header */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: textPrimary }}>
                    {viewMode === 'saved' ? 'Saved Courses' : 'Recommended Courses'}
                  </h2>
                  <span className="text-xs font-mono font-bold text-orange-500">
                    {displayedCourses.length} {viewMode === 'saved' ? 'SAVED' : 'FOR YOU'}
                  </span>
                </div>

                {/* FANNED CARD DECK (Overlapping phone-proportioned vertical cards) */}
                <div className="relative h-[340px] sm:h-[360px] w-full overflow-x-auto overflow-y-visible flex items-center py-4 px-2" style={{ scrollbarWidth: 'none' }}>
                  {displayedCourses.length === 0 ? (
                    <div className="flex flex-col items-center justify-center w-full h-[280px] rounded-3xl border border-dashed border-orange-500/30 p-8 text-center bg-black/20">
                      <Bookmark className="w-10 h-10 text-orange-400 mb-3" />
                      <h3 className="font-bold text-base" style={{ color: textPrimary }}>No saved courses yet</h3>
                      <p className="text-xs text-zinc-400 mt-1 max-w-sm">Bookmark courses from the Recommended Courses tab to save them here for quick access.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setViewMode('recommended');
                          setSelectedCourseIndex(0);
                        }}
                        className="mt-4 px-4 py-1.5 rounded-full bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition-colors"
                      >
                        Browse Recommended Courses
                      </button>
                    </div>
                  ) : (
                    <div
                      className="relative flex items-center h-full"
                      style={{
                        minWidth: `${Math.max(700, (displayedCourses.length - 1) * 125 + 280)}px`,
                      }}
                    >
                      {displayedCourses.map((course, idx) => {
                        const isSelected = idx === safeActiveIndex;
                        const isHovered = hoveredCourseIndex === idx && !isSelected;
                        const isCardSaved = savedCourseIds.includes(course.id);

                        // Selected card is always slot 0 (left-most position).
                        // The remaining cards move towards the right in slots 1, 2, 3...
                        const otherIndices = displayedCourses
                          .map((_, i) => i)
                          .filter((i) => i !== safeActiveIndex);
                        const slot = isSelected ? 0 : otherIndices.indexOf(idx) + 1;

                        // Slot-based offset: slot 0 is at 0px, each subsequent slot moves 125px to the right
                        const leftOffset = slot * 125;

                        // Stacking order: selected card has highest z-index (40).
                        // Each card to the right is stacked below the one to its left.
                        const zIndex = 40 - slot;

                        return (
                          <div
                            key={course.id}
                            onClick={() => setSelectedCourseIndex(idx)}
                            onMouseEnter={() => setHoveredCourseIndex(idx)}
                            onMouseLeave={() => setHoveredCourseIndex(null)}
                            style={{
                              left: `${leftOffset}px`,
                              zIndex,
                              transform: isSelected
                                ? 'translateY(-8px) scale(1.02)'
                                : isHovered
                                ? 'translateY(-5px) scale(1.005)'
                                : 'translateY(0px) scale(1)',
                              transition: 'all 450ms cubic-bezier(0.22, 1, 0.36, 1)',
                            }}
                            className={`absolute w-[220px] sm:w-[235px] h-[310px] sm:h-[325px] rounded-[28px] p-4 flex flex-col justify-between border cursor-pointer select-none shadow-2xl backdrop-blur-md transition-all duration-300 ${
                              isSelected
                                ? 'ring-2 ring-orange-500/70 shadow-2xl shadow-orange-500/25 border-orange-400/50'
                                : isHovered
                                ? 'border-white/30 shadow-2xl'
                                : 'border-white/10 shadow-lg'
                            }`}
                          >
                            {/* Stacking depth overlay: soft shading for cards tucked underneath */}
                            {!isSelected && (
                              <div
                                className="absolute inset-0 rounded-[28px] bg-black pointer-events-none transition-opacity duration-300"
                                style={{
                                  opacity: isHovered ? 0 : Math.min(0.12 + (slot - 1) * 0.08, 0.3),
                                }}
                              />
                            )}

                            {/* Inner Card Background Gradient */}
                            <div
                              className={`absolute inset-0 rounded-[28px] bg-gradient-to-b ${course.cardColor} -z-10`}
                              style={{ opacity: 0.95 }}
                            />

                            {/* Top Header: Creator Chip & Level Badge */}
                            <div className="flex items-center justify-between gap-1.5 p-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="shrink-0">{renderArtworkIcon(course.artworkIcon, "w-4 h-4 text-orange-400")}</span>
                                <span className="text-[11px] font-bold text-white truncate">
                                  {course.instructor.name}
                                </span>
                                {course.instructor.verified && (
                                  <Check className="w-3 h-3 text-sky-400 shrink-0" />
                                )}
                              </div>
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/10 text-orange-400 border border-orange-500/20 shrink-0">
                                LVL {course.level}
                              </span>
                            </div>

                            {/* Course Name Title Section */}
                            <div className="space-y-1 my-1">
                              <span className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-wider block">
                                {course.tag}
                              </span>
                              <h3 className="text-sm sm:text-base font-black text-white leading-tight line-clamp-2 tracking-tight">
                                {course.title}
                              </h3>

                              {/* Progress bar */}
                              <div className="pt-1.5 space-y-1">
                                <div className="flex justify-between text-[10px] font-mono">
                                  <span className="text-zinc-400">Progress</span>
                                  <span className="text-white font-bold">{course.progressPercent}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/5">
                                  <div
                                    className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 rounded-full"
                                    style={{ width: `${course.progressPercent}%` }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Key Specs: Number of Modules & Time Duration */}
                            <div className="grid grid-cols-2 gap-1.5 py-1.5 px-2 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-left">
                              <div className="space-y-0.5">
                                <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-mono block">Modules</span>
                                <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-white">
                                  <BookOpen className="w-3.5 h-3.5 text-orange-400" />
                                  <span>{course.totalModules} Modules</span>
                                </div>
                              </div>
                              <div className="space-y-0.5 border-l border-white/10 pl-2">
                                <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-mono block">Duration</span>
                                <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-amber-300">
                                  <Clock className="w-3.5 h-3.5 text-amber-300" />
                                  <span>{course.duration}</span>
                                </div>
                              </div>
                            </div>

                            {/* Bottom Row: XP Count Badge & Bookmark Button */}
                            <div className="flex items-center justify-between gap-2 pt-0.5">
                              <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] font-mono font-black shadow-md shadow-orange-500/25">
                                <Zap className="w-3.5 h-3.5 text-white" />
                                <span>{course.xpPoints.toLocaleString()} XP</span>
                              </div>

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (isCardSaved) {
                                    setSavedCourseIds((prev) => prev.filter((id) => id !== course.id));
                                    setToastMessage(`Removed "${course.title}" from saved courses`);
                                  } else {
                                    setSavedCourseIds((prev) => [...prev, course.id]);
                                    setToastMessage(`Saved "${course.title}" to bookmarks!`);
                                  }
                                }}
                                className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs transition-all cursor-pointer ${
                                  isCardSaved
                                    ? 'bg-orange-500 text-white border-orange-400 shadow-sm'
                                    : 'bg-black/50 border-white/10 text-white hover:bg-orange-500/40'
                                }`}
                                title={isCardSaved ? "Remove from saved" : "Bookmark Course"}
                              >
                                {isCardSaved ? (
                                  <BookmarkCheck className="w-3.5 h-3.5 text-white" />
                                ) : (
                                  <Bookmark className="w-3.5 h-3.5 text-zinc-300" />
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* 2. History / Activity Log Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black tracking-tight" style={{ color: textPrimary }}>
                    History
                  </h3>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    {[
                      { id: 'all', label: 'All history' },
                      { id: 'eval', label: 'Evaluations' },
                      { id: 'milestone', label: 'Milestones' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setHistoryFilter(tab.id as any)}
                        className={`px-3 py-1 rounded-full text-[11px] transition-all ${
                          historyFilter === tab.id
                            ? 'bg-orange-500 text-white font-bold shadow-sm'
                            : 'hover:text-orange-500'
                        }`}
                        style={{
                          color: historyFilter === tab.id ? '#FFFFFF' : textMuted,
                        }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sleek Rounded Dark History Table */}
                <div
                  className="rounded-[28px] border overflow-hidden shadow-xl"
                  style={{ background: cardBg, borderColor: cardBorder }}
                >
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr
                          className="border-b text-[11px] font-mono uppercase tracking-wider"
                          style={{
                            background: isBright ? '#FAF4EE' : '#140D08',
                            borderColor: cardBorder,
                            color: textMuted,
                          }}
                        >
                          <th className="py-3 px-5">Event</th>
                          <th className="py-3 px-5">Course / Track</th>
                          <th className="py-3 px-5">Modules</th>
                          <th className="py-3 px-5 text-right">Score / XP</th>
                          <th className="py-3 px-5 text-right">Date</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs divide-y" style={{ borderColor: 'rgba(255,107,53,0.06)' }}>
                        {filteredHistory.map((item) => (
                          <tr
                            key={item.id}
                            className="transition-colors hover:bg-orange-500/5 group"
                          >
                            {/* Event Type */}
                            <td className="py-3.5 px-5 font-semibold" style={{ color: textPrimary }}>
                              <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-bold ${item.badgeColor}`}>
                                {item.eventLabel}
                              </span>
                            </td>

                            {/* Course & Instructor */}
                            <td className="py-3.5 px-5">
                              <div className="flex items-center gap-2.5">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-[10px] font-bold text-white flex items-center justify-center shrink-0">
                                  {item.instructorAvatar}
                                </div>
                                <span className="font-semibold truncate max-w-[180px]" style={{ color: textPrimary }}>
                                  {item.courseTitle}
                                </span>
                              </div>
                            </td>

                            {/* Count */}
                            <td className="py-3.5 px-5 font-mono text-[11px]" style={{ color: textMuted }}>
                              {item.lessonsOrCount}
                            </td>

                            {/* Value / Points */}
                            <td className="py-3.5 px-5 text-right font-mono font-bold text-orange-500 text-xs">
                              {item.scoreOrXp}
                            </td>

                            {/* Date */}
                            <td className="py-3.5 px-5 text-right font-mono text-[11px]" style={{ color: textMuted }}>
                              {item.date}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

            </div>

            {/* ── RIGHT COLUMN (5 Cols): Tall Spotlight Hero Card ── */}
            <div className="lg:col-span-5">
              <div
                className="relative rounded-[36px] border p-6 flex flex-col justify-between shadow-2xl overflow-hidden transition-all min-h-[580px] sm:min-h-[620px]"
                style={{
                  background: isBright
                    ? 'linear-gradient(180deg, #FFFFFF 0%, #FFF5EC 100%)'
                    : 'linear-gradient(180deg, #1C140E 0%, #110B07 100%)',
                  borderColor: 'rgba(255,107,53,0.35)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                }}
              >
                {/* Background Radiance & Floating Orbs */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-orange-500/20 via-amber-500/10 to-transparent blur-3xl pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-600/10 rounded-full blur-2xl pointer-events-none" />

                {/* Top Row: Creator Chip & Action Icons */}
                <div className="relative z-10 flex items-center justify-between gap-3">
                  
                  {/* Creator Chip */}
                  <div className="flex items-center gap-2.5 p-1.5 pr-4 rounded-full bg-black/30 backdrop-blur-md border border-white/10">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white font-black text-xs flex items-center justify-center shadow-sm">
                      {activeCourse.instructor.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-xs" style={{ color: textPrimary }}>
                          {activeCourse.instructor.name}
                        </span>
                        {activeCourse.instructor.verified && (
                          <Check className="w-3 h-3 text-sky-400" />
                        )}
                      </div>
                      <span className="text-[10px] block font-mono" style={{ color: textMuted }}>
                        {activeCourse.instructor.handle}
                      </span>
                    </div>
                  </div>

                  {/* Action Icons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const isSaved = savedCourseIds.includes(activeCourse.id);
                        if (isSaved) {
                          setSavedCourseIds((prev) => prev.filter((id) => id !== activeCourse.id));
                          setToastMessage(`Removed "${activeCourse.title}" from saved courses`);
                        } else {
                          setSavedCourseIds((prev) => [...prev, activeCourse.id]);
                          setToastMessage(`Saved "${activeCourse.title}" to bookmarks!`);
                        }
                      }}
                      className={`w-9 h-9 rounded-full border flex items-center justify-center text-sm transition-all hover:scale-105 active:scale-95 ${
                        savedCourseIds.includes(activeCourse.id)
                          ? 'bg-orange-500 text-white border-orange-400 shadow-md'
                          : 'bg-black/30 border-white/10 text-zinc-300 hover:text-white'
                      }`}
                      title={savedCourseIds.includes(activeCourse.id) ? "Remove from saved" : "Save course"}
                    >
                      {savedCourseIds.includes(activeCourse.id) ? (
                        <BookmarkCheck className="w-4 h-4 text-white" />
                      ) : (
                        <Bookmark className="w-4 h-4 text-zinc-300" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setToastMessage('Share link copied to clipboard!')}
                      className="w-9 h-9 rounded-full bg-black/30 border border-white/10 flex items-center justify-center text-sm transition-all hover:scale-105 active:scale-95"
                      style={{ color: textPrimary }}
                    >
                      ↗
                    </button>
                  </div>
                </div>

                {/* Central Visual Stage: 3D Character Artwork */}
                <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-6">
                  {/* Floating particle sparkle decorations */}
                  <div className="absolute top-4 left-8 text-xs opacity-50 animate-bounce">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="absolute top-12 right-10 text-xs opacity-40 animate-pulse">
                    <Sparkles className="w-3 h-3 text-orange-400" />
                  </div>
                  <div className="absolute bottom-8 left-12 text-sm opacity-40">
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  </div>

                  {/* Character Illustration */}
                  <div className="relative w-56 sm:w-64 h-56 sm:h-64 flex items-center justify-center">
                    {/* Soft ambient pedestal shadow */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-48 h-8 bg-orange-950/40 rounded-full blur-md" />
                    <img
                      src="/dashboard-character.png"
                      alt="Mentora 3D Student Character"
                      className="w-full h-full object-contain object-bottom drop-shadow-2xl relative z-10 transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                </div>

                {/* Bottom Overlay & Primary Action Bar */}
                <div className="relative z-10 space-y-4 pt-2">
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight" style={{ color: textPrimary }}>
                      {activeCourse.title}
                    </h3>
                    <p className="text-xs font-mono font-bold text-orange-500 mt-1">
                      #{activeCourse.subtitle}
                    </p>
                  </div>

                  {/* Interactive Action Pills Bar */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    
                    {/* Module Counter Pill */}
                    <button
                      type="button"
                      onClick={() => setSyllabusModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-3 rounded-full bg-black/30 backdrop-blur-md border border-white/10 text-xs font-mono font-bold transition-all hover:bg-black/50"
                      style={{ color: textPrimary }}
                    >
                      <BookOpen className="w-4 h-4 text-orange-400" />
                      <span>{activeCourse.totalModules} Modules</span>
                    </button>

                    {/* Big Primary Pill Button */}
                    <button
                      type="button"
                      onClick={() => setSyllabusModalOpen(true)}
                      className="flex-1 py-3 px-5 rounded-full text-xs sm:text-sm font-bold shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 text-white hover:brightness-110"
                      style={{
                        background: 'linear-gradient(135deg, #FF6B35 0%, #E85D2C 100%)',
                        boxShadow: '0 8px 24px rgba(255,107,53,0.35)',
                      }}
                    >
                      <span>{activeCourse.xpPoints} XP</span>
                      <span>•</span>
                      <span>Continue Course →</span>
                    </button>

                    {/* Bookmark Pill */}
                    <button
                      type="button"
                      onClick={() => {
                        const isSaved = savedCourseIds.includes(activeCourse.id);
                        if (isSaved) {
                          setSavedCourseIds((prev) => prev.filter((id) => id !== activeCourse.id));
                          setToastMessage(`Removed "${activeCourse.title}" from saved courses`);
                        } else {
                          setSavedCourseIds((prev) => [...prev, activeCourse.id]);
                          setToastMessage(`Saved "${activeCourse.title}" to bookmarks!`);
                        }
                      }}
                      className="w-11 h-11 rounded-full flex items-center justify-center text-sm transition-all shadow-md active:scale-95 shrink-0"
                      style={{
                        background: savedCourseIds.includes(activeCourse.id)
                          ? '#FF6B35'
                          : isBright ? '#FFFFFF' : '#261911',
                        border: `1px solid ${cardBorder}`,
                        color: savedCourseIds.includes(activeCourse.id) ? '#FFFFFF' : textPrimary,
                      }}
                      title={savedCourseIds.includes(activeCourse.id) ? "Remove from saved" : "Save to bookmarks"}
                    >
                      {savedCourseIds.includes(activeCourse.id) ? (
                        <BookmarkCheck className="w-5 h-5 text-white" />
                      ) : (
                        <Bookmark className="w-5 h-5 text-zinc-300" />
                      )}
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </main>

      {/* ── SYLLABUS & EVALUATION MODAL ── */}
      {syllabusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-xl rounded-3xl border p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            style={{ background: cardBg, borderColor: cardBorder }}
          >
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: cardBorder }}>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-500">
                  {activeCourse.subtitle}
                </span>
                <h3 className="text-xl font-bold mt-0.5" style={{ color: textPrimary }}>
                  {activeCourse.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSyllabusModalOpen(false)}
                className="w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold"
                style={{ borderColor: cardBorder, color: textMuted }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs leading-relaxed" style={{ color: textMuted }}>
              {activeCourse.description}
            </p>

            {/* Modules List */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold font-mono text-orange-500 uppercase tracking-wider">
                Syllabus & Required Evaluations ({activeCourse.modules.length} modules)
              </h4>
              <div className="space-y-2">
                {activeCourse.modules.map((m, idx) => (
                  <div
                    key={m.id}
                    className="p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs"
                    style={{
                      background: isBright ? '#FAF4EE' : '#140C08',
                      borderColor: cardBorder,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono font-bold bg-orange-500/15 text-orange-500">
                        {idx + 1}
                      </span>
                      <span className="font-semibold" style={{ color: textPrimary }}>
                        {m.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] font-mono" style={{ color: textMuted }}>
                        {m.duration}
                      </span>
                      {m.isQuiz && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                          Quiz (≥70%)
                        </span>
                      )}
                      {m.completed ? (
                        <span className="text-emerald-500 font-bold inline-flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Done
                        </span>
                      ) : (
                        <span className="text-orange-500 font-semibold">Start</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t" style={{ borderColor: cardBorder }}>
              <button
                type="button"
                onClick={() => setSyllabusModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border"
                style={{ borderColor: cardBorder, color: textMuted }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Launching Module: ${activeCourse.modules[0].title}!`);
                  setSyllabusModalOpen(false);
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#FF6B35] to-[#E85D2C] text-white shadow-md hover:brightness-110"
              >
                Resume Active Drill →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ENROLL NEW COURSE MODAL ── */}
      {enrollModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg rounded-3xl border p-6 sm:p-8 space-y-5 shadow-2xl relative"
            style={{ background: cardBg, borderColor: cardBorder }}
          >
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: cardBorder }}>
              <h3 className="text-lg font-bold" style={{ color: textPrimary }}>
                Enroll in Career Track Course
              </h3>
              <button
                type="button"
                onClick={() => setEnrollModalOpen(false)}
                className="w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold"
                style={{ borderColor: cardBorder, color: textMuted }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {allCourses.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-2xl border flex items-center justify-between gap-3"
                  style={{ background: isBright ? '#FAF4EE' : '#140C08', borderColor: cardBorder }}
                >
                  <div className="flex items-center gap-3">
                    <span className="shrink-0">{renderArtworkIcon(c.artworkIcon, "w-6 h-6 text-orange-400")}</span>
                    <div>
                      <h4 className="text-xs font-bold" style={{ color: textPrimary }}>{c.title}</h4>
                      <p className="text-[11px]" style={{ color: textMuted }}>By {c.instructor.name} • {c.totalModules} modules</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setToastMessage(`Enrolled in "${c.title}"! Added to your recent courses.`);
                      setEnrollModalOpen(false);
                    }}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#FF6B35] text-white shadow-sm"
                  >
                    Enroll Free
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
