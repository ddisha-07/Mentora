'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';

interface TargetRoleOption {
  id: string;
  title: string;
  icon: string;
  badge: string;
  description: string;
  defaultSkills: string[];
}

const TARGET_ROLES: TargetRoleOption[] = [
  {
    id: 'Senior AI Systems Architect',
    title: 'Senior AI Systems Architect',
    icon: '🧠',
    badge: 'High Demand',
    description: 'Design end-to-end LLM pipelines, RAG architectures, model fine-tuning, and scalable AI infrastructure.',
    defaultSkills: ['Python', 'GenAI Foundations', 'Prompt Engineering', 'Embeddings & RAG', 'Vector Databases', 'LangChain / AI Agents', 'Model Fine-Tuning'],
  },
  {
    id: 'AI Product Lead',
    title: 'AI Product Lead',
    icon: '🚀',
    badge: 'Leadership',
    description: 'Formulate defensible AI product strategies, design human-AI interactions, and lead LLM eval benchmarks.',
    defaultSkills: ['AI Fundamentals', 'Understanding LLM Capabilities', 'AI Product Strategy', 'AI UX & Product Design', 'Evaluating AI Products & Metrics'],
  },
  {
    id: 'Senior MLOps Engineer',
    title: 'Senior MLOps Engineer',
    icon: '⚡',
    badge: 'Infrastructure',
    description: 'Automate CI/CD for machine learning, orchestrate GPU clusters, model serving latency, and AI guardrails.',
    defaultSkills: ['Python', 'Docker', 'Kubernetes', 'ML Pipelines', 'Model Serving', 'Vector Databases', 'Monitoring & Drift'],
  },
  {
    id: 'Full-Stack AI Developer',
    title: 'Full-Stack AI Developer',
    icon: '💻',
    badge: 'Fast-Track',
    description: 'Build modern AI-native web applications using Next.js AI SDK, tool calling, embeddings, and vector search.',
    defaultSkills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Prompt Engineering', 'Embeddings & RAG', 'Next.js'],
  },
  {
    id: 'Data & Analytics Strategist',
    title: 'Data & Analytics Strategist',
    icon: '📊',
    badge: 'Enterprise',
    description: 'Leverage vector search, enterprise semantic data layers, executive dashboards, and AI ethics governance.',
    defaultSkills: ['SQL', 'Data Warehousing', 'AI Fundamentals', 'BI Dashboards', 'Vector Search & Analytics', 'AI Governance'],
  },
];

const SUGGESTED_SKILLS = [
  'Python',
  'JavaScript',
  'TypeScript',
  'Node.js',
  'React',
  'Next.js',
  'PostgreSQL',
  'SQL',
  'Git',
  'Docker',
  'Kubernetes',
  'REST APIs',
  'Prompt Engineering',
  'Embeddings & RAG',
  'Vector Databases',
  'LangChain / AI Agents',
  'PyTorch',
  'Model Fine-Tuning',
  'System Design',
  'Agile / Scrum',
  'Product Roadmapping',
  'Data Analytics',
];

const STEPS = [
  { id: 1, name: 'Personal Info', label: 'Personal Info' },
  { id: 2, name: 'Target Role', label: 'Target Role' },
  { id: 3, name: 'Current Skills', label: 'Current Skills' },
  { id: 4, name: 'Review', label: 'Review' },
];

