import React from 'react';
import Link from 'next/link';

export default function BlogsPage() {
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
    <div className="relative overflow-hidden bg-[#080604] text-[#fff7ed] bg-retro-dense-grid min-h-[calc(100vh-4.5rem)]">
      {/* Ambient Orange & Amber Radiance Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-gradient-to-b from-orange-600/15 via-amber-600/10 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 -left-36 w-80 h-80 bg-orange-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-orange-950/70 text-orange-300 border border-orange-500/40 shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            <span>[ RESEARCH & ARTICLES // COGNITIVE ARCHITECTURES ]</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
            Mentora{' '}
            <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200 bg-clip-text text-transparent">
              Insights
            </span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
            Deep dives into adaptive curriculum design, spaced cognitive recall, and verifiable skill credentialing for working professionals.
          </p>
        </div>

        {/* Article Cards Grid */}
        <div className="space-y-6">
          {articles.map((article) => (
            <article
              key={article.id}
              className="p-7 sm:p-9 rounded-3xl bg-[#0c0805]/95 border border-orange-950/80 hover:border-orange-500/60 shadow-lg shadow-black/40 hover:shadow-orange-950/30 transition-all duration-300 space-y-4 group relative overflow-hidden"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-mono font-bold text-orange-400 uppercase tracking-widest text-[11px] bg-orange-950/60 border border-orange-900/50 px-2.5 py-1 rounded-md">
                  {article.category}
                </span>
                <span className="text-zinc-500 font-mono text-[11px]">{article.readTime} • {article.date}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-orange-300 transition-colors leading-snug">
                {article.title}
              </h2>

              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                {article.description}
              </p>

              <div className="pt-2 flex items-center justify-between border-t border-orange-950/60 text-xs">
                <span className="text-orange-400 font-mono font-bold group-hover:translate-x-1.5 transition-transform inline-flex items-center gap-1.5">
                  Read Article <span>→</span>
                </span>
                <span className="text-zinc-600 font-mono text-[10px] uppercase">
                  Archived Edition
                </span>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter / Stay Updated Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-orange-950/40 via-[#120c08] to-orange-950/40 border border-orange-900/50 text-center space-y-4 shadow-xl">
          <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Stay on the Cutting Edge of Learning Systems</h3>
          <p className="text-sm text-zinc-400 max-w-lg mx-auto leading-relaxed">
            Get our latest research papers on cognitive architecture and skills engineering delivered directly to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto pt-2">
            <input
              type="email"
              placeholder="engineer@company.com"
              className="w-full px-4 py-3 rounded-xl bg-[#0c0805] border border-orange-900/60 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-orange-500 font-mono"
            />
            <button
              type="button"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-300 hover:to-orange-400 text-black font-bold text-xs uppercase tracking-wider font-mono shadow-md whitespace-nowrap transition-all"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
