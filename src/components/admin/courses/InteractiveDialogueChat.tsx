"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Sparkles,
  Send,
  Mic,
  MicOff,
  HelpCircle,
  Lightbulb,
  Trophy,
  CheckCircle2,
  RefreshCw,
  Bookmark,
  Award,
  ArrowRight,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DialogueScenario, DialogueReviewData } from "./AiCourseStudio";

export interface InteractiveDialogueChatProps {
  courseTitle: string;
  moduleTitle: string;
  subtopicTitle?: string;
  moduleIndex?: number;
  prevModuleTitle?: string;
  scenarios?: DialogueScenario[];
  topicsCovered?: string[];
  isBright?: boolean;
  onAwardXp?: (xp: number, category: string, reason: string) => void;
  onComplete?: () => void;
  onRestart?: () => void;
  className?: string;
}

interface ChatTurnMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp?: string;
  isDesiredAnswer?: boolean;
  isBackQuestion?: boolean;
  isHint?: boolean;
  isSummary?: boolean;
  liked?: boolean | null; // true = thumbs up, false = thumbs down
}

function parseInlineFormatting(text: string, isUser: boolean = false): React.ReactNode[] {
  if (!text) return [];

  // Match inline tokens:
  // 1. `code`
  // 2. ***bold-italic***
  // 3. **bold**
  // 4. *italic*
  const tokenRegex = /(\*\*\*[\s\S]+?\*\*\*|\*\*[\s\S]+?\*\*|\*[^*\n]+?\*|`[\s\S]+?`)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, idx) => {
    if (!part) return null;

    if (part.startsWith("***") && part.endsWith("***") && part.length >= 6) {
      const inner = part.slice(3, -3);
      return (
        <strong key={idx} className={`font-bold italic ${isUser ? "text-white" : "text-slate-900 dark:text-white"}`}>
          {inner}
        </strong>
      );
    }

    if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
      const inner = part.slice(2, -2);
      return (
        <strong key={idx} className={`font-bold ${isUser ? "text-white" : "text-slate-900 dark:text-white"}`}>
          {inner}
        </strong>
      );
    }

    if (part.startsWith("*") && part.endsWith("*") && part.length >= 2) {
      const inner = part.slice(1, -1);
      return (
        <em key={idx} className={`italic ${isUser ? "text-white/90" : "text-slate-300 dark:text-slate-200"}`}>
          {inner}
        </em>
      );
    }

    if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
      const inner = part.slice(1, -1);
      return (
        <code
          key={idx}
          className={`px-1.5 py-0.5 rounded font-mono text-xs ${
            isUser
              ? "bg-white/20 text-white"
              : "bg-black/10 dark:bg-white/10 text-amber-600 dark:text-amber-400"
          }`}
        >
          {inner}
        </code>
      );
    }

    return <span key={idx}>{part}</span>;
  });
}

function renderFormattedMessage(text: string, isUser: boolean = false): React.ReactNode {
  if (!text) return null;
  const lines = text.split("\n");

  return (
    <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lineIdx} className="h-1.5" />;
        }

        const isBullet =
          trimmed.startsWith("•") ||
          trimmed.startsWith("- ") ||
          (trimmed.startsWith("* ") && !trimmed.endsWith("*"));

        if (isBullet) {
          const content = trimmed.replace(/^([•\-\*]\s*)/, "");
          return (
            <div key={lineIdx} className="flex items-start gap-2 pl-1 py-0.5">
              <span className={isUser ? "text-white font-bold shrink-0 mt-0.5" : "text-amber-500 font-bold shrink-0 mt-0.5"}>
                •
              </span>
              <span className={`flex-1 leading-relaxed ${isUser ? "text-white" : "text-slate-800 dark:text-slate-100"}`}>
                {parseInlineFormatting(content, isUser)}
              </span>
            </div>
          );
        }

        // Entire line wrapped in single *...* (e.g. *Need help? Click **"I'm stuck"** ...*)
        if (
          trimmed.startsWith("*") &&
          trimmed.endsWith("*") &&
          !trimmed.startsWith("***") &&
          !trimmed.startsWith("**") &&
          trimmed.length >= 2
        ) {
          const inner = trimmed.slice(1, -1);
          return (
            <p key={lineIdx} className={`leading-relaxed italic ${isUser ? "text-white/95" : "text-slate-600 dark:text-slate-300"}`}>
              {parseInlineFormatting(inner, isUser)}
            </p>
          );
        }

        return (
          <p key={lineIdx} className={`leading-relaxed ${isUser ? "text-white" : "text-slate-800 dark:text-slate-100"}`}>
            {parseInlineFormatting(line, isUser)}
          </p>
        );
      })}
    </div>
  );
}

