'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Blogs', href: '/blogs' },
    { name: 'Leaderboard', href: '/leaderboard' },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0705]/85 border-b border-orange-950/60 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-orange-600 p-[1.5px] shadow-lg shadow-orange-500/25 group-hover:shadow-orange-500/45 transition-all">
              <div className="w-full h-full bg-[#0d0906] rounded-[10px] flex items-center justify-center">
                <span className="font-pixel text-xs text-orange-400 font-bold">
                  M
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-orange-100 to-amber-200 bg-clip-text text-transparent">
                Mentora
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-orange-400 -mt-0.5 font-semibold">
                Adaptive Learning
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-[#140e09]/80 border border-orange-900/40 px-4 py-1.5 rounded-full backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-orange-600/30 to-amber-600/30 border border-orange-500/50 text-orange-200 shadow-sm shadow-orange-950/40'
                      : 'text-zinc-300 hover:text-white hover:bg-orange-950/30'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-xs font-semibold text-zinc-300 hover:text-white hover:bg-orange-950/30 border border-transparent hover:border-orange-900/30 rounded-xl transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 rounded-xl shadow-lg shadow-orange-600/30 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span>Start Learning</span>
              <span className="text-sm">→</span>
            </Link>
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/login"
              className="px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white border border-orange-900/40 rounded-lg"
            >
              Sign In
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#140e09] border border-orange-900/40 text-zinc-300 hover:text-white focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown / Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-orange-950/70 bg-[#0c0805]/95 backdrop-blur-2xl px-6 py-5 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-orange-950/60 border border-orange-600/40 text-orange-200'
                      : 'text-zinc-300 hover:bg-[#140e09] hover:text-white'
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />}
                </Link>
              );
            })}
          </div>

          <div className="border-t border-orange-950/80 pt-4 flex flex-col gap-2.5">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-xs font-semibold text-zinc-200 bg-[#140e09] border border-orange-900/40 rounded-xl hover:bg-[#1c130d]"
            >
              Sign In to Your Account
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-3 text-xs font-bold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-orange-600 rounded-xl shadow-lg shadow-orange-600/30"
            >
              Start Learning Free →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
