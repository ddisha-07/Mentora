'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';

export default function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isBright, toggleTheme } = useTheme();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Blogs', href: '/blogs' },
    { name: 'FAQs', href: '/faqs' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Admin', href: '/admin' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-xl border-b transition-colors duration-200 ${
        isBright
          ? 'bg-[#FAF4EE]/90 border-[#E8DACD] shadow-xs'
          : 'bg-[#0a0705]/85 border-orange-950/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center group py-1">
            <Image
              src="/images/mentora-logo.png"
              alt="Mentora Logo"
              width={140}
              height={70}
              priority
              className="h-10 sm:h-11 w-auto object-contain drop-shadow-[0_0_12px_rgba(249,115,22,0.4)] group-hover:scale-105 transition-transform duration-300"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className={`hidden lg:flex items-center gap-1 px-4 py-1.5 rounded-full backdrop-blur-md transition-colors ${
              isBright
                ? 'bg-white/80 border border-[#E5D7CB] shadow-xs'
                : 'bg-[#140e09]/80 border border-orange-900/40'
            }`}
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isActive
                      ? isBright
                        ? 'bg-[#EA580C] text-white shadow-sm shadow-orange-500/25'
                        : 'bg-gradient-to-r from-orange-600/30 to-amber-600/30 border border-orange-500/50 text-orange-200 shadow-sm shadow-orange-950/40'
                      : isBright
                      ? 'text-[#44403C] hover:text-[#EA580C] hover:bg-[#F5ECE2]'
                      : 'text-zinc-300 hover:text-white hover:bg-orange-950/30'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA Action Buttons with Bright Mode Option before Login */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Theme Toggle Button placed right before Login */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isBright ? 'Switch to Dark Mode' : 'Switch to Bright Mode'}
              title={isBright ? 'Switch to Dark Mode' : 'Switch to Bright Mode'}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                isBright
                  ? 'bg-white text-[#2D241E] hover:text-[#EA580C] border border-[#E3D4C5] hover:border-orange-300 shadow-xs'
                  : 'bg-[#140e09] text-zinc-300 hover:text-amber-300 border border-orange-900/40 hover:border-amber-500/50 shadow-xs'
              }`}
            >
              <span className="text-sm transition-transform duration-300 group-hover:scale-110">
                {isBright ? '☀️' : '🌙'}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wider font-bold">
                {isBright ? 'Bright' : 'Dark'}
              </span>
            </button>

            {/* Login Button */}
            <Link
              href="/login"
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                isBright
                  ? 'text-[#2D241E] hover:text-[#EA580C] hover:bg-white border border-[#E3D4C5] bg-white/70 shadow-xs'
                  : 'text-zinc-300 hover:text-white hover:bg-orange-950/30 border border-transparent hover:border-orange-900/30'
              }`}
            >
              Login
            </Link>

            {/* Join Now CTA */}
            <Link
              href="/register"
              className={`px-5 py-2.5 text-xs font-bold rounded-xl active:scale-95 transition-all flex items-center gap-1.5 font-mono uppercase tracking-wider ${
                isBright
                  ? 'text-white bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/30'
                  : 'text-black bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-300 hover:to-orange-400 shadow-lg shadow-orange-600/30'
              }`}
            >
              <span>Join Now</span>
              <span className="text-sm">→</span>
            </Link>
          </div>

          {/* Mobile Actions: Bright Mode Toggle & Hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            {/* Theme Toggle Button placed right before Login in Mobile */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isBright ? 'Switch to Dark Mode' : 'Switch to Bright Mode'}
              title={isBright ? 'Switch to Dark Mode' : 'Switch to Bright Mode'}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isBright
                  ? 'bg-white text-[#2D241E] border border-[#E3D4C5]'
                  : 'bg-[#140e09] text-zinc-300 border border-orange-900/40'
              }`}
            >
              <span className="text-xs">{isBright ? '☀️' : '🌙'}</span>
              <span className="font-mono text-[10px] uppercase font-bold">{isBright ? 'Bright' : 'Dark'}</span>
            </button>

            <Link
              href="/login"
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
                isBright
                  ? 'text-[#2D241E] hover:text-[#EA580C] bg-white border border-[#E3D4C5]'
                  : 'text-zinc-300 hover:text-white border border-orange-900/40'
              }`}
            >
              Login
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl border focus:outline-none ${
                isBright
                  ? 'bg-white border-[#E3D4C5] text-[#2D241E] hover:text-[#EA580C]'
                  : 'bg-[#140e09] border-orange-900/40 text-zinc-300 hover:text-white'
              }`}
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
        <div
          className={`lg:hidden border-t px-6 py-5 space-y-4 animate-in slide-in-from-top-2 duration-200 ${
            isBright
              ? 'bg-[#FAF4EE]/98 backdrop-blur-2xl border-[#E8DACD]'
              : 'bg-[#0c0805]/95 backdrop-blur-2xl border-orange-950/70'
          }`}
        >
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
                      ? isBright
                        ? 'bg-[#FFF0E5] border border-[#FCD8C1] text-[#EA580C]'
                        : 'bg-orange-950/60 border border-orange-600/40 text-orange-200'
                      : isBright
                      ? 'text-[#2D241E] hover:bg-[#F5ECE2] hover:text-[#EA580C]'
                      : 'text-zinc-300 hover:bg-[#140e09] hover:text-white'
                  }`}
                >
                  <span>{link.name}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
                </Link>
              );
            })}
          </div>

          <div
            className={`border-t pt-4 flex flex-col gap-2.5 ${
              isBright ? 'border-[#E8DACD]' : 'border-orange-950/80'
            }`}
          >
            <div className="flex items-center justify-between px-2 py-1">
              <span className={`text-xs font-semibold ${isBright ? 'text-[#57534E]' : 'text-zinc-400'}`}>
                Theme Mode:
              </span>
              <button
                type="button"
                onClick={toggleTheme}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${
                  isBright
                    ? 'bg-white border border-[#E3D4C5] text-[#2D241E]'
                    : 'bg-[#140e09] border border-orange-900/40 text-zinc-300'
                }`}
              >
                <span>{isBright ? '☀️ Bright Mode' : '🌙 Dark Mode'}</span>
              </button>
            </div>

            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className={`w-full text-center py-2.5 text-xs font-semibold rounded-xl ${
                isBright
                  ? 'text-[#2D241E] bg-white border border-[#E3D4C5] hover:bg-[#F5ECE2]'
                  : 'text-zinc-200 bg-[#140e09] border border-orange-900/40 hover:bg-[#1c130d]'
              }`}
            >
              Login
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className={`w-full text-center py-3 text-xs font-bold rounded-xl font-mono uppercase tracking-wider ${
                isBright
                  ? 'text-white bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 shadow-md shadow-orange-500/30'
                  : 'text-black bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 shadow-lg shadow-orange-600/30'
              }`}
            >
              Join Now →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
