import React from 'react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="relative overflow-hidden bg-[#080604] text-[#fff7ed] bg-retro-dense-grid">
      {/* Radiant Orange & Amber Ambient Glow Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-orange-600/20 via-amber-600/10 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/4 -left-36 w-96 h-96 bg-orange-600/15 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 -right-36 w-96 h-96 bg-amber-500/15 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="text-center space-y-7 max-w-4xl mx-auto flex flex-col items-center">
          
          {/* Centered Pixelated Mentora Title */}
          <div className="relative group my-2">
            <div className="absolute -inset-6 bg-gradient-to-r from-orange-600/30 via-amber-500/30 to-orange-600/30 rounded-3xl blur-2xl opacity-80 group-hover:opacity-100 transition duration-700 -z-10" />
            <div className="flex flex-col items-center justify-center">
              <h1 className="font-pixel text-6xl sm:text-8xl md:text-9xl lg:text-[8.5rem] xl:text-[9.5rem] font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-orange-400 to-orange-600 drop-shadow-pixel-bold select-none py-2">
                MENTORA
              </h1>
              <div className="h-1 w-36 sm:w-56 md:w-64 bg-gradient-to-r from-transparent via-orange-500 to-transparent mt-3 rounded-full" />
            </div>
          </div>

          {/* Subtitle / Tagline */}
          <div className="space-y-2.5 max-w-2xl mx-auto">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-white">
              Don&apos;t just learn.{' '}
              <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200 bg-clip-text text-transparent">
                Evolve!
              </span>
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
              Stop guessing what to learn next. Our AI understands your skills, uncovers your gaps, and builds a personalized path to your career goals &mdash; with courses, industry insights, daily challenges, an AI mentor, community, and a Skill Passport to prove your growth.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 text-sm font-bold text-black bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-300 hover:to-orange-400 rounded-2xl shadow-xl shadow-orange-600/35 hover:shadow-orange-600/60 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group font-mono uppercase tracking-wider"
            >
              <span>Start Quest</span>
              <span className="text-base group-hover:translate-x-1 transition-transform">→</span>
            </Link>

            <Link
              href="/journeys/demo"
              className="w-full sm:w-auto px-7 py-4 text-sm font-semibold text-zinc-300 hover:text-white bg-[#140e09]/90 hover:bg-[#1c130d] border border-orange-900/60 hover:border-orange-600/60 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-2 font-mono"
            >
              <span>View Roadmap Demo</span>
              <span className="text-xs text-orange-400 font-bold">⚡ 9 Modules</span>
            </Link>
          </div>

          {/* Quick Metrics Ticker */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400 font-mono">
            <div className="flex items-center gap-2 bg-[#120b06] border border-orange-900/40 px-3.5 py-1.5 rounded-full">
              <span className="text-orange-400 font-bold">✓</span> No Credit Card Required
            </div>
            <div className="flex items-center gap-2 bg-[#120b06] border border-orange-900/40 px-3.5 py-1.5 rounded-full">
              <span className="text-amber-400 font-bold">✓</span> Personalized in 2 Mins
            </div>
            <div className="flex items-center gap-2 bg-[#120b06] border border-orange-900/40 px-3.5 py-1.5 rounded-full">
              <span className="text-orange-400 font-bold">✓</span> Verifiable Skill Passport
            </div>
          </div>
        </div>

        {/* Hero Visual Card: Simulated Retro Interactive Journey Preview */}
        <div className="mt-16 max-w-5xl mx-auto">
          {/* Border Gradient Container */}
          <div className="relative p-[1.5px] rounded-3xl bg-gradient-to-r from-orange-500/50 via-amber-500/40 to-orange-600/50 shadow-2xl shadow-orange-950/50">
            <div className="rounded-[23px] bg-[#0d0906]/95 backdrop-blur-2xl p-6 sm:p-8 space-y-6">
              
              {/* Card Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-950/80 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-600 to-amber-600 p-[1px] flex items-center justify-center shadow-lg shadow-orange-950/50">
                    <div className="w-full h-full bg-[#120c07] rounded-[11px] flex items-center justify-center text-orange-400 font-pixel text-xs">
                      XP
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase text-orange-400 font-bold tracking-widest">
                        Active Mission Preview
                      </span>
                      <span className="text-[10px] bg-orange-950/80 text-orange-300 border border-orange-700/60 px-2 py-0.5 rounded-full font-semibold font-mono">
                        Gated Progression
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">Staff AI Systems Architect</h3>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs text-zinc-400 block font-mono">Overall Mastery</span>
                    <span className="text-sm font-extrabold text-orange-400 font-mono">67% Complete</span>
                  </div>
                  <div className="w-28 sm:w-36 h-3 bg-[#1c120a] rounded-full overflow-hidden border border-orange-900/40 p-[1px]">
                    <div className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 w-2/3 rounded-full shadow-sm" />
                  </div>
                </div>
              </div>

              {/* 3 Step Sequence Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Level 1 Completed */}
                <div className="p-4 rounded-2xl bg-[#140e08]/70 border border-amber-500/40 space-y-2.5 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase">LVL 1 • FOUNDATIONS</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950/90 text-amber-300 border border-amber-600/60 flex items-center gap-1 font-mono">
                      <span>✓</span> Verified
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Generative AI Core Architectures</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">LLM tokenization, transformers & attention mechanism deep-dives.</p>
                  <div className="pt-1 text-[11px] text-amber-400 font-semibold font-mono flex items-center gap-1">
                    <span>🏆 3 Modules Verified</span>
                  </div>
                </div>

                {/* Level 2 Active */}
                <div className="p-4 rounded-2xl bg-[#1a1109]/90 border-2 border-orange-500 shadow-lg shadow-orange-950/60 space-y-2.5 relative">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-orange-300 uppercase">LVL 2 • CORE PRACTICE</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-950 text-orange-200 border border-orange-600 flex items-center gap-1 font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                      In Progress
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">Prompt Engineering & System Design</h4>
                  <p className="text-xs text-zinc-300 leading-relaxed">Few-shot prompting, chain-of-thought, logit sampling & structured outputs.</p>
                  <div className="pt-1 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-amber-300 font-semibold">Quiz: 80% (Passed)</span>
                    <span className="text-orange-400 font-bold">+100 Leaderboard XP</span>
                  </div>
                </div>

                {/* Level 3 Gated */}
                <div className="p-4 rounded-2xl bg-[#0e0a06]/60 border border-orange-950/80 space-y-2.5 opacity-70">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase">LVL 3 • SPECIALIZATION</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#120c08] text-zinc-400 border border-zinc-800 font-mono">
                      🔒 Gated
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-zinc-300">Production MLOps & Autonomous Agents</h4>
                  <p className="text-xs text-zinc-500 leading-relaxed">Unlocks automatically upon completing Level 2 assessments.</p>
                  <div className="pt-1 text-[11px] text-zinc-500 font-mono">
                    Prerequisite: 70%+ score on Level 2
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 3-Column Feature Section */}
      <section className="py-20 bg-[#060403] border-t border-orange-950/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-orange-400">
              Three Pillars of Mastery
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Designed for Speed, Retention, and Proof
            </h2>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
              Every feature in Mentora is engineered around cognitive science, prerequisite gating, and tangible career credibility.
            </p>
          </div>

          {/* 3 Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1: Personalized Journeys */}
            <div className="group relative rounded-3xl p-[1.5px] bg-gradient-to-b from-orange-500/40 via-orange-900/30 to-amber-950/20 hover:from-orange-500/70 transition-all duration-300">
              <div className="h-full rounded-[23px] bg-[#0c0805]/90 backdrop-blur-sm p-7 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-orange-950/80 border border-orange-700/60 flex items-center justify-center text-2xl shadow-lg shadow-orange-950/40">
                    🧭
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono font-bold uppercase text-orange-400 tracking-wider">
                      Adaptive Curriculum
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-orange-300 transition-colors">
                      Personalized Journeys
                    </h3>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Algorithmic gap prediction evaluates your current skills against target industry roles. Our engine sequences missing competencies into 3 progressive, level-gated tiers that unlock sequentially.
                  </p>
                </div>

                <ul className="space-y-2.5 pt-4 border-t border-orange-950/80 text-xs text-zinc-300 font-medium">
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                    <span>Automated skill-gap diagnostic</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                    <span>Level-gated unlocking mechanism</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                    <span>Zero fluff: Only modules you need</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 2: Active Learning */}
            <div className="group relative rounded-3xl p-[1.5px] bg-gradient-to-b from-amber-500/40 via-amber-900/30 to-orange-950/20 hover:from-amber-500/70 transition-all duration-300">
              <div className="h-full rounded-[23px] bg-[#0c0805]/90 backdrop-blur-sm p-7 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#201309] border border-amber-700/60 flex items-center justify-center text-2xl shadow-lg shadow-orange-950/40">
                    ⚡
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono font-bold uppercase text-amber-400 tracking-wider">
                      Flashcards & Video Lessons
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
                      Active Learning
                    </h3>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Shift from passive scrolling to active recall. Retain complex architectural concepts with interactive flashcard decks, high-yield video breakdowns, and scenario micro-challenges.
                  </p>
                </div>

                <ul className="space-y-2.5 pt-4 border-t border-orange-950/80 text-xs text-zinc-300 font-medium">
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Spaced-repetition concept flashcards</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>High-density production video tutorials</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Hands-on scenario problem solving</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feature 3: Skill Verification */}
            <div className="group relative rounded-3xl p-[1.5px] bg-gradient-to-b from-orange-600/40 via-amber-900/30 to-orange-950/20 hover:from-orange-600/70 transition-all duration-300">
              <div className="h-full rounded-[23px] bg-[#0c0805]/90 backdrop-blur-sm p-7 sm:p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#241207] border border-orange-600/60 flex items-center justify-center text-2xl shadow-lg shadow-orange-950/40">
                    🛡️
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-mono font-bold uppercase text-orange-400 tracking-wider">
                      70% Passing Threshold & Ranking
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-orange-300 transition-colors">
                      Skill Verification
                    </h3>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Verify competencies with rigorous assessments requiring at least 70% to pass. Accumulate points, rank on the competitive global leaderboard, and share your verified Skill Passport.
                  </p>
                </div>

                <ul className="space-y-2.5 pt-4 border-t border-orange-950/80 text-xs text-zinc-300 font-medium">
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                    <span>Strict ≥70% score gate to award points</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                    <span>Global real-time competitive leaderboard</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                    <span>Verifiable Skill Passport credentials</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Key Metrics / Impact Statistics */}
      <section className="py-16 bg-gradient-to-b from-[#060403] via-[#0f0a06] to-[#060403] border-t border-orange-950/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="p-6 rounded-2xl bg-[#120c08]/80 border border-orange-900/40 shadow-md">
              <div className="text-3xl sm:text-4xl font-pixel text-orange-400">3x</div>
              <div className="text-xs text-zinc-400 mt-2 font-mono uppercase tracking-wider">Faster Skill Mastery</div>
            </div>

            <div className="p-6 rounded-2xl bg-[#120c08]/80 border border-orange-900/40 shadow-md">
              <div className="text-3xl sm:text-4xl font-pixel text-amber-400">70%</div>
              <div className="text-xs text-zinc-400 mt-2 font-mono uppercase tracking-wider">Rigorous Boss Gate</div>
            </div>

            <div className="p-6 rounded-2xl bg-[#120c08]/80 border border-orange-900/40 shadow-md">
              <div className="text-3xl sm:text-4xl font-pixel text-orange-400">100%</div>
              <div className="text-xs text-zinc-400 mt-2 font-mono uppercase tracking-wider">Tailored Roadmaps</div>
            </div>

            <div className="p-6 rounded-2xl bg-[#120c08]/80 border border-orange-900/40 shadow-md">
              <div className="text-2xl sm:text-3xl font-pixel text-amber-400">TOP 1%</div>
              <div className="text-xs text-zinc-400 mt-2 font-mono uppercase tracking-wider">Leaderboard Ranks</div>
            </div>

          </div>
        </div>
      </section>

      {/* Bottom Conversion Banner */}
      <section className="py-20 bg-retro-dense-grid">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl p-[1.5px] bg-gradient-to-r from-orange-500/70 via-amber-500/50 to-orange-600/70 shadow-2xl shadow-orange-950/60 overflow-hidden">
            <div className="rounded-[23px] bg-[#0c0805]/95 p-8 sm:p-14 text-center space-y-7">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-semibold bg-orange-950/80 text-orange-300 border border-orange-700/60">
                🚀 QUEST AWAITS • START YOUR PROGRESSION
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Ready to bridge your skill gap?
              </h2>

              <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
                Complete your 2-minute diagnostic, generate your personalized 3-level journey, and earn your first 100 leaderboard points today.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-8 py-4 text-sm font-bold text-black bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-300 hover:to-orange-400 rounded-2xl shadow-xl shadow-orange-600/35 hover:shadow-orange-600/60 active:scale-95 transition-all font-mono uppercase tracking-wider"
                >
                  Start Learning Free →
                </Link>
                <Link
                  href="/leaderboard"
                  className="w-full sm:w-auto px-7 py-4 text-sm font-semibold text-zinc-300 hover:text-white bg-[#140e08] border border-orange-900/60 hover:border-orange-600/60 rounded-2xl transition-all font-mono"
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
