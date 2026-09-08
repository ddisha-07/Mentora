'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

export default function WhyMentoraPage() {
  const { isBright } = useTheme();

  return (
    <div
      className={`relative overflow-hidden min-h-[calc(100vh-4.5rem)] p-6 sm:p-12 md:p-16 transition-colors duration-200 ${
        isBright
          ? 'bg-[#FAF4EE] text-[#1C1917] bg-retro-dense-grid'
          : 'bg-[#080604] text-[#fff7ed] bg-retro-dense-grid'
      }`}
    >
      {/* Ambient Orange & Amber Radiance Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-gradient-to-b from-orange-600/15 via-amber-600/10 to-transparent blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        <Link
          href="/"
          className={`inline-flex items-center gap-1.5 text-xs font-mono font-bold transition-colors ${
            isBright ? 'text-[#EA580C] hover:text-orange-700' : 'text-orange-400 hover:text-orange-300'
          }`}
        >
          ← Back to Home
        </Link>

        <div className="space-y-3">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold transition-colors ${
              isBright
                ? 'bg-[#FFF3EB] text-[#EA580C] border border-[#FED7AA]'
                : 'bg-orange-950/70 text-orange-300 border border-orange-500/40 shadow-inner'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            <span>[ COMPARISON MATRIX // COMPETITIVE ADVANTAGE ]</span>
          </div>
          <h1
            className={`text-4xl sm:text-5xl font-extrabold tracking-tight transition-colors ${
              isBright ? 'text-[#1C1917]' : 'text-white'
            }`}
          >
            Why{' '}
            <span
              className={`bg-clip-text text-transparent ${
                isBright
                  ? 'bg-gradient-to-r from-[#EA580C] via-orange-600 to-[#C2410C]'
                  : 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500'
              }`}
            >
              Mentora?
            </span>
          </h1>
          <p
            className={`text-base sm:text-lg leading-relaxed transition-colors ${
              isBright ? 'text-[#57534E]' : 'text-zinc-400'
            }`}
          >
            Traditional learning management systems overwhelm learners with catalogues of hundreds of generic video courses. Mentora personalizes the experience from the inside out with predictive diagnostics and verified gating.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {/* Traditional Learning Card */}
          <div
            className={`p-7 rounded-3xl border space-y-4 transition-all ${
              isBright
                ? 'bg-white border-[#EAE0D5] shadow-sm'
                : 'bg-[#0c0805]/95 border-orange-950/80'
            }`}
          >
            <div className="flex items-center gap-2 text-rose-500 font-bold text-lg font-mono">
              <span>✕</span>
              <span>Traditional Learning</span>
            </div>
            <ul
              className={`text-xs sm:text-sm space-y-2.5 transition-colors ${
                isBright ? 'text-[#57534E]' : 'text-zinc-400'
              }`}
            >
              <li className="flex items-start gap-2">
                <span className="text-rose-500 shrink-0">•</span>
                <span>One-size-fits-all curricula with repetitive generic modules</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 shrink-0">•</span>
                <span>Hours wasted searching for quality, relevant content</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 shrink-0">•</span>
                <span>No link between courses and real career advancement</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 shrink-0">•</span>
                <span>Passive consumption with low knowledge retention and no gating</span>
              </li>
            </ul>
          </div>

          {/* With Mentora Card */}
          <div
            className={`p-7 rounded-3xl border space-y-4 transition-all ${
              isBright
                ? 'bg-gradient-to-b from-orange-50/70 via-white to-white border-orange-200/90 shadow-md shadow-orange-950/5'
                : 'bg-[#140e08] border-orange-600/50 shadow-lg shadow-orange-950/30'
            }`}
          >
            <div
              className={`flex items-center gap-2 font-bold text-lg font-mono ${
                isBright ? 'text-[#EA580C]' : 'text-amber-400'
              }`}
            >
              <span>✓</span>
              <span>With Mentora</span>
            </div>
            <ul
              className={`text-xs sm:text-sm space-y-2.5 transition-colors ${
                isBright ? 'text-[#292524]' : 'text-zinc-200'
              }`}
            >
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold shrink-0">✓</span>
                <span>Role & level-tailored learning journeys generated algorithmically</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold shrink-0">✓</span>
                <span>Predictive skill-gap diagnostics eliminate redundant lessons</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold shrink-0">✓</span>
                <span>Multi-modal learning (spaced flashcards, video breakdowns, drills)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold shrink-0">✓</span>
                <span>Tamper-proof Skill Passport artifact earned through 70%+ evaluations</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="pt-4 text-center sm:text-left">
          <Link
            href="/register"
            className="inline-block px-7 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs uppercase tracking-wider font-mono shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Experience Mentora Today →
          </Link>
        </div>
      </div>
    </div>
  );
}
