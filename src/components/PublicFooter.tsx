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
          ? 'bg-[#F2E8DE] border-[#E5D7C8] text-[#57534E]'
          : 'bg-[#070503] border-orange-950/70 text-zinc-400'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Brand & Mission Column (6 cols) */}
          <div className="md:col-span-6 lg:col-span-6 space-y-4 max-w-lg">
            <Link href="/" className="relative inline-flex items-center group py-0.5 select-none">
              <div className="relative animate-mentora-logo transition-transform duration-300 ease-out group-hover:scale-105 group-active:scale-95">
                <Image
                  src="/images/mentora-logo.png"
                  alt="Mentora Logo"
                  width={135}
                  height={68}
                  className="h-9 sm:h-10 w-auto object-contain select-none transition-transform duration-300"
                />
                <div className="absolute inset-0 pointer-events-none logo-shine-mask overflow-hidden">
                  <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/70 to-transparent skew-x-[-25deg] animate-mentora-shine" />
                </div>
              </div>
            </Link>

            <p className={`text-xs sm:text-sm leading-relaxed ${isBright ? 'text-[#57534E]' : 'text-zinc-400'}`}>
              Personalized learning and development built for working professionals. We turn career growth into a guided, continuous journey that moves with your ambitions.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <span
                className={`inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold px-3 py-1 rounded-full border transition-colors ${
                  isBright
                    ? 'bg-[#FAF4EE] text-[#EA580C] border-[#EADAC9]'
                    : 'bg-orange-950/60 text-orange-300 border-orange-800/50'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                <span>Learn. Grow. Evolve.</span>
              </span>

              <Link
                href="/onboarding"
                className={`text-[11px] font-mono font-medium transition-colors flex items-center gap-1 ${
                  isBright ? 'text-[#EA580C] hover:underline' : 'text-orange-400/90 hover:text-orange-300 hover:underline'
                }`}
              >
                <span>Take Skill Diagnostic</span>
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Quick Links Column (3 cols) */}
          <div className="md:col-span-3 lg:col-span-3 space-y-3.5">
            <h4
              className={`text-xs font-bold uppercase tracking-wider font-mono ${
                isBright ? 'text-[#EA580C]' : 'text-orange-400'
              }`}
            >
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/"
                  className={`group flex items-center gap-2 transition-colors ${
                    isBright ? 'hover:text-[#EA580C]' : 'hover:text-orange-300'
                  }`}
                >
                  <span className="text-orange-500 text-[10px] transition-transform group-hover:translate-x-0.5">›</span>
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className={`group flex items-center gap-2 transition-colors ${
                    isBright ? 'hover:text-[#EA580C]' : 'hover:text-orange-300'
                  }`}
                >
                  <span className="text-orange-500 text-[10px] transition-transform group-hover:translate-x-0.5">›</span>
                  <span>About Mentora</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/why-mentora"
                  className={`group flex items-center gap-2 transition-colors ${
                    isBright ? 'hover:text-[#EA580C]' : 'hover:text-orange-300'
                  }`}
                >
                  <span className="text-orange-500 text-[10px] transition-transform group-hover:translate-x-0.5">›</span>
                  <span>Why Mentora</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/blogs"
                  className={`group flex items-center gap-2 transition-colors ${
                    isBright ? 'hover:text-[#EA580C]' : 'hover:text-orange-300'
                  }`}
                >
                  <span className="text-orange-500 text-[10px] transition-transform group-hover:translate-x-0.5">›</span>
                  <span>Blogs & Insights</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/faqs"
                  className={`group flex items-center gap-2 transition-colors ${
                    isBright ? 'hover:text-[#EA580C]' : 'hover:text-orange-300'
                  }`}
                >
                  <span className="text-orange-500 text-[10px] transition-transform group-hover:translate-x-0.5">›</span>
                  <span>Platform FAQs</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Support Column (3 cols) */}
          <div className="md:col-span-3 lg:col-span-3 space-y-3.5">
            <h4
              className={`text-xs font-bold uppercase tracking-wider font-mono ${
                isBright ? 'text-[#EA580C]' : 'text-orange-400'
              }`}
            >
              Support & Connect
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/contact"
                  className={`group flex items-center gap-2 transition-colors ${
                    isBright ? 'hover:text-[#EA580C]' : 'hover:text-orange-300'
                  }`}
                >
                  <span className="text-orange-500 text-[10px] transition-transform group-hover:translate-x-0.5">›</span>
                  <span>Contact Support</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/onboarding"
                  className={`group flex items-center gap-2 transition-colors ${
                    isBright ? 'hover:text-[#EA580C]' : 'hover:text-orange-300'
                  }`}
                >
                  <span className="text-orange-500 text-[10px] transition-transform group-hover:translate-x-0.5">›</span>
                  <span>Skill Diagnostic</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/faqs"
                  className={`group flex items-center gap-2 transition-colors ${
                    isBright ? 'hover:text-[#EA580C]' : 'hover:text-orange-300'
                  }`}
                >
                  <span className="text-orange-500 text-[10px] transition-transform group-hover:translate-x-0.5">›</span>
                  <span>Help Center</span>
                </Link>
              </li>
              <li>
                <span
                  className={`group flex items-center gap-2 transition-colors cursor-pointer ${
                    isBright ? 'hover:text-[#EA580C]' : 'hover:text-orange-300'
                  }`}
                >
                  <span className="text-orange-500 text-[10px] transition-transform group-hover:translate-x-0.5">›</span>
                  <span>Privacy Policy</span>
                </span>
              </li>
              <li>
                <span
                  className={`group flex items-center gap-2 transition-colors cursor-pointer ${
                    isBright ? 'hover:text-[#EA580C]' : 'hover:text-orange-300'
                  }`}
                >
                  <span className="text-orange-500 text-[10px] transition-transform group-hover:translate-x-0.5">›</span>
                  <span>Terms of Service</span>
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div
          className={`mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isBright ? 'border-[#E5D7C8] text-[#78716C]' : 'border-orange-950/60 text-zinc-500'
          }`}
        >
          <p suppressHydrationWarning>© {new Date().getFullYear()} Mentora AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
