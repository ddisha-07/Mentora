'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white p-4 sm:p-6 md:p-12 selection:bg-indigo-500 selection:text-white relative">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Loading Overlay Transition */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
          <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900/90 border border-indigo-500/40 shadow-2xl shadow-indigo-950/50 space-y-6">
            {/* Animated Neural Spinner */}
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-ping" />
              <div className="w-full h-full rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
              <div className="absolute inset-2 rounded-full border-4 border-purple-500 border-b-transparent animate-spin duration-700" />
              <div className="absolute inset-0 flex items-center justify-center text-xl">🧠</div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-extrabold text-white tracking-tight">
                Running Personalization Engine
              </h3>
              <p className="text-xs text-indigo-300 font-mono animate-pulse min-h-[20px]">
                {loadingPhase}
              </p>
            </div>

            {/* Progress Bars Indicator */}
            <div className="space-y-1.5 pt-2">
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-[pulse_1s_ease-in-out_infinite] w-full" />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Classify Level</span>
                <span>Map Gaps</span>
                <span>Build 3-Level Roadmap</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation / Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <Link
            href="/"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors"
          >
            ← Exit to Home
          </Link>
          <span className="text-xs text-slate-400 font-mono">
            STEP {currentStep} OF 4
          </span>
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
                  className={`text-left p-3 sm:p-4 rounded-2xl border transition-all ${
                    isActive
                      ? 'bg-indigo-950/70 border-indigo-500/80 shadow-lg shadow-indigo-950/40 text-white'
                      : isCompleted
                      ? 'bg-slate-900/80 border-emerald-500/40 text-slate-300 hover:border-slate-700'
                      : 'bg-slate-950/40 border-slate-850 text-slate-500 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        isActive
                          ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/40'
                          : isCompleted
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isCompleted ? '✓' : step.id}
                    </span>
                    <span className="hidden sm:inline text-xs font-bold truncate">
                      {step.label}
                    </span>
                  </div>
                  <div className="sm:hidden text-[11px] font-semibold mt-1 truncate">
                    {step.label}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Thin Completion Progress Line */}
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center justify-between">
            <span>{errorMessage}</span>
            <button onClick={() => setErrorMessage(null)} className="text-white ml-3">✕</button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 1: Personal Info & Target Role Selector (Cards with Icons) */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Step Header */}
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
                Step 1: Baseline & Target Role
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Tell us about yourself and your ambition
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Select your target career destination and provide your current baseline for accurate gap prediction.
              </p>
            </div>

            {/* Personal Info Inputs */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold block">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold block">Current Job Title</label>
                <input
                  type="text"
                  value={currentRole}
                  onChange={(e) => setCurrentRole(e.target.value)}
                  placeholder="e.g. Software Developer"
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>
            </div>

            {/* Target Role Selector (Cards with Icons) */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
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
                          ? 'bg-indigo-950/60 border-2 border-indigo-400 shadow-xl shadow-indigo-950/40 ring-1 ring-indigo-400/50 scale-[1.01]'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl">{role.icon}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-indigo-300 border border-slate-700">
                            {role.badge}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white">{role.title}</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">{role.description}</p>
                      </div>

                      <div className="pt-2 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Core Track</span>
                        {isSelected ? (
                          <span className="text-indigo-300 font-bold flex items-center gap-1">
                            <span>✓ Selected</span>
                          </span>
                        ) : (
                          <span className="text-slate-500 hover:text-white">Select →</span>
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
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>Continue to Experience Level</span>
                <span>→</span>
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
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
                Step 2: Experience Level
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                How much experience do you bring?
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Your experience level determines initial level unlocks (Level 1 Foundations vs immediate Level 2 Core Practice).
              </p>
            </div>

            {/* Experience Level Radio Chips */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
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
                      className={`text-left p-5 rounded-2xl border transition-all space-y-3 ${
                        isSelected
                          ? 'bg-indigo-950/70 border-2 border-indigo-400 shadow-xl shadow-indigo-950/40 ring-1 ring-indigo-400/50'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{tier.icon}</span>
                        {isSelected && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-900 text-indigo-300 border border-indigo-700">
                            Active
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white">{tier.title}</h4>
                        <span className="text-[11px] text-indigo-400 font-mono font-medium block">
                          {tier.subtitle}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{tier.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Experience Level Interactive Slider */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Experience Slider
                </label>
                <span className="text-xs font-mono font-bold capitalize text-indigo-400 bg-indigo-950/80 px-2.5 py-0.5 rounded border border-indigo-800">
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
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />

              <div className="flex justify-between text-xs text-slate-400 font-medium">
                <span>1: Beginner (0-2y)</span>
                <span>2: Intermediate (2-5y)</span>
                <span>3: Advanced (5y+)</span>
              </div>
            </div>

            {/* Years of Experience Numeric Input */}
            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
              <div>
                <span className="text-slate-200 font-bold block">Exact Years of Relevant Experience</span>
                <span className="text-slate-400 text-[11px]">Used by the engine for fine-grained pacing</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={yearsOfExperience}
                  onChange={(e) => setYearsOfExperience(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-24 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-center text-white font-bold focus:outline-none focus:border-indigo-500"
                />
                <span className="text-slate-400">Years</span>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>Continue to Current Skills</span>
                <span>→</span>
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
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
                Step 3: Current Competencies
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Select the skills you already possess
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Toggle skills on or off. Our gap prediction algorithm filters these out so you only learn what you truly need.
              </p>
            </div>

            {/* Live Count & Target Role Context */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-indigo-400">Target Role:</span>
                <span className="font-bold text-white">{activeRoleConfig.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Selected Skills:</span>
                <span className="font-bold text-emerald-400 font-mono bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  {currentSkills.length} Selected
                </span>
              </div>
            </div>

            {/* Skills Tag Selector Grid */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
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
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 active:scale-95 ${
                        isSelected
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border border-indigo-400 shadow-md shadow-indigo-600/30'
                          : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <span>{isSelected ? '✓' : '+'}</span>
                      <span>{skill}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Add Custom Skill Bar */}
            <div className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2 text-xs">
              <label className="font-bold text-slate-300 block">Have a specific skill not listed above?</label>
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
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-xs"
                />
                <button
                  type="button"
                  onClick={addCustomSkill}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-colors shrink-0"
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
                className="px-5 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 active:scale-95 transition-all flex items-center gap-2"
              >
                <span>Continue to Review</span>
                <span>→</span>
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
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
                Step 4: Summary & Synthesis
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Review your personalized profile
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Confirm your parameters below. Once submitted, our personalization engine will synthesize your 3-level roadmap.
              </p>
            </div>

            {/* Review Cards Grid */}
            <div className="space-y-4">
              {/* Profile Card */}
              <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Learner Baseline</span>
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="text-xs text-indigo-400 hover:underline font-semibold"
                  >
                    Edit
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block">Name</span>
                    <span className="text-white font-bold mt-0.5 block">{fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Current Title</span>
                    <span className="text-white font-bold mt-0.5 block">{currentRole}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Experience</span>
                    <span className="text-white font-bold mt-0.5 block">{yearsOfExperience} Years</span>
                  </div>
                </div>
              </div>

              {/* Target Role & Level Card */}
              <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Role & Level</span>
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="text-xs text-indigo-400 hover:underline font-semibold"
                  >
                    Edit
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-2xl shrink-0">
                    {activeRoleConfig.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white">{activeRoleConfig.title}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                        {experienceLevel.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{activeRoleConfig.description}</p>
                  </div>
                </div>
              </div>

              {/* Selected Skills Card */}
              <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Marked As Known ({currentSkills.length})
                  </span>
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="text-xs text-indigo-400 hover:underline font-semibold"
                  >
                    Edit
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentSkills.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700"
                    >
                      ✓ {s}
                    </span>
                  ))}
                  {currentSkills.length === 0 && (
                    <span className="text-xs text-slate-500 italic">No skills selected. All role skills will be sequenced.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation & Final Submit */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2.5 rounded-xl border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-400 hover:to-pink-400 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 active:scale-95 transition-all flex items-center gap-2"
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
