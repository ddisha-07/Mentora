'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import GoPremiumCard from '@/components/ui/GoPremiumCard';

// ─── Navigation Item Definition & Icons ───────────────────────────────────────

export interface NavItemConfig {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
}

// Slot Icons Matching User Screenshot & Mentora Brand
const DashGridIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

const JourneysStackIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

const CoursesBookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    <line x1="9" y1="7" x2="15" y2="7" />
    <line x1="9" y1="11" x2="13" y2="11" />
  </svg>
);

const CommunityPeopleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const LeaderboardPodiumIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
    <rect x="2" y="14" width="5" height="7" rx="1.5" />
    <rect x="9.5" y="9" width="5" height="12" rx="1.5" />
    <rect x="17" y="4" width="5" height="17" rx="1.5" />
  </svg>
);

const PassportBadgeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
    <rect x="3" y="2" width="18" height="20" rx="2.5" />
    <circle cx="12" cy="10" r="3" />
    <path d="M7 20a5 5 0 0110 0" />
  </svg>
);

const MentorshipChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);

const KaiSparkleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
    <path d="M12 3c0 4.5-3.5 8-8 8 4.5 0 8 3.5 8 8 0-4.5 3.5-8 8-8-4.5 0-8-3.5-8-8z" />
    <path d="M19 3c0 2-1.5 3.5-3.5 3.5 2 0 3.5 1.5 3.5 3.5 0-2 1.5-3.5 3.5-3.5-2 0-3.5-1.5-3.5-3.5z" />
  </svg>
);

const UserProfileIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
    <circle cx="12" cy="7" r="4" />
    <path d="M4 21v-2a6 6 0 0112 0v2H4z" />
  </svg>
);

const ExpandSidebarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-[18px] h-[18px]">
    <rect x="3" y="3" width="18" height="18" rx="2.5" />
    <path d="M9 3v18" />
    <path d="M14 9l3 3-3 3" />
  </svg>
);

const CollapseSidebarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
    <rect x="3" y="3" width="18" height="18" rx="2.5" />
    <path d="M9 3v18" />
    <path d="M16 15l-3-3 3-3" />
  </svg>
);

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={1.8}>
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={1.8}>
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);

const SettingsGearIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={1.8}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

