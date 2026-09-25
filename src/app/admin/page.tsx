"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, BookOpen, Trophy, MessagesSquare, ArrowUpRight, CalendarDays } from "lucide-react";
import Topbar from "@/components/admin/layout/Topbar";
import StatCard from "@/components/admin/ui/StatCard";
import GlassCard from "@/components/admin/ui/GlassCard";
import Avatar from "@/components/admin/ui/Avatar";
import Badge from "@/components/admin/ui/Badge";
import { useAdminData } from "@/context/admin/AdminDataContext";
import { formatDate } from "@/lib/admin/utils";

export default function OverviewPage() {
  const { users, courses, communities, leaderboard, events, loading } = useAdminData();

  const [reports, setReports] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("mentora_admin_reports");
        if (raw) return JSON.parse(raw);
      } catch {}
    }
    return [];
  });

  const loadReports = async () => {
    try {
      const res = await fetch("/api/admin/reports");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.reports)) {
          setReports(data.reports);
          return;
        }
      }
    } catch {}

    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("mentora_admin_reports");
        if (raw) setReports(JSON.parse(raw));
      } catch {}
    }
  };

  useEffect(() => {
    loadReports();

    const handleReportEvent = () => {
      loadReports();
    };

    window.addEventListener("mentora_activity_reported", handleReportEvent);
    return () => {
      window.removeEventListener("mentora_activity_reported", handleReportEvent);
    };
  }, []);

  const publishedCourses = courses.filter((c: any) => c.status === "Published").length;
  const activeUsers = users.filter((u: any) => u.status === "Active").length;
  const upcoming = [...events].sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 4);
  const topFive = leaderboard.slice(0, 5);

  return (
    <div>
      <Topbar title="Overview" subtitle="A snapshot of everything happening on Mentora" />

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={loading ? "—" : users.length} icon={Users} delta={`${activeUsers} active`} tone="ember" />
        <StatCard label="Published Courses" value={loading ? "—" : publishedCourses} icon={BookOpen} delta={`${courses.length} total`} tone="blue" />
        <StatCard label="Communities" value={loading ? "—" : communities.length} icon={MessagesSquare} tone="purple" />
        <StatCard label="Top Score" value={loading ? "—" : topFive[0]?.points?.toLocaleString() ?? 0} icon={Trophy} delta={topFive[0]?.name} tone="green" />
      </div>

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <GlassCard className="xl:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-ink-100">Leaderboard snapshot</h3>
            <Badge tone="ember">Live</Badge>
          </div>
          <div className="space-y-1">
            {topFive.map((entry: any, i: number) => (
              <div key={entry.id} className="flex items-center gap-3 py-2.5 border-b border-line-soft last:border-0">
                <span className="text-xs text-ink-500 w-4">{i + 1}</span>
                <Avatar name={entry.name} color={entry.avatarColor} size={32} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-ink-100 truncate">{entry.name}</p>
                </div>
                <p className="text-sm font-semibold text-ember-500">{entry.points.toLocaleString()} pts</p>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-ink-100">Upcoming schedule</h3>
            <CalendarDays size={16} className="text-ink-500" />
          </div>
          <div className="space-y-3">
            {upcoming.map((ev: any) => (
              <div key={ev.id} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-ember-500/10 border border-ember-500/25 flex flex-col items-center justify-center text-ember-400 shrink-0">
                  <span className="text-[10px] font-medium leading-none">{formatDate(ev.date).split(" ")[0]}</span>
                  <span className="text-xs font-bold leading-none mt-0.5">{formatDate(ev.date).split(" ")[1]?.replace(",", "")}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-ink-100 truncate">{ev.title}</p>
                  <p className="text-xs text-ink-500 mt-0.5">{ev.time} · {ev.type}</p>
                </div>
              </div>
            ))}
            {upcoming.length === 0 && <p className="text-sm text-ink-500">No events scheduled.</p>}
          </div>
        </GlassCard>
      </div>

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-4">
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-ink-100">Recent users</h3>
            <Link href="/admin/users" className="text-xs text-ember-500 flex items-center gap-1 hover:text-ember-400">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {users.slice(0, 4).map((u: any) => (
              <div key={u.id} className="flex items-center gap-3">
                <Avatar name={u.name} color={u.avatarColor} size={32} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-ink-100 truncate">{u.name}</p>
                  <p className="text-xs text-ink-500 truncate">{u.email}</p>
                </div>
                <Badge tone={u.status === "Active" ? "green" : u.status === "Suspended" ? "red" : "neutral"}>
                  {u.status}
                </Badge>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-ink-100">Course activity</h3>
            <Link href="/admin/courses" className="text-xs text-ember-500 flex items-center gap-1 hover:text-ember-400">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {courses.slice(0, 4).map((c: any) => (
              <div key={c.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg shrink-0" style={{ background: `${c.coverColor}22`, border: `1px solid ${c.coverColor}40` }} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-ink-100 truncate">{c.title}</p>
                  <p className="text-xs text-ink-500 truncate">{c.enrolled} enrolled</p>
                </div>
                <Badge tone={c.status === "Published" ? "green" : "neutral"}>{c.status}</Badge>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* ── LIVE LEARNER ACTIVITY & ROADMAP REPORTS ── */}
      <div className="mt-6">
        <GlassCard className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-ink-100">Live Learner Roadmap Activity Reports</h3>
              <Badge tone="ember">Realtime</Badge>
            </div>
            <span className="text-xs text-ink-500 font-mono">
              {reports.length} Activities Logged
            </span>
          </div>

          <div className="divide-y divide-line-soft">
            {reports.slice(0, 6).map((rep: any) => {
              const actBadgeTone =
                rep.activityType === 'quiz' ? 'purple' :
                rep.activityType === 'video' ? 'blue' :
                rep.activityType === 'flashcards' ? 'ember' :
                rep.activityType === 'dialogue' ? 'green' : 'neutral';

              const actIcon =
                rep.activityType === 'quiz' ? '🎯' :
                rep.activityType === 'video' ? '🎥' :
                rep.activityType === 'flashcards' ? '🃏' :
                rep.activityType === 'dialogue' ? '🤖' : '📖';

              const timeStr = rep.completedAt
                ? new Date(rep.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : 'Just now';

              return (
                <div key={rep.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-ember-500/10 border border-ember-500/25 flex items-center justify-center text-lg shrink-0">
                      {actIcon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-ink-100 truncate">{rep.userName || 'Learner'}</p>
                        <Badge tone={actBadgeTone as any}>
                          {rep.activityType ? rep.activityType.toUpperCase() : 'ACTIVITY'}
                        </Badge>
                        {typeof rep.score === 'number' && (
                          <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30">
                            Score: {rep.score}%
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-ink-500 truncate mt-0.5">
                        {rep.tileTitle || rep.title || 'Completed Tile'} • <span className="text-ink-400">{rep.courseTitle || 'Roadmap'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <span className="text-xs font-mono font-bold text-ember-400 bg-ember-500/10 px-2.5 py-1 rounded-lg border border-ember-500/20">
                      +{rep.xpReward || 50} XP
                    </span>
                    <span className="text-xs text-ink-500 font-mono">
                      {timeStr}
                    </span>
                  </div>
                </div>
              );
            })}

            {reports.length === 0 && (
              <div className="py-8 text-center text-xs text-ink-500">
                No activity reports logged yet. Once learners complete tiles on the roadmap, events will stream here live.
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

