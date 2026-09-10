'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import {
  Plus,
  X,
  Send,
  Sparkles,
  MessageSquarePlus,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Search,
  Check,
  Flame
} from 'lucide-react';

interface FAQItem {
  id: number;
  category: string;
  q: string;
  a: string;
  isCommunity?: boolean;
  author?: string;
}

interface CommunityMember {
  id: number;
  name: string;
  role: string;
  company: string;
  avatar: string;
  askedQuestion: string;
}

export default function FAQsPage() {
  const { isBright } = useTheme();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [newQuestion, setNewQuestion] = useState('');
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);
  const [submittedToast, setSubmittedToast] = useState<string | null>(null);

  const initialFaqs: FAQItem[] = [
    {
      id: 1,
      category: 'Curriculum & Diagnostics',
      q: 'How does Mentora determine my personalized roadmap?',
      a: 'During onboarding, Mentora assesses your current role, existing competencies, seniority level, and target career goals. Our personalization engine computes the exact weighted set difference between your baseline and target role standards, generating a structured 3-tier roadmap with zero redundant modules.'
    },
    {
      id: 2,
      category: 'Time & Pacing',
      q: 'How much time do I need to commit each day as a working professional?',
      a: 'Mentora is engineered specifically for demanding work schedules. Modules are broken down into high-density 5–8 minute micro-drills with active recall questions that can be completed during your morning commute, lunch break, or between meetings.'
    },
    {
      id: 3,
      category: 'Skill Passport & Proof',
      q: 'What makes the Mentora Skill Passport verifiable by employers?',
      a: 'The Skill Passport is a shareable digital credential backed by cryptographically signed evaluation proofs. Each badge reflects authentic scenario assessments and hard execution metrics (not passive video views), verifiable by hiring managers via a unique verification link.'
    },
    {
      id: 4,
      category: 'Mastery Standards',
      q: 'Why is there a strict 70% passing threshold on assessments?',
      a: 'We reject superficial completion metrics where simply letting a video play in a tab awards a certificate. Mentora requires a minimum 70% score on practical failure scenarios to ensure authentic problem-solving intuition before unlocking higher-tier specializations.'
    },
    {
      id: 5,
      category: 'Progression Architecture',
      q: 'What does "Level-Gated Progression" mean in practice?',
      a: 'Rather than overwhelming you with hundreds of unsequenced lessons, Mentora structures your roadmap into progressive tiers (Level 1: Foundations, Level 2: Core Practice, Level 3: Specialization). Advanced tiers remain locked until prerequisite fundamentals are proven.'
    },
    {
      id: 6,
      category: 'Enterprise & Cohorts',
      q: 'Can engineering teams and companies use Mentora together?',
      a: 'Yes. Mentora Enterprise offers team accounts with shared competency matrices, cohort benchmarks, custom internal roadmaps, and analytics dashboards for engineering leads and VP of Engineering to track developer velocity.'
    }
  ];

  const [faqList, setFaqList] = useState<FAQItem[]>(initialFaqs);

  const communityMembers: CommunityMember[] = [
    {
      id: 1,
      name: 'Sarah Lin',
      role: 'Staff Backend Eng',
      company: 'FinTech Cloud',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      askedQuestion: 'Can I test out of Level 1 if I already have 5 years experience?'
    },
    {
      id: 2,
      name: 'Marcus Vance',
      role: 'Tech Lead',
      company: 'Distributed Labs',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      askedQuestion: 'How does the AI Companion handle language-specific concurrency idioms?'
    },
    {
      id: 3,
      name: 'Amina Traore',
      role: 'Platform Eng',
      company: 'DataScale Systems',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&auto=format&fit=crop&q=80',
      askedQuestion: 'Are the Skill Passports directly embeddable on LinkedIn profiles?'
    },
    {
      id: 4,
      name: 'David Rossi',
      role: 'Full Stack Dev',
      company: 'NextGen SaaS',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      askedQuestion: 'What happens if I fail a scenario assessment multiple times?'
    },
    {
      id: 5,
      name: 'Elena Rostova',
      role: 'Cloud Architect',
      company: 'HyperScale Systems',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      askedQuestion: 'Can our company import custom internal infrastructure archetypes?'
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    const addedItem: FAQItem = {
      id: faqList.length + 1,
      category: 'Community Question',
      q: newQuestion.trim(),
      a: 'Thank you for submitting this question! Our curriculum engineers and community moderators review incoming questions continuously. An initial diagnostic drill recommendation has been queued for this inquiry.',
      isCommunity: true,
      author: 'You (Community Member)'
    };

    setFaqList([...faqList, addedItem]);
    setOpenIndex(faqList.length); // auto-open the newly added question
    setSubmittedToast(`Question #${faqList.length + 1} added to community queue!`);
    setNewQuestion('');

    setTimeout(() => {
      setSubmittedToast(null);
    }, 4000);
  };

  return (
    <div
      className={`relative min-h-[calc(100vh-4.5rem)] transition-colors duration-200 ${
        isBright
          ? 'bg-[#FAF4EE] text-[#1C1917] bg-retro-dense-grid'
          : 'bg-[#080604] text-[#fff7ed] bg-retro-dense-grid'
      }`}
    >
      {/* Ambient Orange & Amber Radiance Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-b from-orange-600/15 via-amber-600/10 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/4 -right-36 w-80 h-80 bg-orange-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 -left-36 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="py-14 sm:py-18 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10 sm:space-y-12">
        
        {/* Header with Line-Art Question Mark Graphic */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Left Title & Lead Content */}
          <div className="md:col-span-8 space-y-3 sm:space-y-4">
            {/* Bold FAQ Brand Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black font-mono text-xs tracking-wider shadow-sm">
              <Flame className="w-3.5 h-3.5 fill-white" />
              <span>FAQ</span>
            </div>

            {/* Editorial Headline matching reference design */}
            <h1
              className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.15] transition-colors ${
                isBright ? 'text-[#1C1917]' : 'text-white'
              }`}
            >
              Frequently Asked Questions.{' '}
              <span
                className={`block sm:inline font-normal ${
                  isBright ? 'text-[#78716C]' : 'text-zinc-400'
                }`}
              >
                But visitors can add questions too.
              </span>
            </h1>

            <p
              className={`text-xs sm:text-sm leading-relaxed max-w-xl transition-colors ${
                isBright ? 'text-[#57534E]' : 'text-zinc-400'
              }`}
            >
              Everything you need to know about our personalized curriculum engine, prerequisite gating, and verified skill credentials.
            </p>
          </div>

          {/* Right Side: Artistic Hand-Drawn / Line-Art Question Mark Icon */}
          <div className="hidden md:flex md:col-span-4 justify-end items-center pr-4 select-none pointer-events-none">
            <div className="relative w-28 h-32 lg:w-36 lg:h-40 opacity-80 transition-opacity hover:opacity-100">
              <svg
                viewBox="0 0 100 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full text-orange-500/40 drop-shadow-sm"
              >
                {/* Expressive hand-drawn style question mark contour */}
                <path
                  d="M 32 38 C 32 20, 48 10, 64 16 C 78 22, 82 38, 72 50 C 62 62, 52 68, 52 82"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={isBright ? 'text-orange-500/35' : 'text-orange-400/45'}
                />
                {/* Circular bottom dot */}
                <circle
                  cx="52"
                  cy="102"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="5"
                  className={isBright ? 'text-orange-500/35' : 'text-orange-400/45'}
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Main Numbered Accordion FAQ Card Container */}
        <div
          className={`rounded-3xl border p-4 sm:p-6 lg:p-8 shadow-2xl transition-all ${
            isBright
              ? 'bg-white/95 border-[#E8DACD] shadow-orange-950/5'
              : 'bg-[#0e0906]/95 border-orange-950/80 shadow-black/60'
          }`}
        >
          {/* Scrollable / Stacked Accordion List */}
          <div className="space-y-3 sm:space-y-3.5">
            {faqList.map((faq, index) => {
              const isOpen = openIndex === index;
              const itemNumber = index + 1;

              return (
                <div
                  key={faq.id}
                  className={`rounded-xl sm:rounded-2xl transition-all duration-200 overflow-hidden border ${
                    isOpen
                      ? isBright
                        ? 'bg-[#FFF9F5] border-orange-300 shadow-sm'
                        : 'bg-[#180e08] border-orange-800/60 shadow-md'
                      : isBright
                      ? 'bg-[#F7EFE7]/80 hover:bg-[#F4E9DF] border-[#EADAC9]'
                      : 'bg-[#140c07]/90 hover:bg-[#1a100a] border-orange-950/70'
                  }`}
                >
                  {/* Clickable Header Row: [Square Number Badge] + [Question Text] + [+] Icon */}
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full p-3 sm:p-4 text-left flex items-center justify-between gap-3 sm:gap-4 focus:outline-none cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3 sm:gap-3.5 flex-1 min-w-0">
                      
                      {/* Solid High-Contrast Square Number Badge (Matching Reference) */}
                      <div
                        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center font-mono font-black text-xs sm:text-sm shrink-0 transition-colors ${
                          isOpen
                            ? 'bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-xs'
                            : isBright
                            ? 'bg-[#1C1917] text-white'
                            : 'bg-black text-zinc-100 border border-zinc-800'
                        }`}
                      >
                        {itemNumber}
                      </div>

                      {/* Question Text */}
                      <div className="flex-1 min-w-0">
                        <span
                          className={`text-xs sm:text-sm font-semibold tracking-tight transition-colors line-clamp-2 ${
                            isOpen
                              ? isBright
                                ? 'text-[#EA580C]'
                                : 'text-orange-300'
                              : isBright
                              ? 'text-[#1C1917]'
                              : 'text-zinc-200'
                          }`}
                        >
                          {faq.q}
                        </span>

                        {faq.isCommunity && (
                          <span className="inline-block mt-0.5 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-orange-500/15 text-orange-500 border border-orange-500/20">
                            COMMUNITY QUESTION
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Expandable [+] icon that rotates to [x] */}
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? 'rotate-45 text-orange-500'
                          : isBright
                          ? 'text-zinc-500 hover:text-zinc-800'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                    </div>
                  </button>

                  {/* Expanded Answer Body */}
                  {isOpen && (
                    <div
                      className={`px-4 pb-4 sm:px-5 sm:pb-5 pt-1 border-t text-xs sm:text-sm leading-relaxed ${
                        isBright
                          ? 'border-[#EADAC9] text-[#57534E]'
                          : 'border-orange-950/60 text-zinc-300'
                      }`}
                    >
                      <div className="pl-11 sm:pl-12 pt-1 space-y-2">
                        <p>{faq.a}</p>
                        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-1">
                          <span>CATEGORY: {faq.category.toUpperCase()}</span>
                          {faq.author && <span>SUBMITTED BY: {faq.author}</span>}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Interactive "Ask a question" Input Bar (Matching Reference) */}
          <form
            onSubmit={handleAddQuestion}
            className="pt-5 sm:pt-6 flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3"
          >
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="Ask a question..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className={`w-full px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl border text-xs sm:text-sm focus:outline-none transition-all ${
                  isBright
                    ? 'bg-[#FAF4EE] border-[#E5D7CB] text-[#1C1917] placeholder-zinc-400 focus:border-orange-500 focus:bg-white'
                    : 'bg-[#140c07] border-orange-950/80 text-white placeholder-zinc-500 focus:border-orange-500 focus:bg-[#1a100a]'
                }`}
              />
            </div>

            {/* Solid High-Contrast Add Button */}
            <button
              type="submit"
              className="w-full sm:w-auto px-7 py-3 sm:py-3.5 rounded-xl bg-[#1C1917] hover:bg-orange-600 text-white font-mono font-bold text-xs sm:text-sm tracking-wider uppercase shadow-md transition-all cursor-pointer whitespace-nowrap active:scale-98"
            >
              Add
            </button>
          </form>

          {/* Submission Toast Notification */}
          {submittedToast && (
            <div className="mt-3 p-3 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-600 text-xs font-mono font-semibold flex items-center justify-between animate-fadeIn">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{submittedToast}</span>
              </div>
              <button
                type="button"
                onClick={() => setSubmittedToast(null)}
                className="text-orange-600 hover:text-orange-800"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Connected Community Tree Lines and Avatars (Direct from Reference) */}
          <div className="pt-6 sm:pt-8 flex flex-col items-center select-none">
            
            {/* Vertical connector dropping down from input with junction node */}
            <div className="relative flex flex-col items-center">
              <div className="w-[1px] h-6 sm:h-8 border-l border-dashed border-orange-500/50" />
              {/* Circular Junction Node */}
              <div className="w-2.5 h-2.5 rounded-full border border-orange-500 bg-orange-100 dark:bg-orange-950 -my-0.5 z-10" />
              <div className="w-[1px] h-6 sm:h-8 border-l border-dashed border-orange-500/50" />
            </div>

            {/* Horizontal Branching Dashed Tree Line */}
            <div className="w-full max-w-md sm:max-w-xl relative flex items-center justify-between">
              <div className="w-full border-t border-dashed border-orange-500/40" />
            </div>

            {/* Row of 5 Diverse Community Avatars */}
            <div className="w-full max-w-md sm:max-w-xl grid grid-cols-5 gap-2 sm:gap-4 pt-4 sm:pt-5">
              {communityMembers.map((member) => (
                <div
                  key={member.id}
                  className="relative flex flex-col items-center group cursor-pointer"
                  onMouseEnter={() => setActiveTooltip(member.id)}
                  onMouseLeave={() => setActiveTooltip(null)}
                  onClick={() => {
                    setNewQuestion(member.askedQuestion);
                  }}
                >
                  {/* Vertical drop line to avatar */}
                  <div className="w-[1px] h-3 sm:h-4 border-l border-dashed border-orange-500/40 -mt-4 sm:-mt-5 mb-1.5" />

                  {/* Avatar Container with rounded squircle and soft drop shadow */}
                  <div className="relative w-11 h-11 sm:w-13 sm:h-13 rounded-2xl overflow-hidden border-2 border-white dark:border-[#2a170d] shadow-lg transition-transform duration-200 group-hover:scale-110 group-hover:border-orange-500">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Interactive Tooltip Hover Card */}
                  {activeTooltip === member.id && (
                    <div
                      className={`absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-48 sm:w-56 p-3 rounded-xl border shadow-xl z-30 pointer-events-none text-left animate-fadeIn ${
                        isBright
                          ? 'bg-white border-[#E5D7CB] text-[#1C1917]'
                          : 'bg-[#140c07] border-orange-900/80 text-white'
                      }`}
                    >
                      <div className="text-[11px] font-bold">{member.name}</div>
                      <div className="text-[10px] font-mono text-orange-500">
                        {member.role} • {member.company}
                      </div>
                      <div
                        className={`text-[10px] mt-1.5 pt-1.5 border-t italic leading-snug ${
                          isBright ? 'border-zinc-200 text-zinc-600' : 'border-zinc-800 text-zinc-400'
                        }`}
                      >
                        "{member.askedQuestion}"
                      </div>
                      <div className="text-[9px] font-mono text-orange-400 mt-1 font-semibold">
                        Click avatar to paste question ↗
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-3 text-[11px] font-mono text-zinc-400 text-center">
              Active engineering community • Hover over learners or click an avatar to inspect their question
            </div>
          </div>

        </div>

        {/* Still Have Questions CTA Banner */}
        <div
          className={`p-7 sm:p-10 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl transition-all ${
            isBright
              ? 'bg-gradient-to-r from-orange-100/70 via-white to-amber-100/70 border-orange-200/80 shadow-orange-950/5'
              : 'bg-gradient-to-r from-orange-950/40 via-[#120c08] to-orange-950/40 border-orange-900/50 shadow-black/40'
          }`}
        >
          <div className="space-y-1">
            <h3
              className={`font-bold text-lg sm:text-xl transition-colors ${
                isBright ? 'text-[#1C1917]' : 'text-white'
              }`}
            >
              Have a unique organizational or curriculum inquiry?
            </h3>
            <p
              className={`text-xs sm:text-sm transition-colors ${
                isBright ? 'text-[#57534E]' : 'text-zinc-400'
              }`}
            >
              Our learning systems engineers and advisory team typically respond within 24 hours.
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
