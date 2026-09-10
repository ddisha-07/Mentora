'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

interface VerifiedSkill {
  id: string;
  name: string;
  category: string;
  score: number;
  level: string;
  evaluatedAt: string;
  hash: string;
  evaluationsCount: number;
  status: 'verified' | 'pending';
}

const verifiedSkills: VerifiedSkill[] = [
  {
    id: 'vs1',
    name: 'Distributed Systems & Event-Driven Architecture',
    category: 'System Design',
    score: 94,
    level: 'Mastery (Lvl 8)',
    evaluatedAt: 'Aug 28, 2026',
    hash: '0x3a9f...8b21',
    evaluationsCount: 4,
    status: 'verified',
  },
  {
    id: 'vs2',
    name: 'Advanced TypeScript & Type-Level Design',
    category: 'Language & Core',
    score: 92,
    level: 'Advanced (Lvl 7)',
    evaluatedAt: 'Aug 22, 2026',
    hash: '0x7b1c...90e3',
    evaluationsCount: 3,
    status: 'verified',
  },
  {
    id: 'vs3',
    name: 'PostgreSQL Sharding & High-Throughput Storage',
    category: 'Data & Storage',
    score: 88,
    level: 'Advanced (Lvl 7)',
    evaluatedAt: 'Aug 15, 2026',
    hash: '0x1f4d...31fa',
    evaluationsCount: 3,
    status: 'verified',
  },
  {
    id: 'vs4',
    name: 'Cloud Infrastructure & Kubernetes Microservices',
    category: 'DevOps & Cloud',
    score: 85,
    level: 'Proficient (Lvl 6)',
    evaluatedAt: 'Aug 08, 2026',
    hash: '0x9e2a...44cd',
    evaluationsCount: 3,
    status: 'verified',
  },
  {
    id: 'vs5',
    name: 'Zero-Trust Security & Cloud IAM Policies',
    category: 'Security',
    score: 78,
    level: 'Proficient (Lvl 6)',
    evaluatedAt: 'Jul 29, 2026',
    hash: '0x4c8e...721b',
    evaluationsCount: 2,
    status: 'verified',
  },
];

