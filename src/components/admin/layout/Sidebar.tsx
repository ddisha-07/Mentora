"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutGrid,
  Users,
  Sparkles,
  BookOpen,
  CalendarDays,
  MessagesSquare,
  ListChecks,
  Trophy,
  Settings,
  GraduationCap,
  X,
  ArrowLeft,
} from "lucide-react";

const nav = [
  { to: "/admin", label: "Overview", icon: LayoutGrid, exact: true },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/skills", label: "Skills", icon: Sparkles },
  { to: "/admin/courses", label: "Courses", icon: BookOpen },
  { to: "/admin/schedule", label: "Schedule", icon: CalendarDays },
  { to: "/admin/community", label: "Community", icon: MessagesSquare },
  { to: "/admin/tasks", label: "Daily Tasks", icon: ListChecks },
  { to: "/admin/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 shrink-0 z-50 lg:z-0 transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full glass-strong lg:rounded-none lg:border-y-0 lg:border-l-0 border-line-soft flex flex-col">
          <div className="flex items-center justify-between px-5 pt-6 pb-5">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-ember-500 flex items-center justify-center shadow-ember">
                <GraduationCap size={17} className="text-base-950" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-100 tracking-tight leading-none">Mentora</p>
                <p className="text-[11px] text-ink-500 mt-0.5">Admin Panel</p>
              </div>
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden text-ink-500 hover:text-ink-100 p-1"
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
          </div>

          <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
            {nav.map((item) => {
              const isActive = item.exact
                ? pathname === item.to
                : pathname === item.to || pathname.startsWith(`${item.to}/`);

              return (
                <Link
                  key={item.to}
                  href={item.to}
                  onClick={onClose}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors group ${
                    isActive ? "text-ink-100" : "text-ink-500 hover:text-ink-100 hover:bg-white/[0.04]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute inset-0 rounded-lg bg-ember-500/12 border border-ember-500/25"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <item.icon size={17} className={`relative z-10 ${isActive ? "text-ember-500" : ""}`} strokeWidth={2} />
                  <span className="relative z-10 font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-2 text-xs text-ink-500 hover:text-ink-100 hover:bg-white/[0.04] rounded-lg transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Back to App Dashboard</span>
            </Link>

            <div className="glass rounded-xl p-3.5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-ember-500/15 border border-ember-500/25 flex items-center justify-center text-ember-400 text-xs font-semibold">
                LB
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-ink-100 truncate">Lucas Bennett</p>
                <p className="text-[11px] text-ink-500 truncate">Super Admin</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
