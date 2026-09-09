'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
}

const DashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.8}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);
const JourneyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.8}>
    <path d="M12 2L2 7l10 5 10-5-10-5z" />
    <path d="M2 17l10 5 10-5" />
    <path d="M2 12l10 5 10-5" />
  </svg>
);
const CoursesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.8}>
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    <line x1="9" y1="7" x2="15" y2="7" />
    <line x1="9" y1="11" x2="13" y2="11" />
  </svg>
);
const CommunityIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.8}>
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
);
const LeaderboardIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.8}>
    <rect x="2" y="14" width="5" height="7" rx="1" />
    <rect x="9.5" y="9" width="5" height="12" rx="1" />
    <rect x="17" y="4" width="5" height="17" rx="1" />
  </svg>
);
const PassportIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.8}>
    <rect x="3" y="2" width="18" height="20" rx="2.5" />
    <circle cx="12" cy="10" r="3" />
    <path d="M7 20a5 5 0 0110 0" />
  </svg>
);
const MentorshipIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.8}>
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);
const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.8}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);
const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.8}>
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.8}>
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
  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.8}>
    <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: <DashIcon /> },
  { id: 'journeys', label: 'Journeys', href: '/dashboard/journeys', icon: <JourneyIcon /> },
  { id: 'courses', label: 'Courses', href: '/dashboard/quizzes', icon: <CoursesIcon /> },
  { id: 'community', label: 'Community', href: '/dashboard/community', icon: <CommunityIcon /> },
  { id: 'leaderboard', label: 'Leaderboard', href: '/dashboard/leaderboard', icon: <LeaderboardIcon /> },
  { id: 'passport', label: 'Skill Passport', href: '/dashboard/passport', icon: <PassportIcon /> },
  { id: 'mentorship', label: 'Mentorship', href: '/dashboard/mentorship', icon: <MentorshipIcon /> },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { isBright, toggleTheme } = useTheme();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  const sidebarBg = isBright
    ? 'linear-gradient(180deg, #1C1410 0%, #231a10 100%)'
    : 'linear-gradient(180deg, #0f0f0f 0%, #181818 100%)';
  const borderColor = 'rgba(255,107,53,0.12)';
  const mutedColor = 'rgba(255,248,240,0.45)';
  const labelColor = 'rgba(255,248,240,0.65)';

  return (
    <aside
      id="dashboard-sidebar"
      className="fixed left-0 top-0 bottom-0 w-[72px] xl:w-[240px] z-40 flex flex-col transition-all duration-300"
      style={{ background: sidebarBg, borderRight: `1px solid ${borderColor}` }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 xl:px-5 pt-6 pb-5 flex-shrink-0">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: 'linear-gradient(135deg, #FF6B35 0%, #E85D2C 100%)',
            boxShadow: '0 4px 14px rgba(255,107,53,0.45)',
          }}
        >
          <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
            <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" />
          </svg>
        </div>
        <span
          className="hidden xl:block text-lg font-bold tracking-tight"
          style={{ color: '#FFF8F0', fontFamily: 'var(--font-geist-sans), sans-serif' }}
        >
          Mentora
        </span>
      </div>

      <div className="mx-3 xl:mx-5 mb-3 h-px flex-shrink-0" style={{ background: borderColor }} />

      {/* Main Nav */}
      <nav className="flex-1 px-2 xl:px-3 space-y-0.5 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.id}
              href={item.href}
              id={`sidebar-${item.id}`}
              className="group relative flex items-center gap-3 px-2.5 xl:px-3.5 py-2.5 rounded-xl transition-all duration-200 hover:bg-white/5"
              style={{
                background: active
                  ? 'linear-gradient(135deg, rgba(255,107,53,0.2) 0%, rgba(232,93,44,0.12) 100%)'
                  : undefined,
                color: active ? '#FF6B35' : mutedColor,
              }}
            >
              {active && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full"
                  style={{ background: '#FF6B35' }}
                />
              )}
              <span
                className="flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
                style={{ color: active ? '#FF6B35' : mutedColor }}
              >
                {item.icon}
              </span>
              <span
                className="hidden xl:block text-sm font-medium truncate"
                style={{ color: active ? '#FF6B35' : labelColor }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Controls */}
      <div className="px-2 xl:px-3 pb-3 space-y-0.5 flex-shrink-0">
        <div className="mx-1 xl:mx-2 mb-2 h-px" style={{ background: borderColor }} />

        {/* Theme toggle */}
        <button
          id="sidebar-theme-toggle"
          onClick={toggleTheme}
          className="group w-full flex items-center gap-3 px-2.5 xl:px-3.5 py-2.5 rounded-xl transition-all duration-200 hover:bg-white/5"
        >
          <span className="flex-shrink-0 transition-transform duration-200 group-hover:scale-105" style={{ color: mutedColor }}>
            {isBright ? <MoonIcon /> : <SunIcon />}
          </span>
          <span className="hidden xl:block text-sm font-medium" style={{ color: labelColor }}>
            {isBright ? 'Dark Mode' : 'Light Mode'}
          </span>
        </button>

        {/* Settings */}
        <Link
          href="/dashboard/settings"
          id="sidebar-settings"
          className="group flex items-center gap-3 px-2.5 xl:px-3.5 py-2.5 rounded-xl transition-all duration-200 hover:bg-white/5"
        >
          <span className="flex-shrink-0 transition-transform duration-200 group-hover:rotate-45 group-hover:scale-105" style={{ color: mutedColor }}>
            <SettingsIcon />
          </span>
          <span className="hidden xl:block text-sm font-medium" style={{ color: labelColor }}>Settings</span>
        </Link>

        {/* Logout */}
        <Link
          href="/"
          id="sidebar-logout"
          className="group flex items-center gap-3 px-2.5 xl:px-3.5 py-2.5 rounded-xl transition-all duration-200 hover:bg-red-500/10"
        >
          <span className="flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" style={{ color: mutedColor }}>
            <LogoutIcon />
          </span>
          <span className="hidden xl:block text-sm font-medium group-hover:text-red-400 transition-colors" style={{ color: labelColor }}>
            Logout
          </span>
        </Link>

        {/* User profile */}
        <div className="mx-1 xl:mx-2 mt-2 mb-1 h-px" style={{ background: borderColor }} />
        <div className="flex items-center gap-3 px-2.5 xl:px-3.5 py-2">
          <div
            className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold"
            style={{ background: 'linear-gradient(135deg, #FF6B35, #E85D2C)', color: '#fff' }}
          >
            AJ
          </div>
          <div className="hidden xl:block min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color: '#FFF8F0' }}>Alex Johnson</p>
            <p className="text-xs truncate" style={{ color: 'rgba(255,248,240,0.38)' }}>Pro Learner · Lvl 7</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