export default function OnboardingWizardPage() {
  const router = useRouter();
  const { isBright, toggleTheme } = useTheme();

  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);

  // Form fields
  const [fullName, setFullName] = useState('Alex Morgan');
  const [currentRole, setCurrentRole] = useState('Software Developer');
  const [yearsOfExperience, setYearsOfExperience] = useState(3);
  const [targetRole, setTargetRole] = useState('Senior AI Systems Architect');
  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [currentSkills, setCurrentSkills] = useState<string[]>([
    'JavaScript',
    'TypeScript',
    'Node.js',
    'PostgreSQL',
    'Git',
  ]);
  const [customSkillInput, setCustomSkillInput] = useState('');

  // Loading state during personalization engine execution
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState('Analyzing your professional baseline...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Toggle skill
  const toggleSkill = (skill: string) => {
    setCurrentSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  // Add custom skill
  const addCustomSkill = () => {
    const trimmed = customSkillInput.trim();
    if (trimmed && !currentSkills.includes(trimmed)) {
      setCurrentSkills((prev) => [...prev, trimmed]);
      setCustomSkillInput('');
    }
  };

  // Sync slider with experience level
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (val === 1) setExperienceLevel('beginner');
    else if (val === 2) setExperienceLevel('intermediate');
    else setExperienceLevel('advanced');
  };

  const getSliderValue = () => {
    if (experienceLevel === 'beginner') return 1;
    if (experienceLevel === 'intermediate') return 2;
    return 3;
  };

  // Submit onboarding wizard
  const handleFinalSubmit = async () => {
    setIsGenerating(true);
    setErrorMessage(null);

    // Animated phases for the personalization engine
    setTimeout(() => setLoadingPhase('Evaluating skill-gap baseline against target role...'), 450);
    setTimeout(() => setLoadingPhase('Synthesizing 3-level adaptive roadmap modules...'), 900);
    setTimeout(() => setLoadingPhase('Personalization complete! Launching active journey...'), 1400);

    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          currentRole,
          yearsOfExperience,
          targetRole,
          experienceLevel,
          currentSkills,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to complete onboarding');
      }

      const data = await res.json();

      // Small delay to let the animation finish gracefully
      setTimeout(() => {
        router.push(data.redirectUrl || '/journeys/active');
      }, 1600);
    } catch (err: any) {
      setIsGenerating(false);
      setErrorMessage(err.message || 'An error occurred. Please try again.');
    }
  };

  const activeRoleConfig = TARGET_ROLES.find((r) => r.id === targetRole) || TARGET_ROLES[0];

  return (
    <div
      className={`min-h-screen transition-colors duration-200 p-4 sm:p-6 md:p-12 relative overflow-hidden ${
        isBright
          ? 'bg-[#FAF4EE] text-[#1C1917] bg-retro-dense-grid selection:bg-orange-500 selection:text-white'
          : 'bg-[#080604] text-[#fff7ed] bg-retro-dense-grid selection:bg-orange-600 selection:text-white'
      }`}
    >
      {/* Radiant Orange & Amber Ambient Glow Orbs */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 blur-[130px] pointer-events-none -z-10 transition-opacity duration-300 ${
          isBright
            ? 'bg-gradient-to-b from-orange-500/25 via-amber-400/15 to-transparent'
            : 'bg-gradient-to-b from-orange-600/20 via-amber-600/10 to-transparent'
        }`}
      />
      <div
        className={`absolute top-1/4 -left-32 w-80 h-80 rounded-full blur-[100px] pointer-events-none -z-10 ${
          isBright ? 'bg-orange-400/20' : 'bg-orange-600/15'
        }`}
      />
      <div
        className={`absolute bottom-1/4 -right-32 w-80 h-80 rounded-full blur-[100px] pointer-events-none -z-10 ${
          isBright ? 'bg-amber-300/20' : 'bg-amber-500/15'
        }`}
      />

      {/* Loading Overlay Transition */}
      {isGenerating && (
        <div
          className={`fixed inset-0 z-50 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300 ${
            isBright ? 'bg-[#FAF4EE]/90' : 'bg-[#080604]/90'
          }`}
        >
          <div
            className={`max-w-md w-full p-8 rounded-3xl border shadow-2xl space-y-6 ${
              isBright
                ? 'bg-white/95 border-[#E5D7C8] shadow-orange-950/10'
                : 'bg-[#120b06]/95 border-orange-500/40 shadow-2xl shadow-orange-950/50'
            }`}
          >
            {/* Animated Concentric Rings Spinner */}
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-orange-500/25 animate-ping" />
              <div className="w-full h-full rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />
              <div className="absolute inset-2 rounded-full border-4 border-amber-400 border-b-transparent animate-spin duration-700" />
              <div className="absolute inset-0 flex items-center justify-center text-2xl">🧠</div>
            </div>

            <div className="space-y-2">
              <h3
                className={`text-xl font-extrabold tracking-tight ${
                  isBright ? 'text-[#1C1917]' : 'text-white'
                }`}
              >
                Running Personalization Engine
              </h3>
              <p className="text-xs font-mono animate-pulse min-h-[20px] text-amber-500 font-semibold">
                {loadingPhase}
              </p>
            </div>

            {/* Progress Bars Indicator */}
            <div className="space-y-2 pt-2">
              <div
                className={`w-full h-2 rounded-full overflow-hidden ${
                  isBright ? 'bg-[#EADAC9]' : 'bg-[#20140c]'
                }`}
              >
                <div className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 animate-[pulse_1s_ease-in-out_infinite] w-full" />
              </div>
              <div
                className={`flex justify-between text-[10px] font-mono ${
                  isBright ? 'text-[#78716C]' : 'text-zinc-400'
                }`}
              >
                <span>Classify Level</span>
                <span>Map Skill Gaps</span>
                <span>Build 3-Level Roadmap</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation / Header */}
        <div
          className={`flex items-center justify-between border-b pb-4 ${
            isBright ? 'border-[#E5D7C8]' : 'border-orange-950/70'
          }`}
        >
          <div className="flex items-center gap-3.5">
            <Link href="/" className="flex items-center select-none group py-0.5">
              <Image
                src="/images/mentora-logo.png"
                alt="Mentora Logo"
                width={120}
                height={48}
                className="h-7 sm:h-8 w-auto object-contain select-none transition-transform group-hover:scale-105 drop-shadow-[0_2px_10px_rgba(255,107,53,0.35)]"
              />
            </Link>
            <span className={`text-xs ${isBright ? 'text-[#D5C7B8]' : 'text-orange-950'}`}>/</span>
            <Link
              href="/"
              className={`text-xs font-semibold font-mono flex items-center gap-1.5 transition-colors ${
                isBright
                  ? 'text-[#57534E] hover:text-[#EA580C]'
                  : 'text-zinc-400 hover:text-orange-400'
              }`}
            >
              <span>←</span>
              <span>Exit to Home</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Step badge */}
            <span
              className={`text-[11px] font-mono font-bold px-3 py-1 rounded-full border ${
                isBright
                  ? 'bg-[#F2E8DE] border-[#E5D7C8] text-[#EA580C]'
                  : 'bg-orange-950/60 border-orange-900/50 text-orange-300'
              }`}
            >
              STEP {currentStep} OF 4
            </span>

            {/* Theme toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-all text-xs cursor-pointer ${
                isBright
                  ? 'bg-white hover:bg-[#F2E8DE] border-[#E5D7C8] text-[#57534E]'
                  : 'bg-[#140e09] hover:bg-[#1c130d] border-orange-900/50 text-zinc-300'
              }`}
              title={isBright ? 'Switch to Dark Mode' : 'Switch to Bright Mode'}
            >
              {isBright ? '🌙' : '☀️'}
            </button>
          </div>
        </div>

        {/* Step-Indicator Bar (Personal Info -> Target Role -> Current Skills -> Review) */}
        <div className="space-y-3">
          <div className="grid grid-cols-4 gap-2 sm:gap-4 relative">
            {STEPS.map((step) => {
              const isCompleted = currentStep > step.id;
              const isActive = currentStep === step.id;

              return (
                <button
                  key={step.id}
                  type="button"
                  disabled={step.id > currentStep}
                  onClick={() => setCurrentStep(step.id)}
                  className={`text-left p-3 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
                    isActive
                      ? isBright
                        ? 'bg-white border-2 border-[#EA580C] shadow-lg shadow-orange-500/15 text-[#1C1917]'
                        : 'bg-orange-950/60 border-2 border-orange-500 shadow-lg shadow-orange-950/60 text-white'
                      : isCompleted
                      ? isBright
                        ? 'bg-[#F2E8DE]/80 border-emerald-600/40 text-[#44403C] hover:border-emerald-600'
                        : 'bg-[#120b06]/80 border-emerald-500/40 text-zinc-300 hover:border-emerald-500'
                      : isBright
                      ? 'bg-[#F2E8DE]/40 border-[#E5D7C8] text-stone-400 opacity-60 cursor-not-allowed'
                      : 'bg-[#0f0a06]/40 border-orange-950/40 text-zinc-600 opacity-60 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 font-mono ${
                        isActive
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/30'
                          : isCompleted
                          ? 'bg-emerald-500 text-black font-bold'
                          : isBright
                          ? 'bg-[#E5D7C8] text-stone-500'
                          : 'bg-[#1c130d] text-zinc-500'
                      }`}
                    >
                      {isCompleted ? '✓' : step.id}
                    </span>
                    <span className="hidden sm:inline text-xs font-bold font-mono truncate">
                      {step.label}
                    </span>
                  </div>
                  <div className="sm:hidden text-[11px] font-semibold mt-1 truncate font-mono">
                    {step.label}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Completion Progress Line */}
          <div
            className={`w-full h-1.5 rounded-full overflow-hidden ${
              isBright ? 'bg-[#E5D7C8]' : 'bg-[#1c130d]'
            }`}
          >
            <div
              className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center justify-between">
            <span>{errorMessage}</span>
            <button onClick={() => setErrorMessage(null)} className="text-white ml-3 hover:opacity-80">✕</button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 1: Personal Info & Target Role Selector */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Step Header */}
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500">
                Step 01 // Baseline & Ambition
              </span>
              <h2
                className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                  isBright ? 'text-[#1C1917]' : 'text-white'
                }`}
              >
                Tell us about yourself and your{' '}
                <span
                  className={`bg-clip-text text-transparent ${
                    isBright
                      ? 'bg-gradient-to-r from-[#EA580C] via-orange-600 to-[#C2410C]'
                      : 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400'
                  }`}
                >
                  ambition
                </span>
              </h2>
              <p className={`text-xs sm:text-sm ${isBright ? 'text-[#57534E]' : 'text-zinc-400'}`}>
                Select your target career destination and provide your current baseline for accurate gap prediction.
              </p>
            </div>

            {/* Personal Info Inputs */}
            <div
              className={`p-6 rounded-2xl border grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs transition-colors ${
                isBright
                  ? 'bg-white/80 border-[#E5D7C8] shadow-xs'
                  : 'bg-[#120b06]/80 border-orange-950/60 shadow-lg shadow-black/40'
              }`}
            >
              <div className="space-y-1.5">
                <label className={`font-semibold font-mono block ${isBright ? 'text-[#44403C]' : 'text-zinc-300'}`}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className={`w-full px-4 py-3 rounded-xl border text-xs font-mono transition-all outline-none ${
                    isBright
                      ? 'bg-[#FAF4EE] border-[#E5D7C8] text-[#1C1917] placeholder-[#A8A29E] focus:border-orange-500 focus:bg-white focus:ring-1 focus:ring-orange-500/30'
                      : 'bg-[#0a0604] border-orange-900/50 text-white placeholder-zinc-500 focus:border-orange-500 focus:bg-black focus:ring-1 focus:ring-orange-500/30'
                  }`}
                />
              </div>
              <div className="space-y-1.5">
                <label className={`font-semibold font-mono block ${isBright ? 'text-[#44403C]' : 'text-zinc-300'}`}>
                  Current Job Title
                </label>
                <input
                  type="text"
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  placeholder="e.g. Software Developer"
                  className={`w-full px-4 py-3 rounded-xl border text-xs font-mono transition-all outline-none ${
                    isBright
                      ? 'bg-[#FAF4EE] border-[#E5D7C8] text-[#1C1917] placeholder-[#A8A29E] focus:border-orange-500 focus:bg-white focus:ring-1 focus:ring-orange-500/30'
                      : 'bg-[#0a0604] border-orange-900/50 text-white placeholder-zinc-500 focus:border-orange-500 focus:bg-black focus:ring-1 focus:ring-orange-500/30'
                  }`}
                />
              </div>
            </div>

            {/* Target Role Selector */}
            <div className="space-y-3">
              <label
                className={`text-xs font-bold uppercase tracking-wider font-mono block ${
                  isBright ? 'text-[#44403C]' : 'text-zinc-300'
                }`}
              >
                Select Your Target Role
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {TARGET_ROLES.map((role) => {
                  const isSelected = targetRole === role.id;

                  return (
                    <div
                      key={role.id}
                      onClick={() => setTargetRole(role.id)}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? isBright
                            ? 'bg-orange-50/90 border-2 border-orange-500 shadow-xl shadow-orange-500/10 ring-1 ring-orange-400/50 scale-[1.01]'
                            : 'bg-orange-950/50 border-2 border-orange-500 shadow-xl shadow-orange-950/60 ring-1 ring-orange-500/40 scale-[1.01]'
                          : isBright
                          ? 'bg-white/70 border-[#E5D7C8] hover:border-orange-300 hover:bg-white'
                          : 'bg-[#120b06]/70 border-orange-950/60 hover:border-orange-900 hover:bg-[#180f08]'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">{role.icon}</span>
                          <span
                            className={`text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full border ${
                              isBright
                                ? 'bg-[#F2E8DE] text-[#EA580C] border-[#E5D7C8]'
                                : 'bg-[#1c130d] text-orange-300 border-orange-900/40'
                            }`}
                          >
                            {role.badge}
                          </span>
                        </div>
                        <h3
                          className={`text-base font-bold transition-colors ${
                            isBright ? 'text-[#1C1917]' : 'text-white'
                          }`}
                        >
                          {role.title}
                        </h3>
                        <p className={`text-xs leading-relaxed ${isBright ? 'text-[#57534E]' : 'text-zinc-400'}`}>
                          {role.description}
                        </p>
                      </div>

                      <div className="pt-2 flex items-center justify-between text-[11px] font-mono">
                        <span className={isBright ? 'text-stone-400' : 'text-zinc-500'}>Core Track</span>
                        {isSelected ? (
                          <span className={`font-bold flex items-center gap-1 ${isBright ? 'text-[#EA580C]' : 'text-orange-400'}`}>
                            <span>✓ Selected</span>
                          </span>
                        ) : (
                          <span className={isBright ? 'text-stone-400 hover:text-[#EA580C]' : 'text-zinc-500 hover:text-orange-300'}>
                            Select →
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs uppercase tracking-wider font-mono shadow-lg shadow-orange-500/25 active:scale-95 transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>Continue to Experience Level</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: Experience Level (Slider & Radio Chips) */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Step Header */}
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500">
                Step 02 // Calibrate Experience
              </span>
              <h2
                className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                  isBright ? 'text-[#1C1917]' : 'text-white'
                }`}
              >
                How much experience do you bring?
              </h2>
              <p className={`text-xs sm:text-sm ${isBright ? 'text-[#57534E]' : 'text-zinc-400'}`}>
                Your experience level determines initial level unlocks (Level 1 Foundations vs immediate Level 2 Core Practice).
              </p>
            </div>

            {/* Experience Level Radio Chips */}
            <div className="space-y-3">
              <label
                className={`text-xs font-bold uppercase tracking-wider font-mono block ${
                  isBright ? 'text-[#44403C]' : 'text-zinc-300'
                }`}
              >
                Experience Tier
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    level: 'beginner' as const,
                    icon: '🌱',
                    title: 'Beginner',
                    subtitle: '0–2 Years in Domain',
                    desc: 'Build foundational paradigms. Level 1 unlocked first with guided step-by-step progressions.',
                  },
                  {
                    level: 'intermediate' as const,
                    icon: '⚡',
                    title: 'Intermediate',
                    subtitle: '2–5 Years in Domain',
                    desc: 'Skips elementary concepts. Levels 1 & 2 accessible immediately for hands-on application.',
                  },
                  {
                    level: 'advanced' as const,
                    icon: '🏆',
                    title: 'Advanced',
                    subtitle: '5+ Years in Domain',
                    desc: 'Accelerated track. Architectural scale, PEFT, agent orchestration, and deep technical design.',
                  },
                ].map((tier) => {
                  const isSelected = experienceLevel === tier.level;

                  return (
                    <button
                      key={tier.level}
                      type="button"
                      onClick={() => setExperienceLevel(tier.level)}
                      className={`text-left p-5 rounded-2xl border transition-all space-y-3 cursor-pointer ${
                        isSelected
                          ? isBright
                            ? 'bg-orange-50/90 border-2 border-orange-500 shadow-xl shadow-orange-500/10 ring-1 ring-orange-400/50'
                            : 'bg-orange-950/50 border-2 border-orange-500 shadow-xl shadow-orange-950/60 ring-1 ring-orange-500/40'
                          : isBright
                          ? 'bg-white/70 border-[#E5D7C8] hover:border-orange-300'
                          : 'bg-[#120b06]/70 border-orange-950/60 hover:border-orange-900'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{tier.icon}</span>
                        {isSelected && (
                          <span
                            className={`text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full border ${
                              isBright
                                ? 'bg-orange-100 text-[#EA580C] border-orange-300'
                                : 'bg-orange-950 text-orange-300 border-orange-800'
                            }`}
                          >
                            Active
                          </span>
                        )}
                      </div>
                      <div>
                        <h4
                          className={`text-base font-bold transition-colors ${
                            isBright ? 'text-[#1C1917]' : 'text-white'
                          }`}
                        >
                          {tier.title}
                        </h4>
                        <span className="text-[11px] text-amber-500 font-mono font-medium block">
                          {tier.subtitle}
                        </span>
                      </div>
                      <p className={`text-xs leading-relaxed ${isBright ? 'text-[#57534E]' : 'text-zinc-400'}`}>
                        {tier.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Experience Level Interactive Slider */}
            <div
              className={`p-6 rounded-2xl border space-y-4 transition-colors ${
                isBright
                  ? 'bg-white/80 border-[#E5D7C8]'
                  : 'bg-[#120b06]/80 border-orange-950/60'
              }`}
            >
              <div className="flex items-center justify-between">
                <label
                  className={`text-xs font-bold uppercase tracking-wider font-mono ${
                    isBright ? 'text-[#44403C]' : 'text-zinc-300'
                  }`}
                >
                  Experience Slider
                </label>
                <span
                  className={`text-xs font-mono font-bold capitalize px-3 py-1 rounded-full border ${
                    isBright
                      ? 'text-[#EA580C] bg-orange-100/70 border-orange-300'
                      : 'text-amber-400 bg-orange-950/80 border-orange-800/60'
                  }`}
                >
                  {experienceLevel} Tier
                </span>
              </div>

              <input
                type="range"
                min="1"
                max="3"
                step="1"
                value={getSliderValue()}
                onChange={handleSliderChange}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-orange-500 bg-orange-950/40"
              />

              <div
                className={`flex justify-between text-xs font-mono font-medium ${
                  isBright ? 'text-[#78716C]' : 'text-zinc-400'
                }`}
              >
                <span>1: Beginner (0-2y)</span>
                <span>2: Intermediate (2-5y)</span>
                <span>3: Advanced (5y+)</span>
              </div>
            </div>

            {/* Years of Experience Numeric Input */}
            <div
              className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs transition-colors ${
                isBright
                  ? 'bg-white/60 border-[#E5D7C8]'
                  : 'bg-[#120b06]/50 border-orange-950/50'
              }`}
            >
              <div>
                <span className={`font-bold block ${isBright ? 'text-[#1C1917]' : 'text-zinc-200'}`}>
                  Exact Years of Relevant Experience
                </span>
                <span className={`text-[11px] ${isBright ? 'text-[#78716C]' : 'text-zinc-400'}`}>
                  Used by the engine for fine-grained pacing
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className={`w-24 px-3 py-2 rounded-xl border text-center font-bold font-mono text-xs outline-none transition-all ${
                    isBright
                      ? 'bg-[#FAF4EE] border-[#E5D7C8] text-[#1C1917] focus:border-orange-500'
                      : 'bg-[#0a0604] border-orange-900/60 text-white focus:border-orange-500'
                  }`}
                />
                <span className={`font-mono ${isBright ? 'text-[#78716C]' : 'text-zinc-400'}`}>Years</span>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className={`px-6 py-3 rounded-xl border text-xs font-semibold font-mono transition-all cursor-pointer ${
                  isBright
                    ? 'bg-white hover:bg-[#F2E8DE] border-[#E5D7C8] text-[#57534E]'
                    : 'bg-[#140e09] hover:bg-[#1c130d] border-orange-900/60 text-zinc-300'
                }`}
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs uppercase tracking-wider font-mono shadow-lg shadow-orange-500/25 active:scale-95 transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>Continue to Current Skills</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: Current Skills Tag Selector */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Step Header */}
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500">
                Step 03 // Competency Filter
              </span>
              <h2
                className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                  isBright ? 'text-[#1C1917]' : 'text-white'
                }`}
              >
                Select the skills you already possess
              </h2>
              <p className={`text-xs sm:text-sm ${isBright ? 'text-[#57534E]' : 'text-zinc-400'}`}>
                Toggle skills on or off. Our gap prediction algorithm filters these out so you only learn what you truly need.
              </p>
            </div>

            {/* Live Count & Target Role Context */}
            <div
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors ${
                isBright
                  ? 'bg-white/80 border-[#E5D7C8]'
                  : 'bg-[#120b06]/80 border-orange-950/60'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`font-mono ${isBright ? 'text-[#EA580C]' : 'text-orange-400'}`}>
                  Target Role:
                </span>
                <span className={`font-bold ${isBright ? 'text-[#1C1917]' : 'text-white'}`}>
                  {activeRoleConfig.title}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={isBright ? 'text-[#78716C]' : 'text-zinc-400'}>Selected Skills:</span>
                <span className="font-bold text-emerald-400 font-mono bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-700/60">
                  {currentSkills.length} Selected
                </span>
              </div>
            </div>

            {/* Skills Tag Selector Grid */}
            <div className="space-y-3">
              <label
                className={`text-xs font-bold uppercase tracking-wider font-mono block ${
                  isBright ? 'text-[#44403C]' : 'text-zinc-300'
                }`}
              >
                Tap to Toggle Your Acquired Skills
              </label>
              <div className="flex flex-wrap gap-2.5">
                {SUGGESTED_SKILLS.map((skill) => {
                  const isSelected = currentSkills.includes(skill);

                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all flex items-center gap-2 active:scale-95 cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border border-orange-400 shadow-md shadow-orange-500/25 scale-[1.02]'
                          : isBright
                          ? 'bg-white border border-[#E5D7C8] text-[#57534E] hover:border-orange-400 hover:text-[#EA580C]'
                          : 'bg-[#120b06] border border-orange-950/60 text-zinc-300 hover:border-orange-700 hover:text-white'
                      }`}
                    >
                      <span className={isSelected ? 'font-bold' : 'text-orange-500'}>
                        {isSelected ? '✓' : '+'}
                      </span>
                      <span>{skill}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add Custom Skill Bar */}
            <div
              className={`p-5 rounded-2xl border space-y-2 text-xs transition-colors ${
                isBright
                  ? 'bg-white/70 border-[#E5D7C8]'
                  : 'bg-[#120b06]/60 border-orange-950/60'
              }`}
            >
              <label className={`font-bold block ${isBright ? 'text-[#44403C]' : 'text-zinc-300'}`}>
                Have a specific skill not listed above?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomSkill();
                    }
                  }}
                  placeholder="e.g. LangGraph, Ray, vLLM, Triton..."
                  className={`flex-1 px-4 py-2.5 rounded-xl border text-xs font-mono outline-none transition-all ${
                    isBright
                      ? 'bg-[#FAF4EE] border-[#E5D7C8] text-[#1C1917] placeholder-[#A8A29E] focus:border-orange-500'
                      : 'bg-[#0a0604] border-orange-900/60 text-white placeholder-zinc-500 focus:border-orange-500'
                  }`}
                />
                <button
                  type="button"
                  onClick={addCustomSkill}
                  className={`px-5 py-2.5 rounded-xl font-mono font-bold text-xs transition-all shrink-0 cursor-pointer ${
                    isBright
                      ? 'bg-[#EA580C] hover:bg-[#C2410C] text-white shadow-sm'
                      : 'bg-orange-600 hover:bg-orange-500 text-white shadow-md shadow-orange-950/50'
                  }`}
                >
                  Add Skill +
                </button>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className={`px-6 py-3 rounded-xl border text-xs font-semibold font-mono transition-all cursor-pointer ${
                  isBright
                    ? 'bg-white hover:bg-[#F2E8DE] border-[#E5D7C8] text-[#57534E]'
                    : 'bg-[#140e09] hover:bg-[#1c130d] border-orange-900/60 text-zinc-300'
                }`}
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs uppercase tracking-wider font-mono shadow-lg shadow-orange-500/25 active:scale-95 transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>Continue to Review</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: Review & Final Synthesis */}
        {/* ========================================================================= */}
        {currentStep === 4 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Step Header */}
            <div className="space-y-1.5">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500">
                Step 04 // Blueprint Verification
              </span>
              <h2
                className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
                  isBright ? 'text-[#1C1917]' : 'text-white'
                }`}
              >
                Review your personalized profile
              </h2>
              <p className={`text-xs sm:text-sm ${isBright ? 'text-[#57534E]' : 'text-zinc-400'}`}>
                Confirm your parameters below. Once submitted, our personalization engine will synthesize your 3-level roadmap.
              </p>
            </div>

            {/* Review Cards Grid */}
            <div className="space-y-4">
              {/* Profile Card */}
              <div
                className={`p-6 rounded-2xl border space-y-4 transition-colors ${
                  isBright
                    ? 'bg-white/80 border-[#E5D7C8]'
                    : 'bg-[#120b06]/80 border-orange-950/60'
                }`}
              >
                <div
                  className={`flex items-center justify-between border-b pb-3 ${
                    isBright ? 'border-[#E5D7C8]' : 'border-orange-950/60'
                  }`}
                >
                  <span
                    className={`text-xs font-bold uppercase tracking-wider font-mono ${
                      isBright ? 'text-[#78716C]' : 'text-zinc-400'
                    }`}
                  >
                    Learner Baseline
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs text-amber-500 hover:text-amber-400 hover:underline font-bold font-mono cursor-pointer"
                  >
                    Edit ✎
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                  <div>
                    <span className={isBright ? 'text-[#78716C] block' : 'text-zinc-400 block'}>Name</span>
                    <span className={`font-bold mt-0.5 block text-sm ${isBright ? 'text-[#1C1917]' : 'text-white'}`}>
                      {fullName}
                    </span>
                  </div>
                  <div>
                    <span className={isBright ? 'text-[#78716C] block' : 'text-zinc-400 block'}>Current Title</span>
                    <span className={`font-bold mt-0.5 block text-sm ${isBright ? 'text-[#1C1917]' : 'text-white'}`}>
                      {currentRole}
                    </span>
                  </div>
                  <div>
                    <span className={isBright ? 'text-[#78716C] block' : 'text-zinc-400 block'}>Experience</span>
                    <span className={`font-bold mt-0.5 block text-sm ${isBright ? 'text-[#1C1917]' : 'text-white'}`}>
                      {yearsOfExperience} Years
                    </span>
                  </div>
                </div>
              </div>

              {/* Target Role & Level Card */}
              <div
                className={`p-6 rounded-2xl border space-y-4 transition-colors ${
                  isBright
                    ? 'bg-white/80 border-[#E5D7C8]'
                    : 'bg-[#120b06]/80 border-orange-950/60'
                }`}
              >
                <div
                  className={`flex items-center justify-between border-b pb-3 ${
                    isBright ? 'border-[#E5D7C8]' : 'border-orange-950/60'
                  }`}
                >
                  <span
                    className={`text-xs font-bold uppercase tracking-wider font-mono ${
                      isBright ? 'text-[#78716C]' : 'text-zinc-400'
                    }`}
                  >
                    Target Role & Level
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-xs text-amber-500 hover:text-amber-400 hover:underline font-bold font-mono cursor-pointer"
                  >
                    Edit ✎
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl border flex items-center justify-center text-2xl shrink-0 ${
                      isBright
                        ? 'bg-[#F2E8DE] border-[#E5D7C8]'
                        : 'bg-[#1c130d] border-orange-900/60'
                    }`}
                  >
                    {activeRoleConfig.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`text-base font-bold ${isBright ? 'text-[#1C1917]' : 'text-white'}`}>
                        {activeRoleConfig.title}
                      </h3>
                      <span
                        className={`text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full border uppercase ${
                          isBright
                            ? 'bg-orange-100 text-[#EA580C] border-orange-300'
                            : 'bg-orange-950/80 text-orange-300 border-orange-800'
                        }`}
                      >
                        {experienceLevel}
                      </span>
                    </div>
                    <p className={`text-xs mt-1 ${isBright ? 'text-[#57534E]' : 'text-zinc-400'}`}>
                      {activeRoleConfig.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Selected Skills Card */}
              <div
                className={`p-6 rounded-2xl border space-y-4 transition-colors ${
                  isBright
                    ? 'bg-white/80 border-[#E5D7C8]'
                    : 'bg-[#120b06]/80 border-orange-950/60'
                }`}
              >
                <div
                  className={`flex items-center justify-between border-b pb-3 ${
                    isBright ? 'border-[#E5D7C8]' : 'border-orange-950/60'
                  }`}
                >
                  <span
                    className={`text-xs font-bold uppercase tracking-wider font-mono ${
                      isBright ? 'text-[#78716C]' : 'text-zinc-400'
                    }`}
                  >
                    Marked As Known ({currentSkills.length})
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="text-xs text-amber-500 hover:text-amber-400 hover:underline font-bold font-mono cursor-pointer"
                  >
                    Edit ✎
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentSkills.map((s) => (
                    <span
                      key={s}
                      className={`px-3 py-1 rounded-xl text-xs font-mono font-medium border ${
                        isBright
                          ? 'bg-[#F2E8DE] text-[#44403C] border-[#E5D7C8]'
                          : 'bg-[#1c130d] text-zinc-300 border-orange-900/50'
                      }`}
                    >
                      ✓ {s}
                    </span>
                  ))}
                  {currentSkills.length === 0 && (
                    <span className="text-xs text-amber-500 italic font-mono">
                      No skills selected. All role skills will be sequenced in your journey.
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation & Final Submit */}
            <div
              className={`flex items-center justify-between pt-4 border-t ${
                isBright ? 'border-[#E5D7C8]' : 'border-orange-950/60'
              }`}
            >
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className={`px-6 py-3 rounded-xl border text-xs font-semibold font-mono transition-all cursor-pointer ${
                  isBright
                    ? 'bg-white hover:bg-[#F2E8DE] border-[#E5D7C8] text-[#57534E]'
                    : 'bg-[#140e09] hover:bg-[#1c130d] border-orange-900/60 text-zinc-300'
                }`}
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm uppercase tracking-wider font-mono shadow-xl shadow-orange-500/30 active:scale-95 transition-all flex items-center gap-2.5 cursor-pointer"
              >
                <span>Build My Personalized Journey</span>
                <span>🚀</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
