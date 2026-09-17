'use client';

import { useTheme } from '@/context/ThemeContext';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardRightPanel from '@/components/dashboard/DashboardRightPanel';
import { useState } from 'react';
import Link from 'next/link';

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

const recommendedCourses = [
  { id: 'rc1', title: 'Advanced TypeScript Patterns', level: 'Advanced', duration: '8h 30m', rating: 4.9, students: '12.4k', color: '#3B82F6', tag: 'Trending' },
  { id: 'rc2', title: 'Docker & Kubernetes Essentials', level: 'Intermediate', duration: '6h 15m', rating: 4.8, students: '9.2k', color: '#10B981', tag: 'New' },
  { id: 'rc3', title: 'GraphQL API Design', level: 'Intermediate', duration: '5h 45m', rating: 4.7, students: '7.8k', color: '#F59E0B', tag: 'Recommended' },
  { id: 'rc4', title: 'Redis & Caching Strategies', level: 'Advanced', duration: '4h 20m', rating: 4.8, students: '5.1k', color: '#EF4444', tag: 'Hot' },
  { id: 'rc5', title: 'Microservices Architecture', level: 'Advanced', duration: '10h 00m', rating: 4.9, students: '18.2k', color: '#8B5CF6', tag: 'Top Rated' },
];

