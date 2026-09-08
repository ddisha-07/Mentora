'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';

export default function PublicFooter() {
  const { isBright } = useTheme();

  return (
    <footer
      className={`border-t text-xs transition-colors duration-200 ${
        isBright
          ? 'bg-[#F0E6DC] border-[#E2D4C5] text-[#57534E]'
          : 'bg-[#060403] border-orange-950/70 text-zinc-400'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link href="/" className="inline-block group py-0.5">
              <Image
                src="/images/mentora-logo.png"
                alt="Mentora Logo"
                width={130}
                height={65}
                className="h-9 w-auto object-contain drop-shadow-[0_0_10px_rgba(249,115,22,0.3)] group-hover:scale-105 transition-transform duration-300"
              />
            </Link>
            <p className={`text-xs leading-relaxed ${isBright ? 'text-[#57534E]' : 'text-zinc-400'}`}>
              Personalized, level-gated learning ecosystem for software engineers, AI architects, and tech leaders.
            </p>
            <div className={`text-[11px] font-mono ${isBright ? 'text-[#EA580C]' : 'text-orange-500/80'}`}>
              ⚡ Verified skill mastery.
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className={`text-xs font-bold uppercase tracking-wider font-mono ${isBright ? 'text-[#EA580C]' : 'text-orange-400'}`}>
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className={`transition-colors flex items-center gap-1.5 ${isBright ? 'hover:text-[#EA580C]' : 'hover:text-orange-400'}`}>
                  <span className="text-orange-500 text-[10px]">›</span> Home
                </Link>
              </li>
              <li>
                <Link href="/about" className={`transition-colors flex items-center gap-1.5 ${isBright ? 'hover:text-[#EA580C]' : 'hover:text-orange-400'}`}>
                  <span className="text-orange-500 text-[10px]">›</span> About
                </Link>
              </li>
              <li>
                <Link href="/blogs" className={`transition-colors flex items-center gap-1.5 ${isBright ? 'hover:text-[#EA580C]' : 'hover:text-orange-400'}`}>
                  <span className="text-orange-500 text-[10px]">›</span> Blogs
                </Link>
              </li>
              <li>
                <Link href="/faqs" className={`transition-colors flex items-center gap-1.5 ${isBright ? 'hover:text-[#EA580C]' : 'hover:text-orange-400'}`}>
                  <span className="text-orange-500 text-[10px]">›</span> FAQs
                </Link>
              </li>
              <li>
                <Link href="/contact" className={`transition-colors flex items-center gap-1.5 ${isBright ? 'hover:text-[#EA580C]' : 'hover:text-orange-400'}`}>
                  <span className="text-orange-500 text-[10px]">›</span> Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Features */}
          <div className="space-y-3">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${isBright ? 'text-[#1C1917]' : 'text-zinc-200'}`}>
              Platform
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/register" className={`transition-colors ${isBright ? 'hover:text-[#EA580C]' : 'hover:text-orange-400'}`}>Join Now Free</Link>
              </li>
              <li>
                <Link href="/login" className={`transition-colors ${isBright ? 'hover:text-[#EA580C]' : 'hover:text-orange-400'}`}>Learner Login</Link>
              </li>
              <li>
                <Link href="/leaderboard" className={`transition-colors ${isBright ? 'hover:text-[#EA580C]' : 'hover:text-orange-400'}`}>Global Leaderboard</Link>
              </li>
              <li>
                <Link href="/journeys/demo" className={`transition-colors ${isBright ? 'hover:text-[#EA580C]' : 'hover:text-orange-400'}`}>Interactive Roadmap</Link>
              </li>
              <li>
                <Link href="/onboarding" className={`transition-colors ${isBright ? 'hover:text-[#EA580C]' : 'hover:text-orange-400'}`}>Skill Diagnostic</Link>
              </li>
            </ul>
          </div>

          {/* Resources & Support */}
          <div className="space-y-3">
            <h4 className={`text-xs font-bold uppercase tracking-wider ${isBright ? 'text-[#1C1917]' : 'text-zinc-200'}`}>
              Resources
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className={`transition-colors ${isBright ? 'hover:text-[#EA580C]' : 'hover:text-orange-400'}`}>About Us</Link>
              </li>
              <li>
                <Link href="/blogs" className={`transition-colors ${isBright ? 'hover:text-[#EA580C]' : 'hover:text-orange-400'}`}>Engineering Insights</Link>
              </li>
              <li>
                <Link href="/why-mentora" className={`transition-colors ${isBright ? 'hover:text-[#EA580C]' : 'hover:text-orange-400'}`}>Why Mentora</Link>
              </li>
              <li>
                <Link href="/faqs" className={`transition-colors ${isBright ? 'hover:text-[#EA580C]' : 'hover:text-orange-400'}`}>Platform FAQs</Link>
              </li>
              <li>
                <Link href="/contact" className={`transition-colors ${isBright ? 'hover:text-[#EA580C]' : 'hover:text-orange-400'}`}>Contact Support</Link>
              </li>
            </ul>
          </div>
        </div>

        <div
          className={`mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isBright ? 'border-[#E2D4C5] text-[#78716C]' : 'border-orange-950/40 text-zinc-500'
          }`}
        >
          <p suppressHydrationWarning>© {new Date().getFullYear()} Mentora AI. All rights reserved.</p>
          <div className="flex items-center gap-6 text-[11px]">
            <span className={`cursor-pointer transition-colors ${isBright ? 'hover:text-[#EA580C]' : 'hover:text-orange-400/80'}`}>
              Privacy Policy
            </span>
            <span className={`cursor-pointer transition-colors ${isBright ? 'hover:text-[#EA580C]' : 'hover:text-orange-400/80'}`}>
              Terms of Service
            </span>
            <span className="text-emerald-600 dark:text-emerald-400/90 flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Systems Online
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
