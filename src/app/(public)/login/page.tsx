'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to sign in');
      }

      // Check onboarding state
      if (data.user?.onboardingComplete === false) {
        router.push('/onboarding');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md space-y-6">
        {/* Header with Logo */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block group mb-1">
            <Image
              src="/images/mentora-logo.png"
              alt="Mentora"
              width={160}
              height={90}
              className="h-14 w-auto mx-auto object-contain drop-shadow-[0_0_18px_rgba(249,115,22,0.4)] group-hover:scale-105 transition-transform duration-300"
              priority
            />
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">Welcome back</h1>
          <p className="text-xs sm:text-sm text-zinc-400">Sign in to resume your personalized learning roadmap</p>
        </div>

        {/* Card with subtle gradient border */}
        <div className="p-[1px] rounded-3xl bg-gradient-to-b from-orange-500/40 via-amber-500/20 to-orange-950/60 shadow-2xl shadow-orange-950/50">
          <div className="rounded-[23px] bg-[#0d0906]/95 backdrop-blur-xl p-6 sm:p-8 space-y-5 border border-orange-950/50">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-zinc-300 font-semibold block">Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#140e08] border border-orange-900/40 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-300 font-semibold">Password</label>
                  <span className="text-[11px] text-orange-400 hover:text-orange-300 cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#140e08] border border-orange-900/40 text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-300 hover:to-orange-400 text-black font-bold text-xs font-mono uppercase tracking-wider shadow-lg shadow-orange-600/30 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In to Mentora'}
              </button>
            </form>

            <div className="pt-2 text-center text-xs text-zinc-400">
              New to Mentora?{' '}
              <Link href="/register" className="text-orange-400 font-bold hover:underline">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
