'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { formatAuthError } from '@/utils/firebase/errors';
export default function RegisterPage() {
  const router = useRouter();
  const { isBright } = useTheme();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetRole, setTargetRole] = useState('Senior AI Systems Architect');
  const [experienceLevel, setExperienceLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignUp = async () => {
    setError(null);
    setGoogleLoading(true);

    try {
      const { signInWithPopup, GoogleAuthProvider } = await import('firebase/auth');
      const { auth } = await import('@/utils/firebase/client');
      
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const idToken = await userCredential.user.getIdToken();
      
      // We still need to create a session and maybe run some onboarding for Google users.
      // Send the token and role data to the server
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          idToken,
          isGoogle: true,
          targetRole,
          experienceLevel,
          role: 'learner',
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to finish Google sign up');
      }
      
      window.location.href = '/onboarding';
    } catch (err: any) {
      console.error('Google Sign-Up Error:', err);
      setError(formatAuthError(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
      const { auth } = await import('@/utils/firebase/client');
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: fullName });
      const idToken = await userCredential.user.getIdToken();

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idToken,
          fullName,
          targetRole,
          experienceLevel,
          role: 'learner',
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create account');
      }

      window.location.href = '/onboarding';
    } catch (err: any) {
      console.error('Registration Error:', err);
      setError(formatAuthError(err));
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
                className={`p-3.5 rounded-xl text-xs font-medium border leading-relaxed ${
                  isBright
                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                    : 'bg-rose-950/60 border-rose-800 text-rose-300'
                }`}
              >
                {error}
              </div>
            )}

            {/* Google Sign-up Button */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={loading || googleLoading}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-3 border transition-all duration-200 active:scale-[0.98] disabled:opacity-50 cursor-pointer ${
                isBright
                  ? 'bg-white border-[#E3D4C5] text-[#1C1917] hover:bg-orange-50/50 hover:border-orange-300 shadow-xs'
                  : 'bg-[#140e08] border-orange-900/40 text-white hover:bg-orange-950/30 hover:border-orange-500/50 shadow-sm'
              }`}
            >
              {googleLoading ? (
                <span className="flex items-center gap-2 text-zinc-300">
                  <svg className="animate-spin h-4 w-4 text-orange-500" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>Connecting to Google...</span>
                </span>
              ) : (
                <>
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Sign up with Google</span>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-3">
              <div className={`w-full border-t ${isBright ? 'border-stone-200' : 'border-orange-950/60'}`} />
              <span
                className={`absolute px-3 text-[10px] uppercase font-mono tracking-widest ${
                  isBright ? 'bg-white text-stone-400' : 'bg-[#0d0906] text-zinc-500'
                }`}
              >
                or register with email
              </span>
            </div>

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
