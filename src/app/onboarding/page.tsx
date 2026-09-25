'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';

import {
  CAREER_ROLES_DATASET,
  ALL_DATASET_SKILLS,
  extractSkillsFromCV,
} from '@/lib/career/careerRolesDataset';

const POPULAR_GOALS = [
  'Data Scientist',
  'UI/UX Designer',
  'Full Stack Developer',
  'Machine Learning Engineer',
  'Cloud Engineer',
  'Cybersecurity Analyst',
  'Product Manager',
  'DevOps Engineer',
  'AI Research Scientist',
  'Business Analyst',
];

export default function OnboardingPage() {
  const router = useRouter();
  const { isBright, toggleTheme } = useTheme();

  // Form State
  const [linkedinText, setLinkedinText] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillSearchQuery, setSkillSearchQuery] = useState('');
  const [futureGoal, setFutureGoal] = useState('Data Scientist');
  const [isCustomGoal, setIsCustomGoal] = useState(false);

  // UI State
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExtractingSkills, setIsExtractingSkills] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Skill extraction trigger
  const runSkillExtraction = async (text: string) => {
    if (!text.trim()) return;
    setIsExtractingSkills(true);
    // 1. Instant deterministic extraction from 50-role dataset
    const deterministic = extractSkillsFromCV(text);
    if (deterministic.length > 0) {
      setSelectedSkills((prev) => Array.from(new Set([...prev, ...deterministic])));
    }

    // 2. Background AI extraction
    try {
      const res = await fetch('/api/career/extract-skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cvText: text, linkedinText }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.skills && Array.isArray(data.skills) && data.skills.length > 0) {
          setSelectedSkills((prev) => Array.from(new Set([...prev, ...data.skills])));
        }
      }
    } catch (err) {
      console.warn('AI skill extraction notice:', err);
    } finally {
      setIsExtractingSkills(false);
    }
  };

  // Skill add & remove handlers
  const handleAddSkill = (skillName: string) => {
    const trimmed = skillName.trim();
    if (!trimmed) return;
    const formatted = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    if (!selectedSkills.some((s) => s.toLowerCase() === formatted.toLowerCase())) {
      setSelectedSkills((prev) => [...prev, formatted]);
    }
    setSkillSearchQuery('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSelectedSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  // Autocomplete suggestions filtered from dataset
  const filteredSkillSuggestions = skillSearchQuery.trim()
    ? ALL_DATASET_SKILLS.filter(
        (s) =>
          s.toLowerCase().includes(skillSearchQuery.trim().toLowerCase()) &&
          !selectedSkills.some((sel) => sel.toLowerCase() === s.toLowerCase())
      ).slice(0, 8)
    : [];

  const popularDatasetSkills = [
    'Python', 'React', 'SQL', 'Machine Learning', 'Figma', 'Docker',
    'AWS', 'Git', 'JavaScript', 'Node.js', 'Statistics', 'Cybersecurity'
  ].filter((s) => !selectedSkills.some((sel) => sel.toLowerCase() === s.toLowerCase())).slice(0, 6);

  // File reading helper
  const handleFileChange = (file: File | null) => {
    if (!file) return;

    // Validate size (e.g. 10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size exceeds 10MB limit. Please upload a smaller document.');
      return;
    }

    setCvFile(file);
    setErrorMessage(null);

    // Read text content
    const reader = new FileReader();
    if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
      reader.onload = (e) => {
        const text = (e.target?.result as string) || '';
        setCvText(text);
        runSkillExtraction(text);
      };
      reader.readAsText(file);
    } else {
      reader.onload = (e) => {
        const rawContent = e.target?.result;
        let cleaned = '';
        if (typeof rawContent === 'string') {
          cleaned = rawContent.replace(/[^\x20-\x7E\t\r\n]/g, ' ').slice(0, 15000);
          setCvText(cleaned);
        } else {
          cleaned = `[Uploaded Document: ${file.name} (${Math.round(file.size / 1024)} KB)]`;
          setCvText(cleaned);
        }
        runSkillExtraction(cleaned || file.name);
      };
      reader.readAsText(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // Load sample profile for rapid testing
  const loadSampleProfile = () => {
    setLinkedinText(
      `Alex Morgan | AI & Software Engineering Intern
About:
Passionate Computer Science student and AI Intern with experience in Python, basic AI/ML, and early exposure to Agentic AI (LangChain experiments). Looking to transition into a full AI Engineer role building production-grade autonomous systems.

Experience:
- AI Intern @ TechLab (6 months): Built proof-of-concept AI agents with OpenAI API and LangChain. Worked with Python, PyTorch basics, and REST APIs.
- Software Engineering Fellow (3 months): Developed full-stack web applications with React, TypeScript, and FastAPI.

Skills:
Python, PyTorch, LangChain, React, TypeScript, Git, Docker, REST APIs, Basic Machine Learning.`
    );
    const sampleCv = `Alex Morgan - Resume / CV Summary
Education: B.S. Computer Science (2024)
Projects:
1. Multi-Agent Research Assistant: Built using LangChain and CrewAI concepts. Implemented web search and summarization.
2. Image Classifier: Basic CNN built with PyTorch on CIFAR-10.
Certifications: Deep Learning Specialization (in progress), Python for Data Science.`;
    setCvText(sampleCv);
    setSelectedSkills(['Python', 'PyTorch', 'LangChain', 'React', 'TypeScript', 'Git', 'Docker', 'REST APIs', 'Machine Learning']);
    setFutureGoal('Data Scientist');
    setIsCustomGoal(false);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!linkedinText.trim() && !cvFile && !cvText.trim() && selectedSkills.length === 0) {
      setErrorMessage('Please provide either your LinkedIn profile details, upload a CV/resume, or select your acquired skills.');
      return;
    }

    if (!futureGoal.trim()) {
      setErrorMessage('Please specify your Future Goal / target profession.');
      return;
    }

    if (selectedSkills.length === 0) {
      setErrorMessage('Please ensure at least one skill is selected from your CV or added via the search bar.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/analyze-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          linkedinText: linkedinText.trim(),
          cvText: cvText.trim() || (cvFile ? `Uploaded CV: ${cvFile.name}` : ''),
          selectedSkills,
          possessedSkills: selectedSkills,
          fieldOfInterest: futureGoal.trim(),
          futureGoal: futureGoal.trim(),
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to analyze profile');
      }

      const result = await response.json();

      if (result.data) {
        // Persist structured analysis result for Page 3 (/dashboard)
        if (typeof window !== 'undefined') {
          localStorage.setItem('mentora_career_analysis', JSON.stringify(result.data));
        }
      }

      // Smooth brief timeout so user sees the progress animation smoothly
      setTimeout(() => {
        router.push('/dashboard');
      }, 1200);
    } catch (err: any) {
      console.error('Onboarding submission error:', err);
      setIsSubmitting(false);
      setErrorMessage(err.message || 'An error occurred during profile analysis. Please try again.');
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 p-4 sm:p-6 md:p-12 relative overflow-hidden ${
        isBright
          ? 'bg-[#FAF4EE] text-[#1C1917] selection:bg-orange-500 selection:text-white'
          : 'bg-[#080604] text-[#fff7ed] selection:bg-orange-600 selection:text-white'
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

      {/* ========================================================================= */}
      {/* 2. Loading State: "Analyzing your skills and mapping your career path..." */}
      {/* ========================================================================= */}
      {isSubmitting && (
        <div
          id="analyzing-loading-overlay"
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
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-orange-500/25 animate-ping" />
              <div className="w-full h-full rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />
              <div className="absolute inset-2 rounded-full border-4 border-amber-400 border-b-transparent animate-spin duration-700" />
              <div className="absolute inset-0 flex items-center justify-center text-3xl animate-pulse">
                🧠
              </div>
            </div>

            {/* Exactly Specified User Prompt Text */}
            <div className="space-y-2">
              <h3
                className={`text-xl sm:text-2xl font-black tracking-tight ${
                  isBright ? 'text-[#1C1917]' : 'text-white'
                }`}
              >
                Analyzing your skills and mapping your career path...
              </h3>
              <p className="text-xs font-mono text-amber-500 font-semibold animate-pulse">
                Synthesizing LinkedIn profile, CV credentials & Gemini AI recommendations
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
                <span>Extracting Skills</span>
                <span>Evaluating Gaps</span>
                <span>Personalizing Courses</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-3xl mx-auto space-y-8">
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
                priority
              />
            </Link>
            <span className={`text-xs ${isBright ? 'text-[#D5C7B8]' : 'text-orange-950'}`}>/</span>
            <span
              className={`text-xs font-mono font-bold ${
                isBright ? 'text-[#EA580C]' : 'text-orange-400'
              }`}
            >
              Career Onboarding
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={loadSampleProfile}
              className={`text-xs font-mono font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                isBright
                  ? 'bg-white hover:bg-orange-50 border-[#E5D7C8] text-[#EA580C]'
                  : 'bg-[#140e09] hover:bg-orange-950/40 border-orange-900/50 text-orange-400'
              }`}
            >
              ✦ Load Sample Profile
            </button>

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

        {/* Page Title & Intro */}
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500">
            Step 02 // Profile & Career Goals
          </span>
          <h1
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isBright ? 'text-[#1C1917]' : 'text-white'
            }`}
          >
            Map your background to your{' '}
            <span
            style={isBright ? { color: '#ffffff' } : undefined}
              className={`bg-clip-text text-transparent ${
                isBright
                  ? 'bg-gradient-to-r from-[#EA580C] via-orange-600 to-[#C2410C]'
                  : 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400'
              }`}
            >
              future career
            </span>
          </h1>
          <p className={`text-xs sm:text-sm ${isBright ? 'text-[#57534E]' : 'text-zinc-400'}`}>
            Provide your LinkedIn background and CV document. Gemini AI will evaluate your current level,
            identify prerequisite gaps, and recommend targeted course paths to bridge your career goal.
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-semibold flex items-center justify-between animate-in fade-in">
            <span>{errorMessage}</span>
            <button onClick={() => setErrorMessage(null)} className="text-white ml-3 hover:opacity-80">
              ✕
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* Onboarding Form Layout */}
        {/* ========================================================================= */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: LinkedIn Profile Details */}
          <div
            className={`p-6 rounded-3xl border space-y-3 transition-colors ${
              isBright
                ? 'bg-white/80 border-[#E5D7C8] shadow-xs'
                : 'bg-[#120b06]/80 border-orange-950/60 shadow-lg shadow-black/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <label
                htmlFor="linkedin-textarea"
                className={`text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-2 ${
                  isBright ? 'text-[#44403C]' : 'text-zinc-200'
                }`}
              >
                <span className="w-5 h-5 rounded-md bg-[#0A66C2] text-white flex items-center justify-center text-xs font-bold">
                  in
                </span>
                <span>LinkedIn Profile Details</span>
              </label>
              <span className={`text-[11px] font-mono ${isBright ? 'text-stone-400' : 'text-zinc-500'}`}>
                Paste about section, experiences & skills
              </span>
            </div>

            <textarea
              id="linkedin-textarea"
              rows={5}
              value={linkedinText}
              onChange={(e) => setLinkedinText(e.target.value)}
              placeholder="e.g. Paste your LinkedIn About summary, recent roles/internships, technologies used, and listed skills here..."
              className={`w-full p-4 rounded-2xl border text-xs font-mono leading-relaxed transition-all outline-none resize-y ${
                isBright
                  ? 'bg-[#FAF4EE] border-[#E5D7C8] text-[#1C1917] placeholder-[#A8A29E] focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20'
                  : 'bg-[#0a0604] border-orange-900/50 text-white placeholder-zinc-500 focus:border-orange-500 focus:bg-black focus:ring-2 focus:ring-orange-500/20'
              }`}
            />
          </div>

          {/* Section 2: CV / Resume Document Upload */}
          <div
            className={`p-6 rounded-3xl border space-y-3 transition-colors ${
              isBright
                ? 'bg-white/80 border-[#E5D7C8] shadow-xs'
                : 'bg-[#120b06]/80 border-orange-950/60 shadow-lg shadow-black/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <label
                className={`text-xs font-bold uppercase tracking-wider font-mono flex items-center gap-2 ${
                  isBright ? 'text-[#44403C]' : 'text-zinc-200'
                }`}
              >
                <span>📄</span>
                <span>Upload CV / Resume Document</span>
              </label>
              <span className={`text-[11px] font-mono ${isBright ? 'text-stone-400' : 'text-zinc-500'}`}>
                PDF, TXT, MD, DOCX (Up to 10MB)
              </span>
            </div>

            {/* Hidden native file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.md,.doc,.docx"
              onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
              className="hidden"
            />

            {/* Drop Zone Box */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center flex flex-col items-center justify-center gap-3 ${
                isDragging
                  ? 'border-orange-500 bg-orange-500/10 scale-[1.01]'
                  : isBright
                  ? 'border-[#E5D7C8] hover:border-orange-400 bg-[#FAF4EE]/70 hover:bg-white'
                  : 'border-orange-900/50 hover:border-orange-500 bg-[#0a0604]/80 hover:bg-black/60'
              }`}
            >
              {cvFile ? (
                <div className="flex items-center justify-between w-full max-w-md p-3 rounded-xl bg-orange-500/10 border border-orange-500/30">
                  <div className="flex items-center gap-3 truncate text-left">
                    <span className="text-2xl">📑</span>
                    <div className="truncate">
                      <p className="text-xs font-bold font-mono truncate text-orange-500">
                        {cvFile.name}
                      </p>
                      <p className={`text-[10px] font-mono ${isBright ? 'text-stone-500' : 'text-zinc-400'}`}>
                        {Math.round(cvFile.size / 1024)} KB · Ready for analysis
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCvFile(null);
                      setCvText('');
                      setSelectedSkills([]);
                    }}
                    className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 text-xs font-mono font-bold"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-xl text-orange-500">
                    ⬆️
                  </div>
                  <div>
                    <p className={`text-xs font-bold ${isBright ? 'text-[#1C1917]' : 'text-white'}`}>
                      Drag and drop your CV file here, or{' '}
                      <span className="text-[#EA580C] underline font-extrabold">browse files</span>
                    </p>
                    <p className={`text-[11px] mt-1 ${isBright ? 'text-stone-400' : 'text-zinc-500'}`}>
                      Allows Gemini to verify real experience, tools, and deeper skill context
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Section 3: Skills Extracted from CV/Resume & Future Goal */}
          <div
            className={`p-6 rounded-3xl border space-y-6 transition-colors ${
              isBright
                ? 'bg-white/80 border-[#E5D7C8] shadow-xs'
                : 'bg-[#120b06]/80 border-orange-950/60 shadow-lg shadow-black/40'
            }`}
          >
            {/* 1. Skills Selected from CV / Resume (Replacing old Field of Interest) */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <label
                      className={`text-xs font-bold uppercase tracking-wider font-mono block ${
                        isBright ? 'text-[#44403C]' : 'text-zinc-200'
                      }`}
                    >
                      Skills Extracted From CV / Resume
                    </label>
                    {isExtractingSkills && (
                      <span className="text-[10px] font-mono font-bold text-orange-500 animate-pulse flex items-center gap-1">
                        <span>⚡</span>
                        <span>Extracting AI skills...</span>
                      </span>
                    )}
                  </div>
                  <p className={`text-[11px] mt-0.5 ${isBright ? 'text-stone-500' : 'text-zinc-400'}`}>
                    AI-extracted capabilities from your document. Remove any inaccurate skills or add more via the search bar below.
                  </p>
                </div>
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20 shrink-0 self-start sm:self-auto">
                  {selectedSkills.length} {selectedSkills.length === 1 ? 'Skill' : 'Skills'} Extracted
                </span>
              </div>

              {/* Displayed Skill Chips with Delete Button */}
              <div
                className={`p-3.5 rounded-2xl border min-h-[58px] flex flex-wrap gap-2 items-center transition-all ${
                  isBright
                    ? 'bg-[#FAF4EE] border-[#E5D7C8]'
                    : 'bg-[#0a0604] border-orange-950/70'
                }`}
              >
                {selectedSkills.length === 0 ? (
                  <div className="flex items-center gap-2 py-1.5 px-1 text-xs font-mono">
                    <span className="text-orange-500 text-sm">📄</span>
                    <span className={isBright ? 'text-stone-500 font-medium' : 'text-zinc-400 font-medium'}>
                      No skills extracted yet. Drag & drop or browse your CV/resume above, and Mentora AI will extract them automatically.
                    </span>
                  </div>
                ) : (
                  selectedSkills.map((skill) => (
                    <span
                      key={skill}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold border transition-all animate-in fade-in zoom-in-95 ${
                        isBright
                          ? 'bg-white border-orange-200 text-[#1C1917] shadow-xs hover:border-orange-400'
                          : 'bg-[#18110b] border-orange-500/30 text-zinc-100 hover:border-orange-500/60'
                      }`}
                    >
                      <span className="text-orange-500">✓</span>
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-stone-400 hover:text-red-500 font-bold ml-1 text-xs transition-colors cursor-pointer"
                        title={`Remove ${skill}`}
                      >
                        ✕
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* Skill Search & Add Bar */}
              <div className="space-y-2 pt-1">
                <div className="relative flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-orange-500">
                      🔍
                    </span>
                    <input
                      type="text"
                      value={skillSearchQuery}
                      onChange={(e) => setSkillSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (filteredSkillSuggestions.length > 0) {
                            handleAddSkill(filteredSkillSuggestions[0]);
                          } else if (skillSearchQuery.trim()) {
                            handleAddSkill(skillSearchQuery);
                          }
                        }
                      }}
                      placeholder="Search or type a skill to add (e.g. Python, Docker, Figma, SQL)..."
                      className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-xs font-mono transition-all outline-none ${
                        isBright
                          ? 'bg-white border-[#E5D7C8] text-[#1C1917] placeholder-[#A8A29E] focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30'
                          : 'bg-[#0a0604] border-orange-900/50 text-white placeholder-zinc-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30'
                      }`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (skillSearchQuery.trim()) {
                        handleAddSkill(skillSearchQuery);
                      }
                    }}
                    disabled={!skillSearchQuery.trim()}
                    className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition-all disabled:opacity-40 cursor-pointer ${
                      isBright
                        ? 'bg-[#EA580C] text-white hover:bg-orange-700 shadow-xs'
                        : 'bg-gradient-to-r from-orange-500 to-amber-500 text-black hover:brightness-110 shadow-xs'
                    }`}
                  >
                    + Add Skill
                  </button>
                </div>

                {/* Autocomplete Dropdown List */}
                {filteredSkillSuggestions.length > 0 && (
                  <div
                    className={`p-2 rounded-xl border shadow-xl flex flex-wrap gap-1.5 animate-in fade-in slide-in-from-top-2 ${
                      isBright ? 'bg-white border-orange-200' : 'bg-[#140d07] border-orange-800/80'
                    }`}
                  >
                    <span className="text-[10px] font-mono text-orange-500 font-bold w-full px-1">
                      SUGGESTIONS FROM 50-ROLE DATASET:
                    </span>
                    {filteredSkillSuggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => handleAddSkill(suggestion)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border font-mono transition-all cursor-pointer ${
                          isBright
                            ? 'bg-[#FFF8F0] border-orange-300 text-orange-900 hover:bg-orange-500 hover:text-white'
                            : 'bg-[#1f140c] border-orange-600/40 text-orange-300 hover:bg-orange-600 hover:text-white'
                        }`}
                      >
                        + {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                {/* Popular Dataset Skills Quick Add Chips */}
                {popularDatasetSkills.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className={`text-[10px] font-mono ${isBright ? 'text-stone-400' : 'text-zinc-500'}`}>
                      Popular skills:
                    </span>
                    {popularDatasetSkills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleAddSkill(skill)}
                        className={`text-[11px] px-2 py-0.5 rounded-lg border font-mono transition-all cursor-pointer ${
                          isBright
                            ? 'bg-white border-[#E5D7C8] text-[#57534E] hover:border-orange-400 hover:text-orange-600'
                            : 'bg-[#140e09] border-orange-950/60 text-zinc-400 hover:border-orange-700 hover:text-orange-400'
                        }`}
                      >
                        + {skill}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 2. Declared Future Goal (with Other button) */}
            <div className="space-y-3 pt-3 border-t border-orange-500/10">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="future-goal-input"
                  className={`text-xs font-bold uppercase tracking-wider font-mono block ${
                    isBright ? 'text-[#44403C]' : 'text-zinc-200'
                  }`}
                >
                  Declared Future Goal / Target Profession
                </label>
                {futureGoal && (
                  <span className="text-[11px] font-mono text-orange-500 font-semibold">
                    Target: <span className="font-extrabold underline">{futureGoal}</span>
                  </span>
                )}
              </div>

              {/* Goal suggestion chips from 50-role dataset + OTHER button */}
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_GOALS.map((suggestion) => {
                  const isSelected = !isCustomGoal && futureGoal === suggestion;
                  return (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => {
                        setFutureGoal(suggestion);
                        setIsCustomGoal(false);
                      }}
                      className={`text-[11px] px-3 py-1.5 rounded-xl border font-mono font-medium transition-all cursor-pointer ${
                        isSelected
                          ? isBright
                            ? 'bg-[#EA580C] text-white border-[#EA580C] shadow-sm'
                            : 'bg-orange-600/40 text-white border-orange-400 shadow-sm'
                          : isBright
                          ? 'bg-white border-[#E5D7C8] text-[#57534E] hover:border-orange-300 hover:text-black'
                          : 'bg-[#140e09] border-orange-950/60 text-zinc-400 hover:border-orange-800 hover:text-white'
                      }`}
                    >
                      {isSelected ? '🎯 ' : ''}{suggestion}
                    </button>
                  );
                })}

                {/* THE "OTHER" BUTTON REQUESTED BY USER */}
                <button
                  type="button"
                  id="future-goal-other-btn"
                  onClick={() => {
                    setIsCustomGoal(true);
                    if (POPULAR_GOALS.includes(futureGoal)) {
                      setFutureGoal('');
                    }
                  }}
                  className={`text-[11px] px-3.5 py-1.5 rounded-xl border font-mono font-bold transition-all cursor-pointer ${
                    isCustomGoal
                      ? isBright
                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white border-orange-500 shadow-md'
                        : 'bg-gradient-to-r from-orange-500 to-amber-500 text-black border-amber-400 shadow-md font-extrabold'
                      : isBright
                      ? 'bg-orange-500/10 border-orange-300 text-orange-700 hover:bg-orange-500 hover:text-white'
                      : 'bg-orange-950/40 border-orange-500/40 text-orange-300 hover:border-orange-400 hover:text-white'
                  }`}
                >
                  ✦ Other Profession / Goal
                </button>
              </div>

              {/* Custom Goal Input Box when Other is selected or active */}
              {isCustomGoal ? (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                  <div className="flex items-center justify-between text-[11px] font-mono text-orange-500 font-bold">
                    <span>✏️ SPECIFY YOUR CUSTOM FUTURE PROFESSION:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomGoal(false);
                        setFutureGoal(POPULAR_GOALS[0]);
                      }}
                      className="text-stone-400 hover:text-orange-500 text-[10px] underline cursor-pointer"
                    >
                      Choose from popular roles instead
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      id="future-goal-input"
                      type="text"
                      list="all-dataset-roles"
                      required
                      autoFocus
                      value={futureGoal}
                      onChange={(e) => setFutureGoal(e.target.value)}
                      placeholder="Type your custom profession (e.g. Quantum Computing Engineer, AI Ethicist, Blockchain Developer)..."
                      className={`w-full px-4 py-3 rounded-xl border text-xs font-mono transition-all outline-none ${
                        isBright
                          ? 'bg-[#FAF4EE] border-orange-400 text-[#1C1917] placeholder-[#A8A29E] focus:border-orange-600 focus:bg-white focus:ring-1 focus:ring-orange-500/30'
                          : 'bg-[#0a0604] border-orange-500 text-white placeholder-zinc-500 focus:border-orange-400 focus:bg-black focus:ring-1 focus:ring-orange-500/30'
                      }`}
                    />
                  </div>
                </div>
              ) : null}

              {/* Datalist of all 50 roles for quick typing autocomplete */}
              <datalist id="all-dataset-roles">
                {CAREER_ROLES_DATASET.map((r) => (
                  <option key={r.srNo} value={r.futureGoal} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              style={isBright ? { color: '#ffffff' } : undefined}
              className={`w-full py-4 rounded-2xl font-bold text-xs font-mono uppercase tracking-wider active:scale-[0.99] transition-all disabled:opacity-50 text-white flex items-center justify-center gap-2 cursor-pointer ${
                isBright
                  ? 'bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-xl shadow-orange-500/30'
                  : 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-300 hover:to-orange-400 text-black shadow-xl shadow-orange-600/30'
              }`}
            >
              <span>Analyze Skills & Generate Career Blueprint</span>
              <span>→</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
