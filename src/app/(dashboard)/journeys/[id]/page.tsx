'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { addXp, getStoredXpData } from '@/lib/admin/services/xpService';

interface ModuleContent {
  title?: string;
  readTime?: string;
  tagline?: string;
  summary?: string;
  funAnalogy?: string;
  keyTakeaways?: string[];
}

interface ModuleVideo {
  title?: string;
  youtubeId?: string;
  channel?: string;
  duration?: string;
  summary?: string;
}

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  tag?: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  funFact?: string;
}

interface PassGate {
  type: 'quiz' | 'task';
  quiz?: {
    title: string;
    passingScore: number;
    questions: QuizQuestion[];
  };
  task?: {
    missionTitle?: string;
    xpReward?: number;
    estimatedTime?: string;
    dailyGoal?: string;
    instructions: string;
    checklist: string[];
    dailyTip?: string;
  };
}

interface DialogueMentor {
  mentorName: string;
  mentorAvatar: string;
  tagline: string;
  suggestedQuestions: string[];
  qaList: Array<{ question: string; answer: string }>;
}

export interface RoadmapModule {
  id: string;
  journeyId: string;
  courseId: string;
  title: string;
  subtitle?: string;
  tagline: string;
  skill: string;
  description: string;
  level: number;
  order: number;
  duration: string;
  estimatedHours?: number;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  xpPoints: number;
  activityType?: 'concept' | 'flashcards' | 'video' | 'dialogue' | 'quiz' | 'task';
  iconType?: string;
  icon?: string;
  content?: ModuleContent;
  video?: ModuleVideo | null;
  flashcards?: Flashcard[];
  dialogue?: DialogueMentor | null;
  passGate?: PassGate;
}

interface LevelGroup {
  level: number;
  name: string;
  description?: string;
  modules: RoadmapModule[];
}

interface JourneyDetails {
  id: string;
  title: string;
  category: string;
  role: string;
  level: string;
  duration: string;
  totalModules: number;
  totalXp: number;
}

// ── S-Curve horizontal offset pattern (Duolingo style - prominent winding curve) ──
const S_CURVE_OFFSETS = [0, 85, 120, 65, 0, -65, -120, -85];
const TRAIL_WIDTH = 460;
const TRAIL_CX = TRAIL_WIDTH / 2; // 230
const ROW_SPACING = 145;

// Deterministic single-pass status resolution across all modules in all levels
function resolveTileStatuses(levelsList: LevelGroup[], completedList: string[]): LevelGroup[] {
  const completedSet = new Set(completedList);
  let firstIncompleteFound = false;

  return levelsList.map((lvl) => ({
    ...lvl,
    modules: lvl.modules.map((m) => {
      if (completedSet.has(m.id)) {
        return { ...m, status: 'completed' as const };
      } else if (!firstIncompleteFound) {
        firstIncompleteFound = true;
        return { ...m, status: 'available' as const };
      } else {
        return { ...m, status: 'locked' as const };
      }
    }),
  }));
}