export default function InteractiveDialogueChat({
  courseTitle,
  moduleTitle,
  subtopicTitle,
  moduleIndex,
  prevModuleTitle,
  scenarios: customScenarios,
  topicsCovered,
  isBright = false,
  onAwardXp,
  onComplete,
  onRestart,
  className = "",
}: InteractiveDialogueChatProps) {
  // Scenarios to run through
  const scenarios: DialogueScenario[] =
    customScenarios && customScenarios.length > 0
      ? customScenarios
      : [
          {
            id: "diag-default-1",
            situation: `Imagine you're helping a friend who has never used a food delivery app before. They want to order a pizza, but they have no idea how to use the app.`,
            question: `If you were to give them a set of instructions, what is the very first step they need to take to get started?`,
            hint: `Think about what must be open, installed, or running on their device before they can even browse a menu or select food!`,
            expectedKeywords: [
              "download",
              "install",
              "open",
              "launch",
              "app",
              "account",
              "sign up",
              "login",
              "unlock",
            ],
            correctExplanation: `Spot on! The very first prerequisite is getting into the execution environment—installing and launching the app (or unlocking the phone and logging in). In software, a program or environment must always be initialized and running before any instructions or user workflows can execute!`,
          },
        ];

  const [scenarioIdx, setScenarioIdx] = useState(0);
  const activeScenario = scenarios[scenarioIdx] || scenarios[0];

  // Conversation history
  const [messages, setMessages] = useState<ChatTurnMessage[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [summaryData, setSummaryData] = useState<DialogueReviewData | null>(null);
  const [attempts, setAttempts] = useState(0);

  // Speech Recognition state
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Setup initial welcome and first scenario question
  useEffect(() => {
    initChat();
  }, [moduleTitle, courseTitle, customScenarios, moduleIndex, prevModuleTitle]);

  // Auto-scroll on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAnalyzing]);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const reco = new SpeechRecognition();
        reco.continuous = false;
        reco.interimResults = false;
        reco.lang = "en-US";

        reco.onresult = (e: any) => {
          const transcript = e.results[0][0].transcript;
          if (transcript) {
            setInputVal((prev) => (prev ? `${prev} ${transcript}` : transcript));
          }
          setIsListening(false);
        };

        reco.onerror = () => {
          setIsListening(false);
        };

        reco.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = reco;
      }
    }
  }, []);

  function toggleSpeechToText() {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        setIsListening(false);
      }
    }
  }

  function initChat() {
    setScenarioIdx(0);
    setAttempts(0);
    setIsFinished(false);
    setSummaryData(null);
    setInputVal("");

    const cleanMod = (moduleTitle || "").replace(/^(?:Module|Week|Day)\s*\d+[:\s-]*/i, "").trim();
    const cleanPrev = (prevModuleTitle || "").replace(/^(?:Module|Week|Day)\s*\d+[:\s-]*/i, "").trim();
    const modNum = moduleIndex !== undefined ? moduleIndex + 1 : 1;

    let introText = `Welcome to **Module ${modNum}: ${cleanMod || "Core Foundations"}**. In this interactive Socratic dialogue, we will examine core architectural trade-offs, test real-world engineering dilemmas, and solidify your understanding of this module.`;
    if (modNum > 1 && cleanPrev) {
      introText = `Building upon the foundational concepts established in Module ${modNum - 1} (*${cleanPrev}*), we now advance into **Module ${modNum}: ${cleanMod}**. In this session, we will examine production trade-offs and practical failure modes unique to this module.`;
    }

    const topicsBullets =
      topicsCovered && topicsCovered.length > 0
        ? topicsCovered.map((t, idx) => `• **Topic ${idx + 1}:** ${t}`).join("\n")
        : `• **Topic 1:** Translating requirements into precise execution logic.
• **Topic 2:** Managing data structures, state flow, and invariants.
• **Topic 3:** Verifying edge cases and production trade-offs.`;

    const first = scenarios[0];
    const firstTopicLabel = topicsCovered && topicsCovered.length > 0 ? topicsCovered[0] : (cleanMod || "Core Concepts");

    const initialMessages: ChatTurnMessage[] = [
      {
        id: "intro-overview",
        sender: "bot",
        text: `${introText}

**Here's what we'll cover:**
${topicsBullets}

*Need help? Click **"I'm stuck"** at the top right to ask for a hint.*`,
      },
      {
        id: "first-question",
        sender: "bot",
        text: `Great! Let's dive into **Topic 1: ${firstTopicLabel}**.

${first.situation}

❓ **Diagnostic Question:**
${first.question}`,
      },
    ];

    setMessages(initialMessages);
  }

  // Click "I'm stuck" -> provide contextual clue without giving away the full answer
  function handleImStuck() {
    if (isFinished || isAnalyzing) return;

    const hintText = activeScenario.hint || "Think about the prerequisite environment or starting state.";
    const hintMessage: ChatTurnMessage = {
      id: `hint-${Date.now()}`,
      sender: "bot",
      isHint: true,
      text: `💡 **Helpful Clue:**
${hintText}

*What do you think is the initial prerequisite step? Give it your best shot below!*`,
    };

    setMessages((prev) => [...prev, hintMessage]);
  }

  // Click "End Dialogue" -> finish immediately and present summary review
  function handleEndDialogue() {
    if (isFinished) return;

    setIsFinished(true);
    const finalAttempts = Math.max(1, attempts);
    const score = Math.max(70, Math.min(100, 100 - (finalAttempts - 1) * 8));

    const review: DialogueReviewData = {
      totalScenarios: scenarios.length,
      solvedScenarios: 1,
      attempts: finalAttempts,
      scorePercent: score,
      tier: score >= 90 ? "🌟 Dialogue Master" : "⚡ Analytical Problem Solver",
      strengths: [
        "Engaged actively with step-by-step logic and sequential decomposition",
        "Examined real-world workflows from a computational perspective",
      ],
      areasToImprove: [
        "Continue practicing identifying initial prerequisite states before downstream execution",
      ],
      takeaways: [
        "Real-world workflows map directly to sequential code execution.",
        "A system or application must be initialized before instructions can run.",
        "Breaking problems into atomic prerequisite steps eliminates runtime ambiguity.",
      ],
    };

    setSummaryData(review);

    const endMsg: ChatTurnMessage = {
      id: `end-${Date.now()}`,
      sender: "bot",
      isSummary: true,
      text: `🏁 **Dialogue Concluded!** You've wrapped up this interactive session. Here is your comprehensive learning summary and takeaways below:`,
    };

    setMessages((prev) => [...prev, endMsg]);
  }

  // Main submission handler: analyzes user answer conversationally like a chatbot
  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const userText = inputVal.trim();
    if (!userText || isAnalyzing || isFinished) return;

    setInputVal("");
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    // 1. Add student's response to chat
    const userMsg: ChatTurnMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: userText,
      timestamp: "Just now",
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setIsAnalyzing(true);

    try {
      // 2. Call backend interactive dialogue API
      const res = await fetch("/api/courses/ai/dialogue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "interactive_chat_turn",
          scenario: activeScenario.situation,
          question: activeScenario.question,
          expectedKeywords: activeScenario.expectedKeywords,
          expectedReasoning: activeScenario.correctExplanation,
          userAnswer: userText,
          conversationHistory: updatedHistory.map((m) => ({ sender: m.sender, text: m.text })),
          attemptCount: nextAttempts,
          courseTitle,
          moduleTitle,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && typeof data.is_desired_answer === "boolean") {
          handleAiAnalysisResult(data, userText, nextAttempts, updatedHistory);
          return;
        }
      }
    } catch (err) {
      console.warn("API evaluation fallback triggered:", err);
    }

    // 3. Robust Client-Side Semantic Evaluation Fallback
    handleLocalSemanticEvaluation(userText, nextAttempts, updatedHistory);
  }

  // Handles AI API evaluation response
  function handleAiAnalysisResult(
    data: any,
    userText: string,
    currentAttempts: number,
    history: ChatTurnMessage[]
  ) {
    setIsAnalyzing(false);

    if (data.is_desired_answer) {
      // DESIRED ANSWER ACHIEVED!
      if (onAwardXp) {
        onAwardXp(50, "dialogue", `Mastered dialogue reasoning in ${subtopicTitle || moduleTitle || courseTitle}`);
      }

      setIsFinished(true);

      const review: DialogueReviewData = {
        totalScenarios: scenarios.length,
        solvedScenarios: scenarios.length,
        attempts: currentAttempts,
        scorePercent: data.summary?.score || 95,
        tier: "🌟 Dialogue Master",
        strengths: data.summary?.concepts_mastered || [
          "Identified the foundational initialization requirement",
          "Structured instructions with clear prerequisite sequencing",
        ],
        areasToImprove: [],
        takeaways: data.summary?.takeaways || [
          "Sequential order is paramount: environments must initialize before operations run.",
          "Clear boundary conditions prevent ambiguous runtime states.",
        ],
      };

      setSummaryData(review);

      const successMsg: ChatTurnMessage = {
        id: `bot-success-${Date.now()}`,
        sender: "bot",
        isDesiredAnswer: true,
        text: `${data.bot_response || `🎯 **Spot on! Brilliant explanation.**\n${activeScenario.correctExplanation}`}

*(+50 XP awarded! 🎉)*`,
      };

      setMessages([...history, successMsg]);
      if (onComplete) onComplete();
    } else {
      // NOT DESIRED ANSWER YET: Ask targeted back-question
      const backMsg: ChatTurnMessage = {
        id: `bot-back-${Date.now()}`,
        sender: "bot",
        isBackQuestion: true,
        text: data.bot_response,
      };

      setMessages([...history, backMsg]);
    }
  }

  // Local semantic evaluation fallback with dynamic back-questions
  function handleLocalSemanticEvaluation(
    userText: string,
    currentAttempts: number,
    history: ChatTurnMessage[]
  ) {
    setIsAnalyzing(false);

    const lower = userText.toLowerCase();
    const keywords = activeScenario.expectedKeywords || [];
    const matchedCount = keywords.filter((k) => lower.includes(k.toLowerCase())).length;

    // Check if desired answer
    const isDesired =
      matchedCount >= 1 ||
      (currentAttempts >= 3 && userText.split(" ").length >= 6) ||
      lower.includes("download") ||
      lower.includes("install") ||
      lower.includes("open the app") ||
      lower.includes("open app") ||
      lower.includes("sign up") ||
      lower.includes("login") ||
      lower.includes("log in") ||
      lower.includes("account");

    if (isDesired) {
      if (onAwardXp) {
        onAwardXp(50, "dialogue", `Mastered dialogue reasoning in ${subtopicTitle || moduleTitle || courseTitle}`);
      }

      setIsFinished(true);

      const review: DialogueReviewData = {
        totalScenarios: scenarios.length,
        solvedScenarios: scenarios.length,
        attempts: currentAttempts,
        scorePercent: Math.max(75, 100 - (currentAttempts - 1) * 7),
        tier: "🌟 Dialogue Master",
        strengths: [
          "Identified the foundational initialization requirement",
          "Understood that environments must be active before instructions execute",
        ],
        areasToImprove: [],
        takeaways: [
          "Software systems must be initialized and authenticated before handling user tasks.",
          "Translating real-world workflows into step-by-step logic builds solid computational intuition.",
        ],
      };

      setSummaryData(review);

      const successMsg: ChatTurnMessage = {
        id: `bot-success-${Date.now()}`,
        sender: "bot",
        isDesiredAnswer: true,
        text: `🎯 **Spot on! Brilliant explanation.**

${activeScenario.correctExplanation}

*(+50 XP awarded! 🎉)*`,
      };

      setMessages([...history, successMsg]);
      if (onComplete) onComplete();
    } else {
      // Formulate adaptive back-question based on what the user said
      let backQuestion = "";
      if (lower.includes("search") || lower.includes("find") || lower.includes("menu")) {
        backQuestion = `Searching the menu is definitely an essential step! But hold on—if your friend's phone is currently sitting locked on a table, what needs to be on their phone and opened *before* they can search for any restaurant or pizza?`;
      } else if (lower.includes("order") || lower.includes("buy") || lower.includes("cart") || lower.includes("pay")) {
        backQuestion = `They definitely want to place an order! But before they can add pizzas to a cart or pay, what screen or application do they need to be looking at? What is the initial action to get started from scratch?`;
      } else if (lower.includes("pizza") || lower.includes("cheese") || lower.includes("topping")) {
        backQuestion = `Choosing toppings is the most fun part! But imagine you're writing step 1 of the user manual: what is the very first thing your friend physically does on their device before any pizza options appear?`;
      } else if (currentAttempts === 1) {
        backQuestion = `Good effort! You're thinking about the process, but imagine your friend doesn't even have the service set up yet. What is the literal prerequisite step to access the food delivery service on their phone?`;
      } else {
        backQuestion = `You're getting closer! Think about how a program starts: line 1 must load the environment. In the case of using an app for the first time, does your friend need to **download or open** something first? How would they get into the app?`;
      }

      const backMsg: ChatTurnMessage = {
        id: `bot-back-${Date.now()}`,
        sender: "bot",
        isBackQuestion: true,
        text: backQuestion,
      };

      setMessages([...history, backMsg]);
    }
  }

  const modNum = moduleIndex !== undefined ? moduleIndex + 1 : undefined;
  const cleanMod = (moduleTitle || "").replace(/^(?:Module|Week|Day)\s*\d+[:\s-]*/i, "").trim();
  const displayTitle = modNum
    ? `Module ${modNum}: ${cleanMod}`
    : subtopicTitle || (cleanMod ? `Module: ${cleanMod}` : courseTitle || "Dialogue & Architectural Trade-Offs");

  return (
    <div
      className={`flex flex-col h-full w-full max-w-4xl mx-auto rounded-2xl border transition-colors ${
        isBright
          ? "bg-white border-[#E8DACD] text-slate-900 shadow-sm"
          : "bg-[#11141B] border-white/10 text-white shadow-xl"
      } ${className}`}
    >
      {/* ========================================================================= */}
      {/* HEADER: Clean title, dialogue badge, and top-right actions */}
      {/* ========================================================================= */}
      <div
        className={`px-5 sm:px-6 py-4 border-b flex items-center justify-between gap-4 shrink-0 ${
          isBright ? "bg-white border-[#E8DACD]" : "bg-[#141822] border-white/10"
        }`}
      >
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-bold truncate !text-slate-900 dark:!text-white">
            {displayTitle}
          </h2>
          <span className="text-xs font-semibold text-slate-500 dark:text-ink-400 block mt-0.5">
            Dialogue
          </span>
        </div>

        {/* Top-Right Control Buttons: I'm stuck & End Dialogue */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleImStuck}
            disabled={isFinished || isAnalyzing}
            className={`px-3.5 py-1.5 rounded-xl border text-xs sm:text-sm font-medium transition-colors cursor-pointer disabled:opacity-40 ${
              isBright
                ? "bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-2xs"
                : "bg-white/5 border-white/15 text-ink-200 hover:bg-white/10"
            }`}
          >
            I&apos;m stuck
          </button>

          <button
            type="button"
            onClick={handleEndDialogue}
            disabled={isFinished}
            className={`px-3.5 py-1.5 rounded-xl border text-xs sm:text-sm font-medium transition-colors cursor-pointer disabled:opacity-40 ${
              isBright
                ? "bg-white border-slate-300 text-slate-900 hover:bg-slate-50 shadow-2xs"
                : "bg-white/5 border-white/15 text-white hover:bg-white/10"
            }`}
          >
            End Dialogue
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CHAT THREAD: Clean, readable messages with formatted markdown */}
      {/* ========================================================================= */}
      <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-6 space-y-6">
        {messages.map((msg) => {
          const isUser = msg.sender === "user";

          if (isUser) {
            return (
              <div key={msg.id} className="flex justify-end">
                <div
                  className={`max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-2xl rounded-tr-xs text-xs sm:text-sm font-medium leading-relaxed ${
                    isBright
                      ? "bg-amber-500 text-white shadow-xs"
                      : "bg-amber-500 text-white shadow-md"
                  }`}
                >
                  {renderFormattedMessage(msg.text, true)}
                </div>
              </div>
            );
          }

          // Bot Message
          return (
            <div key={msg.id} className="flex flex-col items-start max-w-[95%] sm:max-w-[88%] space-y-2">
              <div
                className={`w-full text-xs sm:text-sm leading-relaxed p-4 sm:p-5 rounded-2xl ${
                  msg.isDesiredAnswer
                    ? isBright
                      ? "bg-emerald-50 text-emerald-950 border border-emerald-200"
                      : "bg-[#0E241B] text-emerald-100 border border-emerald-500/30"
                    : msg.isHint
                    ? isBright
                      ? "bg-amber-50 text-amber-950 border border-amber-200"
                      : "bg-[#251D0F] text-amber-100 border border-amber-500/30"
                    : msg.isBackQuestion
                    ? isBright
                      ? "bg-sky-50 text-sky-950 border border-sky-200"
                      : "bg-[#0D1E2E] text-sky-100 border border-sky-500/30"
                    : isBright
                    ? "bg-transparent text-slate-800"
                    : "bg-transparent text-slate-100"
                }`}
              >
                {renderFormattedMessage(msg.text, false)}
              </div>
            </div>
          );
        })}

        {/* AI Analyzing / Thinking Indicator */}
        {isAnalyzing && (
          <div className="flex items-center gap-2.5 text-xs text-amber-600 dark:text-amber-400 italic p-3">
            <RefreshCw size={14} className="animate-spin text-amber-500" />
            <span>Analyzing your answer & formulating coaching guidance...</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* COMPLETION SUMMARY CARD (When desired answer reached or dialogue ended) */}
        {/* ========================================================================= */}
        {isFinished && summaryData && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-5 sm:p-6 rounded-2xl border space-y-4 my-4 ${
              isBright
                ? "bg-white border-slate-200 shadow-md"
                : "bg-[#141824] border-white/15 shadow-2xl"
            }`}
          >
            <div className="flex items-center justify-between border-b border-line-soft pb-3">
              <div className="flex items-center gap-2.5">
                <Trophy size={20} className="text-amber-500 shrink-0" />
                <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  Dialogue Performance Review & Summary
                </h4>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                {(summaryData.tier || "🌟 Dialogue Master").replace(/Socratic/gi, "Dialogue")}
              </span>
            </div>

            {/* Strengths / Concepts Mastered */}
            <div className="space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 size={15} /> Key Concepts Mastered:
              </h5>
              <ul className="space-y-1.5 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 pl-2">
                {summaryData.strengths.map((st, sIdx) => (
                  <li key={sIdx} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold shrink-0 mt-0.5">•</span>
                    <span className="flex-1 leading-relaxed">{parseInlineFormatting(st, false)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* High-Yield Analytical Takeaways */}
            <div className="pt-3 border-t border-line-soft space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center gap-1.5">
                <Bookmark size={15} /> Core Computational Takeaways:
              </h5>
              <ul className="space-y-1.5 text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-100 pl-2">
                {summaryData.takeaways.map((tk, tIdx) => (
                  <li key={tIdx} className="flex items-start gap-2">
                    <span className="text-sky-500 font-bold shrink-0 mt-0.5">•</span>
                    <span className="flex-1 leading-relaxed">{parseInlineFormatting(tk, false)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-line-soft">
              <button
                type="button"
                onClick={() => {
                  initChat();
                  if (onRestart) onRestart();
                }}
                className={`px-4 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition-colors cursor-pointer flex items-center gap-2 ${
                  isBright
                    ? "bg-white border-slate-300 text-slate-700 hover:bg-slate-100 shadow-xs"
                    : "bg-white/5 border-white/15 text-slate-200 hover:bg-white/10 hover:text-white"
                }`}
              >
                <RefreshCw size={14} /> Try Again
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onComplete) onComplete();
                }}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-95 text-white text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                Continue Course <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* ========================================================================= */}
      {/* BOTTOM INPUT BAR: Clean, rounded input container with mic & send */}
      {/* ========================================================================= */}
      <div
        className={`p-4 sm:p-5 border-t shrink-0 ${
          isBright ? "bg-white border-[#E8DACD]" : "bg-[#141822] border-white/10"
        }`}
      >
        <form onSubmit={handleSubmit} className="relative">
          <div
            className={`flex flex-col rounded-2xl border transition-all p-3 ${
              isBright
                ? "bg-white border-slate-300 focus-within:border-slate-500 shadow-2xs"
                : "bg-white/[0.03] border-white/15 focus-within:border-amber-500/60"
            }`}
          >
            <textarea
              ref={inputRef}
              rows={2}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              disabled={isFinished || isAnalyzing}
              placeholder={
                isFinished
                  ? "Dialogue concluded. Click Try Again to restart or Continue Course."
                  : "Type your answer or reasoning..."
              }
              className={`w-full bg-transparent border-0 outline-none resize-none text-xs sm:text-sm leading-relaxed ${
                isBright ? "text-slate-900 placeholder-slate-400" : "text-white placeholder-ink-400"
              }`}
            />

            {/* Bottom Controls inside input box: Mic & Send Arrow */}
            <div className="flex items-center justify-between pt-2 mt-1">
              <div className="text-[11px] text-slate-400 dark:text-ink-400">
                {isListening ? (
                  <span className="text-red-500 animate-pulse font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
                    Listening... Speak now
                  </span>
                ) : (
                  <span>Press Enter to send · Shift+Enter for newline</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Speech to Text Microphone */}
                <button
                  type="button"
                  onClick={toggleSpeechToText}
                  disabled={isFinished || isAnalyzing}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    isListening
                      ? "bg-red-500 text-white shadow-sm"
                      : isBright
                      ? "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                      : "text-ink-300 hover:text-white hover:bg-white/10"
                  }`}
                  title={isListening ? "Stop listening" : "Speak your answer"}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                </button>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!inputVal.trim() || isAnalyzing || isFinished}
                  className="p-2 rounded-xl bg-slate-900 dark:bg-white dark:text-slate-950 text-white disabled:opacity-30 hover:opacity-90 transition-opacity cursor-pointer shadow-2xs"
                  title="Send answer"
                >
                  <Send size={15} />
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
