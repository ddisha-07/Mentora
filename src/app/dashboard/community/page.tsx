'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

interface CommunityPost {
  id: string;
  author: {
    name: string;
    role: string;
    avatar: string;
    level: string;
    isCurrentUser?: boolean;
  };
  title: string;
  content: string;
  category: 'Question' | 'Showcase' | 'Discussion' | 'Resource' | 'Milestone';
  tags: string[];
  upvotes: number;
  hasUpvoted: boolean;
  commentsCount: number;
  createdAt: string;
}

const initialPosts: CommunityPost[] = [
  {
    id: 'p1',
    author: {
      name: 'Sarah Lin',
      role: 'Staff Backend Eng @ FinTech Cloud',
      avatar: 'SL',
      level: 'Lvl 8 Architect',
    },
    title: 'Architectural Postmortem: Surviving a 10x traffic surge on Kafka partition rebalancing',
    content:
      'During yesterday’s flash deployment, our consumer group rebalance caused a temporary throughput cliff. Here are the 3 config changes we made: switching to cooperative-sticky assignor, tuning max.poll.interval.ms, and decoupling consumer threads from message processors. Full telemetry chart attached.',
    category: 'Showcase',
    tags: ['#distributed-systems', '#kafka', '#resilience'],
    upvotes: 84,
    hasUpvoted: false,
    commentsCount: 23,
    createdAt: '2 hours ago',
  },
  {
    id: 'p2',
    author: {
      name: 'Marcus Vance',
      role: 'Tech Lead @ Distributed Labs',
      avatar: 'MV',
      level: 'Lvl 9 Grandmaster',
    },
    title: 'Why we transitioned from REST to gRPC for internal service communication: Latency & CPU benchmarks',
    content:
      'We benchmarked 100k req/sec between our authentication microservice and billing engine. Protobuf serialization cut payload sizes by 64% and decreased p99 latency from 42ms down to 8.4ms. However, debugging payloads in staging required proper Evans CLI setup.',
    category: 'Discussion',
    tags: ['#grpc', '#performance', '#microservices'],
    upvotes: 112,
    hasUpvoted: true,
    commentsCount: 41,
    createdAt: '5 hours ago',
  },
  {
    id: 'p3',
    author: {
      name: 'David Rossi',
      role: 'Full Stack Dev @ NextGen SaaS',
      avatar: 'DR',
      level: 'Lvl 7 Achiever',
    },
    title: 'Milestone: Passed the Mentora System Architecture Lvl 7 Evaluation with 94%! Here is what surprised me',
    content:
      'The evaluation is strictly timed and requires designing for Byzantine faults and dual-write mitigations. Big thanks to the Mentora study cohort for the mock sessions. My Skill Passport credential has been verified and minted!',
    category: 'Milestone',
    tags: ['#skill-passport', '#evaluation', '#milestone'],
    upvotes: 65,
    hasUpvoted: false,
    commentsCount: 18,
    createdAt: '1 day ago',
  },
  {
    id: 'p4',
    author: {
      name: 'Amina Traore',
      role: 'Platform Eng @ DataScale',
      avatar: 'AT',
      level: 'Lvl 6 Engineer',
    },
    title: 'Anyone deploying ArgoCD with multi-cluster ingress using Gateway API in Kubernetes 1.31?',
    content:
      'We are consolidating 3 regional EKS clusters under a single Gateway API topology. How are you handling cross-namespace secret references without compromising the least-privilege security policy?',
    category: 'Question',
    tags: ['#kubernetes', '#argocd', '#devops'],
    upvotes: 39,
    hasUpvoted: false,
    commentsCount: 12,
    createdAt: '1 day ago',
  },
];

