'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

export default function AboutPage() {
  const { isBright } = useTheme();

  const coreCapabilities = [
    {
      icon: '🎯',
      title: 'Learn What Matters',
      desc: 'Discover skills and topics laser-focused on your current role and immediate target promotions.',
    },
    {
      icon: '🧭',
      title: 'Follow Your Journey',
      desc: 'Structured, level-gated learning paths built around your goals—no more random tutorial hopping.',
    },
    {
      icon: '🤖',
      title: 'AI-Powered Guidance',
      desc: '24/7 contextual AI companion to clarify tough concepts, review code, and instantly unblock you.',
    },
    {
      icon: '📈',
      title: 'Track Your Growth',
      desc: 'Live dashboard tracking skills, XP, streaks, milestones, and your verifiable Skill Passport.',
    },
    {
      icon: '⚡',
      title: 'Bite-Sized Steps',
      desc: 'High-density 5–8 minute micro-drills engineered to fit seamlessly into demanding workdays.',
    },
  ];

  const personalizationVectors = [
    { label: 'Your Role', detail: 'What you currently do', icon: '💼' },
    { label: 'Your Experience', detail: 'Where you are in your career', icon: '⏳' },
    { label: 'Your Skills', detail: 'What you already know', icon: '🧠' },
    { label: 'Your Interests', detail: 'What you want to explore', icon: '✨' },
    { label: 'Your Goals', detail: 'Where you want to go', icon: '🚀' },
    { label: 'Your Progress', detail: 'What you should learn next', icon: '📊' },
  ];

  return (
    <div
      className={`relative overflow-hidden min-h-[calc(100vh-4.5rem)] transition-colors duration-200 ${
        isBright
          ? 'bg-[#FAF4EE] text-[#1C1917] bg-retro-dense-grid'
          : 'bg-[#080604] text-[#fff7ed] bg-retro-dense-grid'
      }`}
    >
      {/* Ambient Radiance Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-gradient-to-b from-orange-600/15 via-amber-600/10 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 -right-36 w-80 h-80 bg-orange-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 -left-36 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16 sm:space-y-20">
        
        {/* Hero Section */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold transition-colors ${
              isBright
                ? 'bg-[#FFF3EB] text-[#EA580C] border border-[#FED7AA]'
                : 'bg-orange-950/70 text-orange-300 border border-orange-500/40 shadow-inner'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            <span>ABOUT MENTORA</span>
          </div>

          <h1
            className={`text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight transition-colors ${
              isBright ? 'text-[#1C1917]' : 'text-white'
            }`}
          >
            Learning That Moves{' '}
            <span
              className={`bg-clip-text text-transparent ${
                isBright
                  ? 'bg-gradient-to-r from-[#EA580C] via-orange-600 to-[#C2410C]'
                  : 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500'
              }`}
            >
              With Your Career.
            </span>
          </h1>

          <p
            className={`text-base sm:text-lg leading-relaxed transition-colors ${
              isBright ? 'text-[#57534E]' : 'text-zinc-300'
            }`}
          >
            Mentora is a personalized learning and development platform built for working professionals.
            Instead of offering the same courses to everyone, Mentora understands who you are, what you do,
            where you want to go, and what skills you need next.
          </p>

          <p
            className={`text-xs sm:text-sm font-medium tracking-wide uppercase font-mono transition-colors ${
              isBright ? 'text-[#EA580C]' : 'text-orange-400'
            }`}
          >
            Guided Progression • Zero Redundancy • Continuous Growth
          </p>
        </div>

        {/* Why Mentora? Card */}
        <div
          className={`relative p-[1.5px] rounded-3xl transition-all ${
            isBright
              ? 'bg-gradient-to-r from-orange-400/40 via-[#EAE0D5] to-orange-400/30 shadow-xl shadow-orange-950/5'
              : 'bg-gradient-to-r from-orange-500/50 via-amber-500/40 to-orange-600/50 shadow-2xl shadow-orange-950/40'
          }`}
        >
          <div
            className={`p-6 sm:p-10 rounded-[23px] backdrop-blur-xl space-y-6 border transition-colors ${
              isBright ? 'bg-white border-[#EAE0D5]' : 'bg-[#0c0805]/95 border-transparent'
            }`}
          >
            <div
              className={`flex items-center justify-between border-b pb-4 ${
                isBright ? 'border-[#EAE0D5]' : 'border-orange-950/80'
              }`}
            >
              <span className="text-xs font-mono uppercase tracking-widest text-[#EA580C] font-bold">
                Why Mentora?
              </span>
              <span
                className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-semibold border ${
                  isBright
                    ? 'bg-[#FFF3EB] text-[#EA580C] border-[#FED7AA]'
                    : 'bg-orange-950 text-orange-300 border-orange-700/60'
                }`}
              >
                The Paradigm Shift
              </span>
            </div>

            <div className="space-y-2">
              <h2
                className={`text-2xl sm:text-3xl font-bold tracking-tight transition-colors ${
                  isBright ? 'text-[#1C1917]' : 'text-white'
                }`}
              >
                Traditional platforms focus on completion rates. Mentora focuses on you.
              </h2>
              <p
                className={`text-sm sm:text-base leading-relaxed ${
                  isBright ? 'text-[#57534E]' : 'text-zinc-300'
                }`}
              >
                Modern professionals have access to more learning content than ever—but finding the right thing to learn at the right time is still the biggest challenge.
              </p>
            </div>

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Traditional */}
              <div
                className={`p-4 sm:p-5 rounded-2xl border space-y-2.5 transition-colors ${
                  isBright
                    ? 'bg-[#FAF4EE]/70 border-[#EAE0D5]'
                    : 'bg-[#140c07]/80 border-orange-950/80'
                }`}
              >
                <div className="flex items-center gap-2 text-rose-500 font-bold text-xs font-mono uppercase">
                  <span>✕</span>
                  <span>Traditional Platforms</span>
                </div>
                <ul className={`space-y-1.5 text-xs ${isBright ? 'text-[#78716C]' : 'text-zinc-400'}`}>
                  <li>• Generic, static course catalogs for everyone</li>
                  <li>• Vanity completion rates without retained mastery</li>
                  <li>• Squeezing random lectures into exhausted evenings</li>
                </ul>
              </div>

              {/* Mentora Approach */}
              <div
                className={`p-4 sm:p-5 rounded-2xl border space-y-2.5 transition-colors ${
                  isBright
                    ? 'bg-[#FFF6F0] border-[#FED7AA]'
                    : 'bg-orange-950/30 border-orange-800/60'
                }`}
              >
                <div
                  className={`flex items-center gap-2 font-bold text-xs font-mono uppercase ${
                    isBright ? 'text-[#EA580C]' : 'text-orange-300'
                  }`}
                >
                  <span>✓</span>
                  <span>The Mentora Way</span>
                </div>
                <ul
                  className={`space-y-1.5 text-xs font-medium ${
                    isBright ? 'text-[#44403C]' : 'text-zinc-200'
                  }`}
                >
                  <li>• Personalized based on role, experience & goals</li>
                  <li>• Level-gated roadmaps that eliminate redundancy</li>
                  <li>• Active recall drills & verifiable skill credentials</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* What Mentora Helps You Do */}
        <div className="space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span
              className={`text-xs font-mono font-bold uppercase tracking-wider ${
                isBright ? 'text-[#EA580C]' : 'text-orange-400'
              }`}
            >
              Core Capabilities
            </span>
            <h2
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                isBright ? 'text-[#1C1917]' : 'text-white'
              }`}
            >
              What Mentora Helps You Do
            </h2>
            <p className={`text-xs sm:text-sm ${isBright ? 'text-[#78716C]' : 'text-zinc-400'}`}>
              Designed from the ground up for measurable, time-efficient career advancement.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {coreCapabilities.map((item, idx) => {
              const isLast = idx === coreCapabilities.length - 1;
              return (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl border transition-all duration-300 space-y-3 group hover:-translate-y-1 ${
                    isLast ? 'sm:col-span-2 lg:col-span-1' : ''
                  } ${
                    isBright
                      ? 'bg-white border-[#EAE0D5] hover:border-orange-300 hover:shadow-md'
                      : 'bg-[#0c0805]/90 border-orange-950/80 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-950/30'
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl border flex items-center justify-center text-xl shadow-xs transition-colors ${
                      isBright
                        ? 'bg-[#FFF3EB] border-[#FED7AA]'
                        : 'bg-orange-950/80 border-orange-800/60 text-orange-300'
                    }`}
                  >
                    {item.icon}
                  </div>
                  <h3
                    className={`text-base sm:text-lg font-bold transition-colors ${
                      isBright ? 'text-[#1C1917] group-hover:text-[#EA580C]' : 'text-white group-hover:text-orange-300'
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p
                    className={`text-xs sm:text-sm leading-relaxed ${
                      isBright ? 'text-[#57534E]' : 'text-zinc-400'
                    }`}
                  >
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Built Around You (6 Personalization Dimensions) */}
        <div
          className={`p-6 sm:p-10 rounded-3xl border transition-all ${
            isBright
              ? 'bg-gradient-to-br from-white via-[#FAF4EE] to-[#FFF6F0] border-[#EAE0D5] shadow-md'
              : 'bg-gradient-to-br from-[#120a06] via-[#0c0704] to-[#150c07] border-orange-900/60 shadow-xl'
          }`}
        >
          <div className="text-center space-y-2 max-w-2xl mx-auto mb-8">
            <span
              className={`text-xs font-mono font-bold uppercase tracking-wider ${
                isBright ? 'text-[#EA580C]' : 'text-orange-400'
              }`}
            >
              Adaptive Engine
            </span>
            <h2
              className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                isBright ? 'text-[#1C1917]' : 'text-white'
              }`}
            >
              Built Around You
            </h2>
            <p className={`text-xs sm:text-sm ${isBright ? 'text-[#57534E]' : 'text-zinc-400'}`}>
              Mentora synthesizes multiple professional vectors into a dynamic, living curriculum:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {personalizationVectors.map((v, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border flex items-center gap-3.5 transition-all ${
                  isBright
                    ? 'bg-white border-[#EAE0D5] hover:border-orange-300'
                    : 'bg-[#180e08]/90 border-orange-900/40 hover:border-orange-500/50'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0 ${
                    isBright ? 'bg-[#FFF3EB] text-[#EA580C]' : 'bg-orange-950/70 text-orange-300'
                  }`}
                >
                  {v.icon}
                </div>
                <div className="min-w-0">
                  <div
                    className={`text-xs font-bold truncate ${
                      isBright ? 'text-[#1C1917]' : 'text-white'
                    }`}
                  >
                    {v.label}
                  </div>
                  <div
                    className={`text-[11px] truncate mt-0.5 ${
                      isBright ? 'text-[#78716C]' : 'text-zinc-400'
                    }`}
                  >
                    → {v.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center pt-6 border-t border-inherit">
            <p
              className={`text-xs sm:text-sm font-semibold italic ${
                isBright ? 'text-[#EA580C]' : 'text-orange-400'
              }`}
            >
              The result? A learning journey that continuously evolves as you do.
            </p>
          </div>
        </div>

        {/* Our Vision */}
        <div
          className={`relative p-8 sm:p-12 rounded-3xl text-center space-y-4 border transition-all ${
            isBright
              ? 'bg-white border-[#EAE0D5] shadow-md shadow-orange-950/5'
              : 'bg-gradient-to-b from-[#140b07] to-[#0a0604] border-orange-900/60 shadow-xl'
          }`}
        >
          <span
            className={`text-xs font-mono font-bold uppercase tracking-widest ${
              isBright ? 'text-[#EA580C]' : 'text-orange-400'
            }`}
          >
            Our Vision
          </span>
          <h2
            className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight max-w-2xl mx-auto leading-snug ${
              isBright ? 'text-[#1C1917]' : 'text-white'
            }`}
          >
            To make professional growth more personal, purposeful, and continuous.
          </h2>
          <p
            className={`text-xs sm:text-base leading-relaxed max-w-2xl mx-auto ${
              isBright ? 'text-[#57534E]' : 'text-zinc-300'
            }`}
          >
            We envision a world where learning isn&apos;t something employees squeeze into their schedules—it becomes a natural, daily part of their everyday professional journey.
          </p>

          <div className="pt-2">
            <span
              className={`inline-block text-xs font-mono font-bold tracking-widest px-4 py-1.5 rounded-full border ${
                isBright
                  ? 'bg-[#FFF3EB] text-[#EA580C] border-[#FED7AA]'
                  : 'bg-orange-950/80 text-orange-300 border-orange-800/60'
              }`}
            >
              MENTORA — LEARN. GROW. EVOLVE.
            </span>
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          className={`p-8 sm:p-10 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl transition-all ${
            isBright
              ? 'bg-gradient-to-r from-orange-100/70 via-white to-amber-100/70 border-orange-200/80 shadow-orange-950/5'
              : 'bg-gradient-to-r from-orange-950/40 via-[#120c08] to-orange-950/40 border-orange-900/50 shadow-black/40'
          }`}
        >
          <div className="space-y-1.5">
            <h3
              className={`font-bold text-lg sm:text-xl transition-colors ${
                isBright ? 'text-[#1C1917]' : 'text-white'
              }`}
            >
              Ready to start your personalized journey?
            </h3>
            <p
              className={`text-xs sm:text-sm transition-colors ${
                isBright ? 'text-[#57534E]' : 'text-zinc-400'
              }`}
            >
              Calibrate your baseline and discover your missing skills in minutes.
            </p>
          </div>
          <Link
            href="/onboarding"
            className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs uppercase tracking-wider font-mono shadow-lg shadow-orange-500/25 whitespace-nowrap text-center transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Start Learning Free →
          </Link>
        </div>

      </div>
    </div>
  );
}
