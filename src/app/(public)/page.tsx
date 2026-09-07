import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Radiant Background Glow Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-indigo-600/15 via-purple-600/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 -left-48 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 -right-48 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-950/70 border border-indigo-500/30 text-indigo-300 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI-Driven Career Personalization Engine</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            Learn with precision.{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              Engineered for your career.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Ditch generic, one-size-fits-all video playlists. Mentora analyzes your current skills, predicts role-specific gaps, and generates progressive 3-level roadmaps with verified proof of competence.
          </p>

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 rounded-2xl shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              <span>Start Learning</span>
              <span className="text-base group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>

            <Link
              href="/journeys/demo"
              className="w-full sm:w-auto px-7 py-4 text-sm font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>View Roadmap Demo</span>
              <span className="text-xs text-indigo-400 font-mono">⚡ 9 Modules</span>
            </Link>
          </div>

          {/* Quick Metrics Ticker */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">✓</span> No Credit Card Required
            </div>
            <div className="flex items-center gap-2">
              <span className="text-indigo-400 font-bold">✓</span> Personalized in 2 Minutes
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold">✓</span> Verifiable Skill Passport
            </div>
          </div>
        </div>

        {/* Hero Visual Card: Simulated Interactive Journey Preview */}
        <div className="mt-14 max-w-5xl mx-auto">
          {/* Subtle Border Gradient Container */}
          <div className="relative p-[1.5px] rounded-3xl bg-gradient-to-r from-indigo-500/40 via-purple-500/30 to-pink-500/40 shadow-2xl shadow-indigo-950/40">
            <div className="rounded-[23px] bg-slate-950/90 backdrop-blur-2xl p-5 sm:p-8 space-y-6">
              {/* Card Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-850 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-indigo-400 font-black text-sm">
                    AI
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono uppercase text-indigo-400 font-bold tracking-wider">
                        Active Journey Preview
                      </span>
                      <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.2 rounded-full font-semibold">
                        Gated Progression
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white">Staff AI Systems Architect</h3>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Overall Mastery</span>
                    <span className="text-sm font-extrabold text-emerald-400">67% Complete</span>
                  </div>
                  <div className="w-28 sm:w-32 h-2.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 w-2/3" />
                  </div>
                </div>
              </div>

              {/* 3 Step Sequence Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Level 1 Completed */}
                <div className="p-4 rounded-2xl bg-slate-900/50 border border-emerald-500/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-slate-400">LEVEL 1 • FOUNDATIONS</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                      ✓ Completed
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Generative AI Core Architectures</h4>
                  <p className="text-xs text-slate-400">LLM tokenization, transformers & attention mechanism deep-dives.</p>
                  <div className="pt-1 text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <span>🏆 3 Modules Verified</span>
                  </div>
                </div>

                {/* Level 2 Active */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border-2 border-indigo-500/80 shadow-lg shadow-indigo-950/40 space-y-2.5 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-indigo-300">LEVEL 2 • CORE PRACTICE</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-700 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                      In Progress
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Prompt Engineering & System Design</h4>
                  <p className="text-xs text-slate-300">Few-shot prompting, chain-of-thought, logit sampling & structured outputs.</p>
                  <div className="pt-1 flex items-center justify-between text-[11px]">
                    <span className="text-amber-300 font-semibold">Quiz Score: 80% (Passed)</span>
                    <span className="text-indigo-400 font-bold">+100 Leaderboard Pts</span>
                  </div>
                </div>

                {/* Level 3 Gated */}
                <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-2.5 opacity-70">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold text-slate-500">LEVEL 3 • SPECIALIZATION</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-slate-500 border border-slate-800">
                      🔒 Gated
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-300">Production MLOps & Autonomous Agents</h4>
                  <p className="text-xs text-slate-500">Unlocks automatically upon completing Level 2 assessments.</p>
                  <div className="pt-1 text-[11px] text-slate-500 font-medium">
                    Prerequisite: 70%+ score on Level 2
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Column Feature Section */}
      <section className="py-20 bg-slate-950 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-400">
              Three Pillars of Mastery
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Designed for Speed, Retention, and Proof
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Every feature in Mentora is engineered around cognitive science, prerequisite gating, and tangible career credibility.
            </p>
          </div>

          {/* 3 Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1: Personalized Journeys */}
            <div className="group relative rounded-3xl p-[1.5px] bg-gradient-to-b from-indigo-500/30 via-slate-800/50 to-slate-900/20 hover:from-indigo-500/60 transition-all duration-300">
              <div className="h-full rounded-[23px] bg-slate-900/80 backdrop-blur-sm p-7 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-950/90 border border-indigo-700/60 flex items-center justify-center text-2xl shadow-lg shadow-indigo-950/40">
                    🧭
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono font-bold uppercase text-indigo-400 tracking-wider">
                      Adaptive Curriculum
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                      Personalized Journeys
                    </h3>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Algorithmic gap prediction evaluates your current skills against target industry roles. Our engine sequences missing competencies into 3 progressive, level-gated tiers that unlock sequentially.
                  </p>
                </div>

                <ul className="space-y-2.5 pt-4 border-t border-slate-800 text-xs text-slate-300 font-medium">
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    <span>Automated skill-gap diagnostic</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    <span>Level-gated unlocking mechanism</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    <span>Zero fluff: Only modules you need</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 2: Active Learning */}
            <div className="group relative rounded-3xl p-[1.5px] bg-gradient-to-b from-purple-500/30 via-slate-800/50 to-slate-900/20 hover:from-purple-500/60 transition-all duration-300">
              <div className="h-full rounded-[23px] bg-slate-900/80 backdrop-blur-sm p-7 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-purple-950/90 border border-purple-700/60 flex items-center justify-center text-2xl shadow-lg shadow-purple-950/40">
                    ⚡
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono font-bold uppercase text-purple-400 tracking-wider">
                      Flashcards & Video Lessons
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">
                      Active Learning
                    </h3>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Shift from passive scrolling to active recall. Retain complex architectural concepts with interactive flashcard decks, high-yield video breakdowns, and scenario micro-challenges.
                  </p>
                </div>

                <ul className="space-y-2.5 pt-4 border-t border-slate-800 text-xs text-slate-300 font-medium">
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    <span>Spaced-repetition concept flashcards</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    <span>High-density production video tutorials</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    <span>Hands-on scenario problem solving</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 3: Skill Verification */}
            <div className="group relative rounded-3xl p-[1.5px] bg-gradient-to-b from-amber-500/30 via-slate-800/50 to-slate-900/20 hover:from-amber-500/60 transition-all duration-300">
              <div className="h-full rounded-[23px] bg-slate-900/80 backdrop-blur-sm p-7 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-950/90 border border-amber-700/60 flex items-center justify-center text-2xl shadow-lg shadow-amber-950/40">
                    🛡️
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono font-bold uppercase text-amber-400 tracking-wider">
                      70% Passing Threshold & Ranking
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
                      Skill Verification
                    </h3>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Verify competencies with rigorous assessments requiring at least 70% to pass. Accumulate points, rank on the competitive global leaderboard, and share your verified Skill Passport.
                  </p>
                </div>

                <ul className="space-y-2.5 pt-4 border-t border-slate-800 text-xs text-slate-300 font-medium">
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Strict ≥70% score gate to award points</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Global real-time competitive leaderboard</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Verifiable Skill Passport credentials</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Metrics / Impact Statistics */}
      <section className="py-16 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950 border-t border-slate-850">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
              <div className="text-3xl sm:text-4xl font-black text-indigo-400">3x</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Faster Skill Mastery</div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
              <div className="text-3xl sm:text-4xl font-black text-purple-400">70%</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Rigorous Passing Gate</div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
              <div className="text-3xl sm:text-4xl font-black text-amber-400">100%</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Role-Tailored Roadmaps</div>
            </div>
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
              <div className="text-3xl sm:text-4xl font-black text-emerald-400">Top 1%</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Global Leaderboard Recognition</div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Conversion Banner */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-r from-indigo-500/60 via-purple-500/40 to-pink-500/60 shadow-2xl overflow-hidden">
            <div className="rounded-[23px] bg-slate-950/95 p-8 sm:p-12 text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800">
                🚀 Start Your Progression Today
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Ready to bridge your skill gap?
              </h2>
              <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
                Complete your 2-minute diagnostic, generate your 3-level journey, and earn your first 100 leaderboard points today.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-8 py-4 text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 rounded-2xl shadow-xl shadow-indigo-600/30 active:scale-95 transition-all"
                >
                  Start Learning Free →
                </Link>
                <Link
                  href="/leaderboard"
                  className="w-full sm:w-auto px-7 py-4 text-sm font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl transition-all"
                >
                  View Global Leaderboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
