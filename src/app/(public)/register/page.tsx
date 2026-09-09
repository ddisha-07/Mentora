'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';

export default function RegisterPage() {
  const router = useRouter();
  const { isBright } = useTheme();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetRole, setTargetRole] = useState('Senior AI Systems Architect');
  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          password,
          targetRole,
          experienceLevel,
          role: 'learner',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      // Auto login after register
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (loginRes.ok) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-6">
        {/* Header with Logo */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block group mb-1">
            <Image
              src="/images/mentora-logo.png"
              alt="Mentora"
              width={160}
              height={90}
              className="h-14 w-auto mx-auto object-contain group-hover:scale-105 transition-transform duration-300"
              priority
            />
          </Link>
          <h1
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight transition-colors ${
              isBright ? 'text-[#1C1917]' : 'text-white'
            }`}
          >
            Start your learning journey
          </h1>
          <p
            className={`text-xs sm:text-sm transition-colors ${
              isBright ? 'text-[#57534E]' : 'text-zinc-400'
            }`}
          >
            Create your profile to generate your 3-level personalized roadmap
          </p>
        </div>

        {/* Card with subtle gradient border */}
        <div
          className={`p-[1px] rounded-3xl transition-all ${
            isBright
              ? 'bg-gradient-to-b from-orange-400/40 via-[#EAE0D5] to-transparent shadow-xl shadow-orange-950/5'
              : 'bg-gradient-to-b from-orange-500/40 via-amber-500/20 to-orange-950/60 shadow-2xl shadow-orange-950/50'
          }`}
        >
          <div
            className={`rounded-[23px] backdrop-blur-xl p-6 sm:p-8 space-y-5 border transition-colors ${
              isBright
                ? 'bg-white border-[#EAE0D5] shadow-sm'
                : 'bg-[#0d0906]/95 border-orange-950/50'
            }`}
          >
            {error && (
              <div
                className={`p-3.5 rounded-xl text-xs font-medium border ${
                  isBright
                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                    : 'bg-rose-950/60 border-rose-800 text-rose-300'
                }`}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label
                  className={`font-semibold block transition-colors ${
                    isBright ? 'text-[#1C1917]' : 'text-zinc-300'
                  }`}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Alex Morgan"
                  className={`w-full px-3.5 py-2.5 rounded-xl border transition-colors focus:outline-none ${
                    isBright
                      ? 'bg-white border-[#E3D4C5] text-[#1C1917] placeholder-[#A8A29E] focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-2xs'
                      : 'bg-[#140e08] border-orange-900/40 text-white placeholder-zinc-500 focus:border-orange-500'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  className={`font-semibold block transition-colors ${
                    isBright ? 'text-[#1C1917]' : 'text-zinc-300'
                  }`}
                >
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className={`w-full px-3.5 py-2.5 rounded-xl border transition-colors focus:outline-none ${
                    isBright
                      ? 'bg-white border-[#E3D4C5] text-[#1C1917] placeholder-[#A8A29E] focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-2xs'
                      : 'bg-[#140e08] border-orange-900/40 text-white placeholder-zinc-500 focus:border-orange-500'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  className={`font-semibold block transition-colors ${
                    isBright ? 'text-[#1C1917]' : 'text-zinc-300'
                  }`}
                >
                  Password (min. 6 chars)
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full px-3.5 py-2.5 rounded-xl border transition-colors focus:outline-none ${
                    isBright
                      ? 'bg-white border-[#E3D4C5] text-[#1C1917] placeholder-[#A8A29E] focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-2xs'
                      : 'bg-[#140e08] border-orange-900/40 text-white placeholder-zinc-500 focus:border-orange-500'
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  className={`font-semibold block transition-colors ${
                    isBright ? 'text-[#1C1917]' : 'text-zinc-300'
                  }`}
                >
                  Target Career Role
                </label>
                <select
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border transition-colors focus:outline-none ${
                    isBright
                      ? 'bg-white border-[#E3D4C5] text-[#1C1917] focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 shadow-2xs'
                      : 'bg-[#140e08] border-orange-900/40 text-white focus:border-orange-500'
                  }`}
                >
                  <option value="Senior AI Systems Architect">Senior AI Systems Architect</option>
                  <option value="AI Product Lead">AI Product Lead</option>
                  <option value="Senior MLOps Engineer">Senior MLOps Engineer</option>
                  <option value="Full-Stack AI Developer">Full-Stack AI Developer</option>
                  <option value="Data & Analytics Strategist">Data & Analytics Strategist</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label
                  className={`font-semibold block transition-colors ${
                    isBright ? 'text-[#1C1917]' : 'text-zinc-300'
                  }`}
                >
                  Current Experience Level
                </label>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {(['beginner', 'intermediate', 'advanced'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setExperienceLevel(lvl)}
                      style={isBright && experienceLevel === lvl ? { color: '#ffffff' } : undefined}
                      className={`py-2 px-2 rounded-xl border text-center capitalize text-xs font-semibold transition-all cursor-pointer ${
                        experienceLevel === lvl
                          ? isBright
                            ? 'bg-[#EA580C] border-[#EA580C] text-white shadow-sm shadow-orange-500/30'
                            : 'bg-orange-600/30 border-orange-400 text-white shadow-sm'
                          : isBright
                          ? 'bg-white border-[#E3D4C5] text-[#57534E] hover:text-[#1C1917] hover:border-orange-300'
                          : 'bg-[#140e08] border-orange-900/40 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={isBright ? { color: '#ffffff' } : undefined}
                className={`w-full py-3.5 mt-4 rounded-xl font-bold text-xs font-mono uppercase tracking-wider active:scale-95 transition-all disabled:opacity-50 text-white ${
                  isBright
                    ? 'bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/30'
                    : 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-300 hover:to-orange-400 text-black shadow-lg shadow-orange-600/30'
                }`}
              >
                {loading ? 'Creating Account & Roadmap...' : 'Start Learning Free →'}
              </button>
            </form>

            <div
              className={`pt-2 text-center text-xs transition-colors ${
                isBright ? 'text-[#57534E]' : 'text-zinc-400'
              }`}
            >
              Already have an account?{' '}
              <Link
                href="/login"
                className={`font-bold hover:underline ${
                  isBright ? 'text-[#EA580C]' : 'text-orange-400'
                }`}
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
