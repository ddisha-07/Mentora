'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, X, ShieldCheck, Zap, BookOpen, Award, ArrowRight, GraduationCap } from 'lucide-react';

interface GoPremiumCardProps {
  className?: string;
  onAccessGranted?: () => void;
}

export default function GoPremiumCard({ className = '', onAccessGranted }: GoPremiumCardProps) {
  const [isActivated, setIsActivated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check saved premium status on mount
  useEffect(() => {
    const savedState = localStorage.getItem('mentora_premium_status');
    if (savedState === 'true') {
      setIsActivated(true);
    }
  }, []);

  const handleGetAccessClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const handleActivatePremium = () => {
    setIsActivated(true);
    localStorage.setItem('mentora_premium_status', 'true');
    setIsModalOpen(false);
    setToastMessage('🎉 Mentora Premium Activated! Enjoy 25k+ courses.');
    if (onAccessGranted) onAccessGranted();

    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <>
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.9 }}
            style={{ position: 'fixed', bottom: '80px', left: '16px', zIndex: 99999 }}
            className="px-4 py-2.5 rounded-xl bg-[#1C1613] border border-[#FF6B35]/50 text-white shadow-2xl flex items-center gap-2.5 backdrop-blur-md"
          >
            <div className="w-6 h-6 rounded-full bg-[#FF6B35] text-white flex items-center justify-center shrink-0 font-bold text-xs shadow-md">
              ✓
            </div>
            <p className="text-[11px] font-semibold text-stone-100">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Minimized Pill Button ─────────────────────────────────────────── */}
      {isMinimized ? (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setIsMinimized(false)}
          style={{ position: 'fixed', bottom: '16px', left: '16px', top: 'auto', right: 'auto', zIndex: 9999 }}
          className={`px-3.5 py-2 rounded-full bg-gradient-to-r from-[#241C16] to-[#1C1612] border border-[#FF6B35]/40 text-white shadow-2xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all group ${className}`}
        >
          <div className="w-4 h-4 rounded-full bg-[#FF6B35] text-white flex items-center justify-center text-[9px] font-extrabold shadow-sm">
            ✦
          </div>
          <span className="text-[11px] font-bold text-white group-hover:text-[#FF6B35] transition-colors">
            {isActivated ? 'PRO Active' : 'Go Premium'}
          </span>
        </motion.button>
      ) : (
        /* ── Mentora Compact Box Card (205px x 170px) ───────────────────────── */
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          style={{ position: 'fixed', bottom: '16px', left: '16px', top: 'auto', right: 'auto', zIndex: 9999 }}
          className={`w-[205px] h-[170px] rounded-2xl p-3 select-none relative overflow-hidden transition-all border shadow-[0_12px_36px_rgba(0,0,0,0.75)] flex flex-col justify-between ${
            isActivated
              ? 'bg-gradient-to-br from-[#291F18] via-[#1E1712] to-[#140F0C] border-[#FF6B35]/50'
              : 'bg-gradient-to-br from-[#241C16] via-[#1C1612] to-[#120E0B] border-[#FF6B35]/25 hover:border-[#FF6B35]/50'
          } ${className}`}
        >
          {/* Ambient Mentora Ember Glow */}
          <div className="absolute -top-8 -left-8 w-24 h-24 bg-[#FF6B35]/15 rounded-full blur-xl pointer-events-none" />

          {/* Top Row: Mentora Icon Badge & Minimize Button */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-[#FF6B35]/20 border border-[#FF6B35]/40 flex items-center justify-center text-[#FF6B35]">
                <GraduationCap size={13} strokeWidth={2.5} />
              </div>
              <span className="text-[11px] font-bold text-stone-100 tracking-tight">Mentora</span>
              {isActivated && (
                <span className="text-[8.5px] font-extrabold bg-[#FF6B35]/20 text-[#FF6B35] px-1.5 py-0.2 rounded-full border border-[#FF6B35]/30">
                  PRO
                </span>
              )}
            </div>

            <button
              onClick={() => setIsMinimized(true)}
              title="Minimize"
              className="w-4 h-4 rounded-full flex items-center justify-center text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={11} />
            </button>
          </div>

          {/* Middle Text Content */}
          <div className="relative z-10 my-0.5">
            <h4 className="text-stone-100 font-extrabold text-sm tracking-tight leading-tight">
              {isActivated ? 'Premium Access' : 'Go Premium'}
            </h4>
            <p className="text-stone-300 text-[10px] font-medium leading-snug mt-0.5 max-w-[125px]">
              {isActivated ? 'Lifetime access unlocked' : 'Explore 25k+ courses with lifetime access'}
            </p>
          </div>

          {/* Bottom Row: Working Action Button & Reader Illustration */}
          <div className="flex items-end justify-between relative z-10 mt-auto">
            <button
              id="btn-mentora-get-access"
              onClick={handleGetAccessClick}
              className={`px-3.5 py-1.2 rounded-full text-[10.5px] font-extrabold transition-all duration-200 flex items-center gap-1 shadow-md ${
                isActivated
                  ? 'bg-gradient-to-r from-[#10B981] to-[#059669] text-white hover:scale-105 active:scale-95'
                  : 'bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] text-white hover:shadow-[0_0_16px_rgba(255,107,53,0.5)] hover:scale-105 active:scale-95'
              }`}
            >
              {isActivated ? (
                <>
                  <Check size={11} strokeWidth={3} />
                  <span>Granted</span>
                </>
              ) : (
                <>
                  <span>Get Access</span>
                  <ArrowRight size={10} strokeWidth={2.5} />
                </>
              )}
            </button>

            {/* Compact Reader Illustration */}
            <div className="w-[50px] h-[55px] shrink-0 relative flex items-center justify-center -mb-1 -mr-1">
              <svg
                viewBox="0 0 140 150"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full object-contain"
              >
                {/* Book Stack */}
                <path d="M20 128 C20 124, 30 124, 110 124 C115 124, 120 126, 120 130 C120 134, 115 136, 110 136 C30 136, 20 136, 20 128 Z" fill="#EA580C" />
                <path d="M25 116 C25 112, 35 112, 115 112 C120 112, 123 114, 123 118 C123 122, 120 124, 115 124 C35 124, 25 124, 25 116 Z" fill="#F97316" />
                <path d="M18 104 C18 100, 28 100, 108 100 C113 100, 116 102, 116 106 C116 110, 113 112, 108 112 C28 112, 18 112, 18 104 Z" fill="#E5E7EB" />
                <path d="M22 92 C22 88, 32 88, 112 88 C117 88, 120 90, 120 94 C120 98, 117 100, 112 100 C32 100, 22 100, 22 92 Z" fill="#FF6B35" />
                {/* Boots */}
                <path d="M42 120 C38 120, 36 130, 44 135 C50 135, 54 130, 52 122 Z" fill="#1E1B4B" />
                <path d="M62 122 C58 122, 56 132, 64 137 C70 137, 74 132, 72 124 Z" fill="#1E1B4B" />
                {/* Trousers */}
                <path d="M50 78 C45 85, 38 100, 42 122 C48 122, 54 115, 56 100 C58 92, 62 90, 68 124 C74 124, 78 115, 74 95 C70 82, 64 78, 50 78 Z" fill="#9A3412" />
                {/* Sweater */}
                <path d="M52 48 C42 50, 40 68, 46 79 C56 82, 68 80, 74 76 C78 65, 75 52, 68 48 Z" fill="#FF6B35" />
                {/* Head */}
                <rect x="58" y="42" width="6" height="8" fill="#FDBA74" rx="2" />
                <path d="M53 26 C53 20, 68 20, 68 27 C68 34, 66 42, 58 42 C53 42, 53 33, 53 26 Z" fill="#FED7AA" />
                {/* Glasses & Hair */}
                <circle cx="58" cy="30" r="3.5" fill="none" stroke="#1E293B" strokeWidth="1.5" />
                <circle cx="65" cy="30" r="3.5" fill="none" stroke="#1E293B" strokeWidth="1.5" />
                <path d="M51 26 C50 18, 62 14, 70 20 C73 24, 71 30, 68 28 Z" fill="#E2E8F0" />
                {/* Open Book */}
                <g transform="translate(25, 48) rotate(-12)">
                  <path d="M5 10 C12 7, 22 7, 26 12 L26 32 C22 28, 12 28, 5 30 Z" fill="#FFFFFF" stroke="#475569" strokeWidth="1" />
                  <path d="M26 12 C30 7, 40 7, 47 10 L47 30 C40 28, 30 28, 26 32 Z" fill="#FFFFFF" stroke="#475569" strokeWidth="1" />
                </g>
              </svg>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Active Working Modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 15 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className="relative w-full max-w-md rounded-3xl p-6 bg-gradient-to-b from-[#241C16] via-[#1A1410] to-[#120E0C] border border-[#FF6B35]/40 shadow-[0_25px_60px_rgba(0,0,0,0.9)] z-10 text-white overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF6B35] via-[#FF8C5A] to-[#FF6B35]" />

              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X size={16} />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 rounded-lg bg-[#FF6B35]/20 border border-[#FF6B35]/40 flex items-center justify-center text-[#FF6B35]">
                  <GraduationCap size={13} />
                </div>
                <span className="text-[11px] font-extrabold text-[#FF6B35] tracking-wider uppercase">
                  Mentora Premium Access
                </span>
              </div>

              <h2 className="text-xl font-black text-white tracking-tight">
                Unlock Lifetime Membership
              </h2>
              <p className="text-stone-300 text-xs mt-1 leading-relaxed">
                Unlimited access to 25,000+ courses, AI mentor Kai, verified skill certificates & community sessions.
              </p>

              <div className="grid grid-cols-2 gap-2.5 my-4">
                {[
                  { icon: BookOpen, title: '25k+ Courses', desc: 'All learning tracks' },
                  { icon: Zap, title: '24/7 AI Tutor', desc: 'Realtime assistance' },
                  { icon: Award, title: 'Certificates', desc: 'Verified credentials' },
                  { icon: ShieldCheck, title: 'Lifetime Access', desc: 'One-time unlock' },
                ].map((feat, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#FF6B35]/15 border border-[#FF6B35]/30 flex items-center justify-center text-[#FF6B35] shrink-0">
                      <feat.icon size={13} />
                    </div>
                    <div>
                      <h5 className="text-[11px] font-bold text-stone-100">{feat.title}</h5>
                      <p className="text-[10px] text-stone-400 leading-tight">{feat.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-[#FF6B35]/10 border border-[#FF6B35]/30 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-[#FF6B35]">$0</span>
                    <span className="text-xs font-semibold text-stone-400 line-through">$199</span>
                    <span className="text-[9px] font-bold bg-[#FF6B35] text-white px-2 py-0.5 rounded-full uppercase">
                      100% Free
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-300 mt-0.5">Special promotion applied to your Mentora account</p>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2.5">
                <button
                  onClick={handleActivatePremium}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] text-white font-extrabold text-xs hover:shadow-[0_0_20px_rgba(255,107,53,0.5)] transition-all flex items-center justify-center gap-1.5 shadow-lg active:scale-98"
                >
                  <Sparkles size={14} strokeWidth={2.5} />
                  <span>{isActivated ? 'Keep Premium Active' : 'Confirm & Activate Membership'}</span>
                </button>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 font-semibold text-xs transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
