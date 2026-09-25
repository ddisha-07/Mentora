'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import {
  CAREER_ROLES_DATASET,
  calculateSkillGap,
  getRequiredSkillsForGoal,
} from '@/lib/career/careerRolesDataset';
import {
  getSuggestedCourseForSpecificSkill,
  recommendCoursesForSkillGap,
} from '@/lib/career/courseRecommendationMatcher';
import { CourseRecommendation } from '@/app/api/analyze-profile/route';

interface SkillGapNode {
  id: string;
  skill: string;
  level: number;
  levelName: string;
  urgency: 'High' | 'Medium' | 'Foundational';
  impact: string;
  status: 'to_bridge' | 'in_progress' | 'mastered';
  suggestedCourse: CourseRecommendation;
  stepNumber: number;
}

// S-curve horizontal offsets for winding ribbon roadmap
const S_CURVE_OFFSETS = [0, 80, 110, 60, 0, -60, -110, -80];
const TRAIL_WIDTH = 420;
const TRAIL_CX = TRAIL_WIDTH / 2;
const ROW_SPACING = 140;

export default function SkillGapRoadmapPage() {
  const router = useRouter();
  const { isBright } = useTheme();

  // State from analysis or defaults
  const [futureGoal, setFutureGoal] = useState<string>('Data Scientist');
  const [possessedSkills, setPossessedSkills] = useState<string[]>(['Python', 'SQL']);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);
  const [currentLevel, setCurrentLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [loaded, setLoaded] = useState(false);

  // Selected skill gap modal state
  const [activeGapNode, setActiveGapNode] = useState<SkillGapNode | null>(null);

  // Theme tokens
  const bgPage = isBright ? '#FFF8F0' : '#0B0907';
  const cardBg = isBright ? '#FFFFFF' : '#140E0A';
  const cardBorder = isBright ? 'rgba(234,88,12,0.16)' : 'rgba(255,107,53,0.18)';
  const textPrimary = isBright ? '#1C1917' : '#FFF8F0';
  const textMuted = isBright ? '#78716C' : 'rgba(255,248,240,0.55)';
  const panelBg = isBright ? '#FAF4EE' : '#18120D';

  // Load identified skill gaps from localStorage or synthesize from 50-role dataset
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem('mentora_career_analysis');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.futureGoal) setFutureGoal(parsed.futureGoal);
          if (Array.isArray(parsed.possessedSkills)) setPossessedSkills(parsed.possessedSkills);
          if (Array.isArray(parsed.missingSkills) && parsed.missingSkills.length > 0) {
            setMissingSkills(parsed.missingSkills);
          } else {
            const gap = calculateSkillGap(parsed.possessedSkills || [], parsed.futureGoal || 'Data Scientist');
            setMissingSkills(gap.missingSkills);
          }
          if (parsed.currentLevel) setCurrentLevel(parsed.currentLevel);
        } else {
          // Default initial gaps for Data Scientist
          const gap = calculateSkillGap(['Python', 'SQL'], 'Data Scientist');
          setMissingSkills(gap.missingSkills);
        }
      } catch (e) {
        console.warn('Failed to load career analysis:', e);
      } finally {
        setLoaded(true);
      }
    }
  }, []);

  // When futureGoal changes, recalculate gaps if not loaded from saved analysis
  const handleSwitchGoal = (newGoal: string) => {
    setFutureGoal(newGoal);
    const gap = calculateSkillGap(possessedSkills, newGoal);
    setMissingSkills(gap.missingSkills.length > 0 ? gap.missingSkills : ['System Design', 'Production Deployment', 'Optimization']);
  };

  // Build structured skill gap roadmap nodes organized by 3 levels
  const skillGapNodes: SkillGapNode[] = useMemo(() => {
    const rawGaps = missingSkills.length > 0
      ? missingSkills
      : ['Statistics', 'Machine Learning', 'Data Visualization', 'Model Validation'];

    return rawGaps.map((skill, index) => {
      // Distribute evenly across 3 progression levels
      const level = (index % 3) + 1;
      const levelName =
        level === 1
          ? 'Foundational Prerequisites'
          : level === 2
          ? 'Core Engineering & Implementation'
          : 'Advanced Architecture & Production Mastery';

      const urgency: 'High' | 'Medium' | 'Foundational' =
        level === 1 ? 'High' : level === 2 ? 'High' : 'Medium';

      const suggestedCourse = getSuggestedCourseForSpecificSkill(skill, futureGoal, currentLevel);

      return {
        id: `gap_${index + 1}_${skill.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
        skill,
        level,
        levelName,
        urgency,
        impact: `Crucial competency required for technical assessments and real-world responsibilities as a ${futureGoal}.`,
        status: index === 0 ? 'in_progress' : 'to_bridge',
        suggestedCourse,
        stepNumber: index + 1,
      };
    });
  }, [missingSkills, futureGoal, currentLevel]);

  // Group nodes by levels
  const levelGroups = useMemo(() => {
    const map = new Map<number, SkillGapNode[]>();
    skillGapNodes.forEach((node) => {
      const list = map.get(node.level) || [];
      list.push(node);
      map.set(node.level, list);
    });
    return Array.from(map.entries()).map(([lvl, nodes]) => ({
      level: lvl,
      name:
        lvl === 1
          ? 'Level 1: Foundational Prerequisites'
          : lvl === 2
          ? 'Level 2: Core Engineering & Systems'
          : 'Level 3: Production & Specialization',
      description:
        lvl === 1
          ? 'Essential syntax, math foundations, and core tools required before advanced development.'
          : lvl === 2
          ? 'Practical application logic, data transformations, and architectural frameworks.'
          : lvl === 3
          ? 'Enterprise reliability, system scaling, and high-performance evaluation gates.'
          : '',
      nodes,
    }));
  }, [skillGapNodes]);

  return (
    <div
      id="skill-gap-roadmap-page"
      className="min-h-screen flex"
      style={{ background: bgPage, fontFamily: 'var(--font-geist-sans), sans-serif' }}
    >
      <DashboardSidebar />

      <main className="flex-1 ml-[76px] lg:ml-[84px] min-h-screen overflow-y-auto px-4 sm:px-6 lg:px-10 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Breadcrumb & Navigation */}
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/dashboard/journeys"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold text-orange-500 hover:text-orange-400 transition-colors"
            >
              <span>← Back to Learning Journeys</span>
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-stone-400">Target Role:</span>
              <select
                value={futureGoal}
                onChange={(e) => handleSwitchGoal(e.target.value)}
                className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold border transition-all outline-none"
                style={{ background: cardBg, borderColor: cardBorder, color: textPrimary }}
              >
                {CAREER_ROLES_DATASET.slice(0, 15).map((r) => (
                  <option key={r.srNo} value={r.futureGoal}>
                    {r.futureGoal}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Header Banner */}
          <div
            className="p-6 sm:p-8 rounded-3xl border shadow-xl relative overflow-hidden transition-all"
            style={{
              background: isBright
                ? 'linear-gradient(135deg, #FFF5EB 0%, #FFFFFF 60%)'
                : 'linear-gradient(135deg, #1C1109 0%, #120A05 60%)',
              borderColor: cardBorder,
            }}
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-500/15 via-amber-500/10 to-transparent blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div>
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight" style={{ color: textPrimary }}>
                  Bridging Your Path to {futureGoal}
                </h1>
                <p className="text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed" style={{ color: textMuted }}>
                  We compared your acquired skills against industry prerequisites from our 50-role dataset.
                  Click on any identified skill gap below to view its precise diagnosis and open the exact course designed to bridge it.
                </p>
              </div>

              {/* Skills summary ribbon */}
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span style={{ color: textMuted }}>Acquired Skills:</span>
                  <span className="font-bold text-emerald-500">
                    {possessedSkills.length} ({possessedSkills.slice(0, 3).join(', ')}{possessedSkills.length > 3 ? '...' : ''})
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
                  <span style={{ color: textMuted }}>Gaps Identified:</span>
                  <span className="font-bold text-orange-500">{skillGapNodes.length} Competencies to Master</span>
                </div>
              </div>
            </div>
          </div>

          {/* Level by Level Skill Gap Winding Roadmaps */}
          <div className="space-y-12 pb-16">
            {levelGroups.map((group, groupIdx) => (
              <div key={group.level} className="space-y-6">
                
                {/* Level Header Banner */}
                <div
                  className="p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md"
                  style={{
                    background: cardBg,
                    borderColor: 'rgba(255,107,53,0.3)',
                  }}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-orange-500/10 text-orange-500 border border-orange-500/20">
                        STAGE {group.level}
                      </span>
                      <h2 className="text-base sm:text-lg font-bold" style={{ color: textPrimary }}>
                        {group.name}
                      </h2>
                    </div>
                    <p className="text-xs" style={{ color: textMuted }}>
                      {group.description}
                    </p>
                  </div>
                  <div className="shrink-0 text-xs font-mono font-bold text-orange-500">
                    {group.nodes.length} {group.nodes.length === 1 ? 'Gap' : 'Gaps'} in this Level
                  </div>
                </div>

                {/* S-Curve Stepping Stones Visualization */}
                <div className="relative flex flex-col items-center py-6 overflow-hidden">
                  
                  {/* Winding Trail SVG Connector */}
                  <svg
                    className="absolute top-0 pointer-events-none"
                    style={{
                      width: TRAIL_WIDTH,
                      height: group.nodes.length * ROW_SPACING + 40,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      overflow: 'visible',
                    }}
                  >
                    <defs>
                      <linearGradient id={`trailGrad-${group.level}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#FFAA00" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#FF6B35" stopOpacity="0.8" />
                      </linearGradient>
                      <filter id={`glow-${group.level}`} x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* S-curve path connecting all nodes in this level */}
                    {group.nodes.map((node, i) => {
                      if (i === group.nodes.length - 1) return null;
                      const x1 = TRAIL_CX + S_CURVE_OFFSETS[i % S_CURVE_OFFSETS.length];
                      const y1 = i * ROW_SPACING + 40;
                      const x2 = TRAIL_CX + S_CURVE_OFFSETS[(i + 1) % S_CURVE_OFFSETS.length];
                      const y2 = (i + 1) * ROW_SPACING + 40;
                      const cy1 = y1 + (y2 - y1) * 0.55;
                      const cy2 = y1 + (y2 - y1) * 0.45;
                      const d = `M ${x1} ${y1} C ${x1} ${cy1}, ${x2} ${cy2}, ${x2} ${y2}`;

                      return (
                        <g key={i}>
                          <path
                            d={d}
                            fill="none"
                            stroke={isBright ? 'rgba(255,107,53,0.18)' : 'rgba(255,107,53,0.12)'}
                            strokeWidth="14"
                            strokeLinecap="round"
                          />
                          <path
                            d={d}
                            fill="none"
                            stroke={`url(#trailGrad-${group.level})`}
                            strokeWidth="5"
                            strokeDasharray="9 6"
                            strokeLinecap="round"
                            filter={`url(#glow-${group.level})`}
                          />
                        </g>
                      );
                    })}
                  </svg>

                  {/* Nodes along the trail */}
                  <div
                    className="relative flex flex-col items-center"
                    style={{
                      width: TRAIL_WIDTH,
                      gap: ROW_SPACING - 80, // Accounts for node height
                    }}
                  >
                    {group.nodes.map((node, nodeIdx) => {
                      const offset = S_CURVE_OFFSETS[nodeIdx % S_CURVE_OFFSETS.length];
                      const isHigh = node.urgency === 'High';

                      return (
                        <div
                          key={node.id}
                          className="relative flex flex-col items-center"
                          style={{
                            transform: `translateX(${offset}px)`,
                            transition: 'transform 0.3s ease',
                          }}
                        >
                          {/* The Stepping Stone Button */}
                          <button
                            type="button"
                            onClick={() => setActiveGapNode(node)}
                            className="group relative w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-300 active:scale-95 cursor-pointer shadow-xl"
                            style={{
                              background: isBright
                                ? 'linear-gradient(135deg, #FFFFFF 0%, #FFF3EA 100%)'
                                : 'linear-gradient(135deg, #24140A 0%, #150C06 100%)',
                              border: isHigh
                                ? '2px solid rgba(255,107,53,0.8)'
                                : '2px solid rgba(255,170,0,0.5)',
                              boxShadow: isHigh
                                ? '0 10px 25px -5px rgba(255,107,53,0.35)'
                                : '0 8px 20px -5px rgba(255,170,0,0.2)',
                            }}
                          >
                            {/* Pulsing Aura */}
                            <span className="absolute -inset-1 rounded-3xl bg-orange-500/20 blur-sm group-hover:bg-orange-500/40 transition-all pointer-events-none" />

                            {/* Stone Step Number */}
                            <span className="text-xl font-black font-mono relative z-10 text-orange-500 group-hover:scale-110 transition-transform">
                              {String(node.stepNumber).padStart(2, '0')}
                            </span>

                            {/* Urgency Badge */}
                            <span
                              className={`absolute -top-2.5 px-2 py-0.5 rounded-full text-[9px] font-mono font-extrabold uppercase border shadow-md ${
                                isHigh
                                  ? 'bg-[#FF6B35] text-white border-orange-400'
                                  : 'bg-amber-500 text-black border-amber-300'
                              }`}
                            >
                              {node.urgency}
                            </span>
                          </button>

                          {/* Descriptive Title Plate below Stone */}
                          <div
                            onClick={() => setActiveGapNode(node)}
                            className="mt-2.5 px-3 py-1.5 rounded-xl border text-center cursor-pointer transition-all hover:border-orange-500 max-w-[210px] shadow-sm"
                            style={{ background: cardBg, borderColor: cardBorder }}
                          >
                            <p className="text-xs font-bold truncate" style={{ color: textPrimary }}>
                              {node.skill}
                            </p>
                            <p className="text-[10px] font-mono text-orange-500 font-semibold mt-0.5">
                              Click for Course & Fix →
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* Skill Gap Detail & Precise Course Suggestion Modal */}
      {/* ========================================================================= */}
      {activeGapNode && (
        <div
          id="skill-gap-modal-backdrop"
          className="fixed inset-0 z-50 backdrop-blur-md bg-black/60 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveGapNode(null)}
        >
          <div
            className="w-full max-w-xl rounded-3xl border shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden animate-in zoom-in-95 duration-200"
            style={{ background: cardBg, borderColor: cardBorder }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Ambient Corner Glow */}
            <div className="absolute top-0 right-0 w-60 h-60 bg-gradient-to-bl from-orange-500/20 via-amber-500/10 to-transparent blur-2xl pointer-events-none" />

            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-[#FF6B35] border border-orange-500/30">
                    STEP {String(activeGapNode.stepNumber).padStart(2, '0')}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full font-bold bg-orange-500/15 text-orange-500 border border-orange-500/30">
                    IDENTIFIED SKILL GAP
                  </span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500">
                    {activeGapNode.levelName}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black" style={{ color: textPrimary }}>
                  {activeGapNode.skill}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveGapNode(null)}
                className="w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold text-stone-400 hover:text-white transition-colors"
                style={{ borderColor: cardBorder }}
              >
                ✕
              </button>
            </div>

            {/* Gap Diagnosis */}
            <div
              className="p-4 rounded-2xl border space-y-2 text-xs"
              style={{ background: panelBg, borderColor: cardBorder }}
            >
              <div className="flex items-center justify-between font-mono text-[11px] font-semibold text-orange-500">
                <span>Target Career Alignment</span>
                <span>Urgency: {activeGapNode.urgency}</span>
              </div>
              <p className="leading-relaxed" style={{ color: textMuted }}>
                Mastering <span className="font-bold underline" style={{ color: textPrimary }}>{activeGapNode.skill}</span> is an essential requirement for advancing towards your goal as a <span className="font-bold" style={{ color: textPrimary }}>{futureGoal}</span>. {activeGapNode.impact}
              </p>
            </div>

            {/* Tailored Suggested Course Box */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono font-bold text-orange-500">
                <span>RECOMMENDED COURSE TO BRIDGE THIS GAP</span>
                <span>{activeGapNode.suggestedCourse.matchScore}% Match</span>
              </div>

              <div
                className="p-5 rounded-2xl border space-y-4 shadow-lg transition-all"
                style={{
                  background: isBright
                    ? 'linear-gradient(135deg, #FFF9F3 0%, #FFFFFF 100%)'
                    : 'linear-gradient(135deg, #1C120B 0%, #130D08 100%)',
                  borderColor: 'rgba(255,107,53,0.35)',
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-orange-500/10 text-orange-500">
                      {activeGapNode.suggestedCourse.category}
                    </span>
                    <h4 className="text-base font-extrabold" style={{ color: textPrimary }}>
                      {activeGapNode.suggestedCourse.title}
                    </h4>
                    <p className="text-xs leading-relaxed" style={{ color: textMuted }}>
                      {activeGapNode.suggestedCourse.reason}
                    </p>
                  </div>
                  <div className="w-10 h-10 shrink-0 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>

                {/* Key Topics / Modules in Course */}
                <div className="pt-2 border-t border-orange-500/10 space-y-2">
                  <span className="text-[11px] font-mono font-semibold" style={{ color: textMuted }}>
                    Key Focus Topics:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeGapNode.suggestedCourse.keyTopics?.map((topic, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded-md font-mono border"
                        style={{ background: cardBg, borderColor: cardBorder, color: textPrimary }}
                      >
                        ✓ {topic}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Duration & Level Meta */}
                <div className="flex items-center justify-between text-[11px] font-mono pt-1 text-stone-400">
                  <span>Duration: {activeGapNode.suggestedCourse.duration}</span>
                  <span>Tier: {activeGapNode.suggestedCourse.level}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons: Open Course on Specified Page */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link
                href={`/dashboard/journeys/${activeGapNode.suggestedCourse.id}`}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl font-bold text-xs font-mono uppercase tracking-wider text-white text-center shadow-xl transition-all active:scale-95 bg-gradient-to-r from-[#FF6B35] to-[#E85D2C] hover:brightness-110 shadow-orange-500/30"
              >
                Open Course on Roadmap →
              </Link>
              <Link
                href={`/dashboard/courses?courseId=${activeGapNode.suggestedCourse.id}`}
                className="w-full sm:w-auto py-3.5 px-5 rounded-2xl font-bold text-xs font-mono border text-center transition-all hover:bg-orange-500/10 active:scale-95"
                style={{ borderColor: cardBorder, color: textPrimary }}
              >
                View in Catalog
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
