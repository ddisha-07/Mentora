'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

export default function ContactPage() {
  const { isBright } = useTheme();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      className={`relative overflow-hidden min-h-[calc(100vh-4.5rem)] transition-colors duration-200 ${
        isBright
          ? 'bg-[#FAF4EE] text-[#1C1917] bg-retro-dense-grid'
          : 'bg-[#080604] text-[#fff7ed] bg-retro-dense-grid'
      }`}
    >
      {/* Ambient Orange & Amber Radiance Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-gradient-to-b from-orange-600/15 via-amber-600/10 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 -right-36 w-80 h-80 bg-orange-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4 max-w-2xl">
          <div
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold transition-colors ${
              isBright
                ? 'bg-[#FFF3EB] text-[#EA580C] border border-[#FED7AA]'
                : 'bg-orange-950/70 text-orange-300 border border-orange-500/40 shadow-inner'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            <span>[ DIRECT CHANNEL // TRANSMISSION STATION ]</span>
          </div>
          <h1
            className={`text-4xl sm:text-6xl font-extrabold tracking-tight transition-colors ${
              isBright ? 'text-[#1C1917]' : 'text-white'
            }`}
          >
            Get in{' '}
            <span
              className={`bg-clip-text text-transparent ${
                isBright
                  ? 'bg-gradient-to-r from-[#EA580C] via-orange-600 to-[#C2410C]'
                  : 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500'
              }`}
            >
              Touch
            </span>
          </h1>
          <p
            className={`text-base sm:text-lg leading-relaxed transition-colors ${
              isBright ? 'text-[#57534E]' : 'text-zinc-400'
            }`}
          >
            Have questions regarding personalized roadmaps, verifiable skill credentials, or team enterprise licensing? Reach out to our advisory team.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Direct Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            <div
              className={`p-6 sm:p-7 rounded-3xl border space-y-3 shadow-lg transition-all ${
                isBright
                  ? 'bg-white border-[#EAE0D5]'
                  : 'bg-[#0c0805]/95 border-orange-950/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg ${
                    isBright
                      ? 'bg-[#FFF3EB] border-[#FED7AA]'
                      : 'bg-orange-950/80 border-orange-700/60'
                  }`}
                >
                  ✉️
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#EA580C] font-bold tracking-widest block">
                    Direct Email
                  </span>
                  <span
                    className={`text-sm font-bold transition-colors ${
                      isBright ? 'text-[#1C1917]' : 'text-white'
                    }`}
                  >
                    support@mentora.ai
                  </span>
                </div>
              </div>
              <p
                className={`text-xs leading-relaxed transition-colors ${
                  isBright ? 'text-[#57534E]' : 'text-zinc-400'
                }`}
              >
                For curriculum feedback, bug reports, and credential verification support.
              </p>
            </div>

            <div
              className={`p-6 sm:p-7 rounded-3xl border space-y-3 shadow-lg transition-all ${
                isBright
                  ? 'bg-white border-[#EAE0D5]'
                  : 'bg-[#0c0805]/95 border-orange-950/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg ${
                    isBright
                      ? 'bg-[#FFF8F2] border-[#FED7AA]'
                      : 'bg-[#1f1309] border-amber-700/60'
                  }`}
                >
                  🏢
                </div>
                <div>
                  <span
                    className={`text-[10px] font-mono uppercase font-bold tracking-widest block ${
                      isBright ? 'text-[#EA580C]' : 'text-amber-400'
                    }`}
                  >
                    Enterprise Cohorts
                  </span>
                  <span
                    className={`text-sm font-bold transition-colors ${
                      isBright ? 'text-[#1C1917]' : 'text-white'
                    }`}
                  >
                    partnerships@mentora.ai
                  </span>
                </div>
              </div>
              <p
                className={`text-xs leading-relaxed transition-colors ${
                  isBright ? 'text-[#57534E]' : 'text-zinc-400'
                }`}
              >
                Custom role roadmaps, team skill-gap benchmarking, and corporate licenses.
              </p>
            </div>

            <div
              className={`p-6 sm:p-7 rounded-3xl border space-y-3 shadow-lg transition-all ${
                isBright
                  ? 'bg-white border-[#EAE0D5]'
                  : 'bg-[#0c0805]/95 border-orange-950/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg ${
                    isBright
                      ? 'bg-[#FFF3EB] border-[#FED7AA]'
                      : 'bg-[#241207] border-orange-600/60'
                  }`}
                >
                  ⚡
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#EA580C] font-bold tracking-widest block">
                    Response SLA
                  </span>
                  <span
                    className={`text-sm font-bold transition-colors ${
                      isBright ? 'text-[#1C1917]' : 'text-white'
                    }`}
                  >
                    &lt; 4 Hours Enterprise
                  </span>
                </div>
              </div>
              <p
                className={`text-xs leading-relaxed transition-colors ${
                  isBright ? 'text-[#57534E]' : 'text-zinc-400'
                }`}
              >
                General inquiries reviewed within 24 hours. Our global team operates 24/7.
              </p>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div
              className={`relative p-[1.5px] rounded-3xl transition-all ${
                isBright
                  ? 'bg-gradient-to-br from-orange-400/40 via-[#EAE0D5] to-orange-400/30 shadow-xl shadow-orange-950/5'
                  : 'bg-gradient-to-br from-orange-500/50 via-amber-500/30 to-orange-600/40 shadow-2xl shadow-orange-950/40'
              }`}
            >
              <div
                className={`p-7 sm:p-10 rounded-[23px] backdrop-blur-xl space-y-6 border transition-colors ${
                  isBright
                    ? 'bg-white border-[#EAE0D5]'
                    : 'bg-[#0c0805]/95 border-transparent'
                }`}
              >
                
                <div
                  className={`flex items-center justify-between border-b pb-4 ${
                    isBright ? 'border-[#EAE0D5]' : 'border-orange-950/80'
                  }`}
                >
                  <h3
                    className={`text-xl font-bold transition-colors ${
                      isBright ? 'text-[#1C1917]' : 'text-white'
                    }`}
                  >
                    Send Transmission
                  </h3>
                  <span
                    className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full flex items-center gap-1.5 font-semibold border ${
                      isBright
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-emerald-950/80 text-emerald-400 border-emerald-800/60'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Channel Secure
                  </span>
                </div>

                {submitted ? (
                  <div
                    className={`p-8 rounded-2xl border text-center space-y-4 ${
                      isBright
                        ? 'bg-emerald-50/70 border-emerald-200'
                        : 'bg-orange-950/40 border-orange-600/60'
                    }`}
                  >
                    <div className="text-3xl">🚀</div>
                    <h4
                      className={`text-lg font-bold ${
                        isBright ? 'text-emerald-900' : 'text-white'
                      }`}
                    >
                      Transmission Dispatched!
                    </h4>
                    <p
                      className={`text-xs sm:text-sm leading-relaxed max-w-sm mx-auto ${
                        isBright ? 'text-emerald-700' : 'text-zinc-300'
                      }`}
                    >
                      Thank you for reaching out. Our engineering advisors will review your transmission and respond within our standard SLA.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="px-5 py-2 text-xs font-mono font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-sm"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label
                        className={`block text-xs font-mono font-semibold uppercase mb-1.5 transition-colors ${
                          isBright ? 'text-[#1C1917]' : 'text-zinc-400'
                        }`}
                      >
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ada Lovelace"
                        className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-all ${
                          isBright
                            ? 'bg-[#FAF4EE]/70 border-[#E3D4C5] text-[#1C1917] placeholder-[#A8A29E] focus:bg-white focus:border-orange-500'
                            : 'bg-[#140e08] border-orange-900/50 text-white placeholder-zinc-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30'
                        }`}
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-xs font-mono font-semibold uppercase mb-1.5 transition-colors ${
                          isBright ? 'text-[#1C1917]' : 'text-zinc-400'
                        }`}
                      >
                        Work or Personal Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="engineer@company.com"
                        className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-all ${
                          isBright
                            ? 'bg-[#FAF4EE]/70 border-[#E3D4C5] text-[#1C1917] placeholder-[#A8A29E] focus:bg-white focus:border-orange-500'
                            : 'bg-[#140e08] border-orange-900/50 text-white placeholder-zinc-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30'
                        }`}
                      />
                    </div>

                    <div>
                      <label
                        className={`block text-xs font-mono font-semibold uppercase mb-1.5 transition-colors ${
                          isBright ? 'text-[#1C1917]' : 'text-zinc-400'
                        }`}
                      >
                        Topic Category
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-all font-mono text-xs ${
                          isBright
                            ? 'bg-[#FAF4EE]/70 border-[#E3D4C5] text-[#1C1917] focus:bg-white focus:border-orange-500'
                            : 'bg-[#140e08] border-orange-900/50 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30'
                        }`}
                      >
                        <option value="General Inquiry">General Inquiry & Feedback</option>
                        <option value="Curriculum Diagnostics">Personalized Roadmap & Diagnostics</option>
                        <option value="Skill Passport Verification">Skill Passport & Verification</option>
                        <option value="Enterprise Cohorts">Enterprise Partnerships & Cohorts</option>
                      </select>
                    </div>

                    <div>
                      <label
                        className={`block text-xs font-mono font-semibold uppercase mb-1.5 transition-colors ${
                          isBright ? 'text-[#1C1917]' : 'text-zinc-400'
                        }`}
                      >
                        Transmission Content
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="How can our engineering advisors assist your career journey?"
                        className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-all ${
                          isBright
                            ? 'bg-[#FAF4EE]/70 border-[#E3D4C5] text-[#1C1917] placeholder-[#A8A29E] focus:bg-white focus:border-orange-500'
                            : 'bg-[#140e08] border-orange-900/50 text-white placeholder-zinc-600 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30'
                        }`}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 text-xs font-mono font-bold uppercase tracking-wider text-white bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 transition-all cursor-pointer active:scale-[0.99]"
                    >
                      Send Transmission [Enter] →
                    </button>
                  </form>
                )}

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
