import React from 'react';
import Link from 'next/link';

export default function PublicFooter() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-[1px]">
                <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
                  <span className="font-black text-sm text-indigo-400">M</span>
                </div>
              </div>
              <span className="text-lg font-bold text-white tracking-tight">Mentora</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Personalized, level-gated learning ecosystem for software engineers, AI architects, and tech leaders.
            </p>
            <div className="text-[11px] text-slate-500 font-mono">
              Designed for verifiable skill mastery.
            </div>
          </div>

          {/* Product & Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/register" className="hover:text-indigo-400 transition-colors">Personalized Journeys</Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-indigo-400 transition-colors">Global Leaderboard</Link>
              </li>
              <li>
                <Link href="/journeys/demo" className="hover:text-indigo-400 transition-colors">Interactive Roadmap</Link>
              </li>
              <li>
                <Link href="/onboarding" className="hover:text-indigo-400 transition-colors">Skill Diagnostic</Link>
              </li>
            </ul>
          </div>

          {/* Resources & Content */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-indigo-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:text-indigo-400 transition-colors">Engineering Insights & Blog</Link>
              </li>
              <li>
                <Link href="/why-mentora" className="hover:text-indigo-400 transition-colors">Why Mentora</Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-indigo-400 transition-colors">Platform FAQs</Link>
              </li>
            </ul>
          </div>

          {/* Quick Access & Account */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Account & Connect</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="hover:text-indigo-400 transition-colors">Learner Sign In</Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-indigo-400 transition-colors">Create Free Account</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-indigo-400 transition-colors">Contact Support</Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-indigo-400 transition-colors">Member Dashboard</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <p>© {new Date().getFullYear()} Mentora AI. All rights reserved.</p>
          <div className="flex items-center gap-6 text-[11px]">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>System Health OK</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
