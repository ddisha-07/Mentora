'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

interface JourneyTrack {
  id: string;
  title: string;
  category: 'architecture' | 'backend' | 'ai' | 'devops' | 'frontend' | 'data';
  categoryLabel: string;
  targetRole: string;
  totalLevels: number;
  currentLevel: number;
  estimatedHours: number;
  completedHours: number;
  rating: number;
  studentsCount: string;
  status: 'active' | 'available' | 'completed';
  description: string;
  keySkills: string[];
  gradient: string;
}

const initialJourneys: JourneyTrack[] = [
  {
    id: 'demo',
    title: 'Full-Stack Cloud Architect',
    category: 'architecture',
    categoryLabel: 'Architecture',
    targetRole: 'Lead Cloud Architect',
    totalLevels: 10,
    currentLevel: 4,
    estimatedHours: 64,
    completedHours: 39.5,
    rating: 4.95,
    studentsCount: '1.8k',
    status: 'active',
    description:
      'Master high-availability distributed systems, multi-region cloud resilience, and level-gated enterprise microservices.',
    keySkills: ['Distributed Systems', 'AWS Solutions', 'Event-Driven Arch', 'Terraform', 'System Design'],
    gradient: 'from-orange-500 via-amber-500 to-yellow-500',
  },
  {
    id: 'backend-spec',
    title: 'Senior Backend & Distributed Systems Specialist',
    category: 'backend',
    categoryLabel: 'Backend',
    targetRole: 'Staff Backend Engineer',
    totalLevels: 8,
    currentLevel: 2,
    estimatedHours: 48,
    completedHours: 14,
    rating: 4.9,
    studentsCount: '2.4k',
    status: 'active',
    description:
      'Go deep on high-throughput microservices, concurrency models, ACID vs BASE guarantees, and resilient database sharding.',
    keySkills: ['Go / Rust', 'PostgreSQL', 'Kafka', 'gRPC', 'Distributed Locks'],
    gradient: 'from-blue-500 via-indigo-500 to-purple-600',
  },
  {
    id: 'ai-engineer',
    title: 'AI Systems & LLM Application Engineer',
    category: 'ai',
    categoryLabel: 'AI & Data',
    targetRole: 'Applied AI Engineer',
    totalLevels: 6,
    currentLevel: 0,
    estimatedHours: 42,
    completedHours: 0,
    rating: 4.98,
    studentsCount: '3.1k',
    status: 'available',
    description:
      'Build end-to-end production RAG pipelines, fine-tuned agentic models, vector indexing at scale, and eval telemetry.',
    keySkills: ['RAG Pipelines', 'LangChain', 'pgvector', 'Model Evals', 'Prompt Eng'],
    gradient: 'from-emerald-500 via-teal-500 to-cyan-600',
  },
  {
    id: 'devops-lead',
    title: 'DevOps & Cloud-Native Platform Lead',
    category: 'devops',
    categoryLabel: 'DevOps & Cloud',
    targetRole: 'Platform Engineering Lead',
    totalLevels: 7,
    currentLevel: 0,
    estimatedHours: 38,
    completedHours: 0,
    rating: 4.88,
    studentsCount: '1.2k',
    status: 'available',
    description:
      'Orchestrate zero-downtime continuous deployment, GitOps with ArgoCD, OpenTelemetry observability, and Kubernetes clusters.',
    keySkills: ['Kubernetes', 'ArgoCD', 'Prometheus', 'Helm', 'Zero-Trust IAM'],
    gradient: 'from-rose-500 via-pink-500 to-rose-600',
  },
  {
    id: 'frontend-architect',
    title: 'Frontend Performance & Design Systems Architect',
    category: 'frontend',
    categoryLabel: 'Frontend',
    targetRole: 'Staff Frontend Engineer',
    totalLevels: 8,
    currentLevel: 0,
    estimatedHours: 36,
    completedHours: 0,
    rating: 4.92,
    studentsCount: '1.9k',
    status: 'available',
    description:
      'Scale enterprise design tokens, Web Vitals optimization, server-components rendering cycles, and fluid responsive layouts.',
    keySkills: ['Next.js 15', 'Web Vitals', 'Design Tokens', 'Micro-Frontends', 'Tailwind'],
    gradient: 'from-amber-500 via-orange-600 to-red-600',
  },
];

