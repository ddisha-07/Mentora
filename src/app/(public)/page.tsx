'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

const platformFeatures = [
  {
    id: 'diagnostics',
    title: 'Adaptive Diagnostics',
    category: 'Skill-Gap Predictions',
    tagline: 'Skip what you already know and target missing competencies.',
    cta: 'Run Diagnostics Demo',
    href: '/onboarding',
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v3m0 14v3M2 12h3m14 0h3" />
      </svg>
    ),
  },
  {
    id: 'roadmap',
    title: 'Level-Gated Roadmap',
    category: '3-Tier Prerequisite Gating',
    tagline: 'Structured progression across Foundations, Core, and Specialization.',
    cta: 'Explore Roadmap Demo',
    href: '/onboarding',
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <polygon points="12,7 15,12 12,17 9,12" fill="currentColor" fillOpacity="0.3" stroke="currentColor" strokeWidth="1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="m14 10-4 4m0-4 4 4" />
      </svg>
    ),
  },
  {
    id: 'flashcards',
    title: 'Active Flashcard Drills',
    category: 'Spaced Cognitive Recall',
    tagline: 'SuperMemo-powered active recall for permanent retention.',
    cta: 'Try Flashcard Demo',
    href: '/why-mentora',
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    id: 'video-breakdowns',
    title: 'Curated Video Lessons',
    category: 'High-Yield Micro-Breakdowns',
    tagline: 'Laser-focused 5–8 minute lessons with downloadable cheat sheets.',
    cta: 'Browse Video Demo',
    href: '/why-mentora',
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <rect x="2" y="4" width="20" height="16" rx="4" stroke="currentColor" strokeWidth="2" />
        <polygon points="10,8 16,12 10,16" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'scenario-quizzes',
    title: 'Scenario-Based Quizzes',
    category: '70% Strict Mastery Standard',
    tagline: 'Real production dilemma assessments with a strict 70% passing gate.',
    cta: 'Try Quiz Demo',
    href: '/leaderboard',
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'skill-passport',
    title: 'Verified Skill Passport',
    category: 'Cryptographic Credential',
    tagline: 'Cryptographically verifiable proof-of-work for hiring teams.',
    cta: 'View Passport Demo',
    href: '/about',
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    id: 'leaderboard',
    title: 'Global Leaderboards',
    category: 'XP & Cohort Rankings',
    tagline: 'Real-time cohort benchmarking with streaks and milestones.',
    cta: 'View Leaderboard Demo',
    href: '/leaderboard',
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
  {
    id: 'ai-mentor',
    title: 'AI Career Co-Pilot',
    category: 'Contextual Guidance',
    tagline: '24/7 contextual senior engineer for instant unblocking.',
    cta: 'Meet AI Mentor Demo',
    href: '/why-mentora',
    icon: (
      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
  },
];

const methodologySteps = [
  {
    step: 'Step 1',
    title: 'Know the Employee',
    desc: 'Analyze current role, skills & career aspirations.',
    icon: (
      <svg className="w-14 h-14" viewBox="0 0 56 56" fill="none">
        <circle cx="28" cy="28" r="24" stroke="url(#methOrange)" strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx="28" cy="20" r="7" stroke="url(#methOrange)" strokeWidth="2" fill="#ffedd5" fillOpacity="0.1" />
        <path d="M16 40c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="url(#methOrange)" strokeWidth="2" strokeLinecap="round" />
        <circle cx="28" cy="28" r="2.5" fill="#fb923c" />
      </svg>
    ),
  },
  {
    step: 'Step 2',
    title: 'Understand the Gap',
    desc: 'Pinpoint exact missing competencies vs target roles.',
    icon: (
      <svg className="w-14 h-14" viewBox="0 0 56 56" fill="none">
        <rect x="11" y="32" width="7" height="14" rx="2" fill="#7c2d12" stroke="#ea580c" strokeWidth="1.5" />
        <rect x="24.5" y="22" width="7" height="24" rx="2" fill="#9a3412" stroke="#f97316" strokeWidth="1.5" />
        <rect x="38" y="12" width="7" height="34" rx="2" fill="#c2410c" stroke="#fb923c" strokeWidth="1.5" strokeDasharray="2 2" />
        <path d="M14 26l14-9 14-7" stroke="#fde047" strokeWidth="2" strokeLinecap="round" />
        <circle cx="42" cy="10" r="3" fill="#fde047" />
      </svg>
    ),
  },
  {
    step: 'Step 3',
    title: 'Build the Journey',
    desc: 'Sequence an adaptive 3-tier level-gated roadmap.',
    icon: (
      <svg className="w-14 h-14" viewBox="0 0 56 56" fill="none">
        <path d="M9 35c9-18 17-18 21 0s13 8 17-7" stroke="url(#methOrange)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 3" />
        <circle cx="9" cy="35" r="4.5" fill="#f97316" stroke="#fed7aa" strokeWidth="1.5" />
        <circle cx="30" cy="35" r="5" fill="#ea580c" stroke="#fed7aa" strokeWidth="2" />
        <circle cx="47" cy="28" r="5.5" fill="#fbbf24" stroke="#fed7aa" strokeWidth="2" />
      </svg>
    ),
  },
  {
    step: 'Step 4',
    title: 'Learn',
    desc: 'Absorb bite-sized modules & hands-on practices.',
    icon: (
      <svg className="w-14 h-14" viewBox="0 0 56 56" fill="none">
        <circle cx="28" cy="28" r="22" stroke="#431407" strokeWidth="3" />
        <path d="M28 6a22 22 0 0 1 20 13" stroke="url(#methOrange)" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M29 15l-7 14h7l-3 12 11-15h-7l4-11h-5z" fill="url(#methAmber)" stroke="#f97316" strokeWidth="1" />
      </svg>
    ),
  },
  {
    step: 'Step 5',
    title: 'Assess',
    desc: 'Verify mastery via 70%+ passing micro-quizzes.',
    icon: (
      <svg className="w-14 h-14" viewBox="0 0 56 56" fill="none">
        <circle cx="28" cy="28" r="22" stroke="url(#methOrange)" strokeWidth="1.5" opacity="0.4" />
        <circle cx="28" cy="28" r="14" stroke="url(#methOrange)" strokeWidth="2" />
        <circle cx="28" cy="28" r="6" fill="#f97316" />
        <path d="M38 18l-8 8" stroke="#fde047" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M38 18h-5m5 0v5" stroke="#fde047" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    step: 'Step 6',
    title: 'Track',
    desc: 'Log XP growth, rank up & verify Skill Passport.',
    icon: (
      <svg className="w-14 h-14" viewBox="0 0 56 56" fill="none">
        <path d="M18 16h20v14c0 6-4 11-10 11s-10-5-10-11V16z" fill="#9a3412" stroke="url(#methOrange)" strokeWidth="2" />
        <path d="M18 20H13c0 5 3 8 7 9" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
        <path d="M38 20h5c0 5-3 8-7 9" stroke="#ea580c" strokeWidth="2" strokeLinecap="round" />
        <path d="M24 41h8v4h-8zM20 45h16" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
        <circle cx="28" cy="26" r="3" fill="#fde047" />
      </svg>
    ),
  },
  {
    step: 'Step 7',
    title: 'Adapt',
    desc: 'Continuously recalibrate path as goals evolve.',
    icon: (
      <svg className="w-14 h-14" viewBox="0 0 56 56" fill="none">
        <path d="M16 28a12 12 0 0 1 20.5-8.5M36.5 15v5h-5" stroke="url(#methOrange)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M40 28a12 12 0 0 1-20.5 8.5M19.5 41v-5h5" stroke="url(#methAmber)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="28" cy="28" r="4" fill="#fb923c" />
      </svg>
    ),
  },
];

export default function HomePage() {
  const { isBright } = useTheme();
  const [activeFeature, setActiveFeature] = useState(1);

  return (
    <div
      className={`relative overflow-hidden bg-retro-dense-grid transition-colors duration-200 ${
        isBright ? 'bg-[#FAF4EE] text-[#1C1917]' : 'bg-[#080604] text-[#fff7ed]'
      }`}
    >
      {/* Radiant Orange & Amber Ambient Glow Orbs */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] blur-[120px] pointer-events-none -z-10 transition-opacity duration-300 ${
          isBright
            ? 'bg-gradient-to-b from-orange-500/30 via-amber-400/20 to-transparent'
            : 'bg-gradient-to-b from-orange-600/20 via-amber-600/10 to-transparent'
        }`}
      />
      <div
        className={`absolute top-1/4 -left-36 w-96 h-96 rounded-full blur-[100px] pointer-events-none -z-10 ${
          isBright ? 'bg-orange-500/20' : 'bg-orange-600/15'
        }`}
      />
      <div
        className={`absolute top-1/2 -right-36 w-96 h-96 rounded-full blur-[100px] pointer-events-none -z-10 ${
          isBright ? 'bg-amber-400/20' : 'bg-amber-500/15'
        }`}
      />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="text-center space-y-7 max-w-4xl mx-auto flex flex-col items-center">
          
          {/* Centered Pixelated Mentora Title */}
          <div className="relative group my-2">
            <div
              className={`absolute -inset-8 rounded-full blur-3xl pointer-events-none -z-10 transition duration-700 ${
                isBright
                  ? 'bg-gradient-to-r from-orange-400/35 via-amber-400/45 to-orange-400/35 opacity-75 group-hover:opacity-95'
                  : 'bg-gradient-to-r from-orange-600/30 via-amber-500/30 to-orange-600/30 opacity-80 group-hover:opacity-100'
              }`}
            />
            <div className="flex flex-col items-center justify-center">
              <h1
                className={`font-pixel text-6xl sm:text-8xl md:text-9xl lg:text-[8.5rem] xl:text-[9.5rem] font-bold tracking-wider text-transparent bg-clip-text drop-shadow-pixel-bold select-none py-2 ${
                  isBright
                    ? 'bg-gradient-to-b from-amber-300 via-orange-500 to-orange-600'
                    : 'bg-gradient-to-b from-amber-200 via-orange-400 to-orange-600'
                }`}
              >
                MENTORA
              </h1>
              <div
                className="h-1 w-36 sm:w-56 md:w-64 bg-gradient-to-r from-transparent via-orange-500 to-transparent mt-3 rounded-full"
              />
            </div>
          </div>

          {/* Subtitle / Tagline */}
          <div className="space-y-2.5 max-w-2xl mx-auto">
            <h2
              className={`text-lg sm:text-xl md:text-2xl font-bold tracking-tight ${
                isBright ? 'text-[#1C1917]' : 'text-white'
              }`}
            >
              Don&apos;t just learn.{' '}
              <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 bg-clip-text text-transparent">
                Evolve!
              </span>
            </h2>
            <p
              className={`text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto ${
                isBright ? 'text-[#57534E]' : 'text-zinc-400'
              }`}
            >
              Stop guessing what to learn next. Our AI understands your skills, uncovers your gaps, and builds a personalized path to your career goals &mdash; with courses, industry insights, daily challenges, an AI mentor, community, and a Skill Passport to prove your growth.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              href="/register"
              className={`w-full sm:w-auto px-8 py-4 text-sm font-bold rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group font-mono uppercase tracking-wider ${
                isBright
                  ? 'text-white bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-orange-500/35 hover:shadow-orange-500/50'
                  : 'text-black bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-300 hover:to-orange-400 shadow-orange-600/35 hover:shadow-orange-600/60'
              }`}
            >
              <span>Start Quest</span>
              <span className="text-base group-hover:translate-x-1 transition-transform">→</span>
            </Link>

            <Link
              href="/journeys/demo"
              className={`w-full sm:w-auto px-7 py-4 text-sm font-semibold rounded-2xl shadow-xs transition-all flex items-center justify-center gap-2 font-mono ${
                isBright
                  ? 'bg-white hover:bg-[#FDF8F3] text-[#1C1917] hover:text-[#EA580C] border border-[#E0D1C3] hover:border-orange-400'
                  : 'text-zinc-300 hover:text-white bg-[#140e09]/90 hover:bg-[#1c130d] border border-orange-900/60 hover:border-orange-600/60'
              }`}
            >
              <span>View Roadmap Demo</span>
            </Link>
          </div>

          {/* Quick Metrics Ticker */}
          <div
            className={`pt-4 flex flex-wrap items-center justify-center gap-6 text-xs font-mono ${
              isBright ? 'text-[#57534E]' : 'text-zinc-400'
            }`}
          >
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border shadow-xs ${
                isBright
                  ? 'bg-white/90 border-[#E8DACD] text-[#44403C]'
                  : 'bg-[#120b06] border-orange-900/40 text-zinc-300'
              }`}
            >
              <span className="text-orange-500 font-bold">✓</span> AI-Powered Skill Diagnostic
            </div>
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border shadow-xs ${
                isBright
                  ? 'bg-white/90 border-[#E8DACD] text-[#44403C]'
                  : 'bg-[#120b06] border-orange-900/40 text-zinc-300'
              }`}
            >
              <span className="text-amber-500 font-bold">✓</span> 3-Tier Gated Roadmap
            </div>
            <div
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border shadow-xs ${
                isBright
                  ? 'bg-white/90 border-[#E8DACD] text-[#44403C]'
                  : 'bg-[#120b06] border-orange-900/40 text-zinc-300'
              }`}
            >
              <span className="text-orange-500 font-bold">✓</span> Verifiable Skill Passport
            </div>
          </div>
        </div>
      </section>

      {/* Methodology: How Mentora Works Section */}
      <section
        className={`py-20 border-t relative overflow-hidden transition-colors duration-200 ${
          isBright
            ? 'bg-[#F5ECE2] border-[#E8DACD]'
            : 'bg-[#070503] border-orange-950/70'
        }`}
      >
        {/* Ambient Glow Orbs */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] blur-[130px] pointer-events-none -z-10 ${
            isBright
              ? 'bg-gradient-to-r from-orange-400/15 via-amber-300/20 to-orange-400/15'
              : 'bg-gradient-to-r from-orange-600/10 via-amber-500/15 to-orange-600/10'
          }`}
        />

        {/* Reusable SVG Gradients Definition */}
        <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="methOrange" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#ea580c" />
            </linearGradient>
            <linearGradient id="methAmber" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#f97316" />
            </linearGradient>
          </defs>
        </svg>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span
              className={`text-xs font-mono font-bold uppercase tracking-widest ${
                isBright ? 'text-[#EA580C]' : 'text-orange-400'
              }`}
            >
              Methodology
            </span>
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight ${
                isBright ? 'text-[#1C1917]' : 'text-white'
              }`}
            >
              How Mentora{' '}
              <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p
              className={`text-sm sm:text-base leading-relaxed ${
                isBright ? 'text-[#57534E]' : 'text-zinc-400'
              }`}
            >
              A step-by-step roadmap showing how Mentora helps you study, practice, and build your profile.
            </p>
          </div>

          {/* 7-Step Sequence Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3.5 relative">
            {methodologySteps.map((item, index) => {
              const isLast = index === methodologySteps.length - 1;
              return (
                <div key={item.step} className="relative flex flex-col">
                  <div
                    className={`group relative h-full rounded-2xl p-[1px] transition-all duration-300 ${
                      isBright
                        ? 'bg-gradient-to-b from-orange-400/40 via-[#EAE0D5] to-transparent hover:from-orange-500/80 hover:shadow-md'
                        : 'bg-gradient-to-b from-orange-500/35 via-orange-950/40 to-transparent hover:from-orange-500/75 hover:shadow-lg hover:shadow-orange-950/50'
                    }`}
                  >
                    <div
                      className={`h-full rounded-[15px] p-4 sm:p-5 flex flex-col items-center text-center justify-between space-y-4 backdrop-blur-md ${
                        isBright
                          ? 'bg-white shadow-xs'
                          : 'bg-[#0c0805]/95'
                      }`}
                    >
                      <span
                        className={`text-xs font-mono font-bold tracking-wider ${
                          isBright ? 'text-[#EA580C]' : 'text-orange-400'
                        }`}
                      >
                        {item.step}
                      </span>
                      <div className="py-2 transition-transform duration-300 group-hover:scale-110 flex items-center justify-center">
                        {item.icon}
                      </div>
                      <div className="space-y-1.5">
                        <h3
                          className={`text-sm font-bold transition-colors leading-snug ${
                            isBright
                              ? 'text-[#1C1917] group-hover:text-[#EA580C]'
                              : 'text-white group-hover:text-orange-300'
                          }`}
                        >
                          {item.title}
                        </h3>
                        <p
                          className={`text-[11px] leading-relaxed ${
                            isBright ? 'text-[#57534E]' : 'text-zinc-400'
                          }`}
                        >
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                  {!isLast && (
                    <div
                      className={`hidden xl:flex absolute -right-2.5 top-1/2 -translate-y-1/2 z-20 text-xs font-bold font-mono pointer-events-none ${
                        isBright
                          ? 'text-orange-500 drop-shadow-[0_0_6px_rgba(234,88,12,0.4)]'
                          : 'text-orange-400/80 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]'
                      }`}
                    >
                      ▶
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Matrix Section (Highlighted Features Grid referencing User Reference Image) */}
      <section
        id="features"
        className={`py-20 md:py-24 border-t relative overflow-hidden transition-colors duration-200 ${
          isBright ? 'bg-[#FAF4EE] border-[#E8DACD]' : 'bg-[#080604] border-orange-950/70'
        }`}
      >
        {/* Subtle Ambient Glow */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[300px] blur-[140px] pointer-events-none -z-10 ${
            isBright
              ? 'bg-gradient-to-r from-orange-400/15 via-amber-300/20 to-orange-400/15'
              : 'bg-gradient-to-r from-orange-600/10 via-amber-500/10 to-orange-600/10'
          }`}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header Area matching reference image */}
          <div className="text-center space-y-3.5 max-w-2xl mx-auto">
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                isBright
                  ? 'bg-white text-[#EA580C] border border-[#EAE0D5] shadow-xs'
                  : 'bg-orange-950/70 text-orange-300 border border-orange-500/40 shadow-inner'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              <span>Platform Features</span>
            </div>

            <h2
              className={`text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight ${
                isBright ? 'text-[#1C1917]' : 'text-white'
              }`}
            >
              Explore Core Features
              <span
                className={`block mt-1 ${
                  isBright
                    ? 'text-[#EA580C]'
                    : 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 bg-clip-text text-transparent'
                }`}
              >
                That Elevate Your Career
              </span>
            </h2>
          </div>

          {/* 4x2 Feature Cards Grid (Adhering directly to the reference image) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {platformFeatures.map((feature, index) => {
              const isActive = activeFeature === index;
              return (
                <button
                  key={feature.id}
                  type="button"
                  onClick={() => setActiveFeature(index)}
                  className={`group relative text-left p-4 sm:p-5 rounded-2xl flex items-center gap-3.5 transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 text-white shadow-xl shadow-orange-500/30 scale-[1.02] border-transparent ring-2 ring-orange-500/50'
                      : isBright
                      ? 'bg-white border border-[#EAE0D5] hover:border-orange-300 hover:shadow-md hover:-translate-y-0.5 shadow-xs'
                      : 'bg-[#0c0805]/95 border border-orange-950/80 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-950/30 hover:-translate-y-0.5'
                  }`}
                >
                  {/* Left Icon Container */}
                  <div
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isActive
                        ? 'bg-white text-[#EA580C] shadow-sm'
                        : isBright
                        ? 'bg-[#F5EFEB] border border-[#EAE0D5] text-[#57534E] group-hover:bg-[#FFF3EB] group-hover:text-[#EA580C] group-hover:border-[#FED7AA]'
                        : 'bg-orange-950/60 border border-orange-900/50 text-orange-400 group-hover:bg-orange-950 group-hover:text-amber-300'
                    }`}
                  >
                    {feature.icon}
                  </div>

                  {/* Right Title & Category */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-xs sm:text-sm font-bold truncate leading-tight transition-colors ${
                        isActive
                          ? 'text-white'
                          : isBright
                          ? 'text-[#1C1917] group-hover:text-[#EA580C]'
                          : 'text-white group-hover:text-orange-300'
                      }`}
                    >
                      {feature.title}
                    </h3>
                    <p
                      className={`text-[10px] sm:text-[11px] truncate mt-1 transition-colors ${
                        isActive
                          ? 'text-orange-100 font-medium'
                          : isBright
                          ? 'text-[#78716C]'
                          : 'text-zinc-400'
                      }`}
                    >
                      {feature.category}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Feature Action Tile: Minimal, high-impact CTA linking to feature demo */}
          {platformFeatures[activeFeature] && (
            <div
              className={`p-5 sm:p-6 rounded-2xl border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-5 ${
                isBright
                  ? 'bg-white border-[#EAE0D5] shadow-lg shadow-orange-950/5'
                  : 'bg-gradient-to-r from-[#140b07] via-[#0d0704] to-[#170c07] border-orange-900/60 shadow-xl'
              }`}
            >
              {/* Left Side: Icon badge + Title + Tagline */}
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isBright
                      ? 'bg-[#FFF3EB] border border-[#FED7AA] text-[#EA580C]'
                      : 'bg-orange-950/80 border border-orange-800/60 text-orange-400'
                  }`}
                >
                  {platformFeatures[activeFeature].icon}
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                        isBright
                          ? 'bg-[#FAF4EE] text-[#EA580C] border-[#EAE0D5]'
                          : 'bg-orange-950/70 text-orange-300 border-orange-800/60'
                      }`}
                    >
                      Feature 0{activeFeature + 1} of 08
                    </span>
                    <span
                      className={`text-xs font-semibold uppercase tracking-wider ${
                        isBright ? 'text-[#78716C]' : 'text-zinc-400'
                      }`}
                    >
                      • {platformFeatures[activeFeature].category}
                    </span>
                  </div>

                  <h3
                    className={`text-base sm:text-lg font-bold tracking-tight truncate ${
                      isBright ? 'text-[#1C1917]' : 'text-white'
                    }`}
                  >
                    {platformFeatures[activeFeature].title}
                  </h3>

                  <p
                    className={`text-xs sm:text-sm line-clamp-1 ${
                      isBright ? 'text-[#57534E]' : 'text-zinc-400'
                    }`}
                  >
                    {platformFeatures[activeFeature].tagline}
                  </p>
                </div>
              </div>

              {/* Right Side: Demo CTA Button */}
              <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
                <Link
                  href={platformFeatures[activeFeature].href}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs uppercase tracking-wider font-mono shadow-md shadow-orange-500/25 whitespace-nowrap text-center transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>{platformFeatures[activeFeature].cta}</span>
                  <span className="text-sm">→</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>


      {/* Key Metrics / Impact Statistics */}
      <section
        className={`py-16 border-t transition-colors duration-200 ${
          isBright
            ? 'bg-[#F5ECE2] border-[#E8DACD]'
            : 'bg-gradient-to-b from-[#060403] via-[#0f0a06] to-[#060403] border-orange-950/70'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div
              className={`p-6 rounded-2xl border shadow-sm ${
                isBright
                  ? 'bg-white border-[#EAE0D5]'
                  : 'bg-[#120c08]/80 border-orange-900/40'
              }`}
            >
              <div className="text-3xl sm:text-4xl font-pixel text-[#EA580C]">3x</div>
              <div
                className={`text-xs mt-2 font-mono uppercase tracking-wider ${
                  isBright ? 'text-[#78716C]' : 'text-zinc-400'
                }`}
              >
                Faster Skill Mastery
              </div>
            </div>

            <div
              className={`p-6 rounded-2xl border shadow-sm ${
                isBright
                  ? 'bg-white border-[#EAE0D5]'
                  : 'bg-[#120c08]/80 border-orange-900/40'
              }`}
            >
              <div className="text-3xl sm:text-4xl font-pixel text-[#D97706]">70%</div>
              <div
                className={`text-xs mt-2 font-mono uppercase tracking-wider ${
                  isBright ? 'text-[#78716C]' : 'text-zinc-400'
                }`}
              >
                Rigorous Boss Gate
              </div>
            </div>

            <div
              className={`p-6 rounded-2xl border shadow-sm ${
                isBright
                  ? 'bg-white border-[#EAE0D5]'
                  : 'bg-[#120c08]/80 border-orange-900/40'
              }`}
            >
              <div className="text-3xl sm:text-4xl font-pixel text-[#EA580C]">100%</div>
              <div
                className={`text-xs mt-2 font-mono uppercase tracking-wider ${
                  isBright ? 'text-[#78716C]' : 'text-zinc-400'
                }`}
              >
                Tailored Roadmaps
              </div>
            </div>

            <div
              className={`p-6 rounded-2xl border shadow-sm ${
                isBright
                  ? 'bg-white border-[#EAE0D5]'
                  : 'bg-[#120c08]/80 border-orange-900/40'
              }`}
            >
              <div className="text-2xl sm:text-3xl font-pixel text-[#D97706]">TOP 1%</div>
              <div
                className={`text-xs mt-2 font-mono uppercase tracking-wider ${
                  isBright ? 'text-[#78716C]' : 'text-zinc-400'
                }`}
              >
                Leaderboard Ranks
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Bottom Conversion Banner - Redesigned to match attached image layout */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#FF5500] via-[#FF6000] to-[#FF4500] shadow-[0_20px_50px_rgba(255,85,0,0.35)] border border-orange-400/30 min-h-[220px] sm:min-h-[260px] flex items-center justify-between px-6 sm:px-12 py-8 lg:py-10">
            {/* Subtle Voxel Grid Background Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />

            {/* Left Side: 3D Voxel Boy Character Asset */}
            <div className="hidden sm:block absolute left-0 bottom-0 h-full w-48 sm:w-64 lg:w-72 pointer-events-none z-10">
              <img
                src="/images/banner-character.png"
                alt="Mentora Student Avatar"
                className="w-full h-full object-contain object-bottom drop-shadow-[0_10px_20px_rgba(0,0,0,0.2)] transform hover:scale-105 transition-transform duration-300 select-none"
              />
            </div>

            {/* Center Text & CTA Content */}
            <div className="relative z-20 flex-1 max-w-xl mx-auto text-center space-y-3 sm:space-y-4">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] drop-shadow-md">
                Start your learning journey today
              </h2>

              <p className="text-xs sm:text-base text-white/95 font-medium leading-relaxed max-w-lg mx-auto">
                Join 10,000+ professionals building skills with Mentora.
              </p>

              <div className="pt-1 sm:pt-2 flex items-center justify-center">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 sm:px-8 sm:py-4 bg-white hover:bg-orange-50 text-[#EA580C] font-extrabold text-sm sm:text-base rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 group tracking-wide"
                >
                  <span>Get Started Now</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right Side: 3D Voxel Mountain Asset */}
            <div className="hidden sm:block absolute right-0 bottom-0 h-full w-48 sm:w-64 lg:w-72 pointer-events-none z-10">
              <img
                src="/images/banner-mountain.png"
                alt="Mentora Skill Mountain"
                className="w-full h-full object-contain object-bottom drop-shadow-[0_10px_20px_rgba(0,0,0,0.2)] transform hover:scale-105 transition-transform duration-300 select-none"
              />
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
