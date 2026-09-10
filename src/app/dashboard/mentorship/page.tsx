'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  sessionsCount: number;
  specialties: string[];
  bio: string;
  creditsRequired: number;
  availableNext: string;
}

const featuredMentors: Mentor[] = [
  {
    id: 'm1',
    name: 'Marcus Vance',
    role: 'Principal Architect',
    company: 'Stripe (Ex-AWS)',
    avatar: 'MV',
    rating: 4.98,
    sessionsCount: 84,
    specialties: ['Distributed Systems', 'Kafka', 'High-Throughput APIs', 'Architecture Review'],
    bio: '14+ years architecting global payment rails. Passionate about helping senior engineers break through the Staff+ threshold.',
    creditsRequired: 1,
    availableNext: 'Tomorrow, 4:30 PM',
  },
  {
    id: 'm2',
    name: 'Sarah Lin',
    role: 'Staff Backend Engineer',
    company: 'Netflix',
    avatar: 'SL',
    rating: 4.95,
    sessionsCount: 62,
    specialties: ['Concurrency Models', 'Go / Rust', 'Database Scaling', 'Promotion Strategy'],
    bio: 'Lead engineer on video ingestion pipelines. Specializes in concurrent distributed primitives and technical interview prep.',
    creditsRequired: 1,
    availableNext: 'Friday, 2:00 PM',
  },
  {
    id: 'm3',
    name: 'David Chen',
    role: 'VP of Engineering',
    company: 'Scale AI',
    avatar: 'DC',
    rating: 5.0,
    sessionsCount: 45,
    specialties: ['AI Infrastructure', 'Engineering Leadership', 'Org Scaling', 'Executive Presence'],
    bio: 'Experienced engineering executive building high-scale machine learning infra. Focuses on tech strategy and leadership transition.',
    creditsRequired: 2,
    availableNext: 'Saturday, 11:00 AM',
  },
  {
    id: 'm4',
    name: 'Elena Rostova',
    role: 'Cloud Infra Director',
    company: 'Cloudflare',
    avatar: 'ER',
    rating: 4.92,
    sessionsCount: 58,
    specialties: ['Kubernetes', 'Edge Computing', 'Zero-Trust IAM', 'Platform Eng'],
    bio: 'Built multi-region edge platforms handling 40M+ req/sec. Deep expertise in cloud-native operational excellence.',
    creditsRequired: 1,
    availableNext: 'Monday, 5:00 PM',
  },
];

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

