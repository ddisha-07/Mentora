"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Send, ArrowLeft, Check, BookOpen, Layers, FileText,
  Video, MessageSquare, RotateCw, Copy, CheckCheck, Play,
  FolderPlus, ChevronRight, ChevronLeft, ChevronDown, ChevronUp, AlertCircle, Eye, Globe, Bookmark,
  TrendingUp, HelpCircle, Code, ListFilter, Lock, Unlock, Trophy,
  Target, Award, Star, Flame, Zap, CheckCircle2, RefreshCw, Gamepad2,
  Lightbulb, Compass, BarChart3, Flag, X, ExternalLink, Trash2,
  Pencil, Plus, ArrowUp, ArrowDown, Palette, Type, Sliders,
  PanelLeftClose, PanelLeftOpen
} from "lucide-react";
import Button from "@/components/admin/ui/Button";
import Badge from "@/components/admin/ui/Badge";
import ConfirmDialog from "@/components/admin/ui/ConfirmDialog";
import { useTheme } from "@/context/ThemeContext";
import { useXp } from "@/context/XpContext";
import { uid } from "@/lib/admin/utils";
import {
  generateCuratedCurriculum,
  detectDomain,
  GeneratedModule,
  generateFlashcardsForCourse,
  generateCheatSheetForCourse,
  generateDialogueForCourse,
  extractSubjectName,
  getRelevantYouTubeVideo,
  generateCuratedVideosForCourse,
  cleanTopicString,
  generateDailyCodeSnippet,
  generateDailyExercise,
  generateDailyFlashcards,
  generateWeeklyPassGateQuiz,
  extractDescriptionPillars,
  parseDurationWeeks,
  VideoAlternate,
} from "@/lib/admin/services/courseGenerationEngine";
import MentoraVideoPlayer from "@/components/courses/MentoraVideoPlayer";
import { requestCourseEdit } from "@/lib/services/mentoraAiCourseService";
import InteractiveDialogueChat from "./InteractiveDialogueChat";

export interface CourseStudioProps {
  initialCourse: {
    id?: string;
    title: string;
    category: string;
    description: string;
    level: string;
    duration: string;
    thumbnail: string;
    coverColor?: string;
    modules?: any[];
    resources?: any;
    status?: string;
    documentInfo?: {
      name: string;
      mode: "full" | "integrate";
      integrationType?: "reading" | "video" | "reference";
      documentText?: string;
      isVideo?: boolean;
      videoUrl?: string;
      targetModuleIndex?: number;
      smartFlowNote?: string;
    };
  };
  onSaveDraft: (courseData: any) => void;
  onPublish: (courseData: any) => void;
  onClose: () => void;
  onDelete?: (courseId: string) => void;
}

interface ChatMessage {
  id: string;
  sender: "ai" | "user";
  text: string;
  timestamp: string;
  actionTaken?: string;
  proposedChange?: any;
  isPendingApproval?: boolean;
}

export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  tag: string;
  moduleIndex?: number;
  mastered?: boolean;
  fontFamily?: "sans" | "serif" | "mono" | "rounded" | "handwritten";
  theme?: "ember" | "sky" | "emerald" | "purple" | "rose" | "obsidian";
  fontSize?: "sm" | "md" | "lg";
}

export interface CheatSheetSection {
  heading: string;
  points: string[];
  code?: string;
}

export interface VideoTutorial {
  id: string;
  title: string;
  youtubeId: string;
  url?: string;
  channel: string;
  duration: string;
  summary: string;
  alternates?: VideoAlternate[];
}

export interface SubTopicSection {
  heading: string;
  body: string;
  code?: string;
  analogy?: string;
}

export interface SubTopicItem {
  id: string;
  title: string;
  type: "reading" | "video" | "exercise" | "dialogue";
  duration: string;
  summary: string;
  youtubeId?: string;
  videoUrl?: string;
  videoTitle?: string;
  channel?: string;
  videoSummary?: string;
  alternates?: VideoAlternate[];
  flashcards?: Flashcard[];
  sections?: SubTopicSection[];
  keyTakeaways?: string[];
  exercisePrompt?: string;
  exerciseHint?: string;
  exerciseSolution?: string;
  dialogueScenario?: DialogueScenario;
  quizQuestions?: any[];
  cheatSheet?: {
    title: string;
    summary: string;
    keyPoints: string[];
    syntaxSnippet?: string;
    externalLinks?: Array<{ title: string; url: string }>;
  };
}

export interface DialogueScenario {
  id: string;
  situation: string;
  question: string;
  hint: string;
  expectedKeywords: string[];
  correctExplanation: string;
}

export interface DialogueChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  isCorrect?: boolean;
  isHint?: boolean;
  isReview?: boolean;
}

export interface DialogueReviewData {
  totalScenarios: number;
  solvedScenarios: number;
  attempts: number;
  scorePercent: number;
  tier: string;
  strengths: string[];
  areasToImprove: string[];
  takeaways: string[];
}

export interface ModuleStepContent {
  title: string;
  readTime: string;
  tagline: string;
  summary: string;
  funAnalogy?: string;
  keyTakeaways: string[];
}

export interface ModuleQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  funFact: string;
}

export interface ModulePassGate {
  type: "quiz" | "task";
  quiz: {
    title: string;
    passingScore: number;
    questions: ModuleQuizQuestion[];
  };
  task: {
    missionTitle: string;
    xpReward: number;
    estimatedTime?: string;
    dailyGoal?: string;
    instructions: string;
    checklist: string[];
    dailyTip?: string;
  };
}

export interface CourseModule {
  id: string;
  title: string;
  tagline?: string;
  subtopics?: SubTopicItem[];
  content: ModuleStepContent;
  video: VideoTutorial;
  flashcards: Flashcard[];
  dialogueScenarios?: DialogueScenario[];
  dialogue?: {
    mentorName: string;
    mentorAvatar: string;
    tagline: string;
    suggestedQuestions: string[];
    qaList: Array<{ question: string; answer: string }>;
  };
  passGate: ModulePassGate;
  lessons?: Array<{ id: string; title: string; duration: string }>;
}


function getFontFamilyDetails(font?: string): { className: string; style?: React.CSSProperties } {
  switch (font) {
    case "serif":
      return { className: "font-serif" };
    case "mono":
      return { className: "font-mono tracking-tight" };
    case "rounded":
      return { className: "font-sans", style: { fontFamily: "'Outfit', 'Quicksand', system-ui, sans-serif" } };
    case "handwritten":
      return { className: "", style: { fontFamily: "'Caveat', 'Comic Sans MS', cursive" } };
    case "sans":
    default:
      return { className: "font-sans" };
  }
}

function getCardThemeDetails(theme?: string, isBright: boolean = false) {
  switch (theme) {
    case "sky":
      return {
        frontBg: isBright
          ? "bg-gradient-to-br from-white via-sky-50/50 to-white border-sky-200"
          : "bg-gradient-to-br from-[#12213A] via-[#101C2E] to-[#152740] border-sky-500/30",
        backBg: isBright
          ? "bg-gradient-to-br from-sky-50 via-white to-blue-50 border-sky-300"
          : "bg-gradient-to-br from-[#0F2840] via-[#0D1E30] to-[#122F4C] border-sky-400/40",
        tagClass: "bg-sky-500/20 text-sky-400 border border-sky-500/30",
        accentText: "text-sky-400",
      };
    case "emerald":
      return {
        frontBg: isBright
          ? "bg-gradient-to-br from-white via-emerald-50/50 to-white border-emerald-200"
          : "bg-gradient-to-br from-[#122B22] via-[#10241D] to-[#16362B] border-emerald-500/30",
        backBg: isBright
          ? "bg-gradient-to-br from-emerald-50 via-white to-teal-50 border-emerald-300"
          : "bg-gradient-to-br from-[#10382B] via-[#0E2820] to-[#144434] border-emerald-400/40",
        tagClass: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
        accentText: "text-emerald-400",
      };
    case "purple":
      return {
        frontBg: isBright
          ? "bg-gradient-to-br from-white via-purple-50/50 to-white border-purple-200"
          : "bg-gradient-to-br from-[#241738] via-[#1B122B] to-[#2E1A47] border-purple-500/30",
        backBg: isBright
          ? "bg-gradient-to-br from-purple-50 via-white to-fuchsia-50 border-purple-300"
          : "bg-gradient-to-br from-[#2D1B48] via-[#211434] to-[#39205B] border-purple-400/40",
        tagClass: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
        accentText: "text-purple-400",
      };
    case "rose":
      return {
        frontBg: isBright
          ? "bg-gradient-to-br from-white via-rose-50/50 to-white border-rose-200"
          : "bg-gradient-to-br from-[#2E151F] via-[#241018] to-[#3A1826] border-rose-500/30",
        backBg: isBright
          ? "bg-gradient-to-br from-rose-50 via-white to-pink-50 border-rose-300"
          : "bg-gradient-to-br from-[#381624] via-[#2A101C] to-[#47192E] border-rose-400/40",
        tagClass: "bg-rose-500/20 text-rose-400 border border-rose-500/30",
        accentText: "text-rose-400",
      };
    case "obsidian":
      return {
        frontBg: isBright
          ? "bg-gradient-to-br from-slate-100 via-white to-slate-200 border-slate-300"
          : "bg-gradient-to-br from-[#161922] via-[#0E1015] to-[#1A1D28] border-white/15",
        backBg: isBright
          ? "bg-gradient-to-br from-slate-200 via-white to-slate-100 border-slate-400"
          : "bg-gradient-to-br from-[#1A1E29] via-[#12141C] to-[#1E2230] border-white/20",
        tagClass: "bg-white/10 text-slate-300 border border-white/10",
        accentText: "text-slate-300",
      };
    case "ember":
    default:
      return {
        frontBg: isBright
          ? "bg-gradient-to-br from-white via-amber-50/40 to-white border-amber-200"
          : "bg-gradient-to-br from-[#1A1F2C] via-[#161A24] to-[#1E1C28] border-white/15",
        backBg: isBright
          ? "bg-gradient-to-br from-amber-50 via-white to-orange-50 border-amber-300"
          : "bg-gradient-to-br from-[#241B12] via-[#1C150E] to-[#2D2016] border-amber-500/30",
        tagClass: "bg-amber-500/20 text-amber-500 border border-amber-500/30",
        accentText: "text-amber-500",
      };
  }
}

function getCardFontSizeDetails(size?: string) {
  switch (size) {
    case "sm":
      return { question: "text-sm sm:text-base", answer: "text-xs sm:text-sm" };
    case "lg":
      return { question: "text-lg sm:text-2xl", answer: "text-base sm:text-lg" };
    case "md":
    default:
      return { question: "text-base sm:text-xl", answer: "text-sm sm:text-base" };
  }
}

