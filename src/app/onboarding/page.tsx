'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Brain, Sun, Moon, X, FileText, Sparkles } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const FIELD_SUGGESTIONS = [
  'Artificial Intelligence & Machine Learning',
  'Agentic AI & LLM Systems',
  'Full-Stack AI Development',
  'Cloud Architecture & DevOps',
  'Data Science & Advanced Analytics',
  'Cybersecurity & AI Safety',
];

const GOAL_SUGGESTIONS = [
  'AI Engineer',
  'Senior AI Systems Architect',
  'Machine Learning Engineer',
  'AI Product Lead',
  'Full-Stack AI Developer',
  'Data Scientist',
];

export default function OnboardingPage() {
  const router = useRouter();
  const { isBright, toggleTheme } = useTheme();

  // Form State
  const [linkedinText, setLinkedinText] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvText, setCvText] = useState('');
  const [fieldOfInterest, setFieldOfInterest] = useState('Artificial Intelligence & Machine Learning');
  const [futureGoal, setFutureGoal] = useState('AI Engineer');

  // UI State
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        setCvText((e.target?.result as string) || '');
      };
      reader.readAsText(file);
    } else {
      // For PDF / Docx or binary, read as text fallback or indicate file parsed
      reader.onload = (e) => {
        const rawContent = e.target?.result;
        if (typeof rawContent === 'string') {
          // Clean non-printable characters if raw read
          const cleaned = rawContent.replace(/[^\x20-\x7E\t\r\n]/g, ' ').slice(0, 15000);
          setCvText(cleaned);
        } else {
          setCvText(`[Uploaded Document: ${file.name} (${Math.round(file.size / 1024)} KB)]`);
        }
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
    setCvText(
      `Alex Morgan - Resume / CV Summary
Education: B.S. Computer Science (2024)
Projects:
1. Multi-Agent Research Assistant: Built using LangChain and CrewAI concepts. Implemented web search and summarization.
2. Image Classifier: Basic CNN built with PyTorch on CIFAR-10.
Certifications: Deep Learning Specialization (in progress), Python for Data Science.`
    );
    setFieldOfInterest('Artificial Intelligence & Machine Learning');
    setFutureGoal('AI Engineer');
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!linkedinText.trim() && !cvFile && !cvText.trim()) {
      setErrorMessage('Please provide either your LinkedIn profile details or upload a CV/resume to proceed.');
      return;
    }

    if (!fieldOfInterest.trim() || !futureGoal.trim()) {
      setErrorMessage('Please specify both your Field of Interest and Future Goal.');
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
          fieldOfInterest: fieldOfInterest.trim(),
          futureGoal: futureGoal.trim(),
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to analyze profile');
      }

      const result = await response.json();

      if (typeof window !== 'undefined') {
        if (result.data) {
          localStorage.setItem('mentora_career_analysis', JSON.stringify(result.data));
        }
        sessionStorage.setItem('mentora_dashboard_active', 'true');
      }

      // Smooth brief timeout so user sees the progress animation smoothly
      setTimeout(() => {
        window.location.href = '/dashboard';
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
              <div className="absolute inset-0 flex items-center justify-center animate-pulse">
                <Brain className="w-8 h-8 text-orange-500" />
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
              className={`inline-flex items-center gap-1.5 text-xs font-mono font-semibold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                isBright
                  ? 'bg-white hover:bg-orange-50 border-[#E5D7C8] text-[#EA580C]'
                  : 'bg-[#140e09] hover:bg-orange-950/40 border-orange-900/50 text-orange-400'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Sample Profile</span>
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
              {isBright ? <Moon className="w-4 h-4 text-stone-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
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
              <X className="w-4 h-4" />
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
                <FileText className="w-4 h-4 text-orange-400" />
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
                    <FileText className="w-6 h-6 text-orange-500 shrink-0" />
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

          {/* Section 3: Field of Interest & Future Goal Inputs */}
          <div
            className={`p-6 rounded-3xl border space-y-5 transition-colors ${
              isBright
                ? 'bg-white/80 border-[#E5D7C8] shadow-xs'
                : 'bg-[#120b06]/80 border-orange-950/60 shadow-lg shadow-black/40'
            }`}
          >
            {/* Field of Interest */}
            <div className="space-y-2">
              <label
                htmlFor="field-interest-input"
                className={`text-xs font-bold uppercase tracking-wider font-mono block ${
                  isBright ? 'text-[#44403C]' : 'text-zinc-200'
                }`}
              >
                Field of Interest
              </label>
              <input
                id="field-interest-input"
                type="text"
                required
                value={fieldOfInterest}
                onChange={(e) => setFieldOfInterest(e.target.value)}
                placeholder="e.g. Artificial Intelligence & Machine Learning"
                className={`w-full px-4 py-3 rounded-xl border text-xs font-mono transition-all outline-none ${
                  isBright
                    ? 'bg-[#FAF4EE] border-[#E5D7C8] text-[#1C1917] placeholder-[#A8A29E] focus:border-orange-500 focus:bg-white focus:ring-1 focus:ring-orange-500/30'
                    : 'bg-[#0a0604] border-orange-900/50 text-white placeholder-zinc-500 focus:border-orange-500 focus:bg-black focus:ring-1 focus:ring-orange-500/30'
                }`}
              />

              {/* Quick suggestion chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {FIELD_SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setFieldOfInterest(suggestion)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border font-mono transition-all cursor-pointer ${
                      fieldOfInterest === suggestion
                        ? isBright
                          ? 'bg-[#EA580C] text-white border-[#EA580C]'
                          : 'bg-orange-600/30 text-white border-orange-400'
                        : isBright
                        ? 'bg-white border-[#E5D7C8] text-[#57534E] hover:border-orange-300 hover:text-black'
                        : 'bg-[#140e09] border-orange-950/60 text-zinc-400 hover:border-orange-800 hover:text-white'
                    }`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* Future Goal */}
            <div className="space-y-2">
              <label
                htmlFor="future-goal-input"
                className={`text-xs font-bold uppercase tracking-wider font-mono block ${
                  isBright ? 'text-[#44403C]' : 'text-zinc-200'
                }`}
              >
                Declared Future Goal
              </label>
              <input
                id="future-goal-input"
                type="text"
                required
                value={futureGoal}
                onChange={(e) => setFutureGoal(e.target.value)}
                placeholder="e.g. AI Engineer, Data Scientist, Senior AI Systems Architect"
                className={`w-full px-4 py-3 rounded-xl border text-xs font-mono transition-all outline-none ${
                  isBright
                    ? 'bg-[#FAF4EE] border-[#E5D7C8] text-[#1C1917] placeholder-[#A8A29E] focus:border-orange-500 focus:bg-white focus:ring-1 focus:ring-orange-500/30'
                    : 'bg-[#0a0604] border-orange-900/50 text-white placeholder-zinc-500 focus:border-orange-500 focus:bg-black focus:ring-1 focus:ring-orange-500/30'
                }`}
              />

              {/* Quick suggestion chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {GOAL_SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setFutureGoal(suggestion)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border font-mono transition-all cursor-pointer ${
                      futureGoal === suggestion
                        ? isBright
                          ? 'bg-[#EA580C] text-white border-[#EA580C]'
                          : 'bg-orange-600/30 text-white border-orange-400'
                        : isBright
                        ? 'bg-white border-[#E5D7C8] text-[#57534E] hover:border-orange-300 hover:text-black'
                        : 'bg-[#140e09] border-orange-950/60 text-zinc-400 hover:border-orange-800 hover:text-white'
                    }`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
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
