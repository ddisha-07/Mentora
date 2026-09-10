'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

interface Message {
  id: string;
  sender: 'user' | 'kai';
  content: string;
  timestamp: string;
  codeSnippet?: string;
  codeLanguage?: string;
  suggestedFollowups?: string[];
}

export default function KaiPage() {
  const { isBright } = useTheme();
  const [activeMode, setActiveMode] = useState<'architect' | 'interviewer' | 'drill' | 'debug'>('architect');
  const [inputQuery, setInputQuery] = useState('');
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const bgPage = isBright ? '#FFF8F0' : '#111010';
  const cardBg = isBright ? '#FFFFFF' : '#1C1916';
  const cardBorder = isBright ? 'rgba(234,88,12,0.12)' : 'rgba(255,107,53,0.1)';
  const textPrimary = isBright ? '#1C1917' : '#FFF8F0';
  const textMuted = isBright ? '#78716C' : 'rgba(255,248,240,0.55)';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-init',
      sender: 'kai',
      content:
        'Hello Alex! I am **Kai**, your personal engineering companion at Mentora.\n\nI have loaded your context: you are targeting **Senior Cloud Architect**, currently progressing through **Level 4 of the Full-Stack Cloud Architect Journey**, and have **5 cryptographically verified competencies** on your Skill Passport.\n\nHow can I accelerate your learning today? Pick a mode above or ask me any system design or code question below.',
      timestamp: 'Just now',
      suggestedFollowups: [
        'Review my distributed idempotency key pattern for Stripe webhooks',
        'Run a 15-minute mock interview for a Staff Cloud Architect loop',
        'Generate a diagnostic evaluation drill on Redis memory eviction policies',
      ],
    },
  ]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsSynthesizing(true);

    setTimeout(() => {
      let replyContent = '';
      let snippet: string | undefined;
      let language: string | undefined;
      let followups: string[] = [];

      const qLower = query.toLowerCase();

      if (qLower.includes('idempotenc') || qLower.includes('webhook') || qLower.includes('stripe')) {
        replyContent =
          '### Distributed Idempotency Key Architecture\n\nWhen handling high-volume webhooks with at-least-once delivery semantics, the recommended architecture uses a **Transactional State Machine with Redis distributed locks and a PostgreSQL unique constraint fallback**:\n\n1. **Locking**: Acquire an atomic lock in Redis with a 10s TTL: `SET key uuid NX PX 10000`.\n2. **State Check**: Query the `idempotency_keys` table for existing processed status.\n3. **Atomic Execution**: Wrap business logic in an engine transaction.\n4. **Commit & Cache Result**: Store status `SUCCESS` and cached response body to immediately return on duplicate replay.';
        snippet = `// TypeScript / Next.js Idempotent Pipeline Handler
export async function handleIdempotentEvent(event: WebhookEvent) {
  const lockKey = \`lock:idempotency:\${event.idempotencyKey}\`;
  const acquired = await redis.set(lockKey, 'locked', 'NX', 'EX', 10);
  
  if (!acquired) {
    // Concurrent duplicate request in flight
    return { status: 409, message: 'Event is already being processed' };
  }

  try {
    const existing = await db.query.idempotencyKeys.findFirst({
      where: eq(idempotencyKeys.key, event.idempotencyKey),
    });

    if (existing?.status === 'COMPLETED') {
      return { status: 200, data: existing.cachedResponse };
    }

    const result = await executeBusinessLogic(event);
    await db.insert(idempotencyKeys).values({
      key: event.idempotencyKey,
      status: 'COMPLETED',
      cachedResponse: result,
    });

    return { status: 200, data: result };
  } finally {
    await redis.del(lockKey);
  }
}`;
        language = 'typescript';
        followups = [
          'How do we handle network partitions during the Redis lock acquisition?',
          'What is the difference between client-generated vs server-generated idempotency keys?',
        ];
      } else if (qLower.includes('mock') || qLower.includes('interview') || qLower.includes('staff')) {
        replyContent =
          '### Staff Cloud Architect Mock Loop: Question 1\n\n> **Scenario**: "You are designing a globally distributed telemetry ingestion pipeline processing 5,000,000 events/second with a p99 ingestion latency requirement under 50ms and 99.999% availability."\n\n**Please address the following architectural pillars:**\n1. **Ingress & Edge Routing**: How do you avoid cross-ocean roundtrips?\n2. **Buffering & Backpressure**: How do you handle sudden 10x traffic spikes without dropping packets?\n3. **Storage Tiering**: Hot vs Warm vs Cold storage partitioning strategy.\n\nTake your time to structure your answer, or type your high-level architecture breakdown below.';
        followups = [
          'Use Anycast DNS + Edge API Gateways with Kafka partition buffering',
          'Explain storage compaction using ClickHouse + S3 Parquet iceberg tiers',
        ];
      } else if (qLower.includes('drill') || qLower.includes('quiz') || qLower.includes('redis')) {
        replyContent =
          '### Diagnostic Drill: Redis Memory Eviction & Connection Tuning\n\n**Question**: In an enterprise Redis cluster under 95% memory utilization configured with `maxmemory-policy allkeys-lru`, why might keys with low hit rates still consume memory unexpectedly, and how does the `volatile-lru` policy differ?\n\n**Options:**\n- **A)** Redis uses an exact doubly-linked list for true O(1) LRU eviction.\n- **B)** Redis uses an approximated LRU sample algorithm (`maxmemory-samples`, default 5) to save memory, and `volatile-lru` only evicts keys with an explicit TTL expiration.\n- **C)** `allkeys-lru` flushes the RDB snapshot to disk every 10 seconds.\n- **D)** Connection buffers are counted outside the `maxmemory` threshold.\n\nWhich option is correct? (Reply A, B, C, or D)';
        followups = ['Answer: B (Approximated sampling + TTL policy)', 'Explain how Redis 7.0 improves LRU with active defragmentation'];
      } else {
        replyContent =
          `I analyzed your prompt: **"${query}"**.\n\nIn high-scale enterprise architectures, we evaluate this across **Latency**, **Fault Tolerance**, and **Cost Efficiency**.\n\nFor your role progression toward **Senior Cloud Architect**, mastering these trade-offs will help you ace Level 5 of your roadmap. Would you like me to generate a concrete reference implementation, run an architectural evaluation, or produce a diagnostic drill?`;
        followups = [
          'Generate a TypeScript reference implementation',
          'Audit trade-offs between Latency vs Consistency',
          'Create a 3-question diagnostic evaluation',
        ];
      }

      const kaiMsg: Message = {
        id: `kai-${Date.now()}`,
        sender: 'kai',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        codeSnippet: snippet,
        codeLanguage: language,
        suggestedFollowups: followups,
      };

      setMessages((prev) => [...prev, kaiMsg]);
      setIsSynthesizing(false);
    }, 1100);
  };

  return (
    <div
      id="kai-page"
      className="min-h-screen flex"
      style={{ background: bgPage, fontFamily: 'var(--font-geist-sans), sans-serif' }}
    >
      <DashboardSidebar />

      <main className="flex-1 ml-[72px] xl:ml-[240px] min-h-screen overflow-y-auto px-4 sm:px-6 lg:px-10 py-8">
        <div className="max-w-6xl mx-auto space-y-7">

          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-orange-500/10 pb-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-orange-500/10 text-[#FF6B35] border border-orange-500/20">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                <span>KAI INTELLIGENCE v2.4 • CONTEXT-AWARE</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight flex items-center gap-3" style={{ color: textPrimary }}>
                <span>Kai</span>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm">
                  AI COMPANION
                </span>
              </h1>
              <p className="text-sm max-w-2xl" style={{ color: textMuted }}>
                Your 24/7 personal engineering mentor, architectural reasoning engine, and diagnostic drill partner tuned to your career vectors.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setMessages([
                    {
                      id: `init-${Date.now()}`,
                      sender: 'kai',
                      content: 'Session refreshed! What architectural question or concept would you like to tackle next, Alex?',
                      timestamp: 'Just now',
                      suggestedFollowups: [
                        'Review my distributed idempotency key pattern',
                        'Start a Staff Cloud Architect mock loop',
                        'Generate a diagnostic evaluation drill on Redis',
                      ],
                    },
                  ]);
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all hover:bg-orange-500/10 active:scale-95"
                style={{ borderColor: cardBorder, color: textMuted }}
              >
                Clear History
              </button>
              <Link
                href="/dashboard/passport"
                className="px-4 py-2 rounded-xl text-xs font-bold border transition-all hover:bg-orange-500/10 active:scale-95"
                style={{ borderColor: cardBorder, color: textPrimary }}
              >
                View Synced Passport 🛡️
              </Link>
            </div>
          </div>

          {/* Mode Selector Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'architect', label: 'Architecture & RFC', icon: '🏛️', desc: 'System design & distributed trade-offs' },
              { id: 'interviewer', label: 'Staff Mock Loop', icon: '🎯', desc: 'Realistic tech loops with evaluation criteria' },
              { id: 'drill', label: 'Diagnostic Drills', icon: '⚡', desc: 'Micro-assessments targeting 70% threshold' },
              { id: 'debug', label: 'Code & Profiling', icon: '🔍', desc: 'Latency, memory leaks & compiler safety' },
            ].map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setActiveMode(mode.id as any)}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-200 ${
                  activeMode === mode.id
                    ? 'border-orange-500 bg-orange-500/10 shadow-md shadow-orange-500/10 ring-1 ring-orange-500/40'
                    : 'hover:border-orange-500/30'
                }`}
                style={{
                  background: activeMode === mode.id ? undefined : cardBg,
                  borderColor: activeMode === mode.id ? '#FF6B35' : cardBorder,
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{mode.icon}</span>
                  <span className="text-xs font-bold" style={{ color: activeMode === mode.id ? '#FF6B35' : textPrimary }}>
                    {mode.label}
                  </span>
                </div>
                <p className="text-[11px] mt-1 line-clamp-1" style={{ color: textMuted }}>
                  {mode.desc}
                </p>
              </button>
            ))}
          </div>

          {/* Context Ingestion Indicator */}
          <div
            className="p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            style={{
              background: isBright ? '#FFF6EE' : 'rgba(255,107,53,0.06)',
              borderColor: 'rgba(255,107,53,0.2)',
            }}
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-semibold" style={{ color: textPrimary }}>
                Learner Profile Synchronized:
              </span>
              <span className="font-mono text-orange-500 font-bold">
                Alex Johnson • Senior Cloud Architect (Lvl 7)
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px]" style={{ color: textMuted }}>
              <span>Active Track: <strong>Full-Stack Cloud Architect</strong></span>
              <span>•</span>
              <span>5 Verified Skills Loaded</span>
            </div>
          </div>

          {/* Chat Feed */}
          <div
            className="rounded-3xl border p-5 sm:p-6 shadow-xl space-y-6 flex flex-col min-h-[500px]"
            style={{ background: cardBg, borderColor: cardBorder }}
          >
            <div className="flex-1 space-y-5 overflow-y-auto max-h-[520px] pr-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'kai' && (
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-md">
                      ✨
                    </div>
                  )}

                  <div className={`space-y-3 max-w-2xl ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`p-5 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-[#FF6B35] text-white rounded-tr-none'
                          : isBright
                          ? 'bg-[#FAF4EE] border border-[#EAE0D5] text-[#1C1917] rounded-tl-none'
                          : 'bg-[#18120d] border border-orange-950/80 text-zinc-200 rounded-tl-none'
                      }`}
                    >
                      <div className="whitespace-pre-line prose-sm">{msg.content}</div>

                      {/* Code Snippet Box */}
                      {msg.codeSnippet && (
                        <div className="mt-3 rounded-2xl overflow-hidden border border-orange-500/20 bg-black/80 text-zinc-200 text-xs font-mono">
                          <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-white/5">
                            <span className="text-[10px] uppercase font-bold text-orange-400">
                              {msg.codeLanguage || 'code'}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard?.writeText(msg.codeSnippet!);
                                alert('Code copied to clipboard!');
                              }}
                              className="text-[10px] text-zinc-400 hover:text-white transition-colors"
                            >
                              Copy Code
                            </button>
                          </div>
                          <pre className="p-4 overflow-x-auto text-[11px] leading-relaxed">
                            <code>{msg.codeSnippet}</code>
                          </pre>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[10px] opacity-60 mt-2 font-mono">
                        <span>{msg.sender === 'kai' ? 'Kai Autonomous Engine' : 'You'}</span>
                        <span>{msg.timestamp}</span>
                      </div>
                    </div>

                    {/* Follow-up Prompts */}
                    {msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-mono text-orange-500 uppercase tracking-wider font-bold block">
                          Suggested Deep Dives:
                        </span>
                        <div className="flex items-center gap-2 flex-wrap">
                          {msg.suggestedFollowups.map((f, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleSendMessage(f)}
                              className="text-xs px-3 py-1.5 rounded-xl border transition-all hover:border-orange-500 hover:text-[#FF6B35] text-left"
                              style={{
                                background: isBright ? '#FAF4EE' : '#140c07',
                                borderColor: cardBorder,
                                color: textMuted,
                              }}
                            >
                              {f} →
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isSynthesizing && (
                <div className="flex gap-3 items-center text-xs text-orange-500 font-mono py-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-500 flex items-center justify-center font-bold text-xs animate-spin">
                    ✨
                  </div>
                  <span>Kai is evaluating architecture patterns & formulating telemetry response...</span>
                </div>
              )}
            </div>

            {/* Input Composer Bar */}
            <div className="pt-3 border-t" style={{ borderColor: cardBorder }}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask Kai: architecture reviews, distributed system patterns, mock questions..."
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-2xl text-xs border outline-none transition-all focus:ring-2 focus:ring-orange-500/40"
                  style={{
                    background: isBright ? '#FAF4EE' : '#140c07',
                    borderColor: cardBorder,
                    color: textPrimary,
                  }}
                />
                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isSynthesizing}
                  className="px-6 py-3 rounded-2xl text-xs font-bold bg-gradient-to-r from-[#FF6B35] to-[#E85D2C] text-white shadow-md hover:brightness-110 disabled:opacity-50 transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <span>Consult Kai</span>
                  <span>→</span>
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
