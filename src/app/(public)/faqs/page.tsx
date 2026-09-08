'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

export default function FAQsPage() {
  const { isBright } = useTheme();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: 'Curriculum & Diagnostics',
      q: 'How does Mentora determine my personalized roadmap?',
      a: 'During onboarding, Mentora assesses your current role, existing competencies, seniority level, and target career aspiration. Our personalization engine computes the exact set difference between your baseline and the target role matrix, generating an adaptive 3-tier roadmap with zero redundant modules.',
    },
    {
      category: 'Skill Passport & Gating',
      q: 'What is the Skill Passport and how is it verified?',
      a: 'The Skill Passport is a shareable, cryptographically verifiable digital credential of your mastered competencies. It tracks your completed modules, quiz mastery scores, and timestamps, giving hiring managers and teams indisputable proof of your hands-on competence.',
    },
    {
      category: 'Mastery Standards',
      q: 'Why is there a strict 70% passing threshold on quizzes?',
      a: 'We reject superficial completion metrics where simply watching a video awards a certificate. Mentora requires a minimum 70% passing score on scenario-based micro-quizzes to ensure authentic comprehension, reinforce retention, and uphold leaderboard credibility.',
    },
    {
      category: 'Enterprise & Cohorts',
      q: 'Can companies integrate Mentora with internal engineering teams?',
      a: 'Yes. Mentora Enterprise offers organizational accounts with custom competency matrixes, team skill-gap analytics, cohort benchmarks, and centralized leaderboard tracking tailored for engineering managers and L&D leaders.',
    },
    {
      category: 'Progression Architecture',
      q: 'What does "Level-Gated Progression" mean?',
      a: 'Rather than overwhelming you with an endless list of unsequenced lessons, Mentora groups your missing skills into three progressive tiers (Level 1: Foundations, Level 2: Core Practice, Level 3: Specialization). Higher tiers remain locked until prerequisite assessments are successfully passed.',
    },
  ];

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

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
      <div className="absolute top-1/3 -right-36 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold transition-colors ${
              isBright
                ? 'bg-[#FFF3EB] text-[#EA580C] border border-[#FED7AA]'
                : 'bg-orange-950/70 text-orange-300 border border-orange-500/40 shadow-inner'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            <span>[ KNOWLEDGE BASE // SYSTEM FAQs ]</span>
          </div>
          <h1
            className={`text-4xl sm:text-6xl font-extrabold tracking-tight transition-colors ${
              isBright ? 'text-[#1C1917]' : 'text-white'
            }`}
          >
            Frequently Asked{' '}
            <span
              className={`bg-clip-text text-transparent ${
                isBright
                  ? 'bg-gradient-to-r from-[#EA580C] via-orange-600 to-[#C2410C]'
                  : 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500'
              }`}
            >
              Questions
            </span>
          </h1>
          <p
            className={`text-base sm:text-lg leading-relaxed transition-colors ${
              isBright ? 'text-[#57534E]' : 'text-zinc-400'
            }`}
          >
            Everything you need to know about our adaptive learning engine, prerequisite gating, and verified skill credentialing.
          </p>
        </div>

        {/* Interactive FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isBright
                    ? 'bg-white border-[#EAE0D5] hover:border-orange-300 shadow-sm'
                    : 'bg-[#0c0805]/95 border-orange-950/80 hover:border-orange-500/40'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full p-6 sm:p-7 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                >
                  <div className="flex items-start sm:items-center gap-4">
                    <span
                      className={`font-mono text-xs font-bold px-2.5 py-1 rounded-md border ${
                        isBright
                          ? 'text-[#EA580C] bg-[#FFF3EB] border-[#FED7AA]'
                          : 'text-orange-400 bg-orange-950/80 border-orange-900/60'
                      }`}
                    >
                      0{index + 1}
                    </span>
                    <div>
                      <span
                        className={`text-[10px] font-mono uppercase tracking-widest block mb-0.5 ${
                          isBright ? 'text-[#78716C]' : 'text-zinc-500'
                        }`}
                      >
                        {faq.category}
                      </span>
                      <h3
                        className={`text-base sm:text-lg font-bold leading-snug transition-colors ${
                          isBright ? 'text-[#1C1917]' : 'text-white'
                        }`}
                      >
                        {faq.q}
                      </h3>
                    </div>
                  </div>
                  <div
                    className={`w-7 h-7 rounded-full border flex items-center justify-center font-mono text-sm shrink-0 transition-transform duration-200 ${
                      isOpen
                        ? isBright
                          ? 'rotate-180 bg-[#FFF3EB] text-[#EA580C] border-[#FED7AA]'
                          : 'rotate-180 bg-orange-950/60 text-orange-300 border-orange-800'
                        : isBright
                        ? 'bg-[#FAF4EE] border-[#E3D4C5] text-[#57534E]'
                        : 'bg-[#140e08] border-orange-900/60 text-orange-400'
                    }`}
                  >
                    ↓
                  </div>
                </button>

                {isOpen && (
                  <div
                    className={`px-6 pb-6 sm:px-7 sm:pb-7 pt-1 border-t text-sm leading-relaxed ${
                      isBright
                        ? 'border-[#EAE0D5] text-[#57534E]'
                        : 'border-orange-950/40 text-zinc-300'
                    }`}
                  >
                    <p
                      className={`p-4 rounded-xl border ${
                        isBright
                          ? 'bg-[#FAF4EE] border-[#E3D4C5] text-[#57534E]'
                          : 'bg-[#140e08]/60 border-orange-950/60 text-zinc-300'
                      }`}
                    >
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions CTA */}
        <div
          className={`p-8 sm:p-10 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl transition-all ${
            isBright
              ? 'bg-gradient-to-r from-orange-100/70 via-white to-amber-100/70 border-orange-200/80 shadow-orange-950/5'
              : 'bg-gradient-to-r from-orange-950/40 via-[#120c08] to-orange-950/40 border-orange-900/50 shadow-black/40'
          }`}
        >
          <div className="space-y-1.5">
            <h4
              className={`font-bold text-lg transition-colors ${
                isBright ? 'text-[#1C1917]' : 'text-white'
              }`}
            >
              Still have questions?
            </h4>
            <p
              className={`text-xs sm:text-sm transition-colors ${
                isBright ? 'text-[#57534E]' : 'text-zinc-400'
              }`}
            >
              Our engineering and advisory team is ready to help you.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs uppercase tracking-wider font-mono shadow-md whitespace-nowrap text-center transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Contact Our Team →
          </Link>
        </div>
      </div>
    </div>
  );
}