const learningJourneys = [
  { id: 'j1', name: 'Full-Stack Web Development', modules: 24, done: 9, progress: 37, status: 'active', lastModule: 'Node.js & REST APIs' },
  { id: 'j2', name: 'Cloud Architecture (AWS)', modules: 18, done: 4, progress: 22, status: 'active', lastModule: 'EC2 & Load Balancing' },
  { id: 'j3', name: 'Data Structures & Algorithms', modules: 30, done: 18, progress: 60, status: 'active', lastModule: 'Dynamic Programming' },
  { id: 'j4', name: 'DevOps & CI/CD Pipeline', modules: 15, done: 1, progress: 7, status: 'new', lastModule: 'Introduction to DevOps' },
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

// ─── Main Dashboard Component ─────────────────────────────────────────────────
export default function DashboardPage() {
  const { isBright } = useTheme();
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>(
    Object.fromEntries(tasks.map((t) => [t.id, t.done]))
  );
  const [journeysExpanded, setJourneysExpanded] = useState(true);

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
                    <p className="text-xl xl:text-2xl font-black" style={{ color: isBright ? '#78350F' : '#FDE68A' }}>4 <span className="text-xs font-semibold">courses</span></p>
                    <p className="text-[10px] uppercase font-bold tracking-wider opacity-70 mt-0.5">Active</p>
                  </div>
                  <div className="pb-1.5 border-b-2 border-amber-500/30">
                    <p className="text-xl xl:text-2xl font-black" style={{ color: isBright ? '#92400E' : '#F59E0B' }}>2 <span className="text-xs font-semibold">due</span></p>
                    <p className="text-[10px] uppercase font-bold tracking-wider opacity-70 mt-0.5">This Week</p>
                  </div>
                  <div className="pb-1.5 border-b-2 border-amber-500/60">
                    <p className="text-xl xl:text-2xl font-black" style={{ color: isBright ? '#451A03' : '#FBBF24' }}>1 <span className="text-xs font-semibold">done</span></p>
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
          <section id="continue-learning">
            <p style={sectionLabelStyle}>Continue Learning</p>
            <div
              className="rounded-2xl p-5 transition-all duration-200 hover:scale-[1.005] cursor-pointer"
              style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: cardShadow }}
            >
              <div className="flex gap-4 items-start">
                {/* Thumbnail */}
                <div
                  className="w-24 h-20 rounded-xl flex-shrink-0 flex items-center justify-center relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #1a2a3a, #0f1c2a)' }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl mb-1">⚙️</div>
                      <div className="text-xs font-bold text-blue-300">NODE.JS</div>
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
                        Full-Stack Web Development
                      </span>
                      <h3 className="mt-1.5 text-base font-bold" style={{ color: textPrimary }}>
                        Module 5: REST API Design Patterns & Best Practices
                      </h3>
                      <p className="text-sm mt-0.5" style={{ color: textMuted }}>
                        Authentication, rate limiting, versioning strategies
                      </p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs" style={{ color: textMuted }}>Progress</span>
                      <span className="text-xs font-bold" style={{ color: '#FF6B35' }}>68%</span>
                    </div>
                    <ProgressBar value={68} color="#FF6B35" height={6} />
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-xs" style={{ color: textSub }}>34 / 50 mins remaining</span>
                      <span className="text-xs" style={{ color: textSub }}>Module 5 of 8</span>
                    </div>
                  </div>

                  {/* Resume button */}
                  <div className="mt-3">
                    <button
                      id="btn-resume-learning"
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
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── 4. Today's Tasks ──────────────────────────────────────────── */}
          <section id="todays-tasks">
            <div className="flex items-center justify-between mb-3">
              <p style={{ ...sectionLabelStyle, marginBottom: 0 }}>Today&apos;s Tasks</p>
              <span className="text-xs font-medium" style={{ color: textMuted }}>
                {Object.values(checkedTasks).filter(Boolean).length}/{tasks.length} done
              </span>
            </div>
            <div
              className="rounded-2xl overflow-hidden"
              style={{ background: cardBg, border: `1px solid ${cardBorder}`, boxShadow: cardShadow }}
            >
              {tasks.map((task, i) => {
                const isChecked = checkedTasks[task.id];
                const priorityColor = task.priority === 'high' ? '#EF4444' : task.priority === 'medium' ? '#F59E0B' : textSub as string;
                return (
                  <div
                    key={task.id}
                    id={`task-${task.id}`}
                    className="flex items-center gap-3 px-4 py-3 transition-all duration-150 hover:bg-white/[0.02] cursor-pointer"
                    style={{ borderBottom: i < tasks.length - 1 ? `1px solid ${cardBorder}` : undefined }}
                    onClick={() => setCheckedTasks((prev) => ({ ...prev, [task.id]: !prev[task.id] }))}
                  >
                    {/* Checkbox */}
                    <div
                      className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all duration-200"
                      style={{
                        background: isChecked
                          ? 'linear-gradient(135deg, #FF6B35, #E85D2C)'
                          : 'transparent',
                        border: isChecked ? 'none' : `1.5px solid ${cardBorder}`,
                      }}
                    >
                      {isChecked && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} className="w-3 h-3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>

                    {/* Task name */}
                    <span
                      className="flex-1 text-sm font-medium transition-all duration-200"
                      style={{
                        color: isChecked ? textSub : textPrimary,
                        textDecoration: isChecked ? 'line-through' : 'none',
                      }}
                    >
                      {task.task}
                    </span>

                    {/* Priority dot */}
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: priorityColor }} />

                    {/* Due tag */}
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{
                        background: task.due === 'Today' ? 'rgba(255,107,53,0.1)' : 'rgba(255,255,255,0.05)',
                        color: task.due === 'Today' ? '#FF6B35' : textMuted,
                        border: `1px solid ${task.due === 'Today' ? 'rgba(255,107,53,0.2)' : cardBorder}`,
                      }}
                    >
                      {task.due}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── 5. Recommended Courses ────────────────────────────────────── */}
          <section id="recommended-courses">
            <div className="flex items-center justify-between mb-3">
              <p style={{ ...sectionLabelStyle, marginBottom: 0 }}>Recommended For You</p>
              <a href="#" className="text-xs font-medium" style={{ color: '#FF6B35' }}>See all →</a>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
              {recommendedCourses.map((course) => (
                <div
                  key={course.id}
                  id={`course-${course.id}`}
                  className="flex-shrink-0 w-52 rounded-2xl p-4 transition-all duration-200 hover:scale-[1.03] hover:-translate-y-1 cursor-pointer"
                  style={{
                    background: cardBg,
                    border: `1px solid ${cardBorder}`,
                    boxShadow: cardShadow,
                  }}
                >
                  {/* Color accent top */}
                  <div
                    className="w-full h-1.5 rounded-full mb-3"
                    style={{ background: `linear-gradient(90deg, ${course.color}, ${course.color}88)` }}
                  />
                  {/* Tag */}
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: `${course.color}18`, color: course.color, border: `1px solid ${course.color}30` }}
                  >
                    {course.tag}
                  </span>
                  <h4 className="mt-2 text-sm font-bold leading-tight" style={{ color: textPrimary }}>
                    {course.title}
                  </h4>
                  <p className="text-xs mt-1" style={{ color: textMuted }}>{course.level} · {course.duration}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <span style={{ color: '#F59E0B', fontSize: '11px' }}>★</span>
                    <span className="text-xs font-semibold" style={{ color: textPrimary }}>{course.rating}</span>
                    <span className="text-xs" style={{ color: textMuted }}>({course.students})</span>
                  </div>
                  <button
                    className="mt-3 w-full py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 hover:opacity-90"
                    style={{ background: `${course.color}18`, color: course.color, border: `1px solid ${course.color}30` }}
                  >
                    Enroll Free
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* ── 6. My Learning Journeys (full-width) ─────────────────────── */}
          <section id="my-learning-journeys" className="pb-6">
            <div className="flex items-center justify-between mb-3">
              <p style={{ ...sectionLabelStyle, marginBottom: 0 }}>My Learning Journeys</p>
              <button
                id="btn-toggle-journeys"
                onClick={() => setJourneysExpanded((v) => !v)}
                className="flex items-center gap-1.5 text-xs font-medium transition-colors"
                style={{ color: textMuted }}
              >
                {journeysExpanded ? 'Collapse' : 'Expand'}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-3.5 h-3.5 transition-transform duration-300"
                  style={{ transform: journeysExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              </button>
            </div>

            <div
              className="rounded-2xl overflow-hidden transition-all duration-500"
              style={{
                background: cardBg,
                border: `1px solid ${cardBorder}`,
                boxShadow: cardShadow,
                maxHeight: journeysExpanded ? '2000px' : '0px',
                opacity: journeysExpanded ? 1 : 0,
              }}
            >
              {/* Table header */}
              <div
                className="grid grid-cols-[2fr_1fr_1fr_120px] gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wider"
                style={{ color: textMuted, borderBottom: `1px solid ${cardBorder}` }}
              >
                <span>Journey</span>
                <span>Modules</span>
                <span>Status</span>
                <span>Progress</span>
              </div>

              {learningJourneys.map((j, i) => {
                const statusColor = j.status === 'active' ? '#10B981' : '#F59E0B';
                const progressColor = j.progress > 50 ? '#10B981' : j.progress > 20 ? '#FF6B35' : '#F59E0B';
                return (
                  <div
                    key={j.id}
                    id={`journey-${j.id}`}
                    className="grid grid-cols-[2fr_1fr_1fr_120px] gap-4 px-5 py-4 items-center transition-all duration-150 hover:bg-white/[0.02] cursor-pointer"
                    style={{ borderBottom: i < learningJourneys.length - 1 ? `1px solid ${cardBorder}` : undefined }}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: textPrimary }}>{j.name}</p>
                      <p className="text-xs mt-0.5 truncate" style={{ color: textMuted }}>Last: {j.lastModule}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: textPrimary }}>{j.done}/{j.modules}</p>
                      <p className="text-xs" style={{ color: textMuted }}>modules done</p>
                    </div>
                    <div>
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: `${statusColor}18`, color: statusColor, border: `1px solid ${statusColor}30` }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }} />
                        {j.status === 'active' ? 'Active' : 'New'}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold" style={{ color: progressColor }}>{j.progress}%</span>
                      </div>
                      <ProgressBar value={j.progress} color={progressColor} height={5} />
                    </div>
                  </div>
                );
              })}

              {/* Footer */}
              <div
                className="px-5 py-3 flex items-center justify-between"
                style={{ borderTop: `1px solid ${cardBorder}` }}
              >
                <span className="text-xs" style={{ color: textMuted }}>4 active journeys · 32 total modules completed</span>
                <Link
                  href="/dashboard/journeys"
                  className="text-xs font-semibold transition-colors"
                  style={{ color: '#FF6B35' }}
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