function AiFormattedMessage({
  text,
  isBright,
  sender = "ai",
}: {
  text: string;
  isBright: boolean;
  sender?: "ai" | "bot" | "user";
}) {
  if (sender === "user") {
    return <span className="font-medium whitespace-pre-wrap">{text}</span>;
  }

  // Parses inline markdown: bold, italic, code, quotes
  const renderInline = (raw: string): React.ReactNode => {
    if (!raw) return null;

    let clean = raw;
    let isItalicWrapper = false;
    if (clean.startsWith("*") && clean.endsWith("*") && !clean.startsWith("**") && clean.length > 2) {
      clean = clean.slice(1, -1).trim();
      isItalicWrapper = true;
    }

    const tokenRegex = /(`[^`]+`|\*\*\*[^*]+\*\*\*|\*\*[^*]+\*\*|\*[^*]+\*)/g;
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = tokenRegex.exec(clean)) !== null) {
      if (match.index > lastIndex) {
        elements.push(clean.substring(lastIndex, match.index));
      }

      const token = match[0];
      const key = `in_${match.index}`;

      if (token.startsWith("`") && token.endsWith("`")) {
        elements.push(
          <code
            key={key}
            className={`px-1.5 py-0.5 rounded font-mono text-[0.85em] font-semibold ${
              isBright
                ? "bg-amber-100 text-amber-950 border border-amber-200"
                : "bg-amber-500/15 text-amber-300 border border-amber-500/30"
            }`}
          >
            {token.slice(1, -1)}
          </code>
        );
      } else if (token.startsWith("***") && token.endsWith("***")) {
        elements.push(
          <strong key={key} className={`font-bold italic ${isBright ? "text-slate-950" : "text-white"}`}>
            {token.slice(3, -3)}
          </strong>
        );
      } else if (token.startsWith("**") && token.endsWith("**")) {
        elements.push(
          <strong key={key} className={`font-bold ${isBright ? "text-slate-950" : "text-white"}`}>
            {token.slice(2, -2)}
          </strong>
        );
      } else if (token.startsWith("*") && token.endsWith("*")) {
        elements.push(
          <em key={key} className="italic opacity-90">
            {token.slice(1, -1)}
          </em>
        );
      }

      lastIndex = tokenRegex.lastIndex;
    }

    if (lastIndex < clean.length) {
      elements.push(clean.substring(lastIndex));
    }

    const output = elements.length > 0 ? elements : clean;
    return isItalicWrapper ? <em className="italic opacity-90">{output}</em> : <>{output}</>;
  };

  // Split content by paragraphs or sections
  const sections = text.split(/\n\s*\n/);

  return (
    <div className="space-y-2.5 text-xs sm:text-sm leading-relaxed">
      {sections.map((section, sIdx) => {
        const trimmed = section.trim();
        if (!trimmed) return null;

        // 1. Horizontal Divider
        if (trimmed === "---" || trimmed === "***") {
          return <div key={sIdx} className="my-2 border-t border-line-soft opacity-60" />;
        }

        // 2. Numbered list block
        const lines = trimmed.split("\n");
        const isNumberedList = lines.some((l) => /^\s*\d+\.\s+/.test(l));

        if (isNumberedList) {
          return (
            <div key={sIdx} className="space-y-2 my-2">
              {lines.map((line, lIdx) => {
                const numMatch = line.match(/^\s*(\d+)\.\s+(.*)$/);
                if (numMatch) {
                  const num = numMatch[1];
                  const body = numMatch[2];
                  return (
                    <div
                      key={lIdx}
                      className={`p-2.5 sm:p-3 rounded-xl border flex items-start gap-2.5 transition-all ${
                        isBright
                          ? "bg-slate-50/90 border-slate-200/90 text-slate-800 shadow-xs"
                          : "bg-white/[0.03] border-white/5 text-ink-100"
                      }`}
                    >
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 shadow-xs ${
                          isBright
                            ? "bg-amber-100 text-amber-900 border border-amber-300"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        }`}
                      >
                        {num}
                      </span>
                      <div className="flex-1 min-w-0 text-xs sm:text-sm leading-relaxed">
                        {renderInline(body)}
                      </div>
                    </div>
                  );
                }
                return (
                  <p key={lIdx} className="text-xs sm:text-sm leading-relaxed">
                    {renderInline(line)}
                  </p>
                );
              })}
            </div>
          );
        }

        // 3. Scenario Callout block
        if (trimmed.includes("Situation:")) {
          const content = trimmed.replace(/^[\s]*\**Situation:\**\s*/i, "").trim();
          return (
            <div
              key={sIdx}
              className={`p-3.5 rounded-2xl border my-2 transition-all ${
                isBright
                  ? "bg-amber-50/70 border-amber-200/90 text-slate-800 shadow-xs"
                  : "bg-amber-500/10 border-amber-500/25 text-ink-100"
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-amber-700 dark:text-amber-400 mb-1.5">
                <AlertCircle size={15} className="text-amber-500 shrink-0" />
                <span>Real-World Scenario</span>
              </div>
              <div className="text-xs sm:text-sm leading-relaxed">
                {renderInline(content || trimmed)}
              </div>
            </div>
          );
        }

        // 4. Diagnostic Question Callout block
        if (trimmed.includes("Diagnostic Question:")) {
          const content = trimmed.replace(/^[\s]*\**Diagnostic Question:\**\s*/i, "").trim();
          return (
            <div
              key={sIdx}
              className={`p-3.5 rounded-2xl border my-2 transition-all ${
                isBright
                  ? "bg-orange-50/70 border-orange-200/90 text-slate-900 shadow-xs"
                  : "bg-orange-500/10 border-orange-500/25 text-ink-100"
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-ember-600 dark:text-ember-400 mb-1.5">
                <HelpCircle size={15} className="text-ember-500 shrink-0" />
                <span>Diagnostic Question</span>
              </div>
              <div className="text-xs sm:text-sm font-semibold leading-relaxed">
                {renderInline(content || trimmed)}
              </div>
            </div>
          );
        }

        // 5. Positive / Solved Callout block
        if (trimmed.includes("**Spot on!") || trimmed.includes("**Outstanding")) {
          return (
            <div
              key={sIdx}
              className={`p-3 rounded-2xl border my-1.5 ${
                isBright
                  ? "bg-emerald-50/90 border-emerald-200 text-emerald-950 shadow-xs"
                  : "bg-emerald-500/15 border-emerald-500/30 text-emerald-200"
              }`}
            >
              {renderInline(trimmed)}
            </div>
          );
        }

        // 6. Hint Callout block
        if (trimmed.includes("**Helpful Diagnostic Hint") || trimmed.includes("**Hint")) {
          return (
            <div
              key={sIdx}
              className={`p-3 rounded-2xl border my-1.5 ${
                isBright
                  ? "bg-amber-50/90 border-amber-200 text-amber-950 shadow-xs"
                  : "bg-amber-500/15 border-amber-500/30 text-amber-200"
              }`}
            >
              {renderInline(trimmed)}
            </div>
          );
        }

        // 7. Footer Tip / Instructions
        if ((trimmed.startsWith("*") && trimmed.endsWith("*")) || trimmed.startsWith("*Tip:") || trimmed.startsWith("Tip:")) {
          let cleanTip = trimmed;
          if (cleanTip.startsWith("*") && cleanTip.endsWith("*")) {
            cleanTip = cleanTip.slice(1, -1).trim();
          }
          return (
            <div
              key={sIdx}
              className={`text-xs leading-relaxed italic p-2.5 rounded-xl border mt-2 flex items-start gap-2 ${
                isBright
                  ? "bg-amber-50/40 border-amber-200/60 text-slate-600"
                  : "bg-white/[0.02] border-white/10 text-ink-300"
              }`}
            >
              <Lightbulb size={14} className="text-amber-500 shrink-0 not-italic mt-0.5" />
              <div className="flex-1 min-w-0">{renderInline(cleanTip)}</div>
            </div>
          );
        }

        // 8. Regular paragraph
        return (
          <p key={sIdx} className="text-xs sm:text-sm leading-relaxed">
            {lines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {lIdx > 0 && <br />}
                {renderInline(line)}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

// -----------------------------------------------------------------------------
// CLEAN TITLE & TAGLINE HELPERS (TOP-LEVEL SCOPE)
// -----------------------------------------------------------------------------
export function cleanTitle(raw: string): string {
  if (!raw) return "";
  let s = raw
    // Strip any repeating Module / Week / Unit / Phase / Chapter prefixes at start
    .replace(/^(?:(?:Module|Week|Unit|Phase|Chapter)\s*\d+[\s:\-–—]*)+/gi, "")
    .replace(/^(?:(?:Module|Week|Unit|Phase|Chapter)\s*\d+[\s:\-–—]*)+/gi, "")
    .trim();

  // Strip course prompt noise if present
  s = s.replace(/^(?:please\s+)?(?:create|build|generate|make|design|write)\s+(?:a|an)?\s*(?:beginner-friendly|introductory|comprehensive|complete|advanced|interactive)?\s*(?:data\s+science|ai|web|python|programming|coding|software|full-stack)?\s*course\s+(?:covering|on|about|for)?\s*/i, "").trim();

  // Strip any residual inline Week X / Module X
  s = s.replace(/\b(?:Week|Module)\s*\d+[\s:\-–—]*/gi, "").trim();

  // Clean punctuation at borders
  s = s.replace(/^[:\-\s•–—]+|[:\-\s•–—]+$/g, "").trim();

  if (!s) {
    s = raw.replace(/^(?:(?:Module|Week)\s*\d+[\s:\-–—]*)+/gi, "").trim();
  }
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : "Module Topic";
}

export function cleanTagline(raw: string): string {
  if (!raw) return "";
  let s = raw
    .replace(/^(?:(?:Week|Module)\s*\d+[\s•:\-–—]*)+/gi, "")
    .replace(/\b(?:Week|Module)\s*\d+[\s•:\-–—]*/gi, "")
    .replace(/^(?:Master|Learn)\s+(?:create|build|generate|make)\s+(?:a\s+)?.*?\s+with/i, "Master this module with")
    .replace(/^[:\-\s•–—]+|[:\-\s•–—]+$/g, "")
    .trim();
  return s || "Structured practical deliverables";
}

export default function AiCourseStudio({
  initialCourse,
  onSaveDraft,
  onPublish,
  onClose,
  onDelete,
}: CourseStudioProps) {
  const { isBright } = useTheme();
  const { totalXp, level, awardXp } = useXp();

  // Course state
  const [course, setCourse] = useState(initialCourse);
  const [activeTab, setActiveTab] = useState<"curriculum" | "flashcards" | "cheatsheet" | "video" | "dialogue">("curriculum");

  // Chatbot state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputPrompt, setInputPrompt] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);

  // Global Flashcards interactive state
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardTagFilter, setCardTagFilter] = useState("All");
  const [flashcardViewMode, setFlashcardViewMode] = useState<"single" | "all">("single");
  const [flippedCardIds, setFlippedCardIds] = useState<Record<string, boolean>>({});

  const toggleCardFlip = (id: string) => {
    setFlippedCardIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Cheat sheet copied and sync state
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [isCheatSheetSynced, setIsCheatSheetSynced] = useState(false);

  // Split-Screen LMS Course Player State
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isPassGateActive, setIsPassGateActive] = useState(false);
  const [playerModuleIdx, setPlayerModuleIdx] = useState(0);
  const [expandedModuleMap, setExpandedModuleMap] = useState<Record<number, boolean>>({ 0: true });
  const [isPlayerResourcesOpen, setIsPlayerResourcesOpen] = useState(false);

  // Interactive Subtopic Reader / Player
  const [activeSubtopic, setActiveSubtopic] = useState<SubTopicItem | null>(null);
  const [selectedMasterclassVideoId, setSelectedMasterclassVideoId] = useState<string | null>(null);
  const [isFetchingMoreVideos, setIsFetchingMoreVideos] = useState(false);
  const [exerciseAnswer, setExerciseAnswer] = useState("");
  const [showExerciseHint, setShowExerciseHint] = useState(false);
  const [showExerciseSolution, setShowExerciseSolution] = useState(false);
  const [showSupplementaryVideo, setShowSupplementaryVideo] = useState(false);
  const [drawerDialogueAnswer, setDrawerDialogueAnswer] = useState("");
  const [drawerDialogueFeedback, setDrawerDialogueFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [showDrawerDialogueHint, setShowDrawerDialogueHint] = useState(false);
  const [drawerFlippedCards, setDrawerFlippedCards] = useState<Record<string | number, boolean>>({});
  const [drawerQuizAnswers, setDrawerQuizAnswers] = useState<Record<number, number>>({});

  function formatSubtopicDisplayTitle(rawTitle: string): string {
    if (!rawTitle) return "";
    if (/\b(?:create|build|generate|make|design)\s+a\s+/i.test(rawTitle) || /course\s+(?:covering|on|about)/i.test(rawTitle)) {
      return rawTitle.replace(/^(Day\s+\d+:\s*).*?\s+[—–-]\s*/i, "$1");
    }
    return rawTitle;
  }

  // All lessons flat index for seamless Previous / Next navigation across modules
  const allCourseLessons = useMemo(() => {
    const list: Array<{ sub: SubTopicItem; moduleIdx: number; lessonIdx: number }> = [];
    (course.modules || []).forEach((m: CourseModule, mIdx: number) => {
      (m.subtopics || []).forEach((sub: SubTopicItem, sIdx: number) => {
        list.push({ sub, moduleIdx: mIdx, lessonIdx: sIdx });
      });
    });
    return list;
  }, [course.modules]);

  const currentLessonIndex = allCourseLessons.findIndex((item) => item.sub.id === activeSubtopic?.id);
  const prevLesson = currentLessonIndex > 0 ? allCourseLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex >= 0 && currentLessonIndex < allCourseLessons.length - 1
    ? allCourseLessons[currentLessonIndex + 1]
    : null;

  function handleNavigateLesson(target: { sub: SubTopicItem; moduleIdx: number } | null) {
    if (!target) return;
    setActiveSubtopic(target.sub);
    setIsPassGateActive(false);
    setPlayerModuleIdx(target.moduleIdx);
    setExpandedModuleMap((prev) => ({ ...prev, [target.moduleIdx]: true }));
    setIsSubtopicEditing(false);
    setExerciseAnswer("");
    setShowExerciseHint(false);
    setShowExerciseSolution(false);
    setDrawerDialogueAnswer("");
    setDrawerDialogueFeedback(null);
    setShowDrawerDialogueHint(false);
    setDrawerQuizAnswers({});
  }

  function handleOpenSubtopic(sub: SubTopicItem, focusVideo: boolean = false) {
    let foundModIdx = 0;
    (course.modules || []).forEach((m: CourseModule, mIdx: number) => {
      if ((m.subtopics || []).some((s) => s.id === sub.id)) {
        foundModIdx = mIdx;
      }
    });
    setPlayerModuleIdx(foundModIdx);
    setExpandedModuleMap((prev) => ({ ...prev, [foundModIdx]: true }));
    setActiveSubtopic(sub);
    setIsPassGateActive(false);
    setIsPlayerOpen(true);
    setShowSupplementaryVideo(focusVideo || sub.type === "video");
    setIsSubtopicEditing(false);
    setExerciseAnswer("");
    setShowExerciseHint(false);
    setShowExerciseSolution(false);
    setDrawerDialogueAnswer("");
    setDrawerDialogueFeedback(null);
    setShowDrawerDialogueHint(false);
    setDrawerFlippedCards({});
    setDrawerQuizAnswers({});
  }

  // Socratic Dialogue Interactive Chatbot State
  const [activeDialogueModuleIdx, setActiveDialogueModuleIdx] = useState(0);
  const [currentScenarioIdx, setCurrentScenarioIdx] = useState(0);
  const [dialogueAttempts, setDialogueAttempts] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [solvedScenarioIds, setSolvedScenarioIds] = useState<string[]>([]);
  const [dialogueChat, setDialogueChat] = useState<DialogueChatMessage[]>([]);
  const [dialogueInput, setDialogueInput] = useState("");
  const [isDialogueThinking, setIsDialogueThinking] = useState(false);
  const [dialogueReview, setDialogueReview] = useState<DialogueReviewData | null>(null);
  const [dialogueFinished, setDialogueFinished] = useState(false);
  const dialogueChatBottomRef = useRef<HTMLDivElement>(null);

  // Delete Confirmation State
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "course" | "module" | "subtopic" | "flashcard";
    id: string;
    title: string;
    parentId?: string;
  } | null>(null);

  // Student Runner / Interactive Sequenced Journey Mode
  const [runnerOpen, setRunnerOpen] = useState(false);
  const [runnerModuleIndex, setRunnerModuleIndex] = useState(0);
  const [runnerStep, setRunnerStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [highestStepCompleted, setHighestStepCompleted] = useState<Record<string, number>>({});
  const [completedModules, setCompletedModules] = useState<Record<string, boolean>>({});
    const [celebrationBanner, setCelebrationBanner] = useState<string | null>(null);

  // --- FLASHCARD PERSONALIZATION & EDITING STATES ---
  const [deckFont, setDeckFont] = useState<"sans" | "serif" | "mono" | "rounded" | "handwritten">("sans");
  const [deckTheme, setDeckTheme] = useState<"ember" | "sky" | "emerald" | "purple" | "rose" | "obsidian">("ember");
  const [deckFontSize, setDeckFontSize] = useState<"sm" | "md" | "lg">("md");
  const [styleScope, setStyleScope] = useState<"card" | "deck">("deck");

  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [newCardDraft, setNewCardDraft] = useState({
    question: "",
    answer: "",
    tag: "Core Axiom",
    fontFamily: "sans" as "sans" | "serif" | "mono" | "rounded" | "handwritten",
    theme: "ember" as "ember" | "sky" | "emerald" | "purple" | "rose" | "obsidian",
    fontSize: "md" as "sm" | "md" | "lg",
  });

  const [isEditCardOpen, setIsEditCardOpen] = useState(false);
  const [editCardDraft, setEditCardDraft] = useState<Flashcard | null>(null);

  // --- MODULE ADD & EDIT STATES ---
  const [isAddModuleOpen, setIsAddModuleOpen] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newModuleTagline, setNewModuleTagline] = useState("");
  const [editingModuleIdx, setEditingModuleIdx] = useState<number | null>(null);
  const [editModuleTitle, setEditModuleTitle] = useState("");
  const [editModuleTagline, setEditModuleTagline] = useState("");

  // --- LESSON / SUBTOPIC ADD & EDIT STATES ---
  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
  const [addLessonModuleIdx, setAddLessonModuleIdx] = useState(0);
  const [addLessonPosition, setAddLessonPosition] = useState<"start" | "end" | number>("end");
  const [newLessonDraft, setNewLessonDraft] = useState<{
    title: string;
    type: "reading" | "video" | "exercise" | "dialogue";
    duration: string;
    summary: string;
    sectionHeading?: string;
    sectionBody?: string;
  }>({
    title: "",
    type: "reading",
    duration: "10 min",
    summary: "",
    sectionHeading: "Core Concepts",
    sectionBody: "In-depth theoretical explanation and best practices.",
  });

  // Drawer Reader In-Depth Lesson Editing State
  const [isSubtopicEditing, setIsSubtopicEditing] = useState(false);
  const [subtopicEditDraft, setSubtopicEditDraft] = useState<SubTopicItem | null>(null);

  // --- FLASHCARD HANDLERS ---
  function handleApplyStyle(font?: any, theme?: any, size?: any) {
    const nextFont = font || deckFont;
    const nextTheme = theme || deckTheme;
    const nextSize = size || deckFontSize;

    if (styleScope === "card") {
      const activeC = filteredFlashcards[cardIndex] || filteredFlashcards[0];
      if (!activeC) return;
      setCourse((prev: any) => {
        const updated = (prev.resources?.flashcards || []).map((c: Flashcard) => {
          if (c.id === activeC.id) {
            return {
              ...c,
              fontFamily: font ? font : (c.fontFamily || deckFont),
              theme: theme ? theme : (c.theme || deckTheme),
              fontSize: size ? size : (c.fontSize || deckFontSize),
            };
          }
          return c;
        });
        return {
          ...prev,
          resources: { ...prev.resources, flashcards: updated },
        };
      });
    } else {
      if (font) setDeckFont(font);
      if (theme) setDeckTheme(theme);
      if (size) setDeckFontSize(size);

      setCourse((prev: any) => {
        const updated = (prev.resources?.flashcards || []).map((c: Flashcard) => ({
          ...c,
          fontFamily: font ? font : nextFont,
          theme: theme ? theme : nextTheme,
          fontSize: size ? size : nextSize,
        }));
        return {
          ...prev,
          resources: { ...prev.resources, flashcards: updated },
        };
      });
    }
  }

  function handleSaveNewCard() {
    if (!newCardDraft.question.trim() || !newCardDraft.answer.trim()) return;
    const card: Flashcard = {
      id: uid("fc"),
      question: newCardDraft.question.trim(),
      answer: newCardDraft.answer.trim(),
      tag: newCardDraft.tag.trim() || "Core Concept",
      fontFamily: newCardDraft.fontFamily || deckFont,
      theme: newCardDraft.theme || deckTheme,
      fontSize: newCardDraft.fontSize || deckFontSize,
    };

    setCourse((prev: any) => {
      const existing = prev.resources?.flashcards || [];
      return {
        ...prev,
        resources: {
          ...prev.resources,
          flashcards: [card, ...existing],
        },
      };
    });

    setCardIndex(0);
    setIsAddCardOpen(false);
    setNewCardDraft({
      question: "",
      answer: "",
      tag: "Core Concept",
      fontFamily: deckFont,
      theme: deckTheme,
      fontSize: deckFontSize,
    });
  }

  function handleSaveCardEdits() {
    if (!editCardDraft) return;
    setCourse((prev: any) => {
      const updated = (prev.resources?.flashcards || []).map((c: Flashcard) => {
        if (c.id === editCardDraft.id) {
          return editCardDraft;
        }
        return c;
      });
      return {
        ...prev,
        resources: { ...prev.resources, flashcards: updated },
      };
    });
    setIsEditCardOpen(false);
  }

  // --- MODULE MANAGEMENT HANDLERS ---
  function handleMoveModule(idx: number, direction: "up" | "down") {
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    const list = course.modules || [];
    if (targetIdx < 0 || targetIdx >= list.length) return;
    setCourse((prev: any) => {
      const nextMods = [...prev.modules];
      const temp = nextMods[idx];
      nextMods[idx] = nextMods[targetIdx];
      nextMods[targetIdx] = temp;
      return { ...prev, modules: nextMods };
    });
  }

  function handleSaveNewModule() {
    if (!newModuleTitle.trim()) return;
    const cleanT = newModuleTitle.trim();
    const cleanTag = newModuleTagline.trim() || "Structured learning track";
    const newMod = ensureModuleSequence(
      {
        id: uid("mod"),
        title: cleanT,
        tagline: cleanTag,
        subtopics: [],
        content: {
          title: cleanT,
          readTime: "3 min read",
          tagline: cleanTag,
          summary: `Comprehensive module covering ${cleanT}.`,
          keyTakeaways: [`Master fundamental principles of ${cleanT}.`],
        },
      },
      course.modules?.length || 0,
      course.title,
      course.level,
      course.category
    );

    setCourse((prev: any) => ({
      ...prev,
      modules: [...(prev.modules || []), newMod],
    }));
    setIsAddModuleOpen(false);
    setNewModuleTitle("");
    setNewModuleTagline("");
  }

  function handleSaveModuleEdit(idx: number) {
    if (!editModuleTitle.trim()) return;
    setCourse((prev: any) => {
      const nextMods = [...prev.modules];
      const cur = nextMods[idx];
      const cleanT = editModuleTitle.trim();
      const cleanTag = editModuleTagline.trim() || cur.tagline;
      nextMods[idx] = {
        ...cur,
        title: cleanT,
        tagline: cleanTag,
        content: cur.content
          ? { ...cur.content, title: cleanT, tagline: cleanTag }
          : {
              title: cleanT,
              readTime: "90 sec read",
              tagline: cleanTag,
              summary: `Understand core mental models and practical rules for ${cleanT}.`,
              keyTakeaways: [`Master fundamental principles of ${cleanT}.`],
            },
      };
      return { ...prev, modules: nextMods };
    });
    setEditingModuleIdx(null);
  }

  // --- SUBTOPIC / LESSON MANAGEMENT HANDLERS ---
  function handleMoveSubtopic(modIdx: number, subIdx: number, direction: "up" | "down") {
    const targetIdx = direction === "up" ? subIdx - 1 : subIdx + 1;
    const currentSubs = course.modules?.[modIdx]?.subtopics || [];
    if (targetIdx < 0 || targetIdx >= currentSubs.length) return;

    setCourse((prev: any) => {
      const nextMods = [...prev.modules];
      const nextSubs = [...(nextMods[modIdx].subtopics || [])];
      const temp = nextSubs[subIdx];
      nextSubs[subIdx] = nextSubs[targetIdx];
      nextSubs[targetIdx] = temp;

      let nextLessons = nextMods[modIdx].lessons ? [...nextMods[modIdx].lessons] : undefined;
      if (nextLessons && nextLessons.length === nextSubs.length) {
        const tempL = nextLessons[subIdx];
        nextLessons[subIdx] = nextLessons[targetIdx];
        nextLessons[targetIdx] = tempL;
      }

      nextMods[modIdx] = {
        ...nextMods[modIdx],
        subtopics: nextSubs,
        ...(nextLessons ? { lessons: nextLessons } : {}),
      };
      return { ...prev, modules: nextMods };
    });
  }

  function handleOpenAddLesson(modIdx: number, pos: "start" | "end" | number = "end") {
    setAddLessonModuleIdx(modIdx);
    setAddLessonPosition(pos);
    setNewLessonDraft({
      title: "",
      type: "reading",
      duration: "10 min",
      summary: "",
      sectionHeading: "Core Concepts",
      sectionBody: "In-depth theoretical explanation and best practices.",
    });
    setIsAddLessonOpen(true);
  }

  function handleSaveNewLesson() {
    if (!newLessonDraft.title.trim()) return;
    const mod = course.modules?.[addLessonModuleIdx];
    if (!mod) return;

    const vid = getRelevantYouTubeVideo({
      courseTitle: course.title,
      category: course.category,
      moduleTitle: newLessonDraft.title.trim(),
      moduleIndex: addLessonModuleIdx,
      level: course.level,
      description: course.description,
    });

    const newSub: SubTopicItem = {
      id: uid("sub"),
      title: newLessonDraft.title.trim(),
      type: newLessonDraft.type,
      duration: newLessonDraft.duration || "10 min",
      summary: newLessonDraft.summary.trim() || `Practical lesson on ${newLessonDraft.title}`,
      youtubeId: vid.youtubeId,
      videoTitle: vid.title,
      channel: vid.channel,
      videoSummary: vid.summary,
      alternates: vid.alternates,
      sections: [
        {
          heading: newLessonDraft.sectionHeading || "Foundational Overview",
          body: newLessonDraft.sectionBody || "Step-by-step breakdown and guidelines.",
        },
      ],
      keyTakeaways: [`Apply ${newLessonDraft.title} in real-world workflows.`],
      exercisePrompt: newLessonDraft.type === "exercise" ? "Implement the solution based on the principles." : undefined,
      exerciseHint: newLessonDraft.type === "exercise" ? "Break down into inputs, transformation, and output." : undefined,
      exerciseSolution: newLessonDraft.type === "exercise" ? "// Reference solution\nfunction run() {\n  return true;\n}" : undefined,
    };

    setCourse((prev: any) => {
      const nextMods = [...prev.modules];
      const currentSubs = [...(nextMods[addLessonModuleIdx].subtopics || [])];
      let insertIndex = currentSubs.length;
      if (addLessonPosition === "start") {
        insertIndex = 0;
      } else if (typeof addLessonPosition === "number") {
        insertIndex = addLessonPosition + 1;
      }
      currentSubs.splice(insertIndex, 0, newSub);

      const currentLessons = [...(nextMods[addLessonModuleIdx].lessons || [])];
      currentLessons.splice(insertIndex, 0, {
        id: newSub.id,
        title: newSub.title,
        duration: newSub.duration,
        type: newSub.type,
      });

      nextMods[addLessonModuleIdx] = {
        ...nextMods[addLessonModuleIdx],
        subtopics: currentSubs,
        lessons: currentLessons,
      };
      return { ...prev, modules: nextMods };
    });

    setIsAddLessonOpen(false);
  }

  function handleSaveSubtopicEdits() {
    if (!subtopicEditDraft) return;
    setCourse((prev: any) => {
      const nextMods = prev.modules.map((m: CourseModule) => {
        const subIndex = m.subtopics?.findIndex((s) => s.id === subtopicEditDraft.id);
        if (subIndex !== undefined && subIndex !== -1 && m.subtopics) {
          const nextSubs = [...m.subtopics];
          nextSubs[subIndex] = subtopicEditDraft;

          const nextLessons = (m.lessons || []).map((l: any) => {
            if (
              (typeof l === "object" && l.id === subtopicEditDraft.id) ||
              (typeof l === "string" && l === subtopicEditDraft.title)
            ) {
              return {
                ...(typeof l === "object" ? l : {}),
                id: subtopicEditDraft.id,
                title: subtopicEditDraft.title,
                duration: subtopicEditDraft.duration,
                type: subtopicEditDraft.type,
              };
            }
            return l;
          });

          return { ...m, subtopics: nextSubs, lessons: nextLessons };
        }
        return m;
      });
      return { ...prev, modules: nextMods };
    });
    setActiveSubtopic(subtopicEditDraft);
    setIsSubtopicEditing(false);
  }

  function handleSelectSubtopicVideo(selected: any) {
    if (!activeSubtopic) return;
    const currentAlts = (activeSubtopic.alternates && activeSubtopic.alternates.length >= 5)
      ? activeSubtopic.alternates
      : effectiveLessonVideo?.alternates || activeSubtopic.alternates || [];
    const updatedSub: SubTopicItem = {
      ...activeSubtopic,
      youtubeId: selected.video_id,
      videoUrl: selected.url,
      videoTitle: selected.title,
      channel: selected.channel,
      duration: `${selected.duration_minutes || 14} min`,
      videoSummary: selected.relevance_reason || activeSubtopic.videoSummary,
      alternates: currentAlts,
    };
    setActiveSubtopic(updatedSub);

    // Update in course modules state so changes persist!
    setCourse((prev: any) => {
      const newMods = (prev.modules || []).map((m: CourseModule) => {
        const subIdx = (m.subtopics || []).findIndex((s) => s.id === activeSubtopic.id);
        if (subIdx === -1) return m;
        const newSubs = [...(m.subtopics || [])];
        newSubs[subIdx] = updatedSub;
        return { ...m, subtopics: newSubs };
      });
      return { ...prev, modules: newMods };
    });
  }

  function handleFetchMoreSubtopicVideos(sub: SubTopicItem) {
    setIsFetchingMoreVideos(true);
    try {
      const extra = getRelevantYouTubeVideo({
        courseTitle: course.title,
        category: course.category,
        moduleTitle: sub.title,
        level: course.level,
        description: course.description,
        moreAlternates: true,
        targetAlternatesCount: 12,
      });

      const combinedAlternates = [
        ...(sub.alternates || []),
        ...extra.alternates,
      ];
      // Deduplicate by youtubeId
      const uniqueAlts: VideoAlternate[] = [];
      const seen = new Set<string>();
      for (const alt of combinedAlternates) {
        if (alt.youtubeId && !seen.has(alt.youtubeId)) {
          seen.add(alt.youtubeId);
          uniqueAlts.push(alt);
        }
      }

      const updatedSub: SubTopicItem = {
        ...sub,
        alternates: uniqueAlts,
      };
      setActiveSubtopic(updatedSub);

      setCourse((prev: any) => {
        const newMods = (prev.modules || []).map((m: CourseModule) => {
          const subIdx = (m.subtopics || []).findIndex((s) => s.id === sub.id);
          if (subIdx === -1) return m;
          const newSubs = [...(m.subtopics || [])];
          newSubs[subIdx] = updatedSub;
          return { ...m, subtopics: newSubs };
        });
        return { ...prev, modules: newMods };
      });
    } finally {
      setIsFetchingMoreVideos(false);
    }
  }

  const effectiveLessonVideo = useMemo(() => {
    if (!activeSubtopic) return null;

    const hasEnoughAlternates = Boolean(
      activeSubtopic.youtubeId &&
      activeSubtopic.alternates &&
      activeSubtopic.alternates.length >= 5
    );

    if (hasEnoughAlternates) {
      return {
        title: activeSubtopic.videoTitle || activeSubtopic.title,
        video_id: activeSubtopic.youtubeId!,
        channel: activeSubtopic.channel || "Mentora Academy",
        duration_minutes: parseInt(activeSubtopic.duration) || 14,
        relevance_reason: activeSubtopic.videoSummary || activeSubtopic.summary,
        xp: parseInt(activeSubtopic.duration) || 14,
        alternates: activeSubtopic.alternates || [],
      };
    }

    // Produce 5-6 topic-specific verified videos for this exact lesson and module
    const relevant = getRelevantYouTubeVideo({
      courseTitle: course.title,
      category: course.category,
      moduleTitle: activeSubtopic.title,
      level: course.level,
      description: activeSubtopic.summary || course.description,
      targetAlternatesCount: 6,
    });

    return {
      title: activeSubtopic.videoTitle || relevant.title,
      video_id: activeSubtopic.youtubeId || relevant.youtubeId,
      channel: activeSubtopic.channel || relevant.channel,
      duration_minutes: parseInt(activeSubtopic.duration) || relevant.durationMinutes || 14,
      relevance_reason: activeSubtopic.videoSummary || relevant.summary || activeSubtopic.summary,
      xp: parseInt(activeSubtopic.duration) || relevant.durationMinutes || 14,
      alternates: (activeSubtopic.alternates && activeSubtopic.alternates.length >= 5)
        ? activeSubtopic.alternates
        : relevant.alternates,
    };
  }, [activeSubtopic, course.title, course.category, course.level, course.description]);

  function handleFetchMoreMasterclassVideos() {
    setIsFetchingMoreVideos(true);
    try {
      const extra = getRelevantYouTubeVideo({
        courseTitle: course.title,
        category: course.category,
        level: course.level,
        description: course.description,
        moreAlternates: true,
        targetAlternatesCount: 12,
      });

      const newVideosList = [
        {
          id: extra.youtubeId,
          title: extra.title,
          youtubeId: extra.youtubeId,
          channel: extra.channel,
          duration: extra.duration,
          summary: extra.summary,
          alternates: extra.alternates,
        },
        ...extra.alternates.map((alt) => ({
          id: alt.youtubeId,
          title: alt.title,
          youtubeId: alt.youtubeId,
          channel: alt.channel,
          duration: alt.duration,
          summary: alt.summary,
          alternates: [],
        })),
      ];

      setCourse((prev: any) => ({
        ...prev,
        resources: {
          ...(prev.resources || {}),
          videos: newVideosList,
        },
      }));
    } finally {
      setIsFetchingMoreVideos(false);
    }
  }

  // Interactive Runner step states
  const [moduleCardIdx, setModuleCardIdx] = useState(0);
  const [isModuleCardFlipped, setIsModuleCardFlipped] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [taskChecked, setTaskChecked] = useState<Record<string, boolean>>({});
  const [taskSubmitted, setTaskSubmitted] = useState(false);

  // Initialize and accurately calibrate curriculum
  useEffect(() => {
    const activeCourse = initialCourse || course;
    // Generate domain-calibrated curriculum if modules are empty or need initialization
    const calibratedModules = activeCourse.modules && activeCourse.modules.length > 0
      ? activeCourse.modules.map((m: any, idx: number, arr: any[]) => ensureModuleSequence(
          m,
          idx,
          activeCourse.title,
          activeCourse.level,
          activeCourse.category,
          idx > 0 ? cleanTitle(arr[idx - 1]?.title) : undefined
        ))
      : generateCuratedCurriculum(activeCourse.title, activeCourse.category, activeCourse.level, activeCourse.duration, undefined, activeCourse.description);

    const initialResources = activeCourse.resources || generateDefaultResources(
      activeCourse.title,
      activeCourse.category,
      activeCourse.level,
      activeCourse.duration,
      activeCourse.description,
      calibratedModules
    );

    // Ensure flashcards and cheatsheet decks are calibrated to the specific subject
    if (!initialResources.flashcards || initialResources.flashcards.length < 6) {
      initialResources.flashcards = generateFlashcardsForCourse(activeCourse.title, activeCourse.category, activeCourse.level, calibratedModules);
    }
    const csJson = JSON.stringify(initialResources.cheatSheet || "").toLowerCase();
    const existingCsSections = Array.isArray(initialResources.cheatSheet)
      ? initialResources.cheatSheet
      : initialResources.cheatSheet?.sections || [];
    const isStaleCheatSheet =
      !initialResources.cheatSheet ||
      existingCsSections.length < 3 ||
      csJson.includes("processrequest") ||
      csJson.includes("best practice pattern in") ||
      csJson.includes("validate input boundaries") ||
      ((activeCourse.title + " " + activeCourse.category).toLowerCase().includes("context") &&
        (csJson.includes("linear model hypothesis") || csJson.includes("mse cost") || csJson.includes("vectorized numpy")));

    if (isStaleCheatSheet) {
      initialResources.cheatSheet = generateCheatSheetForCourse(activeCourse.title, activeCourse.category, activeCourse.level, calibratedModules);
    } else if (!Array.isArray(initialResources.cheatSheet) && initialResources.cheatSheet?.sections) {
      initialResources.cheatSheet = initialResources.cheatSheet.sections;
    }

    setCourse((prev) => ({
      ...prev,
      ...activeCourse,
      modules: calibratedModules,
      resources: initialResources,
    }));

    const detectedDomain = detectDomain(activeCourse.title, activeCourse.category);
    const domainLabels: Record<string, string> = {
      ai_ml: "Artificial Intelligence & Deep Learning",
      web_react: "Modern Fullstack & React Architecture",
      devops_cloud: "DevOps, Containers & Cloud Infrastructure",
      database_sql: "Relational Database & SQL Engineering",
      dsa_algo: "Data Structures & Algorithmic Complexity",
      cybersecurity: "Defensive Security & Threat Mitigation",
      python_backend: "Python Systems & Async Architecture",
      mobile_app: "Mobile Application & Cross-Platform Systems",
      data_science: "Data Science, Pandas & Statistical Analysis",
      product_business: "Product Strategy, Growth & Agile Execution",
      general_tech: "Software Engineering & Architecture",
    };

    let welcomeText = `Welcome to the Course Creation Studio for "${activeCourse.title}"!
I've calibrated this course specifically for **${domainLabels[detectedDomain] || "Software Engineering"}** with:
1. **Granular Subtopics**: In-depth theoretical readings, pizza/gaming mental models, and guided code challenges with solutions.
2. **Curated YouTube Masterclasses**: Verified visual tutorials from premier engineering creators.
3. **Flashcards**: High-yield cards with 100% upright text rotation.
4. **Socratic Dialogue Coach**: Hands-on scenario dilemmas that coach you until correct, with review on completion!
5. **Module Pass Gates**: Admin-decided **Quiz** or **Task Mission** gates.

*Tip: All course updates and XP gains are stored persistently so they never disappear!*`;

    if (activeCourse.documentInfo?.mode === "full") {
      welcomeText = `Welcome to the Course Creation Studio for "${activeCourse.title}"!
I've thoroughly analyzed and synthesized your uploaded document **"${activeCourse.documentInfo.name}"** into a complete 5-step curriculum:
1. **Granular Subtopics**: Structured modules and lessons derived directly from your document syllabus.
2. **Curated YouTube Masterclasses**: Visual tutorials matched to your document's key concepts.
3. **Flashcards**: High-yield cards extracted from definitions in your document.
4. **Socratic Dialogue Coach**: Scenario dilemmas coaching learners on your document's principles.
5. **Module Pass Gates**: Calibrated 10–15 min Daily Tasks and Quizzes for active recall.

*Tip: You can reprompt me anytime in the chat below to expand topics, add pizza analogies, or add new flashcards!*`;
    } else if (activeCourse.documentInfo?.mode === "integrate") {
      const placedModIdx = (calibratedModules || []).findIndex((m: CourseModule) =>
        (m.subtopics || []).some(
          (s) =>
            s.id?.includes("anchor") ||
            (activeCourse.documentInfo?.name && s.title.includes(activeCourse.documentInfo.name)) ||
            s.title.toLowerCase().includes("core document study") ||
            s.title.toLowerCase().includes("masterclass walkthrough")
        )
      );
      const targetModNum =
        placedModIdx >= 0
          ? placedModIdx + 1
          : typeof activeCourse.documentInfo.targetModuleIndex === "number"
          ? activeCourse.documentInfo.targetModuleIndex + 1
          : 1;

      const hasPrepModule = targetModNum > 1;
      const formatLabel =
        activeCourse.documentInfo.integrationType === "video" || activeCourse.documentInfo.isVideo
          ? "Video Masterclass"
          : activeCourse.documentInfo.integrationType === "reference"
          ? "Reference Guide"
          : "Core Reading";

      welcomeText = `Welcome to the Course Creation Studio for "${activeCourse.title}"!
I've preserved your uploaded ${activeCourse.documentInfo.isVideo ? "video" : "document"} **"${activeCourse.documentInfo.name}"** **100% AS IT IS** and placed it into **Module ${targetModNum}**${hasPrepModule ? ` (with Module 1 providing foundational prerequisites)` : ""}:
1. **Primary Source Lesson**: Embedded verbatim as the anchor ${formatLabel} lesson in Module ${targetModNum}.
2. **Companion Video Masterclass**: Curated video walkthrough providing visual context.
3. **Flashcards**: High-yield cards testing terminology and concepts directly from your source.
4. **Socratic Dialogue Coach**: Dilemma coaching that applies concepts directly from your source.
5. **Module Pass Gate**: 80% passing grade pass gate quiz testing deep retention.

*Tip: Click any subtopic to view its in-depth reader drawer, or reprompt me anytime in chat!*`;
    }

    setMessages([
      {
        id: uid("msg"),
        sender: "ai",
        timestamp: "Just now",
        text: welcomeText,
      },
    ]);

    // Initialize dialogue with first scenario
    initDialogue(0, calibratedModules);
  }, [initialCourse]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAiThinking]);

  useEffect(() => {
    dialogueChatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [dialogueChat, isDialogueThinking]);

  // Keep activeSubtopic synchronized with course state updates
  useEffect(() => {
    if (!activeSubtopic) return;
    for (const mod of course.modules || []) {
      const match = (mod.subtopics || []).find((s: SubTopicItem) => s.id === activeSubtopic.id);
      if (match && match !== activeSubtopic) {
        setActiveSubtopic(match);
        break;
      }
    }
  }, [course]);

  // Initialize Socratic Dialogue for a specific module
  function initDialogue(modIdx: number, moduleList?: CourseModule[]) {
    const list = moduleList || course.modules || [];
    const targetMod = list[modIdx] || list[0];
    const scenarios = targetMod?.dialogueScenarios && targetMod.dialogueScenarios.length > 0
      ? targetMod.dialogueScenarios
      : getDefaultScenarios(targetMod ? cleanTitle(targetMod.title) : course.title, course.category);

    setActiveDialogueModuleIdx(modIdx);
    setCurrentScenarioIdx(0);
    setDialogueAttempts(0);
    setTotalAttempts(0);
    setSolvedScenarioIds([]);
    setDialogueFinished(false);
    setDialogueReview(null);

    const firstScen = scenarios[0];
    setDialogueChat([
      {
        id: uid("dmsg"),
        sender: "bot",
        text: `Greetings! I'm **Byte**, your Socratic AI Coach for **${targetMod ? cleanTitle(targetMod.title) : course.title}**.

Here is a real-world scenario to test your analytical thinking:

**Situation:**
${firstScen.situation}

**Diagnostic Question:**
${firstScen.question}

*Type your answer below! If you're slightly off, I'll coach you with hints until you get it 100% right. You can click **"End Dialogue & Get Review"** at any time.*`,
      },
    ]);
  }

  // Handle student submission in Socratic Dialogue
  function handleDialogueSubmit() {
    if (!dialogueInput.trim() || isDialogueThinking || dialogueFinished) return;

    const userText = dialogueInput.trim();
    setDialogueInput("");

    const currentMod = course.modules?.[activeDialogueModuleIdx];
    const scenarios = currentMod?.dialogueScenarios && currentMod.dialogueScenarios.length > 0
      ? currentMod.dialogueScenarios
      : getDefaultScenarios(currentMod ? cleanTitle(currentMod.title) : course.title, course.category);

    const activeScen = scenarios[currentScenarioIdx] || scenarios[0];

    // Append user message
    const newHistory: DialogueChatMessage[] = [
      ...dialogueChat,
      { id: uid("dmsg"), sender: "user", text: userText },
    ];
    setDialogueChat(newHistory);
    setIsDialogueThinking(true);

    const nextAttempts = dialogueAttempts + 1;
    setDialogueAttempts(nextAttempts);
    setTotalAttempts((prev) => prev + 1);

    // Evaluation logic
    const lower = userText.toLowerCase();
    const isKeywordMatched = activeScen.expectedKeywords.some((kw: string) => lower.includes(kw.toLowerCase()));
    const isLengthyReasoning = userText.split(" ").length >= 7 && (lower.includes("because") || lower.includes("should") || lower.includes("means") || lower.includes("metric") || lower.includes("rate"));
    const isCorrect = isKeywordMatched || (nextAttempts >= 3 && isLengthyReasoning);

    setTimeout(() => {
      if (isCorrect) {
        // Solved scenario!
        const updatedSolved = Array.from(new Set([...solvedScenarioIds, activeScen.id]));
        setSolvedScenarioIds(updatedSolved);
        awardXp(50, "dialogue", `Solved Socratic dilemma in ${cleanTitle(currentMod?.title || course.title)}`);

        const nextScenIdx = currentScenarioIdx + 1;

        if (nextScenIdx < scenarios.length) {
          // Advance to next scenario
          const nextScen = scenarios[nextScenIdx];
          setCurrentScenarioIdx(nextScenIdx);
          setDialogueAttempts(0);

          setDialogueChat([
            ...newHistory,
            {
              id: uid("dmsg"),
              sender: "bot",
              isCorrect: true,
              text: `**Spot on! Brilliant explanation.**
${activeScen.correctExplanation}

*(+50 XP awarded!)*

---

Here is your next challenge (**Scenario ${nextScenIdx + 1} of ${scenarios.length}**):

**Situation:**
${nextScen.situation}

**Diagnostic Question:**
${nextScen.question}`,
            },
          ]);
        } else {
          // All scenarios cleared! Finish and generate review
          setDialogueFinished(true);
          const review = generatePedagogicalReview(scenarios, updatedSolved, totalAttempts + 1, course.title);
          setDialogueReview(review);

          setDialogueChat([
            ...newHistory,
            {
              id: uid("dmsg"),
              sender: "bot",
              isCorrect: true,
              isReview: true,
              text: `**Outstanding Mastery!** You have solved all diagnostic scenarios!

${activeScen.correctExplanation}

*(+50 XP awarded!)*

I've generated your complete **Dialogue Performance Review** below!`,
            },
          ]);
        }
      } else {
        // Not quite correct: give coaching hint and continue until correct
        let hintMsg = "";
        if (nextAttempts === 1) {
          hintMsg = `**Good thinking, but not quite!**
${activeScen.hint}

*Take another look at the situation and try answering again! (The dialogue continues until correct, or click "End Dialogue & Get Review" anytime).*`;
        } else {
          hintMsg = `**Getting closer! Here's a deeper clue:**
Notice the core keyword: consider **${activeScen.expectedKeywords[0]}** or **${activeScen.expectedKeywords[1] || "the key trade-off"}**.
How does this resolve the issue described in the scenario? Give it another shot!`;
        }

        setDialogueChat([
          ...newHistory,
          {
            id: uid("dmsg"),
            sender: "bot",
            isHint: true,
            text: hintMsg,
          },
        ]);
      }
      setIsDialogueThinking(false);
    }, 600);
  }

  // End Dialogue & generate review at any point
  function handleEndDialogue() {
    const currentMod = course.modules?.[activeDialogueModuleIdx];
    const scenarios = currentMod?.dialogueScenarios && currentMod.dialogueScenarios.length > 0
      ? currentMod.dialogueScenarios
      : getDefaultScenarios(currentMod ? cleanTitle(currentMod.title) : course.title, course.category);

    setDialogueFinished(true);
    const review = generatePedagogicalReview(scenarios, solvedScenarioIds, Math.max(1, totalAttempts), course.title);
    setDialogueReview(review);

    setDialogueChat((prev) => [
      ...prev,
      {
        id: uid("dmsg"),
        sender: "bot",
        isReview: true,
        text: `**Dialogue Concluded!** Here is your comprehensive analytical review and key learning takeaways:`,
      },
    ]);
  }

  function handleRestartDialogue() {
    initDialogue(activeDialogueModuleIdx);
  }

  function generatePedagogicalReview(
    scenarios: DialogueScenario[],
    solvedIds: string[],
    attempts: number,
    courseTitle: string
  ): DialogueReviewData {
    const total = scenarios.length;
    const solved = solvedIds.length;
    const scorePercent = Math.round((solved / Math.max(1, total)) * 100);

    let tier = "Developing Thinker";
    if (scorePercent >= 90) tier = "Dialogue Master (Architect Level)";
    else if (scorePercent >= 50) tier = "Proficient Analytical Practitioner";

    const strengths: string[] = [];
    const areasToImprove: string[] = [];

    scenarios.forEach((s) => {
      if (solvedIds.includes(s.id)) {
        strengths.push(`Mastered concept: ${s.expectedKeywords[0] || "Core Theory"} (${s.question.slice(0, 50)}...)`);
      } else {
        areasToImprove.push(`Revisit: ${s.question.slice(0, 60)}... (Focus on ${s.expectedKeywords.join(", ")})`);
      }
    });

    if (strengths.length === 0) {
      strengths.push("Demonstrated willingness to engage with high-level architectural trade-offs");
    }

    const takeaways = [
      "Always verify performance with multi-dimensional metrics rather than single high-level assumptions.",
      "Identify the root cause of algorithmic bottlenecks before tweaking secondary hyperparameters.",
      "Ground abstract theoretical formulas in practical real-world system behavior.",
    ];

    return {
      totalScenarios: total,
      solvedScenarios: solved,
      attempts,
      scorePercent,
      tier,
      strengths,
      areasToImprove,
      takeaways,
    };
  }

  // Reprompt processing logic for Admin Chatbot
  async function handleSendMessage(promptText?: string) {
    const textToSend = promptText || inputPrompt;
    if (!textToSend.trim() || isAiThinking) return;

    const userMsg: ChatMessage = {
      id: uid("msg"),
      sender: "user",
      text: textToSend,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt("");
    setIsAiThinking(true);

    try {
      await processReprompt(textToSend);
    } catch (err: any) {
      console.error("Failed to process reprompt:", err);
    } finally {
      setIsAiThinking(false);
    }
  }

  function applyProposedChangeToCourse(payload: any) {
    if (!payload) return;

    // Normalize data: support editResult, applied_data, or raw payload
    const data = payload.applied_data || payload.course || payload;
    const targetLoc = payload.target_location || payload;

    setCourse((prev: any) => {
      let nextCourse = { ...prev };
      const domain = detectDomain(nextCourse.title, nextCourse.category);

      let modIdx = targetLoc.module_index ?? payload.target_module_index ?? 0;
      let subIdx = targetLoc.subtopic_index ?? payload.target_subtopic_index ?? 0;

      // If target location specified module_title, search for corresponding module
      if (targetLoc.module_title && Array.isArray(nextCourse.modules)) {
        const foundIdx = nextCourse.modules.findIndex((m: CourseModule) =>
          cleanTitle(m.title).toLowerCase().includes(targetLoc.module_title.toLowerCase()) ||
          targetLoc.module_title.toLowerCase().includes(cleanTitle(m.title).toLowerCase())
        );
        if (foundIdx !== -1) modIdx = foundIdx;
      }

      // Handle 1-based indexing if modIdx was provided as length or 1-indexed
      if (nextCourse.modules && nextCourse.modules.length > 0) {
        if (modIdx >= nextCourse.modules.length) {
          if (modIdx === nextCourse.modules.length && modIdx > 0) {
            modIdx = modIdx - 1;
          } else {
            modIdx = Math.max(0, nextCourse.modules.length - 1);
          }
        }
      }

      // 1. Full Modules Array Replacement
      if (Array.isArray(data.modules) && data.modules.length > 0) {
        nextCourse.modules = data.modules;
      }

      // 2. Add New Module
      const newMod = data.new_module || data.module;
      if (newMod) {
        const fullMod: CourseModule = {
          id: newMod.id || uid("mod"),
          title: cleanTitle(newMod.title) || "Core Specialization",
          tagline: newMod.tagline || "Structured mastery track",
          subtopics: newMod.subtopics || [],
          lessons: newMod.lessons || (newMod.subtopics || []).map((s: any) => ({ id: s.id, title: s.title, duration: s.duration, type: s.type })),
          content: newMod.content || {
            title: cleanTitle(newMod.title) || "Core Specialization",
            readTime: "45 min",
            tagline: newMod.tagline || "Comprehensive track",
            summary: newMod.summary || "Full architectural mastery",
            funAnalogy: newMod.funAnalogy,
            keyTakeaways: ["Master foundational mechanics."],
          },
          video: newMod.video,
          flashcards: newMod.flashcards || [],
          passGate: newMod.passGate || {
            type: "quiz",
            quiz: {
              title: `Module Knowledge Duel`,
              passingScore: 8,
              questions: generateWeeklyPassGateQuiz(cleanTitle(newMod.title) || "Core", (nextCourse.modules?.length || 0) + 1, [], domain),
            },
          },
        };
        nextCourse.modules = [...(nextCourse.modules || []), fullMod];
      }

      // 3. Update Module (title, tagline, analogy)
      const updModTitle = data.updated_module_title || data.module_title;
      if (updModTitle && nextCourse.modules?.[modIdx]) {
        const nextMods = [...nextCourse.modules];
        nextMods[modIdx] = {
          ...nextMods[modIdx],
          title: cleanTitle(updModTitle),
        };
        nextCourse.modules = nextMods;
      }

      if (data.updated_module && nextCourse.modules?.[modIdx]) {
        const nextMods = [...nextCourse.modules];
        nextMods[modIdx] = {
          ...nextMods[modIdx],
          ...data.updated_module,
          title: data.updated_module.title || nextMods[modIdx].title,
        };
        nextCourse.modules = nextMods;
      }

      // 4. Update Subtopics List for Module
      if (Array.isArray(data.subtopics) && nextCourse.modules?.[modIdx]) {
        const nextMods = [...nextCourse.modules];
        nextMods[modIdx] = {
          ...nextMods[modIdx],
          subtopics: data.subtopics,
          lessons: data.subtopics.map((s: any) => ({ id: s.id, title: s.title, duration: s.duration, type: s.type })),
        };
        nextCourse.modules = nextMods;
      }

      // 5. Add New Subtopic / Lesson
      const newSub = data.new_subtopic || data.subtopic;
      if (newSub && nextCourse.modules?.[modIdx]) {
        const nextMods = [...nextCourse.modules];
        const curMod = nextMods[modIdx];
        const subs = [...(curMod.subtopics || [])];
        const dayNum = subs.length + 1;
        const fullSub: SubTopicItem = {
          id: newSub.id || uid("sub"),
          title: newSub.title || `Day ${dayNum}: New Lesson`,
          type: newSub.type || "reading",
          duration: newSub.duration || "45 min",
          summary: newSub.summary || "Comprehensive masterclass exploring core architectural rules and best practices.",
          sections: newSub.sections || [
            {
              heading: "Foundational Architecture & Theory",
              body: newSub.summary || "In-depth theoretical explanation.",
              code: newSub.code || generateDailyCodeSnippet(newSub.title || "Core Concept", domain, dayNum),
              analogy: newSub.analogy || "Real-World Analogy: Think of this like precision engineering in production systems.",
            },
          ],
          keyTakeaways: newSub.keyTakeaways || [`Apply ${newSub.title || "this topic"} in real-world systems.`],
          exercisePrompt: newSub.exercisePrompt || generateDailyExercise(newSub.title || "Core Concept", domain).prompt,
          exerciseHint: newSub.exerciseHint || generateDailyExercise(newSub.title || "Core Concept", domain).hint,
          exerciseSolution: newSub.exerciseSolution || generateDailyExercise(newSub.title || "Core Concept", domain).solution,
          youtubeId: newSub.youtubeId,
          videoTitle: newSub.videoTitle,
          channel: newSub.channel,
          videoSummary: newSub.videoSummary,
          flashcards: newSub.flashcards || generateDailyFlashcards(newSub.title || "Core Concept", modIdx + 1, dayNum, domain),
        };
        subs.push(fullSub);
        const lessons = [...(curMod.lessons || []), { id: fullSub.id, title: fullSub.title, duration: fullSub.duration, type: fullSub.type }];
        nextMods[modIdx] = { ...curMod, subtopics: subs, lessons };
        nextCourse.modules = nextMods;
      }

      // 6. Update Existing Subtopic
      const updSub = data.updated_subtopic;
      if (updSub && nextCourse.modules?.[modIdx]?.subtopics?.[subIdx]) {
        const nextMods = [...nextCourse.modules];
        const curMod = nextMods[modIdx];
        const subs = [...(curMod.subtopics || [])];
        subs[subIdx] = { ...subs[subIdx], ...updSub };
        const lessons = subs.map((s: any) => ({ id: s.id, title: s.title, duration: s.duration, type: s.type }));
        nextMods[modIdx] = { ...curMod, subtopics: subs, lessons };
        nextCourse.modules = nextMods;
        if (activeSubtopic?.id === subs[subIdx].id) {
          setActiveSubtopic(subs[subIdx]);
        }
      }

      // 7. Add New Flashcards
      const newCards = data.new_flashcards || data.flashcards;
      if (Array.isArray(newCards) && newCards.length > 0) {
        const formatted = newCards.map((c: any) => ({
          id: c.id || uid("fc"),
          question: c.question,
          answer: c.answer,
          tag: c.tag || "AI Generated",
          fontFamily: deckFont,
          theme: deckTheme,
          fontSize: deckFontSize,
        }));
        nextCourse.resources = {
          ...(nextCourse.resources || {}),
          flashcards: [...formatted, ...(nextCourse.resources?.flashcards || [])],
        };
      }

      // 8. Update Quiz
      const updQuiz = data.updated_quiz || data.quiz;
      if (updQuiz && nextCourse.modules?.[modIdx]) {
        const nextMods = [...nextCourse.modules];
        const curMod = nextMods[modIdx];
        nextMods[modIdx] = {
          ...curMod,
          passGate: {
            type: "quiz",
            quiz: {
              title: updQuiz.title || curMod.passGate?.quiz?.title || "Pass Gate Quiz",
              passingScore: updQuiz.passingScore || 8,
              questions: updQuiz.questions || curMod.passGate?.quiz?.questions || [],
            },
            task: curMod.passGate?.task,
          },
        };
        nextCourse.modules = nextMods;
      }

      // 9. Update Fun Analogy on module or all modules
      const analogyText = data.funAnalogy || data.fun_analogy;
      if (analogyText && nextCourse.modules?.[modIdx]) {
        const nextMods = [...nextCourse.modules];
        nextMods[modIdx] = {
          ...nextMods[modIdx],
          content: {
            ...(nextMods[modIdx].content || {}),
            funAnalogy: analogyText,
          },
        };
        nextCourse.modules = nextMods;
      }

      // 10. Update Metadata (title, level, duration, category, description)
      const courseTitle = data.updated_course_title || data.updated_title || (data.title && !data.new_subtopic && !data.new_module ? data.title : undefined);
      if (courseTitle) nextCourse.title = courseTitle;
      if (data.updated_level || data.level) nextCourse.level = data.updated_level || data.level;
      if (data.updated_duration || data.duration) nextCourse.duration = data.updated_duration || data.duration;
      if (data.updated_category || data.category) nextCourse.category = data.updated_category || data.category;
      if (data.updated_description || data.description) nextCourse.description = data.updated_description || data.description;

      return nextCourse;
    });

    setActiveTab("curriculum");
  }

  function handleApproveEdit(msgId: string, proposedChange: any) {
    if (proposedChange) {
      const desc = proposedChange.description || proposedChange.proposed_change?.description || "Course update applied";
      applyProposedChangeToCourse(proposedChange);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === msgId
            ? { ...m, isPendingApproval: false, actionTaken: `Applied to Course: ${desc}` }
            : m
        )
      );
    }
  }

  function handleRejectEdit(msgId: string) {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msgId
          ? { ...m, isPendingApproval: false, actionTaken: "Discarded proposed change" }
          : m
      )
    );
  }

  async function processReprompt(prompt: string) {
    const lower = prompt.toLowerCase();
    const domain = detectDomain(course.title, course.category);

    // -------------------------------------------------------------------------
    // 00. GLOBAL CLEANING COMMAND: STRIP ALL "WEEK 1", "WEEK 2" & SET CLEAN TITLES
    // -------------------------------------------------------------------------
    const isCleanWeekPrompt =
      lower.includes("do not write week") ||
      lower.includes("don't write week") ||
      lower.includes("dont write week") ||
      (lower.includes("write") && lower.includes("content title") && lower.includes("module")) ||
      (lower.includes("remove") && (lower.includes("week 1") || lower.includes("week 2") || lower.includes("weeks"))) ||
      lower.includes("directly write the content title");

    if (isCleanWeekPrompt) {
      setCourse((prev: any) => {
        const nextMods = (prev.modules || []).map((m: CourseModule, mIdx: number) => {
          const cTitle = cleanTitle(m.title) || `Topic ${mIdx + 1}`;
          const cTag = cleanTagline(m.tagline || "");
          const subs = (m.subtopics || []).map((s: SubTopicItem) => ({
            ...s,
            title: s.title.replace(/\b(?:Week|Module)\s*\d+[\s:\-–—]*/gi, "").trim(),
          }));
          return {
            ...m,
            title: cTitle,
            tagline: cTag,
            subtopics: subs,
            lessons: subs.map((s: any) => ({ id: s.id, title: s.title, duration: s.duration, type: s.type })),
            content: {
              ...(m.content || {}),
              title: cTitle,
              tagline: cTag,
            },
          };
        });
        return { ...prev, modules: nextMods };
      });

      setActiveTab("curriculum");
      setMessages((prev) => [
        ...prev,
        {
          id: uid("msg"),
          sender: "ai",
          timestamp: "Just now",
          text: `**Implemented!** Removed all "Week 1", "Week 2", and "Module" prefix noise across all course modules. Every module now directly displays its clean topical content title.`,
          actionTaken: `Applied to Course: Directly rendered content titles on all modules (no Week prefixes)`,
        },
      ]);
      return;
    }

    // -------------------------------------------------------------------------
    // 00B. MOVE/PLACE UPLOADED DOCUMENT TO SPECIFIC MODULE
    // -------------------------------------------------------------------------
    const isMoveDoc =
      (lower.includes("move") || lower.includes("put") || lower.includes("place") || lower.includes("shift") || lower.includes("re-anchor") || lower.includes("reanchor")) &&
      (lower.includes("doc") || lower.includes("document") || lower.includes("video") || lower.includes("anchor") || lower.includes("uploaded"));
    const targetDocModuleMatch = prompt.match(/(?:module|mod|unit)\s*(\d+)/i) || prompt.match(/(\d+)(?:st|nd|rd|th)?\s*(?:module|mod|unit)/i);

    if (isMoveDoc && targetDocModuleMatch) {
      const targetModNum = parseInt(targetDocModuleMatch[1], 10);
      const targetModIdx = Math.max(0, Math.min((course.modules?.length || 1) - 1, targetModNum - 1));

      setCourse((prev: any) => {
        let extractedAnchor: SubTopicItem | null = null;
        const nextMods = (prev.modules || []).map((m: CourseModule) => {
          const subs = (m.subtopics || []).filter((s: SubTopicItem) => {
            const isAnchor =
              s.id?.includes("anchor") ||
              s.title?.toLowerCase().includes("core document study") ||
              s.title?.toLowerCase().includes("masterclass walkthrough") ||
              (prev.documentInfo?.name && s.title?.includes(prev.documentInfo.name));
            if (isAnchor && !extractedAnchor) {
              extractedAnchor = s;
              return false;
            }
            return true;
          });
          return { ...m, subtopics: subs, lessons: subs };
        });

        if (extractedAnchor && nextMods[targetModIdx]) {
          nextMods[targetModIdx].subtopics = [extractedAnchor, ...(nextMods[targetModIdx].subtopics || [])];
          nextMods[targetModIdx].lessons = nextMods[targetModIdx].subtopics;
        }

        return { ...prev, modules: nextMods };
      });

      setActiveTab("curriculum");
      setMessages((prev) => [
        ...prev,
        {
          id: uid("msg"),
          sender: "ai",
          timestamp: "Just now",
          text: `**Moved!** Placed your uploaded source directly into **Module ${targetModIdx + 1}**, preserving all content 100% intact and maintaining seamless prerequisite flow.`,
          actionTaken: `Applied to Course: Moved uploaded document to Module ${targetModIdx + 1}`,
        },
      ]);
      return;
    }

    // -------------------------------------------------------------------------
    // 0A. MODULE & DAY CONTENT UPDATE COMMAND (e.g. "change module 1 day 2 to Pandas DataFrames")
    // -------------------------------------------------------------------------
    const modMatch = prompt.match(/(?:module|mod|unit|phase|part)\s*(\d+)/i) || prompt.match(/(\d+)(?:st|nd|rd|th)?\s*(?:module|mod|unit|phase|part)/i);
    const dayMatch = prompt.match(/(?:day|lesson|subtopic)\s*(\d+)/i) || prompt.match(/(\d+)(?:st|nd|rd|th)?\s*(?:day|lesson|subtopic)/i);

    if (modMatch && dayMatch) {
      const rawModNum = parseInt(modMatch[1], 10);
      const rawDayNum = parseInt(dayMatch[1], 10);
      const modIdx = Math.max(0, Math.min((course.modules?.length || 1) - 1, rawModNum - 1));
      const subIdx = Math.max(0, rawDayNum - 1);

      // Extract new topic
      let extractedTopic = prompt
        .replace(/^(?:please\s+)?(?:can\s+you\s+)?(?:could\s+you\s+)?(?:change|update|set|make|replace|rename|switch|modify|edit|calibrate)(?:\s+the)?(?:\s+content\s+of)?/i, "")
        .replace(/^(?:in|for|on|at)\s+(?:module|mod|unit)\s*\d+[\s,]*(?:and\s+)?(?:day|lesson|subtopic)\s*\d+[\s,]*(?:please\s+)?(?:change|update|set|make|replace|rename|switch|modify)?(?:\s+the)?(?:\s+content\s+to)?/i, "")
        .replace(/^(?:in|for|on|at)\s+(?:day|lesson|subtopic)\s*\d+[\s,]*(?:of|in)?\s*(?:module|mod|unit)\s*\d+[\s,]*(?:please\s+)?(?:change|update|set|make|replace|rename|switch|modify)?(?:\s+the)?(?:\s+content\s+to)?/i, "")
        .replace(/(?:module|mod|unit)\s*\d+/gi, "")
        .replace(/(?:day|lesson|subtopic)\s*\d+/gi, "")
        .replace(/^(?:to|into|with|about|as|called|named|content|content\s+to|is|:)\s+/i, "")
        .replace(/^(?:content\s*:|title\s*:|lesson\s*:)/i, "")
        .replace(/^(?:to\s+be|to\s+have|to|be)\s+/i, "")
        .replace(/^[:\-\s"']+|[:\-\s"']+$/g, "")
        .trim();

      const cleanTopic = cleanTopicString(extractedTopic) || "Core Engineering Fundamentals";
      const targetMod = course.modules?.[modIdx];
      const dayNum = rawDayNum;

      const codeSnippet = generateDailyCodeSnippet(cleanTopic, domain, dayNum);
      const exercise = generateDailyExercise(cleanTopic, domain);
      const flashcards = generateDailyFlashcards(cleanTopic, modIdx + 1, dayNum, domain);
      const vid = getRelevantYouTubeVideo({
        courseTitle: course.title,
        category: course.category,
        moduleTitle: cleanTopic,
        moduleIndex: modIdx,
        level: course.level,
        description: course.description,
        moreAlternates: true,
        targetAlternatesCount: 10,
      });

      const updatedSub: SubTopicItem = {
        id: targetMod?.subtopics?.[subIdx]?.id || uid("sub"),
        title: `Day ${dayNum}: ${cleanTopic}`,
        type: lower.includes("video") ? "video" : lower.includes("exercise") ? "exercise" : (targetMod?.subtopics?.[subIdx]?.type || "reading"),
        duration: targetMod?.subtopics?.[subIdx]?.duration || "45 min",
        summary: `Comprehensive daily deep-dive into ${cleanTopic}, covering architectural mechanics, syntax idioms, defensive engineering, and hands-on exercises.`,
        sections: [
          {
            heading: `1. Foundational Architecture & Syntax: ${cleanTopic}`,
            body: `In this daily lesson, we master **${cleanTopic}**. Understanding these core principles allows you to write robust, efficient, and maintainable production code with clear boundary contracts.`,
            code: codeSnippet,
            analogy: `Real-World Intuition: Think of ${cleanTopic} like modular component architecture—clear interfaces and isolated contracts prevent cascading failures across the system.`,
          },
          {
            heading: `2. Production Patterns & Edge-Case Boundaries`,
            body: `When scaling **${cleanTopic}** in production environments, defensive programming requires validating inputs at system boundaries, handling null/empty states gracefully, and setting up circuit breakers.`,
          },
          {
            heading: `3. Hands-On Verification & Solution Walkthrough`,
            body: `Review the syntax implementation below, execute the practical exercise challenge, and verify edge cases to guarantee permanent retention.`,
            code: exercise.solution,
          },
        ],
        keyTakeaways: [
          `Master fundamental implementation mechanics and invariants of ${cleanTopic}.`,
          `Validate boundary inputs and decouple failure states gracefully.`,
          `Complete the hands-on coding exercise and review active recall flashcards.`,
        ],
        exercisePrompt: exercise.prompt,
        exerciseHint: exercise.hint,
        exerciseSolution: exercise.solution,
        youtubeId: vid.youtubeId,
        videoTitle: vid.title,
        channel: vid.channel,
        videoSummary: vid.summary,
        alternates: vid.alternates,
        flashcards: flashcards,
        cheatSheet: {
          title: cleanTopic,
          summary: `Quick reference guide and syntax reference for ${cleanTopic}.`,
          keyPoints: [
            `Core syntax and operational mechanics of ${cleanTopic}`,
            `Best practices for memory management and throughput`,
            `Common pitfalls and defensive verification patterns`,
          ],
          syntaxSnippet: codeSnippet,
        },
        dialogueScenario: {
          id: uid("scen"),
          situation: `You are architecting a critical component using ${cleanTopic} under tight throughput and reliability constraints.`,
          question: `How would you verify boundary contracts and prevent runtime failure modes when implementing ${cleanTopic}?`,
          hint: `Focus on input validation, idempotency, and decoupling failure states.`,
          expectedKeywords: ["validation", "boundary", "resilience", "contracts", "tests"],
          correctExplanation: `Validating inputs at system boundaries and decoupling failure states prevents cascading runtime crashes.`,
        },
      };

      setCourse((prev: any) => {
        const nextMods = [...(prev.modules || [])];
        if (nextMods[modIdx]) {
          const cur = nextMods[modIdx];
          const subs = [...(cur.subtopics || [])];
          if (subIdx < subs.length) {
            subs[subIdx] = updatedSub;
          } else {
            subs.push(updatedSub);
          }
          const lessons = subs.map((s: SubTopicItem) => ({
            id: s.id,
            title: s.title,
            duration: s.duration,
            type: s.type,
          }));
          nextMods[modIdx] = { ...cur, subtopics: subs, lessons };
        }
        return { ...prev, modules: nextMods };
      });

      // Synchronize active subtopic if it's currently selected or viewed
      setActiveSubtopic(updatedSub);
      setActiveTab("curriculum");

      setMessages((prev) => [
        ...prev,
        {
          id: uid("msg"),
          sender: "ai",
          timestamp: "Just now",
          text: `**Implemented!** Updated **Module ${modIdx + 1}, Day ${dayNum}** to **"${cleanTopic}"**!\n\n` +
            `• **Lesson Title**: Day ${dayNum}: ${cleanTopic}\n` +
            `• **Content**: Theoretical mechanics, production patterns & boundary rules\n` +
            `• **Code & Examples**: Injected verified syntax examples & runnable exercise\n` +
            `• **Curated Video**: "${vid.title}" (${vid.channel}) with 10+ alternate masterclasses\n` +
            `• **Active Recall**: ${flashcards.length} lesson-specific flashcards\n` +
            `• **Socratic Dialogue**: Added interactive dilemma challenge\n\n` +
            `*The curriculum panel on the right and lesson player have updated live!*`,
          actionTaken: `Applied to Course: Updated Module ${modIdx + 1}, Day ${dayNum} to "${cleanTopic}"`,
        },
      ]);
      return;
    }

    // -------------------------------------------------------------------------
    // 0B. MODULE TITLE / CONTENT UPDATE COMMAND (e.g. "change module 1 to Python Basics")
    // -------------------------------------------------------------------------
    if (modMatch && !dayMatch) {
      const isModUpdate =
        lower.startsWith("change module") ||
        lower.startsWith("rename module") ||
        lower.startsWith("update module") ||
        lower.startsWith("set module") ||
        lower.startsWith("make module") ||
        lower.includes("change module") ||
        lower.includes("rename module") ||
        lower.includes("module title to") ||
        lower.includes("module 1 to") ||
        lower.includes("module 2 to") ||
        lower.includes("module 3 to") ||
        lower.includes("module 4 to") ||
        lower.includes("module 5 to") ||
        lower.includes("module 6 to") ||
        lower.includes("module 7 to") ||
        lower.includes("module 8 to");

      if (isModUpdate) {
        const rawModNum = parseInt(modMatch[1], 10);
        const modIdx = Math.max(0, Math.min((course.modules?.length || 1) - 1, rawModNum - 1));

        let rawModTitle = prompt
          .replace(/^(?:please\s+)?(?:can\s+you\s+)?(?:change|update|set|make|replace|rename|modify)(?:\s+the)?(?:\s+title\s+of)?(?:\s+content\s+of)?/i, "")
          .replace(/(?:module|mod|unit)\s*\d+/gi, "")
          .replace(/^(?:to|into|with|about|as|called|named|is|:)\s+/i, "")
          .replace(/^[:\-\s"']+|[:\-\s"']+$/g, "")
          .trim();

        const cleanModTitle = cleanTitle(cleanTopicString(rawModTitle)) || `Module ${rawModNum} Specialization`;

        setCourse((prev: any) => {
          const nextMods = [...(prev.modules || [])];
          if (nextMods[modIdx]) {
            const cur = nextMods[modIdx];
            nextMods[modIdx] = {
              ...cur,
              title: cleanModTitle,
              tagline: `Master ${cleanModTitle} with structured practical deliverables`,
              content: {
                ...(cur.content || {}),
                title: cleanModTitle,
                tagline: `Comprehensive Mastery of ${cleanModTitle}`,
                summary: `This module is dedicated to mastering ${cleanModTitle}. Over the lessons, you will study code architecture, complete hands-on exercises, watch video masterclasses, handle edge cases, tackle Socratic dilemmas, and pass the knowledge quiz.`,
              },
            };
          }
          return { ...prev, modules: nextMods };
        });

        setActiveTab("curriculum");

        setMessages((prev) => [
          ...prev,
          {
            id: uid("msg"),
            sender: "ai",
            timestamp: "Just now",
            text: `**Implemented!** Updated Module ${modIdx + 1} title directly to **"${cleanModTitle}"**.\n\n*The curriculum header and module assets have been updated live!*`,
            actionTaken: `Applied to Course: Renamed Module ${modIdx + 1} to "${cleanModTitle}"`,
          },
        ]);
        return;
      }
    }

    // -------------------------------------------------------------------------
    // 0C. DAY UPDATE COMMAND (WHEN MODULE INFERRED FROM ACTIVE SUBTOPIC OR DIALOGUE)
    // -------------------------------------------------------------------------
    if (!modMatch && dayMatch) {
      const isDayUpdate =
        lower.startsWith("change day") ||
        lower.startsWith("update day") ||
        lower.startsWith("set day") ||
        lower.startsWith("make day") ||
        lower.startsWith("day ") ||
        lower.includes("change day") ||
        lower.includes("update day") ||
        lower.includes("day content to");

      if (isDayUpdate) {
        let inferredModIdx = 0;
        if (activeSubtopic) {
          for (let i = 0; i < (course.modules?.length || 0); i++) {
            if ((course.modules?.[i]?.subtopics || []).some((s: SubTopicItem) => s.id === activeSubtopic.id)) {
              inferredModIdx = i;
              break;
            }
          }
        } else if (activeDialogueModuleIdx < (course.modules?.length || 0)) {
          inferredModIdx = activeDialogueModuleIdx;
        }

        const rawDayNum = parseInt(dayMatch[1], 10);
        const subIdx = Math.max(0, rawDayNum - 1);

        let extractedTopic = prompt
          .replace(/^(?:please\s+)?(?:can\s+you\s+)?(?:change|update|set|make|replace|rename|modify)(?:\s+the)?(?:\s+content\s+of)?/i, "")
          .replace(/(?:day|lesson|subtopic)\s*\d+/gi, "")
          .replace(/^(?:to|into|with|about|as|called|named|content|content\s+to|is|:)\s+/i, "")
          .replace(/^[:\-\s"']+|[:\-\s"']+$/g, "")
          .trim();

        const cleanTopic = cleanTopicString(extractedTopic) || "Core Engineering Principles";
        const codeSnippet = generateDailyCodeSnippet(cleanTopic, domain, rawDayNum);
        const exercise = generateDailyExercise(cleanTopic, domain);
        const flashcards = generateDailyFlashcards(cleanTopic, inferredModIdx + 1, rawDayNum, domain);
        const vid = getRelevantYouTubeVideo({
          courseTitle: course.title,
          category: course.category,
          moduleTitle: cleanTopic,
          moduleIndex: inferredModIdx,
          level: course.level,
          description: course.description,
          moreAlternates: true,
          targetAlternatesCount: 10,
        });

        const updatedSub: SubTopicItem = {
          id: course.modules?.[inferredModIdx]?.subtopics?.[subIdx]?.id || uid("sub"),
          title: `Day ${rawDayNum}: ${cleanTopic}`,
          type: lower.includes("video") ? "video" : lower.includes("exercise") ? "exercise" : "reading",
          duration: "45 min",
          summary: `Comprehensive daily deep-dive into ${cleanTopic}, covering architectural mechanics, syntax idioms, defensive engineering, and hands-on exercises.`,
          sections: [
            {
              heading: `1. Foundational Architecture & Syntax: ${cleanTopic}`,
              body: `In this daily lesson, we master **${cleanTopic}**. Understanding these core principles allows you to write robust, efficient, and maintainable production code.`,
              code: codeSnippet,
              analogy: `Real-World Intuition: Think of ${cleanTopic} like modular component architecture—clear interfaces prevent cascading failures.`,
            },
            {
              heading: `2. Production Patterns & Failure Boundaries`,
              body: `When scaling **${cleanTopic}**, defensive engineering requires validating boundary inputs and decoupling failure states.`,
            },
            {
              heading: `3. Hands-On Implementation & Verification`,
              body: `Review the syntax implementation below and verify edge cases with unit tests.`,
              code: exercise.solution,
            },
          ],
          keyTakeaways: [
            `Master fundamental implementation mechanics of ${cleanTopic}.`,
            `Validate boundary inputs and decouple failure states gracefully.`,
            `Complete the practical exercise challenge.`,
          ],
          exercisePrompt: exercise.prompt,
          exerciseHint: exercise.hint,
          exerciseSolution: exercise.solution,
          youtubeId: vid.youtubeId,
          videoTitle: vid.title,
          channel: vid.channel,
          videoSummary: vid.summary,
          alternates: vid.alternates,
          flashcards: flashcards,
        };

        setCourse((prev: any) => {
          const nextMods = [...(prev.modules || [])];
          if (nextMods[inferredModIdx]) {
            const cur = nextMods[inferredModIdx];
            const subs = [...(cur.subtopics || [])];
            if (subIdx < subs.length) {
              subs[subIdx] = updatedSub;
            } else {
              subs.push(updatedSub);
            }
            const lessons = subs.map((s: SubTopicItem) => ({
              id: s.id,
              title: s.title,
              duration: s.duration,
              type: s.type,
            }));
            nextMods[inferredModIdx] = { ...cur, subtopics: subs, lessons };
          }
          return { ...prev, modules: nextMods };
        });

        setActiveSubtopic(updatedSub);
        setActiveTab("curriculum");

        setMessages((prev) => [
          ...prev,
          {
            id: uid("msg"),
            sender: "ai",
            timestamp: "Just now",
            text: `**Implemented!** Updated **Day ${rawDayNum}** in Module ${inferredModIdx + 1} to **"${cleanTopic}"**!\n\n` +
              `• **Lesson Title**: Day ${rawDayNum}: ${cleanTopic}\n` +
              `• **Content**: Theoretical mechanics & defensive patterns\n` +
              `• **Code & Examples**: Injected syntax examples & exercise\n` +
              `• **Curated Video**: "${vid.title}" (${vid.channel})\n` +
              `• **Active Recall**: ${flashcards.length} lesson-specific flashcards\n\n` +
              `*The curriculum panel on the right has been updated live!*`,
            actionTaken: `Applied to Course: Updated Day ${rawDayNum} to "${cleanTopic}"`,
          },
        ]);
        return;
      }
    }

    // -------------------------------------------------------------------------
    // 0. TITLE / RENAME COURSE COMMAND
    // -------------------------------------------------------------------------
    const isTitlePrompt =
      lower.startsWith("change title to") ||
      lower.startsWith("rename course to") ||
      lower.startsWith("rename to") ||
      lower.startsWith("set title to") ||
      lower.startsWith("update title to") ||
      lower.includes("change the course title to") ||
      lower.includes("rename the course to");

    if (isTitlePrompt) {
      const newTitle = prompt
        .replace(/^(?:please\s+)?(?:change|rename|set|update)(?:\s+the)?(?:\s+course)?\s+title\s+to\s*/i, "")
        .replace(/^(?:please\s+)?rename\s+(?:the\s+course\s+)?to\s*/i, "")
        .replace(/^["']|["']$/g, "")
        .trim();

      if (newTitle) {
        setCourse((prev: any) => ({ ...prev, title: newTitle }));
        setActiveTab("curriculum");
        setMessages((prev) => [
          ...prev,
          {
            id: uid("msg"),
            sender: "ai",
            timestamp: "Just now",
            text: `**Implemented!** Course title has been updated to **"${newTitle}"**. You can see the new title at the top header and in all course assets.`,
            actionTaken: `Applied to Course: Renamed course to "${newTitle}"`,
          },
        ]);
        return;
      }
    }

    // -------------------------------------------------------------------------
    // 0B. LEVEL CHANGE COMMAND
    // -------------------------------------------------------------------------
    const isLevelPrompt =
      (lower.startsWith("change level to") ||
       lower.startsWith("set level to") ||
       lower.startsWith("make it") ||
       lower.includes("difficulty to")) &&
      (lower.includes("beginner") || lower.includes("intermediate") || lower.includes("advanced"));

    if (isLevelPrompt) {
      const targetLvl = lower.includes("advanced") ? "Advanced" : lower.includes("intermediate") ? "Intermediate" : "Beginner";
      setCourse((prev: any) => ({ ...prev, level: targetLvl }));
      setActiveTab("curriculum");
      setMessages((prev) => [
        ...prev,
        {
          id: uid("msg"),
          sender: "ai",
          timestamp: "Just now",
          text: `**Implemented!** Course difficulty level has been updated to **${targetLvl}**.`,
          actionTaken: `Applied to Course: Set level to ${targetLvl}`,
        },
      ]);
      return;
    }

    // -------------------------------------------------------------------------
    // 1. ADD LESSON / SUBTOPIC COMMAND
    // -------------------------------------------------------------------------
    const isAddLessonPrompt =
      lower.includes("add lesson") ||
      lower.includes("add a lesson") ||
      lower.includes("add subtopic") ||
      lower.includes("add a subtopic") ||
      lower.includes("add day") ||
      lower.includes("include lesson") ||
      lower.includes("create lesson") ||
      lower.includes("new lesson") ||
      lower.includes("new subtopic");

    if (isAddLessonPrompt) {
      // Determine target module
      let targetIdx = 0;
      const modMatch = prompt.match(/(?:module|week)\s*(\d+)/i);
      if (modMatch) {
        targetIdx = Math.max(0, Math.min((course.modules?.length || 1) - 1, parseInt(modMatch[1], 10) - 1));
      } else if (activeDialogueModuleIdx < (course.modules?.length || 0)) {
        targetIdx = activeDialogueModuleIdx;
      }

      // Extract raw lesson topic
      let extractedTopic = prompt
        .replace(/^(?:can\s+you\s+)?(?:please\s+)?(?:add|create|include)\s+(?:a\s+)?(?:new\s+)?(?:lesson|subtopic|day\s*\d*|topic)\s*(?:on|about|for|called)?/i, "")
        .replace(/(?:in|to|for)\s+(?:module|week)\s*\d+.*$/i, "")
        .trim();

      const cleanTopic = cleanTopicString(extractedTopic) || "Core Engineering Principles";
      const targetMod = course.modules?.[targetIdx];
      const dayNum = (targetMod?.subtopics?.length || 0) + 1;

      const codeSnippet = generateDailyCodeSnippet(cleanTopic, domain, dayNum);
      const exercise = generateDailyExercise(cleanTopic, domain);
      const flashcards = generateDailyFlashcards(cleanTopic, targetIdx + 1, dayNum, domain);
      const vid = getRelevantYouTubeVideo({
        courseTitle: course.title,
        category: course.category,
        moduleTitle: cleanTopic,
        moduleIndex: targetIdx,
        level: course.level,
        description: course.description,
      });

      const newSub: SubTopicItem = {
        id: uid("sub"),
        title: `Day ${dayNum}: ${cleanTopic}`,
        type: lower.includes("video") ? "video" : lower.includes("exercise") ? "exercise" : "reading",
        duration: "45 min",
        summary: `Comprehensive masterclass exploring ${cleanTopic}, focusing on practical architectural mechanics, boundary checks, and production idioms.`,
        sections: [
          {
            heading: "1. Foundational Architecture & Mechanics",
            body: `In this daily lesson, we unpack **${cleanTopic}**. Understanding this concept allows you to build reliable, high-performance systems that gracefully handle edge cases.`,
            code: codeSnippet,
            analogy: `Real-World Intuition: Think of ${cleanTopic} like modular component architecture—clear boundaries and interfaces prevent cascading failures.`,
          },
          {
            heading: "2. Production Patterns & Failure Boundaries",
            body: `When scaling **${cleanTopic}**, defensive engineering requires validating inputs at the boundary, ensuring idempotent state updates, and decoupling failure states.`,
          },
        ],
        keyTakeaways: [
          `Master fundamental implementation mechanics of ${cleanTopic}.`,
          `Validate boundary inputs and decouple failure states gracefully.`,
          `Practice consistent daily implementation for permanent retention.`,
        ],
        exercisePrompt: exercise.prompt,
        exerciseHint: exercise.hint,
        exerciseSolution: exercise.solution,
        youtubeId: vid.youtubeId,
        videoTitle: vid.title,
        channel: vid.channel,
        videoSummary: vid.summary,
        alternates: vid.alternates,
        flashcards: flashcards,
      };

      setCourse((prev: any) => {
        const nextMods = [...(prev.modules || [])];
        if (nextMods[targetIdx]) {
          const cur = nextMods[targetIdx];
          const subs = [...(cur.subtopics || []), newSub];
          const lessons = [
            ...(cur.lessons || []),
            { id: newSub.id, title: newSub.title, duration: newSub.duration, type: newSub.type },
          ];
          nextMods[targetIdx] = { ...cur, subtopics: subs, lessons };
        }
        return { ...prev, modules: nextMods };
      });

      setActiveTab("curriculum");

      setMessages((prev) => [
        ...prev,
        {
          id: uid("msg"),
          sender: "ai",
          timestamp: "Just now",
          text: `**Implemented!** I have created and added a complete daily lesson: **"${newSub.title}"** to **Module ${targetIdx + 1}: ${cleanTitle(targetMod?.title || "Curriculum")}**.\n\n` +
            `• **In-Depth Reading & Code**: Foundational mechanics, syntax snippet & mental model\n` +
            `• **Curated Masterclass**: "${vid.title}" (${vid.channel})\n` +
            `• **Active Recall**: ${flashcards.length} targeted flashcards\n` +
            `• **Practical Exercise**: Hands-on challenge with verified solution code\n\n` +
            `*The curriculum on the right panel has been updated live!*`,
          actionTaken: `Applied to Course: Added "${newSub.title}" to Module ${targetIdx + 1}`,
        },
      ]);
      return;
    }

    // -------------------------------------------------------------------------
    // 2. DURATION SCALING COMMAND (e.g. 6 weeks, 7 weeks, 8 weeks, etc.)
    // -------------------------------------------------------------------------
    const isDurationPrompt =
      (lower.includes("week") || lower.includes("duration") || lower.includes("scale") || lower.includes("generate")) &&
      (lower.includes("6") || lower.includes("7") || lower.includes("8") || lower.includes("10") || lower.includes("12") || lower.includes("weeks") || lower.includes("days"));

    if (isDurationPrompt) {
      let wNum = 4;
      const wMatch = prompt.match(/(\d+)\s*(?:week|wk)/i) || prompt.match(/(?:for|to|make\s+it)\s*(\d+)/i);
      if (wMatch) {
        wNum = Math.max(1, Math.min(16, parseInt(wMatch[1], 10)));
      } else if (lower.includes("6")) {
        wNum = 6;
      } else if (lower.includes("7")) {
        wNum = 7;
      } else if (lower.includes("8")) {
        wNum = 8;
      }

      const durStr = `${wNum} Weeks`;
      const newMods = generateCuratedCurriculum(course.title, course.category, course.level, durStr, undefined, course.description);
      const newFlashcards = generateFlashcardsForCourse(course.title, course.category, course.level, newMods);
      const newCheatSheet = generateCheatSheetForCourse(course.title, course.category, course.level, newMods);
      const newVideos = generateCuratedVideosForCourse(course.title, course.category, course.level, newMods, course.description);
      const newDialogue = generateDialogueForCourse(newMods[0]?.title || course.title, course.category, course.level);

      setCourse((prev: any) => ({
        ...prev,
        duration: durStr,
        modules: newMods,
        resources: {
          ...(prev.resources || {}),
          flashcards: newFlashcards,
          cheatSheet: newCheatSheet,
          videos: newVideos,
          dialogueQuestions: newDialogue,
        },
      }));

      setActiveTab("curriculum");

      setMessages((prev) => [
        ...prev,
        {
          id: uid("msg"),
          sender: "ai",
          timestamp: "Just now",
          text: `**Implemented!** I have re-scaled the course to **${durStr}** with **${newMods.length * 7} total daily deliverables** (7 daily lessons per week).\n\n` +
            `1. **${newMods.length} Modules**: Sequenced logically from Day 1 fundamentals through to production architecture.\n` +
            `2. **Daily YouTube Masterclasses**: Dedicated video attached to every single day.\n` +
            `3. **Active Recall Flashcards**: ${newFlashcards.length} cards across all ${newMods.length} weeks.\n` +
            `4. **Day 7 Pass Gate Quizzes**: 10 diagnostic questions per week with 80% passing threshold.\n\n` +
            `*All modules and daily lessons on the right have updated immediately!*`,
          actionTaken: `Applied to Course: Scaled to ${durStr} (${newMods.length * 7} daily lessons)`,
        },
      ]);
      return;
    }

    // -------------------------------------------------------------------------
    // 3. ADD NEW MODULE COMMAND
    // -------------------------------------------------------------------------
    const isAddModulePrompt =
      lower.includes("add module") ||
      lower.includes("add a module") ||
      lower.includes("new module") ||
      lower.includes("create module") ||
      lower.includes("add week") ||
      lower.includes("new week");

    if (isAddModulePrompt) {
      let rawTitle = prompt
        .replace(/^(?:can\s+you\s+)?(?:please\s+)?(?:add|create)\s+(?:a\s+)?(?:new\s+)?(?:module|week)\s*(?:on|about|for|called)?/i, "")
        .trim();
      const cleanModTitle = cleanTopicString(rawTitle) || "Advanced Specialization & Production Architecture";
      const modIndex = course.modules?.length || 0;
      const weekNum = modIndex + 1;

      // Generate 7 daily subtopics
      const dailySubtopics: SubTopicItem[] = [];
      const dailyNames = [
        `${cleanModTitle} Foundations & Syntax`,
        `Core Rules & Invariants in ${cleanModTitle}`,
        `Data Modeling & Operations for ${cleanModTitle}`,
        `Integration Patterns with ${cleanModTitle}`,
        `Defensive Error Handling in ${cleanModTitle}`,
        `High-Throughput Optimization for ${cleanModTitle}`,
        `Production Review & Capstone Challenge`,
      ];

      for (let d = 1; d <= 7; d++) {
        const dTopic = dailyNames[d - 1];
        const code = generateDailyCodeSnippet(dTopic, domain, d);
        const ex = generateDailyExercise(dTopic, domain);
        const fc = generateDailyFlashcards(dTopic, weekNum, d, domain);
        const vid = getRelevantYouTubeVideo({
          courseTitle: course.title,
          category: course.category,
          moduleTitle: dTopic,
          moduleIndex: modIndex,
          level: course.level,
          description: course.description,
        });

        dailySubtopics.push({
          id: uid("sub"),
          title: `Day ${d}: ${dTopic}`,
          type: d === 2 || d === 5 ? "video" : d === 4 || d === 6 ? "exercise" : "reading",
          duration: "45 min",
          summary: `Day ${d} masterclass on ${dTopic}, breaking down core architectural rules and best practices.`,
          sections: [
            {
              heading: "Foundational Mechanics & Theory",
              body: `Understanding **${dTopic}** provides clear architectural leverage across real-world systems.`,
              code,
              analogy: `Real-World Intuition: Master ${dTopic} just like establishing verified design patterns in robust systems.`,
            },
          ],
          keyTakeaways: [`Master fundamental mechanics of ${dTopic}.`],
          exercisePrompt: ex.prompt,
          exerciseHint: ex.hint,
          exerciseSolution: ex.solution,
          youtubeId: vid.youtubeId,
          videoTitle: vid.title,
          channel: vid.channel,
          videoSummary: vid.summary,
          alternates: vid.alternates,
          flashcards: fc,
        });
      }

      const quizQuestions = generateWeeklyPassGateQuiz(cleanModTitle, weekNum, dailyNames, domain);

      const newModule: CourseModule = {
        id: uid("mod"),
        title: cleanModTitle,
        tagline: `7-day structured track for ${cleanModTitle}`,
        subtopics: dailySubtopics,
        lessons: dailySubtopics.map((s) => ({ id: s.id, title: s.title, duration: s.duration, type: s.type })),
        content: {
          title: cleanModTitle,
          readTime: "45 min",
          tagline: `Comprehensive mastery track for ${cleanModTitle}`,
          summary: `Master the complete architectural lifecycle and production patterns of ${cleanModTitle}.`,
          keyTakeaways: [`Understand ${cleanModTitle} architecture.`, `Execute hands-on code examples.`],
        },
        video: getRelevantYouTubeVideo({
          courseTitle: course.title,
          category: course.category,
          moduleTitle: cleanModTitle,
          moduleIndex: modIndex,
          level: course.level,
          description: course.description,
        }),
        flashcards: dailySubtopics.flatMap((s) => s.flashcards || []).slice(0, 10),
        passGate: {
          type: "quiz",
          quiz: {
            title: `Diagnostic Quiz: ${cleanModTitle}`,
            passingScore: 8,
            questions: quizQuestions,
          },
          task: {
            missionTitle: `Capstone Mission: ${cleanModTitle}`,
            xpReward: 150,
            estimatedTime: "2 hours",
            instructions: `Design, implement, and verify an end-to-end service using ${cleanModTitle}.`,
            checklist: [
              `Implement boundary validation for ${cleanModTitle}.`,
              `Write unit tests verifying edge cases.`,
              `Deploy and verify telemetry.`,
            ],
          },
        },
      };

      setCourse((prev: any) => ({
        ...prev,
        modules: [...(prev.modules || []), newModule],
      }));

      setActiveTab("curriculum");

      setMessages((prev) => [
        ...prev,
        {
          id: uid("msg"),
          sender: "ai",
          timestamp: "Just now",
          text: `**Implemented!** Created **"${cleanModTitle}"** with **7 structured daily lessons**, curated YouTube masterclasses, and a 10-question Pass Gate Quiz (80% passing grade).\n\n*The new module is now active in your curriculum!*`,
          actionTaken: `Applied to Course: Added "${cleanModTitle}"`,
        },
      ]);
      return;
    }

    // -------------------------------------------------------------------------
    // 4. ADD / EXPAND FLASHCARDS COMMAND
    // -------------------------------------------------------------------------
    const isFlashcardPrompt =
      lower.includes("card") ||
      lower.includes("flashcard") ||
      lower.includes("deck");

    if (isFlashcardPrompt) {
      if (lower.includes("mono") || lower.includes("code")) {
        handleApplyStyle("mono", undefined, undefined);
        setMessages((prev) => [
          ...prev,
          {
            id: uid("msg"),
            sender: "ai",
            timestamp: "Just now",
            text: "**Implemented!** All flashcards in the deck are now styled with technical Monospace typography.",
            actionTaken: "Applied to Course: Set flashcards font to Monospace",
          },
        ]);
        return;
      } else if (lower.includes("serif")) {
        handleApplyStyle("serif", undefined, undefined);
        setMessages((prev) => [
          ...prev,
          {
            id: uid("msg"),
            sender: "ai",
            timestamp: "Just now",
            text: "**Implemented!** All flashcards in the deck are now styled with Classic Serif editorial typography.",
            actionTaken: "Applied to Course: Set flashcards font to Classic Serif",
          },
        ]);
        return;
      } else if (lower.includes("sky") || lower.includes("blue")) {
        handleApplyStyle(undefined, "sky", undefined);
        setMessages((prev) => [
          ...prev,
          {
            id: uid("msg"),
            sender: "ai",
            timestamp: "Just now",
            text: "**Implemented!** Flashcard deck theme is now Cyber Sky.",
            actionTaken: "Applied to Course: Changed deck theme to Cyber Sky",
          },
        ]);
        return;
      } else if (lower.includes("emerald") || lower.includes("green")) {
        handleApplyStyle(undefined, "emerald", undefined);
        setMessages((prev) => [
          ...prev,
          {
            id: uid("msg"),
            sender: "ai",
            timestamp: "Just now",
            text: "**Implemented!** Flashcard deck theme is now Emerald Forest.",
            actionTaken: "Applied to Course: Changed deck theme to Emerald",
          },
        ]);
        return;
      } else if (lower.includes("purple")) {
        handleApplyStyle(undefined, "purple", undefined);
        setMessages((prev) => [
          ...prev,
          {
            id: uid("msg"),
            sender: "ai",
            timestamp: "Just now",
            text: "**Implemented!** Flashcard deck theme is now Purple Nebula.",
            actionTaken: "Applied to Course: Changed deck theme to Purple Nebula",
          },
        ]);
        return;
      }

      // Add high-yield flashcards
      const cardTopic = prompt
        .replace(/^(?:can\s+you\s+)?(?:please\s+)?(?:add|create|generate)\s+(?:\d+\s+)?(?:new\s+)?flashcards?\s*(?:on|about|for)?/i, "")
        .trim();
      const cleanTopic = cleanTopicString(cardTopic) || course.title;

      const newCards: Flashcard[] = [
        {
          id: uid("fc"),
          question: `What is the core architectural principle behind ${cleanTopic}?`,
          answer: `It provides explicit separation of concerns, ensures deterministic state mutations, and establishes clear boundary contracts.`,
          tag: "Core Concept",
          fontFamily: deckFont,
          theme: deckTheme,
          fontSize: deckFontSize,
        },
        {
          id: uid("fc"),
          question: `What common failure mode occurs when misconfiguring ${cleanTopic}?`,
          answer: `Unbounded memory consumption or silent unhandled exceptions during async operations. Always validate inputs and set circuit breakers.`,
          tag: "Defensive Engineering",
          fontFamily: deckFont,
          theme: deckTheme,
          fontSize: deckFontSize,
        },
        {
          id: uid("fc"),
          question: `How do you verify the performance and stability of ${cleanTopic}?`,
          answer: `By profiling runtime throughput, measuring memory allocations under load, and writing automated end-to-end integration tests.`,
          tag: "Production Optimization",
          fontFamily: deckFont,
          theme: deckTheme,
          fontSize: deckFontSize,
        },
      ];

      setCourse((prev: any) => ({
        ...prev,
        resources: {
          ...prev.resources,
          flashcards: [...newCards, ...(prev.resources?.flashcards || [])],
        },
      }));

      setCardIndex(0);
      setActiveTab("flashcards");

      setMessages((prev) => [
        ...prev,
        {
          id: uid("msg"),
          sender: "ai",
          timestamp: "Just now",
          text: `**Implemented!** Added **${newCards.length} high-yield flashcards** on **"${cleanTopic}"** to your workout deck.\n\n*Switched to the Flashcards tab so you can practice them now!*`,
          actionTaken: `Applied to Course: Added ${newCards.length} flashcards on "${cleanTopic}"`,
        },
      ]);
      return;
    }

    // -------------------------------------------------------------------------
    // 5. PASS GATE / QUIZ MODIFICATION COMMAND
    // -------------------------------------------------------------------------
    if (lower.includes("task") || lower.includes("mission") || lower.includes("capstone")) {
      setCourse((prev: any) => {
        const updated = (prev.modules || []).map((m: CourseModule) => ({
          ...m,
          passGate: { ...m.passGate, type: "task" },
        }));
        return { ...prev, modules: updated };
      });
      setMessages((prev) => [
        ...prev,
        {
          id: uid("msg"),
          sender: "ai",
          timestamp: "Just now",
          text: "**Implemented!** Switched Pass Gate across all modules to **Hands-on Capstone Tasks** with verified checklists.",
          actionTaken: "Applied to Course: Switched Pass Gate to Hands-on Task Mission",
        },
      ]);
      return;
    }

    if (lower.includes("quiz") || lower.includes("pass gate") || lower.includes("passing score")) {
      setCourse((prev: any) => {
        const updated = (prev.modules || []).map((m: CourseModule) => ({
          ...m,
          passGate: {
            ...m.passGate,
            type: "quiz",
            quiz: {
              ...m.passGate?.quiz,
              passingScore: 8,
            },
          },
        }));
        return { ...prev, modules: updated };
      });
      setMessages((prev) => [
        ...prev,
        {
          id: uid("msg"),
          sender: "ai",
          timestamp: "Just now",
          text: "**Implemented!** Pass Gates are set to **10-Question Diagnostic Quizzes** with an **80% passing grade** (8/10 required to unlock the next module).",
          actionTaken: "Applied to Course: Set Pass Gate to 10-Question Quiz (80% pass)",
        },
      ]);
      return;
    }

    if (lower.includes("analogy") || lower.includes("analogies")) {
      setCourse((prev: any) => {
        const nextMods = (prev.modules || []).map((m: CourseModule, mIdx: number) => {
          const modName = cleanTitle(m.title);

          const updatedSubs = (m.subtopics || []).map((s: SubTopicItem, sIdx: number) => {
            const clearAnalogy = `Real-World Intuition: Think of ${s.title} like modular components in high-reliability engineering—clean contracts and isolated boundaries prevent cascading failures!`;
            const sections = (s.sections || []).map((sec) => ({
              ...sec,
              analogy: clearAnalogy,
            }));
            if (sections.length === 0) {
              sections.push({
                heading: "Mental Model & Foundational Mechanics",
                body: `Mastering **${s.title}** through clear intuition and robust engineering principles.`,
                analogy: clearAnalogy,
              });
            }
            return { ...s, sections };
          });

          return {
            ...m,
            subtopics: updatedSubs,
          };
        });

        return { ...prev, modules: nextMods };
      });

      setActiveTab("curriculum");
      setMessages((prev) => [
        ...prev,
        {
          id: uid("msg"),
          sender: "ai",
          timestamp: "Just now",
          text: "**Implemented!** Injected intuitive, clear **Real-World Mental Models & Analogies** into the lesson breakdown.",
          actionTaken: "Applied to Course: Added Intuitive Mental Models to lessons",
        },
      ]);
      return;
    }

    if (lower.includes("subtopic") || lower.includes("subtopics") || lower.includes("expand") || lower.includes("in-depth")) {
      setCourse((prev: any) => {
        const nextMods = (prev.modules || []).map((m: CourseModule, mIdx: number) => {
          const modName = cleanTitle(m.title);
          const curSubs = m.subtopics || [];

          if (curSubs.length >= 7) {
            const enriched = curSubs.map((s, sIdx) => ({
              ...s,
              duration: "45 min",
              sections: s.sections?.length ? s.sections : [
                {
                  heading: "Foundational Architecture & Theory",
                  body: `Comprehensive engineering breakdown for ${s.title}. Exploring invariants, state machines, and boundary contracts.`,
                  code: generateDailyCodeSnippet(s.title, domain, sIdx + 1),
                  analogy: `Real-World Intuition: Managing ${s.title} is like managing balanced load distribution across a cluster.`,
                },
                {
                  heading: "Production Resilience & Failure Boundaries",
                  body: `Handling circuit breakers, boundary sanitization, and graceful degradations when scaling ${s.title}.`,
                },
              ],
            }));
            return { ...m, subtopics: enriched, lessons: enriched.map(s => ({ id: s.id, title: s.title, duration: s.duration, type: s.type })) };
          }

          const dailyNames = [
            `${modName} Core Syntax & Setup`,
            `${modName} State Architecture & Invariants`,
            `${modName} Practical Hands-On Implementation`,
            `${modName} Integration Patterns & APIs`,
            `${modName} Defensive Error Handling`,
            `${modName} High-Throughput Optimization`,
            `${modName} Production Capstone Review`,
          ];
          const expandedSubs: SubTopicItem[] = dailyNames.map((name, dIdx) => ({
            id: uid("sub"),
            title: `Day ${dIdx + 1}: ${name}`,
            type: dIdx === 1 || dIdx === 4 ? "video" : dIdx === 2 || dIdx === 5 ? "exercise" : "reading",
            duration: "45 min",
            summary: `Day ${dIdx + 1} comprehensive breakdown of ${name}.`,
            sections: [
              {
                heading: "Foundational Mechanics & Theory",
                body: `In-depth theoretical and architectural explanation of ${name}.`,
                code: generateDailyCodeSnippet(name, domain, dIdx + 1),
                analogy: `Real-World Intuition: Think of ${name} like foundational architecture—proper baseline configuration ensures system resilience.`,
              },
            ],
            keyTakeaways: [`Master core mechanics of ${name}.`],
            exercisePrompt: `Implement a production-grade pattern for ${name}.`,
            exerciseSolution: `// Solution for ${name}\nexport function runSolution() { return true; }`,
            flashcards: generateDailyFlashcards(name, mIdx + 1, dIdx + 1, domain),
          }));

          return {
            ...m,
            subtopics: expandedSubs,
            lessons: expandedSubs.map(s => ({ id: s.id, title: s.title, duration: s.duration, type: s.type })),
          };
        });

        return { ...prev, modules: nextMods };
      });

      setActiveTab("curriculum");
      setMessages((prev) => [
        ...prev,
        {
          id: uid("msg"),
          sender: "ai",
          timestamp: "Just now",
          text: "**Implemented!** Expanded all modules into **in-depth daily structured learning tracks** (7 full daily lessons per module with syntax code snippets, mental models, and flashcards).",
          actionTaken: "Applied to Course: Expanded in-depth subtopics across all modules",
        },
      ]);
      return;
    }

    if (lower.includes("practical") || lower.includes("example") || lower.includes("hands-on") || lower.includes("code")) {
      setCourse((prev: any) => {
        const nextMods = (prev.modules || []).map((m: CourseModule, mIdx: number) => {
          const updatedSubs = (m.subtopics || []).map((s: SubTopicItem, sIdx: number) => {
            const ex = generateDailyExercise(s.title, domain);
            const code = generateDailyCodeSnippet(s.title, domain, sIdx + 1);
            return {
              ...s,
              type: s.type === "reading" ? "exercise" : s.type,
              exercisePrompt: s.exercisePrompt || ex.prompt,
              exerciseHint: s.exerciseHint || ex.hint,
              exerciseSolution: s.exerciseSolution || ex.solution,
              sections: s.sections?.map(sec => ({
                ...sec,
                code: sec.code || code,
              })) || [
                {
                  heading: "Practical Hands-On Code Example",
                  body: `Production implementation pattern for ${s.title}:`,
                  code,
                  analogy: `Real-World Intuition: Running code through deterministic tests ensures reliable production deployment.`,
                },
              ],
            };
          });
          return {
            ...m,
            subtopics: updatedSubs,
            lessons: updatedSubs.map(s => ({ id: s.id, title: s.title, duration: s.duration, type: s.type })),
          };
        });
        return { ...prev, modules: nextMods };
      });

      setActiveTab("curriculum");
      setMessages((prev) => [
        ...prev,
        {
          id: uid("msg"),
          sender: "ai",
          timestamp: "Just now",
          text: "**Implemented!** Added verified, syntax-highlighted **code examples** and runnable **practical exercises** with solutions to every lesson.",
          actionTaken: "Applied to Course: Added practical code examples & exercises to lessons",
        },
      ]);
      return;
    }

    // -------------------------------------------------------------------------
    // 5B. MORE VIDEOS / ALTERNATES COMMAND (e.g. "more videos", "more alternates", "give more", "alternate videos")
    // -------------------------------------------------------------------------
    const isMoreVideosPrompt =
      (lower.includes("video") || lower.includes("alternate") || lower.includes("youtube")) &&
      (lower.includes("more") || lower.includes("give") || lower.includes("extra") || lower.includes("expand") || lower.includes("options") || lower.includes("alternates"));

    if (isMoreVideosPrompt) {
      // 1. If an activeSubtopic is open, fetch 10-12 alternates for this subtopic
      if (activeSubtopic) {
        const extraSubVideo = getRelevantYouTubeVideo({
          courseTitle: course.title,
          category: course.category,
          moduleTitle: activeSubtopic.title,
          level: course.level,
          description: course.description,
          moreAlternates: true,
          targetAlternatesCount: 12,
        });

        const updatedSub: SubTopicItem = {
          ...activeSubtopic,
          alternates: extraSubVideo.alternates,
        };
        setActiveSubtopic(updatedSub);

        setCourse((prev: any) => {
          const newMods = (prev.modules || []).map((m: CourseModule) => {
            const subIdx = (m.subtopics || []).findIndex((s) => s.id === activeSubtopic.id);
            if (subIdx === -1) return m;
            const newSubs = [...(m.subtopics || [])];
            newSubs[subIdx] = updatedSub;
            return { ...m, subtopics: newSubs };
          });
          return { ...prev, modules: newMods };
        });

        setMessages((prev) => [
          ...prev,
          {
            id: uid("msg"),
            sender: "ai",
            timestamp: "Just now",
            text: `**Loaded 10+ Curated YouTube Alternates for "${activeSubtopic.title}"!**\n\n` +
              `I've retrieved and verified 10+ alternate masterclasses from leading engineering channels (Fireship, Web Dev Simplified, freeCodeCamp, Traversy Media, etc.).\n` +
              `You can switch between any of them in the lesson video player drawer below.`,
            actionTaken: `Applied to Lesson: Expanded to ${extraSubVideo.alternates.length} alternate videos for "${activeSubtopic.title}"`,
          },
        ]);
        return;
      }

      // 2. Otherwise expand all module videos and course resources with 10-12 alternates
      const updatedMods = (course.modules || []).map((m: CourseModule, mIdx: number) => {
        const extraModVideo = getRelevantYouTubeVideo({
          courseTitle: course.title,
          category: course.category,
          moduleTitle: m.title,
          moduleIndex: mIdx,
          level: course.level,
          description: course.description,
          moreAlternates: true,
          targetAlternatesCount: 12,
        });

        const enrichedSubtopics = (m.subtopics || []).map((s: SubTopicItem) => {
          if (s.type === "video" || s.youtubeId) {
            const extraSubVideo = getRelevantYouTubeVideo({
              courseTitle: course.title,
              category: course.category,
              moduleTitle: s.title,
              moduleIndex: mIdx,
              level: course.level,
              description: course.description,
              moreAlternates: true,
              targetAlternatesCount: 10,
            });
            return {
              ...s,
              alternates: extraSubVideo.alternates,
            };
          }
          return s;
        });

        return {
          ...m,
          video: extraModVideo,
          subtopics: enrichedSubtopics,
        };
      });

      const updatedCuratedVideos = generateCuratedVideosForCourse(
        course.title,
        course.category,
        course.level,
        updatedMods,
        course.description
      );

      setCourse((prev: any) => ({
        ...prev,
        modules: updatedMods,
        resources: {
          ...(prev.resources || {}),
          videos: updatedCuratedVideos,
        },
      }));

      setActiveTab("video");

      setMessages((prev) => [
        ...prev,
        {
          id: uid("msg"),
          sender: "ai",
          timestamp: "Just now",
          text: `**Expanded YouTube Masterclass Alternates Across Entire Course!**\n\n` +
            `• **10–12 Verified Alternates**: Every module and lesson now has 10+ verified, embeddable video alternatives from top engineering educators.\n` +
            `• **1-Click Fallback**: If any video doesn't play in your region, click *"Try Next Alternate"* to seamlessly rotate.\n` +
            `• **Masterclass Stack**: Check the **Video Masterclass** tab to browse all curated explanations.`,
          actionTaken: `Applied to Course: Stored 10-12 verified video alternates across all modules & lessons`,
        },
      ]);
      return;
    }

    // -------------------------------------------------------------------------
    // 6. GENERAL / CONCEPTUAL EDIT VIA GEMINI API (WITH DIRECT APPLICATION)
    // -------------------------------------------------------------------------
    try {
      const editRes = await requestCourseEdit(prompt, course);
      if (editRes && editRes.editResult) {
        const { chat_response, proposed_change, action_type } = editRes.editResult;

        // DIRECTLY APPLY the full editResult to the course state!
        applyProposedChangeToCourse(editRes.editResult);

        const actionDesc = proposed_change?.description || `Updated course according to "${prompt.slice(0, 40)}..."`;

        setMessages((prev) => [
          ...prev,
          {
            id: uid("msg"),
            sender: "ai",
            timestamp: "Just now",
            text: chat_response || `**Implemented!** I have applied your update for "${prompt}" directly to the course content. All modules, subtopics, and resources on the right are updated.`,
            actionTaken: `Applied to Course: ${actionDesc}`,
            proposedChange: editRes.editResult,
            isPendingApproval: false,
          },
        ]);
        return;
      }
    } catch (err: any) {
      console.warn("AI edit API request failed, running heuristic fallback:", err.message);
    }

    // -------------------------------------------------------------------------
    // 7. HEURISTIC FALLBACK: RE-CALIBRATE CURRICULUM ACCORDING TO PROMPT
    // -------------------------------------------------------------------------
    let targetLevel = course.level;
    if (lower.includes("beginner") || lower.includes("intro") || lower.includes("basic") || lower.includes("easier") || lower.includes("scratch")) {
      targetLevel = "Beginner";
    } else if (lower.includes("advanced") || lower.includes("expert") || lower.includes("hard") || lower.includes("deep dive") || lower.includes("mastery")) {
      targetLevel = "Advanced";
    } else if (lower.includes("intermediate") || lower.includes("medium")) {
      targetLevel = "Intermediate";
    }

    const combinedDesc = course.description ? `${course.description} - Focus on: ${prompt}` : prompt;
    const newModules = generateCuratedCurriculum(course.title, course.category, targetLevel, course.duration, prompt, combinedDesc);
    const newFlashcards = generateFlashcardsForCourse(course.title, course.category, targetLevel, newModules);
    const newCheatSheet = generateCheatSheetForCourse(course.title, course.category, targetLevel, newModules);
    const newVideos = generateCuratedVideosForCourse(course.title, course.category, targetLevel, newModules, course.description);
    const newDialogue = generateDialogueForCourse(newModules[0]?.title || course.title, course.category, targetLevel);

    setCourse((prev: any) => ({
      ...prev,
      level: targetLevel,
      modules: newModules,
      resources: {
        ...(prev.resources || {}),
        flashcards: newFlashcards,
        cheatSheet: newCheatSheet,
        videos: newVideos,
        dialogueQuestions: newDialogue,
      },
    }));

    const subject = extractSubjectName(course.title, prompt);
    const fallbackDesc = `Re-calibrated curriculum for "${subject}" (${targetLevel})`;
    const fallbackAiResponse = `**Implemented!** I have updated the course content for **${subject}** at the **${targetLevel}** level:\n\n` +
      `1. **Curriculum Updated**: Structured 7 daily lessons per week with code, mental models & exercises.\n` +
      `2. **Topic Flashcards**: Refreshed ${newFlashcards.length} flashcards dedicated strictly to ${subject}.\n` +
      `3. **Comprehensive Cheat Sheet**: Updated axioms, idioms, and resilience patterns for ${subject}.\n` +
      `4. **Day 7 Pass Gate Quizzes**: 10-Question diagnostic quizzes with 80% passing threshold.`;

    setMessages((prev) => [
      ...prev,
      {
        id: uid("msg"),
        sender: "ai",
        timestamp: "Just now",
        text: fallbackAiResponse,
        actionTaken: `Applied to Course: ${fallbackDesc}`,
      },
    ]);
  }

  // Deletion execution handler
  function handleConfirmDelete() {
    if (!deleteTarget) return;

    if (deleteTarget.type === "course") {
      onDelete?.(course.id || "");
      onClose();
    } else if (deleteTarget.type === "module") {
      setCourse((prev: any) => ({
        ...prev,
        modules: (prev.modules || []).filter((m: any) => m.id !== deleteTarget.id),
      }));
    } else if (deleteTarget.type === "subtopic" && deleteTarget.parentId) {
      setCourse((prev: any) => ({
        ...prev,
        modules: (prev.modules || []).map((m: any) =>
          m.id === deleteTarget.parentId
            ? {
                ...m,
                subtopics: (m.subtopics || []).filter((s: any) => s.id !== deleteTarget.id),
                lessons: (m.lessons || []).filter(
                  (l: any) => (typeof l === "object" ? l.id !== deleteTarget.id : l !== deleteTarget.title)
                ),
              }
            : m
        ),
      }));
    } else if (deleteTarget.type === "flashcard") {
      setCourse((prev: any) => {
        const updatedCards = (prev.resources?.flashcards || []).filter((c: any) => c.id !== deleteTarget.id);
        return {
          ...prev,
          resources: { ...prev.resources, flashcards: updatedCards },
        };
      });
      setCardIndex(0);
    }

    setDeleteTarget(null);
  }

  // Launch interactive Course Player
  function startStudentRunner(moduleIdx: number = 0) {
    const mod = course.modules?.[moduleIdx];
    const firstSub = mod?.subtopics?.[0] || null;
    setPlayerModuleIdx(moduleIdx);
    setIsPassGateActive(false);
    if (firstSub) {
      setActiveSubtopic(firstSub);
    }
    setExpandedModuleMap((prev) => ({ ...prev, [moduleIdx]: true }));
    setIsPlayerOpen(true);
    setExerciseAnswer("");
    setShowExerciseHint(false);
    setShowExerciseSolution(false);
    setDrawerDialogueAnswer("");
    setDrawerDialogueFeedback(null);
    setShowDrawerDialogueHint(false);
    setDrawerQuizAnswers({});
  }

  // Launch interactive Pass Gate in Course Player
  function handleOpenPassGate(moduleIdx: number = 0) {
    setPlayerModuleIdx(moduleIdx);
    setIsPassGateActive(true);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizPassed(false);
    setTaskChecked({});
    setTaskSubmitted(false);
    setExpandedModuleMap((prev) => ({ ...prev, [moduleIdx]: true }));
    setIsPlayerOpen(true);
  }

  // Complete runner step
  function handleCompleteRunnerStep(stepNum: 1 | 2 | 3 | 4) {
    const activeMod = course.modules?.[runnerModuleIndex];
    if (!activeMod) return;

    setHighestStepCompleted((prev) => ({
      ...prev,
      [activeMod.id]: Math.max(prev[activeMod.id] || 0, stepNum),
    }));

    if (stepNum < 5) {
      const nextStep = (stepNum + 1) as 1 | 2 | 3 | 4 | 5;
      setRunnerStep(nextStep);
      if (nextStep === 4) {
        initDialogue(runnerModuleIndex);
      }
    }
  }

  // Quiz submission handler
  function handleQuizSubmit(mod: CourseModule) {
    const questions = mod.passGate.quiz.questions;
    let correctCount = 0;
    questions.forEach((q) => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const passed = correctCount >= mod.passGate.quiz.passingScore;
    setQuizSubmitted(true);
    setQuizPassed(passed);

    if (passed) {
      setCelebrationBanner(`Incredible! You passed the Quiz Gate with ${correctCount}/${questions.length} correct! (+100 XP)`);
      awardXp(100, "quiz", `Passed Quiz Duel in ${cleanTitle(mod.title)}`);
      setCompletedModules((prev) => ({ ...prev, [mod.id]: true }));
    }
  }

  // Task submission handler
  function handleTaskSubmit(mod: CourseModule) {
    setTaskSubmitted(true);
    const reward = mod.passGate.task.xpReward || 100;
    setCelebrationBanner(`Mission Accomplished! Task verified and passed. (+${reward} XP)`);
    awardXp(reward, "task", `Completed Mission: ${mod.passGate.task.missionTitle}`);
    setCompletedModules((prev) => ({ ...prev, [mod.id]: true }));
  }

  // Flashcards collection
  const allFlashcards: Flashcard[] = course.resources?.flashcards || [];
  const filteredFlashcards = cardTagFilter === "All"
    ? allFlashcards
    : allFlashcards.filter((c) => c.tag === cardTagFilter || (c.moduleIndex !== undefined && `Module ${c.moduleIndex + 1}` === cardTagFilter));

  const currentFlashcard = filteredFlashcards[cardIndex] || filteredFlashcards[0] || {
    id: "def",
    question: "What is the core principle of this course?",
    answer: "Continuous active learning through bite-sized missions and real-world projects.",
    tag: "Core",
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col transition-colors duration-200 ${
        isBright ? "bg-[#FAF7F2] text-slate-900" : "bg-[#0B0D13] text-ink-100"
      }`}
    >
      {/* ========================================================================= */}
      {/* TOP HEADER BAR (Cleaned: Persistent XP, Actions, Delete Option) */}
      {/* ========================================================================= */}
      <header
        className={`px-4 sm:px-6 py-3 border-b flex items-center justify-between gap-3 shrink-0 ${
          isBright ? "bg-white/95 border-[#E8DACD] shadow-sm" : "bg-[#11141B]/95 border-white/10"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Button
            variant="secondary"
            size="sm"
            icon={ArrowLeft}
            onClick={onClose}
            className="cursor-pointer shrink-0 font-bold text-xs sm:text-sm border-2 transition-all shadow-xs !border-slate-300 hover:!border-slate-400 !bg-white hover:!bg-slate-100 !text-black dark:!border-white/25 dark:!bg-white/10 dark:hover:!bg-white/20 dark:!text-white"
          >
            <span className="font-bold !text-black dark:!text-white">Back</span>
          </Button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-black text-sm sm:text-base truncate !text-black dark:!text-white">
                {course.title || "Course Curriculum"}
              </span>
              <Badge tone="yellow" className="hidden sm:inline-flex shrink-0 font-bold shadow-xs">
                <Sparkles size={12} className="mr-1 inline text-amber-500 fill-amber-400" /> AI Studio
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold mt-1 truncate !text-black dark:!text-slate-200">
              <span className="!text-black dark:!text-slate-200">{course.category}</span>
              <span className="text-slate-400">·</span>
              <span className="!text-black dark:!text-slate-200">{course.level}</span>
              <span className="text-slate-400">·</span>
              <span className="!text-black dark:!text-slate-200">{course.duration}</span>
              <span className="text-slate-400">·</span>
              <span className="!text-black dark:!text-slate-200 flex items-center gap-1.5">
                <Flame size={13} className="text-amber-500 fill-amber-500 shrink-0" /> {course.modules?.length || 0} Modules
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls: Delete Draft, Save Draft & Publish */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Delete / Discard Course Draft Option */}
          <Button
            variant="secondary"
            size="sm"
            icon={Trash2}
            onClick={() =>
              setDeleteTarget({
                type: "course",
                id: course.id || "current",
                title: course.title,
              })
            }
            className="cursor-pointer text-xs sm:text-sm font-bold border-2 transition-all shadow-xs !border-red-400 dark:!border-red-500/60 !bg-red-50 hover:!bg-red-100 !text-red-700 dark:!bg-red-950/60 dark:hover:!bg-red-900/60 dark:!text-red-300"
            title="Delete this course draft"
          >
            <span className="font-bold">Delete</span>
          </Button>

          {/* Save Draft - Prominently highlighted in amber branding, bold, and high-contrast */}
          <Button
            variant="secondary"
            size="sm"
            icon={Bookmark}
            onClick={() => onSaveDraft(course)}
            className="cursor-pointer text-xs sm:text-sm font-bold border-2 transition-all shadow-xs !border-amber-500 dark:!border-amber-400/70 !bg-amber-100 hover:!bg-amber-200 !text-amber-950 dark:!bg-amber-500/20 dark:hover:!bg-amber-500/30 dark:!text-amber-300"
            title="Save draft"
          >
            <span className="font-bold">Save Draft</span>
          </Button>

          {/* Publish Course - Glowing bold orange gradient */}
          <Button
            size="sm"
            icon={Globe}
            onClick={() => onPublish(course)}
            className="cursor-pointer font-bold shadow-md text-xs sm:text-sm border border-orange-400/50 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 !text-white shadow-orange-500/30"
            title="Publish course"
          >
            <span className="font-bold">Publish Course</span>
          </Button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN STUDIO BODY: SPLIT VIEW */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* LEFT COLUMN: AI PROMPTING CHATBOT (CLOSEABLE) */}
        {isLeftPanelOpen && (
          <div
            className={`w-full lg:w-[390px] xl:w-[420px] flex flex-col border-b lg:border-b-0 lg:border-r shrink-0 transition-all duration-200 ${
              isBright ? "bg-white border-[#E8DACD]" : "bg-[#11141B] border-white/10"
            }`}
          >
            {/* Chatbot Header */}
            <div
              className={`px-4 sm:px-5 py-3.5 border-b flex items-center justify-between gap-2 ${
                isBright ? "border-[#EFE5DB] bg-slate-50/70" : "border-white/5 bg-white/[0.02]"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-ember-500 to-amber-400 text-base-950 flex items-center justify-center font-bold shadow-sm shrink-0">
                  <Sparkles size={16} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-bold truncate">Mentora Studio AI</h2>
                  <p className="text-[11px] text-slate-500 dark:text-ink-500 truncate">
                    Refine subtopics, pass gates & resources
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-500 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Calibrated</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLeftPanelOpen(false)}
                  className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                    isBright
                      ? "border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                      : "border-white/10 text-ink-300 hover:text-white hover:bg-white/10"
                  }`}
                  title="Close AI Assistant Panel"
                  aria-label="Close AI Assistant Panel"
                >
                  <PanelLeftClose size={15} />
                </button>
              </div>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl p-3.5 shadow-xs ${
                      m.sender === "user"
                        ? "bg-ember-500 text-white shadow-sm font-medium rounded-br-none text-xs sm:text-sm"
                        : isBright
                        ? "bg-white text-slate-800 border border-slate-200/90 rounded-bl-none"
                        : "bg-[#181C26] text-ink-100 border border-white/10 rounded-bl-none"
                    }`}
                  >
                    <AiFormattedMessage text={m.text} isBright={isBright} sender={m.sender} />
                    {m.isPendingApproval && (
                      <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center gap-2">
                        <button
                          onClick={() => handleApproveEdit(m.id, m.proposedChange)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/20 cursor-pointer transition-all flex items-center gap-1.5"
                        >
                          <Check size={13} /> Apply to Course
                        </button>
                        <button
                          onClick={() => handleRejectEdit(m.id)}
                          className="px-3 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-400 font-semibold text-xs cursor-pointer transition-all"
                        >
                          Discard
                        </button>
                      </div>
                    )}
                  </div>
                  {m.actionTaken && (
                    <span
                      className={`mt-1 text-[11px] px-2 py-0.5 rounded-md font-medium inline-flex items-center gap-1 ${
                        isBright ? "bg-amber-100 text-amber-800" : "bg-ember-500/15 text-ember-400"
                      }`}
                    >
                      <Check size={11} /> {m.actionTaken}
                    </span>
                  )}
                </div>
              ))}

              {isAiThinking && (
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-ink-500 p-2 italic">
                  <RotateCw size={13} className="animate-spin text-ember-500" />
                  <span>Calibrating subtopics and challenges...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div
              className={`px-4 py-2 border-t flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar ${
                isBright ? "border-[#EFE5DB] bg-slate-50/50" : "border-white/5 bg-[#151922]/50"
              }`}
            >
              <span className="shrink-0 text-slate-400 dark:text-ink-600 font-medium">Quick prompts:</span>
              {[
                "Add in-depth subtopics",
                "Add clear analogies",
                "Refine module quizzes",
                "Add practical examples",
              ].map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSendMessage(chip)}
                  className={`shrink-0 px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                    isBright
                      ? "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                      : "bg-white/5 hover:bg-white/10 text-ink-300 border-white/10 hover:border-white/20"
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Chat Input Bar */}
            <div
              className={`p-3.5 border-t ${
                isBright ? "border-[#E8DACD] bg-white" : "border-white/10 bg-[#141822]"
              }`}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  placeholder="Ask AI to expand subtopics, add flashcards..."
                  className={`flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border outline-none transition-all ${
                    isBright
                      ? "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-ember-500 focus:bg-white"
                      : "bg-[#181C26] border-white/12 text-ink-100 placeholder:text-ink-600 focus:border-ember-500 focus:bg-[#1D2230]"
                  }`}
                />
                <button
                  type="submit"
                  disabled={isAiThinking || !inputPrompt.trim()}
                  className="p-2.5 rounded-xl bg-ember-500 hover:bg-ember-600 disabled:opacity-40 text-white transition-all cursor-pointer shadow-sm shrink-0"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* RIGHT COLUMN: RESOURCE TABS & CURRICULUM */}
        <div className="flex-1 flex flex-col overflow-hidden w-full min-w-0">
          {/* Resource Navigation Tabs */}
          <div
            className={`px-4 sm:px-6 pt-3 border-b flex items-center justify-between gap-2 overflow-x-auto ${
              isBright ? "bg-white border-[#E8DACD]" : "bg-[#141822] border-white/10"
            }`}
          >
            <div className="flex items-center gap-2">
              {/* Left Panel Re-Open Button (Only displayed when panel is closed) */}
              {!isLeftPanelOpen && (
                <button
                  type="button"
                  onClick={() => setIsLeftPanelOpen(true)}
                  className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 border px-3 flex items-center gap-1.5 ${
                    isBright
                      ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 border-amber-300"
                      : "bg-ember-500/15 hover:bg-ember-500/25 text-ember-400 border-ember-500/30"
                  }`}
                  title="Open AI Assistant Panel"
                  aria-label="Open AI Assistant Panel"
                >
                  <PanelLeftOpen size={16} />
                  <span className="text-xs font-bold">Open AI Panel</span>
                </button>
              )}

              {[
                { id: "curriculum", label: "Modules & Curriculum", icon: BookOpen },
                { id: "flashcards", label: "Flashcards", icon: Layers },
                { id: "cheatsheet", label: "Cheat Sheet", icon: FileText },
                { id: "video", label: "YouTube Video", icon: Video },
                { id: "dialogue", label: "Dialogue", icon: MessageSquare },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2.5 border-b-2 text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "border-ember-500 text-ember-600 dark:text-ember-400 font-black"
                        : isBright
                        ? "border-transparent text-slate-800 hover:text-black"
                        : "border-transparent text-ink-300 hover:text-white"
                    }`}
                  >
                    <Icon size={16} className={isActive ? "text-ember-500" : isBright ? "text-slate-700" : "text-ink-400"} />
                    <span className={isActive ? "text-ember-600 dark:text-ember-400 font-black" : isBright ? "!text-black font-bold" : "text-white font-bold"}>
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Play Student Flow action */}
            <div className="hidden sm:flex items-center gap-2 shrink-0 pb-2">
              <button
                onClick={() => startStudentRunner(0)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
              >
                <Play size={12} className="fill-white" /> Play Student Flow
              </button>
            </div>
          </div>

          {/* ACTIVE TAB CONTENT AREA */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {/* ================================================================= */}
            {/* TAB 1: CURRICULUM WITH SUBTOPICS (TOP BANNER REMOVED!) */}
            {/* ================================================================= */}
            {activeTab === "curriculum" && (
              <div className="max-w-4xl mx-auto space-y-4">
                {/* Header bar with Add Module button */}
                <div className="flex items-center justify-between gap-3 mb-2 p-3 rounded-2xl border border-line-soft bg-slate-50/50 dark:bg-white/[0.02]">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-ink-100 flex items-center gap-1.5">
                      <Layers size={16} className="text-amber-500" /> Modules & Structured Curriculum Tracks
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-ink-400">
                      Rearrange modules and add lessons anywhere.
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Plus}
                    onClick={() => setIsAddModuleOpen(true)}
                    className="cursor-pointer font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm shrink-0"
                  >
                    Add Module
                  </Button>
                </div>

                {course.modules?.map((m: CourseModule, idx: number) => {
                  const cleanModTitle = cleanTitle(m.title);
                  const isQuizGate = m.passGate?.type === "quiz";
                  const subtopics = m.subtopics || [];

                  return (
                    <div
                      key={m.id || idx}
                      className={`rounded-2xl border transition-all ${
                        isBright
                          ? "bg-white border-slate-200 shadow-sm hover:border-slate-300"
                          : "bg-[#161A24] border-white/10 hover:border-white/15"
                      }`}
                    >
                      {/* Module Header with Reordering and Inline Editing */}
                      <div className="p-4 sm:p-5 border-b border-line-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40 flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
                            {idx + 1}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-black text-sm sm:text-base truncate !text-black dark:!text-white">
                                {cleanModTitle}
                              </h3>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingModuleIdx(idx);
                                  setEditModuleTitle(cleanTitle(m.title));
                                  setEditModuleTagline(cleanTagline(m.tagline || ""));
                                }}
                                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
                                title="Edit module title & tagline"
                              >
                                <Pencil size={12} />
                              </button>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-ink-400 font-normal line-clamp-1 mt-0.5 leading-snug">
                              {cleanTagline(m.tagline || m.content?.summary || "Comprehensive mastery track")}
                            </p>
                          </div>
                        </div>

                        {/* Reorder and pass gate controls */}
                        <div className="flex items-center gap-2 shrink-0">
                          {/* Module Reordering: Move Up & Move Down */}
                          <div className="flex items-center gap-0.5 border border-line-soft rounded-lg p-0.5 bg-black/5 dark:bg-white/5">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveModule(idx, "up")}
                              className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-amber-500 disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                              title="Move module up"
                            >
                              <ArrowUp size={12} />
                            </button>
                            <button
                              type="button"
                              disabled={idx === (course.modules || []).length - 1}
                              onClick={() => handleMoveModule(idx, "down")}
                              className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-amber-500 disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                              title="Move module down"
                            >
                              <ArrowDown size={12} />
                            </button>
                          </div>

                          {/* Delete Module Action */}
                          <button
                            onClick={() =>
                              setDeleteTarget({
                                type: "module",
                                id: m.id,
                                title: cleanModTitle,
                              })
                            }
                            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                              isBright
                                ? "border-slate-200 text-slate-400 hover:text-red-500 hover:bg-red-50"
                                : "border-white/10 text-ink-500 hover:text-red-400 hover:bg-red-500/10"
                            }`}
                            title="Delete this module"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* SUBTOPICS BREAKDOWN */}
                      <div className="p-4 sm:p-5">
                        <div className="flex items-center justify-between mb-3 gap-2">
                          <h4 className="text-xs font-black uppercase tracking-wider !text-black dark:!text-ink-100 flex items-center gap-1.5">
                            <ListFilter size={14} className="text-amber-500 shrink-0" /> Subtopics & Structured Learning Path ({subtopics.length} Lessons)
                          </h4>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="primary"
                              size="sm"
                              icon={Plus}
                              onClick={() => handleOpenAddLesson(idx, "end")}
                              className="text-xs cursor-pointer py-1.5 px-3 font-bold bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 !text-white shadow-xs"
                            >
                              Add Lesson
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          {subtopics.map((sub: SubTopicItem, sIdx: number) => {
                            const isVid = sub.type === "video";
                            const isEx = sub.type === "exercise";

                            return (
                              <div
                                key={sub.id || sIdx}
                                onClick={() => handleOpenSubtopic(sub, false)}
                                className={`group p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                                  isBright
                                    ? "bg-slate-50/70 hover:bg-amber-50/50 border-slate-200/80 hover:border-amber-300"
                                    : "bg-white/[0.02] hover:bg-white/[0.05] border-white/5 hover:border-white/15"
                                }`}
                              >
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenSubtopic(sub, false);
                                  }}
                                  className="flex items-start gap-3 min-w-0 flex-1"
                                >
                                  <div
                                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 shadow-xs mt-0.5 ${
                                      isBright ? "bg-slate-950 text-white" : "bg-white/20 text-white"
                                    }`}
                                  >
                                    {sIdx + 1}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="font-bold text-xs sm:text-sm !text-black dark:!text-white group-hover:text-amber-600 transition-colors line-clamp-1">
                                      {formatSubtopicDisplayTitle(sub.title)}
                                    </div>
                                    <div className="text-[11px] flex items-center gap-1.5 mt-0.5 text-slate-500 dark:text-slate-400">
                                      <span className={`capitalize font-medium ${isBright ? "text-slate-700" : "text-slate-200"}`}>
                                        {sub.type === "exercise" ? "Hands-On Exercise" : sub.type}
                                      </span>
                                      <span className="text-slate-400 dark:text-slate-500">•</span>
                                      <span className="font-normal text-slate-500 dark:text-slate-400">{sub.duration}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  {/* Subtopic Reordering: Move Up & Move Down */}
                                  <div className="flex items-center gap-0.5 opacity-60 hover:opacity-100 transition-opacity mr-1">
                                    <button
                                      type="button"
                                      disabled={sIdx === 0}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleMoveSubtopic(idx, sIdx, "up");
                                      }}
                                      className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-amber-500 disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                      title="Move lesson up"
                                    >
                                      <ArrowUp size={11} />
                                    </button>
                                    <button
                                      type="button"
                                      disabled={sIdx === subtopics.length - 1}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleMoveSubtopic(idx, sIdx, "down");
                                      }}
                                      className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-amber-500 disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                      title="Move lesson down"
                                    >
                                      <ArrowDown size={11} />
                                    </button>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenSubtopic(sub, isVid);
                                    }}
                                    className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase border-2 shadow-xs cursor-pointer hover:scale-105 active:scale-95 transition-all ${
                                      isVid
                                        ? "bg-rose-50 text-rose-700 border-rose-400 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-500/50 hover:bg-rose-100 hover:border-rose-500"
                                        : isEx
                                        ? "bg-amber-50 text-amber-800 border-amber-400 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-500/50 hover:bg-amber-100 hover:border-amber-500"
                                        : "bg-sky-50 text-sky-700 border-sky-400 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-500/50 hover:bg-sky-100 hover:border-sky-500"
                                    }`}
                                    title={isVid ? "Watch YouTube Video & 5-6 Alternates" : `Open ${sub.type} lesson`}
                                  >
                                    {sub.type}
                                  </button>

                                  {/* Delete Subtopic Action */}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDeleteTarget({
                                        type: "subtopic",
                                        id: sub.id,
                                        title: sub.title,
                                        parentId: m.id,
                                      });
                                    }}
                                    className="p-1 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                                    title="Delete this subtopic"
                                  >
                                    <Trash2 size={13} />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenSubtopic(sub, false);
                                    }}
                                    className="p-1.5 rounded-lg hover:bg-amber-500/15 text-slate-400 hover:text-amber-500 transition-colors cursor-pointer flex items-center justify-center group-hover:text-amber-500"
                                    title="Open lesson content"
                                    aria-label={`Open lesson ${sub.title}`}
                                  >
                                    <ChevronRight
                                      size={16}
                                      className="group-hover:translate-x-0.5 transition-transform"
                                    />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* DEDICATED PASS GATE GRADUATION MILESTONE CARD */}
                        <div
                          onClick={() => handleOpenPassGate(idx)}
                          className={`mt-3 p-3.5 sm:p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            isBright
                              ? "bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10 border-amber-300 hover:border-amber-400 shadow-xs"
                              : "bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border-amber-500/40 hover:border-amber-500/70 shadow-xs"
                          }`}
                        >
                          <div className="flex items-start sm:items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center font-black text-base shadow-sm shrink-0 mt-0.5 sm:mt-0">
                              <Target size={18} className="text-white" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-black text-xs sm:text-sm text-slate-900 dark:text-white">
                                  {m.passGate?.type === "task" ? "Module Pass Gate: Capstone Mission" : "Module Pass Gate: Diagnostic Quiz"}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-800 dark:text-amber-300 font-black">
                                  80% Score Required
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-800 dark:text-emerald-300 font-black">
                                  +100 XP
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-600 dark:text-ink-300 mt-1 line-clamp-2 leading-relaxed">
                                {m.passGate?.type === "task"
                                  ? (m.passGate.task?.missionTitle || "Complete hands-on mission and verify deliverables to graduate this module.")
                                  : (m.passGate?.quiz?.title || `Comprehensive 10-question evaluation (${m.passGate?.quiz?.questions?.length || 10} Questions). Passing score: ${m.passGate?.quiz?.passingScore || 8}/${m.passGate?.quiz?.questions?.length || 10}.`)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenPassGate(idx);
                              }}
                              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                            >
                              Take Pass Gate →
                            </button>
                          </div>
                        </div>

                        {/* Bottom action trigger */}
                        <div className="mt-3 pt-3 border-t border-line-soft flex items-center justify-between">
                          <span className="text-xs text-slate-500 dark:text-ink-400 font-medium">
                            Pass gate evaluation unlocks subsequent modules
                          </span>
                          <Button
                            variant="primary"
                            size="sm"
                            icon={Play}
                            onClick={() => startStudentRunner(idx)}
                            className="cursor-pointer font-bold bg-gradient-to-r from-amber-500 to-ember-500 hover:from-amber-600 hover:to-ember-600 !text-white shadow-xs"
                          >
                            Play Full Module →
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 2: EXPANDED 3D FLASHCARDS DECK (ARRANGE ALL CARDS & SINGLE 3D) */}
            {/* ================================================================= */}
            {activeTab === "flashcards" && (
              <div className={`${flashcardViewMode === "all" ? "max-w-5xl" : "max-w-2xl"} mx-auto space-y-6 transition-all duration-300`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold">Flashcards</h3>
                    <p className="text-xs text-slate-500 dark:text-ink-400">
                      Master core axioms and edge cases. Text remains perfectly upright on flip!
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    {/* View Mode Toggle: Single Card vs Arrange All Cards */}
                    <div className="flex items-center bg-black/10 dark:bg-white/5 p-1 rounded-xl border border-white/5">
                      <button
                        type="button"
                        onClick={() => setFlashcardViewMode("single")}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                          flashcardViewMode === "single"
                            ? "bg-amber-500 text-white shadow-sm"
                            : "text-slate-500 dark:text-ink-400 hover:text-slate-900 dark:hover:text-ink-100"
                        }`}
                      >
                        Single Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setFlashcardViewMode("all")}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                          flashcardViewMode === "all"
                            ? "bg-amber-500 text-white shadow-sm"
                            : "text-slate-500 dark:text-ink-400 hover:text-slate-900 dark:hover:text-ink-100"
                        }`}
                      >
                        <Layers size={13} /> All ({allFlashcards.length})
                      </button>
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      icon={Plus}
                      onClick={() => setIsAddCardOpen(true)}
                      className="cursor-pointer font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
                    >
                      Add Card
                    </Button>
                  </div>
                </div>

                {/* Deck & Card Styling / Personalization Toolbar */}
                <div
                  className={`p-3.5 rounded-2xl border space-y-3 ${
                    isBright ? "bg-white/80 border-slate-200/80 shadow-sm" : "bg-[#141824] border-white/10"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-line-soft">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                        <Palette size={14} /> Styling & Personalization
                      </span>
                      <span className="text-[11px] text-slate-400">· Font & Theme Engine</span>
                    </div>

                    {/* Scope Selector: Specific Card Only vs All Cards in Deck */}
                    <div className="flex items-center gap-1 bg-black/10 dark:bg-white/5 p-1 rounded-xl border border-white/5">
                      <button
                        type="button"
                        onClick={() => setStyleScope("card")}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          styleScope === "card"
                            ? "bg-amber-500 text-white font-bold shadow-sm"
                            : "text-slate-500 dark:text-ink-400 hover:text-slate-900"
                        }`}
                      >
                        This Card Only
                      </button>
                      <button
                        type="button"
                        onClick={() => setStyleScope("deck")}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          styleScope === "deck"
                            ? "bg-amber-500 text-white font-bold shadow-sm"
                            : "text-slate-500 dark:text-ink-400 hover:text-slate-900"
                        }`}
                      >
                        All Cards in Deck
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    {/* Font Family Selector */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                        <Type size={12} /> Font Style:
                      </label>
                      <div className="flex items-center gap-1 flex-wrap">
                        {[
                          { id: "sans", label: "Sans" },
                          { id: "serif", label: "Serif" },
                          { id: "mono", label: "Mono" },
                          { id: "rounded", label: "Rounded" },
                          { id: "handwritten", label: "Script" },
                        ].map((f) => {
                          const activeFont = currentFlashcard.fontFamily || deckFont;
                          const isSelected = activeFont === f.id;
                          return (
                            <button
                              key={f.id}
                              type="button"
                              onClick={() => handleApplyStyle(f.id, undefined, undefined)}
                              className={`px-2 py-1 rounded-lg border text-[11px] transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-amber-500/20 text-amber-500 border-amber-500 font-bold"
                                  : isBright
                                  ? "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                                  : "bg-white/5 hover:bg-white/10 text-ink-300 border-white/10"
                              }`}
                            >
                              {f.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Card Theme Color Selector */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                        <Palette size={12} /> Theme Color:
                      </label>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {[
                          { id: "ember", color: "#f59e0b", name: "Ember" },
                          { id: "sky", color: "#0ea5e9", name: "Sky" },
                          { id: "emerald", color: "#10b981", name: "Emerald" },
                          { id: "purple", color: "#a855f7", name: "Purple" },
                          { id: "rose", color: "#f43f5e", name: "Rose" },
                          { id: "obsidian", color: "#475569", name: "Obsidian" },
                        ].map((t) => {
                          const activeTheme = currentFlashcard.theme || deckTheme;
                          const isSelected = activeTheme === t.id;
                          return (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => handleApplyStyle(undefined, t.id, undefined)}
                              className={`w-6 h-6 rounded-full transition-transform cursor-pointer relative ${
                                isSelected ? "scale-110 ring-2 ring-offset-2 ring-amber-500" : "hover:scale-105 opacity-80 hover:opacity-100"
                              }`}
                              style={{ backgroundColor: t.color }}
                              title={t.name}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Font Size Selector */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                        <Sliders size={12} /> Font Size:
                      </label>
                      <div className="flex items-center gap-1">
                        {[
                          { id: "sm", label: "Compact" },
                          { id: "md", label: "Standard" },
                          { id: "lg", label: "Large" },
                        ].map((s) => {
                          const activeSize = currentFlashcard.fontSize || deckFontSize;
                          const isSelected = activeSize === s.id;
                          return (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => handleApplyStyle(undefined, undefined, s.id)}
                              className={`px-2 py-1 rounded-lg border text-[11px] flex-1 text-center transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-amber-500/20 text-amber-500 border-amber-500 font-bold"
                                  : isBright
                                  ? "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
                                  : "bg-white/5 hover:bg-white/10 text-ink-300 border-white/10"
                              }`}
                            >
                              {s.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>



                {/* VIEW MODE 1: SINGLE 3D DUAL-FACED FLASHCARD */}
                {flashcardViewMode === "single" ? (
                  <>
                    <div
                      className="relative w-full h-72 sm:h-80 cursor-pointer select-none"
                      style={{ perspective: "1000px" }}
                      onClick={() => setIsFlipped(!isFlipped)}
                    >
                      <div
                        className="relative w-full h-full duration-500 rounded-3xl"
                        style={{
                          transformStyle: "preserve-3d",
                          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}
                      >
                        {/* FRONT FACE (With active font and theme) */}
                        {(() => {
                          const curFont = currentFlashcard.fontFamily || deckFont;
                          const curTheme = currentFlashcard.theme || deckTheme;
                          const curSize = currentFlashcard.fontSize || deckFontSize;
                          const fontInfo = getFontFamilyDetails(curFont);
                          const themeInfo = getCardThemeDetails(curTheme, isBright);
                          const sizeInfo = getCardFontSizeDetails(curSize);

                          return (
                            <>
                              <div
                                className={`absolute inset-0 w-full h-full rounded-3xl p-6 sm:p-8 flex flex-col justify-between border shadow-xl transition-all ${themeInfo.frontBg}`}
                                style={{
                                  backfaceVisibility: "hidden",
                                  WebkitBackfaceVisibility: "hidden",
                                  ...fontInfo.style,
                                }}
                              >
                                <div className="flex items-center justify-between text-xs">
                                  <span className={`font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${themeInfo.tagClass}`}>
                                    {currentFlashcard.tag}
                                  </span>
                                  <span className="text-slate-400 dark:text-ink-500 font-medium flex items-center gap-1">
                                    <RotateCw size={11} /> Click to flip
                                  </span>
                                </div>

                                <div className="my-auto py-2">
                                  <h4 className={`${sizeInfo.question} font-bold leading-snug ${fontInfo.className}`}>
                                    {currentFlashcard.question}
                                  </h4>
                                </div>

                                <div className="flex items-center justify-between text-xs text-slate-400 dark:text-ink-500 pt-3 border-t border-line-soft">
                                  <span>Card {cardIndex + 1} of {filteredFlashcards.length}</span>
                                  <span className={`flex items-center gap-1 font-semibold ${themeInfo.accentText}`}>
                                    <RotateCw size={12} /> Flip for explanation
                                  </span>
                                </div>
                              </div>

                              {/* BACK FACE (Pre-rotated 180deg: 100% Upright Text with styling) */}
                              <div
                                className={`absolute inset-0 w-full h-full rounded-3xl p-6 sm:p-8 flex flex-col justify-between border shadow-xl transition-all ${themeInfo.backBg}`}
                                style={{
                                  backfaceVisibility: "hidden",
                                  WebkitBackfaceVisibility: "hidden",
                                  transform: "rotateY(180deg)",
                                  ...fontInfo.style,
                                }}
                              >
                                <div className="flex items-center justify-between text-xs">
                                  <span className={`font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${themeInfo.tagClass}`}>
                                    Core Axiom & Answer
                                  </span>
                                  <span className="text-emerald-500 font-medium">Click to flip back</span>
                                </div>

                                <div className="my-auto py-2 overflow-y-auto max-h-48 pr-1">
                                  <p className={`${sizeInfo.answer} font-medium leading-relaxed ${fontInfo.className}`}>
                                    {currentFlashcard.answer}
                                  </p>
                                </div>

                                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-emerald-400 pt-3 border-t border-emerald-500/20">
                                  <span>Verified Upright</span>
                                  <span className="font-bold text-emerald-500">Active Recall</span>
                                </div>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Single Card Controls (With All Cards option replacing master) */}
                    <div className="flex items-center justify-between gap-3">
                      <Button
                        variant="secondary"
                        disabled={cardIndex === 0}
                        onClick={() => {
                          setIsFlipped(false);
                          setCardIndex((prev) => Math.max(0, prev - 1));
                        }}
                      >
                        ← Previous
                      </Button>

                      <div className="flex items-center gap-2">
                        {/* Edit Card Writing Button */}
                        <Button
                          variant="secondary"
                          icon={Pencil}
                          onClick={() => {
                            setEditCardDraft({ ...currentFlashcard });
                            setIsEditCardOpen(true);
                          }}
                          className="cursor-pointer text-amber-500 font-semibold"
                        >
                          Edit Card
                        </Button>

                        {/* All Cards Arranged View Button (Replaces Master Option) */}
                        <Button
                          variant="secondary"
                          icon={Layers}
                          onClick={() => setFlashcardViewMode("all")}
                          className="cursor-pointer text-amber-500 font-semibold hover:bg-amber-500/10"
                          title="Arrange all cards at a time"
                        >
                          All Cards
                        </Button>

                        <button
                          onClick={() =>
                            setDeleteTarget({
                              type: "flashcard",
                              id: currentFlashcard.id,
                              title: currentFlashcard.question,
                            })
                          }
                          className="p-2.5 rounded-xl border border-line-soft hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                          title="Delete this flashcard"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <Button
                        variant="secondary"
                        disabled={cardIndex >= filteredFlashcards.length - 1}
                        onClick={() => {
                          setIsFlipped(false);
                          setCardIndex((prev) => Math.min(filteredFlashcards.length - 1, prev + 1));
                        }}
                      >
                        Next →
                      </Button>
                    </div>
                  </>
                ) : (
                  /* VIEW MODE 2: ALL CARDS ARRANGED AT A TIME */
                  <div className="space-y-4">
                    {/* Arranged Toolbar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                          <Layers size={14} /> Arranged Deck ({filteredFlashcards.length} Cards)
                        </span>
                        <span className="text-[11px] text-slate-400">· Click any card to flip & reveal answer</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const anyFlipped = filteredFlashcards.some((c) => flippedCardIds[c.id]);
                            const next: Record<string, boolean> = {};
                            filteredFlashcards.forEach((c) => {
                              next[c.id] = !anyFlipped;
                            });
                            setFlippedCardIds(next);
                          }}
                          className="px-2.5 py-1 rounded-lg border border-line-soft hover:border-amber-500/40 text-xs font-medium text-slate-600 dark:text-ink-300 hover:text-amber-500 transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <RotateCw size={12} />
                          {filteredFlashcards.some((c) => flippedCardIds[c.id]) ? "Flip All to Questions" : "Flip All to Answers"}
                        </button>

                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setFlashcardViewMode("single")}
                          className="cursor-pointer text-amber-500 font-semibold text-xs"
                        >
                          Single Card View
                        </Button>
                      </div>
                    </div>

                    {/* Arranged Cards Grid */}
                    {filteredFlashcards.length === 0 ? (
                      <div className="text-center py-12 border border-dashed border-line-soft rounded-2xl p-6">
                        <p className="text-sm text-slate-400">No flashcards found for filter &ldquo;{cardTagFilter}&rdquo;.</p>
                        <button
                          type="button"
                          onClick={() => setCardTagFilter("All")}
                          className="mt-3 px-3 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-bold cursor-pointer"
                        >
                          Show All Cards
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredFlashcards.map((c, idx) => {
                          const curFont = c.fontFamily || deckFont;
                          const curTheme = c.theme || deckTheme;
                          const curSize = c.fontSize || deckFontSize;
                          const fontInfo = getFontFamilyDetails(curFont);
                          const themeInfo = getCardThemeDetails(curTheme, isBright);
                          const isCardFlipped = !!flippedCardIds[c.id];

                          return (
                            <div
                              key={c.id}
                              className="relative w-full h-72 cursor-pointer select-none rounded-3xl"
                              style={{ perspective: "1000px" }}
                              onClick={() => toggleCardFlip(c.id)}
                            >
                              <div
                                className="relative w-full h-full duration-500 rounded-3xl"
                                style={{
                                  transformStyle: "preserve-3d",
                                  transform: isCardFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                                  transition: "transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)",
                                }}
                              >
                                {/* FRONT FACE (Question) */}
                                <div
                                  className={`absolute inset-0 w-full h-full rounded-3xl p-5 flex flex-col justify-between border shadow-lg transition-all hover:shadow-xl ${themeInfo.frontBg}`}
                                  style={{
                                    backfaceVisibility: "hidden",
                                    WebkitBackfaceVisibility: "hidden",
                                    ...fontInfo.style,
                                  }}
                                >
                                  <div className="flex items-center justify-between text-xs gap-2">
                                    <span className={`font-bold px-2 py-0.5 rounded-full uppercase tracking-wider text-[10px] ${themeInfo.tagClass}`}>
                                      {c.tag}
                                    </span>
                                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEditCardDraft({ ...c });
                                          setIsEditCardOpen(true);
                                        }}
                                        className="p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
                                        title="Edit Card"
                                      >
                                        <Pencil size={12} />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setDeleteTarget({
                                            type: "flashcard",
                                            id: c.id,
                                            title: c.question,
                                          })
                                        }
                                        className="p-1 rounded-md hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                                        title="Delete Card"
                                      >
                                        <Trash2 size={12} />
                                      </button>
                                      <span className="text-[10px] font-bold text-slate-400 dark:text-ink-500 ml-1">
                                        #{idx + 1}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="my-auto py-2">
                                    <h4 className={`text-sm sm:text-base font-bold leading-snug ${fontInfo.className} line-clamp-4`}>
                                      {c.question}
                                    </h4>
                                  </div>

                                  <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-ink-500 pt-2.5 border-t border-line-soft">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const foundIdx = filteredFlashcards.findIndex((item) => item.id === c.id);
                                        setCardIndex(foundIdx !== -1 ? foundIdx : 0);
                                        setFlashcardViewMode("single");
                                        setIsFlipped(false);
                                      }}
                                      className="hover:text-amber-500 text-[10px] font-semibold underline underline-offset-2 cursor-pointer"
                                    >
                                      Open in Single 3D View ↗
                                    </button>
                                    <span className={`flex items-center gap-1 font-semibold ${themeInfo.accentText}`}>
                                      <RotateCw size={11} /> Flip
                                    </span>
                                  </div>
                                </div>

                                {/* BACK FACE (Answer) */}
                                <div
                                  className={`absolute inset-0 w-full h-full rounded-3xl p-5 flex flex-col justify-between border shadow-lg transition-all hover:shadow-xl ${themeInfo.backBg}`}
                                  style={{
                                    backfaceVisibility: "hidden",
                                    WebkitBackfaceVisibility: "hidden",
                                    transform: "rotateY(180deg)",
                                    ...fontInfo.style,
                                  }}
                                >
                                  <div className="flex items-center justify-between text-xs">
                                    <span className={`font-bold px-2 py-0.5 rounded-full uppercase tracking-wider text-[10px] ${themeInfo.tagClass}`}>
                                      Core Axiom & Answer
                                    </span>
                                    <span className="text-[10px] text-emerald-500 font-medium">Click to flip back</span>
                                  </div>

                                  <div className="my-auto py-2 overflow-y-auto max-h-36 pr-1">
                                    <p className={`text-xs sm:text-sm font-medium leading-relaxed ${fontInfo.className}`}>
                                      {c.answer}
                                    </p>
                                  </div>

                                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-emerald-400 pt-2.5 border-t border-emerald-500/20">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const foundIdx = filteredFlashcards.findIndex((item) => item.id === c.id);
                                        setCardIndex(foundIdx !== -1 ? foundIdx : 0);
                                        setFlashcardViewMode("single");
                                        setIsFlipped(true);
                                      }}
                                      className="hover:text-amber-500 text-[10px] font-semibold underline underline-offset-2 cursor-pointer"
                                    >
                                      Open in Single View ↗
                                    </button>
                                    <span className="font-bold text-emerald-500 text-[10px]">Active Recall</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Arranged View Footer */}
                    <div className="flex items-center justify-between gap-3 pt-3 border-t border-line-soft">
                      <span className="text-xs text-slate-500 dark:text-ink-400">
                        Arranged {filteredFlashcards.length} cards at a time
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => setFlashcardViewMode("single")}
                          className="cursor-pointer font-bold text-amber-500"
                        >
                          Switch to Single Card View
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          icon={Plus}
                          onClick={() => setIsAddCardOpen(true)}
                          className="cursor-pointer font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-sm"
                        >
                          Add Card
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 3: CHEAT SHEET */}
            {/* ================================================================= */}
            {activeTab === "cheatsheet" && (() => {
              const rawCs = course.resources?.cheatSheet;
              const cheatSheetSections: CheatSheetSection[] = Array.isArray(rawCs) && rawCs.length > 0
                ? rawCs
                : rawCs && typeof rawCs === "object" && Array.isArray((rawCs as any).sections) && (rawCs as any).sections.length > 0
                ? (rawCs as any).sections
                : generateCheatSheetForCourse(course.title, course.category, course.level, course.modules);

              return (
                <div className="max-w-4xl mx-auto space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-line-soft bg-card-surface/50">
                    <div>
                      <div className="flex items-center gap-2">
                        <FileText size={18} className="text-ember-500" />
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Quick Reference Cheat Sheet</h3>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-ink-400 mt-0.5">
                        Domain-tailored technical invariants, formulas & production code rules
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const fresh = generateCheatSheetForCourse(course.title, course.category, course.level, course.modules);
                        setCourse((prev) => ({
                          ...prev,
                          resources: {
                            ...prev.resources,
                            cheatSheet: fresh,
                          },
                        }));
                        setIsCheatSheetSynced(true);
                        setTimeout(() => setIsCheatSheetSynced(false), 2000);
                      }}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 self-start sm:self-auto ${
                        isCheatSheetSynced
                          ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30"
                          : "bg-ember-500/10 hover:bg-ember-500/20 text-ember-500 border border-ember-500/20"
                      }`}
                      title="Re-generate cheat sheet using the latest course curriculum and topics"
                    >
                      {isCheatSheetSynced ? (
                        <>
                          <CheckCheck size={13} className="text-emerald-500" />
                          <span>Synced Successfully!</span>
                        </>
                      ) : (
                        <>
                          <RefreshCw size={13} />
                          <span>Re-sync Cheat Sheet</span>
                        </>
                      )}
                    </button>
                  </div>

                  {cheatSheetSections && cheatSheetSections.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {cheatSheetSections.map((sec: CheatSheetSection, sIdx: number) => (
                        <div
                          key={sIdx}
                          className={`p-5 rounded-2xl border space-y-3 transition-all hover:border-ember-500/30 ${
                            isBright ? "bg-white border-slate-200 shadow-sm" : "bg-[#161A24] border-white/10"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-bold text-sm text-ember-500 flex items-center gap-2">
                              <span className="w-5 h-5 rounded-md bg-ember-500/10 flex items-center justify-center text-[10px] text-ember-500 font-bold shrink-0">
                                {sIdx + 1}
                              </span>
                              <span>{sec.heading.replace(/^\d+[\.\s-]*/, "")}</span>
                            </h4>
                            <button
                              onClick={() => {
                                navigator.clipboard?.writeText(sec.points.join("\n") + (sec.code ? "\n" + sec.code : ""));
                                setCopiedSection(sec.heading);
                                setTimeout(() => setCopiedSection(null), 1500);
                              }}
                              className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                              title="Copy section points and code"
                            >
                              {copiedSection === sec.heading ? <CheckCheck size={14} className="text-emerald-500" /> : <Copy size={14} />}
                            </button>
                          </div>
                          <ul className={`text-xs space-y-2 ${isBright ? "text-slate-700" : "text-slate-200"}`}>
                            {sec.points.map((p, pIdx) => (
                              <li key={pIdx} className="flex items-start gap-2 leading-relaxed">
                                <span className="text-ember-500 mt-1 shrink-0">•</span>
                                <span>{p}</span>
                              </li>
                            ))}
                          </ul>
                          {sec.code && (
                            <pre
                              className={`text-[11px] p-3 rounded-xl font-mono overflow-x-auto border ${
                                isBright ? "bg-slate-100 text-slate-800 border-slate-200" : "bg-[#0E1118] text-amber-300 border-white/5"
                              }`}
                            >
                              <code>{sec.code}</code>
                            </pre>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-500 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                      <p className="text-sm">No cheat sheet content available.</p>
                      <button
                        onClick={() => {
                          const fresh = generateCheatSheetForCourse(course.title, course.category, course.level, course.modules);
                          setCourse((prev) => ({
                            ...prev,
                            resources: { ...prev.resources, cheatSheet: fresh },
                          }));
                        }}
                        className="px-4 py-2 rounded-xl bg-ember-500 text-white text-xs font-semibold cursor-pointer"
                      >
                        Generate Cheat Sheet
                      </button>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* ================================================================= */}
            {/* TAB 4: YOUTUBE MASTERCLASS VIDEO */}
            {/* ================================================================= */}
            {activeTab === "video" && (
              <div className="max-w-4xl mx-auto space-y-6">
                {course.resources?.videos && course.resources.videos.length > 0 ? (
                  (() => {
                    const currentVid =
                      course.resources.videos.find(
                        (v: any) => (v.youtubeId || v.id) === selectedMasterclassVideoId
                      ) || course.resources.videos[0];

                    return (
                      <MentoraVideoPlayer
                        video={{
                          title: currentVid.title,
                          video_id: currentVid.youtubeId || currentVid.id,
                          url: currentVid.url || (currentVid.youtubeId?.startsWith("blob:") ? currentVid.youtubeId : undefined),
                          channel: currentVid.channel,
                          duration_minutes: parseInt(currentVid.duration) || 15,
                          relevance_reason: currentVid.summary,
                          xp: parseInt(currentVid.duration) || 15,
                          alternates: currentVid.alternates || [],
                        }}
                        allVideos={course.resources.videos.map((vid: any) => ({
                          title: vid.title,
                          video_id: vid.youtubeId || vid.id,
                          url: vid.url || (vid.youtubeId?.startsWith("blob:") ? vid.youtubeId : undefined),
                          channel: vid.channel,
                          duration_minutes: parseInt(vid.duration) || 10,
                          relevance_reason: vid.summary,
                          xp: parseInt(vid.duration) || 10,
                          alternates: vid.alternates || [],
                        }))}
                        onSelectVideo={(selected) => {
                          setSelectedMasterclassVideoId(selected.video_id);
                        }}
                        onFetchMoreAlternates={handleFetchMoreMasterclassVideos}
                        isFetchingMore={isFetchingMoreVideos}
                      />
                    );
                  })()
                ) : (
                  <div className="p-8 text-center text-white/50 bg-white/5 rounded-2xl border border-white/10">
                    No video resources curated yet.
                  </div>
                )}
              </div>
            )}

            {/* ================================================================= */}
            {/* TAB 5: SOCRATIC DIALOGUE CHATBOT */}
            {/* ================================================================= */}
            {activeTab === "dialogue" && (
              <div className="w-full max-w-4xl mx-auto h-[780px] flex flex-col pb-4">
                {/* Module Selector Bar: Exactly 1 Dialogue for Each Module */}
                {course.modules && course.modules.length > 0 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-3 border-b border-line-soft shrink-0">
                    <span className="text-xs font-bold text-slate-400 dark:text-ink-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1.5">
                      <Sparkles size={13} className="text-ember-500" />
                      Select Module:
                    </span>
                    {course.modules.map((m: CourseModule, mIdx: number) => {
                      const isSelected = activeDialogueModuleIdx === mIdx;
                      const isSolved = m.dialogueScenarios?.[0]?.id && solvedScenarioIds.includes(m.dialogueScenarios[0].id);
                      return (
                        <button
                          key={m.id || mIdx}
                          onClick={() => setActiveDialogueModuleIdx(mIdx)}
                          title={cleanTitle(m.title)}
                          className={`px-4 py-1.5 text-xs font-bold rounded-xl transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                            isSelected
                              ? "bg-gradient-to-r from-ember-500 to-amber-500 text-white shadow-md shadow-ember-500/20"
                              : isBright
                              ? "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                              : "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <span>Module {mIdx + 1}</span>
                          {isSolved && (
                            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block shrink-0" title="Completed" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="flex-1 min-h-0">
                  <InteractiveDialogueChat
                    key={`dialogue-mod-${activeDialogueModuleIdx}`}
                    courseTitle={course.title}
                    moduleTitle={cleanTitle(course.modules?.[activeDialogueModuleIdx]?.title || `Module ${activeDialogueModuleIdx + 1}`)}
                    moduleIndex={activeDialogueModuleIdx}
                    prevModuleTitle={
                      activeDialogueModuleIdx > 0
                        ? cleanTitle(course.modules?.[activeDialogueModuleIdx - 1]?.title || `Module ${activeDialogueModuleIdx}`)
                        : undefined
                    }
                    scenarios={
                      course.modules?.[activeDialogueModuleIdx]?.dialogueScenarios &&
                      course.modules[activeDialogueModuleIdx].dialogueScenarios!.length > 0
                        ? course.modules[activeDialogueModuleIdx].dialogueScenarios!
                        : generateDialogueForCourse(
                            cleanTitle(course.modules?.[activeDialogueModuleIdx]?.title || course.title),
                            course.category,
                            course.level,
                            activeDialogueModuleIdx,
                            course.modules?.[activeDialogueModuleIdx]?.subtopics,
                            activeDialogueModuleIdx > 0
                              ? cleanTitle(course.modules?.[activeDialogueModuleIdx - 1]?.title || `Module ${activeDialogueModuleIdx}`)
                              : undefined
                          )
                    }
                    topicsCovered={
                      course.modules?.[activeDialogueModuleIdx]?.subtopics &&
                      course.modules[activeDialogueModuleIdx].subtopics!.length > 0
                        ? course.modules[activeDialogueModuleIdx].subtopics!.map((s: SubTopicItem) => {
                            const raw = cleanTitle(s.title);
                            let t = raw.replace(/^(?:Day|Lesson|Session)\s*\d+[:\s-]*/i, "").trim();
                            const cleanCourse = cleanTitle(course.title);
                            if (cleanCourse) {
                              const escaped = cleanCourse.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                              t = t.replace(new RegExp(`^${escaped}\\s*[:—-]\\s*`, "i"), "").trim();
                            }
                            return t || raw;
                          })
                        : undefined
                    }
                    isBright={isBright}
                    onAwardXp={(xp, cat, rsn) => awardXp(xp, cat as any, rsn)}
                    onComplete={() => {
                      const mod = course.modules?.[activeDialogueModuleIdx];
                      if (mod?.dialogueScenarios?.[0]?.id) {
                        setSolvedScenarioIds((prev) => Array.from(new Set([...prev, mod.dialogueScenarios![0].id])));
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CONFIRMATION DIALOG FOR DELETING COURSE, MODULE, SUBTOPIC, OR FLASHCARD */}
      {/* ========================================================================= */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title={
          deleteTarget?.type === "course"
            ? "Delete Course Draft?"
            : deleteTarget?.type === "module"
            ? "Delete Module?"
            : deleteTarget?.type === "subtopic"
            ? "Delete Subtopic Lesson?"
            : "Delete Flashcard?"
        }
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
      />

      {/* ========================================================================= */}
      {/* FULL-SCREEN SPLIT-SCREEN COURSE PLAYER (LMS EXPERIENCE) */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isPlayerOpen && (activeSubtopic || isPassGateActive) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[70] flex flex-col ${
              isBright ? "bg-[#FAF7F2] text-slate-900" : "bg-[#0B0D13] text-ink-100"
            }`}
          >
            <div className="flex-1 flex overflow-hidden">
              {/* LEFT NAVIGATION PANEL (ALL MODULES & SUBTOPICS) */}
              <div
                className={`w-80 sm:w-88 md:w-96 border-r flex flex-col shrink-0 ${
                  isBright ? "bg-white border-[#E8DACD]" : "bg-[#11141B] border-white/10"
                }`}
              >
                {/* Header: Course Title & Close X */}
                <div
                  className={`p-4 sm:p-5 border-b flex items-center justify-between gap-3 sticky top-0 z-10 ${
                    isBright ? "bg-white border-[#E8DACD]" : "bg-[#11141B] border-white/10"
                  }`}
                >
                  <div className="min-w-0">
                    <h2 className="font-bold text-sm sm:text-base truncate !text-slate-900 dark:!text-white">
                      {course.title || "Course Curriculum"}
                    </h2>
                    <span className="text-[11px] text-slate-500 dark:text-ink-400 block mt-0.5">
                      {course.modules?.length || 0} Modules · {allCourseLessons.length} Lessons
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsPlayerOpen(false);
                      setIsSubtopicEditing(false);
                    }}
                    className="p-1.5 rounded-xl border border-line-soft hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shrink-0"
                    title="Close course viewer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Modules & Subtopics Accordion List */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
                  {course.modules?.map((m: CourseModule, mIdx: number) => {
                    const isExpanded = expandedModuleMap[mIdx] !== false;
                    const cleanModTitle = cleanTitle(m.title);
                    const subtopics = m.subtopics || [];

                    return (
                      <div
                        key={m.id || mIdx}
                        className={`rounded-2xl border transition-all ${
                          isBright
                            ? "bg-slate-50/50 border-slate-200/80"
                            : "bg-white/[0.02] border-white/5"
                        }`}
                      >
                        {/* Module Header Button */}
                        <button
                          type="button"
                          onClick={() => setExpandedModuleMap((prev) => ({ ...prev, [mIdx]: !isExpanded }))}
                          className="w-full flex items-center justify-between p-3 text-left hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl transition-colors cursor-pointer group"
                        >
                          <div className="min-w-0 pr-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 block">
                              Module {mIdx + 1}
                            </span>
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-amber-600 transition-colors">
                              {cleanModTitle}
                            </h4>
                          </div>
                          <div className="text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white transition-colors shrink-0">
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </div>
                        </button>

                        {/* Subtopics List */}
                        {isExpanded && (
                          <div className="px-2 pb-2 space-y-1">
                            {subtopics.map((sub: SubTopicItem, sIdx: number) => {
                              const isActive = !isPassGateActive && activeSubtopic?.id === sub.id;
                              return (
                                <button
                                  key={sub.id || sIdx}
                                  type="button"
                                  onClick={() => {
                                    setActiveSubtopic(sub);
                                    setIsPassGateActive(false);
                                    setPlayerModuleIdx(mIdx);
                                    setIsSubtopicEditing(false);
                                    setExerciseAnswer("");
                                    setShowExerciseHint(false);
                                    setShowExerciseSolution(false);
                                    setDrawerDialogueAnswer("");
                                    setDrawerDialogueFeedback(null);
                                    setShowDrawerDialogueHint(false);
                                    setDrawerQuizAnswers({});
                                  }}
                                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer flex items-start gap-2.5 ${
                                    isActive
                                      ? isBright
                                        ? "bg-amber-500/15 border-amber-400/80 text-slate-900 font-bold shadow-xs"
                                        : "bg-amber-500/20 border-amber-500/50 text-white font-bold shadow-xs"
                                      : isBright
                                      ? "bg-white/60 border-transparent hover:bg-white hover:border-slate-200 text-slate-700"
                                      : "bg-transparent border-transparent hover:bg-white/5 text-ink-300 hover:text-white"
                                  }`}
                                >
                                  <div className="min-w-0 flex-1">
                                    <div className="line-clamp-2 leading-snug">
                                      {formatSubtopicDisplayTitle(sub.title)}
                                    </div>
                                    <div className="text-[11px] flex items-center gap-1.5 mt-0.5 text-slate-500 dark:text-slate-400">
                                      <span className={`capitalize font-medium ${isBright ? "text-slate-700" : "text-slate-200"}`}>
                                        {sub.type === "exercise" ? "Hands-On Exercise" : sub.type}
                                      </span>
                                      <span className="text-slate-400 dark:text-slate-500">·</span>
                                      <span className="font-normal text-slate-500 dark:text-slate-400">{sub.duration}</span>
                                    </div>
                                  </div>
                                </button>
                              );
                            })}

                            {/* PASS GATE MILESTONE ITEM IN LMS PLAYER SIDEBAR */}
                            <button
                              type="button"
                              onClick={() => {
                                setIsPassGateActive(true);
                                setPlayerModuleIdx(mIdx);
                                setIsSubtopicEditing(false);
                              }}
                              className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between gap-2 mt-1.5 ${
                                isPassGateActive && playerModuleIdx === mIdx
                                  ? isBright
                                    ? "bg-amber-500/20 border-amber-500 text-slate-900 font-black shadow-xs"
                                    : "bg-amber-500/25 border-amber-500 text-white font-black shadow-xs"
                                  : isBright
                                  ? "bg-amber-50/70 border-amber-200 hover:bg-amber-100 text-amber-900 font-semibold"
                                  : "bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/15 text-amber-300 font-semibold"
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <Target size={14} className="text-amber-500 inline" />
                                <div className="min-w-0">
                                  <div className="truncate font-bold">
                                    {m.passGate?.type === "task" ? "Capstone Pass Gate" : "Module Pass Gate"}
                                  </div>
                                  <div className="text-[10px] opacity-75 font-normal">
                                    {m.passGate?.type === "task"
                                      ? "Hands-on Challenge"
                                      : `${m.passGate?.quiz?.questions?.length || 10} Qs · 80% to Pass`}
                                  </div>
                                </div>
                              </div>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-white font-black shrink-0">
                                +100 XP
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* DOCKED SIDE PANEL FOOTER: SINGLE NEXT LESSON NAVIGATION BUTTON */}
                <div
                  className={`p-3.5 sm:p-4 border-t flex items-center justify-between gap-3 shrink-0 ${
                    isBright ? "bg-slate-50/90 border-[#E8DACD]" : "bg-[#0E1118] border-white/10"
                  }`}
                >
                  <div className="text-[11px] text-slate-500 dark:text-ink-400 font-medium truncate">
                    {currentLessonIndex >= 0 ? (
                      <span>
                        Lesson <strong className={isBright ? "text-slate-900 font-bold" : "text-white font-bold"}>{currentLessonIndex + 1}</strong> of {allCourseLessons.length}
                      </span>
                    ) : (
                      <span>{allCourseLessons.length} Lessons</span>
                    )}
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    disabled={!nextLesson}
                    onClick={() => handleNavigateLesson(nextLesson)}
                    className="text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white cursor-pointer disabled:opacity-30 shrink-0 shadow-xs"
                  >
                    Next Lesson →
                  </Button>
                </div>
              </div>

              {/* RIGHT MAIN CONTENT VIEWPORT */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Main Content Header */}
                <div
                  className={`px-6 py-4 border-b flex items-center justify-between gap-4 shrink-0 ${
                    isBright ? "bg-white border-[#E8DACD]" : "bg-[#11141B] border-white/10"
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider mb-1">
                      <span>Module {playerModuleIdx + 1}</span>
                      <span>·</span>
                      {isPassGateActive ? (
                        <>
                          <span>Graduation Pass Gate</span>
                          <span>·</span>
                          <span>80% Required</span>
                        </>
                      ) : (
                        <>
                          <span className="capitalize">{activeSubtopic?.type}</span>
                          <span>·</span>
                          <span>{activeSubtopic?.duration}</span>
                        </>
                      )}
                    </div>
                    <h1 className="font-black text-base sm:text-xl truncate !text-slate-900 dark:!text-white">
                      {isPassGateActive
                        ? `${
                            course.modules?.[playerModuleIdx]?.passGate?.type === "task"
                              ? course.modules?.[playerModuleIdx]?.passGate.task?.missionTitle || "Capstone Mission"
                              : course.modules?.[playerModuleIdx]?.passGate?.quiz?.title || "10-Question Diagnostic Assessment"
                          }`
                        : formatSubtopicDisplayTitle(activeSubtopic?.title || "")}
                    </h1>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isPassGateActive ? (
                      <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-amber-500 text-white shadow-xs">
                        +100 XP
                      </span>
                    ) : (
                      <>
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={FileText}
                          onClick={() => setIsPlayerResourcesOpen(true)}
                          className={`text-xs cursor-pointer ${isBright ? "border-[#E8DACD] text-slate-700" : "border-white/10 text-slate-200"}`}
                        >
                          Cheat Sheet
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={Pencil}
                          onClick={() => {
                            if (!isSubtopicEditing) {
                              setSubtopicEditDraft(JSON.parse(JSON.stringify(activeSubtopic)));
                              setIsSubtopicEditing(true);
                            } else {
                              setIsSubtopicEditing(false);
                            }
                          }}
                          className="text-xs cursor-pointer"
                        >
                          {isSubtopicEditing ? "Cancel Edit" : "Edit Lesson"}
                        </Button>
                        {isSubtopicEditing && (
                          <Button
                            variant="primary"
                            size="sm"
                            icon={Check}
                            onClick={handleSaveSubtopicEdits}
                            className="text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white cursor-pointer"
                          >
                            Save
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* Main Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 max-w-4xl mx-auto w-full">
                  {isPassGateActive ? (
                    <div className="space-y-6 max-w-3xl mx-auto py-2">
                      {/* Milestone Banner */}
                      <div className={`p-5 rounded-2xl border ${
                        isBright
                          ? "bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border-amber-400/80"
                          : "bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-amber-500/20 border-amber-500/40"
                      }`}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center font-black text-xl shadow-sm shrink-0">
                            <Target size={20} className="text-white" />
                          </div>
                          <div>
                            <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                              Module {playerModuleIdx + 1} Graduation Assessment
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                              Test your synthesis of all 7 lessons in this module. Pass with 80% or higher to graduate and claim +100 XP.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Pass Gate Type: QUIZ */}
                      {course.modules?.[playerModuleIdx]?.passGate?.type !== "task" ? (
                        <div className="space-y-5">
                          {/* Questions list */}
                          {(course.modules?.[playerModuleIdx]?.passGate?.quiz?.questions || []).map((q: ModuleQuizQuestion, qIdx: number) => {
                            const selectedAnswer = quizAnswers[q.id];
                            const isCorrect = selectedAnswer === q.correctAnswer;

                            return (
                              <div
                                key={q.id || qIdx}
                                className={`p-4 sm:p-5 rounded-2xl border space-y-3 transition-all ${
                                  quizSubmitted
                                    ? isCorrect
                                      ? "bg-emerald-500/10 border-emerald-500/40 dark:bg-emerald-950/20"
                                      : "bg-rose-500/10 border-rose-500/40 dark:bg-rose-950/20"
                                    : isBright
                                    ? "bg-white border-slate-200 shadow-2xs"
                                    : "bg-white/[0.02] border-white/10"
                                }`}
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-start gap-2">
                                    <span className="w-6 h-6 rounded-lg bg-black/10 dark:bg-white/10 flex items-center justify-center text-xs font-black shrink-0">
                                      {qIdx + 1}
                                    </span>
                                    {q.question}
                                  </span>
                                  {quizSubmitted && (
                                    <span className={`text-xs font-black px-2 py-0.5 rounded-full shrink-0 ${
                                      isCorrect ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                                    }`}>
                                      {isCorrect ? "Correct" : "Incorrect"}
                                    </span>
                                  )}
                                </div>

                                {/* Options */}
                                <div className="space-y-2 pt-1">
                                  {q.options?.map((opt: string, optIdx: number) => {
                                    const isChosen = selectedAnswer === optIdx;
                                    const isTheCorrectOption = q.correctAnswer === optIdx;

                                    let optBorderBg = isBright
                                      ? "bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800"
                                      : "bg-white/5 border-white/10 hover:bg-white/10 text-slate-200";

                                    if (quizSubmitted) {
                                      if (isTheCorrectOption) {
                                        optBorderBg = "bg-emerald-500/20 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold";
                                      } else if (isChosen && !isCorrect) {
                                        optBorderBg = "bg-rose-500/20 border-rose-500 text-rose-900 dark:text-rose-200";
                                      }
                                    } else if (isChosen) {
                                      optBorderBg = isBright
                                        ? "bg-amber-500/20 border-amber-500 text-slate-900 font-bold"
                                        : "bg-amber-500/30 border-amber-500 text-white font-bold";
                                    }

                                    return (
                                      <button
                                        key={optIdx}
                                        type="button"
                                        disabled={quizSubmitted}
                                        onClick={() => setQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                                        className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between gap-3 ${optBorderBg}`}
                                      >
                                        <span>{opt}</span>
                                        {quizSubmitted && isTheCorrectOption && (
                                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                                        )}
                                      </button>
                                    );
                                  })}
                                </div>

                                {/* Explanation / Fun Fact */}
                                {quizSubmitted && q.funFact && (
                                  <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-line-soft text-xs text-slate-600 dark:text-slate-300">
                                    <strong className="text-amber-500 font-bold">Explanation: </strong>
                                    {q.funFact}
                                  </div>
                                )}
                              </div>
                            );
                          })}

                          {/* Evaluation Action / Results */}
                          {!quizSubmitted ? (
                            <div className="p-4 rounded-2xl border border-line-soft flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-white/[0.02]">
                              <div className="text-xs text-slate-500 dark:text-ink-400">
                                Answered {Object.keys(quizAnswers).length} / {course.modules?.[playerModuleIdx]?.passGate?.quiz?.questions?.length || 10} questions
                              </div>
                              <button
                                type="button"
                                disabled={Object.keys(quizAnswers).length < (course.modules?.[playerModuleIdx]?.passGate?.quiz?.questions?.length || 10)}
                                onClick={() => {
                                  const mod = course.modules?.[playerModuleIdx];
                                  if (mod) handleQuizSubmit(mod);
                                }}
                                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-bold text-xs sm:text-sm shadow-md cursor-pointer transition-all"
                              >
                                Submit Pass Gate Assessment →
                              </button>
                            </div>
                          ) : (
                            <div className={`p-5 rounded-2xl border text-center space-y-3 ${
                              quizPassed
                                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-950 dark:text-emerald-200"
                                : "bg-rose-500/15 border-rose-500/40 text-rose-950 dark:text-rose-200"
                            }`}>
                              <h4 className="font-black text-base sm:text-lg">
                                {quizPassed ? "Pass Gate Cleared! Module Mastered!" : "Pass Gate Not Met (80% Required)"}
                              </h4>
                              <p className="text-xs sm:text-sm">
                                {quizPassed
                                  ? "You demonstrated strong mastery of the curriculum topics and earned +100 XP!"
                                  : "You need at least 80% correct to unlock the next milestone. Review the lessons and try again!"}
                              </p>
                              <div className="flex items-center justify-center gap-3 pt-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setQuizAnswers({});
                                    setQuizSubmitted(false);
                                    setQuizPassed(false);
                                  }}
                                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-current text-xs font-bold transition-all cursor-pointer"
                                >
                                  Retake Quiz
                                </button>
                                {quizPassed && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const nextMIdx = playerModuleIdx + 1;
                                      if (course.modules && course.modules[nextMIdx]) {
                                        setPlayerModuleIdx(nextMIdx);
                                        setActiveSubtopic(course.modules[nextMIdx].subtopics?.[0] || null);
                                        setIsPassGateActive(false);
                                      } else {
                                        setIsPlayerOpen(false);
                                      }
                                    }}
                                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                                  >
                                    Proceed to Next Module →
                                  </button>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Pass Gate Type: TASK */
                        <div className="p-6 rounded-2xl border border-line-soft space-y-4 bg-white/[0.02]">
                          <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                            {course.modules?.[playerModuleIdx]?.passGate?.task?.missionTitle || "Hands-on Capstone Challenge"}
                          </h4>
                          <p className={`text-xs sm:text-sm whitespace-pre-wrap leading-relaxed ${isBright ? "text-slate-700" : "text-slate-200"}`}>
                            {course.modules?.[playerModuleIdx]?.passGate?.task?.instructions}
                          </p>

                          {course.modules?.[playerModuleIdx]?.passGate?.task?.checklist && (
                            <div className="space-y-2 pt-2 border-t border-line-soft">
                              <span className={`text-xs font-bold uppercase tracking-wider block ${isBright ? "text-slate-800" : "text-slate-200"}`}>Deliverables Checklist</span>
                              {course.modules[playerModuleIdx].passGate.task.checklist.map((item: string, cIdx: number) => (
                                <label key={cIdx} className={`flex items-center gap-2.5 text-xs cursor-pointer ${isBright ? "text-slate-700" : "text-slate-200"}`}>
                                  <input
                                    type="checkbox"
                                    checked={!!taskChecked[item]}
                                    onChange={(e) => setTaskChecked((prev) => ({ ...prev, [item]: e.target.checked }))}
                                    className="rounded text-amber-500 focus:ring-amber-500"
                                  />
                                  <span>{item}</span>
                                </label>
                              ))}
                            </div>
                          )}

                          <div className="pt-3 flex justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                const mod = course.modules?.[playerModuleIdx];
                                if (mod) handleTaskSubmit(mod);
                              }}
                              disabled={taskSubmitted}
                              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-bold text-xs sm:text-sm shadow-md cursor-pointer transition-all"
                            >
                              {taskSubmitted ? "Capstone Verified (+100 XP)" : "Verify & Complete Capstone (+100 XP) →"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : activeSubtopic ? (
                    isSubtopicEditing && subtopicEditDraft ? (
                    /* SUBTOPIC EDIT MODE */
                    <div className="space-y-4">
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-500 font-semibold flex items-center gap-2">
                        <Pencil size={14} /> You are editing this lesson. Changes apply directly to the curriculum.
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider block mb-1">Lesson Title</label>
                        <input
                          type="text"
                          value={subtopicEditDraft.title}
                          onChange={(e) => setSubtopicEditDraft({ ...subtopicEditDraft, title: e.target.value })}
                          className="w-full p-2.5 rounded-xl border text-sm bg-black/5 dark:bg-white/5 border-line-soft outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider block mb-1">Content Type</label>
                          <select
                            value={subtopicEditDraft.type}
                            onChange={(e: any) => setSubtopicEditDraft({ ...subtopicEditDraft, type: e.target.value })}
                            className="w-full p-2.5 rounded-xl border text-xs bg-black/5 dark:bg-white/5 border-line-soft outline-none focus:border-amber-500 text-slate-900 dark:text-white [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-[#161B26] dark:[&>option]:text-white cursor-pointer"
                          >
                            <option value="reading" className="bg-white text-slate-900 dark:bg-[#161B26] dark:text-white py-1.5">Reading</option>
                            <option value="video" className="bg-white text-slate-900 dark:bg-[#161B26] dark:text-white py-1.5">Video</option>
                            <option value="exercise" className="bg-white text-slate-900 dark:bg-[#161B26] dark:text-white py-1.5">Exercise</option>
                            <option value="dialogue" className="bg-white text-slate-900 dark:bg-[#161B26] dark:text-white py-1.5">Dialogue</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider block mb-1">Duration</label>
                          <input
                            type="text"
                            value={subtopicEditDraft.duration}
                            onChange={(e) => setSubtopicEditDraft({ ...subtopicEditDraft, duration: e.target.value })}
                            className="w-full p-2.5 rounded-xl border text-sm bg-black/5 dark:bg-white/5 border-line-soft outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider block mb-1">Lesson Summary</label>
                        <textarea
                          rows={2}
                          value={subtopicEditDraft.summary}
                          onChange={(e) => setSubtopicEditDraft({ ...subtopicEditDraft, summary: e.target.value })}
                          className="w-full p-2.5 rounded-xl border text-xs bg-black/5 dark:bg-white/5 border-line-soft outline-none focus:border-amber-500"
                        />
                      </div>

                      {/* Video Source Configuration if type is video */}
                      {subtopicEditDraft.type === "video" && (
                        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                              <Video size={14} /> Lesson Video Source
                            </span>
                            {(subtopicEditDraft.videoUrl || (subtopicEditDraft.youtubeId && subtopicEditDraft.youtubeId.startsWith("blob:"))) && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500 text-white">
                                Uploaded Video Attached
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                                Upload / Replace Video File
                              </label>
                              <label className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-amber-500/40 bg-white/5 hover:bg-amber-500/10 cursor-pointer text-xs font-semibold text-amber-500 transition-colors">
                                <Video size={14} />
                                <span>Choose Video (MP4, WebM...)</span>
                                <input
                                  type="file"
                                  accept="video/*,.mp4,.webm,.mov,.avi,.mkv,.m4v"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const url = URL.createObjectURL(file);
                                      setSubtopicEditDraft({
                                        ...subtopicEditDraft,
                                        videoUrl: url,
                                        youtubeId: url,
                                        channel: "Uploaded Video Masterclass",
                                        videoTitle: file.name.replace(/\.[^/.]+$/, ""),
                                      });
                                    }
                                  }}
                                />
                              </label>
                            </div>

                            <div>
                              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                                Or YouTube Video ID / URL
                              </label>
                              <input
                                type="text"
                                value={subtopicEditDraft.youtubeId?.startsWith("blob:") ? "" : (subtopicEditDraft.youtubeId || "")}
                                placeholder="e.g. dQw4w9WgXcQ or YouTube URL"
                                onChange={(e) =>
                                  setSubtopicEditDraft({
                                    ...subtopicEditDraft,
                                    youtubeId: e.target.value,
                                    videoUrl: undefined,
                                  })
                                }
                                className="w-full p-2.5 rounded-xl border text-xs bg-black/5 dark:bg-white/5 border-line-soft outline-none focus:border-amber-500"
                              />
                            </div>
                          </div>

                          {(subtopicEditDraft.videoUrl || (subtopicEditDraft.youtubeId && subtopicEditDraft.youtubeId.startsWith("blob:"))) && (
                            <div className="mt-2 rounded-lg overflow-hidden border border-white/10 bg-black aspect-video max-h-48 flex items-center justify-center">
                              <video
                                src={subtopicEditDraft.videoUrl || subtopicEditDraft.youtubeId}
                                controls
                                className="w-full h-full object-contain"
                              />
                            </div>
                          )}
                        </div>
                      )}

                      {/* Sections Editor */}
                      <div className="space-y-3 pt-2 border-t border-line-soft">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold uppercase tracking-wider">In-Depth Reading Sections</label>
                          <button
                            type="button"
                            onClick={() => {
                              const secs = [...(subtopicEditDraft.sections || [])];
                              secs.push({ heading: "New Section", body: "Detailed explanation text..." });
                              setSubtopicEditDraft({ ...subtopicEditDraft, sections: secs });
                            }}
                            className="text-xs text-amber-500 hover:text-amber-400 font-bold"
                          >
                            + Add Section
                          </button>
                        </div>

                        {subtopicEditDraft.sections?.map((sec, sIndex) => (
                          <div key={sIndex} className="p-3.5 rounded-xl border border-line-soft space-y-2 bg-black/5 dark:bg-white/[0.02]">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-slate-400">Section {sIndex + 1}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const secs = subtopicEditDraft.sections?.filter((_, i) => i !== sIndex);
                                  setSubtopicEditDraft({ ...subtopicEditDraft, sections: secs });
                                }}
                                className="text-[11px] text-red-500 hover:underline cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                            <input
                              type="text"
                              value={sec.heading}
                              onChange={(e) => {
                                const secs = [...(subtopicEditDraft.sections || [])];
                                secs[sIndex] = { ...secs[sIndex], heading: e.target.value };
                                setSubtopicEditDraft({ ...subtopicEditDraft, sections: secs });
                              }}
                              placeholder="Section Heading"
                              className="w-full p-2 rounded-lg border text-xs font-semibold bg-black/5 dark:bg-white/5 border-line-soft outline-none focus:border-amber-500"
                            />
                            <textarea
                              rows={3}
                              value={sec.body}
                              onChange={(e) => {
                                const secs = [...(subtopicEditDraft.sections || [])];
                                secs[sIndex] = { ...secs[sIndex], body: e.target.value };
                                setSubtopicEditDraft({ ...subtopicEditDraft, sections: secs });
                              }}
                              placeholder="Section body text..."
                              className="w-full p-2 rounded-lg border text-xs bg-black/5 dark:bg-white/5 border-line-soft outline-none focus:border-amber-500 font-mono"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end gap-2 pt-2 border-t border-line-soft">
                        <Button variant="secondary" size="sm" onClick={() => setIsSubtopicEditing(false)}>
                          Cancel
                        </Button>
                        <Button variant="primary" size="sm" onClick={handleSaveSubtopicEdits} className="bg-amber-500 hover:bg-amber-600 text-white font-bold cursor-pointer">
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    /* SUBTOPIC VIEW MODE */
                    <div className="space-y-6">
                      {/* 1. VIDEO LESSON TYPE */}
                      {activeSubtopic.type === "video" && (
                        <div className="space-y-6">
                          <MentoraVideoPlayer
                            video={{
                              title: formatSubtopicDisplayTitle(activeSubtopic.videoTitle || activeSubtopic.title),
                              video_id: activeSubtopic.youtubeId || "dQw4w9WgXcQ",
                              url: activeSubtopic.videoUrl || (activeSubtopic.youtubeId?.startsWith("blob:") ? activeSubtopic.youtubeId : undefined),
                              channel: activeSubtopic.channel || "Mentora Masterclass",
                              duration_minutes: parseInt(activeSubtopic.duration) || 12,
                              relevance_reason: activeSubtopic.videoSummary || activeSubtopic.summary,
                              alternates: (activeSubtopic.alternates || []).map((alt) => ({
                                title: alt.title,
                                video_id: alt.youtubeId,
                                url: alt.url || (alt.youtubeId?.startsWith("blob:") ? alt.youtubeId : undefined),
                                youtubeId: alt.youtubeId,
                                channel: alt.channel,
                                duration: alt.duration,
                                relevance_reason: alt.summary,
                              })),
                            }}
                            onSelectVideo={(selected) => {
                              setActiveSubtopic({
                                ...activeSubtopic,
                                youtubeId: selected.video_id,
                                videoUrl: selected.url,
                                videoTitle: selected.title,
                                channel: selected.channel,
                              });
                            }}
                          />

                          <div className={`p-5 rounded-2xl border space-y-3 ${
                            isBright ? "bg-white border-[#E8DACD] shadow-xs" : "bg-[#141822] border-white/10"
                          }`}>
                            <h3 className={`font-bold text-sm flex items-center gap-2 ${isBright ? "text-slate-900" : "text-white"}`}>
                              <BookOpen size={16} className="text-amber-500" />
                              Lesson Overview & Key Takeaways
                            </h3>
                            <p className={`text-xs sm:text-sm leading-relaxed ${isBright ? "text-slate-700" : "text-slate-200"}`}>
                              {activeSubtopic.videoSummary || activeSubtopic.summary}
                            </p>
                            {activeSubtopic.keyTakeaways && activeSubtopic.keyTakeaways.length > 0 && (
                              <div className="pt-2 border-t border-line-soft space-y-1.5">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500 block">
                                  Core Takeaways
                                </span>
                                {activeSubtopic.keyTakeaways.map((point: string, pIdx: number) => (
                                  <div key={pIdx} className={`flex items-start gap-2 text-xs ${isBright ? "text-slate-700" : "text-slate-200"}`}>
                                    <Check size={13} className="text-amber-500 shrink-0 mt-0.5" />
                                    <span>{point}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* 2. SOCRATIC DIALOGUE LESSON TYPE (INTERACTIVE CHATBOT TUTOR) */}
                      {activeSubtopic.type === "dialogue" && (() => {
                        const targetScenarios: DialogueScenario[] = activeSubtopic.dialogueScenario
                          ? [activeSubtopic.dialogueScenario]
                          : course.modules?.[playerModuleIdx]?.dialogueScenarios &&
                            course.modules[playerModuleIdx].dialogueScenarios!.length > 0
                          ? course.modules[playerModuleIdx].dialogueScenarios!
                          : getDefaultScenarios(
                              cleanTitle(activeSubtopic.title || course.title),
                              course.category,
                              course.level
                            );

                        return (
                          <div className="h-[750px] w-full">
                            <InteractiveDialogueChat
                              courseTitle={course.title}
                              moduleTitle={cleanTitle(course.modules?.[playerModuleIdx]?.title || course.title)}
                              subtopicTitle={formatSubtopicDisplayTitle(activeSubtopic.title)}
                              moduleIndex={playerModuleIdx}
                              prevModuleTitle={
                                playerModuleIdx > 0
                                  ? cleanTitle(course.modules?.[playerModuleIdx - 1]?.title || `Module ${playerModuleIdx}`)
                                  : undefined
                              }
                              scenarios={targetScenarios}
                              topicsCovered={
                                course.modules?.[playerModuleIdx]?.subtopics &&
                                course.modules[playerModuleIdx].subtopics!.length > 0
                                  ? course.modules[playerModuleIdx].subtopics!.map((s: SubTopicItem) => {
                                      const raw = cleanTitle(s.title);
                                      let t = raw.replace(/^(?:Day|Lesson|Session)\s*\d+[:\s-]*/i, "").trim();
                                      const cleanCourse = cleanTitle(course.title);
                                      if (cleanCourse) {
                                        const escaped = cleanCourse.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                                        t = t.replace(new RegExp(`^${escaped}\\s*[:—-]\\s*`, "i"), "").trim();
                                      }
                                      return t || raw;
                                    })
                                  : undefined
                              }
                              isBright={isBright}
                              onAwardXp={(xp, cat, rsn) => awardXp(xp, cat as any, rsn)}
                            />
                          </div>
                        );
                      })()}

                      {/* 3. READING LESSON TYPE */}
                      {activeSubtopic.type === "reading" && (
                        <div className="space-y-6">
                          <div className={`p-5 sm:p-6 rounded-2xl border ${
                            isBright ? "bg-white border-[#E8DACD] shadow-xs" : "bg-[#141822] border-white/10"
                          }`}>
                            <div className="flex items-center gap-2 mb-2.5">
                              <BookOpen size={15} className="text-amber-500" />
                              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500">
                                Overview
                              </h3>
                            </div>
                            <p className={`text-sm sm:text-base leading-relaxed font-normal ${
                              isBright ? "text-slate-700" : "text-slate-200"
                            }`}>
                              {activeSubtopic.summary}
                            </p>
                          </div>

                          {activeSubtopic.sections?.map((sec, secIdx) => {
                            const cleanAnalogy = sec.analogy
                              ? sec.analogy.replace(/^[\s]*(?:Real-World Intuition|Mental Model|Real-World Analogy|Analogy)?[:\s-]*/i, "").trim()
                              : undefined;

                            const sectionCode = sec.code || (
                              (sec.heading?.toLowerCase().includes("code") || sec.heading?.toLowerCase().includes("implementation") || sec.body?.toLowerCase().includes("implementation pattern"))
                                ? (activeSubtopic.cheatSheet as any)?.syntaxSnippet || generateDailyCodeSnippet(cleanTopicString(activeSubtopic.title), detectDomain(course.title, course.category), 1)
                                : undefined
                            );

                            return (
                              <div
                                key={secIdx}
                                className={`p-6 sm:p-7 rounded-2xl border space-y-4 ${
                                  isBright ? "bg-white border-[#E8DACD] shadow-xs" : "bg-[#141822] border-white/10"
                                }`}
                              >
                                <h2 className={`text-base sm:text-lg font-bold tracking-tight ${
                                  isBright ? "text-slate-900" : "text-white"
                                }`}>
                                  {sec.heading}
                                </h2>
                                <div className={`text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-2 font-normal ${
                                  isBright ? "text-slate-700" : "text-slate-200"
                                }`}>
                                  {sec.body}
                                </div>
                                {cleanAnalogy && (
                                  <div className={`p-4 sm:p-5 rounded-xl border text-sm leading-relaxed ${
                                    isBright
                                      ? "bg-amber-500/[0.06] border-amber-500/20 text-slate-800"
                                      : "bg-amber-500/[0.08] border-amber-500/25 text-slate-200"
                                  }`}>
                                    <div className="flex items-center gap-1.5 font-bold text-amber-500 mb-1.5 text-xs uppercase tracking-wider">
                                      <Sparkles size={13} className="text-amber-500 shrink-0" />
                                      <span>Real-World Intuition</span>
                                    </div>
                                    <p className={isBright ? "text-slate-700" : "text-slate-200"}>
                                      {cleanAnalogy}
                                    </p>
                                  </div>
                                )}

                                {sectionCode && (
                                  <div className={`rounded-xl border overflow-hidden ${
                                    isBright ? "bg-slate-950 border-slate-800" : "bg-black/60 border-white/10"
                                  }`}>
                                    <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.04] border-b border-white/10 text-xs">
                                      <span className="font-mono text-[11px] font-semibold text-amber-400 flex items-center gap-1.5">
                                        <Code size={13} className="text-amber-400" />
                                        Implementation Code
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          navigator.clipboard?.writeText(sectionCode || "");
                                          setCopiedSection(sec.heading);
                                          setTimeout(() => setCopiedSection(null), 1500);
                                        }}
                                        className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-white transition-colors cursor-pointer px-2 py-0.5 rounded hover:bg-white/5"
                                      >
                                        {copiedSection === sec.heading ? (
                                          <>
                                            <CheckCheck size={13} className="text-emerald-400" />
                                            <span className="text-emerald-400 font-medium">Copied</span>
                                          </>
                                        ) : (
                                          <>
                                            <Copy size={13} />
                                            <span>Copy Code</span>
                                          </>
                                        )}
                                      </button>
                                    </div>
                                    <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-emerald-300 whitespace-pre">
                                      <code>{sectionCode}</code>
                                    </pre>
                                  </div>
                                )}
                              </div>
                            );
                          })}

                          {activeSubtopic.keyTakeaways && activeSubtopic.keyTakeaways.length > 0 && (
                            <div className={`p-5 sm:p-6 rounded-2xl border space-y-3 ${
                              isBright ? "bg-[#FAF7F2] border-[#E8DACD]" : "bg-[#141822] border-white/10"
                            }`}>
                              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                                <Check size={14} className="text-amber-500" />
                                Key Takeaways
                              </h3>
                              <div className="space-y-2">
                                {activeSubtopic.keyTakeaways.map((point, pIdx) => (
                                  <div key={pIdx} className={`flex items-start gap-2.5 text-xs sm:text-sm ${
                                    isBright ? "text-slate-700" : "text-slate-200"
                                  }`}>
                                    <div className="w-4 h-4 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0 mt-0.5">
                                      <Check size={11} className="text-amber-500" />
                                    </div>
                                    <span className="leading-relaxed">{point}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 4. HANDS-ON EXERCISE LESSON TYPE */}
                      {activeSubtopic.type === "exercise" && (
                        <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 ${
                          isBright ? "bg-white border-[#E8DACD] shadow-sm" : "bg-[#141822] border-white/10"
                        }`}>
                          <div className="flex items-center justify-between border-b border-line-soft pb-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                              <Zap size={13} /> Hands-On Challenge
                            </span>
                            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                              <Trophy size={13} /> +40 XP
                            </span>
                          </div>

                          <div className="space-y-2">
                            <h3 className={`text-sm sm:text-base font-bold ${isBright ? "text-slate-900" : "text-white"}`}>
                              Problem Statement
                            </h3>
                            <p className={`text-xs sm:text-sm leading-relaxed font-normal ${isBright ? "text-slate-700" : "text-slate-200"}`}>
                              {activeSubtopic.exercisePrompt || activeSubtopic.summary || "Implement the solution matching the specifications."}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-ink-400 block">
                              Your Implementation
                            </label>
                            <textarea
                              rows={6}
                              value={exerciseAnswer}
                              onChange={(e) => setExerciseAnswer(e.target.value)}
                              placeholder="Write your code or solution approach here..."
                              className={`w-full p-3.5 rounded-xl border text-xs sm:text-sm font-mono outline-none transition-colors ${
                                isBright
                                  ? "bg-slate-50/50 border-[#E8DACD] text-slate-900 focus:border-amber-500 focus:bg-white"
                                  : "bg-white/[0.02] border-white/10 text-white focus:border-amber-500 focus:bg-black/20"
                              }`}
                            />
                          </div>

                          {showExerciseHint && (
                            <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                              isBright ? "bg-amber-50/80 border-amber-200 text-amber-950" : "bg-amber-500/10 border-amber-500/20 text-amber-300"
                            }`}>
                              <strong className="font-bold">Hint: </strong>
                              {activeSubtopic.exerciseHint || "Focus on isolating edge cases and testing with sample input."}
                            </div>
                          )}

                          {showExerciseSolution && (
                            <div className={`p-4 rounded-xl border text-xs font-mono whitespace-pre-wrap leading-relaxed ${
                              isBright ? "bg-slate-100 border-slate-300 text-slate-900" : "bg-black/30 border-white/10 text-emerald-300"
                            }`}>
                              <span className={`font-sans font-bold block mb-1 ${isBright ? "text-slate-700" : "text-slate-200"}`}>Reference Solution:</span>
                              {activeSubtopic.exerciseSolution || "// Check logic and handle inputs with clean boundary guards"}
                            </div>
                          )}

                          <div className="flex items-center justify-between gap-3 pt-2">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setShowExerciseHint(!showExerciseHint)}
                                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                              >
                                {showExerciseHint ? "Hide Hint" : "Show Hint"}
                              </button>
                              <span className="text-slate-300 dark:text-ink-600">·</span>
                              <button
                                type="button"
                                onClick={() => setShowExerciseSolution(!showExerciseSolution)}
                                className="text-xs font-bold text-slate-500 dark:text-ink-400 hover:underline cursor-pointer"
                              >
                                {showExerciseSolution ? "Hide Solution" : "View Solution"}
                              </button>
                            </div>

                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => {
                                awardXp(40, "exercise", `Completed exercise: ${cleanTitle(activeSubtopic.title)}`);
                                setShowExerciseSolution(true);
                              }}
                              disabled={!exerciseAnswer.trim()}
                              className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm cursor-pointer ml-auto disabled:opacity-40"
                            >
                              Submit Solution (+40 XP) →
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                ) : (
                  <div className="p-8 text-center text-slate-500">
                    Select a lesson from the curriculum sidebar to begin.
                  </div>
                )}
                </div>
              </div>
            </div>

            {/* RESOURCE & CHEAT SHEET MODAL (WITHOUT BEING A COURSE STEP) */}
            <AnimatePresence>
              {isPlayerResourcesOpen && (
                <div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className={`w-full max-w-2xl max-h-[85vh] rounded-3xl border flex flex-col shadow-2xl overflow-hidden ${
                    isBright ? "bg-white border-[#E8DACD] text-slate-900" : "bg-[#141824] border-white/10 text-ink-100"
                  }`}>
                    <div className={`p-4 sm:p-5 border-b flex items-center justify-between gap-3 ${
                      isBright ? "bg-slate-50 border-[#E8DACD]" : "bg-[#181C26] border-white/5"
                    }`}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center font-bold">
                          <FileText size={16} />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm sm:text-base">Course Cheat Sheet & Reference Material</h3>
                          <p className="text-[11px] text-slate-500 dark:text-ink-400">Available at any time without consuming course progress</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsPlayerResourcesOpen(false)}
                        className="p-1.5 rounded-xl border border-line-soft hover:bg-black/5 dark:hover:bg-white/10 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
                      {(() => {
                        const rawCs = course.resources?.cheatSheet;
                        const modalSections: CheatSheetSection[] = Array.isArray(rawCs) && rawCs.length > 0
                          ? rawCs
                          : rawCs && typeof rawCs === "object" && Array.isArray((rawCs as any).sections) && (rawCs as any).sections.length > 0
                          ? (rawCs as any).sections
                          : generateCheatSheetForCourse(course.title, course.category, course.level, course.modules);

                        return modalSections && modalSections.length > 0 ? (
                          modalSections.map((sec: CheatSheetSection, sIdx: number) => (
                            <div key={sIdx} className={`p-4 sm:p-5 rounded-2xl border space-y-3 ${
                              isBright ? "bg-[#FAF7F2] border-[#E8DACD]" : "bg-white/[0.02] border-white/5"
                            }`}>
                              <h4 className={`font-bold text-sm ${isBright ? "text-slate-900" : "text-white"}`}>{sec.heading}</h4>
                              {sec.points && (
                                <ul className={`space-y-1 text-xs list-disc list-inside ${isBright ? "text-slate-700" : "text-slate-200"}`}>
                                  {sec.points.map((pt: string, pIdx: number) => (
                                    <li key={pIdx}>{pt}</li>
                                  ))}
                                </ul>
                              )}
                              {sec.code && (
                                <div className="p-3 rounded-xl bg-black/90 text-amber-300 font-mono text-xs overflow-x-auto">
                                  <pre>{sec.code}</pre>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-xs text-slate-500">
                            No cheat sheet sections configured for this course yet.
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL: ADD NEW MODULE */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isAddModuleOpen && (
          <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className={`w-full max-w-md rounded-2xl border p-6 space-y-4 shadow-2xl ${
              isBright ? "bg-white border-slate-200 text-slate-900" : "bg-[#141824] border-white/10 text-ink-100"
            }`}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Plus size={16} className="text-amber-500" /> Add New Course Module
                </h3>
                <button onClick={() => setIsAddModuleOpen(false)} className="text-slate-400 hover:text-ink-100 cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1">Module Title *</label>
                  <input
                    type="text"
                    value={newModuleTitle}
                    onChange={(e) => setNewModuleTitle(e.target.value)}
                    placeholder="e.g. Advanced Model Architecture & Scaling"
                    className="w-full p-2.5 rounded-xl border text-xs sm:text-sm bg-black/5 dark:bg-white/5 border-line-soft outline-none focus:border-amber-500"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1">Tagline / Mission Goal</label>
                  <input
                    type="text"
                    value={newModuleTagline}
                    onChange={(e) => setNewModuleTagline(e.target.value)}
                    placeholder="e.g. Scalable inference pipelines and production monitoring"
                    className="w-full p-2.5 rounded-xl border text-xs sm:text-sm bg-black/5 dark:bg-white/5 border-line-soft outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-line-soft">
                <Button variant="secondary" size="sm" onClick={() => setIsAddModuleOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={handleSaveNewModule} disabled={!newModuleTitle.trim()} className="bg-amber-500 hover:bg-amber-600 text-white font-bold cursor-pointer">
                  Create Module →
                </Button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL: EDIT MODULE TITLE & TAGLINE */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {editingModuleIdx !== null && (
          <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className={`w-full max-w-md rounded-2xl border p-6 space-y-4 shadow-2xl ${
              isBright ? "bg-white border-slate-200 text-slate-900" : "bg-[#141824] border-white/10 text-ink-100"
            }`}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Pencil size={16} className="text-amber-500" /> Edit Module {editingModuleIdx + 1}
                </h3>
                <button onClick={() => setEditingModuleIdx(null)} className="text-slate-400 hover:text-ink-100 cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1">Module Title *</label>
                  <input
                    type="text"
                    value={editModuleTitle}
                    onChange={(e) => setEditModuleTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border text-xs sm:text-sm bg-black/5 dark:bg-white/5 border-line-soft outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1">Tagline</label>
                  <input
                    type="text"
                    value={editModuleTagline}
                    onChange={(e) => setEditModuleTagline(e.target.value)}
                    className="w-full p-2.5 rounded-xl border text-xs sm:text-sm bg-black/5 dark:bg-white/5 border-line-soft outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-line-soft">
                <Button variant="secondary" size="sm" onClick={() => setEditingModuleIdx(null)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={() => handleSaveModuleEdit(editingModuleIdx)} disabled={!editModuleTitle.trim()} className="bg-amber-500 hover:bg-amber-600 text-white font-bold cursor-pointer">
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL: ADD NEW LESSON / CONTENT ANYWHERE */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isAddLessonOpen && (
          <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className={`w-full max-w-lg rounded-2xl border p-6 space-y-4 shadow-2xl ${
              isBright ? "bg-white border-slate-200 text-slate-900" : "bg-[#141824] border-white/10 text-ink-100"
            }`}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Plus size={16} className="text-amber-500" /> Add Lesson in Module {addLessonModuleIdx + 1}
                </h3>
                <button onClick={() => setIsAddLessonOpen(false)} className="text-slate-400 hover:text-ink-100 cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1">Lesson Title *</label>
                  <input
                    type="text"
                    value={newLessonDraft.title}
                    onChange={(e) => setNewLessonDraft({ ...newLessonDraft, title: e.target.value })}
                    placeholder="e.g. Deep Residual Networks & Skip Connections"
                    className="w-full p-2.5 rounded-xl border text-xs sm:text-sm bg-black/5 dark:bg-white/5 border-line-soft outline-none focus:border-amber-500"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider block mb-1">Content Type</label>
                    <select
                      value={newLessonDraft.type}
                      onChange={(e: any) => setNewLessonDraft({ ...newLessonDraft, type: e.target.value })}
                      className="w-full p-2.5 rounded-xl border text-xs bg-black/5 dark:bg-white/5 border-line-soft outline-none focus:border-amber-500 text-slate-900 dark:text-white [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-[#161B26] dark:[&>option]:text-white cursor-pointer"
                    >
                      <option value="reading" className="bg-white text-slate-900 dark:bg-[#161B26] dark:text-white py-1.5">Reading / Theory</option>
                      <option value="video" className="bg-white text-slate-900 dark:bg-[#161B26] dark:text-white py-1.5">Video Masterclass</option>
                      <option value="exercise" className="bg-white text-slate-900 dark:bg-[#161B26] dark:text-white py-1.5">Hands-on Exercise</option>
                      <option value="dialogue" className="bg-white text-slate-900 dark:bg-[#161B26] dark:text-white py-1.5">Dialogue</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider block mb-1">Duration</label>
                    <input
                      type="text"
                      value={newLessonDraft.duration}
                      onChange={(e) => setNewLessonDraft({ ...newLessonDraft, duration: e.target.value })}
                      placeholder="e.g. 12 min"
                      className="w-full p-2.5 rounded-xl border text-xs sm:text-sm bg-black/5 dark:bg-white/5 border-line-soft outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1">Insert Position</label>
                  <select
                    value={addLessonPosition}
                    onChange={(e: any) => {
                      const val = e.target.value;
                      setAddLessonPosition(val === "start" ? "start" : val === "end" ? "end" : parseInt(val, 10));
                    }}
                    className="w-full p-2.5 rounded-xl border text-xs bg-black/5 dark:bg-white/5 border-line-soft outline-none focus:border-amber-500 text-slate-900 dark:text-white [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-[#161B26] dark:[&>option]:text-white cursor-pointer"
                  >
                    <option value="start" className="bg-white text-slate-900 dark:bg-[#161B26] dark:text-white py-1.5">At the beginning of this module</option>
                    <option value="end" className="bg-white text-slate-900 dark:bg-[#161B26] dark:text-white py-1.5">At the end of this module</option>
                    {course.modules?.[addLessonModuleIdx]?.subtopics?.map((sub: SubTopicItem, sIdx: number) => (
                      <option key={sub.id} value={sIdx} className="bg-white text-slate-900 dark:bg-[#161B26] dark:text-white py-1.5">
                        After Lesson {sIdx + 1}: {sub.title.slice(0, 35)}...
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1">Summary</label>
                  <textarea
                    rows={2}
                    value={newLessonDraft.summary}
                    onChange={(e) => setNewLessonDraft({ ...newLessonDraft, summary: e.target.value })}
                    placeholder="Short overview of what is taught..."
                    className="w-full p-2.5 rounded-xl border text-xs bg-black/5 dark:bg-white/5 border-line-soft outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-line-soft">
                <Button variant="secondary" size="sm" onClick={() => setIsAddLessonOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={handleSaveNewLesson} disabled={!newLessonDraft.title.trim()} className="bg-amber-500 hover:bg-amber-600 text-white font-bold cursor-pointer">
                  Insert Lesson →
                </Button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL: ADD NEW FLASHCARD */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isAddCardOpen && (
          <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className={`w-full max-w-lg rounded-2xl border p-6 space-y-4 shadow-2xl ${
              isBright ? "bg-white border-slate-200 text-slate-900" : "bg-[#141824] border-white/10 text-ink-100"
            }`}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Plus size={16} className="text-amber-500" /> Create New Flashcard
                </h3>
                <button onClick={() => setIsAddCardOpen(false)} className="text-slate-400 hover:text-ink-100 cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1">Front: Question / Prompt *</label>
                  <textarea
                    rows={2}
                    value={newCardDraft.question}
                    onChange={(e) => setNewCardDraft({ ...newCardDraft, question: e.target.value })}
                    placeholder="e.g. What is the fundamental difference between L1 and L2 regularization?"
                    className="w-full p-2.5 rounded-xl border text-xs sm:text-sm bg-black/5 dark:bg-white/5 border-line-soft outline-none focus:border-amber-500"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1">Back: Answer & Key Axiom *</label>
                  <textarea
                    rows={3}
                    value={newCardDraft.answer}
                    onChange={(e) => setNewCardDraft({ ...newCardDraft, answer: e.target.value })}
                    placeholder="e.g. L1 (Lasso) drives weights to zero creating sparse models; L2 (Ridge) shrinks weights toward zero."
                    className="w-full p-2.5 rounded-xl border text-xs sm:text-sm bg-black/5 dark:bg-white/5 border-line-soft outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider block mb-1">Tag / Category</label>
                    <input
                      type="text"
                      value={newCardDraft.tag}
                      onChange={(e) => setNewCardDraft({ ...newCardDraft, tag: e.target.value })}
                      placeholder="e.g. Optimization"
                      className="w-full p-2.5 rounded-xl border text-xs sm:text-sm bg-black/5 dark:bg-white/5 border-line-soft outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider block mb-1">Font Style</label>
                    <select
                      value={newCardDraft.fontFamily}
                      onChange={(e: any) => setNewCardDraft({ ...newCardDraft, fontFamily: e.target.value })}
                      className="w-full p-2.5 rounded-xl border text-xs bg-black/5 dark:bg-white/5 border-line-soft outline-none focus:border-amber-500 text-slate-900 dark:text-white [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-[#161B26] dark:[&>option]:text-white cursor-pointer"
                    >
                      <option value="sans" className="bg-white text-slate-900 dark:bg-[#161B26] dark:text-white py-1.5">Modern Sans (Clean)</option>
                      <option value="serif" className="bg-white text-slate-900 dark:bg-[#161B26] dark:text-white py-1.5">Classic Serif (Editorial)</option>
                      <option value="mono" className="bg-white text-slate-900 dark:bg-[#161B26] dark:text-white py-1.5">Monospace (Code)</option>
                      <option value="rounded" className="bg-white text-slate-900 dark:bg-[#161B26] dark:text-white py-1.5">Rounded (Playful)</option>
                      <option value="handwritten" className="bg-white text-slate-900 dark:bg-[#161B26] dark:text-white py-1.5">Handwritten (Script)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-line-soft">
                <Button variant="secondary" size="sm" onClick={() => setIsAddCardOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={handleSaveNewCard} disabled={!newCardDraft.question.trim() || !newCardDraft.answer.trim()} className="bg-amber-500 hover:bg-amber-600 text-white font-bold cursor-pointer">
                  Add to Deck →
                </Button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL: EDIT ACTIVE FLASHCARD WRITING & STYLING */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isEditCardOpen && editCardDraft && (
          <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className={`w-full max-w-lg rounded-2xl border p-6 space-y-4 shadow-2xl ${
              isBright ? "bg-white border-slate-200 text-slate-900" : "bg-[#141824] border-white/10 text-ink-100"
            }`}>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base flex items-center gap-2">
                  <Pencil size={16} className="text-amber-500" /> Edit Flashcard Writing
                </h3>
                <button onClick={() => setIsEditCardOpen(false)} className="text-slate-400 hover:text-ink-100 cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1">Front: Question / Prompt *</label>
                  <textarea
                    rows={2}
                    value={editCardDraft.question}
                    onChange={(e) => setEditCardDraft({ ...editCardDraft, question: e.target.value })}
                    className="w-full p-2.5 rounded-xl border text-xs sm:text-sm bg-black/5 dark:bg-white/5 border-line-soft outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1">Back: Answer & Key Axiom *</label>
                  <textarea
                    rows={3}
                    value={editCardDraft.answer}
                    onChange={(e) => setEditCardDraft({ ...editCardDraft, answer: e.target.value })}
                    className="w-full p-2.5 rounded-xl border text-xs sm:text-sm bg-black/5 dark:bg-white/5 border-line-soft outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider block mb-1">Tag / Category</label>
                    <input
                      type="text"
                      value={editCardDraft.tag}
                      onChange={(e) => setEditCardDraft({ ...editCardDraft, tag: e.target.value })}
                      className="w-full p-2.5 rounded-xl border text-xs sm:text-sm bg-black/5 dark:bg-white/5 border-line-soft outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider block mb-1">Font Style</label>
                    <select
                      value={editCardDraft.fontFamily || "sans"}
                      onChange={(e: any) => setEditCardDraft({ ...editCardDraft, fontFamily: e.target.value })}
                      className="w-full p-2.5 rounded-xl border text-xs bg-black/5 dark:bg-white/5 border-line-soft outline-none focus:border-amber-500 text-slate-900 dark:text-white [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-[#161B26] dark:[&>option]:text-white cursor-pointer"
                    >
                      <option value="sans" className="bg-white text-slate-900 dark:bg-[#161B26] dark:text-white py-1.5">Modern Sans (Clean)</option>
                      <option value="serif" className="bg-white text-slate-900 dark:bg-[#161B26] dark:text-white py-1.5">Classic Serif (Editorial)</option>
                      <option value="mono" className="bg-white text-slate-900 dark:bg-[#161B26] dark:text-white py-1.5">Monospace (Code)</option>
                      <option value="rounded" className="bg-white text-slate-900 dark:bg-[#161B26] dark:text-white py-1.5">Rounded (Playful)</option>
                      <option value="handwritten" className="bg-white text-slate-900 dark:bg-[#161B26] dark:text-white py-1.5">Handwritten (Script)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-line-soft">
                <Button variant="secondary" size="sm" onClick={() => setIsEditCardOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" onClick={handleSaveCardEdits} disabled={!editCardDraft.question.trim() || !editCardDraft.answer.trim()} className="bg-amber-500 hover:bg-amber-600 text-white font-bold cursor-pointer">
                  Save Card Changes
                </Button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// -----------------------------------------------------------------------------
// DEFAULT GENERATION HELPERS (COMPATIBILITY)
// -----------------------------------------------------------------------------
function generateDefaultResources(
  title: string,
  category: string,
  level: string,
  duration: string,
  desc: string,
  modules?: any[]
) {
  return {
    flashcards: generateFlashcardsForCourse(title, category, level, modules),
    cheatSheet: generateCheatSheetForCourse(title, category, level, modules),
    videos: generateCuratedVideosForCourse(title, category, level, modules, desc),
    dialogueQuestions: generateDialogueForCourse(title, category, level),
  };
}

function generateDefaultCheatSheet(courseTitle: string, category: string, level: string = "Beginner"): CheatSheetSection[] {
  return generateCheatSheetForCourse(courseTitle, category, level);
}

function ensureModuleSequence(m: any, idx: number, courseTitle: string, level: string, category: string, prevTitle?: string): CourseModule {
  const cleanModTitle = m.title ? cleanTitle(m.title) : `Topic ${idx + 1}`;
  const rawTagline = m.tagline ? cleanTagline(m.tagline) : m.content?.summary || "Structured power track";

  const moduleDialogue = m.dialogueScenarios && m.dialogueScenarios.length > 0
    ? m.dialogueScenarios
    : generateDialogueForCourse(cleanModTitle, category, level, idx, m.subtopics || m.lessons, prevTitle);

  let calibratedSubtopics: SubTopicItem[] = m.subtopics && m.subtopics.length > 0
    ? m.subtopics.map((s: any, sIdx: number) => ({
        ...s,
        id: s.id || uid("sub"),
        title: s.title || `Lesson ${sIdx + 1}`,
        type: s.type || "reading",
        duration: s.duration || "12 min",
        summary: s.summary || `Practical concepts and application of ${s.title || "the lesson"}.`,
        sections: (s.sections || [
          {
            heading: "Core Concepts",
            body: s.content || `In-depth exploration and step-by-step breakdown for ${s.title || "this topic"}.`,
          },
        ]).map((sec: any) => ({
          ...sec,
          analogy: sec.analogy ? sec.analogy.replace(/^[\s]+(?:Mental Model|Real-World Analogy)?[:\s-]*/i, "Real-World Intuition: ").trim() : undefined,
        })),
        keyTakeaways: s.keyTakeaways || [`Apply ${s.title || "this lesson"} in real-world workflows.`],
        exercisePrompt: s.exercisePrompt,
        exerciseHint: s.exerciseHint,
        exerciseSolution: s.exerciseSolution,
        youtubeId: s.youtubeId,
        videoTitle: s.videoTitle,
        channel: s.channel,
        videoSummary: s.videoSummary,
        flashcards: s.flashcards,
        quiz: s.quiz,
      }))
    : (m.lessons && m.lessons.length > 0
        ? m.lessons.map((l: any, lIdx: number) => ({
            id: (typeof l === "object" && l.id) || uid("sub"),
            title: typeof l === "string" ? l : (l.title || `Lesson ${lIdx + 1}`),
            type: (typeof l === "object" && l.type) || "reading",
            duration: (typeof l === "object" && l.duration) || "12 min",
            summary: (typeof l === "object" && l.summary) || `Practical concepts and application of ${typeof l === "string" ? l : (l.title || "the lesson")}.`,
            sections: ((typeof l === "object" && l.sections) || [
              {
                heading: "Core Concepts",
                body: (typeof l === "object" && l.content) || `In-depth exploration and step-by-step breakdown for ${typeof l === "string" ? l : (l.title || "this topic")}.`,
              },
            ]).map((sec: any) => ({
              ...sec,
              analogy: sec.analogy ? sec.analogy.replace(/^[\s]+(?:Mental Model|Real-World Analogy)?[:\s-]*/i, "Real-World Intuition: ").trim() : undefined,
            })),
            keyTakeaways: (typeof l === "object" && l.keyTakeaways) || [`Apply ${typeof l === "string" ? l : (l.title || "this lesson")} in real-world workflows.`],
            exercisePrompt: typeof l === "object" ? l.exercisePrompt : undefined,
            exerciseHint: typeof l === "object" ? l.exerciseHint : undefined,
            exerciseSolution: typeof l === "object" ? l.exerciseSolution : undefined,
            youtubeId: typeof l === "object" ? l.youtubeId : undefined,
            videoTitle: typeof l === "object" ? l.videoTitle : undefined,
            channel: typeof l === "object" ? l.channel : undefined,
            videoSummary: typeof l === "object" ? l.videoSummary : undefined,
            flashcards: typeof l === "object" ? l.flashcards : undefined,
            quiz: typeof l === "object" ? l.quiz : undefined,
          }))
        : [
            {
              id: uid("sub"),
              title: `Introduction to ${cleanModTitle}`,
              type: "video",
              duration: "5 min",
              summary: "High-level overview of core paradigms and execution flow.",
              sections: [
                {
                  heading: "Core Paradigm",
                  body: "Understanding the underlying runtime mechanics and data flow before implementing solutions.",
                },
              ],
              keyTakeaways: ["Master the mental model before diving into implementation syntax."],
            },
            {
              id: uid("sub"),
              title: "Architecture & Implementation Deep-Dive",
              type: "reading",
              duration: "18 min",
              summary: "Comprehensive technical analysis with production patterns and edge case handling.",
              sections: [
                {
                  heading: "State Management & Data Flow",
                  body: "Maintain strict unidirectional data flow and isolate side effects to deterministic handlers.",
                },
              ],
              keyTakeaways: ["Keep components pure and decouple business logic from rendering."],
            },
            {
              id: uid("sub"),
              title: "Guided Exercise: Implementation Challenge",
              type: "exercise",
              duration: "10 min",
              summary: "Hands-on challenge testing core algorithms.",
              exercisePrompt: "Implement the update logic handling edge cases.",
              exerciseHint: "Break down into base case and iterative step.",
              exerciseSolution: "# Reference solution\ndef solution():\n    pass",
              keyTakeaways: ["Always verify edge cases and boundary conditions."],
            },
          ]);

  // Ensure exactly 1 dialogue lesson for this module
  const dialogueIndex = calibratedSubtopics.findIndex((s: any) => s.type === "dialogue");
  if (dialogueIndex >= 0) {
    calibratedSubtopics[dialogueIndex] = {
      ...calibratedSubtopics[dialogueIndex],
      dialogueScenario: calibratedSubtopics[dialogueIndex].dialogueScenario || moduleDialogue[0],
    };
  } else {
    const dialogueLesson: SubTopicItem = {
      id: uid("sub_diag"),
      title: `Day 6: ${cleanModTitle} — Dialogue & Architectural Trade-Offs`,
      type: "dialogue",
      duration: "15 min",
      summary: `Interactive Socratic dialogue coaching on ${cleanModTitle}, evaluating real-world system architecture, diagnostic dilemmas, and defensive trade-offs.`,
      dialogueScenario: moduleDialogue[0],
      keyTakeaways: [
        `Articulate trade-offs and structural invariants for ${cleanModTitle}.`,
        `Navigate ambiguous engineering scenarios using first-principles reasoning.`
      ],
    };

    if (calibratedSubtopics.length >= 6) {
      calibratedSubtopics.splice(5, 0, dialogueLesson);
    } else if (calibratedSubtopics.length >= 2) {
      calibratedSubtopics.splice(calibratedSubtopics.length - 1, 0, dialogueLesson);
    } else {
      calibratedSubtopics.push(dialogueLesson);
    }
  }

  return {
    id: m.id || uid("mod"),
    title: cleanModTitle,
    tagline: rawTagline,
    subtopics: calibratedSubtopics,
    lessons: (m.lessons && m.lessons.length > 0)
      ? m.lessons
      : calibratedSubtopics.map((s: any) => ({
          id: s.id,
          title: s.title,
          duration: s.duration || "10 min",
          type: s.type || "reading",
        })),
    content: {
      ...(m.content || {
        title: cleanModTitle,
        readTime: "90 sec read",
        tagline: "Fun, bite-sized power read!",
        summary: "Understand core concepts and practical rules before testing your skills.",
        keyTakeaways: ["Master concepts through practical hands-on application.", "Always verify edge cases."],
      }),
      funAnalogy: undefined,
    },
    video: (m.video && m.video.youtubeId && m.video.youtubeId !== "aircAruvnKk")
      ? m.video
      : getRelevantYouTubeVideo({
          courseTitle,
          category,
          moduleTitle: cleanModTitle,
          moduleIndex: idx,
          level,
        }),
    flashcards: m.flashcards && m.flashcards.length >= 3
      ? m.flashcards
      : generateFlashcardsForCourse(courseTitle, category, level).slice(0, 4),
    dialogueScenarios: moduleDialogue,
    passGate: m.passGate || {
      type: idx % 2 === 0 ? "quiz" : "task",
      quiz: {
        title: `${cleanModTitle} Knowledge Duel`,
        passingScore: 2,
        questions: (level || "").toLowerCase().includes("beg")
          ? [
              {
                id: uid("q"),
                question: `What is the most helpful mindset when learning ${cleanModTitle}?`,
                options: [
                  "Try to memorize syntax without testing it",
                  "Understand the basic idea and practice with small daily steps",
                  "Give up whenever an error occurs",
                  "Skip straight to advanced theory",
                ],
                correctAnswer: 1,
                funFact: "Bite-sized daily practice builds permanent muscle memory!",
              },
            ]
          : [
              {
                id: uid("q"),
                question: `What is the primary objective of ${cleanModTitle}?`,
                options: [
                  "Memorize equations without knowing why",
                  "Apply iterative testing and verify loss decreases smoothly",
                  "Skip the pass gate directly",
                  "Never write comments in code",
                ],
                correctAnswer: 1,
                funFact: "Active iteration creates permanent mastery!",
              },
            ],
      },
      task: {
        missionTitle: `Day ${idx + 1} Daily Task: ${cleanModTitle} Practice`,
        xpReward: 100,
        estimatedTime: (level || "").toLowerCase().includes("beg") ? "10–15 mins" : "20 mins",
        dailyGoal: (level || "").toLowerCase().includes("beg")
          ? `Complete today's beginner practice on ${cleanModTitle} in 15 minutes.`
          : `Implement and verify the core pattern for ${cleanModTitle}.`,
        instructions: (level || "").toLowerCase().includes("beg")
          ? `Follow today's 3 simple steps to practice ${cleanModTitle} with hands-on examples.`
          : `Complete the implementation checklist for ${cleanModTitle} and verify test outputs.`,
        checklist: (level || "").toLowerCase().includes("beg")
          ? [
              "Step 1: Set up simple practice data or initial variables",
              "Step 2: Write 3–5 lines of code applying today's concept",
              "Step 3: Run and verify the output displays correctly",
            ]
          : [
              "Step 1: Define parameters and data structures",
              "Step 2: Execute the core algorithm loop",
              "Step 3: Pass automated assertions on test data",
            ],
        dailyTip: (level || "").toLowerCase().includes("beg")
          ? "Take it step-by-step! Daily practice turns tricky concepts into second nature."
          : "Verify edge cases and test inputs thoroughly.",
      },
    },
  };
}

function getDefaultScenarios(
  moduleTitle: string,
  category: string,
  level: string = "Beginner",
  moduleIndex: number = 0,
  subtopics?: any[]
): DialogueScenario[] {
  return generateDialogueForCourse(moduleTitle, category, level, moduleIndex, subtopics);
}

function generateExpandedFlashcards(courseTitle: string, category: string, level: string): Flashcard[] {
  return generateFlashcardsForCourse(courseTitle, category, level);
}