export default function SkillPassportPage() {
  const { isBright } = useTheme();
  const [selectedProof, setSelectedProof] = useState<VerifiedSkill | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const bgPage = isBright ? '#FFF8F0' : '#111010';
  const cardBg = isBright ? '#FFFFFF' : '#1C1916';
  const cardBorder = isBright ? 'rgba(234,88,12,0.12)' : 'rgba(255,107,53,0.1)';
  const textPrimary = isBright ? '#1C1917' : '#FFF8F0';
  const textMuted = isBright ? '#78716C' : 'rgba(255,248,240,0.55)';

  const passportId = 'MP-8829-X7K-VALIDATED';

  const copyVerificationLink = () => {
    navigator.clipboard?.writeText?.(`https://mentora.io/verify/${passportId}`);
    setToastMessage('Public verification link copied to clipboard!');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleExportPDF = () => {
    setToastMessage('Exporting Skill Passport PDF credential certificate...');
    setTimeout(() => {
      setToastMessage('PDF Certificate generated! Downloading to your device.');
      setTimeout(() => setToastMessage(null), 4000);
    }, 1500);
  };

  return (
    <div
      id="passport-page"
      className="min-h-screen flex"
      style={{ background: bgPage, fontFamily: 'var(--font-geist-sans), sans-serif' }}
    >
      <DashboardSidebar />

      <main className="flex-1 ml-[72px] xl:ml-[240px] min-h-screen overflow-y-auto px-4 sm:px-6 lg:px-10 py-8">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Toast Notification */}
          {toastMessage && (
            <div className="p-4 rounded-2xl bg-orange-950/90 border border-orange-500/70 text-orange-200 text-sm font-medium shadow-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-3">
              <span className="flex items-center gap-2">🛡️ {toastMessage}</span>
              <button
                onClick={() => setToastMessage(null)}
                className="text-orange-400 hover:text-white font-bold ml-4"
              >
                ✕
              </button>
            </div>
          )}

          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-orange-500/10 pb-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-orange-500/10 text-[#FF6B35] border border-orange-500/20">
                <span>🛡️ VERIFIABLE CREDENTIALS</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: textPrimary }}>
                Mentora Skill Passport
              </h1>
              <p className="text-sm max-w-2xl" style={{ color: textMuted }}>
                A tamper-proof digital record of proven engineering proficiencies. Every badge requires passing proctored evaluations with a score ≥70%.
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={copyVerificationLink}
                className="px-4 py-2.5 rounded-xl font-bold text-xs border transition-all hover:bg-orange-500/10 active:scale-95 flex items-center gap-2"
                style={{ borderColor: cardBorder, color: textPrimary }}
              >
                <span>🔗 Copy Public Link</span>
              </button>
              <button
                type="button"
                onClick={handleExportPDF}
                className="px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all active:scale-95 flex items-center gap-2 bg-gradient-to-r from-[#FF6B35] to-[#E85D2C] text-white hover:brightness-110 shadow-orange-500/20"
              >
                <span>📄 Export Certificate (PDF)</span>
              </button>
            </div>
          </div>

          {/* Cryptographic Passport ID Hero Card */}
          <div
            className="relative overflow-hidden rounded-3xl p-6 sm:p-8 border shadow-2xl transition-all"
            style={{
              background: isBright
                ? 'linear-gradient(135deg, #1C1510 0%, #291D16 50%, #17110C 100%)'
                : 'linear-gradient(135deg, #180e07 0%, #20130a 50%, #0d0805 100%)',
              borderColor: 'rgba(255,107,53,0.35)',
              color: '#FFF8F0',
            }}
          >
            {/* Hologram security glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-500/25 via-amber-500/15 to-transparent blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-[11px] font-mono font-bold tracking-widest px-3 py-1 rounded-full bg-orange-500/25 text-orange-300 border border-orange-500/40">
                    PASSPORT ID: {passportId}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    CRYPTOGRAPHICALLY VALIDATED
                  </span>
                </div>

                <div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    Alex Johnson
                  </h2>
                  <p className="text-xs sm:text-sm font-mono text-orange-400 mt-0.5">
                    Target Role: Senior Distributed Systems Architect • Level 7 Verified
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-xs border-t border-orange-500/20">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase font-mono">Issued On</span>
                    <p className="font-semibold text-zinc-200">Sept 1, 2026</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase font-mono">Valid Thru</span>
                    <p className="font-semibold text-zinc-200">Sept 1, 2028</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase font-mono">Verified Skills</span>
                    <p className="font-semibold text-orange-400 font-mono">5 Competencies</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase font-mono">Average Evaluation</span>
                    <p className="font-semibold text-emerald-400 font-mono">87.4% (Passed)</p>
                  </div>
                </div>

                <p className="text-[11px] font-mono text-zinc-400 truncate">
                  SHA-256 Signature: <span className="text-zinc-300">0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069</span>
                </p>
              </div>

              {/* Holographic Badge Seal */}
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-black/40 border border-orange-500/30 shrink-0 text-center space-y-2">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 flex items-center justify-center text-3xl shadow-xl shadow-orange-500/30">
                  🛡️
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-amber-300 block">
                    SEAL OF MASTERY
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">Mentora Protocol v2.4</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShareModalOpen(true)}
                  className="mt-2 text-xs text-orange-400 hover:text-orange-300 underline font-semibold"
                >
                  Verify Proof Matrix →
                </button>
              </div>
            </div>
          </div>

          {/* Verified Competencies Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold" style={{ color: textPrimary }}>
                  Verified Competencies & Evaluation Logs
                </h3>
                <p className="text-xs" style={{ color: textMuted }}>
                  Scores validated against the mandatory 70% threshold.
                </p>
              </div>
              <span className="text-xs font-mono text-orange-500 font-semibold">
                {verifiedSkills.length} SKILLS CONFIRMED
              </span>
            </div>

            <div className="space-y-3">
              {verifiedSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-5 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-orange-500/40 hover:shadow-md"
                  style={{ background: cardBg, borderColor: cardBorder }}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-base">✓</span>
                      <h4 className="font-bold text-sm sm:text-base group-hover:text-[#FF6B35] transition-colors" style={{ color: textPrimary }}>
                        {skill.name}
                      </h4>
                    </div>
                    <p className="text-xs" style={{ color: textMuted }}>
                      {skill.category} • <span className="font-mono">{skill.evaluationsCount} Rigorous Evaluations</span> • Evaluated on {skill.evaluatedAt}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 sm:gap-6 shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        {skill.score}% Passed
                      </span>
                      <p className="text-[10px] font-mono mt-1" style={{ color: textMuted }}>
                        Hash: {skill.hash}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedProof(skill)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all hover:bg-orange-500/10 active:scale-95"
                      style={{ borderColor: cardBorder, color: textPrimary }}
                    >
                      Audit Proof 🔍
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Radar / Competency Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Domain Mastery Breakdown */}
            <div
              className="p-6 rounded-3xl border space-y-4 shadow-sm"
              style={{ background: cardBg, borderColor: cardBorder }}
            >
              <h3 className="text-base font-bold flex items-center gap-2" style={{ color: textPrimary }}>
                <span>📊</span> Domain Proficiency Distribution
              </h3>

              <div className="space-y-3.5">
                {[
                  { domain: 'Distributed Architecture', pct: 94, level: 'Mastery' },
                  { domain: 'Type Systems & Compiler Safety', pct: 92, level: 'Advanced' },
                  { domain: 'Database Sharding & Indexing', pct: 88, level: 'Advanced' },
                  { domain: 'Cloud Orchestration (K8s)', pct: 85, level: 'Proficient' },
                  { domain: 'Zero-Trust IAM & Security', pct: 78, level: 'Proficient' },
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span style={{ color: textPrimary }}>{item.domain}</span>
                      <span className="text-orange-500 font-mono">{item.pct}% • {item.level}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-orange-500/15 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500"
                        style={{ width: `${item.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Milestone Badges Collection */}
            <div
              className="p-6 rounded-3xl border space-y-4 shadow-sm"
              style={{ background: cardBg, borderColor: cardBorder }}
            >
              <h3 className="text-base font-bold flex items-center gap-2" style={{ color: textPrimary }}>
                <span>🎖️</span> Earned Credential Badges
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { title: 'Architect Lvl 7', desc: 'Score > 85% in System Design', icon: '🏛️', date: 'Aug 2026' },
                  { title: 'Evaluation Ace', desc: 'Zero failed quiz attempts', icon: '⚡', date: 'Jul 2026' },
                  { title: 'Clean Code Guru', desc: 'TypeScript type mastery', icon: '💎', date: 'Jun 2026' },
                  { title: '14-Day Streak', desc: 'Daily micro-drill completion', icon: '🔥', date: 'Aug 2026' },
                ].map((b, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl border flex items-center gap-3"
                    style={{
                      background: isBright ? '#FAF4EE' : '#140c07',
                      borderColor: cardBorder,
                    }}
                  >
                    <span className="text-2xl">{b.icon}</span>
                    <div>
                      <h4 className="text-xs font-bold leading-tight" style={{ color: textPrimary }}>
                        {b.title}
                      </h4>
                      <p className="text-[10px]" style={{ color: textMuted }}>
                        {b.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="p-3.5 rounded-2xl border flex items-center justify-between text-xs"
                style={{
                  background: isBright ? '#FFF3EB' : 'rgba(255,107,53,0.08)',
                  borderColor: cardBorder,
                }}
              >
                <span className="font-semibold text-orange-500">
                  Ready for Level 8 Evaluation?
                </span>
                <Link
                  href="/dashboard/leaderboard"
                  className="font-bold text-[#FF6B35] underline hover:brightness-110"
                >
                  Start Assessment →
                </Link>
              </div>
            </div>

          </div>

        </div>
      </main>

      {/* Audit Proof Modal */}
      {selectedProof && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg rounded-3xl border p-6 space-y-4 shadow-2xl relative"
            style={{ background: cardBg, borderColor: cardBorder }}
          >
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: cardBorder }}>
              <div>
                <span className="text-[10px] font-mono font-bold text-orange-500 uppercase tracking-wider">
                  CRYPTOGRAPHIC PROOF AUDIT
                </span>
                <h3 className="text-lg font-bold" style={{ color: textPrimary }}>
                  {selectedProof.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProof(null)}
                className="w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold"
                style={{ borderColor: cardBorder, color: textMuted }}
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs" style={{ color: textMuted }}>
              <p><strong>Evaluation Score:</strong> <span className="text-emerald-500 font-bold">{selectedProof.score}% (Passed ≥ 70% threshold)</span></p>
              <p><strong>Competency Tier:</strong> {selectedProof.level}</p>
              <p><strong>Evaluated Date:</strong> {selectedProof.evaluatedAt}</p>
              <p><strong>Verifying Authority:</strong> Mentora Autonomous Evaluation Engine v2.4</p>
              <p><strong>Proctoring Status:</strong> Identity Verified • Code Sandbox Executed</p>
              <div className="p-3 rounded-xl bg-black/30 font-mono text-[11px] break-all border border-orange-500/20 text-zinc-300">
                Merkle Root: 0x93b4c10294e88f7293a7719208394819aa910283726481938a4b8c9d0e1f2a3b
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedProof(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#FF6B35] text-white shadow-md"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-md rounded-3xl border p-6 space-y-4 shadow-2xl relative text-center"
            style={{ background: cardBg, borderColor: cardBorder }}
          >
            <div className="w-16 h-16 rounded-2xl bg-orange-500/15 text-orange-500 mx-auto flex items-center justify-center text-3xl">
              📱
            </div>
            <h3 className="text-lg font-bold" style={{ color: textPrimary }}>
              Share Verifiable Skill Passport
            </h3>
            <p className="text-xs" style={{ color: textMuted }}>
              Hiring managers and team leads can scan or click the link to verify all evaluation criteria and tamper-proof scores.
            </p>

            <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/30 text-xs font-mono text-[#FF6B35]">
              https://mentora.io/verify/{passportId}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShareModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold border"
                style={{ borderColor: cardBorder, color: textMuted }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  copyVerificationLink();
                  setShareModalOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-[#FF6B35] text-white"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
