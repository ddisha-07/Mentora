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

  // Content matches website, with Admin removed as requested
  const navLinks = [
    { name: 'HOME', href: '/' },
    { name: 'ABOUT', href: '/about' },
    { name: 'BLOGS', href: '/blogs' },
    { name: 'FAQS', href: '/faqs' },
    { name: 'CONTACT US', href: '/contact' },
    { name: 'KAI', href: '/dashboard/kai' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors duration-200 ${
        isBright
          ? 'bg-[#FF5500] text-black border-b border-black/10'
          : 'bg-[#090604] text-white border-b border-orange-500/20'
      }`}
    >
      <div className="w-full max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-14">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Left: Motion.dev style logo */}
          <Link href="/" className="flex items-center select-none shrink-0 group">
            <Image
              src="/images/mentora-logo.png"
              alt="Mentora Logo"
              width={140}
              height={60}
              priority
              className={`h-9 sm:h-10 w-auto object-contain select-none transition-transform group-hover:scale-105 ${
                isBright ? 'brightness-0' : ''
              }`}
            />
          </Link>

          {/* Center: Motion.dev style clean monospaced text links */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-12">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs font-mono font-bold tracking-widest uppercase transition-opacity ${
                    isBright
                      ? isActive
                        ? 'text-black font-extrabold underline underline-offset-8 decoration-2'
                        : 'text-black/80 hover:text-black hover:opacity-100'
                      : isActive
                      ? 'text-[#FF5500] font-extrabold underline underline-offset-8 decoration-2'
                      : 'text-zinc-300 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right: Search icon, Theme toggle, Login, & Motion.dev style sharp black CTA */}
          <div className="hidden sm:flex items-center gap-6">
            
            {/* Search Icon */}
            <button
              type="button"
              aria-label="Search"
              className={`p-1 transition-opacity ${
                isBright ? 'text-black hover:opacity-70' : 'text-zinc-300 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4 stroke-[2.5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={isBright ? 'Switch to Dark Mode' : 'Switch to Bright Mode'}
              title={isBright ? 'Switch to Dark Mode' : 'Switch to Bright Mode'}
              className={`p-1 text-base transition-transform active:scale-90 ${
                isBright ? 'text-black hover:opacity-75' : 'text-amber-400 hover:opacity-90'
              }`}
            >
              <span className="select-none">{isBright ? '☀️' : '🌙'}</span>
            </button>

            {/* Login Link */}
            <Link
              href="/login"
              className={`text-xs font-mono font-bold tracking-widest uppercase transition-opacity ${
                isBright ? 'text-black hover:opacity-75' : 'text-zinc-300 hover:text-white'
              }`}
            >
              LOGIN
            </Link>

            {/* Motion.dev style Sharp Black Rectangular CTA Button */}
            <Link
              href="/register"
              className={`px-5 py-2.5 text-xs font-mono font-black tracking-widest uppercase transition-all duration-150 active:scale-95 ${
                isBright
                  ? 'bg-black text-white hover:bg-zinc-900 shadow-md'
                  : 'bg-[#FF5500] text-black hover:bg-[#ff6514] font-black shadow-lg shadow-orange-600/30'
              }`}
            >
              JOIN NOW →
            </Link>

          </div>

          {/* Mobile Actions Hamburger */}
          <div className="flex sm:hidden items-center gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-1 text-sm ${isBright ? 'text-black' : 'text-amber-400'}`}
            >
              {isBright ? '☀️' : '🌙'}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-1.5 ${isBright ? 'text-black' : 'text-white'}`}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6 stroke-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className={`lg:hidden border-t px-6 py-6 space-y-4 animate-in slide-in-from-top-2 duration-200 ${
            isBright ? 'bg-[#FF5500] border-black/10 text-black' : 'bg-[#090604] border-orange-950/80 text-white'
          }`}
        >
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-xs font-mono font-bold tracking-widest uppercase ${
                    isActive ? (isBright ? 'text-black font-black underline' : 'text-[#FF5500] font-black underline') : ''
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="border-t border-black/10 pt-4 flex flex-col gap-3">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-mono font-bold tracking-widest uppercase"
            >
              LOGIN
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-center py-3 text-xs font-mono font-black tracking-widest uppercase ${
                isBright ? 'bg-black text-white' : 'bg-[#FF5500] text-black'
              }`}
            >
              JOIN NOW →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
