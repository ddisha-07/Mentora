'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

export default function AboutPage() {
  const { isBright } = useTheme();

  return (
    <div
      className={`relative overflow-hidden min-h-[calc(100vh-4.5rem)] transition-colors duration-200 ${
        isBright
          ? 'bg-[#FAF4EE] text-[#1C1917] bg-retro-dense-grid'
          : 'bg-[#080604] text-[#fff7ed] bg-retro-dense-grid'
      }`}
    >
      {/* Ambient Orange & Amber Radiance Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-gradient-to-b from-orange-600/15 via-amber-600/10 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 -right-36 w-80 h-80 bg-orange-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 -left-36 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16">
        {/* Header */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold transition-colors ${
              isBright
                ? 'bg-[#FFF3EB] text-[#EA580C] border border-[#FED7AA]'
                : 'bg-orange-950/70 text-orange-300 border border-orange-500/40 shadow-inner'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            <span>[ MISSION // THE MENTORA PHILOSOPHY ]</span>
          </div>
          <h1
            className={`text-4xl sm:text-6xl font-extrabold tracking-tight transition-colors ${
              isBright ? 'text-[#1C1917]' : 'text-white'
            }`}
          >
            Engineered for{' '}
            <span
              className={`bg-clip-text text-transparent ${
                isBright
                  ? 'bg-gradient-to-r from-[#EA580C] via-orange-600 to-[#C2410C]'
                  : 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500'
              }`}
            >
              Skill Clarity
            </span>
          </h1>
          <p
            className={`text-base sm:text-lg leading-relaxed transition-colors ${
              isBright ? 'text-[#57534E]' : 'text-zinc-400'
            }`}
          >
            Mentora was created to fix a broken paradigm in technical education: endless video tutorials that leave engineers uncertain of what skills actually unlock career advancement.
          </p>
        </div>

        {/* Philosophy Card */}
        <div
          className={`relative p-[1.5px] rounded-3xl transition-all ${
            isBright
              ? 'bg-gradient-to-r from-orange-400/40 via-[#EAE0D5] to-orange-400/30 shadow-xl shadow-orange-950/5'
              : 'bg-gradient-to-r from-orange-500/50 via-amber-500/40 to-orange-600/50 shadow-2xl shadow-orange-950/40'
          }`}
        >
          <div
            className={`p-7 sm:p-12 rounded-[23px] backdrop-blur-xl space-y-6 border transition-colors ${
              isBright
                ? 'bg-white border-[#EAE0D5]'
                : 'bg-[#0c0805]/95 border-transparent'
            }`}
          >
            <div
              className={`flex items-center justify-between border-b pb-4 ${
                isBright ? 'border-[#EAE0D5]' : 'border-orange-950/80'
              }`}
            >
              <span className="text-xs font-mono uppercase tracking-widest text-[#EA580C] font-bold">
                Algorithmic Shift
              </span>
              <span
                className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-semibold border ${
                  isBright
                    ? 'bg-[#FFF3EB] text-[#EA580C] border-[#FED7AA]'
                    : 'bg-orange-950 text-orange-300 border-orange-700/60'
                }`}
              >
                Paradigm 2.0
              </span>
            </div>

            <h2
              className={`text-2xl sm:text-3xl font-bold tracking-tight transition-colors ${
                isBright ? 'text-[#1C1917]' : 'text-white'
              }`}
            >
              Our Core Philosophy
            </h2>
            
            <div
              className={`p-5 rounded-2xl border font-mono text-xs sm:text-sm leading-relaxed space-y-2 transition-colors ${
                isBright
                  ? 'bg-[#FAF4EE] border-[#E3D4C5] text-[#1C1917]'
                  : 'bg-[#140e08] border-orange-900/50 text-zinc-300'
              }`}
            >
              <div className="flex items-center gap-2 text-rose-500 line-through">
                <span>✕</span>
                <span>Topic → Static Unstructured Video Playlist</span>
              </div>
              <div
                className={`flex items-center gap-2 font-bold ${
                  isBright ? 'text-[#EA580C]' : 'text-amber-300'
                }`}
              >
                <span>✓</span>
                <span>Individual Baseline + Diagnostic Gap Prediction → 3-Tier Gated Roadmap</span>
              </div>
            </div>

            <p
              className={`text-sm sm:text-base leading-relaxed transition-colors ${
                isBright ? 'text-[#57534E]' : 'text-zinc-400'
              }`}
            >
              By shifting from passive content consumption to level-gated unlocking, active flashcard retrieval drills, and strict 70% passing standards, learners master high-impact skills 3x faster while building verifiable proof of competence.
            </p>
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className={`p-7 rounded-3xl border transition-all space-y-4 group ${
              isBright
                ? 'bg-white border-[#EAE0D5] hover:border-orange-300 shadow-sm'
                : 'bg-[#0c0805]/90 border-orange-950/80 hover:border-orange-500/50'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-2xl shadow-sm ${
                isBright
                  ? 'bg-[#FFF3EB] border-[#FED7AA]'
                  : 'bg-orange-950/80 border-orange-700/60'
              }`}
            >
              🎯
            </div>
            <h3
              className={`text-xl font-bold transition-colors ${
                isBright ? 'text-[#1C1917] group-hover:text-[#EA580C]' : 'text-white group-hover:text-orange-300'
              }`}
            >
              Precision Targeting
            </h3>
            <p
              className={`text-xs leading-relaxed transition-colors ${
                isBright ? 'text-[#57534E]' : 'text-zinc-400'
              }`}
            >
              Algorithms compute the exact set difference between your current baseline and your target role, eliminating redundant modules.
            </p>
          </div>

          <div
            className={`p-7 rounded-3xl border transition-all space-y-4 group ${
              isBright
                ? 'bg-white border-[#EAE0D5] hover:border-orange-300 shadow-sm'
                : 'bg-[#0c0805]/90 border-orange-950/80 hover:border-amber-500/50'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-2xl shadow-sm ${
                isBright
                  ? 'bg-[#FFF8F2] border-[#FED7AA]'
                  : 'bg-[#1f1309] border-amber-700/60'
              }`}
            >
              ⚡
            </div>
            <h3
              className={`text-xl font-bold transition-colors ${
                isBright ? 'text-[#1C1917] group-hover:text-[#EA580C]' : 'text-white group-hover:text-amber-300'
              }`}
            >
              Active Retention
            </h3>
            <p
              className={`text-xs leading-relaxed transition-colors ${
                isBright ? 'text-[#57534E]' : 'text-zinc-400'
              }`}
            >
              Multi-modal learning with spaced flashcard decks, high-yield video breakdowns, and scenario micro-challenges for durable recall.
            </p>
          </div>

          <div
            className={`p-7 rounded-3xl border transition-all space-y-4 group ${
              isBright
                ? 'bg-white border-[#EAE0D5] hover:border-orange-300 shadow-sm'
                : 'bg-[#0c0805]/90 border-orange-950/80 hover:border-orange-500/50'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-2xl shadow-sm ${
                isBright
                  ? 'bg-[#FFF3EB] border-[#FED7AA]'
                  : 'bg-[#241207] border-orange-600/60'
              }`}
            >
              🛡️
            </div>
            <h3
              className={`text-xl font-bold transition-colors ${
                isBright ? 'text-[#1C1917] group-hover:text-[#EA580C]' : 'text-white group-hover:text-orange-300'
              }`}
            >
              Verified Proof
            </h3>
            <p
              className={`text-xs leading-relaxed transition-colors ${
                isBright ? 'text-[#57534E]' : 'text-zinc-400'
              }`}
            >
              Tamper-proof Skill Passport and leaderboard ranking earned strictly through non-trivial 70%+ score evaluations.
            </p>
          </div>
        </div>

        {/* Bottom CTA Card */}
        <div
          className={`p-8 sm:p-10 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl transition-all ${
            isBright
              ? 'bg-gradient-to-r from-orange-100/70 via-white to-amber-100/70 border-orange-200/80 shadow-orange-950/5'
              : 'bg-gradient-to-r from-orange-950/40 via-[#120c08] to-orange-950/40 border-orange-900/50 shadow-black/40'
          }`}
        >
          <div className="space-y-1.5">
            <h4
              className={`font-bold text-lg sm:text-xl transition-colors ${
                isBright ? 'text-[#1C1917]' : 'text-white'
              }`}
            >
              Ready to experience personalized learning?
            </h4>
            <p
              className={`text-xs sm:text-sm transition-colors ${
                isBright ? 'text-[#57534E]' : 'text-zinc-400'
              }`}
            >
              Complete your skill-gap diagnostic in just 2 minutes.
            </p>
          </div>
          <Link
            href="/register"
            className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs uppercase tracking-wider font-mono shadow-lg shadow-orange-500/25 whitespace-nowrap text-center transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Start Learning Free →
          </Link>
        </div>
      </div>
    </div>
  );
}