export default function JourneyRoadmapPage() {
  const params = useParams();
  const journeyId = (params?.id as string) || 'active';
  const { isBright } = useTheme();

  const [journey, setJourney] = useState<JourneyDetails | null>(null);
  const [levels, setLevels] = useState<LevelGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active fresh whole panel view
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);

  // Flashcards state
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Quiz evaluation state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  // Task checklist state
  const [taskChecklist, setTaskChecklist] = useState<Record<number, boolean>>({});

  // Guidebook modal state
  const [guidebookLevel, setGuidebookLevel] = useState<LevelGroup | null>(null);

  // Treasure chest claimed state
  const [claimedChests, setClaimedChests] = useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('mentora_claimed_chests');
        if (raw) return JSON.parse(raw);
      } catch {}
    }
    return {};
  });
  const [chestModalOpen, setChestModalOpen] = useState<{ id: string; xp: number; title: string } | null>(null);

  // XP & completion state
  const [completing, setCompleting] = useState(false);
  const [justCompletedModuleId, setJustCompletedModuleId] = useState<string | null>(null);
  const [earnedXpToast, setEarnedXpToast] = useState<{ points: number; message: string } | null>(null);
  const [userXp, setUserXp] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        return getStoredXpData().totalXp;
      } catch {}
    }
    return 2450;
  });

  // Color tokens matching Mentora design system
  const bgPage = isBright ? '#FFF8F0' : '#0B0907';
  const cardBg = isBright ? '#FFFFFF' : '#140E0A';
  const cardBorder = isBright ? 'rgba(234,88,12,0.14)' : 'rgba(255,107,53,0.16)';
  const textPrimary = isBright ? '#1C1917' : '#FFF8F0';
  const textMuted = isBright ? '#78716C' : 'rgba(255,248,240,0.55)';
  const panelBg = isBright ? '#FAF4EE' : '#18120D';

  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/journeys/${journeyId}/roadmap`);
      if (!res.ok) throw new Error('Failed to load roadmap data.');
      const data = await res.json();
      setJourney(data.journey);

      let fetchedLevels: LevelGroup[] = data.levels || [];

      // Check localStorage for completed modules to sync state
      if (typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem('mentora_completed_modules');
          if (raw) {
            const map = JSON.parse(raw);
            const courseCompleted = map[journeyId] || map[data.journey?.id] || (journeyId === 'demo' ? map['demo'] : (journeyId === 'crs_1' ? map['crs_1'] : [])) || [];
            if (Array.isArray(courseCompleted) && courseCompleted.length > 0) {
              fetchedLevels = resolveTileStatuses(fetchedLevels, courseCompleted);
            }
          }
        } catch {}
      }

      setLevels(fetchedLevels);
    } catch (err: any) {
      console.error('Roadmap fetch error:', err);
      setError(err?.message || 'Could not load journey roadmap.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, [journeyId]);

  // Flattened ordered modules list
  const allModules: RoadmapModule[] = useMemo(() => {
    return levels.flatMap((l) => l.modules);
  }, [levels]);

  // Currently opened module in the fresh whole panel
  const activeModule = useMemo(() => {
    if (!activeModuleId) return null;
    return allModules.find((m) => m.id === activeModuleId) || null;
  }, [activeModuleId, allModules]);

  // Determine dedicated single activity type
  const activeActivityType: 'concept' | 'flashcards' | 'video' | 'dialogue' | 'quiz' | 'task' = useMemo(() => {
    if (!activeModule) return 'concept';
    if (activeModule.activityType) return activeModule.activityType;
    if (activeModule.passGate?.type === 'quiz' && activeModule.passGate.quiz?.questions?.length) return 'quiz';
    if (activeModule.passGate?.type === 'task') return 'task';
    if (activeModule.video?.youtubeId || activeModule.video?.title) return 'video';
    if (activeModule.flashcards?.length) return 'flashcards';
    if (activeModule.dialogue?.qaList?.length) return 'dialogue';
    return 'concept';
  }, [activeModule]);

  // Find the current active/in-progress module (the one with the START bubble)
  const currentActiveModuleId = useMemo(() => {
    const firstAvailable = allModules.find((m) => m.status === 'available' || m.status === 'in_progress');
    return firstAvailable ? firstAvailable.id : (allModules[0]?.id || null);
  }, [allModules]);

  // Calculated overall metrics
  const completedCount = useMemo(() => {
    return allModules.filter((m) => m.status === 'completed').length;
  }, [allModules]);

  const progressPercent = useMemo(() => {
    return allModules.length > 0 ? Math.round((completedCount / allModules.length) * 100) : 0;
  }, [allModules, completedCount]);

  // Open module in fresh whole panel
  const handleOpenModule = (mod: RoadmapModule) => {
    if (mod.status === 'locked') return;
    setActiveModuleId(mod.id);
    setIsFlipped(false);
    setCurrentFlashcardIndex(0);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizPassed(mod.status === 'completed');
    setTaskChecklist({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClosePanel = () => {
    setActiveModuleId(null);
  };

  // Claim treasure chest bonus XP
  const handleClaimChest = (chestId: string, xpReward: number, chestTitle: string) => {
    if (claimedChests[chestId]) return;
    const nextClaimed = { ...claimedChests, [chestId]: true };
    setClaimedChests(nextClaimed);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('mentora_claimed_chests', JSON.stringify(nextClaimed));
      } catch {}
    }
    const xpResult = addXp(xpReward, 'bonus', `Opened Treasure Chest: ${chestTitle}`);
    setUserXp(xpResult.updatedData.totalXp);
    setChestModalOpen({ id: chestId, xp: xpReward, title: chestTitle });
  };

  // Handle Quiz Submission & Passing Score Validation
  const handleVerifyQuiz = () => {
    if (!activeModule?.passGate?.quiz) return;
    const questions = activeModule.passGate.quiz.questions || [];
    if (!questions || questions.length === 0) return;

    let correctCount = 0;
    questions.forEach((q) => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / questions.length) * 100);
    const passingRequired = activeModule.passGate.quiz.passingScore || 70;
    const passed = calculatedScore >= passingRequired;

    setQuizScore(calculatedScore);
    setQuizSubmitted(true);
    setQuizPassed(passed);
  };

  // Complete module, award XP, log to admin report, unlock next tile, and return to roadmap
  const handleCompleteModule = async (moduleId: string) => {
    if (!activeModule) return;
    try {
      setCompleting(true);
      const xpToAward = activeModule.xpPoints || 50;

      // 1. Award XP in user credentials
      const xpResult = addXp(xpToAward, 'quiz', `Completed: ${activeModule.title}`);
      setUserXp(xpResult.updatedData.totalXp);
      setEarnedXpToast({
        points: xpToAward,
        message: `+${xpToAward} XP Awarded! You reached Level ${xpResult.newLevel}! 🎉`,
      });

      // 2. Persist completion to database & report to admin panel
      const courseTargetId = journey?.id || journeyId;
      const reportPayload = {
        courseId: courseTargetId,
        courseTitle: journey?.title || 'Learning Roadmap',
        category: journey?.category || 'Professional Track',
        title: activeModule.title,
        tileTitle: activeModule.title,
        activityType: activeActivityType,
        xpReward: xpToAward,
        score: activeActivityType === 'quiz' ? quizScore : 100,
        totalModules: allModules.length,
      };

      try {
        await fetch(`/api/modules/${moduleId}/complete`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reportPayload),
        });
      } catch (e) {
        console.warn('Database progress sync warning:', e);
      }

      // Also send report to admin reports endpoint
      try {
        await fetch('/api/admin/reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...reportPayload,
            tileId: moduleId,
          }),
        });
      } catch {}

      // Save report in localStorage for instant admin panel synchronization
      if (typeof window !== 'undefined') {
        try {
          const rawReports = localStorage.getItem('mentora_admin_reports');
          const parsedReports = rawReports ? JSON.parse(rawReports) : [];
          parsedReports.unshift({
            id: `rep_${Date.now()}`,
            userId: 'guest_user',
            userName: 'Active Learner',
            ...reportPayload,
            tileId: moduleId,
            completedAt: new Date().toISOString(),
          });
          localStorage.setItem('mentora_admin_reports', JSON.stringify(parsedReports.slice(0, 30)));
          window.dispatchEvent(new CustomEvent('mentora_activity_reported'));
        } catch {}
      }

      // 3. Persist completed module ID in localStorage
      const updatedCompletedIds = Array.from(
        new Set([...allModules.filter((m) => m.status === 'completed').map((m) => m.id), moduleId])
      );

      if (typeof window !== 'undefined') {
        try {
          const raw = localStorage.getItem('mentora_completed_modules');
          const map = raw ? JSON.parse(raw) : {};
          map[courseTargetId] = updatedCompletedIds;
          map[journeyId] = updatedCompletedIds;
          map['demo'] = updatedCompletedIds;
          map['crs_1'] = updatedCompletedIds;
          localStorage.setItem('mentora_completed_modules', JSON.stringify(map));
          window.dispatchEvent(new CustomEvent('mentora_progress_updated', { detail: map }));
          window.dispatchEvent(new CustomEvent('mentora_xp_updated', { detail: xpResult.updatedData }));
        } catch {}
      }

      // 4. Update UI sequence: completed tile turns ORANGE, next tile UNLOCKS with "START ★"
      setLevels((prevLevels) => resolveTileStatuses(prevLevels, updatedCompletedIds));

      // 5. Direct back to roadmap view (per user instructions)
      setJustCompletedModuleId(moduleId);
      setActiveModuleId(null);

      // Smooth scroll back to newly unlocked next tile
      setTimeout(() => {
        const currentIndex = allModules.findIndex((m) => m.id === moduleId);
        const nextMod = currentIndex >= 0 && currentIndex + 1 < allModules.length ? allModules[currentIndex + 1] : null;
        const targetNodeId = nextMod ? `roadmap-node-${nextMod.id}` : `roadmap-node-${moduleId}`;
        const targetElement = document.getElementById(targetNodeId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 350);
    } catch (err: any) {
      alert(err?.message || 'Error completing activity');
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div
      id="journey-roadmap-page"
      className="min-h-screen flex selection:bg-orange-500 selection:text-white"
      style={{ background: bgPage, fontFamily: 'var(--font-geist-sans), sans-serif' }}
    >
      {/* ── Fixed Sidebar ── */}
      <DashboardSidebar />

      {/* ── Main Stage ── */}
      <main className="flex-1 ml-[76px] lg:ml-[84px] min-h-screen overflow-y-auto px-4 sm:px-6 lg:px-10 py-8">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* ── Top Header Navigation & XP Bar ── */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold" style={{ color: textMuted }}>
              <Link href="/dashboard" className="hover:text-orange-500 transition-colors">
                Dashboard
              </Link>
              <span>/</span>
              <Link href="/dashboard/courses" className="hover:text-orange-500 transition-colors">
                Courses
              </Link>
              <span>/</span>
              <span className="text-orange-500 font-bold truncate max-w-[200px] sm:max-w-none">
                {journey?.title || 'Learning Roadmap'}
              </span>
            </div>

            {/* Streak & Total XP Badges */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-500 text-xs font-mono font-black shadow-sm">
                <span>🔥</span>
                <span>3 Day Streak</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-500 text-xs font-mono font-black shadow-sm">
                <span>⚡</span>
                <span>{userXp.toLocaleString()} XP</span>
              </div>
            </div>
          </div>

          {/* ── Floating XP Celebration Toast ── */}
          {earnedXpToast && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FF6B35] to-[#E85D2C] text-white shadow-2xl flex items-center justify-between animate-in slide-in-from-top-4 duration-300 font-bold text-sm">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl animate-bounce">🏆</span>
                <span>{earnedXpToast.message}</span>
              </div>
              <button
                type="button"
                onClick={() => setEarnedXpToast(null)}
                className="w-7 h-7 rounded-full bg-black/20 hover:bg-black/30 flex items-center justify-center text-xs font-bold transition-all"
              >
                ✕
              </button>
            </div>
          )}

          {/* ── Loading / Error State ── */}
          {loading && (
            <div className="text-center py-24 space-y-4">
              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-mono text-orange-500 font-bold uppercase tracking-wider">
                Synthesizing Interactive Roadmap Trail...
              </p>
            </div>
          )}

          {error && (
            <div className="p-6 rounded-2xl bg-red-950/40 border border-red-800 text-red-300 text-xs space-y-3">
              <p className="font-bold text-sm">Failed to load roadmap: {error}</p>
              <button
                type="button"
                onClick={fetchRoadmap}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold"
              >
                Retry
              </button>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              VIEW MODE A: DUOLINGO WINDING S-CURVE TRAIL (When no module is open)
              ══════════════════════════════════════════════════════════════════ */}
          {!loading && !error && !activeModule && (
            <div className="space-y-12 pb-16">
              
              {levels.map((lvlGroup, lvlIdx) => {
                const baseOffset = levels.slice(0, lvlIdx).reduce((acc, prev) => acc + prev.modules.length + 2, 0);

                // Build structured trail items list (discrete modules + milestone chest + unit milestone badge)
                const trailItems: Array<{
                  id: string;
                  type: 'module' | 'chest' | 'milestone';
                  module?: RoadmapModule;
                  chest?: { id: string; xp: number; title: string };
                  milestoneLevel?: number;
                }> = [];

                lvlGroup.modules.forEach((mod, modIdx) => {
                  trailItems.push({
                    id: `mod-${mod.id}`,
                    type: 'module',
                    module: mod,
                  });

                  // Position milestone treasure chest after the 3rd tile
                  if (modIdx === 2) {
                    trailItems.push({
                      id: `chest-lvl-${lvlGroup.level}`,
                      type: 'chest',
                      chest: {
                        id: `chest_lvl_${lvlGroup.level}`,
                        xp: 100,
                        title: `Unit ${lvlGroup.level} Bonus Loot`,
                      },
                    });
                  }
                });

                // Append Unit Laurel Trophy Milestone Badge at end of unit trail
                trailItems.push({
                  id: `milestone-${lvlGroup.level}`,
                  type: 'milestone',
                  milestoneLevel: lvlGroup.level,
                });

                const totalHeight = (trailItems.length - 1) * ROW_SPACING + 170;

                // Compute smooth bezier SVG path
                let svgPathD = '';
                trailItems.forEach((_, k) => {
                  const globalIdx = baseOffset + k;
                  const x = TRAIL_CX + S_CURVE_OFFSETS[globalIdx % S_CURVE_OFFSETS.length];
                  const y = k * ROW_SPACING + 80;

                  if (k === 0) {
                    svgPathD += `M ${x} ${y}`;
                  } else {
                    const prevGlobal = baseOffset + k - 1;
                    const prevX = TRAIL_CX + S_CURVE_OFFSETS[prevGlobal % S_CURVE_OFFSETS.length];
                    const prevY = (k - 1) * ROW_SPACING + 80;
                    const midY = (prevY + y) / 2;
                    svgPathD += ` C ${prevX} ${midY}, ${x} ${midY}, ${x} ${y}`;
                  }
                });

                return (
                  <div key={lvlGroup.level} className="space-y-6">

                    {/* ── DUOLINGO SECTION / UNIT BANNER ── */}
                    <div
                      className="p-5 sm:p-6 rounded-[28px] border shadow-xl flex items-center justify-between gap-4 relative overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, #FF6B35 0%, #E85D2C 60%, #C2410C 100%)',
                        borderColor: 'rgba(255,255,255,0.2)',
                        boxShadow: '0 8px 30px rgba(255,107,53,0.3)',
                      }}
                    >
                      {/* Subtle diagonal background stripes */}
                      <div
                        className="absolute inset-0 opacity-10 pointer-events-none"
                        style={{
                          backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 10px, transparent 0, transparent 20px)',
                        }}
                      />

                      <div className="relative z-10 text-white space-y-1 max-w-lg">
                        <div className="text-[11px] font-mono font-black uppercase tracking-widest text-amber-200">
                          Unit {lvlGroup.level} • {journey?.category || 'Track'}
                        </div>
                        <h2 className="text-lg sm:text-xl font-black tracking-tight leading-tight">
                          {lvlGroup.name}
                        </h2>
                        <p className="text-xs text-white/85 line-clamp-1">
                          {lvlGroup.description || 'Master each stepping stone: concepts, flashcards, videos, AI coaching, and quiz gates.'}
                        </p>
                      </div>

                      {/* Guidebook Button */}
                      <button
                        type="button"
                        onClick={() => setGuidebookLevel(lvlGroup)}
                        className="relative z-10 px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 active:scale-95 border border-white/30 text-white font-mono font-bold text-xs flex items-center gap-2 shadow-md transition-all shrink-0"
                      >
                        <span>📖</span>
                        <span className="uppercase tracking-wider">GUIDEBOOK</span>
                      </button>
                    </div>

                    {/* ── THE WINDING S-CURVE DUOLINGO TRAIL ── */}
                    <div
                      className="relative w-full max-w-[460px] mx-auto py-6"
                      style={{ height: `${totalHeight}px` }}
                    >
                      {/* Continuous Smooth Curved SVG Ribbon */}
                      <svg
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        viewBox={`0 0 ${TRAIL_WIDTH} ${totalHeight}`}
                        preserveAspectRatio="none"
                        fill="none"
                      >
                        {/* Soft warm aura glow */}
                        <path
                          d={svgPathD}
                          stroke="rgba(255, 107, 53, 0.18)"
                          strokeWidth="24"
                          strokeLinecap="round"
                        />
                        {/* Solid track foundation */}
                        <path
                          d={svgPathD}
                          stroke={isBright ? '#EADBCE' : '#281E17'}
                          strokeWidth="12"
                          strokeLinecap="round"
                        />
                        {/* Dashed signature Mentora orange trail */}
                        <path
                          d={svgPathD}
                          stroke="#FF6B35"
                          strokeWidth="5"
                          strokeDasharray="12 10"
                          strokeLinecap="round"
                        />
                      </svg>

                      {/* Mascot placed alongside the curve at item 1, positioned comfortably in the side gutter away from the trail */}
                      {trailItems.length > 1 && (
                        <div
                          className={`absolute pointer-events-none hidden md:flex items-center gap-3 z-0 transition-all ${
                            S_CURVE_OFFSETS[(baseOffset + 1) % S_CURVE_OFFSETS.length] >= 0
                              ? '-left-32 lg:-left-44 xl:-left-52 flex-row'
                              : '-right-32 lg:-right-44 xl:-right-52 flex-row-reverse'
                          }`}
                          style={{ top: `${1 * ROW_SPACING + 80}px`, transform: 'translateY(-50%)' }}
                        >
                          <div className="p-3 rounded-2xl bg-black/75 backdrop-blur-md border border-white/15 text-[11px] font-mono text-orange-300 max-w-[155px] shadow-2xl leading-relaxed">
                            &quot;{lvlGroup.level === 1 ? 'Master this gate to unlock the chest! 🚀' : 'Keep the momentum going! 🔥'}&quot;
                          </div>
                          <img
                            src="/dashboard-character.png"
                            alt="Mentora Mascot"
                            className="w-16 h-16 object-contain drop-shadow-2xl"
                          />
                        </div>
                      )}

                      {/* Stepping Stones on the Curve */}
                      {trailItems.map((item, itemIdx) => {
                        const globalIdx = baseOffset + itemIdx;
                        const xOffset = S_CURVE_OFFSETS[globalIdx % S_CURVE_OFFSETS.length];
                        const x = TRAIL_CX + xOffset;
                        const y = itemIdx * ROW_SPACING + 80;

                        if (item.type === 'module') {
                          const mod = item.module!;
                          const isCompleted = mod.status === 'completed';
                          const isAvailable = mod.status === 'available' || mod.status === 'in_progress';
                          const isLocked = mod.status === 'locked';
                          const isStartNode = mod.id === currentActiveModuleId;
                          const isJustCompleted = justCompletedModuleId === mod.id;

                          // Dynamic icon: completed is checkmark, unlocked is topic/activity icon
                          const tileIcon = isCompleted
                            ? '✓'
                            : (mod.icon || (mod.activityType === 'flashcards' ? '🃏' : mod.activityType === 'video' ? '🎥' : mod.activityType === 'dialogue' ? '🤖' : mod.activityType === 'quiz' ? '🎯' : '📖'));

                          const actBadgeLabel =
                            mod.activityType === 'flashcards' ? '🃏 Flashcards' :
                            mod.activityType === 'video' ? '🎥 Video' :
                            mod.activityType === 'dialogue' ? '🤖 AI Coach' :
                            mod.activityType === 'quiz' ? '🎯 Quiz Gate' :
                            mod.activityType === 'task' ? '🛠️ Mission' : '📖 Concept';

                          return (
                            <div
                              key={item.id}
                              id={`roadmap-node-${mod.id}`}
                              className="absolute transition-transform duration-300 flex flex-col items-center"
                              style={{
                                left: `${(x / TRAIL_WIDTH) * 100}%`,
                                top: `${y}px`,
                                transform: 'translate(-50%, -50%)',
                                zIndex: 10,
                              }}
                            >
                              <div className="relative flex flex-col items-center">

                                {/* Floating "START ★" Tooltip over current active title */}
                                {isStartNode && !isCompleted && (
                                  <div className="absolute -top-11 z-30 pointer-events-none animate-bounce">
                                    <div className="relative px-3.5 py-1 bg-white text-[#FF6B35] font-black font-mono text-xs rounded-xl shadow-2xl border border-orange-200 tracking-wider flex items-center gap-1.5">
                                      <span>START</span>
                                      <span className="text-[10px] text-amber-500">★</span>
                                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-6 border-t-white" />
                                    </div>
                                  </div>
                                )}

                                {/* Progress Radial Arc around active title */}
                                {isStartNode && !isCompleted && (
                                  <div className="absolute -inset-2.5 rounded-full border-2 border-dashed border-[#FF6B35] animate-spin-slow pointer-events-none opacity-85" />
                                )}

                                {/* Celebratory Ping on newly completed orange tile */}
                                {isJustCompleted && (
                                  <div className="absolute -inset-3 rounded-full border-2 border-[#FF6B35] animate-ping pointer-events-none opacity-80" />
                                )}

                                {/* Tactile 3D Button - ORANGE FOR COMPLETED per user instructions */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenModule(mod)}
                                  disabled={isLocked}
                                  className={`w-20 h-20 sm:w-22 sm:h-22 rounded-full flex flex-col items-center justify-center select-none transition-all duration-150 cursor-pointer relative group ${
                                    isCompleted
                                      ? 'bg-gradient-to-b from-[#FF6B35] to-[#E85D2C] hover:brightness-105 active:translate-y-[4px]'
                                      : isAvailable
                                      ? isBright
                                        ? 'bg-gradient-to-b from-[#FFFFFF] to-[#FFF4EC] border-2 border-[#FF6B35] hover:scale-105 active:translate-y-[4px]'
                                        : 'bg-gradient-to-b from-[#2A1D15] to-[#1C130D] border-2 border-[#FF6B35] hover:scale-105 active:translate-y-[4px]'
                                      : isBright
                                      ? 'bg-[#E5DDD5] cursor-not-allowed opacity-75'
                                      : 'bg-[#241C16] cursor-not-allowed opacity-70'
                                  }`}
                                  style={{
                                    boxShadow: isCompleted
                                      ? '0 7px 0 #C2410C, 0 10px 24px rgba(255,107,53,0.45)'
                                      : isAvailable
                                      ? isBright
                                        ? '0 7px 0 #EA580C, 0 12px 24px rgba(255,107,53,0.25)'
                                        : '0 7px 0 #EA580C, 0 12px 24px rgba(255,107,53,0.35)'
                                      : isBright
                                      ? '0 6px 0 #C8BDB2'
                                      : '0 6px 0 #16100C',
                                  }}
                                  title={isLocked ? 'Complete earlier activities to unlock' : `Click to open ${mod.title}`}
                                >
                                  <div className="flex flex-col items-center justify-center">
                                    <span
                                      className={`text-2xl sm:text-3xl font-black drop-shadow-md ${
                                        isCompleted ? 'text-white' : isAvailable ? 'text-[#FF6B35]' : 'text-zinc-500'
                                      }`}
                                    >
                                      {isLocked ? '🔒' : tileIcon}
                                    </span>
                                  </div>
                                </button>

                                {/* Module Content Tag below tile */}
                                <div
                                  onClick={() => handleOpenModule(mod)}
                                  className={`mt-2 text-center max-w-[175px] cursor-pointer transition-all ${
                                    isAvailable ? 'hover:text-orange-500' : isCompleted ? 'hover:text-orange-400' : 'opacity-60 cursor-not-allowed'
                                  }`}
                                >
                                  {/* Activity Type Badge */}
                                  <div className="flex items-center justify-center gap-1 mb-0.5">
                                    <span
                                      className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                                      style={{
                                        background: isCompleted ? 'rgba(255,107,53,0.18)' : isAvailable ? 'rgba(255,107,53,0.1)' : 'rgba(255,255,255,0.05)',
                                        color: isCompleted ? '#FF6B35' : isAvailable ? '#FF8C5A' : textMuted,
                                        border: isCompleted ? '1px solid rgba(255,107,53,0.35)' : '1px solid transparent',
                                      }}
                                    >
                                      {actBadgeLabel}
                                    </span>
                                  </div>

                                  <p className="text-[11px] font-bold line-clamp-1" style={{ color: textPrimary }}>
                                    {mod.title}
                                  </p>
                                  <span className="text-[10px] font-mono block font-bold">
                                    {isCompleted ? (
                                      <span className="text-orange-500 font-bold">✓ Completed</span>
                                    ) : isLocked ? (
                                      <span className="text-zinc-500">🔒 Locked</span>
                                    ) : (
                                      <span className="text-amber-400 font-bold">+{mod.xpPoints} XP</span>
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        if (item.type === 'chest') {
                          const isClaimed = claimedChests[item.chest!.id];

                          return (
                            <div
                              key={item.id}
                              id={`roadmap-node-${item.id}`}
                              className="absolute transition-transform duration-300 flex flex-col items-center"
                              style={{
                                left: `${(x / TRAIL_WIDTH) * 100}%`,
                                top: `${y}px`,
                                transform: 'translate(-50%, -50%)',
                                zIndex: 10,
                              }}
                            >
                              <div
                                onClick={() => handleClaimChest(item.chest!.id, item.chest!.xp, item.chest!.title)}
                                className={`p-2 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95 group ${
                                  isClaimed ? 'opacity-85' : 'animate-bounce'
                                }`}
                              >
                                <div className="w-16 h-14 relative flex items-center justify-center">
                                  <div
                                    className="w-14 h-12 rounded-xl flex items-center justify-center text-3xl shadow-xl border border-amber-300/40 relative"
                                    style={{
                                      background: isClaimed
                                        ? 'linear-gradient(135deg, #78350F, #451A03)'
                                        : 'linear-gradient(135deg, #F59E0B, #D97706)',
                                      boxShadow: '0 6px 0 #92400E, 0 10px 20px rgba(245,158,11,0.3)',
                                    }}
                                  >
                                    <span>{isClaimed ? '🎁' : '📦'}</span>
                                  </div>
                                </div>

                                <span className="text-[10px] font-mono font-bold mt-1 text-amber-400">
                                  {isClaimed ? '✓ Loot Claimed' : '⚡ +100 Bonus XP'}
                                </span>
                              </div>
                            </div>
                          );
                        }

                        if (item.type === 'milestone') {
                          const isMastered = lvlGroup.modules.every((m) => m.status === 'completed');

                          return (
                            <div
                              key={item.id}
                              id={`roadmap-node-${item.id}`}
                              className="absolute transition-transform duration-300 flex flex-col items-center"
                              style={{
                                left: `${(x / TRAIL_WIDTH) * 100}%`,
                                top: `${y}px`,
                                transform: 'translate(-50%, -50%)',
                                zIndex: 10,
                              }}
                            >
                              <div
                                className="w-20 h-20 rounded-full flex flex-col items-center justify-center relative shadow-2xl transition-all"
                                style={{
                                  background: isMastered
                                    ? 'linear-gradient(135deg, #FF6B35, #E85D2C)'
                                    : 'linear-gradient(135deg, #7C3A18, #451E0E)',
                                  boxShadow: '0 6px 0 rgba(0,0,0,0.35)',
                                }}
                              >
                                <span className="text-xl">🏆</span>
                                <span className="text-xs font-black font-mono text-white">
                                  {item.milestoneLevel}
                                </span>
                              </div>
                              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-orange-400 mt-2">
                                {isMastered ? `Unit ${item.milestoneLevel} Mastered 🎉` : `Unit ${item.milestoneLevel} Milestone`}
                              </span>
                            </div>
                          );
                        }

                        return null;
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              VIEW MODE B: DEDICATED SINGLE-ACTIVITY FRESH WHOLE PANEL
              (When circular tile is clicked, user directly accesses the content)
              ══════════════════════════════════════════════════════════════════ */}
          {!loading && activeModule && (
            <div
              className="rounded-[32px] border p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden animate-in fade-in duration-300"
              style={{ background: cardBg, borderColor: cardBorder }}
            >
              {/* ── Top Panel Header Bar ── */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-5" style={{ borderColor: cardBorder }}>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={handleClosePanel}
                    className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-orange-500 hover:text-orange-400 transition-colors mb-1"
                  >
                    <span>←</span>
                    <span>Back to Roadmap Trail</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-500 border border-orange-500/30">
                      {activeActivityType === 'flashcards' ? '🃏 Flashcards' :
                       activeActivityType === 'video' ? '🎥 Video Lecture' :
                       activeActivityType === 'dialogue' ? '🤖 AI Coaching' :
                       activeActivityType === 'quiz' ? '🎯 Evaluation Pass Gate' :
                       activeActivityType === 'task' ? '🛠️ Practical Mission' : '📖 Deep Dive Concept'}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      Tile 0{activeModule.order} of {allModules.length} • Unit {activeModule.level}
                    </span>
                    {activeModule.status === 'completed' ? (
                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        ✓ Completed
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30">
                        🎯 Active Mission
                      </span>
                    )}
                  </div>

                  <h2 className="text-xl sm:text-3xl font-black tracking-tight" style={{ color: textPrimary }}>
                    {activeModule.title}
                  </h2>
                  <p className="text-xs sm:text-sm font-medium" style={{ color: textMuted }}>
                    {activeModule.subtitle || activeModule.tagline || activeModule.description}
                  </p>
                </div>

                {/* Module XP Value & Duration */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="px-4 py-2 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-center">
                    <span className="text-base font-black text-orange-500 font-mono block">
                      +{activeModule.xpPoints} XP
                    </span>
                    <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-400">
                      Reward on Pass
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleClosePanel}
                    className="w-10 h-10 rounded-full border flex items-center justify-center text-sm font-bold transition-all hover:bg-orange-500/10"
                    style={{ borderColor: cardBorder, color: textMuted }}
                    title="Close Panel"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* ── 1. DEDICATED CONTENT: CONCEPT BITE (When tile is concept) ── */}
              {activeActivityType === 'concept' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div
                    className="p-5 sm:p-6 rounded-2xl border space-y-3"
                    style={{ background: panelBg, borderColor: cardBorder }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-orange-500 uppercase tracking-wider">
                        {activeModule.content?.readTime || activeModule.duration || '2 min read'} • Mental Model
                      </span>
                      <span className="text-xs font-mono font-bold" style={{ color: textMuted }}>
                        ⏱ {activeModule.duration}
                      </span>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold" style={{ color: textPrimary }}>
                      {activeModule.content?.title || activeModule.title}
                    </h3>

                    <p className="text-xs sm:text-sm leading-relaxed" style={{ color: textPrimary }}>
                      {activeModule.content?.summary || activeModule.description}
                    </p>

                    {/* Fun Analogy Box */}
                    {activeModule.content?.funAnalogy && (
                      <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/25 space-y-1">
                        <span className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-widest block">
                          💡 Fun Intuition & Mental Model
                        </span>
                        <p className="text-xs leading-relaxed italic text-orange-200">
                          &quot;{activeModule.content.funAnalogy}&quot;
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Key Takeaways Checklist */}
                  {activeModule.content?.keyTakeaways && activeModule.content.keyTakeaways.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold font-mono text-orange-500 uppercase tracking-wider">
                        Key Masterclass Takeaways
                      </h4>
                      <div className="space-y-2">
                        {activeModule.content.keyTakeaways.map((takeaway, tIdx) => (
                          <div
                            key={tIdx}
                            className="p-3.5 rounded-xl border flex items-start gap-3 text-xs leading-relaxed"
                            style={{ background: panelBg, borderColor: cardBorder, color: textPrimary }}
                          >
                            <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span>
                            <span>{takeaway}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Single-Click Complete & Return Button */}
                  <div className="pt-6 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: cardBorder }}>
                    <button
                      type="button"
                      onClick={handleClosePanel}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold border"
                      style={{ borderColor: cardBorder, color: textMuted }}
                    >
                      ← Back to Roadmap
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCompleteModule(activeModule.id)}
                      disabled={completing}
                      className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-gradient-to-r from-[#FF6B35] to-[#E85D2C] hover:brightness-110 active:scale-95 text-white shadow-xl shadow-orange-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {completing ? (
                        <span className="animate-pulse">Recording Progress & XP...</span>
                      ) : (
                        <>
                          <span>Complete Reading & Return to Roadmap (+{activeModule.xpPoints} XP)</span>
                          <span>→</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* ── 2. DEDICATED CONTENT: FLASHCARD DECK (When tile is flashcards) ── */}
              {activeActivityType === 'flashcards' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold" style={{ color: textPrimary }}>
                        Active Recall Flashcard Deck
                      </h3>
                      <p className="text-xs" style={{ color: textMuted }}>
                        Click card to flip between Question and Verified Answer.
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                      Card {currentFlashcardIndex + 1} of {activeModule.flashcards?.length || 1}
                    </span>
                  </div>

                  {activeModule.flashcards && activeModule.flashcards[currentFlashcardIndex] ? (
                    <div
                      onClick={() => setIsFlipped(!isFlipped)}
                      className="w-full min-h-[220px] rounded-3xl border p-8 flex flex-col items-center justify-center text-center cursor-pointer select-none transition-all duration-300 shadow-xl relative overflow-hidden group hover:border-orange-500/60"
                      style={{
                        background: isBright ? '#FAF4EE' : '#18110B',
                        borderColor: cardBorder,
                      }}
                    >
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-orange-500 mb-2">
                        {isFlipped ? '💡 VERIFIED ANSWER (CLICK TO FLIP BACK)' : '❓ TEST QUESTION (CLICK TO FLIP)'}
                      </span>

                      <h4 className="text-base sm:text-lg font-bold max-w-lg leading-relaxed" style={{ color: textPrimary }}>
                        {isFlipped
                          ? activeModule.flashcards[currentFlashcardIndex].answer
                          : activeModule.flashcards[currentFlashcardIndex].question}
                      </h4>
                    </div>
                  ) : (
                    <div className="p-8 rounded-2xl border text-center space-y-2" style={{ background: panelBg, borderColor: cardBorder }}>
                      <span className="text-4xl">🃏</span>
                      <p className="text-xs font-semibold" style={{ color: textPrimary }}>
                        Flashcard Practice Deck
                      </p>
                      <p className="text-xs" style={{ color: textMuted }}>
                        Complete this deck to solidify key vocabulary.
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      disabled={currentFlashcardIndex === 0}
                      onClick={() => {
                        setIsFlipped(false);
                        setCurrentFlashcardIndex((prev) => Math.max(0, prev - 1));
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-semibold border disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{ borderColor: cardBorder, color: textPrimary }}
                    >
                      ← Previous Card
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsFlipped(!isFlipped)}
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-orange-400 border border-orange-500/30"
                    >
                      {isFlipped ? 'Hide Answer' : 'Reveal Answer ↻'}
                    </button>

                    <button
                      type="button"
                      disabled={!activeModule.flashcards || currentFlashcardIndex >= activeModule.flashcards.length - 1}
                      onClick={() => {
                        setIsFlipped(false);
                        setCurrentFlashcardIndex((prev) => Math.min((activeModule.flashcards?.length || 1) - 1, prev + 1));
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-semibold border disabled:opacity-30 disabled:cursor-not-allowed"
                      style={{ borderColor: cardBorder, color: textPrimary }}
                    >
                      Next Card →
                    </button>
                  </div>

                  {/* Single-Click Complete & Return Button */}
                  <div className="pt-6 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: cardBorder }}>
                    <button
                      type="button"
                      onClick={handleClosePanel}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold border"
                      style={{ borderColor: cardBorder, color: textMuted }}
                    >
                      ← Back to Roadmap
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCompleteModule(activeModule.id)}
                      disabled={completing}
                      className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-gradient-to-r from-[#FF6B35] to-[#E85D2C] hover:brightness-110 active:scale-95 text-white shadow-xl shadow-orange-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {completing ? (
                        <span className="animate-pulse">Recording Progress & XP...</span>
                      ) : (
                        <>
                          <span>Finish Flashcards & Claim +{activeModule.xpPoints} XP</span>
                          <span>→</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* ── 3. DEDICATED CONTENT: VIDEO LECTURE (When tile is video) ── */}
              {activeActivityType === 'video' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold" style={{ color: textPrimary }}>
                      {activeModule.video?.title || activeModule.title}
                    </h3>
                    <p className="text-xs" style={{ color: textMuted }}>
                      Channel: <strong style={{ color: textPrimary }}>{activeModule.video?.channel || 'Mentora Visual Studio'}</strong> • Duration: {activeModule.video?.duration || activeModule.duration || '15 min'}
                    </p>
                  </div>

                  {activeModule.video?.youtubeId ? (
                    <div className="relative w-full rounded-2xl overflow-hidden aspect-video border bg-black shadow-2xl" style={{ borderColor: cardBorder }}>
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${activeModule.video.youtubeId}?rel=0&modestbranding=1`}
                        title={activeModule.video?.title || 'Lecture'}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    </div>
                  ) : (
                    <div className="p-8 rounded-2xl border text-center space-y-2" style={{ background: panelBg, borderColor: cardBorder }}>
                      <span className="text-4xl">🎥</span>
                      <p className="text-xs font-semibold" style={{ color: textPrimary }}>
                        Video Masterclass Companion
                      </p>
                      <p className="text-[11px]" style={{ color: textMuted }}>
                        {activeModule.video?.summary || 'Video companion notes and lecture breakdown.'}
                      </p>
                    </div>
                  )}

                  {activeModule.video?.summary && (
                    <div className="p-4 rounded-xl border space-y-1" style={{ background: panelBg, borderColor: cardBorder }}>
                      <span className="text-[10px] font-mono font-bold text-orange-400 uppercase tracking-widest block">
                        📝 Key Video Takeaways
                      </span>
                      <p className="text-xs leading-relaxed" style={{ color: textPrimary }}>
                        {activeModule.video.summary}
                      </p>
                    </div>
                  )}

                  {/* Single-Click Complete & Return Button */}
                  <div className="pt-6 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: cardBorder }}>
                    <button
                      type="button"
                      onClick={handleClosePanel}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold border"
                      style={{ borderColor: cardBorder, color: textMuted }}
                    >
                      ← Back to Roadmap
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCompleteModule(activeModule.id)}
                      disabled={completing}
                      className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-gradient-to-r from-[#FF6B35] to-[#E85D2C] hover:brightness-110 active:scale-95 text-white shadow-xl shadow-orange-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {completing ? (
                        <span className="animate-pulse">Recording Progress & XP...</span>
                      ) : (
                        <>
                          <span>Mark Video Watched & Claim +{activeModule.xpPoints} XP</span>
                          <span>→</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* ── 4. DEDICATED CONTENT: AI COACH BYTE (When tile is dialogue) ── */}
              {activeActivityType === 'dialogue' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="p-4 rounded-2xl border flex items-center gap-3.5" style={{ background: panelBg, borderColor: cardBorder }}>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-xl shadow-md">
                      {activeModule.dialogue?.mentorAvatar || '🤖'}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold" style={{ color: textPrimary }}>
                        {activeModule.dialogue?.mentorName || 'Byte the AI Coach'}
                      </h4>
                      <p className="text-xs" style={{ color: textMuted }}>
                        {activeModule.dialogue?.tagline || 'Clarifying mental models before the milestone evaluation!'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {activeModule.dialogue?.qaList?.map((qa, qaIdx) => (
                      <div
                        key={qaIdx}
                        className="p-4 rounded-2xl border space-y-2"
                        style={{ background: panelBg, borderColor: cardBorder }}
                      >
                        <div className="flex items-start gap-2.5">
                          <span className="text-xs font-bold text-orange-400 font-mono">Q:</span>
                          <span className="text-xs font-bold" style={{ color: textPrimary }}>{qa.question}</span>
                        </div>
                        <div className="flex items-start gap-2.5 pt-1 pl-4 border-l-2 border-orange-500/30">
                          <span className="text-xs leading-relaxed" style={{ color: textMuted }}>{qa.answer}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Single-Click Complete & Return Button */}
                  <div className="pt-6 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: cardBorder }}>
                    <button
                      type="button"
                      onClick={handleClosePanel}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold border"
                      style={{ borderColor: cardBorder, color: textMuted }}
                    >
                      ← Back to Roadmap
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCompleteModule(activeModule.id)}
                      disabled={completing}
                      className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-gradient-to-r from-[#FF6B35] to-[#E85D2C] hover:brightness-110 active:scale-95 text-white shadow-xl shadow-orange-500/25 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {completing ? (
                        <span className="animate-pulse">Recording Progress & XP...</span>
                      ) : (
                        <>
                          <span>Finish AI Coaching & Return to Roadmap (+{activeModule.xpPoints} XP)</span>
                          <span>→</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* ── 5. DEDICATED CONTENT: QUIZ PASS GATE (When tile is quiz) ── */}
              {activeActivityType === 'quiz' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  {/* Gate Criteria Banner */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-purple-900/20 to-transparent border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest block">
                        Milestone Gate Criterion
                      </span>
                      <h3 className="text-base font-bold text-white mt-0.5">
                        {activeModule.passGate?.quiz?.title || 'Knowledge Evaluation Gate'}
                      </h3>
                      <p className="text-xs text-purple-200/80 mt-1">
                        Passing Requirement: Score <strong className="text-white">≥ {activeModule.passGate?.quiz?.passingScore || 70}%</strong> to unlock next unit & claim +{activeModule.xpPoints} XP.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono text-xs font-black">
                        ⚡ +{activeModule.xpPoints} XP
                      </span>
                    </div>
                  </div>

                  {activeModule.passGate?.quiz && (
                    <div className="space-y-6">
                      {(activeModule.passGate.quiz.questions || []).map((q, qIdx) => (
                        <div
                          key={q.id}
                          className="p-5 rounded-2xl border space-y-3.5"
                          style={{ background: panelBg, borderColor: cardBorder }}
                        >
                          <div className="flex items-start gap-2.5">
                            <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                              {qIdx + 1}
                            </span>
                            <span className="font-semibold text-xs sm:text-sm" style={{ color: textPrimary }}>
                              {q.question}
                            </span>
                          </div>

                          {/* Options Grid */}
                          <div className="grid grid-cols-1 gap-2 pt-1">
                            {q.options.map((opt, optIdx) => {
                              const isSelected = quizAnswers[q.id] === optIdx;
                              const isCorrect = optIdx === q.correctAnswer;
                              const showOutcome = quizSubmitted;

                              let optStyle = 'border-white/10 hover:border-orange-500/50';
                              if (showOutcome) {
                                if (isCorrect) optStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                                else if (isSelected && !isCorrect) optStyle = 'bg-red-500/20 border-red-500 text-red-300';
                              } else if (isSelected) {
                                optStyle = 'bg-orange-500/15 border-orange-500 text-orange-400 font-bold';
                              }

                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  onClick={() => {
                                    if (!quizSubmitted) {
                                      setQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }));
                                    }
                                  }}
                                  className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center gap-3 ${optStyle}`}
                                  style={{
                                    background: (!showOutcome && !isSelected) ? (isBright ? '#FFFFFF' : '#1F1711') : undefined,
                                    color: (!showOutcome && !isSelected) ? textPrimary : undefined,
                                  }}
                                >
                                  <span className="w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-mono shrink-0">
                                    {String.fromCharCode(65 + optIdx)}
                                  </span>
                                  <span>{opt}</span>
                                </button>
                              );
                            })}
                          </div>

                          {quizSubmitted && q.funFact && (
                            <p className="text-[11px] font-mono text-purple-300 pt-1">
                              💡 <strong>Takeaway:</strong> {q.funFact}
                            </p>
                          )}
                        </div>
                      ))}

                      {quizSubmitted && (
                        <div
                          className={`p-5 rounded-2xl border text-center space-y-2 animate-in fade-in duration-200 ${
                            quizPassed
                              ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
                              : 'bg-red-950/60 border-red-500/60 text-red-200'
                          }`}
                        >
                          <div className="text-2xl font-black font-mono">
                            {quizPassed ? '🎉 GATE PASSED!' : '⚠️ SCORE BELOW PASS CRITERION'}
                          </div>
                          <p className="text-xs">
                            Your Score: <strong className="font-mono text-sm">{quizScore}%</strong> • Required: <strong>{activeModule.passGate?.quiz?.passingScore || 70}%</strong>
                          </p>
                          {!quizPassed && (
                            <button
                              type="button"
                              onClick={() => {
                                setQuizSubmitted(false);
                                setQuizAnswers({});
                              }}
                              className="mt-2 px-4 py-1.5 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-md"
                            >
                              Retry Evaluation ↺
                            </button>
                          )}
                        </div>
                      )}

                      {!quizSubmitted && (
                        <div className="flex justify-end pt-2">
                          <button
                            type="button"
                            onClick={handleVerifyQuiz}
                            disabled={Object.keys(quizAnswers).length < (activeModule.passGate?.quiz?.questions?.length || 0)}
                            className="px-6 py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed text-white shadow-lg shadow-purple-600/30 transition-all"
                          >
                            Verify Answers & Grade Pass Gate →
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Single-Click Complete & Return Button */}
                  <div className="pt-6 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: cardBorder }}>
                    <button
                      type="button"
                      onClick={handleClosePanel}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold border"
                      style={{ borderColor: cardBorder, color: textMuted }}
                    >
                      ← Back to Roadmap
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCompleteModule(activeModule.id)}
                      disabled={completing || !quizPassed}
                      className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:brightness-110 active:scale-95 text-white shadow-xl shadow-emerald-600/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {completing ? (
                        <span className="animate-pulse">Recording Progress & XP...</span>
                      ) : (
                        <>
                          <span>Pass Gate & Return to Roadmap (+{activeModule.xpPoints} XP)</span>
                          <span>→</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* ── 6. DEDICATED CONTENT: PRACTICAL MISSION TASK ── */}
              {activeActivityType === 'task' && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="p-5 rounded-2xl border space-y-3" style={{ background: panelBg, borderColor: cardBorder }}>
                    <h4 className="text-xs font-mono font-bold text-orange-500 uppercase tracking-wider">
                      Mission Instructions & Deliverables
                    </h4>
                    <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line" style={{ color: textPrimary }}>
                      {activeModule.passGate?.task?.instructions || activeModule.description}
                    </p>
                  </div>

                  {activeModule.passGate?.task?.checklist && activeModule.passGate.task.checklist.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-xs font-mono font-bold text-zinc-400 block">
                        Milestone Verification Checklist:
                      </span>
                      {(activeModule.passGate.task.checklist || []).map((chk, cIdx) => (
                        <label
                          key={cIdx}
                          className="p-3.5 rounded-xl border flex items-center gap-3 text-xs cursor-pointer select-none"
                          style={{ background: panelBg, borderColor: cardBorder, color: textPrimary }}
                        >
                          <input
                            type="checkbox"
                            checked={!!taskChecklist[cIdx]}
                            onChange={(e) => {
                              setTaskChecklist((prev) => ({ ...prev, [cIdx]: e.target.checked }));
                            }}
                            className="w-4 h-4 rounded text-orange-500 accent-orange-500"
                          />
                          <span className={taskChecklist[cIdx] ? 'line-through opacity-60' : ''}>
                            {chk}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}

                  {/* Single-Click Complete & Return Button */}
                  <div className="pt-6 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: cardBorder }}>
                    <button
                      type="button"
                      onClick={handleClosePanel}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold border"
                      style={{ borderColor: cardBorder, color: textMuted }}
                    >
                      ← Back to Roadmap
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCompleteModule(activeModule.id)}
                      disabled={completing}
                      className="px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:brightness-110 active:scale-95 text-white shadow-xl shadow-emerald-600/25 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                    >
                      {completing ? (
                        <span className="animate-pulse">Recording Progress & XP...</span>
                      ) : (
                        <>
                          <span>Complete Task & Return to Roadmap (+{activeModule.xpPoints} XP)</span>
                          <span>→</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </main>

      {/* ── GUIDEBOOK MODAL (From Section Header Banner) ── */}
      {guidebookLevel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg rounded-3xl border p-6 sm:p-8 space-y-5 shadow-2xl relative max-h-[85vh] overflow-y-auto"
            style={{ background: cardBg, borderColor: cardBorder }}
          >
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: cardBorder }}>
              <div>
                <span className="text-[10px] font-mono font-bold text-orange-500 uppercase tracking-widest">
                  Unit {guidebookLevel.level} Cheatsheet
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {guidebookLevel.name} Guidebook
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setGuidebookLevel(null)}
                className="w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold"
                style={{ borderColor: cardBorder, color: textMuted }}
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs leading-relaxed" style={{ color: textPrimary }}>
              <p style={{ color: textMuted }}>
                {guidebookLevel.description || 'Key architectural patterns, interview talking points, and verification notes for this unit.'}
              </p>

              <div className="space-y-3">
                {guidebookLevel.modules.map((m, mIdx) => (
                  <div key={m.id} className="p-4 rounded-2xl border space-y-1.5" style={{ background: panelBg, borderColor: cardBorder }}>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-orange-400">0{mIdx + 1}. {m.title}</h4>
                      <span className="text-[10px] font-mono text-zinc-400">{m.duration}</span>
                    </div>
                    <p style={{ color: textMuted }}>{m.content?.summary || m.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t" style={{ borderColor: cardBorder }}>
              <button
                type="button"
                onClick={() => setGuidebookLevel(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#FF6B35] text-white shadow-md hover:brightness-110"
              >
                Got It ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TREASURE CHEST BONUS XP CLAIM MODAL ── */}
      {chestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in zoom-in-95 duration-200">
          <div
            className="w-full max-w-sm rounded-3xl border p-6 sm:p-8 space-y-4 text-center shadow-2xl relative"
            style={{ background: cardBg, borderColor: cardBorder }}
          >
            <div className="text-5xl animate-bounce">🎁</div>
            <h3 className="text-xl font-black text-white">Treasure Unlocked!</h3>
            <p className="text-xs" style={{ color: textMuted }}>
              You uncovered an architectural milestone loot chest on your trail.
            </p>

            <div className="py-3 px-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono font-black text-lg">
              +{chestModalOpen.xp} Bonus XP
            </div>

            <button
              type="button"
              onClick={() => setChestModalOpen(null)}
              className="w-full py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30 hover:brightness-110 active:scale-95 transition-all"
            >
              Claim & Return to Trail →
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