export default function JourneysPage() {
  const { isBright } = useTheme();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [journeys, setJourneys] = useState<JourneyTrack[]>(initialJourneys);
  const [enrolledNotice, setEnrolledNotice] = useState<string | null>(null);

  const bgPage = isBright ? '#FFF8F0' : '#111010';
  const cardBg = isBright ? '#FFFFFF' : '#1C1916';
  const cardBorder = isBright ? 'rgba(234,88,12,0.12)' : 'rgba(255,107,53,0.1)';
  const textPrimary = isBright ? '#1C1917' : '#FFF8F0';
  const textMuted = isBright ? '#78716C' : 'rgba(255,248,240,0.55)';

  const handleEnroll = (id: string, title: string) => {
    setJourneys((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: 'active', currentLevel: 1 } : j))
    );
    setEnrolledNotice(`Successfully enrolled in "${title}"! Roadmap is now active.`);
    setTimeout(() => setEnrolledNotice(null), 4000);
  };

  const filteredJourneys = journeys.filter((j) => {
    const matchesCategory = activeCategory === 'all' || j.category === activeCategory;
    const matchesSearch =
      j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.targetRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.keySkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const activeJourneysCount = journeys.filter((j) => j.status === 'active').length;
  const primaryJourney = journeys.find((j) => j.id === 'demo') || journeys[0];

  return (
    <div
      id="journeys-page"
      className="min-h-screen flex"
      style={{ background: bgPage, fontFamily: 'var(--font-geist-sans), sans-serif' }}
    >
      <DashboardSidebar />

      <main className="flex-1 ml-[72px] xl:ml-[240px] min-h-screen overflow-y-auto px-4 sm:px-6 lg:px-10 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Notification Toast */}
          {enrolledNotice && (
            <div className="p-4 rounded-2xl bg-orange-950/90 border border-orange-500/70 text-orange-200 text-sm font-medium shadow-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-3">
              <span className="flex items-center gap-2">✨ {enrolledNotice}</span>
              <button
                onClick={() => setEnrolledNotice(null)}
                className="text-orange-400 hover:text-white font-bold ml-4"
              >
                ✕
              </button>
            </div>
          )}

          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-orange-500/10 pb-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-orange-500/10 text-[#FF6B35] border border-orange-500/20">
                <span>🗺️ CAREER PATHWAYS</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: textPrimary }}>
                Learning Journeys
              </h1>
              <p className="text-sm max-w-2xl" style={{ color: textMuted }}>
                Structured, level-gated skill pathways built around where you are and where you want to go next.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/journeys/demo"
                className="px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all active:scale-95 flex items-center gap-2 bg-gradient-to-r from-[#FF6B35] to-[#E85D2C] text-white hover:brightness-110 shadow-orange-500/20"
              >
                <span>🚀 Resume Active Roadmap</span>
              </Link>
            </div>
          </div>

          {/* Metrics Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Active Tracks', val: `${activeJourneysCount}`, sub: 'Personalized to role', icon: '🎯' },
              { label: 'Total Hours Completed', val: '53.5h', sub: '+8.2h this month', icon: '⏳' },
              { label: 'Verified Levels', val: '6 Levels', sub: 'Across 2 tracks', icon: '🛡️' },
              { label: 'Next Milestone', val: 'Level 5 Gate', sub: 'Event Architecture', icon: '⚡' },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl border transition-all"
                style={{ background: cardBg, borderColor: cardBorder }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium" style={{ color: textMuted }}>{stat.label}</span>
                  <span className="text-base">{stat.icon}</span>
                </div>
                <div className="text-xl sm:text-2xl font-black" style={{ color: textPrimary }}>{stat.val}</div>
                <div className="text-[11px] font-mono mt-0.5 text-orange-500 font-semibold">{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* Primary Featured Active Journey Card */}
          <div
            className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border shadow-xl transition-all"
            style={{
              background: isBright
                ? 'linear-gradient(135deg, #FFF6EE 0%, #FFFFFF 60%)'
                : 'linear-gradient(135deg, #1f120a 0%, #120c08 60%)',
              borderColor: 'rgba(255,107,53,0.3)',
            }}
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-orange-500/15 via-amber-500/10 to-transparent blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold font-mono px-2.5 py-0.5 rounded-full bg-orange-500/20 text-[#FF6B35] border border-orange-500/30">
                    CURRENT IN-PROGRESS JOURNEY
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500">
                    Level {primaryJourney.currentLevel} of {primaryJourney.totalLevels}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold" style={{ color: textPrimary }}>
                  {primaryJourney.title}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: textMuted }}>
                  {primaryJourney.description}
                </p>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span style={{ color: textMuted }}>Overall Journey Progress</span>
                    <span className="text-orange-500 font-mono">
                      {Math.round((primaryJourney.completedHours / primaryJourney.estimatedHours) * 100)}% ({primaryJourney.completedHours}h / {primaryJourney.estimatedHours}h)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-orange-500/15 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-700"
                      style={{
                        width: `${Math.round((primaryJourney.completedHours / primaryJourney.estimatedHours) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Skill Badges */}
                <div className="flex items-center gap-2 flex-wrap pt-2">
                  {primaryJourney.keySkills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2.5 py-1 rounded-lg font-medium border"
                      style={{
                        background: isBright ? 'rgba(255,243,235,0.8)' : 'rgba(255,107,53,0.08)',
                        borderColor: cardBorder,
                        color: textPrimary,
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Column */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                <Link
                  href="/dashboard/journeys/demo"
                  className="px-6 py-3.5 rounded-2xl font-bold text-sm text-center shadow-xl transition-all active:scale-95 bg-gradient-to-r from-[#FF6B35] to-[#E85D2C] text-white hover:brightness-110 shadow-orange-500/30"
                >
                  Enter Roadmap Matrix →
                </Link>
                <button
                  type="button"
                  onClick={() => alert('Diagnostic refreshed! Your curriculum has been tuned to your latest quiz scores.')}
                  className="px-5 py-3 rounded-2xl text-xs font-semibold text-center border transition-all hover:bg-orange-500/5 active:scale-95"
                  style={{ borderColor: cardBorder, color: textPrimary }}
                >
                  Retake Diagnostic Evaluation
                </button>
              </div>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                {[
                  { id: 'all', label: 'All Pathways' },
                  { id: 'architecture', label: 'Architecture' },
                  { id: 'backend', label: 'Backend' },
                  { id: 'ai', label: 'AI & Data' },
                  { id: 'devops', label: 'Cloud & DevOps' },
                  { id: 'frontend', label: 'Frontend' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                      activeCategory === tab.id
                        ? 'bg-[#FF6B35] text-white shadow-md shadow-orange-500/20'
                        : isBright
                        ? 'bg-white text-zinc-600 border border-[#EAE0D5] hover:border-orange-300'
                        : 'bg-[#18130e] text-zinc-400 border border-orange-950/60 hover:border-orange-800'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative min-w-[240px]">
                <input
                  type="text"
                  placeholder="Search tracks, roles, skills..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3.5 py-2 pl-9 rounded-xl text-xs border outline-none transition-all focus:ring-2 focus:ring-orange-500/40"
                  style={{
                    background: cardBg,
                    borderColor: cardBorder,
                    color: textPrimary,
                  }}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-orange-500">
                  🔍
                </span>
              </div>
            </div>

            {/* Journeys Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredJourneys.map((journey) => {
                const isActive = journey.status === 'active';
                const percent = Math.round((journey.completedHours / journey.estimatedHours) * 100);

                return (
                  <div
                    key={journey.id}
                    className="p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between group hover:border-orange-500/40 hover:shadow-xl"
                    style={{ background: cardBg, borderColor: cardBorder }}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full font-bold bg-orange-500/10 text-orange-500 border border-orange-500/20">
                          {journey.categoryLabel}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: textMuted }}>
                          <span className="text-amber-400">★</span>
                          <span>{journey.rating}</span>
                          <span>({journey.studentsCount})</span>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold group-hover:text-[#FF6B35] transition-colors" style={{ color: textPrimary }}>
                          {journey.title}
                        </h3>
                        <p className="text-xs font-mono text-orange-500/90 mt-0.5 font-medium">
                          Target: {journey.targetRole}
                        </p>
                      </div>

                      <p className="text-xs leading-relaxed line-clamp-2" style={{ color: textMuted }}>
                        {journey.description}
                      </p>

                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {journey.keySkills.slice(0, 3).map((skill, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2 py-0.5 rounded border"
                            style={{
                              background: isBright ? '#FAF4EE' : '#140c07',
                              borderColor: cardBorder,
                              color: textMuted,
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer Section */}
                    <div className="pt-5 mt-4 border-t border-orange-500/10 flex items-center justify-between">
                      <div className="text-xs" style={{ color: textMuted }}>
                        <span className="font-bold font-mono" style={{ color: textPrimary }}>
                          {journey.totalLevels} Levels
                        </span>{' '}
                        • {journey.estimatedHours}h estimated
                      </div>

                      {isActive ? (
                        <Link
                          href="/dashboard/journeys/demo"
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#FF6B35] to-[#E85D2C] text-white shadow-md hover:brightness-110 active:scale-95 transition-all"
                        >
                          Continue →
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleEnroll(journey.id, journey.title)}
                          className="px-4 py-2 rounded-xl text-xs font-semibold border transition-all hover:bg-orange-500 hover:text-white hover:border-orange-500 active:scale-95"
                          style={{ borderColor: cardBorder, color: textPrimary }}
                        >
                          Enroll Track +
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