// Canonical Sequence of All Navigation Items
const NAV_ITEMS: NavItemConfig[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: <DashGridIcon /> },
  { id: 'journeys', label: 'Journeys', href: '/dashboard/journeys', icon: <JourneysStackIcon /> },
  { id: 'courses', label: 'Courses', href: '/dashboard/courses', icon: <CoursesBookIcon /> },
  { id: 'community', label: 'Community', href: '/dashboard/community', icon: <CommunityPeopleIcon /> },
  { id: 'leaderboard', label: 'Leaderboard', href: '/dashboard/leaderboard', icon: <LeaderboardPodiumIcon /> },
  { id: 'passport', label: 'Skill Passport', href: '/dashboard/passport', icon: <PassportBadgeIcon /> },
  { id: 'mentorship', label: 'Mentorship', href: '/dashboard/mentorship', icon: <MentorshipChatIcon /> },
  { id: 'kai', label: 'Kai AI', href: '/dashboard/kai', icon: <KaiSparkleIcon /> },
  { id: 'settings', label: 'Settings & Profile', href: '/dashboard/settings', icon: <UserProfileIcon /> },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { isBright, toggleTheme } = useTheme();

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Keyboard shortcut: Esc to collapse expanded sidebar
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  // Determine current active item ID based on route
  const getActiveItemId = (): string => {
    if (pathname === '/dashboard') return 'dashboard';
    if (pathname.startsWith('/dashboard/journeys')) return 'journeys';
    if (pathname.startsWith('/dashboard/courses')) return 'courses';
    if (pathname.startsWith('/dashboard/community')) return 'community';
    if (pathname.startsWith('/dashboard/leaderboard')) return 'leaderboard';
    if (pathname.startsWith('/dashboard/passport')) return 'passport';
    if (pathname.startsWith('/dashboard/mentorship')) return 'mentorship';
    if (pathname.startsWith('/dashboard/kai')) return 'kai';
    if (pathname.startsWith('/dashboard/settings') || pathname.startsWith('/dashboard/profile')) return 'settings';
    return 'dashboard';
  };

  const activeId = getActiveItemId();

  // Tooltip Helper
  const renderTooltip = (id: string, label: string) => (
    <AnimatePresence>
      {hoveredItem === id && (
        <motion.div
          initial={{ opacity: 0, x: -8, scale: 0.94 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -8, scale: 0.94 }}
          transition={{ duration: 0.15 }}
          className="absolute left-[64px] top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap pointer-events-none shadow-2xl z-50 backdrop-blur-md flex items-center gap-1.5"
          style={{
            background: isBright ? '#FFFFFF' : '#1A120C',
            border: isBright ? '1px solid rgba(234, 88, 12, 0.25)' : '1px solid rgba(255, 107, 53, 0.35)',
            color: isBright ? '#1C1917' : '#FFF8F0',
            boxShadow: isBright
              ? '0 10px 25px -3px rgba(234,88,12,0.15), 0 4px 6px -2px rgba(0,0,0,0.05)'
              : '0 10px 25px -3px rgba(0,0,0,0.6), 0 0 15px rgba(255,107,53,0.2)',
          }}
        >
          <span>{label}</span>
          {id === activeId && (
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* ── 1. Top-Left Corner Frameless Mentora Logo ────────────────────── */}
      <div className="fixed left-3.5 top-3.5 z-50">
        <Link
          href="/"
          title="Back to Landing Page"
          className="flex items-center justify-center p-1 transition-all duration-200 hover:scale-105 active:scale-95 group cursor-pointer select-none"
        >
          <Image
            src="/images/mentora-logo.png"
            alt="Mentora Logo"
            width={58}
            height={58}
            priority
            className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-110 drop-shadow-[0_2px_12px_rgba(255,107,53,0.4)]"
          />
        </Link>
      </div>

      {/* ── 2. Floating Liquid Dock Sidebar (Items in Sequence, Encircled Animation) ── */}
      <div
        id="mentora-liquid-dock"
        className="fixed left-3.5 top-[68px] z-40 flex flex-col items-center select-none"
      >
        {/* Sleek Dock Capsule Container enclosing all items in exact sequence */}
        <div
          className="relative w-[54px] rounded-[27px] px-2 py-2.5 flex flex-col items-center gap-2 border shadow-2xl backdrop-blur-xl transition-all duration-300"
          style={{
            background: isBright
              ? 'linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,248,242,0.96) 50%, rgba(245,237,227,0.98) 100%)'
              : 'linear-gradient(180deg, rgba(28,19,13,0.96) 0%, rgba(20,13,8,0.96) 50%, rgba(14,8,5,0.98) 100%)',
            borderColor: isBright ? 'rgba(234, 88, 12, 0.3)' : 'rgba(255, 107, 53, 0.35)',
            boxShadow: isBright
              ? '0 16px 36px -6px rgba(234, 88, 12, 0.15), 0 0 20px rgba(234, 88, 12, 0.08)'
              : '0 16px 36px -6px rgba(0, 0, 0, 0.75), 0 0 20px rgba(255, 107, 53, 0.15)',
          }}
        >
          {/* Navigation Items in Fixed, Canonical Sequence */}
          {NAV_ITEMS.map((item) => {
            const isActive = item.id === activeId;
            return (
              <div
                key={item.id}
                className="relative w-[36px] h-[36px] flex items-center justify-center"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* ── Encircled Loop Animation for Selected/Current Tab ── */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-encircled-loop"
                    transition={{
                      type: 'spring',
                      stiffness: 380,
                      damping: 28,
                    }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    {/* Separate Encircled Outer Loop Ring with Glowing Aura */}
                    <div
                      className="absolute -inset-[3px] rounded-full pointer-events-none"
                      style={{
                        border: isBright
                          ? '1.8px solid rgba(234, 88, 12, 0.85)'
                          : '1.8px solid rgba(255, 107, 53, 0.95)',
                        boxShadow: isBright
                          ? '0 0 14px rgba(234, 88, 12, 0.45), inset 0 0 8px rgba(234, 88, 12, 0.2)'
                          : '0 0 18px rgba(255, 107, 53, 0.55), inset 0 0 10px rgba(255, 107, 53, 0.3)',
                      }}
                    />

                    {/* Inner Coral-Orange Active Circle */}
                    <div
                      className="w-full h-full rounded-full shadow-lg"
                      style={{
                        background: 'linear-gradient(135deg, #FF6B35 0%, #FFA07A 100%)',
                        boxShadow: '0 4px 14px rgba(255, 107, 53, 0.45)',
                      }}
                    />

                    {/* Ambient Breathing Pulse */}
                    <motion.div
                      animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.65, 0.35] }}
                      transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute -inset-1.5 rounded-full bg-[#FF6B35]/25 blur-sm pointer-events-none"
                    />
                  </motion.div>
                )}

                {/* Clickable Nav Link */}
                <Link
                  href={item.href}
                  id={`dock-nav-${item.id}`}
                  className={`w-full h-full rounded-full flex items-center justify-center relative z-10 transition-all duration-200 ${
                    isActive
                      ? 'text-white scale-100'
                      : isBright
                      ? 'text-stone-500 hover:text-[#EA580C] hover:scale-110 active:scale-95'
                      : 'text-stone-400 hover:text-[#FF6B35] hover:scale-110 active:scale-95'
                  }`}
                >
                  {item.icon}
                </Link>

                {renderTooltip(item.id, isActive ? `${item.label} (Current)` : item.label)}
              </div>
            );
          })}

          {/* ── Expand Sidebar Toggle Button (At Bottom of Dock) ── */}
          <div
            className="relative w-[36px] h-[36px] mt-1 pt-1.5 border-t flex items-center justify-center"
            style={{ borderColor: isBright ? 'rgba(234, 88, 12, 0.15)' : 'rgba(255, 107, 53, 0.15)' }}
            onMouseEnter={() => setHoveredItem('expand-dock')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <button
              id="dock-expand-sidebar-btn"
              onClick={() => setIsExpanded(true)}
              className={`w-full h-full rounded-xl flex items-center justify-center transition-all duration-200 group cursor-pointer ${
                isBright
                  ? 'text-stone-500 hover:text-[#EA580C] hover:bg-orange-500/10 hover:scale-110 active:scale-95'
                  : 'text-stone-400 hover:text-[#FF6B35] hover:bg-white/10 hover:scale-110 active:scale-95'
              }`}
              title="Expand Sidebar"
            >
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                <ExpandSidebarIcon />
              </span>
            </button>
            {renderTooltip('expand-dock', 'Expand Sidebar')}
          </div>
        </div>
      </div>

      {/* ── 3. Full-Featured Expanded Sidebar Drawer ───────────────────────── */}
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Soft Ambient Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setIsExpanded(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-50 cursor-pointer"
            />

            {/* Slide-out Sidebar Panel */}
            <motion.aside
              initial={{ x: -280, opacity: 0.9 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0.9 }}
              transition={{ type: 'spring', stiffness: 340, damping: 28 }}
              className="fixed left-0 top-0 bottom-0 w-[270px] z-50 flex flex-col shadow-2xl border-r select-none"
              style={{
                background: isBright
                  ? 'linear-gradient(180deg, #FFFFFF 0%, #FFF8F2 50%, #FAF2E9 100%)'
                  : 'linear-gradient(180deg, #1A120C 0%, #130D08 50%, #0E0805 100%)',
                borderColor: isBright ? 'rgba(234, 88, 12, 0.2)' : 'rgba(255, 107, 53, 0.25)',
                boxShadow: isBright
                  ? '0 25px 50px -12px rgba(234, 88, 12, 0.15), 0 0 30px rgba(234, 88, 12, 0.08)'
                  : '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 107, 53, 0.15)',
              }}
            >
              {/* Header: Logo & Collapse Action */}
              <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b" style={{ borderColor: isBright ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.07)' }}>
                <Link
                  href="/"
                  onClick={() => setIsExpanded(false)}
                  className="flex items-center gap-2 group cursor-pointer"
                >
                  <Image
                    src="/images/mentora-logo.png"
                    alt="Mentora Logo"
                    width={110}
                    height={44}
                    priority
                    className="h-8 w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-[0_2px_10px_rgba(255,107,53,0.35)]"
                  />
                  <span
                    className="text-xs font-black tracking-widest uppercase font-mono px-1.5 py-0.5 rounded-md"
                    style={{
                      background: 'rgba(255, 107, 53, 0.12)',
                      color: '#FF6B35',
                      border: '1px solid rgba(255, 107, 53, 0.25)',
                    }}
                  >
                    PRO
                  </span>
                </Link>

                <button
                  id="collapse-sidebar-btn"
                  onClick={() => setIsExpanded(false)}
                  title="Collapse to Dock"
                  className={`p-1.5 rounded-xl transition-all cursor-pointer ${
                    isBright
                      ? 'text-stone-500 hover:text-stone-900 hover:bg-orange-500/10'
                      : 'text-stone-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <CollapseSidebarIcon />
                </button>
              </div>

              {/* Navigation Items List in Exact Sequence */}
              <nav className="flex-1 px-3 py-3 space-y-1.5 overflow-y-auto">
                <div className="px-3 pb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6B35]/80 font-mono">
                    Navigation
                  </span>
                </div>

                {NAV_ITEMS.map((item) => {
                  const isActive = item.id === activeId;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setIsExpanded(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl transition-all duration-200 group ${
                        isActive
                          ? 'text-white font-bold shadow-md shadow-[#FF6B35]/25 scale-[1.01]'
                          : isBright
                          ? 'text-stone-600 hover:text-stone-900 hover:bg-orange-500/10 font-medium'
                          : 'text-stone-300 hover:text-white hover:bg-white/5 font-medium'
                      }`}
                      style={
                        isActive
                          ? {
                              background: 'linear-gradient(135deg, #FF6B35 0%, #FFA07A 100%)',
                            }
                          : undefined
                      }
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`w-5 h-5 flex items-center justify-center transition-transform group-hover:scale-110 ${
                            isActive ? 'text-white' : 'text-[#FF6B35]'
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span className="text-xs tracking-wide truncate">{item.label}</span>
                      </div>

                      {isActive && (
                        <motion.span
                          layoutId="active-indicator-dot"
                          className="w-1.5 h-1.5 rounded-full bg-white shadow-sm"
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* Footer: Theme Toggle, User Profile & Quick Actions */}
              <div
                className="p-4 border-t space-y-3"
                style={{ borderColor: isBright ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.07)' }}
              >
                {/* Theme Toggle Button */}
                <button
                  onClick={toggleTheme}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    isBright ? 'bg-orange-500/8 hover:bg-orange-500/15' : 'bg-white/5 hover:bg-white/10'
                  }`}
                  style={{ color: isBright ? '#44403C' : '#E7E5E4' }}
                >
                  <span className="flex items-center gap-2">
                    {isBright ? <MoonIcon /> : <SunIcon />}
                    <span>{isBright ? 'Dark Mode' : 'Light Mode'}</span>
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#FF6B35]">
                    {isBright ? 'Dark' : 'Light'}
                  </span>
                </button>

                {/* User Profile Info Card */}
                <div className="flex items-center gap-3 pt-1">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md shrink-0"
                    style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FFA07A 100%)' }}
                  >
                    AJ
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold truncate" style={{ color: isBright ? '#1C1917' : '#FFF8F0' }}>
                      Alex Johnson
                    </p>
                    <p className="text-[11px] font-medium text-[#FF6B35] truncate">
                      Pro Learner · Lvl 7
                    </p>
                  </div>

                  {/* Collapse Button Shortcut */}
                  <button
                    onClick={() => setIsExpanded(false)}
                    className="text-[11px] text-stone-400 hover:text-[#FF6B35] transition-colors p-1 cursor-pointer"
                    title="Collapse"
                  >
                    ⇤
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── 4. Go Premium Eduplex Card (Bottom-Left Corner) ───────────────── */}
      <GoPremiumCard />
    </>
  );
}