export default function CommunityPage() {
  const { isBright } = useTheme();
  const [posts, setPosts] = useState<CommunityPost[]>(initialPosts);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Post composer state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<CommunityPost['category']>('Discussion');
  const [newTagInput, setNewTagInput] = useState('');
  const [composerExpanded, setComposerExpanded] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const bgPage = isBright ? '#FFF8F0' : '#111010';
  const cardBg = isBright ? '#FFFFFF' : '#1C1916';
  const cardBorder = isBright ? 'rgba(234,88,12,0.12)' : 'rgba(255,107,53,0.1)';
  const textPrimary = isBright ? '#1C1917' : '#FFF8F0';
  const textMuted = isBright ? '#78716C' : 'rgba(255,248,240,0.55)';

  const handleUpvote = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextUpvoted = !p.hasUpvoted;
          return {
            ...p,
            hasUpvoted: nextUpvoted,
            upvotes: nextUpvoted ? p.upvotes + 1 : p.upvotes - 1,
          };
        }
        return p;
      })
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const tagsArray = newTagInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
      .map((t) => (t.startsWith('#') ? t : `#${t}`));

    const createdPost: CommunityPost = {
      id: `post-${Date.now()}`,
      author: {
        name: 'Alex Johnson',
        role: 'Full-Stack Developer (You)',
        avatar: 'AJ',
        level: 'Lvl 7 Pro Learner',
        isCurrentUser: true,
      },
      title: newTitle.trim(),
      content: newContent.trim(),
      category: newCategory,
      tags: tagsArray.length > 0 ? tagsArray : ['#mentora', '#discussion'],
      upvotes: 1,
      hasUpvoted: true,
      commentsCount: 0,
      createdAt: 'Just now',
    };

    setPosts([createdPost, ...posts]);
    setNewTitle('');
    setNewContent('');
    setNewTagInput('');
    setComposerExpanded(false);
    setToastMessage('Your post has been published to the community feed!');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredPosts = posts.filter((p) => {
    if (activeFilter !== 'all' && p.category.toLowerCase() !== activeFilter.toLowerCase()) return false;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div
      id="community-page"
      className="min-h-screen flex"
      style={{ background: bgPage, fontFamily: 'var(--font-geist-sans), sans-serif' }}
    >
      <DashboardSidebar />

      <main className="flex-1 ml-[72px] xl:ml-[240px] min-h-screen overflow-y-auto px-4 sm:px-6 lg:px-10 py-8">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Toast Alert */}
          {toastMessage && (
            <div className="p-4 rounded-2xl bg-orange-950/90 border border-orange-500/70 text-orange-200 text-sm font-medium shadow-2xl flex items-center justify-between animate-in fade-in slide-in-from-top-3">
              <span className="flex items-center gap-2">💬 {toastMessage}</span>
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
                <span>👥 PEER COHORTS & NETWORK</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={{ color: textPrimary }}>
                Community & Squads
              </h1>
              <p className="text-sm max-w-2xl" style={{ color: textMuted }}>
                Connect with 12,000+ ambitious working professionals, ask tough architectural questions, and participate in peer review pods.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setComposerExpanded(!composerExpanded)}
                className="px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all active:scale-95 flex items-center gap-2 bg-gradient-to-r from-[#FF6B35] to-[#E85D2C] text-white hover:brightness-110 shadow-orange-500/20"
              >
                <span>✏️ Share with Community</span>
              </button>
            </div>
          </div>

          {/* Layout Grid: Feed + Right Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Feed & Composer (2 cols) */}
            <div className="lg:col-span-2 space-y-6">

              {/* Interactive Post Composer */}
              <div
                className="p-5 rounded-2xl border shadow-sm transition-all"
                style={{ background: cardBg, borderColor: cardBorder }}
              >
                {!composerExpanded ? (
                  <div
                    onClick={() => setComposerExpanded(true)}
                    className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer hover:border-orange-500/40 transition-colors"
                    style={{ background: isBright ? '#FAF4EE' : '#140c07', borderColor: cardBorder }}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF6B35] to-[#E85D2C] text-white text-xs font-bold flex items-center justify-center">
                      AJ
                    </div>
                    <span className="text-xs font-medium" style={{ color: textMuted }}>
                      Share an architectural challenge, question, or milestone with your cohort...
                    </span>
                  </div>
                ) : (
                  <form onSubmit={handleCreatePost} className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: cardBorder }}>
                      <span className="text-xs font-bold font-mono text-orange-500 uppercase tracking-wider">
                        Create New Discussion
                      </span>
                      <button
                        type="button"
                        onClick={() => setComposerExpanded(false)}
                        className="text-xs text-zinc-400 hover:text-zinc-200"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Post title (e.g. How to manage distributed transactions across microservices?)"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold border outline-none focus:ring-2 focus:ring-orange-500/40"
                        style={{ background: isBright ? '#FAF4EE' : '#140c07', borderColor: cardBorder, color: textPrimary }}
                        required
                      />

                      <textarea
                        rows={4}
                        placeholder="Provide details, code snippets, or context..."
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none focus:ring-2 focus:ring-orange-500/40"
                        style={{ background: isBright ? '#FAF4EE' : '#140c07', borderColor: cardBorder, color: textPrimary }}
                        required
                      />

                      <div className="flex flex-col sm:flex-row gap-3">
                        <select
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value as any)}
                          className="px-3 py-2 rounded-xl text-xs border outline-none"
                          style={{ background: isBright ? '#FAF4EE' : '#140c07', borderColor: cardBorder, color: textPrimary }}
                        >
                          <option value="Discussion">Discussion</option>
                          <option value="Question">Question</option>
                          <option value="Showcase">Showcase</option>
                          <option value="Milestone">Milestone</option>
                          <option value="Resource">Resource</option>
                        </select>

                        <input
                          type="text"
                          placeholder="Tags separated by commas (e.g. #kafka, #aws, #postgres)"
                          value={newTagInput}
                          onChange={(e) => setNewTagInput(e.target.value)}
                          className="flex-1 px-3.5 py-2 rounded-xl text-xs border outline-none"
                          style={{ background: isBright ? '#FAF4EE' : '#140c07', borderColor: cardBorder, color: textPrimary }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-[#FF6B35] to-[#E85D2C] text-white shadow-md hover:brightness-110 active:scale-95"
                      >
                        Publish Post
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Feed Filter Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                  {[
                    { id: 'all', label: 'All Feed' },
                    { id: 'discussion', label: 'Discussions' },
                    { id: 'question', label: 'Questions' },
                    { id: 'showcase', label: 'Showcases' },
                    { id: 'milestone', label: 'Milestones' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveFilter(tab.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                        activeFilter === tab.id
                          ? 'bg-[#FF6B35] text-white'
                          : isBright
                          ? 'bg-white text-zinc-600 border border-[#EAE0D5]'
                          : 'bg-[#18130e] text-zinc-400 border border-orange-950/60'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="relative min-w-[200px]">
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-1.5 pl-8 rounded-xl text-xs border outline-none"
                    style={{ background: cardBg, borderColor: cardBorder, color: textPrimary }}
                  />
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-orange-500">
                    🔍
                  </span>
                </div>
              </div>

              {/* Posts Stream */}
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="p-5 sm:p-6 rounded-2xl border transition-all duration-200 hover:border-orange-500/40 space-y-3.5"
                    style={{ background: cardBg, borderColor: cardBorder }}
                  >
                    {/* Author & Header */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-xs font-black text-white shadow-sm">
                          {post.author.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm" style={{ color: textPrimary }}>
                              {post.author.name}
                            </span>
                            {post.author.isCurrentUser && (
                              <span className="text-[10px] bg-orange-500 text-white px-1.5 py-0.2 rounded font-bold">
                                YOU
                              </span>
                            )}
                            <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-orange-500/10 text-orange-500 font-semibold border border-orange-500/20">
                              {post.author.level}
                            </span>
                          </div>
                          <p className="text-[11px]" style={{ color: textMuted }}>
                            {post.author.role} • {post.createdAt}
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full border bg-zinc-500/10 text-zinc-400 border-zinc-500/20">
                        {post.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-base leading-snug" style={{ color: textPrimary }}>
                        {post.title}
                      </h3>
                      <p className="text-xs leading-relaxed" style={{ color: textMuted }}>
                        {post.content}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {post.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-[11px] font-mono px-2 py-0.5 rounded border"
                          style={{
                            background: isBright ? '#FAF4EE' : '#140c07',
                            borderColor: cardBorder,
                            color: textMuted,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center gap-4 pt-3 border-t border-orange-500/10 text-xs">
                      <button
                        type="button"
                        onClick={() => handleUpvote(post.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold border transition-all active:scale-95 ${
                          post.hasUpvoted
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'hover:bg-orange-500/10'
                        }`}
                        style={{
                          borderColor: post.hasUpvoted ? '#FF6B35' : cardBorder,
                          color: post.hasUpvoted ? '#FFFFFF' : textPrimary,
                        }}
                      >
                        <span>▲</span>
                        <span>{post.upvotes} Upvotes</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => alert(`Opening comment drawer for: ${post.title}`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-semibold border transition-all hover:bg-orange-500/10"
                        style={{ borderColor: cardBorder, color: textMuted }}
                      >
                        <span>💬</span>
                        <span>{post.commentsCount} Comments</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => alert('Post link copied to clipboard!')}
                        className="ml-auto text-xs font-semibold hover:text-[#FF6B35] transition-colors"
                        style={{ color: textMuted }}
                      >
                        Share
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Cohorts & Contributors (1 col) */}
            <div className="space-y-6">

              {/* Active Study Cohorts */}
              <div
                className="p-5 rounded-2xl border space-y-4 shadow-sm"
                style={{ background: cardBg, borderColor: cardBorder }}
              >
                <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: cardBorder }}>
                  <span className="text-xs font-bold font-mono text-orange-500 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🔥</span> Active Study Cohorts
                  </span>
                  <span className="text-[10px] font-mono text-emerald-500 font-bold">LIVE</span>
                </div>

                <div className="space-y-3">
                  {[
                    { name: 'System Design & Distributed Labs', members: '142 members', tag: 'High Intensity', active: true },
                    { name: 'Kubernetes Production Ops', members: '88 members', tag: 'Bi-Weekly', active: false },
                    { name: 'TypeScript & Next.js 15 Internals', members: '64 members', tag: 'Async', active: false },
                  ].map((cohort, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl border flex items-center justify-between gap-2 transition-all hover:border-orange-500/40"
                      style={{ background: isBright ? '#FAF4EE' : '#140c07', borderColor: cardBorder }}
                    >
                      <div>
                        <h4 className="text-xs font-bold" style={{ color: textPrimary }}>{cohort.name}</h4>
                        <p className="text-[11px]" style={{ color: textMuted }}>{cohort.members}</p>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-orange-500/10 text-orange-500">
                        {cohort.tag}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => alert('Joined System Design study cohort!')}
                  className="w-full py-2.5 rounded-xl text-xs font-bold border text-center transition-all hover:bg-orange-500 hover:text-white hover:border-orange-500 active:scale-95"
                  style={{ borderColor: cardBorder, color: textPrimary }}
                >
                  Join Cohort Session →
                </button>
              </div>

              {/* Top Weekly Contributors */}
              <div
                className="p-5 rounded-2xl border space-y-4 shadow-sm"
                style={{ background: cardBg, borderColor: cardBorder }}
              >
                <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: cardBorder }}>
                  <span className="text-xs font-bold font-mono text-orange-500 uppercase tracking-wider flex items-center gap-1.5">
                    <span>🏆</span> Top Contributors
                  </span>
                  <Link href="/dashboard/leaderboard" className="text-[11px] text-orange-500 font-semibold hover:underline">
                    View All
                  </Link>
                </div>

                <div className="space-y-3">
                  {[
                    { rank: 1, name: 'Sarah Lin', role: 'Staff Backend', xp: '1,420 XP', badge: '👑' },
                    { rank: 2, name: 'Alex Rivera', role: 'Cloud Architect', xp: '1,290 XP', badge: '🥈' },
                    { rank: 3, name: 'Marcus Vance', role: 'Tech Lead', xp: '1,150 XP', badge: '🥉' },
                  ].map((user) => (
                    <div key={user.rank} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm">{user.badge}</span>
                        <div>
                          <p className="font-bold" style={{ color: textPrimary }}>{user.name}</p>
                          <p className="text-[10px]" style={{ color: textMuted }}>{user.role}</p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-orange-500">{user.xp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Community Guidelines Card */}
              <div
                className="p-5 rounded-2xl border space-y-2"
                style={{
                  background: isBright ? '#FFF3EB' : 'rgba(255,107,53,0.06)',
                  borderColor: cardBorder,
                }}
              >
                <h4 className="text-xs font-bold text-[#FF6B35] uppercase font-mono tracking-wider">
                  Mentora Peer Principles
                </h4>
                <p className="text-[11px] leading-relaxed" style={{ color: textMuted }}>
                  Zero fluff, concrete production learnings, respectful code review, and verifiable solutions. No promotional spam.
                </p>
              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
