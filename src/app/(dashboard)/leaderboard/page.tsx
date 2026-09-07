'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface LeaderboardUser {
  rank: number;
  userId: string;
  name: string;
  email: string;
  targetRole: string;
  experienceLevel: string;
  totalPoints: number;
  activitiesCount: number;
  badge: string;
  lastEarnedAt: string | null;
  isCurrentUser: boolean;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
}

interface QuizData {
  id: string;
  title: string;
  description: string;
  passingScore: number;
  rewardPoints: number;
  questions: QuizQuestion[];
  totalQuestions: number;
}

interface AnswerBreakdownItem {
  questionId: string;
  selectedAnswer: number | undefined;
  correctAnswer: number;
  isCorrect: boolean;
}

interface QuizResult {
  attemptId: string;
  score: number;
  maxScore: number;
  percentage: number;
  passingScore: number;
  passed: boolean;
  pointsAwarded: number;
  message: string;
  answerBreakdown: AnswerBreakdownItem[];
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<LeaderboardUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'engineer' | 'product'>('all');

  // Quiz Modal State
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/leaderboard');
      if (!res.ok) throw new Error('Failed to fetch leaderboard');
      const data = await res.json();
      setLeaderboard(data.leaderboard || []);
      setCurrentUserRank(data.currentUserRank || null);
    } catch (err: any) {
      setError(err.message || 'Error loading leaderboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const openQuizModal = async () => {
    setQuizModalOpen(true);
    setQuizResult(null);
    setSelectedAnswers({});
    try {
      setQuizLoading(true);
      const res = await fetch('/api/quizzes/demo');
      if (!res.ok) throw new Error('Failed to load quiz');
      const data = await res.json();
      setQuizData(data);
    } catch (err: any) {
      alert(err.message || 'Could not load quiz questions');
    } finally {
      setQuizLoading(false);
    }
  };

  const handleOptionSelect = (questionId: string, optionIndex: number) => {
    if (quizResult) return; // Prevent change after submit
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmitQuiz = async () => {
    if (!quizData) return;
    const answeredCount = Object.keys(selectedAnswers).length;
    if (answeredCount < quizData.questions.length) {
      const confirmSubmit = window.confirm(
        `You have answered ${answeredCount} of ${quizData.questions.length} questions. Submit anyway?`
      );
      if (!confirmSubmit) return;
    }

    try {
      setSubmittingQuiz(true);
      const res = await fetch(`/api/quizzes/${quizData.id}/attempt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: selectedAnswers }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || 'Failed to submit quiz attempt');
      }

      const result: QuizResult = await res.json();
      setQuizResult(result);

      if (result.passed) {
        setNotification(
          `🎉 Score ${result.percentage}%! Awarded +${result.pointsAwarded} points on the Leaderboard!`
        );
        setTimeout(() => setNotification(null), 6000);
        // Refresh leaderboard to show updated user points and position
        await fetchLeaderboard();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to submit quiz');
    } finally {
      setSubmittingQuiz(false);
    }
  };

  // Filtered Leaderboard
  const filteredLeaderboard = leaderboard.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.targetRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (roleFilter === 'engineer') {
      return (
        user.targetRole.toLowerCase().includes('engineer') ||
        user.targetRole.toLowerCase().includes('developer') ||
        user.targetRole.toLowerCase().includes('architect')
      );
    }
    if (roleFilter === 'product') {
      return (
        user.targetRole.toLowerCase().includes('product') ||
        user.targetRole.toLowerCase().includes('lead') ||
        user.targetRole.toLowerCase().includes('manager')
      );
    }
    return true;
  });

  const top3 = leaderboard.slice(0, 3);
  const remainingUsers = filteredLeaderboard.slice(top3.length > 0 ? 3 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white p-4 sm:p-6 md:p-10 selection:bg-amber-500 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
              >
                ← Back to Dashboard
              </Link>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-medium text-slate-400">Global Standings</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>🏆</span> Learner Leaderboard
            </h1>
            <p className="text-sm text-slate-400 max-w-2xl">
              Track real-time rankings across skill assessments, quiz completions (≥70% required), and milestone achievements.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={fetchLeaderboard}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              <span className={loading ? 'animate-spin' : ''}>🔄</span> Refresh
            </button>
            <button
              onClick={openQuizModal}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-black font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>⚡ Take Skill Quiz (+100 pts)</span>
            </button>
          </div>
        </div>

        {/* Floating Toast Notification */}
        {notification && (
          <div className="p-4 rounded-xl bg-amber-950/90 border border-amber-500/60 text-amber-200 text-sm font-medium shadow-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-300">
            <span className="flex items-center gap-2">{notification}</span>
            <button
              onClick={() => setNotification(null)}
              className="text-amber-400 hover:text-white font-bold ml-4"
            >
              ✕
            </button>
          </div>
        )}

        {/* Current User Spotlight Banner */}
        {currentUserRank && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900/90 to-amber-950/50 border border-indigo-500/30 p-5 sm:p-6 shadow-2xl">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-44 h-44 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-400/50 flex items-center justify-center text-2xl font-black text-indigo-300">
                  #{currentUserRank.rank}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-mono tracking-wider text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800">
                      Your Position
                    </span>
                    <span className="text-xs text-amber-300 font-semibold">{currentUserRank.badge}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">{currentUserRank.name}</h3>
                  <p className="text-xs text-slate-400">
                    Target Role: <span className="text-slate-200">{currentUserRank.targetRole}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 sm:gap-10 border-t md:border-t-0 border-slate-800/80 pt-4 md:pt-0">
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold">Total Points</span>
                  <div className="text-2xl font-black text-amber-400">
                    {currentUserRank.totalPoints.toLocaleString()} <span className="text-xs font-normal text-slate-400">pts</span>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase font-semibold">Activities</span>
                  <div className="text-2xl font-black text-white">{currentUserRank.activitiesCount}</div>
                </div>
                <button
                  onClick={openQuizModal}
                  className="hidden sm:inline-flex px-4 py-2 text-xs font-bold rounded-lg bg-indigo-600/40 hover:bg-indigo-600/70 border border-indigo-400/40 text-indigo-200 transition-colors"
                >
                  Climb Ranks →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20 space-y-4">
            <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-slate-400">Calculating real-time participant scores...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-6 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-sm">
            <p className="font-semibold">Error loading leaderboard</p>
            <p className="mt-1">{error}</p>
            <button
              onClick={fetchLeaderboard}
              className="mt-4 px-4 py-2 bg-rose-800 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {/* Top 3 Podium Visual Showcase */}
        {!loading && !error && top3.length >= 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                <span>👑</span> Podium Leaders
              </h2>
              <span className="text-xs text-slate-500 font-mono">LIVE SCORES</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4">
              {/* #2 Silver (Alex Rivera) */}
              <div className="order-2 md:order-1 p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-400/30 shadow-xl relative overflow-hidden group hover:border-slate-300/50 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-slate-300">#2</span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    🥈 Silver
                  </span>
                </div>
                <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-400 flex items-center justify-center text-xl font-bold text-slate-200 mx-auto mb-3 shadow-inner">
                  {top3[1].name.slice(0, 2).toUpperCase()}
                </div>
                <div className="text-center space-y-1">
                  <h3 className="font-bold text-white text-base truncate flex items-center justify-center gap-1.5">
                    {top3[1].name}
                    {top3[1].isCurrentUser && (
                      <span className="text-[10px] bg-indigo-500 text-white px-1.5 py-0.5 rounded font-bold">YOU</span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400 truncate">{top3[1].targetRole}</p>
                  <div className="pt-3">
                    <span className="text-2xl font-black text-slate-200">{top3[1].totalPoints.toLocaleString()}</span>
                    <span className="text-xs text-slate-400 ml-1">pts</span>
                  </div>
                  <div className="text-[11px] text-slate-500">{top3[1].activitiesCount} completions</div>
                </div>
              </div>

              {/* #1 Gold (Sarah Chen) */}
              <div className="order-1 md:order-2 p-7 rounded-2xl bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950 border-2 border-amber-500/70 shadow-2xl shadow-amber-950/40 relative overflow-hidden transform md:-translate-y-4 hover:border-amber-400 transition-all">
                <div className="absolute top-0 right-0 bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-bl-xl">
                  CHAMPION
                </div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-black text-amber-400">#1</span>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-600/80 flex items-center gap-1">
                    👑 Grandmaster
                  </span>
                </div>
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-600 to-yellow-400 border-4 border-amber-300 flex items-center justify-center text-2xl font-black text-slate-950 mx-auto mb-3 shadow-lg shadow-amber-500/30">
                  {top3[0].name.slice(0, 2).toUpperCase()}
                </div>
                <div className="text-center space-y-1">
                  <h3 className="font-extrabold text-white text-lg truncate flex items-center justify-center gap-1.5">
                    {top3[0].name}
                    {top3[0].isCurrentUser && (
                      <span className="text-[10px] bg-indigo-500 text-white px-1.5 py-0.5 rounded font-bold">YOU</span>
                    )}
                  </h3>
                  <p className="text-xs text-amber-200/80 font-medium truncate">{top3[0].targetRole}</p>
                  <div className="pt-3">
                    <span className="text-3xl font-black text-amber-400">{top3[0].totalPoints.toLocaleString()}</span>
                    <span className="text-xs text-amber-200/80 ml-1 font-bold">pts</span>
                  </div>
                  <div className="text-xs text-slate-400">{top3[0].activitiesCount} completions</div>
                </div>
              </div>

              {/* #3 Bronze (Priya Sharma) */}
              <div className="order-3 p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-700/40 shadow-xl relative overflow-hidden group hover:border-amber-600/60 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-amber-600">#3</span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-950/60 text-amber-400 border border-amber-800/80">
                    🥉 Bronze
                  </span>
                </div>
                <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-amber-700 flex items-center justify-center text-xl font-bold text-amber-400 mx-auto mb-3 shadow-inner">
                  {top3[2].name.slice(0, 2).toUpperCase()}
                </div>
                <div className="text-center space-y-1">
                  <h3 className="font-bold text-white text-base truncate flex items-center justify-center gap-1.5">
                    {top3[2].name}
                    {top3[2].isCurrentUser && (
                      <span className="text-[10px] bg-indigo-500 text-white px-1.5 py-0.5 rounded font-bold">YOU</span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400 truncate">{top3[2].targetRole}</p>
                  <div className="pt-3">
                    <span className="text-2xl font-black text-amber-400">{top3[2].totalPoints.toLocaleString()}</span>
                    <span className="text-xs text-slate-400 ml-1">pts</span>
                  </div>
                  <div className="text-[11px] text-slate-500">{top3[2].activitiesCount} completions</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter & Search Bar */}
        {!loading && !error && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            {/* Search Input */}
            <div className="w-full sm:w-80 relative">
              <input
                type="text"
                placeholder="Search by learner name or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <span className="absolute left-3 top-2.5 text-slate-500 text-xs">🔍</span>
            </div>

            {/* Role Filter Tabs */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => setRoleFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  roleFilter === 'all'
                    ? 'bg-amber-500 text-black font-bold'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                All Learners
              </button>
              <button
                onClick={() => setRoleFilter('engineer')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  roleFilter === 'engineer'
                    ? 'bg-amber-500 text-black font-bold'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                Engineering
              </button>
              <button
                onClick={() => setRoleFilter('product')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  roleFilter === 'product'
                    ? 'bg-amber-500 text-black font-bold'
                    : 'bg-slate-800/80 text-slate-400 hover:text-white'
                }`}
              >
                Product & Leads
              </button>
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        {!loading && !error && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
              <h2 className="font-bold text-white text-base">All Participants ({filteredLeaderboard.length})</h2>
              <span className="text-xs text-slate-400">Qualifying Quiz Threshold: 70%</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400 bg-slate-950/50">
                    <th className="py-3.5 px-4 sm:px-6 w-16">Rank</th>
                    <th className="py-3.5 px-4 sm:px-6">Learner</th>
                    <th className="py-3.5 px-4 sm:px-6">Target Role</th>
                    <th className="py-3.5 px-4 sm:px-6">Tier Badge</th>
                    <th className="py-3.5 px-4 sm:px-6 text-center">Activities</th>
                    <th className="py-3.5 px-4 sm:px-6 text-right">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-xs">
                  {filteredLeaderboard.map((user) => {
                    const isTop1 = user.rank === 1;
                    const isTop2 = user.rank === 2;
                    const isTop3 = user.rank === 3;

                    return (
                      <tr
                        key={user.userId}
                        className={`transition-colors hover:bg-slate-850/60 ${
                          user.isCurrentUser ? 'bg-indigo-950/30 font-medium' : ''
                        }`}
                      >
                        {/* Rank Column */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center gap-1.5">
                            {isTop1 && <span className="text-amber-400 font-bold">🥇</span>}
                            {isTop2 && <span className="text-slate-300 font-bold">🥈</span>}
                            {isTop3 && <span className="text-amber-600 font-bold">🥉</span>}
                            <span
                              className={`font-mono font-bold ${
                                isTop1
                                  ? 'text-amber-400 text-sm'
                                  : isTop2
                                  ? 'text-slate-300'
                                  : isTop3
                                  ? 'text-amber-500'
                                  : 'text-slate-400'
                              }`}
                            >
                              #{user.rank}
                            </span>
                          </div>
                        </td>

                        {/* Learner Name & Avatar */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 text-xs shrink-0">
                              {user.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-white truncate">{user.name}</span>
                                {user.isCurrentUser && (
                                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-600 text-white">
                                    YOU
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-500 block truncate">{user.email}</span>
                            </div>
                          </div>
                        </td>

                        {/* Role & Experience */}
                        <td className="py-4 px-4 sm:px-6">
                          <div>
                            <div className="text-slate-200 font-medium truncate max-w-[200px]">{user.targetRole}</div>
                            <span className="text-[10px] capitalize text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded inline-block mt-0.5">
                              {user.experienceLevel}
                            </span>
                          </div>
                        </td>

                        {/* Tier Badge */}
                        <td className="py-4 px-4 sm:px-6">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-800/80 border border-slate-700/80 text-slate-200">
                            {user.badge}
                          </span>
                        </td>

                        {/* Activities */}
                        <td className="py-4 px-4 sm:px-6 text-center font-mono text-slate-300">
                          {user.activitiesCount}
                        </td>

                        {/* Total Points */}
                        <td className="py-4 px-4 sm:px-6 text-right">
                          <div className="font-mono font-black text-sm text-amber-400">
                            {user.totalPoints.toLocaleString()}{' '}
                            <span className="text-[10px] font-normal text-slate-500">pts</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredLeaderboard.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No participants matched your current search filters.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Interactive Skill Quiz Modal */}
        {quizModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8 animate-in zoom-in-95 duration-200">
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                      Skill Assessment
                    </span>
                    <span className="text-xs bg-amber-950/80 text-amber-300 border border-amber-800 px-2 py-0.5 rounded-full font-semibold">
                      +100 Points on Pass (≥70%)
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                    {quizData?.title || 'Prompt Engineering & GenAI Foundations'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {quizData?.description || 'Answer the questions below. Scores of 70% or higher automatically credit leaderboard points.'}
                  </p>
                </div>
                <button
                  onClick={() => setQuizModalOpen(false)}
                  className="text-slate-400 hover:text-white text-xl font-bold p-1"
                >
                  ✕
                </button>
              </div>

              {quizLoading && (
                <div className="text-center py-12 space-y-3">
                  <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-slate-400">Loading quiz questions...</p>
                </div>
              )}

              {/* Quiz Result View */}
              {!quizLoading && quizResult && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div
                    className={`p-6 rounded-2xl border text-center space-y-3 ${
                      quizResult.passed
                        ? 'bg-emerald-950/60 border-emerald-500/70 text-emerald-200'
                        : 'bg-rose-950/60 border-rose-500/70 text-rose-200'
                    }`}
                  >
                    <div className="text-4xl">{quizResult.passed ? '🎉' : '📚'}</div>
                    <h4 className="text-xl font-black">
                      {quizResult.passed ? 'Assessment Passed!' : 'Assessment Incomplete'}
                    </h4>
                    <div className="text-3xl font-black">
                      {quizResult.percentage}%{' '}
                      <span className="text-sm font-normal opacity-80">
                        ({quizResult.score} of {quizResult.maxScore} correct)
                      </span>
                    </div>
                    <p className="text-xs max-w-md mx-auto leading-relaxed">{quizResult.message}</p>
                    {quizResult.passed && (
                      <div className="inline-block bg-emerald-900/80 border border-emerald-400/60 px-3 py-1 rounded-full text-xs font-bold text-emerald-300">
                        ✓ +{quizResult.pointsAwarded} Leaderboard Points Recorded
                      </div>
                    )}
                  </div>

                  {/* Question Breakdown */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Answer Review & Explanation
                    </h5>
                    <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                      {quizData?.questions.map((q, qIndex) => {
                        const breakdown = quizResult.answerBreakdown.find((b) => b.questionId === q.id);
                        const isCorrect = breakdown?.isCorrect;

                        return (
                          <div
                            key={q.id}
                            className={`p-4 rounded-xl border text-xs space-y-2 ${
                              isCorrect
                                ? 'bg-slate-950/60 border-emerald-700/50'
                                : 'bg-slate-950/60 border-rose-700/50'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-bold text-white">
                                {qIndex + 1}. {q.question}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  isCorrect ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                                }`}
                              >
                                {isCorrect ? '✓ Correct' : '✕ Incorrect'}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 space-y-1">
                              <div>
                                Your answer:{' '}
                                <span className={isCorrect ? 'text-emerald-300 font-semibold' : 'text-rose-300'}>
                                  {typeof breakdown?.selectedAnswer === 'number'
                                    ? q.options[breakdown.selectedAnswer]
                                    : 'No answer'}
                                </span>
                              </div>
                              {!isCorrect && (
                                <div className="text-emerald-400">
                                  Correct answer: {q.options[breakdown?.correctAnswer ?? 0]}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => {
                        setQuizResult(null);
                        setSelectedAnswers({});
                      }}
                      className="px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white border border-slate-800 rounded-xl"
                    >
                      Retake Quiz
                    </button>
                    <button
                      onClick={() => setQuizModalOpen(false)}
                      className="px-5 py-2.5 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20"
                    >
                      Close & View Standings
                    </button>
                  </div>
                </div>
              )}

              {/* Questions Answering Form */}
              {!quizLoading && !quizResult && quizData && (
                <div className="space-y-6">
                  <div className="space-y-6 max-h-[55vh] overflow-y-auto pr-2">
                    {quizData.questions.map((q, qIndex) => {
                      const selected = selectedAnswers[q.id];

                      return (
                        <div
                          key={q.id}
                          className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-3"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <span className="text-xs font-bold text-amber-400 font-mono">
                              QUESTION {qIndex + 1} OF {quizData.questions.length}
                            </span>
                            {typeof selected === 'number' && (
                              <span className="text-[10px] text-indigo-400 bg-indigo-950/70 px-2 py-0.5 rounded">
                                Answered
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-white leading-snug">{q.question}</h4>

                          {/* Options List */}
                          <div className="space-y-2 pt-1">
                            {q.options.map((option, optIdx) => {
                              const isSelected = selected === optIdx;
                              const optionLetter = String.fromCharCode(65 + optIdx);

                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  onClick={() => handleOptionSelect(q.id, optIdx)}
                                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center gap-3 ${
                                    isSelected
                                      ? 'bg-amber-500/10 border-amber-400 text-amber-200 shadow-md shadow-amber-500/10'
                                      : 'bg-slate-900/50 border-slate-800 text-slate-300 hover:bg-slate-850 hover:text-white'
                                  }`}
                                >
                                  <span
                                    className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                                      isSelected
                                        ? 'bg-amber-500 text-black'
                                        : 'bg-slate-800 text-slate-400'
                                    }`}
                                  >
                                    {optionLetter}
                                  </span>
                                  <span className="leading-relaxed">{option}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Modal Footer Controls */}
                  <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                    <div className="text-xs text-slate-400">
                      Answered:{' '}
                      <span className="font-bold text-white">
                        {Object.keys(selectedAnswers).length} / {quizData.questions.length}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setQuizModalOpen(false)}
                        className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white border border-slate-800 rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitQuiz}
                        disabled={submittingQuiz || Object.keys(selectedAnswers).length === 0}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 disabled:opacity-50 text-black font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition-all"
                      >
                        {submittingQuiz ? 'Submitting & Evaluating...' : 'Submit Answers →'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
