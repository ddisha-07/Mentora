import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950/80 text-indigo-300 border border-indigo-800/60">
          Our Mission & Vision
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          About Mentora
        </h1>
        <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-3xl">
          Mentora was founded to solve a critical flaw in modern tech education: engineers and tech leaders have access to thousands of hours of video courses, but zero clarity on which specific skills unlock their next promotion.
        </p>
      </div>

      {/* Philosophy Card */}
      <div className="p-[1.5px] rounded-3xl bg-gradient-to-r from-indigo-500/40 via-purple-500/20 to-slate-800">
        <div className="p-6 sm:p-10 rounded-[23px] bg-slate-900/90 space-y-6">
          <h2 className="text-2xl font-bold text-white">Our Core Philosophy</h2>
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 font-mono text-sm leading-relaxed">
            <span className="text-rose-400 line-through">Topic → Static Playlist</span>
            <br />
            <span className="text-emerald-400 font-bold">
              ✓ Individual Context + Diagnostic Gap Prediction → 3-Level Verified Roadmap
            </span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            By shifting from passive content consumption to level-gated progression, active flashcard retrieval, and rigorous 70% passing standards, learners master high-impact skills 3x faster while building tangible proof of competence.
          </p>
        </div>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
          <div className="text-2xl">🎯</div>
          <h3 className="text-lg font-bold text-white">Precision Targeting</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Algorithms calculate the exact difference between your current baseline and your desired role.
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
          <div className="text-2xl">🧠</div>
          <h3 className="text-lg font-bold text-white">Active Retention</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Multi-modal learning with flashcards, video lessons, and scenario quizzes for durable recall.
          </p>
        </div>
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
          <div className="text-2xl">🏅</div>
          <h3 className="text-lg font-bold text-white">Verified Proof</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Tamper-proof Skill Passport and leaderboard ranking earned through strict 70%+ score evaluations.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-white text-base">Ready to experience personalized learning?</h4>
          <p className="text-xs text-slate-400 mt-0.5">Diagnose your skills in 2 minutes.</p>
        </div>
        <Link
          href="/register"
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 whitespace-nowrap text-center"
        >
          Start Learning Free →
        </Link>
      </div>
    </div>
  );
}
