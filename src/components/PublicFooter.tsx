import React from 'react';
import Link from 'next/link';

export default function PublicFooter() {
  return (
    <footer className="border-t border-orange-950/70 bg-[#060403] text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 via-orange-500 to-orange-600 p-[1px] shadow-sm shadow-orange-500/20">
                <div className="w-full h-full bg-[#0c0805] rounded-[7px] flex items-center justify-center">
                  <span className="font-pixel text-[10px] text-orange-400 font-bold">M</span>
                </div>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">Mentora</span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Personalized, level-gated learning ecosystem for software engineers, AI architects, and tech leaders.
            </p>
            <div className="text-[11px] text-orange-500/80 font-mono">
              Designed for verifiable skill mastery.
            </div>
          </div>

          {/* Product & Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/register" className="hover:text-orange-400 transition-colors">Personalized Journeys</Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-orange-400 transition-colors">Global Leaderboard</Link>
              </li>
              <li>
                <Link href="/journeys/demo" className="hover:text-orange-400 transition-colors">Interactive Roadmap</Link>
              </li>
              <li>
                <Link href="/onboarding" className="hover:text-orange-400 transition-colors">Skill Diagnostic</Link>
              </li>
            </ul>
          </div>

          {/* Resources & Content */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-orange-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:text-orange-400 transition-colors">Engineering Insights & Blog</Link>
              </li>
              <li>
                <Link href="/why-mentora" className="hover:text-orange-400 transition-colors">Why Mentora</Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-orange-400 transition-colors">Platform FAQs</Link>
              </li>
            </ul>
          </div>

          {/* Quick Access & Account */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">Account & Connect</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="hover:text-orange-400 transition-colors">Learner Sign In</Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-orange-400 transition-colors">Create Free Account</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-orange-400 transition-colors">Contact Support</Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-orange-400 transition-colors">Member Dashboard</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-orange-950/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500">
          <p>© {new Date().getFullYear()} Mentora AI. All rights reserved.</p>
          <div className="flex items-center gap-6 text-[11px]">
            <span className="hover:text-orange-400/80 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-orange-400/80 cursor-pointer transition-colors">Terms of Service</span>
            <span className="text-emerald-400/90 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Systems Online
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
