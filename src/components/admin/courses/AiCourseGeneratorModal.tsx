// src/components/admin/courses/AiCourseGeneratorModal.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  X,
  ChevronRight,
  Layers,
  Video,
  MessageSquare,
  Award,
  Clock,
  Zap,
} from "lucide-react";
import Modal from "@/components/admin/ui/Modal";
import Button from "@/components/admin/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/admin/ui/Field";
import {
  generateCoursePlan,
  generateCompleteCourse,
  CoursePlanResponse,
} from "@/lib/services/mentoraAiCourseService";

interface Props {
  open: boolean;
  onClose: () => void;
  onCourseCreated: (courseData: any) => void;
  categories: string[];
}

const DURATION_WEEKS_OPTIONS = [
  { label: "1 Week (7 primary deliverables)", value: 1 },
  { label: "2 Weeks (14 primary deliverables)", value: 2 },
  { label: "3 Weeks (21 primary deliverables)", value: 3 },
  { label: "4 Weeks (28 primary deliverables)", value: 4 },
  { label: "6 Weeks (42 primary deliverables)", value: 6 },
  { label: "8 Weeks (56 primary deliverables)", value: 8 },
  { label: "12 Weeks (84 primary deliverables)", value: 12 },
];

export default function AiCourseGeneratorModal({
  open,
  onClose,
  onCourseCreated,
  categories,
}: Props) {
  const [step, setStep] = useState<"input" | "plan_review" | "generating">("input");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form inputs
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0] || "AI & Machine Learning");
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [difficulty, setDifficulty] = useState("Intermediate");
  const [description, setDescription] = useState("");

  // Generated Plan
  const [planData, setPlanData] = useState<CoursePlanResponse["plan"] | null>(null);

  async function handleGeneratePlan() {
    if (!title.trim()) {
      setError("Please enter a course title.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await generateCoursePlan({
        title: title.trim(),
        description: description.trim() || `Comprehensive mastery course on ${title.trim()}`,
        category,
        duration_weeks: durationWeeks,
        difficulty,
      });
      setPlanData(res.plan);
      setStep("plan_review");
    } catch (err: any) {
      setError(err.message || "Failed to generate course plan.");
    } finally {
      setLoading(false);
    }
  }

  async function handleProceedToFullGeneration() {
    setError(null);
    setStep("generating");
    setLoading(true);
    try {
      const res = await generateCompleteCourse({
        title: title.trim(),
        description: description.trim() || `Comprehensive course on ${title.trim()}`,
        category,
        duration_weeks: durationWeeks,
        difficulty,
        approved_plan: planData,
      });

      if (res.mentora_course) {
        onCourseCreated(res.mentora_course);
        handleReset();
        onClose();
      } else {
        throw new Error("Invalid course data returned from generator.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate complete course.");
      setStep("plan_review");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setStep("input");
    setTitle("");
    setDescription("");
    setPlanData(null);
    setError(null);
    setLoading(false);
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        if (!loading) {
          handleReset();
          onClose();
        }
      }}
      title="Mentora AI Course Architect"
      subtitle="Master System Prompt • RapidAPI YouTube Search • Dalero Player"
      size="lg"
    >
      <div className="space-y-5 p-1">
        {error && (
          <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: INITIAL INPUT FORM */}
        {step === "input" && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70 space-y-1">
              <p className="font-semibold text-white flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-orange-400" />
                Two-Phase Instructional Blueprint
              </p>
              <p>
                First, the AI Course Architect analyzes your topic, prerequisites, and concepts to construct
                a structured <strong>Phase 1 Course Plan</strong> with exactly <strong>7 primary deliverables per week</strong>.
                You can review or adjust the plan before initiating Phase 2 full generation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Course Title">
                <Input
                  value={title}
                  onChange={(e: any) => setTitle(e.target.value)}
                  placeholder="e.g. Distributed Systems & Microservices"
                />
              </Field>

              <Field label="Category">
                <Select value={category} onChange={(e: any) => setCategory(e.target.value)}>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Duration">
                <Select
                  value={durationWeeks}
                  onChange={(e: any) => setDurationWeeks(parseInt(e.target.value, 10))}
                >
                  {DURATION_WEEKS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Difficulty Level">
                <Select value={difficulty} onChange={(e: any) => setDifficulty(e.target.value)}>
                  <option value="Beginner">Beginner (Foundational)</option>
                  <option value="Intermediate">Intermediate (Core & Practical)</option>
                  <option value="Advanced">Advanced (Production & Mastery)</option>
                </Select>
              </Field>
            </div>

            <Field label="Course Description & Learning Scope">
              <Textarea
                rows={3}
                value={description}
                onChange={(e: any) => setDescription(e.target.value)}
                placeholder="Explain what the learner should understand, practical skills, frameworks, or key constraints..."
              />
            </Field>

            <div className="pt-3 border-t border-white/10 flex justify-end gap-2.5">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                icon={loading ? RotateCw : Sparkles}
                onClick={handleGeneratePlan}
                disabled={loading || !title.trim()}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold"
              >
                {loading ? "Designing Course Plan..." : "Generate Course Plan (Phase 1)"}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: PROPOSED COURSE PLAN REVIEW (RULE 4 & 5) */}
        {step === "plan_review" && planData && (
          <div className="space-y-5">
            {/* Overview Banner */}
            <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
                  Proposed Course Plan (Phase 1)
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300">
                  {planData.course_overview?.duration_weeks} Weeks • {planData.course_overview?.total_deliverables || durationWeeks * 7} Deliverables
                </span>
              </div>
              <h3 className="text-lg font-bold text-white">{planData.course_overview?.title}</h3>
              <p className="text-xs text-white/70">{planData.course_overview?.description}</p>
              {planData.course_overview?.learning_outcomes && (
                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-white/50 uppercase">Key Outcomes:</span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-1 text-xs text-white/80">
                    {planData.course_overview.learning_outcomes.slice(0, 4).map((out, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                        <span className="line-clamp-1">{out}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Weekly Structure & 7 Deliverables per Week */}
            <div className="max-h-[380px] overflow-y-auto space-y-3 pr-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/60">
                Weekly Deliverable Breakdown (7 Deliverables / Week):
              </h4>

              {planData.weeks?.map((w: any) => (
                <div
                  key={w.week_number}
                  className="rounded-xl border border-white/10 bg-white/5 p-3.5 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-400">
                      Week {w.week_number}: {w.topics?.join(", ") || "Core Concepts"}
                    </span>
                    <span className="text-[11px] text-white/40">
                      {w.planned_deliverables?.length || 7} Deliverables
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {(w.planned_deliverables || []).map((d: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-2 rounded-lg bg-black/30 border border-white/5 text-xs flex flex-col justify-between gap-1"
                      >
                        <div>
                          <span className="text-[10px] text-orange-300 font-semibold uppercase block">
                            {d.type}
                          </span>
                          <span className="text-white/90 font-medium line-clamp-1">{d.title}</span>
                        </div>
                        <span className="text-[10px] text-white/40">{d.learning_purpose}</span>
                      </div>
                    ))}
                  </div>

                  {w.expected_learning_outcome && (
                    <div className="text-[11px] text-white/50 border-t border-white/5 pt-1.5">
                      <strong>Expected Outcome:</strong> {w.expected_learning_outcome}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Master System Prompt Confirmation Question (Rule 4) */}
            <div className="p-4 rounded-xl bg-orange-500/15 border border-orange-500/30 text-center space-y-2">
              <p className="text-sm font-semibold text-white">
                "{planData.confirmation_prompt || "This is the proposed course structure. Would you like me to proceed with generating the complete course content?"}"
              </p>
              <p className="text-xs text-white/60">
                Phase 2 will generate detailed lessons, flashcards (+1/+2 XP), YouTube RapidAPI resources with real duration XP, interactive dialogues, and 10-question quizzes (80% pass gate).
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2.5">
              <Button variant="ghost" onClick={() => setStep("input")}>
                ← Modify Inputs
              </Button>
              <Button
                variant="primary"
                icon={Sparkles}
                onClick={handleProceedToFullGeneration}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg shadow-orange-500/20"
              >
                Proceed & Generate Complete Course
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: FULL GENERATION IN PROGRESS */}
        {step === "generating" && (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin" />
              <Sparkles className="w-6 h-6 text-orange-400 absolute inset-0 m-auto" />
            </div>
            <div className="space-y-1 max-w-md">
              <h4 className="text-base font-bold text-white">Synthesizing Pedagogical Coursework</h4>
              <p className="text-xs text-white/60">
                The Gemini AI Course Architect is generating structured subtopics, creating flashcard workouts,
                querying RapidAPI YouTube for verified videos & durations, crafting interactive dialogues, and compiling pass-gate quizzes.
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
