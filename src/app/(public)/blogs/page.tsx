'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

export default function BlogsPage() {
  const { isBright } = useTheme();

  const articles = [
    {
      id: 1,
      category: 'Cognitive Science & Pedagogy',
      title: 'Why Level-Gated Progression Beats Infinite Video Libraries',
      description:
        'Prerequisite enforcement prevents cognitive fatigue, structures knowledge scaffolding, and activates dopamine feedback loops when unlocking advanced specializations.',
      readTime: '5 min read',
      date: 'Sept 2026',
    },
    {
      id: 2,
      category: 'Algorithmic Curriculum',
      title: 'The Math Behind Predictive Skill-Gap Diagnostics',
      description:
        'How we compute weighted set differences between a developer’s current competency matrix and job market requirements to assemble personalized 3-tier roadmaps.',
      readTime: '8 min read',
      date: 'Aug 2026',
    },
    {
      id: 3,
      category: 'Credentialing & Proof',
      title: 'Why Real Mastery Demands a Strict 70% Evaluation Standard',
      description:
        'Eliminating superficial completion certificates in favor of verified competence, non-trivial scenario assessments, and competitive leaderboard rankings.',
      readTime: '4 min read',
      date: 'July 2026',
    },
  ];

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
      <div className="absolute top-1/3 -left-36 w-80 h-80 bg-orange-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
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
            <span>[ RESEARCH & ARTICLES // COGNITIVE ARCHITECTURES ]</span>
          </div>
          <h1
            className={`text-4xl sm:text-6xl font-extrabold tracking-tight transition-colors ${
              isBright ? 'text-[#1C1917]' : 'text-white'
            }`}
          >
            Mentora{' '}
            <span
              className={`bg-clip-text text-transparent ${
                isBright
                  ? 'bg-gradient-to-r from-[#EA580C] via-orange-600 to-[#C2410C]'
                  : 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500'
              }`}
            >
              Insights
            </span>
          </h1>
          <p
            className={`text-base sm:text-lg leading-relaxed transition-colors ${
              isBright ? 'text-[#57534E]' : 'text-zinc-400'
            }`}
          >
            Deep dives into adaptive curriculum design, spaced cognitive recall, and verifiable skill credentialing for working professionals.
          </p>
        </div>

        {/* Article Cards Grid */}
        <div className="space-y-6">
          {articles.map((article) => (
            <article
              key={article.id}
              className={`p-7 sm:p-9 rounded-3xl border transition-all duration-300 space-y-4 group relative overflow-hidden ${
                isBright
                  ? 'bg-white border-[#EAE0D5] hover:border-orange-300 shadow-sm hover:shadow-md'
                  : 'bg-[#0c0805]/95 border-orange-950/80 hover:border-orange-500/60 shadow-lg shadow-black/40 hover:shadow-orange-950/30'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span
                  className={`font-mono font-bold uppercase tracking-widest text-[11px] px-2.5 py-1 rounded-md border ${
                    isBright
                      ? 'bg-[#FFF3EB] text-[#EA580C] border-[#FED7AA]'
                      : 'bg-orange-950/60 text-orange-400 border-orange-900/50'
                  }`}
                >
                  {article.category}
                </span>
                <span
                  className={`font-mono text-[11px] ${
                    isBright ? 'text-[#78716C]' : 'text-zinc-500'
                  }`}
                >
                  {article.readTime} • {article.date}
                </span>
              </div>

              <h2
                className={`text-xl sm:text-2xl font-bold transition-colors leading-snug ${
                  isBright
                    ? 'text-[#1C1917] group-hover:text-[#EA580C]'
                    : 'text-white group-hover:text-orange-300'
                }`}
              >
                {article.title}
              </h2>

              <p
                className={`text-sm sm:text-base leading-relaxed transition-colors ${
                  isBright ? 'text-[#57534E]' : 'text-zinc-400'
                }`}
              >
                {article.description}
              </p>

              <div
                className={`pt-2 flex items-center justify-between border-t text-xs ${
                  isBright ? 'border-[#EAE0D5]' : 'border-orange-950/60'
                }`}
              >
                <span className="text-[#EA580C] font-mono font-bold group-hover:translate-x-1.5 transition-transform inline-flex items-center gap-1.5">
                  Read Article <span>→</span>
                </span>
                <span
                  className={`font-mono text-[10px] uppercase ${
                    isBright ? 'text-[#A8A29E]' : 'text-zinc-600'
                  }`}
                >
                  Archived Edition
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter / Stay Updated Card */}
        <div
          className={`p-8 sm:p-10 rounded-3xl border text-center space-y-4 shadow-xl transition-all ${
            isBright
              ? 'bg-gradient-to-r from-orange-100/70 via-white to-amber-100/70 border-orange-200/80 shadow-orange-950/5'
              : 'bg-gradient-to-r from-orange-950/40 via-[#120c08] to-orange-950/40 border-orange-900/50 shadow-black/40'
          }`}
        >
          <h3
            className={`text-xl sm:text-2xl font-bold tracking-tight transition-colors ${
              isBright ? 'text-[#1C1917]' : 'text-white'
            }`}
          >
            Stay on the Cutting Edge of Learning Systems
          </h3>
          <p
            className={`text-sm max-w-lg mx-auto leading-relaxed transition-colors ${
              isBright ? 'text-[#57534E]' : 'text-zinc-400'
            }`}
          >
            Get our latest research papers on cognitive architecture and skills engineering delivered directly to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2">
            <input
              type="email"
              placeholder="engineer@company.com"
              className={`w-full px-4 py-3 rounded-xl border text-xs focus:outline-none transition-colors font-mono ${
                isBright
                  ? 'bg-white border-[#E3D4C5] text-[#1C1917] placeholder-[#A8A29E] focus:border-orange-500'
                  : 'bg-[#0c0805] border-orange-900/60 text-white placeholder-zinc-500 focus:border-orange-500'
              }`}
            />
            <button
              type="button"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs uppercase tracking-wider font-mono shadow-md whitespace-nowrap transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
