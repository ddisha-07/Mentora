import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function PublicFooter() {
  return (
    <footer className="border-t border-orange-950/70 bg-[#060403] text-zinc-400 text-xs">
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
            <p className="text-xs text-zinc-400 leading-relaxed">
              Personalized, level-gated learning ecosystem for software engineers, AI architects, and tech leaders.
            </p>
            <div className="text-[11px] text-orange-500/80 font-mono">
              ⚡ Verified skill mastery.
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 font-mono">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <span className="text-orange-500 text-[10px]">›</span> Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <span className="text-orange-500 text-[10px]">›</span> About
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <span className="text-orange-500 text-[10px]">›</span> Blogs
                </Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <span className="text-orange-500 text-[10px]">›</span> FAQs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-orange-400 transition-colors flex items-center gap-1.5">
                  <span className="text-orange-500 text-[10px]">›</span> Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/register" className="hover:text-orange-400 transition-colors">Join Now Free</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-orange-400 transition-colors">Learner Login</Link>
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

          {/* Resources & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-200">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="hover:text-orange-400 transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:text-orange-400 transition-colors">Engineering Insights</Link>
              </li>
              <li>
                <Link href="/why-mentora" className="hover:text-orange-400 transition-colors">Why Mentora</Link>
              </li>
              <li>
                <Link href="/faqs" className="hover:text-orange-400 transition-colors">Platform FAQs</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-orange-400 transition-colors">Contact Support</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-orange-950/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500">
          <p suppressHydrationWarning>© {new Date().getFullYear()} Mentora AI. All rights reserved.</p>
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
