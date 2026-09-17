'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import GoPremiumCard from '@/components/ui/GoPremiumCard';

// ─── Icons Matching User Screenshot & Mentora Brand ───────────────────────────

// Slot 0 (Top Bulb): Dashboard (4-Square Grid)
const DashGridIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

// Slot 1: Journeys (3-Layer Stack)
const JourneysStackIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);

// Slot 2: Courses (Open Book)
const CoursesBookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    <line x1="9" y1="7" x2="15" y2="7" />
    <line x1="9" y1="11" x2="13" y2="11" />
  </svg>
);

// Slot 3: Community (Group / People)
const CommunityPeopleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);

// Slot 4: Leaderboard (Podium Bar Chart)
const LeaderboardPodiumIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
    <rect x="2" y="14" width="5" height="7" rx="1.5" />
    <rect x="9.5" y="9" width="5" height="12" rx="1.5" />
    <rect x="17" y="4" width="5" height="17" rx="1.5" />
  </svg>
);

// Slot 5: Skill Passport (Passport ID Badge Card)
const PassportBadgeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
    <rect x="3" y="2" width="18" height="20" rx="2.5" />
    <circle cx="12" cy="10" r="3" />
    <path d="M7 20a5 5 0 0110 0" />
  </svg>
);

// Slot 6: Mentorship (Chat Bubble)
const MentorshipChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);

// Slot 7: Kai (4-Point AI Sparkle)
const KaiSparkleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
    <path d="M12 3c0 4.5-3.5 8-8 8 4.5 0 8 3.5 8 8 0-4.5 3.5-8 8-8-4.5 0-8-3.5-8-8z" />
    <path d="M19 3c0 2-1.5 3.5-3.5 3.5 2 0 3.5 1.5 3.5 3.5 0-2 1.5-3.5 3.5-3.5-2 0-3.5-1.5-3.5-3.5z" />
  </svg>
);

// Slot 8: User Profile / Settings (Silhouette 👤)
const UserProfileIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
    <circle cx="12" cy="7" r="4" />
    <path d="M4 21v-2a6 6 0 0112 0v2H4z" />
  </svg>
);

// Menu Icons
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

const LogoutArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth={1.8}>
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isBright, toggleTheme } = useTheme();

  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isHomeActive = pathname === '/dashboard';
  const isJourneysActive = pathname.startsWith('/dashboard/journeys');
  const isCoursesActive = pathname.startsWith('/dashboard/courses');
  const isCommunityActive = pathname.startsWith('/dashboard/community');
  const isLeaderboardActive = pathname.startsWith('/dashboard/leaderboard');
  const isPassportActive = pathname.startsWith('/dashboard/passport');
  const isMentorshipActive = pathname.startsWith('/dashboard/mentorship');
  const isKaiActive = pathname.startsWith('/dashboard/kai');

  // Tooltip Helper
  const renderTooltip = (id: string, label: string) => (
    <AnimatePresence>
      {hoveredItem === id && (
        <motion.div
          initial={{ opacity: 0, x: -8, scale: 0.94 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -8, scale: 0.94 }}
          transition={{ duration: 0.15 }}
          className="absolute left-[64px] top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap pointer-events-none shadow-2xl z-50 backdrop-blur-md"
          style={{
            background: isBright ? '#FFFFFF' : '#1A120C',
            border: isBright ? '1px solid rgba(234, 88, 12, 0.22)' : '1px solid rgba(255, 107, 53, 0.3)',
            color: isBright ? '#1C1917' : '#FFF8F0',
            boxShadow: isBright
              ? '0 10px 25px -3px rgba(234,88,12,0.15), 0 4px 6px -2px rgba(0,0,0,0.05)'
              : '0 10px 25px -3px rgba(0,0,0,0.6), 0 0 15px rgba(255,107,53,0.15)',
          }}
        >
          {label}
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

      {/* ── 2. Floating Liquid Metaball Dock ───────────────────────────────── */}
      <div
        id="mentora-liquid-dock"
        className="fixed left-3.5 top-[72px] z-40 flex flex-col items-center select-none"
      >
        {/* Organic Silhouette Container (Height: 423px for all 8 items + profile) */}
        <div className="relative w-[56px] h-[423px] flex flex-col items-center">
          {/* Custom SVG Liquid Backdrop (Math C1 Bézier Curves) */}
          <svg
            width="56"
            height="423"
            viewBox="0 0 56 423"
            className="absolute inset-0 w-full h-full -z-10 pointer-events-none drop-shadow-[0_12px_32px_rgba(0,0,0,0.55)]"
            fill="none"
          >
            <defs>
              <linearGradient id="mentora-dock-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isBright ? '#FFFFFF' : '#1C130D'} stopOpacity="0.96" />
                <stop offset="45%" stopColor={isBright ? '#FFF8F2' : '#140D08'} stopOpacity="0.96" />
                <stop offset="100%" stopColor={isBright ? '#F5EDE3' : '#0E0805'} stopOpacity="0.98" />
              </linearGradient>
              <linearGradient id="mentora-dock-stroke" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isBright ? 'rgba(234, 88, 12, 0.35)' : 'rgba(255, 107, 53, 0.38)'} />
                <stop offset="50%" stopColor={isBright ? 'rgba(234, 88, 12, 0.18)' : 'rgba(255, 107, 53, 0.18)'} />
                <stop offset="100%" stopColor={isBright ? 'rgba(234, 88, 12, 0.28)' : 'rgba(255, 107, 53, 0.28)'} />
              </linearGradient>
            </defs>
            <path
              d={`
                M 28 0
                A 28 28 0 0 1 56 28
                C 56 40, 44 42, 44 54
                C 44 66, 56 68, 56 80
                L 56 395
                A 28 28 0 0 1 0 395
                L 0 80
                C 0 68, 12 66, 12 54
                C 12 42, 0 40, 0 28
                A 28 28 0 0 1 28 0
                Z
              `}
              fill="url(#mentora-dock-grad)"
              stroke="url(#mentora-dock-stroke)"
              strokeWidth="1.2"
            />
          </svg>

          {/* ── Slot 0: Top Bulb (Dashboard) ── */}
          <div
            className="absolute left-[10px] top-[10px] w-[36px] h-[36px]"
            onMouseEnter={() => setHoveredItem('dashboard')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Link
              href="/dashboard"
              id="dock-dashboard"
              className={`w-full h-full rounded-2xl flex items-center justify-center transition-all duration-200 ${
                isHomeActive
                  ? 'bg-gradient-to-tr from-[#FF6B35] to-[#FFA07A] text-white shadow-lg shadow-[#FF6B35]/40 scale-105'
                  : 'text-stone-400 hover:text-[#FF6B35] hover:bg-white/10 hover:scale-105'
              }`}
            >
              <DashGridIcon />
            </Link>
            {renderTooltip('dashboard', 'Dashboard')}
          </div>

          {/* ── Slot 1: Journeys (Stack) ── */}
          <div
            className="absolute left-[11px] top-[84px] w-[34px] h-[34px]"
            onMouseEnter={() => setHoveredItem('journeys')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Link
              href="/dashboard/journeys"
              id="dock-journeys"
              className={`w-full h-full rounded-xl flex items-center justify-center transition-all duration-200 ${
                isJourneysActive
                  ? 'bg-gradient-to-tr from-[#FF6B35] to-[#FFA07A] text-white shadow-md shadow-[#FF6B35]/35 scale-105'
                  : 'text-stone-400 hover:text-[#FF6B35] hover:bg-white/10 hover:scale-105'
              }`}
            >
              <JourneysStackIcon />
            </Link>
            {renderTooltip('journeys', 'Journeys')}
          </div>

          {/* ── Slot 2: Courses (Book) ── */}
          <div
            className="absolute left-[11px] top-[126px] w-[34px] h-[34px]"
            onMouseEnter={() => setHoveredItem('courses')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Link
              href="/dashboard/courses"
              id="dock-courses"
              className={`w-full h-full rounded-xl flex items-center justify-center transition-all duration-200 ${
                isCoursesActive
                  ? 'bg-gradient-to-tr from-[#FF6B35] to-[#FFA07A] text-white shadow-md shadow-[#FF6B35]/35 scale-105'
                  : 'text-stone-400 hover:text-[#FF6B35] hover:bg-white/10 hover:scale-105'
              }`}
            >
              <CoursesBookIcon />
            </Link>
            {renderTooltip('courses', 'Courses')}
          </div>

          {/* ── Slot 3: Community (Group / People) ── */}
          <div
            className="absolute left-[11px] top-[168px] w-[34px] h-[34px]"
            onMouseEnter={() => setHoveredItem('community')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Link
              href="/dashboard/community"
              id="dock-community"
              className={`w-full h-full rounded-xl flex items-center justify-center transition-all duration-200 ${
                isCommunityActive
                  ? 'bg-gradient-to-tr from-[#FF6B35] to-[#FFA07A] text-white shadow-md shadow-[#FF6B35]/35 scale-105'
                  : 'text-stone-400 hover:text-[#FF6B35] hover:bg-white/10 hover:scale-105'
              }`}
            >
              <CommunityPeopleIcon />
            </Link>
            {renderTooltip('community', 'Community')}
          </div>

          {/* ── Slot 4: Leaderboard (Podium Bar Chart) ── */}
          <div
            className="absolute left-[11px] top-[210px] w-[34px] h-[34px]"
            onMouseEnter={() => setHoveredItem('leaderboard')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Link
              href="/dashboard/leaderboard"
              id="dock-leaderboard"
              className={`w-full h-full rounded-xl flex items-center justify-center transition-all duration-200 ${
                isLeaderboardActive
                  ? 'bg-gradient-to-tr from-[#FF6B35] to-[#FFA07A] text-white shadow-md shadow-[#FF6B35]/35 scale-105'
                  : 'text-stone-400 hover:text-[#FF6B35] hover:bg-white/10 hover:scale-105'
              }`}
            >
              <LeaderboardPodiumIcon />
            </Link>
            {renderTooltip('leaderboard', 'Leaderboard')}
          </div>

          {/* ── Slot 5: Skill Passport (Passport Badge Card) ── */}
          <div
            className="absolute left-[11px] top-[252px] w-[34px] h-[34px]"
            onMouseEnter={() => setHoveredItem('passport')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Link
              href="/dashboard/passport"
              id="dock-passport"
              className={`w-full h-full rounded-xl flex items-center justify-center transition-all duration-200 ${
                isPassportActive
                  ? 'bg-gradient-to-tr from-[#FF6B35] to-[#FFA07A] text-white shadow-md shadow-[#FF6B35]/35 scale-105'
                  : 'text-stone-400 hover:text-[#FF6B35] hover:bg-white/10 hover:scale-105'
              }`}
            >
              <PassportBadgeIcon />
            </Link>
            {renderTooltip('passport', 'Skill Passport')}
          </div>

          {/* ── Slot 6: Mentorship (Chat Bubble) ── */}
          <div
            className="absolute left-[11px] top-[294px] w-[34px] h-[34px]"
            onMouseEnter={() => setHoveredItem('mentorship')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Link
              href="/dashboard/mentorship"
              id="dock-mentorship"
              className={`w-full h-full rounded-xl flex items-center justify-center transition-all duration-200 ${
                isMentorshipActive
                  ? 'bg-gradient-to-tr from-[#FF6B35] to-[#FFA07A] text-white shadow-md shadow-[#FF6B35]/35 scale-105'
                  : 'text-stone-400 hover:text-[#FF6B35] hover:bg-white/10 hover:scale-105'
              }`}
            >
              <MentorshipChatIcon />
            </Link>
            {renderTooltip('mentorship', 'Mentorship')}
          </div>

          {/* ── Slot 7: Kai (Sparkle AI) ── */}
          <div
            className="absolute left-[11px] top-[336px] w-[34px] h-[34px]"
            onMouseEnter={() => setHoveredItem('kai')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Link
              href="/dashboard/kai"
              id="dock-kai"
              className={`w-full h-full rounded-xl flex items-center justify-center transition-all duration-200 ${
                isKaiActive
                  ? 'bg-gradient-to-tr from-[#FF6B35] to-[#FFA07A] text-white shadow-md shadow-[#FF6B35]/35 scale-105'
                  : 'text-stone-400 hover:text-[#FF6B35] hover:bg-white/10 hover:scale-105'
              }`}
            >
              <KaiSparkleIcon />
            </Link>
            {renderTooltip('kai', 'Kai AI')}
          </div>

          {/* ── Slot 8: Profile & Quick Settings (User Silhouette 👤) ── */}
          <div
            ref={profileRef}
            className="absolute left-[11px] top-[378px] w-[34px] h-[34px]"
            onMouseEnter={() => setHoveredItem('profile')}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <button
              id="dock-profile"
              onClick={() => {
                setProfileOpen(!profileOpen);
              }}
              className={`w-full h-full rounded-full flex items-center justify-center transition-all duration-200 ${
                profileOpen
                  ? 'bg-gradient-to-tr from-[#FF6B35] to-[#FFA07A] text-white shadow-md shadow-[#FF6B35]/35 scale-105'
                  : 'text-stone-400 hover:text-[#FF6B35] hover:bg-white/10 hover:scale-105'
              }`}
            >
              <UserProfileIcon />
            </button>
            {renderTooltip('profile', 'Profile & Settings')}

            {/* Profile Popover Flyout */}
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -12, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -12, scale: 0.95 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-[64px] bottom-0 w-64 rounded-2xl p-4 shadow-2xl z-50 backdrop-blur-xl border"
                  style={{
                    background: isBright ? 'rgba(255,255,255,0.96)' : 'rgba(28,19,14,0.96)',
                    borderColor: isBright ? 'rgba(234,88,12,0.2)' : 'rgba(255,107,53,0.3)',
                    boxShadow: isBright
                      ? '0 20px 40px -10px rgba(234,88,12,0.2)'
                      : '0 20px 40px -10px rgba(0,0,0,0.8), 0 0 20px rgba(255,107,53,0.15)',
                  }}
                >
                  {/* User Info Header */}
                  <div className="flex items-center gap-3 pb-3 border-b" style={{ borderColor: isBright ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-md" style={{ background: 'linear-gradient(135deg, #FF6B35, #FFA07A)' }}>
                      AJ
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate" style={{ color: isBright ? '#1C1917' : '#FFF8F0' }}>Alex Johnson</p>
                      <p className="text-xs font-medium" style={{ color: '#FF6B35' }}>Pro Learner · Lvl 7</p>
                    </div>
                  </div>

                  {/* Actions List */}
                  <div className="py-2 space-y-1 text-sm font-medium">
                    {/* Theme Toggle */}
                    <button
                      onClick={toggleTheme}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl transition-colors hover:bg-[#FF6B35]/15"
                      style={{ color: isBright ? '#44403C' : '#E7E5E4' }}
                    >
                      <span className="flex items-center gap-2.5">
                        {isBright ? <MoonIcon /> : <SunIcon />}
                        <span>{isBright ? 'Dark Mode' : 'Light Mode'}</span>
                      </span>
                      <span className="text-[11px] uppercase tracking-wider font-semibold text-[#FF6B35]">
                        {isBright ? 'Dark' : 'Light'}
                      </span>
                    </button>

                    {/* Settings */}
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setProfileOpen(false)}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-colors hover:bg-[#FF6B35]/15"
                      style={{ color: isBright ? '#44403C' : '#E7E5E4' }}
                    >
                      <SettingsGearIcon />
                      <span>Settings</span>
                    </Link>

                    {/* Expand Full Drawer */}
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        setDrawerOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl transition-colors hover:bg-[#FF6B35]/15 text-[#FF6B35]"
                    >
                      <span className="text-xs">📑</span>
                      <span>Expand Sidebar</span>
                    </button>
                  </div>

                  {/* Logout */}
                  <div className="pt-2 border-t" style={{ borderColor: isBright ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)' }}>
                    <Link
                      href="/"
                      onClick={() => setProfileOpen(false)}
                      className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl transition-colors hover:bg-rose-500/15 text-rose-400"
                    >
                      <LogoutArrowIcon />
                      <span>Logout</span>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* ── 4. Slide-Out Overlay Drawer (Optional Full View) ─────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="fixed left-0 top-0 bottom-0 w-[260px] z-50 flex flex-col shadow-2xl border-r"
              style={{
                background: isBright
                  ? 'linear-gradient(180deg, #FFFFFF 0%, #FAF4EE 100%)'
                  : 'linear-gradient(180deg, #1A120C 0%, #110B07 100%)',
                borderColor: isBright ? 'rgba(234, 88, 12, 0.15)' : 'rgba(255, 107, 53, 0.18)',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 pt-6 pb-4">
                <Link href="/" onClick={() => setDrawerOpen(false)} className="flex items-center select-none group">
                  <Image
                    src="/images/mentora-logo.png"
                    alt="Mentora Logo"
                    width={130}
                    height={52}
                    priority
                    className="h-9 w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-[0_2px_12px_rgba(255,107,53,0.4)]"
                  />
                </Link>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-white hover:bg-white/10"
                >
                  ✕
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
                {[
                  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: <DashGridIcon /> },
                  { id: 'journeys', label: 'Journeys', href: '/dashboard/journeys', icon: <JourneysStackIcon /> },
                  { id: 'courses', label: 'Courses', href: '/dashboard/courses', icon: <CoursesBookIcon /> },
                  { id: 'community', label: 'Community', href: '/dashboard/community', icon: <CommunityPeopleIcon /> },
                  { id: 'leaderboard', label: 'Leaderboard', href: '/dashboard/leaderboard', icon: <LeaderboardPodiumIcon /> },
                  { id: 'passport', label: 'Skill Passport', href: '/dashboard/passport', icon: <PassportBadgeIcon /> },
                  { id: 'mentorship', label: 'Mentorship', href: '/dashboard/mentorship', icon: <MentorshipChatIcon /> },
                  { id: 'kai', label: 'Kai', href: '/dashboard/kai', icon: <KaiSparkleIcon /> },
                  { id: 'settings', label: 'Settings', href: '/dashboard/settings', icon: <SettingsGearIcon /> },
                ].map((item) => {
                  const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setDrawerOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all ${
                        active
                          ? 'bg-[#FF6B35]/20 text-[#FF6B35] font-bold shadow-sm'
                          : 'text-stone-400 hover:text-stone-200 hover:bg-white/5 font-medium'
                      }`}
                    >
                      <span className="w-5 h-5 flex items-center justify-center">{item.icon}</span>
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Bottom Footer */}
              <div className="p-4 border-t space-y-3" style={{ borderColor: isBright ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)' }}>
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold hover:bg-white/5"
                  style={{ color: isBright ? '#44403C' : '#E7E5E4' }}
                >
                  <span className="flex items-center gap-2">
                    {isBright ? <MoonIcon /> : <SunIcon />}
                    <span>{isBright ? 'Dark Mode' : 'Light Mode'}</span>
                  </span>
                </button>
                <div className="flex items-center gap-3 pt-1">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow" style={{ background: 'linear-gradient(135deg, #FF6B35, #FFA07A)' }}>
                    AJ
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold truncate" style={{ color: isBright ? '#1C1917' : '#FFF8F0' }}>Alex Johnson</p>
                    <p className="text-[11px] text-stone-400 truncate">Pro Learner · Lvl 7</p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── 5. Go Premium Eduplex Card (Bottom-Left Corner) ───────────────── */}
      <GoPremiumCard />
    </>
  );
}