export default function MentorshipPage() {
  const { isBright } = useTheme();
  const [activeTab, setActiveTab] = useState<'mentors' | 'ai' | 'past'>('mentors');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [bookingSlot, setBookingSlot] = useState<string>('Tomorrow at 4:30 PM EST');
  const [bookingTopic, setBookingTopic] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // AI Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'c1',
      sender: 'ai',
      text: 'Hello Alex! I am your 24/7 Mentora AI Career Companion. Whether you want to review an architecture diagram, prep for a Staff Engineer mock loop, or unblock a tough technical concept, I am ready. What is on your mind today?',
      time: '10:00 AM',
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const bgPage = isBright ? '#FFF8F0' : '#111010';
  const cardBg = isBright ? '#FFFFFF' : '#1C1916';
  const cardBorder = isBright ? 'rgba(234,88,12,0.12)' : 'rgba(255,107,53,0.1)';
  const textPrimary = isBright ? '#1C1917' : '#FFF8F0';
  const textMuted = isBright ? '#78716C' : 'rgba(255,248,240,0.55)';

  const handleBookSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentor) return;

    setToastMessage(`1-on-1 session booked with ${selectedMentor.name} for ${bookingSlot}! Calendar invitation sent.`);
    setSelectedMentor(null);
    setBookingTopic('');
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleSendAiMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputQuestion.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: inputQuestion.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    const currentQ = inputQuestion;
    setInputQuestion('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponseText =
        'Great question! When designing distributed microservices for this scenario, the critical pattern is decoupling the transactional state using an Outbox Pattern with Change Data Capture (CDC). This eliminates dual-write anomalies while guaranteeing at-least-once delivery to your message brokers.';

      if (currentQ.toLowerCase().includes('saga') || currentQ.toLowerCase().includes('choreography')) {
        aiResponseText =
          'Between Saga Orchestration and Choreography: Use Orchestration when business workflows exceed 4 steps or require complex compensating transactions with tight audits. Use Choreography for lightweight event notifications where services can react autonomously without a central point of coordination.';
      } else if (currentQ.toLowerCase().includes('interview') || currentQ.toLowerCase().includes('mock')) {
        aiResponseText =
          'Here is an architecture prompt: "Design a globally distributed rate limiter that enforces a sliding window counter across 5 AWS regions with < 5ms latency overhead." Key topics to address: Redis Cell vs Local Token Buckets, gossip protocols for sync, and degraded mode fallback.';
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div
      id="mentorship-page"
      className="min-h-screen flex"
      style={{ background: bgPage, fontFamily: 'var(--font-geist-sans), sans-serif' }}
    >
      <DashboardSidebar />

      <main className="flex-1 ml-[72px] xl:ml-[240px] min-h-screen overflow-y-auto px-4 sm:px-6 lg:px-10 py-8">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Toast Notification */}
          {toastMessage && (
            <div className="p-4 rounded-2xl bg-orange-950/90 border border-orange-500/70 text-orange-200 text-sm font-medium shadow-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-3">
              <span className="flex items-center gap-2">🗓️ {toastMessage}</span>
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
                <span>💬 INDUSTRY GUIDANCE & COACHING</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: textPrimary }}>
                Mentorship Hub
              </h1>
              <p className="text-sm max-w-2xl" style={{ color: textMuted }}>
                Book dedicated 1-on-1 strategy sessions with Staff Engineers and Tech Leads, or brainstorm 24/7 with your AI Career Companion.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-xl border flex items-center gap-2" style={{ background: cardBg, borderColor: cardBorder }}>
                <span className="text-sm">🪙</span>
                <span className="text-xs font-bold" style={{ color: textPrimary }}>
                  2 Mentorship Credits Available
                </span>
              </div>
            </div>
          </div>

          {/* Upcoming Session Spotlight Card */}
          <div
            className="p-6 sm:p-7 rounded-3xl border relative overflow-hidden transition-all shadow-lg"
            style={{
              background: isBright
                ? 'linear-gradient(135deg, #FFF6EE 0%, #FFFFFF 70%)'
                : 'linear-gradient(135deg, #1f120a 0%, #140d08 70%)',
              borderColor: 'rgba(255,107,53,0.25)',
            }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                    CONFIRMED UPCOMING 1-ON-1
                  </span>
                  <span className="text-xs text-orange-500 font-mono font-semibold">Tomorrow at 4:30 PM EST</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold" style={{ color: textPrimary }}>
                  System Architecture Mock Interview & Byzantine Fault Tolerance
                </h2>
                <div className="flex items-center gap-3 text-xs" style={{ color: textMuted }}>
                  <span className="font-semibold text-orange-500">Mentor: Marcus Vance</span>
                  <span>•</span>
                  <span>Principal Architect @ Stripe</span>
                  <span>•</span>
                  <span>45 Minutes Video</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => alert('Video room opens 10 minutes prior to session time.')}
                  className="px-6 py-3 rounded-xl font-bold text-xs text-center shadow-lg transition-all active:scale-95 bg-gradient-to-r from-[#FF6B35] to-[#E85D2C] text-white hover:brightness-110 shadow-orange-500/20"
                >
                  Join Video Room (Opens in 22h) →
                </button>
                <button
                  type="button"
                  onClick={() => alert('Preparation notes saved to session dashboard.')}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold text-center border transition-all hover:bg-orange-500/5 active:scale-95"
                  style={{ borderColor: cardBorder, color: textPrimary }}
                >
                  Edit Discussion Agenda
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b pb-3" style={{ borderColor: cardBorder }}>
            {[
              { id: 'mentors', label: '1-on-1 Mentors Directory', icon: '🧑‍💻' },
              { id: 'ai', label: '24/7 AI Career Companion', icon: '🤖' },
              { id: 'past', label: 'Past Session Notes (3)', icon: '📝' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-[#FF6B35] text-white shadow-md shadow-orange-500/20'
                    : isBright
                    ? 'bg-white text-zinc-600 border border-[#EAE0D5] hover:border-orange-300'
                    : 'bg-[#18130e] text-zinc-400 border border-orange-950/60 hover:border-orange-800'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* TAB 1: MENTORS DIRECTORY */}
          {activeTab === 'mentors' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {featuredMentors.map((mentor) => (
                  <div
                    key={mentor.id}
                    className="p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between group hover:border-orange-500/40 hover:shadow-xl"
                    style={{ background: cardBg, borderColor: cardBorder }}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-sm font-black text-white shadow-md">
                            {mentor.avatar}
                          </div>
                          <div>
                            <h3 className="font-bold text-base group-hover:text-[#FF6B35] transition-colors" style={{ color: textPrimary }}>
                              {mentor.name}
                            </h3>
                            <p className="text-xs font-medium text-orange-500">
                              {mentor.role} • {mentor.company}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                            <span>★</span>
                            <span>{mentor.rating}</span>
                          </div>
                          <span className="text-[10px]" style={{ color: textMuted }}>
                            {mentor.sessionsCount} sessions
                          </span>
                        </div>
                      </div>

                      <p className="text-xs leading-relaxed" style={{ color: textMuted }}>
                        {mentor.bio}
                      </p>

                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-orange-500 uppercase tracking-wider font-bold">
                          Core Specializations:
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {mentor.specialties.map((spec, i) => (
                            <span
                              key={i}
                              className="text-[11px] px-2 py-0.5 rounded border"
                              style={{
                                background: isBright ? '#FAF4EE' : '#140c07',
                                borderColor: cardBorder,
                                color: textMuted,
                              }}
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-5 mt-4 border-t border-orange-500/10 flex items-center justify-between gap-2">
                      <div className="text-xs" style={{ color: textMuted }}>
                        Next Slot: <span className="font-semibold" style={{ color: textPrimary }}>{mentor.availableNext}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedMentor(mentor)}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#FF6B35] to-[#E85D2C] text-white shadow-md hover:brightness-110 active:scale-95 transition-all"
                      >
                        Book 1-on-1 ({mentor.creditsRequired} Credit) →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: 24/7 AI CAREER COMPANION */}
          {activeTab === 'ai' && (
            <div
              className="rounded-3xl border p-6 sm:p-8 space-y-6 shadow-xl"
              style={{ background: cardBg, borderColor: cardBorder }}
            >
              <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: cardBorder }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/15 text-orange-500 flex items-center justify-center text-xl">
                    🤖
                  </div>
                  <div>
                    <h3 className="font-bold text-base" style={{ color: textPrimary }}>
                      Mentora Autonomous AI Mentor
                    </h3>
                    <p className="text-xs" style={{ color: textMuted }}>
                      Trained on modern engineering architectures, Staff+ evaluation matrices, and code telemetry.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20">
                  ONLINE 24/7
                </span>
              </div>

              {/* Chat Thread */}
              <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.sender === 'ai' && (
                      <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center text-xs font-bold shrink-0">
                        AI
                      </div>
                    )}
                    <div
                      className={`p-4 rounded-2xl max-w-xl text-xs sm:text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#FF6B35] text-white rounded-br-none'
                          : isBright
                          ? 'bg-[#FAF4EE] border border-[#EAE0D5] text-[#1C1917] rounded-bl-none'
                          : 'bg-[#18120d] border border-orange-950/80 text-zinc-200 rounded-bl-none'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span className="text-[10px] opacity-60 block mt-1 text-right font-mono">
                        {msg.time}
                      </span>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3 items-center text-xs text-orange-500 font-mono">
                    <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                    Mentora AI is synthesizing architectural response...
                  </div>
                )}
              </div>

              {/* Suggested Questions */}
              <div className="space-y-2 pt-2 border-t" style={{ borderColor: cardBorder }}>
                <span className="text-[10px] font-mono text-orange-500 uppercase tracking-wider font-bold">
                  Quick Prompts:
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    'Explain Saga Orchestration vs Choreography with tradeoffs',
                    'How do I prep for a Staff Engineer System Design loop?',
                    'Review idempotency strategies for payment processing',
                  ].map((prompt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setInputQuestion(prompt)}
                      className="text-xs px-3 py-1.5 rounded-xl border transition-all hover:border-orange-500 hover:text-[#FF6B35]"
                      style={{ background: isBright ? '#FAF4EE' : '#140c07', borderColor: cardBorder, color: textMuted }}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendAiMessage} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask any technical or career question..."
                  value={inputQuestion}
                  onChange={(e) => setInputQuestion(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-2xl text-xs border outline-none focus:ring-2 focus:ring-orange-500/40"
                  style={{ background: isBright ? '#FAF4EE' : '#140c07', borderColor: cardBorder, color: textPrimary }}
                />
                <button
                  type="submit"
                  disabled={!inputQuestion.trim() || isTyping}
                  className="px-6 py-3 rounded-2xl text-xs font-bold bg-gradient-to-r from-[#FF6B35] to-[#E85D2C] text-white shadow-md disabled:opacity-50"
                >
                  Send →
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: PAST SESSIONS & ACTION ITEMS */}
          {activeTab === 'past' && (
            <div className="space-y-4">
              {[
                {
                  mentor: 'Marcus Vance',
                  date: 'Aug 14, 2026',
                  title: 'Career Vector Assessment: Roadmap to Staff Engineer',
                  notes: 'Identified 2 primary gaps: Cross-team RFC consensus building and Distributed Tracing telemetry. Recommended Level 7 System Design track.',
                  actionItems: ['Complete Module 4 on Event Sourcing', 'Write RFC on Redis caching layer', 'Schedule mock review'],
                },
                {
                  mentor: 'Sarah Lin',
                  date: 'Jul 28, 2026',
                  title: 'Deep Dive: Go Channels & Goroutine Leak Prevention',
                  notes: 'Reviewed pprof traces from staging service. Discussed context cancellation propagation and buffered channel deadlock conditions.',
                  actionItems: ['Review Go memory profiling workshop', 'Refactor worker pool implementation'],
                },
              ].map((sess, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl border space-y-3"
                  style={{ background: cardBg, borderColor: cardBorder }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-base" style={{ color: textPrimary }}>{sess.title}</h4>
                      <p className="text-xs text-orange-500 font-medium">With {sess.mentor} • {sess.date}</p>
                    </div>
                    <span className="text-xs text-emerald-500 font-bold">Completed ✓</span>
                  </div>

                  <p className="text-xs leading-relaxed" style={{ color: textMuted }}>
                    {sess.notes}
                  </p>

                  <div className="space-y-1 pt-1">
                    <span className="text-[11px] font-mono text-orange-500 font-bold uppercase">Agreed Action Items:</span>
                    <ul className="list-disc list-inside text-xs space-y-0.5" style={{ color: textPrimary }}>
                      {sess.actionItems.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      {/* Booking Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg rounded-3xl border p-6 space-y-5 shadow-2xl relative"
            style={{ background: cardBg, borderColor: cardBorder }}
          >
            <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: cardBorder }}>
              <div>
                <span className="text-[10px] font-mono font-bold text-orange-500 uppercase tracking-wider">
                  SCHEDULE 1-ON-1 SESSION
                </span>
                <h3 className="text-lg font-bold" style={{ color: textPrimary }}>
                  Book with {selectedMentor.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMentor(null)}
                className="w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold"
                style={{ borderColor: cardBorder, color: textMuted }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookSession} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold" style={{ color: textPrimary }}>Select Available Slot:</label>
                <select
                  value={bookingSlot}
                  onChange={(e) => setBookingSlot(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none"
                  style={{ background: isBright ? '#FAF4EE' : '#140c07', borderColor: cardBorder, color: textPrimary }}
                >
                  <option value="Tomorrow at 4:30 PM EST">Tomorrow at 4:30 PM EST (Recommended)</option>
                  <option value="Friday at 2:00 PM EST">Friday at 2:00 PM EST</option>
                  <option value="Saturday at 11:00 AM EST">Saturday at 11:00 AM EST</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold" style={{ color: textPrimary }}>Session Goal / Agenda:</label>
                <textarea
                  rows={3}
                  placeholder="E.g., Review my System Architecture diagram for high-throughput Kafka ingestion..."
                  value={bookingTopic}
                  onChange={(e) => setBookingTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none"
                  style={{ background: isBright ? '#FAF4EE' : '#140c07', borderColor: cardBorder, color: textPrimary }}
                  required
                />
              </div>

              <div className="p-3 rounded-xl border flex items-center justify-between text-xs" style={{ background: isBright ? '#FFF3EB' : 'rgba(255,107,53,0.08)', borderColor: cardBorder }}>
                <span className="text-orange-500 font-semibold">Cost: {selectedMentor.creditsRequired} Credit</span>
                <span className="font-mono" style={{ color: textMuted }}>Remaining: 2 Credits</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedMentor(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border"
                  style={{ borderColor: cardBorder, color: textMuted }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl text-xs font-bold bg-[#FF6B35] text-white shadow-md"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
