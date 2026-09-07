'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Module {
  id: string;
  journeyId: string;
  title: string;
  skill: string;
  description: string;
  level: number;
  order: number;
  estimatedHours: number;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  completedAt?: string | null;
}

interface LevelGroup {
  level: number;
  name: string;
  modules: Module[];
}

interface JourneyData {
  id: string;
  title: string;
  role: string;
  level: string;
  totalModules: number;
}

export default function JourneyRoadmapPage() {
  const params = useParams();
  const journeyId = (params?.id as string) || 'demo';

  const [journey, setJourney] = useState<JourneyData | null>(null);
  const [levels, setLevels] = useState<LevelGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const fetchRoadmap = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/journeys/${journeyId}/roadmap`);
      if (!res.ok) throw new Error('Failed to load journey roadmap');
      const data = await res.json();
      setJourney(data.journey);
      setLevels(data.levels || []);
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading the roadmap.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, [journeyId]);

  const handleCompleteModule = async (moduleId: string) => {
    try {
      setCompletingId(moduleId);
      const res = await fetch(`/api/modules/${moduleId}/complete`, {
        method: 'POST',
      });
      if (!res.ok) throw new Error('Failed to complete module');
      const data = await res.json();

      setNotification(`✓ Completed: "${data.completedModule?.title || 'Module'}". Next module unlocked!`);
      setTimeout(() => setNotification(null), 4000);

      // Refresh roadmap to get updated sequence
      await fetchRoadmap();

      if (selectedModule && selectedModule.id === moduleId) {
        setSelectedModule((prev) => (prev ? { ...prev, status: 'completed' } : null));
      }
    } catch (err: any) {
      alert(err.message || 'Failed to complete module');
    } finally {
      setCompletingId(null);
    }
  };

  // Calculate overall metrics
  const allModules = levels.flatMap((l) => l.modules);
  const completedCount = allModules.filter((m) => m.status === 'completed').length;
  const progressPercent = allModules.length > 0 ? Math.round((completedCount / allModules.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-black text-white p-4 sm:p-6 md:p-10 selection:bg-indigo-500 selection:text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors"
              >
                ← Back to Dashboard
              </Link>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-medium text-slate-400">Roadmap View</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              {journey?.title || 'Personalized Learning Journey'}
            </h1>
            <p className="text-sm text-slate-400">
              Target Role:{' '}
              <span className="text-slate-200 font-semibold">{journey?.role || 'Senior AI Engineer'}</span>
              {' • '}
              Level:{' '}
              <span className="capitalize font-semibold text-indigo-400">{journey?.level || 'Intermediate'}</span>
            </p>
          </div>

          {/* Progress Overview Card */}
          <div className="flex items-center gap-6 p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-xl backdrop-blur-sm">
            <div>
              <div className="text-2xl font-black text-emerald-400">{progressPercent}%</div>
              <div className="text-xs text-slate-400">
                {completedCount} of {allModules.length} completed
              </div>
            </div>
            <div className="w-28 sm:w-36 h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Floating Notification Toast */}
        {notification && (
          <div className="p-4 rounded-xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-200 text-sm font-medium shadow-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-300">
            <span>{notification}</span>
            <button
              onClick={() => setNotification(null)}
              className="text-emerald-400 hover:text-white font-bold ml-4"
            >
              ✕
            </button>
          </div>
        )}

        {/* Loading / Error States */}
        {loading && (
          <div className="text-center py-20 space-y-4">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-slate-400">Loading personalized roadmap...</p>
          </div>
        )}

        {error && (
          <div className="p-6 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-sm">
            <p className="font-semibold">Error loading roadmap</p>
            <p className="mt-1">{error}</p>
            <button
              onClick={fetchRoadmap}
              className="mt-4 px-4 py-2 bg-rose-800 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {/* 3-Level Roadmap Display */}
        {!loading && !error && (
          <div className="space-y-12">
            {levels.map((lvlGroup) => {
              const levelCompleted = lvlGroup.modules.filter((m) => m.status === 'completed').length;
              const isFullyUnlocked = lvlGroup.modules.some((m) => m.status !== 'locked');

              return (
                <div key={lvlGroup.level} className="space-y-4">
                  {/* Level Header Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-700/60 flex items-center justify-center text-indigo-400 font-bold text-sm">
                        L{lvlGroup.level}
                      </span>
                      <div>
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                          Level {lvlGroup.level}: {lvlGroup.name}
                        </h2>
                        <span className="text-xs text-slate-400">
                          {isFullyUnlocked ? '🔓 Level Accessible' : '🔒 Level Gated'}
                        </span>
                      </div>
                    </div>
                    <div className="text-xs font-semibold text-slate-400">
                      {levelCompleted} / {lvlGroup.modules.length} modules completed
                    </div>
                  </div>

                  {/* Modules Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {lvlGroup.modules.map((module) => {
                      const isCompleted = module.status === 'completed';
                      const isAvailable = module.status === 'available' || module.status === 'in_progress';
                      const isLocked = module.status === 'locked';

                      return (
                        <div
                          key={module.id}
                          onClick={() => setSelectedModule(module)}
                          className={`group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                            isCompleted
                              ? 'bg-slate-900/40 border-emerald-500/40 hover:border-emerald-500/70 shadow-lg shadow-emerald-950/20'
                              : isAvailable
                              ? 'bg-slate-900/80 border-indigo-500/60 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-950/30 scale-[1.01]'
                              : 'bg-slate-950/40 border-slate-850 opacity-60 hover:opacity-80'
                          }`}
                        >
                          <div className="space-y-3">
                            {/* Card Header */}
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono">
                                #{module.order}
                              </span>

                              {/* Status Badge */}
                              <span
                                className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                                  isCompleted
                                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80'
                                    : isAvailable
                                    ? 'bg-indigo-950 text-indigo-300 border border-indigo-700/80'
                                    : 'bg-slate-900 text-slate-500 border border-slate-800'
                                }`}
                              >
                                {isCompleted && <span>✓ Completed</span>}
                                {isAvailable && (
                                  <>
                                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                                    <span>Available</span>
                                  </>
                                )}
                                {isLocked && <span>🔒 Locked</span>}
                              </span>
                            </div>

                            {/* Title & Description */}
                            <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">
                              {module.title}
                            </h3>
                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                              {module.description}
                            </p>
                          </div>

                          {/* Card Footer */}
                          <div className="pt-4 mt-4 border-t border-slate-800/60 flex items-center justify-between text-xs">
                            <span className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 text-[11px]">
                              {module.skill}
                            </span>
                            <span className="text-slate-400 font-medium">
                              ⏱ {module.estimatedHours} hrs
                            </span>
                          </div>

                          {/* Quick Complete Action on Card for Available Modules */}
                          {isAvailable && (
                            <div className="pt-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCompleteModule(module.id);
                                }}
                                disabled={completingId === module.id}
                                className="w-full py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2"
                              >
                                {completingId === module.id ? (
                                  <span className="animate-pulse">Marking Complete...</span>
                                ) : (
                                  <span>Mark as Completed →</span>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Module Detail Modal / Drawer */}
        {selectedModule && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-lg w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-mono font-bold text-indigo-400">
                    MODULE #{selectedModule.order} • LEVEL {selectedModule.level}
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">{selectedModule.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedModule(null)}
                  className="text-slate-400 hover:text-white text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-850 space-y-2">
                <div className="text-xs text-slate-400 uppercase font-semibold">Competency Focus</div>
                <div className="text-sm font-semibold text-indigo-300">{selectedModule.skill}</div>
                <p className="text-xs text-slate-300 pt-1 leading-relaxed">{selectedModule.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800">
                  <span className="text-slate-400 block">Estimated Time</span>
                  <span className="text-sm font-bold text-white mt-0.5">{selectedModule.estimatedHours} Hours</span>
                </div>
                <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800">
                  <span className="text-slate-400 block">Current Status</span>
                  <span className="text-sm font-bold capitalize mt-0.5 text-white">
                    {selectedModule.status}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedModule(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white border border-slate-800 rounded-lg"
                >
                  Close
                </button>
                {selectedModule.status === 'available' && (
                  <button
                    onClick={() => handleCompleteModule(selectedModule.id)}
                    disabled={completingId === selectedModule.id}
                    className="px-5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white rounded-lg transition-all shadow-lg shadow-emerald-600/30"
                  >
                    {completingId === selectedModule.id ? 'Updating...' : 'Mark Completed & Unlock Next'}
                  </button>
                )}
                {selectedModule.status === 'completed' && (
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                    ✓ Module Completed
                  </span>
                )}
                {selectedModule.status === 'locked' && (
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    🔒 Complete previous modules to unlock
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
