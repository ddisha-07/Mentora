'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
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
    <div className="relative overflow-hidden bg-[#080604] text-[#fff7ed] bg-retro-dense-grid min-h-[calc(100vh-4.5rem)]">
      {/* Ambient Orange & Amber Radiance Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-gradient-to-b from-orange-600/15 via-amber-600/10 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 -right-36 w-80 h-80 bg-orange-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-orange-950/70 text-orange-300 border border-orange-500/40 shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            <span>[ DIRECT CHANNEL // TRANSMISSION STATION ]</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
            Get in{' '}
            <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200 bg-clip-text text-transparent">
              Touch
            </span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed">
            Have questions regarding personalized roadmaps, verifiable skill credentials, or team enterprise licensing? Reach out to our advisory team.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Direct Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="p-6 sm:p-7 rounded-3xl bg-[#0c0805]/95 border border-orange-950/80 space-y-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-950/80 border border-orange-700/60 flex items-center justify-center text-lg">
                  ✉️
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-orange-400 font-bold tracking-widest block">
                    Direct Email
                  </span>
                  <span className="text-sm font-bold text-white">support@mentora.ai</span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                For curriculum feedback, bug reports, and credential verification support.
              </p>
            </div>

            <div className="p-6 sm:p-7 rounded-3xl bg-[#0c0805]/95 border border-orange-950/80 space-y-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1f1309] border border-amber-700/60 flex items-center justify-center text-lg">
                  🏢
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-amber-400 font-bold tracking-widest block">
                    Enterprise Cohorts
                  </span>
                  <span className="text-sm font-bold text-white">partnerships@mentora.ai</span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Custom role roadmaps, team skill-gap benchmarking, and corporate licenses.
              </p>
            </div>

            <div className="p-6 sm:p-7 rounded-3xl bg-[#0c0805]/95 border border-orange-950/80 space-y-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#241207] border border-orange-600/60 flex items-center justify-center text-lg">
                  ⚡
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-orange-400 font-bold tracking-widest block">
                    Response SLA
                  </span>
                  <span className="text-sm font-bold text-white">&lt; 4 Hours Enterprise</span>
                </div>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                General inquiries reviewed within 24 hours. Our global team operates 24/7.
              </p>
            </div>

          </div>

          {/* Right Column: Cyber Contact Form */}
          <div className="lg:col-span-7">
            <div className="relative p-[1.5px] rounded-3xl bg-gradient-to-br from-orange-500/50 via-amber-500/30 to-orange-600/40 shadow-2xl shadow-orange-950/40">
              <div className="p-7 sm:p-10 rounded-[23px] bg-[#0c0805]/95 backdrop-blur-xl space-y-6">
                
                <div className="flex items-center justify-between border-b border-orange-950/80 pb-4">
                  <h3 className="text-xl font-bold text-white">Send Transmission</h3>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-0.5 rounded-full flex items-center gap-1.5 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Channel Secure
                  </span>
                </div>

                {submitted ? (
                  <div className="p-8 rounded-2xl bg-orange-950/40 border border-orange-600/60 text-center space-y-4">
                    <div className="text-3xl">🚀</div>
                    <h4 className="text-lg font-bold text-white">Transmission Dispatched!</h4>
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-sm mx-auto">
                      Thank you for reaching out. Our engineering advisors will review your transmission and respond within our standard SLA.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="px-5 py-2 text-xs font-mono font-bold text-orange-300 bg-[#140e08] border border-orange-800/60 rounded-xl hover:bg-orange-950/60 transition-all"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase text-zinc-400 mb-1.5">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ada Lovelace"
                        className="w-full px-4 py-3 rounded-xl bg-[#140e08] border border-orange-900/50 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase text-zinc-400 mb-1.5">
                        Work or Personal Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="engineer@company.com"
                        className="w-full px-4 py-3 rounded-xl bg-[#140e08] border border-orange-900/50 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase text-zinc-400 mb-1.5">
                        Topic Category
                      </label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-[#140e08] border border-orange-900/50 text-white text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-all font-mono text-xs"
                      >
                        <option value="General Inquiry">General Inquiry & Feedback</option>
                        <option value="Curriculum Diagnostics">Personalized Roadmap & Diagnostics</option>
                        <option value="Skill Passport Verification">Skill Passport & Verification</option>
                        <option value="Enterprise Cohorts">Enterprise Partnerships & Cohorts</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold uppercase text-zinc-400 mb-1.5">
                        Transmission Content
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="How can our engineering advisors assist your career journey?"
                        className="w-full px-4 py-3 rounded-xl bg-[#140e08] border border-orange-900/50 text-white placeholder-zinc-600 text-sm focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 text-xs font-mono font-bold uppercase tracking-wider text-black bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-300 hover:to-orange-400 rounded-xl shadow-xl shadow-orange-600/30 hover:shadow-orange-600/50 transition-all cursor-pointer active:scale-[0.99]"
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
