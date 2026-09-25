'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import { auth } from '@/utils/firebase/client';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import {
  User as UserIcon,
  Mail,
  Shield,
  Bell,
  Sun,
  Moon,
  Sparkles,
  Key,
  Save,
  LogOut,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Award,
  Zap,
  Clock,
  Laptop
} from 'lucide-react';

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

type TabType = 'profile' | 'learning' | 'appearance' | 'security' | 'notifications';

export default function SettingsPage() {
  const router = useRouter();
  const { isBright, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State: Profile
  const [name, setName] = useState('Alex Morgan');
  const [username, setUsername] = useState('alex_cloudarch');
  const [email, setEmail] = useState('alex.morgan@example.com');
  const [roleTitle, setRoleTitle] = useState('Staff Cloud Architect Candidate');
  const [company, setCompany] = useState('FinTech Global');
  const [bio, setBio] = useState('Distributed systems engineer specializing in high-throughput streaming architectures, Kafka, and Byzantine fault resilience.');
  const [githubUrl, setGithubUrl] = useState('https://github.com/alex-cloudarch');
  const [linkedinUrl, setLinkedinUrl] = useState('https://linkedin.com/in/alex-morgan-arch');

  // Form State: Learning Preferences
  const [weeklyGoalHours, setWeeklyGoalHours] = useState(8);
  const [targetRole, setTargetRole] = useState('Senior Cloud Architect');
  const [kaiPersona, setKaiPersona] = useState<'concise' | 'socratic' | 'deep-dive'>('deep-dive');
  const [dailyReminder, setDailyReminder] = useState(true);

  // Form State: Notifications
  const [notifyMilestones, setNotifyMilestones] = useState(true);
  const [notifyLeaderboard, setNotifyLeaderboard] = useState(true);
  const [notifyMentorship, setNotifyMentorship] = useState(true);
  const [weeklyEmailDigest, setWeeklyEmailDigest] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      if (user) {
        setCurrentUser(user);
        if (user.displayName) setName(user.displayName);
        if (user.email) setEmail(user.email);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setToastMessage('Settings successfully saved and synced with Mentora cloud.');
      setTimeout(() => setToastMessage(null), 4000);
    }, 600);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const bgPage = isBright ? '#FFF8F0' : '#111010';
  const cardBg = isBright ? '#FFFFFF' : '#1C1916';
  const cardBorder = isBright ? 'rgba(234,88,12,0.12)' : 'rgba(255,107,53,0.1)';
  const textPrimary = isBright ? '#1C1917' : '#FFF8F0';
  const textMuted = isBright ? '#78716C' : 'rgba(255,248,240,0.55)';
  const inputBg = isBright ? '#FDF8F3' : '#141210';
  const inputBorder = isBright ? 'rgba(234,88,12,0.18)' : 'rgba(255,107,53,0.18)';

  return (
    <div
      id="settings-page"
      className="min-h-screen flex"
      style={{ background: bgPage, fontFamily: 'var(--font-geist-sans), sans-serif' }}
    >
      <DashboardSidebar />

      <main className="flex-1 ml-[76px] lg:ml-[84px] min-h-screen overflow-y-auto px-4 sm:px-6 lg:px-10 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Toast Notification */}
          {toastMessage && (
            <div className="p-4 rounded-2xl bg-orange-950/90 border border-orange-500/70 text-orange-200 text-sm font-medium shadow-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-3">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                {toastMessage}
              </span>
              <button
                onClick={() => setToastMessage(null)}
                className="text-orange-400 hover:text-white font-bold ml-4"
              >
                ✕
              </button>
            </div>
          )}

          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-orange-500/10 pb-6">
            <div className="space-y-1.5">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: textPrimary }}>
                Settings & Profile
              </h1>
              <p className="text-sm max-w-2xl" style={{ color: textMuted }}>
                Configure your verified engineering credentials, target milestones, Kai AI assistant preferences, and security settings.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#FF6B35] to-[#FFA07A] hover:brightness-110 shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>

          {/* User Quick Identity Pill */}
          <div
            className="p-6 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition-all shadow-md"
            style={{ background: cardBg, borderColor: cardBorder }}
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FF6B35] to-[#FFA07A] flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-orange-500/30">
                {name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold" style={{ color: textPrimary }}>
                    {name}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-semibold bg-orange-500/10 text-[#FF6B35] border border-orange-500/20">
                    Lvl 4 Architect
                  </span>
                </div>
                <p className="text-xs font-mono" style={{ color: textMuted }}>
                  @{username} · {email}
                </p>
                <p className="text-xs mt-1" style={{ color: textMuted }}>
                  {roleTitle} at {company}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/passport"
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-orange-500/20 hover:border-orange-500/50 transition-all flex items-center gap-1.5"
                style={{ color: textPrimary }}
              >
                <Award className="w-3.5 h-3.5 text-[#FF6B35]" />
                <span>View Skill Passport</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-orange-500/10 pb-2 overflow-x-auto">
            {[
              { id: 'profile', label: 'Profile & Bio', icon: <UserIcon className="w-4 h-4" /> },
              { id: 'learning', label: 'Learning & Kai AI', icon: <Sparkles className="w-4 h-4" /> },
              { id: 'appearance', label: 'Appearance', icon: isBright ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" /> },
              { id: 'security', label: 'Security & Auth', icon: <Key className="w-4 h-4" /> },
              { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#FF6B35] text-white shadow-md shadow-orange-500/20'
                      : 'hover:bg-orange-500/5'
                  }`}
                  style={{ color: isActive ? '#FFFFFF' : textMuted }}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: Profile & Bio */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div
                className="p-6 sm:p-8 rounded-3xl border space-y-6"
                style={{ background: cardBg, borderColor: cardBorder }}
              >
                <h3 className="text-base font-bold flex items-center gap-2" style={{ color: textPrimary }}>
                  <UserIcon className="w-4 h-4 text-[#FF6B35]" />
                  Public Engineering Profile
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold" style={{ color: textMuted }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-[#FF6B35] transition-all"
                      style={{ background: inputBg, borderColor: inputBorder, color: textPrimary }}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold" style={{ color: textMuted }}>
                      Public Handle / Username
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-2.5 text-xs text-orange-500 font-mono">@</span>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full pl-8 pr-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-[#FF6B35] transition-all"
                        style={{ background: inputBg, borderColor: inputBorder, color: textPrimary }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold" style={{ color: textMuted }}>
                      Target Role / Current Title
                    </label>
                    <input
                      type="text"
                      value={roleTitle}
                      onChange={(e) => setRoleTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-[#FF6B35] transition-all"
                      style={{ background: inputBg, borderColor: inputBorder, color: textPrimary }}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold" style={{ color: textMuted }}>
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-[#FF6B35] transition-all"
                      style={{ background: inputBg, borderColor: inputBorder, color: textPrimary }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold" style={{ color: textMuted }}>
                    Professional Bio & Engineering Focus
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-[#FF6B35] transition-all resize-none"
                    style={{ background: inputBg, borderColor: inputBorder, color: textPrimary }}
                  />
                  <p className="text-[11px]" style={{ color: textMuted }}>
                    Displayed on your community posts, peer reviews, and verified Skill Passport.
                  </p>
                </div>

                <div className="pt-4 border-t border-orange-500/10 grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold flex items-center gap-1.5" style={{ color: textMuted }}>
                      <GithubIcon />
                      GitHub Profile URL
                    </label>
                    <input
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-[#FF6B35] transition-all"
                      style={{ background: inputBg, borderColor: inputBorder, color: textPrimary }}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold flex items-center gap-1.5" style={{ color: textMuted }}>
                      <LinkedinIcon />
                      LinkedIn Profile URL
                    </label>
                    <input
                      type="url"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-[#FF6B35] transition-all"
                      style={{ background: inputBg, borderColor: inputBorder, color: textPrimary }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Learning & Kai AI */}
          {activeTab === 'learning' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div
                className="p-6 sm:p-8 rounded-3xl border space-y-6"
                style={{ background: cardBg, borderColor: cardBorder }}
              >
                <h3 className="text-base font-bold flex items-center gap-2" style={{ color: textPrimary }}>
                  <Sparkles className="w-4 h-4 text-[#FF6B35]" />
                  Curriculum & AI Co-Pilot Pacing
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold flex items-center gap-1.5" style={{ color: textMuted }}>
                      <Clock className="w-3.5 h-3.5 text-[#FF6B35]" />
                      Weekly Study Target ({weeklyGoalHours} Hours / Week)
                    </label>
                    <input
                      type="range"
                      min={3}
                      max={25}
                      step={1}
                      value={weeklyGoalHours}
                      onChange={(e) => setWeeklyGoalHours(Number(e.target.value))}
                      className="w-full accent-[#FF6B35] cursor-pointer"
                    />
                    <div className="flex justify-between text-[11px] font-mono" style={{ color: textMuted }}>
                      <span>Casual (3h)</span>
                      <span>Target: {weeklyGoalHours}h</span>
                      <span>Intensive (25h)</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold flex items-center gap-1.5" style={{ color: textMuted }}>
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      Target Engineering Track
                    </label>
                    <select
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl text-sm border focus:outline-none focus:border-[#FF6B35] transition-all"
                      style={{ background: inputBg, borderColor: inputBorder, color: textPrimary }}
                    >
                      <option value="Senior Cloud Architect">Senior Cloud Architect (Enterprise AWS/GCP)</option>
                      <option value="Staff Distributed Systems Engineer">Staff Distributed Systems Engineer</option>
                      <option value="Principal Platform Engineer">Principal Platform Engineer</option>
                      <option value="Full-Stack AI Systems Engineer">Full-Stack AI Systems Engineer</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-orange-500/10 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#FF6B35]">
                    Kai AI Interaction Mode
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        id: 'concise',
                        title: '⚡ Fast & Concise',
                        desc: 'Direct bullet points, production code snippets, and minimal prose.',
                      },
                      {
                        id: 'socratic',
                        title: '🤔 Socratic Mentor',
                        desc: 'Guides you through architecture trade-offs with probing questions.',
                      },
                      {
                        id: 'deep-dive',
                        title: '🔬 Deep-Dive Architect',
                        desc: 'Comprehensive post-mortems, edge-case analysis, and RFC benchmarks.',
                      },
                    ].map((mode) => (
                      <div
                        key={mode.id}
                        onClick={() => setKaiPersona(mode.id as any)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          kaiPersona === mode.id
                            ? 'border-[#FF6B35] bg-orange-500/10 shadow-sm'
                            : 'hover:border-orange-500/30'
                        }`}
                        style={{
                          background: kaiPersona === mode.id ? undefined : inputBg,
                          borderColor: kaiPersona === mode.id ? undefined : inputBorder,
                        }}
                      >
                        <h5 className="text-xs font-bold" style={{ color: textPrimary }}>
                          {mode.title}
                        </h5>
                        <p className="text-[11px] mt-1" style={{ color: textMuted }}>
                          {mode.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Appearance */}
          {activeTab === 'appearance' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div
                className="p-6 sm:p-8 rounded-3xl border space-y-6"
                style={{ background: cardBg, borderColor: cardBorder }}
              >
                <h3 className="text-base font-bold flex items-center gap-2" style={{ color: textPrimary }}>
                  <Sun className="w-4 h-4 text-[#FF6B35]" />
                  Theme & Visual Customization
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => {
                      if (!isBright) toggleTheme();
                    }}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-start gap-4 ${
                      isBright ? 'border-[#FF6B35] bg-orange-500/10 shadow-md' : 'hover:border-orange-500/30'
                    }`}
                    style={{
                      background: isBright ? undefined : inputBg,
                      borderColor: isBright ? undefined : inputBorder,
                    }}
                  >
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
                      <Sun className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold" style={{ color: textPrimary }}>
                        Bright Warm Mode
                      </h4>
                      <p className="text-xs mt-1" style={{ color: textMuted }}>
                        Soft parchment ivory backdrop with terracotta accents, optimized for daylight study.
                      </p>
                      {isBright && (
                        <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FF6B35] text-white">
                          Active
                        </span>
                      )}
                    </div>
                  </div>

                  <div
                    onClick={() => {
                      if (isBright) toggleTheme();
                    }}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all flex items-start gap-4 ${
                      !isBright ? 'border-[#FF6B35] bg-orange-500/10 shadow-md' : 'hover:border-orange-500/30'
                    }`}
                    style={{
                      background: !isBright ? undefined : inputBg,
                      borderColor: !isBright ? undefined : inputBorder,
                    }}
                  >
                    <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400">
                      <Moon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold" style={{ color: textPrimary }}>
                        Deep Obsidian & Warm Charcoal
                      </h4>
                      <p className="text-xs mt-1" style={{ color: textMuted }}>
                        Ultra low-fatigue dark palette with radiant coral focus indicators.
                      </p>
                      {!isBright && (
                        <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FF6B35] text-white">
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border flex items-center justify-between" style={{ background: inputBg, borderColor: inputBorder }}>
                  <div className="space-y-0.5">
                    <h5 className="text-xs font-bold" style={{ color: textPrimary }}>
                      Dock Animation Physics
                    </h5>
                    <p className="text-[11px]" style={{ color: textMuted }}>
                      High-response spring physics with in-place sequence encircling on the left navigation dock.
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Active (Stiffness: 380)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Security & Auth */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div
                className="p-6 sm:p-8 rounded-3xl border space-y-6"
                style={{ background: cardBg, borderColor: cardBorder }}
              >
                <h3 className="text-base font-bold flex items-center gap-2" style={{ color: textPrimary }}>
                  <Key className="w-4 h-4 text-[#FF6B35]" />
                  Authentication & Cloud Credentials
                </h3>

                <div className="p-4 rounded-2xl border space-y-3" style={{ background: inputBg, borderColor: inputBorder }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold" style={{ color: textPrimary }}>
                        Primary Firebase Authentication Account
                      </h4>
                      <p className="text-xs mt-0.5" style={{ color: textMuted }}>
                        {currentUser?.email || email}
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Verified Session
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-orange-500/80">
                    Project: mentora-932c5 · Provider: {currentUser?.providerData[0]?.providerId || 'password'}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold" style={{ color: textPrimary }}>
                    Security Actions
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setToastMessage('Password reset email dispatched to ' + (currentUser?.email || email));
                      }}
                      className="px-4 py-3 rounded-xl border text-xs font-bold text-left hover:border-orange-500/40 transition-all flex items-center justify-between"
                      style={{ background: inputBg, borderColor: inputBorder, color: textPrimary }}
                    >
                      <span>Send Password Reset Email</span>
                      <Mail className="w-4 h-4 text-[#FF6B35]" />
                    </button>

                    <button
                      onClick={handleSignOut}
                      className="px-4 py-3 rounded-xl border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 text-rose-500 text-xs font-bold text-left transition-all flex items-center justify-between cursor-pointer"
                    >
                      <span>Sign Out from All Devices</span>
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-rose-500/10">
                  <div className="p-5 rounded-2xl border border-rose-500/20 bg-rose-500/5 space-y-3">
                    <div className="flex items-center gap-2 text-rose-500 font-bold text-xs">
                      <Trash2 className="w-4 h-4" />
                      <span>Danger Zone</span>
                    </div>
                    <p className="text-xs text-rose-400/80">
                      Deleting your account permanently revokes your cryptographic Skill Passport keys, milestone certificates, and leaderboard rank.
                    </p>
                    <button
                      onClick={() => {
                        alert('To request account deletion, please contact compliance@mentora.dev or use the admin panel.');
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-all cursor-pointer"
                    >
                      Request Account Deletion
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div
                className="p-6 sm:p-8 rounded-3xl border space-y-6"
                style={{ background: cardBg, borderColor: cardBorder }}
              >
                <h3 className="text-base font-bold flex items-center gap-2" style={{ color: textPrimary }}>
                  <Bell className="w-4 h-4 text-[#FF6B35]" />
                  Notification Channels & Alerts
                </h3>

                <div className="space-y-4">
                  {[
                    {
                      title: 'Milestone Gate & Skill Passport Verification',
                      desc: 'Alert when a code audit passes and a cryptographic badge is minted.',
                      checked: notifyMilestones,
                      toggle: () => setNotifyMilestones(!notifyMilestones),
                    },
                    {
                      title: 'Weekly Leaderboard & Streak Status',
                      desc: 'Weekly summary of XP velocity, current streak protections, and cohort rank.',
                      checked: notifyLeaderboard,
                      toggle: () => setNotifyLeaderboard(!notifyLeaderboard),
                    },
                    {
                      title: 'Mentorship Session Reminders',
                      desc: '15-minute advance alert for scheduled 1-on-1 Staff Architect reviews.',
                      checked: notifyMentorship,
                      toggle: () => setNotifyMentorship(!notifyMentorship),
                    },
                    {
                      title: 'Architectural Digest Email',
                      desc: 'Curated breakdown of top community post-mortems and system design RFCs.',
                      checked: weeklyEmailDigest,
                      toggle: () => setWeeklyEmailDigest(!weeklyEmailDigest),
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border flex items-center justify-between gap-4"
                      style={{ background: inputBg, borderColor: inputBorder }}
                    >
                      <div>
                        <h4 className="text-xs font-bold" style={{ color: textPrimary }}>
                          {item.title}
                        </h4>
                        <p className="text-[11px] mt-0.5" style={{ color: textMuted }}>
                          {item.desc}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={item.toggle}
                        className="w-4 h-4 accent-[#FF6B35] cursor-pointer"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
